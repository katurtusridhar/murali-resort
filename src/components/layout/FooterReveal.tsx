"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface FooterRevealProps {
  children: ReactNode;
}

export default function FooterReveal({ children }: FooterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // The inner content starts shifted up (-30%) and moves to 0% as the container scrolls into view.
  // This creates a smooth parallax "reveal" effect entirely within the normal document flow.
  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-premium-dark">
      <motion.div style={{ y }} className="w-full h-full relative z-0">
        {children}
      </motion.div>
    </div>
  );
}
