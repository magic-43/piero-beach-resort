# Booking Foundation (Version 1)

This document describes the minimal Supabase booking foundation implemented for Piero Beach Resort.

## Tables Created
The foundation adds the following tables in the `001_booking_foundation.sql` migration:

1. **`admin_profiles`**: Identifies administrative users.
2. **`rooms`**: Core definitions for rooms (pricing, standard capacity, max extras).
3. **`resort_settings`**: A singleton table (ID=1) containing global parameters such as discount percentage, extra person fee, security deposit, check-in/out times, and payment details (Bank/GCash).
4. **`bookings`**: Stores reservation details, prices, guest counts, and status.
5. **`payment_submissions`**: Stores proof of payment records linked to a booking.

### Statuses
**Booking Status:**
- `awaiting_payment`
- `pending_review`
- `approved`
- `rejected`
- `cancelled`
- `completed`

**Payment Submission Status:**
- `pending_review`
- `approved`
- `rejected`
- `cancelled`

## Pricing Formula
Pricing logic is centralized in `src/lib/booking/pricing.ts`.

- **Guests:**
  - Children aged 0–7 stay for free and do not affect capacity or fees.
  - Only adults (aged 8+) count toward standard capacity and extra-person charges.
- **Rates:**
  - `Discounted Rate = Regular Rate * (1 - Global Discount Percentage / 100)`
  - `Room Total = Discounted Rate * Nights`
  - `Extra-Person Total = Extra Adults * Extra Person Fee * Nights`
- **Security Deposit:**
  - An informational amount (₱2,000) collected separately upon check-in. It is **not** included in the `grand_total`, `amount_due_now`, or `remaining_balance`.
- **Payment Options:**
  - **Full:** `Amount Due Now = Grand Total` (100%)
  - **Half:** `Amount Due Now = 50% of Grand Total`, with the remaining 50% due later.

## Scope Intentionality
To keep the foundation minimal and reliable for Version 1, the following features are deliberately **excluded**:
- Room availability checks and sold-out states. All rooms are bookable for any valid dates.
- Unit counts (assuming 1 unit per room slug).
- Overlapping date protections.
- Optional CMS functionality (e.g. dynamic content sections beyond the basic room configuration).
- Real payment gateway integration (manual proof of payment via bank transfer / GCash is used).

## Future Admin Pages
The following admin pages are planned for the next phase to allow staff to manage the resort:
- `/admin` (Dashboard)
- `/admin/payments` (Review payment proofs and approve/reject bookings)
- `/admin/rooms` (Manage pricing and capacities)
- `/admin/settings` (Configure discounts, bank details, and check-in times)

## Supabase Storage
Payment proofs (screenshots or receipts) are stored in a private Supabase Storage bucket named `payment-proofs`. Uploads and reads are strictly controlled via Row Level Security (RLS) to ensure only authorized admins can access them, preventing unauthorized data exposure.

## Security & Reliability
### Idempotency
Booking creation via the `POST /api/bookings` endpoint requires a unique `clientRequestId`. The server enforces an idempotency window, safely returning the existing booking details instead of creating duplicates if the user accidentally submits twice.

### Guest Access Tokens
Since guests check out without creating an account, their access to the newly created booking and the payment-proof submission endpoint is protected by a cryptographically secure `guest_access_token`. 
- The token is generated server-side during booking creation.
- A SHA-256 hash of the token is stored in the database (`guest_access_token_hash`).
- The raw token is returned to the client exactly once and held in React state/Session Storage.
- Subsequent client API calls must supply this token via an `Authorization: Bearer <token>` header.
