"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { ReservationProgress } from "@/components/ui/reservation-progress";
import { resort } from "@/data/resort";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Upload, CheckCircle2, Info, Loader2 } from "lucide-react";
import { useReservation } from "@/context/reservation-context";
import { useResortData } from "@/hooks/useResortData";

export default function ReservePaymentPage() {
  const { state, updateState, nights, totalPrice, amountDueToday, remainingBalance, formatDate, formatCurrency, isHydrated } = useReservation();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "gcash">("bank_transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { settings, bookingSettings, bookingReminders } = useResortData();

  const bankTransferEnabled = settings ? Boolean(settings.bank_transfer_enabled) : true;
  const gcashEnabled = settings ? Boolean(settings.gcash_enabled) : true;
  const activePaymentMethod =
    !bankTransferEnabled && gcashEnabled && paymentMethod === "bank_transfer"
      ? "gcash"
      : !gcashEnabled && bankTransferEnabled && paymentMethod === "gcash"
        ? "bank_transfer"
        : paymentMethod;

  useEffect(() => {
    if (isHydrated) {
      if (!state.selectedVilla) {
        router.push("/reserve/villa");
      } else if (!state.guestDetails.fullName) {
        router.push("/reserve/guest");
      }
    }
  }, [state, isHydrated, router]);

  if (!isHydrated || !state.selectedVilla || !state.guestDetails.fullName) return null;

  const room = state.selectedVilla;
  const { fullName } = state.guestDetails;
  const canSubmit = Boolean(file) && !isSubmitting;

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Create booking (idempotent, safe to retry)
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSlug: state.selectedVilla?.slug,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          adultGuests: state.adultGuests,
          childGuests: state.childGuests,
          guestName: state.guestDetails.fullName,
          guestEmail: state.guestDetails.email,
          guestPhone: state.guestDetails.phone,
          specialRequests: state.guestDetails.specialRequests,
          paymentOption: state.paymentOption,
          clientRequestId: state.clientRequestId
        })
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.error || 'Failed to create booking');

      // Save token & reference if we got them (first time)
      if (bookingData.guestAccessToken) {
        updateState({ 
          remoteBookingReference: bookingData.bookingReference,
          guestAccessToken: bookingData.guestAccessToken
        });
      }

      const activeToken = bookingData.guestAccessToken || state.guestAccessToken;
      const activeRef = bookingData.bookingReference || state.remoteBookingReference;

      if (!activeToken || !activeRef) {
        throw new Error("Missing authentication token or booking reference. Please try refreshing and re-submitting.");
      }

      // 2. Submit payment proof
      const formData = new FormData();
      formData.append('proofFile', file);
      formData.append('paymentMethod', activePaymentMethod);
      formData.append('amountClaimed', amountDueToday.toString());

      const paymentRes = await fetch(`/api/bookings/${activeRef}/payment-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        },
        body: formData
      });

      if (!paymentRes.ok) {
        const paymentData = await paymentRes.json();
        throw new Error(paymentData.error || 'Failed to upload payment proof');
      }

      // Success! Proceed to confirmation
      router.push('/reserve/confirmation');

    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite pt-20">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center px-4 overflow-hidden bg-resort-cocoa text-resort-white">
          <Image
            src={resort.rooms[0].image}
            alt="Piero Beach Resort room"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/40" />

          <div className="relative z-10 container mx-auto px-4 mt-10">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-resort-seafoam text-xs tracking-[0.2em] uppercase font-bold mb-4">
                RESERVATIONS · CABANGAN, ZAMBALES
              </span>
              <h1 className="font-serif text-5xl md:text-6xl mb-6 drop-shadow-md">Reserve your stay.</h1>
              <p className="text-lg text-resort-white/90 font-light max-w-2xl drop-shadow leading-relaxed">
                A few quiet steps with our concierge. We&apos;ll guide you through dates, your room, and a calm, secure payment.
              </p>
            </div>
          </div>
        </section>

        <ReservationProgress currentStep={5} />

        <section className="py-16 md:py-24 bg-resort-offwhite">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-10">
                <div>
                  <h2 className="font-serif text-2xl text-resort-cocoa mb-6">1. Payment Option</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`relative border-2 rounded-xl p-6 cursor-pointer bg-resort-white transition-colors ${state.paymentOption === "full" ? "border-resort-terracotta" : "border-transparent hover:border-resort-terracotta/50 shadow-sm"}`}>
                      <input
                        type="radio"
                        name="paymentOption"
                        className="absolute opacity-0"
                        checked={state.paymentOption === "full"}
                        onChange={() => updateState({ paymentOption: "full" })}
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-resort-cocoa mb-1">Full payment</p>
                          <p className="text-sm text-resort-cocoa/70">Pay the entire amount now</p>
                        </div>
                        {state.paymentOption === "full" && <CheckCircle2 className="w-6 h-6 text-resort-terracotta" />}
                      </div>
                    </label>

                    <label className={`relative border-2 rounded-xl p-6 cursor-pointer bg-resort-white transition-colors ${state.paymentOption === "half" ? "border-resort-terracotta" : "border-transparent hover:border-resort-terracotta/50 shadow-sm"}`}>
                      <input
                        type="radio"
                        name="paymentOption"
                        className="absolute opacity-0"
                        checked={state.paymentOption === "half"}
                        onChange={() => updateState({ paymentOption: "half" })}
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-resort-cocoa mb-1">Pay half now</p>
                          <p className="text-sm text-resort-cocoa/70">Pay 50% now, the rest upon check-in</p>
                        </div>
                        {state.paymentOption === "half" && <CheckCircle2 className="w-6 h-6 text-resort-terracotta" />}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-resort-sand p-6 rounded-xl flex items-center justify-between border border-resort-olive/20">
                  <div>
                    <p className="text-sm text-resort-cocoa/70 uppercase tracking-widest font-bold mb-1">Amount Due Today</p>
                    <p className="text-3xl font-serif text-resort-cocoa">{formatCurrency(amountDueToday)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-resort-cocoa/70">Total Price</p>
                    <p className="font-medium text-resort-cocoa line-through opacity-50">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-resort-cocoa mb-6">2. Payment Method</h2>
                  <div className="sm:hidden rounded-full border border-resort-cocoa/15 bg-resort-white p-1 shadow-sm">
                    <div className="grid grid-cols-2 gap-1">
                      {bankTransferEnabled && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("bank_transfer")}
                          className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                            activePaymentMethod === "bank_transfer"
                              ? "bg-resort-cocoa text-resort-white"
                              : "text-resort-cocoa/65"
                          }`}
                        >
                          Bank Transfer
                        </button>
                      )}
                      {gcashEnabled && (
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("gcash")}
                          className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                            activePaymentMethod === "gcash"
                              ? "bg-resort-cocoa text-resort-white"
                              : "text-resort-cocoa/65"
                          }`}
                        >
                          GCash
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bankTransferEnabled && (
                      <label className={`relative border-2 rounded-xl p-6 cursor-pointer bg-resort-white transition-colors ${activePaymentMethod === "bank_transfer" ? "border-resort-terracotta" : "border-transparent hover:border-resort-terracotta/50 shadow-sm"}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="absolute opacity-0"
                          checked={activePaymentMethod === "bank_transfer"}
                          onChange={() => setPaymentMethod("bank_transfer")}
                        />
                        <div className="flex items-start space-x-4">
                          <CreditCard className={`w-6 h-6 ${activePaymentMethod === "bank_transfer" ? "text-resort-terracotta" : "text-resort-cocoa/50"}`} />
                          <div>
                            <p className="font-bold text-resort-cocoa mb-1">Bank Transfer</p>
                            <p className="text-sm text-resort-cocoa/70">Transfer using the bank details provided by the resort</p>
                          </div>
                        </div>
                        {activePaymentMethod === "bank_transfer" && <CheckCircle2 className="absolute top-6 right-6 w-5 h-5 text-resort-terracotta" />}
                      </label>
                    )}

                    {gcashEnabled && (
                      <label className={`relative border-2 rounded-xl p-6 cursor-pointer bg-resort-white transition-colors ${activePaymentMethod === "gcash" ? "border-resort-terracotta" : "border-transparent hover:border-resort-terracotta/50 shadow-sm"}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="absolute opacity-0"
                          checked={activePaymentMethod === "gcash"}
                          onChange={() => setPaymentMethod("gcash")}
                        />
                        <div className="flex items-start space-x-4">
                          <Wallet className={`w-6 h-6 ${activePaymentMethod === "gcash" ? "text-resort-terracotta" : "text-resort-cocoa/50"}`} />
                          <div>
                            <p className="font-bold text-resort-cocoa mb-1">GCash</p>
                            <p className="text-sm text-resort-cocoa/70">Pay via GCash app</p>
                          </div>
                        </div>
                        {activePaymentMethod === "gcash" && <CheckCircle2 className="absolute top-6 right-6 w-5 h-5 text-resort-terracotta" />}
                      </label>
                    )}
                  </div>
                </div>

                <div className="bg-resort-white p-6 md:p-8 rounded-xl shadow-sm border border-resort-cocoa/5">
                  <h3 className="font-bold text-resort-cocoa mb-4 uppercase tracking-wide text-sm">
                    {activePaymentMethod === "bank_transfer" ? "Bank Transfer Details" : "GCash Details"}
                  </h3>
                  <p className="text-sm text-resort-cocoa/60 mb-4">{resort.payment.note}</p>
                  {activePaymentMethod === "bank_transfer" ? (
                    <div className="space-y-3 text-resort-cocoa/80 text-sm">
                      <div className="flex justify-between border-b border-resort-cocoa/10 pb-2">
                        <span>Bank Name:</span>
                        <span className="font-medium text-resort-cocoa">{settings?.bank_name || resort.payment.bankTransfer.bankName}</span>
                      </div>
                      <div className="flex justify-between border-b border-resort-cocoa/10 pb-2">
                        <span>Account Name:</span>
                        <span className="font-medium text-resort-cocoa">{settings?.bank_account_name || resort.payment.bankTransfer.accountName}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span>Account Number:</span>
                        <span className="font-medium text-resort-cocoa">{settings?.bank_account_number || resort.payment.bankTransfer.accountNumber}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-resort-cocoa/80 text-sm">
                      <div className="flex justify-between border-b border-resort-cocoa/10 pb-2">
                        <span>GCash Name:</span>
                        <span className="font-medium text-resort-cocoa">{settings?.gcash_name || resort.payment.gcash.name}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span>GCash Number:</span>
                        <span className="font-medium text-resort-cocoa">{settings?.gcash_number || resort.payment.gcash.number}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-serif text-2xl text-resort-cocoa mb-6">3. Proof of Payment</h2>
                  <label htmlFor="payment-proof" className="border-2 border-dashed border-resort-cocoa/20 rounded-xl p-6 sm:p-10 text-center bg-resort-white hover:bg-resort-sand/30 transition-colors cursor-pointer flex flex-col items-center justify-center block">
                    <input
                      type="file"
                      id="payment-proof"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => {
                        const selected = e.target.files?.[0] || null;
                        setFile(selected);
                        if (selected && selected.type.startsWith("image/")) {
                          setPreviewUrl(URL.createObjectURL(selected));
                        } else {
                          setPreviewUrl(null);
                        }
                      }}
                    />
                    {file ? (
                      <>
                        {previewUrl ? (
                          <div className="w-24 h-24 mb-4 relative rounded-lg overflow-hidden border border-resort-cocoa/20 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-resort-sand rounded-full flex items-center justify-center text-resort-terracotta mb-4">
                            <Upload className="w-8 h-8" />
                          </div>
                        )}
                        <p className="font-medium text-resort-olive mb-1">{file.name}</p>
                        <p className="text-sm text-resort-cocoa/50">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-resort-sand rounded-full flex items-center justify-center text-resort-terracotta mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <p className="font-medium text-resort-cocoa mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-resort-cocoa/50">PNG, JPG or PDF (max. 10MB)</p>
                      </>
                    )}
                  </label>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full flex justify-center items-center px-8 py-4 font-semibold tracking-widest uppercase text-sm rounded shadow-lg transition-colors ${
                    canSubmit
                      ? "bg-resort-terracotta text-resort-white hover:bg-resort-cocoa"
                      : "bg-resort-cocoa/20 text-resort-cocoa/50 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Payment Details"
                  )}
                </button>
                {!canSubmit && !isSubmitting && (
                  <p className="mt-3 text-sm text-resort-cocoa/60 text-center">
                    Upload proof of payment before submitting.
                  </p>
                )}
              </div>

              <div className="lg:col-span-5 sticky top-28">
                <div className="bg-resort-white rounded-2xl shadow-md border border-resort-cocoa/5 overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="p-5 sm:p-8">
                    <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-2">
                      RESERVATION SUMMARY
                    </span>
                    <h3 className="font-serif text-3xl text-resort-cocoa mb-6 pb-6 border-b border-resort-cocoa/10">
                      {room.name}
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Guest Name</p>
                        <p className="font-medium text-resort-cocoa">{fullName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Check-in</p>
                          <p className="font-medium text-resort-cocoa">{formatDate(state.checkIn)}</p>
                          <p className="text-sm text-resort-cocoa/60">From {bookingSettings.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Check-out</p>
                          <p className="font-medium text-resort-cocoa">{formatDate(state.checkOut)}</p>
                          <p className="text-sm text-resort-cocoa/60">Until {bookingSettings.checkOut}</p>
                        </div>
                      </div>

                      <div className="border-t border-resort-cocoa/10 pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-resort-cocoa/80">Number of nights</p>
                          <p className="font-medium text-resort-cocoa">{nights} {nights === 1 ? "Night" : "Nights"}</p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-resort-cocoa/80">Guests</p>
                          <p className="font-medium text-resort-cocoa">{state.adultGuests} Adults, {state.childGuests} Children</p>
                        </div>
                        {remainingBalance > 0 && (
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-resort-cocoa/5">
                            <p className="text-resort-cocoa/80">Remaining Balance</p>
                            <p className="font-medium text-resort-cocoa">{formatCurrency(remainingBalance)}</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-resort-sand/50 rounded-lg p-4 flex justify-between items-center">
                        <p className="font-serif text-xl text-resort-cocoa">Total Price</p>
                        <p className="font-serif text-2xl text-resort-olive font-bold">{formatCurrency(totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-start space-x-3 text-resort-cocoa/60 text-sm">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Your reservation is currently pending. Once your payment submission is received, the resort team will review it. {bookingReminders[4]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
