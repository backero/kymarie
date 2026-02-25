"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Leaf,
  ChevronRight,
  Settings,
  Tag,
} from "lucide-react";
import { adminLogout } from "@/actions/admin";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add New", href: "/admin/products/new" },
    ],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // Redirect happens in server action
      router.push("/admin/login");
    }
    toast.success("Logged out successfully");
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-forest-700 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-forest-600">
        <Leaf className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
        <div>
          <span className="font-display text-xl text-cream-100 tracking-wide block">
            Kumarie
          </span>
          <span className="font-body text-[10px] tracking-widest uppercase text-cream-500">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
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
                  "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-all duration-200",
                  isActive
                    ? "bg-forest-600 text-cream-100"
                    : "text-cream-400 hover:bg-forest-600/50 hover:text-cream-200"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      isActive && "rotate-90"
                    )}
                  />
                )}
              </Link>

              {/* Sub items */}
              {item.children && isActive && (
                <div className="ml-7 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-xs font-body transition-colors rounded",
                        pathname === child.href
                          ? "text-amber-400"
                          : "text-cream-500 hover:text-cream-200"
                      )}
                    >
                      <span className="w-1 h-1 rounded-full bg-current mr-2.5" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 border-t border-forest-600 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-body text-cream-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
