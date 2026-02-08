import { headers } from "next/headers";

export const runtime = "nodejs";

export default async function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_USER || !ADMIN_PASS) {
    return <pre>Admin credentials not configured</pre>;
  }

  if (!authHeader) {
    return new Response("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area"',
      },
    }) as any;
  }

  const encoded = authHeader.split(" ")[1];
  const decoded = Buffer.from(encoded, "base64").toString();
  const [user, pass] = decoded.split(":");

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return new Response("Forbidden", { status: 403 }) as any;
  }

  return <>{children}</>;
}