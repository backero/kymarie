import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();

  // Guest checkout — no prefill
  if (!session || session.user?.role !== "user") {
    return <CheckoutClient />;
  }

  const userId = session.user.id;

  // Fetch user profile and saved addresses in parallel
  const [user, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  return (
    <CheckoutClient
      userId={userId}
      prefill={{
        customerName: user?.name ?? "",
        customerEmail: user?.email ?? "",
        customerPhone: user?.phone ?? "",
      }}
      savedAddresses={addresses}
    />
  );
}
