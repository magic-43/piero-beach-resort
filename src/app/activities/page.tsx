import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort, siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { Sun, Waves, Wind } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities & Experiences",
  description: "Swimming, beach volleyball, kayaking, jetski rides, bonfire evenings, and coastal relaxation at Piero Beach Resort.",
};

const activityGroups = [
  {
    label: "01 · Water & Coast",
    title: "Beach & Ocean",
    items: [
      "Swimming",
      "Jetski rides when available",
      "Kayaking when available",
      "Fishing when available",
      "Sunset viewing",
    ],
  },
  {
    label: "02 · Recreation",
    title: "Resort Games",
    items: [
      "Beach volleyball",
      "Basketball",
      "Billiards",
      "Videoke / karaoke",
      "Photography and content-creation spots",
    ],
  },
  {
    label: "03 · Social",
    title: "Gatherings & Fun",
    items: [
      "Bonfire on request",
      "Grilling / BBQ",
      "Island sightseeing and beach walks",
      "Team-building activities",
      "Family gatherings and outings",
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite">
        <section className="relative h-[70vh] min-h-[600px] flex flex-col justify-center px-4 overflow-hidden bg-resort-cocoa">
          <Image
            src={siteImages.activitiesHero}
            alt="Experiences at Piero Beach Resort"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/30" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
            <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
              EXPERIENCES AT PIERO
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-resort-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-md">
              Make every day feel unhurried.
            </h1>
            <p className="text-lg md:text-xl text-resort-white/90 font-light max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
              From swimming and sunset viewing to karaoke, grilling, and team-building, the resort offers activities for different group sizes and moods.
            </p>
            <Link
              href="#activities"
              className="inline-flex items-center justify-center px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Explore the Experiences
            </Link>
          </Reveal>
        </section>

        <section className="py-20 lg:py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
              YOUR DAY, YOUR PACE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-8 leading-tight">
              From quiet mornings to golden-hour swims.
            </h2>
            <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
              The resort experience mixes quiet beachfront moments with active group recreation, giving families, barkadas, and outing groups plenty to do without leaving the property behind.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 border-t border-resort-cocoa/10 pt-12">
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">Beachfront</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Access</div>
              </div>
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">{resort.activities.length}</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Real Activities</div>
              </div>
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">For Everyone</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Guests of All Ages</div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="activities" className="py-24 bg-resort-offwhite">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activityGroups.map((group) => (
                <div
                  key={group.title}
                  className="bg-resort-white p-8 rounded-2xl shadow-sm border border-resort-cocoa/5 flex flex-col"
                >
                  <span className="inline-block text-resort-olive text-xs font-bold uppercase tracking-wider mb-4">
                    {group.label}
                  </span>
                  <h3 className="font-serif text-2xl text-resort-cocoa mb-6">{group.title}</h3>
                  <ul className="space-y-4 text-resort-cocoa/80 text-sm font-medium flex-grow">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center space-x-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-cocoa text-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-resort-sand">
                <Image
                  src={siteImages.activitiesFeature}
                  alt="Out on the water"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div>
                <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  OUT ON THE WATER
                </span>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                  A little adventure beyond the shore.
                </h2>
                <p className="text-resort-offwhite/90 text-lg leading-relaxed mb-10">
                  Water-based activities are available depending on weather and operations, giving guests flexible options for light recreation and sightseeing.
                </p>

                <ul className="space-y-6 mb-10 text-resort-offwhite">
                  <li className="flex items-start space-x-4">
                    <Waves className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Swimming, kayaking, and fishing when available</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <Sun className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Sunset viewing and content-creation spots</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <Wind className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Flexible options for groups, families, and outings</span>
                  </li>
                </ul>

                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-colors text-sm font-bold tracking-widest uppercase rounded shadow-lg"
                >
                  Discover Activities
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-sand">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa">A day at Piero.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-6 bg-resort-white rounded-xl shadow-sm">
                <span className="block text-resort-terracotta text-xs font-bold uppercase tracking-widest mb-3">
                  Sunrise
                </span>
                <p className="text-resort-cocoa font-medium">Walk along the shore</p>
              </div>
              <div className="text-center p-6 bg-resort-white rounded-xl shadow-sm">
                <span className="block text-resort-terracotta text-xs font-bold uppercase tracking-widest mb-3">
                  Late Morning
                </span>
                <p className="text-resort-cocoa font-medium">Relax by the pool</p>
              </div>
              <div className="text-center p-6 bg-resort-white rounded-xl shadow-sm">
                <span className="block text-resort-terracotta text-xs font-bold uppercase tracking-widest mb-3">
                  Afternoon
                </span>
                <p className="text-resort-cocoa font-medium">Play, grill, or explore</p>
              </div>
              <div className="text-center p-6 bg-resort-white rounded-xl shadow-sm">
                <span className="block text-resort-terracotta text-xs font-bold uppercase tracking-widest mb-3">
                  Evening
                </span>
                <p className="text-resort-cocoa font-medium">Slow down beneath the sunset</p>
              </div>
            </div>

            <div className="relative h-[50vh] min-h-[400px] w-full rounded-2xl overflow-hidden shadow-lg bg-resort-cocoa">
              <Image
                src={siteImages.activitiesEvening}
                alt="Evening sunset at the resort"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-olive text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">The coast is waiting.</h2>
            <p className="text-resort-white/90 max-w-xl mx-auto mb-10 text-xl font-light">
              Experience the balance of activity, rest, and group-friendly fun at {resort.name}.
            </p>
            <Link
              href="/reserve"
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-olive hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Reserve Your Stay
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
