import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

export const runtime = "nodejs";

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  console.log("🔥 Stripe webhook hit");

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Missing Stripe signature");
    // NEVER return 400 to Stripe
    return new Response("OK", { status: 200 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Signature verification failed:", err.message);
    return new Response("OK", { status: 200 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await pool.query(
        `
        INSERT INTO orders (
          stripe_session_id,
          payment_intent,
          amount_total,
          currency,
          status,
          email
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (stripe_session_id) DO NOTHING
        `,
        [
          session.id,
          session.payment_intent,
          session.amount_total,
          session.currency,
          session.status,
          session.customer_details?.email ??
            session.customer_email ??
            null,
        ]
      );

      console.log("✅ Order inserted:", session.id);
    } catch (dbErr: any) {
      console.error("❌ Database insert failed:", dbErr.message);
      // Return 500 so Stripe retries
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}