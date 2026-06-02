import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getGoalById, getPart, type Frequency } from "@/lib/goals";
import { feeFor, stripeRecurring, isRecurring } from "@/lib/donation";

const getStripe = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

interface CheckoutBody {
  goalId: string;
  partId?: string;
  amountAud: number; // base gift amount, per period for recurring
  frequency: Frequency;
  quantity?: number; // sponsor-a-child only
  coverFee?: boolean;
}

const VALID_FREQUENCIES: Frequency[] = ["once", "weekly", "fortnightly", "monthly"];

export async function POST(req: NextRequest) {
  try {
    // Fail clearly (not with a cryptic Stripe SDK error) if the server is
    // missing its Stripe credentials — e.g. env vars not set on the host.
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[checkout] STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Donations are temporarily unavailable. Please try again shortly or contact us." },
        { status: 503 }
      );
    }

    const body = (await req.json()) as CheckoutBody;
    const { goalId, partId, amountAud, frequency, quantity, coverFee } = body;

    const goal = getGoalById(goalId);
    if (!goal) {
      return NextResponse.json({ error: "Unknown donation goal" }, { status: 400 });
    }
    if (!VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json({ error: "Invalid frequency" }, { status: 400 });
    }
    if (typeof amountAud !== "number" || amountAud < 1 || amountAud > 50000) {
      return NextResponse.json(
        { error: "Amount must be between A$1 and A$50,000. For larger gifts, contact us directly." },
        { status: 400 }
      );
    }

    // Resolve the human-readable label (goal, or goal → part for bundles).
    const part = partId ? getPart(goal, partId) : undefined;
    if (partId && !part) {
      return NextResponse.json({ error: "Unknown project part" }, { status: 400 });
    }
    // Product label shown in Stripe dashboard, receipts and invoices.
    const label = part
      ? `POH-${goal.title}: ${part.title}`
      : `POH-${goal.title}`;

    // Bank/card statement descriptor — alphanumerics + spaces only, max 22 chars.
    const statementDescriptor = `POH ${goal.title}`
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 22);

    // Recompute the fee server-side — never trust a client-sent total.
    const base = Math.round(amountAud * 100) / 100;
    const fee = coverFee ? feeFor(base) : 0;
    const totalAud = Math.round((base + fee) * 100) / 100;
    const amountCents = Math.round(totalAud * 100);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const cancelUrl = part
      ? `${siteUrl}/donate/${goalId}?part=${partId}`
      : `${siteUrl}/donate/${goalId}`;

    const metadata: Record<string, string> = {
      goal_id: goalId,
      mission: "kapoeta",
      cover_fee: coverFee ? "yes" : "no",
    };
    if (partId) metadata.part_id = partId;
    if (quantity && quantity > 1) metadata.quantity = String(quantity);

    const stripe = getStripe();
    let session: Stripe.Checkout.Session;

    if (!isRecurring(frequency)) {
      // One-off payment
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "aud",
              unit_amount: amountCents,
              product_data: {
                name: label,
                description: "Pathways of Hope — Kapoeta Children's Shelter",
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: { metadata, statement_descriptor: statementDescriptor },
        success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata,
      });
    } else {
      // Recurring — weekly / fortnightly (week×2) / monthly
      const recurring = stripeRecurring(frequency)!;
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "aud",
              unit_amount: amountCents,
              recurring,
              product_data: {
                name: label,
                description: "Pathways of Hope — recurring gift to Kapoeta",
              },
            },
            quantity: 1,
          },
        ],
        subscription_data: { metadata },
        success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
