import { describe, expect, it } from "vitest";

import { requireCompatibilityFixture } from "../../../src/lib/report-knowledge/compatibilityFixtureMatrix";
import {
  adaptCompatibilityTextForRelationshipType,
  compatibilityRelationshipTypes,
  getCompatibilityScoreCaution,
  getCompatibilityRelationshipTypeFocus,
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityScoreDisplayLabels,
  getCompatibilityScoreExplanation,
} from "../../../src/lib/report-knowledge/compatibilityTypes";

describe("REPORT-18A compatibility types", () => {
  it("uses the saju mbti compatibility product contract", () => {
    const fixture = requireCompatibilityFixture("deokmin-sodam-love");

    expect(fixture.input.productType).toBe("saju_mbti_compatibility");
    expect(fixture.input.productVersion).toBe("1.0");
    expect(fixture.input.relationshipType).toBe("love");
    expect(fixture.input.personA.birthTimeKnown).toBe(true);
    expect(fixture.input.personB.mbti).toBe("INTP");
  });

  it("supports exactly six compatibility relationship categories for v1", () => {
    expect(compatibilityRelationshipTypes).toEqual([
      "love",
      "marriage",
      "some",
      "friendship",
      "family",
      "business_work_partner",
    ]);
  });

  it("has labels and focus text for all six relationship types", () => {
    expect(getCompatibilityRelationshipTypeLabel("love")).toBe("연애");
    expect(getCompatibilityRelationshipTypeLabel("marriage")).toBe("결혼/장기연애");
    expect(getCompatibilityRelationshipTypeLabel("some")).toBe("썸");
    expect(getCompatibilityRelationshipTypeLabel("friendship")).toBe("친구");
    expect(getCompatibilityRelationshipTypeLabel("family")).toBe("가족");
    expect(getCompatibilityRelationshipTypeLabel("business_work_partner")).toBe(
      "동업/업무 파트너",
    );

    for (const relationshipType of compatibilityRelationshipTypes) {
      expect(getCompatibilityRelationshipTypeFocus(relationshipType).length).toBeGreaterThan(0);
    }
  });

  it("uses relationship-specific score labels", () => {
    expect(getCompatibilityScoreDisplayLabels("love").attraction).toBe("끌림");
    expect(getCompatibilityScoreDisplayLabels("marriage").attraction).toBe("부부 온도");
    expect(getCompatibilityScoreDisplayLabels("some").attraction).toBe("호감 신호");
    expect(getCompatibilityScoreDisplayLabels("friendship").attraction).toBe("친밀감");
    expect(getCompatibilityScoreDisplayLabels("family").attraction).toBe("정서 연결");
    expect(getCompatibilityScoreDisplayLabels("business_work_partner").attraction).toBe(
      "협업 시너지",
    );
  });

  it("keeps non-romance score explanations away from romance wording", () => {
    const businessExplanation = getCompatibilityScoreExplanation({
      relationshipType: "business_work_partner",
      category: "conflictRecovery",
      score: 51,
    });
    const familyExplanation = getCompatibilityScoreExplanation({
      relationshipType: "family",
      category: "communication",
      score: 61,
    });
    const friendshipExplanation = getCompatibilityScoreExplanation({
      relationshipType: "friendship",
      category: "lifestyleRhythm",
      score: 70,
    });

    expect(businessExplanation).toContain("기준과 책임 범위");
    expect(businessExplanation).not.toMatch(/연애|데이트|호감/u);
    expect(familyExplanation).toContain("말의 통로");
    expect(familyExplanation).not.toMatch(/연애|데이트|호감/u);
    expect(friendshipExplanation).toContain("거리 조절");
    expect(friendshipExplanation).not.toMatch(/애인|결혼/u);
  });

  it("adapts romance language away from non-romance relationship types", () => {
    const romanceText = "연애 데이트 애인 설렘 호감 끌림 관계의 온도";
    const business = adaptCompatibilityTextForRelationshipType(
      romanceText,
      "business_work_partner",
    );
    const family = adaptCompatibilityTextForRelationshipType(romanceText, "family");
    const friendship = adaptCompatibilityTextForRelationshipType(
      "연애 데이트 애인 결혼",
      "friendship",
    );

    expect(business).not.toMatch(/데이트|연애|애인|설렘|호감/u);
    expect(business).toContain("협업 시너지");
    expect(family).not.toMatch(/데이트|연애|애인|설렘|호감/u);
    expect(family).toContain("정서 연결");
    expect(friendship).not.toMatch(/데이트|연애|애인|결혼/u);
    expect(adaptCompatibilityTextForRelationshipType(romanceText, "love")).toBe(
      romanceText,
    );
  });

  it("uses relationship-specific score cautions", () => {
    expect(getCompatibilityScoreCaution("love", 70)).toContain("끌림");
    expect(getCompatibilityScoreCaution("business_work_partner", 70)).toContain(
      "역할·권한·책임",
    );
    expect(getCompatibilityScoreCaution("business_work_partner", 70)).not.toContain(
      "끌림",
    );
    expect(getCompatibilityScoreCaution("family", 70)).toContain("말의 통로");
    expect(getCompatibilityScoreCaution("family", 70)).not.toContain("끌림");
  });
});
