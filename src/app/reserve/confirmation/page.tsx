"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort } from "@/data/resort";
import { useRouter } from "next/navigation";
import { useReservation } from "@/context/reservation-context";
import { useResortData } from "@/hooks/useResortData";

export default function ReserveConfirmationPage() {
  const { state, nights, totalPrice, amountDueToday, remainingBalance, formatDate, formatCurrency, isHydrated, resetContext } = useReservation();
  const { bookingSettings } = useResortData();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isHydrated && mounted) {
      if (!state.selectedVilla) {
        router.push("/reserve");
      }
    }
  }, [state, isHydrated, mounted, router]);

  // We intentionally do not wipe state on mount so the user can see their summary.
  // We can wipe it if they click "Return to Home".

  if (!isHydrated || !mounted || !state.selectedVilla) return null;

  const villa = state.selectedVilla;
  const { fullName } = state.guestDetails;

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-resort-offwhite pt-20">
        <section className="py-16 md:py-24 bg-resort-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                RESERVATION SUBMITTED
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">
                Thank you. We are reviewing your reservation.
              </h1>
              <p className="text-resort-cocoa/70 max-w-2xl mx-auto leading-relaxed">
                Our resort team will verify your payment proof. Bookings are confirmed after payment verification. If you need any assistance, you may call {resort.contact.phone} or send a WhatsApp message.
              </p>
            </div>

            <div className="bg-resort-offwhite border border-resort-cocoa/10 rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm mb-12">
              <div className="text-center mb-10 pb-10 border-b border-resort-cocoa/10">
                <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-2">Booking Reference</p>
                <p className="font-mono text-3xl md:text-4xl text-resort-cocoa tracking-wider">
                  {state.remoteBookingReference || "PENDING"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Reservation Summary */}
                <div>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Reservation Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Room</p>
                      <p className="font-medium text-resort-cocoa text-lg">{villa.name}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Guest Name</p>
                      <p className="font-medium text-resort-cocoa text-lg">{fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Check-in</p>
                        <p className="font-medium text-resort-cocoa">{formatDate(state.checkIn)}</p>
                        <p className="text-sm text-resort-cocoa/60">From {bookingSettings.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Check-out</p>
                        <p className="font-medium text-resort-cocoa">{formatDate(state.checkOut)}</p>
                        <p className="text-sm text-resort-cocoa/60">By {bookingSettings.checkOut}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Duration</p>
                        <p className="font-medium text-resort-cocoa">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-resort-cocoa/50 font-bold mb-1">Guests</p>
                        <p className="font-medium text-resort-cocoa">{state.adultGuests} Adults, {state.childGuests} Children</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Payment Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-resort-cocoa/10">
                      <span className="text-resort-cocoa/70">Total Price</span>
                      <span className="font-medium text-resort-cocoa">{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-resort-cocoa/10">
                      <span className="text-resort-cocoa/70">Payment Option</span>
                      <span className="font-medium text-resort-cocoa">{state.paymentOption === 'full' ? 'Full Payment' : '50% Deposit'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-resort-cocoa/10">
                      <span className="text-resort-cocoa/70">Amount Submitted</span>
                      <span className="font-medium text-resort-olive text-lg">{formatCurrency(amountDueToday)}</span>
                    </div>
                    {remainingBalance > 0 && (
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-resort-cocoa/70 font-medium">Remaining Balance</span>
                        <span className="font-medium text-resort-terracotta">{formatCurrency(remainingBalance)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => {
                  resetContext();
                  router.push("/");
                }}
                className="w-full sm:w-auto px-8 py-4 bg-resort-olive text-resort-white hover:bg-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-md text-center"
              >
                Return to Home
              </button>
              <button 
                onClick={() => {
                  resetContext();
                  router.push("/rooms");
                }}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-resort-cocoa/20 text-resort-cocoa hover:bg-resort-sand transition-colors font-semibold tracking-widest uppercase text-sm rounded text-center"
              >
                Explore More Rooms
              </button>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
