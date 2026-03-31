"use client";

import { useState } from "react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  productId: string;
  sellerId: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ productId, sellerId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [buyerName, setBuyerName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!rating) return setError("Please select a star rating.");
    if (!buyerName.trim()) return setError("Please enter your name.");
    if (!comment.trim()) return setError("Please enter a comment.");

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sellerId, buyerName, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      setSuccess(true);
      setRating(0);
      setBuyerName("");
      setComment("");
      onSubmitted();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm font-medium">
        ✅ Thank you for your review!
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">Leave a Review</h3>

      <div>
        <p className="text-sm text-gray-600 mb-1">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Your name</label>
        <input
          type="text"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="e.g. John S."
          maxLength={60}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Your comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this seller..."
          rows={3}
          maxLength={1000}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">{comment.length}/1000</p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
