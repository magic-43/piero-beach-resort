"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { ReservationProgress } from "@/components/ui/reservation-progress";
import { bookingReminderList, resort, siteImages } from "@/data/resort";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useReservation } from "@/context/reservation-context";

export default function ReserveDatesPage() {
  const { state, updateState, formatDate, nights, isHydrated } = useReservation();
  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    const clickedDateString = clickedDate.toISOString();

    if (!state.checkIn || state.checkOut) {
      updateState({ checkIn: clickedDateString, checkOut: "" });
      return;
    }

    const checkInDate = new Date(state.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (clickedDate <= checkInDate) {
      updateState({ checkIn: clickedDateString, checkOut: "" });
      return;
    }

    updateState({ checkOut: clickedDateString });
  };

  const isCheckIn = (day: number) => {
    if (!state.checkIn) return false;
    const date = new Date(state.checkIn);
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isCheckOut = (day: number) => {
    if (!state.checkOut) return false;
    const date = new Date(state.checkOut);
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isInBetween = (day: number) => {
    if (!state.checkIn || !state.checkOut) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const start = new Date(state.checkIn);
    const end = new Date(state.checkOut);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return date > start && date < end;
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today;
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.checkIn && state.checkOut) {
      router.push("/reserve/villa");
    }
  };

  if (!isHydrated) return null;

  const isValidSelection = Boolean(state.checkIn && state.checkOut);

  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite pt-20">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center px-4 overflow-hidden bg-resort-cocoa text-resort-white">
          <Image
            src={siteImages.reserveBg}
            alt="Beachfront view"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/50" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 mt-10">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-resort-seafoam text-xs tracking-[0.2em] uppercase font-bold mb-4">
                RESERVATIONS · {resort.address.short.toUpperCase()}
              </span>
              <h1 className="font-serif text-5xl md:text-6xl mb-6 drop-shadow-md">Reserve your stay.</h1>
              <p className="text-lg text-resort-white/90 font-light max-w-2xl drop-shadow leading-relaxed">
                Pick your dates first, then continue to the real room list and payment steps.
              </p>
            </div>
          </Reveal>
        </section>

        <ReservationProgress currentStep={1} />

        <section className="py-16 md:py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-8">
                <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                  THE CALENDAR
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-resort-cocoa mb-8">When will you be staying?</h2>
                <p className="text-resort-cocoa/70 mb-10">
                  Select your arrival, then your departure. Past dates are unavailable.
                </p>

                <div className="bg-resort-white border border-resort-cocoa/10 rounded-xl p-3 sm:p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-resort-sand rounded-full transition-colors"
                      disabled={currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1)
                            ? "text-resort-cocoa/20"
                            : "text-resort-cocoa/50 hover:text-resort-cocoa"
                        }`}
                      />
                    </button>
                    <div className="text-center">
                      <p className="text-resort-terracotta font-medium text-sm">
                        {state.checkIn && !state.checkOut ? "Select Check-out Date" : "Select Check-in Date"}
                      </p>
                      <h3 className="font-serif text-xl text-resort-cocoa">
                        {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                      </h3>
                    </div>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-resort-sand rounded-full transition-colors">
                      <ChevronRight className="w-5 h-5 text-resort-cocoa" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center mb-4">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                      <div key={day} className="text-xs font-bold tracking-widest text-resort-cocoa/50 uppercase">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-resort-cocoa">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-3"></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const past = isPast(day);
                      const selectedCheckIn = isCheckIn(day);
                      const selectedCheckOut = isCheckOut(day);
                      const inBetween = isInBetween(day);
                      const isSunday = (firstDay + day - 1) % 7 === 0;
                      const isSaturday = (firstDay + day - 1) % 7 === 6;

                      let className =
                        "w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-full flex items-center justify-center mx-auto transition-colors ";

                      if (past) {
                        className += "text-resort-cocoa/30 cursor-not-allowed";
                      } else if (selectedCheckIn || selectedCheckOut) {
                        className += "bg-resort-olive text-resort-white font-bold cursor-pointer";
                      } else if (inBetween) {
                        className += "bg-resort-seafoam/30 hover:bg-resort-seafoam/50 cursor-pointer";
                      } else {
                        className += "hover:bg-resort-sand cursor-pointer";
                      }

                      return (
                        <div key={day} className="relative" onClick={() => !past && handleDateClick(day)}>
                          {(inBetween || selectedCheckIn) && !selectedCheckOut && state.checkOut && (
                            <div
                              className={`absolute top-1/2 left-1/2 ${
                                isSaturday ? "right-0" : "right-[-50%]"
                              } h-8 sm:h-10 -translate-y-1/2 bg-resort-seafoam/30 z-0`}
                            ></div>
                          )}
                          {(inBetween || selectedCheckOut) && !selectedCheckIn && state.checkIn && (
                            <div
                              className={`absolute top-1/2 right-1/2 ${
                                isSunday ? "left-0" : "left-[-50%]"
                              } h-8 sm:h-10 -translate-y-1/2 bg-resort-seafoam/30 z-0`}
                            ></div>
                          )}

                          <div className={`relative z-10 ${className}`}>{day}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-6 mt-10 pt-6 border-t border-resort-cocoa/5 text-sm text-resort-cocoa/60">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-resort-olive rounded-full"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-resort-seafoam/50 rounded-full"></div>
                      <span>Your Stay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-transparent border border-resort-cocoa/30 rounded-full"></div>
                      <span>Past</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 mt-8 lg:mt-0">
                <div className="bg-resort-white p-8 rounded-xl shadow-lg border border-resort-cocoa/10 sticky top-28">
                  <span className="inline-block text-resort-olive text-xs tracking-[0.2em] uppercase font-bold mb-4">
                    TRIP DETAILS
                  </span>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-8">Your stay</h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Check-in</p>
                      <p className="font-medium text-resort-cocoa text-lg">
                        {state.checkIn ? formatDate(state.checkIn) : "Select date"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase mb-1">Check-out</p>
                      <p className="font-medium text-resort-cocoa text-lg">
                        {state.checkOut ? formatDate(state.checkOut) : "Select date"}
                      </p>
                    </div>

                    <p className="text-sm text-resort-cocoa/70 pb-6 border-b border-resort-cocoa/10">
                      {nights > 0 ? `${nights} nights` : "Duration"} · {resort.stay.checkIn} check-in, {resort.stay.checkOut} check-out
                    </p>

                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase block">
                            Adults (Aged 8+)
                          </label>
                        </div>
                        <div className="flex items-center space-x-4 bg-resort-offwhite p-1 rounded-full border border-resort-cocoa/10">
                          <button
                            type="button"
                            disabled={state.adultGuests <= 1}
                            onClick={() => updateState({ adultGuests: Math.max(1, state.adultGuests - 1) })}
                            className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-bold text-resort-cocoa text-sm">
                            {state.adultGuests}
                          </span>
                          <button
                            type="button"
                            disabled={state.adultGuests >= 20}
                            onClick={() => updateState({ adultGuests: Math.min(20, state.adultGuests + 1) })}
                            className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs tracking-widest text-resort-cocoa/50 font-bold uppercase block">
                            Children (Aged 0-7)
                          </label>
                        </div>
                        <div className="flex items-center space-x-4 bg-resort-offwhite p-1 rounded-full border border-resort-cocoa/10">
                          <button
                            type="button"
                            disabled={state.childGuests <= 0}
                            onClick={() => updateState({ childGuests: Math.max(0, state.childGuests - 1) })}
                            className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-bold text-resort-cocoa text-sm">
                            {state.childGuests}
                          </span>
                          <button
                            type="button"
                            disabled={state.childGuests >= 10}
                            onClick={() => updateState({ childGuests: Math.min(10, state.childGuests + 1) })}
                            className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleContinue}
                        disabled={!isValidSelection}
                        className={`flex items-center justify-center w-full px-8 py-4 font-semibold tracking-widest uppercase text-sm rounded shadow-md transition-colors group ${
                          isValidSelection
                            ? "bg-resort-olive text-resort-white hover:bg-resort-cocoa"
                            : "bg-resort-cocoa/20 text-resort-cocoa/50 cursor-not-allowed"
                        }`}
                      >
                        Choose Your Room
                        <ChevronRight
                          className={`w-4 h-4 ml-2 transition-transform ${
                            isValidSelection ? "group-hover:translate-x-1" : ""
                          }`}
                        />
                      </button>
                      <p className="text-center text-xs text-resort-cocoa/50 mt-4">
                        Best rate guaranteed when booking direct.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-resort-cocoa/10 space-y-2">
                      {bookingReminderList.slice(0, 3).map((item) => (
                        <p key={item} className="text-xs text-resort-cocoa/60">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
