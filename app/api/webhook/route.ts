import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse("Webhook error", { status: 400 });
  }

  /* ======================================================
     PAYMENT SUCCEEDED
  ====================================================== */
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    // DB-level + app-level duplicate protection
    const existing = await sql`
      SELECT id FROM orders
      WHERE payment_intent = ${intent.id}
      LIMIT 1;
    `;

    if ((existing.rowCount ?? 0) > 0) {
      console.log("Duplicate payment ignored:", intent.id);
      return NextResponse.json({ received: true });
    }

    await sql`
      INSERT INTO orders (
        customer_email,
        amount_total,
        currency,
        status,
        payment_intent
      ) VALUES (
        ${intent.receipt_email},
        ${intent.amount_received},
        ${intent.currency},
        'complete',
        ${intent.id}
      );
    `;

    console.log("Order inserted:", intent.id);
  }

  /* ======================================================
     REFUND HANDLING
  ====================================================== */
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    const paymentIntentId =
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id;

    if (!paymentIntentId) {
      console.warn("Refund without payment_intent, skipping");
      return NextResponse.json({ received: true });
    }

    await sql`
      UPDATE orders
      SET
        status = 'refunded',
        refund_amount = ${charge.amount_refunded},
        refunded_at = NOW()
      WHERE payment_intent = ${paymentIntentId};
    `;

    console.log("Order refunded:", paymentIntentId);
  }

  /* ======================================================
     PAYMENT CANCELLED (EDGE CASES)
  ====================================================== */
  if (event.type === "payment_intent.canceled") {
    const intent = event.data.object as Stripe.PaymentIntent;

    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE payment_intent = ${intent.id};
    `;

    console.log("Payment cancelled:", intent.id);
  }

  return NextResponse.json({ received: true });
}