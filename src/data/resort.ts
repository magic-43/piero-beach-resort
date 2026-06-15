export type ResortRoom = {
  id: string;
  slug: string;
  name: string;
  category: "Suite" | "Villa" | "Room";
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  beds: string;
  maxGuests: number;
  capacityLabel: string;
  breakfastIncluded: number;
  extraGuestAllowance: number;
  discountedRate: number;
  regularRate: number;
  amenities: string[];
  size?: string;
  view?: string;
  detailsHref: string;
};

const resortRooms: ResortRoom[] = [
  {
    id: "cabin-suite",
    slug: "cabin-suite",
    name: "Cabin Suite",
    category: "Suite",
    description:
      "A cozy suite for small groups or families, with breakfast for 3 plus a jacuzzi and dipping tub for a slower coastal stay.",
    shortDescription:
      "Good for 3 guests with breakfast for 3, 1 extra guest allowed, and a jacuzzi with dipping tub included.",
    image: "/images/client assets/Cabin Suite/photo_4_2026-06-13_10-42-42.jpg",
    gallery: [
      "/images/client assets/Cabin Suite/photo_4_2026-06-13_10-42-42.jpg",
      "/images/client assets/Cabin Suite/photo_2_2026-06-13_10-42-42.jpg",
      "/images/client assets/Cabin Suite/photo_3_2026-06-13_10-42-42.jpg",
      "/images/client assets/Cabin Suite/photo_5_2026-06-13_10-42-42.jpg",
      "/images/client assets/Cabin Suite/photo_6_2026-06-13_10-42-42.jpg",
    ],
    beds: "1 King Bed & 1 Daybed",
    maxGuests: 4,
    capacityLabel: "Good for 3 guests",
    breakfastIncluded: 3,
    extraGuestAllowance: 1,
    discountedRate: 4500,
    regularRate: 9000,
    amenities: [
      "Breakfast for 3",
      "Jacuzzi included",
      "Dipping tub included",
      "Free Wi-Fi",
      "Housekeeping services",
      "Front-desk assistance",
    ],
    size: "Private suite layout",
    view: "Resort-side tropical setting",
    detailsHref: "/rooms/cabin-suite",
  },
  {
    id: "cabin-villa",
    slug: "cabin-villa",
    name: "Cabin Villa",
    category: "Villa",
    description:
      "A spacious private villa for families or small groups, complete with breakfast for 4 plus a jacuzzi and dipping tub.",
    shortDescription:
      "Good for 4 guests with breakfast for 4, 1 extra guest allowed, and a jacuzzi with dipping tub included.",
    image: "/images/client assets/Cabin Villa/photo_4_2026-06-13_10-43-52.jpg",
    gallery: [
      "/images/client assets/Cabin Villa/photo_4_2026-06-13_10-43-52.jpg",
      "/images/client assets/Cabin Villa/photo_2_2026-06-13_10-43-52.jpg",
      "/images/client assets/Cabin Villa/photo_3_2026-06-13_10-43-52.jpg",
      "/images/client assets/Cabin Villa/photo_5_2026-06-13_10-43-52.jpg",
      "/images/client assets/Cabin Villa/photo_6_2026-06-13_10-43-52.jpg",
      "/images/client assets/Cabin Villa/photo_7_2026-06-13_10-43-52.jpg",
    ],
    beds: "2 Queen Beds",
    maxGuests: 5,
    capacityLabel: "Good for 4 guests",
    breakfastIncluded: 4,
    extraGuestAllowance: 1,
    discountedRate: 6000,
    regularRate: 12000,
    amenities: [
      "Breakfast for 4",
      "Jacuzzi included",
      "Dipping tub included",
      "Free Wi-Fi",
      "Housekeeping services",
      "Front-desk assistance",
    ],
    size: "80 sqm",
    view: "Near-beach villa setting",
    detailsHref: "/rooms/cabin-villa",
  },
  {
    id: "ibiza-room",
    slug: "ibiza-room",
    name: "Ibiza Room",
    category: "Room",
    description:
      "A bright coastal room designed for restful group stays, with breakfast for 4 plus a jacuzzi and dipping tub.",
    shortDescription:
      "Good for 4 guests with breakfast for 4, plus a jacuzzi and dipping tub included.",
    image: "/images/client assets/Ibiza Room/photo_5_2026-06-13_10-43-11.jpg",
    gallery: [
      "/images/client assets/Ibiza Room/photo_5_2026-06-13_10-43-11.jpg",
      "/images/client assets/Ibiza Room/photo_2_2026-06-13_10-43-11.jpg",
      "/images/client assets/Ibiza Room/photo_3_2026-06-13_10-43-11.jpg",
      "/images/client assets/Ibiza Room/photo_4_2026-06-13_10-43-11.jpg",
    ],
    beds: "2 Double Beds",
    maxGuests: 4,
    capacityLabel: "Good for 4 guests",
    breakfastIncluded: 4,
    extraGuestAllowance: 0,
    discountedRate: 6500,
    regularRate: 13000,
    amenities: [
      "Breakfast for 4",
      "Jacuzzi included",
      "Dipping tub included",
      "Free Wi-Fi",
      "Housekeeping services",
      "Front-desk assistance",
    ],
    size: "Spacious room layout",
    view: "Resort-side coastal ambiance",
    detailsHref: "/rooms/ibiza-room",
  },
  {
    id: "family-room",
    slug: "family-room",
    name: "Family Room",
    category: "Room",
    description:
      "A large group room built for reunions and outings, with breakfast for 10 plus a jacuzzi and dipping tub included.",
    shortDescription:
      "Good for 10 guests with breakfast for 10, 2 extra guests allowed, and a jacuzzi with dipping tub included.",
    image: "/images/client assets/FAMILY ROOM/photo_3_2026-06-13_10-37-40.jpg",
    gallery: [
      "/images/client assets/FAMILY ROOM/photo_3_2026-06-13_10-37-40.jpg",
      "/images/client assets/FAMILY ROOM/photo_2_2026-06-13_10-37-40.jpg",
      "/images/client assets/FAMILY ROOM/photo_4_2026-06-13_10-37-40.jpg",
      "/images/client assets/FAMILY ROOM/photo_5_2026-06-13_10-37-40.jpg",
      "/images/client assets/FAMILY ROOM/photo_6_2026-06-13_10-37-40.jpg",
      "/images/client assets/FAMILY ROOM/photo_7_2026-06-13_10-37-40.jpg",
    ],
    beds: "5 Queen Beds",
    maxGuests: 12,
    capacityLabel: "Good for 10 guests",
    breakfastIncluded: 10,
    extraGuestAllowance: 2,
    discountedRate: 13000,
    regularRate: 26000,
    amenities: [
      "Breakfast for 10",
      "Jacuzzi included",
      "Dipping tub included",
      "Free Wi-Fi",
      "Housekeeping services",
      "Front-desk assistance",
    ],
    size: "Large group room layout",
    view: "Resort-side gathering space",
    detailsHref: "/rooms/family-room",
  },
  {
    id: "cancun",
    slug: "cancun",
    name: "Cancun",
    category: "Room",
    description:
      "A lively room for bigger families or barkada stays, with breakfast for 5 plus a jacuzzi and dipping tub included.",
    shortDescription:
      "Good for 5 guests with breakfast for 5, 2 extra guests allowed, and a jacuzzi with dipping tub included.",
    image: "/images/client assets/Cancun Room/photo_6_2026-06-13_10-41-08.jpg",
    gallery: [
      "/images/client assets/Cancun Room/photo_6_2026-06-13_10-41-08.jpg",
      "/images/client assets/Cancun Room/photo_2_2026-06-13_10-41-08.jpg",
      "/images/client assets/Cancun Room/photo_3_2026-06-13_10-41-08.jpg",
      "/images/client assets/Cancun Room/photo_4_2026-06-13_10-41-08.jpg",
      "/images/client assets/Cancun Room/photo_5_2026-06-13_10-41-08.jpg",
    ],
    beds: "2 Queen Beds & 1 Twin Bed",
    maxGuests: 7,
    capacityLabel: "Good for 5 guests",
    breakfastIncluded: 5,
    extraGuestAllowance: 2,
    discountedRate: 7000,
    regularRate: 14000,
    amenities: [
      "Breakfast for 5",
      "Jacuzzi included",
      "Dipping tub included",
      "Free Wi-Fi",
      "Housekeeping services",
      "Front-desk assistance",
    ],
    size: "Family-friendly room layout",
    view: "Resort-side tropical ambiance",
    detailsHref: "/rooms/cancun",
  },
];

