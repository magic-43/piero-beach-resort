-- Migration 010: Simplify payment_poster_settings Table
-- Drops redundant branding/site columns now sourced directly from resort_settings

ALTER TABLE public.payment_poster_settings
  DROP COLUMN IF EXISTS hotel_name,
  DROP COLUMN IF EXISTS address,
  DROP COLUMN IF EXISTS contact_number,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS logo_url;

-- Ensure bank_name column exists for flexible bank account naming (e.g. BPI, BDO, UnionBank)
ALTER TABLE public.payment_poster_settings
  ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT 'BPI';

-- Seed initial records if not present
INSERT INTO public.payment_poster_settings (
  hotel_slug,
  bank_name,
  bpi_account_name,
  bpi_account_number,
  gcash_entries,
  notes
) VALUES (
  'piero',
  'BPI',
  'Piero Beach Resort Operations',
  '1234 5678 9012',
  '[{"name": "Piero Beach Resort", "number": "0917 123 4567"}]'::jsonb,
  '["Please send your transaction receipt screenshot after making payment.", "Bank transfers may take 1-3 business days to clear for interbank transactions.", "Ensure reference number is visible on uploaded receipt."]'::jsonb
) ON CONFLICT (hotel_slug) DO NOTHING;

INSERT INTO public.payment_poster_settings (
  hotel_slug,
  bank_name,
  bpi_account_name,
  bpi_account_number,
  gcash_entries,
  notes
) VALUES (
  'cielo',
  'BPI',
  '',
  '',
  '[]'::jsonb,
  '["Please upload your payment receipt to complete your booking reservation.", "Strictly cashless transactions for security and quick check-in verification."]'::jsonb
) ON CONFLICT (hotel_slug) DO NOTHING;

