import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BedDouble, Users, Wind, Thermometer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CIELO_ROOM_FALLBACKS: Record<string, string> = {
  "mini-cabin": "/images/cielo/mini-cabin/photo_1_2026-08-26_10-08-37.jpg",
  "regular-cabin": "/images/cielo/regular-cabin/photo_1_2026-08-26_10-16-44.jpg",
  "family-cabin": "/images/cielo/family-cabin/photo_1_2026-08-26_10-17-14.jpg",
  "holiday-room-1": "/images/cielo/holiday-room-1/photo_1_2026-08-26_10-18-23.jpg",
  "holiday-room-2-3": "/images/cielo/holiday-room-2-3/photo_1_2026-08-26_10-19-35.jpg",
  "loft-cabin": "/images/cielo/loft-cabin/photo_1_2026-08-26_10-20-21.jpg",
};

export default async function CieloRoomsPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", "cielo")
    .order("name");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {rooms?.map((room) => {
          const imageUrl = room.image || CIELO_ROOM_FALLBACKS[room.slug] || "";

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col sm:flex-row h-auto group hover:shadow-md transition-shadow"
            >
              <div className="relative w-full sm:w-2/5 h-48 sm:h-full min-h-[200px] bg-gray-100 shrink-0 overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <BedDouble className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 text-white text-right drop-shadow-md">
                  <span className="font-serif text-xl">
                    ₱{Number(room.regular_rate).toLocaleString()}
                    <span className="text-[10px] opacity-80 font-sans uppercase tracking-widest"> / night</span>
                  </span>
                  {room.has_ac && room.ac_surcharge > 0 && (
                    <p className="text-[10px] opacity-75">+₱{Number(room.ac_surcharge).toLocaleString()} for AC</p>
                  )}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-xl text-gray-900">{room.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${room.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {room.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 opacity-50 shrink-0" />
                      <span>{room.standard_guests} base guests · max +{room.max_extra_guests} extra</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.has_fan && <><Wind className="w-4 h-4 opacity-50 shrink-0" /><span>Fan</span></>}
                      {room.has_ac && <><Thermometer className="w-4 h-4 opacity-50 shrink-0" /><span>AC option (+₱{Number(room.ac_surcharge).toLocaleString()})</span></>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{room.short_description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Link
                    href={`/admin/cielo/rooms/${room.id}`}
                    className="flex-1 text-center bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors"
                  >
                    Edit Room
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
