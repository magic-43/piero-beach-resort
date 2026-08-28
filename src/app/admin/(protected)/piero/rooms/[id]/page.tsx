import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { resort } from "@/data/resort";
import { RoomEditForm } from "@/app/admin/(protected)/rooms/[id]/room-edit-form";

export const dynamic = "force-dynamic";

export default async function PieroRoomEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createAdminClient();

  const [{ data: room }, { data: settings }] = await Promise.all([
    supabase.from("rooms").select("*").eq("id", id).eq("property_id", "piero").single(),
    supabase.from("resort_settings").select("global_discount_percentage").eq("id", 1).single(),
  ]);

  if (!room) notFound();

  const fallbackRoom = resort.rooms.find((item) => item.slug === room.slug || item.id === room.id);
  const standardGuests =
    typeof room.standard_guests === "number"
      ? room.standard_guests
      : fallbackRoom
        ? fallbackRoom.maxGuests - fallbackRoom.extraGuestAllowance
        : 1;
  const maxExtraGuests =
    typeof room.max_extra_guests === "number"
      ? room.max_extra_guests
      : fallbackRoom?.extraGuestAllowance ?? 0;

  return (
    <RoomEditForm
      room={{
        id: room.id,
        slug: room.slug || fallbackRoom?.slug || room.id,
        name: room.name || fallbackRoom?.name || "Untitled Room",
        category: room.category || fallbackRoom?.category || "Room",
        description: room.description || fallbackRoom?.description || "",
        short_description: room.short_description || fallbackRoom?.shortDescription || "",
        image: room.image || fallbackRoom?.image || "",
        gallery: room.gallery?.length ? room.gallery : fallbackRoom?.gallery || [],
        beds: room.beds || fallbackRoom?.beds || "",
        standard_guests: standardGuests,
        max_extra_guests: maxExtraGuests,
        breakfast_guests:
          typeof room.breakfast_guests === "number" ? room.breakfast_guests : fallbackRoom?.breakfastIncluded || 0,
        capacity_label:
          room.capacity_label || fallbackRoom?.capacityLabel || `Good for ${standardGuests} guest${standardGuests === 1 ? "" : "s"}`,
        amenities: room.amenities?.length ? room.amenities : fallbackRoom?.amenities || [],
        size: room.size || fallbackRoom?.size || "",
        view: room.view || fallbackRoom?.view || "",
        regular_rate: room.regular_rate ?? fallbackRoom?.regularRate ?? 0,
        discounted_rate: room.discounted_rate ?? fallbackRoom?.discountedRate ?? 0,
        is_active: room.is_active !== false,
        details_href: fallbackRoom?.detailsHref || `/rooms/${room.slug || room.id}`,
      }}
      globalDiscountPercentage={Number(settings?.global_discount_percentage) || 0}
    />
  );
}
