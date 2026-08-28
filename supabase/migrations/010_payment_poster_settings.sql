-- Migration 010: Payment Poster Settings Table (Multi-Property)

-- Create table for storing payment poster generator settings
CREATE TABLE IF NOT EXISTS public.payment_poster_settings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hotel_slug TEXT NOT NULL UNIQUE,
  hotel_name TEXT NOT NULL,
  address TEXT,
  contact_number TEXT,
  email TEXT,
  logo_url TEXT,
  gcash_entries JSONB DEFAULT '[]',
  bpi_account_name TEXT,
  bpi_account_number TEXT,
  notes JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updating timestamp
CREATE OR REPLACE FUNCTION trigger_set_poster_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_payment_poster_settings ON public.payment_poster_settings;

CREATE TRIGGER set_timestamp_payment_poster_settings
  BEFORE UPDATE ON public.payment_poster_settings
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_poster_timestamp();

-- Enable Row Level Security
ALTER TABLE public.payment_poster_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
DROP POLICY IF EXISTS "Admins can select payment poster settings" ON public.payment_poster_settings;
CREATE POLICY "Admins can select payment poster settings"
  ON public.payment_poster_settings FOR SELECT
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can insert payment poster settings" ON public.payment_poster_settings;
CREATE POLICY "Admins can insert payment poster settings"
  ON public.payment_poster_settings FOR INSERT
  TO AUTHENTICATED
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update payment poster settings" ON public.payment_poster_settings;
CREATE POLICY "Admins can update payment poster settings"
  ON public.payment_poster_settings FOR UPDATE
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete payment poster settings" ON public.payment_poster_settings;
CREATE POLICY "Admins can delete payment poster settings"
  ON public.payment_poster_settings FOR DELETE
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- Seed data for Piero Beach Resort
INSERT INTO public.payment_poster_settings (
  hotel_slug,
  hotel_name,
  address,
  contact_number,
  email,
  logo_url,
  gcash_entries,
  bpi_account_name,
  bpi_account_number,
  notes
) VALUES (
  'piero',
  'Piero Beach Resort',
  'Sitio Aplaya, Cabangan, Zambales',
  '+63 917 123 4567',
  'pierobeachresort@gmail.com',
  '',
  '[{"name": "Piero Beach Resort", "number": "0917 123 4567"}]'::jsonb,
  'Piero Beach Resort Operations',
  '1234 5678 9012',
  '["Please send your transaction receipt screenshot after making payment.", "Bank transfers may take 1-3 business days to clear for interbank transactions." , "Ensure reference number is visible on uploaded receipt."]'::jsonb
) ON CONFLICT (hotel_slug) DO NOTHING;

-- Seed data for Cielo Alto Place
INSERT INTO public.payment_poster_settings (
  hotel_slug,
  hotel_name,
  address,
  contact_number,
  email,
  logo_url,
  gcash_entries,
  bpi_account_name,
  bpi_account_number,
  notes
) VALUES (
  'cielo',
  'Cielo Alto Place',
  'Km 57 Marcos Highway, Sitio Mayagay, Tanay, Rizal',
  '+63 995 385 5517',
  'cieloaltoplaceph@gmail.com',
  '',
  '[]'::jsonb,
  '',
  '',
  '["Please upload your payment receipt to complete your booking reservation.", "Strictly cashless transactions for security and quick check-in verification."]'::jsonb
) ON CONFLICT (hotel_slug) DO NOTHING;

-- Storage bucket for payment poster logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-poster-logos', 'payment-poster-logos', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment-poster-logos bucket
DROP POLICY IF EXISTS "Admins can read payment poster logos" ON storage.objects;
CREATE POLICY "Admins can read payment poster logos" ON storage.objects 
  FOR SELECT TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can write payment poster logos" ON storage.objects;
CREATE POLICY "Admins can write payment poster logos" ON storage.objects 
  FOR INSERT TO AUTHENTICATED 
  WITH CHECK (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update payment poster logos" ON storage.objects;
CREATE POLICY "Admins can update payment poster logos" ON storage.objects 
  FOR UPDATE TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can delete payment poster logos" ON storage.objects;
CREATE POLICY "Admins can delete payment poster logos" ON storage.objects 
  FOR DELETE TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

