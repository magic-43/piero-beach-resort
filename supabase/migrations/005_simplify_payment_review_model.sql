-- Migration 005: Simplify Payment Review Model
-- Add deprecation comments to the payment_submissions review-related columns.

COMMENT ON COLUMN public.payment_submissions.status IS 'DEPRECATED in simplified admin model. Payment submissions are treated as payment history records.';
COMMENT ON COLUMN public.payment_submissions.rejection_reason IS 'DEPRECATED in simplified admin model.';
COMMENT ON COLUMN public.payment_submissions.reviewed_by IS 'DEPRECATED in simplified admin model.';
COMMENT ON COLUMN public.payment_submissions.reviewed_at IS 'DEPRECATED in simplified admin model.';
