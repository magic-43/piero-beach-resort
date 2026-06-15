-- Migration 008: Add Site Details to resort_settings

ALTER TABLE public.resort_settings
ADD COLUMN IF NOT EXISTS site_email text,
ADD COLUMN IF NOT EXISTS site_phone text,
ADD COLUMN IF NOT EXISTS site_whatsapp text,
ADD COLUMN IF NOT EXISTS site_facebook text,
ADD COLUMN IF NOT EXISTS site_google_maps text;

-- Set default values based on current hardcoded data
UPDATE public.resort_settings
SET 
  site_email = 'pierobeachresortph@gmail.com',
  site_phone = '+63 995 385 5517',
  site_whatsapp = '+63 955 318 2012',
  site_facebook = 'https://www.facebook.com/share/1UggHAxNzb/?mibextid=wwXIfr',
  site_google_maps = 'https://maps.google.com/?q=Piero+Beach+Resort'
WHERE id = 1;
