interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div>
        <h1>❌ Missing session</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>✅ Payment successful</h1>
      <p>Session ID:</p>
      <code>{sessionId}</code>
    </div>
  );
}