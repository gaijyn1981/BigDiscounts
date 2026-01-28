import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>❌ Missing session</h1>
        <p>No checkout session found.</p>
      </div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <div style={{ padding: "40px" }}>
      <h1>✅ Payment successful</h1>

      <p>
        <strong>Session ID:</strong> {session.id}
      </p>

      <p>
        <strong>Status:</strong> {session.payment_status}
      </p>

      <p>
        <strong>Email:</strong> {session.customer_details?.email ?? "N/A"}
      </p>
    </div>
  );
}