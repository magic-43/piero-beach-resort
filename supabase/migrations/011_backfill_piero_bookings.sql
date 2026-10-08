-- Migration 011: Backfill and default property_id for bookings
-- Ensures any bookings created without an explicit property_id default to 'piero'

-- 1. Backfill any orphaned bookings using their room's property_id (or fallback to 'piero')
UPDATE bookings b
SET property_id = COALESCE(r.property_id, 'piero')
FROM rooms r
WHERE b.room_id = r.id
  AND b.property_id IS NULL;

UPDATE bookings
SET property_id = 'piero'
WHERE property_id IS NULL;

-- 2. Set default value for future inserts as a safeguard
ALTER TABLE bookings
  ALTER COLUMN property_id SET DEFAULT 'piero';
