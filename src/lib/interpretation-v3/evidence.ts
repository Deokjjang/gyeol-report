import type { CanonicalNatalTableEvidence } from "../report-knowledge/natalTableEvidence";
import type { SajuCalcResult } from "../saju/types";
import type { AnnualMonthSegment } from "../report-knowledge/annualMonthJie";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import { getMbtiSourceProfile, MBTI_TRAIT_AREAS } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { ATOMIC_BY_ID, domainsForTopics } from "./atomicRegistry";
import { DOMAINS, type Evidence, type EvidenceKind } from "./types";

const godIds: Record<string, string> = { 比肩: "bijian", 劫財: "jie_cai", 食神: "shi_shen", 傷官: "shang_guan", 偏財: "pian_cai", 正財: "zheng_cai", 偏官: "qi_sha", 正官: "zheng_guan", 偏印: "pian_yin", 正印: "zheng_yin", 비견: "bijian", 겁재: "jie_cai", 식신: "shi_shen", 상관: "shang_guan", 편재: "pian_cai", 정재: "zheng_cai", 편관: "qi_sha", 정관: "zheng_guan", 편인: "pian_yin", 정인: "zheng_yin" };
const kinds: Record<string, EvidenceKind> = { day_master: "day_master", day_pillar: "day_pillar", ten_god: "ten_god", element: "element", twelve_life_stage: "life_stage", sinsal: "shinsal", twelve_sinsal: "shinsal", gwiin: "gwiin", relation: "relation", structure: "structure" };
// Known duplicate vocabularies; do NOT turn arbitrary strings into features.
export const FEATURE_ALIASES: Readonly<Record<string, string>> = {
  sinsal_yeokma: "twelve_sinsal_yeokma", sinsal_hwagae: "twelve_sinsal_hwagae", sinsal_jangseong: "twelve_sinsal_jangseong",
  "shinsal:DOHWASAL": "sinsal_dohwa", "shinsal:HONGYEOMSAL": "sinsal_hongyeom", "shinsal:HYEONCHIMSAL": "sinsal_hyeonchim", "shinsal:BAEKHODAESAL": "sinsal_baekho",
  "shinsal:YEOKMASAL": "twelve_sinsal_yeokma", "shinsal:HWAGAE": "twelve_sinsal_hwagae", "shinsal:TWELVE_JANGSEONGSAL": "twelve_sinsal_jangseong",
  nobleman_cheoneul: "gwiin_cheoneul", nobleman_cheondeok: "gwiin_cheondeok", nobleman_woldeok: "gwiin_woldeok", nobleman_munchang: "gwiin_munchang", nobleman_taegeuk: "gwiin_taegeuk", nobleman_jaego: "gwiin_jaego",
  "shinsal:CHEON_EUL_GWIIN": "gwiin_cheoneul", "shinsal:CHEON_DEOK_GWIIN": "gwiin_cheondeok", "shinsal:WOL_DEOK_GWIIN": "gwiin_woldeok", "shinsal:MUN_CHANG_GWIIN": "gwiin_munchang", "shinsal:HAK_DANG_GWIIN": "gwiin_hakdang", "shinsal:TAEGEUK_GWIIN": "gwiin_taegeuk",
};
export function canonicalFeatureId(id: string): string {
  const base = id.replace(/:day-reference$/, "");
  return FEATURE_ALIASES[base] ?? base;
}
function fact(subject: Evidence["subject"], featureId: string, kind: EvidenceKind, value: unknown, sourceRefs: readonly string[], fields: Partial<Evidence> = {}): Evidence {
  const material = ATOMIC_BY_ID.get(featureId);
  return { id: `${subject}:natal:${featureId}`, featureId, kind, subject, scope: "natal", value, sourceRefs,
    lineage: [`${subject}:natal:${canonicalFeatureId(featureId)}`], certainty: "confirmed", salience: "direct",
    domains: material ? [...new Set([...domainsForTopics(material.contextTags), ...DOMAINS.filter(d => material.contextTags.includes(d))])] : [], ...fields };
}
export function adaptNatalTable(table: CanonicalNatalTableEvidence, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const result = table.features.map(f => fact(subject, canonicalFeatureId(f.id), kinds[f.category] ?? "shinsal", f,
    [`${table.version}:features:${f.id}`, ...f.evidenceIds], { id: `${subject}:natal:${f.id}` }));
  for (const p of table.pillars) {
    for (const [key, kind] of [["pillar", "pillar"], ["hiddenStems", "hidden_stem"], ["tenGod", "ten_god"], ["twelveLifeStage", "life_stage"]] as const) {
      if (p[key] !== undefined) result.push(fact(subject, `pillar:${p.columnId}:${key}`, kind, p[key], [`${table.version}:pillars:${p.columnId}:${key}`], { salience: "supporting" }));
    }
    if (p.columnId === "month") result.push(fact(subject, "season:month_branch", "season", p.earthlyBranch, [`${table.version}:pillars:month:earthlyBranch`], { salience: "supporting" }));
    if (p.columnId === "day") result.push(fact(subject, "spouse_palace:day_branch", "spouse_palace", p.earthlyBranch, [`${table.version}:pillars:day:earthlyBranch`], { salience: "supporting", domains: ["love", "relationship"] }));
  }
  result.push(...table.relations.map(r => fact(subject, r.id, "relation", r, [`${table.version}:relations:${r.id}`], { salience: "supporting", domains: ["relationship", "career"] })));
  return result;
}
/** Consumes the existing FULL weighted calculation. Never counts eight glyphs,
 * runs a calendar, or trusts a prose/legacy missingElements array. */
