"use client";

export default function CartPage() {
  const handleCheckout = async () => {
    console.log("🟢 CLICKED PAY WITH STRIPE");

    try {
      console.log("🟡 Sending request to /api/checkout");

      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      console.log("🟡 Response status:", res.status);

      const text = await res.text();
      console.log("🟡 Raw response:", text);

      const data = JSON.parse(text);

      if (data.url) {
        console.log("🟢 Redirecting to Stripe:", data.url);
        window.location.href = data.url;
      } else {
        alert("No checkout URL returned");
      }
    } catch (err) {
      console.error("🔴 Checkout crashed:", err);
      alert("Checkout crashed – see console");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Your Cart</h1>
      <p>Wireless Headphones – £1.00</p>

      <button type="button" onClick={handleCheckout}>
        Pay with Stripe
      </button>
    </main>
  );
}