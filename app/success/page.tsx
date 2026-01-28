export const dynamic = 'force-dynamic';

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>❌ Missing session</h1>
        <p>No Stripe session ID was found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ Payment successful</h1>
      <p>Thank you for your purchase!</p>

      <p style={{ marginTop: '1rem' }}>
        <strong>Session ID:</strong>
        <br />
        {sessionId}
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}