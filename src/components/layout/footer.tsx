"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { resort } from "@/data/resort";
import { FacebookIcon, WhatsappIcon } from "@/components/ui/icons";

import { createClient } from "@/lib/supabase/client";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("resort_settings").select("*").eq("id", 1).single();
        if (data) setSettings(data);
      } catch (err) {
        console.error("Failed to load settings in footer:", err);
      }
    };
    fetchSettings();
  }, []);

  const siteEmail = settings?.site_email || resort.contact.email;
  const siteEmailHref = settings?.site_email ? `mailto:${settings.site_email}` : resort.contact.emailHref;
  const sitePhone = settings?.site_phone || resort.contact.phone;
  const sitePhoneHref = settings?.site_phone ? `tel:${settings.site_phone.replace(/[^0-9+]/g, '')}` : resort.contact.phoneHref;
  const siteWhatsapp = settings?.site_whatsapp || resort.contact.whatsapp;
  const siteWhatsappHref = settings?.site_whatsapp ? `https://wa.me/${settings.site_whatsapp.replace(/[^0-9+]/g, '')}` : resort.contact.whatsappHref;
  const siteFacebookHref = settings?.site_facebook || resort.contact.facebookHref;
  const siteMapsHref = settings?.site_google_maps || resort.contact.mapsHref;
  return (
    <footer className="bg-resort-sand text-resort-cocoa pt-20 pb-10 border-t border-resort-cocoa/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo className="h-20 w-20 rounded-full" />
            </Link>
            <p className="text-base leading-relaxed text-resort-cocoa/80">
              A slower kind of escape. Reconnect with nature and find your rhythm on the serene shores of {resort.address.short}.
            </p>
            <div className="flex space-x-5">
              <a href={siteFacebookHref} target="_blank" rel="noopener noreferrer" className="text-resort-olive hover:text-resort-terracotta transition-colors text-sm font-semibold tracking-wider">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-resort-olive">Explore</h3>
            <ul className="space-y-4 text-base font-medium">
              <li><Link href="/about" className="hover:text-resort-terracotta transition-colors">Our Resort</Link></li>
              <li><Link href="/rooms" className="hover:text-resort-terracotta transition-colors">Rooms & Villas</Link></li>
              <li><Link href="/restaurants" className="hover:text-resort-terracotta transition-colors">Dining</Link></li>
              <li><Link href="/activities" className="hover:text-resort-terracotta transition-colors">Experiences</Link></li>
              <li><Link href="/events" className="hover:text-resort-terracotta transition-colors">Events & Weddings</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-resort-olive">Information</h3>
            <ul className="space-y-4 text-base font-medium">
              <li><Link href="/contact" className="hover:text-resort-terracotta transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-resort-terracotta transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-resort-terracotta transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-xl mb-6 text-resort-olive">Get in Touch</h3>
            <ul className="space-y-5 text-base text-resort-cocoa/90">
              <li className="flex items-start space-x-4">
                <a href={siteMapsHref} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 hover:text-resort-terracotta transition-colors w-full">
                  <MapPin className="w-5 h-5 text-resort-terracotta shrink-0 mt-1" />
                  <span className="leading-relaxed">{resort.address.line1}<br />{resort.address.line2}</span>
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <a href={sitePhoneHref} className="flex items-center space-x-4 hover:text-resort-terracotta transition-colors w-full">
                  <Phone className="w-5 h-5 text-resort-terracotta shrink-0" />
                  <span>{sitePhone}</span>
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <a href={siteEmailHref} className="flex items-center space-x-4 hover:text-resort-terracotta transition-colors w-full">
                  <Mail className="w-5 h-5 text-resort-terracotta shrink-0" />
                  <span>{siteEmail}</span>
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <a href={siteWhatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 hover:text-resort-terracotta transition-colors w-full">
                  <WhatsappIcon className="w-5 h-5 text-resort-terracotta shrink-0" />
                  <span>{siteWhatsapp}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-resort-cocoa/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-resort-cocoa/60 font-medium">
          <p>&copy; {new Date().getFullYear()} Piero Beach Resort.</p>
          <p>A Tropical Escape</p>
        </div>
      </div>
    </footer>
  );
}
