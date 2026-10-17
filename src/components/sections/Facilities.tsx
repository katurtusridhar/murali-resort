"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { Building2, TreePine, UtensilsCrossed, ShieldCheck, Wifi, Sparkles } from "lucide-react";

const facilities = [
  {
    id: "conference",
    icon: Building2,
    title: "Conference Halls",
    shortDesc: "Modular seating for up to 800 guests.",
    fullDesc: "Our modern conference halls are built for clear focus and great events. Enjoy open views with no pillars, quiet soundproof walls, and window blinds for screens. You can divide the hall into four rooms or open it up for large talks.",
    image: "/images/gallery/venue-img-1.png",
    features: ["800 Guest Capacity", "4 Breakout Rooms", "Acoustic Treatment", "Column-free design"]
  },
  {
    id: "outdoors",
    icon: TreePine,
    title: "Outdoor Terraces",
    shortDesc: "Open-air patios for receptions and ceremonies.",
    fullDesc: "Give your guests fresh air and natural views in total comfort. Our green terraces wrap around the main building with warm evening lights and sunset skies. They are great for welcome drinks, photo sessions, or open-air dinner under the stars.",
    image: "/images/gallery/venue-img-5.png",
    features: ["Sunset Views", "Built-in Heaters", "Mood Lighting", "Weather Canopies"]
  },
  {
    id: "culinary",
    icon: UtensilsCrossed,
    title: "Culinary Excellence",
    shortDesc: "Curated menus tailored to every event.",
    fullDesc: "Our resort kitchen is led by skilled chefs who create fresh menus for every event. From light finger foods to full plated dinners, we tailor every dish to your taste. Your guests will enjoy great food and attentive service throughout the meal.",
    image: "/images/gallery/wedding-img-3.png",
    features: ["Custom Menus", "Dietary Specialists", "Sommelier Service", "Live Stations"]
  },
  {
    id: "concierge",
    icon: ShieldCheck,
    title: "24/7 Concierge",
    shortDesc: "Round-the-clock premium hospitality.",
    fullDesc: "Plans can change quickly during an event. Our on-site team is available 24 hours a day to help with every detail. We handle guest arrivals, travel rides, room bookings, and last-minute requests with ease.",
    image: "/images/gallery/venue-img-2.png",
    features: ["VIP Handling", "Transport Logistics", "On-call Support", "Guest Services"]
  },
  {
    id: "tech",
    icon: Wifi,
    title: "Seamless Tech",
    shortDesc: "Live-streaming and hybrid event support.",
    fullDesc: "Fast internet and modern tech power every event at our resort. We offer high-speed fiber Wi-Fi, HD video cameras for live streaming, and clear sound systems. Our on-site tech team helps make sure everything runs smoothly.",
    image: "/images/gallery/event-img-2.png",
    features: ["Redundant Fiber", "PTZ Cameras", "Hybrid Capable", "In-house Tech Team"]
  },
  {
    id: "decor",
    icon: Sparkles,
    title: "Décor & Styling",
    shortDesc: "In-house design team to transform any space.",
    fullDesc: "Our venue is ready for your personal touch. Our design team works with top florists, lighting specialists, and decor partners to bring your vision to life. We style each room to match your event theme and colors.",
    image: "/images/gallery/wedding-img-1.png",
    features: ["Custom Lighting", "Floral Design", "Furniture Hire", "Brand Integration"]
  },
];

function DesktopFacilityImageItem({
  facility,
  setActiveId,
}: {
  facility: typeof facilities[0];
  setActiveId: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // amount: 0.5 ensures it only triggers when at least 50% of the image is visibly in the viewport.
  const isInView = useInView(ref, { amount: 0.5, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveId(facility.id);
    }
  }, [isInView, facility.id, setActiveId]);

  return (
    <div ref={ref} className="w-full flex items-center justify-center py-20 lg:py-32">
      <div className="relative z-20 w-full max-w-md xl:max-w-xl aspect-square rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-stone-200">
        <Image
          src={facility.image}
          alt={facility.title}
          fill
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default function Facilities() {
  const [activeId, setActiveId] = useState(facilities[0].id);

  return (
    <section className="bg-transparent relative z-20 w-full pb-20 sm:pb-28">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-6xl relative">
        
        {/* Mobile & Tablet Layout (< 1024px): Dedicated art-directed card sequence */}
        <div className="lg:hidden flex flex-col gap-8 sm:gap-12">
          {facilities.map((fac) => (
            <article
              key={`mobile-${fac.id}`}
              className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
            >
              {/* Facility Image with Icon Badge */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-100 overflow-hidden">
                <Image
                  src={fac.image}
                  alt={fac.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center border border-stone-100">
                  <fac.icon size={22} className="text-accent" strokeWidth={1.5} />
                </div>
              </div>

              {/* Full Facility Specifications & Narrative */}
              <div className="p-5 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-premium-dark mb-3">
                  {fac.title}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-light">
                  {fac.fullDesc}
                </p>

                <div className="pt-5 border-t border-stone-100">
                  <h3 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {fac.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-stone-700 text-xs sm:text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop Layout (>= 1024px): Sticky left typography + scrolling images */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-16 relative">
          
          {/* Left Column: Sticky Typography */}
          <div className="relative h-full">
            <div className="sticky top-0 h-screen flex flex-col justify-center">
              <div className="relative w-full h-[600px] flex flex-col justify-center">
                
                {facilities.map((fac) => {
                  const isActive = activeId === fac.id;
                  return (
                    <motion.div
                      key={fac.id}
                      initial={false}
                      animate={{ 
                        opacity: isActive ? 1 : 0, 
                        y: isActive ? 0 : 20,
                        pointerEvents: isActive ? "auto" : "none"
                      }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-0 flex flex-col justify-center w-full"
                    >
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-stone-100 flex items-center justify-center mb-8">
                        <fac.icon size={28} className="text-accent" strokeWidth={1.5} />
                      </div>

                      <h2 className="text-5xl font-serif text-premium-dark mb-6 leading-tight">
                        {fac.title}
                      </h2>

                      <p className="text-stone-600 text-lg leading-relaxed mb-10">
                        {fac.fullDesc}
                      </p>

                      <div className="pt-8 border-t border-stone-200">
                        <h3 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-6">
                          Key Features
                        </h3>
                        <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                          {fac.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-700 font-medium text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
                
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Image Sequence */}
          <div className="pt-12 lg:pt-24">
            {facilities.map((fac) => (
              <DesktopFacilityImageItem key={fac.id} facility={fac} setActiveId={setActiveId} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
