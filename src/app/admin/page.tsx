import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminPropertySelector() {
  await requireAdmin();

  const properties = [
    {
      id: "piero",
      name: "Piero Beach Resort",
      tagline: "Beach resort in Batangas",
      href: "/admin/piero",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      icon: "🏖️",
      accent: "text-amber-700",
      btn: "bg-amber-700 hover:bg-amber-800",
    },
    {
      id: "cielo",
      name: "Cielo Alto Place",
      tagline: "Mountain resort in Tanay, Rizal",
      href: "/admin/cielo",
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      icon: "⛰️",
      accent: "text-emerald-700",
      btn: "bg-emerald-700 hover:bg-emerald-800",
    },
  ];

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Admin Portal</p>
          <h1 className="font-serif text-3xl text-gray-800">Which property?</h1>
          <p className="text-gray-500 mt-2 text-sm">Select a property to manage</p>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className={`group flex flex-col rounded-2xl border ${p.border} bg-gradient-to-br ${p.bg} p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                {p.icon}
              </div>
              <h2 className={`font-serif text-xl font-bold ${p.accent} leading-tight`}>{p.name}</h2>
              <p className="text-sm text-gray-500 mt-1 mb-5">{p.tagline}</p>
              <div className={`mt-auto inline-flex items-center justify-center w-full py-2.5 rounded-lg text-white text-sm font-semibold ${p.btn} transition-colors`}>
                Manage →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
          <span>Logged in as admin ·</span>
          <form action="/api/admin/logout" method="post" className="inline">
            <button type="submit" className="underline hover:text-gray-600 cursor-pointer">Sign out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
