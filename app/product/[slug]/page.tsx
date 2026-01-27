type Props = {
  params: Promise<{ slug?: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug = "product" } = await params;

  return (
    <div style={{ padding: "60px 40px", maxWidth: "800px" }}>
      <h1>{slug.replace(/-/g, " ")}</h1>
    </div>
  );
}