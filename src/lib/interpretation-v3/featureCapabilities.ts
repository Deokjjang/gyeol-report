import { SAJU_DAY_PILLAR_FEATURES } from "../report-knowledge/sajuDayPillarKnowledge";
import { SAJU_FEATURE_BY_ID } from "../report-knowledge/sajuFeatureTaxonomy";
import { elementFeatureIdByElement, tenGodFeatureIdByTenGod, specialPatternFeatureIdByAlias, sinsalFeatureIdByAlias, gwiinFeatureIdByAlias, twelveSinsalFeatureByGroup } from "../report-knowledge/sajuFeatureExtractionRules";

/** Actual extractor output capabilities, distinct from knowledge-only entries.
 * Supplied-fact means this extractor maps an upstream fact; it does not calculate
 * that fact. In particular, absence in eight visible glyphs is not element proof. */
export const EXTRACTOR_DIRECT_IDS = [...new Set([
  ...SAJU_DAY_PILLAR_FEATURES.map(f => f.id),
  ...Object.values(twelveSinsalFeatureByGroup).flatMap(Object.values),
  "gwiin_cheoneul", "gwiin_munchang", "gwiin_jaego", "gwiin_geumyeorok", "gwiin_amrok",
  "sinsal_baekho", "sinsal_goegang", "sinsal_yangin", "sinsal_hyeonchim", "sinsal_dohwa", "sinsal_gwimun", "sinsal_wonjin", "sinsal_gongmang", "sinsal_cheonmunseong",
])].filter(id => SAJU_FEATURE_BY_ID.has(id));
export const EXTRACTOR_SUPPLIED_IDS = [...new Set([
  ...Object.values(elementFeatureIdByElement).flatMap(Object.values), ...Object.values(tenGodFeatureIdByTenGod),
  ...specialPatternFeatureIdByAlias.values(), ...sinsalFeatureIdByAlias.values(), ...gwiinFeatureIdByAlias.values(),
])].filter(id => SAJU_FEATURE_BY_ID.has(id));
