import type { NarrativePhrase, NarrativeRequest } from "./narrativeCore";
import { narrativeSurfaces, type NarrativeSurface } from "./narrativeEndings";
import { normalizeNarrativeText } from "./narrativeVariant";
import { REINFORCE_CLOSERS } from "./narrativeConnectors";
import { realizeEasyNounSlots } from "./narrativeVocabulary";

export const hasExplicitMbti = (text: string) => /\b(?:MBTI|[EI][SN][TF][JP])\b/.test(text);
export const hasFusionComparison = (text: string) => /두 (?:해석|체계|곳)|명리에서도 MBTI에서도|서로 다른 방식으로 봤는데/.test(text);
export function phraseFragments(phrase: NarrativePhrase): string[] {
  return normalizeNarrativeText(phrase.text).split(/(?<=[.?])\s+(?![”’"'])/).filter(Boolean);
}
export function preservePhraseDirectness(phrase: NarrativePhrase): boolean {
  return ["DIRECT_CLAIM", "GOOD_RESULT"].includes(phrase.role) && phrase.directnessLevel >= 3;
}
export function permittedSurfaces(request: NarrativeRequest, phrase: NarrativePhrase, fragment: number): NarrativeSurface[] {
  const text = phraseFragments(phrase)[fragment]; if (!text) return [];
  const direct = preservePhraseDirectness(phrase);
  const easy = direct || phrase.role === "ACTION" || phrase.termDefinitionKey ? text : realizeEasyNounSlots(text, request.context);
  const surfaces = narrativeSurfaces({ ...phrase, text: easy }, direct);
  // Only an already established reinforcement can have a rhetorical two-source summary.
  // Complement/Tension never replace their third human interpretation with this summary.
  if (request.source.fusionType === "REINFORCE" && phrase.role === "FUSION" && fragment === 0
    && phraseFragments(phrase).length === 1 && request.presentationIntent === "EXPLICIT"
    && phrase.refs.evidenceIds.length && phrase.refs.mbtiSourceNodeIds.length
    && request.source.phrases.some(p => p.origin === "MBTI_ACTUAL" && p.refs.mbtiSourceNodeIds.length)) {
    surfaces.push(...REINFORCE_CLOSERS.map(c => ({ id: c.id, text: c.text, ending: "FORMAL_DA" as const })));
  }
  return surfaces;
}
