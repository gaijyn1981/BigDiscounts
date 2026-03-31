"use client";

import { useEffect, useState, useCallback } from "react";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  productId: string;
  sellerId: string;
}

export default function ReviewList({ productId, sellerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function handleSubmitted() {
    setShowForm(false);
    fetchReviews();
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          {avg && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(parseFloat(avg))} readonly size="sm" />
              <span className="text-sm text-gray-600">{avg} / 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ReviewForm productId={productId} sellerId={sellerId} onSubmitted={handleSubmitted} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
          <p className="text-2xl mb-2">⭐</p>
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to review this product!</p>
        </div>
      ) : (
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
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </time>
              </div>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
