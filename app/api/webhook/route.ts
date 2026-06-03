import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendDonationReceipt } from "@/lib/email";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const name = session.customer_details?.name ?? "Donor";
      const goalId = session.metadata?.goal_id ?? "";
      const isRecurring = session.mode === "subscription";
      const freq = session.metadata?.frequency;

      console.log("[webhook] checkout completed:", session.id, "goal:", goalId);

      if (email && session.amount_total) {
        await sendDonationReceipt({
          to: email,
          donorName: name,
          amountCents: session.amount_total,
          goalId,
          referenceId: session.id,
          dateTs: session.created,
          isRecurring,
          frequency: freq,
        });
      }
      break;
    }

    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log("[webhook] payment succeeded:", pi.id, "goal:", pi.metadata?.goal_id, "amount:", pi.amount_received);
      break;
    }

    case "invoice.paid": {
      const inv = event.data.object as Stripe.Invoice;
      // Skip first invoice — already handled by checkout.session.completed
      if ((inv as unknown as { billing_reason?: string }).billing_reason === "subscription_create") break;

      const email = inv.customer_email;
      const name = (inv as unknown as { customer_name?: string }).customer_name ?? "Donor";
      const amountPaid = inv.amount_paid;

      console.log("[webhook] invoice paid:", inv.id, "amount:", amountPaid);

      if (email && amountPaid) {
        // For renewal receipts, goal title comes from the invoice description line
        const lineDescription =
          (inv.lines?.data?.[0]?.description ?? inv.description ?? "Recurring gift").replace(/^POH-/, "");
        await sendDonationReceipt({
          to: email,
          donorName: name,
          amountCents: amountPaid,
          goalId: lineDescription,
          referenceId: inv.id ?? "",
          dateTs: typeof inv.created === "number" ? inv.created : Math.floor(Date.now() / 1000),
          isRecurring: true,
        });
      }
      break;
    }

    default:
      console.log("[webhook] unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
