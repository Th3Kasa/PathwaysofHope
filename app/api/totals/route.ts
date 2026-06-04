import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { KAPOETA_GOALS } from "@/lib/goals";

// Cache totals for 60 seconds to avoid hammering Stripe.
export const revalidate = 60;

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

type Totals = Record<string, { raised: number; supporters: number }>;

function emptyTotals(): Totals {
  const t: Totals = {};
  for (const g of KAPOETA_GOALS) t[g.id] = { raised: 0, supporters: 0 };
  return t;
}

export async function GET() {
  const totals = emptyTotals();

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

    // Manual adjustments from the admin panel (offline/bank-transfer gifts).
    try {
      const store = await cookies();
      const raw = store.get("poh_adjustments")?.value;
      if (raw) {
        const adjustments = JSON.parse(Buffer.from(raw, "base64").toString()) as Record<string, number>;
        for (const [id, amount] of Object.entries(adjustments)) {
          if (id in totals && typeof amount === "number" && amount > 0) {
            totals[id].raised += amount;
          }
        }
      }
    } catch {
      // Ignore malformed adjustment cookie — never inflate on error.
    }

    // Round raised figures.
    for (const id of Object.keys(totals)) {
      totals[id].raised = Math.round(totals[id].raised);
    }

    return NextResponse.json(totals, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (err) {
    console.warn("[totals] Stripe fetch failed, returning zeroed totals:", err);
    // Never inflate figures — on failure, everything reads A$0.
    return NextResponse.json(emptyTotals(), {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate" },
    });
  }
}
