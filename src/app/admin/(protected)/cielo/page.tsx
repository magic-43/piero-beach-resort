import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { CreditCard, Building, ArrowDownLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface BookingData {
  reference: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  rooms: { name: string } | { name: string }[] | null;
}

interface SubmissionData {
  id: string;
  amount_claimed: number;
  payment_method: string;
  created_at: string;
  bookings: BookingData | BookingData[] | null;
}

export default async function CieloDashboardPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const [
    { data: submissionsData },
    { count: roomsCount },
    { data: settingsData }
  ] = await Promise.all([
    supabase
      .from("payment_submissions")
      .select(`
        id,
        amount_claimed,
        payment_method,
        created_at,
        bookings!inner (
          reference,
          guest_name,
          check_in,
          check_out,
          rooms(name)
        )
      `)
      .eq("bookings.property_id", "cielo")
      .order("created_at", { ascending: false }),
    supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("property_id", "cielo"),
    supabase
      .from("resort_settings")
      .select("extra_person_fee, ac_surcharge")
      .eq("id", 2)
      .single()
  ]);

  const submissions = (submissionsData as unknown as SubmissionData[]) || [];
  const totalEarnings = submissions.reduce((sum, sub) => sum + (Number(sub.amount_claimed) || 0), 0);
  const totalPayments = submissions.length;

  const groupedSubmissions = submissions.reduce((groups: Record<string, SubmissionData[]>, sub) => {
    const dateStr = format(new Date(sub.created_at), "yyyy-MM-dd");
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(sub);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSubmissions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const getDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "TODAY";
    if (isYesterday(date)) return "YESTERDAY";
    return format(date, "d MMMM yyyy").toUpperCase();
  };

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden font-sans pb-6 bg-[#f8f5f0] -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 min-h-[100dvh] flex flex-col">
        <div className="mx-4 bg-white text-resort-cocoa rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mt-2">
          <div className="p-6 relative z-10 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Collected</p>
                <h1 className="text-4xl font-light tracking-tight text-resort-cocoa flex items-baseline">
                  <span className="text-2xl text-slate-400 font-light mr-1">₱</span>
                  {totalEarnings.toLocaleString()}
                </h1>
              </div>
              <div className="flex flex-col space-y-3 text-right mt-1">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Active Rooms</p>
                  <p className="font-semibold text-resort-cocoa text-sm">{roomsCount || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Extra Pax</p>
                  <p className="font-semibold text-resort-cocoa text-sm">₱{Number(settingsData?.extra_person_fee || 500).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Transactions</p>
                  <p className="font-semibold text-resort-cocoa text-sm">{totalPayments}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex-1 flex flex-col">
          <div className="px-6 mb-4">
            <h2 className="font-serif text-xl font-bold text-resort-cocoa">Payment History</h2>
          </div>
          {submissions.length === 0 ? (
            <div className="p-16 text-center text-gray-400">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <CreditCard className="w-6 h-6 opacity-50 text-slate-500" />
              </div>
              <p className="font-medium text-slate-600">No transactions yet</p>
            </div>
          ) : (
            <div className="px-4 space-y-6 flex-1 pb-6">
              {sortedDates.map((dateStr) => (
                <div key={dateStr} className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 tracking-widest pl-2 uppercase">{getDateHeader(dateStr)}</h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {groupedSubmissions[dateStr].map((sub) => {
                        const booking = Array.isArray(sub.bookings) ? sub.bookings[0] : sub.bookings;
                        const roomName = (Array.isArray(booking?.rooms) ? booking?.rooms[0]?.name : booking?.rooms?.name) || "Unknown Room";
                        const isGCash = sub.payment_method === "gcash";
                        return (
                          <Link
                            key={sub.id}
                            href={`/admin/cielo/payments/${booking?.reference}`}
                            className="flex items-center p-4 hover:bg-gray-50/50 transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 shadow-sm border ${isGCash ? "bg-[#007DFE]/10 border-[#007DFE]/20" : "bg-emerald-50 border-emerald-100"}`}>
                              {isGCash ? <ArrowDownLeft className="w-5 h-5 text-[#007DFE]" /> : <Building className="w-5 h-5 text-emerald-600" />}
                            </div>
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="text-[14px] font-bold text-resort-cocoa truncate">{booking?.guest_name}</p>
                              <p className="text-[12px] text-slate-500 truncate mt-0.5">{isGCash ? "GCash" : "Bank"} · {roomName}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[14px] font-bold text-emerald-600">+₱{Number(sub.amount_claimed).toLocaleString()}</p>
                              <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">{booking?.reference}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex flex-col space-y-6 font-sans pb-12 text-resort-cocoa">
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Collected</p>
            <p className="font-serif text-3xl">₱{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active Rooms</p>
            <p className="font-serif text-3xl">{roomsCount || 0}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Extra Pax Fee</p>
            <p className="font-serif text-3xl">₱{Number(settingsData?.extra_person_fee || 500).toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transactions</p>
            <p className="font-serif text-3xl">{totalPayments}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100/50">
            <h2 className="font-serif text-xl">Recent Activity — Cielo Alto</h2>
          </div>
          {submissions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-600">No transactions yet for Cielo Alto Place.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                  <th className="py-4 px-6">Guest</th>
                  <th className="py-4 px-6">Reference</th>
                  <th className="py-4 px-6">Room</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((sub: SubmissionData) => {
                  const booking = Array.isArray(sub.bookings) ? sub.bookings[0] : sub.bookings;
                  const roomName = (Array.isArray(booking?.rooms) ? booking?.rooms[0]?.name : booking?.rooms?.name) || "Unknown Room";
                  const isGCash = sub.payment_method === "gcash";
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <Link href={`/admin/cielo/payments/${booking?.reference}`} className="font-medium hover:text-emerald-700 transition-colors">
                          {booking?.guest_name}
                        </Link>
                      </td>
                      <td className="py-4 px-6"><span className="text-gray-400 font-medium">{booking?.reference}</span></td>
                      <td className="py-4 px-6"><span className="text-gray-500 font-medium">{roomName}</span></td>
                      <td className="py-4 px-6"><span className="text-gray-500 font-medium">{format(new Date(sub.created_at), "MMM d, yyyy")}</span></td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isGCash ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {isGCash ? "GCash" : "Bank"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-serif text-xl tracking-tight">+₱{Number(sub.amount_claimed).toLocaleString()}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
