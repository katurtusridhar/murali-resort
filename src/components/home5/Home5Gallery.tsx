"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, MoveHorizontal, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const selectedItem = selectedIdx !== null ? celebrationItems[selectedIdx] : null;

  const handleOpen = useCallback((item: CircularGalleryItem, index: number) => {
    setSelectedIdx(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + celebrationItems.length) % celebrationItems.length : 0));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % celebrationItems.length : 0));
  }, []);

  // Keyboard controls & lock background scroll
  useEffect(() => {
    if (selectedIdx === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIdx, handleClose, handlePrev, handleNext]);

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
              Browse authentic setups from weddings, receptions, and banquets hosted at Murali Resort. Click or tap any card to expand full view, or drag to explore.
            </p>
          </div>

          <div className="flex items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-stone-100/90 border border-stone-200 text-xs font-medium text-[#525A62] shadow-sm">
              <MoveHorizontal size={14} className="text-[#8A622A]" />
              <span>Drag to browse</span>
              <span className="text-stone-300">•</span>
              <Sparkles size={13} className="text-[#8A622A]" />
              <span>Tap card to expand</span>
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
            onItemClick={handleOpen}
            className="w-full h-full"
          />
        </div>

      </div>

      {/* Expanded Lightbox Modal for Celebration Moments */}
      <AnimatePresence>
        {selectedItem && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 md:p-10"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.text || "Celebration photo preview"}
          >
            {/* Modal Card Content Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-[#121518] rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#161a1e]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span className="font-serif text-base sm:text-lg text-white font-medium tracking-wide">
                    {selectedItem.text}
                  </span>
                  <span className="text-xs text-stone-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 ml-2">
                    {selectedIdx + 1} / {celebrationItems.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  aria-label="Close expanded view"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Image Area with Navigation Buttons */}
              <div className="relative w-full h-[320px] sm:h-[460px] md:h-[520px] bg-black/60 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.alt || selectedItem.text || "Celebration photo"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  className="object-contain p-2 sm:p-4 select-none"
                  priority
                />

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-sm transition-all cursor-pointer shadow-lg active:scale-95 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-sm transition-all cursor-pointer shadow-lg active:scale-95 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="p-5 sm:p-6 bg-[#161a1e] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <p className="text-stone-500 text-xs mt-2 hidden sm:block">
                    Use left / right arrow keys to navigate • Press Esc to close
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-stone-950 font-semibold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    <Calendar size={14} />
                    <span>Plan Your Event</span>
                  </Link>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
