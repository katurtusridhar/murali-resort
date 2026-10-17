"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, Minimize2, Map } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import MediaNodeViewer from "@/components/experience/MediaNodeViewer";

export type MediaType = "photo" | "panorama" | "video" | "gallery";

export interface LocationNode {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  media: string[]; 
  capacity?: string;
  features?: string[];
  hotspots?: { targetId: string; label: string; x: number; y: number }[];
}

const NODES: Record<string, LocationNode> = {
  "aerial": {
    id: "aerial",
    type: "video",
    title: "Resort Aerial Overview",
    description: "Experience the sheer scale and architectural elegance of Murali Resort from above.",
    media: ["/videos/aerial-drone.mp4"],
    hotspots: [
      { targetId: "entrance", label: "Enter Resort", x: 50, y: 70 }
    ]
  },
  "entrance": {
    id: "entrance",
    type: "photo",
    title: "The Grand Entrance",
    description: "Your arrival sets the tone for an unforgettable experience. Valet service and architectural grandeur await.",
    media: ["/images/experience/entrance.png"],
    features: ["Valet Service", "Covered Arrival", "Security"],
    hotspots: [
      { targetId: "grand-hall", label: "Proceed to Grand Hall", x: 50, y: 60 }
    ]
  },
  "grand-hall": {
    id: "grand-hall",
    type: "photo", // Currently photo, ready for panorama later
    title: "The Grand Hall",
    description: "Our magnificent flagship indoor venue, featuring towering ceilings and bespoke lighting for large-scale celebrations.",
    capacity: "Up to 2,000 Guests",
    features: ["Acoustically Treated", "Custom Lighting", "VIP Backstage"],
    media: ["/images/experience/grand-hall.png"],
    hotspots: [
      { targetId: "event-lawns", label: "View Outdoor Lawns", x: 80, y: 50 },
      { targetId: "accommodations", label: "View Accommodations", x: 20, y: 50 }
    ]
  },
  "accommodations": {
    id: "accommodations",
    type: "photo",
    title: "Luxury Suites",
    description: "Premium on-site accommodations designed for ultimate relaxation before and after your event.",
    capacity: "50+ Suites",
    features: ["24/7 Room Service", "Private Balconies", "Bridal Suites"],
    media: ["/images/experience/accommodations.png"],
    hotspots: [
      { targetId: "grand-hall", label: "Return to Grand Hall", x: 50, y: 80 }
    ]
  },
  "event-lawns": {
    id: "event-lawns",
    type: "photo",
    title: "The Event Lawns",
    description: "Expansive, meticulously landscaped outdoor spaces offering a breathtaking natural backdrop.",
    capacity: "Up to 1,500 Guests",
    features: ["Manicured Gardens", "Ambient Lighting", "Weather-ready Options"],
    media: ["/images/experience/event-lawns.png"],
    hotspots: [
      { targetId: "grand-hall", label: "Return to Grand Hall", x: 50, y: 80 }
    ]
  }
};

const NAVIGATION_ORDER = ["aerial", "entrance", "grand-hall", "event-lawns", "accommodations"];

export default function ExperiencePage() {
  const [activeId, setActiveId] = useState<string>("aerial");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeNode = NODES[activeId];
  const currentIndex = NAVIGATION_ORDER.indexOf(activeId) + 1;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <main className="fixed inset-0 w-full h-full bg-premium-dark overflow-hidden text-white font-sans selection:bg-accent selection:text-white">
      
      {/* 
        MEDIA VIEWER LAYER 
        Handles crossfading between locations and rendering the correct media type.
      */}
      <AnimatePresence mode="wait">
        <MediaNodeViewer 
          key={activeId} 
          node={activeNode} 
          onNavigate={setActiveId}
        />
      </AnimatePresence>

      {/* 
        UI OVERLAY LAYER 
        Hidden when fullscreen is active (except for the exit button) to maximize immersion.
      */}
      <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 transition-opacity duration-500 ${isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Top Header */}
        <header className="flex items-center justify-between pointer-events-auto">
          <Link 
            href="/home"
            className="flex items-center gap-3 text-white hover:text-accent transition-colors bg-black/20 backdrop-blur-md px-5 py-3 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} />
            <span className="text-[10px] font-semibold tracking-widest uppercase">Exit Tour</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveId("aerial")}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-5 py-3 rounded-full border border-white/10 text-white hover:text-accent transition-colors"
            >
              <Map size={16} />
              <span className="text-[10px] font-semibold tracking-widest uppercase hidden md:inline">Overview</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:text-accent transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </header>

        {/* Bottom Panel */}
        <div className="flex flex-col md:flex-row items-end md:items-end justify-between gap-6 pointer-events-auto w-full max-w-7xl mx-auto">
          
          {/* Progress & Navigator */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="text-[10px] font-bold text-accent tracking-[0.2em] mb-1">
              0{currentIndex} / 0{NAVIGATION_ORDER.length}
            </div>
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {NAVIGATION_ORDER.map((id) => (
                <button 
                  key={id}
                  onClick={() => setActiveId(id)}
                  className={`text-left text-xs uppercase tracking-[0.15em] font-medium transition-all whitespace-nowrap px-4 py-2 md:px-0 md:py-1 ${activeId === id ? "text-white" : "text-white/40 hover:text-white/80"}`}
                >
                  {NODES[id].title}
                </button>
              ))}
            </nav>
          </div>

          {/* Location Info Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-[400px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl"
            >
              <h2 className="text-2xl font-serif text-white mb-3">
                {activeNode.title}
              </h2>
              
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                {activeNode.description}
              </p>

              {(activeNode.capacity || activeNode.features) && (
                <div className="flex flex-col gap-3 mb-8">
                  {activeNode.capacity && (
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-white/10 pb-2">
                      <span className="text-white/50">Capacity</span>
                      <span className="text-white">{activeNode.capacity}</span>
                    </div>
                  )}
                  {activeNode.features && (
                    <div className="flex justify-between items-start text-[10px] uppercase tracking-widest pt-1">
                      <span className="text-white/50 shrink-0">Features</span>
                      <div className="flex flex-col items-end gap-1 text-white text-right">
                        {activeNode.features.map(f => <span key={f}>{f}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Link
                href="/contact"
                className="w-full text-center px-6 py-4 bg-white text-premium-dark text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-accent transition-colors"
              >
                Plan Your Event
              </Link>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}
