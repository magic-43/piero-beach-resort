"use client";

import { getRoomById, type ResortRoom } from "@/data/resort";
import { useResortData } from "@/hooks/useResortData";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type GuestDetails = {
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
};

export type SelectedVilla = ResortRoom;

export type ReservationState = {
  clientRequestId: string;
  checkIn: string;
  checkOut: string;
  adultGuests: number;
  childGuests: number;
  selectedVilla: SelectedVilla | null;
  guestDetails: GuestDetails;
  paymentOption: "full" | "half";
  remoteBookingReference?: string;
  guestAccessToken?: string;
};

type ReservationContextType = {
  state: ReservationState;
  updateState: (updates: Partial<ReservationState>) => void;
  resetContext: () => void;
  nights: number;
  totalPrice: number;
  amountDueToday: number;
  remainingBalance: number;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
  isHydrated: boolean;
};

const getInitialState = (): ReservationState => ({
  clientRequestId: "",
  checkIn: "",
  checkOut: "",
  adultGuests: 2,
  childGuests: 0,
  selectedVilla: null,
  guestDetails: {
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  },
  paymentOption: "full",
});

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReservationState>(getInitialState());
  const [isHydrated, setIsHydrated] = useState(false);
  const { rooms, bookingSettings } = useResortData();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("piero_reservation");
      if (stored) {
        const parsed = JSON.parse(stored) as ReservationState;
        const syncedVilla = parsed.selectedVilla ? getRoomById(parsed.selectedVilla.id) : null;
        
        let requestId = parsed.clientRequestId;
        if (!requestId) requestId = crypto.randomUUID();

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          ...getInitialState(), // Ensure missing keys are populated
          ...parsed,
          clientRequestId: requestId,
          selectedVilla: syncedVilla ?? parsed.selectedVilla,
        });
      } else {
        // First visit, generate a new request ID
        setState(prev => ({ ...prev, clientRequestId: crypto.randomUUID() }));
      }
    } catch (e) {
      console.error("Could not parse stored reservation", e);
      setState(prev => ({ ...prev, clientRequestId: crypto.randomUUID() }));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem("piero_reservation", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  useEffect(() => {
    if (state.selectedVilla && rooms && rooms.length > 0) {
      const updatedVilla = rooms.find(r => r.id === state.selectedVilla?.id);
      if (
        updatedVilla &&
        (
          updatedVilla.name !== state.selectedVilla.name ||
          updatedVilla.image !== state.selectedVilla.image ||
          updatedVilla.capacityLabel !== state.selectedVilla.capacityLabel ||
          updatedVilla.maxGuests !== state.selectedVilla.maxGuests ||
          updatedVilla.breakfastIncluded !== state.selectedVilla.breakfastIncluded ||
          updatedVilla.extraGuestAllowance !== state.selectedVilla.extraGuestAllowance ||
          updatedVilla.discountedRate !== state.selectedVilla.discountedRate ||
          updatedVilla.regularRate !== state.selectedVilla.regularRate
        )
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState((prev) => ({ ...prev, selectedVilla: updatedVilla }));
      }
    }
  }, [rooms, state.selectedVilla]);

  const updateState = (updates: Partial<ReservationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetContext = () => {
    const newState = getInitialState();
    newState.clientRequestId = crypto.randomUUID();
    setState(newState);
  };

  const getNights = () => {
    if (!state.checkIn || !state.checkOut) return 0;
    const start = new Date(state.checkIn);
    const end = new Date(state.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNights();
  
  // Note: These calculations are for frontend display only.
  // The server calculation via src/lib/booking/pricing.ts is the source of truth.
  let basePrice = 0;
  let extraAdultsCost = 0;

  if (state.selectedVilla) {
    basePrice = state.selectedVilla.discountedRate * nights;
    
    const baseCapacity = state.selectedVilla.maxGuests - state.selectedVilla.extraGuestAllowance;
    const extraAdultsCount = Math.max(0, state.adultGuests - baseCapacity);
    extraAdultsCost = extraAdultsCount * bookingSettings.extraPersonFee * nights;
  }
  
  const totalPrice = basePrice + extraAdultsCost;
  const amountDueToday = state.paymentOption === "half" ? Math.round(totalPrice / 2) : totalPrice;
  const remainingBalance = totalPrice - amountDueToday;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const value = {
    state,
    updateState,
    resetContext,
    nights,
    totalPrice,
    amountDueToday,
    remainingBalance,
    formatDate,
    formatCurrency,
    isHydrated,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}
