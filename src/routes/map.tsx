import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { PageHeader, DemoBadge } from "@/components/Layout";
import { LocationSearch } from "@/components/LocationSearch";
import { LocationReport } from "@/components/LocationReport";

const PAMap = lazy(() => import("@/components/PAMap"));

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [
    { title: "Explore the Pennsylvania Map — Keystone Soil Watch" },
    { name: "description", content: "Search or click a Pennsylvania location to see which environmental indicators are available." },
    { property: "og:title", content: "Explore the Pennsylvania Map" },
    { property: "og:description", content: "Select a location to review environmental indicators and data limitations." },
  ] }),
  component: MapPage,
});

const LAYERS = ["Wastewater discharge locations", "Relevant facilities", "Waterways", "Agricultural areas (privacy-protected)", "Relative risk estimates"];

function MapPage() {
  const [sel, setSel] = useState<{ lat: number; lng: number; label?: string }>();
  const Fallback = <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">Loading map…</div>;
  return (
    <>
      <PageHeader eyebrow="Explore" title="Pennsylvania map">Search for a farm by address, ZIP, or coordinates — or click anywhere on the map. Zoom and pan freely.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[1fr_380px]">
        <div className="card-surface h-[520px] overflow-hidden">
          <ClientOnly fallback={Fallback}>
            <Suspense fallback={Fallback}><PAMap point={sel} onSelect={(lat, lng) => setSel({ lat, lng })} /></Suspense>
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
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold">Data layers</h2><DemoBadge>Awaiting data</DemoBadge></div>
          <p className="mt-1 text-sm text-muted-foreground">These layers will appear once cleaned datasets are connected. Nothing is drawn now so no facility, pollution point, or score is shown as real.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LAYERS.map((l) => <label key={l} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground"><input type="checkbox" disabled /> {l}</label>)}
          </div>
        </div>
      </div>
    </>
  );
}
