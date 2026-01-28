"use client";

import React from "react";

export default function CartPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to start checkout");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // 🔥 IMPORTANT
      } else {
        alert("No checkout URL returned");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to start checkout");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      <p>Wireless Headphones – £49.99</p>

      <button onClick={handleCheckout}>
        Pay with Stripe
      </button>

      <footer style={{ marginTop: "60px", color: "#666" }}>
        <p>© 2026 BigDiscounts.uk</p>
        <p>A UK marketplace bringing multiple sellers together in one place.</p>
      </footer>
    </div>
  );
}