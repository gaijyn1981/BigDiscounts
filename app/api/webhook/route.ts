import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  // ✅ MUST read raw body
  const body = await req.text();

  // ✅ Stripe signature header
  const signature = req.headers.get("stripe-signature");

  // ❗ NEVER return 400 to Stripe
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
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response("OK", { status: 200 });
  }

  // ✅ Handle ONLY what you care about
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Checkout session completed");
    console.log("Session ID:", session.id);
    console.log("Customer email:", session.customer_details?.email);

    // 👉 PLACE YOUR LOGIC HERE
    // - save order to DB
    // - send email
    // - unlock product
    // - etc.
  }

  // ✅ THIS stops retries forever
  return new Response("OK", { status: 200 });
}