import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { Users, Wine, Heart } from "lucide-react";

export const metadata = {
  title: "Weddings & Private Celebrations",
  description: "Celebrate close to the coast. Beach weddings, outdoor resort events, corporate retreats, and private dinners at Piero Beach Resort.",
};

interface EventSpaceProps {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

function EventSpaceCard({ title, category, description, imageUrl }: EventSpaceProps) {
  return (
    <div className="group cursor-pointer flex flex-col h-full bg-resort-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <span className="text-resort-olive text-xs font-bold uppercase tracking-widest mb-3">
          {category}
        </span>
        <h3 className="font-serif text-2xl text-resort-cocoa mb-3">{title}</h3>
        <p className="text-resort-cocoa/80 leading-relaxed text-sm mb-6 flex-grow">
          {description}
        </p>
        <span className="inline-flex items-center text-sm font-bold text-resort-cocoa tracking-widest uppercase group-hover:text-resort-terracotta transition-colors">
          Explore <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 bg-resort-offwhite">
        {/* 1. Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] flex flex-col justify-center px-4 overflow-hidden bg-resort-cocoa">
          <Image 
            src={siteImages.eventsHero} 
            alt="Events at Piero Beach Resort" 
            fill 
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/40" />
          
          <Reveal delay={100} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
            <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
              EVENTS AT PIERO
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-resort-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-md">
              Celebrate close to the coast.
            </h1>
            <p className="text-lg md:text-xl text-resort-white/90 font-light max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
              From intimate beachfront ceremonies to vibrant garden receptions, discover stunning spaces tailored to make your moments unforgettable.
            </p>
            <Link 
              href="#spaces" 
              className="inline-flex items-center justify-center px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Explore Our Event Spaces
            </Link>
          </Reveal>
        </section>

        {/* 2. Introduction */}
        <section className="py-20 lg:py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
              YOUR MOMENT, YOUR WAY
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-8 leading-tight">
              Gather, celebrate, and make it memorable.
            </h2>
            <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-16 max-w-3xl mx-auto">
              Our coastal retreat provides an idyllic backdrop for life&apos;s most meaningful occasions. With a dedicated team to guide you, every detail is crafted to reflect your vision.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 border-t border-resort-cocoa/10 pt-12">
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">Beachfront</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Settings</div>
              </div>
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">Flexible</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Spaces</div>
              </div>
              <div>
                <div className="text-resort-terracotta font-serif text-4xl mb-2">Personal</div>
                <div className="text-resort-cocoa text-xs font-bold uppercase tracking-wider">Support</div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. Event Spaces */}
        <section id="spaces" className="py-24 bg-resort-offwhite">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Our Venues</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <EventSpaceCard 
                title="Beachfront Ceremony"
                category="Outdoor"
                description="Exchange vows on the pristine white sand with the ocean breeze and a stunning sunset as your backdrop."
                imageUrl={siteImages.eventsCards[0]}
              />
              <EventSpaceCard 
                title="Garden Celebration"
                category="Outdoor"
                description="Lush tropical gardens provide an elegant and private setting for vibrant outdoor receptions and parties."
                imageUrl={siteImages.eventsCards[1]}
              />
              <EventSpaceCard 
                title="Sunset Reception"
                category="Outdoor / Covered"
                description="An elevated open-air terrace offering panoramic views of the coast, perfect for cocktail hours and celebrations."
                imageUrl={siteImages.eventsCards[2]}
              />
              <EventSpaceCard 
                title="Private Dining Pavilion"
                category="Indoor / Outdoor"
                description="An intimate, beautifully styled pavilion for exclusive dinners, family gatherings, and romantic celebrations."
                imageUrl={siteImages.eventsCards[3]}
              />
              <EventSpaceCard 
                title="Corporate Retreat"
                category="Indoor / Outdoor"
                description="Versatile spaces equipped for professional gatherings, team building, and corporate events with a tropical touch."
                imageUrl={siteImages.eventsCards[4]}
              />
            </div>
          </Reveal>
        </section>

        {/* 4. Featured Wedding Section */}
        <section className="py-24 bg-resort-cocoa text-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-resort-sand">
                <Image 
                  src={siteImages.eventsFeature} 
                  alt="A beautiful beachfront wedding" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
              </div>
              
              <div>
                <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  YOUR SPECIAL DAY
                </span>
                <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                  A setting made for your story.
                </h2>
                <p className="text-resort-offwhite/90 text-lg leading-relaxed mb-10">
                  Say &quot;I do&quot; where the ocean meets the shore. Our dedicated wedding specialists will handle every detail, from the ceremony to the reception, ensuring a seamless and magical experience.
                </p>
                
                <ul className="space-y-6 mb-10 text-resort-offwhite">
                  <li className="flex items-start space-x-4">
                    <Heart className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Beachfront ceremonies</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <Wine className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Intimate dinners</span>
                  </li>
                  <li className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-resort-terracotta flex-shrink-0" />
                    <span className="pt-1">Larger celebrations</span>
                  </li>
                </ul>
                
                <Link 
                  href="/contact" 
                  className="inline-block px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-white hover:text-resort-cocoa transition-colors text-sm font-bold tracking-widest uppercase rounded shadow-lg"
                >
                  Plan Your Event
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 5. Occasions Section */}
        <section className="py-24 bg-resort-sand">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Perfect for any occasion.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-resort-white p-10 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Heart className="w-10 h-10 text-resort-terracotta mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-resort-cocoa mb-4">Weddings</h3>
                <p className="text-resort-cocoa/70 text-sm leading-relaxed">
                  From elopements to grand celebrations, start your forever on the coast.
                </p>
              </div>
              
              <div className="bg-resort-white p-10 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Wine className="w-10 h-10 text-resort-terracotta mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-resort-cocoa mb-4">Birthdays &amp; Anniversaries</h3>
                <p className="text-resort-cocoa/70 text-sm leading-relaxed">
                  Celebrate life&apos;s milestones with incredible food and breathtaking views.
                </p>
              </div>
              
              <div className="bg-resort-white p-10 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-10 h-10 text-resort-terracotta mx-auto mb-6" />
                <h3 className="font-serif text-2xl text-resort-cocoa mb-4">Corporate Gatherings</h3>
                <p className="text-resort-cocoa/70 text-sm leading-relaxed">
                  Inspire your team with retreats and meetings in a refreshing tropical setting.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 6. Final CTA */}
        <section className="py-24 bg-resort-olive text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Let us help shape your celebration.</h2>
            <p className="text-resort-white/90 max-w-xl mx-auto mb-10 text-xl font-light">
              Contact our events team to start planning your memorable occasion.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-olive hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Speak with Our Team
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
