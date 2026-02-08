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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  async function refund(paymentIntentId: string) {
    if (!confirm("Refund this order?")) return;

    setLoading(true);

    const res = await fetch("/api/admin/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Refund failed");
      return;
    }

    alert("Refund initiated. Webhook will update status.");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Orders</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.customer_email}</td>
              <td>
                {(o.amount_total / 100).toFixed(2)} {o.currency.toUpperCase()}
              </td>
              <td>{o.status}</td>
              <td>
                {o.status === "complete" && (
                  <button onClick={() => refund(o.payment_intent)} disabled={loading}>
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}