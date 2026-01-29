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
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
        }}
      >
        <header style={{ marginBottom: "30px" }}>
          <h1>Admin Panel</h1>
          <p style={{ color: "#666" }}>Restricted access</p>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}