import { buildCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { SHINSAL_RULES } from "../saju/shinsalConstants";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { EXTRACTOR_DIRECT_IDS } from "../interpretation-v3/featureCapabilities";
import { adaptCalculation } from "../interpretation-v3/evidence";
import { GOD_CODES, storySupport } from "../interpretation-v3/comprehensiveStoryEvidence";
import type { SajuCalcResult } from "../saju/types";
import { canonicalV4Feature, MATERIAL_BY_FEATURE } from "./materialRegistry";
import type { EvidenceDecision, EvidenceStatus, Observation } from "./types";
import { buildMyeongliStructure } from "./structureEvidence";
import { STRUCTURE_IDS } from "./structureRules";
import { STRUCTURE_VERSION } from "./structureTypes";

const native = new Set(SHINSAL_RULES.map(r => canonicalV4Feature(`shinsal:${r.code}`)));
const derived = new Set(EXTRACTOR_DIRECT_IDS.map(canonicalV4Feature));
const dbOnly = new Set(["gwiin_mungok", "gwiin_bokseong", "gwiin_cheoneuiseong"]);
const dayMasterIds = { 甲: "gabmok", 乙: "eulmok", 丙: "byeonghwa", 丁: "jeonghwa", 戊: "muto", 己: "gito", 庚: "gyeonggeum", 辛: "singeum", 壬: "imsu", 癸: "gyesu" } as const;
const unique = (xs: readonly string[]) => [...new Set(xs)].sort();

/** Fail closed: caller-supplied labels/strengths are not calculated evidence. */
export function evaluateEvidence(raw: Observation): EvidenceDecision {
  const evidence = { ...raw, feature: canonicalV4Feature(raw.feature) };
  const reject = (status: EvidenceStatus, reason: string): EvidenceDecision => ({ evidence, status, strength: "none", usable: false, reasons: [reason] });
  if (evidence.feature === "twelve_sinsal_mangsin" || evidence.sourceRefs.some(r => /(?:MANGSINSAL|twelve_sinsal_mangsin)/.test(r)))
    return reject("ambiguous/conflicted", "MANGSIN_CANONICAL_RULE_CONFLICT");
  if (dbOnly.has(evidence.feature)) return reject("db-only", "NO_CANONICAL_PRODUCER");
  if (evidence.feature.startsWith("v4_structure:")) {
    const s = evidence.structure;
    if (!s || !STRUCTURE_IDS.includes(s.id) || evidence.feature !== `v4_structure:${s.id}` || s.version !== STRUCTURE_VERSION ||
      evidence.method !== "v4-structure" || !s.provenance.includes(`v4:structure-rule:${s.id}`) || !evidence.sourceRefs.includes(STRUCTURE_VERSION))
      return reject("unsupported", "UNVERIFIED_V4_STRUCTURE");
    if (s.confidence !== "strong" || !evidence.completeChart || evidence.certainty !== "confirmed")
      return reject("ambiguous/conflicted", "STRUCTURE_NOT_HERO_CONFIDENCE");
    if (evidence.scope !== "natal" || evidence.period || !evidence.substantial || s.supportingEvidence.length < 2 || !s.lineage.length || !evidence.lineage.length)
      return reject("unsupported", "STRUCTURE_PROOF_OR_SCOPE_MISSING");
    return { evidence, status: "derived-but-supported", strength: "strong", usable: true, reasons: [] };
  }
  if (/^(?:structure[:_]|pattern_|special_pattern)/.test(evidence.feature))
    return reject("unsupported", "CLASSICAL_STRUCTURE_NOT_VERIFIED");
  const isGod = Object.keys(GOD_CODES).some(code => evidence.feature === `ten_god_${code}`);
  const isDayMaster = Object.values(dayMasterIds).some(id => evidence.feature === `day_master_${id}`);
  const gap = evidence.feature === "distribution:output-low";
  const supported = native.has(evidence.feature) || derived.has(evidence.feature) || isGod || isDayMaster || gap;
  if (!supported) return reject(MATERIAL_BY_FEATURE.has(evidence.feature) ? "db-only" : "unsupported", "NO_SUPPORTED_RULE");
  if (!evidence.sourceRefs.length || !evidence.lineage.length) return reject("unsupported", "MISSING_PROVENANCE");
  if (evidence.scope !== "natal" || evidence.period) return reject("unsupported", "TRANSIT_ADAPTER_NOT_IN_PHASE1");
  if (evidence.method === "supplied") return reject("unsupported", "SUPPLIED_LABEL_IS_NOT_EVIDENCE");
  if (evidence.certainty !== "confirmed") return reject("ambiguous/conflicted", "UNCONFIRMED_INPUT");
  if ((isGod || gap) && (evidence.weight === undefined || !Number.isFinite(evidence.weight) || evidence.weight < 0))
    return reject("unsupported", "INVALID_RAW_WEIGHT");
  if (gap && (!evidence.completeChart || evidence.method !== "weighted-output-gap" || evidence.weight! >= 0.6))
    return reject("unsupported", "OUTPUT_GAP_NOT_CONFIRMED");
  if (isGod && (evidence.method !== "canonical-calculation" || evidence.weight! <= 0))
    return reject("unsupported", "TEN_GOD_NOT_OBSERVED");
  if (!gap && !isGod && evidence.method !== "canonical-marker" && evidence.method !== "supported-derivation" && !(isDayMaster && evidence.method === "canonical-calculation"))
    return reject("unsupported", "FEATURE_METHOD_MISMATCH");
  const status: EvidenceStatus = evidence.method === "supported-derivation" ? "derived-but-supported" : "confirmed/calculated";
  // Weak PRESENT facts never lead; a verified low-output distribution is a
  // different fact, only usable by complement rules, capped at supporting.
  const strength = gap ? "supporting" : evidence.substantial && (!isGod || evidence.weight! >= 0.6) ? "strong" : "weak";
  return { evidence, status, strength, usable: strength !== "weak", reasons: strength === "weak" ? ["MINOR_EVIDENCE_NOT_A_HERO"] : [] };
}

/** Read current canonical evidence unchanged, plus the isolated V4 structure
 * layer. Never accept a precomputed structure packet from another chart. */
export function buildV4Evidence(calc: SajuCalcResult, subject: Observation["subject"] = "person"): readonly Observation[] {
  const context = calc.birthTimeContext;
  const contextMatches = context?.calendarVersion === calc.calculationVersion && context?.birthDate === calc.input.birthDate && calc.calculationVersion === SAJU_CALENDAR_VERSION &&
    (["year", "month", "day", "hour"] as const).every(key => {
      const p = calc.pillars[key], c = context?.confirmed[key];
      return p?.stem === c?.stem && p?.branch === c?.branch;
    });
  const completeChart = Boolean(contextMatches && !calc.input.birthTimeUnknown && context?.confirmed.hour &&
    (["year", "month", "day", "hour"] as const).every(key => context?.stable[key]));
  const facts = adaptCalculation(calc);
  const wrap = (feature: string, fields: Partial<Observation>): Observation => ({
    id: `${subject}:natal:${feature}`, feature, subject, scope: "natal", certainty: contextMatches ? "confirmed" : "conditional",
    method: "canonical-calculation", substantial: false, completeChart,
    sourceRefs: [`SajuCalcResult:${calc.calculationVersion ?? "unversioned"}:${feature}`],
    lineage: [`${subject}:natal:${canonicalV4Feature(feature)}`], ...fields,
  });
  const result: Observation[] = [wrap(`day_master_${dayMasterIds[calc.dayMaster]}`, { substantial: true })];
  for (const [code, god] of Object.entries(GOD_CODES)) {
    const weight = calc.tenGods.distribution[god];
    if (weight > 0) result.push(wrap(`ten_god_${code}`, { weight, substantial: storySupport(`ten_god_${code}`, facts, calc).substantial,
      sourceRefs: [`SajuCalcResult:tenGods.distribution:${god}`, "src/lib/interpretation-v3/comprehensiveStoryEvidence.ts:storySupport", `calendar:${calc.calculationVersion}`] }));
  }
  const outputWeight = calc.tenGods.distribution["食神"] + calc.tenGods.distribution["傷官"];
  if (Number.isFinite(outputWeight) && outputWeight < 0.6) result.push(wrap("distribution:output-low", {
    method: "weighted-output-gap", weight: outputWeight, certainty: completeChart ? "confirmed" : "conditional",
    sourceRefs: ["SajuCalcResult:tenGods.distribution:食神", "SajuCalcResult:tenGods.distribution:傷官", "BirthTimeCalculationContext:confirmed", "storySupport:existing-0.6-editorial-floor"],
    lineage: [`${subject}:natal:ten_god_shi_shen`, `${subject}:natal:ten_god_shang_guan`],
  }));
  const table = contextMatches && context ? buildCanonicalNatalTable(context) : null;
  for (const f of table?.features ?? []) {
    const feature = canonicalV4Feature(f.id);
    if (feature.startsWith("ten_god_")) continue; // Never bypass raw weighted support with a table alias.
    result.push(wrap(feature, { method: f.source === "calculated" ? "canonical-marker" : "supported-derivation",
      substantial: true, sourceRefs: [`${table!.version}:features:${f.id}`, ...f.evidenceIds] }));
  }
  for (const p of calc.structureAnalysis.patterns) result.push(wrap(`structure:${p.code}`, {
    method: "supplied", sourceRefs: [`SajuCalcResult:structureAnalysis:${p.code}`],
  }));
  for (const s of buildMyeongliStructure(calc).candidates) result.push(wrap(`v4_structure:${s.id}`, {
    method: "v4-structure", substantial: s.confidence === "strong", structure: s,
    sourceRefs: s.provenance,
    lineage: unique([...s.lineage.map(ref => `${subject}:${ref}`), ...s.supportingEvidence.flatMap(a =>
      Object.entries(GOD_CODES).filter(([, god]) => god === a.god).map(([code]) => `${subject}:natal:ten_god_${code}`))]),
  }));
  // Duplicate aliases retain all provenance, never multiply support.
  const merged = new Map<string, Observation>();
  for (const f of result) {
    const key = canonicalV4Feature(f.feature), old = merged.get(key);
    merged.set(key, old ? { ...old, sourceRefs: unique([...old.sourceRefs, ...f.sourceRefs]), lineage: unique([...old.lineage, ...f.lineage]) } : f);
  }
  return [...merged.values()].sort((a, b) => a.feature.localeCompare(b.feature));
}
