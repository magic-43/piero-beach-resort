import { notFound } from "next/navigation";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export default async function FamilyRoomPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("family-room"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
