import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import PaymentPosterClient from "./PaymentPosterClient";

export const dynamic = "force-dynamic";

// Type for the payment poster settings row
export type PaymentPosterSettings = {
  id: number;
  hotel_slug: string;
  hotel_name: string;
  address: string | null;
  contact_number: string | null;
  email: string | null;
  logo_url: string | null;
  gcash_entries: Array<{ number: string; name: string }> | null;
  bpi_account_name: string | null;
  bpi_account_number: string | null;
  notes: string[] | null;
  updated_at: string;
  created_at: string;
};

export default async function PaymentPosterPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  // Load Cielo Alto Place settings (hotel_slug = 'cielo')
  const { data: settings } = await supabase
    .from("payment_poster_settings")
    .select("*")
    .eq("hotel_slug", "cielo")
    .single();

  // Fallback for first run (table may be empty)
  const initialSettings: PaymentPosterSettings = settings || {
    id: 0,
    hotel_slug: "cielo",
    hotel_name: "Cielo Alto Place",
    address: "",
    contact_number: "",
    email: "",
    logo_url: "",
    gcash_entries: [],
    bpi_account_name: "",
    bpi_account_number: "",
    notes: [],
    updated_at: "",
    created_at: "",
  };

  return <PaymentPosterClient initialSettings={initialSettings} />;
}
