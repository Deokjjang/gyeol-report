import { describe, expect, it } from "vitest";

import { scoreSajuFeatures } from "../../../src/lib/report-knowledge/sajuFeatureScoring";
import { selectSajuFeaturesForChapter } from "../../../src/lib/report-knowledge/sajuFeatureSelector";

function selectedIds(selection: {
  readonly selected: readonly { readonly featureId: string }[];
}): readonly string[] {
  return selection.selected.map((score) => score.featureId);
}

describe("saju feature selector", () => {
  it("selects money and work features for work_money_study", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
        "twelve_sinsal_banan",
        "sinsal_wonjin",
      ],
      topic: "money",
    });
    const selection = selectSajuFeaturesForChapter(scores, "work_money_study");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining([
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
        "twelve_sinsal_banan",
      ]),
    );
  });

  it("selects attraction and relationship-tension features for love_relationships", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "sinsal_dohwa",
        "sinsal_hongyeom",
        "sinsal_wonjin",
        "gwiin_munchang",
      ],
      topic: "love",
    });
    const selection = selectSajuFeaturesForChapter(scores, "love_relationships");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining(["sinsal_dohwa", "sinsal_hongyeom", "sinsal_wonjin"]),
    );
  });

  it("selects element remedies and warning features for risk_and_growth", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "element_water_missing",
        "element_fire_missing",
        "element_earth_excess",
        "sinsal_baekho",
        "gwiin_cheoneul",
      ],
      topic: "growth",
    });
    const selection = selectSajuFeaturesForChapter(scores, "risk_and_growth");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining([
        "element_water_missing",
        "element_fire_missing",
        "element_earth_excess",
        "sinsal_baekho",
      ]),
    );
  });

  it("keeps final_message balanced with positive and warning or mixed features", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "gwiin_cheoneul",
        "twelve_sinsal_banan",
        "element_water_missing",
        "sinsal_baekho",
      ],
      topic: "growth",
    });
    const selection = selectSajuFeaturesForChapter(scores, "final_message");

    expect(selection.positive.length).toBeGreaterThanOrEqual(1);
    expect(selection.warningOrMixed.length).toBeGreaterThanOrEqual(1);
    expect(selection.vivid).not.toBeNull();
    expect(selection.practical).not.toBeNull();
  });
});
