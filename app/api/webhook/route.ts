import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

export const runtime = "nodejs";

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Neon / Postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  // 1️⃣ Read raw body (REQUIRED for Stripe)
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new Response("OK", { status: 200 });
  }

  // 2️⃣ Verify Stripe signature
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

  // 3️⃣ Handle relevant events
  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    try {
      const session: any = event.data.object;

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
          session.id ?? null,
          session.payment_intent ?? null,
          session.amount_total ?? null,
          session.currency ?? null,
          session.status ?? null,
          session.customer_details?.email ??
            session.customer_email ??
            null,
        ]
      );

      console.log("✅ Order inserted:", session.id);
    } catch (dbErr: any) {
      console.error("❌ Database insert failed:", dbErr.message);

      // IMPORTANT: return 500 so Stripe retries
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }
  }

  // 4️⃣ Always acknowledge Stripe
  return NextResponse.json({ received: true });
}