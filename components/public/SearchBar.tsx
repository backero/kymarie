"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
  Sparkles,
  Package,
} from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  thumbnail: string | null;
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string };
}

interface CategoryCount {
  name: string;
  slug: string;
  count: number;
}

interface Suggestion {
  name: string;
  slug: string;
  category: { name: string };
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const TRENDING = [
  "Neem soap",
  "Turmeric bar",
  "Rose facial",
  "Charcoal",
  "Lavender",
  "Gift set",
  "Sandalwood",
];

const MAX_RECENT = 6;
const RECENT_KEY = "kumarie_recent_searches";
const DEBOUNCE_MS = 240;

// ─── Highlight matched query text ─────────────────────────────────────────────
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safe})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-50 text-amber-700 font-semibold not-italic rounded-sm">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

// ─── Main SearchBar (overlay only) ────────────────────────────────────────────
export function SearchBar() {
  const router = useRouter();
  const { mobileOpen, closeMobile, searchCategory, setSearchCategory } = useSearch();

  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<SearchResult[]>([]);
  const [suggestions, setSugg]      = useState<Suggestion[]>([]);
  const [catCounts, setCatCounts]   = useState<CategoryCount[]>([]);
  const [loading, setLoading]       = useState(false);
  const [activeIdx, setActiveIdx]   = useState(-1);
  const [recent, setRecent]         = useState<string[]>([]);

  const inputRef      = useRef<HTMLInputElement>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suggestRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Load recent from localStorage ─────────────────────────────────────────
  useEffect(() => {
    try {
      const s = localStorage.getItem(RECENT_KEY);
      if (s) setRecent(JSON.parse(s));
    } catch { /* ignore */ }
  }, []);

  // ── Auto-focus input when overlay opens ───────────────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setResults([]);
      setSugg([]);
      setLoading(false);
      setActiveIdx(-1);
    }
  }, [mobileOpen]);

  // ── Lock body scroll when overlay is open ─────────────────────────────────
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);
    clearTimeout(suggestRef.current);
    const q = query.trim();

    if (q.length < 2) {
      setResults([]);
      setSugg([]);
      setCatCounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    suggestRef.current = setTimeout(async () => {
      try {
        const catParam = searchCategory !== "all" ? `&category=${searchCategory}` : "";
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=suggestions${catParam}`);
        const data = await res.json();
        setSugg(data.suggestions ?? []);
      } catch { /* ignore */ }
    }, 120);

    debounceRef.current = setTimeout(async () => {
      try {
        const catParam = searchCategory !== "all" ? `&category=${searchCategory}` : "";
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}${catParam}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setCatCounts(data.categoryCounts ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(suggestRef.current);
    };
  }, [query, searchCategory]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const saveRecent = useCallback((term: string) => {
    const t = term.trim();
    if (!t || t === "browse") return;
    setRecent((prev) => {
      const updated = [t, ...prev.filter((s) => s !== t)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const handleSearch = useCallback((term: string) => {
    saveRecent(term);
    closeMobile();
    if (term === "browse") { router.push("/products"); return; }
    const catParam = searchCategory !== "all" ? `&category=${searchCategory}` : "";
    router.push(`/products?search=${encodeURIComponent(term)}${catParam}`);
  }, [router, saveRecent, closeMobile, searchCategory]);

  const handleProduct = useCallback((slug: string) => {
    saveRecent(query);
    closeMobile();
    router.push(`/products/${slug}`);
  }, [router, query, saveRecent, closeMobile]);

  const removeRecent = useCallback((term: string) => {
    setRecent((prev) => {
      const updated = prev.filter((s) => s !== term);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  // ── Keyboard nav ──────────────────────────────────────────────────────────
  const hasQuery   = query.trim().length >= 2;
  const suggCount  = hasQuery ? Math.min(suggestions.length, 4) : 0;
  const totalItems = hasQuery
    ? suggCount + results.length
    : recent.length + TRENDING.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { closeMobile(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx === -1) {
        if (query.trim()) handleSearch(query.trim());
        return;
      }
      if (hasQuery) {
        if (activeIdx < suggCount) {
          handleSearch(suggestions[activeIdx].name);
        } else {
          handleProduct(results[activeIdx - suggCount].slug);
        }
      } else {
        if (activeIdx < recent.length) {
          handleSearch(recent[activeIdx]);
        } else {
          handleSearch(TRENDING[activeIdx - recent.length]);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
            onClick={closeMobile}
          />

          {/* Overlay panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 inset-x-0 z-[100] bg-white shadow-2xl shadow-black/10"
          >
            {/* Search input row */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 bg-cream-100 border border-cream-300 rounded-xl px-4 py-3 focus-within:border-forest-400 focus-within:bg-white transition-all duration-200">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-4 h-4 text-sage-400 animate-spin flex-shrink-0" />
                      </motion.div>
                    ) : (
                      <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Search className="w-4 h-4 text-sage-400 flex-shrink-0" strokeWidth={1.75} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search soaps, ingredients, skin concerns…"
                    className="flex-1 font-body text-sm text-forest-700 placeholder-sage-400 bg-transparent focus:outline-none"
                  />

                  <AnimatePresence>
                    {query && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.12 }}
                        onClick={() => { setQuery(""); setResults([]); setSugg([]); inputRef.current?.focus(); }}
                        className="text-sage-400 hover:text-sage-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={closeMobile}
                  className="font-body text-sm text-sage-500 hover:text-forest-600 transition-colors whitespace-nowrap px-1"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-cream-200" />

            {/* Results area */}
            <div className="max-w-3xl mx-auto overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(85vh - 80px)" }}>
              {hasQuery ? (
                /* ── Search results ── */
                <div>
                  {/* Suggestions */}
                  {suggestions.slice(0, 4).length > 0 && (
                    <div className="border-b border-cream-100">
                      <p className="flex items-center gap-1.5 px-4 sm:px-6 pt-4 pb-2 font-body text-[10px] tracking-widest uppercase text-sage-400 font-semibold">
                        <Search className="w-3 h-3" /> Suggestions
                      </p>
                      <ul>
                        {suggestions.slice(0, 4).map((s, i) => (
                          <li
                            key={`${s.slug}-${i}`}
                            onClick={() => handleSearch(s.name)}
                            onMouseEnter={() => setActiveIdx(i)}
                            className={`flex items-center gap-3 px-4 sm:px-6 py-2.5 cursor-pointer transition-colors ${
                              activeIdx === i ? "bg-cream-100" : "hover:bg-cream-50"
                            }`}
                          >
                            <Search className="w-3.5 h-3.5 text-sage-300 flex-shrink-0" strokeWidth={1.5} />
                            <span className="font-body text-sm text-forest-700 flex-1 truncate">
                              <HighlightedText text={s.name} query={query} />
                            </span>
                            <span className="font-body text-[10px] text-sage-400 bg-cream-100 border border-cream-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                              in {s.category.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-sage-300 flex-shrink-0" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Category filter pills */}
                  {catCounts.length > 1 && (
                    <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-cream-100 overflow-x-auto scrollbar-hide">
                      <button
                        onClick={() => setSearchCategory("all")}
                        className={`flex-shrink-0 font-body text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                          searchCategory === "all"
                            ? "bg-forest-500 border-forest-500 text-white"
                            : "bg-white border-cream-300 text-sage-600 hover:border-forest-300"
                        }`}
                      >
                        All ({catCounts.reduce((a, b) => a + b.count, 0)})
                      </button>
                      {catCounts.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => setSearchCategory(cat.slug)}
                          className={`flex-shrink-0 font-body text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                            searchCategory === cat.slug
                              ? "bg-forest-500 border-forest-500 text-white"
                              : "bg-white border-cream-300 text-sage-600 hover:border-forest-300"
                          }`}
                        >
                          {cat.name} ({cat.count})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Loading */}
                  {loading && results.length === 0 && (
                    <div className="py-12 flex flex-col items-center gap-3">
                      <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
                      <p className="font-body text-xs text-sage-400">Searching…</p>
                    </div>
                  )}

                  {/* No results */}
                  {!loading && results.length === 0 && query.trim().length >= 2 && (
                    <div className="py-12 text-center px-6">
                      <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-5 h-5 text-sage-300" strokeWidth={1.5} />
                      </div>
                      <p className="font-body text-sm font-medium text-forest-700">No results for &ldquo;{query}&rdquo;</p>
                      <p className="font-body text-xs text-sage-400 mt-1">Try a different keyword or browse all products</p>
                      <button
                        onClick={() => handleSearch("browse")}
                        className="mt-4 inline-flex items-center gap-1.5 font-body text-xs text-forest-600 hover:text-forest-500 font-medium border border-cream-300 hover:border-forest-300 rounded-full px-4 py-1.5 transition-colors"
                      >
                        Browse all products <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Product results */}
                  {results.length > 0 && (
                    <>
                      <p className="flex items-center gap-1.5 px-4 sm:px-6 pt-4 pb-2 font-body text-[10px] tracking-widest uppercase text-sage-400 font-semibold">
                        <Sparkles className="w-3 h-3" /> Products
                      </p>
                      <ul>
                        {results.map((product, i) => {
                          const idx = suggCount + i;
                          const discount = product.comparePrice
                            ? calculateDiscount(product.price, product.comparePrice)
                            : 0;
                          return (
                            <li
                              key={product.id}
                              onClick={() => handleProduct(product.slug)}
                              onMouseEnter={() => setActiveIdx(idx)}
                              className={`flex items-center gap-3 px-4 sm:px-6 py-3 cursor-pointer transition-colors border-b border-cream-100 last:border-0 ${
                                activeIdx === idx ? "bg-cream-100" : "hover:bg-cream-50"
                              }`}
                            >
                              {/* Thumbnail */}
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0 border border-cream-200">
                                <Image
                                  src={product.thumbnail || product.images[0] || "/placeholder.jpg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                                {product.isNew && (
                                  <span className="absolute top-0.5 left-0.5 bg-forest-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full leading-none">
                                    NEW
                                  </span>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm text-forest-700 line-clamp-1 font-medium">
                                  <HighlightedText text={product.name} query={query} />
                                </p>
                                <span className="inline-flex items-center gap-1 font-body text-[10px] text-sage-500 mt-0.5">
                                  <Package className="w-2.5 h-2.5" />
                                  {product.category.name}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex-shrink-0 text-right">
                                <p className="font-body text-sm font-semibold text-forest-700">
                                  {formatPrice(product.price)}
                                </p>
                                {product.comparePrice && (
                                  <p className="font-body text-[10px] text-sage-400 line-through">
                                    {formatPrice(product.comparePrice)}
                                  </p>
                                )}
                                {discount > 0 && (
                                  <span className="font-body text-[10px] text-amber-600 font-medium">
                                    {discount}% off
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {/* See all */}
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 border-t border-cream-200 hover:bg-cream-50 transition-colors"
                      >
                        <span className="font-body text-sm text-forest-600 font-medium">
                          See all results for &ldquo;{query}&rdquo;
                        </span>
                        <ArrowRight className="w-4 h-4 text-sage-400" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* ── Empty state: recent + trending ── */
                <div className="px-4 sm:px-6 py-5 space-y-6">
                  {/* Recent */}
                  {recent.length > 0 && (
                    <div>
                      <p className="flex items-center gap-1.5 font-body text-[10px] tracking-widest uppercase text-sage-400 font-semibold mb-3">
                        <Clock className="w-3 h-3" /> Recent searches
                      </p>
                      <ul className="space-y-0.5">
                        {recent.map((term, i) => (
                          <li
                            key={term}
                            onClick={() => handleSearch(term)}
                            onMouseEnter={() => setActiveIdx(i)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              activeIdx === i ? "bg-cream-100" : "hover:bg-cream-50"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-sage-300 flex-shrink-0" strokeWidth={1.5} />
                            <span className="font-body text-sm text-forest-700 flex-1 truncate">{term}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeRecent(term); }}
                              className="text-sage-300 hover:text-sage-500 transition-colors p-0.5 rounded"
                              aria-label={`Remove ${term}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trending */}
                  <div>
                    <p className="flex items-center gap-1.5 font-body text-[10px] tracking-widest uppercase text-sage-400 font-semibold mb-3">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((term, i) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          onMouseEnter={() => setActiveIdx(recent.length + i)}
                          className={`inline-flex items-center font-body text-xs border px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                            activeIdx === recent.length + i
                              ? "bg-cream-200 border-cream-400 text-forest-700"
                              : "bg-white border-cream-300 text-sage-600 hover:border-cream-400 hover:bg-cream-50"
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
