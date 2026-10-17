"use client";

import { motion } from "motion/react";
import { MapPin, Users, Building2, Trees, ArrowRight } from "lucide-react";
import AccordionGallery from "@/components/ui/AccordionGallery";

const venueGalleryItems = [
  {
    image: "/images/home5/lounge.jpg",
    label: "Executive Lounge",
    alt: "Murali Resort Executive VIP Lounge & Reception",
  },
  {
    image: "/images/home5/banquet.jpg",
    label: "Pre-Function Hall",
    alt: "Murali Resort Pre-Function Banquet Hall & Chandelier",
  },
  {
    image: "/images/home5/grand-hall.jpg",
    label: "Grand Convention Hall",
    alt: "Murali Resort Grand Convention Hall & Illuminated Ceiling",
  },
  {
    image: "/images/home5/wedding-mandap.jpg",
    label: "Royal Wedding Mandap",
    alt: "Murali Resort Grand Wedding Mandap & Opulent Banquet Seating",
  },
  {
    image: "/images/home5/facade-night.jpg",
    label: "Starlit Grounds & Facade",
    alt: "Murali Resort Night Architectural Facade",
  },
];

export default function Home5Architecture() {
  return (
    <section id="overview" className="bg-transparent py-16 sm:py-24 md:py-40 text-stone-900 overflow-hidden relative z-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Accordion Gallery */}
          <div className="lg:col-span-7 order-2 lg:order-1 relative w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              className="w-full lg:-m-2 p-2 shadow-2xl rounded-2xl overflow-hidden border border-stone-200/80 bg-[#0C0F12]"
            >
              <AccordionGallery
                items={venueGalleryItems}
                defaultIndex={2}
                accentColor="#C5A880"
                overlayColor="#0C0F12"
                textColor="#ffffff"
                height={520}
                gap={10}
                radius={16}
                expandRatio={0.50}
                trigger="hover"
                showLabels={true}
                grayscale={true}
              />
            </motion.div>
          </div>

          {/* Right Column: Architectural Narrative & Verified Specifications */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="w-8 h-px bg-[#8A622A]" />
              <span className="text-[#8A622A] uppercase tracking-[0.22em] text-xs font-semibold">
                The Venue
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14171A] tracking-tight leading-[1.12] mb-6"
            >
              A Destination Designed for Scale & Elegance.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-[#525A62] text-base sm:text-lg font-light leading-relaxed mb-8 max-w-[60ch]"
            >
              Located on Poranki Road in Vijayawada, Murali Resort pairs modern halls with green lawns. Host grand weddings and events with ease. Your guests will enjoy plenty of space to celebrate in comfort.
            </motion.p>

            {/* Verified Specifications Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-stone-200 py-6 mb-8 text-sm"
            >
              <div className="flex items-start gap-3">
                <Users size={16} className="text-[#8A622A] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[#14171A]">Up to 2,000 Guests</div>
                  <div className="text-xs text-[#525A62]">Combined indoor & outdoor venue capacity</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-[#8A622A] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[#14171A]">800 Seated Guests</div>
                  <div className="text-xs text-[#525A62]">Modular seating in main indoor hall</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Trees size={16} className="text-[#8A622A] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[#14171A]">Expansive Grounds</div>
                  <div className="text-xs text-[#525A62]">Landscaped event lawns & terraces</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#8A622A] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[#14171A]">Poranki-Nidamanuru Road</div>
                  <div className="text-xs text-[#525A62]">Survey No - 134, Vijayawada, AP</div>
                </div>
              </div>
            </motion.div>

            {/* Link to Space Selector */}
            <a
              href="#spaces"
              className="inline-flex items-center gap-2 min-h-[44px] py-2 text-sm font-semibold text-[#14171A] hover:text-[#8A622A] transition-colors group"
            >
              <span>Explore Event Spaces</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
