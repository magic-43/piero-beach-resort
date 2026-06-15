import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { resort, type ResortRoom } from "@/data/resort";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResortData(initialData?: any) {
  const [rooms, setRooms] = useState<ResortRoom[]>(resort.rooms);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>(initialData?.settings || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResortData = async () => {
      const supabase = createClient();
      try {
        const [settingsRes, roomsRes] = await Promise.all([
          supabase.from("resort_settings").select("*").eq("id", 1).single(),
          supabase.from("rooms").select("*"),
        ]);

        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }

        if (roomsRes.data) {
          const updatedRooms = resort.rooms.map((room) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dbRoom = roomsRes.data.find((r: any) => r.slug === room.slug || r.id === room.id);
            if (dbRoom) {
              return {
                ...room,
                category: dbRoom.category || room.category,
                description: dbRoom.description || room.description,
                shortDescription: dbRoom.short_description || room.shortDescription,
                image: dbRoom.image || room.image,
                gallery: dbRoom.gallery || room.gallery,
                beds: dbRoom.beds || room.beds,
                capacityLabel: dbRoom.capacity_label || room.capacityLabel,
                amenities: dbRoom.amenities || room.amenities,
                size: dbRoom.size || room.size,
                view: dbRoom.view || room.view,
                regularRate: dbRoom.regular_rate ?? room.regularRate,
                discountedRate: dbRoom.discounted_rate ?? room.discountedRate,
              };
            }
            return room;
          });
          setRooms(updatedRooms);
        }
      } catch (e) {
        console.error("Failed to fetch resort data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchResortData();
  }, []);

  return { rooms, settings, loading };
}
