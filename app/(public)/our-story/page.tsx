import Link from "next/link";
import type { Metadata } from "next";
import {
  Leaf,
  Droplets,
  Flame,
  Layers,
  Award,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Sparkles,
  Factory,
  Mail,
  Globe,
  ArrowRight,
  Package,
  Gift,
  Building2,
  MapPin,
  FlaskConical,
  Users,
  Store,
  Plane,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Kumarie is Backero Private Limited's artisanal soap and skincare brand — born from an in-house R&D laboratory, crafted through cold process, melt & pour, and hot process formulation science.",
  alternates: { canonical: "/our-story" },
};

// ─── Section eyebrow + heading ─────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  center = false,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mb-12" : "mb-12"}>
      <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
        <div className="h-px w-10 bg-amber-400" />
        <p className="font-body text-xs tracking-widest uppercase text-sage-400">
          {eyebrow}
        </p>
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-light text-forest-500 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-amber-400 pl-6 md:pl-8 py-2 my-10">
      <p className="font-display text-xl md:text-2xl font-light italic text-forest-600 leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}

// ─── 2. Core Formulation Expertise ─────────────────────────────────────────────
const processes = [
  {
    Icon: Droplets,
    name: "Cold Process Soap Manufacturing",
    desc: "The gold standard of artisanal soap craft. Oils and butters are combined with lye (sodium hydroxide) at low temperatures, preserving natural glycerin, bioactive fatty acids, and heat-sensitive botanical extracts. Cold process soaps retain full skin-nourishing integrity — glycerin draws moisture to the skin naturally, and botanical actives remain potent and undegraded.",
  },
  {
    Icon: Layers,
    name: "Melt & Pour Techniques",
    desc: "A precision-controlled process enabling exact ingredient incorporation, vibrant natural colouration, and complex soap architectures. Melt & pour allows for layered designs, embedded botanicals, and targeted active delivery with exceptional formulation consistency across batches. Ideal for sensitive-skin and therapeutic product variants.",
  },
  {
    Icon: Flame,
    name: "Hot Process Formulations",
    desc: "A traditional technique modernised through scientific control — the saponification reaction is completed externally before moulding, producing a fully 'cooked' soap with immediate usability and enhanced stability. Ideal for enzyme-activated ingredients, fermented botanicals, and high-moisture therapeutic bars.",
  },
];

// ─── 3.1 Ingredient Charter ─────────────────────────────────────────────────────
const charter = [
  {
    Icon: Compass,
    title: "Provenance Transparency",
    desc: "Traceability of ingredient origin — botanical source, region, and extraction method.",
  },
  {
    Icon: ShieldCheck,
    title: "Skin Compatibility",
    desc: "Verified through literature review and internal patch testing for dermal safety.",
  },
  {
    Icon: CheckCircle2,
    title: "Functional Integrity",
    desc: "Every ingredient must serve a specific, evidenced purpose — no fillers, no greenwashing.",
  },
];

// ─── 3.2 Hero Ingredients by Category ──────────────────────────────────────────
const ingredientGroups = [
  {
    title: "Base Oils & Butters",
    items: [
      { name: "Virgin coconut oil", note: "antimicrobial, deeply cleansing, rich in lauric acid" },
      { name: "Shea butter", note: "emollient, anti-inflammatory, high in oleic and stearic fatty acids" },
      { name: "Castor oil", note: "humectant properties; promotes lather, moisture retention" },
      { name: "Filtered palm oil", note: "squalene-rich; skin-identical lipids for barrier support" },
    ],
  },
  {
    title: "Botanical Actives & Extracts",
    items: [
      { name: "Neem extract", note: "antibacterial, antifungal; ideal for problem skin soap variants" },
      { name: "Turmeric (curcumin)", note: "anti-inflammatory, skin brightening; traditional Indian healing ingredient" },
      { name: "Activated charcoal", note: "deep pore cleansing; detoxifying bar formulations" },
      { name: "Rose clay & kaolin", note: "gentle exfoliation, oil absorption, skin tone balance" },
      { name: "Lavender, tea tree & eucalyptus oils", note: "therapeutic aromatherapy profiles" },
    ],
  },
  {
    title: "Specialty Ingredients",
    items: [
      { name: "Raw honey & beeswax", note: "humectant, antibacterial, natural emulsification" },
      { name: "Oat milk", note: "beta-glucan content; soothing and barrier-repairing for sensitive skin" },
      { name: "Coffee grounds", note: "natural exfoliant with caffeine for circulation stimulation" },
      { name: "Goat milk", note: "lactic acid content; gentle chemical exfoliation and skin softening" },
    ],
  },
];

