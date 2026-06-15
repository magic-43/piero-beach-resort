import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { resort } from "@/data/resort";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Piero Beach Resort",
  description: "Read the Privacy Policy for guest data processing, collection, and storage at Piero Beach Resort.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "When you book a stay, send an enquiry, or interact with our website, we may collect personal information necessary to facilitate your booking and guest experience. This includes your name, email address, phone number, physical address, payment card details (processed securely via PCI-compliant gateways), booking details, and special preferences (e.g., dietary restrictions, bed styles)."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information collected primarily to secure your reservation, process your deposit payments, customize your resort experience, and communicate details about your stay. We may also use your contact details to respond to concierge enquiries, improve our services, and send optional promotional newsletters if you have consented to receive them."
    },
    {
      title: "3. Secure Reservation & Payments",
      content: "Your security is paramount to us. All online reservation details and credit card transactions are encrypted and transmitted securely. Payment card details are never stored directly on our resort servers; they are processed by trusted, certified payment gateways to ensure maximum safety and compliance."
    },
    {
      title: "4. Third-Party Sharing",
      content: "Piero Beach Resort does not sell, trade, or rent guest personal data to third parties. We share data only with trusted partners essential for operating our website and booking engine, running resort operations, or complying with legal authorities under strict confidentiality agreements."
    },
    {
      title: "5. Cookies & Site Analytics",
      content: "We use small text files called cookies to enhance your browsing experience, remember your preferences, and understand how visitors use our site. This helps us optimize load speeds and navigation layouts. You can manage or block cookies through your individual browser settings at any time."
    },
    {
      title: "6. Your Rights & Contact Details",
      content: `You have the right to request access to the personal information we hold about you, request corrections to incorrect data, or request deletion of your information (subject to tax or legal reservation requirements). To raise privacy questions, please contact the resort directly at ${resort.contact.phone} or via WhatsApp at ${resort.contact.whatsapp}.`
    }
  ];

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-resort-offwhite pt-32 pb-24 md:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header Intro */}
          <div className="text-center mb-16">
            <span className="inline-block text-resort-olive text-sm tracking-[0.2em] uppercase font-bold mb-4">
              LEGAL INFORMATION
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-resort-cocoa mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-resort-cocoa/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
              We respect your privacy and are committed to protecting the personal data you share with us.
            </p>
            <div className="w-16 h-[2px] bg-resort-terracotta/40 mx-auto mt-8" />
          </div>

          {/* Privacy Content List */}
          <div className="bg-resort-white rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm border border-resort-cocoa/5 space-y-12">
            <p className="text-resort-cocoa/80 leading-relaxed text-sm md:text-base border-b border-resort-cocoa/10 pb-6">
              This Privacy Policy explains how Piero Beach Resort collects, stores, processes, and protects your information when you visit our property or use our digital services. By continuing to use our services, you consent to the practices described below. Last updated: June 2026.
            </p>

            <div className="space-y-10">
              {sections.map((section, idx) => (
                <div key={idx} className="group">
                  <h2 className="font-serif text-2xl text-resort-cocoa mb-4 group-hover:text-resort-terracotta transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-resort-cocoa/80 leading-relaxed text-base">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Back to Home / Contact CTA */}
            <div className="border-t border-resort-cocoa/10 pt-10 mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-center sm:text-left text-xs text-resort-cocoa/60 font-medium">
                Have questions regarding your data privacy?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  id="privacy-contact-btn"
                  href="/contact"
                  className="px-6 py-3 bg-resort-olive text-resort-white hover:bg-resort-cocoa transition-colors text-xs font-semibold tracking-wider uppercase rounded w-full sm:w-auto text-center"
                >
                  Contact Concierge
                </Link>
                <Link
                  id="privacy-home-btn"
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
