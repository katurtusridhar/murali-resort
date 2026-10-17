"use client";

import React from "react";

const spacesTrack = [
  "The Grand Convention Hall",
  "Column-Free Architectural Grandeur",
  "800-Guest Banquet Seating",
  "Manicured Event Lawns & Meadows",
  "Executive Guest Accommodations",
  "Acoustically Treated Interiors",
  "Crystal Chandelier Illumination",
  "Pre-Function Banquet Foyers",
  "Dedicated Hospitality Concierge",
  "On-Site Private VIP Suites",
];

const momentsTrack = [
  "Royal Wedding Celebrations",
  "Traditional Mandap Ceremonies",
  "Twilight Open-Air Receptions",
  "High-Impact Corporate Summits",
  "Sangeet & Cocktail Galas",
  "Bespoke Floral Artistry",
  "Exquisite Culinary Banquets",
  "Timeless Milestone Memories",
  "Executive Keynote Assemblies",
  "Unforgettable Celebrations",
];

export default function Home5TextLoop() {
  const StarSeparator = ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }: { className?: string }) => (
    <svg 
      aria-hidden="true" 
      focusable="false" 
      viewBox="0 0 24 24" 
      className={`${className} fill-[#8A622A] mx-6 sm:mx-9 shrink-0 select-none`}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );

  return (
    <section 
      aria-label="Venue Highlights and Celebrations Loop"
      className="relative w-full bg-[#FBF9F5] py-10 sm:py-14 overflow-hidden border-y border-stone-200/60 select-none"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)"
      }}
    >
      <div className="flex flex-col gap-5 sm:gap-7 relative z-0">
        
        {/* Track 1: Curated Spaces (Scrolling Left) */}
        <div className="overflow-hidden w-full flex items-center">
          <div className="animate-text-loop-left flex items-center whitespace-nowrap">
            {/* Set 1 */}
            <div className="flex items-center shrink-0">
              {spacesTrack.map((item, idx) => (
                <div key={`s1-${idx}`} className="flex items-center">
                  <span 
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#14171A] font-normal tracking-tight hover:text-[#8A622A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item}
                  </span>
                  <StarSeparator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              ))}
            </div>

            {/* Set 2 (Exact Duplicate for Gapless 100% Loop) */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              {spacesTrack.map((item, idx) => (
                <div key={`s2-${idx}`} className="flex items-center">
                  <span 
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#14171A] font-normal tracking-tight hover:text-[#8A622A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item}
                  </span>
                  <StarSeparator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Track 2: Celebration Moments (Scrolling Right) */}
        <div className="overflow-hidden w-full flex items-center">
          <div className="animate-text-loop-right flex items-center whitespace-nowrap">
            {/* Set 1 */}
            <div className="flex items-center shrink-0">
              {momentsTrack.map((item, idx) => (
                <div key={`m1-${idx}`} className="flex items-center">
                  <span 
                    className="font-serif italic text-lg sm:text-2xl lg:text-3xl text-[#14171A] font-normal tracking-normal hover:text-[#8A622A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item}
                  </span>
                  <StarSeparator className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              ))}
            </div>

            {/* Set 2 (Exact Duplicate for Gapless 100% Loop) */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              {momentsTrack.map((item, idx) => (
                <div key={`m2-${idx}`} className="flex items-center">
                  <span 
                    className="font-serif italic text-lg sm:text-2xl lg:text-3xl text-[#14171A] font-normal tracking-normal hover:text-[#8A622A] transition-colors duration-200"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item}
                  </span>
                  <StarSeparator className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
