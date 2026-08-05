import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { ChevronDown } from "lucide-react";
import { getSettings } from "@/actions/settings";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Kumarie orders, shipping, payments, returns, and ingredients.",
  alternates: { canonical: "/faq" },
};

function buildFaqGroups(shippingFee: number, freeShippingThreshold: number, contactEmail: string) {
  return [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are hand-packed within 1-2 business days and delivered within 5-7 business days across India.",
      },
      {
        q: "Is shipping free?",
        a: `Yes — shipping is free on orders above ₹${freeShippingThreshold}. Orders below that are charged a flat ₹${shippingFee} shipping fee.`,
      },
      {
        q: "Can I track my order?",
        a: "If you checked out with an account, you can see order status and updates any time under My Orders in your profile. You'll also receive an email confirmation when you place an order.",
      },
      {
        q: "Do I need an account to order?",
        a: "No — you can check out as a guest. Creating an account just lets you save addresses and track order history in one place.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "All payments are processed securely through Razorpay, which supports UPI, credit/debit cards, net banking, and wallets.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. We never store your card or UPI details — all payment processing happens directly through Razorpay's secure, PCI-DSS compliant systems.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer easy 7-day returns if you're not satisfied — as long as the product is unused and unopened. See our full Returns & Refunds policy for details.",
      },
      {
        q: "How do I start a return?",
        a: `Email ${contactEmail} with your order number and reason for return, and we'll guide you through the next steps.`,
      },
    ],
  },
  {
    title: "Products & Ingredients",
    items: [
      {
        q: "Are Kumarie soaps natural?",
        a: "Yes — every bar is made with 100% natural, cold-pressed oils and botanical actives. We never use SLS, parabens, or phthalates.",
      },
      {
        q: "Are your products tested on animals?",
        a: "No. Kumarie is cruelty-free — our products are never tested on animals.",
      },
      {
        q: "Why do your soaps take weeks to arrive after formulation?",
        a: "Our cold process soaps are cured for a minimum of 4-6 weeks before they're ready. This is what preserves glycerin and gives the bar its long-lasting, gentle lather — it's a deliberate part of the craft, not a delay.",
      },
    ],
  },
  ];
}

export default async function FaqPage() {
  const settings = await getSettings();
  const contactEmail = settings.contactEmail || "kymariesoaps@gmail.com";
  const faqGroups = buildFaqGroups(settings.shippingFee, settings.freeShippingThreshold, contactEmail);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about ordering, shipping, and our formulations. Can't find your answer? Reach out on our Contact page."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-14">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-display text-2xl font-medium text-forest-700 mb-6">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-white border border-cream-300 open:border-amber-200"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4">
                      <span className="font-body text-sm font-medium text-forest-700">
                        {item.q}
                      </span>
                      <ChevronDown className="w-4 h-4 text-sage-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="font-body text-sm text-sage-500 leading-relaxed px-5 pb-4">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
