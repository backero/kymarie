"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useSearch } from "@/hooks/useSearch";
import { CartDrawer } from "./CartDrawer";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop",        href: "/products"     },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Our Story",   href: "/#about"       },
];

export function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  const { data: session } = useSession();
  const { getItemCount, openCart } = useCart();
  const { openMobile }             = useSearch();
  const pathname  = usePathname();
  const menuRef   = useRef<HTMLDivElement>(null);

  const count   = mounted ? getItemCount() : 0;
  const isUser  = mounted && session?.user?.role === "user";
  const isAdmin = mounted && session?.user?.role === "admin";

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  return (
    <>
      {/* ── Main bar ── */}
      <motion.header
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-2xl border-b border-cream-200 shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="relative flex items-center h-[62px]">

            {/* ── Logo (left) ── */}
            <Link href="/" aria-label="Kumarie home" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="Kumarie"
                width={130}
                height={52}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* ── Nav links (absolute center) ── */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 font-body text-[13px] tracking-wide transition-colors duration-200",
                      active ? "text-forest-600" : "text-sage-500 hover:text-forest-600"
                    )}
                  >
                    {link.label}
                    {/* Active underline dot */}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {/* Hover underline */}
                    {!active && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-forest-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Actions (right) ── */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Search */}
              <button
                onClick={openMobile}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-black/5 transition-all duration-150"
                aria-label="Search"
              >
                <Search className="w-4 h-4" strokeWidth={1.75} />
              </button>

              {/* Account */}
              {mounted && (
                isUser || isAdmin ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setUserMenuOpen(v => !v)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
                      aria-label="Account"
                    >
                      <div className="w-6 h-6 rounded-full bg-forest-500 flex items-center justify-center">
                        <span className="font-body text-[9px] font-bold text-white leading-none">{initials}</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -6 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl border border-cream-200 shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-cream-100">
                            <p className="font-body text-sm font-medium text-forest-700 truncate">{session?.user?.name}</p>
                            <p className="font-body text-xs text-sage-400 truncate">{session?.user?.email}</p>
                          </div>
                          <div className="py-1">
                            {isUser && (
                              <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[13px] text-sage-600 hover:text-forest-600 hover:bg-cream-50 transition-colors">
                                <User className="w-3.5 h-3.5" strokeWidth={1.5} />My Account
                              </Link>
                            )}
                            {isAdmin && (
                              <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[13px] text-sage-600 hover:text-forest-600 hover:bg-cream-50 transition-colors">
                                <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.5} />Admin Panel
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-cream-100 py-1">
                            <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                              className="flex items-center gap-2.5 w-full px-4 py-2.5 font-body text-[13px] text-sage-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login"
                    className="hidden sm:flex items-center h-8 px-4 rounded-full font-body text-[13px] font-medium bg-forest-500 text-white hover:bg-forest-400 transition-colors duration-200 ml-1">
                    Sign In
                  </Link>
                )
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-black/5 transition-all duration-150"
                aria-label={`Cart${count > 0 ? ` (${count})` : ""}`}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                <AnimatePresence mode="popLayout">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 24 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none"
                    >
                      {count > 9 ? "9+" : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-sage-400 hover:text-forest-600 hover:bg-black/5 transition-all duration-150 ml-0.5"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-4.5 h-4.5" strokeWidth={1.5} />
                    </motion.span>
                  ) : (
                    <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-4.5 h-4.5" strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Scroll progress bar ── */}
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber-400 z-50"
        />

        {/* ── Mobile panel ── */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-cream-200 bg-white/95 backdrop-blur-xl"
            >
              <nav className="px-6 py-5 flex flex-col gap-0.5">
                {NAV_LINKS.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.25 }}>
                    <Link href={link.href} onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-3.5 border-b border-cream-100 font-body text-[15px] transition-colors",
                        pathname === link.href ? "text-forest-600 font-medium" : "text-sage-600 hover:text-forest-600"
                      )}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-4">
                  {mounted && (isUser || isAdmin) ? (
                    <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-body text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" strokeWidth={1.5} />Sign Out
                    </button>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center py-3.5 rounded-full font-body text-sm font-semibold bg-forest-500 text-white hover:bg-forest-400 transition-colors">
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchBar />
      <CartDrawer />
    </>
  );
}
