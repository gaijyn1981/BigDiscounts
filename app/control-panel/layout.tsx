export const runtime = "nodejs";

export default function ControlPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Panel</h1>
      {children}
    </div>
  );
}