export const resort = {
  name: "Piero Beach Resort",
  address: {
    line1: "Sitio Talisay, Brgy. Lomboy",
    line2: "Cabangan, Zambales, Philippines 2203",
    short: "Cabangan, Zambales",
    full: "Sitio Talisay, Brgy. Lomboy, Cabangan, Zambales, Philippines 2203",
  },
  contact: {
    email: "pierobeachresortph@gmail.com",
    emailHref: "mailto:pierobeachresortph@gmail.com",
    phone: "+63 995 385 5517",
    phoneHref: "tel:+639953855517",
    whatsapp: "+63 955 318 2012",
    whatsappHref: "https://wa.me/639553182012",
    mapsHref: "https://maps.google.com/?q=Piero+Beach+Resort",
    facebookHref: "https://www.facebook.com/share/1UggHAxNzb/?mibextid=wwXIfr",
  },
  stay: {
    checkIn: "2:00 PM",
    checkOut: "12:30 NN",
    cashless: true,
  },
  rooms: resortRooms,
  reminders: {
    extraPersonCharge: "Extra person charge: 1,300 per night",
    childPolicy: "Children aged 7 and below stay free",
    adultAgePolicy: "Guests aged 8 and above are considered adults",
    peakSurcharge:
      "Peak surcharge: +1,000 per room per night during Christmas, New Year, Holy Week, and long weekends",
    securityDeposit: "Refundable security deposit: 2,000 upon check-in",
  },
  amenities: [
    "Beachfront access",
    "Ocean-view lounging areas",
    "Restaurant and dining area",
    "Spacious rooms and villas",
    "Jacuzzi and dipping tubs in all rooms",
    "Swimming pool",
    "Event and gathering spaces",
    "Parking area",
    "Resort security",
    "Housekeeping services",
    "Front-desk assistance",
    "Free Wi-Fi",
  ],
  activities: [
    "Swimming",
    "Beach volleyball",
    "Basketball",
    "Billiards",
    "Videoke / karaoke",
    "Bonfire on request",
    "Grilling / BBQ",
    "Island sightseeing and beach walks",
    "Team-building activities",
    "Jetski rides when available",
    "Kayaking when available",
    "Fishing when available",
    "Sunset viewing",
    "Photography and content-creation spots",
    "Family gatherings and outings",
  ],
  restaurant: {
    name: "Piero Beach Resort Restaurant",
    hours: "6:00 AM - 10:00 PM daily",
    serviceChargeNote: "Food orders are subject to a 10% service charge",
    overview:
      "One dining experience at the resort, serving breakfast, all-day meals, refreshments, and group-friendly options by the beach.",
    menuCategories: [
      "Breakfast silog meals",
      "Breakfast sets",
      "Breakfast platters",
      "Pork",
      "Beef",
      "Chicken",
      "Fish",
      "Vegetables",
      "Appetizers",
      "Pizza",
      "Pasta and noodles",
      "Sandwiches",
      "Rice toppings",
      "Non-alcoholic drinks",
      "Alcoholic drinks",
      "Fruit shakes",
      "Dessert",
    ],
    grillingPolicy: [
      "Cooking and grilling are allowed.",
      "Guests should bring their own grilling equipment, utensils, and dinnerware.",
      "Corkage rules may apply during events.",
    ],
  },
  petPolicy: [
    "Piero Beach Resort is pet-friendly.",
    "Guests may bring up to two pets per villa.",
    "Additional pets cost 250 per pet, per night.",
    "Guests should bring cages.",
    "Guests are responsible for damage or soiling caused by pets.",
    "The resort does not provide pet medication.",
  ],
  bookingPolicy: [
    "Bookings are confirmed after payment verification.",
    "Piero Beach Resort is a cashless property.",
    "One free rebooking request is allowed when requested at least 14 days before arrival.",
    "A second rebooking request may be treated as a cancellation.",
    "No-show reservations may be forfeited.",
    "The resort may postpone or cancel bookings due to weather, maintenance, or other unforeseen circumstances.",
    "Beach swimming and shoreline activities are allowed until 6:00 PM.",
  ],
  payment: {
    methods: ["Bank Transfer", "GCash"],
    note: "Payment details will be shown after reservation confirmation.",
    bankTransfer: {
      bankName: "To be updated by admin",
      accountName: "To be updated by admin",
      accountNumber: "To be updated by admin",
    },
    gcash: {
      name: "To be updated by admin",
      number: "To be updated by admin",
    },
  },
  directions: {
    byCar:
      "Take NLEX, continue through SCTEX, exit at Subic, and search Piero Beach Resort on Waze.",
    byCarTravelTime: "Estimated travel time: 3.54 hours.",
    byPublicTransport:
      "Take a Victory Liner bus from Cubao or Pasay to Cabangan Terminal, then take a tricycle to the resort.",
    byPublicTransportTravelTime: "Estimated travel time: 56 hours.",
    transfer: "Available upon request and subject to availability.",
  },
  faq: [
    {
      question: "What time is check-in and check-out?",
      answer: "Check-in is at 2:00 PM and check-out is at 12:30 NN.",
    },
    {
      question: "How do I reserve a room?",
      answer:
        "You can reserve through the website reservation flow, call the resort, or send a WhatsApp message for assistance.",
    },
    {
      question: "Are there extra person charges?",
      answer: "Extra person charge: 1,300 per night.",
    },
    {
      question: "What is the child policy?",
      answer:
        "Children aged 7 and below stay free. Guests aged 8 and above are considered adults.",
    },
    {
      question: "Do peak dates have a surcharge?",
      answer:
        "Yes. Peak surcharge: +1,000 per room per night during Christmas, New Year, Holy Week, and long weekends.",
    },
    {
      question: "Is there a security deposit?",
      answer: "Yes. Refundable security deposit: 2,000 upon check-in.",
    },
    {
      question: "Is the resort pet-friendly?",
      answer:
        "Yes. Piero Beach Resort is pet-friendly, with up to two pets per villa and additional pets charged at 250 per pet, per night.",
    },
    {
      question: "Can guests cook or grill at the resort?",
      answer:
        "Yes. Cooking and grilling are allowed, but guests should bring their own grilling equipment, utensils, and dinnerware.",
    },
  ],
  termsSections: [
    {
      title: "1. Booking & Reservation Policies",
      content:
        "Bookings are confirmed after payment verification. Piero Beach Resort is a cashless property. Rates are in Philippine Pesos and may be updated by the resort without prior notice.",
    },
    {
      title: "2. Rebooking, Cancellation & No-Show",
      content:
        "One free rebooking request is allowed when requested at least 14 days before arrival. A second rebooking request may be treated as a cancellation. No-show reservations may be forfeited.",
    },
    {
      title: "3. Check-In, Check-Out & Deposit",
      content:
        "Check-in is at 2:00 PM and check-out is at 12:30 NN. A refundable security deposit of 2,000 is collected upon check-in. Guests may be asked to present a valid ID during arrival.",
    },
    {
      title: "4. Extra Guests, Children & Peak Dates",
      content:
        "Extra person charge: 1,300 per night. Children aged 7 and below stay free. Guests aged 8 and above are considered adults. Peak surcharge: +1,000 per room per night during Christmas, New Year, Holy Week, and long weekends.",
    },
    {
      title: "5. Pet Policy",
      content:
        "Piero Beach Resort is pet-friendly. Guests may bring up to two pets per villa. Additional pets cost 250 per pet, per night. Guests should bring cages and are responsible for any damage or soiling caused by pets.",
    },
    {
      title: "6. Activities, Resort Operations & Unforeseen Changes",
      content:
        "Beach swimming and shoreline activities are allowed until 6:00 PM. The resort may postpone or cancel bookings due to weather, maintenance, or other unforeseen circumstances.",
    },
  ],
};

