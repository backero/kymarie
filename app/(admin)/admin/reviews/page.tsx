import Link from "next/link";
import { getAllReviewsAdmin } from "@/actions/reviews";
import { formatDate, truncate } from "@/lib/utils";
import { Star, MessageSquare } from "lucide-react";
import { DeleteReviewButton, ToggleReviewApprovalButton } from "./ReviewActions";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-neutral-900">
          Reviews
        </h1>
        <p className="font-body text-sm text-neutral-500 mt-1">
          {reviews.length} reviews total —{" "}
          {reviews.filter((r) => !r.isApproved).length} pending moderation
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/70 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-neutral-300" strokeWidth={1} />
            </div>
            <p className="font-display text-xl text-neutral-500 mb-2">
              No reviews yet
            </p>
            <p className="font-body text-sm text-neutral-400">
              Customer reviews will show up here for moderation
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/60">
                  {["Product", "Author", "Rating", "Review", "Date", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 font-body text-[11px] font-semibold tracking-wider uppercase text-neutral-400 first:pl-5 last:text-right"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="hover:bg-neutral-50/50 transition-colors group border-b border-neutral-50 last:border-0 align-top"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/products/${review.product.slug}`}
                        target="_blank"
                        className="font-body text-sm font-medium text-neutral-800 hover:text-amber-600 transition-colors"
                      >
                        {review.product.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-neutral-700">{review.author}</p>
                      <p className="font-body text-xs text-neutral-400">{review.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {review.title && (
                        <p className="font-body text-sm font-medium text-neutral-800">
                          {review.title}
                        </p>
                      )}
                      <p className="font-body text-xs text-neutral-500 mt-0.5">
                        {truncate(review.body, 120)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body text-xs text-neutral-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold px-2.5 py-1 rounded-full w-fit ${
                          review.isApproved
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            review.isApproved ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <ToggleReviewApprovalButton id={review.id} isApproved={review.isApproved} />
                        <DeleteReviewButton id={review.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
