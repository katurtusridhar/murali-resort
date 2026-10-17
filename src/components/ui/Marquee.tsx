"use client";

import { useRef } from "react";
import { motion, useScroll, useVelocity, useTransform, useSpring, useAnimationFrame, useMotionValue } from "motion/react";
// Local wrap function to replace @motionone/utils
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
interface MarqueeProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

export default function Marquee({ text, baseVelocity = 2, className = "" }: MarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden m-0 whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div className="font-serif font-semibold uppercase flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block mr-12">{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
