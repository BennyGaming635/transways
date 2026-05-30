"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const [stops, setStops] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any | null>(null);

  // Fetch stops for the current map bounds
  const fetchStopsForBounds = (map: any) => {
    if (!map) return;
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const params = new URLSearchParams({
      minLat: String(sw.lat),
      minLng: String(sw.lng),
      maxLat: String(ne.lat),
      maxLng: String(ne.lng),
    });

    fetch(`/api/stops?${params.toString()}`)
      .then((res) => res.json())
      .then(setStops)
      .catch((e) => {
        console.error("Failed to fetch stops for bounds", e);
      });
  };

  useEffect(() => {
    if (!mapInstance) return;

    // initial load
    fetchStopsForBounds(mapInstance);

    const onMoveEnd = () => fetchStopsForBounds(mapInstance);

    mapInstance.on("moveend", onMoveEnd);
    mapInstance.on("zoomend", onMoveEnd);

    return () => {
      mapInstance.off("moveend", onMoveEnd);
      mapInstance.off("zoomend", onMoveEnd);
    };
  }, [mapInstance]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[-34.92, 138.6] as any}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => setMapInstance(map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.latitude, stop.longitude]}
          >
            <Popup>
              <strong>{stop.name}</strong>
              <br />
              {stop.code ?? "No code"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}