"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface MiniMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function MiniMap({ latitude, longitude, className = "" }: MiniMapProps) {
  const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
  const center: LatLngExpression = [latitude, longitude];

  useEffect(() => {
    const L = require("leaflet");
    const icon = L.icon({
      iconUrl: "/marker-icon.png",
      iconRetinaUrl: "/marker-icon-2x.png",
      shadowUrl: "/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    setMarkerIcon(icon);
  }, []);

  if (!markerIcon) {
    return null; // or a loading state
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border border-border ${className}`}
      style={{ height: "160px", width: "100%" }}
    >
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true} 
        dragging={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} icon={markerIcon} />
      </MapContainer>

      {/* Overlay with coordinates */}
      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-[1000]">
        {Math.abs(latitude).toFixed(2)}°{latitude >= 0 ? "N" : "S"}{" "}
        {Math.abs(longitude).toFixed(2)}°{longitude >= 0 ? "E" : "W"}
      </div>
    </div>
  );
}
