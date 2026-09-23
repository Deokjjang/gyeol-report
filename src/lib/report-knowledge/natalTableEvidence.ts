import { analyzeFullTenGods } from "../saju/analyze";
import { HIDDEN_STEMS, STEM_ELEMENT } from "../saju/constants";
import { analyzeRelations } from "../saju/relations";
import { detectShinsal } from "../saju/shinsal";
import { getTenGod } from "../saju/tenGods";
import type { TenGod } from "../saju/types";
import type { ShinsalDetection } from "../saju/shinsalTypes";
import type { BirthTimeCalculationContext } from "../saju/birthTimePrecisionTypes";
import { publicationBirthTimeContexts } from "../report-generation/birthTimePublication";
import type { ManseRyeokFourPillarGridColumnInput } from "../report-tables/manseRyeokTableData";
import { buildSajuPillarGridColumns, buildSajuPillarFeaturePlacements } from "./sajuPillarFeaturePlacement";
import { extractComputedSajuFeatures } from "./sajuComputedFeatureExtractor";
import { SAJU_FEATURE_BY_ID } from "./sajuFeatureTaxonomy";

export const NATAL_TABLE_VERSION = "canonical-natal-table-v1";
export type NatalPersonRole = "person" | "personA" | "personB";
export type NatalFeature = {
  readonly id: string;
  readonly label: string;
  readonly aliases: readonly string[];
  readonly category: string;
  readonly source: "calculated" | "derived";
  readonly basis: string;
  readonly positions: readonly string[];
  readonly evidenceIds: readonly string[];
};
export type CanonicalNatalTableEvidence = {
  readonly version: typeof NATAL_TABLE_VERSION;
  readonly calendarVersion: string;
  readonly precision: BirthTimeCalculationContext["birthTimePrecision"];
  readonly pillars: readonly ManseRyeokFourPillarGridColumnInput[];
  readonly features: readonly NatalFeature[];
  readonly relations: readonly { id: string; label: string; positions: readonly string[]; participants: readonly string[] }[];
};

const labels: Record<TenGod, string> = { 比肩: "비견", 劫財: "겁재", 食神: "식신", 傷官: "상관", 偏財: "편재", 正財: "정재", 偏官: "편관", 正官: "정관", 偏印: "편인", 正印: "정인" };
const pillarLabels = { year: "연주", month: "월주", day: "일주", hour: "시주" } as const;
const unique = <T,>(values: readonly T[]) => [...new Set(values)];
const isRecord = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);

function detectionBasis(d: ShinsalDetection): string {
  if (d.category === "TWELVE_SHINSAL" && d.basis.kind === "BRANCH_GROUP_TO_BRANCH")
    return d.basis.reference === "YEAR_BRANCH" ? "연지 기준 십이신살" : "일지 기준 십이신살";
  if (d.basis.kind === "YEAR_BRANCH_TO_BRANCH") return "연지 기준 표식";
  if (d.basis.kind === "DAY_BRANCH_TO_BRANCH") return "일지 기준 표식";
  if (d.basis.kind === "DAY_STEM_TO_BRANCH") return "일간 기준 표식";
  if (d.basis.kind.startsWith("MONTH_BRANCH")) return "월지 기준 표식";
  return "원국 계산 표식";
}

