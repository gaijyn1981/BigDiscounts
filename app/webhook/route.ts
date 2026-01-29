import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "@neondatabase/serverless";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type !== "checkout.session.completed") {
  console.log("Ignoring Stripe event:", event.type);
  return NextResponse.json({ ignored: true });
}
    console.log("✅ Stripe event received:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err.message);
    return new NextResponse("Webhook error", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const values = [
    session.id,
    session.payment_intent,
    session.amount_total ?? 0,
    session.currency ?? "gbp",
    "paid",
    session.customer_details?.email ?? null,
  ];

  try {
    console.log("📝 Inserting order:", values);

    await pool.query(
      `
      INSERT INTO orders (
        stripe_session_id,
        payment_intent_id,
        amount,
        currency,
        status,
        customer_email
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (stripe_session_id) DO NOTHING;
      `,
      values
    );

    console.log("✅ Order inserted into Neon");
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Database insert failed:", err);
    return new NextResponse("DB error", { status: 500 });
  }
}