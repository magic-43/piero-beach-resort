-- Migration 009: Multi-property support
-- Adds properties table, property_id to rooms/bookings, and Cielo Alto data

-- ============================================================
-- 1. Create properties lookup table
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id   text primary key,
  name text not null
);

INSERT INTO properties (id, name) VALUES
  ('piero', 'Piero Beach Resort'),
  ('cielo', 'Cielo Alto Place')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Add property_id to rooms, backfill Piero, set NOT NULL
-- ============================================================
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS property_id text references properties(id);

UPDATE rooms SET property_id = 'piero' WHERE property_id IS NULL;

ALTER TABLE rooms
  ALTER COLUMN property_id SET NOT NULL,
  ALTER COLUMN property_id SET DEFAULT 'piero';

-- ============================================================
-- 3. Add Fan/AC columns to rooms (Cielo-specific fields)
-- ============================================================
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS has_fan      boolean not null default true,
  ADD COLUMN IF NOT EXISTS has_ac       boolean not null default false,
  ADD COLUMN IF NOT EXISTS ac_surcharge numeric(12,2) not null default 0;

-- ============================================================
-- 4. Fix resort_settings singleton constraint so we can add Cielo row
-- ============================================================
ALTER TABLE resort_settings DROP CONSTRAINT IF EXISTS resort_settings_id_check;
ALTER TABLE resort_settings DROP CONSTRAINT IF EXISTS resort_settings_pkey CASCADE;
ALTER TABLE resort_settings ADD PRIMARY KEY (id);

-- Add property_id column to resort_settings
ALTER TABLE resort_settings
  ADD COLUMN IF NOT EXISTS property_id text references properties(id);

UPDATE resort_settings SET property_id = 'piero' WHERE id = 1;

