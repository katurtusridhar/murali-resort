"use client";

import Link from "next/link";
import { Phone, ArrowRight, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function Home5CTA() {
  return (
    <section id="enquire" className="relative bg-transparent py-16 md:py-24 text-white overflow-hidden">
      {/* Ambient Glow */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl relative z-10 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
          <Sparkles size={13} className="text-[#C5A880]" />
          <span className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
            Reservations & Enquiries
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6 max-w-3xl">
          Plan Your Event at <br className="hidden sm:inline" />
          <span className="italic font-normal text-stone-300">Murali Resort.</span>
        </h2>

        <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mb-12">
          Talk to our team to check open dates, discuss hall setups, and plan catering or guest rooms.
        </p>

        {/* 3 Real, Verified Contact Pathways */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
          {/* 1. Primary Online Form */}
          <Link
            href="/contact"
            className="w-full sm:w-auto btn-primary-light"
          >
            <span>Enquiry Now</span>
            <ArrowRight size={14} />
          </Link>

          {/* 2. Direct Verified WhatsApp */}
          <a
            href="https://wa.me/919502507999?text=Hello%20Murali%20Resort,%20I%20would%20like%20to%20enquire%20about%20booking%20an%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto btn-outline-light"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* 3. Direct Phone Call */}
          <a
            href="tel:+919502507999"
            className="w-full sm:w-auto btn-outline-light"
          >
            <Phone size={14} className="text-white" />
            <span>9502507999</span>
          </a>
        </div>

      </div>
    </section>
  );
}
