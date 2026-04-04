"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
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

// ── Confirm Payment & Update Order ───────────────────────────────────────────
export async function confirmPayment(
  orderId: string,
  paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }
) {
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

  revalidatePath("/admin/orders");
  return { success: true, order };
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

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as never },
  });

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
