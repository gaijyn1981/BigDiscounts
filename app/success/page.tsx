"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>✅ Payment successful</h1>
      <p>Thank you for your purchase!</p>

      {sessionId && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Session ID:</strong>
          <br />
          {sessionId}
        </p>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}