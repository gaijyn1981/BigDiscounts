"use client";

export default function CartPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "60px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>
        Your cart
      </h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h3>Wireless Headphones</h3>
        <p>£49.99</p>
        <small>Sold by UK Audio Co</small>
      </div>

      <div style={{ fontSize: "20px", marginBottom: "30px" }}>
        <strong>Total: £49.99</strong>
      </div>

      <button
        onClick={handleCheckout}
        style={{
          padding: "14px 24px",
          fontSize: "16px",
          cursor: "pointer",
          background: "black",
          color: "white",
          border: "none",
        }}
      >
        Checkout
      </button>
    </div>
  );
}