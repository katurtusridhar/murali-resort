"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Briefcase, Trees, BedDouble, Check, ArrowRight, ArrowUpRight } from "lucide-react";
import BorderGlow from "@/components/ui/BorderGlow";
import { CometCard } from "@/components/ui/comet-card";

interface SpaceItem {
  id: string;
  tabLabel: string;
  icon: typeof Building2;
  title: string;
  tagline: string;
  capacityHighlight: string;
  image: string;
  description: string;
  verifiedFeatures: string[];
  ctaText: string;
  ctaHref: string;
}

const spacesData: SpaceItem[] = [
  {
    id: "hall",
    tabLabel: "Grand Convention Hall",
    icon: Building2,
    title: "The Grand Convention Hall",
    tagline: "Indoor Grandeur",
    capacityHighlight: "Up to 800 Guests",
    image: "/images/gallery/venue-img-2.png",
    description:
      "A spacious indoor hall with clear views, crystal lighting, and quality sound. Perfect for banquets and large meetings.",
    verifiedFeatures: [
      "800-guest modular seating",
      "Column-free interior layout",
      "Acoustically treated walls",
      "Crystal chandelier illumination"
    ],
    ctaText: "Enquire Now",
    ctaHref: "/contact"
  },
  {
    id: "corporate",
    tabLabel: "Corporate Events",
    icon: Briefcase,
    title: "Corporate Summits & Conventions",
    tagline: "Corporate Infrastructure",
    capacityHighlight: "Equipped for 1,000+ Delegates",
    image: "/images/home5/corporate-events.jpg",
    description:
      "High-tech summit venue with panoramic LED stage displays, line-array acoustics, and dedicated AV production control.",
    verifiedFeatures: [
      "Panoramic ultra-wide LED stage",
      "Multi-zone line-array acoustics",
      "Dedicated AV control & Wi-Fi",
      "Pre-function networking foyer"
    ],
    ctaText: "Plan Summit",
    ctaHref: "/contact"
  },
  {
    id: "lawns",
    tabLabel: "Landscaped Event Lawns",
    icon: Trees,
    title: "The Landscaped Event Lawns",
    tagline: "Open-Air Grandeur",
    capacityHighlight: "Expansive Open-Air Grounds",
    image: "/images/gallery/venue-img-4.png",
    description:
      "Manicured lawn framed by palms and ambient illumination, ideal for starlit banquets and grand celebrations.",
    verifiedFeatures: [
      "Manicured open-air lawn grounds",
      "Integrated evening mood lighting",
      "Dedicated outdoor staging",
      "Spacious catering perimeter"
    ],
    ctaText: "Enquire Now",
    ctaHref: "/contact"
  },
  {
    id: "suites",
    tabLabel: "Guest Accommodations",
    icon: BedDouble,
    title: "Executive Guest Accommodations",
    tagline: "On-Site Hospitality",
    capacityHighlight: "Luxury On-Site Suites",
    image: "/images/bedroom.jpg",
    description:
      "Serene suites providing refined comfort, privacy, and dedicated hospitality for hosts and VIP guests.",
    verifiedFeatures: [
      "On-site suites for hosts & VIPs",
      "Refined contemporary interiors",
      "Dedicated hospitality concierge",
      "Direct walking access to venues"
    ],
    ctaText: "View Suites",
    ctaHref: "/accommodations"
  }
];

