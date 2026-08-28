import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import PaymentPosterClient, { PaymentPosterSettings } from "../../payment-poster/payment-poster-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Poster Generator | Cielo Admin",
};

export default async function CieloPaymentPosterPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: settings } = await supabase
    .from("payment_poster_settings")
    .select("*")
    .eq("hotel_slug", "cielo")
    .maybeSingle();

  const initialSettings: PaymentPosterSettings = settings || {
    hotel_slug: "cielo",
    hotel_name: "Cielo Alto Place",
    address: "Km 57 Marcos Highway, Sitio Mayagay, Tanay, Rizal",
    contact_number: "+63 995 385 5517",
    email: "cieloaltoplaceph@gmail.com",
    logo_url: "",
    gcash_entries: [],
    bpi_account_name: "",
    bpi_account_number: "",
    notes: [
      "Please upload your payment receipt to complete your booking reservation.",
      "Strictly cashless transactions for security and quick check-in verification.",
    ],
  };

  return <PaymentPosterClient initialSettings={initialSettings} property="cielo" />;
}

