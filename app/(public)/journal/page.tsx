import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Journal",
  description: "Skincare wisdom, ingredient deep-dives, and stories from the Kumarie craft — coming soon.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero
        eyebrow="Kumarie Journal"
        title="Stories from the craft"
        subtitle="Ingredient deep-dives, formulation notes, and skincare wisdom from our team — we're just getting started."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-7 h-7 text-sage-400" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-forest-600 mb-3">
          Coming soon
        </h2>
        <p className="font-body text-sage-500 leading-relaxed mb-10 max-w-md mx-auto">
          We're writing our first pieces on the ingredients we use, why cold process soap-making
          takes weeks not hours, and how to build a soap-based skincare routine. Subscribe below and
          we'll let you know the moment the first post is up.
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
}