export default function Home5Spaces() {
  const [activeTab, setActiveTab] = useState<string>("hall");

  const currentSpace = spacesData.find((s) => s.id === activeTab) || spacesData[0];

  return (
    <section id="spaces" className="bg-transparent py-28 md:py-36 text-stone-900 relative z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Section Heading */}
        <div className="flex flex-col items-start max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#8A622A]" />
            <span className="text-[#8A622A] uppercase tracking-[0.22em] text-xs font-semibold">
              Curated Spaces
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14171A] tracking-tight leading-[1.15] mb-4">
            Tailored Venues for Every Occasion.
          </h2>
          <p className="text-[#525A62] text-base sm:text-lg font-light leading-relaxed">
            Find the right space for your wedding, business conference, or relaxing stay.
          </p>
        </div>

        {/* Tab Controls (Accessible Tablist) */}
        <div className="w-full overflow-x-auto pb-3 -mb-3 sm:overflow-visible mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 bg-stone-200/80 rounded-full min-w-max">
            <div 
              role="tablist" 
              aria-label="Venue Spaces Selection"
              className="inline-flex items-center gap-1.5 sm:gap-2"
            >
              {spacesData.map((space) => {
                const Icon = space.icon;
                const isActive = activeTab === space.id;
                return (
                  <button
                    key={space.id}
                    role="tab"
                    id={`tab-${space.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${space.id}`}
                    onClick={() => setActiveTab(space.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 shrink-0 whitespace-nowrap ${
                      isActive
                        ? "bg-white text-[#14171A] shadow-md"
                        : "text-[#525A62] hover:text-[#14171A] hover:bg-white/40"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-[#8A622A]" : "text-[#525A62]"} />
                    <span>{space.tabLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* More Option -> Redirects to /facilities (Placed outside role=tablist to satisfy WCAG 1.3.1) */}
            <Link
              href="/facilities"
              id="tab-more"
              aria-label="View all resort spaces and facilities"
              className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold text-[#525A62] hover:text-[#14171A] hover:bg-white/60 transition-all duration-300 group shrink-0 whitespace-nowrap"
            >
              <span>View All Spaces</span>
              <ArrowUpRight size={13} className="text-[#8A622A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Tab Content Panel with BorderGlow effect */}
        <BorderGlow
          edgeSensitivity={25}
          glowColor="36 75 60"
          backgroundColor="#ffffff"
          borderRadius={16}
          glowRadius={36}
          glowIntensity={1.2}
          coneSpread={30}
          animated={true}
          colors={['#C5A880', '#E5D4BE', '#9B7A4F']}
          fillOpacity={0.4}
          className="relative z-20 w-full p-4 sm:p-8 lg:p-12 block"
          role="tabpanel"
          id={`panel-${currentSpace.id}`}
          aria-labelledby={`tab-${currentSpace.id}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSpace.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 bg-white rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
            >
              {/* Left Column: Space Narrative & Features */}
              <div className="lg:col-span-6 flex flex-col items-start order-2 lg:order-1">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8A622A] mb-2">
                  {currentSpace.tagline}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#14171A] mb-3">
                  {currentSpace.title}
                </h3>

                <div className="inline-block px-3 py-1 bg-stone-100/90 border border-stone-200/60 rounded-full text-xs font-medium text-[#525A62] tracking-wide uppercase mb-5">
                  {currentSpace.capacityHighlight}
                </div>

                <p className="text-[#525A62] text-sm sm:text-base font-light leading-relaxed mb-6">
                  {currentSpace.description}
                </p>

                {/* Verified Bullet Points */}
                <div className="space-y-2.5 mb-8 w-full">
                  {currentSpace.verifiedFeatures.map((feat) => (
                    <div key={feat} className="flex items-center gap-3 text-xs sm:text-sm text-[#14171A]">
                      <div className="w-5 h-5 rounded-full bg-[#C5A880]/15 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-[#8A622A]" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <Link
                  href={currentSpace.ctaHref}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#14171A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors shadow-md group w-full sm:w-auto min-h-[44px]"
                >
                  <span>{currentSpace.ctaText}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right Column: High-Res Verified Space Photo with Comet Effect */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <CometCard
                  rotateDepth={14}
                  translateDepth={15}
                  className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border border-stone-200">
                    <Image
                      src={currentSpace.image}
                      alt={currentSpace.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={90}
                      className="object-cover object-center"
                    />
                  </div>
                </CometCard>
              </div>
            </motion.div>
          </AnimatePresence>
        </BorderGlow>

      </div>
    </section>
  );
}
