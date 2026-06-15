-- Migration 003: Pricing Model Fix

-- 1. Add discounted_rate to rooms table
ALTER TABLE public.rooms 
  ADD COLUMN IF NOT EXISTS discounted_rate numeric(10,2) NOT NULL DEFAULT 0 CHECK (discounted_rate >= 0);

-- 2. Update existing rooms with the correct discounted and regular rates
UPDATE public.rooms SET discounted_rate = 4500, regular_rate = 6750 WHERE slug = 'cabin-suite';
UPDATE public.rooms SET discounted_rate = 6000, regular_rate = 9000 WHERE slug = 'cabin-villa';
UPDATE public.rooms SET discounted_rate = 6500, regular_rate = 9750 WHERE slug = 'ibiza-room';
UPDATE public.rooms SET discounted_rate = 13000, regular_rate = 19500 WHERE slug = 'family-room';
UPDATE public.rooms SET discounted_rate = 7000, regular_rate = 10500 WHERE slug = 'cancun';

-- 3. Update settings table
-- Add the new markup percentage column
ALTER TABLE public.resort_settings 
  ADD COLUMN IF NOT EXISTS original_rate_markup_percentage numeric(5,2) NOT NULL DEFAULT 50 CHECK (original_rate_markup_percentage >= 0);

-- Deprecate the old global_discount_percentage by renaming it to avoid confusion or just leave it unused as requested.
-- Since the user said: "If renaming the database column now is too risky, add a new settings column and document the old one as deprecated."
COMMENT ON COLUMN public.resort_settings.global_discount_percentage IS 'DEPRECATED: Do not use for calculating room rates. Use original_rate_markup_percentage and room.discounted_rate instead.';
