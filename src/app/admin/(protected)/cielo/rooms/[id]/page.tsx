import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { RoomEditForm } from "@/app/admin/(protected)/rooms/[id]/room-edit-form";

export const dynamic = "force-dynamic";

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

  return (
    <RoomEditForm
      room={{
        id: room.id,
        slug: room.slug || room.id,
        name: room.name || "Untitled Room",
        category: room.category || "Cabin",
        description: room.description || "",
        short_description: room.short_description || "",
        image: room.image || "",
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
    />
  );
}
