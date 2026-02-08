import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  const orders = await sql`
    SELECT id, customer_email, amount_total, currency, status, payment_intent
    FROM orders
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json(orders.rows);
}