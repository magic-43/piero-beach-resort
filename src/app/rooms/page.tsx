import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { RoomListingCard } from "@/components/ui/room-listing-card";
import { BookingStrip } from "../../components/booking-strip";
import { resort, siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { Coffee, Wifi, Waves, Martini, HeadphonesIcon, Snowflake } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getDynamicRooms } from "@/lib/resort-data";
import { createClient } from "@/lib/supabase/server";
import { getBookingReminderList } from "@/lib/booking-settings";

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("resort_settings").select("*").eq("id", 1).single();
  const dynamicRooms = await getDynamicRooms();
  const bookingReminderList = getBookingReminderList(settings);
  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite">
        <section className="relative h-[60vh] min-h-[500px] flex flex-col justify-center px-4 overflow-hidden bg-resort-sand">
          <Image
            src={siteImages.roomsHero}
            alt="Piero Beach Resort rooms and villas"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/40" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
            <Reveal delay={200}>
              <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-6">
                Stay by the Coast
              </span>
            </Reveal>
            <Reveal delay={300}>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-resort-white mb-6 leading-tight max-w-4xl mx-auto">
                Find a space made for slowing down.
              </h1>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-lg md:text-xl text-resort-offwhite font-light max-w-2xl mx-auto leading-relaxed">
                Choose from real resort room types designed for couples, families, and group stays, all with jacuzzi and dipping tubs included.
              </p>
            </Reveal>
          </Reveal>
        </section>

        <Reveal delay={500} className="relative z-20 mt-6 lg:-mt-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <BookingStrip />
        </Reveal>

        <section className="py-20 lg:py-28 bg-[#faf6f0]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              <Reveal className="lg:col-span-7 space-y-8">
                <div className="flex items-center space-x-3 text-[#c4a47c] text-xs font-bold tracking-[0.2em] uppercase">
                  <span className="w-8 h-[1px] bg-[#c4a47c]" />
                  <span>FIVE RETREATS, ONE HORIZON</span>
                </div>

                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-resort-cocoa leading-tight mb-8">
                  Cozy sanctuaries <br />
                  <span className="text-[#c4a47c] italic font-light">at the edge of the sea.</span>
                </h2>

                <div className="space-y-6 text-resort-cocoa/80 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                  <p>
                    Every stay at {resort.name} includes spacious rooms or villas, beachfront access, resort support, and a quieter pace by the coast.
                  </p>
                  <p>
                    From the Cabin Suite to the Family Room, each accommodation includes breakfast based on room capacity, a jacuzzi, and a dipping tub, with select room types allowing extra guests.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 text-[11px] font-bold uppercase tracking-wider text-resort-cocoa/50 border-t border-resort-cocoa/10 mt-8">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4.5 h-4.5 text-[#c4a47c]" />
                    <span>Free Wi-Fi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-4.5 h-4.5 text-[#c4a47c]" />
                    <span>Breakfast Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Snowflake className="w-4.5 h-4.5 text-[#c4a47c]" />
                    <span>Air-Conditioned</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Waves className="w-4.5 h-4.5 text-[#c4a47c]" />
                    <span>Jacuzzi & Dipping Tub</span>
                  </div>
                </div>
              </Reveal>

              <div className="lg:col-span-5 relative">
                <div className="grid grid-cols-2 gap-y-16 py-8 relative">
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-resort-cocoa/10 -translate-x-1/2" />
                  <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-resort-cocoa/10 -translate-y-1/2" />

                  <Reveal delay={100} className="flex flex-col items-center justify-center text-center p-6 pb-12 pr-6">
                    <span className="font-serif text-5xl md:text-6xl text-[#c4a47c]">{dynamicRooms.length}</span>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-resort-cocoa/60 uppercase mt-4 whitespace-nowrap">
                      Room Categories
                    </span>
                  </Reveal>

                  <Reveal delay={200} className="flex flex-col items-center justify-center text-center p-6 pb-12 pl-6">
                    <span className="font-serif text-5xl md:text-6xl text-[#c4a47c]">24/7</span>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-resort-cocoa/60 uppercase mt-4 whitespace-nowrap">
                      Restaurant Access
                    </span>
                  </Reveal>

                  <Reveal delay={300} className="flex flex-col items-center justify-center text-center p-6 pt-12 pr-6">
                    <span className="font-serif text-5xl md:text-6xl text-[#c4a47c]">12</span>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-resort-cocoa/60 uppercase mt-4 whitespace-nowrap">
                      Core Amenities
                    </span>
                  </Reveal>

                  <Reveal delay={400} className="flex flex-col items-center justify-center text-center p-6 pt-12 pl-6">
                    <span className="font-serif text-5xl md:text-6xl text-[#c4a47c]">Pool</span>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-resort-cocoa/60 uppercase mt-4 whitespace-nowrap">
                      Beachfront Access
                    </span>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <Reveal className="mb-16 bg-resort-sand/30 border border-resort-cocoa/10 p-6 md:p-8 rounded-xl max-w-6xl mx-auto">
              <h3 className="font-serif text-2xl text-resort-cocoa mb-6">Booking Policies & Reminders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-resort-cocoa/80">
                {bookingReminderList.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="flex flex-col gap-10">
              {dynamicRooms.map((room, index) => (
                <Reveal key={room.id} delay={index * 150}>
                  <RoomListingCard room={room} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 text-center">
              <p className="text-resort-olive text-sm font-bold tracking-widest uppercase mb-4">
                Showing all {dynamicRooms.length} accommodations
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-24 bg-resort-sand">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-16">
              <h2 className="font-serif text-4xl text-resort-cocoa">Included with every stay.</h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Reveal delay={100} className="flex flex-col items-center text-center p-6">
                <Coffee className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Breakfast</h4>
                <p className="text-xs text-resort-cocoa/70">Breakfast included based on room capacity</p>
              </Reveal>
              <Reveal delay={200} className="flex flex-col items-center text-center p-6">
                <Wifi className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Wi-Fi</h4>
                <p className="text-xs text-resort-cocoa/70">Free resort-wide access</p>
              </Reveal>
              <Reveal delay={300} className="flex flex-col items-center text-center p-6">
                <Waves className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Pool Access</h4>
                <p className="text-xs text-resort-cocoa/70">Use of the resort swimming pool</p>
              </Reveal>
              <Reveal delay={400} className="flex flex-col items-center text-center p-6">
                <Waves className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Beach Access</h4>
                <p className="text-xs text-resort-cocoa/70">Beachfront access and lounging areas</p>
              </Reveal>
              <Reveal delay={500} className="flex flex-col items-center text-center p-6">
                <Martini className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Jacuzzi</h4>
                <p className="text-xs text-resort-cocoa/70">Jacuzzi and dipping tub in all rooms</p>
              </Reveal>
              <Reveal delay={600} className="flex flex-col items-center text-center p-6">
                <HeadphonesIcon className="w-8 h-8 text-resort-terracotta mb-4" />
                <h4 className="text-resort-cocoa font-bold text-sm uppercase tracking-wider mb-2">Guest Support</h4>
                <p className="text-xs text-resort-cocoa/70">Front-desk assistance and housekeeping</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-resort-cocoa overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Reveal direction="none" className="relative aspect-square lg:aspect-auto lg:h-[600px] order-2 lg:order-1 bg-resort-sand">
              <Image
                src={siteImages.roomsCta}
                alt="Group getaway by the beach"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
            <div className="p-12 md:p-20 flex flex-col justify-center text-resort-white order-1 lg:order-2">
              <Reveal>
                <span className="text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4 block">
                  Special Arrangements
                </span>
                <h3 className="font-serif text-4xl lg:text-5xl mb-6 leading-tight">
                  Planning a longer stay or a group escape?
                </h3>
              </Reveal>
              <Reveal delay={150}>
                <p className="text-resort-offwhite max-w-md mb-10 text-lg leading-relaxed font-light">
                  Family gatherings, outings, and group stays fit naturally at the resort, especially with larger room options and event spaces available on-site.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-resort-white text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-all font-semibold tracking-widest uppercase text-sm w-fit rounded"
                >
                  Speak with Our Team
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24 bg-resort-terracotta text-center text-resort-white">
          <div className="container mx-auto px-4">
            <Reveal>
              <h2 className="font-serif text-4xl md:text-5xl mb-10">Your room by the coast is waiting.</h2>
            </Reveal>
            <Reveal delay={150}>
              <Link
                href="/reserve"
                className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-terracotta hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
              >
                Reserve Your Stay
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
