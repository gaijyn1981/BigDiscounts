import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const { sellerId } = await params;
  const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
  if (!seller) return {};
  return {
    title: `${seller.companyName} | BigDiscounts`,
    description: `Browse all listings from ${seller.companyName} on BigDiscounts.uk`,
  };
}

export default async function SellerProfilePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;

  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      products: {
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
      reviewsReceived: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!seller) notFound();

  const avg = seller.reviewsReceived.length > 0
    ? (seller.reviewsReceived.reduce((s, r) => s + r.rating, 0) / seller.reviewsReceived.length).toFixed(1)
    : null;

  return (
    <main className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Seller header */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: "#111", border: "1px solid #222" }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">{seller.companyName}</h1>
                {seller.verified && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: "#0a1a0a", color: "#4ade80", border: "1px solid #4ade80" }}>
                    ✅ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-3">Contact: {seller.contactName}</p>
              {avg && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">{"★".repeat(Math.round(parseFloat(avg)))}{"☆".repeat(5 - Math.round(parseFloat(avg)))}</span>
                  <span className="text-gray-400 text-sm">{avg} / 5 · {seller.reviewsReceived.length} review{seller.reviewsReceived.length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-black" style={{ color: "#fcd968" }}>{seller.products.length}</p>
              <p className="text-gray-500 text-xs">Active listing{seller.products.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-bold text-white mb-4">Listings by {seller.companyName}</h2>
        {seller.products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 rounded-xl" style={{ border: "1px dashed #333" }}>
            <p>No active listings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {seller.products.map((product) => {
              const photos = JSON.parse(product.photos || "[]");
              return (
                <Link key={product.id} href={`/product/${product.id}`}
                  className="rounded-xl overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ background: "#111", border: product.featured ? "2px solid #fcd968" : "1px solid #222" }}>
                  {photos[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img src={photos[0]} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    {product.featured && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full text-black mb-2 inline-block"
                        style={{ background: "#fcd968" }}>⭐ Featured</span>
                    )}
                    <h3 className="font-bold text-white text-sm mb-1 truncate">{product.title}</h3>
                    <p className="font-black" style={{ color: "#fcd968" }}>£{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Reviews */}
        {seller.reviewsReceived.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-white mb-4">Customer Reviews</h2>
            <div className="space-y-3">
              {seller.reviewsReceived.map((review) => (
                <div key={review.id} className="rounded-xl p-4" style={{ background: "#111", border: "1px solid #222" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{review.buyerName}</p>
                      <span className="text-yellow-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <time className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
