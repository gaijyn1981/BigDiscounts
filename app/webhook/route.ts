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
  console.log("🔥 WEBHOOK HIT");

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
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
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // ✅ Handle checkout completion
  iif (
  event.type === "checkout.session.completed" ||
  event.type === "payment_intent.succeeded"
) {
  const session = event.data.object as any;

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
    ON CONFLICT (stripe_session_id) DO NOTHING
    `,
    [
      session.id ?? session.checkout_session,
      session.payment_intent ?? session.id,
      session.amount_total ?? session.amount_received,
      session.currency,
      session.status,
      session.customer_details?.email ?? session.receipt_email,
    ]
  );
}

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

  return NextResponse.json({ received: true });
}