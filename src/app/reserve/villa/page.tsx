"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { ReservationProgress } from "@/components/ui/reservation-progress";
import { resort, type ResortRoom } from "@/data/resort";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Users, Bed, Check } from "lucide-react";
import { useReservation } from "@/context/reservation-context";
import { useResortData } from "@/hooks/useResortData";

export default function ReserveVillaPage() {
  const { state, updateState, nights, formatDate, formatCurrency, isHydrated } = useReservation();
  const router = useRouter();
  const { rooms, bookingReminders } = useResortData();

  useEffect(() => {
    if (isHydrated && (!state.checkIn || !state.checkOut)) {
      router.push("/reserve");
    }
  }, [state.checkIn, state.checkOut, isHydrated, router]);

  if (!isHydrated || !state.checkIn || !state.checkOut) return null;

  const handleSelectVilla = (room: ResortRoom) => {
    updateState({ selectedVilla: room });
    router.push("/reserve/guest");
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite pt-20">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center px-4 overflow-hidden bg-resort-cocoa text-resort-white">
          <Image
            src={rooms[0]?.image || resort.rooms[0].image}
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
                RESERVATIONS · {resort.address.short.toUpperCase()}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl mb-6 drop-shadow-md">Choose your room.</h1>
              <p className="text-lg text-resort-white/90 font-light max-w-2xl drop-shadow leading-relaxed">
                Select from the confirmed resort room types and continue with guest details.
              </p>
            </div>
          </div>
        </section>

        <ReservationProgress currentStep={2} />

        <section className="py-16 md:py-24 bg-resort-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-resort-cocoa/10 pb-8">
              <div>
                <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                  AVAILABLE ROOMS
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-resort-cocoa">Real stays for your dates.</h2>
              </div>
              <div className="mt-6 md:mt-0 bg-resort-offwhite px-4 py-3 sm:px-6 sm:py-4 rounded text-sm text-resort-cocoa/70 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-resort-olive mr-2 shrink-0" />
                  <span>
                    {formatDate(state.checkIn)} - {formatDate(state.checkOut)} ({nights} {nights === 1 ? "Night" : "Nights"})
                  </span>
                </div>
                <span className="hidden sm:inline mx-2">·</span>
                <span className="pl-6 sm:pl-0">
                  {state.adultGuests + state.childGuests} {(state.adultGuests + state.childGuests) === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>

            <div className="mb-12 bg-resort-sand/20 border border-resort-cocoa/10 p-6 rounded-xl text-sm text-resort-cocoa/80">
              <h4 className="font-serif text-lg text-resort-cocoa mb-3">Booking Policies & Reminders</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-disc list-inside">
                {bookingReminders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-resort-white border border-resort-cocoa/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 sm:p-8 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-4">
                      <div>
                        <h3 className="font-serif text-2xl text-resort-cocoa">{room.name}</h3>
                        <p className="text-xs uppercase tracking-wider text-resort-cocoa/45 mt-1">{room.category}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="block text-sm text-resort-cocoa/35 line-through">
                          {formatCurrency(room.regularRate)}
                        </span>
                        <span className="block font-medium text-lg text-resort-cocoa">{formatCurrency(room.discountedRate)}</span>
                        <span className="text-xs text-resort-cocoa/50 uppercase tracking-wider">per night</span>
                      </div>
                    </div>

                    <p className="text-resort-cocoa/70 mb-6 flex-1 text-sm leading-relaxed">{room.shortDescription}</p>

                    <div className="flex flex-col gap-2 text-sm text-resort-cocoa/70 mb-8 pt-6 border-t border-resort-cocoa/10">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 opacity-50" />
                        <span>Up to {room.maxGuests} guests</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-2 opacity-50" />
                        <span>{room.beds}</span>
                      </div>
                      <div>
                        {room.extraGuestAllowance > 0
                          ? `Allows ${room.extraGuestAllowance} extra guest${room.extraGuestAllowance > 1 ? "s" : ""}`
                          : "No extra guest add-on listed"}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectVilla(room)}
                      className="flex items-center justify-center w-full px-8 py-4 bg-resort-olive text-resort-white hover:bg-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded group/btn"
                    >
                      Select Room
                      <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
