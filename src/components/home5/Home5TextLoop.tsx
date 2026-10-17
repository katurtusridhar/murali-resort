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
  return (
    <section 
      aria-label="Venue Highlights and Celebrations Loop"
      className="relative w-full bg-[#FBF9F5] py-10 sm:py-14 overflow-hidden border-y border-stone-200/60 select-none"
    >
      {/* Left and Right Edge Vignette Fades for Seamless Soft Bleed */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#FBF9F5] via-[#FBF9F5]/60 to-transparent z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#FBF9F5] via-[#FBF9F5]/60 to-transparent z-10" />

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
                  <span role="presentation" aria-hidden="true" className="text-[#8A622A] mx-6 sm:mx-9 text-sm sm:text-base select-none">
                    ✦
                  </span>
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
                  <span role="presentation" aria-hidden="true" className="text-[#8A622A] mx-6 sm:mx-9 text-sm sm:text-base select-none">
                    ✦
                  </span>
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
                  <span role="presentation" aria-hidden="true" className="text-[#8A622A] mx-6 sm:mx-9 text-xs sm:text-sm select-none">
                    ✦
                  </span>
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
                  <span role="presentation" aria-hidden="true" className="text-[#8A622A] mx-6 sm:mx-9 text-xs sm:text-sm select-none">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
