import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { confirmPayment, markOrderPaymentFailed, markOrderRefunded } from "@/actions/orders";

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
      case "payment.captured": {
        // Backup path for when the client-driven /api/payment/verify call
        // never completes (e.g. user closes the tab after paying).
        const payment = event.payload.payment.entity;
        const order = await prisma.order.findFirst({
          where: { razorpayOrderId: payment.order_id },
        });
        if (order) {
          await confirmPayment(order.id, {
            razorpayOrderId: payment.order_id,
            razorpayPaymentId: payment.id,
            razorpaySignature: signature,
          });
        } else {
          console.error("Webhook payment.captured: no order found for", payment.order_id);
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        await markOrderPaymentFailed(payment.order_id);
        break;
      }

      case "refund.processed": {
        const refund = event.payload.refund.entity;
        await markOrderRefunded(refund.payment_id);
        break;
      }

      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
