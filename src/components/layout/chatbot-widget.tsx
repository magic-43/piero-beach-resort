"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { WhatsappIcon } from "@/components/ui/icons";
import Link from "next/link";
import { useResortData } from "@/hooks/useResortData";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  button?: { text: string; link: string; external?: boolean };
};

const QUICK_REPLIES = [
  { id: "rooms", text: "Rooms and rates" },
  { id: "book", text: "How to book" },
  { id: "payment", text: "Payment options" },
  { id: "checkin", text: "Check-in time" },
  { id: "pets", text: "Pet policy" },
  { id: "restaurant", text: "Restaurant hours" },
  { id: "directions", text: "Directions" },
  { id: "whatsapp", text: "Talk on WhatsApp" },
];

export function ChatbotWidget() {
  const { bookingSettings } = useResortData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi, welcome to Piero Beach Resort. How can we help with your stay?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleQuickReply = (id: string, text: string) => {
    if (id === "whatsapp") {
      window.open("https://wa.me/639553182012", "_blank");
      return;
    }

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text }]);

    setTimeout(() => {
      const response: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: "" };

      switch (id) {
        case "rooms":
          response.text = "We have Cabin Suite, Cabin Villa, Ibiza Room, Family Room, and Cancun. Room rates are shown on the Rooms page and may display a 50% promotional rate.";
          response.button = { text: "View Rooms", link: "/rooms" };
          break;
        case "book":
          response.text = "You can reserve your stay directly on the website. Select your dates, choose a room, enter your details, then upload payment proof.";
          response.button = { text: "Reserve Now", link: "/reserve" };
          break;
        case "payment":
          response.text = "Piero Beach Resort accepts Bank Transfer and GCash. Payment details are shown during reservation.";
          break;
        case "checkin":
          response.text = `Check-in is ${bookingSettings.checkIn}. Check-out is ${bookingSettings.checkOut}.`;
          break;
        case "pets":
          response.text = "Piero Beach Resort is pet-friendly. Guests may bring up to two pets per villa. Additional pets may have a fee, and guests should bring cages.";
          break;
        case "restaurant":
          response.text = "The resort restaurant is open daily from 6:00 AM to 10:00 PM.";
          break;
        case "directions":
          response.text = "Search “Piero Beach Resort” on Google Maps or Waze. The resort is located at Sitio Talisay, Brgy. Lomboy, Cabangan, Zambales.";
          response.button = { text: "Open Map", link: "https://maps.google.com/?q=Piero+Beach+Resort", external: true };
          break;
      }

      setMessages((prev) => [...prev, response]);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: inputValue.trim() }]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "Thanks for your message. For direct assistance, please continue on WhatsApp so the resort team can help you faster.",
          button: { text: "Chat on WhatsApp", link: "https://wa.me/639553182012", external: true },
        },
      ]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`w-12 h-12 md:w-14 md:h-14 bg-resort-terracotta text-resort-white rounded-full flex items-center justify-center shadow-lg hover:bg-resort-cocoa transition-colors duration-300 focus:outline-none ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-4 right-0 w-[calc(100vw-2rem)] md:w-[380px] h-[550px] max-h-[80vh] bg-resort-offwhite rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-resort-cocoa/10 z-50 origin-bottom-right animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-resort-cocoa text-resort-white p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-resort-sand/20 flex items-center justify-center overflow-hidden border border-resort-white/10">
                <Logo className="w-6 h-6 text-resort-sand" />
              </div>
              <div>
                <h3 className="font-serif text-lg leading-tight">Piero Concierge</h3>
                <p className="text-xs text-resort-sand/80 font-medium tracking-wider uppercase">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-resort-white/80 hover:text-resort-white focus:outline-none p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-resort-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-resort-olive text-resort-white rounded-tr-sm"
                      : "bg-resort-sand/30 text-resort-cocoa rounded-tl-sm border border-resort-cocoa/5"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.button && (
                    <div className="mt-3">
                      {msg.button.external ? (
                        <a
                          href={msg.button.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-2 bg-resort-terracotta text-resort-white font-medium rounded text-xs uppercase tracking-wider hover:bg-resort-cocoa transition-colors"
                        >
                          {msg.button.link.includes("wa.me") && <WhatsappIcon className="w-4 h-4 mr-2" />}
                          {msg.button.text}
                        </a>
                      ) : (
                        <Link
                          href={msg.button.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center justify-center w-full px-4 py-2 bg-resort-terracotta text-resort-white font-medium rounded text-xs uppercase tracking-wider hover:bg-resort-cocoa transition-colors"
                        >
                          {msg.button.text}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Area (Only show if last message is from bot) */}
          {messages[messages.length - 1]?.sender === "bot" && (
            <div className="bg-resort-white px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply.id, reply.text)}
                    className="whitespace-nowrap px-4 py-2 bg-resort-sand/40 hover:bg-resort-sand/70 text-resort-cocoa border border-resort-cocoa/10 rounded-full text-xs font-medium transition-colors"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-resort-offwhite border-t border-resort-cocoa/10">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-full border border-resort-cocoa/20 bg-resort-white text-resort-cocoa text-sm focus:outline-none focus:border-resort-terracotta focus:ring-1 focus:ring-resort-terracotta"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-resort-olive text-resort-white rounded-full hover:bg-resort-cocoa transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
