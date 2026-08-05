import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { Mail, MapPin, HelpCircle, ArrowRight } from "lucide-react";
import { getSettings } from "@/actions/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Kumarie team for order queries, wholesale enquiries, or anything else.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const contactEmail = settings.contactEmail || "kymariesoaps@gmail.com";
  const businessAddress =
    settings.businessAddress ||
    "42, Interflex Complex, Near 5K Car Care, Trichy Road, Sulur, Coimbatore – 641402";

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="For order queries, wholesale enquiries, or anything else — reach out and we'll get back to you as soon as we can."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          <a
            href={`mailto:${contactEmail}`}
            className="group bg-white border border-cream-300 hover:border-amber-200 p-8 transition-all duration-200 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <Mail className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
            </div>
            <p className="font-body text-sm font-semibold text-forest-700 mb-1.5">Email Us</p>
            <p className="font-body text-sm text-sage-500">{contactEmail}</p>
            <span className="inline-flex items-center gap-1 font-body text-xs text-forest-500 mt-3 group-hover:gap-2 transition-all">
              Send an email <ArrowRight className="w-3 h-3" />
            </span>
          </a>

          <div className="bg-white border border-cream-300 p-8">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
            </div>
            <p className="font-body text-sm font-semibold text-forest-700 mb-1.5">Find Us</p>
            <p className="font-body text-sm text-sage-500 leading-relaxed">
              {businessAddress}
            </p>
          </div>
        </div>

        <div className="bg-white border border-cream-300 p-8 flex items-start gap-4">
          <HelpCircle className="w-5 h-5 text-forest-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <div>
            <p className="font-body text-sm font-semibold text-forest-700 mb-1.5">
              Have an order or shipping question?
            </p>
            <p className="font-body text-sm text-sage-500 leading-relaxed mb-3">
              Check our FAQ and policy pages first — you might find your answer right away.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/faq" className="font-body text-sm text-forest-600 hover:text-amber-600 underline underline-offset-2">
                FAQ
              </Link>
              <Link href="/shipping" className="font-body text-sm text-forest-600 hover:text-amber-600 underline underline-offset-2">
                Shipping Policy
              </Link>
              <Link href="/returns" className="font-body text-sm text-forest-600 hover:text-amber-600 underline underline-offset-2">
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
