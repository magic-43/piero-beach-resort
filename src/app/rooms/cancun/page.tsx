import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Cancún Room – Beachside Accommodation",
  description: "Stay in our vibrant Cancún Room just steps away from the shoreline at Piero Beach Resort.",
};

export default async function CancunPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("cancun"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
