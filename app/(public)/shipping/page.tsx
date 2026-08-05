import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { Truck, PackageCheck, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/actions/settings";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Kumarie shipping rates, processing times, and delivery timelines.",
  alternates: { canonical: "/shipping" },
};

export default async function ShippingPolicyPage() {
  const settings = await getSettings();
  const contactEmail = settings.contactEmail || "kymariesoaps@gmail.com";

  const points = [
    {
      Icon: Clock,
      title: "Processing Time",
      desc: "Every order is hand-packed with care within 1-2 business days of being placed.",
    },
    {
      Icon: Truck,
      title: "Delivery Time",
      desc: "Once shipped, orders typically arrive within 5-7 business days, depending on your location.",
    },
    {
      Icon: PackageCheck,
      title: "Shipping Fee",
      desc: `Free shipping on all orders above ₹${settings.freeShippingThreshold}. Orders below that are charged a flat ₹${settings.shippingFee} shipping fee.`,
    },
    {
      Icon: MapPin,
      title: "Delivery Coverage",
      desc: `We currently ship across India. If you're outside India and would like to order, write to us at ${contactEmail}.`,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero
        eyebrow="Support"
        title="Shipping Policy"
        subtitle="How and when your handcrafted soaps reach you."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {points.map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white border border-cream-300 p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-amber-500" strokeWidth={1.5} />
              </div>
              <p className="font-body text-sm font-semibold text-forest-700 mb-1.5">{title}</p>
              <p className="font-body text-xs text-sage-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 font-body text-sm text-sage-600 leading-relaxed">
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Order Tracking</h2>
            <p>
              You&rsquo;ll receive an email confirmation as soon as your order is placed. If you
              checked out with an account, you can follow your order&rsquo;s status any time under
              My Orders in your profile.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Delays</h2>
            <p>
              While we aim to meet the timelines above, occasional delays can happen due to courier
              logistics, weather, or regional disruptions beyond our control. We&rsquo;ll always keep
              you informed if your order is running late.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Questions</h2>
            <p>
              For anything shipping-related, reach us at{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
              >
                {contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
