"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import DriftWall from "@/components/ui/DriftWall";

const items = [
  { image: '/images/gallery/event-img-1.png', title: 'Event Details' },
  { image: '/images/gallery/event-img-2.png', title: 'Celebration' },
  { image: '/images/gallery/event-img-3.png', title: 'Atmosphere' },
  { image: '/images/gallery/venue-img-1.png', title: 'Venue Setup' },
  { image: '/images/gallery/venue-img-2.png', title: 'Architecture' },
  { image: '/images/gallery/venue-img-3.png', title: 'Grounds' },
  { image: '/images/gallery/venue-img-4.png', title: 'Exterior' },
  { image: '/images/gallery/venue-img-5.png', title: 'Facilities' },
  { image: '/images/gallery/wedding-img-1.png', title: 'Wedding Ceremony' },
  { image: '/images/gallery/wedding-img-2.png', title: 'Wedding Decor' },
  { image: '/images/gallery/wedding-img-3.png', title: 'Floral Arrangements' },
  { image: '/images/gallery/wedding-img-4.jpg', title: 'Reception' },
  { image: '/images/gallery/wedding-img-5.png', title: 'Couples Portrait' },
  { image: '/images/gallery/wedding-img-6.png', title: 'Bridal Details' },
  { image: '/images/gallery/wedding-img-7.png', title: 'Groom Details' },
  { image: '/images/gallery/wedding-img-8.png', title: 'Vows' },
];

const subscribeWindow = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

const getWindowWidth = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
const getServerWidth = () => 1200;

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const width = useSyncExternalStore(subscribeWindow, getWindowWidth, getServerWidth);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const columns = isMobile ? 4 : isTablet ? 6 : 10;
  const tileWidth = isMobile ? 150 : isTablet ? 210 : 280;
  const tileHeight = isMobile ? 200 : isTablet ? 280 : 360;
  const gap = isMobile ? 10 : isTablet ? 16 : 24;

  const handleTileClick = useCallback((clickedItem: { image: string; title?: string }) => {
    const idx = items.findIndex((it) => it.image === clickedItem.image);
    setSelectedIndex(idx >= 0 ? idx : 0);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0));
  }, []);

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (selectedIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <section className="bg-transparent relative z-20 w-full h-[520px] sm:h-[650px] lg:h-[800px] overflow-hidden">
        {/* Top boundary fade */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-[#0C0F12]/80 via-[#0C0F12]/30 to-transparent pointer-events-none z-30" />

        <DriftWall
          items={items}
          columns={columns}
          tileWidth={tileWidth}
          tileHeight={tileHeight}
          gap={gap}
          tilt={0}
          turn={0}
          perspective={1400}
          depth={0}
          speed={35}
          direction="up"
          variance={0}
          parallax={0}
          lift={0}
          fade={0.5}
          dim={1.0}
          overlayColor="#0C0F12"
          radius={14}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
          onTileClick={handleTileClick}
        />

        {/* Bottom boundary fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-[#0C0F12]/80 via-[#0C0F12]/30 to-transparent pointer-events-none z-30" />
      </section>

      {/* Accessible Interactive Touch Lightbox */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            key="gallery-lightbox-modal"
            id="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo view: ${activeItem.title}`}
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Content Container */}
            <div
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-stone-900 border border-white/10">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title ?? "Gallery photograph"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Caption & Counter */}
              <div className="mt-4 flex items-center justify-between w-full text-stone-300 text-xs sm:text-sm px-2">
                <span className="font-serif text-white text-base sm:text-lg">{activeItem.title}</span>
                <span className="text-stone-400">
                  {selectedIndex + 1} / {items.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
