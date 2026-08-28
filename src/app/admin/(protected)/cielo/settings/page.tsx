import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import SettingsForms from "@/app/admin/(protected)/settings/settings-forms";

export const dynamic = "force-dynamic";

export default async function CieloSettingsPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: settings } = await supabase
    .from("resort_settings")
    .select("*")
    .or("id.eq.2,property_id.eq.cielo")
    .single();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, discounted_rate, regular_rate")
    .eq("property_id", "cielo")
    .order("name");

  if (!settings) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Cielo Alto settings not found.</p>
        <p className="text-sm text-gray-400 mt-2">Run migration 009_multi_property.sql to initialize.</p>
      </div>
    );
  }

  return <SettingsForms initialSettings={settings} rooms={rooms || []} property="cielo" />;
}
