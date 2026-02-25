import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface RazorpayOrderOptions {
  amount: number; // in paise (INR * 100)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

// Create a Razorpay order
export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  const order = await razorpay.orders.create({
    amount: Math.round(options.amount * 100), // convert to paise
    currency: options.currency || "INR",
    receipt: options.receipt,
    notes: options.notes || {},
  });
  return order;
}

// Verify payment signature
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

// Format amount for display
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}
