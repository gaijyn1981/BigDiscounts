import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return <h1>❌ Missing session</h1>;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Payment successful</h1>
      <p>Session ID: {session.id}</p>
      <p>Status: {session.payment_status}</p>
      <p>Email: {session.customer_details?.email}</p>
    </div>
  );
}