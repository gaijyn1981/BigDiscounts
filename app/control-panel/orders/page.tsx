import { sql } from "@vercel/postgres";

export default async function OrdersPage() {
  const { rows } = await sql`
    SELECT
      id,
      customer_email,
      amount_total,
      status,
      created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Orders
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Email</th>
            <th align="left">Amount (£)</th>
            <th align="left">Status</th>
            <th align="left">Date</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_email}</td>
              <td>{(order.amount_total / 100).toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                {new Date(order.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}