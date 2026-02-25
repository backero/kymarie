import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// This webhook handles Razorpay payment events server-to-server
// Set up in Razorpay Dashboard > Webhooks
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event);

    switch (event.event) {
      case "payment.captured":
        // Payment was successful - orders are updated via verify endpoint
        // This is a backup webhook handler
        console.log("Payment captured:", event.payload.payment.entity.id);
        break;

      case "payment.failed":
        console.log("Payment failed:", event.payload.payment.entity.id);
        // Update order status if needed
        break;

      case "refund.processed":
        console.log("Refund processed:", event.payload.refund.entity.id);
        break;

      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
