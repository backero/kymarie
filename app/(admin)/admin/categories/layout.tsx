import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/admin/login");

  const name = session.user.name ?? "Admin";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen bg-[#F5F4F0]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/70 px-6 md:px-8 py-3.5 flex items-center justify-end sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right">
                <p className="font-body text-sm font-medium text-neutral-800 leading-none">{name}</p>
                <p className="font-body text-[11px] text-neutral-400 mt-0.5">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm">
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
