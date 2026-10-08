import { createAdminClient } from "@/lib/supabase/admin";
import { mergeRoomsWithFallback } from "@/lib/room-merge";

export async function getDynamicRooms() {
  const supabase = createAdminClient();
  const { data: roomsData } = await supabase
    .from("rooms")
    .select("*")
    .eq("property_id", "piero");
  return mergeRoomsWithFallback(roomsData ?? null);
}

export async function getDynamicRoomById(roomId: string) {
  const rooms = await getDynamicRooms();
  return rooms.find((room) => room.id === roomId) ?? null;
}
