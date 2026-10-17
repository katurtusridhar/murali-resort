"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import TextReveal from "@/components/ui/TextReveal";

const previews = [
  {
    title: "Celebrations",
    description: "Weddings, Engagements & Social Events",
    image: "/images/wedding.jpg",
    href: "/celebrations",
  },
  {
    title: "Corporate Events",
    description: "Conferences, Meetings & Seminars",
    image: "/images/exterior.webp",
    href: "/facilities",
  },
  {
    title: "Accommodations",
    description: "Premium Guest Suites",
    image: "/images/bedroom.jpg",
    href: "/accommodations",
  }
];

export default function EventsPreview() {
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
    <section className="py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-8 h-px bg-accent"></span>
              <span className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
                Offerings
              </span>
            </motion.div>
            <TextReveal
              text="Curated Experiences."
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-premium-dark tracking-tight"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-stone-500 mt-6 text-base md:text-lg font-light leading-relaxed"
            >
              Explore our tailored spaces and services designed down to the ultimate detail.
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
      >
        {previews.map((preview) => (
          <motion.div key={preview.href} variants={item} className="w-full flex flex-col group cursor-pointer">
            <Link 
              href={preview.href} 
              onClick={preview.href === "/celebrations" ? (e) => e.preventDefault() : undefined}
              className="block w-full"
            >
              <div className="relative aspect-[3/4] lg:aspect-[2/3] w-full overflow-hidden mb-6 rounded-sm shadow-lg">
                <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
                  <Image
                    src={preview.image}
                    alt={preview.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    quality={90}
                  />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-serif text-premium-dark mb-3">
                {preview.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-stone-200 pt-4 gap-4">
                 <p className="text-stone-500 text-sm font-light">
                   {preview.description}
                 </p>
                 <span className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-[0.2em] transition-transform duration-500 group-hover:translate-x-2">
                   Discover
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                 </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
