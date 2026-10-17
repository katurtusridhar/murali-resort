"use client";

import Image from "next/image";
import { motion } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  eyebrow?: string;
  overlayOpacity?: number;
  height?: string;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  eyebrow,
  overlayOpacity = 0.5,
  height = "70vh",
}: PageHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center bg-premium-dark"
      style={{ height }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 z-10 bg-premium-dark"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-stone-300 uppercase tracking-widest text-xs md:text-sm font-semibold mb-6 drop-shadow-md block"
          >
            {eyebrow}
          </motion.span>
        )}

        <TextReveal
          text={title}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white max-w-4xl leading-[1.1] mb-6 justify-center drop-shadow-lg"
          delay={0.1}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-stone-200 text-lg md:text-xl max-w-2xl font-light drop-shadow-md"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
