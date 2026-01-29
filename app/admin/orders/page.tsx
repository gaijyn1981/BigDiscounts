import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function OrdersPage() {
  const result = await pool.query(`
    SELECT
      id,
      stripe_session_id,
      payment_intent,
      amount_total,
      created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 50
  `);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Orders</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Stripe Session</th>
            <th>Payment Intent</th>
            <th>Amount</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {result.rows.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.stripe_session_id}</td>
              <td>{order.payment_intent}</td>
              <td>£{(order.amount_total / 100).toFixed(2)}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}