import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { resort, type ResortRoom } from "@/data/resort";
import { getBookingReminderList, getBookingSettings } from "@/lib/booking-settings";
import { mergeRoomsWithFallback } from "@/lib/room-merge";

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
          setRooms(mergeRoomsWithFallback(roomsRes.data));
        }
      } catch (e) {
        console.error("Failed to fetch resort data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchResortData();
  }, []);

  const bookingSettings = getBookingSettings(settings);
  const bookingReminders = getBookingReminderList(settings);

  return { rooms, settings, loading, bookingSettings, bookingReminders };
}
