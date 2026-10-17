"use client";

import { useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, Sparkles, Users, Building } from "lucide-react";

const TOTAL_FRAMES = 300;
const CONCURRENT_DOWNLOADS = 4;

const subscribeHeroCapabilities = (callback: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia("(max-width: 1024px)");
  const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  mediaQuery.addEventListener("change", callback);
  mediaReduced.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
    mediaReduced.removeEventListener("change", callback);
  };
};

const getHeroCapabilitiesSnapshot = () => {
  if (typeof window === "undefined") return false;
  const isMobileOrTablet = window.innerWidth <= 1024;
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return isMobileOrTablet || isReduced;
};

const getHeroCapabilitiesServerSnapshot = () => false;

export default function Home5Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMobileOrReduced = useSyncExternalStore(
    subscribeHeroCapabilities,
    getHeroCapabilitiesSnapshot,
    getHeroCapabilitiesServerSnapshot
  );

  // Progressive frame cache: Map index -> HTMLImageElement
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeDownloads = useRef<number>(0);
  const queue = useRef<number[]>([]);
  const currentRenderedFrame = useRef<number>(0);
  const processQueueRef = useRef<() => void>(() => {});

  // Scroll tracking for editorial choreography
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Staged editorial reveals across 0 -> 1 progress: hero content stays fully visible during initial view,
  // gently scaling and transitioning into the architectural narrative as the user scrolls.
  const headlineScale = useTransform(scrollYProgress, [0, 0.5, 0.9], [1, 0.96, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.95 ? "none" : "auto"));
  const badgesY = useTransform(scrollYProgress, [0, 0.3], [10, 0]);

  // Draw a frame onto the canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Find the closest loaded frame if exact target isn't ready yet
    let img = frameCache.current.get(frameIndex);
    if (!img) {
      let closestDiff = Infinity;
      let closestFrame = 1;
      frameCache.current.forEach((cachedImg, idx) => {
        const diff = Math.abs(idx - frameIndex);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestFrame = idx;
        }
      });
      img = frameCache.current.get(closestFrame);
    }

    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    // Object-fit: cover calculation
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - imgWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - imgHeight * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      imgWidth,
      imgHeight,
      centerShiftX,
      centerShiftY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    currentRenderedFrame.current = frameIndex;
  }, []);

  // Bounded concurrency queue manager
  const processQueue = useCallback(() => {
    while (activeDownloads.current < CONCURRENT_DOWNLOADS && queue.current.length > 0) {
      const nextIndex = queue.current.shift()!;
      if (frameCache.current.has(nextIndex)) continue;

      activeDownloads.current++;
      const img = new window.Image();
      const padded = String(nextIndex).padStart(3, "0");
      img.src = `/images/aerial-sequence/ezgif-frame-${padded}.jpg`;

      img.onload = () => {
        frameCache.current.set(nextIndex, img);
        activeDownloads.current--;
        if (nextIndex === 1) {
          drawFrame(1);
        }
        processQueueRef.current();
      };

      img.onerror = () => {
        activeDownloads.current--;
        processQueueRef.current();
      };
    }
  }, [drawFrame]);

  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  // Progressive frame loader: Frame 1 immediately, then nearby frames, then full sequence
  useEffect(() => {
    if (isMobileOrReduced) return;

    // 1. Immediately request Frame 1
    const frame1 = new window.Image();
    frame1.src = `/images/aerial-sequence/ezgif-frame-001.jpg`;
    frame1.onload = () => {
      frameCache.current.set(1, frame1);
      drawFrame(1);
    };

    // 2. Queue key anchor frames first (every 10th frame for fast responsiveness), then fill remainder
    const prioritizedQueue: number[] = [];
    for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
      prioritizedQueue.push(i);
    }
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i % 10 !== 0) {
        prioritizedQueue.push(i);
      }
    }

    queue.current = prioritizedQueue;
    processQueue();

    return () => {
      queue.current = [];
    };
  }, [isMobileOrReduced, drawFrame, processQueue]);

  // Resize canvas to match display window
  useEffect(() => {
    if (isMobileOrReduced) return;

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      drawFrame(currentRenderedFrame.current || 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOrReduced, drawFrame]);

  // Sync scroll position to frame playback with vsync throttling
  useEffect(() => {
    if (isMobileOrReduced) return;

    let rafId = 0;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const targetFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(latest * (TOTAL_FRAMES - 1)) + 1)
      );
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        drawFrame(targetFrame);
      });
    });

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobileOrReduced, scrollYProgress, drawFrame]);

  // Accessible skip to content function
  const handleSkip = () => {
    const overviewEl = document.getElementById("overview");
    if (overviewEl) {
      overviewEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={containerRef} 
      className={isMobileOrReduced ? "relative z-20 w-full h-[100dvh] min-h-[100dvh] bg-[#0C0F12] overflow-hidden" : "relative z-20 w-full h-[180vh] bg-[#0C0F12]"}
    >
      {/* STICKY CONTAINER FOR CANVAS OR STATIC FALLBACK */}
      <div className={`sticky top-0 w-full ${isMobileOrReduced ? "h-[100dvh]" : "h-screen"} overflow-hidden`}>
        
        {/* Background Visual Layer */}
        {isMobileOrReduced ? (
          // Fast, zero-lag static fallback: Modern Facility Amid Vast Green Fields
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/home5/modern-facility-green-fields.jpg"
              alt="Murali Resort - Modern Facility Amid Vast Green Fields"
              fill
              sizes="100vw"
              priority
              quality={92}
              className="object-cover object-[center_60%] sm:object-center"
            />
          </div>
        ) : (
          // Desktop progressive 1080p canvas scrub
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Ambient Vignette & Contrast Overlay (Ensures text legibility while keeping the facility visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F12] via-black/30 to-black/60 pointer-events-none" />

        {/* Hero Content Overlay (Anchored, Non-blocking & 100% visible on landing) */}
        <motion.div
          style={{
            scale: isMobileOrReduced ? 1 : headlineScale,
            opacity: isMobileOrReduced ? 1 : heroOpacity,
            pointerEvents: isMobileOrReduced ? "auto" : heroPointerEvents,
          }}
          className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-between pt-16 sm:pt-24 lg:pt-28 pb-3 sm:pb-6"
        >
          {/* Top Section: Eyebrow & Value Proposition */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-2 sm:mb-4">
              <Sparkles size={12} className="text-[#C5A880]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                Poranki, Vijayawada
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif text-white leading-[1.1] tracking-tight mb-2 sm:mb-4 drop-shadow-md">
              <span className="sr-only">Murali Resort &amp; Convention Center — </span>
              Where Moments <br className="hidden sm:inline" />
              <span className="italic font-normal text-stone-200">Become Memories.</span>
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-stone-200 font-light leading-relaxed max-w-xl mb-3.5 sm:mb-6 drop-shadow-sm">
              A scenic resort for weddings, parties, and business events on open green lawns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <Link
                href="/contact"
                className="px-5 sm:px-7 py-2 sm:py-3.5 rounded-full bg-white text-[#14171A] border border-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-stone-200 transition-all shadow-lg hover:shadow-xl shrink-0"
              >
                Plan Your Event
              </Link>
              <button
                onClick={handleSkip}
                className="px-5 sm:px-7 py-2 sm:py-3.5 rounded-full border border-white/30 text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:border-white hover:bg-white/10 transition-colors backdrop-blur-sm shrink-0"
              >
                Explore Venue
              </button>
            </div>
          </div>

          {/* Bottom Section: Verified Specification Badges & Skip Prompt (Fits completely without cut-off) */}
          <motion.div 
            style={{ y: badgesY }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 border-t border-white/20 pt-2.5 sm:pt-4"
          >
            {/* Verified Capacities & Offerings Badges */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-6 w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                  <Users size={12} className="text-[#C5A880]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white font-semibold truncate">2,000 Capacity</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider hidden xs:block sm:block truncate">Combined Venue</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                  <Building size={12} className="text-[#C5A880]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white font-semibold truncate">800 Seated</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider hidden xs:block sm:block truncate">Grand Hall</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                  <Sparkles size={12} className="text-[#C5A880]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white font-semibold truncate">Lawns & Suites</div>
                  <div className="text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider hidden xs:block sm:block truncate">Open-Air Spaces</div>
                </div>
              </div>
            </div>

            {/* Skip / Scroll Prompt */}
            <button
              onClick={handleSkip}
              className="hidden sm:inline-flex items-center gap-1.5 text-stone-300 text-xs tracking-widest uppercase hover:text-white transition-colors group self-start sm:self-auto shrink-0"
              aria-label="Skip scroll animation and view venue details"
            >
              <span>Scroll to explore</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
