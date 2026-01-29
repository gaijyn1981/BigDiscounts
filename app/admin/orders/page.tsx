import { headers } from "next/headers";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

function requireAuth() {
  const authHeader = headers().get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64Credentials, "base64").toString();
  const [username, password] = decoded.split(":");

  if (
    username !== "admin" ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }
}

export default async function OrdersPage() {
  // 🔐 AUTH CHECK
  requireAuth();

  // 📦 FETCH ORDERS
  const result = await pool.query(`
    SELECT id, stripe_session_id, payment_intent, amount_total, created_at
    FROM orders
    ORDER BY created_at DESC
  `);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Orders</h1>

      <table border={1} cellPadding={8} cellSpacing={0}>
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
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}