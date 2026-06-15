-- Migration 002: Guest Booking Submission & Payment Proof Upload

-- Safe check for existing rows before altering the table
DO $$
DECLARE
  row_count INT;
BEGIN
  SELECT COUNT(*) INTO row_count FROM public.bookings;
  IF row_count > 0 THEN
    RAISE EXCEPTION 'Cannot safely apply migration: % test bookings exist. Please delete existing test rows before applying to prevent data corruption or NOT NULL constraint violations.', row_count;
  END IF;
END $$;

-- 1. Add new columns to bookings as nullable first
ALTER TABLE public.bookings 
  ADD COLUMN guest_access_token_hash text,
  ADD COLUMN submitted_at timestamptz,
  ADD COLUMN client_request_id uuid;

-- 2. Since we verified the table is empty, safely enforce NOT NULL
ALTER TABLE public.bookings 
  ALTER COLUMN guest_access_token_hash SET NOT NULL;

-- 3. Add unique constraint for client_request_id to make booking creation idempotent
ALTER TABLE public.bookings
  ADD CONSTRAINT unique_client_request_id UNIQUE (client_request_id);

-- 4. Unique partial index to prevent multiple active payment submissions for the same booking
CREATE UNIQUE INDEX unique_active_payment_submission 
  ON public.payment_submissions (booking_id) 
  WHERE status IN ('pending_review', 'approved');
