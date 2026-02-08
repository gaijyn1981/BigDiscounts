import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { payment_intent } = await req.json();

  await stripe.refunds.create({
    payment_intent,
  });

  return NextResponse.json({ success: true });
}