// No calendar/Dayun recomputation. Use ONLY the stored confirmed natal pillars.
// Existing engine detections and the existing report feature rules remain distinct.
export function buildCanonicalNatalTable(context: BirthTimeCalculationContext): CanonicalNatalTableEvidence | null {
  const { year, month, day, hour } = context.confirmed;
  if (!year || !month || !day) return null;
  const pillars = { year, month, day, ...(hour ? { hour } : {}) };
  if (Object.values(pillars).some(p => !Object.hasOwn(STEM_ELEMENT, p.stem) || !Object.hasOwn(HIDDEN_STEMS, p.branch))) return null;
  const detection = detectShinsal(pillars);
  const tenGods = analyzeFullTenGods(pillars);
  const input = { yearPillar: year.stem + year.branch, monthPillar: month.stem + month.branch,
    dayPillar: day.stem + day.branch, ...(hour ? { hourPillar: hour.stem + hour.branch } : {}), dayMaster: day.stem };
  const extraction = extractComputedSajuFeatures({ ...input,
    existingSinsal: detection.filter(d => d.category !== "NOBLE_HELP").map(d => d.labelKo),
    existingGwiin: detection.filter(d => d.category === "NOBLE_HELP").map(d => d.labelKo),
    tenGodSignals: Object.entries(tenGods.distribution).filter(([, n]) => n > 0).map(([god]) => ({ tenGod: labels[god as TenGod], strength: "present" })),
  });
  const placements = buildSajuPillarFeaturePlacements({ ...input, productionFeatureIds: extraction.featureIds });
  const features: NatalFeature[] = extraction.featureIds.flatMap(id => {
    const entry = SAJU_FEATURE_BY_ID.get(id);
    if (!entry) return [];
    const aliases = unique([entry.labelKo, ...entry.aliases]);
    const native = detection.filter(d => aliases.includes(d.labelKo));
    const matched = placements.filter(p => p.featureId === id);
    const derivedTwelve = id.startsWith("twelve_sinsal_");
    const result: NatalFeature[] = [{ id, label: entry.labelKo, aliases, category: entry.category,
      source: native.length ? "calculated" as const : "derived" as const,
      basis: native.length ? unique(native.map(detectionBasis)).join(" · ")
        : derivedTwelve ? "일지 기준 십이신살" : id === "sinsal_dohwa" ? "일지 기준 도화" : "원국 전체의 파생 근거",
      positions: unique(native.length ? native.flatMap(d => d.positions) : matched.map(p => p.pillar)),
      evidenceIds: unique([`natal:${id}`, ...native.flatMap(d => d.evidence), ...extraction.details.filter(d => d.featureId === id).map(d => `${extraction.ruleSetVersion}:${d.matchedBy}`)]),
    }];
    if (native.length && derivedTwelve && matched.length) result.push({
      id: `${id}:day-reference`, label: entry.labelKo, aliases, category: entry.category, source: "derived",
      basis: "일지 기준 십이신살", positions: unique(matched.map(p => p.pillar)),
      evidenceIds: matched.map(p => `natal:${id}:${p.pillar}:day-reference`),
    });
    return result;
  });
  // Engine detections without a narrative-taxonomy alias are still calculated facts.
  for (const d of detection) {
    if (features.some(f => f.aliases.includes(d.labelKo))) continue;
    features.push({ id: `shinsal:${d.code}`, label: d.labelKo, aliases: [d.labelKo], category: d.category === "NOBLE_HELP" ? "gwiin" : d.category === "TWELVE_SHINSAL" ? "twelve_sinsal" : "sinsal",
      source: "calculated", basis: detectionBasis(d),
      positions: detection.filter(s => s.code === d.code).flatMap(s => s.positions), evidenceIds: detection.filter(s => s.code === d.code).flatMap(s => s.evidence) });
  }
  const relationResult = analyzeRelations(pillars);
  const relations = [
    ...relationResult.stemCombinations.map(r => ({ ...r, name: "천간합" })),
    ...relationResult.branchCombinations.map(r => ({ ...r, name: "지지육합" })),
    ...relationResult.branchClashes.map(r => ({ ...r, name: "지지충" })),
  ].map(r => ({ id: `natal:${r.type}:${r.positions.join(":")}:${r.pair.join("")}`,
    label: `${r.positions.map(p => pillarLabels[p]).join("·")} ${r.name} ${r.pair.join("")}`, positions: r.positions, participants: r.pair }));
  const grid = buildSajuPillarGridColumns(input).filter(p => pillars[p.columnId]).map(p => {
    const actual = pillars[p.columnId]!;
    const detected = detection.filter(d => d.positions.includes(p.columnId));
    // HIDDEN_STEMS is the calculation engine's main/sub/minor contract, not the
    // broader legacy display dictionary. Branch ten-god uses its MAIN stem.
    const hidden = HIDDEN_STEMS[actual.branch];
    return { ...p, pillar: actual.stem + actual.branch, heavenlyStem: actual.stem, earthlyBranch: actual.branch,
      tenGod: [`천간 ${labels[getTenGod(day.stem, actual.stem)]}`, `지지 ${labels[getTenGod(day.stem, hidden[0].stem)]}`],
      hiddenStems: hidden.map(h => `${h.stem} ${labels[getTenGod(day.stem, h.stem)]}`),
      twelveSinsal: unique(detected.filter(d => d.category === "TWELVE_SHINSAL").map(d => d.labelKo)),
      sinsal: unique(detected.filter(d => d.category !== "TWELVE_SHINSAL" && d.category !== "NOBLE_HELP").map(d => d.labelKo)),
      gwiin: unique(detected.filter(d => d.category === "NOBLE_HELP").map(d => d.labelKo)),
      interactions: relations.filter(r => r.positions.includes(p.columnId)).map(r => r.label),
    };
  });
  return { version: NATAL_TABLE_VERSION, calendarVersion: context.calendarVersion, precision: context.birthTimePrecision, pillars: grid, features, relations };
}

