import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";

export const metadata = {
  title: "My Account",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session || session.user?.role !== "user") {
    redirect("/login?redirect=/profile");
  }

  const userId = session.user.id;

  const [user, orders, wishlistItems, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        total: true,
        subtotal: true,
        shippingFee: true,
        discount: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        items: true,
      },
    }),
    prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <ProfileClient
      user={user}
      orders={orders}
      wishlistItems={wishlistItems}
      addresses={addresses}
    />
  );
}
