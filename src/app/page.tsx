import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/ui/category-card";
import { AccommodationCard } from "@/components/ui/accommodation-card";
import { BookingStrip } from "../components/booking-strip";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { resort, siteImages } from "@/data/resort";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getDynamicRooms } from "@/lib/resort-data";

export default async function Home() {
  const dynamicRooms = await getDynamicRooms();
  const dynamicFeaturedRooms = dynamicRooms.slice(0, 3);
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative h-screen min-h-[700px] flex flex-col justify-center px-4 overflow-hidden">
          <Image
            src={siteImages.homeHero}
            alt="Tropical beachfront at Piero Beach Resort"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/30" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-3xl">
              <Reveal delay={200}>
                <span className="inline-flex items-center space-x-2 text-resort-white text-sm tracking-widest uppercase mb-6 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{resort.address.short}</span>
                </span>
              </Reveal>
              <Reveal delay={300}>
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-resort-white mb-8 leading-[1.1]">
                  A slower kind of escape.
                </h1>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-xl md:text-2xl text-resort-offwhite font-light mb-12 max-w-2xl leading-relaxed">
                  Stay at {resort.name} and settle into spacious coastal rooms, beachfront access, and quiet days in Cabangan, Zambales.
                </p>
              </Reveal>
              <Reveal delay={500}>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <Link
                    href="/about"
                    className="w-full sm:w-auto px-10 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-cocoa transition-colors duration-300 font-semibold tracking-widest uppercase text-sm rounded text-center"
                  >
                    Explore the Resort
                  </Link>
                  <Link
                    href="/rooms"
                    className="w-full sm:w-auto px-10 py-4 bg-resort-white/10 backdrop-blur-md border border-resort-white text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-all duration-300 font-semibold tracking-widest uppercase text-sm rounded text-center"
                  >
                    View Rooms
                  </Link>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </section>

        <Reveal delay={600} className="relative z-20 mt-6 lg:-mt-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <BookingStrip />
        </Reveal>

        <section className="py-24 lg:py-32 bg-resort-offwhite overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <Reveal className="lg:col-span-5 z-10 lg:pr-8">
                <SectionHeading subtitle="Welcome to Piero" title="A Tropical Haven on the Coast" align="left" />
                <p className="text-resort-cocoa/80 leading-relaxed mb-10 text-lg">
                  {resort.name} sits in {resort.address.full}, offering beachfront access, spacious rooms and villas, a swimming pool, free Wi-Fi, dining, and gathering spaces designed for laid-back stays by the sea.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center text-resort-terracotta font-bold uppercase tracking-widest text-sm hover:text-resort-cocoa transition-colors group"
                >
                  Discover Piero
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Reveal>
              <Reveal delay={200} className="lg:col-span-7 relative mt-10 lg:mt-0">
                <div className="relative aspect-[4/3] w-full max-w-2xl ml-auto rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={siteImages.homeIntro}
                    alt="Resort Room"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-resort-sand">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading subtitle="Curated Experiences" title="Find Your Rhythm" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16">
              <Reveal className="md:col-span-12 lg:col-span-8">
                <CategoryCard
                  title="Rooms & Villas"
                  href="/rooms"
                  imageUrl={dynamicRooms[1]?.image || resort.rooms[1].image}
                  size="large"
                />
              </Reveal>
              <Reveal delay={150} className="md:col-span-6 lg:col-span-4">
                <CategoryCard
                  title="Dining"
                  href="/restaurants"
                  imageUrl={siteImages.restaurantsPrimary}
                />
              </Reveal>
              <Reveal delay={300} className="md:col-span-6 lg:col-span-4">
                <CategoryCard
                  title="Activities"
                  href="/activities"
                  imageUrl={siteImages.activitiesHero}
                />
              </Reveal>
              <Reveal delay={450} className="md:col-span-6 lg:col-span-4">
                <CategoryCard
                  title="Wellness"
                  href="/activities"
                  imageUrl={siteImages.homeFeatureWide}
                />
              </Reveal>
              <Reveal delay={600} className="md:col-span-6 lg:col-span-4 lg:hidden xl:block">
                <CategoryCard
                  title="Events"
                  href="/events"
                  imageUrl={siteImages.eventsFeature}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-resort-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <SectionHeading
                subtitle="Your Sanctuary"
                title="Featured Accommodations"
                align="left"
                className="mb-0"
              />
              <Link
                href="/rooms"
                className="hidden md:inline-flex items-center px-8 py-4 bg-resort-sand text-resort-cocoa hover:bg-resort-cocoa hover:text-resort-white transition-colors text-sm font-semibold tracking-widest uppercase rounded"
              >
                View All Rooms
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dynamicFeaturedRooms.map((room, index) => (
                <Reveal key={room.id} delay={index * 150}>
                  <AccommodationCard
                    title={room.name}
                    description={room.shortDescription}
                    capacity={room.capacityLabel}
                    imageUrl={room.image}
                    category={room.category}
                    discountedPrice={room.discountedRate}
                    regularPrice={room.regularRate}
                    href={room.detailsHref}
                  />
                </Reveal>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link
                href="/rooms"
                className="inline-flex items-center px-8 py-4 bg-resort-sand text-resort-cocoa hover:bg-resort-cocoa hover:text-resort-white transition-colors text-sm font-semibold tracking-widest uppercase w-full justify-center rounded"
              >
                View All Rooms
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-resort-cocoa">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Reveal direction="none" className="relative aspect-square lg:aspect-auto lg:h-[700px] group overflow-hidden">
              <Image
                src={siteImages.homeActivities}
                alt="Activities"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-resort-cocoa/40 group-hover:bg-resort-cocoa/30 transition-colors duration-500" />
              <div className="absolute inset-0 p-6 sm:p-12 md:p-20 flex flex-col justify-end text-resort-white">
                <Reveal delay={200}>
                  <span className="block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
                    Adventures Await
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6">Explore the Coast</h3>
                  <p className="text-resort-offwhite max-w-md mb-10 text-lg leading-relaxed">
                    Swimming, beach volleyball, bonfires on request, water activities, and sunset walks all fit naturally into the rhythm of the resort.
                  </p>
                  <Link
                    href="/activities"
                    className="inline-flex items-center px-8 py-4 border-2 border-resort-white text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-all font-semibold tracking-widest uppercase text-sm w-fit rounded"
                  >
                    Discover Activities
                  </Link>
                </Reveal>
              </div>
            </Reveal>

            <Reveal direction="none" delay={200} className="relative aspect-square lg:aspect-auto lg:h-[700px] group overflow-hidden">
              <Image
                src={siteImages.homeDining}
                alt="Dining"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-resort-cocoa/40 group-hover:bg-resort-cocoa/30 transition-colors duration-500" />
              <div className="absolute inset-0 p-6 sm:p-12 md:p-20 flex flex-col justify-end text-resort-white">
                <Reveal delay={400}>
                  <span className="block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
                    Taste the Tropics
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6">Dine by the Ocean</h3>
                  <p className="text-resort-offwhite max-w-md mb-10 text-lg leading-relaxed">
                    {resort.restaurant.name} serves breakfast, all-day meals, and refreshments from {resort.restaurant.hours}.
                  </p>
                  <Link
                    href="/restaurants"
                    className="inline-flex items-center px-8 py-4 border-2 border-resort-white text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-all font-semibold tracking-widest uppercase text-sm w-fit rounded"
                  >
                    Explore Dining
                  </Link>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-resort-sand">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-16 shadow-lg">
              <Image
                src={siteImages.homeFeatureWide}
                alt="Resort Aerial"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <h2 className="font-serif text-4xl lg:text-5xl text-resort-cocoa mb-8 leading-tight">
                  Designed for those who seek beauty in tranquility.
                </h2>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed">
                  Spacious rooms, jacuzzi and dipping tubs in all accommodations, and ocean-view lounging areas make {resort.name} a practical and peaceful base for families, couples, and group getaways.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 lg:pt-0 border-t lg:border-t-0 border-resort-cocoa/20">
                <Reveal delay={150} className="text-center lg:text-left">
                  <div className="font-serif text-3xl text-resort-terracotta mb-3">5</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-resort-olive">Room Types</div>
                </Reveal>
                <Reveal delay={300} className="text-center lg:text-left">
                  <div className="font-serif text-3xl text-resort-terracotta mb-3">24/7</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-resort-olive">Restaurant Access</div>
                </Reveal>
                <Reveal delay={450} className="text-center lg:text-left">
                  <div className="font-serif text-3xl text-resort-terracotta mb-3">Wi-Fi</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-resort-olive">Guest Connectivity</div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-resort-offwhite">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <SectionHeading subtitle="Find Us" title="Your Journey to Paradise" align="left" />
                <div className="mb-10 text-lg">
                  <p className="font-bold text-resort-cocoa mb-2">{resort.name}</p>
                  <p className="text-resort-cocoa/80 leading-relaxed mb-6">
                    {resort.address.line1}
                    <br />
                    {resort.address.line2}
                  </p>
                  <p className="text-resort-cocoa/80 leading-relaxed">{resort.directions.byCar}</p>
                  <p className="text-resort-cocoa/80 leading-relaxed mt-2">{resort.directions.byCarTravelTime}</p>
                </div>
                <a
                  href={resort.contact.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 border-2 border-resort-cocoa text-resort-cocoa hover:bg-resort-cocoa hover:text-resort-white transition-all font-semibold tracking-widest uppercase text-sm rounded"
                >
                  Get Directions
                </a>
              </Reveal>
              <Reveal delay={200} className="relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl bg-resort-sand border border-resort-cocoa/10">
                <iframe
                  src="https://maps.google.com/maps?q=Piero+Beach+Resort+Cabangan+Zambales&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-32 bg-resort-terracotta text-center text-resort-white relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
            style={{ backgroundImage: `url(${siteImages.homeCtaOverlay})` }}
          />
          <div className="relative z-10 container mx-auto px-4">
            <Reveal>
              <h2 className="font-serif text-5xl md:text-6xl mb-6">Your beach escape starts here.</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-resort-white/90 max-w-xl mx-auto mb-12 text-xl font-light">
                Secure your stay at {resort.name} and start planning slower days by the shore.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link
                href="/reserve"
                className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-terracotta hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
              >
                Reserve Your Stay
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-resort-sand py-20 border-b border-resort-cocoa/10">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h3 className="font-serif text-3xl text-resort-cocoa mb-4">Join the Piero Family</h3>
            <p className="text-resort-cocoa/80 mb-10 text-lg">
              Sign up for resort updates, stay offers, and fresh reasons to plan your next beach escape.
            </p>
            <NewsletterSignup />
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
