import { INDICATORS, inPA } from "@/lib/data";
import { StatusPill } from "./Layout";

/** Result panel for a selected location. Shows no score because the model is not built. */
export function LocationReport({ lat, lng, label }: { lat: number; lng: number; label?: string }) {
  const outside = !inPA(lat, lng);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Selected location</p>
        <p className="font-semibold">{label ?? "Map selection"}</p>
        <p className="text-sm text-muted-foreground">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
      </div>
      {outside && <p className="rounded-md bg-warning p-2 text-sm text-warning-foreground">This point is outside Pennsylvania. The tool only covers PA.</p>}
      <div className="rounded-lg bg-muted p-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Risk assessment</p>
        <div className="mt-1 flex flex-wrap gap-2"><StatusPill status="Assessment Under Development" /><StatusPill status="Insufficient Data" /></div>
        <p className="mt-2 text-sm text-muted-foreground">No relative risk score is shown because the scoring model has not been developed or validated.</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Environmental indicators</p>
        <ul className="space-y-2">
          {INDICATORS.map((i) => (
            <li key={i.key} className="rounded-md border p-2.5 text-sm">
              <div className="flex items-start justify-between gap-2"><span className="font-medium">{i.label}</span><span className="shrink-0 text-xs text-muted-foreground">{i.status}</span></div>
              <p className="mt-1 text-xs text-muted-foreground">Planned source: {i.source} · Date: —</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">Contributing factors will be explained here once datasets are connected and the methodology is documented.</p>
    </div>
  );
}
