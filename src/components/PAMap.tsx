// Browser-only: imports Leaflet. Load via React.lazy behind <ClientOnly>.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadLandUses, type LayerState } from "@/lib/beneficial-land-use";

export default function PAMap({ point, onSelect, showLandUses = false, onLayerState }: { point?: { lat: number; lng: number } | undefined; onSelect: (lat: number, lng: number) => void; showLandUses?: boolean; onLayerState?: (state: LayerState) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);
  const cb = useRef(onSelect);
  cb.current = onSelect;
  const stateCallback = useRef(onLayerState);
  stateCallback.current = onLayerState;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { maxBounds: [[38.5, -82.5], [43.5, -73]] }).setView([40.9, -77.7], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 18, minZoom: 6,
    }).addTo(m);
    m.on("click", (e: L.LeafletMouseEvent) => cb.current(e.latlng.lat, e.latlng.lng));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || !showLandUses) return;
    const abort = new AbortController();
    let layer: L.GeoJSON | undefined;
    stateCallback.current?.("loading");
    const color = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    loadLandUses(abort.signal).then((data) => {
      if (abort.signal.aborted) return;
      layer = L.geoJSON(data, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
          radius: 5, color, fillColor: color, fillOpacity: 0.65, weight: 1,
          className: "beneficial-land-use-point",
        }),
        onEachFeature: (feature, site) => {
          const content = document.createElement("div");
          const heading = document.createElement("strong");
          heading.textContent = "Beneficial land use record";
          content.append(heading);
          const detail = document.createElement("p");
          detail.textContent = `Land use: ${feature.properties.landUse} · Site status: ${feature.properties.siteStatus}`;
          content.append(detail);
          const note = document.createElement("p");
          note.textContent = "PA DEP · October 2026. A listed record does not confirm application or microplastic contamination.";
          content.append(note);
          site.bindPopup(content);
          site.on("click", (event: L.LeafletMouseEvent) => cb.current(event.latlng.lat, event.latlng.lng));
        },
      }).addTo(m);
      stateCallback.current?.("ready");
    }).catch(() => { if (!abort.signal.aborted) stateCallback.current?.("error"); });
    return () => { abort.abort(); layer?.remove(); };
  }, [showLandUses]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    marker.current?.remove();
    if (point) {
      const styles = getComputedStyle(document.documentElement);
      marker.current = L.circleMarker([point.lat, point.lng], { radius: 9, color: styles.getPropertyValue("--earth").trim(), fillColor: styles.getPropertyValue("--sage").trim(), fillOpacity: 0.9, interactive: false }).addTo(m);
      const zoom = Math.max(m.getZoom(), 10);
      if (m.getCenter().distanceTo([point.lat, point.lng]) > 1 || m.getZoom() !== zoom) {
        m.setView([point.lat, point.lng], zoom);
      }
    }
  }, [point]);

  return <div ref={el} className="h-full w-full" />;
}
