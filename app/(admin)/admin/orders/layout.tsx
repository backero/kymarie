import { getAdminFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
              <span className="font-body text-xs font-semibold text-forest-700">
                {admin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-body text-sm text-gray-600">{admin.name}</span>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