export function buildProductNatalTables(evidence: unknown) {
  const contexts = publicationBirthTimeContexts(evidence);
  return contexts ? Object.fromEntries(Object.entries(contexts).map(([role, context]) => [role, buildCanonicalNatalTable(context)])) : undefined;
}

export function getCanonicalNatalTable(evidence: unknown, role: NatalPersonRole = "person"): CanonicalNatalTableEvidence | undefined {
  if (!isRecord(evidence) || !isRecord(evidence.natalTableEvidence)) return;
  const value = evidence.natalTableEvidence[role];
  return isRecord(value) && value.version === NATAL_TABLE_VERSION && Array.isArray(value.pillars) && Array.isArray(value.features)
    ? value as CanonicalNatalTableEvidence : undefined;
}

export function validateNatalTableEvidence(evidence: unknown): string[] {
  if (!isRecord(evidence) || evidence.natalTableEvidence === undefined) return []; // Legacy snapshot; never backfill on read.
  const expected = buildProductNatalTables(evidence);
  const stable = (value: unknown): string => Array.isArray(value) ? `[${value.map(stable).join(",")}]`
    : isRecord(value) ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}` : JSON.stringify(value);
  return expected && stable(expected) === stable(evidence.natalTableEvidence) ? [] : ["NATAL_TABLE_EVIDENCE_MISMATCH"];
}

// Only natal marker IDs are checked here. Fortune and pair relations retain their
// separate validators; a future/partner feature cannot authorize a natal claim.
export function validateNatalFeatureProvenance(product: string, draft: unknown, evidence: unknown): string[] {
  if (!isRecord(evidence) || evidence.natalTableEvidence === undefined) return [];
  const errors: string[] = [];
  const check = (ids: unknown[], role: NatalPersonRole) => {
    const table = getCanonicalNatalTable(evidence, role);
    const allowed = new Set(table?.features.map(f => f.id));
    for (const value of ids) {
      if (typeof value !== "string") continue;
      const id = value.replace(/^feature_/, "");
      const entry = SAJU_FEATURE_BY_ID.get(id);
      if (entry && ["sinsal", "gwiin", "twelve_sinsal", "day_pillar", "ten_god"].includes(entry.category) && !allowed.has(id))
        errors.push(`NATAL_FEATURE_UNSUPPORTED:${role}:${id}`);
    }
  };
  const checkLabels = (values: unknown, role: NatalPersonRole = "person") => {
    if (!Array.isArray(values)) return;
    const table = getCanonicalNatalTable(evidence, role);
    const supported = new Set(table?.features.flatMap(f => f.aliases));
    const known = [...SAJU_FEATURE_BY_ID.values()].filter(f => ["sinsal", "gwiin", "twelve_sinsal", "ten_god"].includes(f.category));
    for (const label of values) if (typeof label === "string" && known.some(f => f.labelKo === label || f.aliases.includes(label)) && !supported.has(label))
      errors.push(`NATAL_LABEL_UNSUPPORTED:${role}:${label}`);
  };
  checkLabels(evidence.natalLabels);
  if (isRecord(evidence.baseSaju)) checkLabels(evidence.baseSaju.natalLabels);
  if (isRecord(evidence.sajuBasis) && Array.isArray(evidence.sajuBasis.fullPillars))
    for (const p of evidence.sajuBasis.fullPillars.filter(isRecord)) { checkLabels(p.sinsal); checkLabels(p.gwiin); }
  if (product === "saju_mbti_full" && Array.isArray(evidence.sajuFeatureDictionary))
    check(evidence.sajuFeatureDictionary.filter(isRecord).map(f => f.sourceFeatureId ?? f.id), "person");
  if (product === "saju_mbti_compatibility" && isRecord(draft) && isRecord(draft.chartComparison)) {
    for (const role of ["personA", "personB"] as const) {
      const chart = draft.chartComparison[role];
      if (isRecord(chart) && Array.isArray(chart.featureIds)) check(chart.featureIds, role);
    }
  }
  return unique(errors);
}