export function adaptCalculation(calc: SajuCalcResult, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const version = calc.calculationVersion;
  const result: Evidence[] = [fact(subject, "day_master:raw", "day_master", calc.dayMaster, ["SajuCalcResult:dayMaster"], { salience: "supporting" }),
    fact(subject, "yin_yang:balance", "yin_yang", calc.yinYang, ["SajuCalcResult:yinYang"], { salience: "supporting" })];
  for (const [god, value] of Object.entries(calc.tenGods.distribution)) {
    if (value > 0 && godIds[god]) result.push(fact(subject, `ten_god_${godIds[god]}`, "ten_god", value, ["SajuCalcResult:tenGods.distribution:" + god]));
  }
  // A version alone is not a strength score. Weighted engine labels are retained
  // with their method, and uncertain-hour balance never becomes lifestyle advice.
  if (version && calc.elements.weighted) for (const label of calc.elements.labels) {
    const [raw, state] = label.split("_");
    if (state !== "MISSING" && state !== "STRONG") continue;
    const element = raw.toLowerCase(), condition = state === "MISSING" ? "missing" : "excess";
    result.push(fact(subject, `element_${element}_${condition}`, "element", { element, condition, method: "canonical-weighted", version, weighted: calc.elements.weighted },
      [`${version}:elements.labels:${label}`, `${version}:elements.weighted`], { certainty: calc.input.birthTimeUnknown || calc.birthTimeContext?.birthTimePrecision === "approximate" ? "conditional" : "confirmed", domains: ["lifestyle"], salience: "supporting" }));
  }
  for (const pattern of calc.structureAnalysis.patterns) result.push(fact(subject, `structure:${pattern.code}`, "structure", pattern,
    [`SajuCalcResult:structureAnalysis.patterns:${pattern.code}`, ...pattern.evidence.map(e => `${e.source}:${e.keyKo}:${e.valueKo}`)],
    { certainty: pattern.confidence === "LOW" ? "weak" : "confirmed", salience: "supporting" }));
  return result;
}
export function adaptMbti(type: string | null | undefined, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const p = getMbtiSourceProfile(type);
  if (!p) return [];
  const wrap = (id: string, value: unknown): Evidence => fact(subject, id, "mbti", value, [`docs/product/mbti/source/${p.type}.json:${id}`], {
    id: `${subject}:${id}`, scope: "behavior", lineage: [`${subject}:mbti:self-report:${p.type}`], domains: DOMAINS,
  });
  return [wrap(`mbti:${p.type}:type`, p.type),
    ...Object.entries(p.preferenceAxes ?? {}).map(([key, value]) => wrap(`mbti:${p.type}:axis:${key}`, value)),
    ...Object.entries(p.functionStack ?? {}).map(([key, value]) => wrap(`mbti:${p.type}:function:${key}`, value)),
    ...MBTI_TRAIT_AREAS.flatMap(area => (p.traits?.[area] ?? []).flatMap(t => t.id && t.plainKo ? [wrap(`mbti:${p.type}:traits:${area}:${t.id}`, t)] : []))];
}
export function adaptMonthSegment(segment: AnnualMonthSegment, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const period = `${segment.startKst}/${segment.endKstExclusive}`;
  const wrap = (id: string, value: unknown, certainty: Evidence["certainty"], refs: readonly string[]): Evidence => fact(subject, id, "fortune", value, refs, {
    id: `${subject}:monthly:${period}:${id}`, scope: "monthly", period, certainty, lineage: [`${subject}:monthly:${period}:${id}`], domains: ["career", "money", "relationship", "study", "lifestyle"],
  });
  return [wrap("fortune:month_pillar", segment.monthPillar, "confirmed", segment.evidenceIds),
    ...[...new Set([segment.stemTenGod, segment.branchTenGod])].flatMap(g => godIds[g] ? [wrap(`ten_god_${godIds[g]}`, g, "confirmed", [...segment.evidenceIds, `AnnualMonthSegment:${period}:tenGod`])] : []),
    ...segment.relationFacts.map(r => ({ ...wrap(`fortune:relation:${r.type}`, r, r.certainty, [r.id]), id: `${subject}:monthly:${period}:${r.id}` }))];
}
export function adaptMajorFortune(packet: MajorFortuneEvidencePacket, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const period = `${packet.currentCycle.startYear}/${packet.currentCycle.endYear}`;
  const flow = packet.currentMajorFortune;
  return [...new Set([flow.stemTenGod, flow.branchTenGod])].flatMap(g => godIds[g] ? [fact(subject, `ten_god_${godIds[g]}`, "fortune", g,
    [`MajorFortuneEvidencePacket:currentMajorFortune:${period}:${g}`], { id: `${subject}:major:${period}:${g}`, scope: "major", period,
      lineage: [`${subject}:major:${period}:${g}`], certainty: packet.dayunSelection?.transition ? "conditional" : "confirmed", domains: ["career", "money", "study", "lifestyle"] })] : []);
}
export function adaptAnnualFortune(packet: AnnualFortuneEvidencePacket, subject: Evidence["subject"] = "person"): readonly Evidence[] {
  const flow = packet.annualFortune, period = String(flow.year);
  return [...new Set([flow.stemTenGod, flow.branchTenGod])].flatMap(g => godIds[g] ? [fact(subject, `ten_god_${godIds[g]}`, "fortune", g,
    [`AnnualFortuneEvidencePacket:annualFortune:${period}:${g}`], { id: `${subject}:annual:${period}:${g}`, scope: "annual", period,
      lineage: [`${subject}:annual:${period}:${g}`], domains: ["career", "money", "study", "relationship", "lifestyle"] })] : []);
}
/** Merge identical observation IDs, retaining every source but never multiplying
 * support. The least certain adapter wins; alternate values remain in sources. */
