"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { ReservationProgress } from "@/components/ui/reservation-progress";
import { bookingReminderList, resort } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Users, Bed, CreditCard, Clock, ShieldCheck } from "lucide-react";
import { useReservation } from "@/context/reservation-context";

export default function ReserveReviewPage() {
  const { state, nights, totalPrice, formatDate, formatCurrency, isHydrated } = useReservation();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!state.selectedVilla) {
        router.push("/reserve/villa");
      } else if (!state.guestDetails.fullName || !state.guestDetails.email || !state.guestDetails.phone) {
        router.push("/reserve/guest");
      }
    }
  }, [state, isHydrated, router]);

  if (!isHydrated || !state.selectedVilla || !state.guestDetails.fullName) return null;

  const room = state.selectedVilla;
  const basePrice = room.discountedRate * nights;
  const baseCapacity = room.maxGuests - room.extraGuestAllowance;
  const extraAdultsCount = Math.max(0, state.adultGuests - baseCapacity);
  const extraAdultsCost = extraAdultsCount * 1300 * nights;
  const deposit = Math.round(totalPrice / 2);
  const { fullName, email, phone, specialRequests } = state.guestDetails;

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
          <div className="absolute inset-0 bg-resort-cocoa/50" />

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

        <ReservationProgress currentStep={4} />

        <section className="py-16 md:py-24 bg-resort-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8">
                <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                  REVIEW
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-resort-cocoa mb-8">A final look before we hold your room.</h2>

                <div className="space-y-8">
                  <div className="bg-resort-white border border-resort-cocoa/10 rounded-xl p-5 sm:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-2xl text-resort-cocoa">{room.name}</h3>
                          <Link href="/reserve/villa" className="text-sm text-resort-terracotta underline font-medium">Edit</Link>
                        </div>
                        <p className="text-resort-cocoa/70 text-sm mb-4">{room.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-resort-cocoa/70">
                          <span className="flex items-center"><Users className="w-4 h-4 mr-1 opacity-50" /> {state.adultGuests + state.childGuests} Guests</span>
                          <span className="flex items-center"><Bed className="w-4 h-4 mr-1 opacity-50" /> {room.beds}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-resort-white border border-resort-cocoa/10 rounded-xl p-5 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl text-resort-cocoa">Dates & Guests</h3>
                      <Link href="/reserve" className="text-sm text-resort-terracotta underline font-medium">Edit</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Check-in</p>
                        <p className="font-medium text-resort-cocoa text-lg">{formatDate(state.checkIn)}</p>
                        <p className="text-sm text-resort-cocoa/50">From {resort.stay.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Check-out</p>
                        <p className="font-medium text-resort-cocoa text-lg">{formatDate(state.checkOut)}</p>
                        <p className="text-sm text-resort-cocoa/50">By {resort.stay.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Guests</p>
                        <p className="font-medium text-resort-cocoa text-lg">{state.adultGuests} {state.adultGuests === 1 ? "Adult" : "Adults"}</p>
                        {state.childGuests > 0 && <p className="text-sm text-resort-cocoa/50">{state.childGuests} {state.childGuests === 1 ? "Child" : "Children"}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-resort-white border border-resort-cocoa/10 rounded-xl p-5 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl text-resort-cocoa">Guest Information</h3>
                      <Link href="/reserve/guest" className="text-sm text-resort-terracotta underline font-medium">Edit</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Name</p>
                        <p className="font-medium text-resort-cocoa">{fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Email</p>
                        <p className="font-medium text-resort-cocoa">{email}</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Phone</p>
                        <p className="font-medium text-resort-cocoa">{phone}</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Special Requests</p>
                        <p className="font-medium text-resort-cocoa">{specialRequests || "None"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-resort-offwhite border border-resort-cocoa/10 rounded-xl p-5 sm:p-8">
                    <h3 className="font-serif text-xl text-resort-cocoa mb-6">What happens next?</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CreditCard className="w-5 h-5 text-resort-olive mr-4 shrink-0 mt-0.5" />
                        <p className="text-sm text-resort-cocoa/80">Proceed to payment and choose either full payment or a 50% deposit.</p>
                      </li>
                      <li className="flex items-start">
                        <ShieldCheck className="w-5 h-5 text-resort-olive mr-4 shrink-0 mt-0.5" />
                        <p className="text-sm text-resort-cocoa/80">Your booking is confirmed after payment verification.</p>
                      </li>
                      <li className="flex items-start">
                        <Clock className="w-5 h-5 text-resort-olive mr-4 shrink-0 mt-0.5" />
                        <p className="text-sm text-resort-cocoa/80">The resort may also contact you for rebooking or operational updates when needed.</p>
                      </li>
                    </ul>
                    <div className="mt-6 pt-6 border-t border-resort-cocoa/10 space-y-2">
                      {bookingReminderList.slice(0, 4).map((item) => (
                        <p key={item} className="text-xs text-resort-cocoa/60">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="bg-resort-white p-5 sm:p-8 rounded-xl shadow-lg border border-resort-cocoa/10 sticky top-28">
                  <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                    SUMMARY
                  </span>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Price Breakdown</h3>

                  <div className="space-y-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-resort-cocoa/70">
                        <span>{formatCurrency(room.discountedRate)} x {nights} {nights === 1 ? "night" : "nights"}</span>
                        <span>{formatCurrency(basePrice)}</span>
                      </div>
                      {extraAdultsCost > 0 && (
                        <div className="flex justify-between text-resort-cocoa/70">
                          <span>Extra Persons ({extraAdultsCount})</span>
                          <span>{formatCurrency(extraAdultsCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-resort-cocoa text-lg pt-4 border-t border-resort-cocoa/10">
                        <span>Grand Total</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-resort-olive font-medium pt-2">
                        <span>Deposit Required (50%)</span>
                        <span>{formatCurrency(deposit)}</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link
                        href="/reserve/payment"
                        className="flex items-center justify-center w-full px-8 py-4 bg-resort-olive text-resort-white hover:bg-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-md group"
                      >
                        Confirm Reservation
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <p className="text-center text-xs text-resort-cocoa/50 mt-4">
                        By confirming, you agree to our booking policies.
                      </p>
                    </div>
                  </div>
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
