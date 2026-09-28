import { SAJU_FEATURE_TAXONOMY } from "../report-knowledge/sajuFeatureTaxonomy";
import { SAJU_KNOWLEDGE_BASE } from "../report-knowledge/sajuKnowledgeBase";
import { MBTI_KNOWLEDGE_BASE } from "../report-knowledge/mbtiKnowledgeBase";
import { SHINSAL_METADATA, SHINSAL_RULES } from "../saju/shinsalConstants";
import { COMPUTED_GWIIN_IDS, COMPUTED_SAJU_SPECIAL_PATTERN_IDS, COMPUTED_SINSAL_IDS } from "../report-knowledge/sajuComputedFactsTypes";
import { getMbtiSourceProfile, getMbtiRelationshipPair, getMbtiMyeongliBridgeHints, MBTI_SOURCE_TYPES, MBTI_TRAIT_AREAS, MBTI_REPORT_USE_CASE_KEYS, MBTI_PRODUCT_TRAIT_AREAS } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { BRIDGE_SCENE_RULES } from "../report-knowledge/bridge/interactionSceneRules";
import { FUSION_KNOWLEDGE_BASE } from "../report-knowledge/fusionKnowledgeBase";
import { ATOMIC_BY_ID } from "./atomicRegistry";
import { PRODUCTS, type Product } from "./types";
import { STRUCTURED_ENUMS } from "./structuredEnums";
import { EXTRACTOR_DIRECT_IDS, EXTRACTOR_SUPPLIED_IDS } from "./featureCapabilities";

export type InventoryRow = {
  readonly id: string; readonly name: string; readonly source: string; readonly producer: string;
  readonly shape: string; readonly domains: readonly string[]; readonly currentProducts: readonly Product[];
  readonly coverage: "reviewed-material" | "source-material" | "fact-only" | "needs-source";
  readonly availability: "computed" | "derived" | "knowledge-only" | "input";
};
type Family = readonly [id: string, name: string, source: string, producer: string, shape: string, availability: InventoryRow["availability"], domains: readonly string[], products: readonly Product[]];
const all = PRODUCTS, fortune = ["major_fortune", "annual_fortune"] as const, pair = ["saju_mbti_compatibility"] as const;
/** Category-level contract manifest. Explicit additions require review; dynamic
 * catalog enumeration below prevents a hand-picked example inventory. */
