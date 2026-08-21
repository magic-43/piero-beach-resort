"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bed, Settings, LogOut, FileText, CreditCard } from "lucide-react";
import { adminLogout } from "@/lib/admin/actions";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/admin", icon: Home },
    { label: "Rooms", href: "/admin/rooms", icon: Bed },
    { label: "Manual Confirmation", href: "/admin/manual-confirmation", icon: FileText },
    { label: "Payment Poster", href: "/admin/payment-poster", icon: CreditCard },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-2 print:hidden">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
              isActive
                ? "bg-resort-sand text-resort-cocoa shadow-sm"
                : "text-resort-cocoa/70 hover:bg-resort-sand/50 hover:text-resort-cocoa"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminBottomNav() {
  const pathname = usePathname();
  const hideBottomNav = /^\/admin\/rooms\/[^/]+$/.test(pathname);

  if (hideBottomNav) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/admin", icon: Home },
    { label: "Rooms", href: "/admin/rooms", icon: Bed },
    { label: "Manual Conf", href: "/admin/manual-confirmation", icon: FileText },
    { label: "Poster", href: "/admin/payment-poster", icon: CreditCard },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-resort-white border-t border-resort-cocoa/10 flex justify-around items-center h-[72px] px-2 z-50 safe-area-bottom pb-env-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] print:hidden">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? "text-resort-cocoa" : "text-resort-cocoa/50 hover:text-resort-cocoa/80"
            }`}
          >
            <div className={`p-1.5 rounded-full ${isActive ? "bg-resort-sand/40" : "bg-transparent"}`}>
              <item.icon className={`w-6 h-6 ${isActive ? "fill-resort-sand/20 text-resort-cocoa" : ""}`} />
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${isActive ? "opacity-100" : "opacity-80"}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminDesktopHeader() {
  return (
    <div className="p-6 border-b border-resort-cocoa/10 print:hidden">
      <h2 className="font-serif text-xl text-resort-cocoa tracking-wide">Piero Admin</h2>
    </div>
  );
}

export function AdminPageHeader() {
  const pathname = usePathname();
  
  let pageTitle = "Piero Admin";
  if (pathname === "/admin") pageTitle = "Hi, Admin";
  else if (pathname.startsWith("/admin/rooms")) pageTitle = "Rooms";
  else if (pathname.startsWith("/admin/manual-confirmation")) pageTitle = "Manual Confirmation";
  else if (pathname.startsWith("/admin/settings")) pageTitle = "Settings";
  else if (pathname.startsWith("/admin/payment-poster")) pageTitle = "Payment Poster";
  else if (pathname.startsWith("/admin/payments")) pageTitle = "Payments";

  return (
    <div className="hidden md:block mb-8 mt-2 print:hidden">
      <h1 className="font-serif text-3xl text-resort-cocoa tracking-wide">{pageTitle}</h1>
    </div>
  );
}

export function AdminMobileHeader() {
  const pathname = usePathname();
  
  let pageTitle = "Piero Admin";
  if (pathname === "/admin") pageTitle = "Hi, Admin";
  else if (pathname.startsWith("/admin/rooms")) pageTitle = "Rooms";
  else if (pathname.startsWith("/admin/manual-confirmation")) pageTitle = "Manual Confirmation";
  else if (pathname.startsWith("/admin/settings")) pageTitle = "Settings";
  else if (pathname.startsWith("/admin/payment-poster")) pageTitle = "Payment Poster";
  else if (pathname.startsWith("/admin/payments")) pageTitle = "Payments";

  return (
    <div className="md:hidden flex items-center justify-between px-6 py-5 bg-resort-offwhite sticky top-0 z-40 print:hidden">
      <h2 className="font-serif text-xl text-resort-cocoa tracking-wide">{pageTitle}</h2>
      <div className="flex items-center gap-2">
        {!pathname.startsWith("/admin/settings") ? (
          <Link href="/admin/settings" className="p-2 text-resort-cocoa/70 hover:text-resort-cocoa">
            <Settings className="w-5 h-5" />
          </Link>
        ) : (
          <form action={adminLogout}>
            <button type="submit" className="p-2 -mr-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
