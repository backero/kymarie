import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts } from "@/actions/products";
import { getProductReviewStats } from "@/actions/reviews";
import { getWishlistedProductIds } from "@/actions/wishlist";
import { auth } from "@/auth";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductReviews } from "./ProductReviews";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";
import { Leaf, Star, Shield, Truck, RefreshCw, ChevronDown } from "lucide-react";
import { ScrollReveal } from "@/components/public/ScrollReveal";

interface Props {
  params: Promise<{ slug: string }>;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kumarie.in";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || product.description.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const { products: relatedProducts } = await getProducts({
    category: product.category.slug,
    limit: 4,
  });

  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const [reviewStats, session] = await Promise.all([
    getProductReviewStats(product.id),
    auth(),
  ]);

  const wishlistedIds =
    session?.user?.role === "user"
      ? await getWishlistedProductIds(session.user.id)
      : [];

  const additionalProperty = [
    ...(product.ingredients
      ? [{ "@type": "PropertyValue", name: "Ingredients", value: product.ingredients }]
      : []),
    ...(product.benefits.length > 0
      ? [{ "@type": "PropertyValue", name: "Benefits", value: product.benefits.join(", ") }]
      : []),
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description,
    image: product.images,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Kumarie",
    },
    ...(additionalProperty.length > 0 && { additionalProperty }),
    ...(reviewStats.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewStats.average,
        reviewCount: reviewStats.count,
      },
    }),
    offers: {
      "@type": "Offer",
      url: `${appUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${appUrl}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${appUrl}/products?category=${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${appUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Main product grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images — sticky on desktop */}
          <ScrollReveal direction="left" delay={0}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                isNew={product.isNew}
              />
            </div>
          </ScrollReveal>

          {/* Product Info — staggered reveals */}
          <div className="space-y-0">
            {/* Category breadcrumb */}
            <ScrollReveal delay={0.05}>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-sage-400" strokeWidth={1.5} />
                <a
                  href={`/products?category=${product.category.slug}`}
                  className="font-body text-xs tracking-widest uppercase text-sage-500 hover:text-amber-600 transition-colors"
                >
                  {product.category.name}
                </a>
              </div>
            </ScrollReveal>

            {/* Product name */}
            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-forest-700 leading-tight mb-4">
                {product.name}
              </h1>
            </ScrollReveal>

            {/* Rating */}
            <ScrollReveal delay={0.15}>
              {reviewStats.count > 0 ? (
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(reviewStats.average)
                            ? "text-amber-400 fill-amber-400"
                            : "text-cream-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-body text-sm text-sage-500">
                    {reviewStats.average.toFixed(1)} ({reviewStats.count}{" "}
                    {reviewStats.count === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-body text-sm text-sage-400">No reviews yet</span>
                </div>
              )}
            </ScrollReveal>

            {/* Short Description */}
            {product.shortDesc && (
              <ScrollReveal delay={0.18}>
                <p className="font-body text-sage-600 text-base leading-relaxed mb-6 border-l-2 border-amber-400 pl-4 italic">
                  {product.shortDesc}
                </p>
              </ScrollReveal>
            )}

            {/* Add to cart */}
            <ScrollReveal delay={0.22}>
              <ProductDetailClient
                product={product as Product}
                initialWishlisted={wishlistedIds.includes(product.id)}
              />
            </ScrollReveal>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <ScrollReveal delay={0.28}>
                <div className="mt-6">
                  <p className="font-body text-xs font-semibold tracking-widest uppercase text-sage-500 mb-3">
                    Key Benefits
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit) => (
                      <span key={benefit} className="tag">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Shipping info */}
            <ScrollReveal delay={0.32}>
              <div className="mt-8 border-t border-cream-300 pt-6 space-y-3">
                {[
                  { icon: Truck, text: "Free shipping on orders above ₹599" },
                  {
                    icon: Shield,
                    text: "100% natural & ethically sourced ingredients",
                  },
                  { icon: RefreshCw, text: "Easy 7-day returns if not satisfied" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon
                      className="w-4 h-4 text-amber-500 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="font-body text-sm text-sage-600">{text}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Animated accordion details */}
            <ScrollReveal delay={0.36}>
              <div className="mt-6 space-y-1">
                {product.ingredients && (
                  <AccordionDetail title="Ingredients">
                    <p className="font-body text-xs text-sage-500 leading-relaxed">
                      {product.ingredients}
                    </p>
                  </AccordionDetail>
                )}
                {product.howToUse && (
                  <AccordionDetail title="How to Use">
                    <p className="font-body text-xs text-sage-500 leading-relaxed">
                      {product.howToUse}
                    </p>
                  </AccordionDetail>
                )}
                {product.description && (
                  <AccordionDetail title="Full Description">
                    <p className="font-body text-xs text-sage-500 leading-relaxed">
                      {product.description}
                    </p>
                  </AccordionDetail>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <ScrollReveal delay={0.1}>
            <div className="mt-20 pt-16 border-t border-cream-300">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-10 bg-amber-400" />
                <h2 className="font-display text-3xl font-light text-forest-700">
                  You might also love
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <ScrollReveal key={p.id} delay={i * 0.08}>
                    <ProductCard
                      product={p as Product}
                      initialWishlisted={wishlistedIds.includes(p.id)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Reviews */}
        <ProductReviews productId={product.id} reviews={product.reviews} />
      </div>
    </div>
  );
}

// ── Animated Accordion ───────────────────────────────────────────────────────
import { AnimatedAccordion } from "@/components/public/AnimatedAccordion";

function AccordionDetail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return <AnimatedAccordion title={title}>{children}</AnimatedAccordion>;
}
