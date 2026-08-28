import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort, siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { Waves, Heart, Coffee } from "lucide-react";

export const metadata = {
  title: "About Us & Story",
  description: "A place made for slower days. Discover Piero Beach Resort, a quiet escape along the coast in Zambales.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 bg-resort-offwhite pt-20">
        {/* 1. Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center px-4 overflow-hidden bg-resort-cocoa text-resort-white">
          <Image 
            src={siteImages.aboutHero} 
            alt="Piero Beach Resort at sunrise" 
            fill 
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/40" />
          
          <Reveal delay={100} className="relative z-10 container mx-auto px-4 text-center">
            <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
              ABOUT US
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight max-w-4xl mx-auto drop-shadow-md">
              A place made for slower days.
            </h1>
            <p className="text-lg md:text-xl text-resort-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
              Leave the rush behind and discover a coastal sanctuary designed around comfort, connection, and the rhythm of the ocean.
            </p>
          </Reveal>
        </section>

        {/* 2. Resort Story */}
        <section className="py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  OUR STORY
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6 leading-tight">
                  A quiet escape along the coast.
                </h2>
                <div className="space-y-6 text-resort-cocoa/80 text-lg leading-relaxed">
                  <p>
                    Nestled on the pristine shores of Cabangan, Zambales, Piero Beach Resort was born from a simple desire: to create a place where time slows down. We envisioned a retreat that blends the natural beauty of the tropics with thoughtful design and genuine hospitality.
                  </p>
                  <p>
                    Here, luxury isn&apos;t about excess; it&apos;s about having the space to breathe, the comfort to unwind, and the freedom to craft your perfect day by the water. 
                  </p>
                </div>
              </div>
              
              <div className="relative h-[320px] sm:h-[480px] lg:h-[600px] w-full">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-lg z-10">
                  <Image 
                    src={siteImages.aboutStoryPrimary} 
                    alt="Lush green coastal pathway" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" 
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-resort-white">
                  <Image 
                    src={siteImages.aboutStorySecondary} 
                    alt="Peaceful outdoor lounge area" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" 
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. Resort Highlights */}
        <section className="py-20 bg-resort-cocoa text-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-resort-white/20">
              <div className="pt-8 md:pt-0 md:px-8">
                <Waves className="w-10 h-10 text-resort-seafoam mx-auto mb-6" />
                <h3 className="font-serif text-2xl mb-4">Beachfront setting</h3>
                <p className="text-resort-white/80 font-light text-sm leading-relaxed">
                  Step directly from your room onto the warm sands and enjoy uninterrupted views of the horizon.
                </p>
              </div>
              <div className="pt-8 md:pt-0 md:px-8">
                <Heart className="w-10 h-10 text-resort-terracotta mx-auto mb-6" />
                <h3 className="font-serif text-2xl mb-4">Thoughtful stays</h3>
                <p className="text-resort-white/80 font-light text-sm leading-relaxed">
                  Every detail in our accommodations is designed for your ultimate comfort and rest.
                </p>
              </div>
              <div className="pt-8 md:pt-0 md:px-8">
                <Coffee className="w-10 h-10 text-resort-sand mx-auto mb-6" />
                <h3 className="font-serif text-2xl mb-4">Relaxed experiences</h3>
                <p className="text-resort-white/80 font-light text-sm leading-relaxed">
                  From poolside lounging to intimate dining, everything moves at your own leisurely pace.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. Experience Grid */}
        <section className="py-24 bg-resort-sand">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-4">
                DISCOVER MORE
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Everything you need.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/rooms" className="group relative h-80 rounded-xl overflow-hidden block">
                <Image src={resort.rooms[1].image} alt="Rooms & Villas" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-resort-white font-serif text-3xl mb-2">Rooms & Villas</h3>
                  <span className="text-resort-sand text-sm uppercase tracking-widest font-bold flex items-center group-hover:text-resort-white transition-colors">
                    Explore <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>

              <Link href="/restaurants" className="group relative h-80 rounded-xl overflow-hidden block">
                <Image src={siteImages.restaurantsHero} alt="Dining" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-resort-white font-serif text-3xl mb-2">Dining</h3>
                  <span className="text-resort-sand text-sm uppercase tracking-widest font-bold flex items-center group-hover:text-resort-white transition-colors">
                    Taste <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>

              <Link href="/activities" className="group relative h-80 rounded-xl overflow-hidden block">
                <Image src={siteImages.activitiesHero} alt="Activities" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-resort-white font-serif text-3xl mb-2">Activities</h3>
                  <span className="text-resort-sand text-sm uppercase tracking-widest font-bold flex items-center group-hover:text-resort-white transition-colors">
                    Experience <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>

              <Link href="/events" className="group relative h-80 rounded-xl overflow-hidden block">
                <Image src={siteImages.eventsHero} alt="Events & Celebrations" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-resort-cocoa/90 via-resort-cocoa/30 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-resort-white font-serif text-3xl mb-2">Events & Celebrations</h3>
                  <span className="text-resort-sand text-sm uppercase tracking-widest font-bold flex items-center group-hover:text-resort-white transition-colors">
                    Celebrate <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* 5. Gallery Section */}
        <section className="py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Moments at Piero</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[250px] gap-4">
              {siteImages.aboutGallery.map((src, index) => {
                let spanClasses = "col-span-1 row-span-1";
                switch (index) {
                  case 0: spanClasses = "col-span-2 row-span-2 md:col-span-2 md:row-span-2"; break;
                  case 1: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-2"; break;
                  case 2: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; break;
                  case 3: spanClasses = "col-span-2 row-span-1 md:col-span-1 md:row-span-1"; break;
                  case 4: spanClasses = "col-span-1 row-span-2 md:col-span-2 md:row-span-1"; break;
                  case 5: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; break;
                  case 6: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-2"; break;
                  case 7: spanClasses = "col-span-2 row-span-2 md:col-span-2 md:row-span-2"; break;
                  case 8: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; break;
                  case 9: spanClasses = "col-span-1 row-span-1 md:col-span-1 md:row-span-1"; break;
                  case 10: spanClasses = "col-span-2 row-span-1 md:col-span-1 md:row-span-1"; break;
                }
                
                return (
                  <div key={index} className={`relative rounded-xl overflow-hidden group ${spanClasses}`}>
                    <Image 
                      src={src} 
                      alt={`Moments at Piero ${index + 1}`} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 33vw" 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* 6. Why Choose Piero */}
        <section className="py-24 bg-resort-offwhite border-t border-resort-cocoa/5">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Why choose Piero</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <div>
                <h3 className="font-serif text-2xl text-resort-cocoa mb-3">Peaceful coastal setting</h3>
                <p className="text-resort-cocoa/70 leading-relaxed text-sm">
                  Tucked away from the bustling crowds, our location provides the perfect sanctuary for deep relaxation and uninterrupted connection with nature.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-resort-cocoa mb-3">Comfortable accommodations</h3>
                <p className="text-resort-cocoa/70 leading-relaxed text-sm">
                  Every room and villa merges modern comfort with tropical aesthetics, giving you a beautiful private space to return to after a day in the sun.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-resort-cocoa mb-3">Warm guest support</h3>
                <p className="text-resort-cocoa/70 leading-relaxed text-sm">
                  Our dedicated staff are here to ensure your stay is completely seamless, providing intuitive service with a genuine, welcoming smile.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-resort-cocoa mb-3">Experiences for every pace</h3>
                <p className="text-resort-cocoa/70 leading-relaxed text-sm">
                  Whether you want to paddleboard across the bay or simply read a book by the infinity pool, we cater to your ideal version of a getaway.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 7. Final CTA */}
        <section className="py-24 bg-resort-olive text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-10">Your place by the coast is waiting.</h2>
            <Link 
              href="/rooms" 
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-terracotta text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Explore the Resort
            </Link>
          </Reveal>
        </section>
      </main>

      {/* Shared Elements */}
      <Footer />
      <FloatingActions />
    </>
  );
}
