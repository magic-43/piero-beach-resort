"use client";

import { resort } from "@/data/resort";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);

  const mainLinks = [
    { label: "Home", href: "/" },
    { label: "Rooms & Villas", href: "/rooms" },
  ];

  const exploreLinks = [
    { label: "Restaurants", href: "/restaurants", desc: "Coastal beachfront dining" },
    { label: "Events", href: "/events", desc: "Weddings, retreats & celebrations" },
    { label: "Activities", href: "/activities", desc: "Watersports, beach volleyball & island tours" },
  ];

  const remainingLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed w-full z-50 transition-all duration-300 bg-resort-offwhite/90 backdrop-blur-md text-resort-cocoa border-b border-resort-cocoa/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Logo className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-8 items-center">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide hover:text-resort-terracotta transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Combined explore dropdown */}
            <div 
              className="relative py-4"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                type="button"
                className="text-sm font-medium tracking-wide hover:text-resort-terracotta transition-colors duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Explore the Resort
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isDropdownOpen ? 'rotate-180 text-resort-terracotta' : ''}`} />
              </button>
                             {isDropdownOpen && (
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-1 w-[380px] bg-resort-offwhite text-resort-cocoa shadow-2xl rounded-lg overflow-hidden border border-resort-cocoa/10 z-50">
                  <div className="flex flex-col">
                    {exploreLinks.map((link) => (
                      <Link 
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-6 hover:bg-resort-sand/50 transition-colors border-b border-resort-cocoa/5 last:border-0 flex flex-col group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-serif text-lg text-resort-cocoa group-hover:text-resort-terracotta transition-colors mb-1">
                              {link.label}
                            </span>
                            <span className="text-xs text-resort-cocoa/60">
                              {link.desc}
                            </span>
                          </div>
                          <div className="w-5 h-[1px] bg-resort-terracotta opacity-50 group-hover:opacity-100 transition-opacity shrink-0 ml-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {remainingLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide hover:text-resort-terracotta transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              href="/reserve"
              className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-resort-terracotta text-resort-white hover:bg-resort-cocoa transition-colors duration-300 text-sm font-medium tracking-wide rounded"
            >
              Reserve
            </Link>
            
            <button
              type="button"
              className="xl:hidden p-2 text-resort-cocoa hover:text-resort-terracotta transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Menu className="h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-resort-white border-t border-resort-cocoa/10 shadow-xl absolute w-full left-0">
          <div className="px-6 pt-4 pb-8 space-y-2">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-3 text-lg font-serif text-resort-cocoa hover:text-resort-terracotta border-b border-resort-cocoa/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Collapsible Mobile Explore */}
            <div className="border-b border-resort-cocoa/5">
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-lg font-serif text-resort-cocoa hover:text-resort-terracotta focus:outline-none"
                onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
              >
                <span>Explore the Resort</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMobileExploreOpen && (
                <div className="pl-4 pb-2 space-y-2">
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block py-2 text-base text-resort-cocoa/80 hover:text-resort-terracotta font-serif"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileExploreOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {remainingLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-3 text-lg font-serif text-resort-cocoa hover:text-resort-terracotta border-b border-resort-cocoa/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-6 pb-2">
              <Link
                href="/reserve"
                className="block w-full text-center px-6 py-4 bg-resort-terracotta text-resort-white tracking-wide text-base font-medium rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reserve Your Stay
              </Link>
            </div>
            
            <div className="flex flex-col space-y-4 pt-6 text-resort-olive text-sm font-medium">
              <a href={resort.contact.phoneHref} className="flex items-center space-x-3 hover:text-resort-terracotta">
                <Phone className="h-5 w-5" />
                <span>{resort.contact.phone}</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>{resort.address.short}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
