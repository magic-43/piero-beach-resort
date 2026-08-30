import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import PaymentPosterClient, { PaymentPosterSettings, PropertyBranding } from "../../payment-poster/payment-poster-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Poster Generator | Cielo Admin",
};

export default async function CieloPaymentPosterPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  // Load Cielo site contact details from resort_settings (id = 2)
  const { data: siteSettings } = await supabase
    .from("resort_settings")
    .select("site_phone, site_email")
    .eq("id", 2)
    .maybeSingle();

  // Load poster-specific accounts exclusively from payment_poster_settings
  const { data: posterSettings } = await supabase
    .from("payment_poster_settings")
    .select("*")
    .eq("hotel_slug", "cielo")
    .maybeSingle();

  const branding: PropertyBranding = {
    slug: "cielo",
    name: "Cielo Alto Place",
    address: "Km 57 Marcos Highway, Sitio Mayagay, Tanay, Rizal",
    phone: siteSettings?.site_phone || "+63 995 385 5517",
    email: siteSettings?.site_email || "cieloaltoplaceph@gmail.com",
    logo: "/images/cielo/logo.png",
  };

  const initialSettings: PaymentPosterSettings = {
    hotel_slug: "cielo",
    bank_name: posterSettings?.bank_name || "BPI",
    bpi_account_name: posterSettings?.bpi_account_name || "",
    bpi_account_number: posterSettings?.bpi_account_number || "",
    gcash_entries: posterSettings?.gcash_entries || [],
    notes: posterSettings?.notes && posterSettings.notes.length > 0
      ? posterSettings.notes
      : [
          "Please upload your payment receipt to complete your booking reservation.",
          "Strictly cashless transactions for security and quick check-in verification.",
        ],
  };

  return <PaymentPosterClient initialSettings={initialSettings} branding={branding} />;
}

