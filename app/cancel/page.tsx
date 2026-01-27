export default function CancelPage() {
  return (
    <div style={{ padding: "60px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        ❌ Payment cancelled
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Your payment was cancelled. No money has been taken.
      </p>

      <a
        href="/cart"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "#000",
          color: "#fff",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Back to cart
      </a>
    </div>
  );
}