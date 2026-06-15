import { createClient } from "@/lib/supabase/server";
import { resort } from "@/data/resort";

export async function getDynamicRooms() {
  const supabase = await createClient();
  const { data: roomsData } = await supabase.from("rooms").select("*");

  let dynamicRooms = [...resort.rooms];
  if (roomsData && roomsData.length > 0) {
    dynamicRooms = resort.rooms.map((room) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbRoom = roomsData.find((r: any) => r.slug === room.slug || r.id === room.id);
      if (dbRoom) {
        return {
          ...room,
          category: dbRoom.category || room.category,
          description: dbRoom.description || room.description,
          shortDescription: dbRoom.short_description || room.shortDescription,
          image: dbRoom.image || room.image,
          gallery: dbRoom.gallery || room.gallery,
          beds: dbRoom.beds || room.beds,
          capacityLabel: dbRoom.capacity_label || room.capacityLabel,
          amenities: dbRoom.amenities || room.amenities,
          size: dbRoom.size || room.size,
          view: dbRoom.view || room.view,
          regularRate: dbRoom.regular_rate ?? room.regularRate,
          discountedRate: dbRoom.discounted_rate ?? room.discountedRate,
        };
      }
      return room;
    });
  }
  return dynamicRooms;
}
