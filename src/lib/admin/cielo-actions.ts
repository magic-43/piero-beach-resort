"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./auth";
import { revalidatePath } from "next/cache";

const CIELO_SETTINGS_ID = 2;

/**
 * Cielo: Update payment settings
 */
export async function cieloUpdatePaymentSettings(data: Record<string, unknown>) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("resort_settings")
      .update({
        bank_transfer_enabled: data.bank_transfer_enabled,
        bank_name: data.bank_name,
        bank_account_name: data.bank_account_name,
        bank_account_number: data.bank_account_number,
        gcash_enabled: data.gcash_enabled,
        gcash_name: data.gcash_name,
        gcash_number: data.gcash_number,
      })
      .or("id.eq.2,property_id.eq.cielo");

    if (error) return { error: "Failed to update payment settings." };
    revalidatePath("/admin/cielo/settings");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Cielo: Update booking settings
 */
export async function cieloUpdateBookingSettings(data: Record<string, unknown>) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("resort_settings")
      .update({
        extra_person_fee: data.extra_person_fee,
        security_deposit: data.security_deposit,
        check_in_time: data.check_in_time,
        check_out_time: data.check_out_time,
      })
      .or("id.eq.2,property_id.eq.cielo");

    if (error) return { error: "Failed to update booking settings." };
    revalidatePath("/admin/cielo/settings");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Cielo: Update site contact details
 */
export async function cieloUpdateSiteDetails(data: {
  site_email: string;
  site_phone: string;
  site_whatsapp: string;
  site_facebook: string;
  site_google_maps: string;
}) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("resort_settings")
      .update({
        site_email: data.site_email,
        site_phone: data.site_phone,
        site_whatsapp: data.site_whatsapp,
        site_facebook: data.site_facebook,
        site_google_maps: data.site_google_maps,
      })
      .or("id.eq.2,property_id.eq.cielo");

    if (error) return { error: "Failed to update site details." };
    revalidatePath("/admin/cielo/settings");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

type UpdateCieloRoomPayload = {
  id: string;
  name: string;
  category: string;
  description: string;
  short_description: string;
  image: string;
  gallery: string[];
  beds: string;
  standard_guests: number;
  max_extra_guests: number;
  breakfast_guests: number;
  capacity_label: string;
  amenities: string[];
  size: string;
  view: string;
  regular_rate: number;
  ac_surcharge: number;
  has_fan: boolean;
  has_ac: boolean;
  is_active: boolean;
};

/**
 * Cielo: Update a room (scoped to property_id = 'cielo')
 */
export async function cieloUpdateRoom(data: UpdateCieloRoomPayload) {
  try {
    await requireAdmin();
    if (!data.id) return { error: "Room ID is required." };
    if (!data.name.trim()) return { error: "Room name is required." };
    if (data.standard_guests < 1) return { error: "Standard guests must be at least 1." };

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("rooms")
      .update({
        name: data.name.trim(),
        category: data.category,
        description: data.description.trim(),
        short_description: data.short_description.trim(),
        image: data.image.trim(),
        gallery: data.gallery,
        beds: data.beds.trim(),
        standard_guests: data.standard_guests,
        max_extra_guests: data.max_extra_guests,
        breakfast_guests: data.breakfast_guests,
        capacity_label: data.capacity_label.trim(),
        amenities: data.amenities,
        size: data.size.trim(),
        view: data.view.trim(),
        regular_rate: data.regular_rate,
        discounted_rate: data.regular_rate, // Cielo uses flat rates (no discount model)
        ac_surcharge: data.ac_surcharge,
        has_fan: data.has_fan,
        has_ac: data.has_ac,
        is_active: data.is_active,
      })
      .eq("id", data.id)
      .eq("property_id", "cielo"); // safety: only touch Cielo rooms

    if (error) return { error: "Failed to update room." };

    revalidatePath("/admin/cielo/rooms");
    revalidatePath(`/admin/cielo/rooms/${data.id}`);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}
