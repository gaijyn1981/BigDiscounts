export default function Home() {
  return (
    <div style={{ padding: "60px 40px", maxWidth: "900px" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
        Big discounts from UK sellers — all in one place
      </h1>

      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        Buy physical and digital products from multiple companies in a single
        checkout.
      </p>

      <ul style={{ fontSize: "18px", lineHeight: "1.8" }}>
        <li>✔ Multiple sellers, one checkout</li>
        <li>✔ UK businesses</li>
        <li>✔ Physical & digital products</li>
        <li>✔ Sell for just £1 per product per month</li>
      </ul>

      <div style={{ marginTop: "40px" }}>
        <a
          href="/browse"
          style={{
            padding: "14px 24px",
            fontSize: "16px",
            marginRight: "16px",
            cursor: "pointer",
            border: "1px solid #000",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Browse products
        </a>

        <a
          href="/sell"
          style={{
            padding: "14px 24px",
            fontSize: "16px",
            cursor: "pointer",
            border: "1px solid #000",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Sell on BigDiscounts
        </a>
      </div>
    </div>
  );
}