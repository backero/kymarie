"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    text: "I've tried every natural soap brand out there. Kumarie is the first that actually kept my skin soft all day. The Rose & Saffron bar is extraordinary.",
    author: "Priya Menon",
    location: "Bengaluru",
    initials: "PM",
    rating: 5,
  },
  {
    text: "My face hasn't been this clear in years. The Neem & Turmeric bar reduced my breakouts in just two weeks. I'm genuinely never going back to commercial soap.",
    author: "Arjun Shah",
    location: "Mumbai",
    initials: "AS",
    rating: 5,
  },
  {
    text: "The packaging, the scent, the lather — everything about Kumarie feels premium. It's become my favourite self-care ritual every single morning.",
    author: "Kavitha Reddy",
    location: "Hyderabad",
    initials: "KR",
    rating: 5,
  },
  {
    text: "Been using for 3 months and my dry skin has completely transformed. The sandalwood bar smells heavenly and leaves skin incredibly soft. Highly recommend.",
    author: "Sunita Iyer",
    location: "Chennai",
    initials: "SI",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section className="py-20 md:py-28 bg-cream-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-amber-400" />
            <span className="font-body text-xs tracking-widest uppercase text-amber-600 font-medium">
              What they say
            </span>
            <div className="h-px w-10 bg-amber-400" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-forest-700">
            Loved by thousands
          </h2>
          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
            <span className="font-body text-sm text-sage-600 ml-2">
              4.9 out of 5 · 1,200+ reviews
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-1">
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-200 relative overflow-hidden">
                    {/* Large decorative quote */}
                    <span className="absolute top-4 right-8 font-display text-9xl text-amber-100 leading-none pointer-events-none select-none">
                      &ldquo;
                    </span>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6 relative z-10">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <blockquote className="font-display text-xl md:text-2xl font-light text-forest-700 leading-relaxed mb-8 relative z-10">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                        <span className="font-body font-semibold text-white text-sm">
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-body font-semibold text-forest-700 text-sm">
                          {t.author}
                        </p>
                        <p className="font-body text-xs text-sage-500 mt-0.5">
                          {t.location}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="font-body text-[10px] tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-sage-200 hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center transition-all duration-200 bg-white shadow-sm"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4 text-sage-600" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === current
                      ? "w-8 h-2.5 bg-amber-500"
                      : "w-2.5 h-2.5 bg-cream-300 hover:bg-sage-300"
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-sage-200 hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center transition-all duration-200 bg-white shadow-sm"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4 text-sage-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
