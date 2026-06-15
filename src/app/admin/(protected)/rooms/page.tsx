import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BedDouble, Users, Coffee } from "lucide-react";
import { resort } from "@/data/resort";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("id");

  return (
    <div className="space-y-8">
      {/* Content */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {rooms?.map((room) => {
          const localRoomData = resort.rooms.find((r) => r.slug === room.slug || r.id === room.id);
          const imageUrl = room.image || localRoomData?.image;
          const slug = room.slug || localRoomData?.slug || room.id;

          return (
            <div key={room.id} className="bg-resort-white rounded-3xl overflow-hidden border border-resort-cocoa/10 shadow-sm flex flex-col sm:flex-row h-auto group hover:shadow-md transition-shadow">
              {/* Image Section */}
              <div className="relative w-full sm:w-2/5 h-56 sm:h-full min-h-[250px] bg-resort-sand shrink-0 overflow-hidden">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={room.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-resort-cocoa/30">
                    <BedDouble className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                
                <div className="absolute top-3 left-3 bg-[#c4a47c] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                  50% OFF
                </div>
                
                <div className="absolute bottom-3 right-3 text-white px-2 py-1 flex flex-col items-end text-right drop-shadow-md">
                  <span className="line-through opacity-70 text-[10px] font-bold tracking-widest">₱{room.regular_rate.toLocaleString()}</span>
                  <span className="font-serif text-xl">₱{room.discounted_rate.toLocaleString()} <span className="text-[10px] opacity-80 font-sans uppercase tracking-widest">/ night</span></span>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-4">{room.name}</h3>
                  
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-resort-cocoa/70">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 opacity-50 shrink-0" />
                      <span><span className="font-medium text-resort-cocoa/90">{room.standard_guests} std. adults</span> + {room.max_extra_guests} max extra</span>
                    </div>
                    <div className="flex items-center">
                      <Coffee className="w-4 h-4 mr-3 opacity-50 shrink-0" />
                      <span>Breakfast for <span className="font-medium text-resort-cocoa/90">{room.breakfast_guests}</span> included</span>
                    </div>
                    {/* Add static Jacuzzi and Dipping tub info as requested */}
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-3 opacity-50 shrink-0 flex items-center justify-center text-[10px]">✨</span>
                      <span>Jacuzzi included</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-3 opacity-50 shrink-0 flex items-center justify-center text-[10px]">🛁</span>
                      <span>Dipping tub included</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-resort-cocoa/10 flex items-center gap-3">
                   <a 
                     href={`/rooms/${slug}`} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex-1 text-center bg-[#132c4a] text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#132c4a]/90 transition-colors"
                   >
                     View Room
                   </a>
                   <button 
                     disabled
                     className="flex-1 text-center bg-resort-cocoa/5 text-resort-cocoa/40 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-resort-cocoa/10"
                   >
                     Edit Room
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
