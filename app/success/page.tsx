"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>❌ Missing session</h1>
        <p>No Stripe session ID found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>✅ Payment successful</h1>
      <p>Session ID:</p>
      <code>{sessionId}</code>
    </div>
  );
}