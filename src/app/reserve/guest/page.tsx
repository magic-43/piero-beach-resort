"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { ReservationProgress } from "@/components/ui/reservation-progress";
import { bookingReminderList, resort } from "@/data/resort";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar, Users, Bed, Sparkles } from "lucide-react";
import { useReservation } from "@/context/reservation-context";

export default function ReserveGuestPage() {
  const { state, updateState, nights, totalPrice, formatDate, formatCurrency, isHydrated } = useReservation();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !state.selectedVilla) {
      router.push("/reserve/villa");
    }
  }, [state.selectedVilla, isHydrated, router]);

  if (!isHydrated || !state.selectedVilla) return null;

  const { fullName, email, phone, specialRequests } = state.guestDetails;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateState({
      guestDetails: {
        ...state.guestDetails,
        [name]: value,
      },
    });
  };

  const isValid = fullName.trim() !== "" && email.trim() !== "" && phone.trim() !== "";

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isValid) {
      router.push("/reserve/review");
    }
  };

  const room = state.selectedVilla;
  const basePrice = room.discountedRate * nights;
  const extraAdultsCount = Math.max(0, state.adultGuests - (room.maxGuests - room.extraGuestAllowance));
  const extraAdultsCost = extraAdultsCount * 1300 * nights;

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

        <ReservationProgress currentStep={3} />

        <section className="py-16 md:py-24 bg-resort-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8">
                <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                  GUEST DETAILS
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-resort-cocoa mb-8">A few details for our concierge.</h2>
                <p className="text-resort-cocoa/70 mb-10">Please provide your contact information so we can prepare for your arrival.</p>

                <form className="bg-resort-white border border-resort-cocoa/10 rounded-xl p-5 sm:p-8 shadow-sm space-y-8">
                  <div>
                    <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={handleInputChange}
                      placeholder="E.g. Maria Santos"
                      className="w-full p-4 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-resort-terracotta transition-colors placeholder:text-resort-cocoa/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="maria@example.com"
                      className="w-full p-4 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-resort-terracotta transition-colors placeholder:text-resort-cocoa/30"
                    />
                    <p className="text-xs text-resort-cocoa/50 mt-2">Your reservation confirmation will be sent here.</p>
                  </div>

                  <div>
                    <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={handleInputChange}
                      placeholder="+63 900 000 0000"
                      className="w-full p-4 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-resort-terracotta transition-colors placeholder:text-resort-cocoa/30"
                    />
                  </div>

                  <div className="pt-4 border-t border-resort-cocoa/10">
                    <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-2 block flex items-center">
                      <Sparkles className="w-3 h-3 mr-2" />
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={specialRequests}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Celebrating a special occasion? Dietary restrictions? Let us know how we can make your stay perfect."
                      className="w-full p-4 bg-resort-offwhite border border-resort-cocoa/10 rounded focus:outline-none focus:border-resort-terracotta transition-colors placeholder:text-resort-cocoa/30 resize-none"
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="bg-resort-white p-5 sm:p-8 rounded-xl shadow-lg border border-resort-cocoa/10 sticky top-28">
                  <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                    SUMMARY
                  </span>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Your stay</h3>

                  <div className="space-y-6">
                    <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div>
                      <h4 className="font-serif text-xl text-resort-cocoa mb-2">{room.name}</h4>
                      <div className="flex flex-col space-y-1 text-xs text-resort-cocoa/70">
                        <span className="flex items-center"><Users className="w-3 h-3 mr-2" /> {state.adultGuests} Adults aged 8+</span>
                        <span className="flex items-center"><Users className="w-3 h-3 mr-2 opacity-50" /> {state.childGuests} Children aged 0–7</span>
                        <span className="flex items-center pt-1"><Bed className="w-3 h-3 mr-2" /> {room.beds}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-resort-cocoa/10">
                      <div className="flex items-start mb-4">
                        <Calendar className="w-4 h-4 mr-3 mt-1 text-resort-olive" />
                        <div>
                          <p className="font-medium text-resort-cocoa">{formatDate(state.checkIn)} - {formatDate(state.checkOut)}</p>
                          <p className="text-xs text-resort-cocoa/60">
                            {nights} {nights === 1 ? "Night" : "Nights"} · {resort.stay.checkIn} check-in · {resort.stay.checkOut} check-out
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-resort-cocoa/10 space-y-3 text-sm">
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
                      
                      <div className="flex justify-between font-bold text-resort-cocoa text-lg pt-3 border-t border-resort-cocoa/10">
                        <span>Grand Total</span>
                        <span>{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={handleContinue}
                        disabled={!isValid}
                        className={`flex items-center justify-center w-full px-8 py-4 font-semibold tracking-widest uppercase text-sm rounded shadow-md transition-colors group ${
                          isValid
                            ? "bg-resort-olive text-resort-white hover:bg-resort-cocoa"
                            : "bg-resort-cocoa/20 text-resort-cocoa/50 cursor-not-allowed"
                        }`}
                      >
                        Review Reservation
                        <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${isValid ? "group-hover:translate-x-1" : ""}`} />
                      </button>
                    </div>

                    <div className="pt-6 border-t border-resort-cocoa/10 space-y-2">
                      <p className="text-xs text-resort-cocoa/60">{resort.reminders.securityDeposit}</p>
                      {bookingReminderList.slice(0, 2).map((item) => (
                        <p key={item} className="text-xs text-resort-cocoa/60">
                          {item}
                        </p>
                      ))}
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