// ─── 4.1 Current Product Collections ───────────────────────────────────────────
const collections = [
  { name: "Classic Botanical Bars", desc: "Cold process soaps with single hero botanicals — neem, turmeric, rose, lavender." },
  { name: "Therapeutic Soap Collection", desc: "Hot process formulations for targeted skin concerns — acne, eczema-prone, sensitive skin." },
  { name: "Artisan Luxury Bars", desc: "Premium melt & pour soaps with embedded botanicals, natural clays, and essential oil blends." },
  { name: "Exfoliating Body Bars", desc: "Coffee, oat, and herbal grain scrub soaps in cold and hot process base." },
  { name: "Sensitive Skin-Safe Range", desc: "Ultra-gentle, unfragranced, hypoallergenic cold process soaps for sensitive skin." },
  { name: "Goat Milk & Honey Bars", desc: "Lactic acid-enriched moisturising bars; popular gifting and premium retail format." },
];

const pipeline = [
  "Kumarie Skincare Line — face wash bars, cleansing balms, and botanical serums extending soap expertise into multi-step skincare",
  "Zero-Waste Shampoo Bars — solid shampoo formulations using cold process technique, eliminating plastic packaging entirely",
  "Men's Grooming Range — activated charcoal and sandalwood variants; beard soap and shave bars",
  "Therapeutic Gift Collections — curated seasonal gift sets for retail and corporate gifting",
  "Subscription & Bespoke Service — custom-formulated soap collections for luxury hotels, ayurvedic resorts, and spa clients",
];

// ─── 5.2 Quality Control Protocol ──────────────────────────────────────────────
const qcProtocol = [
  { title: "Raw Material Screening", desc: "Every batch of carrier oils, butters, and botanicals is reviewed for purity, rancidity, and supplier consistency." },
  { title: "In-Process Monitoring", desc: "Temperature, pH, and saponification value measured at each critical processing stage." },
  { title: "Curing & Stability", desc: "Cold process soaps cured a minimum of 4–6 weeks; stability tested at ambient and elevated temperature." },
  { title: "Finished Product Testing", desc: "pH verification, lather quality, fragrance stability, and appearance/texture assessment as per Indian guidelines." },
  { title: "Batch Documentation", desc: "Full batch records maintained with ingredient lots, process parameters, and QC outcomes." },
];

// ─── 6. Market Positioning ──────────────────────────────────────────────────────
const targetMarkets = [
  "Premium natural skincare consumers — urban, ingredient-aware, willing to pay for quality",
  "Gifting and luxury market — artisanal soap as premium gifting in retail and corporate",
  "Wellness and spa industry — B2B supply to ayurvedic resorts, boutique hotels, and spas",
  "Export market — handcrafted Indian natural soap has strong demand in GCC, UK, and ASEAN",
  "Zero-waste and sustainability-conscious consumers — plastic-free personal care alternatives",
];

