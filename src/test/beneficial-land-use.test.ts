import { describe, expect, it } from "vitest";
import { isMappableCoordinate, LAND_USE_DATA } from "@/lib/beneficial-land-use";

describe("Beneficial land use coordinate quality", () => {
  it("accepts the first transformed source location", () => {
    expect(isMappableCoordinate(-75.8348, 40.5076)).toBe(true);
  });
  it("rejects inconsistent coordinates rather than silently repairing them", () => {
    expect(isMappableCoordinate(-0.0006957981881392677, 0.00036423001676696054)).toBe(false);
  });
  it("rejects non-finite coordinates", () => {
    expect(isMappableCoordinate(NaN, 40)).toBe(false);
    expect(isMappableCoordinate(-77, Infinity)).toBe(false);
  });
  it("accounts for every uploaded record without claiming each is a unique site", () => {
    expect(LAND_USE_DATA.total).toBe(1129);
    expect(LAND_USE_DATA.mapped).toBe(1125);
    expect(LAND_USE_DATA.excluded).toBe(4);
    expect(LAND_USE_DATA.mapped + LAND_USE_DATA.excluded).toBe(LAND_USE_DATA.total);
  });
});