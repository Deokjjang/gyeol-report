import { STEM_YIN_YANG, BRANCH_YIN_YANG } from "../saju/constants";
import { buildCanonicalNatalTable } from "../report-knowledge/natalTableEvidence";
import { analyzeV4Strength, structureContext } from "./strength";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";
import { depthFeature } from "./materialDepth";
import { FUSION_RULES } from "./fusionRules";
import type { SajuCalcResult } from "../saju/types";
import type { MaterialPacket } from "./narrativeTypes";
import type { BoundMaterial } from "./materialPacket";
import type { Domain, FusionInterpretation } from "./types";

/** Counts confirmed visible characters once. No hidden-stem weight, E/I
 * inference, guessed hour or change to the calendar/strength calculation. */
export function projectYinYang(calculation: SajuCalcResult) {
  const context = structureContext(calculation);
  const characters = context.valid ? Object.entries(calculation.pillars).flatMap(([position, p]) => p ? [
    { position, character: p.stem, polarity: STEM_YIN_YANG[p.stem], source: `STEM_YIN_YANG:${p.stem}` },
    { position, character: p.branch, polarity: BRANCH_YIN_YANG[p.branch], source: `BRANCH_YIN_YANG:${p.branch}` },
  ] : []) : [];
  const yin = characters.filter(c => c.polarity === "YIN").length;
  const yang = characters.filter(c => c.polarity === "YANG").length;
  return { yin, yang, total: characters.length, complete: context.complete,
    direction: yin === yang ? "mixed" as const : yin > yang ? "inward" as const : "outward" as const,
    characters, provenance: ["visible-characters-unweighted", ...characters.map(c => `${c.position}:${c.source}`)] };
}

export type ContentEvidencePool = ReturnType<typeof buildContentEvidencePool>;
export function buildContentEvidencePool(calculation: SajuCalcResult, materials: MaterialPacket) {
  const valid = structureContext(calculation).valid;
  const table = valid && calculation.birthTimeContext ? buildCanonicalNatalTable(calculation.birthTimeContext) : null;
  return { materials: materials.selected, fusions: materials.fusions, fortunes: materials.fortuneComposites,
    elements: materials.symbolicElements, yinYang: projectYinYang(calculation),
    strength: analyzeV4Strength(calculation), relations: table?.relations ?? [],
    stages: table?.pillars.flatMap(p => (p.twelveLifeStage ?? []).map(label => ({ position: p.columnId, label, pillar: p.pillar }))) ?? [],
    held: materials.held };
}

export const contentFeature = (feature: string) => depthFeature(feature);
export const materialLabel = (m: BoundMaterial) => MATERIAL_BY_FEATURE.get(m.feature)?.label ?? "";
export function fusionDomains(f: FusionInterpretation): readonly Domain[] {
  // Phase1 stores only its first eligible domain. Recover the already reviewed
  // rule domains instead of treating that first domain as its entire meaning.
  return FUSION_RULES.find(r => r.id === f.ruleId)?.domains ?? [f.domain];
}

export type ChapterEvidencePlan = {
  id: string; domain: Domain; roots: readonly BoundMaterial[];
  fusion: FusionInterpretation | null;
  consideredFusionIds: readonly string[];
  reasons: readonly string[];
};
export type ContentSelectionState = { rootUses: Map<string, number>; fusionUses: Map<string, number>; seedUses: Set<string> };
export const createContentSelection = (): ContentSelectionState => ({ rootUses: new Map(), fusionUses: new Map(), seedUses: new Set() });

/** Editorial allocation, not a personality score. Only strong, source-verified
 * material enters roots; DB-only/ambiguous/uncertain remain in held. */
export function planChapter(pool: ContentEvidencePool, state: ContentSelectionState, id: string, domain: Domain, preferred: readonly string[] = [], anchors: readonly string[] = []): ChapterEvidencePlan {
  const areas: readonly Domain[] = domain === "weaknesses" ? ["weaknesses", "identity"] : [domain];
  const candidates = pool.materials.filter(m => m.material.seeds.some(s => s.domains.some(d => areas.includes(d))) &&
    MATERIAL_BY_FEATURE.get(m.feature)?.domains.some(d => areas.includes(d)) &&
    (anchors.includes(m.feature) || (state.rootUses.get(m.feature) ?? 0) < (m.material.category === "dayPillar" || m.material.category === "dayMaster" ? 2 : 3)));
  const fusions = pool.fusions.filter(f => fusionDomains(f).some(d => areas.includes(d)) && (state.fusionUses.get(f.ruleId) ?? 0) < 2);
  const rank = (m: BoundMaterial) => {
    const support = Math.min(3, new Set(m.evidence.flatMap(d => d.evidence.lineage)).size);
    const fusion = fusions.some(f => f.myeongliEvidence.some(d => contentFeature(d.evidence.feature) === m.feature));
    const weight = Math.min(3, Math.max(0, ...m.evidence.map(d => d.evidence.weight ?? 0)));
    const sceneSupport = preferred.includes(m.feature) ? 14 - Math.min(4, preferred.indexOf(m.feature)) : 0;
    return (state.rootUses.get(m.feature) ?? 0) * 12 - support - weight - (fusion ? 4 : 0) - (m.material.category === "structure" ? 2 : 0) - sceneSupport;
  };
  // A scene already talking about 비견 must not acquire an unrelated 귀인
  // definition merely because novelty scored higher. Diversity is a report
  // planning concern; explanatory evidence must stay bound to this scene.
  const anchored = candidates.filter(m => anchors.includes(m.feature));
  const ordered = (anchors.length ? anchored : candidates).toSorted((a, b) => rank(a) - rank(b) || a.feature.localeCompare(b.feature));
  const first = ordered[0];
  const second = ordered.find(m => m !== first && m.material.category !== first?.material.category) ?? ordered[1];
  const roots = [first, second].filter((m): m is BoundMaterial => Boolean(m));
  const relevant = fusions.filter(f => f.kind === "complement" || f.myeongliEvidence.some(d => roots.some(m => m.feature === contentFeature(d.evidence.feature))));
  const fusion = relevant.toSorted((a, b) => (state.fusionUses.get(a.ruleId) ?? 0) - (state.fusionUses.get(b.ruleId) ?? 0) ||
    Number(b.kind !== "overlap") - Number(a.kind !== "overlap") || a.ruleId.localeCompare(b.ruleId))[0] ?? null;
  roots.forEach(m => state.rootUses.set(m.feature, (state.rootUses.get(m.feature) ?? 0) + 1));
  if (fusion) state.fusionUses.set(fusion.ruleId, (state.fusionUses.get(fusion.ruleId) ?? 0) + 1);
  return { id, domain, roots, fusion, consideredFusionIds: fusions.map(f => f.ruleId),
    reasons: ["DOMAIN_APPLICABILITY", "STRONG_VERIFIED_EVIDENCE", "INDEPENDENT_SUPPORT", "REVIEWED_MBTI_RELATION", "REPORT_NOVELTY", ...(anchors.length ? ["SCENE_EVIDENCE_ALIGNMENT"] : [])] };
}
