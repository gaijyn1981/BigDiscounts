"use client";

export default function CartPage() {
  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // 🔥 THIS redirects to Stripe
    } else {
      alert("Failed to start checkout");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Cart</h1>

      <p>Wireless Headphones – £49.99</p>

      <button
        onClick={checkout}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Pay with Stripe
      </button>
    </div>
  );
}