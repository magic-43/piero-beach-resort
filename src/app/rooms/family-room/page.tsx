import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/room-detail-page";
import { getDynamicRoomById, getDynamicRooms } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Family Room – Spacious Group Suite",
  description: "Spacious Family Room accommodating up to 6 guests with multiple queen beds and breakfast included.",
};

export default async function FamilyRoomPage() {
  const [room, rooms] = await Promise.all([getDynamicRoomById("family-room"), getDynamicRooms()]);
  if (!room) notFound();
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
