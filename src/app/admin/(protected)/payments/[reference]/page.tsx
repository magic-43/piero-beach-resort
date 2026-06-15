import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, User, Phone, Mail, Calendar, Bed, Users, CreditCard, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  await requireAdmin();
  const supabase = await createAdminClient();
  const resolvedParams = await params;

  // Fetch booking and its submissions
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      payment_submissions (*),
      rooms (name)
    `)
    .eq("reference", resolvedParams.reference)
    .single();

  if (error || !booking) {
    return (
      <div className="p-8 text-center text-resort-cocoa">
        <h1 className="font-serif text-2xl mb-2">Booking Not Found</h1>
        <Link href="/admin" className="text-[#c4a47c] underline">Back to Home</Link>
      </div>
    );
  }

  const submissions = booking.payment_submissions || [];
  // Sort submissions: newest first
  submissions.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const activeSubmission = submissions.length > 0 ? submissions[0] : null;

  let signedUrl = null;
  let downloadUrl = null;
  if (activeSubmission?.proof_storage_path) {
    const { data: urlData } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(activeSubmission.proof_storage_path, 60 * 60); // 1 hour
    signedUrl = urlData?.signedUrl;

    const { data: dlUrlData } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(activeSubmission.proof_storage_path, 60 * 60, { download: true });
    downloadUrl = dlUrlData?.signedUrl;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center text-sm text-resort-cocoa/60 hover:text-resort-cocoa transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      {/* Content */}
      <div className="bg-resort-white rounded-2xl border border-resort-cocoa/10 shadow-sm overflow-hidden">
        <div className="bg-[#132c4a] px-6 py-3 sm:px-8 text-resort-white relative overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c4a47c] opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-sm font-bold tracking-widest text-[#c4a47c] uppercase">
                REF: {booking.reference}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Details Column */}
          <div className="space-y-8 text-sm text-resort-cocoa">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-resort-cocoa/50 mb-4 pb-2 border-b border-resort-cocoa/10 flex items-center">
                <User className="w-4 h-4 mr-2" /> Guest Info
              </h3>
              <div className="space-y-3 bg-resort-offwhite/50 p-4 rounded-xl border border-resort-cocoa/5">
                <div className="flex items-center"><User className="w-4 h-4 mr-3 text-[#c4a47c]" /> <span className="font-medium text-base">{booking.guest_name}</span></div>
                <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-[#c4a47c]" /> {booking.guest_phone}</div>
                <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-[#c4a47c]" /> {booking.guest_email}</div>
                <div className="flex items-center"><Users className="w-4 h-4 mr-3 text-[#c4a47c]" /> {booking.adult_guests} Adults, {booking.child_guests} Children</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-resort-cocoa/50 mb-4 pb-2 border-b border-resort-cocoa/10 flex items-center">
                <Bed className="w-4 h-4 mr-2" /> Stay Details
              </h3>
              <div className="space-y-3 bg-resort-offwhite/50 p-4 rounded-xl border border-resort-cocoa/5">
                <div className="flex items-center"><Bed className="w-4 h-4 mr-3 text-[#c4a47c]" /> <span className="font-medium text-base">{booking.rooms?.name || "Unknown Room"}</span></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-[#c4a47c]" /> {format(new Date(booking.check_in), "MMM d, yyyy")} to {format(new Date(booking.check_out), "MMM d, yyyy")} ({booking.nights} Nights)</div>
                <div className="flex items-center pt-3 mt-3 border-t border-resort-cocoa/10">
                  <CreditCard className="w-5 h-5 mr-3 text-resort-cocoa" /> 
                  <span className="text-resort-cocoa/70 mr-auto uppercase tracking-widest text-xs font-bold">Total Cost</span>
                  <span className="font-serif text-2xl text-[#132c4a]">₱{booking.grand_total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof Column */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-resort-cocoa/50 mb-4 pb-2 border-b border-resort-cocoa/10">Latest Submission</h3>
              {!activeSubmission ? (
                <div className="bg-resort-offwhite p-8 rounded-xl text-center text-resort-cocoa/50 border border-resort-cocoa/10 border-dashed">
                  No payment submitted yet.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-resort-offwhite p-5 rounded-xl border border-resort-cocoa/5 space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-resort-cocoa/60 font-medium">Method:</span>
                      <span className="font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-md border border-resort-cocoa/10">{activeSubmission.payment_method === 'gcash' ? 'GCash' : 'Bank Transfer'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-resort-cocoa/60 font-medium">Amount Sent:</span>
                      <span className="font-serif text-2xl text-[#132c4a]">₱{activeSubmission.amount_claimed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-resort-cocoa/60 font-medium">Submitted:</span>
                      <span className="font-medium">{format(new Date(activeSubmission.created_at), "MMM d, yyyy - h:mm a")}</span>
                    </div>
                  </div>

                  {signedUrl && (
                    <div>
                      <h4 className="text-xs font-bold text-resort-cocoa/50 uppercase tracking-widest mb-3">Attached Proof</h4>
                      <div className="bg-resort-offwhite rounded-xl border border-resort-cocoa/10 p-3 text-center">
                        <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden group rounded-lg">
                          {/* simple preview if image, otherwise link */}
                          {activeSubmission.proof_storage_path.toLowerCase().endsWith('.pdf') ? (
                            <div className="py-12 bg-white border border-resort-cocoa/5 text-resort-cocoa font-medium group-hover:bg-resort-sand/20 transition-colors">
                              View PDF Document
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={signedUrl} alt="Payment Proof" className="max-h-80 mx-auto object-contain bg-white w-full rounded" />
                          )}
                          <div className="absolute inset-0 bg-[#132c4a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm tracking-widest uppercase">
                            Open in New Tab
                          </div>
                        </a>
                      </div>

                      <div className="mt-3">
                        <a 
                          href={downloadUrl || signedUrl || '#'} 
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full py-2.5 px-4 bg-resort-cocoa text-resort-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#132c4a] transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download Proof
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
