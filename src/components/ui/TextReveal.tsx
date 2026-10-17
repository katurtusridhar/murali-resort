"use client";

import { motion, Variants } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const lines = text.split("\n");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: "100%",
      rotate: 5,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
  };

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`flex flex-wrap ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="contents">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="flex flex-wrap w-full">
            {line.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} style={{ display: "inline-block", paddingRight: "0.25em", overflow: "hidden" }}>
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={child}
                    style={{ display: "inline-block", originY: 1 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </span>
    </motion.h2>
  );
}
