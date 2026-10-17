"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Footer({ transparent = false }: { transparent?: boolean }) {
  return (
    <footer className={`relative ${transparent ? "bg-transparent text-stone-300 border-t border-white/10" : "bg-premium-dark text-stone-300 border-t border-stone-800"} py-14 sm:py-16 md:py-24`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-5 sm:gap-6">
          <div className="text-2xl sm:text-3xl font-serif text-white">Murali Resort</div>
          <p className="text-sm leading-relaxed max-w-sm font-light">
            A premium destination for weddings, celebrations, corporate events, and unforgettable gatherings.
          </p>
        </div>

        {/* Navigation */}
        <div className="col-span-1">
          <h3 className="text-white uppercase tracking-wider text-xs font-semibold mb-4 sm:mb-6">Explore</h3>
          <ul className="space-y-3 sm:space-y-4 text-sm font-light">
            <li><Link href="/celebrations" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors inline-block py-1">Celebrations</Link></li>
            <li><Link href="/facilities" className="hover:text-accent transition-colors inline-block py-1">Facilities</Link></li>
            <li><Link href="/gallery" className="hover:text-accent transition-colors inline-block py-1">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors inline-block py-1">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h3 className="text-white uppercase tracking-wider text-xs font-semibold mb-4 sm:mb-6">Contact</h3>
          <ul className="space-y-4 text-sm font-light">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <span>Survey No - 134, Poranki-Nidamanuru, Vijayawada, AP 521137</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-accent" />
              <a href="tel:+919502507999" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center">+91 9502507999</a>
            </li>
            <li className="flex items-center gap-3">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
              <a 
                href="https://wa.me/919502507999?text=Hello%20Murali%20Resort,%20I%20would%20like%20to%20enquire%20about%20booking%20an%20event." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#25D366] transition-colors min-h-[36px] inline-flex items-center"
              >
                +91 9502507999
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-accent" />
              <span>info@muraliresort.com</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="col-span-1 flex flex-col items-start">
          <h3 className="text-white uppercase tracking-wider text-xs font-semibold mb-4 sm:mb-6 text-left">Ready to plan?</h3>
          <Link
            href="/contact"
            className="w-full sm:w-auto min-h-[44px] px-8 py-3 bg-white text-premium-dark font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-stone-200 transition-all duration-300 inline-flex items-center justify-center text-center shadow-sm"
          >
            Enquire Now
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-12 sm:mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400 text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Murali Resort. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center py-1">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors min-h-[36px] inline-flex items-center py-1">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
