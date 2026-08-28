import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CieloManualConfirmationPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  // Fetch pending Cielo bookings for manual review
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      reference,
      guest_name,
      guest_email,
      guest_phone,
      check_in,
      check_out,
      adult_guests,
      grand_total,
      status,
      created_at,
      rooms(name, slug)
    `)
    .eq("property_id", "cielo")
    .in("status", ["awaiting_payment", "pending_review"])
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
        Showing Cielo Alto Place bookings requiring action.
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 font-medium">No pending bookings for Cielo Alto Place.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;
            return (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{booking.guest_name}</p>
                    <p className="text-sm text-gray-500">{booking.guest_email} · {booking.guest_phone}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {room?.name} · {format(new Date(booking.check_in), "MMM d")} – {format(new Date(booking.check_out), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm font-medium text-emerald-700 mt-1">₱{Number(booking.grand_total).toLocaleString()} total</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === "pending_review" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                      {booking.status.replace("_", " ")}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">{booking.reference}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <Link
                    href={`/admin/cielo/payments/${booking.reference}`}
                    className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors"
                  >
                    Review Booking →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
