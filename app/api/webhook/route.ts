import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { orders } from "@/app/lib/orders";

export const runtime = "nodejs"; // REQUIRED for Stripe webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    const order = {
      id: session.id,
      email: session.customer_details?.email ?? null,
      amount: session.amount_total ?? null,
      currency: session.currency ?? null,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    console.log("✅ PAYMENT CONFIRMED");
    console.log(order);
  }

  return NextResponse.json({ received: true });
}