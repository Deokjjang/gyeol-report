import { describe, expect, it } from "vitest";

import { selectMbtiCompatibilityCandidates } from "../../../src/lib/report-knowledge/mbtiCompatibilityCandidateEngine";

describe("REPORT-17 MBTI compatibility candidate engine", () => {
  it("does not return candidate recommendations for comprehensive reports", () => {
    expect(
      selectMbtiCompatibilityCandidates({
        userMbti: "INTP",
        relationshipNeeds: ["논리적 대화"],
        compatibleTraitConditions: ["감정을 강요하지 않는 사람"],
        frictionTraitConditions: ["즉답을 압박하는 태도"],
        productType: "comprehensive",
      }),
    ).toEqual([]);
  });

  it("returns data-driven candidates for compatibility products", () => {
    const candidates = selectMbtiCompatibilityCandidates({
      userMbti: "INTP",
      relationshipNeeds: ["논리적 대화", "혼자 생각할 시간"],
      compatibleTraitConditions: ["감정을 강요하지 않는 사람"],
      frictionTraitConditions: ["즉답을 압박하는 태도"],
      productType: "compatibility",
      maxCandidates: 3,
    });

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.length).toBeLessThanOrEqual(3);
    for (const candidate of candidates) {
      expect(candidate.candidateType).not.toBe("INTP");
      expect(candidate.matchReasons.length).toBeGreaterThan(0);
      expect(candidate.frictionRisks.length).toBeGreaterThan(0);
      expect(JSON.stringify(candidate)).not.toContain("소울메이트");
      expect(JSON.stringify(candidate)).not.toContain("운명");
    }
  });
});
