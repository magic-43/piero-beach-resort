import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import SettingsForms from "../../settings/settings-forms";

export const dynamic = "force-dynamic";

export default async function PieroSettingsPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: settings } = await supabase
    .from("resort_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, discounted_rate, regular_rate")
    .eq("property_id", "piero")
    .order("name");

  if (!settings) return <div className="p-8 text-center">Settings not initialized.</div>;

  return <SettingsForms initialSettings={settings} rooms={rooms || []} />;
}
