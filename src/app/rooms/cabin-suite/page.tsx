import { notFound } from "next/navigation";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export default async function CabinSuitePage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("cabin-suite"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
