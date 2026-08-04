import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { Leaf, Heart, Package, Droplets } from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "How Kumarie approaches ingredient sourcing, cruelty-free formulation, and small-batch craft.",
  alternates: { canonical: "/sustainability" },
};

const commitments = [
  {
    Icon: Leaf,
    title: "Natural, Traceable Ingredients",
    desc: "Every ingredient must satisfy provenance transparency, skin compatibility, and functional integrity before it goes into a Kumarie bar — no fillers, no synthetic surfactants like SLS, no unnecessary chemicals that end up washed down the drain.",
  },
  {
    Icon: Heart,
    title: "Cruelty-Free, Always",
    desc: "None of our products are tested on animals — at any stage of formulation or production.",
  },
  {
    Icon: Droplets,
    title: "Cold Process, By Design",
    desc: "Cold process soap-making uses no external heat source during saponification, keeping our energy footprint per batch low while preserving the full nutritional integrity of every oil and botanical we use.",
  },
  {
    Icon: Package,
    title: "Small-Batch, Not Mass-Produced",
    desc: "We craft in small, controlled batches rather than mass manufacturing — which means we make what's needed, reducing overproduction and waste at the source.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <PageHero
        eyebrow="Our Commitment"
        title="Sustainability"
        subtitle="Craft, by nature, asks you to waste less and choose more carefully. Here's how that shows up in every Kumarie bar."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {commitments.map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white border border-cream-300 p-6">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-forest-500" strokeWidth={1.5} />
              </div>
              <p className="font-body text-sm font-semibold text-forest-700 mb-2">{title}</p>
              <p className="font-body text-xs text-sage-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 font-body text-sm text-sage-600 leading-relaxed">
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">Where We're Headed</h2>
            <p>
              Sustainability isn&rsquo;t a finished project for us — it&rsquo;s an ongoing part of how
              we craft. We&rsquo;re currently developing a zero-waste shampoo bar line using the same
              cold process technique, built specifically to eliminate plastic packaging from that
              part of your routine entirely.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-forest-700 mb-2">A Standing Invitation</h2>
            <p>
              We&rsquo;re a small, artisanal brand and we&rsquo;re honest about the fact that we&rsquo;re
              still learning and improving. If you have questions about a specific ingredient or how
              a product is made, write to us at{" "}
              <a
                href="mailto:kymariesoaps@gmail.com"
                className="text-forest-600 hover:text-amber-600 underline underline-offset-2"
              >
                kymariesoaps@gmail.com
              </a>{" "}
              — we're glad to share what we know.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
