import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

export const runtime = "nodejs";

// Stripe (ONE version only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Postgres (Neon / pg)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
  } catch (err: any) {
    console.error("❌ Signature verification failed:", err.message);
    return new Response("OK", { status: 200 });
  }

  // ✅ CORRECT event type condition (THIS was breaking your builds)
  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    const session = event.data.object as any;

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