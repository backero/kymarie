import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/actions/orders";

// Demo payment endpoint — simulates a successful Razorpay payment
// Used when NEXT_PUBLIC_DEMO_MODE=true (no real Razorpay keys needed)
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
    }

    // Simulate Razorpay payment IDs for demo
    const demoPaymentId = `demo_pay_${Date.now()}`;
    const demoOrderId  = `demo_order_${Date.now()}`;
    const demoSig      = `demo_sig_${Date.now()}`;

    const result = await confirmPayment(orderId, {
      razorpayOrderId:   demoOrderId,
      razorpayPaymentId: demoPaymentId,
      razorpaySignature: demoSig,
    });

    return NextResponse.json({ success: true, order: result.order });
  } catch (error) {
    console.error("Demo payment error:", error);
    return NextResponse.json({ success: false, error: "Demo payment failed" }, { status: 500 });
  }
}
