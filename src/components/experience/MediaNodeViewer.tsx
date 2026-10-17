"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LocationNode } from "@/app/experience/page";

interface MediaNodeViewerProps {
  node: LocationNode;
  onNavigate: (id: string) => void;
}

export default function MediaNodeViewer({ node, onNavigate }: MediaNodeViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Subtle Mouse Parallax Setup
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Transform ranges: image moves slightly opposite to mouse
  const xOffset = useTransform(smoothX, [0, 1], ["2%", "-2%"]);
  const yOffset = useTransform(smoothY, [0, 1], ["2%", "-2%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
    >
      <motion.div 
        style={{ x: xOffset, y: yOffset }}
        className="absolute inset-[-5%] w-[110%] h-[110%]"
      >
        {node.type === "video" ? (
          <video
            src={node.media[0]}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <Image
            src={node.media[0]}
            alt={node.title}
            fill
            sizes="100vw"
            quality={100} // High quality for fullscreen
            priority
            className="object-cover"
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </motion.div>

      {/* Vignette Overlay for cinematic feel and text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Hotspots Container */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {node.hotspots?.map((hotspot, idx) => (
          <div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          >
            <button
              onClick={() => onNavigate(hotspot.targetId)}
              className="group relative flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Hotspot Dot */}
              <div className="w-8 h-8 rounded-full border-2 border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:border-white">
                <div className="w-2 h-2 rounded-full bg-white group-hover:bg-premium-dark transition-colors" />
              </div>

              {/* Pulse effect */}
              <div className="absolute w-8 h-8 rounded-full border border-white/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />

              {/* Label */}
              <div className="absolute top-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm border border-white/10">
                  {hotspot.label}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
