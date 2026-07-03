import React, { useRef, useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface AdminDateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onChange: (checkIn: string, checkOut: string) => void;
}

export function AdminDateRangePicker({ checkInDate, checkOutDate, onChange }: AdminDateRangePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const checkIn = checkInDate ? new Date(checkInDate) : new Date();
    return new Date(checkIn.getFullYear(), checkIn.getMonth(), 1);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (!checkInDate) return false;
    const d = new Date(checkInDate);
    return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  };

  const isCheckOut = (day: number) => {
    if (!checkOutDate) return false;
    const d = new Date(checkOutDate);
    return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  };

  const isInBetween = (day: number) => {
    if (!checkInDate || !checkOutDate) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    const start = new Date(checkInDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(checkOutDate);
    end.setHours(0, 0, 0, 0);
    return d > start && d < end;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);
    
    if (clickedDate < today) return;

    // Use "yyyy-MM-dd" format for the input fields
    const formattedDate = format(clickedDate, "yyyy-MM-dd");

    if (!checkInDate || (checkInDate && checkOutDate)) {
      onChange(formattedDate, "");
    } else {
      const checkInObj = new Date(checkInDate);
      checkInObj.setHours(0, 0, 0, 0);
      if (clickedDate <= checkInObj) {
        onChange(formattedDate, "");
      } else {
        onChange(checkInDate, formattedDate);
        setIsCalendarOpen(false);
      }
    }
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  const checkInMonthString = checkInDate ? formatDateLabel(checkInDate) : "Select Check-in";
  const checkOutMonthString = checkOutDate ? formatDateLabel(checkOutDate) : "Select Check-out";

  return (
    <div ref={containerRef} className="relative w-full z-30">
      <div
        onClick={() => {
          const nextState = !isCalendarOpen;
          setIsCalendarOpen(nextState);
          if (nextState && checkInDate) {
            const d = new Date(checkInDate);
            setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
          }
        }}
        className={`px-4 py-3 flex items-center space-x-4 w-full cursor-pointer hover:bg-resort-sand/20 transition-colors border border-resort-cocoa/20 rounded ${
          isCalendarOpen ? "bg-resort-sand/20" : "bg-white"
        }`}
      >
        <Calendar className="w-5 h-5 text-resort-terracotta shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="block text-xs font-bold uppercase tracking-wider text-resort-olive mb-0.5">
            Dates of Stay
          </span>
          <span className="text-resort-cocoa font-medium text-sm block truncate">
            {checkInDate ? (
              <>
                {checkInMonthString} — {checkOutDate ? checkOutMonthString : "Select Check-out"}
              </>
            ) : (
              "Choose dates"
            )}
          </span>
        </div>
      </div>

      {isCalendarOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-[102%] mt-1 bg-resort-white border border-resort-cocoa/10 rounded-xl shadow-2xl p-4 w-[300px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
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
                {checkInDate && !checkOutDate ? "Select Check-out" : "Select Check-in"}
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

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
              <div key={day} className="text-[10px] font-bold tracking-widest text-resort-cocoa/40 uppercase">
                {day}
              </div>
            ))}
          </div>

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
                  {(inBetween || selCheckIn) && !selCheckOut && checkOutDate && (
                    <div className={`absolute top-1/2 left-1/2 ${isSaturday ? "right-0" : "right-[-50%]"} h-7 -translate-y-1/2 bg-resort-seafoam/30 z-0`}></div>
                  )}
                  {(inBetween || selCheckOut) && !selCheckIn && checkInDate && (
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
  );
}
