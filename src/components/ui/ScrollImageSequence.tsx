"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollImageSequenceProps {
  frameCount: number;
  sequencePath?: string;
  children?: ReactNode;
}

export default function ScrollImageSequence({ frameCount, sequencePath = "/images/aerial-sequence/ezgif-frame-", children }: ScrollImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    
    // Performance strategy: Determine step based on device and network
    let step = 1;
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const nav = navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
        mozConnection?: { saveData?: boolean; effectiveType?: string };
        webkitConnection?: { saveData?: boolean; effectiveType?: string };
      };
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      const isSlow = Boolean(connection && (connection.saveData || connection.effectiveType === "3g" || connection.effectiveType === "2g"));
      
      if (isSlow || isMobile) {
        step = 3; // Load every 3rd frame (100 frames total instead of 300)
      } else if (window.innerWidth < 1024) {
        step = 2; // Tablet: Load every 2nd frame (150 frames total)
      }
    }

    const loadFrame = (i: number) => {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `${sequencePath}${paddedIndex}.jpg`;
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
      };
      images[i - 1] = img;
    };

    // Prioritize first frame immediately for fast initial render
    loadFrame(1);

    // Defer the rest to not block main thread
    setTimeout(() => {
      for (let i = 1 + step; i <= frameCount; i += step) {
        loadFrame(i);
        // Fill the skipped frames with the previous loaded frame so rendering doesn't break
        for (let j = 1; j < step; j++) {
           if (i - j > 0) {
              images[i - 1 - j] = images[i - 1 - step] || images[0];
           }
        }
      }
    }, 100);

    imagesRef.current = images;
  }, [frameCount, sequencePath]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    if (imagesLoaded < 1) return; // Wait for at least the first frame

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize canvas
    if (!ctx) return;

    let currentFrame = 0;

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return; // Fallback: keep previous frame if next isn't loaded

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Object-fit: cover equivalent
      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Optional: Add a subtle dark vignette overlay to make white text pop
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      gradient.addColorStop(0, "rgba(0,0,0,0.15)");
      gradient.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrame);
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial setup

    const playhead = { frame: 0 };
    
    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${frameCount * 2}`, // Reduced to 2px per frame - brings content higher
        pin: true,
        scrub: 0.5, // 0.5s smoothing
        animation: gsap.to(playhead, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          onUpdate: () => {
            currentFrame = Math.round(playhead.frame);
            renderFrame(currentFrame);
          },
        }),
      });
    }, containerRef);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ctxGsap.revert();
    };
  }, [imagesLoaded, frameCount]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Content overlay */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>
      
      {/* Loading overlay for first frame */}
      {imagesLoaded < 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-premium-dark z-50">
           <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
