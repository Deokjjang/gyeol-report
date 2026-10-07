import { HEAVENLY_STEM_SEMANTICS } from "./foundationPillars";
import { SHINSAL_SEMANTICS } from "./foundationShinsal";
import type { NarrativeEvidenceTerm, NarrativePhrase, NarrativeSourceUnit } from "./narrativeCore";

/** Image references only: existing 1B/1C definitions remain the source of truth. */
export const NARRATIVE_IMAGES: Readonly<Record<string, { image: string; easyMeaning: string }>> = {
  ...Object.fromEntries(Object.entries(HEAVENLY_STEM_SEMANTICS).map(([key, value]) => [`stem:${key}`, { image: value.image, easyMeaning: value.easyMeaning }])),
  ...Object.fromEntries(["JANGSEONG", "BANAN", "HWAGAE", "HYEONCHIM"].map(key => {
    const value = SHINSAL_SEMANTICS[key as "JANGSEONG" | "BANAN" | "HWAGAE" | "HYEONCHIM"];
    return [`shinsal:${key}`, { image: value.image, easyMeaning: value.easyMeaning }];
  })),
};
export function termDefinitionText(term: NarrativeEvidenceTerm): string {
  const code = term.displayName.charCodeAt(term.displayName.length - 1);
  const particle = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 0 ? "는" : "은";
  return `${term.displayName}${particle} ${term.easyDefinition}`;
}
/** Callers must supply actual evidence and a source unit. This does not create chart evidence. */
export function termDefinitionPhrase(term: NarrativeEvidenceTerm, source: NarrativeSourceUnit): NarrativePhrase | undefined {
  if (!term.sourceEvidenceIds.length || !term.easyDefinition.trim()) return undefined;
  const proof = source.phrases.find(p => term.sourceEvidenceIds.every(id => p.refs.evidenceIds.includes(id)));
  if (!proof) return undefined;
  return { ...proof, id: `${source.id}:definition:${term.key}`, role: "MYEONGLI_REASON", origin: "MYEONGLI",
    text: termDefinitionText(term), termDefinitionKey: term.key, directnessLevel: proof.directnessLevel };
}
