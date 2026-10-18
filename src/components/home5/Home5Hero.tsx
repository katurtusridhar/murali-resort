"use client";

import { useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Sparkles, Users, Building } from "lucide-react";

const TOTAL_FRAMES = 300;
const CONCURRENT_DOWNLOADS = 6;

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
  const currentRenderedFrame = useRef<number>(1);
  const processQueueRef = useRef<() => void>(() => {});

  // Draw a frame onto the canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find the closest loaded frame if exact target isn't ready yet
    let img = frameCache.current.get(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestDiff = Infinity;
      let closestFrame = 1;
      frameCache.current.forEach((cachedImg, idx) => {
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          const diff = Math.abs(idx - frameIndex);
          if (diff < closestDiff) {
            closestDiff = diff;
            closestFrame = idx;
          }
        }
      });
      img = frameCache.current.get(closestFrame);
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

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

      const onLoad = () => {
        frameCache.current.set(nextIndex, img);
        activeDownloads.current--;
        if (nextIndex === 1 || nextIndex === currentRenderedFrame.current) {
          drawFrame(nextIndex);
        }
        processQueueRef.current();
      };

      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.onload = onLoad;
        img.onerror = () => {
          activeDownloads.current--;
          processQueueRef.current();
        };
      }
    }
  }, [drawFrame]);

  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  // Helper to dynamically prioritize fetching frames around the user's scroll position
  const prioritizeFrames = useCallback((centerFrame: number) => {
    const urgent: number[] = [];
    for (let offset = 0; offset <= 8; offset++) {
      const fForward = centerFrame + offset;
      if (fForward <= TOTAL_FRAMES && !frameCache.current.has(fForward) && !queue.current.includes(fForward)) {
        urgent.push(fForward);
      }
      if (offset > 0) {
        const fBack = centerFrame - offset;
        if (fBack >= 1 && !frameCache.current.has(fBack) && !queue.current.includes(fBack)) {
          urgent.push(fBack);
        }
      }
    }
    if (urgent.length > 0) {
      queue.current = [...urgent, ...queue.current];
      processQueue();
    }
  }, [processQueue]);

  // Progressive frame loader: Frame 1 immediately, key anchors next, then full sequence
  useEffect(() => {
    if (isMobileOrReduced) return;

    // 1. Immediately request Frame 1
    const frame1 = new window.Image();
    frame1.src = `/images/aerial-sequence/ezgif-frame-001.jpg`;
    const onFrame1Load = () => {
      frameCache.current.set(1, frame1);
      drawFrame(1);
    };

    if (frame1.complete && frame1.naturalWidth > 0) {
      onFrame1Load();
    } else {
      frame1.onload = onFrame1Load;
    }

    // 2. Queue key anchor frames first (every 5th frame for fast responsiveness), then fill remainder
    const prioritizedQueue: number[] = [];
    for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
      prioritizedQueue.push(i);
    }
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i % 5 !== 0) {
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

  // Direct, bulletproof scroll listener for canvas scrubbing on PC (vsync throttled)
  useEffect(() => {
    if (isMobileOrReduced) return;

    let rafId = 0;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      const targetFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        drawFrame(targetFrame);
        prioritizeFrames(targetFrame);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobileOrReduced, drawFrame, prioritizeFrames]);

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
      className={isMobileOrReduced ? "relative z-20 w-full h-[100dvh] min-h-[100dvh] bg-[#0C0F12] overflow-hidden" : "relative z-20 w-full h-[220vh] bg-[#0C0F12]"}
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
              className="object-cover object-[center_70%] sm:object-[center_60%]"
            />
          </div>
        ) : (
          // Desktop progressive 1080p canvas scrub with instant Frame 1 backing
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/aerial-sequence/ezgif-frame-001.jpg"
              alt="Murali Resort Aerial Grounds"
              fill
              sizes="100vw"
              priority
              quality={90}
              className="object-cover object-center"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Ambient Vignette & Contrast Overlay — balanced so aerial sequence stays bright & clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/50 pointer-events-none" />

        {/* Hero Content Overlay: Always 100% visible on PC, tablet, and mobile */}
        <div
          className={`relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-between ${
            isMobileOrReduced 
              ? "pt-28 sm:pt-36 md:pt-40 pb-6 sm:pb-8" 
              : "pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8"
          }`}
        >
          {/* Top Section: Eyebrow & Value Proposition (Floating in open sky above facility) */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0F12]/85 backdrop-blur-md border border-white/20 mb-3 sm:mb-5 isolate">
              <Sparkles size={13} className="text-[#C5A880]" />
              <span className="text-xs sm:text-sm tracking-wide text-[#C5A880] font-semibold">
                Poranki, Vijayawada
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white leading-[1.12] tracking-tight mb-3 sm:mb-5 drop-shadow-xl">
              <span className="sr-only">Murali Resort &amp; Convention Center — </span>
              Where Moments <br className="hidden sm:inline" />
              <span className="italic font-normal text-stone-200">Become Memories.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-100 font-normal leading-relaxed max-w-xl mb-6 sm:mb-8 drop-shadow">
              A scenic resort for weddings, parties, and business events on open green lawns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="btn-primary-light shrink-0"
              >
                Plan Your Event
              </Link>
              <button
                onClick={handleSkip}
                className="btn-outline-light shrink-0"
              >
                Explore Venue
              </button>
            </div>
          </div>

          {/* Bottom Section: Verified Specification Badges & Skip Prompt (100% complete across all screens) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-t border-white/20 pt-3 sm:pt-4">
            {/* Verified Capacities & Offerings Badges */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-6 w-full sm:w-auto">
              {/* Badge 1: 2,000 Capacity */}
              <div className="flex items-center gap-1.5 sm:gap-3 bg-[#0C0F12]/85 sm:bg-[#0C0F12]/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/20 isolate">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
                  <Users size={12} className="text-[#C5A880] sm:w-3.5 sm:h-3.5" />
                </div>
                {/* Mobile: stacked 2-line micro-copy to prevent any cut-off or ellipses */}
                <div className="flex flex-col justify-center min-w-0 sm:hidden">
                  <span className="text-xs font-bold text-white leading-tight">2,000</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wide leading-tight">Capacity</span>
                </div>
                {/* Desktop / Tablet: full rich specification */}
                <div className="hidden sm:block min-w-0">
                  <div className="text-xs sm:text-sm text-white font-semibold whitespace-nowrap">2,000 Capacity</div>
                  <div className="text-xs text-stone-300 uppercase tracking-wider whitespace-nowrap">Combined Venue</div>
                </div>
              </div>

              {/* Badge 2: 800 Seated */}
              <div className="flex items-center gap-1.5 sm:gap-3 bg-[#0C0F12]/85 sm:bg-[#0C0F12]/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/20 isolate">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
                  <Building size={12} className="text-[#C5A880] sm:w-3.5 sm:h-3.5" />
                </div>
                {/* Mobile: stacked 2-line micro-copy */}
                <div className="flex flex-col justify-center min-w-0 sm:hidden">
                  <span className="text-xs font-bold text-white leading-tight">800</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wide leading-tight">Seated</span>
                </div>
                {/* Desktop / Tablet: full rich specification */}
                <div className="hidden sm:block min-w-0">
                  <div className="text-xs sm:text-sm text-white font-semibold whitespace-nowrap">800 Seated</div>
                  <div className="text-xs text-stone-300 uppercase tracking-wider whitespace-nowrap">Grand Hall</div>
                </div>
              </div>

              {/* Badge 3: Lawns & Suites */}
              <div className="flex items-center gap-1.5 sm:gap-3 bg-[#0C0F12]/85 sm:bg-[#0C0F12]/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/20 isolate">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
                  <Sparkles size={12} className="text-[#C5A880] sm:w-3.5 sm:h-3.5" />
                </div>
                {/* Mobile: stacked 2-line micro-copy */}
                <div className="flex flex-col justify-center min-w-0 sm:hidden">
                  <span className="text-xs font-bold text-white leading-tight">Lawns</span>
                  <span className="text-xs text-stone-300 uppercase tracking-wide leading-tight">&amp; Suites</span>
                </div>
                {/* Desktop / Tablet: full rich specification */}
                <div className="hidden sm:block min-w-0">
                  <div className="text-xs sm:text-sm text-white font-semibold whitespace-nowrap">Lawns &amp; Suites</div>
                  <div className="text-xs text-stone-300 uppercase tracking-wider whitespace-nowrap">Open-Air Spaces</div>
                </div>
              </div>
            </div>

            {/* Skip / Scroll Prompt */}
            <button
              onClick={handleSkip}
              className="hidden sm:inline-flex items-center gap-1.5 text-stone-200 text-xs tracking-widest uppercase hover:text-white transition-colors group self-start sm:self-auto shrink-0 min-h-[32px] py-1"
              aria-label="Scroll to explore — skip animation and view venue details"
            >
              <span>Scroll to explore</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
