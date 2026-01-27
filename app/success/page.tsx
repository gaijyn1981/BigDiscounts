export default function SuccessPage() {
  return (
    <div style={{ padding: "80px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        ✅ Payment successful
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Thank you for your purchase. Your payment has been processed successfully.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "6px",
          marginBottom: "30px",
        }}
      >
        <strong>Order summary</strong>
        <p>Wireless Headphones</p>
        <p>Total paid: £49.99</p>
      </div>

      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Back to home
      </a>
    </div>
  );
}