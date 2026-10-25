// Browser-only: imports Leaflet. Load via React.lazy behind <ClientOnly>.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function PAMap({ point, onSelect }: { point?: { lat: number; lng: number } | undefined; onSelect: (lat: number, lng: number) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);
  const cb = useRef(onSelect);
  cb.current = onSelect;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { maxBounds: [[38.5, -82.5], [43.5, -73]] }).setView([40.9, -77.7], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 18, minZoom: 6,
    }).addTo(m);
    L.rectangle([[39.72, -80.52], [42.27, -74.69]], { color: "#3d6b4f", weight: 1, fill: false, dashArray: "4 4" }).addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) => cb.current(e.latlng.lat, e.latlng.lng));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    marker.current?.remove();
    if (point) {
      marker.current = L.circleMarker([point.lat, point.lng], { radius: 9, color: "#2f5a3f", fillColor: "#8fae8b", fillOpacity: 0.9 }).addTo(m);
      m.setView([point.lat, point.lng], Math.max(m.getZoom(), 10));
    }
  }, [point]);

  return <div ref={el} className="h-full w-full" />;
}
