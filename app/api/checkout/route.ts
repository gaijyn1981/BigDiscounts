import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Wireless Headphones",
            },
            unit_amount: 4999,
          },
          quantity: 1,
        },
      ],

      success_url:
        "https://big-discounts.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://big-discounts.vercel.app/cart",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}