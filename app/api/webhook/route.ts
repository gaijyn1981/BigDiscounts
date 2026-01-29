import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

export const runtime = "nodejs";

/**
 * Stripe client
 * IMPORTANT:
 * - Do NOT set apiVersion manually (prevents TS mismatch errors)
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

/**
 * Neon / Postgres pool
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new Response("OK", { status: 200 });
  }

  let event: Stripe.Event;

  try {
  event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

      try {
        // 🔽 YOUR DATABASE INSERT HERE
        console.log("✅ Payment succeeded:", paymentIntent.id);
      } catch (dbErr) {
        console.error("❌ Database insert failed", dbErr);
        // DO NOT throw
      }

      break;
    }

    default:
      console.log("ℹ️ Ignored event:", event.type);
  }
} catch (err: any) {
  console.error("❌ Signature verification failed:", err.message);
}

// ✅ ALWAYS respond 200
return new Response("OK", { status: 200 });

  // ✅ Handle only the events we care about
  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    const session: any = event.data.object;

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
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}