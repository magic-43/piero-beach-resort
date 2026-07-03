"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ResortRoom } from "@/data/resort";
import { useReservation } from "@/context/reservation-context";
import { formatPHPCurrency } from "@/lib/currency";

interface RoomListingCardProps {
  room: ResortRoom;
}

function SparkleIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#c4a47c] shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
  );
}

export function RoomListingCard({ room }: RoomListingCardProps) {
  const router = useRouter();
  const { updateState } = useReservation();
  const discountPercentage = Math.round(((room.regularRate - room.discountedRate) / room.regularRate) * 100);

  const handleBookNow = () => {
    updateState({ selectedVilla: room });
    router.push("/reserve");
  };

  return (
    <div className="group bg-resort-white rounded-[5px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row w-full border border-resort-cocoa/5">
      <div className="relative w-full lg:w-[46%] aspect-[4/3] lg:aspect-auto min-h-[320px] lg:min-h-[400px] overflow-hidden bg-resort-sand lg:self-stretch">
        <Image
          src={room.image}
          alt={room.name}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4 bg-[#c4a47c] text-white px-3.5 py-1.5 rounded-[5px] text-xs font-bold tracking-wider uppercase shadow-sm">
          {discountPercentage}% OFF
        </div>

        <div className="absolute bottom-4 right-4 bg-resort-cocoa text-resort-offwhite px-4 py-1.5 rounded-[5px] text-[10px] font-bold tracking-widest uppercase shadow-sm">
          {room.category}
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10 lg:pl-12 flex flex-col flex-1 justify-between bg-resort-white">
        <div>
          <div className="flex items-center text-[#132c4a] text-xs font-bold tracking-[0.15em] uppercase mb-3.5">
            CABANGAN, ZAMBALES
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#132c4a] mb-4 leading-tight group-hover:text-resort-terracotta transition-colors duration-300">
            {room.name}
          </h3>

          <p className="text-resort-cocoa/75 text-sm sm:text-base leading-relaxed mb-6 font-light">
            {room.shortDescription}
          </p>

          <hr className="border-resort-cocoa/10 my-4" />

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-resort-cocoa/70 my-4 font-light uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#c4a47c]/80" />
              <span>{room.capacityLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BedDouble className="w-4 h-4 text-[#c4a47c]/80" />
              <span>{room.beds}</span>
            </div>
          </div>

          <hr className="border-resort-cocoa/10 my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 my-4">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2.5 text-xs sm:text-sm text-resort-cocoa/75">
                <SparkleIcon />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <hr className="border-resort-cocoa/10 my-4" />

          <div className="mt-6">
            <div className="flex items-baseline flex-wrap mb-4">
              <span className="text-[10px] tracking-wider text-resort-cocoa/40 uppercase mr-2.5 font-semibold">FROM</span>
              <span className="text-sm line-through text-resort-cocoa/40 font-normal mr-2.5">
                {formatPHPCurrency(room.regularRate)}
              </span>
              <span className="font-serif text-3xl font-bold text-[#132c4a]">
                {formatPHPCurrency(room.discountedRate)}
              </span>
              <span className="text-xs text-resort-cocoa/50 font-normal ml-1">/ night</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
              <Link
                href={room.detailsHref}
                className="border border-[#132c4a]/20 text-[#132c4a] hover:bg-[#132c4a] hover:text-resort-white font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-[5px] transition-all duration-300 text-center"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={handleBookNow}
                className="bg-[#c4a47c] text-white hover:bg-[#132c4a] transition-all duration-300 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-[5px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Tag className="w-3.5 h-3.5" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
