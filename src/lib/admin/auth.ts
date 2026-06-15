import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import "server-only";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
};

/**
 * Checks if the current session belongs to a valid admin.
 * Returns the admin user info, or null if not authenticated/authorized.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Check if the user exists in admin_profiles using the admin client
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("admin_profiles")
    .select("id, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    full_name: profile.full_name,
  };
}

/**
 * Requires a valid admin session. 
 * If none exists, redirects to /admin/login.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/admin/login");
  }
  return adminUser;
}
