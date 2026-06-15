import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyToken } from '@/lib/booking/access-token';

export async function GET(req: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    const supabase = createAdminClient();
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('reference', reference)
      .single();
      
    if (bookingErr || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const isValid = await verifyToken(token, booking.guest_access_token_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch latest payment submission if any
    const { data: submissions } = await supabase
      .from('payment_submissions')
      .select('status, payment_method, amount_claimed, submitted_at, reviewer_notes')
      .eq('booking_id', booking.id)
      .order('submitted_at', { ascending: false })
      .limit(1);
      
    const latestSubmission = submissions && submissions.length > 0 ? submissions[0] : null;

    // Fetch active payment methods from settings
    const { data: settings } = await supabase.from('resort_settings').select('*').eq('id', 1).single();

    return NextResponse.json({
      bookingReference: booking.reference,
      status: booking.status,
      roomSummary: booking.room_name,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      adultGuests: booking.adult_guests,
      childGuests: booking.child_guests,
      nights: booking.nights,
      grandTotal: booking.grand_total,
      amountDueNow: booking.amount_due_now,
      remainingBalance: booking.remaining_balance,
      securityDepositReminder: booking.security_deposit_snapshot,
      
      paymentSubmission: latestSubmission ? {
        status: latestSubmission.status,
        paymentMethod: latestSubmission.payment_method,
        amountSubmitted: latestSubmission.amount_claimed,
        submittedAt: latestSubmission.submitted_at,
        rejectionReason: latestSubmission.status === 'rejected' ? latestSubmission.reviewer_notes : undefined,
      } : null,
      
      enabledPaymentMethods: settings ? {
        bankTransfer: settings.bank_transfer_enabled ? settings.bank_transfer_details : null,
        gcash: settings.gcash_enabled ? settings.gcash_details : null,
      } : null
    });
  } catch (err) {
    console.error('Unhandled GET booking error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
