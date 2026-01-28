import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Wireless Headphones",
            },
            unit_amount: 4999, // £49.99
          },
          quantity: 1,
        },
      ],

      // ✅ THIS IS THE IMPORTANT PART
      success_url:
        "https://big-discounts.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: "https://big-discounts.vercel.app/cart",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new NextResponse("Stripe error", { status: 500 });
  }
}