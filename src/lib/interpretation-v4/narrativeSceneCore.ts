import type { AxisRequirement } from "./fusionCore";
import type { GuidanceUserContext, LifeStatus, WorkMode } from "./guidanceCore";
import type { EditorialCandidate, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { InterpretationContext, SemanticSignature } from "./semanticCore";
import { stableVariants } from "./narrativeVariant";

export const GYEOL_SCENE_REGISTRY_VERSION = "scene-registry-13d-5b-v1";
export const SCENE_FAMILIES = ["EVERYDAY", "WORK", "MONEY", "SOCIAL", "LOVE", "LEARNING", "STRESS", "RECOVERY"] as const;
export type SceneFamily = typeof SCENE_FAMILIES[number];
export type SceneSpec = {
  id: string; family: SceneFamily; contexts: InterpretationContext[]; requiredThemes?: string[];
  requiredAxes: AxisRequirement[]; compatibleWorkModes?: WorkMode[]; incompatibleWorkModes?: WorkMode[];
  compatibleLifeStatus?: LifeStatus[]; sourceText: string; specificityLevel: "GENERAL" | "CONTEXTUAL";
  risk: "LOW" | "MEDIUM"; priority: number; shadowOnly?: boolean;
};
export type SceneUse = { sceneId: string; family: SceneFamily; theme: string; candidateId: string; sectionId: ComprehensiveSectionId; score: number };
export function sceneRows(family: SceneFamily, group: string, contexts: InterpretationContext[], rows: readonly (readonly [AxisRequirement["axis"], string, number?])[], modes?: WorkMode[]): SceneSpec[] {
  return rows.map(([axis, sourceText, direction = 1], i) => ({ id: `scene:${group}:${i + 1}`, family, contexts,
    requiredAxes: [{ axis, direction: direction < 0 ? -1 : 1 }], sourceText,
    ...(modes ? { compatibleWorkModes: modes } : {}), specificityLevel: modes && !modes.includes("GENERAL") ? "CONTEXTUAL" : "GENERAL",
    risk: "LOW", priority: i, ...(family === "STRESS" ? { shadowOnly: true } : {}) }));
}
export function inspectSceneSafety(s: SceneSpec): string[] {
  return /지난달|지난주|어제|매주|월요일|화요일|수요일|목요일|금요일|토요일|일요일|\d+시|\d{4}년|삼성|네이버|당신의 (?:남편|아내|엄마)|주식|코인|질병|우울증/.test(s.sourceText) ? ["UNSUPPORTED_SPECIFICITY"] : [];
}
const allowed: Record<ComprehensiveSectionId, readonly SceneFamily[]> = {
  C1: ["EVERYDAY"], C2: ["EVERYDAY", "LEARNING"], C3: ["EVERYDAY", "SOCIAL"],
  C4: ["EVERYDAY", "LEARNING"], C5: [], C6: ["STRESS"], C7: ["SOCIAL", "LOVE"],
  C8: ["WORK", "MONEY", "LEARNING"], C9: ["RECOVERY"], C10: [],
};
/** Scores editorial fit only. Signs are taken from selected proof, not inferred from a job. */
export function chooseNarrativeScene(registry: readonly SceneSpec[], candidate: EditorialCandidate, section: ComprehensiveSectionId,
  context: InterpretationContext, user: GuidanceUserContext, axes: SemanticSignature, used: readonly SceneUse[], stableKey: string) {
  if (["C1", "C6", "C9"].includes(section) && used.some(s => s.sectionId === section)) return undefined;
  const rows = registry.filter(s => allowed[section].includes(s.family) && !inspectSceneSafety(s).length
    && s.contexts.includes(context) && (!s.shadowOnly || candidate.factBomb)
    && (!s.requiredThemes || s.requiredThemes.includes(candidate.semanticTheme))
    && s.requiredAxes.every(a => candidate.primaryAxes.includes(a.axis) && (axes[a.axis] ?? 0) * a.direction > 0)
    && (!s.compatibleLifeStatus || s.compatibleLifeStatus.includes(user.lifeStatus))
    && (!s.compatibleWorkModes || s.compatibleWorkModes.includes("GENERAL") || user.workModes.some(m => m.confidence >= .65 && s.compatibleWorkModes!.includes(m.mode)))
    && !user.workModes.some(m => s.incompatibleWorkModes?.includes(m.mode))
    && !used.some(u => u.sceneId === s.id || u.family === s.family && u.theme === candidate.semanticTheme)
    && (s.family !== "MONEY" || context === "money") && (s.family !== "WORK" || context === "work"))
    .map(s => ({ scene: s, score: 40 + 25 + (s.compatibleWorkModes?.some(m => user.workModes.some(w => w.mode === m && w.confidence >= .65)) ? 15 : 5) + 10 + 10 }));
  return stableVariants(rows, `${stableKey}|${section}|${candidate.id}|${GYEOL_SCENE_REGISTRY_VERSION}`).sort((a, b) => b.score - a.score)[0];
}
