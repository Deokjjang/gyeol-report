import type { ComprehensiveSectionId, EditorialCandidate } from "./comprehensivePlanCore";
import { GYEOL_TITLE_ENGINE_VERSION, TITLE_SKELETONS, type TitleType } from "./narrativeTitleRegistry";
import { stableVariants } from "./narrativeVariant";
import { shortTitleChoices } from "./narrativeTitleShort";
export type TitleUse = { sectionId: ComprehensiveSectionId; candidateId: string; text: string; type: TitleType; skeletonId: string; family: string; sourceText: string };
const allowed: Record<ComprehensiveSectionId, readonly TitleType[]> = {
  C1: ["T1_DIRECT_JUDGMENT", "T2_HUMAN_CONTRADICTION", "T3_LIFE_SCENE"], C2: ["T1_DIRECT_JUDGMENT", "T2_HUMAN_CONTRADICTION", "T3_LIFE_SCENE"],
  C3: ["T2_HUMAN_CONTRADICTION", "T3_LIFE_SCENE"], C4: ["T1_DIRECT_JUDGMENT", "T3_LIFE_SCENE", "T6_ACTION_DIRECTION"],
  C5: ["T4_GOOD_FORTUNE"], C6: ["T5_FACT_BOMB", "T3_LIFE_SCENE"], C7: ["T1_DIRECT_JUDGMENT", "T2_HUMAN_CONTRADICTION", "T3_LIFE_SCENE"],
  C8: ["T1_DIRECT_JUDGMENT", "T3_LIFE_SCENE", "T4_GOOD_FORTUNE", "T6_ACTION_DIRECTION"], C9: ["T2_HUMAN_CONTRADICTION", "T3_LIFE_SCENE", "T6_ACTION_DIRECTION"], C10: ["T6_ACTION_DIRECTION"],
};
export function chooseNarrativeTitle(c: EditorialCandidate, sectionId: ComprehensiveSectionId, used: readonly TitleUse[], key: string): TitleUse {
  const types = sectionId === "C5" && !c.fortune ? ["T1_DIRECT_JUDGMENT" as const] : allowed[sectionId];
  const eligible = TITLE_SKELETONS.filter(s => types.includes(s.type) && s.required.every(word => c.sourceText.includes(word))
    && (s.type !== "T4_GOOD_FORTUNE" || c.fortune && c.sourceType === "CLAIM")
    && (s.type !== "T5_FACT_BOMB" || c.factBomb) && (s.type !== "T6_ACTION_DIRECTION" || c.sourceType === "GUIDANCE")
    && (c.claimLevel ?? 2) >= s.minLevel && !used.some(t => t.text === s.text) && used.filter(t => t.family === s.family).length < 2
    && !(used.length >= 2 && used.slice(-2).every(t => t.type === s.type)));
  const selected = stableVariants(eligible, `${key}|${sectionId}|${c.id}|${GYEOL_TITLE_ENGINE_VERSION}`)[0];
  // Exact source fallback never invents a title's meaning or truncates a condition.
  const fallbackType = types.find(t => !(used.length >= 2 && used.slice(-2).every(u => u.type === t))) ?? types[0];
  const short=shortTitleChoices(c).find(t=>!used.some(u=>u.text===t));
  return { sectionId, candidateId: c.id, sourceText: c.sourceText, text: selected?.text ?? short ?? c.sourceText.replace(/[.]$/, ""),
    type: selected?.type ?? fallbackType, skeletonId: selected?.id ?? (short?"APPROVED_SHORT":"SOURCE_VERBATIM"), family: selected?.family ?? `source:${c.id}` };
}
