"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  productName: string;
  isNew?: boolean;
}

const LABELS = ["Packaging", "Soap Bar"];

export function ProductImageGallery({ images, productName, isNew }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const containerRef = useRef<HTMLDivElement>(null);

  const hasImages = images.length > 0;
  const mainImage = hasImages ? images[selectedIndex] : null;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  return (
    <div className="space-y-4">
      {/* ── Main image ── */}
      <div
        ref={containerRef}
        onMouseEnter={() => hasImages && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        className={`relative aspect-square overflow-hidden rounded-2xl bg-cream-200 select-none ${hasImages ? "cursor-zoom-in" : ""}`}
      >
        <AnimatePresence mode="wait">
          {mainImage ? (
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={mainImage}
                alt={`${productName} — ${LABELS[selectedIndex] ?? `View ${selectedIndex + 1}`}`}
                fill
                priority={selectedIndex === 0}
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-cover pointer-events-none transition-transform duration-200 ease-out"
                style={{
                  transform: zoomed ? "scale(2.2)" : "scale(1)",
                  transformOrigin: zoomed ? origin : "50% 50%",
                }}
                draggable={false}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-cream-300 flex items-center justify-center">
                <Leaf className="w-9 h-9 text-sage-300" strokeWidth={1.25} />
              </div>
              <p className="font-body text-xs tracking-widest uppercase text-sage-300">
                Photo coming soon
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          {isNew && (
            <span className="bg-forest-500 text-cream-100 text-[10px] font-body font-medium tracking-wider uppercase px-3 py-1 rounded-full">
              New
            </span>
          )}
          {selectedIndex === 0 && (
            <span className="bg-white/80 backdrop-blur-sm text-forest-700 text-[10px] font-body tracking-wider uppercase px-3 py-1 rounded-full border border-cream-300">
              Packaging
            </span>
          )}
          {selectedIndex === 1 && (
            <span className="bg-white/80 backdrop-blur-sm text-amber-700 text-[10px] font-body tracking-wider uppercase px-3 py-1 rounded-full border border-amber-200">
              Raw Soap
            </span>
          )}
        </div>

        {/* Zoom hint */}
        {hasImages && !zoomed && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/70 backdrop-blur-sm text-sage-500 text-[10px] font-body tracking-wide px-2.5 py-1.5 rounded-full border border-cream-300 pointer-events-none">
            <ZoomIn className="w-3 h-3" strokeWidth={1.5} />
            Hover to zoom
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div className={`grid gap-3 ${images.length === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedIndex(i)}
              whileTap={{ scale: 0.97 }}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none group ${
                selectedIndex === i
                  ? "border-amber-400 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                  : "border-cream-300 hover:border-amber-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} — ${LABELS[i] ?? `View ${i + 1}`}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="120px"
              />
              {/* Label overlay */}
              <div className={`absolute inset-x-0 bottom-0 py-1 text-center font-body text-[8px] tracking-wider uppercase transition-opacity ${selectedIndex === i ? "opacity-100 bg-amber-400/90 text-white" : "opacity-0 group-hover:opacity-100 bg-black/40 text-white"}`}>
                {LABELS[i] ?? `View ${i + 1}`}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
