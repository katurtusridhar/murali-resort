"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";
import clsx from "clsx";

interface AccommodationsProps {
  ctaHref?: string;
  ctaText?: string;
}

export default function Accommodations({
  ctaHref = "/contact?type=accommodation",
  ctaText = "Enquire About Suites",
}: AccommodationsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  // Localized theme transition based on scroll depth
  const isInView = useInView(sectionRef, { amount: 0.3 });

  return (
    <section 
      ref={sectionRef} 
      id="accommodations" 
      className={clsx(
        "py-32 md:py-48 overflow-hidden relative z-20 transition-colors duration-1000",
        isInView ? "bg-premium-dark text-white" : "bg-stone-50 text-premium-dark"
      )}
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          <div className="lg:col-span-7 order-2 lg:order-1 relative w-full h-full">
            <motion.div
              ref={imageContainerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-sm overflow-hidden shadow-2xl"
            >
              <motion.div className="w-full h-[130%] absolute -top-[15%]" style={{ y: imageY }}>
                <Image
                  src="/images/bedroom.jpg"
                  alt="Premium Guest Suite"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  quality={100}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-8 h-px bg-accent"></span>
              <span className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
                Accommodations
              </span>
            </motion.div>

            <TextReveal
              text={"Stay in Uncompromised\nLuxury."}
              className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.1] tracking-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="opacity-80 text-lg leading-relaxed mb-10 max-w-lg transition-colors duration-1000"
            >
              After the celebration, retreat to spaces designed for profound relaxation. Our guest suites blend contemporary elegance with warm hospitality, ensuring your experience remains flawless from beginning to end.
            </motion.p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
              }}
              className="space-y-5 mb-14 opacity-70 font-light transition-colors duration-1000"
            >
              {["Premium amenities", "24/7 room service", "Spacious layouts"].map((amenity) => (
                <motion.li
                  key={amenity}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className="flex items-center gap-4 text-sm tracking-wide"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {amenity}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
               viewport={{ once: true, margin: "-100px" }}
            >
              <Magnetic strength={20}>
                <Link
                  href={ctaHref}
                  className="px-10 py-5 border border-current uppercase tracking-[0.15em] text-xs font-semibold btn-liquid btn-liquid-adaptive transition-colors duration-1000 rounded-sm inline-block"
                >
                  {ctaText}
                </Link>
              </Magnetic>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
