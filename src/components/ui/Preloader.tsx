"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const emptySubscribe = () => () => {};

export default function Preloader() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    // Disable scroll while loading
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const duration = 2000; // 2 seconds
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    let finishTimeout: ReturnType<typeof setTimeout> | null = null;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        finishTimeout = setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "";
        }, 500); // short pause at 100%
      }
    }, interval);

    return () => {
      clearInterval(timer);
      if (finishTimeout) {
        clearTimeout(finishTimeout);
      }
      document.body.style.overflow = "";
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-premium-dark text-white"
        >
          {/* Logo container with overflow hidden for reveal */}
          <div className="overflow-hidden relative h-24 w-36 mb-8 flex items-center justify-center">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src="/images/logo.png"
                alt="Murali Resort"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-lg tracking-widest font-serif"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
