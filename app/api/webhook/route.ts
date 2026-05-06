import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[webhook] received event:", event.type, event.id);

  // Handle events — add revalidation logic here when you add a database/cache
  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log("[webhook] payment succeeded:", pi.id, "goal:", pi.metadata?.goal_id, "amount:", pi.amount_received);
      // TODO: trigger revalidation of /api/totals when you move to on-demand ISR
      break;
    }
    case "invoice.paid": {
      const inv = event.data.object as Stripe.Invoice;
      console.log("[webhook] invoice paid:", inv.id, "amount:", inv.amount_paid);
      break;
    }
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[webhook] checkout completed:", session.id, "goal:", session.metadata?.goal_id);
      break;
    }
    default:
      console.log("[webhook] unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
