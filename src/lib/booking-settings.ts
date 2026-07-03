import { resort } from "@/data/resort";

export type ResortSettingsLike = Partial<{
  extra_person_fee: number | string | null;
  security_deposit: number | string | null;
  check_in_time: string | null;
  check_out_time: string | null;
}>;

export type BookingSettings = {
  extraPersonFee: number;
  securityDeposit: number;
  checkIn: string;
  checkOut: string;
};

const FALLBACK_BOOKING_SETTINGS: BookingSettings = {
  extraPersonFee: 1300,
  securityDeposit: 2000,
  checkIn: resort.stay.checkIn,
  checkOut: resort.stay.checkOut,
};

function coerceCurrency(value: number | string | null | undefined, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return fallback;
}

function coerceText(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatPHPAmount(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function getBookingSettings(settings?: ResortSettingsLike | null): BookingSettings {
  return {
    extraPersonFee: coerceCurrency(settings?.extra_person_fee, FALLBACK_BOOKING_SETTINGS.extraPersonFee),
    securityDeposit: coerceCurrency(settings?.security_deposit, FALLBACK_BOOKING_SETTINGS.securityDeposit),
    checkIn: coerceText(settings?.check_in_time, FALLBACK_BOOKING_SETTINGS.checkIn),
    checkOut: coerceText(settings?.check_out_time, FALLBACK_BOOKING_SETTINGS.checkOut),
  };
}

export function getBookingReminderList(settings?: ResortSettingsLike | null) {
  const bookingSettings = getBookingSettings(settings);

  return [
    `Extra person charge: ${formatPHPAmount(bookingSettings.extraPersonFee)} per night`,
    resort.reminders.childPolicy,
    resort.reminders.adultAgePolicy,
    resort.reminders.peakSurcharge,
    `Refundable security deposit: ${formatPHPAmount(bookingSettings.securityDeposit)} upon check-in`,
  ];
}

export function getDynamicFaq(settings?: ResortSettingsLike | null) {
  const bookingSettings = getBookingSettings(settings);

  return resort.faq.map((item) => {
    switch (item.question) {
      case "What time is check-in and check-out?":
        return {
          ...item,
          answer: `Check-in is at ${bookingSettings.checkIn} and check-out is at ${bookingSettings.checkOut}.`,
        };
      case "Are there extra person charges?":
        return {
          ...item,
          answer: `Extra person charge: ${formatPHPAmount(bookingSettings.extraPersonFee)} per night.`,
        };
      case "Is there a security deposit?":
        return {
          ...item,
          answer: `Yes. Refundable security deposit: ${formatPHPAmount(bookingSettings.securityDeposit)} upon check-in.`,
        };
      default:
        return item;
    }
  });
}

export function getDynamicTermsSections(settings?: ResortSettingsLike | null) {
  const bookingSettings = getBookingSettings(settings);

  return resort.termsSections.map((section) => {
    switch (section.title) {
      case "3. Check-In, Check-Out & Deposit":
        return {
          ...section,
          content: `Check-in is at ${bookingSettings.checkIn} and check-out is at ${bookingSettings.checkOut}. A refundable security deposit of ${formatPHPAmount(bookingSettings.securityDeposit)} is collected upon check-in. Guests may be asked to present a valid ID during arrival.`,
        };
      case "4. Extra Guests, Children & Peak Dates":
        return {
          ...section,
          content: `Extra person charge: ${formatPHPAmount(bookingSettings.extraPersonFee)} per night. Children aged 7 and below stay free. Guests aged 8 and above are considered adults. Peak surcharge: +1,000 per room per night during Christmas, New Year, Holy Week, and long weekends.`,
        };
      default:
        return section;
    }
  });
}
