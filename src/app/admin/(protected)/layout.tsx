import { requireAdmin } from "@/lib/admin/auth";
import { LogOut } from "lucide-react";
import { adminLogout } from "@/lib/admin/actions";
import { AdminSidebar, AdminBottomNav, AdminMobileHeader, AdminDesktopHeader, AdminPageHeader } from "./admin-nav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-resort-offwhite font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-resort-white border-r border-resort-cocoa/10 shrink-0 fixed top-0 left-0 h-screen z-40 print:hidden">
        <AdminDesktopHeader />
        <AdminSidebar />
        <div className="p-4 border-t border-resort-cocoa/10">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Header */}
      <AdminMobileHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:pb-0 pb-20 md:pl-64">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AdminPageHeader />
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}
