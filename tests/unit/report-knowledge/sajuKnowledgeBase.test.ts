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
      "sinsal_hyeonchim",
      "sinsal_hongyeom",
      "sinsal_mangsin",
      "sinsal_baekho",
      "sinsal_yeokma",
      "sinsal_gwimun",
      "sinsal_wonjin",
      "nobleman_cheoneul",
      "nobleman_cheondeok",
      "nobleman_woldeok",
      "nobleman_munchang",
      "nobleman_taegeuk",
      "nobleman_jaego",
      "day_master_gabmok",
      "day_master_gito",
      "day_pillar_gapsin",
      "day_pillar_gihae",
    ];

    for (const id of requiredIds) {
      expect(SAJU_KNOWLEDGE_BY_ID.has(id)).toBe(true);
    }
  });

  it("maps key seed entries to required interpretation tags", () => {
    const hyeonchim = getEntry("sinsal_hyeonchim");
    const hongyeom = getEntry("sinsal_hongyeom");
    const waterMissing = getEntry("element_water_missing");

    expect([...hyeonchim.positiveTags, ...hyeonchim.riskTags]).toEqual(
      expect.arrayContaining(["sharp_analysis", "direct_speech"]),
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
