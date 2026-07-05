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
  normalizeCompatibilityRelationCategory,
  requireCompatibilityRelationCategory,
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

  it("supports exactly seven canonical compatibility relationship categories", () => {
    expect(compatibilityRelationshipTypes).toEqual([
      "love",
      "marriage",
      "parentChild",
      "coworker",
      "managerReport",
      "businessPartner",
      "friendship",
    ]);
  });

  it("has labels and focus text for all canonical relationship types", () => {
    expect(getCompatibilityRelationshipTypeLabel("love")).toBe("연애");
    expect(getCompatibilityRelationshipTypeLabel("marriage")).toBe("결혼");
    expect(getCompatibilityRelationshipTypeLabel("parentChild")).toBe("부모·자식");
    expect(getCompatibilityRelationshipTypeLabel("coworker")).toBe("직장 동료");
    expect(getCompatibilityRelationshipTypeLabel("managerReport")).toBe("상사·부하");
    expect(getCompatibilityRelationshipTypeLabel("businessPartner")).toBe("사업/협업");
    expect(getCompatibilityRelationshipTypeLabel("friendship")).toBe("친구/인간관계");

    for (const relationshipType of compatibilityRelationshipTypes) {
      expect(getCompatibilityRelationshipTypeFocus(relationshipType).length).toBeGreaterThan(0);
    }
  });

  it("maps legacy relationship inputs to canonical categories", () => {
    expect(normalizeCompatibilityRelationCategory("some")).toBe("love");
    expect(normalizeCompatibilityRelationCategory("dating")).toBe("love");
    expect(normalizeCompatibilityRelationCategory("romance")).toBe("love");
    expect(normalizeCompatibilityRelationCategory("family")).toBe("parentChild");
    expect(normalizeCompatibilityRelationCategory("parent_child")).toBe("parentChild");
    expect(normalizeCompatibilityRelationCategory("workplace_colleague")).toBe("coworker");
    expect(normalizeCompatibilityRelationCategory("colleague")).toBe("coworker");
    expect(normalizeCompatibilityRelationCategory("boss_subordinate")).toBe("managerReport");
    expect(normalizeCompatibilityRelationCategory("manager_report")).toBe("managerReport");
    expect(normalizeCompatibilityRelationCategory("business_work_partner")).toBe(
      "businessPartner",
    );
    expect(normalizeCompatibilityRelationCategory("business_partner")).toBe(
      "businessPartner",
    );
    expect(normalizeCompatibilityRelationCategory("friend_social")).toBe("friendship");
    expect(normalizeCompatibilityRelationCategory("friend")).toBe("friendship");
  });

  it("falls back unknown external category to love and keeps strict helper for invariants", () => {
    expect(normalizeCompatibilityRelationCategory("unknown")).toBe("love");
    expect(normalizeCompatibilityRelationCategory(undefined)).toBe("love");
    expect(() => requireCompatibilityRelationCategory("unknown")).toThrow(
      "Unsupported compatibility relation category: unknown",
    );
  });

  it("uses relationship-specific score labels", () => {
    expect(getCompatibilityScoreDisplayLabels("love").attraction).toBe("끌림");
    expect(getCompatibilityScoreDisplayLabels("marriage").attraction).toBe("부부 온도");
    expect(getCompatibilityScoreDisplayLabels("some").attraction).toBe("끌림");
    expect(getCompatibilityScoreDisplayLabels("parentChild").attraction).toBe("정서 연결");
    expect(getCompatibilityScoreDisplayLabels("coworker").attraction).toBe("협업 리듬");
    expect(getCompatibilityScoreDisplayLabels("managerReport").attraction).toBe(
      "업무 신뢰",
    );
    expect(getCompatibilityScoreDisplayLabels("businessPartner").attraction).toBe(
      "협업 시너지",
    );
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
    const romanceText =
      "연애 데이트 애인 설렘 호감 끌림 관계의 온도 고마움과 자기 의견 가볍게 쉬는 시간 즐거움보다 의무 마음이 식었다 관계가 쉽게 흩어지지 않고 상대가 내 부족한 부분을 관계가 입체적으로 굴러갑니다 방향과 구조를 잡고 온도와 반응을 살려";
    const business = adaptCompatibilityTextForRelationshipType(
      romanceText,
      "business_work_partner",
    );
    const family = adaptCompatibilityTextForRelationshipType(romanceText, "family");
    const friendship = adaptCompatibilityTextForRelationshipType(
      "연애 데이트 애인 결혼 설렘",
      "friendship",
    );

    expect(business).not.toMatch(
      /데이트|연애|애인|설렘|호감|고마움과 자기 의견|즐거움보다 의무/u,
    );
    expect(business).toContain("협업 시너지");
    expect(business).toContain("확인 피드백과 수정 의견");
    expect(business).toContain("짧은 재정비 시간");
    expect(business).toContain("자율성보다 관리 부담");
    expect(business).toContain("협업 구조가 쉽게 흔들리지 않고");
    expect(business).toContain("상대 역할에 내 책임까지");
    expect(business).toContain("협업이 입체적으로 굴러갑니다");
    expect(family).not.toMatch(/데이트|연애|애인|설렘|호감|끌림/u);
    expect(family).toContain("정서 연결");
    expect(family).toContain("생활 기준을 정리하고");
    expect(family).toContain("말의 통로와 정서 반응을 살려");
    expect(family).toContain("가족 관계가 덜 막히고 편안해집니다");
    expect(friendship).not.toMatch(/데이트|연애|애인|결혼|설렘/u);
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
    expect(getCompatibilityScoreCaution("coworker", 70)).toContain("직장 동료");
    expect(getCompatibilityScoreCaution("managerReport", 70)).toContain("상사·부하");
  });
});
