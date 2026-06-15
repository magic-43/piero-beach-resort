-- Migration: Add room content columns to `rooms` table and seed existing data

ALTER TABLE rooms 
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS gallery text[],
  ADD COLUMN IF NOT EXISTS beds text,
  ADD COLUMN IF NOT EXISTS capacity_label text,
  ADD COLUMN IF NOT EXISTS amenities text[],
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS view text;

-- Seed Cabin Suite
UPDATE rooms SET
  category = 'Suite',
  description = 'A cozy suite for small groups or families, with breakfast for 3 plus a jacuzzi and dipping tub for a slower coastal stay.',
  short_description = 'Good for 3 guests with breakfast for 3, 1 extra guest allowed, and a jacuzzi with dipping tub included.',
  image = '/images/client assets/Cabin Suite/photo_4_2026-06-13_10-42-42.jpg',
  gallery = ARRAY['/images/client assets/Cabin Suite/photo_4_2026-06-13_10-42-42.jpg', '/images/client assets/Cabin Suite/photo_2_2026-06-13_10-42-42.jpg', '/images/client assets/Cabin Suite/photo_3_2026-06-13_10-42-42.jpg', '/images/client assets/Cabin Suite/photo_5_2026-06-13_10-42-42.jpg', '/images/client assets/Cabin Suite/photo_6_2026-06-13_10-42-42.jpg'],
  beds = '1 King Bed & 1 Daybed',
  capacity_label = 'Good for 3 guests',
  amenities = ARRAY['Breakfast for 3', 'Jacuzzi included', 'Dipping tub included', 'Free Wi-Fi', 'Housekeeping services', 'Front-desk assistance'],
  size = 'Private suite layout',
  view = 'Resort-side tropical setting'
WHERE slug = 'cabin-suite';

-- Seed Cabin Villa
UPDATE rooms SET
  category = 'Villa',
  description = 'A spacious private villa for families or small groups, complete with breakfast for 4 plus a jacuzzi and dipping tub.',
  short_description = 'Good for 4 guests with breakfast for 4, 1 extra guest allowed, and a jacuzzi with dipping tub included.',
  image = '/images/client assets/Cabin Villa/photo_4_2026-06-13_10-43-52.jpg',
  gallery = ARRAY['/images/client assets/Cabin Villa/photo_4_2026-06-13_10-43-52.jpg', '/images/client assets/Cabin Villa/photo_2_2026-06-13_10-43-52.jpg', '/images/client assets/Cabin Villa/photo_3_2026-06-13_10-43-52.jpg', '/images/client assets/Cabin Villa/photo_5_2026-06-13_10-43-52.jpg', '/images/client assets/Cabin Villa/photo_6_2026-06-13_10-43-52.jpg', '/images/client assets/Cabin Villa/photo_7_2026-06-13_10-43-52.jpg'],
  beds = '2 Queen Beds',
  capacity_label = 'Good for 4 guests',
  amenities = ARRAY['Breakfast for 4', 'Jacuzzi included', 'Dipping tub included', 'Free Wi-Fi', 'Housekeeping services', 'Front-desk assistance'],
  size = '80 sqm',
  view = 'Near-beach villa setting'
WHERE slug = 'cabin-villa';

-- Seed Ibiza Room
UPDATE rooms SET
  category = 'Room',
  description = 'A bright coastal room designed for restful group stays, with breakfast for 4 plus a jacuzzi and dipping tub.',
  short_description = 'Good for 4 guests with breakfast for 4, plus a jacuzzi and dipping tub included.',
  image = '/images/client assets/Ibiza Room/photo_5_2026-06-13_10-43-11.jpg',
  gallery = ARRAY['/images/client assets/Ibiza Room/photo_5_2026-06-13_10-43-11.jpg', '/images/client assets/Ibiza Room/photo_2_2026-06-13_10-43-11.jpg', '/images/client assets/Ibiza Room/photo_3_2026-06-13_10-43-11.jpg', '/images/client assets/Ibiza Room/photo_4_2026-06-13_10-43-11.jpg'],
  beds = '2 Double Beds',
  capacity_label = 'Good for 4 guests',
  amenities = ARRAY['Breakfast for 4', 'Jacuzzi included', 'Dipping tub included', 'Free Wi-Fi', 'Housekeeping services', 'Front-desk assistance'],
  size = 'Spacious room layout',
  view = 'Resort-side coastal ambiance'
WHERE slug = 'ibiza-room';

-- Seed Family Room
UPDATE rooms SET
  category = 'Room',
  description = 'A large group room built for reunions and outings, with breakfast for 10 plus a jacuzzi and dipping tub included.',
  short_description = 'Good for 10 guests with breakfast for 10, 2 extra guests allowed, and a jacuzzi with dipping tub included.',
  image = '/images/client assets/FAMILY ROOM/photo_3_2026-06-13_10-37-40.jpg',
  gallery = ARRAY['/images/client assets/FAMILY ROOM/photo_3_2026-06-13_10-37-40.jpg', '/images/client assets/FAMILY ROOM/photo_2_2026-06-13_10-37-40.jpg', '/images/client assets/FAMILY ROOM/photo_4_2026-06-13_10-37-40.jpg', '/images/client assets/FAMILY ROOM/photo_5_2026-06-13_10-37-40.jpg', '/images/client assets/FAMILY ROOM/photo_6_2026-06-13_10-37-40.jpg', '/images/client assets/FAMILY ROOM/photo_7_2026-06-13_10-37-40.jpg'],
  beds = '5 Queen Beds',
  capacity_label = 'Good for 10 guests',
  amenities = ARRAY['Breakfast for 10', 'Jacuzzi included', 'Dipping tub included', 'Free Wi-Fi', 'Housekeeping services', 'Front-desk assistance'],
  size = 'Large group room layout',
  view = 'Resort-side gathering space'
WHERE slug = 'family-room';

-- Seed Cancun Room
UPDATE rooms SET
  category = 'Room',
  description = 'A lively room for bigger families or barkada stays, with breakfast for 5 plus a jacuzzi and dipping tub included.',
  short_description = 'Good for 5 guests with breakfast for 5, 2 extra guests allowed, and a jacuzzi with dipping tub included.',
  image = '/images/client assets/Cancun Room/photo_6_2026-06-13_10-41-08.jpg',
  gallery = ARRAY['/images/client assets/Cancun Room/photo_6_2026-06-13_10-41-08.jpg', '/images/client assets/Cancun Room/photo_2_2026-06-13_10-41-08.jpg', '/images/client assets/Cancun Room/photo_3_2026-06-13_10-41-08.jpg', '/images/client assets/Cancun Room/photo_4_2026-06-13_10-41-08.jpg', '/images/client assets/Cancun Room/photo_5_2026-06-13_10-41-08.jpg'],
  beds = '2 Queen Beds & 1 Twin Bed',
  capacity_label = 'Good for 5 guests',
  amenities = ARRAY['Breakfast for 5', 'Jacuzzi included', 'Dipping tub included', 'Free Wi-Fi', 'Housekeeping services', 'Front-desk assistance'],
  size = 'Family-friendly room layout',
  view = 'Resort-side tropical ambiance'
WHERE slug = 'cancun';
