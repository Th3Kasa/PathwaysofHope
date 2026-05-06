import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

const GOAL_LABELS: Record<string, string> = {
  "water-tower": "Water Tower & Solar Pump — Kapoeta",
  "chicken-coop": "Chicken Coop & Layers — Kapoeta",
  "sponsor-a-child": "Sponsor a Child — Kapoeta",
  "general-support": "General Annual Support — Kapoeta",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      goalId,
      amountAud,
      mode,
    }: { goalId: string; amountAud: number; mode: "payment" | "subscription" } = body;

    if (!goalId || !amountAud || !mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (amountAud < 1 || amountAud > 50000) {
      return NextResponse.json({ error: "Amount must be between $1 and $50,000 AUD" }, { status: 400 });
    }

    const label = GOAL_LABELS[goalId] ?? `Pathways of Hope — ${goalId}`;
    const amountCents = Math.round(amountAud * 100);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let session: Stripe.Checkout.Session;

    if (mode === "payment") {
      // One-off payment
      session = await getStripe().checkout.sessions.create({
        mode: "payment",
        currency: "aud",
        line_items: [
          {
            price_data: {
              currency: "aud",
              unit_amount: amountCents,
              product_data: {
                name: label,
                description: "Pathways of Hope — 100% reaches the children",
                images: [`${siteUrl}/images/kapoeta/logo.jpg`],
                metadata: { goal_id: goalId },
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          // metadata on payment intent so Stripe charges carry goal_id
          metadata: { goal_id: goalId, mission: "kapoeta" },
        },
        success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/donate?goal=${goalId}`,
        metadata: { goal_id: goalId, mission: "kapoeta" },
      });
    } else {
      // Monthly subscription — create a price on the fly
      // In production you can pre-create prices per goal and reference them by env var
      // e.g. STRIPE_PRICE_WATER_TOWER=price_xxx  STRIPE_PRICE_GENERAL=price_yyy
      const price = await getStripe().prices.create({
        currency: "aud",
        unit_amount: amountCents,
        recurring: { interval: "month" },
        product_data: {
          name: label,
          metadata: { goal_id: goalId },
        },
        metadata: { goal_id: goalId },
      });

      session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: price.id, quantity: 1 }],
        subscription_data: {
          metadata: { goal_id: goalId, mission: "kapoeta" },
        },
        success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/donate?goal=${goalId}`,
        metadata: { goal_id: goalId, mission: "kapoeta" },
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
