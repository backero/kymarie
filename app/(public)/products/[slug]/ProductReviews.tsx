"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { submitReview } from "@/actions/reviews";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
}

const reviewFormSchema = z.object({
  author: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-cream-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: ReviewItem[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { author: "", email: "", rating: 0, title: "", body: "" },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitReview(productId, data);
      if (result.success) {
        toast.success("Thanks! Your review will appear after moderation.");
        setSubmitted(true);
        setShowForm(false);
        reset();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-cream-300 px-4 py-2.5 font-body text-sm text-forest-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 bg-cream-50 placeholder-sage-300 transition-all duration-200";

  return (
    <div className="mt-20 pt-16 border-t border-cream-300">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-amber-400" />
          <h2 className="font-display text-3xl font-light text-forest-700">
            Customer Reviews
          </h2>
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="font-body text-xs font-medium tracking-widest uppercase text-forest-600 border border-forest-300 hover:bg-forest-500 hover:text-cream-100 hover:border-forest-500 px-5 py-2.5 transition-colors duration-200"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-cream-300 p-6 md:p-8 mb-10 space-y-5"
        >
          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
              Your Rating <span className="text-amber-500">*</span>
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <StarRatingInput value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1 font-body">{errors.rating.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Name <span className="text-amber-500">*</span>
              </label>
              <input {...register("author")} className={inputClass} placeholder="Your name" />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1 font-body">{errors.author.message}</p>
              )}
            </div>
            <div>
              <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
                Email <span className="text-amber-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-body">{errors.email.message}</p>
              )}
              <p className="font-body text-[11px] text-sage-400 mt-1">
                Not shown publicly
              </p>
            </div>
          </div>

          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
              Review Title
            </label>
            <input {...register("title")} className={inputClass} placeholder="Sum it up in a few words" />
          </div>

          <div>
            <label className="font-body text-xs font-medium tracking-wider uppercase text-sage-600 block mb-2">
              Your Review <span className="text-amber-500">*</span>
            </label>
            <textarea
              {...register("body")}
              rows={4}
              className={inputClass}
              placeholder="Tell us what you think about this product"
            />
            {errors.body && (
              <p className="text-red-500 text-xs mt-1 font-body">{errors.body.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-cream-100 font-body font-medium tracking-widest uppercase text-xs px-6 py-3 transition-colors duration-300"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="font-body text-xs text-sage-500 hover:text-forest-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-cream-50">
          <MessageSquare className="w-10 h-10 text-sage-300 mb-3" strokeWidth={1} />
          <p className="font-body text-sage-500">
            No reviews yet — be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-cream-300 pb-6">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-cream-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-body text-sm font-medium text-forest-700">
                    {review.author}
                  </span>
                </div>
                <span className="font-body text-xs text-sage-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {review.title && (
                <p className="font-body text-sm font-medium text-forest-700 mb-1">
                  {review.title}
                </p>
              )}
              <p className="font-body text-sm text-sage-600 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