export const bookingReminderList = Object.values(resort.reminders);

export const featuredRooms = resort.rooms.slice(0, 3);

export const alternateRooms = resort.rooms.filter((room) => room.id !== "cabin-villa").slice(0, 3);

export const siteImages = {
  homeHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_29_2026-06-13_10-46-58.jpg",
  homeIntro: "/images/client assets/Aesthetics, food, beach, environs etc/photo_17_2026-06-13_10-46-58.jpg",
  homeActivities: "/images/client assets/Aesthetics, food, beach, environs etc/photo_31_2026-06-13_10-46-58.jpg",
  homeDining: "/images/client assets/Aesthetics, food, beach, environs etc/photo_42_2026-06-13_10-46-58.jpg",
  homeFeatureWide: "/images/client assets/Aesthetics, food, beach, environs etc/photo_33_2026-06-13_10-46-58.jpg",
  homeCtaOverlay: "/images/client assets/Aesthetics, food, beach, environs etc/photo_21_2026-06-13_10-46-58.jpg",
  aboutHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_1_2026-06-13_10-46-58.jpg",
  aboutStoryPrimary: "/images/client assets/Aesthetics, food, beach, environs etc/photo_17_2026-06-13_10-46-58.jpg",
  aboutStorySecondary: "/images/client assets/Aesthetics, food, beach, environs etc/photo_9_2026-06-13_10-46-58.jpg",
  aboutGallery: [
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_13_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_15_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_48_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_23_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_12_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_41_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_28_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_47_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_10_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_27_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_20_2026-06-13_10-46-58.jpg",
  ],
  activitiesHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_22_2026-06-13_10-46-58.jpg",
  activitiesFeature: "/images/client assets/Aesthetics, food, beach, environs etc/photo_18_2026-06-13_10-46-58.jpg",
  activitiesEvening: "/images/client assets/Aesthetics, food, beach, environs etc/photo_36_2026-06-13_10-46-58.jpg",
  restaurantsHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_20_2026-06-13_10-46-58.jpg",
  restaurantsPrimary: "/images/client assets/Aesthetics, food, beach, environs etc/photo_53_2026-06-13_10-46-58.jpg",
  restaurantsSecondary: "/images/client assets/Aesthetics, food, beach, environs etc/photo_56_2026-06-13_10-46-58.jpg",
  restaurantsTertiary: "/images/client assets/Aesthetics, food, beach, environs etc/photo_48_2026-06-13_10-46-58.jpg",
  contactHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_13_2026-06-13_10-46-58.jpg",
  roomsHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_24_2026-06-13_10-46-58.jpg",
  roomsCta: "/images/client assets/Aesthetics, food, beach, environs etc/photo_28_2026-06-13_10-46-58.jpg",
  eventsHero: "/images/client assets/Aesthetics, food, beach, environs etc/photo_39_2026-06-13_10-46-58.jpg",
  eventsCards: [
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_40_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_10_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_30_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_20_2026-06-13_10-46-58.jpg",
    "/images/client assets/Aesthetics, food, beach, environs etc/photo_50_2026-06-13_10-46-58.jpg",
  ],
  eventsFeature: "/images/client assets/Aesthetics, food, beach, environs etc/photo_45_2026-06-13_10-46-58.jpg",
  reserveBg: "/images/client assets/Aesthetics, food, beach, environs etc/photo_25_2026-06-13_10-46-58.jpg",
} as const;

export function getRoomById(id: string) {
  return resort.rooms.find((room) => room.id === id) ?? null;
}
