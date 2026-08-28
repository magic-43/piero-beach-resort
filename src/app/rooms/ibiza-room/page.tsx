import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Ibiza Room – Coastal Luxury Suite",
  description: "Relax in the serene Ibiza Room with modern amenities and breezy coastal views at Piero Beach Resort.",
};

export default async function IbizaRoomPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("ibiza-room"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
