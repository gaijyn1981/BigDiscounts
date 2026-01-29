import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 👇 YOUR ALLOWED IPs
const ALLOWED_IPS = [
  "86.174.162.124",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/control-panel")) {
    // Vercel / Edge-safe IP detection
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    if (!ALLOWED_IPS.includes(ip)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm=\"Admin Area\"",
        },
      });
    }

    const decoded = Buffer.from(
      authHeader.split(" ")[1],
      "base64"
    ).toString();

    const [user, pass] = decoded.split(":");

    if (user !== ADMIN_USER || pass !== ADMIN_PASSWORD) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm=\"Admin Area\"",
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-panel/:path*"],
};