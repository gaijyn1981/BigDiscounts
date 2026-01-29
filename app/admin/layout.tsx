export const metadata = {
  title: "Admin Panel",
  description: "Restricted admin area",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Admin Header */}
        <header
          style={{
            padding: "20px 40px",
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong style={{ fontSize: "20px" }}>Admin Panel</strong>

          <span style={{ fontSize: "14px", opacity: 0.8 }}>
            Restricted Access
          </span>
        </header>

        {/* Admin Content */}
        <main style={{ padding: "40px" }}>{children}</main>
      </body>
    </html>
  );
}