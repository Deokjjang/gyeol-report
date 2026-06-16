import { describe, expect, it } from "vitest";

import { buildCompatibilityEvidencePacketFromFixtureId } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import { scoreCompatibility } from "../../../src/lib/report-knowledge/compatibilityScoreEngine";

describe("REPORT-18A compatibility score engine", () => {
  it("produces deterministic score breakdown and caution", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const score = scoreCompatibility({
      sajuBridge: packet.sajuBridge,
      mbtiBridge: packet.mbtiBridge,
      relationshipType: packet.input.relationshipType,
      birthTimeConfidence: {
        personA: "known",
        personB: "known",
      },
    });

    expect(score).toEqual(packet.score);
    expect(score.totalScore).toBeGreaterThanOrEqual(35);
    expect(score.totalScore).toBeLessThanOrEqual(95);
    expect(score.breakdown.attraction).toBeGreaterThan(0);
    expect(score.scoreCaution).toContain("성공이나 실패를 단정");
  });

  it("handles unknown birth time without crashing", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("unknown-time-some");

    expect(packet.score.totalScore).toBeGreaterThanOrEqual(35);
    expect(packet.score.breakdown.longTermStability).toBeGreaterThanOrEqual(35);
    expect(packet.score.scoreLabel.length).toBeGreaterThan(0);
  });
});
