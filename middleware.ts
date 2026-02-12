import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page without auth
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAdmin = req.cookies.get("admin_session")?.value === "true";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/control-panel/:path*",
    "/admin/:path*",
  ],
};