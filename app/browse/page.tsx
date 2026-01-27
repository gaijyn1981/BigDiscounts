export default function BrowsePage() {
  return (
    <div style={{ padding: "60px 40px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Browse products
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
        }}
      >
        <div style={cardStyle}>
          <a href="/product/wireless-headphones">
  <h3>Wireless Headphones</h3>
</a>
          <p style={priceStyle}>£49.99</p>
          <small>UK Audio Co</small>
        </div>

        <div style={cardStyle}>
          <h3>Skincare eBook</h3>
          <p style={priceStyle}>£9.99</p>
          <small>Glow London</small>
        </div>

        <div style={cardStyle}>
          <h3>Home Fitness Guide</h3>
          <p style={priceStyle}>£14.99</p>
          <small>FitLife UK</small>
        </div>

        <div style={cardStyle}>
          <h3>Desk Lamp</h3>
          <p style={priceStyle}>£29.99</p>
          <small>BrightHome</small>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "6px",
  background: "#fff",
};

const priceStyle = {
  fontWeight: "bold",
  margin: "10px 0",
};
