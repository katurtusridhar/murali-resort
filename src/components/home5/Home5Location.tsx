"use client";

import Link from "next/link";
import { MapPin, Navigation, Compass, ExternalLink } from "lucide-react";

export default function Home5Location() {
  return (
    <section id="location" className="bg-transparent py-16 sm:py-24 md:py-36 text-stone-900 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Location Narrative */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#8A622A]" />
              <span className="text-[#8A622A] uppercase tracking-[0.22em] text-xs font-semibold">
                Connectivity & Arrival
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14171A] tracking-tight leading-[1.15] mb-6">
              Accessible Location, Seamless Arrival.
            </h2>

            <p className="text-[#525A62] text-base sm:text-lg font-light leading-relaxed mb-8 max-w-[62ch]">
              Murali Resort is on Poranki Road in Vijayawada, with easy highway access. A wide circular driveway lets your guests arrive and leave smoothly.
            </p>

            {/* Address & Verified Coordinates Card */}
            <div className="w-full bg-white rounded-2xl p-5 sm:p-8 border border-stone-200/90 shadow-sm mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#8A622A]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={20} className="text-[#8A622A]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#14171A] font-semibold mb-1">
                    Murali Resort & Convention Center
                  </h3>
                  <p className="text-sm text-[#525A62] leading-relaxed">
                    Survey No - 134, Poranki-Nidamanuru Road,<br />
                    Poranki, Vijayawada, Andhra Pradesh 521137
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-stone-100">
                <a
                  href="https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] py-2 text-xs uppercase tracking-wider font-semibold text-[#14171A] hover:text-[#8A622A] transition-colors"
                >
                  <Navigation size={14} className="text-[#8A622A]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>

                <span className="hidden sm:inline text-stone-300">|</span>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 min-h-[44px] py-2 text-xs uppercase tracking-wider font-semibold text-[#14171A] hover:text-[#8A622A] transition-colors"
                >
                  <Compass size={14} className="text-[#8A622A]" />
                  <span>Calculate Live Route</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Key Logistics Highlights */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm">
              <h3 className="font-serif text-lg text-[#14171A] mb-2 font-semibold">Direct Highway Access</h3>
              <p className="text-sm text-[#525A62] font-light leading-relaxed">
                Direct access from Poranki Road links you quickly to the city center and main highways.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm">
              <h3 className="font-serif text-lg text-[#14171A] mb-2 font-semibold">Dedicated Circular Drop-Off</h3>
              <p className="text-sm text-[#525A62] font-light leading-relaxed">
                A covered porch and circular driveway let guests drive right up to the main hall with no traffic delays.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm">
              <h3 className="font-serif text-lg text-[#14171A] mb-2 font-semibold">Event Staging Logistics</h3>
              <p className="text-sm text-[#525A62] font-light leading-relaxed">
                Separate service gates keep catering and decor teams away from guests, so events run quietly and smoothly.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
