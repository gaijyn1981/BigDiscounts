export const metadata = {
  title: "BigDiscounts",
  description: "Big discounts from UK sellers — all in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header
          style={{
            padding: "20px 40px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* 
  IMPORTANT:
  Admin routes are intentionally hidden.
  Access is URL-only and protected by middleware.
*/}
          <strong style={{ fontSize: "22px" }}>BigDiscounts</strong>

          <nav style={{ fontSize: "16px" }}>
            <a href="/" style={{ marginRight: "20px" }}>
              Home
            </a>
            <a href="/browse" style={{ marginRight: "20px" }}>
              Browse
            </a>
            <a href="/sell" style={{ marginRight: "20px" }}>
  Sell
</a>
<a href="/cart">Cart</a>

          </nav>
        </header>

        {/* Page content */}
        <main>{children}</main>

<footer
  style={{
    marginTop: "80px",
    padding: "30px 40px",
    borderTop: "1px solid #eee",
    fontSize: "14px",
    color: "#666",
  }}
>
  <p suppressHydrationWarning>
  © {new Date().getFullYear()} BigDiscounts.uk
</p>
  <p>
    A UK marketplace bringing multiple sellers together in one place.
  </p>
</footer>

      </body>
    </html>
  );
}
