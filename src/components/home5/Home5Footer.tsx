"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Navigation, ExternalLink } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Home5Footer() {
  return (
    <footer className="relative bg-transparent text-stone-300 py-16 md:py-20 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-14 md:mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Murali Resort Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg tracking-[0.14em] text-white uppercase font-normal">
                Murali Resort
              </span>
            </Link>

            <p className="text-sm text-stone-300 font-light leading-relaxed max-w-md mb-6">
              A premier venue for weddings, family parties, and corporate events in Vijayawada. We offer an indoor hall for 800 seated guests, open lawns, and on-site guest rooms.
            </p>

            <span className="text-xs text-[#C5A880] uppercase tracking-[0.2em] font-medium">
              Poranki, Vijayawada • Andhra Pradesh
            </span>
          </div>

          {/* Quick Section Links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-6 tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#overview" className="hover:text-white transition-colors inline-block py-1">The Venue Overview</a></li>
              <li><a href="#spaces" className="hover:text-white transition-colors inline-block py-1">Convention Hall & Lawns</a></li>
              <li><a href="#moments" className="hover:text-white transition-colors inline-block py-1">Celebration Moments</a></li>
              <li><a href="#location" className="hover:text-white transition-colors inline-block py-1">Location & Connectivity</a></li>
              <li><Link href="/facilities" className="hover:text-white transition-colors inline-block py-1">Facilities</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors inline-block py-1">Photo Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors inline-block py-1">Contact Us</Link></li>
            </ul>
          </div>

          {/* Verified Contact & Address */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold text-white mb-6 tracking-wide">
              Contact & Location
            </h3>
            
            <div className="space-y-4 text-sm font-light">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C5A880] mt-1 shrink-0" />
                <span className="text-stone-300">
                  Survey No - 134, Poranki-Nidamanuru Road, Poranki, Vijayawada, AP 521137
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C5A880] shrink-0" />
                <div className="flex flex-col gap-1">
                  <a 
                    href="tel:+919502507999" 
                    className="inline-flex items-center min-h-[36px] text-stone-300 hover:text-white transition-colors font-medium"
                  >
                    +91 9502507999
                  </a>
                  <a 
                    href="tel:+919440883636" 
                    className="inline-flex items-center min-h-[36px] text-stone-300 hover:text-white transition-colors text-xs"
                  >
                    +91 9440883636
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <a 
                  href="https://wa.me/919502507999?text=Hello%20Murali%20Resort,%20I%20would%20like%20to%20enquire%20about%20booking%20an%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 min-h-[44px] text-stone-300 hover:text-[#25D366] transition-colors group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0 group-hover:scale-105 transition-transform" />
                  <span>WhatsApp: +91 9502507999</span>
                </a>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] text-xs uppercase tracking-wider font-semibold text-[#C5A880] hover:text-white transition-colors"
                >
                  <Navigation size={13} />
                  <span>Google Maps Pin</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Murali Resort. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/facilities" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center py-1">Facilities</Link>
            <Link href="/gallery" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center py-1">Gallery</Link>
            <Link href="/contact" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center py-1">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
