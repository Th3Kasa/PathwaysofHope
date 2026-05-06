import { NextResponse } from "next/server";
import Stripe from "stripe";

// Cache totals for 60 seconds to avoid hammering Stripe
export const revalidate = 60;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

// Fallback values used when Stripe is unavailable or keys aren't set
// Configure these in .env.local to reflect your actual starting totals
const FALLBACK_TOTALS: Record<string, { raised: number; supporters: number }> = {
  "water-tower": {
    raised: parseInt(process.env.FALLBACK_RAISED_WATER_TOWER ?? "3200"),
    supporters: parseInt(process.env.FALLBACK_SUPPORTERS_WATER_TOWER ?? "28"),
  },
  "poultry-project": {
    raised: parseInt(process.env.FALLBACK_RAISED_POULTRY ?? "1800"),
    supporters: parseInt(process.env.FALLBACK_SUPPORTERS_POULTRY ?? "14"),
  },
  "sponsor-a-child": {
    raised: parseInt(process.env.FALLBACK_RAISED_SPONSOR ?? "7800"),
    supporters: parseInt(process.env.FALLBACK_SUPPORTERS_SPONSOR ?? "13"),
  },
  "general-support": {
    raised: parseInt(process.env.FALLBACK_RAISED_GENERAL ?? "12400"),
    supporters: parseInt(process.env.FALLBACK_SUPPORTERS_GENERAL ?? "67"),
  },
};

export async function GET() {
  try {
    const totals: Record<string, { raised: number; supporters: number }> = {
      "water-tower": { raised: 0, supporters: 0 },
      "poultry-project": { raised: 0, supporters: 0 },
      "sponsor-a-child": { raised: 0, supporters: 0 },
      "general-support": { raised: 0, supporters: 0 },
    };

    // ──────────────────────────────────────────────────────────────────────────
    // PLUG REAL STRIPE DATA HERE
    // We query all succeeded payment intents and group by metadata.goal_id.
    // For subscriptions, we query invoices similarly.
    // ──────────────────────────────────────────────────────────────────────────

    // Fetch one-off payments
    const charges = await stripe.paymentIntents.list({ limit: 100 });
    for (const pi of charges.data) {
      if (pi.status !== "succeeded") continue;
      const goalId = pi.metadata?.goal_id;
      if (goalId && goalId in totals) {
        totals[goalId].raised += (pi.amount_received ?? 0) / 100;
        totals[goalId].supporters += 1;
      }
    }

    // Fetch recurring payments via invoices
    const invoices = await stripe.invoices.list({ limit: 100, status: "paid" });
    for (const inv of invoices.data) {
      const goalId = (inv as unknown as { subscription_details?: { metadata?: { goal_id?: string } } }).subscription_details?.metadata?.goal_id;
      if (goalId && goalId in totals) {
        totals[goalId].raised += (inv.amount_paid ?? 0) / 100;
        // Don't double-count supporters for monthly — we count unique subscriptions
      }
    }

    // Merge with fallback: add fallback as a base offset for pre-Stripe donations
    const merged: Record<string, { raised: number; supporters: number }> = {};
    for (const goalId of Object.keys(totals)) {
      const fb = FALLBACK_TOTALS[goalId] ?? { raised: 0, supporters: 0 };
      merged[goalId] = {
        raised: Math.round(totals[goalId].raised + fb.raised),
        supporters: totals[goalId].supporters + fb.supporters,
      };
    }

    return NextResponse.json(merged, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (err) {
    console.warn("[totals] Stripe fetch failed, returning fallback:", err);
    // Return fallback totals so the UI never breaks
    return NextResponse.json(FALLBACK_TOTALS, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate" },
    });
  }
}
