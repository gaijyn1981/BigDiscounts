import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  // Safety check – avoids silent failures
  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse("Admin credentials not configured", {
      status: 500,
    });
  }

  // No auth header → trigger browser login popup
  if (!authHeader) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    });
  }

  const [scheme, encoded] = authHeader.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return new NextResponse("Invalid authorization header", {
      status: 400,
    });
  }

  const decoded = Buffer.from(encoded, "base64").toString();
  const [user, pass] = decoded.split(":");

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Auth OK → continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/control-panel/:path*"],
};