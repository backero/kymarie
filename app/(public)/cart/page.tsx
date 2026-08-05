import type { Metadata } from "next";
import { getSettings } from "@/actions/settings";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const settings = await getSettings();

  return (
    <CartPageClient
      shippingFee={settings.shippingFee}
      freeShippingThreshold={settings.freeShippingThreshold}
    />
  );
}
