"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";
import Link from "next/link";

const features = [
  { label: "Guest Capacity", value: "Up to 2,000" },
  { label: "Event Spaces", value: "10+ Venues" },
  { label: "Environment", value: "Indoor & Outdoor" },
];

export default function Venue() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Deep Parallax for the image inside its container
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={sectionRef} id="venue" className="bg-stone-50 py-32 md:py-48 overflow-hidden relative">
      {/* Decorative large text behind everything */}
      <div className="absolute top-0 right-0 pointer-events-none select-none overflow-hidden h-full w-full flex items-center justify-end z-0 opacity-[0.015]">
        <span className="font-serif text-[30vw] leading-none whitespace-nowrap -mr-[10vw]">VENUE</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left Text Block */}
          <div className="lg:col-span-5 flex flex-col items-start order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-8 h-px bg-accent"></span>
              <span className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
                The Venue
              </span>
            </motion.div>

            <TextReveal
              text="A Destination in Itself."
              className="text-4xl md:text-6xl font-serif text-premium-dark mb-8 leading-[1.1] tracking-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-stone-600 mb-12 text-lg md:text-xl font-light leading-relaxed"
            >
              Nestled across acres of landscaped grounds, our venue combines
              contemporary elegance with timeless architecture. Every detail —
              from the grand entrance to the intimate corners — has been
              crafted to leave a lasting impression.
            </motion.p>

            <div className="flex flex-col gap-6 mb-14 w-full">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex items-center justify-between border-b border-stone-200 pb-4 group"
                >
                  <span className="text-stone-500 font-medium text-xs tracking-[0.2em] uppercase transition-colors group-hover:text-accent">
                    {feat.label}
                  </span>
                  <span className="text-premium-dark font-serif text-xl transition-transform group-hover:-translate-y-1">
                    {feat.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <Magnetic strength={20}>
              <Link
                href="/gallery"
                className="px-10 py-5 bg-premium-dark text-white uppercase tracking-[0.15em] text-xs font-medium transition-shadow hover:shadow-xl btn-liquid btn-liquid-adaptive rounded-sm inline-block mb-0"
              >
                View Full Gallery
              </Link>
            </Magnetic>
          </div>

          {/* Right Image Block with Deep Parallax */}
          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 relative lg:-mr-12 xl:-mr-24">
            <motion.div
              ref={imageContainerRef}
              initial={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
              whileInView={{ opacity: 1, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full max-w-md lg:max-w-none mx-auto lg:mx-0 rounded-sm overflow-hidden shadow-2xl"
            >
              <motion.div className="w-full h-[130%] absolute -top-[15%]" style={{ y: imageY }}>
                <Image
                  src="/images/exterior.webp"
                  alt="Venue Exterior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  quality={100}
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
