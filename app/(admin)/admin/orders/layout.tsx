import { getAdminFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Bell, Search } from "lucide-react";

export default async function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  const initials = admin.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-[#F5F4F0]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/70 px-6 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <div className="flex items-center gap-2 bg-[#F5F4F0] border border-neutral-200 rounded-xl px-3 py-2 flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search…"
                className="bg-transparent font-body text-sm text-neutral-600 placeholder-neutral-400 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors text-neutral-500">
              <Bell className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <div className="w-px h-6 bg-neutral-200" />
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right">
                <p className="font-body text-sm font-medium text-neutral-800 leading-none">{admin.name}</p>
                <p className="font-body text-[11px] text-neutral-400 mt-0.5">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                <span className="font-body text-xs font-bold text-white">{initials}</span>
              </div>
              <div className="relative -ml-3 -mt-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white block" />
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
