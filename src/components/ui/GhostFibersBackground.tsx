"use client";

import React, { useSyncExternalStore } from "react";
import GhostFibers from "@/components/ui/GhostFibers";

interface GhostFibersBackgroundProps {
  glowColor?: string;
  secondaryColor?: string;
  lineColor?: string;
  lightMode?: boolean;
  className?: string;
}

const subscribeTier = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
};

const getTierSnapshot = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

const getTierServerSnapshot = () => "desktop" as const;

export default function GhostFibersBackground({
  glowColor = "#7c3aed",
  secondaryColor = "#5b21b6",
  lineColor = "#c4b5fd",
  lightMode = true,
  className = "",
}: GhostFibersBackgroundProps) {
  const tier = useSyncExternalStore(subscribeTier, getTierSnapshot, getTierServerSnapshot);

  const config =
    tier === "mobile"
      ? { threads: 36, layers: 3, density: 0.6, particles: 0.2, dpr: 1.0 }
      : tier === "tablet"
      ? { threads: 48, layers: 3, density: 0.75, particles: 0.3, dpr: 1.2 }
      : { threads: 60, layers: 3, density: 0.85, particles: 0.4, dpr: 1.5 };

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-[5] overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      <GhostFibers
        glowColor={glowColor}
        secondaryColor={secondaryColor}
        lineColor={lineColor}
        layers={config.layers}
        twist={1.2}
        threads={config.threads}
        fiberStyle="dots"
        depthOfField={0.85}
        hoverEffect="focus"
        intro={true}
        mouseInteraction={tier === "desktop"}
        lightMode={lightMode}
        speed={0.38}
        scale={1.1}
        density={config.density}
        thickness={1.0}
        particles={config.particles}
        sparkle={0.4}
        foldGlow={1.3}
        dpr={config.dpr}
        className="w-full h-full"
      />
    </div>
  );
}
