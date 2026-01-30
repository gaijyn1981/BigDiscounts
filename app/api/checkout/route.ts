import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
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
            unit_amount: 100, // £1.00
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.bigdiscounts.uk/orders?success=true",
      cancel_url: "https://www.bigdiscounts.uk/cart?cancelled=true",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe checkout error:", err);
    return new NextResponse("Checkout failed", { status: 500 });
  }
}