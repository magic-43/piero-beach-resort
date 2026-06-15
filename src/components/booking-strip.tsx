"use client";

import { useReservation } from "@/context/reservation-context";
import { Calendar, Users, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";



export function BookingStrip() {
  const { state, updateState, formatDate, isHydrated } = useReservation();
  const router = useRouter();

  // Refs for closing popups on click-outside
  const containerRef = useRef<HTMLDivElement>(null);

  // Popup states
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // Month navigation for the calendar popup
  const [currentMonth, setCurrentMonth] = useState(() => {
    const checkIn = state.checkIn ? new Date(state.checkIn) : new Date();
    return new Date(checkIn.getFullYear(), checkIn.getMonth(), 1);
  });

  const hasDates = Boolean(state.checkIn && state.checkOut);

  // Close calendar/guests popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const handleCheckAvailability = () => {
    if (hasDates) {
      router.push("/reserve/villa");
      return;
    }
    router.push("/reserve");
  };

  // Calendar logic helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isPast = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isCheckIn = (day: number) => {
    if (!state.checkIn) return false;
    const d = new Date(state.checkIn);
    return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  };

  const isCheckOut = (day: number) => {
    if (!state.checkOut) return false;
    const d = new Date(state.checkOut);
    return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  };

  const isInBetween = (day: number) => {
    if (!state.checkIn || !state.checkOut) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    const start = new Date(state.checkIn);
    start.setHours(0, 0, 0, 0);
    const end = new Date(state.checkOut);
    end.setHours(0, 0, 0, 0);
    return d > start && d < end;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);
    
    if (clickedDate < today) return;

    const clickedStr = clickedDate.toISOString();

    if (!state.checkIn || (state.checkIn && state.checkOut)) {
      updateState({ checkIn: clickedStr, checkOut: "" });
    } else {
      const checkInDate = new Date(state.checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      if (clickedDate <= checkInDate) {
        updateState({ checkIn: clickedStr, checkOut: "" });
      } else {
        updateState({ checkOut: clickedStr });
        setIsCalendarOpen(false); // Auto close after full selection
      }
    }
  };

  const handleAdultGuestChange = (change: number) => {
    const newGuests = Math.max(1, Math.min(20, state.adultGuests + change));
    updateState({ adultGuests: newGuests });
  };

  const handleChildGuestChange = (change: number) => {
    const newGuests = Math.max(0, Math.min(10, state.childGuests + change));
    updateState({ childGuests: newGuests });
  };

  const totalGuests = state.adultGuests + state.childGuests;

  if (!isHydrated) {
    return (
      <div className="bg-resort-white rounded-xl shadow-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between border border-resort-cocoa/5 animate-pulse gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-resort-cocoa/10 flex-1">
          <div className="px-4 py-3 sm:px-8 sm:py-2 flex items-center space-x-4 flex-1">
            <div className="w-5 h-5 bg-resort-sand rounded-full" />
            <div className="h-8 bg-resort-sand rounded w-44" />
          </div>
          <div className="px-4 py-3 sm:px-8 sm:py-2 flex items-center space-x-4 flex-1">
            <div className="w-5 h-5 bg-resort-sand rounded-full" />
            <div className="h-8 bg-resort-sand rounded w-20" />
          </div>
        </div>
        <div className="w-full lg:w-44 h-14 bg-resort-sand rounded-lg lg:ml-4" />
      </div>
    );
  }

  const checkInMonthString = state.checkIn ? formatDate(state.checkIn) : "Select Arrival";
  const checkOutMonthString = state.checkOut ? formatDate(state.checkOut) : "Select Departure";

  return (
    <div ref={containerRef} className="bg-resort-white rounded-xl shadow-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between border border-resort-cocoa/5 gap-4 relative lg:max-w-[70%] lg:mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-resort-cocoa/10 flex-1 relative z-30">
        
        {/* Unified Dates Action Block */}
        <div
          onClick={() => {
            const nextState = !isCalendarOpen;
            setIsCalendarOpen(nextState);
            setIsGuestsOpen(false);
            if (nextState && state.checkIn) {
              const checkIn = new Date(state.checkIn);
              setCurrentMonth(new Date(checkIn.getFullYear(), checkIn.getMonth(), 1));
            }
          }}
          className={`px-4 py-3 sm:px-8 sm:py-2 flex items-center space-x-4 flex-1 cursor-pointer hover:bg-resort-offwhite transition-colors rounded-t-lg sm:rounded-t-none sm:rounded-l-lg relative group ${
            isCalendarOpen ? "bg-resort-offwhite" : ""
          }`}
        >
          <Calendar className="w-5 h-5 text-resort-terracotta transition-transform group-hover:scale-110 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-bold uppercase tracking-wider text-resort-olive mb-0.5">
              Dates of Stay
            </span>
            <span className="text-resort-cocoa font-medium text-sm sm:text-base block truncate">
              {state.checkIn ? (
                <>
                  {checkInMonthString} — {state.checkOut ? checkOutMonthString : "Select Departure"}
                </>
              ) : (
                "Choose dates"
              )}
            </span>
          </div>
          
          {/* Custom Calendar Popover */}
          {isCalendarOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 right-0 lg:left-0 lg:right-auto top-[102%] mt-2 bg-resort-white border border-resort-cocoa/10 rounded-xl shadow-2xl p-4 w-full sm:w-[320px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
                  className="p-1.5 hover:bg-resort-sand rounded-full transition-colors disabled:opacity-20"
                >
                  <ChevronLeft className="w-4 h-4 text-resort-cocoa" />
                </button>
                <div className="text-center">
                  <span className="block text-[10px] text-resort-terracotta font-semibold uppercase tracking-wider">
                    {state.checkIn && !state.checkOut ? "Select Check-out" : "Select Check-in"}
                  </span>
                  <h4 className="font-serif text-sm text-resort-cocoa font-bold">
                    {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-resort-sand rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-resort-cocoa" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                  <div key={day} className="text-[10px] font-bold tracking-widest text-resort-cocoa/40 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-resort-cocoa">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const past = isPast(day);
                  const selCheckIn = isCheckIn(day);
                  const selCheckOut = isCheckOut(day);
                  const inBetween = isInBetween(day);
                  const isSunday = (firstDay + day - 1) % 7 === 0;
                  const isSaturday = (firstDay + day - 1) % 7 === 6;

                  let cellClass = "w-7 h-7 text-xs rounded-full flex items-center justify-center mx-auto transition-colors ";

                  if (past) {
                    cellClass += "text-resort-cocoa/20 cursor-not-allowed";
                  } else {
                    cellClass += "cursor-pointer ";
                    if (selCheckIn || selCheckOut) {
                      cellClass += "bg-resort-olive text-resort-white font-bold";
                    } else if (inBetween) {
                      cellClass += "bg-resort-seafoam/30 hover:bg-resort-seafoam/50";
                    } else {
                      cellClass += "hover:bg-resort-sand text-resort-cocoa";
                    }
                  }

                  return (
                    <div 
                      key={day} 
                      className="relative" 
                      onClick={() => !past && handleDateClick(day)}
                    >
                      {/* Range connector highlights clamped to Sundays and Saturdays */}
                      {(inBetween || selCheckIn) && !selCheckOut && state.checkOut && (
                        <div className={`absolute top-1/2 left-1/2 ${isSaturday ? "right-0" : "right-[-50%]"} h-7 -translate-y-1/2 bg-resort-seafoam/30 z-0`}></div>
                      )}
                      {(inBetween || selCheckOut) && !selCheckIn && state.checkIn && (
                        <div className={`absolute top-1/2 right-1/2 ${isSunday ? "left-0" : "left-[-50%]"} h-7 -translate-y-1/2 bg-resort-seafoam/30 z-0`}></div>
                      )}

                      <div className={`relative z-10 ${cellClass}`}>
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Guest Action Block */}
        <div
          onClick={() => {
            setIsGuestsOpen(!isGuestsOpen);
            setIsCalendarOpen(false);
          }}
          className={`px-4 py-3 sm:px-8 sm:py-2 flex items-center space-x-4 flex-1 cursor-pointer hover:bg-resort-offwhite transition-colors rounded-b-lg sm:rounded-b-none sm:rounded-r-lg relative group ${
            isGuestsOpen ? "bg-resort-offwhite" : ""
          }`}
        >
          <Users className="w-5 h-5 text-resort-terracotta transition-transform group-hover:scale-110 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-bold uppercase tracking-wider text-resort-olive mb-0.5">
              Guests
            </span>
            <span className="text-resort-cocoa font-medium text-sm sm:text-base block truncate">
              {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Plus/Minus Counter Popover */}
          {isGuestsOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 right-0 lg:left-auto lg:right-0 top-[102%] mt-2 bg-resort-white border border-resort-cocoa/10 rounded-xl shadow-2xl p-5 w-full sm:w-[280px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
            >
              <div className="flex flex-col space-y-4">
                <span className="text-xs font-bold text-resort-olive uppercase tracking-wider">Number of Guests</span>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-resort-cocoa font-medium">Adults</span>
                    <span className="text-[10px] text-resort-cocoa/50">Aged 8+</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-resort-offwhite p-1 rounded-full border border-resort-cocoa/10">
                    <button
                      type="button"
                      disabled={state.adultGuests <= 1}
                      onClick={() => handleAdultGuestChange(-1)}
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
                      onClick={() => handleAdultGuestChange(1)}
                      className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-resort-cocoa font-medium">Children</span>
                    <span className="text-[10px] text-resort-cocoa/50">Aged 0-7</span>
                  </div>
                  <div className="flex items-center space-x-4 bg-resort-offwhite p-1 rounded-full border border-resort-cocoa/10">
                    <button
                      type="button"
                      disabled={state.childGuests <= 0}
                      onClick={() => handleChildGuestChange(-1)}
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
                      onClick={() => handleChildGuestChange(1)}
                      className="w-8 h-8 flex items-center justify-center bg-resort-white hover:bg-resort-sand disabled:opacity-20 text-resort-cocoa rounded-full transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckAvailability}
        className="w-full lg:w-auto px-8 py-4 bg-resort-cocoa text-resort-white hover:bg-resort-terracotta transition-all duration-300 font-semibold tracking-widest uppercase text-sm rounded-lg lg:ml-4 active:scale-95 shadow-md text-center shrink-0 relative z-20"
      >
        Check Availability
      </button>
    </div>
  );
}
