import { describe, expect, it } from "vitest";

import {
  getSajuFeatureDisplayPolicy,
  shouldShowFeatureInBasicTable,
  shouldShowFeatureInNarrative,
  shouldShowFeatureInSpotlight,
} from "../../../src/lib/report-knowledge/sajuFeatureDisplayPolicy";

describe("Saju feature display policy", () => {
  it("marks core visible and supplementary features for product display", () => {
    expect(getSajuFeatureDisplayPolicy("gwiin_cheoneul")).toMatchObject({
      labelKo: "천을귀인",
      visibility: "visible",
      displayGroup: "good_fortune",
      showInBasicTable: true,
      showInSpotlight: true,
      showInNarrative: true,
    });
    expect(getSajuFeatureDisplayPolicy("gwiin_jaego")).toMatchObject({
      labelKo: "재고귀인",
      visibility: "supplementary",
      displayGroup: "good_fortune",
      showInSpotlight: true,
    });
    expect(getSajuFeatureDisplayPolicy("gwiin_geumyeorok")).toMatchObject({
      labelKo: "금여록",
      visibility: "supplementary",
      displayGroup: "good_fortune",
      showInSpotlight: true,
    });
    expect(getSajuFeatureDisplayPolicy("element_water_missing")).toMatchObject({
      labelKo: "수 부족",
      visibility: "core",
      displayGroup: "balance",
    });
  });

  it("keeps school-variant items diagnostic-only by default", () => {
    expect(getSajuFeatureDisplayPolicy("sinsal_baekho")).toMatchObject({
      visibility: "diagnostic",
      displayGroup: "diagnostic_only",
      showInBasicTable: false,
      showInSpotlight: false,
      showInNarrative: false,
    });
    expect(getSajuFeatureDisplayPolicy("twelve_sinsal_banan")).toMatchObject({
      visibility: "diagnostic",
      displayGroup: "diagnostic_only",
      showInBasicTable: false,
      showInSpotlight: false,
      showInNarrative: false,
    });
    expect(shouldShowFeatureInBasicTable("sinsal_baekho")).toBe(false);
    expect(shouldShowFeatureInSpotlight("twelve_sinsal_banan")).toBe(false);
    expect(shouldShowFeatureInSpotlight("sinsal_banan")).toBe(false);
    expect(shouldShowFeatureInNarrative("sinsal_baekho")).toBe(false);
  });

  it("does not block unknown computed features by default", () => {
    expect(shouldShowFeatureInBasicTable("future_feature")).toBe(true);
    expect(shouldShowFeatureInSpotlight("future_feature")).toBe(true);
    expect(shouldShowFeatureInNarrative("future_feature")).toBe(true);
  });
});
