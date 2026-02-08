import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
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
    console.error("Webhook signature error:", err.message);
    return new NextResponse("Webhook error", { status: 400 });
  }

  // ✅ Only handle completed payments
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    try {
      // 🔒 Check if order already exists
      const existing = await sql`
        SELECT id FROM orders
        WHERE payment_intent = ${intent.id}
        LIMIT 1
      `;

      if (existing.rowCount > 0) {
        console.log("Duplicate webhook ignored:", intent.id);
        return NextResponse.json({ received: true });
      }

      // ✅ Insert order
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
        )
      `;
    } catch (err) {
      console.error("Order insert error:", err);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}