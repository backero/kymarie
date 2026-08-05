"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Validation Schema ────────────────────────────────────────────────────────
const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6),
  country: z.string().default("India"),
  notes: z.string().optional(),
  userId: z.string().optional(), // link order to logged-in user
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      productImage: z.string().optional(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ),
  subtotal: z.number().positive(),
  shippingFee: z.number().min(0),
  discount: z.number().min(0).default(0),
  couponCode: z.string().optional(),
  total: z.number().positive(),
});

// ── Create Order (pre-payment) ─────────────────────────────────────────────
export async function createOrder(data: z.infer<typeof CheckoutSchema>) {
  const validated = CheckoutSchema.parse(data);

  // Verify products and stock
  for (const item of validated.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      return { success: false, error: `Product not found: ${item.productName}` };
    }

    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      };
    }
  }

  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      customerPhone: validated.customerPhone,
      addressLine1: validated.addressLine1,
      addressLine2: validated.addressLine2 ?? null,
      city: validated.city,
      state: validated.state,
      pincode: validated.pincode,
      country: validated.country,
      notes: validated.notes ?? null,
      userId: validated.userId ?? null,
      subtotal: validated.subtotal,
      shippingFee: validated.shippingFee,
      discount: validated.discount,
      couponCode: validated.couponCode ?? null,
      total: validated.total,
      status: "PENDING",
      paymentStatus: "PENDING",
      items: {
        create: validated.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return { success: true, order };
}

// ── Confirm COD Order ────────────────────────────────────────────────────────
export async function confirmCODOrder(orderId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
    },
    include: { items: true },
  });

  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  revalidatePath("/admin/orders");
  await sendOrderConfirmationEmail({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    items: order.items,
  });
  return { success: true, order };
}

// ── Confirm Payment & Update Order ───────────────────────────────────────────
// Called from both the client-driven /api/payment/verify route and the
// Razorpay webhook — idempotent so whichever fires first "wins" and the
// second call is a no-op (prevents double stock-decrement/coupon-credit).
export async function confirmPayment(
  orderId: string,
  paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }
) {
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) {
    return { success: false, error: "Order not found" };
  }
  if (existing.paymentStatus === "PAID") {
    return { success: true, order: existing, alreadyProcessed: true };
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: "Razorpay",
      razorpayOrderId: paymentData.razorpayOrderId,
      razorpayPaymentId: paymentData.razorpayPaymentId,
      razorpaySignature: paymentData.razorpaySignature,
    },
    include: { items: true },
  });

  // Deduct stock
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Credit coupon usage, if one was applied
  if (order.couponCode) {
    await prisma.coupon.updateMany({
      where: { code: order.couponCode },
      data: { usedCount: { increment: 1 } },
    });
  }

  revalidatePath("/admin/orders");
  await sendOrderConfirmationEmail({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    items: order.items,
  });
  return { success: true, order, alreadyProcessed: false };
}

// ── Mark Order Payment Failed (from Razorpay webhook) ────────────────────────
export async function markOrderPaymentFailed(razorpayOrderId: string) {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
  if (!order || order.paymentStatus === "PAID") {
    return { success: false, error: "Order not found or already paid" };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "FAILED" },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

// ── Mark Order Refunded (from Razorpay webhook) ──────────────────────────────
// Refund webhook payloads carry the payment ID, not the order ID.
export async function markOrderRefunded(razorpayPaymentId: string) {
  const order = await prisma.order.findFirst({ where: { razorpayPaymentId } });
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "REFUNDED", paymentStatus: "REFUNDED" },
  });

  revalidatePath("/admin/orders");
  return { success: true };
}

// ── Get All Orders (admin) ───────────────────────────────────────────────────
export async function getAllOrders(options?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  await requireAdmin();
  const { status, page = 1, limit = 20 } = options || {};

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { name: true, thumbnail: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ── Get Single Order ─────────────────────────────────────────────────────────
export async function getOrderById(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { name: true, thumbnail: true, slug: true } },
        },
      },
    },
  });
}

// ── Update Order Status ───────────────────────────────────────────────────────
export async function updateOrderStatus(
  id: string,
  status: string
) {
  await requireAdmin();

  const previous = await prisma.order.findUnique({ where: { id } });

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as never },
    include: { items: true },
  });

  if (status === "SHIPPED" && previous?.status !== "SHIPPED") {
    await sendOrderShippedEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      items: order.items,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true, order };
}

// ── Get Dashboard Stats ───────────────────────────────────────────────────────
export async function getDashboardStats() {
  await requireAdmin();

  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 10 }, isActive: true },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, thumbnail: true },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts,
    recentOrders,
    lowStockProducts,
  };
}
