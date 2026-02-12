import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", "true", {
      httpOnly: true,
      path: "/",
    });

    return response;
  }

  return NextResponse.json(
    { success: false },
    { status: 401 }
  );
}