export const STRUCTURED_FAMILIES: readonly Family[] = [
  ["day_master", "일간", "saju/types.ts:SajuCalcResult.dayMaster", "calculateSaju", "HeavenlyStem[10]", "computed", ["identity"], all],
  ["day_pillar", "일주", "saju/types.ts:SajuCalcResult.pillars.day", "calculateSaju", "Pillar / 60 ganji", "computed", ["identity", "relationship"], all],
  ["pillars", "연·월·일·시주", "saju/types.ts:SajuCalcResult.pillars", "calculateSaju", "year,month,day,hour? {stem,branch}", "computed", ["all"], all],
  ["season", "월지·계절", "saju/structureAnalysisTypes.ts:StructureAnalysisEvidence", "structureAnalysis", "source=SEASON; keyKo,valueKo / confirmed.month.branch", "derived", ["identity", "lifestyle"], all],
  ["yin_yang", "음양", "saju/types.ts:SajuCalcResult.yinYang", "analyzeYinYang", "yin,yang,label:3", "computed", ["identity"], all],
  ["elements", "오행 분포·부족·과다", "saju/types.ts:SajuCalcResult.elements", "analyzeFullElements", "visible,weighted,labels:15; ComputedSajuFacts counts/missing/excess/useful? kept separate", "computed", ["lifestyle", "all"], all],
  ["hidden_stems", "지장간", "saju/types.ts:SajuCalcResult.tenGods.hiddenStems", "analyzeFullTenGods", "branch,stem,tenGod?,weight", "computed", ["all"], all],
  ["ten_gods", "십성", "saju/types.ts:SajuCalcResult.tenGods", "analyzeFullTenGods", "stems,hiddenStems,distribution[10]; ComputedTenGodSignal strengths[5]", "computed", ["all"], all],
  ["life_stages", "십이운성", "report-knowledge/sajuPillarFeaturePlacement.ts:twelveLifeStageByStem", "buildSajuPillarGridColumns", "장생 목욕 관대 건록 제왕 쇠 병 사 묘 절 태 양; per pillar", "derived", ["identity"], all],
  ["native_shinsal", "계산 엔진 신살·귀인 전 항목", "saju/shinsalConstants.ts:SHINSAL_RULES", "detectShinsal", "ShinsalDetection code/category/severity/confidence/positions/evidence/basis", "computed", ["all"], all],
  ["derived_features", "추출 파생 표식 전 항목", "report-knowledge/sajuComputedFeatureExtractor.ts", "extractComputedSajuFeatures", "featureIds,details{source,matchedBy,confidence}", "derived", ["all"], all],
  ["structure", "신강약·구조 패턴", "saju/structureAnalysisTypes.ts", "analyzeSajuStructure", "strength levels[5],score,confidence,evidence; patterns[14]", "derived", ["all"], all],
  ["natal_relations", "원국 천간합·육합·충", "saju/relations.ts", "analyzeRelations", "STEM_COMBINATION BRANCH_COMBINATION BRANCH_CLASH; pair,positions", "computed", ["relationship", "career"], all],
  ["expanded_relations", "운과 원국 합충형파해·삼합·반합", "report-knowledge/annualFortuneYearRules.ts", "getAnnualBranchInteractions/getBranchPairRelations", "충 육합 삼합 반합 해 형 파; branches,affectedPillars", "computed", ["all"], fortune],
  ["wonjin_gwimun", "원진·귀문", "report-knowledge/sajuFeatureExtractionRules.ts:relationPairs", "extractComputedSajuFeatures", "branch pairs -> sinsal_wonjin/sinsal_gwimun", "derived", ["relationship"], all],
  ["cross_person", "두 사람 교차 명리·방향", "report-knowledge/compatibilityRelationRules.ts", "getCrossTenGodRelation/detectCrossBranchRelations", "A->B/B->A; cross tenGod,element[6],branch kinds[5],refs", "computed", ["relationship", "love", "career"], pair],
  ["spouse_palace", "일지·배우자궁", "report-knowledge/compatibilityDeepSajuBridge.ts", "buildCompatibilityDeepSajuBridge", "layer=spouse_palace; personARefs,personBRefs; not a marriage prediction", "derived", ["relationship", "love"], pair],
  ["compatibility_layers", "궁합 해석 층과 category", "report-knowledge/compatibilityDeepSajuBridge.ts;compatibilityTypes.ts", "buildCompatibilityDeepSajuBridge/buildCompatibilityDirectionEvidence", "day_master_relation,cross_ten_god,combined_element_climate,element_complement,branch_trine,branch_clash,branch_harm,spouse_palace,month_rhythm,hour_life_rhythm; category lens; legacy score excluded", "derived", ["relationship"], pair],
  ["major_cycles", "대운 순역·시작·전체 주기", "saju/customerDayun.ts", "calculateCustomerDayun", "CustomerDayun basis,precision,direction,startOffset,startSolarKst/range,cycles[]", "computed", ["all"], fortune],
  ["major_selection", "현재 대운·전환 오차", "saju/customerDayun.ts:DayunSelection", "selectCustomerDayun", "targetYear,selectedCycle,transition,activeCycleAtEvaluation,evaluatedAtKst", "computed", ["all"], fortune],
  ["major_cross", "대운 십성·오행·원국·세운 교차", "report-knowledge/majorFortuneTypes.ts:MajorFortuneEvidencePacket", "buildMajorFortuneEvidence", "currentMajorFortune,currentAnnualCross,branchInteractions,elementEffect,timeline,domainFlows,signals", "derived", ["all"], ["major_fortune"]],
  ["annual", "선택 연도·세운", "report-knowledge/annualFortuneTypes.ts;annualFortuneEvidence.ts", "buildAnnualFortuneEvidence", "AnnualGanjiInfo,year mode/access,tenGod,element,interactions,domainFlows", "computed", ["all"], ["annual_fortune"]],
  ["monthly", "절입 월운·구간", "report-knowledge/annualMonthJie.ts", "buildAnnualMonthCalendar", "AnnualCalendarMonth[12].segments; startKst/endKstExclusive,effectiveAnnualPillar,activeDayunContext,uncertainty", "computed", ["all"], ["annual_fortune"]],
  ["month_relations", "월↔원국·세운·대운 근거", "report-knowledge/annualMonthRelationFacts.ts;annualMonthJie.ts", "buildAnnualMonthRelationFacts", "month_natal_branch,month_natal_element,month_annual_branch,month_dayun_branch; certainty; 3 element effects; supportive/friction/mixed/neutral", "computed", ["all"], ["annual_fortune"]],
  ["precision", "출생시각 정밀도·확정/불확정", "saju/birthTimePrecisionTypes.ts", "BirthTimeCalculationContext", "confirmed,candidates,precision,calendarVersion; no invented hour", "computed", ["all"], all],
  ["mbti_types", "MBTI 16유형", "report-knowledge/mbti/sourceRuntimeAdapter.ts", "getMbtiSourceProfile", "type,titleKo,archetype,oneLine,summary", "knowledge-only", ["all"], all],
  ["mbti_axes", "선호 지표", "docs/product/mbti/source/*.json:preferenceAxes", "getMbtiSourceProfile", "E/I S/N T/F J/P source descriptions", "knowledge-only", ["all"], all],
  ["mbti_functions", "인지기능 스택", "docs/product/mbti/source/*.json:functionStack", "getMbtiSourceProfile", "dominant,auxiliary,tertiary,inferior source records", "knowledge-only", ["all"], all],
  ...MBTI_TRAIT_AREAS.map((area): Family => [`mbti_traits_${area}`, `MBTI ${area}`, "docs/product/mbti/source/*.json:traits." + area, "getMbtiProductTraits", "id,label,plainKo,strongLine,positiveUse,risk,matchingMyeongliSignals,productDomains,sourceCoverage", "knowledge-only", [area], MBTI_REPORT_USE_CASE_KEYS.flatMap((key, i) => (MBTI_PRODUCT_TRAIT_AREAS[key] as readonly string[]).includes(area) ? [PRODUCTS[i]] : [])]),
  ["mbti_pairs", "방향별 MBTI pair DB", "docs/product/mbti/source/*.json:relationshipHints", "getMbtiRelationshipPair", "comfortableTypes/challengingTypes/notablePairs; sharedGround,friction,positiveInfluence,lovePattern,marriagePattern,repairStrategy,reportLine", "knowledge-only", ["relationship", "love"], pair],
  ["mbti_bridge", "MBTI↔명리 hints·scenes·fusion", "report-knowledge/bridge/interactionSceneRules.ts;fusionKnowledgeBase.ts", "buildBridgeInteractionScenes", "allOf/noneOf actual facts + exact traits; six interaction types; source hints are NOT natal facts", "knowledge-only", ["all"], all],
  ["mbti_use_cases", "6상품 MBTI 사용 문구", "docs/product/mbti/source/*.json:reportUseCases", "getMbtiReportUseCase", "generalReport/careerReport/loveMarriageChildReport/compatibilityReport/daeunReport/saeunReport", "knowledge-only", ["all"], all],
  ["context", "생활·관계·직업 입력", "report-knowledge/userContextTypes.ts", "UserContextProfile", "lifeStatus[8],relationshipStatus[4],fieldLabel?; V3 alias unemployed/job-seeker", "input", ["all"], all],
];
export function buildInventory(): readonly InventoryRow[] {
  const rows: InventoryRow[] = STRUCTURED_FAMILIES.map(([id, name, source, producer, shape, availability, domains, currentProducts]) => ({ id: `category:${id}`, name, source: `src/lib/${source}`, producer, shape, availability, domains, currentProducts, coverage: "fact-only" }));
  const add = (id: string, name: string, source: string, producer: string, shape: string, domains: readonly string[], currentProducts: readonly Product[], availability: InventoryRow["availability"], coverage: InventoryRow["coverage"]) => rows.push({ id, name, source, producer, shape, domains, currentProducts, availability, coverage });
  for (const contract of STRUCTURED_ENUMS) for (const value of contract.values) add(`enum:${contract.type}:${value}`, value, contract.source, contract.type, "canonical literal; not a new interpretation", ["see category"], all, "derived", "fact-only");
  for (const id of [...new Set([...EXTRACTOR_DIRECT_IDS, ...EXTRACTOR_SUPPLIED_IDS])]) {
    const material = ATOMIC_BY_ID.get(id)!;
    const direct = EXTRACTOR_DIRECT_IDS.includes(id);
    add(`extractor:${id}`, material.name, "src/lib/report-knowledge/sajuComputedFeatureExtractor.ts", "extractComputedSajuFeatures", direct ? "computed from confirmed pillars/branches; detail source + matchedBy" : "requires supplied upstream fact; alias mapper is not its calculator", material.contextTags, all, direct ? "derived" : "input", material.readiness === "reviewed" ? "reviewed-material" : "source-material");
  }
  for (const f of SAJU_FEATURE_TAXONOMY) add(`feature:${f.id}`, f.labelKo, `src/lib/report-knowledge/sajuFeatureTaxonomy.ts#${f.id}`, "SAJU_FEATURE_TAXONOMY (meaning; NOT proof of detection)", f.category, f.topics, all, "knowledge-only", ATOMIC_BY_ID.get(f.id)?.readiness === "reviewed" ? "reviewed-material" : "source-material");
  for (const k of SAJU_KNOWLEDGE_BASE) add(`knowledge:${k.id}`, k.labelKo, `src/lib/report-knowledge/sajuKnowledgeBase.ts#${k.id}`, "SAJU_KNOWLEDGE_BASE", k.category, Object.keys(k.topicWeights), all, "knowledge-only", ATOMIC_BY_ID.get(k.id)?.readiness === "reviewed" ? "reviewed-material" : "source-material");
  for (const n of Object.values(SHINSAL_METADATA)) add(`native:${n.code}`, n.labelKo, "src/lib/saju/shinsalConstants.ts#" + n.code, "detectShinsal", `ShinsalDetection; ${n.category}; rules=${SHINSAL_RULES.filter(r => r.code === n.code).length}`, ["all"], all, "computed", "source-material");
  for (const [kind, ids] of [["pattern", COMPUTED_SAJU_SPECIAL_PATTERN_IDS], ["sinsal", COMPUTED_SINSAL_IDS], ["gwiin", COMPUTED_GWIIN_IDS]] as const)
    for (const id of ids) add(`declared:${kind}:${id}`, id, "src/lib/report-knowledge/sajuComputedFactsTypes.ts", "ComputedSajuFacts contract; producer/extractor verification required", kind, ["all"], all, "derived", "fact-only");
  for (const stage of ["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"]) add(`life-stage:${stage}`, stage, "src/lib/report-knowledge/sajuPillarFeaturePlacement.ts#twelveLifeStageByStem", "buildSajuPillarGridColumns", "per-pillar label", ["identity"], all, "derived", "needs-source");
  for (const type of MBTI_SOURCE_TYPES) {
    const p = getMbtiSourceProfile(type);
    if (!p) continue;
    const source = `docs/product/mbti/source/${type}.json`;
    add(`mbti:${type}`, p.titleKo, source, "getMbtiSourceProfile", "type,archetype,oneLine,summary", ["all"], all, "knowledge-only", "source-material");
    for (const [group, values] of [["axis", p.preferenceAxes], ["function", p.functionStack], ["summary", p.summary]] as const)
      for (const key of Object.keys(values ?? {})) add(`mbti:${type}:${group}:${key}`, key, source, "getMbtiSourceProfile", "string", ["identity"], all, "knowledge-only", "source-material");
    for (const area of MBTI_TRAIT_AREAS) for (const [i, t] of (p.traits?.[area] ?? []).entries()) add(`mbti:${type}:traits:${area}:${t.id ?? i}`, t.label ?? t.id ?? String(i), source, "getMbtiProductTraits", `MbtiSourceTraitItem; coverage=${t.sourceCoverage ?? "unspecified"}`, [area], MBTI_REPORT_USE_CASE_KEYS.flatMap((k, i) => (MBTI_PRODUCT_TRAIT_AREAS[k] as readonly string[]).includes(area) ? [PRODUCTS[i]] : []), "knowledge-only", t.id && t.plainKo ? "source-material" : "needs-source");
    for (const other of MBTI_SOURCE_TYPES) {
      const value = getMbtiRelationshipPair(type, other);
      add(`mbti-pair:${type}->${other}`, `${type} → ${other}`, source, "getMbtiRelationshipPair", value ? `MbtiRelationshipPair; ${value.sourceCoverage ?? "unspecified"}` : "no source pair; no invented replacement", ["relationship"], pair, "knowledge-only", value ? "source-material" : "needs-source");
    }
    for (const [i, hint] of (getMbtiMyeongliBridgeHints(type) ?? []).entries()) add(`mbti-hint:${type}:${i}`, hint.signal, source, "getMbtiMyeongliBridgeHints", "MbtiMyeongliBridgeHint", hint.productDomains, all, "knowledge-only", "source-material");
    for (const key of MBTI_REPORT_USE_CASE_KEYS) add(`mbti-use:${type}:${key}`, key, source, "getMbtiReportUseCase", `string[${p.reportUseCases?.[key]?.length ?? 0}]`, [key], [PRODUCTS[MBTI_REPORT_USE_CASE_KEYS.indexOf(key)]], "knowledge-only", p.reportUseCases?.[key]?.length ? "source-material" : "needs-source");
  }
  for (const p of MBTI_KNOWLEDGE_BASE) add(`mbti-legacy:${p.type}`, p.type, "src/lib/report-knowledge/mbtiKnowledgeBase.ts", "MBTI_KNOWLEDGE_BASE", "MbtiKnowledgeEntry (legacy; not preferred over source DB)", ["all"], all, "knowledge-only", "source-material");
  for (const r of BRIDGE_SCENE_RULES) add(`scene:${r.id}`, r.id, "src/lib/report-knowledge/bridge/interactionSceneRules.ts", "buildBridgeInteractionScenes", `${r.type}; exact trait refs + fact predicate`, r.contexts, all, "knowledge-only", "source-material");
  for (const r of FUSION_KNOWLEDGE_BASE) add(`fusion:${r.id}`, r.id, "src/lib/report-knowledge/fusionKnowledgeBase.ts", "FUSION_KNOWLEDGE_BASE", `${r.interactionType}; ${r.availability ?? "predicate"}`, [r.topic], all, "knowledge-only", r.availability ? "needs-source" : "source-material");
  return rows;
}
