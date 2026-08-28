import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { RoomEditForm } from "@/app/admin/(protected)/rooms/[id]/room-edit-form";

export const dynamic = "force-dynamic";

const CIELO_ROOM_FALLBACKS: Record<string, string> = {
  "mini-cabin": "/images/cielo/mini-cabin/photo_1_2026-08-26_10-08-37.jpg",
  "regular-cabin": "/images/cielo/regular-cabin/photo_1_2026-08-26_10-16-44.jpg",
  "family-cabin": "/images/cielo/family-cabin/photo_1_2026-08-26_10-17-14.jpg",
  "holiday-room-1": "/images/cielo/holiday-room-1/photo_1_2026-08-26_10-18-23.jpg",
  "holiday-room-2-3": "/images/cielo/holiday-room-2-3/photo_1_2026-08-26_10-19-35.jpg",
  "loft-cabin": "/images/cielo/loft-cabin/photo_1_2026-08-26_10-20-21.jpg",
};

export default async function CieloRoomEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .eq("property_id", "cielo")
    .single();

  if (!room) notFound();

  const fallbackImage = room.slug ? CIELO_ROOM_FALLBACKS[room.slug] || "" : "";

  return (
    <RoomEditForm
      room={{
        id: room.id,
        slug: room.slug || room.id,
        name: room.name || "Untitled Room",
        category: room.category || "Cabin",
        description: room.description || "",
        short_description: room.short_description || "",
        image: room.image || fallbackImage,
        gallery: room.gallery || [],
        beds: room.beds || "",
        standard_guests: room.standard_guests ?? 2,
        max_extra_guests: room.max_extra_guests ?? 0,
        breakfast_guests: room.breakfast_guests ?? 2,
        capacity_label: room.capacity_label || `Good for ${room.standard_guests ?? 2} guests`,
        amenities: room.amenities || [],
        size: room.size || "",
        view: room.view || "",
        regular_rate: room.regular_rate ?? 0,
        discounted_rate: room.regular_rate ?? 0,  // Cielo has no discount — rate IS the price
        is_active: room.is_active !== false,
        details_href: `/rooms/${room.slug || room.id}`,
      }}
      globalDiscountPercentage={0}  // No discount model for Cielo
      property="cielo"
    />
  );
}
