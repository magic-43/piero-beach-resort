import { notFound } from "next/navigation";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export default async function CabinVillaPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("cabin-villa"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
