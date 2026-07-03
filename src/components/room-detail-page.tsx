"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { AccommodationCard } from "@/components/ui/accommodation-card";
import { resort, type ResortRoom } from "@/data/resort";
import { useReservation } from "@/context/reservation-context";
import { useResortData } from "@/hooks/useResortData";
import { formatPHPCurrency } from "@/lib/currency";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  HeadphonesIcon,
  Home as HomeIcon,
  Maximize,
  Minus,
  Plus,
  Sun,
  Users,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

type RoomDetailPageProps = {
  room: ResortRoom;
  allRooms?: ResortRoom[];
};

export function RoomDetailPage({ room, allRooms = resort.rooms }: RoomDetailPageProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { state, updateState, formatDate, isHydrated } = useReservation();
  const { bookingSettings } = useResortData();

  const gallery = room.gallery?.length ? room.gallery : [room.image];
  const similarRooms = allRooms.filter((item) => item.id !== room.id).slice(0, 3);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const checkIn = state.checkIn ? new Date(state.checkIn) : new Date();
    return new Date(checkIn.getFullYear(), checkIn.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetContainerRef.current && !widgetContainerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const handlePrevMonth = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date < today;
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
    date.setHours(0, 0, 0, 0);
    const start = new Date(state.checkIn);
    const end = new Date(state.checkOut);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return date > start && date < end;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    const clickedStr = clickedDate.toISOString();

    if (!state.checkIn || state.checkOut) {
      updateState({ checkIn: clickedStr, checkOut: "" });
      return;
    }

    const checkInDate = new Date(state.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (clickedDate <= checkInDate) {
      updateState({ checkIn: clickedStr, checkOut: "" });
      return;
    }

    updateState({ checkOut: clickedStr });
    setIsCalendarOpen(false);
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

  const handleReserve = () => {
    updateState({ selectedVilla: room });
    if (state.checkIn && state.checkOut) {
      router.push("/reserve/guest");
      return;
    }
    router.push("/reserve");
  };

  const amenityItems = [
    { icon: Users, text: room.capacityLabel },
    {
      icon: Users,
      text: room.extraGuestAllowance
        ? `Allows ${room.extraGuestAllowance} extra guest${room.extraGuestAllowance > 1 ? "s" : ""}`
        : "No extra guest listed",
    },
    { icon: BedDouble, text: room.beds },
    { icon: Coffee, text: `Breakfast for ${room.breakfastIncluded}` },
    { icon: Waves, text: "Jacuzzi included" },
    { icon: Sun, text: "Dipping tub included" },
    { icon: Wind, text: "Air conditioning" },
    { icon: Wifi, text: "Free Wi-Fi" },
    { icon: HeadphonesIcon, text: "Front-desk assistance" },
  ];

  const specificationItems = [
    { icon: HomeIcon, label: "Category", value: room.category },
    { icon: Users, label: "Standard capacity", value: room.capacityLabel },
    {
      icon: Users,
      label: "Extra guest",
      value: room.extraGuestAllowance
        ? `${room.extraGuestAllowance} extra guest${room.extraGuestAllowance > 1 ? "s" : ""}`
        : "None listed",
    },
    { icon: BedDouble, label: "Beds", value: room.beds },
    { icon: Maximize, label: "Size", value: room.size ?? "Room details coming soon" },
    { icon: Sun, label: "View", value: room.view ?? "Resort view" },
    { icon: Clock, label: "Check-in", value: bookingSettings.checkIn },
    { icon: Clock, label: "Check-out", value: bookingSettings.checkOut },
  ];

  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite">
        <section className="relative h-[85vh] min-h-[600px] flex flex-col justify-end px-4 pb-24 overflow-hidden bg-resort-cocoa">
          <Image
            src={gallery[Math.min(activePhoto, gallery.length - 1)]}
            alt={`${room.name} interior`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa via-resort-cocoa/50 to-resort-cocoa/20" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-resort-white/80 text-xs font-bold tracking-widest uppercase mb-6">
              <Link href="/" className="hover:text-resort-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/rooms" className="hover:text-resort-white transition-colors">
                Rooms & Villas
              </Link>
              <span>/</span>
              <span className="text-resort-white">{room.name}</span>
            </div>

            <span className="inline-block bg-[#c4a47c] text-resort-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded mb-4 shadow-sm">
              {room.category}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-resort-white mb-6 leading-tight max-w-4xl">
              {room.name}
            </h1>
            <p className="text-lg md:text-xl text-resort-offwhite font-light max-w-2xl leading-relaxed mb-6">
              {room.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-resort-offwhite/90 text-sm font-medium mt-6 drop-shadow-md">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#c4a47c]" /> {room.capacityLabel}
              </span>
              <span className="text-[#c4a47c]">&bull;</span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-[#c4a47c]" /> {room.beds}
              </span>
              <span className="text-[#c4a47c]">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-[#c4a47c]" /> Breakfast for {room.breakfastIncluded}
              </span>
            </div>
          </Reveal>
        </section>

        <section className="py-20 lg:py-24">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-7 xl:col-span-8">
                <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  YOUR STAY
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-8 leading-tight">
                  Stay close to the coast.
                </h2>
                <p className="text-xl text-resort-cocoa/90 font-light mb-8 leading-relaxed">
                  {room.name} is designed for guests who want restful accommodations with real resort comforts and direct access to the atmosphere of Piero Beach Resort.
                </p>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-6">
                  This stay includes a discounted rate of {formatPHPCurrency(room.discountedRate)} per night, with the regular rate shown for comparison at {formatPHPCurrency(room.regularRate)}. Breakfast for {room.breakfastIncluded}, a jacuzzi, and a dipping tub are already part of the room package.
                </p>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-12">
                  {room.extraGuestAllowance
                    ? `The room is ${room.capacityLabel.toLowerCase()} and allows ${room.extraGuestAllowance} extra guest${room.extraGuestAllowance > 1 ? "s" : ""}.`
                    : `The room is ${room.capacityLabel.toLowerCase()} with no extra guest allowance currently listed.`} Check-in starts at {bookingSettings.checkIn} and check-out is at {bookingSettings.checkOut}.
                </p>

                <div className="border-t border-resort-cocoa/10 pt-10">
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Amenities & Inclusions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {amenityItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.text}
                          className="flex items-center space-x-4 bg-resort-white p-4 rounded-xl border border-resort-cocoa/5 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-lg bg-resort-sand/50 text-[#c4a47c] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-resort-cocoa font-semibold text-sm tracking-wide">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-12 border-t border-resort-cocoa/10 pt-10">
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Room Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specificationItems.map((spec) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between bg-resort-white p-4 rounded-xl border border-resort-cocoa/5 shadow-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded bg-resort-sand/50 text-[#c4a47c] flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-resort-olive text-xs font-bold uppercase tracking-wider">
                              {spec.label}
                            </span>
                          </div>
                          <span className="text-resort-cocoa font-medium text-sm">{spec.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-16 border-t border-resort-cocoa/10 pt-10">
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Room Gallery</h3>

                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md bg-resort-sand group">
                    <Image
                      src={gallery[activePhoto]}
                      alt={`${room.name} view ${activePhoto + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover transition-all duration-500 ease-in-out"
                    />

                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setActivePhoto((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-resort-white/80 hover:bg-resort-white text-resort-cocoa flex items-center justify-center shadow transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300"
                        >
                          â†
                        </button>
                        <button
                          onClick={() => setActivePhoto((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-resort-white/80 hover:bg-resort-white text-resort-cocoa flex items-center justify-center shadow transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300"
                        >
                          â†’
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 right-4 bg-resort-cocoa/75 backdrop-blur-sm text-resort-white px-3 py-1 rounded-full text-xs font-medium tracking-wider">
                      {activePhoto + 1} / {gallery.length}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                    {gallery.map((photo, index) => (
                      <button
                        key={`${photo}-${index}`}
                        onClick={() => setActivePhoto(index)}
                        className={`relative w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 transition-all focus:outline-none ${
                          activePhoto === index ? "ring-2 ring-[#c4a47c] scale-95" : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`${room.name} thumbnail ${index + 1}`}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:-mt-32 relative z-20">
                <div className="bg-resort-white rounded-2xl shadow-xl p-5 sm:p-8 sticky top-24">
                  <div className="pb-6 border-b border-resort-cocoa/10 mb-6">
                    <span className="text-sm font-bold uppercase tracking-wider text-resort-olive block mb-2">
                      Starting at
                    </span>
                    <div className="text-resort-cocoa font-bold text-3xl font-serif">
                      {formatPHPCurrency(room.discountedRate)}{" "}
                      <span className="line-through text-resort-cocoa/40 text-lg font-normal ml-1">
                        {formatPHPCurrency(room.regularRate)}
                      </span>{" "}
                      <span className="text-sm font-normal text-[#c4a47c] uppercase tracking-widest font-sans">
                        / night
                      </span>
                    </div>
                  </div>

                  <div ref={widgetContainerRef} className="space-y-4 mb-8 relative">
                    <div className="relative">
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
                        className={`bg-resort-offwhite rounded border border-resort-cocoa/10 p-4 cursor-pointer hover:border-resort-terracotta transition-colors flex justify-between items-center ${
                          isCalendarOpen ? "border-resort-terracotta" : ""
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-wider text-resort-olive mb-1">
                            Check-in / Check-out
                          </span>
                          <span className="text-resort-cocoa font-medium text-sm">
                            {!isHydrated
                              ? "Select Dates"
                              : state.checkIn
                                ? `${formatDate(state.checkIn)} â€” ${state.checkOut ? formatDate(state.checkOut) : "Select Departure"}`
                                : "Select Dates"}
                          </span>
                        </div>
                        <Calendar className="w-5 h-5 text-resort-terracotta shrink-0" />
                      </div>

                      {isCalendarOpen && isHydrated && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute right-0 top-[102%] mt-1 bg-resort-white border border-resort-cocoa/10 rounded-xl shadow-2xl p-4 w-full sm:w-[320px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
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
                              const selectedCheckIn = isCheckIn(day);
                              const selectedCheckOut = isCheckOut(day);
                              const inBetween = isInBetween(day);
                              const isSunday = (firstDay + day - 1) % 7 === 0;
                              const isSaturday = (firstDay + day - 1) % 7 === 6;

                              let cellClass =
                                "w-7 h-7 text-xs rounded-full flex items-center justify-center mx-auto transition-colors ";

                              if (past) {
                                cellClass += "text-resort-cocoa/20 cursor-not-allowed";
                              } else if (selectedCheckIn || selectedCheckOut) {
                                cellClass += "bg-resort-olive text-resort-white font-bold cursor-pointer";
                              } else if (inBetween) {
                                cellClass += "bg-resort-seafoam/30 hover:bg-resort-seafoam/50 cursor-pointer";
                              } else {
                                cellClass += "hover:bg-resort-sand text-resort-cocoa cursor-pointer";
                              }

                              return (
                                <div key={day} className="relative" onClick={() => !past && handleDateClick(day)}>
                                  {(inBetween || selectedCheckIn) && !selectedCheckOut && state.checkOut && (
                                    <div
                                      className={`absolute top-1/2 left-1/2 ${
                                        isSaturday ? "right-0" : "right-[-50%]"
                                      } h-7 -translate-y-1/2 bg-resort-seafoam/30 z-0`}
                                    ></div>
                                  )}
                                  {(inBetween || selectedCheckOut) && !selectedCheckIn && state.checkIn && (
                                    <div
                                      className={`absolute top-1/2 right-1/2 ${
                                        isSunday ? "left-0" : "left-[-50%]"
                                      } h-7 -translate-y-1/2 bg-resort-seafoam/30 z-0`}
                                    ></div>
                                  )}

                                  <div className={`relative z-10 ${cellClass}`}>{day}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        onClick={() => {
                          setIsGuestsOpen(!isGuestsOpen);
                          setIsCalendarOpen(false);
                        }}
                        className={`bg-resort-offwhite rounded border border-resort-cocoa/10 p-4 cursor-pointer hover:border-resort-terracotta transition-colors flex justify-between items-center ${
                          isGuestsOpen ? "border-resort-terracotta" : ""
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-wider text-resort-olive mb-1">
                            Guests
                          </span>
                          <span className="text-resort-cocoa font-medium text-sm">
                            {!isHydrated ? room.capacityLabel : `${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`}
                          </span>
                        </div>
                        <Users className="w-5 h-5 text-resort-terracotta shrink-0" />
                      </div>

                      {isGuestsOpen && isHydrated && (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute right-0 top-[102%] mt-1 bg-resort-white border border-resort-cocoa/10 rounded-xl shadow-2xl p-5 w-full sm:w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default"
                        >
                          <div className="flex flex-col space-y-4">
                            <span className="text-xs font-bold text-resort-olive uppercase tracking-wider">
                              Number of Guests
                            </span>

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
                    onClick={handleReserve}
                    className="block text-center w-full py-5 bg-resort-cocoa text-resort-white hover:bg-resort-terracotta transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg active:scale-95 shrink-0 relative z-20"
                  >
                    Reserve This Room
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-white border-t border-resort-cocoa/10">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif text-3xl md:text-4xl text-resort-cocoa mb-12">You may also like.</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarRooms.map((item) => (
                <AccommodationCard
                  key={item.id}
                  title={item.name}
                  description={item.shortDescription}
                  capacity={item.capacityLabel}
                  imageUrl={item.image}
                  category={item.category}
                  discountedPrice={item.discountedRate}
                  regularPrice={item.regularRate}
                  href={item.detailsHref}
                />
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-terracotta text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Your beach escape awaits.</h2>
            <p className="text-resort-white/90 max-w-xl mx-auto mb-10 text-xl font-light">
              Secure your stay in {room.name} and begin looking forward to slower days at the coast.
            </p>
            <Link
              href="/reserve"
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-terracotta hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Reserve This Room
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}

export function RoomDetailPageById({ roomId }: { roomId: string }) {
  const { rooms } = useResortData();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;
  return <RoomDetailPage room={room} allRooms={rooms} />;
}
