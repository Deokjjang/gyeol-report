import { describe, expect, it } from "vitest";

import {
  findUnsafeSajuFeatureSeedClaims,
  requireSajuFeatureEntry,
  SAJU_FEATURE_BY_ID,
  SAJU_FEATURE_TAXONOMY,
} from "../../../src/lib/report-knowledge/sajuFeatureTaxonomy";

function findFeatureByLabel(labelKo: string) {
  const entry = SAJU_FEATURE_TAXONOMY.find((feature) => feature.labelKo === labelKo);

  if (entry === undefined) {
    throw new Error(`Missing feature label: ${labelKo}`);
  }

  return entry;
}

describe("saju feature taxonomy", () => {
  it("contains required REPORT-15A seed entries", () => {
    const requiredFeatureIds = [
      "twelve_sinsal_banan",
      "twelve_sinsal_jangseong",
      "sinsal_dohwa",
      "sinsal_hongyeom",
      "sinsal_baekho",
      "sinsal_hyeonchim",
      "sinsal_gwimun",
      "sinsal_wonjin",
      "twelve_sinsal_yeokma",
      "twelve_sinsal_hwagae",
      "twelve_sinsal_geopsal",
      "twelve_sinsal_jaesal",
      "gwiin_cheoneul",
      "gwiin_cheondeok",
      "gwiin_woldeok",
      "gwiin_munchang",
      "gwiin_hakdang",
      "gwiin_taegeuk",
      "gwiin_jaego",
      "gwiin_bokseong",
      "structure_jaeda_sinyak",
      "structure_no_resource",
      "structure_no_output",
      "structure_gwansal_mixed",
      "structure_siksang_saengjae",
      "structure_jaesaenggwan",
      "structure_salin_sangsaeng",
      "element_wood_excess",
      "element_wood_missing",
      "element_fire_excess",
      "element_fire_missing",
      "element_earth_excess",
      "element_earth_missing",
      "element_metal_excess",
      "element_metal_missing",
      "element_water_excess",
      "element_water_missing",
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
    ];

    for (const featureId of requiredFeatureIds) {
      expect(SAJU_FEATURE_BY_ID.has(featureId)).toBe(true);
    }
  });

  it("keeps vivid symbolic descriptions for narrative report use", () => {
    const banan = requireSajuFeatureEntry("twelve_sinsal_banan");
    const dohwa = requireSajuFeatureEntry("sinsal_dohwa");
    const baekho = requireSajuFeatureEntry("sinsal_baekho");

    expect(banan.symbolicImage).toMatch(/장군|말 안장/);
    expect(dohwa.summary + dohwa.symbolicImage).toMatch(/시선|관심|분위기/);
    expect(baekho.polarity).toBe("mixed");
    expect(baekho.symbolicImage).toContain("흰 호랑이");
  });

  it("contains required nobleman and bridge entries", () => {
    expect(requireSajuFeatureEntry("gwiin_cheoneul").labelKo).toBe("천을귀인");
    expect(requireSajuFeatureEntry("gwiin_munchang").labelKo).toBe("문창귀인");
    expect(requireSajuFeatureEntry("gwiin_jaego").labelKo).toBe("재고귀인");

    expect(requireSajuFeatureEntry("element_fire_missing").mbtiBridgeNeeds).toEqual(
      expect.arrayContaining(["warmth", "expression_support"]),
    );
    expect(requireSajuFeatureEntry("element_water_missing").mbtiBridgeNeeds).toEqual(
      expect.arrayContaining(["emotional_buffer"]),
    );
    expect(requireSajuFeatureEntry("element_earth_excess").mbtiBridgeNeeds).toEqual(
      expect.arrayContaining(["pace_flexibility"]),
    );
  });

  it("covers expanded sinsal gwiin gilshin labels for REPORT-15B", () => {
    const requiredLabels = [
      "반안살",
      "장성살",
      "역마살",
      "화개살",
      "지살",
      "육해살",
      "망신살",
      "겁살",
      "재살",
      "천살",
      "월살",
      "도화살",
      "홍염살",
      "백호대살",
      "현침살",
      "귀문관살",
      "원진살",
      "양인살",
      "괴강살",
      "공망",
      "천문성",
      "문곡귀인",
      "천을귀인",
      "천덕귀인",
      "월덕귀인",
      "문창귀인",
      "학당귀인",
      "태극귀인",
      "재고귀인",
      "복성귀인",
      "금여록",
      "천의성",
      "암록",
      "상관견관",
      "비겁다자",
      "인성다자",
    ];

    for (const labelKo of requiredLabels) {
      expect(findFeatureByLabel(labelKo).labelKo).toBe(labelKo);
    }
  });

  it("expands vivid readings for major gilsin and warning features", () => {
    const dohwa = requireSajuFeatureEntry("sinsal_dohwa");
    const baekho = requireSajuFeatureEntry("sinsal_baekho");
    const munchang = requireSajuFeatureEntry("gwiin_munchang");
    const cheoneul = requireSajuFeatureEntry("gwiin_cheoneul");

    expect(dohwa.positiveReading).toMatch(/시선|관심/);
    expect(`${baekho.positiveReading}\n${baekho.cautionReading}`).toContain("결단력");
    expect(`${baekho.positiveReading}\n${baekho.cautionReading}`).toMatch(
      /충돌|손상/,
    );
    expect(`${munchang.summary}\n${munchang.symbolicImage}`).toMatch(/글|배움/);
    expect(`${cheoneul.summary}\n${cheoneul.symbolicImage}`).toMatch(/보호|도움/);
  });

  it("assigns useful polarity vividness topic and MBTI bridge metadata", () => {
    expect(requireSajuFeatureEntry("twelve_sinsal_banan").vividness).toBe(5);
    expect(requireSajuFeatureEntry("sinsal_dohwa").vividness).toBe(5);
    expect(requireSajuFeatureEntry("sinsal_baekho").polarity).toBe("mixed");
    expect(requireSajuFeatureEntry("gwiin_cheoneul").polarity).toBe("positive");
    expect(requireSajuFeatureEntry("gwiin_munchang").topics).toEqual(
      expect.arrayContaining(["study", "work", "personality"]),
    );
    expect(requireSajuFeatureEntry("gwiin_munchang").mbtiBridgeNeeds).toEqual(
      expect.arrayContaining(["intellectual_match"]),
    );
  });

  it("keeps unsafe advertising claims out of taxonomy phrase fields", () => {
    expect(findUnsafeSajuFeatureSeedClaims()).toEqual([]);
  });
});
