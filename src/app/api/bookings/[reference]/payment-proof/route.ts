import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyToken } from '@/lib/booking/access-token';
import { paymentProofSchema } from '@/lib/booking/schemas';

export async function POST(req: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    const formData = await req.formData();
    const proofFile = formData.get('proofFile') as File | null;
    const paymentMethodRaw = formData.get('paymentMethod');
    const amountClaimedRaw = formData.get('amountClaimed');

    const parsed = paymentProofSchema.safeParse({
      paymentMethod: paymentMethodRaw,
      amountClaimed: amountClaimedRaw,
    });

    if (!parsed.success || !proofFile) {
      return NextResponse.json({ error: 'Invalid input. File, payment method, and amount claimed are required.' }, { status: 400 });
    }

    const { paymentMethod, amountClaimed } = parsed.data;
    
    // File validation
    if (proofFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }
    const allowedTypes: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf'
    };
    if (!allowedTypes[proofFile.type]) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and PDF are allowed.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Auth & Validation
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id, guest_access_token_hash, status')
      .eq('reference', reference)
      .single();
      
    if (bookingErr || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const isValid = await verifyToken(token, booking.guest_access_token_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (booking.status !== 'awaiting_payment' && booking.status !== 'payment_rejected') {
      return NextResponse.json({ error: 'Booking is not awaiting payment' }, { status: 400 });
    }

    // Upload file
    const fileExt = allowedTypes[proofFile.type];
    const fileName = `${reference}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadErr } = await supabase
      .storage
      .from('payment-proofs')
      .upload(filePath, proofFile);

    if (uploadErr) {
      console.error('File upload failed:', uploadErr);
      return NextResponse.json({ error: 'Failed to upload payment proof.' }, { status: 500 });
    }

    // Save submission record
    // Note: 'pending_review' status is retained for backward compatibility with DB constraints,
    // but the payment review workflow is deprecated. Submissions are treated as read-only history.
    const { error: submissionErr } = await supabase
      .from('payment_submissions')
      .insert({
        booking_id: booking.id,
        payment_method: paymentMethod,
        amount_claimed: amountClaimed,
        proof_storage_path: filePath,
        status: 'pending_review' // Deprecated: Retained for DB constraints
      });

    if (submissionErr) {
      console.error('Submission insert failed:', submissionErr);
      // Attempt cleanup of the file (fire and forget)
      supabase.storage.from('payment-proofs').remove([filePath]);
      return NextResponse.json({ error: 'Failed to record payment submission.' }, { status: 500 });
    }

    // Update booking status to pending_review
    // Deprecated: Retained for DB constraints
    const { error: updateErr } = await supabase
      .from('bookings')
      .update({ status: 'pending_review' })
      .eq('id', booking.id);

    if (updateErr) {
      console.error('Booking status update failed:', updateErr);
      return NextResponse.json({ error: 'Payment submitted but booking status update failed.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Payment proof submitted successfully' });

  } catch (err) {
    console.error('Unhandled payment submission error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
