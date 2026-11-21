import asset from "@/assets/pa-zip-counts.asset.json";

export interface ZipFeature { type: "Feature"; geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon; properties: { zip: string; count: number } }
export interface ZipCollection { type: "FeatureCollection"; features: ZipFeature[] }

export const ZIP_BINS = [
  { min: 0, max: 0, label: "0", cssVar: "--choro-0", dotClass: "bg-choro-0" },
  { min: 1, max: 1, label: "1", cssVar: "--choro-1", dotClass: "bg-choro-1" },
  { min: 2, max: 3, label: "2–3", cssVar: "--choro-2", dotClass: "bg-choro-2" },
  { min: 4, max: 8, label: "4–8", cssVar: "--choro-3", dotClass: "bg-choro-3" },
  { min: 9, max: Infinity, label: "9+", cssVar: "--choro-4", dotClass: "bg-choro-4" },
] as const;

export function binFor(count: number) {
  return ZIP_BINS.find((b) => count >= b.min && count <= b.max) ?? ZIP_BINS[0];
}

export async function loadZipCounts(signal: AbortSignal): Promise<ZipCollection> {
  const res = await fetch(asset.url, { signal });
  if (!res.ok) throw new Error("ZIP dataset unavailable");
  const data = await res.json() as ZipCollection;
  if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) throw new Error("Invalid ZIP dataset");
  return data;
}
