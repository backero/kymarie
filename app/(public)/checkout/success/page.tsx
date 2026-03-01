import { SuccessContent } from "./SuccessClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Kumarie",
  description: "Your order has been confirmed. Thank you for shopping with Kumarie!",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="min-h-screen bg-cream-100 pt-20 flex items-center justify-center">
      <SuccessContent order={order} />
    </div>
  );
}
