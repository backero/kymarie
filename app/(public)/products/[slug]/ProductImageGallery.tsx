"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  productName: string;
  isNew?: boolean;
}

export function ProductImageGallery({ images, productName, isNew }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const containerRef = useRef<HTMLDivElement>(null);

  const mainImage = images[selectedIndex] || "/placeholder.jpg";

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${x}% ${y}%`);
    },
    []
  );

  return (
    <div className="space-y-4">
      {/* Main Image with zoom */}
      <div
        ref={containerRef}
        className="relative aspect-square overflow-hidden bg-cream-200 cursor-zoom-in select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={mainImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 50vw"
          className="object-cover pointer-events-none transition-transform duration-200 ease-out"
          style={{
            transform: isZoomed ? "scale(2.2)" : "scale(1)",
            transformOrigin: isZoomed ? origin : "50% 50%",
          }}
          draggable={false}
        />

        {isNew && (
          <div className="absolute top-4 left-4 z-10 bg-forest-500 text-cream-100 text-xs font-body font-medium tracking-wider uppercase px-3 py-1">
            New
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative aspect-square overflow-hidden bg-cream-200 border-2 transition-all duration-200 focus:outline-none ${
                selectedIndex === i
                  ? "border-amber-400 shadow-md"
                  : "border-transparent hover:border-amber-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - view ${i + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
