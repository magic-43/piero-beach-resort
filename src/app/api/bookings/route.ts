import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { bookingCreationSchema } from '@/lib/booking/schemas';
import { calculatePricing } from '@/lib/booking/pricing';
import { generateBookingReference } from '@/lib/booking/reference';
import { generateGuestAccessToken, hashToken } from '@/lib/booking/access-token';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingCreationSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }
    
    const input = parsed.data;
    const supabase = createAdminClient();

    // 1. Fetch active room
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('*')
      .eq('slug', input.roomSlug)
      .eq('is_active', true)
      .single();
      
    if (roomErr || !room) {
      return NextResponse.json({ error: 'Room not found or unavailable' }, { status: 404 });
    }

    // 2. Fetch settings
    const { data: settings, error: settingsErr } = await supabase
      .from('resort_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (settingsErr || !settings) {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }

    // 3. Calculate pricing
    const pricing = calculatePricing({
      roomDiscountedRate: room.discounted_rate,
      roomRegularRate: room.regular_rate,
      standardGuests: room.standard_guests,
      adultGuests: input.adultGuests,
      childGuests: input.childGuests,
      maxExtraGuests: room.max_extra_guests,
      extraPersonFee: settings.extra_person_fee,
      securityDeposit: settings.security_deposit,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      paymentOption: input.paymentOption,
    });

    if (pricing.nights <= 0) {
      return NextResponse.json({ error: 'Invalid dates. Must stay at least 1 night.' }, { status: 400 });
    }

    // 4. Idempotency Check
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .eq('client_request_id', input.clientRequestId)
      .single();

    if (existingBooking) {
       return NextResponse.json({
         message: "Booking already exists for this request",
         bookingReference: existingBooking.reference,
         roomSummary: existingBooking.rooms?.name || 'Room',
         checkIn: existingBooking.check_in,
         checkOut: existingBooking.check_out,
         adultGuests: existingBooking.adult_guests,
         childGuests: existingBooking.child_guests,
         nights: existingBooking.nights,
         grandTotal: existingBooking.grand_total,
         amountDueNow: existingBooking.amount_due_now,
         remainingBalance: existingBooking.remaining_balance,
         securityDepositReminder: existingBooking.security_deposit_snapshot,
         enabledPaymentMethods: {
            bankTransfer: settings.bank_transfer_enabled ? {
              bankName: settings.bank_name,
              accountName: settings.bank_account_name,
              accountNumber: settings.bank_account_number
            } : null,
            gcash: settings.gcash_enabled ? {
              name: settings.gcash_name,
              number: settings.gcash_number
            } : null,
         }
       }, { status: 200 });
    }

    // 5. Generate secure tokens and references
    const reference = generateBookingReference();
    const rawToken = generateGuestAccessToken();
    const hashedToken = await hashToken(rawToken);

    // 6. Insert new booking
    const { data: newBooking, error: insertErr } = await supabase
      .from('bookings')
      .insert({
        reference,
        client_request_id: input.clientRequestId,
        guest_access_token_hash: hashedToken,
        room_id: room.id,
        check_in: input.checkIn,
        check_out: input.checkOut,
        adult_guests: input.adultGuests,
        child_guests: input.childGuests,
        guest_name: input.guestName,
        guest_email: input.guestEmail,
        guest_phone: input.guestPhone,
        special_requests: input.specialRequests || null,
        nights: pricing.nights,
        regular_rate_snapshot: pricing.regularRateSnapshot,
        discounted_rate_snapshot: pricing.discountedRateSnapshot,
        discount_percentage_snapshot: 0,
        extra_person_fee_snapshot: pricing.extraPersonFeeSnapshot,
        security_deposit_snapshot: pricing.securityDepositSnapshot,
        room_total: pricing.roomTotal,
        extra_person_total: pricing.extraPersonTotal,
        grand_total: pricing.grandTotal,
        payment_option: input.paymentOption,
        amount_due_now: pricing.amountDueNow,
        remaining_balance: pricing.remainingBalance,
        status: 'awaiting_payment'
      })
      .select()
      .single();

    if (insertErr || !newBooking) {
      console.error('Booking insert failed:', insertErr);
      return NextResponse.json({ error: 'Failed to create booking. Please try again.' }, { status: 500 });
    }

    // 7. Return safe summary
    return NextResponse.json({
      bookingReference: newBooking.reference,
      guestAccessToken: rawToken, // Expose raw token only once here!
      roomSummary: room.name,
      checkIn: newBooking.check_in,
      checkOut: newBooking.check_out,
      adultGuests: newBooking.adult_guests,
      childGuests: newBooking.child_guests,
      nights: newBooking.nights,
      grandTotal: newBooking.grand_total,
      amountDueNow: newBooking.amount_due_now,
      remainingBalance: newBooking.remaining_balance,
      securityDepositReminder: newBooking.security_deposit_snapshot,
      enabledPaymentMethods: {
        bankTransfer: settings.bank_transfer_enabled ? {
          bankName: settings.bank_name,
          accountName: settings.bank_account_name,
          accountNumber: settings.bank_account_number
        } : null,
        gcash: settings.gcash_enabled ? {
          name: settings.gcash_name,
          number: settings.gcash_number
        } : null,
      }
    }, { status: 201 });

  } catch (err) {
    console.error('Unhandled booking creation error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
