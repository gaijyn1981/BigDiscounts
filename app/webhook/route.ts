import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "@neondatabase/serverless";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await pool.query(
        `
        INSERT INTO orders (
          stripe_session_id,
          payment_intent_id,
          amount,
          currency,
          status,
          customer_email
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (stripe_session_id) DO NOTHING
        `,
        [
          session.id,
          session.payment_intent,
          session.amount_total,
          session.currency,
          "paid",
          session.customer_details?.email,
        ]
      );
    } catch (dbError) {
      console.error("Database insert failed:", dbError);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}