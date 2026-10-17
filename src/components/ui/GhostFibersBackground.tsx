"use client";

import React from "react";
import GhostFibers from "@/components/ui/GhostFibers";

interface GhostFibersBackgroundProps {
  glowColor?: string;
  secondaryColor?: string;
  lineColor?: string;
  lightMode?: boolean;
  className?: string;
}

export default function GhostFibersBackground({
  glowColor = "#7c3aed",
  secondaryColor = "#5b21b6",
  lineColor = "#c4b5fd",
  lightMode = true,
  className = "",
}: GhostFibersBackgroundProps) {
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
        layers={3}
        twist={1.2}
        threads={72}
        fiberStyle="dots"
        depthOfField={0.85}
        hoverEffect="focus"
        intro={true}
        mouseInteraction={true}
        lightMode={lightMode}
        speed={0.38}
        scale={1.1}
        density={1}
        thickness={1.0}
        sparkle={0.5}
        foldGlow={1.3}
        className="w-full h-full"
      />
    </div>
  );
}
