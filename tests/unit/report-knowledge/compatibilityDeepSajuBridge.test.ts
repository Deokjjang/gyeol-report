import { describe, expect, it } from "vitest";

import { buildCompatibilityEvidencePacketFromFixtureId } from "../../../src/lib/report-knowledge/compatibilityEvidenceBuilder";
import {
  buildCompatibilityDeepSajuBridge,
  formatWeakElementFlow,
} from "../../../src/lib/report-knowledge/compatibilityDeepSajuBridge";

describe("REPORT-18F compatibility deep Saju bridge", () => {
  it("builds diversified deep notes for deokmin and sodam", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const bridge = buildCompatibilityDeepSajuBridge({
      personA: packet.personAChartSummary,
      personB: packet.personBChartSummary,
    });
    const layers = new Set(bridge.notes.map((note) => note.layer));
    const text = JSON.stringify(bridge);

    expect(bridge.notes.length).toBeGreaterThanOrEqual(5);
    expect([...layers]).toEqual(
      expect.arrayContaining([
        "day_master_relation",
        "cross_ten_god",
        "element_complement",
        "combined_element_climate",
        "branch_trine",
      ]),
    );
    expect(text).toContain("갑목");
    expect(text).toContain("정화");
    expect(text).toContain("상관");
    expect(text).toContain("정인");
    expect(text).toContain("오행 상호 보완");
    expect(text).toContain("토 7");
    expect(text).toContain("亥卯未");
    expect(text).toContain("申子辰");
    expect(text).toContain("丑未");
    expect(text).toContain("申亥");
    expect(text).not.toContain("백호대살");
  });

  it("adds interpretation translation fields to every deep note", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const bridge = packet.deepSajuBridge;

    expect(bridge?.notes.length).toBeGreaterThan(0);
    for (const note of bridge?.notes ?? []) {
      expect(note.principleExplanation.length).toBeGreaterThan(0);
      expect(note.relationshipTranslation.length).toBeGreaterThan(0);
      expect(note.positiveExpression.length).toBeGreaterThan(0);
      expect(note.riskExpression.length).toBeGreaterThan(0);
      expect(note.everydayScene.length).toBeGreaterThan(0);
      expect(note.actionRule.length).toBeGreaterThan(0);
      expect(note.plainKoreanSummary.length).toBeGreaterThan(0);
    }
  });

  it("translates day-master and cross ten-god calculations into relationship language", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const dayMaster = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "day_master_relation",
    );
    const crossTenGod = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "cross_ten_god",
    );

    expect(dayMaster?.principleExplanation).toContain("목은 화를 생합니다");
    expect(dayMaster?.relationshipTranslation).toContain("갑목");
    expect(dayMaster?.relationshipTranslation).toContain("정화");
    expect(dayMaster?.everydayScene).toContain("이 방향으로 해보자");
    expect(dayMaster?.plainKoreanSummary).toContain("표현과 온도를 살리는 관계");
    expect(crossTenGod?.principleExplanation).toContain("상관은 표현");
    expect(crossTenGod?.principleExplanation).toContain("정인은 의미");
    expect(crossTenGod?.everydayScene).toContain("말의 속도 차이");
    expect(crossTenGod?.actionRule).toContain("바로 평가하지 말고");
  });

  it("uses the actual day-master relation for business and family fixtures", () => {
    const business = buildCompatibilityEvidencePacketFromFixtureId(
      "business-work-partner-sample",
    );
    const family = buildCompatibilityEvidencePacketFromFixtureId("family-unknown-mbti");
    const businessBridge = buildCompatibilityDeepSajuBridge({
      personA: business.personAChartSummary,
      personB: business.personBChartSummary,
      relationshipType: "business_work_partner",
    });
    const familyBridge = buildCompatibilityDeepSajuBridge({
      personA: family.personAChartSummary,
      personB: family.personBChartSummary,
      relationshipType: "family",
    });
    const businessDayMaster = businessBridge.notes.find(
      (note) => note.layer === "day_master_relation",
    );
    const familyDayMaster = familyBridge.notes.find(
      (note) => note.layer === "day_master_relation",
    );
    const businessText = JSON.stringify(businessDayMaster);
    const familyText = JSON.stringify(familyDayMaster);

    expect(businessDayMaster?.relationLabel).toBe("무토 -> 경금");
    expect(businessDayMaster?.principleExplanation).toContain("토는 금을 생합니다");
    expect(businessDayMaster?.relationshipTranslation).toContain("무토");
    expect(businessDayMaster?.relationshipTranslation).toContain("경금");
    expect(businessDayMaster?.plainKoreanSummary).toContain("판단과 실행");
    expect(businessText).not.toContain("갑목");
    expect(businessText).not.toContain("정화");

    expect(familyDayMaster?.relationLabel).toBe("계수 -> 무토");
    expect(familyDayMaster?.principleExplanation).toContain("토는 수를 제어합니다");
    expect(familyDayMaster?.relationshipTranslation).toContain("계수");
    expect(familyDayMaster?.relationshipTranslation).toContain("무토");
    expect(familyText).not.toContain("갑목");
    expect(familyText).not.toContain("정화");
  });

  it("uses five-element-specific scenes and category action rules", () => {
    const love = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const business = buildCompatibilityEvidencePacketFromFixtureId(
      "business-work-partner-sample",
    );
    const family = buildCompatibilityEvidencePacketFromFixtureId("family-unknown-mbti");
    const businessBridge = buildCompatibilityDeepSajuBridge({
      personA: business.personAChartSummary,
      personB: business.personBChartSummary,
      relationshipType: "business_work_partner",
    });
    const familyBridge = buildCompatibilityDeepSajuBridge({
      personA: family.personAChartSummary,
      personB: family.personBChartSummary,
      relationshipType: "family",
    });
    const loveDayMaster = love.deepSajuBridge?.notes.find(
      (note) => note.layer === "day_master_relation",
    );
    const businessDayMaster = businessBridge.notes.find(
      (note) => note.layer === "day_master_relation",
    );
    const familyDayMaster = familyBridge.notes.find(
      (note) => note.layer === "day_master_relation",
    );

    expect(loveDayMaster?.everydayScene).toContain("이 방향으로 해보자");
    expect(loveDayMaster?.everydayScene).toContain("자기 생각");
    expect(loveDayMaster?.actionRule).toContain("고마움과 자기 의견");

    expect(businessDayMaster?.everydayScene).toContain("기준과 틀");
    expect(businessDayMaster?.everydayScene).toContain("판단과 실행");
    expect(businessDayMaster?.everydayScene).not.toContain("이 방향으로 해보자");
    expect(businessDayMaster?.actionRule).toContain("검토할 시간");
    expect(businessDayMaster?.actionRule).toContain("수정 의견");

    expect(familyDayMaster?.everydayScene).toContain("생각과 감정이 넓게 흐를 때");
    expect(familyDayMaster?.everydayScene).toContain("현실 기준과 생활 규칙");
    expect(familyDayMaster?.actionRule).toContain("받아들일 시간");
    expect(familyDayMaster?.actionRule).toContain("불편한 지점");
  });

  it("uses the actual cross ten-god pair instead of a fixed 상관/정인 explanation", () => {
    const business = buildCompatibilityEvidencePacketFromFixtureId(
      "business-work-partner-sample",
    );
    const family = buildCompatibilityEvidencePacketFromFixtureId("family-unknown-mbti");
    const love = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const businessCrossTenGod = business.deepSajuBridge?.notes.find(
      (note) => note.layer === "cross_ten_god",
    );
    const familyCrossTenGod = family.deepSajuBridge?.notes.find(
      (note) => note.layer === "cross_ten_god",
    );
    const loveCrossTenGod = love.deepSajuBridge?.notes.find(
      (note) => note.layer === "cross_ten_god",
    );

    expect(businessCrossTenGod?.relationLabel).toBe("식신/편인");
    expect(businessCrossTenGod?.principleExplanation).toContain("식신은 생각");
    expect(businessCrossTenGod?.principleExplanation).toContain("편인은 독립적인 해석");
    expect(businessCrossTenGod?.principleExplanation).not.toContain("상관은 표현");
    expect(businessCrossTenGod?.principleExplanation).not.toContain("정인은 의미");

    expect(familyCrossTenGod?.relationLabel).toBe("정관/정재");
    expect(familyCrossTenGod?.principleExplanation).toContain("정관은 책임");
    expect(familyCrossTenGod?.principleExplanation).toContain("정재는 안정적 관리");

    expect(loveCrossTenGod?.relationLabel).toBe("상관/정인");
    expect(loveCrossTenGod?.principleExplanation).toContain("상관은 표현");
    expect(loveCrossTenGod?.principleExplanation).toContain("정인은 의미");
  });

  it("translates element complement and combined earth-heavy climate", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const complement = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "element_complement",
    );
    const combinedClimate = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "combined_element_climate",
    );
    const complementText = JSON.stringify(complement);

    expect(complement?.principleExplanation).toContain("부족한 오행");
    expect(complement?.relationshipTranslation).toContain("덕민");
    expect(complement?.relationshipTranslation).toContain("소담");
    expect(complementText).not.toContain("결핍");
    expect(complementText).not.toContain("문제");
    expect(complementText).not.toContain("치명적");
    expect(combinedClimate?.principleExplanation).toContain("토는 현실");
    expect(combinedClimate?.positiveExpression).toContain("실질적인 계획");
    expect(combinedClimate?.riskExpression).toContain("관리표");
    expect(combinedClimate?.everydayScene).toContain("돈, 일정, 책임");
  });

  it("formats weak element flows without empty-element fallback wording", () => {
    const family = buildCompatibilityEvidencePacketFromFixtureId("family-unknown-mbti");
    const familyComplement = family.deepSajuBridge?.notes.find(
      (note) => note.layer === "element_complement",
    );
    const familyComplementText = JSON.stringify(familyComplement);

    expect(formatWeakElementFlow(["fire"])).toBe("화의 흐름");
    expect(formatWeakElementFlow(["wood", "metal"])).toBe("목과 금의 흐름");
    expect(formatWeakElementFlow(["wood", "fire", "water"])).toBe(
      "목·화·수의 흐름",
    );
    expect(familyComplementText).not.toContain("빈 오행");
    expect(familyComplementText).toContain("화의 흐름");
    expect(familyComplementText).toContain("목·화·수의 흐름");
  });

  it("translates branch trine, clash, and harm without fatal wording", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const trine = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "branch_trine",
    );
    const clash = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "branch_clash",
    );
    const harm = packet.deepSajuBridge?.notes.find(
      (note) => note.layer === "branch_harm",
    );
    const pressureText = `${JSON.stringify(clash)} ${JSON.stringify(harm)}`;

    expect(trine?.principleExplanation).toContain("삼합은");
    expect(trine?.principleExplanation).toContain("수는 감정");
    expect(trine?.principleExplanation).toContain("목은 성장");
    expect(trine?.riskExpression).not.toContain("무조건 좋");
    expect(clash?.principleExplanation).toContain("충은 정면");
    expect(harm?.principleExplanation).toContain("해는 겉으로 크게");
    expect(pressureText).toContain("작은 생활 차이");
    expect(pressureText).toContain("상황 단위로 말");
    expect(pressureText).not.toContain("나쁜 궁합");
    expect(pressureText).not.toContain("이별");
  });

  it("groups notes by attraction, friction, lifestyle, and communication", () => {
    const packet = buildCompatibilityEvidencePacketFromFixtureId("deokmin-sodam-love");
    const bridge = packet.deepSajuBridge;

    expect(bridge?.attractionNotes.length).toBeGreaterThan(0);
    expect(bridge?.frictionNotes.length).toBeGreaterThan(0);
    expect(bridge?.lifestyleNotes.length).toBeGreaterThan(0);
    expect(bridge?.communicationNotes.length).toBeGreaterThan(0);
  });
});
