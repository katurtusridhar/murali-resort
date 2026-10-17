"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/ui/TextReveal";
import Marquee from "@/components/ui/Marquee";
import { CometCard } from "@/components/ui/comet-card";

gsap.registerPlugin(ScrollTrigger);

const eventsData = [
  {
    id: "weddings",
    title: "Weddings",
    subtitle: "Elegant weddings, receptions, engagements and celebrations.",
    description: "From the first arrival to the final celebration, every detail becomes part of the memory. Imagine walking down the aisle in a space designed to amplify romance.",
    image: "/images/wedding.jpg",
  },
  {
    id: "corporate",
    title: "Corporate Events",
    subtitle: "Conferences, meetings, business gatherings and seminars.",
    description: "A professional environment that inspires innovation. Equipped with state-of-the-art facilities for your most important business moments.",
    image: "/images/exterior.webp", // Reusing for placeholder
  }
];

export default function Events() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".event-section");
      
      sections.forEach((section) => {
        const text = section.querySelector(".event-text");

        gsap.fromTo(
          text,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-stone-50 relative z-20" id="events">
      <div className="container mx-auto px-6 md:px-12 mb-20 text-center">
        <TextReveal 
          text="Gatherings Defined by Excellence"
          className="text-4xl md:text-5xl font-serif text-premium-dark mb-6 justify-center"
        />
        <p className="text-stone-600 max-w-2xl mx-auto text-lg">
          Whether you are planning an intimate celebration or a grand corporate summit, our versatile spaces adapt to your vision.
        </p>
      </div>

      <div className="flex flex-col gap-24 md:gap-32">
        {eventsData.map((event, index) => (
          <div
            key={event.id}
            className={`event-section container mx-auto px-6 md:px-12 flex flex-col gap-12 items-center ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* Text Content */}
            <div className="event-text flex-1 flex flex-col items-start text-left">
              <span className="text-accent uppercase tracking-widest text-sm font-semibold mb-4 block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-4xl font-serif text-premium-dark mb-4">
                {event.title}
              </h3>
              <p className="text-stone-500 font-medium mb-6 text-lg">
                {event.subtitle}
              </p>
              <p className="text-stone-600 mb-8 leading-relaxed">
                {event.description}
              </p>
              <button className="flex items-center gap-2 group text-premium-dark font-medium uppercase tracking-wider text-sm transition-colors hover:text-accent">
                Explore {event.title}
                <span className="block w-6 h-[1px] bg-premium-dark group-hover:bg-accent transition-all group-hover:w-10"></span>
              </button>
            </div>

            {/* Image */}
            <div className="w-full max-w-sm lg:max-w-md aspect-square relative mx-auto md:mx-0">
              <CometCard className="w-full h-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </CometCard>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 w-full pt-16 border-t border-stone-200">
        <Marquee 
          text="WEDDINGS • CORPORATE • CELEBRATIONS • CONFERENCES •" 
          baseVelocity={-1} 
          className="text-4xl md:text-6xl text-premium-dark/10" 
        />
      </div>
    </section>
  );
}
