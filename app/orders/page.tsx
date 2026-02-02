import { orders } from "@/app/lib/orders";

export default function OrdersPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.email ?? "—"}</td>
                <td>
                  {order.amount
                    ? (order.amount / 100).toFixed(2)
                    : "—"}
                </td>
                <td>{order.currency ?? "—"}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}