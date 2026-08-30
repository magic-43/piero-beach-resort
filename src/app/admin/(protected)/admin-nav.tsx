"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bed, Settings, LogOut, FileText, ArrowLeftRight, Image as ImageIcon } from "lucide-react";
import { adminLogout } from "@/lib/admin/actions";

type Property = "piero" | "cielo";

function getProperty(pathname: string): Property | null {
  if (pathname.startsWith("/admin/piero")) return "piero";
  if (pathname.startsWith("/admin/cielo")) return "cielo";
  return null;
}

const propertyMeta: Record<Property, { label: string; color: string; badge: string }> = {
  piero: {
    label: "Piero Beach Resort",
    color: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  cielo: {
    label: "Cielo Alto Place",
    color: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export function AdminSidebar() {
  const pathname = usePathname();
  const property = getProperty(pathname);
  const base = property ? `/admin/${property}` : "/admin";

  const navItems = property
    ? property === "cielo"
      ? [
          { label: "Dashboard", href: base, icon: Home },
          { label: "Rooms", href: `${base}/rooms`, icon: Bed },
          { label: "Payment Poster", href: `${base}/payment-poster`, icon: ImageIcon },
          { label: "Settings", href: `${base}/settings`, icon: Settings },
        ]
      : [
          { label: "Dashboard", href: base, icon: Home },
          { label: "Rooms", href: `${base}/rooms`, icon: Bed },
          { label: "Manual Confirmation", href: `${base}/manual-confirmation`, icon: FileText },
          // { label: "Payment Poster", href: `${base}/payment-poster`, icon: ImageIcon },
          { label: "Settings", href: `${base}/settings`, icon: Settings },
        ]
    : [];

  return (
    <nav className="flex-1 py-4 px-4 space-y-1 print:hidden">
      {/* Active Property Badge in Sidebar (Switch button moved to dashboard header) */}
      {property && (
        <div className="mb-4 px-1">
          <div className={`px-3 py-2 rounded-lg ${propertyMeta[property].badge} text-xs font-bold uppercase tracking-wider text-center shadow-xs`}>
            {propertyMeta[property].label}
          </div>
        </div>
      )}

      {navItems.map((item) => {
        const isActive = item.href === base ? pathname === base : pathname.startsWith(item.href);
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
  const property = getProperty(pathname);
  const base = property ? `/admin/${property}` : "/admin";

  const hideBottomNav = /^\/admin\/(piero|cielo)\/rooms\/[^/]+$/.test(pathname);
  if (hideBottomNav) return null;

  if (!property) return null;

  const navItems =
    property === "cielo"
      ? [
          { label: "Home", href: base, icon: Home },
          { label: "Rooms", href: `${base}/rooms`, icon: Bed },
          { label: "Poster", href: `${base}/payment-poster`, icon: ImageIcon },
          { label: "Settings", href: `${base}/settings`, icon: Settings },
        ]
      : [
          { label: "Home", href: base, icon: Home },
          { label: "Rooms", href: `${base}/rooms`, icon: Bed },
          { label: "Manual Conf", href: `${base}/manual-confirmation`, icon: FileText },
          // { label: "Poster", href: `${base}/payment-poster`, icon: ImageIcon },
          { label: "Settings", href: `${base}/settings`, icon: Settings },
        ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-resort-white border-t border-resort-cocoa/10 flex justify-around items-center h-[72px] px-2 z-50 safe-area-bottom pb-env-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] print:hidden">
      {navItems.map((item) => {
        const isActive = item.href === base ? pathname === base : pathname.startsWith(item.href);
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
  const pathname = usePathname();
  const property = getProperty(pathname);

  return (
    <div className="p-6 border-b border-resort-cocoa/10 print:hidden">
      <h2 className="font-serif text-xl text-resort-cocoa tracking-wide">
        {property === "cielo" ? "Cielo Admin" : property === "piero" ? "Piero Admin" : "Admin Portal"}
      </h2>
    </div>
  );
}

export function AdminPageHeader() {
  const pathname = usePathname();
  const property = getProperty(pathname);
  const base = property ? `/admin/${property}` : "/admin";

  let pageTitle = "Admin";
  if (pathname === base) pageTitle = "Hi, Admin";
  else if (pathname.includes("/rooms")) pageTitle = "Rooms";
  else if (pathname.includes("/manual-confirmation")) pageTitle = "Manual Confirmation";
  else if (pathname.includes("/payment-poster")) pageTitle = "Payment Poster";
  else if (pathname.includes("/settings")) pageTitle = "Settings";
  else if (pathname.includes("/payments")) pageTitle = "Payments";

  const isHomePage = pathname === base;

  return (
    <div className="hidden md:flex items-center justify-between mb-8 mt-2 print:hidden">
      <div>
        <h1 className="font-serif text-3xl text-resort-cocoa tracking-wide">{pageTitle}</h1>
        {isHomePage && property && (
          <p className="text-xs text-resort-cocoa/60 mt-1 font-medium">
            Managing {propertyMeta[property]?.label}
          </p>
        )}
      </div>

      {/* Switch Property button on the far right of 'Hi Admin' on Desktop */}
      {isHomePage && (
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-resort-sand/60 hover:bg-resort-sand text-resort-cocoa text-xs font-semibold uppercase tracking-wider transition-colors border border-resort-cocoa/10 shadow-xs"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Switch Property</span>
        </Link>
      )}
    </div>
  );
}

export function AdminMobileHeader() {
  const pathname = usePathname();
  const property = getProperty(pathname);
  const base = property ? `/admin/${property}` : "/admin";

  let pageTitle = "Admin";
  if (pathname === base) pageTitle = "Hi, Admin";
  else if (pathname.includes("/rooms")) pageTitle = "Rooms";
  else if (pathname.includes("/manual-confirmation")) pageTitle = "Manual Confirmation";
  else if (pathname.includes("/payment-poster")) pageTitle = "Payment Poster";
  else if (pathname.includes("/settings")) pageTitle = "Settings";
  else if (pathname.includes("/payments")) pageTitle = "Payments";

  return (
    <div className="md:hidden flex items-center justify-between px-6 py-5 bg-resort-offwhite sticky top-0 z-40 print:hidden border-b border-resort-cocoa/10">
      <h2 className="font-serif text-xl text-resort-cocoa tracking-wide">{pageTitle}</h2>
      
      {/* Mobile Top Right Header: Switch Property button right next to Settings */}
      <div className="flex items-center gap-1">
        <Link
          href="/admin"
          title="Switch Property"
          className="p-2 text-resort-cocoa/70 hover:text-resort-cocoa hover:bg-resort-sand/40 rounded-lg transition-colors flex items-center justify-center"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </Link>

        {!pathname.includes("/settings") ? (
          <Link
            href={`${base}/settings`}
            title="Settings"
            className="p-2 text-resort-cocoa/70 hover:text-resort-cocoa hover:bg-resort-sand/40 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        ) : (
          <form action={adminLogout}>
            <button
              type="submit"
              title="Sign out"
              className="p-2 -mr-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
