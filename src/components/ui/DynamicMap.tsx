"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RESORT_COORDS: [number, number] = [16.496928751195867, 80.71897026622067];

// Custom Premium Markers
const resortIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative flex items-center justify-center w-12 h-12 -ml-6 -mt-12" role="img" aria-label="Murali Resort Location">
      <span class="sr-only">Murali Resort Location</span>
      <div class="absolute inset-0 bg-accent/30 rounded-full animate-ping" aria-hidden="true"></div>
      <div class="relative w-8 h-8 bg-premium-dark border-2 border-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(196,169,132,0.5)]" aria-hidden="true">
        <div class="w-3 h-3 bg-accent rounded-full"></div>
      </div>
    </div>
  `,
});

const userIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4" role="img" aria-label="Your Current Location">
      <span class="sr-only">Your Current Location</span>
      <div class="w-4 h-4 bg-white border-2 border-premium-dark rounded-full shadow-lg" aria-hidden="true"></div>
    </div>
  `,
});

interface DynamicMapProps {
  userLocation: [number, number] | null;
  routeGeometry: [number, number][] | null;
}

// Map controller to adjust bounds when route is loaded
function MapBoundsController({ userLocation, routeGeometry }: DynamicMapProps) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && routeGeometry && routeGeometry.length > 0) {
      const bounds = L.latLngBounds([RESORT_COORDS, userLocation]);
      map.fitBounds(bounds, { padding: [100, 100], animate: true, duration: 2 });
    } else if (!userLocation) {
      map.setView(RESORT_COORDS, 13, { animate: true });
    }
  }, [userLocation, routeGeometry, map]);

  return null;
}

export default function DynamicMap({ userLocation, routeGeometry }: DynamicMapProps) {
  return (
    <MapContainer
      center={RESORT_COORDS}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", backgroundColor: "#121212" }}
      className="z-0"
    >
      {/* Premium Dark Theme Tiles via CSS Inversion of standard OSM */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        className="map-tiles"
        crossOrigin="anonymous"
      />

      {/* Resort Marker */}
      <Marker
        position={RESORT_COORDS}
        icon={resortIcon}
        interactive={false}
        title="Murali Resort Location"
        alt="Murali Resort Location"
      />

      {/* User Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={userIcon}
          interactive={false}
          title="Your Current Location"
          alt="Your Current Location"
        />
      )}

      {/* Dynamic Route Line */}
      {routeGeometry && (
        <Polyline
          positions={routeGeometry}
          pathOptions={{ color: "#c4a984", weight: 4, opacity: 0.8, dashArray: "10, 10", lineJoin: "round" }}
        />
      )}

      <MapBoundsController userLocation={userLocation} routeGeometry={routeGeometry} />
    </MapContainer>
  );
}
