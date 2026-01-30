"use client";

export default function CartPage() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // 🔑 THIS is critical
    } else {
      alert("Failed to start checkout");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Your Cart</h1>
      <p>Wireless Headphones – £1.00</p>

      <button onClick={handleCheckout}>
        Pay with Stripe
      </button>
    </main>
  );
}