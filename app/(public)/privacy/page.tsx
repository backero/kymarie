import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Kumarie collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl text-forest-700 mb-3">{title}</h2>
      <div className="font-body text-sm text-sage-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero eyebrow="Legal" title="Privacy Policy" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="font-body text-xs text-sage-400 mb-10">
          Last updated: August 2026
        </p>

        <Section title="Overview">
          <p>
            This Privacy Policy explains how Kumarie (a brand of Backero Private Limited) collects,
            uses, and protects your personal information when you visit our website or place an
            order with us.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Name, email address, and phone number when you create an account or check out</li>
            <li>Shipping and billing address when you place an order</li>
            <li>Order history and product preferences</li>
            <li>Any information you share with us when contacting customer support</li>
          </ul>
          <p>
            We also automatically collect some technical information — such as browser type, device
            information, and pages visited — through cookies and analytics tools when you use our
            site.
          </p>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To process and deliver your orders</li>
            <li>To communicate with you about your orders, account, or customer support requests</li>
            <li>To send you marketing updates, if you've opted in to our newsletter</li>
            <li>To improve our website, products, and customer experience</li>
            <li>To detect and prevent fraud or misuse of our services</li>
          </ul>
        </Section>

        <Section title="Sharing Your Information">
          <p>We do not sell your personal information. We share it only with:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <span className="font-medium text-forest-700">Razorpay</span> — to securely process
              payments. We never see or store your full card or UPI details.
            </li>
            <li>
              <span className="font-medium text-forest-700">Google Analytics & Google Tag Manager</span> —
              to understand how visitors use our site, in aggregate and anonymised form where possible.
            </li>
            <li>
              <span className="font-medium text-forest-700">Delivery and logistics partners</span> —
              to fulfil and ship your orders.
            </li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            We use cookies and browser local storage to keep you signed in, remember items in your
            cart, and understand site usage through analytics. You can disable cookies in your
            browser settings, though some features (like staying logged in or your cart persisting
            between visits) may not work as expected.
          </p>
        </Section>

        <Section title="Data Security">
          <p>
            We take reasonable technical and organisational measures to protect your personal
            information from unauthorised access, loss, or misuse. However, no method of
            transmission or storage over the internet is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            You can request access to, correction of, or deletion of your personal data at any time
            by emailing{" "}
            <a
              href="mailto:kymariesoaps@gmail.com"
              className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
            >
              kymariesoaps@gmail.com
            </a>
            . You can also unsubscribe from marketing emails at any time using the link in any
            newsletter we send.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            Our services are not directed at children, and we do not knowingly collect personal
            information from anyone under the age of 18.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            If you have any questions about this Privacy Policy, write to us at{" "}
            <a
              href="mailto:kymariesoaps@gmail.com"
              className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
            >
              kymariesoaps@gmail.com
            </a>{" "}
            or 42, Interflex Complex, Near 5K Car Care, Trichy Road, Sulur, Coimbatore – 641402.
          </p>
        </Section>
      </div>
    </div>
  );
}
