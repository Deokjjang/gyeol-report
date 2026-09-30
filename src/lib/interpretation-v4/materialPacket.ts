import type { SajuCalcResult, FiveElement } from "../saju/types";
import { analyzeFullElements } from "../saju/analyze";
import { buildFusionCore } from "./fusion";
import { structureContext } from "./strength";
import { getMaterialDepth, depthFeature } from "./materialDepth";
import { ELEMENT_DEPTH, type ElementState } from "./elementMaterials";
import type { EvidenceDecision, Observation } from "./types";
import type { MaterialDepth } from "./materialDepthTypes";

const unique = (values: readonly string[]) => [...new Set(values)].sort();
export type BoundMaterial = {
  readonly feature: string;
  readonly material: MaterialDepth;
  readonly evidence: readonly EvidenceDecision[];
  readonly heroEligible: true;
  readonly sourceRefs: readonly string[];
  readonly lineage: readonly string[];
};
export type HeldMaterial = { readonly feature: string; readonly reasons: readonly string[]; readonly sourceRefs: readonly string[] };

/** Offline material selection only. No ordering, narrative generation, UI or persistence. */
export function buildMyeongliMaterialPacket(input: {
  readonly calculation: SajuCalcResult;
  readonly mbti?: string | null;
  readonly subject?: Observation["subject"];
}) {
  const { calculation } = input, context = structureContext(calculation), core = buildFusionCore(input);
  const groups = new Map<string, EvidenceDecision[]>();
  for (const d of core.decisions) {
    const feature = depthFeature(d.evidence.feature);
    groups.set(feature, [...(groups.get(feature) ?? []), d]);
  }
  const selected: BoundMaterial[] = [], held: HeldMaterial[] = [];
  for (const [feature, evidence] of groups) {
    const material = getMaterialDepth(feature);
    const sources = unique(evidence.flatMap(d => d.evidence.sourceRefs));
    const reasons = unique([
      ...(!context.valid ? context.reasons : []),
      ...evidence.flatMap(d => !d.usable || d.strength !== "strong" ? [...d.reasons, "NOT_STRONG_MATERIAL_EVIDENCE"] : []),
      ...(!material ? ["NO_PHASE3_MATERIAL"] : ["support-only", "symbolic-only"].includes(material.use) ? ["NOT_DIRECT_CHARACTER_MATERIAL"] : []),
    ]);
    if (reasons.length || !material) {
      held.push({ feature, reasons, sourceRefs: sources });
      continue;
    }
    selected.push({ feature, material, evidence, heroEligible: true,
      sourceRefs: unique([...sources, ...material.sourceRefs]), lineage: unique(evidence.flatMap(d => d.evidence.lineage)) });
  }
  // Keep uncertain/suppressed structure reasons available without direct copy.
  for (const assessment of core.structureLayer.assessments) {
    const feature = `v4_structure:${assessment.id}`;
    if (!groups.has(feature)) held.push({ feature, reasons: [assessment.status, ...assessment.reasons], sourceRefs: [`v4:structure-rule:${assessment.id}`] });
  }
  // Projection of existing weighted labels only. Unknown hour cannot establish
  // excess/absence/balance. Check against the same canonical pure calculation.
  const elements: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
  const canonicalElements = context.complete ? analyzeFullElements(calculation.pillars) : null;
  const verifiedElements = canonicalElements !== null && elements.every(element =>
    canonicalElements.visible[element] === calculation.elements.visible[element] && canonicalElements.weighted[element] === calculation.elements.weighted[element]) &&
    JSON.stringify(canonicalElements.labels.toSorted()) === JSON.stringify(calculation.elements.labels.toSorted());
  const symbolicElements = verifiedElements ? elements.map(element => {
    const labels: readonly string[] = calculation.elements.labels;
    const state: ElementState = labels.includes(`${element}_STRONG`) ? "high" :
      labels.includes(`${element}_WEAK`) || labels.includes(`${element}_MISSING`) ? "low" : "balanced";
    const material = ELEMENT_DEPTH.find(m => m.element === element && m.state === state)!;
    return { element, state, material, heroEligible: false as const, symbolicOnly: true as const,
      sourceRefs: unique([...material.sourceRefs, `calendar:${calculation.calculationVersion}`, "BirthTimeCalculationContext:confirmed", `SajuCalcResult:elements.weighted:${element}:${calculation.elements.weighted[element]}`]) };
  }) : [];
  if (!verifiedElements) held.push({ feature: "elements:symbolic", reasons: [context.complete ? "ELEMENT_SOURCE_MISMATCH" : "INCOMPLETE_OR_UNVERIFIED_CHART"], sourceRefs: ["SajuCalcResult:elements", "BirthTimeCalculationContext:confirmed"] });
  return { version: "v4-material-packet-1" as const, subject: input.subject ?? "person",
    selected: selected.sort((a, b) => a.feature.localeCompare(b.feature)),
    symbolicElements, held: held.sort((a, b) => a.feature.localeCompare(b.feature)),
    // Same existing reviewed rules; enrichment does not create new Fusion links.
    fusions: context.valid ? core.fusions : [], fortuneComposites: context.valid ? core.fortuneComposites : [],
    scope: "natal-material-only" as const,
  };
}
