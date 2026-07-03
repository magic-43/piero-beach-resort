import { Header } from "@/components/layout/header";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort, siteImages } from "@/data/resort";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ChevronDown } from "lucide-react";
import { FacebookIcon, WhatsappIcon } from "@/components/ui/icons";

import { createClient } from "@/lib/supabase/server";
import { getBookingReminderList, getDynamicFaq } from "@/lib/booking-settings";

export const metadata = {
  title: "Contact & Concierge | Piero Beach Resort",
  description: "Contact Piero Beach Resort for reservations, directions, and stay assistance.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("resort_settings").select("*").eq("id", 1).single();

  const sitePhone = settings?.site_phone || resort.contact.phone;
  const sitePhoneHref = settings?.site_phone ? `tel:${settings.site_phone.replace(/[^0-9+]/g, '')}` : resort.contact.phoneHref;
  const siteWhatsapp = settings?.site_whatsapp || resort.contact.whatsapp;
  const siteWhatsappHref = settings?.site_whatsapp ? `https://wa.me/${settings.site_whatsapp.replace(/[^0-9+]/g, '')}` : resort.contact.whatsappHref;
  const siteFacebookHref = settings?.site_facebook || resort.contact.facebookHref;
  const siteMapsHref = settings?.site_google_maps || resort.contact.mapsHref;
  const bookingReminderList = getBookingReminderList(settings);
  const faqItems = getDynamicFaq(settings);
  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite pt-20">
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center px-4 overflow-hidden bg-resort-cocoa text-resort-white">
          <Image
            src={siteImages.contactHero}
            alt="Piero Beach Resort reception"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-resort-cocoa/40" />

          <Reveal delay={100} className="relative z-10 container mx-auto px-4 text-center mt-10">
            <span className="inline-block text-resort-seafoam text-sm tracking-[0.2em] uppercase font-bold mb-4">
              CONTACT & CONCIERGE
            </span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight max-w-4xl mx-auto drop-shadow-md">
              We are here to help plan your stay.
            </h1>
            <p className="text-lg md:text-xl text-resort-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
              Reach the resort directly for reservations, directions, policies, or quick travel questions.
            </p>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-white relative">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <div>
                <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  GET IN TOUCH
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6 leading-tight">
                  Let us make your escape easier.
                </h2>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-12 max-w-lg">
                  Contact the resort for stay questions, directions, policies, or help with family outings and group arrangements.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-resort-sand rounded-full text-resort-terracotta mt-1">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-resort-cocoa mb-1">Call Us</h3>
                      <p className="text-resort-cocoa/70 text-sm mb-1">For reservations and direct assistance</p>
                      <a
                        href={sitePhoneHref}
                        className="text-resort-olive font-medium hover:text-resort-terracotta transition-colors text-lg"
                      >
                        {sitePhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-resort-sand rounded-full text-resort-terracotta mt-1">
                      <WhatsappIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-resort-cocoa mb-1">WhatsApp</h3>
                      <p className="text-resort-cocoa/70 text-sm mb-1">Message the resort directly</p>
                      <a
                        href={siteWhatsappHref}
                        className="text-resort-olive font-medium hover:text-resort-terracotta transition-colors text-lg"
                      >
                        {siteWhatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-resort-sand rounded-full text-resort-terracotta mt-1">
                      <FacebookIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-resort-cocoa mb-1">Facebook</h3>
                      <p className="text-resort-cocoa/70 text-sm mb-1">See updates and contact the page</p>
                      <a
                        href={siteFacebookHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-resort-olive font-medium hover:text-resort-terracotta transition-colors text-lg"
                      >
                        Open Facebook Page
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-resort-sand rounded-full text-resort-terracotta mt-1">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-resort-cocoa mb-1">Visit Us</h3>
                      <p className="text-resort-cocoa/70 text-sm mb-1">{resort.name}</p>
                      <a
                        href={siteMapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-resort-olive font-medium text-lg hover:text-resort-terracotta transition-colors"
                      >
                        {resort.address.line1}
                        <br />
                        {resort.address.line2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-resort-offwhite p-5 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-resort-cocoa/5">
                <h3 className="font-serif text-3xl text-resort-cocoa mb-8">Send an Enquiry</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa"
                        placeholder="+63 900 000 0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="contactMethod" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                        Preferred Contact
                      </label>
                      <select
                        id="contactMethod"
                        className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa"
                      >
                        <option>Phone Call</option>
                        <option>WhatsApp</option>
                        <option>Facebook</option>
                        <option>Email</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="enquiryType" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                      Enquiry Type
                    </label>
                    <select
                      id="enquiryType"
                      className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa"
                    >
                      <option>Room Reservations</option>
                      <option>Restaurant</option>
                      <option>Events & Gatherings</option>
                      <option>Activities</option>
                      <option>General Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-resort-cocoa mb-2 uppercase tracking-wider text-xs">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded bg-resort-white border border-resort-cocoa/10 focus:outline-none focus:ring-1 focus:ring-resort-terracotta text-resort-cocoa resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="w-full px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-cocoa transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-md mt-4"
                  >
                    Send Enquiry
                  </button>
                  <p className="text-center text-xs text-resort-cocoa/50 mt-4">
                    We process your enquiry based on the details you choose to share.
                  </p>
                </form>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-20 bg-resort-sand">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-resort-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-8 h-8 text-resort-olive mx-auto mb-4" />
                <h3 className="font-serif text-xl text-resort-cocoa mb-2">Reservations</h3>
                <p className="text-resort-cocoa/70 text-sm mb-4">Call or message directly</p>
                <a
                  href={sitePhoneHref}
                  className="text-resort-terracotta text-sm font-bold tracking-wider uppercase hover:text-resort-cocoa transition-colors"
                >
                  {sitePhone}
                </a>
              </div>
              <div className="bg-resort-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-8 h-8 text-resort-olive mx-auto mb-4" />
                <h3 className="font-serif text-xl text-resort-cocoa mb-2">WhatsApp</h3>
                <p className="text-resort-cocoa/70 text-sm mb-4">Fast mobile enquiries</p>
                <a
                  href={siteWhatsappHref}
                  className="text-resort-terracotta text-sm font-bold tracking-wider uppercase hover:text-resort-cocoa transition-colors"
                >
                  Message
                </a>
              </div>
              <div className="bg-resort-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-8 h-8 text-resort-olive mx-auto mb-4" />
                <h3 className="font-serif text-xl text-resort-cocoa mb-2">Facebook</h3>
                <p className="text-resort-cocoa/70 text-sm mb-4">Official resort page</p>
                <a
                  href={siteFacebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-resort-terracotta text-sm font-bold tracking-wider uppercase hover:text-resort-cocoa transition-colors"
                >
                  Open Page
                </a>
              </div>
              <div className="bg-resort-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="w-8 h-8 text-resort-olive mx-auto mb-4" />
                <h3 className="font-serif text-xl text-resort-cocoa mb-2">Directions</h3>
                <p className="text-resort-cocoa/70 text-sm mb-4">Find the resort on Google Maps</p>
                <a
                  href={siteMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-resort-terracotta text-sm font-bold tracking-wider uppercase hover:text-resort-cocoa transition-colors"
                >
                  Open Map
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-offwhite border-t border-resort-cocoa/5">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                  LOCATION
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa mb-6">Find your way to Piero.</h2>
                <p className="text-resort-cocoa/80 text-lg leading-relaxed mb-8">
                  Use the official map link, follow the driving route from NLEX and SCTEX, or ride onward to Cabangan Terminal and take a tricycle to the resort.
                </p>

                <div className="bg-resort-white p-8 rounded-xl border border-resort-cocoa/10 mb-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-resort-terracotta flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-resort-cocoa mb-2">Resort Address</h4>
                      <p className="text-resort-cocoa/70 leading-relaxed">{resort.address.full}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-resort-cocoa mb-2">By car</h4>
                    <p className="text-resort-cocoa/70">{resort.directions.byCar}</p>
                    <p className="text-resort-cocoa/70">{resort.directions.byCarTravelTime}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-resort-cocoa mb-2">By public transport</h4>
                    <p className="text-resort-cocoa/70">{resort.directions.byPublicTransport}</p>
                    <p className="text-resort-cocoa/70">{resort.directions.byPublicTransportTravelTime}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-resort-cocoa mb-2">Resort transfer</h4>
                    <p className="text-resort-cocoa/70">{resort.directions.transfer}</p>
                  </div>
                </div>

                <a
                  href={siteMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-resort-terracotta text-resort-white hover:bg-resort-cocoa transition-colors text-sm font-bold tracking-widest uppercase rounded shadow-lg"
                >
                  Get Directions
                </a>
              </div>

              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-resort-cocoa/10">
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
              </div>
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-white">
          <Reveal className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-16">
              <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-6">
                COMMON QUESTIONS
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-resort-cocoa">Frequently Asked Questions</h2>
            </div>

            <div className="mb-10 bg-resort-sand/30 border border-resort-cocoa/10 p-6 rounded-xl text-sm text-resort-cocoa/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookingReminderList.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-resort-offwhite rounded-lg border border-resort-cocoa/5 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer text-resort-cocoa font-serif text-xl hover:bg-resort-sand/30 transition-colors">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 text-resort-terracotta transition-transform group-open:-rotate-180 flex-shrink-0 ml-4" />
                  </summary>
                  <div className="p-6 pt-0 text-resort-cocoa/70 leading-relaxed border-t border-resort-cocoa/5">
                    <p className="mt-4">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="py-24 bg-resort-olive text-center text-resort-white">
          <Reveal className="container mx-auto px-4">
            <h2 className="font-serif text-4xl md:text-5xl mb-10">Your beach escape is closer than you think.</h2>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center px-10 py-5 bg-resort-white text-resort-olive hover:bg-resort-cocoa hover:text-resort-white transition-colors font-semibold tracking-widest uppercase text-sm rounded shadow-lg"
            >
              Explore Rooms &amp; Villas
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
