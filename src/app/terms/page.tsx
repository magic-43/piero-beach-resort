import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort } from "@/data/resort";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBookingReminderList, getDynamicTermsSections } from "@/lib/booking-settings";

export const metadata = {
  title: "Terms & Conditions | Piero Beach Resort",
  description: "Read the booking and stay terms for Piero Beach Resort in Cabangan, Zambales.",
};

export default async function TermsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("resort_settings").select("*").eq("id", 1).single();
  const bookingReminderList = getBookingReminderList(settings);
  const termsSections = getDynamicTermsSections(settings);
  return (
    <>
      <Header />

      <main className="flex-1 bg-resort-offwhite pt-32 pb-24 md:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-4">
              LEGAL INFORMATION
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-resort-cocoa mb-6 leading-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-resort-cocoa/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Please review the editable resort policies used for reservations, arrivals, and guest stays.
            </p>
            <div className="w-16 h-[2px] bg-resort-terracotta/40 mx-auto mt-8" />
          </div>

          <div className="bg-resort-white rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm border border-resort-cocoa/5 space-y-12">
            <p className="text-resort-cocoa/80 leading-relaxed text-sm md:text-base border-b border-resort-cocoa/10 pb-6">
              Welcome to {resort.name}. By making a reservation or staying at the property, guests agree to the following standard policy wording, which is intended to remain easy to update later from one central settings source.
            </p>

            <div className="bg-resort-sand/30 border border-resort-cocoa/10 rounded-xl p-6">
              <h2 className="font-serif text-2xl text-resort-cocoa mb-4">Booking Reminders</h2>
              <div className="space-y-3 text-resort-cocoa/80">
                {bookingReminderList.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              {termsSections.map((section) => (
                <div key={section.title} className="group">
                  <h2 className="font-serif text-2xl text-resort-cocoa mb-4 group-hover:text-resort-terracotta transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-resort-cocoa/80 leading-relaxed text-base">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-resort-cocoa/10 pt-10">
              <h2 className="font-serif text-2xl text-resort-cocoa mb-4">Standard Booking Policy Copy</h2>
              <div className="space-y-3 text-resort-cocoa/80">
                {resort.bookingPolicy.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-resort-cocoa/10 pt-10">
              <h2 className="font-serif text-2xl text-resort-cocoa mb-4">Pet Policy</h2>
              <div className="space-y-3 text-resort-cocoa/80">
                {resort.petPolicy.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-resort-cocoa/10 pt-10">
              <h2 className="font-serif text-2xl text-resort-cocoa mb-4">Grilling Policy</h2>
              <div className="space-y-3 text-resort-cocoa/80">
                {resort.restaurant.grillingPolicy.map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-resort-terracotta shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-resort-cocoa/10 pt-10 mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-center sm:text-left text-xs text-resort-cocoa/60 font-medium">
                Have questions regarding our terms?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  id="terms-contact-btn"
                  href="/contact"
                  className="px-6 py-3 bg-resort-olive text-resort-white hover:bg-resort-cocoa transition-colors text-xs font-semibold tracking-wider uppercase rounded w-full sm:w-auto text-center"
                >
                  Contact Concierge
                </Link>
                <Link
                  id="terms-home-btn"
                  href="/"
                  className="px-6 py-3 border border-resort-cocoa/25 text-resort-cocoa hover:border-resort-terracotta hover:text-resort-terracotta transition-colors text-xs font-semibold tracking-wider uppercase rounded w-full sm:w-auto text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
