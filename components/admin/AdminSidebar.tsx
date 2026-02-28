"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Settings,
  Tag,
  ExternalLink,
} from "lucide-react";
import { adminLogout } from "@/actions/admin";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        children: [
          { label: "All Products", href: "/admin/products" },
          { label: "Add New", href: "/admin/products/new" },
        ],
      },
      { label: "Categories", href: "/admin/categories", icon: Tag },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      router.push("/admin/login");
    }
    toast.success("Logged out successfully");
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-forest-700 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        <Image
          src="/logo.png"
          alt="Kumarie"
          width={100}
          height={40}
          className="h-8 w-auto object-contain brightness-0 invert"
        />
        <span className="font-body text-[9px] tracking-widest uppercase text-amber-400 font-semibold mt-0.5 border border-amber-400/40 rounded px-1.5 py-0.5">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-white/25 px-3 mb-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200 relative",
                        isActive
                          ? "bg-white/12 text-white font-medium"
                          : "text-white/50 hover:bg-white/6 hover:text-white/80"
                      )}
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-amber-400 rounded-r-full" />
                      )}
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0 transition-colors",
                          isActive ? "text-amber-400" : "text-white/40 group-hover:text-white/70"
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="flex-1">{item.label}</span>
                      {"children" in item && item.children && (
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 transition-transform text-white/30",
                            isActive && "rotate-90 text-white/60"
                          )}
                        />
                      )}
                    </Link>

                    {/* Sub-items */}
                    {"children" in item && item.children && isActive && (
                      <div className="ml-10 mt-0.5 space-y-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 text-xs font-body transition-colors rounded-lg",
                              pathname === child.href
                                ? "text-amber-400 font-medium"
                                : "text-white/40 hover:text-white/70"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1 h-1 rounded-full flex-shrink-0",
                                pathname === child.href ? "bg-amber-400" : "bg-white/30"
                              )}
                            />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 w-full px-3 py-2 text-xs font-body text-white/40 hover:text-white/70 hover:bg-white/6 rounded-xl transition-all duration-200"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-xs font-body text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
