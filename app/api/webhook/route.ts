import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { pool } from "../../lib/db";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

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
    console.error("❌ Webhook verification failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // ✅ Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Safety checks
    if (!session.payment_intent) {
      console.error("❌ Missing payment_intent on session", session.id);
      return NextResponse.json({ received: true });
    }

    // 🔥 Fetch PaymentIntent (source of truth)
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string
    );

    const amountTotal = paymentIntent.amount; // ALWAYS present
    const currency = paymentIntent.currency;
    const email = session.customer_details?.email ?? null;

    await pool.query(
      `
      INSERT INTO orders (
        stripe_session_id,
        payment_intent,
        email,
        amount_total,
        currency
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (stripe_session_id) DO NOTHING
      `,
      [
        session.id,
        paymentIntent.id,
        email,
        amountTotal,
        currency,
      ]
    );

    console.log("✅ Order saved:", session.id);
  }

  return NextResponse.json({ received: true });
}