"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  customer_email: string;
  amount_total: number;
  currency: string;
  status: string;
  payment_intent: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  async function refund(payment_intent: string) {
    await fetch("/api/admin/refund", {
      method: "POST",
      body: JSON.stringify({ payment_intent }),
    });

    alert("Refund initiated");
  }

  return (
    <div>
      <h1>Orders</h1>

      {orders.map(o => (
        <div key={o.id} style={{ marginBottom: 12 }}>
          <b>{o.customer_email}</b> – £{o.amount_total / 100}
          <br />
          Status: {o.status}
          <br />
          {o.status === "complete" && (
            <button onClick={() => refund(o.payment_intent)}>
              Refund
            </button>
          )}
        </div>
      ))}
    </div>
  );
}