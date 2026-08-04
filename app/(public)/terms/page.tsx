import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of the Kumarie website and orders.",
  alternates: { canonical: "/terms" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl text-forest-700 mb-3">{title}</h2>
      <div className="font-body text-sm text-sage-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero eyebrow="Legal" title="Terms of Service" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="font-body text-xs text-sage-400 mb-10">
          Last updated: August 2026
        </p>

        <Section title="Acceptance of Terms">
          <p>
            By accessing or using the Kumarie website (a brand of Backero Private Limited), you
            agree to be bound by these Terms of Service. If you do not agree, please do not use our
            website or place an order with us.
          </p>
        </Section>

        <Section title="Eligibility">
          <p>
            You must be at least 18 years old, or have the consent of a parent or guardian, to place
            an order with us.
          </p>
        </Section>

        <Section title="Account Registration">
          <p>
            When you create an account, you're responsible for maintaining the confidentiality of
            your login credentials and for all activity that occurs under your account. Please
            notify us immediately of any unauthorised use.
          </p>
        </Section>

        <Section title="Products & Pricing">
          <p>
            We make every effort to display product information, images, and pricing accurately.
            However, we reserve the right to correct any errors, inaccuracies, or omissions, and to
            change or update pricing at any time without prior notice. Product colours and
            appearance may vary slightly due to the handcrafted nature of each batch.
          </p>
        </Section>

        <Section title="Orders & Cancellations">
          <p>
            Placing an order is an offer to purchase, which we may accept or decline — for example,
            if a product is out of stock or there's an error in pricing. We reserve the right to
            cancel any order at our discretion, in which case any payment made will be refunded in
            full.
          </p>
        </Section>

        <Section title="Payments">
          <p>
            All payments are processed securely through Razorpay. By placing an order, you agree to
            provide accurate and complete payment information.
          </p>
        </Section>

        <Section title="Shipping & Returns">
          <p>
            Shipping timelines and fees are described in our{" "}
            <Link href="/shipping" className="text-forest-600 hover:text-amber-600 underline underline-offset-2">
              Shipping Policy
            </Link>
            . Returns and refunds are governed by our{" "}
            <Link href="/returns" className="text-forest-600 hover:text-amber-600 underline underline-offset-2">
              Returns & Refunds Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p>
            All content on this website — including the Kumarie name, logo, product descriptions,
            photography, and design — is the property of Backero Private Limited and may not be
            copied, reproduced, or used without our written permission.
          </p>
        </Section>

        <Section title="Prohibited Use">
          <p>
            You agree not to misuse this website — including attempting unauthorised access to our
            systems, interfering with site functionality, or using the site for any unlawful
            purpose.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            To the extent permitted by law, Backero Private Limited shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of this website or
            our products, beyond the value of the order in question.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These Terms are governed by the laws of India. Any disputes arising from these Terms or
            your use of the website will be subject to the exclusive jurisdiction of the courts in
            Tamil Nadu.
          </p>
        </Section>

        <Section title="Changes to These Terms">
          <p>
            We may update these Terms from time to time. Continued use of the website after changes
            are posted constitutes your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            Questions about these Terms? Write to us at{" "}
            <a
              href="mailto:kymariesoaps@gmail.com"
              className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
            >
              kymariesoaps@gmail.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
