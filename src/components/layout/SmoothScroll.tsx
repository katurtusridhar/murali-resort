"use client";

import { useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";

const subscribeCoarse = (callback: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(pointer: coarse), (hover: none)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getCoarseSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (hover: none)").matches === true;

const getCoarseServerSnapshot = () => false;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const isCoarse = useSyncExternalStore(subscribeCoarse, getCoarseSnapshot, getCoarseServerSnapshot);

  // On touch/coarse devices (mobile & tablet), render native scrolling for zero-latency 120Hz/60Hz physics
  if (isCoarse) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 0.9,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 0,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
