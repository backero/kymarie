"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/orders";
import { getOrderStatusColor } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isUpdating}
      className={`text-xs font-body font-medium px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-forest-400 cursor-pointer disabled:opacity-60 ${getOrderStatusColor(status)}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
