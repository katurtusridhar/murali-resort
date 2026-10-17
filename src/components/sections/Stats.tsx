"use client";

import { motion, type Variants } from "motion/react";
import clsx from "clsx";

const statsData = [
  { value: "500+", label: "Events Hosted" },
  { value: "2,000", label: "Guests Accommodated" },
  { value: "2012", label: "Established" },
];

interface StatsProps {
  className?: string;
  isBordered?: boolean;
}

export default function Stats({ className, isBordered = true }: StatsProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className={clsx("bg-stone-50 py-24 md:py-32", className)}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className={clsx(
          "container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left",
          isBordered && "border-t border-stone-200 pt-24 md:pt-32"
        )}
      >
        {statsData.map((stat) => (
          <motion.div key={stat.label} variants={item} className="flex flex-col">
            <span className="text-6xl md:text-7xl lg:text-8xl font-serif text-premium-dark mb-4 tracking-tighter">
              {stat.value}
            </span>
            <span className="text-stone-500 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
