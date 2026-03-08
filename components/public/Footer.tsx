import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Facial Care", href: "/products?category=facial-care" },
    { label: "Body Care", href: "/products?category=body-care" },
    { label: "Herbal", href: "/products?category=herbal" },
    { label: "Gift Sets", href: "/products?category=gift-sets" },
  ],
  info: [
    { label: "Our Story", href: "/#about" },
    { label: "Ingredients", href: "/#ingredients" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Journal", href: "/journal" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-cream-100 border-t border-cream-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center mb-5 group">
              <Image
                src="/logo.png"
                alt="Kumarie"
                width={130}
                height={52}
                className="h-10 w-auto object-contain group-hover:opacity-75 transition-opacity duration-300"
              />
            </Link>

            <p className="font-body text-sm text-sage-500 leading-relaxed max-w-xs mb-6">
              Handcrafted with love and nature's finest botanicals. Each bar is a
              ritual — a moment to pause, to nourish, to be.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-cream-300 rounded-full text-sage-400 hover:border-forest-400 hover:text-forest-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-8 space-y-2">
              <a
                href="mailto:hello@kumarie.com"
                className="flex items-center gap-2 font-body text-xs text-sage-500 hover:text-amber-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                hello@kumarie.com
              </a>
              <p className="flex items-center gap-2 font-body text-xs text-sage-500">
                <Phone className="w-3.5 h-3.5" />
                +91 98765 43210
              </p>
              <p className="flex items-start gap-2 font-body text-xs text-sage-500">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: "Shop", links: footerLinks.shop },
            { title: "Company", links: footerLinks.info },
            { title: "Support", links: footerLinks.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-forest-500 mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-sage-500 hover:text-forest-600 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-sage-400">
            © {new Date().getFullYear()} Kumarie. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-sage-400">
              Secure payments by
            </span>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs font-medium text-sage-500 border border-cream-300 px-2 py-0.5 rounded-md">
                Razorpay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
