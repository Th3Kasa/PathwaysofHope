import { NextResponse } from "next/server";
import Stripe from "stripe";
import { KAPOETA_GOALS } from "@/lib/goals";
import { getConfig, type AdminConfig } from "@/lib/admin/store";
import { getEffectiveGoals } from "@/lib/admin/goals-helper";

// Cache totals for 60 seconds to avoid hammering Stripe.
export const revalidate = 60;

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

type Totals = Record<string, { raised: number; supporters: number }>;

function emptyTotalsFor(config: AdminConfig | null): Totals {
  const t: Totals = {};
  const goals = config ? getEffectiveGoals(config) : KAPOETA_GOALS;
  for (const g of goals) t[g.id] = { raised: 0, supporters: 0 };
  return t;
}

/** Add manually-recorded offline gifts: each entry is +amount and +1 supporter. */
function applyManualDonations(totals: Totals, config: AdminConfig | null) {
  if (!config?.manualDonations) return;
  for (const d of config.manualDonations) {
    if (d.goalId in totals && typeof d.amount === "number" && d.amount > 0) {
      totals[d.goalId].raised += d.amount;
      totals[d.goalId].supporters += 1;
    }
  }
}

export async function GET() {
  let config: AdminConfig | null = null;
  try {
    config = await getConfig();
  } catch {
    config = null;
  }

  const totals = emptyTotalsFor(config);

  try {
    const stripe = getStripe();

    // One-off payments
    const charges = await stripe.paymentIntents.list({ limit: 100 });
    for (const pi of charges.data) {
      if (pi.status !== "succeeded") continue;
      const goalId = pi.metadata?.goal_id;
      if (goalId && goalId in totals) {
        totals[goalId].raised += (pi.amount_received ?? 0) / 100;
        totals[goalId].supporters += 1;
      }
    }

    // Recurring payments via paid invoices
    const invoices = await stripe.invoices.list({ limit: 100, status: "paid" });
    for (const inv of invoices.data) {
      const goalId = (
        inv as unknown as { subscription_details?: { metadata?: { goal_id?: string } } }
      ).subscription_details?.metadata?.goal_id;
      if (goalId && goalId in totals) {
        totals[goalId].raised += (inv.amount_paid ?? 0) / 100;
        // Supporters counted from the originating payment, not each invoice.
      }
    }

    // Manually-recorded offline gifts (bank transfer / direct debit) from admin.
    applyManualDonations(totals, config);

    // Round raised figures.
    for (const id of Object.keys(totals)) {
      totals[id].raised = Math.round(totals[id].raised);
    }

    return NextResponse.json(totals, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (err) {
    console.warn("[totals] Stripe fetch failed, returning manual totals only:", err);
    // Stripe failed — still reflect manually-recorded offline gifts so the
    // admin's entries appear on the bars even if Stripe is unreachable.
    const fallback = emptyTotalsFor(config);
    applyManualDonations(fallback, config);
    for (const id of Object.keys(fallback)) {
      fallback[id].raised = Math.round(fallback[id].raised);
    }
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate" },
    });
  }
}
