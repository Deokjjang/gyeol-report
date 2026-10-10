import { adaptComprehensiveSource, type AdaptedNarrativeSource } from "./comprehensiveNarrativeAdapter";
import { COMPREHENSIVE_SECTIONS, type ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { NarrativeRequest, SentenceRole } from "./narrativeCore";
import type { ManuscriptInput, ManuscriptMemory } from "./comprehensiveManuscriptCore";
import { normalizeNarrativeText } from "./narrativeVariant";
import { phraseFragments } from "./narrativeSurface";

/** One role contract, read before selection and enforced by the block validator.
 * A candidate label, or mere presence of two roles, is not a renderability proof. */
export function comprehensiveRequirements(adapted: AdaptedNarrativeSource, section: ComprehensiveSectionId): NonNullable<NarrativeRequest["requirements"]> {
  const rewardDepth = ["C4", "C5"].includes(section) && !adapted.source.fusionType
    && ["MYEONGLI_REASON", "CLOSER"].every(role => adapted.source.phrases.some(p => p.role === role));
  const roles: SentenceRole[] = rewardDepth ? ["MYEONGLI_REASON", "CLOSER"] : [];
  if (adapted.source.fusionType && adapted.placement.presentationIntent === "EXPLICIT") roles.push("MYEONGLI_REASON", "MBTI_REASON");
  return { minSentences: section === "C6" || section === "C10" || adapted.candidate.sourceType === "GUIDANCE" ? 1 : rewardDepth ? 3 : 2,
    roles: [...new Set(roles)], ...(section === "C1" ? { firstRole: "DIRECT_CLAIM" as const } : {}) };
}

/** Rejection feeds the same allocator, never a second candidate/ownership engine. */
export type RenderabilityExclusion = { section: ComprehensiveSectionId; candidateId: string; reason: string; primary: boolean };

export function reservedPrimaryPhrases(input: ManuscriptInput, section: ComprehensiveSectionId, memory: ManuscriptMemory): string[] {
  const reserved = new Set<string>();
  for (const id of COMPREHENSIVE_SECTIONS.slice(COMPREHENSIVE_SECTIONS.indexOf(section) + 1).filter(id => id !== "C10")) {
    for (const p of input.plan.sections[id].placements.filter(p => p.role === "PRIMARY")) {
      const a = adaptComprehensiveSource(input.plan, input.profiles, id, p, memory.language, memory.usedScenes, input.reportStableKey);
      if (!a) continue;
      const roles = new Set<SentenceRole>([...comprehensiveRequirements(a, id).roles,
        a.intent === "FORTUNE" ? "GOOD_RESULT" : "DIRECT_CLAIM"]);
      for (const role of roles) {
        const texts = [...new Set(a.source.phrases.filter(p => p.role === role).map(p => normalizeNarrativeText(p.text)))];
        if (texts.length === 1) {
          for (const phrase of a.source.phrases.filter(p => p.role === role)) for (const part of phraseFragments(phrase)) reserved.add(normalizeNarrativeText(part));
        }
      }
    }
  }
  return [...reserved];
}
