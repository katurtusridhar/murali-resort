"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Magnetic from "@/components/ui/Magnetic";
import TextReveal from "@/components/ui/TextReveal";
import ScrollImageSequence from "@/components/ui/ScrollImageSequence";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Fade out text during scroll
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 250], [1, 0]);
  const y = useTransform(scrollY, [0, 250], [0, -100]);
  const pointerEvents = useTransform<number, "auto" | "none">(scrollY, [200, 250], ["auto", "none"]);
  const indicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full bg-premium-dark">
      <ScrollImageSequence frameCount={300}>
        <motion.div
          style={{ opacity, y, pointerEvents }}
          className="relative z-10 h-screen flex flex-col justify-start items-start text-left pt-[120px] md:pt-[160px] px-6 md:px-12 max-w-7xl mx-auto w-full"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1 }}
            className="flex items-center justify-start gap-4 mb-8"
          >
            <span className="w-12 h-px bg-accent/60"></span>
            <p className="text-accent tracking-[0.2em] font-medium text-xs md:text-sm drop-shadow-md">
              Where moments become memories
            </p>
          </motion.div>

          {/* Headline */}
          <h1 className="sr-only">Murali Resort - Premium Wedding & Event Venue</h1>
          <TextReveal
            text={"Your Moment Deserves\nA Venue Like This."}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl max-w-4xl"
            delay={0.15}
          />

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
            className="text-stone-100 text-lg md:text-xl md:text-2xl max-w-2xl font-normal mb-14 drop-shadow-lg"
          >
            A premium destination for weddings, celebrations, corporate events and unforgettable gatherings.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-start"
          >
            <Magnetic strength={30}>
              <a
                href="/contact"
                className="group relative inline-flex items-center justify-center px-10 py-4 min-w-[180px] bg-white text-premium-dark font-semibold text-sm tracking-[0.12em] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] rounded-sm"
              >
                <span className="relative z-10">Enquire Now</span>
              </a>
            </Magnetic>

            <Magnetic strength={20}>
              <Link 
                href="/experience" 
                className="px-10 py-5 bg-premium-dark text-white tracking-[0.15em] text-xs font-medium transition-shadow hover:shadow-xl btn-liquid btn-liquid-adaptive rounded-sm inline-block"
              >
                Virtual Experience
              </Link>
            </Magnetic>
          </motion.div>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        >
          <span className="text-white/50 text-[10px] tracking-[0.2em] font-medium">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <motion.div
              className="w-full h-1/2 bg-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      </ScrollImageSequence>
    </section>
  );
}
