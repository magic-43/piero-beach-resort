import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort, siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { Utensils, Clock, Waves, Coffee, Wine } from "lucide-react";

const menuColumns = [
  resort.restaurant.menuCategories.slice(0, 6),
  resort.restaurant.menuCategories.slice(6, 12),
  resort.restaurant.menuCategories.slice(12),
];

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dining & Seaside Restaurant",
  description: "Coastal cuisine, fresh seafood, Filipino specialties, and sunset cocktails at Piero Beach Resort restaurant.",
};

export default function RestaurantsPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite">
        <section className="relative h-[70vh] min-h-[600px] flex flex-col justify-end px-4 pb-24 overflow-hidden bg-resort-cocoa">
          <Image
            src={siteImages.restaurantsHero}
            alt="Dining at Piero Beach Resort"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
              DINING AT PIERO
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-resort-white mb-6 leading-tight max-w-4xl mx-auto">
              Good food, served with a view.
            </h1>
            <p className="text-lg md:text-xl text-resort-offwhite font-light max-w-2xl mx-auto leading-relaxed mb-10">
              {resort.restaurant.name} offers one relaxed dining experience by the beach, with menu categories built for breakfast, all-day dining, snacks, and group meals.
            </p>
          </Reveal>
        </section>

        <section className="py-20 lg:py-24">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  A TASTE OF THE COAST
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-8 leading-tight">
                  Slow meals, warm evenings.
                </h2>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-10">
                  {resort.restaurant.overview}
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-8 border-t border-resort-cocoa/10">
                  <div>
                    <div className="text-resort-terracotta font-serif text-2xl sm:text-4xl mb-2">Ocean</div>
                    <div className="text-resort-cocoa text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Front View
                    </div>
                  </div>
                  <div>
                    <div className="text-resort-terracotta font-serif text-2xl sm:text-4xl mb-2">Daily</div>
                    <div className="text-resort-cocoa text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Menu Variety
                    </div>
                  </div>
                  <div>
                    <div className="text-resort-terracotta font-serif text-2xl sm:text-4xl mb-2">Group</div>
                    <div className="text-resort-cocoa text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Friendly Dining
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden shadow-xl bg-resort-sand">
                <Image
                  src={siteImages.restaurantsPrimary}
                  alt="Coastal dining experience"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-cocoa text-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-resort-sand">
                <Image
                  src={siteImages.restaurantsSecondary}
                  alt="Piero Beach Resort dining"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div>
                <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  THE RESTAURANT
                </span>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">{resort.restaurant.name}</h2>
                <p className="text-resort-offwhite/90 text-lg leading-relaxed mb-8">
                  Breakfast, lunch, dinner, drinks, and dessert are all presented under one resort dining experience with ocean views and easy access for guests and day visitors.
                </p>

                <ul className="space-y-4 mb-10 text-resort-offwhite">
                  <li className="flex items-center space-x-3">
                    <Utensils className="w-5 h-5 text-resort-terracotta" />
                    <span>One resort dining venue with full-day meal categories</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Waves className="w-5 h-5 text-resort-terracotta" />
                    <span>Beachfront and dining-area seating</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-resort-terracotta" />
                    <span>Open restaurant hours: {resort.restaurant.hours}</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-sand">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-resort-white rounded-2xl shadow-xl p-8 md:p-12 text-resort-cocoa">
              <h3 className="font-serif text-3xl text-center mb-8">Restaurant Hours & Policies</h3>

              <div className="space-y-8 text-base">
                <div className="space-y-3 border-b border-resort-cocoa/10 pb-8">
                  <h4 className="font-serif text-xl text-resort-olive mb-4">Dining Hours</h4>
                  <div className="flex justify-between">
                    <span className="font-medium text-resort-cocoa/70">Restaurant:</span>
                    <span className="font-bold text-resort-cocoa">{resort.restaurant.hours}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-xl text-resort-olive mb-4">Dining Policies</h4>
                  {resort.restaurant.grillingPolicy.map((item) => (
                    <p key={item} className="text-resort-cocoa/80">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-resort-cocoa/10 text-center">
                <p className="text-resort-terracotta font-semibold uppercase tracking-wider text-sm">
                  {resort.restaurant.serviceChargeNote}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-resort-sand">
                <Image
                  src={siteImages.restaurantsTertiary}
                  alt="Stay for one more course"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-8 leading-tight">
                  Stay for one more course.
                </h2>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-10">
                  The menu is broad enough for breakfast starts, easy lunch breaks, barkada meals, snacks after activities, and relaxed sunset dining.
                </p>

                <ul className="space-y-6">
                  <li className="flex items-start space-x-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-resort-sand flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-4 h-4 text-resort-terracotta" />
                    </div>
                    <div>
                      <h4 className="text-resort-cocoa font-bold text-lg mb-1">Breakfast Choices</h4>
                      <p className="text-resort-cocoa/70">
                        Breakfast silog meals, breakfast sets, and breakfast platters.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-resort-sand flex items-center justify-center flex-shrink-0">
                      <Wine className="w-4 h-4 text-resort-terracotta" />
                    </div>
                    <div>
                      <h4 className="text-resort-cocoa font-bold text-lg mb-1">Drinks & Dessert</h4>
                      <p className="text-resort-cocoa/70">
                        Non-alcoholic drinks, alcoholic drinks, fruit shakes, and dessert.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-resort-sand flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-4 h-4 text-resort-terracotta" />
                    </div>
                    <div>
                      <h4 className="text-resort-cocoa font-bold text-lg mb-1">Main Menu Variety</h4>
                      <p className="text-resort-cocoa/70">
                        {resort.restaurant.menuCategories.slice(3, 14).join(", ")}.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-offwhite overflow-hidden">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-4">
                FROM BREAKFAST TO NIGHTCAPS
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-resort-cocoa">Menu Categories</h3>
            </div>

            <div className="mb-8 flex flex-col gap-3 border-b border-dashed border-resort-cocoa/20 pb-6 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-resort-olive">Chef&apos;s Menu Board</span>
              <p className="font-serif text-2xl text-resort-cocoa">Pick your table mood, then your course.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              {menuColumns.map((column, columnIndex) => (
                <div key={`column-${columnIndex}`} className="space-y-4">
                  {column.map((category) => (
                    <div key={category} className="border-b border-resort-cocoa/10 pb-4 last:border-b-0 last:pb-0">
                      <p className="font-serif text-xl text-resort-cocoa leading-snug">{category}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-olive text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Let the evening begin with us.</h2>
            <p className="text-resort-white/90 max-w-xl mx-auto mb-10 text-xl font-light">
              We look forward to welcoming you to the dining area at {resort.name}.
            </p>
            <Link
              href="/reserve"
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-olive hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Book a Stay
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
