import { resort, type ResortRoom } from "@/data/resort";

type RoomRecord = Partial<{
  id: string;
  slug: string;
  name: string;
  category: ResortRoom["category"];
  description: string;
  short_description: string;
  image: string;
  gallery: string[] | null;
  beds: string;
  standard_guests: number;
  max_extra_guests: number;
  breakfast_guests: number;
  capacity_label: string;
  amenities: string[] | null;
  size: string;
  view: string;
  regular_rate: number;
  discounted_rate: number;
  is_active: boolean;
}>;

function buildCapacityLabel(standardGuests: number) {
  return `Good for ${standardGuests} guest${standardGuests === 1 ? "" : "s"}`;
}

export function mergeRoomsWithFallback(roomsData?: RoomRecord[] | null) {
  if (!roomsData || roomsData.length === 0) {
    return [...resort.rooms];
  }

  return resort.rooms.flatMap((fallbackRoom) => {
    const dbRoom = roomsData.find((room) => room.slug === fallbackRoom.slug || room.id === fallbackRoom.id);

    if (!dbRoom) {
      return [fallbackRoom];
    }

    if (dbRoom.is_active === false) {
      return [];
    }

    const standardGuests =
      typeof dbRoom.standard_guests === "number" && Number.isFinite(dbRoom.standard_guests)
        ? dbRoom.standard_guests
        : fallbackRoom.maxGuests - fallbackRoom.extraGuestAllowance;

    const extraGuestAllowance =
      typeof dbRoom.max_extra_guests === "number" && Number.isFinite(dbRoom.max_extra_guests)
        ? dbRoom.max_extra_guests
        : fallbackRoom.extraGuestAllowance;

    const maxGuests = standardGuests + extraGuestAllowance;

    return [
      {
        ...fallbackRoom,
        name: dbRoom.name || fallbackRoom.name,
        category: dbRoom.category || fallbackRoom.category,
        description: dbRoom.description || fallbackRoom.description,
        shortDescription: dbRoom.short_description || fallbackRoom.shortDescription,
        image: dbRoom.image || fallbackRoom.image,
        gallery: dbRoom.gallery?.length ? dbRoom.gallery : fallbackRoom.gallery,
        beds: dbRoom.beds || fallbackRoom.beds,
        maxGuests,
        capacityLabel: dbRoom.capacity_label || buildCapacityLabel(standardGuests),
        breakfastIncluded:
          typeof dbRoom.breakfast_guests === "number" && Number.isFinite(dbRoom.breakfast_guests)
            ? dbRoom.breakfast_guests
            : fallbackRoom.breakfastIncluded,
        extraGuestAllowance,
        amenities: dbRoom.amenities?.length ? dbRoom.amenities : fallbackRoom.amenities,
        size: dbRoom.size || fallbackRoom.size,
        view: dbRoom.view || fallbackRoom.view,
        regularRate: dbRoom.regular_rate ?? fallbackRoom.regularRate,
        discountedRate: dbRoom.discounted_rate ?? fallbackRoom.discountedRate,
      },
    ];
  });
}