-- ============================================================
-- 5. Insert Cielo Alto resort_settings row (id = 2)
-- ============================================================
INSERT INTO resort_settings (
  id,
  property_id,
  global_discount_percentage,
  extra_person_fee,
  security_deposit,
  check_in_time,
  check_out_time,
  bank_transfer_enabled,
  bank_name,
  bank_account_name,
  bank_account_number,
  gcash_enabled,
  gcash_name,
  gcash_number,
  site_email,
  site_phone,
  site_whatsapp,
  site_facebook,
  site_google_maps
) VALUES (
  2,
  'cielo',
  0,        -- no discount model for Cielo (rates are already promo rates)
  500,      -- extra person fee ₱500/head
  0,        -- security deposit TBD
  '14:00',  -- check-in 2PM
  '12:00',  -- check-out 12 Noon
  true,
  null,     -- CEO fills in via admin
  null,
  null,
  true,
  null,     -- CEO fills in via admin
  null,
  'cieloaltoplaceph@gmail.com',
  '+63 995 385 5517',
  '+63 995 385 5517',
  'https://www.facebook.com/share/1V9EEuNgCm/',
  'https://maps.google.com/?q=Cielo+Alto+Place+Tanay+Rizal'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. Add property_id to bookings (for direct filtering)
-- ============================================================
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS property_id text references properties(id);

UPDATE bookings b
SET property_id = r.property_id
FROM rooms r
WHERE b.room_id = r.id
  AND b.property_id IS NULL;

-- ============================================================
-- 7. Insert Cielo Alto rooms
-- ============================================================
INSERT INTO rooms (
  slug, name,
  regular_rate, discounted_rate,
  standard_guests, max_extra_guests, breakfast_guests,
  has_jacuzzi, has_dipping_tub,
  has_fan, has_ac, ac_surcharge,
  is_active,
  property_id,
  category,
  description,
  short_description,
  image, gallery,
  beds, capacity_label, amenities,
  size, view
) VALUES
(
  'mini-cabin', 'Mini Cabin',
  3000, 3000,
  2, 0, 2,
  false, false,
  true, false, 0,
  true, 'cielo', 'Cabin',
  'A cozy mountain retreat for two. Rustic A-frame charm, queen-size bed, fan room. No extra guests — purely private. Shared comfort room.',
  'Cozy retreat for 2. Fan room. Shared CR. No extra guests.',
  '/images/cielo/mini-cabin/photo_1_2026-08-26_10-08-37.jpg', ARRAY['/images/cielo/mini-cabin/photo_1_2026-08-26_10-08-37.jpg', '/images/cielo/mini-cabin/photo_2_2026-08-26_10-08-37.jpg', '/images/cielo/mini-cabin/photo_3_2026-08-26_10-08-37.jpg', '/images/cielo/mini-cabin/photo_4_2026-08-26_10-08-37.jpg']::text[],
  '1 Queen-size Bed', 'Good for 2 guests',
  ARRAY['1 Queen-size Bed','Fan Room','Shared Comfort Room','Free Breakfast for 2','Free Parking'],
  'Intimate cabin', 'Highland mountain view'
),
(
  'regular-cabin', 'Regular Cabin',
  4000, 4000,
  2, 2, 2,
  false, false,
  true, true, 500,
  true, 'cielo', 'Cabin',
  'A highland couple''s cabin with a private veranda facing the rolling mountains of Tanay. Fan or AC option. Shared comfort room. Up to 2 extra guests.',
  'Private veranda, overlooking view. Fan or AC. Shared CR. Up to 2 extra guests.',
  '/images/cielo/regular-cabin/photo_1_2026-08-26_10-16-44.jpg', ARRAY['/images/cielo/regular-cabin/photo_1_2026-08-26_10-16-44.jpg', '/images/cielo/regular-cabin/photo_2_2026-08-26_10-16-44.jpg', '/images/cielo/regular-cabin/photo_3_2026-08-26_10-16-44.jpg']::text[],
  '1 Queen-size Bed', 'Good for 2 guests',
  ARRAY['1 Queen-size Bed','Fan or AC Room','Private Veranda','Overlooking Mountain View','Shared Comfort Room','Free Breakfast for 2','Up to 2 Extra Guests','Free Parking'],
  'Cozy cabin with veranda', 'Panoramic mountain view'
),
(
  'family-cabin', 'Family Cabin',
  6000, 6000,
  4, 2, 4,
  false, false,
  true, true, 500,
  true, 'cielo', 'Cabin',
  'The best choice for families and groups. Two queen beds, own private comfort room, AC option, and a veranda with sweeping mountain views.',
  'Spacious 4-guest cabin. Own private CR. Fan or AC. Veranda with mountain view.',
  '/images/cielo/family-cabin/photo_1_2026-08-26_10-17-14.jpg', ARRAY['/images/cielo/family-cabin/photo_1_2026-08-26_10-17-14.jpg', '/images/cielo/family-cabin/photo_2_2026-08-26_10-17-14.jpg', '/images/cielo/family-cabin/photo_3_2026-08-26_10-17-14.jpg', '/images/cielo/family-cabin/photo_4_2026-08-26_10-17-14.jpg', '/images/cielo/family-cabin/photo_5_2026-08-26_10-17-14.jpg']::text[],
  '2 Queen-size Beds', 'Good for 4 guests',
  ARRAY['2 Queen-size Beds','Fan or AC Room','Own Private Comfort Room','Overlooking Veranda','Mountain View','Free Breakfast for 4','Up to 2 Extra Guests','Free Parking'],
  'Spacious family cabin', 'Sweeping mountain panorama'
),
(
  'holiday-room-1', 'Holiday Room 1',
  4500, 4500,
  2, 2, 2,
  false, false,
  true, true, 500,
  true, 'cielo', 'Room',
  'A comfortable private room with own comfort room (with sink), veranda, and mountain views. Fan or AC. Great for couples wanting more privacy.',
  'Own CR with sink. Private veranda. Fan or AC. Overlooking view.',
  '/images/cielo/holiday-room-1/photo_1_2026-08-26_10-18-23.jpg', ARRAY['/images/cielo/holiday-room-1/photo_1_2026-08-26_10-18-23.jpg', '/images/cielo/holiday-room-1/photo_2_2026-08-26_10-18-23.jpg', '/images/cielo/holiday-room-1/photo_3_2026-08-26_10-18-23.jpg', '/images/cielo/holiday-room-1/photo_4_2026-08-26_10-18-23.jpg', '/images/cielo/holiday-room-1/photo_5_2026-08-26_10-18-23.jpg']::text[],
  '1 Queen-size Bed', 'Good for 2 guests',
  ARRAY['1 Queen-size Bed','Fan or AC Room','Own Comfort Room (with sink)','Private Veranda','Overlooking Mountain View','Free Breakfast for 2','Up to 2 Extra Guests','Free Parking'],
  'Private room with veranda', 'Mountain view'
),
(
  'holiday-room-2-3', 'Holiday Room 2-3',
  4000, 4000,
  2, 2, 2,
  false, false,
  true, true, 500,
  true, 'cielo', 'Room',
  'Fun double-deck bunk beds, own private comfort room, and a veranda with mountain views. Fan or AC. Perfect for friends or siblings.',
  'Double deck beds. Own CR. Private veranda. Fan or AC.',
  '/images/cielo/holiday-room-2-3/photo_1_2026-08-26_10-19-35.jpg', ARRAY['/images/cielo/holiday-room-2-3/photo_1_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_2_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_3_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_4_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_5_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_6_2026-08-26_10-19-35.jpg', '/images/cielo/holiday-room-2-3/photo_7_2026-08-26_10-19-35.jpg']::text[],
  '1 Double Deck (bunk bed)', 'Good for 2 guests',
  ARRAY['1 Double Deck Bed','Fan or AC Room','Own Private Comfort Room','Overlooking Veranda','Mountain View','Free Breakfast for 2','Up to 2 Extra Guests','Free Parking'],
  'Fun bunk-style room', 'Mountain overlook'
),
(
  'loft-cabin', 'Loft Cabin',
  7000, 7000,
  4, 4, 4,
  false, false,
  true, true, 500,
  true, 'cielo', 'Cabin',
  'The crown jewel of Cielo Alto Place. Three queen beds plus an attic loft under iconic A-frame wooden beam ceilings. Sleeps up to 8. Own private CR, veranda, mountain views. Fan or AC.',
  'Crown jewel. 3 queen beds + attic loft. Sleeps up to 8. Own CR. Fan or AC.',
  '/images/cielo/loft-cabin/photo_1_2026-08-26_10-20-21.jpg', ARRAY['/images/cielo/loft-cabin/photo_1_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_2_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_3_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_4_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_5_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_6_2026-08-26_10-20-21.jpg', '/images/cielo/loft-cabin/photo_7_2026-08-26_10-20-21.jpg']::text[],
  '3 Queen-size Beds + Attic Loft', 'Good for 4 guests (up to 8)',
  ARRAY['3 Queen-size Beds + Attic Loft','Fan or AC Room','Own Private Comfort Room','Private Veranda','Panoramic Mountain View','Free Breakfast for 4','Up to 4 Extra Guests','Iconic A-Frame Architecture','Free Parking'],
  'Large loft-style A-frame cabin', 'Panoramic mountain and highland view'
)
ON CONFLICT (slug) DO NOTHING;

-- Backfill room images for existing Cielo rows if empty
UPDATE rooms SET image = '/images/cielo/mini-cabin/photo_1_2026-08-26_10-08-37.jpg' WHERE slug = 'mini-cabin' AND (image IS NULL OR image = '');
UPDATE rooms SET image = '/images/cielo/regular-cabin/photo_1_2026-08-26_10-16-44.jpg' WHERE slug = 'regular-cabin' AND (image IS NULL OR image = '');
UPDATE rooms SET image = '/images/cielo/family-cabin/photo_1_2026-08-26_10-17-14.jpg' WHERE slug = 'family-cabin' AND (image IS NULL OR image = '');
UPDATE rooms SET image = '/images/cielo/holiday-room-1/photo_1_2026-08-26_10-18-23.jpg' WHERE slug = 'holiday-room-1' AND (image IS NULL OR image = '');
UPDATE rooms SET image = '/images/cielo/holiday-room-2-3/photo_1_2026-08-26_10-19-35.jpg' WHERE slug = 'holiday-room-2-3' AND (image IS NULL OR image = '');
UPDATE rooms SET image = '/images/cielo/loft-cabin/photo_1_2026-08-26_10-20-21.jpg' WHERE slug = 'loft-cabin' AND (image IS NULL OR image = '');

-- ============================================================
-- 8. RLS: rooms policy still works (is_active = true is public)
-- No changes needed — existing policies already cover all rows
-- ============================================================

-- Add policy to allow public reading of resort_settings for Cielo site
-- (The Piero site fetches settings too; both sites will use property_id filter)
-- No new policies needed — admin client bypasses RLS
