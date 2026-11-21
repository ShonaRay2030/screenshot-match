import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { PageHeader, DemoBadge } from "@/components/Layout";
import { LocationSearch } from "@/components/LocationSearch";
import { LocationReport } from "@/components/LocationReport";
import { Checkbox } from "@/components/ui/checkbox";
import { LAND_USE_CATEGORIES, LAND_USE_DATA, type LayerState } from "@/lib/beneficial-land-use";

const PAMap = lazy(() => import("@/components/PAMap"));

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [
    { title: "Explore the Pennsylvania Map — Keystone Soil Watch" },
    { name: "description", content: "Search or click a Pennsylvania location to see which environmental indicators are available." },
    { property: "og:title", content: "Explore the Pennsylvania Map" },
    { property: "og:description", content: "Select a location to review environmental indicators and data limitations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MapPage,
});

const LAYERS = ["Wastewater discharge locations", "Relevant facilities", "Waterways", "Agricultural areas (privacy-protected)", "Relative risk estimates"];

function MapPage() {
  const [sel, setSel] = useState<{ lat: number; lng: number; label?: string }>();
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(() => Object.fromEntries(LAND_USE_CATEGORIES.map((c) => [c.key, true])));
  const [layerState, setLayerState] = useState<LayerState>("loading");
  const Fallback = <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Loading map…</div>;
  return (
    <>
      <PageHeader eyebrow="Explore" title="Pennsylvania map">Search for a farm by address, ZIP, or coordinates — or click anywhere on the map. Zoom and pan freely.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[1fr_380px]">
        <div className="card-surface h-[520px] overflow-hidden">
          <ClientOnly fallback={Fallback}>
            <Suspense fallback={Fallback}><PAMap point={sel} onSelect={(lat, lng) => setSel({ lat, lng })} visibleLayers={visibleLayers} onLayerState={setLayerState} /></Suspense>
          </ClientOnly>
        </div>
        <aside className="space-y-4">
          <div className="card-surface p-4"><LocationSearch onPick={(r) => setSel(r)} /></div>
          <div className="card-surface p-4">
            {sel ? <LocationReport {...sel} /> : <p className="text-sm text-muted-foreground">No location selected yet. Search above or click the map.</p>}
          </div>
        </aside>
      </div>
      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="card-surface p-4">
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold">Data layers</h2><DemoBadge>1 dataset available</DemoBadge></div>
          <div className="mt-3 border-b pb-4">
            <p className="text-sm font-semibold">Beneficial land use sites — click a layer to turn it on or off:</p>
            <div className="mt-2 space-y-2">
              {LAND_USE_CATEGORIES.map((category) => (
                <label key={category.key} className="flex items-center gap-2 text-sm font-semibold">
                  <Checkbox checked={visibleLayers[category.key] !== false} onCheckedChange={(checked) => setVisibleLayers((v) => ({ ...v, [category.key]: checked === true }))} aria-label={`${category.label} layer`} />
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${category.dotClass}`} />
                  {category.label}
                  <span className="font-normal text-muted-foreground">({category.count.toLocaleString()} {category.count === 1 ? "record" : "records"})</span>
                </label>
              ))}
            </div>
            <p role="status" className="mt-2 text-sm text-muted-foreground">{layerState === "loading" ? "Loading records…" : layerState === "error" ? "Records could not load. Reload the page to retry." : `${LAND_USE_DATA.mapped.toLocaleString()} records across ${LAND_USE_CATEGORIES.length} layers`} · {LAND_USE_DATA.source} · {LAND_USE_DATA.date}</p>
            <p className="mt-2 text-xs text-muted-foreground">{LAND_USE_DATA.total.toLocaleString()} uploaded records; {LAND_USE_DATA.excluded} excluded for inconsistent coordinates. Points represent listed land-application records, not parcel boundaries, confirmed application, or measured contamination. All recorded statuses are included; multiple records may share a location.</p>
            <p className="mt-2 text-xs text-muted-foreground">Coordinates were converted using the supplied Web Mercator projection; the descriptive metadata references an older, conflicting projection and record count. Field definitions and source accuracy still require review. Client names and identifiers are omitted.</p>
            <a href="https://www.pasda.psu.edu/" target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-primary underline">Metadata source: PA DEP via PASDA ↗</a>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Other layers are awaiting data. No risk score is available until the assessment methodology is developed and validated.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LAYERS.map((l) => <label key={l} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground"><input type="checkbox" disabled /> {l}</label>)}
          </div>
        </div>
      </div>
    </>
  );
}
