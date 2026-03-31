"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "@/app/components/StarRating";

interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId: string;
}

export default function SellerReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`/api/reviews?sellerEmail=${session.user.email}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session?.user?.email]);

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-28" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-xl">
          <p className="text-4xl mb-3">⭐</p>
          <p className="font-semibold text-lg">No reviews yet</p>
          <p className="text-sm mt-2">Reviews from buyers will appear here once your listings start getting traction.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">{avg}</p>
              <StarRating value={Math.round(parseFloat(avg!))} readonly size="lg" />
              <p className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex-1 w-full space-y-1.5">
              {dist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-gray-600">{star}</span>
                  <span className="text-yellow-400 text-base">★</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.buyerName}</p>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                  <time className="text-xs text-gray-400 shrink-0">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </time>
                </div>
                <p className="mt-2 text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
