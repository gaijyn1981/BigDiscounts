import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
    }

    // 🔒 Check order exists & not already refunded
    const order = await sql`
      SELECT status FROM orders
      WHERE payment_intent = ${paymentIntentId}
      LIMIT 1
    `;

    if (order.rowCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.rows[0].status === "refunded") {
      return NextResponse.json({ error: "Already refunded" }, { status: 409 });
    }

    // 💳 Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (err) {
    console.error("Refund error:", err);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}