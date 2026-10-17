"use client";
import React, { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { cn } from "@/lib/utils";

const subscribeTouch = (callback: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(pointer: coarse), (hover: none)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};

const getTouchSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse), (hover: none)").matches;

const getTouchServerSnapshot = () => false;

export const CometCard = ({
  rotateDepth = 7,
  translateDepth = 10,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const isTouch = useSyncExternalStore(subscribeTouch, getTouchSnapshot, getTouchServerSnapshot);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`;

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    if (!rectRef.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  if (isTouch) {
    return (
      <div className={cn("relative w-full h-full rounded-2xl overflow-hidden shadow-md", className)}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn("perspective-[1000px] [transform-style:preserve-3d]", className)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          z: 10,
          boxShadow:
            "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 10 }}
        whileHover={{
          scale: 1.02,
          z: 30,
          transition: { duration: 0.2 },
        }}
        className="relative rounded-2xl w-full h-full [transform-style:preserve-3d]"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-2xl mix-blend-overlay"
          style={{
            background: glareBackground,
            opacity: 0.6,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
};
