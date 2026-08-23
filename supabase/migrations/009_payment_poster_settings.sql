-- Migration 009: Payment Poster Settings Table

-- Create table for storing payment poster generator settings
-- Separate from resort_settings to keep poster data isolated
-- Supports multi-property via hotel_slug column

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
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
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE public.payment_poster_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policies: only authenticated users in admin_profiles can access
-- This table contains sensitive payment details (GCash/BPI numbers) so NO public access

CREATE POLICY "Admins can select payment poster settings"
  ON public.payment_poster_settings FOR SELECT
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert payment poster settings"
  ON public.payment_poster_settings FOR INSERT
  TO AUTHENTICATED
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update payment poster settings"
  ON public.payment_poster_settings FOR UPDATE
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can delete payment poster settings"
  ON public.payment_poster_settings FOR DELETE
  TO AUTHENTICATED
  USING (EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

-- Seed data for Cielo Alto Place with empty placeholders
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
  '',
  '',
  '',
  '',
  '[]'::jsonb,
  '',
  '',
  '[]'::jsonb
) ON CONFLICT (hotel_slug) DO NOTHING;

-- Storage bucket for payment poster logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-poster-logos', 'payment-poster-logos', true) 
ON CONFLICT DO NOTHING;

-- Storage policies for payment-poster-logos bucket (admin-only)
CREATE POLICY "Admins can read payment poster logos" ON storage.objects 
  FOR SELECT TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can write payment poster logos" ON storage.objects 
  FOR INSERT TO AUTHENTICATED 
  WITH CHECK (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update payment poster logos" ON storage.objects 
  FOR UPDATE TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can delete payment poster logos" ON storage.objects 
  FOR DELETE TO AUTHENTICATED 
  USING (bucket_id = 'payment-poster-logos' AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid()));
