"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { WordReveal } from "@/components/animations/WordReveal";

export function WhatsAppSection() {
  return (
    <section className="bg-white py-20 md:py-28 border-y border-cream-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* QR code */}
          <ScrollReveal delay={0.1}>
            <div className="shrink-0 flex flex-col items-center gap-4">
              <div className="w-44 h-44 md:w-52 md:h-52 relative rounded-2xl overflow-hidden border border-cream-300 shadow-md bg-white p-2.5">
                <Image
                  src="/whatsapp-qr.jpeg"
                  alt="Scan to chat with Kumarie on WhatsApp"
                  fill
                  className="object-contain"
                  sizes="208px"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium tracking-wide text-[#25D366]">
                <MessageCircle className="w-3.5 h-3.5" />
                Scan to chat
              </span>
            </div>
          </ScrollReveal>

          {/* Text */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <ScrollReveal>
              <p className="font-body text-xs tracking-widest uppercase text-sage-400">
                Connect with us
              </p>
            </ScrollReveal>

            <WordReveal
              text="Chat with us on WhatsApp"
              as="h2"
              className="font-display text-3xl md:text-4xl font-light text-forest-500 tracking-tight"
              delay={0.05}
            />

            <ScrollReveal delay={0.2}>
              <p className="font-body text-sm text-sage-500 leading-relaxed max-w-sm mx-auto md:mx-0">
                Have questions about our soaps or need personalised skincare guidance? Scan the QR code or tap below to reach our team directly on WhatsApp.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 self-center md:self-start px-7 py-3.5 rounded-full font-body font-medium tracking-widest uppercase text-xs text-white transition-opacity hover:opacity-90"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
