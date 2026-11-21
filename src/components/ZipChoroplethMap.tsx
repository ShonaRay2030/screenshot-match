// Browser-only: imports Leaflet. Load via React.lazy behind <ClientOnly>.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { binFor, loadZipCounts } from "@/lib/zip-choropleth";
import type { LayerState } from "@/lib/beneficial-land-use";

export default function ZipChoroplethMap({ onSelect, onLayerState }: { onSelect: (lat: number, lng: number, zip: string) => void; onLayerState?: (s: LayerState) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const cb = useRef(onSelect); cb.current = onSelect;
  const st = useRef(onLayerState); st.current = onLayerState;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { maxBounds: [[38.5, -82.5], [43.5, -73]] }).setView([40.9, -77.7], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors; ZIP areas: US Census ZCTA 2010", maxZoom: 18, minZoom: 6 }).addTo(m);
    const abort = new AbortController();
    const styles = getComputedStyle(document.documentElement);
    const edge = styles.getPropertyValue("--earth").trim();
    st.current?.("loading");
    loadZipCounts(abort.signal).then((data) => {
      if (abort.signal.aborted) return;
      L.geoJSON(data, {
        style: (f) => ({ color: edge, weight: 0.4, opacity: 0.5, fillColor: styles.getPropertyValue(binFor(f?.properties.count ?? 0).cssVar).trim(), fillOpacity: 0.75 }),
        onEachFeature: (f, layer) => {
          const box = document.createElement("div");
          const h = document.createElement("strong"); h.textContent = `ZIP ${f.properties.zip}`; box.append(h);
          const p = document.createElement("p"); p.textContent = `${f.properties.count} beneficial land use ${f.properties.count === 1 ? "record" : "records"}`; box.append(p);
          const n = document.createElement("p"); n.textContent = "Record count only — not a risk score or measured contamination."; box.append(n);
          layer.bindPopup(box);
          layer.on("click", (e: L.LeafletMouseEvent) => cb.current(e.latlng.lat, e.latlng.lng, f.properties.zip));
          layer.on("mouseover", () => (layer as L.Path).setStyle({ weight: 2, opacity: 1 }));
          layer.on("mouseout", () => (layer as L.Path).setStyle({ weight: 0.4, opacity: 0.5 }));
        },
      }).addTo(m);
      st.current?.("ready");
    }).catch(() => { if (!abort.signal.aborted) st.current?.("error"); });
    return () => { abort.abort(); m.remove(); };
  }, []);

  return <div ref={el} className="h-full w-full" />;
}
