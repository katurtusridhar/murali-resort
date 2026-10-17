"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Navigation, Clock, Link as LinkIcon, Loader2 } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";

// Dynamically import map to avoid SSR issues with window/Leaflet
const DynamicMap = dynamic(() => import("@/components/ui/DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-premium-dark flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  ),
});

const RESORT_COORDS = { lat: 16.496928751195867, lng: 80.71897026622067 };
const RESORT_MAPS_LINK = "https://maps.app.goo.gl/yzuQ8TLbJ3FSdTcQ7";

export default function MapHero() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "routing" | "success" | "error">("idle");
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGetRoute = () => {
    setStatus("locating");

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        if (
          !Number.isFinite(userLat) ||
          !Number.isFinite(userLng) ||
          userLat < -90 ||
          userLat > 90 ||
          userLng < -180 ||
          userLng > 180
        ) {
          setErrorMsg("Invalid coordinates received from device.");
          setStatus("error");
          return;
        }

        setUserLocation([userLat, userLng]);
        setStatus("routing");

        try {
          // OSRM expects lng,lat
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${encodeURIComponent(userLng)},${encodeURIComponent(userLat)};${RESORT_COORDS.lng},${RESORT_COORDS.lat}?overview=full&geometries=geojson`
          );
          const data = await response.json();

          if (data.code === "Ok" && data.routes.length > 0) {
            const route = data.routes[0];

            // Format time and distance
            const durationMins = Math.round(route.duration / 60);
            const durationText = durationMins > 60
              ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
              : `${durationMins} mins`;

            const distanceKm = (route.distance / 1000).toFixed(1);

            setRouteInfo({ duration: durationText, distance: `${distanceKm} km` });

            // Inverse coordinates from GeoJSON (lng, lat) to Leaflet (lat, lng)
            const coords = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            setRouteGeometry(coords);
            setStatus("success");
          } else {
            throw new Error("Route not found. You might be too far or overseas.");
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Failed to calculate route";
          setErrorMsg(errorMessage);
          setStatus("error");
        }
      },
      () => {
        setErrorMsg("Location access denied or unavailable.");
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="relative z-20 w-full min-h-[100dvh] md:h-[80vh] md:min-h-[600px] bg-premium-dark flex items-center justify-center overflow-hidden py-24 md:py-0">
      {/* Background Interactive Map */}
      <div className="absolute inset-0 z-0">
        <DynamicMap userLocation={userLocation} routeGeometry={routeGeometry} />
        {/* Top dark fade for header contrast */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-premium-dark/70 to-transparent pointer-events-none z-10" />
        
        {/* Bottom white fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none z-10" />
      </div>

      {/* Floating UI Panel */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between h-auto md:h-full gap-8 md:gap-12 pb-12 md:pb-0 pt-20 md:pt-24">

        {/* Left Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left mb-6 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-4 mb-4 sm:mb-6"
          >
            <span className="w-8 h-px bg-accent"></span>
            <span className="text-accent tracking-[0.2em] text-xs font-semibold drop-shadow-md">
              Your Destination
            </span>
          </motion.div>

          <TextReveal
            text="The Journey Begins Here."
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-white leading-[1.1] mb-4 sm:mb-6 drop-shadow-xl"
            delay={0.1}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="bg-premium-dark/50 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-white/10"
          >
            <p className="text-stone-300 text-base sm:text-lg md:text-xl font-light max-w-md drop-shadow-md leading-relaxed">
              Murali Resort is seamlessly accessible. Discover the fastest route from your exact location straight to our grand entrance.
            </p>
          </motion.div>
        </div>

        {/* Right Interactive Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-[400px] bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
              <MapPin className="text-accent w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white font-serif text-xl mb-1">Murali Resort</h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Survey No - 134, Poranki-Nidamanuru,<br />Poranki, Vijayawada, AP 521137
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4"
              >
                <Magnetic strength={15}>
                  <button
                    onClick={handleGetRoute}
                    className="w-full py-4 bg-white text-premium-dark tracking-widest text-xs font-semibold btn-liquid btn-liquid-light flex flex-col items-center border border-transparent"
                  >
                    <span>Calculate My Route</span>
                  </button>
                </Magnetic>
                <a
                  href={RESORT_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-premium-dark hover:border-transparent tracking-widest text-[11px] font-semibold transition-colors rounded-sm mt-3"
                >
                  Open in Google Maps <LinkIcon size={14} />
                </a>
              </motion.div>
            )}

            {(status === "locating" || status === "routing") && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <Loader2 className="w-6 h-6 text-accent animate-spin mb-4" />
                <p className="text-stone-300 text-sm tracking-wide">
                  {status === "locating" ? "Requesting your location..." : "Mapping optimal route..."}
                </p>
              </motion.div>
            )}

            {status === "success" && routeInfo && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <Clock className="w-5 h-5 text-accent mb-2" />
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Est. Time</span>
                    <span className="text-xl font-serif text-white">{routeInfo.duration}</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <Navigation className="w-5 h-5 text-accent mb-2" />
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Distance</span>
                    <span className="text-xl font-serif text-white">{routeInfo.distance}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={
                      userLocation
                        ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation[0])},${encodeURIComponent(userLocation[1])}&destination=${RESORT_COORDS.lat},${RESORT_COORDS.lng}&travelmode=driving`
                        : RESORT_MAPS_LINK
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-white text-[#0C0F12] border border-white flex items-center justify-center uppercase tracking-widest text-[10px] font-bold rounded-sm transition-transform hover:-translate-y-1 shadow-lg hover:bg-stone-200"
                  >
                    Start Driving
                  </a>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-4 py-3 bg-white/10 text-white uppercase tracking-widest text-[10px] font-medium transition-colors hover:bg-white/20 rounded-sm"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-4 text-center"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-200 text-sm mb-4">{errorMsg}</p>
                  <a
                    href={RESORT_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-premium-dark uppercase tracking-widest text-[10px] font-semibold rounded-sm inline-block transition-transform hover:-translate-y-1"
                  >
                    Open Google Maps Instead
                  </a>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-3 text-stone-400 hover:text-white uppercase tracking-wide text-[10px] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
