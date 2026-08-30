import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import PaymentPosterClient, { PaymentPosterSettings, PropertyBranding } from "../../payment-poster/payment-poster-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Poster Generator | Piero Admin",
};

export default async function PieroPaymentPosterPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  // Load Piero site contact details from resort_settings (id = 1)
  const { data: siteSettings } = await supabase
    .from("resort_settings")
    .select("site_phone, site_email")
    .eq("id", 1)
    .maybeSingle();

  // Load poster-specific accounts exclusively from payment_poster_settings
  const { data: posterSettings } = await supabase
    .from("payment_poster_settings")
    .select("*")
    .eq("hotel_slug", "piero")
    .maybeSingle();

  const branding: PropertyBranding = {
    slug: "piero",
    name: "Piero Beach Resort",
    address: "Sitio Aplaya, Cabangan, Zambales",
    phone: siteSettings?.site_phone || "+63 995 385 5517",
    email: siteSettings?.site_email || "pierobeachresort@gmail.com",
    logo: "/images/logo.svg",
  };

  const initialSettings: PaymentPosterSettings = {
    hotel_slug: "piero",
    bank_name: posterSettings?.bank_name || "BPI",
    bpi_account_name: posterSettings?.bpi_account_name || "",
    bpi_account_number: posterSettings?.bpi_account_number || "",
    gcash_entries: posterSettings?.gcash_entries || [],
    notes: posterSettings?.notes && posterSettings.notes.length > 0
      ? posterSettings.notes
      : [
          "Please upload your payment receipt screenshot after booking.",
          "Strictly cashless transactions for security and quick check-in verification.",
          "Interbank transfers may take 1-3 business days to clear.",
        ],
  };

  return <PaymentPosterClient initialSettings={initialSettings} branding={branding} />;
}

