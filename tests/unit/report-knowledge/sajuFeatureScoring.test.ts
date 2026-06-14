import { describe, expect, it } from "vitest";

import { scoreSajuFeatures } from "../../../src/lib/report-knowledge/sajuFeatureScoring";
import type { SajuFeatureScore } from "../../../src/lib/report-knowledge/sajuFeatureTypes";

function scoreOf(
  featureId: string,
  scores: readonly SajuFeatureScore[],
): SajuFeatureScore {
  const score = scores.find((item) => item.featureId === featureId);

  if (score === undefined) {
    throw new Error(`Missing score: ${featureId}`);
  }

  return score;
}

describe("saju feature scoring", () => {
  it("boosts vivid topic-relevant features for narrative use", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["sinsal_dohwa", "ten_god_pian_cai"],
      topic: "love",
    });
    const dohwa = scoreOf("sinsal_dohwa", scores);
    const pianCai = scoreOf("ten_god_pian_cai", scores);

    expect(dohwa.score).toBeGreaterThan(pianCai.score);
    expect(scores[0]?.reasons).toEqual(expect.arrayContaining(["vividness:5"]));
  });

  it("keeps warning features from dominating all top selections by score", () => {
    const scores = scoreSajuFeatures({
      featureIds: [
        "twelve_sinsal_geopsal",
        "twelve_sinsal_jaesal",
        "sinsal_wonjin",
        "gwiin_jaego",
        "twelve_sinsal_banan",
      ],
      topic: "growth",
    });
    const topPolarities = scores.slice(0, 3).map((score) => score.polarity);

    expect(topPolarities).not.toEqual(["warning", "warning", "warning"]);
  });

  it("scores mixed features as useful report material", () => {
    const scores = scoreSajuFeatures({
      featureIds: ["sinsal_baekho", "element_water_missing"],
      topic: "growth",
    });
    const baekho = scoreOf("sinsal_baekho", scores);

    expect(baekho.polarity).toBe("mixed");
    expect(baekho.score).toBeGreaterThan(5);
  });

  it("applies duplicate category penalty", () => {
    const singleScore = scoreOf(
      "sinsal_hongyeom",
      scoreSajuFeatures({
        featureIds: ["sinsal_hongyeom"],
        topic: "love",
      }),
    );
    const duplicateScore = scoreOf(
      "sinsal_hongyeom",
      scoreSajuFeatures({
        featureIds: ["sinsal_dohwa", "sinsal_hongyeom"],
        topic: "love",
      }),
    );

    expect(duplicateScore.score).toBeLessThan(singleScore.score);
    expect(duplicateScore.reasons.some((reason) => reason.includes("duplicate category penalty"))).toBe(
      true,
    );
  });
});
