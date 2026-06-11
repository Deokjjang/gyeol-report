import { describe, expect, it } from "vitest";

import {
  buildSectionEvidence,
  findFusionRules,
  getMbtiKnowledge,
  getMbtiTopicEvidence,
  getSajuKnowledgeByIds,
} from "../../../src/lib/report-knowledge/knowledgeSelectors";

const sampleDeokminSajuIds = [
  "day_master_gabmok",
  "day_pillar_gapsin",
  "element_earth_excess",
  "element_water_missing",
  "element_fire_missing",
  "ten_god_pian_cai",
  "ten_god_zheng_cai",
  "ten_god_zheng_guan",
  "ten_god_qi_sha",
  "pattern_jaeda_sinyak",
  "pattern_no_resource",
  "pattern_no_output",
  "sinsal_hyeonchim",
  "sinsal_hongyeom",
  "gwiin_jaego",
] as const;

describe("knowledge selectors", () => {
  it("returns saju knowledge by ids in requested order", () => {
    expect(getSajuKnowledgeByIds(sampleDeokminSajuIds).map((entry) => entry.id)).toEqual(
      sampleDeokminSajuIds,
    );
  });

  it("returns MBTI knowledge by type", () => {
    expect(getMbtiKnowledge("ENTJ")).toMatchObject({
      type: "ENTJ",
      functionStack: ["Te", "Ni", "Se", "Fi"],
    });
  });

  it("builds section evidence with saju evidence before MBTI and matching fusion rules", () => {
    const evidence = buildSectionEvidence({
      sectionId: "personality",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });

    expect(Object.keys(evidence).slice(1, 3)).toEqual([
      "sajuEvidence",
      "mbtiEvidence",
    ]);
    expect(evidence.sajuEvidence.length).toBeGreaterThan(0);
    expect(evidence.mbtiEvidence.type).toBe("ENTJ");
    expect(evidence.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "ten_god_qi_sha",
        "sinsal_hyeonchim",
      ]),
    );
    expect(evidence.fusionRules.map((rule) => rule.summary)).toEqual(
      expect.arrayContaining([
        "화 부족 + ENTJ 외향성 contrast",
        "갑목/갑신 + ENTJ 지휘 욕구",
      ]),
    );
    expect(
      evidence.fusionRules.every(
        (rule) => rule.mbtiTypes === undefined || rule.mbtiTypes.includes("ENTJ"),
      ),
    ).toBe(true);
  });

  it("keeps saju evidence primary across major report topics", () => {
    const personality = buildSectionEvidence({
      sectionId: "personality",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const money = buildSectionEvidence({
      sectionId: "money_asset",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const love = buildSectionEvidence({
      sectionId: "love_relationship",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const career = buildSectionEvidence({
      sectionId: "work_career",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const weaknesses = buildSectionEvidence({
      sectionId: "weaknesses",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });

    expect(personality.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "day_pillar_gapsin",
        "ten_god_qi_sha",
        "sinsal_hyeonchim",
      ]),
    );
    expect(money.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "gwiin_jaego",
      ]),
    );
    expect(love.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "sinsal_hongyeom",
        "element_water_missing",
        "element_fire_missing",
      ]),
    );
    expect(career.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
        "sinsal_hyeonchim",
      ]),
    );
    expect(weaknesses.sajuEvidence.map((entry) => entry.id)).toEqual(
      expect.arrayContaining([
        "pattern_no_resource",
        "pattern_no_output",
        "pattern_jaeda_sinyak",
      ]),
    );
    expect(personality.mbtiEvidence.type).toBe("ENTJ");
    expect(personality.mbtiTopicEvidence?.summary).toContain("ENTJ");
    expect(personality.sajuEvidence.length).toBeGreaterThan(3);
  });

  it("exposes topic-specific MBTI evidence without making it primary", () => {
    const work = buildSectionEvidence({
      sectionId: "work_career",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const money = buildSectionEvidence({
      sectionId: "money_asset",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const love = buildSectionEvidence({
      sectionId: "love_relationship",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });
    const weaknesses = buildSectionEvidence({
      sectionId: "weaknesses",
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
    });

    expect(Object.keys(work).slice(1, 3)).toEqual(["sajuEvidence", "mbtiEvidence"]);
    expect(work.mbtiTopicEvidence?.summary).toContain("ENTJ");
    expect(work.mbtiTopicEvidence?.summary).toContain("work_career");
    expect(work.mbtiEvidence.workStyleKo?.join(" ")).toContain("성과");
    expect(money.mbtiEvidence.moneyStyleKo?.join(" ")).toContain("성과");
    expect(love.mbtiEvidence.loveStyleKo?.join(" ")).toContain("일터");
    expect(love.mbtiTopicEvidence?.bridgeHints.join(" ")).toContain("재성 강세");
    expect(weaknesses.mbtiEvidence.riskTags).toEqual(
      expect.arrayContaining(["emotional_dryness", "direct_speech"]),
    );
    expect(work.sajuEvidence.length).toBeGreaterThan(0);
  });

  it("returns topic helper evidence for ISTJ and INFP bridge cases", () => {
    const istjMoney = getMbtiTopicEvidence({
      mbtiType: "ISTJ",
      topic: "money_asset",
      matchedTags: ["stability_need", "self_discipline"],
    });
    const infpLove = getMbtiTopicEvidence({
      mbtiType: "INFP",
      topic: "love_relationship",
      matchedTags: ["emotional_depth", "relationship_sensitivity"],
    });

    expect(istjMoney.bridgeHints.join(" ")).toContain("정관과 정재");
    expect(istjMoney.score).toBeGreaterThan(0.8);
    expect(infpLove.bridgeHints.join(" ")).toContain("수 기운");
    expect(infpLove.bridgeHints.join(" ")).toContain("화 부족");
    expect(infpLove.score).toBeGreaterThan(0.9);
  });

  it("finds topic-specific rules for love career money and personality", () => {
    const love = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
      topic: "love_relationship",
    });
    const career = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
      topic: "work_career",
    });
    const money = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
      topic: "money_asset",
    });
    const personality = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
      topic: "personality",
    });

    expect(love.map((rule) => rule.summary)).toEqual(
      expect.arrayContaining([
        "수 부족 + ENTJ 감정 건조함",
        "홍염살 + ENTJ 카리스마",
      ]),
    );
    expect(career.map((rule) => rule.summary)).toContain(
      "편관/정관 + ENTJ 리더십",
    );
    expect(money.map((rule) => rule.summary)).toContain(
      "재성 강함 + ENTJ 성취욕",
    );
    expect(personality.map((rule) => rule.summary)).toEqual(
      expect.arrayContaining([
        "화 부족 + ENTJ 외향성 contrast",
        "갑목/갑신 + ENTJ 지휘 욕구",
      ]),
    );
  });

  it("sorts reinforcement and contrast matches by priority within the requested topic", () => {
    const rules = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ENTJ",
      topic: "personality",
    });

    expect(rules.map((rule) => rule.summary)).toEqual(
      expect.arrayContaining([
        "갑신일주 + ENTJ leadership/control",
        "화 부족 + ENTJ 외향성 contrast",
      ]),
    );
    expect(rules.some((rule) => rule.kind === "contrast")).toBe(true);
    expect(rules.map((rule) => rule.priority)).toEqual(
      [...rules.map((rule) => rule.priority)].sort((left, right) => right - left),
    );
  });

  it("excludes unrelated MBTI-specific rules and requires a Saju match", () => {
    const istjRules = findFusionRules({
      sajuEntryIds: sampleDeokminSajuIds,
      mbtiType: "ISTJ",
      topic: "personality",
    });
    const noSajuMatch = findFusionRules({
      sajuEntryIds: ["element_water_missing"],
      mbtiType: "ENTJ",
      topic: "human_relations",
    });

    expect(istjRules.map((rule) => rule.summary)).not.toContain(
      "갑신일주 + ENTJ leadership/control",
    );
    expect(noSajuMatch.map((rule) => rule.summary)).not.toContain(
      "현침살 + ENTJ 직설성",
    );
  });

  it("does not return fusion rules without matching saju basis", () => {
    const rules = findFusionRules({
      sajuEntryIds: ["element_water_missing"],
      mbtiType: "ENTJ",
    });

    expect(rules.map((rule) => rule.summary)).not.toContain(
      "현침살 + ENTJ 직설성",
    );
  });
});
