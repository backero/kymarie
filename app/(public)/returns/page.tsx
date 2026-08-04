import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { CheckCircle2, XCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Kumarie's 7-day return policy and refund process.",
  alternates: { canonical: "/returns" },
};

const eligible = [
  "Request made within 7 days of delivery",
  "Product is unused and unopened, in its original packaging",
  "Order number and reason for return provided",
];

const notEligible = [
  "Products that have been opened or used, for hygiene reasons",
  "Requests made after the 7-day window",
  "Gift sets missing any original components",
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero
        eyebrow="Support"
        title="Returns & Refunds"
        subtitle="Not the right fit? We offer easy 7-day returns if you're not satisfied."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          <div className="bg-white border border-cream-300 p-6">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-forest-600 mb-4">
              Eligible for return
            </p>
            <ul className="space-y-3">
              {eligible.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="font-body text-xs text-sage-500 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-cream-300 p-6">
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-4">
              Not eligible
            </p>
            <ul className="space-y-3">
              {notEligible.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <XCircle className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="font-body text-xs text-sage-500 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6 font-body text-sm text-sage-600 leading-relaxed">
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">How to Start a Return</h2>
            <p>
              Email us at{" "}
              <a
                href="mailto:kymariesoaps@gmail.com"
                className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
              >
                kymariesoaps@gmail.com
              </a>{" "}
              with your order number and the reason for your return. We&rsquo;ll confirm eligibility
              and guide you through the next steps.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Refunds</h2>
            <p>
              Once we receive and inspect the returned item, we&rsquo;ll process your refund to the
              original payment method. Refunds are typically credited within 5-7 business days,
              depending on your bank or payment provider.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Damaged or Incorrect Items</h2>
            <p>
              If your order arrives damaged or you received the wrong product, contact us within 48
              hours of delivery with photos of the item — we&rsquo;ll sort out a replacement or refund
              at no extra cost to you.
            </p>
          </div>
        </div>

        <div className="mt-14 bg-white border border-cream-300 p-6 flex items-start gap-3">
          <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="font-body text-sm text-sage-600">
            Questions about a return?{" "}
            <a
              href="mailto:kymariesoaps@gmail.com"
              className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
            >
              kymariesoaps@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
