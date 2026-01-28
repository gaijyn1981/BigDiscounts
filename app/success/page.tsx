import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

type Props = {
  searchParams: {
    session_id?: string;
  };
};

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div style={{ padding: 40 }}>
        <h1>❌ Missing session</h1>
        <p>No checkout session found.</p>
      </div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Payment successful</h1>

      <p><strong>Session ID:</strong> {session.id}</p>
      <p><strong>Email:</strong> {session.customer_details?.email}</p>
      <p><strong>Amount:</strong> £{(session.amount_total ?? 0) / 100}</p>
      <p><strong>Status:</strong> {session.payment_status}</p>

      <hr />

      <p>Thank you for your purchase 🎉</p>
    </div>
  );
}