"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "./auth";
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
      .eq("id", 1);

    if (error) return { error: "Failed to update payment settings." };
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
      .eq("id", 1);

    if (error) return { error: "Failed to update booking settings." };
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
      .eq("id", 1);

    if (settingsError) return { error: "Failed to update global discount setting." };

    // 2. Fetch all rooms
    const { data: rooms, error: fetchError } = await supabase
      .from("rooms")
      .select("id, regular_rate");
      
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
      .eq("id", 1);

    if (error) {
      console.error("Update Site Details Error:", error);
      return { error: "Failed to update site details. Please try again." };
    }

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
