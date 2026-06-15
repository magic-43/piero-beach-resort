-- Migration 004: True 50% Discount Rates

-- 1. Update rooms with the new regular rates (double the discounted rate)
UPDATE public.rooms SET regular_rate = 9000 WHERE slug = 'cabin-suite';
UPDATE public.rooms SET regular_rate = 12000 WHERE slug = 'cabin-villa';
UPDATE public.rooms SET regular_rate = 13000 WHERE slug = 'ibiza-room';
UPDATE public.rooms SET regular_rate = 26000 WHERE slug = 'family-room';
UPDATE public.rooms SET regular_rate = 14000 WHERE slug = 'cancun';

-- 2. Update resort_settings markup percentage to 100
UPDATE public.resort_settings SET original_rate_markup_percentage = 100 WHERE id = 1;
