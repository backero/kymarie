"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, X } from "lucide-react";
import { deleteReview, toggleReviewApproval } from "@/actions/reviews";
import toast from "react-hot-toast";

export function DeleteReviewButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this review? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
      title="Delete review"
    >
      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
    </button>
  );
}

export function ToggleReviewApprovalButton({
  id,
  isApproved,
}: {
  id: string;
  isApproved: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleReviewApproval(id);
      toast.success(isApproved ? "Review unapproved" : "Review approved");
      router.refresh();
    } catch {
      toast.error("Failed to update review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${
        isApproved
          ? "text-green-500 hover:text-gray-500 hover:bg-gray-50"
          : "text-gray-400 hover:text-green-500 hover:bg-green-50"
      }`}
      title={isApproved ? "Unapprove review" : "Approve review"}
    >
      {isApproved ? <Check className="w-4 h-4" strokeWidth={1.5} /> : <X className="w-4 h-4" strokeWidth={1.5} />}
    </button>
  );
}
