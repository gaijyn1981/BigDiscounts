import { sql } from "@vercel/postgres";
export default async function OrdersPage() {
  try {
    const result = await sql`
      SELECT id, stripe_session_id, payment_intent, amount_total, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    return (
      <div>
        <h1>Orders</h1>
        <table border={1} cellPadding={8}>
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
            {result.rows.map((order: any) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.stripe_session_id}</td>
                <td>{order.payment_intent}</td>
                <td>£{(order.amount_total / 100).toFixed(2)}</td>
                <td>{order.created_at ? new Date(order.created_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div>
        <h1>Orders</h1>
        <p style={{ color: "red" }}>
          Failed to load orders. Check server logs.
        </p>
      </div>
    );
  }
}