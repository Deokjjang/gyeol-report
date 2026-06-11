import { describe, expect, it } from "vitest";

import {
  FIVE_ELEMENTS,
  SAJU_KNOWLEDGE_BASE,
  SAJU_KNOWLEDGE_BY_ID,
  TEN_GODS,
} from "../../../src/lib/report-knowledge/sajuKnowledgeBase";
import type { SajuKnowledgeEntry } from "../../../src/lib/report-knowledge/sajuKnowledgeTypes";

function getEntry(id: string): SajuKnowledgeEntry {
  const entry = SAJU_KNOWLEDGE_BY_ID.get(id);

  if (entry === undefined) {
    throw new Error(`Missing saju entry: ${id}`);
  }

  return entry;
}

describe("saju knowledge base", () => {
  it("contains all five elements", () => {
    expect(FIVE_ELEMENTS).toEqual(["wood", "fire", "earth", "metal", "water"]);
    expect(
      ["element_wood", "element_fire", "element_earth", "element_metal", "element_water"].every(
        (id) => SAJU_KNOWLEDGE_BY_ID.has(id),
      ),
    ).toBe(true);
  });

  it("contains all ten gods", () => {
    expect(TEN_GODS).toEqual([
      "bijian",
      "jie_cai",
      "shi_shen",
      "shang_guan",
      "pian_cai",
      "zheng_cai",
      "qi_sha",
      "zheng_guan",
      "pian_yin",
      "zheng_yin",
    ]);
    expect(
      [
        "ten_god_bijian",
        "ten_god_jie_cai",
        "ten_god_shi_shen",
        "ten_god_shang_guan",
        "ten_god_pian_cai",
        "ten_god_zheng_cai",
        "ten_god_qi_sha",
        "ten_god_zheng_guan",
        "ten_god_pian_yin",
        "ten_god_zheng_yin",
      ].every((id) => SAJU_KNOWLEDGE_BY_ID.has(id)),
    ).toBe(true);
  });

  it("contains required patterns, sinsal, noblemen, day master, and day pillar seeds", () => {
    const requiredIds = [
      "pattern_jaeda_sinyak",
      "pattern_gwansal_honjob",
      "pattern_siksang_saengjae",
      "pattern_jaesaenggwan",
      "pattern_salin_sangsaeng",
      "pattern_singang",
      "pattern_sinyak",
      "pattern_no_resource",
      "pattern_no_output",
      "pattern_toda_maegeum",
      "pattern_geumda_mokjeol",
      "pattern_mokda_hwasik",
      "pattern_suda_mokbu",
      "sinsal_hyeonchim",
      "sinsal_hongyeom",
      "sinsal_mangsin",
      "sinsal_baekho",
      "sinsal_yeokma",
      "sinsal_gwimun",
      "sinsal_wonjin",
      "sinsal_dohwa",
      "sinsal_hwagae",
      "sinsal_goegang",
      "sinsal_yangin",
      "sinsal_cheonmun",
      "sinsal_wolsal",
      "sinsal_jangseong",
      "sinsal_banan",
      "nobleman_cheoneul",
      "nobleman_cheondeok",
      "nobleman_woldeok",
      "nobleman_munchang",
      "nobleman_taegeuk",
      "nobleman_jaego",
      "gwiin_jaego",
      "day_master_gabmok",
      "day_master_gito",
      "day_pillar_gapsin",
      "day_pillar_gihae",
      "day_pillar_gabja",
      "day_pillar_gapjin",
      "day_pillar_eulsa",
      "day_pillar_byeongoh",
      "day_pillar_jeonghae",
      "day_pillar_mujin",
      "day_pillar_gyeongsin",
      "day_pillar_sinyu",
      "day_pillar_imja",
      "day_pillar_gyemyo",
    ];

    for (const id of requiredIds) {
      expect(SAJU_KNOWLEDGE_BY_ID.has(id)).toBe(true);
    }
  });

  it("expands all five elements with topic interpretations and balance hints", () => {
    for (const id of [
      "element_wood",
      "element_fire",
      "element_earth",
      "element_metal",
      "element_water",
    ]) {
      const entry = getEntry(id);

      expect(entry.topicInterpretations?.personality).toBeDefined();
      expect(entry.topicInterpretations?.work_career).toBeDefined();
      expect(entry.topicInterpretations?.money_asset).toBeDefined();
      expect(entry.topicInterpretations?.love_relationship).toBeDefined();
      expect(entry.topicInterpretations?.human_relations).toBeDefined();
      expect(entry.topicInterpretations?.study_growth).toBeDefined();
      expect(entry.topicInterpretations?.environment_luck).toBeDefined();
      expect(entry.balanceHints).toBeDefined();
      expect(entry.careerHints).toBeDefined();
      expect(entry.moneyHints).toBeDefined();
      expect(entry.phraseSeeds.analytical.length).toBeGreaterThanOrEqual(3);
      expect(entry.phraseSeeds.conversational.length).toBeGreaterThanOrEqual(3);
      expect(entry.phraseSeeds.caution.length).toBeGreaterThanOrEqual(2);
      expect(entry.phraseSeeds.advice.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("expands all ten gods with required topic interpretations", () => {
    const requiredTopics = [
      "personality",
      "work_career",
      "money_asset",
      "love_relationship",
      "human_relations",
      "weaknesses",
      "final_advice",
    ] as const;

    for (const id of [
      "ten_god_bijian",
      "ten_god_jie_cai",
      "ten_god_shi_shen",
      "ten_god_shang_guan",
      "ten_god_pian_cai",
      "ten_god_zheng_cai",
      "ten_god_qi_sha",
      "ten_god_zheng_guan",
      "ten_god_pian_yin",
      "ten_god_zheng_yin",
    ]) {
      const entry = getEntry(id);

      for (const topic of requiredTopics) {
        expect(entry.topicInterpretations?.[topic]).toBeDefined();
      }
    }
  });

  it("includes all ten day masters and required day pillar seed set", () => {
    const dayMasterIds = [
      "day_master_gabmok",
      "day_master_eulmok",
      "day_master_byeonghwa",
      "day_master_jeonghwa",
      "day_master_muto",
      "day_master_gito",
      "day_master_gyeonggeum",
      "day_master_singeum",
      "day_master_imsu",
      "day_master_gyesu",
    ];
    const dayPillarIds = [
      "day_pillar_gapsin",
      "day_pillar_gihae",
      "day_pillar_gabja",
      "day_pillar_gapjin",
      "day_pillar_eulsa",
      "day_pillar_byeongoh",
      "day_pillar_jeonghae",
      "day_pillar_mujin",
      "day_pillar_gyeongsin",
      "day_pillar_sinyu",
      "day_pillar_imja",
      "day_pillar_gyemyo",
    ];

    for (const id of [...dayMasterIds, ...dayPillarIds]) {
      expect(SAJU_KNOWLEDGE_BY_ID.has(id)).toBe(true);
    }
  });

  it("keeps 갑신일주 high-detail pressure leadership and sharpness concepts", () => {
    const gapsin = getEntry("day_pillar_gapsin");
    const text = JSON.stringify(gapsin);

    expect(text).toContain("바위 위 소나무");
    expect(text).toContain("편관 pressure");
    expect(text).toContain("leadership under pressure");
    expect(text).toContain("sharp");
    expect(gapsin.positiveTags).toEqual(
      expect.arrayContaining(["leadership", "sharp_analysis", "self_discipline"]),
    );
  });

  it("maps key seed entries to required interpretation tags", () => {
    const hyeonchim = getEntry("sinsal_hyeonchim");
    const hongyeom = getEntry("sinsal_hongyeom");
    const waterMissing = getEntry("element_water_missing");
    const munchang = getEntry("nobleman_munchang");
    const jaego = getEntry("gwiin_jaego");
    const noResource = getEntry("pattern_no_resource");
    const noOutput = getEntry("pattern_no_output");

    expect([...hyeonchim.positiveTags, ...hyeonchim.riskTags]).toEqual(
      expect.arrayContaining(["sharp_analysis", "direct_speech", "precision_skill"]),
    );
    expect(hongyeom.positiveTags).toEqual(
      expect.arrayContaining(["romantic_attraction", "public_presence"]),
    );
    expect(waterMissing.riskTags).toEqual(
      expect.arrayContaining([
        "emotional_dryness",
        "flexibility_need",
        "low_rest_capacity",
      ]),
    );
    expect(munchang.topicWeights.study_growth).toBeGreaterThan(0.8);
    expect(munchang.positiveTags).toEqual(
      expect.arrayContaining(["precision_skill", "strategic_thinking"]),
    );
    expect(jaego.topicWeights.money_asset).toBeGreaterThan(0.8);
    expect(jaego.positiveTags).toContain("asset_building");
    expect(noResource.riskTags).toEqual(
      expect.arrayContaining(["emotional_dryness", "low_rest_capacity"]),
    );
    expect(noOutput.riskTags).toContain("expression_weakness");
  });

  it("keeps day pillar model open for future 60-gapja expansion", () => {
    const gapsin = getEntry("day_pillar_gapsin");
    const futureDayPillar = {
      ...gapsin,
      id: "day_pillar_gabja",
      labelKo: "갑자일주",
      aliases: ["甲子", "갑자", "갑자일주"],
    } satisfies SajuKnowledgeEntry;

    expect(futureDayPillar.category).toBe("day_pillar");
    expect(SAJU_KNOWLEDGE_BASE.some((entry) => entry.category === "day_pillar")).toBe(
      true,
    );
  });
});
