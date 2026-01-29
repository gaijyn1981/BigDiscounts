import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 86.174.162.124
const ALLOWED_IPS = [
  "YOUR.IP.ADDRESS.HERE",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/control-panel")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.ip ||
      "unknown";

    if (!ALLOWED_IPS.includes(ip)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm='Admin Area'",
        },
      });
    }

    const [user, pass] = Buffer.from(
      authHeader.split(" ")[1],
      "base64"
    )
      .toString()
      .split(":");

    if (user !== ADMIN_USER || pass !== ADMIN_PASSWORD) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic realm='Admin Area'",
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-panel/:path*"],
};