const distribution = [
  { Icon: Store, title: "D2C E-commerce", desc: "Direct online sales through Backero website and major marketplaces." },
  { Icon: Gift, title: "Artisan & Natural Retail", desc: "Placement in organic stores, specialty wellness retailers, and natural beauty boutiques." },
  { Icon: Building2, title: "B2B Hospitality", desc: "Supply partnerships with boutique hotels, ayurvedic resorts, and eco-lodges." },
  { Icon: Users, title: "Corporate Gifting", desc: "Custom Kumarie gift sets for corporate festive and employee gifting programmes." },
  { Icon: Plane, title: "Export (Pipeline)", desc: "UAE, UK, Singapore — Indian artisanal soap is a premium product in diaspora markets." },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-cream-100 pt-20">
      {/* Hero */}
      <div className="bg-white border-b border-cream-300 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-sage-400 mb-4">
            A Brand by Backero Private Limited
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light text-forest-500 tracking-tight mb-5">
            Our Story
          </h1>
          <p className="font-display text-xl md:text-2xl italic text-sage-600 leading-relaxed">
            Artisanal Formulation Mastery. Scientific Craftsmanship.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* 1. Brand Story & Origin */}
        <section className="mb-24">
          <SectionHeading eyebrow="Brand Story & Origin" title="The living record of a formulation journey" />
          <div className="space-y-5 font-body text-sage-600 leading-relaxed text-base">
            <p>
              Kumarie is not just a brand — it is the living record of Backero&rsquo;s formulation
              journey. Born from the company&rsquo;s in-house R&amp;D laboratory, Kumarie was
              Backero&rsquo;s first commercial product line and marks market-ready skincare. It
              embodies the craft of cosmetic science: personalized, precise, and deeply intentional.
            </p>
            <p>
              Where Treyfa represents Backero&rsquo;s commercial scale and mass-market clean beauty
              mission, Kumarie is its artisanal soul — the proof that extraordinary skincare can be
              made with extraordinary care. Every Kumarie product is a direct output of Backero&rsquo;s
              formulation mastery, developed by hand, refined through scientific method, and brought to
              consumers as a premium, honest skincare experience.
            </p>
          </div>
          <PullQuote>
            &ldquo;We make soap and skincare the way it was meant to be made: slowly, thoughtfully,
            with full respect for the chemistry of ingredients and the intelligence of the skin.
            Kumarie is not manufactured — it is crafted.&rdquo;
          </PullQuote>
        </section>

        {/* 2. Core Formulation Expertise */}
        <section className="mb-24">
          <SectionHeading
            eyebrow="Core Formulation Expertise"
            title="Three crafts, one uncompromising standard"
          />
          <p className="font-body text-sage-600 leading-relaxed mb-10">
            Kumarie&rsquo;s identity is defined by its mastery of three primary soap and skincare
            manufacturing processes — each representing a distinct approach to ingredient
            manipulation, skin interaction, and final product characteristics. This multi-process
            capability is rare among Indian artisanal brands and reflects Backero&rsquo;s depth of
            formulation science.
          </p>
          <div className="space-y-4">
            {processes.map(({ Icon, name, desc }, i) => (
              <div
                key={name}
                className="group relative bg-white border border-cream-300 hover:border-amber-200 p-6 md:p-8 transition-all duration-200 hover:shadow-sm overflow-hidden"
              >
                <span className="absolute top-4 right-6 font-display text-6xl font-light text-cream-300 select-none leading-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-medium text-forest-700 mb-2">{name}</h3>
                <p className="font-body text-sm text-sage-500 leading-relaxed max-w-2xl">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Ingredient Philosophy & Sourcing */}
        <section className="mb-24">
          <SectionHeading eyebrow="Ingredient Philosophy & Sourcing" title="The Kumarie ingredient charter" />
          <p className="font-body text-sage-600 leading-relaxed mb-10">
            Every ingredient used in Kumarie formulations must satisfy three non-negotiable criteria
            before inclusion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {charter.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-white border border-cream-300 p-6">
                <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center mb-4">
                  <Icon className="w-4.5 h-4.5 text-forest-500" strokeWidth={1.5} />
                </div>
                <p className="font-body text-sm font-semibold text-forest-700 mb-2">{title}</p>
                <p className="font-body text-xs text-sage-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-400 mb-6">
            Hero Ingredients by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ingredientGroups.map((group) => (
              <div key={group.title}>
                <p className="font-display text-lg text-forest-600 mb-4">{group.title}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex gap-2.5">
                      <Leaf className="w-3.5 h-3.5 text-amber-400 mt-1 flex-shrink-0" strokeWidth={1.5} />
                      <p className="font-body text-xs text-sage-500 leading-relaxed">
                        <span className="text-forest-600 font-medium">{item.name}</span> — {item.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Product Range & Collections */}
        <section className="mb-24">
          <SectionHeading eyebrow="Product Range & Collections" title="What we craft today, and next" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {collections.map((c) => (
              <div key={c.name} className="bg-white border border-cream-300 p-6">
                <p className="font-display text-base text-forest-700 mb-1.5">{c.name}</p>
                <p className="font-body text-xs text-sage-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-400 mb-5">
            Pipeline Products
          </h3>
          <ul className="space-y-3">
            {pipeline.map((item) => (
              <li key={item} className="flex gap-3">
                <Package className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <p className="font-body text-sm text-sage-600 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Manufacturing & Quality Standards */}
        <section className="mb-24">
          <SectionHeading eyebrow="Manufacturing & Quality Standards" title="Small batches, built-in quality" />
          <p className="font-body text-sage-600 leading-relaxed mb-10">
            Kumarie products are produced in small, controlled batches at Backero&rsquo;s Coimbatore
            production facility. The artisanal manufacturing model is intentional — it preserves
            formulation integrity, ensures batch-specific quality control, and enables the kind of
            ingredient attention that mass manufacturing cannot offer.
          </p>
          <div className="space-y-3">
            {qcProtocol.map((step) => (
              <div key={step.title} className="flex items-start gap-3 border-b border-cream-300 pb-3">
                <CheckCircle2 className="w-4 h-4 text-forest-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-body text-sm font-semibold text-forest-700">{step.title}</p>
                  <p className="font-body text-xs text-sage-500 leading-relaxed mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <PullQuote>
            Quality in artisanal skincare cannot be inspected in — it must be built in at every stage
            of formulation, from ingredient selection to final curing. Our manufacturing philosophy
            treats every bar as a bespoke creation.
          </PullQuote>
        </section>

        {/* 6. Market Positioning */}
        <section className="mb-24">
          <SectionHeading eyebrow="Market Positioning & Commercial Strategy" title="Who we serve, how we reach them" />
          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-400 mb-5">
            Target Markets
          </h3>
          <ul className="space-y-3 mb-12">
            {targetMarkets.map((item) => (
              <li key={item} className="flex gap-3">
                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <p className="font-body text-sm text-sage-600 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>

          <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-sage-400 mb-5">
            Distribution Strategy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {distribution.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-white border border-cream-300 p-5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-forest-700">{title}</p>
                  <p className="font-body text-xs text-sage-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. R&D Incubator */}
        <section className="mb-24">
          <SectionHeading eyebrow="Kumarie as Backero's R&D Incubator" title="The formulation laboratory, made visible" />
          <p className="font-body text-sage-600 leading-relaxed mb-6">
            Beyond its commercial role, Kumarie serves a critical strategic function within
            Backero&rsquo;s innovation ecosystem: it acts as the primary incubation platform for new
            formulation techniques, ingredient combinations, and process innovations. Every novel
            formulation concept developed in Backero&rsquo;s R&amp;D lab is first tested and
            commercialised through the Kumarie brand before being scaled for larger product lines.
          </p>
          <PullQuote>
            Kumarie is Backero&rsquo;s formulation laboratory made visible. When we develop a new
            botanical active or a novel delivery system, Kumarie is where it first meets the
            consumer. The brand&rsquo;s craft positioning gives us the freedom to innovate,
            experiment, and validate — creating the IP pipeline that feeds the rest of
            Backero&rsquo;s product ecosystem.
          </PullQuote>
          <ul className="space-y-3 mt-8">
            {[
              "First commercial proof of Backero's in-house R&D and formulation capability",
              "Testing ground for bio-fermented and biotech-derived soap actives under development",
              "Breeding ground for IP: unique formulation combinations with patent potential",
              "Consumer feedback channel for new ingredient performance in real-world conditions",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <FlaskConical className="w-4 h-4 text-forest-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <p className="font-body text-sm text-sage-600 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact & Legal */}
        <section className="bg-white border border-cream-300 p-8 md:p-10">
          <h3 className="font-display text-2xl font-medium text-forest-700 mb-6">
            Get in Touch
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex gap-3">
              <Building2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">Parent Company</p>
                <p className="font-body text-sm text-forest-700">Backero Private Limited</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">Brand Enquiries</p>
                <a
                  href="mailto:kymariesoaps@gmail.com"
                  className="font-body text-sm text-forest-700 hover:text-amber-600 transition-colors"
                >
                  kymariesoaps@gmail.com
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">Website</p>
                <a
                  href="https://kumarie.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-forest-700 hover:text-amber-600 transition-colors"
                >
                  kumarie.in
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">Address</p>
                <p className="font-body text-sm text-forest-700 leading-relaxed">
                  42, Interflex Complex, Near 5K Car Care, Trichy Road, Sulur, Coimbatore – 641402
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Factory className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">Manufacturing Unit</p>
                <p className="font-body text-sm text-forest-700">Coimbatore, Tamil Nadu</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Award className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="font-body text-xs text-sage-400">CIN</p>
                <p className="font-body text-sm text-forest-700">U72900TZ2020PTC034030</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Explore the Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
