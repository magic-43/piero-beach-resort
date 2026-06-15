import { MessageCircle } from "lucide-react";
import { resort } from "@/data/resort";
import { ChatbotWidget } from "@/components/layout/chatbot-widget";

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-row md:flex-col space-x-3 md:space-x-0 space-y-0 md:space-y-4 items-end">
      <a 
        href={resort.contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 focus:outline-none"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      </a>
      <ChatbotWidget />
    </div>
  );
}
