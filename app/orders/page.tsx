import { pool } from "@/lib/db";

export default async function OrdersPage() {
  const { rows } = await pool.query(`
    SELECT id, email, amount, currency, created_at
    FROM orders
    ORDER BY created_at DESC
  `);

  return (
    <main>
      <h1>Orders</h1>

      {rows.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
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
            {rows.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.email ?? "-"}</td>
                <td>
                  {order.amount
                    ? (order.amount / 100).toFixed(2)
                    : "-"}
                </td>
                <td>{order.currency ?? "-"}</td>
                <td>
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}