"use client";


import Home5Header from "@/components/home5/Home5Header";
import Home5Hero from "@/components/home5/Home5Hero";
import Home5Architecture from "@/components/home5/Home5Architecture";
import Home5Spaces from "@/components/home5/Home5Spaces";
import Home5TextLoop from "@/components/home5/Home5TextLoop";
import Home5Gallery from "@/components/home5/Home5Gallery";
import Home5Location from "@/components/home5/Home5Location";
import Home5Reviews from "@/components/home5/Home5Reviews";
import Home5CTA from "@/components/home5/Home5CTA";
import Home5Footer from "@/components/home5/Home5Footer";

export default function Home5ClientPage() {
  return (
    <main className="relative w-full max-w-full overflow-x-hidden min-h-screen bg-transparent text-stone-900 selection:bg-[#C5A880]/30 selection:text-stone-900">
      {/* 1. Header Navigation */}
      <Home5Header />

      {/* 2. Pillar 1: Meaningful Hero with Progressive 1080p Canvas & Context */}
      <Home5Hero />

      {/* 3. Pillar 2: Architectural Overview with Facade Reveal */}
      <Home5Architecture />

      {/* 4. Pillar 3: Verified Space Selector (Hall, Lawns, Suites) */}
      <Home5Spaces />

      {/* Infinite Seamless Text Loop connecting Spaces to Moments */}
      <Home5TextLoop />

      {/* 5. Pillar 4: Authentic Celebration Gallery */}
      <Home5Gallery />

      {/* 6. Pillar 5: Practical Logistics & Location Connectivity */}
      <Home5Location />

      {/* 7. Verified Google Maps Guest Reviews */}
      <Home5Reviews />

      {/* 8. Pillar 6: Direct Enquiry Finale & 9. Architectural Footer */}
      <div className="relative text-white overflow-hidden">
        {/* Background Layer: Sits at z-0, BEHIND the single continuous GhostFibersBackground at z-5 */}
        <div className="absolute inset-0 z-0 bg-[#0C0F12] pointer-events-none" aria-hidden="true" />

        {/* Foreground Content Layer: Sits at relative z-20, IN FRONT OF GhostFibersBackground at z-5 */}
        <div className="relative z-20">
          <Home5CTA />
          <Home5Footer />
        </div>
      </div>
    </main>
  );
}
