"use client";

import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import CircularGallery, { CircularGalleryItem } from "@/components/ui/CircularGallery";

const celebrationItems: CircularGalleryItem[] = [
  {
    image: "/images/gallery/wedding-img-1.png",
    text: "Royal Floral Aisle",
    description: "A beautiful wedding walkway with crystal chandeliers, fresh flower garlands, and a red carpet.",
    alt: "Royal wedding aisle and floral mandap walkway at Murali Resort",
  },
  {
    image: "/images/gallery/wedding-img-7.png",
    text: "Traditional Mandap",
    description: "Sacred Vedic ceremonial stage under an opulent floral canopy with ceremonial brass lamps and bespoke illumination.",
    alt: "Traditional wedding mandap ceremony at Murali Resort",
  },
  {
    image: "/images/gallery/event-img-3.png",
    text: "Twilight Lawn Receptions",
    description: "Open-air banquets and starlit celebrations illuminated under festoon lights, paper lanterns, and evening skies.",
    alt: "Twilight lawn wedding reception at Murali Resort",
  },
  {
    image: "/images/home5/corporate-events.jpg",
    text: "Corporate Summits",
    description: "High-capacity keynote conventions, leadership summits, and grand corporate assemblies with multimedia LED backdrops.",
    alt: "Corporate summits and keynote events at Murali Resort",
  },
  {
    image: "/images/home5/wedding-mandap.jpg",
    text: "Imperial Mandap Stage",
    description: "Majestic ceremonial amphitheater draped in pleated crimson silks with suspended floral chandeliers.",
    alt: "Imperial mandap stage and wedding banquet at Murali Resort",
  },
  {
    image: "/images/gallery/wedding-img-2.png",
    text: "Grand Celebrations",
    description: "Bespoke ceremonial arches with cascading lavender blossoms, illuminated pillars, and festive floral arrangements.",
    alt: "Grand floral celebration stage at Murali Resort",
  },
];

export default function Home5Gallery() {
  return (
    <section id="moments" className="bg-transparent py-16 sm:py-24 md:py-32 text-stone-900 overflow-hidden relative z-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#8A622A]" />
              <span className="text-[#8A622A] uppercase tracking-[0.22em] text-xs font-semibold">
                Celebration Moments
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14171A] tracking-tight leading-[1.15]">
              Real Celebrations Brought to Life.
            </h2>
            <p className="text-[#525A62] text-base sm:text-lg font-light leading-relaxed mt-4">
              Browse authentic setups from weddings, receptions, and banquets hosted at Murali Resort. Drag or scroll to explore the celebration arc.
            </p>
          </div>

          <div className="flex items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-stone-100/90 border border-stone-200 text-xs font-medium text-[#525A62] shadow-sm">
              <MoveHorizontal size={14} className="text-[#8A622A]" />
              <span>Drag or scroll to browse</span>
            </div>

            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-full border border-stone-300 text-[#14171A] text-xs uppercase tracking-widest font-semibold hover:border-[#14171A] hover:bg-[#14171A] hover:text-white transition-all shadow-sm group"
            >
              <span>View Full Gallery</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Circular Gallery WebGL Arc Display */}
        <div className="relative z-20 w-full h-[460px] sm:h-[580px] lg:h-[660px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-stone-200/70 bg-stone-50/50 backdrop-blur-sm cursor-grab active:cursor-grabbing">
          <CircularGallery
            items={celebrationItems}
            bend={2.6}
            textColor="#14171A"
            borderRadius={0.06}
            itemSize={1.05}
            itemAspect={0.75}
            gap={0.24}
            wave={0.8}
            shadow={0.3}
            scrollEase={0.05}
            scrollSpeed={2}
            autoScroll={0.22}
            font="600 24px var(--font-playfair), Georgia, serif"
            openOnClick={false}
            className="w-full h-full"
          />
        </div>

      </div>
    </section>
  );
}
