-- Migration 007: Allow public read access to resort_settings

-- The frontend client needs to read payment details, booking fees, 
-- and check-in/out times without being authenticated.
CREATE POLICY "Settings are publicly readable" 
ON public.resort_settings FOR SELECT 
USING (true);
