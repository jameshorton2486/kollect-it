"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
  images: string[];
}

interface ReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId, filterRating]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({ productId });
      if (filterRating) params.append("rating", filterRating.toString());

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, helpful: true }),
      });
      fetchReviews();
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="border-t pt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Overall Rating */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold">
                  {stats.average.toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(stats.average)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-lux-gray-light"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {stats.total} reviews
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold hover:bg-primary/90"
              >
                Write a Review
              </button>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {stats.breakdown.reverse().map((item: any) => (
                <button
                  key={item.rating}
                  onClick={() =>
                    setFilterRating(
                      filterRating === item.rating ? null : item.rating,
                    )
                  }
                  className={`w-full flex items-center gap-3 hover:bg-muted p-2 rounded ${
                    filterRating === item.rating ? "bg-muted" : ""
                  }`}
                >
                  <span className="text-sm w-6">{item.rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-semibold">
                  {review.user.name?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{review.user.name}</span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-lux-gold">
                        <CheckCircle className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-lux-gray-light"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold mb-2">{review.title}</h4>
                  )}

                  <p className="text-muted-foreground mb-3">{review.comment}</p>

                  {review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal - Simplified placeholder */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <p className="text-muted-foreground">Review form coming soon...</p>
            <button
              onClick={() => setShowReviewForm(false)}
              className="mt-4 w-full border px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
