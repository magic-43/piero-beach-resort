import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Cabin Suite – Beachfront Accommodation",
  description: "Relax in our Cabin Suite featuring private dipping tub, queen bed, and beachfront views.",
};

export default async function CabinSuitePage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("cabin-suite"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
