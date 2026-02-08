import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin panel
  if (!pathname.startsWith("/control-panel")) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Panel"',
      },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const decoded = atob(base64);
  const [user, pass] = decoded.split(":");

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_USER || !ADMIN_PASS) {
    console.error("Missing ADMIN_USER or ADMIN_PASS env vars");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Panel"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-panel/:path*"],
};