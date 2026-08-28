import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import PaymentPosterClient, { PaymentPosterSettings } from "../../payment-poster/payment-poster-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Poster Generator | Piero Admin",
};

export default async function PieroPaymentPosterPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: settings } = await supabase
    .from("payment_poster_settings")
    .select("*")
    .eq("hotel_slug", "piero")
    .maybeSingle();

  const initialSettings: PaymentPosterSettings = settings || {
    hotel_slug: "piero",
    hotel_name: "Piero Beach Resort",
    address: "Sitio Aplaya, Cabangan, Zambales",
    contact_number: "+63 917 123 4567",
    email: "pierobeachresort@gmail.com",
    logo_url: "",
    gcash_entries: [{ name: "Piero Beach Resort", number: "0917 123 4567" }],
    bpi_account_name: "Piero Beach Resort Operations",
    bpi_account_number: "1234 5678 9012",
    notes: [
      "Please upload your payment receipt to complete your booking reservation.",
      "Strictly cashless transactions for security and quick check-in verification.",
    ],
  };

  return <PaymentPosterClient initialSettings={initialSettings} property="piero" />;
}

