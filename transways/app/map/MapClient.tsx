"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapClient() {
  const [stops, setStops] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [bounds, setBounds] = useState<any>(null);

  // Leaflet icon setup must run client-side only
  useEffect(() => {
    try {
      // clear any existing _getIconUrl if present
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    } catch (e) {
      // ignore errors when running in non-browser environments
    }
  }, []);

  // Fetch stops for the current map bounds
  const fetchStopsForBounds = (map: any) => {
    if (!map) return;

    const b = map.getBounds();
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();

    setBounds(b);

    const params = new URLSearchParams({
      minLat: String(sw.lat),
      minLng: String(sw.lng),
      maxLat: String(ne.lat),
      maxLng: String(ne.lng),
    });

    setLoading(true);

    fetch(`/api/stops?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setStops(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
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
      <div style={{ position: "absolute", zIndex: 1000, left: 8, top: 8, background: "white", padding: 8, borderRadius: 6 }}>
        <strong>Markers:</strong> {stops.length} {loading ? "(loading...)" : ""}
      </div>
      {/* Debug list of stops (first 20) */}
      <div style={{ position: "absolute", zIndex: 1000, right: 8, top: 8, background: "rgba(255,255,255,0.95)", padding: 8, borderRadius: 6, maxHeight: 300, overflow: "auto", width: 220 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Visible stops ({stops.length})</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 12 }}>
          {stops.slice(0, 20).map((s) => (
            <li key={s.id} style={{ marginBottom: 4 }}>{s.name}</li>
          ))}
          {stops.length > 20 && <li style={{ color: "#666" }}>...and {stops.length - 20} more</li>}
        </ul>
      </div>
      <MapContainer
        center={[-34.92, 138.6] as any}
        zoom={12}
        minZoom={10}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        whenReady={((map: any) => setMapInstance(map.target)) as any}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {stops.map((stop) => (
          <Marker key={stop.id} position={[stop.latitude, stop.longitude]}>
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
