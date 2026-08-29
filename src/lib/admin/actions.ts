"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, requireAdmin } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Login
 */
export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error || !authData.user) {
    return { error: error?.message || "Invalid email or password." };
  }

  const userId = authData.user.id;

  // Check if they are admin using the server-only admin client
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("admin_profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Signed in, but this user ID was not found in admin_profiles." };
  }

  redirect("/admin");
}

/**
 * Logout
 */
export async function adminLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}



/**
 * Settings updates
 */
export async function updatePaymentSettings(data: Record<string, unknown>) {
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
      .or("id.eq.1,property_id.eq.piero");

    if (error) return { error: "Failed to update payment settings." };
    revalidatePath("/admin/piero/settings");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

export async function updateBookingSettings(data: Record<string, unknown>) {
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
      .or("id.eq.1,property_id.eq.piero");

    if (error) return { error: "Failed to update booking settings." };
    revalidatePath("/admin/piero/settings");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

export async function updateDiscountSetting(discountPercentage: number) {
  try {
    await requireAdmin();
    const supabase = await createAdminClient();

    // 1. Update resort_settings (we store the discount percentage here now)
    const { error: settingsError } = await supabase
      .from("resort_settings")
      .update({ global_discount_percentage: discountPercentage })
      .or("id.eq.1,property_id.eq.piero");

    if (settingsError) return { error: "Failed to update global discount setting." };

    // 2. Fetch Piero rooms only
    const { data: rooms, error: fetchError } = await supabase
      .from("rooms")
      .select("id, regular_rate")
      .eq("property_id", "piero");
      
    if (fetchError || !rooms) return { error: "Failed to fetch rooms for pricing update." };

    // 3. Update each room's discounted_rate based on its regular_rate
    const updates = rooms.map(room => {
      // Calculate the new discounted_rate 
      const newDiscountedRate = room.regular_rate * (1 - discountPercentage / 100);
      
      return supabase
        .from("rooms")
        .update({ discounted_rate: Math.round(newDiscountedRate) })
        .eq("id", room.id);
    });

    await Promise.all(updates);

    revalidatePath("/admin/piero/settings");
    revalidatePath("/admin/settings");
    revalidatePath("/rooms");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Failed to update pricing." };
  }
}

export async function updateSiteDetails(data: {
  site_email: string;
  site_phone: string;
  site_whatsapp: string;
  site_facebook: string;
  site_google_maps: string;
}) {
  try {
    await requireAdmin();
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("resort_settings")
      .update({
        site_email: data.site_email,
        site_phone: data.site_phone,
        site_whatsapp: data.site_whatsapp,
        site_facebook: data.site_facebook,
        site_google_maps: data.site_google_maps,
      })
      .or("id.eq.1,property_id.eq.piero");

    if (error) {
      console.error("Update Site Details Error:", error);
      return { error: "Failed to update site details. Please try again." };
    }

    revalidatePath("/admin/piero/settings");
    revalidatePath("/admin/settings");
    revalidatePath("/contact");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Failed to update site details." };
  }
}

type UpdateRoomPayload = {
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
  is_active: boolean;
};

export async function updateRoom(data: UpdateRoomPayload) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return { error: "Your admin session has expired. Please sign in again and retry saving the room." };
    }

    if (!data.id) return { error: "Room ID is required." };
    if (!data.name.trim()) return { error: "Room name is required." };
    if (!data.image.trim()) return { error: "Primary image is required." };
    if (data.standard_guests < 1) return { error: "Standard guests must be at least 1." };
    if (data.max_extra_guests < 0) return { error: "Max extra guests cannot be negative." };
    if (data.breakfast_guests < 0) return { error: "Breakfast guests cannot be negative." };
    const supabase = createAdminClient();
    const { data: settings, error: settingsError } = await supabase
      .from("resort_settings")
      .select("global_discount_percentage")
      .eq("id", 1)
      .single();

    if (settingsError) {
      return { error: "Failed to load discount settings." };
    }

    const discountPercentage = Number(settings?.global_discount_percentage) || 0;
    const discountedRate = Math.round(data.regular_rate * (1 - discountPercentage / 100));

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
        discounted_rate: discountedRate,
        is_active: data.is_active,
      })
      .eq("id", data.id);

    if (error) {
      return { error: "Failed to update room." };
    }

    revalidatePath("/admin/rooms");
    revalidatePath(`/admin/rooms/${data.id}`);
    revalidatePath("/");
    revalidatePath("/rooms");
    revalidatePath("/rooms/cabin-suite");
    revalidatePath("/rooms/cabin-villa");
    revalidatePath("/rooms/ibiza-room");
    revalidatePath("/rooms/family-room");
    revalidatePath("/rooms/cancun");
    revalidatePath("/reserve");
    revalidatePath("/reserve/villa");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Payment Poster Settings (Multi-Property)
 * Updates or inserts payment poster accounts & notes for a specific hotel_slug ('piero' or 'cielo').
 */
export async function updatePaymentPosterSettings(data: {
  hotelSlug: string;
  bankName?: string;
  bpiAccountName: string;
  bpiAccountNumber: string;
  gcashEntries: Array<{ number: string; name: string }>;
  notes: string[];
}) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("payment_poster_settings")
      .select("id")
      .eq("hotel_slug", data.hotelSlug)
      .maybeSingle();

    const payload = {
      bank_name: data.bankName || "BPI",
      bpi_account_name: data.bpiAccountName || "",
      bpi_account_number: data.bpiAccountNumber || "",
      gcash_entries: data.gcashEntries || [],
      notes: data.notes || [],
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from("payment_poster_settings")
        .update(payload)
        .eq("hotel_slug", data.hotelSlug);

      if (updateError) {
        console.error("Payment poster update error:", updateError);
        return { error: "Failed to update payment poster settings." };
      }
    } else {
      const { error: insertError } = await supabase
        .from("payment_poster_settings")
        .insert({
          hotel_slug: data.hotelSlug,
          ...payload,
        });

      if (insertError) {
        console.error("Payment poster insert error:", insertError);
        return { error: "Failed to create payment poster settings." };
      }
    }

    revalidatePath(`/admin/${data.hotelSlug}/payment-poster`);
    revalidatePath("/admin/payment-poster");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "An unexpected error occurred." };
  }
}