export function mergeEvidence(...groups: readonly (readonly Evidence[])[]): readonly Evidence[] {
  const merged = new Map<string, Evidence>();
  for (const e of groups.flat()) {
    const old = merged.get(e.id);
    merged.set(e.id, old ? { ...old, sourceRefs: [...new Set([...old.sourceRefs, ...e.sourceRefs])], lineage: [...new Set([...old.lineage, ...e.lineage])],
      certainty: old.certainty === "weak" || e.certainty === "weak" ? "weak" : old.certainty === "conditional" || e.certainty === "conditional" ? "conditional" : "confirmed" } : e);
  }
  return [...merged.values()];
}
export function validateEvidence(evidence: readonly Evidence[]): readonly string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const e of evidence) {
    if (ids.has(e.id)) errors.push(`duplicate:${e.id}`);
    ids.add(e.id);
    if (!e.sourceRefs.length || !e.lineage.length) errors.push(`missing-provenance:${e.id}`);
    if (["major", "annual", "monthly"].includes(e.scope) && !e.period) errors.push(`missing-period:${e.id}`);
    if (e.featureId.startsWith("ten_god_") && !Object.values(godIds).includes(e.featureId.slice(8))) errors.push(`unknown-ten-god:${e.id}`);
  }
  return errors;
}
