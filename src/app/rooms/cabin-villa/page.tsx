import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Cabin Villa – Premium Suite with Jacuzzi",
  description: "Experience the Cabin Villa with private jacuzzi, ocean views, and space for up to 5 guests.",
};

export default async function CabinVillaPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("cabin-villa"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
