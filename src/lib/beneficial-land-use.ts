import asset from "@/assets/beneficial-land-use.asset.json";

export interface LandUseFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: { record: number; landUse: string; siteStatus: string };
}
export interface LandUseCollection { type: "FeatureCollection"; features: LandUseFeature[] }
export type LayerState = "loading" | "ready" | "error";

export const LAND_USE_DATA = {
  source: "PA DEP · user-supplied files",
  date: "October 2026",
  total: 1129,
  mapped: 1125,
  excluded: 4,
};

export function isMappableCoordinate(lng: number, lat: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= 39.72 && lat <= 42.27 && lng >= -80.52 && lng <= -74.69;
}

export async function loadLandUses(signal: AbortSignal): Promise<LandUseCollection> {
  const response = await fetch(asset.url, { signal });
  if (!response.ok) throw new Error("Dataset unavailable");
  const data = await response.json() as LandUseCollection;
  if (data.type !== "FeatureCollection" || !Array.isArray(data.features) || data.features.length !== LAND_USE_DATA.mapped ||
    data.features.some((f) => f.geometry?.type !== "Point" || !isMappableCoordinate(f.geometry.coordinates[0], f.geometry.coordinates[1]))) {
    throw new Error("Invalid mapped dataset");
  }
  return data;
}