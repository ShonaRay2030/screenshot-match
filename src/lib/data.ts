// Shared types, demo seed data, and storage helpers (browser-safe, no map imports).
import { useEffect, useState } from "react";

export type AssessmentStatus = "Assessment Under Development" | "Insufficient Data";

export interface Indicator {
  key: string;
  label: string;
  description: string;
  doesNotTell: string;
  source: string;
  status: "Not yet connected";
}

// Indicator slots the risk model is expected to use. None carry values yet.
export const INDICATORS: Indicator[] = [
  { key: "wastewater", label: "Distance to wastewater discharge points", description: "How close the location is to permitted discharge outfalls.", doesNotTell: "Whether any plastic particles actually reached your soil.", source: "EPA ECHO / NPDES permits", status: "Not yet connected" },
  { key: "waterway", label: "Receiving waterways & irrigation sources", description: "Streams or rivers downstream of discharges that may be used for irrigation.", doesNotTell: "The water quality of your specific irrigation source.", source: "PA DEP / USGS hydrography", status: "Not yet connected" },
  { key: "facility", label: "Nearby relevant facilities", description: "Facility types and operational status near the location.", doesNotTell: "Any facility's actual plastic emissions.", source: "EPA ECHO facility records", status: "Not yet connected" },
  { key: "landuse", label: "Agricultural land use context", description: "Broad land-use classification of the surrounding area.", doesNotTell: "Your own farm's practices or inputs.", source: "Public land-cover datasets", status: "Not yet connected" },
];

export const FARM_TYPES = ["Row crops", "Vegetables", "Dairy", "Livestock", "Orchard", "Hay / Pasture", "Mixed", "Other"];

export interface Assessment { date: string; status: AssessmentStatus; note: string }
export interface Farm {
  id: string; name: string; county: string; types: string[];
  lat?: number; lng?: number; notes: string[]; history: Assessment[]; demo?: boolean;
}

export const PA_COUNTIES = ["Adams","Allegheny","Armstrong","Beaver","Bedford","Berks","Blair","Bradford","Bucks","Butler","Cambria","Cameron","Carbon","Centre","Chester","Clarion","Clearfield","Clinton","Columbia","Crawford","Cumberland","Dauphin","Delaware","Elk","Erie","Fayette","Forest","Franklin","Fulton","Greene","Huntingdon","Indiana","Jefferson","Juniata","Lackawanna","Lancaster","Lawrence","Lebanon","Lehigh","Luzerne","Lycoming","McKean","Mercer","Mifflin","Monroe","Montgomery","Montour","Northampton","Northumberland","Perry","Philadelphia","Pike","Potter","Schuylkill","Snyder","Somerset","Sullivan","Susquehanna","Tioga","Union","Venango","Warren","Washington","Wayne","Westmoreland","Wyoming","York"];

export const seedFarms = (): Farm[] => [
  { id: "demo-1", name: "Example: Creekside Acres", county: "Lancaster", types: ["Vegetables", "Dairy"], notes: ["Example note: irrigation draws from a nearby creek."], history: [{ date: "2026-01-01", status: "Assessment Under Development", note: "Demo entry — no real data." }], demo: true },
  { id: "demo-2", name: "Example: Ridge Orchard", county: "Adams", types: ["Orchard"], notes: [], history: [], demo: true },
];

export type StepState = "To Do" | "In Progress" | "Completed";

/** localStorage-backed state that is hydration-safe (reads storage after mount). */
export function useStored<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch { /* ignore corrupted storage */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export interface GeoResult { label: string; lat: number; lng: number }

const PA_BOUNDS = { s: 39.72, n: 42.27, w: -80.52, e: -74.69 };
export const inPA = (lat: number, lng: number) =>
  lat >= PA_BOUNDS.s && lat <= PA_BOUNDS.n && lng >= PA_BOUNDS.w && lng <= PA_BOUNDS.e;

/** Search by "lat, lng" or address/ZIP via OpenStreetMap Nominatim (free, no key). */
export async function geocode(q: string): Promise<GeoResult[]> {
  const m = q.trim().match(/^(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)$/);
  if (m) {
    const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
    return [{ label: `Coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng }];
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=us&viewbox=${PA_BOUNDS.w},${PA_BOUNDS.n},${PA_BOUNDS.e},${PA_BOUNDS.s}&bounded=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data: { display_name: string; lat: string; lon: string }[] = await res.json();
  return data.map((d) => ({ label: d.display_name, lat: +d.lat, lng: +d.lon }));
}
