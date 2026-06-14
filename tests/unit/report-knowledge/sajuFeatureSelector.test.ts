import { describe, expect, it } from "vitest";

import { scoreSajuFeatures } from "../../../src/lib/report-knowledge/sajuFeatureScoring";
import { selectSajuFeaturesForChapter } from "../../../src/lib/report-knowledge/sajuFeatureSelector";

function selectedIds(selection: {
  readonly selected: readonly { readonly featureId: string }[];
}): readonly string[] {
  return selection.selected.map((score) => score.featureId);
}

describe("saju feature selector", () => {
  it("selects day pillar as an identity anchor", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["day_pillar_gapsin", "sinsal_hyeonchim", "gwiin_jaego"],
      topic: "identity",
    });
    const selection = selectSajuFeaturesForChapter(scores, "saju_identity");

    expect(selectedIds(selection)).toContain("day_pillar_gapsin");
  });

  it("selects day pillar for personality when the day pillar has personality topic", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["day_pillar_gapsin", "sinsal_hyeonchim", "gwiin_jaego"],
      topic: "personality",
    });
    const selection = selectSajuFeaturesForChapter(scores, "personality_pattern");

    expect(selectedIds(selection)).toContain("day_pillar_gapsin");
  });

  it("selects money and work features for work_money_study", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
        "twelve_sinsal_banan",
        "twelve_sinsal_jangseong",
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
        "twelve_sinsal_jangseong",
      ]),
    );
  });

  it("selects day pillar for work_money_study when work or money topic matches", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["day_pillar_mujin", "ten_god_pian_cai", "gwiin_jaego"],
      topic: "money",
    });
    const selection = selectSajuFeaturesForChapter(scores, "work_money_study");

    expect(selectedIds(selection)).toContain("day_pillar_mujin");
  });

  it("selects attraction and relationship-tension features for love_relationships", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "sinsal_dohwa",
        "sinsal_hongyeom",
        "sinsal_wonjin",
        "element_fire_missing",
        "element_water_missing",
        "gwiin_munchang",
      ],
      topic: "love",
    });
    const selection = selectSajuFeaturesForChapter(scores, "love_relationships");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining([
        "sinsal_dohwa",
        "sinsal_hongyeom",
        "sinsal_wonjin",
        "element_fire_missing",
        "element_water_missing",
      ]),
    );
  });

  it("selects day pillar for love_relationships when love topic matches", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["day_pillar_byeongo", "sinsal_dohwa", "sinsal_hongyeom"],
      topic: "love",
    });
    const selection = selectSajuFeaturesForChapter(scores, "love_relationships");

    expect(selectedIds(selection)).toContain("day_pillar_byeongo");
  });

  it("selects sharp personality features for personality_pattern", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "sinsal_hyeonchim",
        "sinsal_baekho",
        "sinsal_gwimun",
        "gwiin_cheoneul",
      ],
      topic: "personality",
    });
    const selection = selectSajuFeaturesForChapter(scores, "personality_pattern");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining(["sinsal_hyeonchim", "sinsal_baekho", "sinsal_gwimun"]),
    );
  });

  it("selects study features through work_money_study", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "gwiin_munchang",
        "gwiin_hakdang",
        "sinsal_gwimun",
        "sinsal_hyeonchim",
        "twelve_sinsal_banan",
      ],
      topic: "study",
    });
    const selection = selectSajuFeaturesForChapter(scores, "work_money_study");

    expect(selectedIds(selection)).toEqual(
      expect.arrayContaining([
        "gwiin_munchang",
        "gwiin_hakdang",
        "sinsal_gwimun",
        "sinsal_hyeonchim",
      ]),
    );
  });

  it("selects element remedies and warning features for risk_and_growth", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "element_water_missing",
        "element_fire_missing",
        "element_earth_excess",
        "sinsal_baekho",
        "sinsal_wonjin",
        "structure_jaeda_sinyak",
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
        "sinsal_wonjin",
        "structure_jaeda_sinyak",
      ]),
    );
  });

  it("keeps final_message balanced with positive and warning or mixed features", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "gwiin_cheoneul",
        "day_pillar_gyehae",
        "twelve_sinsal_banan",
        "element_water_missing",
        "sinsal_baekho",
      ],
      topic: "growth",
    });
    const selection = selectSajuFeaturesForChapter(scores, "final_message");

    expect(selection.positive.length).toBeGreaterThanOrEqual(1);
    expect(selection.warningOrMixed.length).toBeGreaterThanOrEqual(1);
    expect(selectedIds(selection)).toContain("day_pillar_gyehae");
    expect(selection.vivid).not.toBeNull();
    expect(selection.practical).not.toBeNull();
  });
});
