import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // ✅ PAYMENT CONFIRMED BY STRIPE
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ PAYMENT CONFIRMED", {
      sessionId: session.id,
      email: session.customer_details?.email,
      amount: session.amount_total,
    });

    // 🔜 Here is where you will:
    // - create order
    // - mark as paid
    // - send email
  }

  return NextResponse.json({ received: true });
}