import type { NarrativeBlockDraft, NarrativeMemory, NarrativeRequest } from "./narrativeCore";
import { ENDING_STYLES } from "./narrativeCore";
import { TRACKED_NARRATIVE_WORDS } from "./narrativeVocabulary";

export function freshNarrativeMemory(): NarrativeMemory {
  return { usedEvidence: {}, usedAxisAsPrimary: {}, usedSemanticThemes: {}, usedClaims: [], usedResonances: [], usedFusions: [],
    usedGuidance: [], usedImages: [], usedConnectors: {}, usedPhrases: {}, usedWords: {}, usedTermDefinitions: [],
    usedExplicitMbtiMentions: 0, usedParagraphPatterns: [], usedPatternFamilies: [], endingHistory: [], sentenceLengthHistory: [],
    recentSubjects: [], recentOpenings: [], recentConnectors: [], sectionCounters: {}, questions: 0 };
}
export const memoryCount = (map: Readonly<Record<string, number>>, key: string): number => Object.hasOwn(map, key) ? map[key] : 0;
function increment(map: Record<string, number>, key: string, count = 1) {
  Object.defineProperty(map, key, { value: memoryCount(map, key) + count, enumerable: true, writable: true, configurable: true });
}
export const narrativeSubject = (text: string) => text.match(/^(당신은|당신이|본인은|본인이|[가-힣]{1,15}님은)/)?.[0] ?? "OMITTED";
export function openingFamily(text: string): string {
  if (/사람(?:입니다|이에요|이죠)[.]?$/.test(text)) return "PERSON_LABEL";
  if (/^(쉽게 말하면|재미있는 건|결국)/.test(text)) return text.match(/^(쉽게 말하면|재미있는 건|결국)/)![0];
  return text.split(" ").slice(0, 3).join(" ");
}
/** Word boundary + Korean particles; do not count 판 inside 판단, 결 inside 결과, 힘 inside 힘든. */
export function narrativeWordCount(text: string, word: string): number {
  return [...text.matchAll(new RegExp(`(?:^|\\s)${word}(?=$|[.,?\\s]|은|는|이|가|을|를|도|만|으로|에서)`, "g"))].length;
}
export function advanceNarrativeMemory(input: NarrativeMemory, request: NarrativeRequest, block: NarrativeBlockDraft): NarrativeMemory {
  const next = structuredClone(input);
  increment(next.usedSemanticThemes, request.source.semanticTheme);
  for (const axis of request.source.primaryAxes) increment(next.usedAxisAsPrimary, axis);
  const section = Object.hasOwn(next.sectionCounters, request.sectionId) ? next.sectionCounters[request.sectionId] : { questions: 0, words: {} };
  Object.defineProperty(next.sectionCounters, request.sectionId, { value: section, enumerable: true, writable: true, configurable: true });
  for (const id of new Set(block.sentences.flatMap(s => s.evidenceIds))) increment(next.usedEvidence, id);
  for (const sentence of block.sentences) {
    for (const [field, values] of [["usedClaims", sentence.claimIds], ["usedResonances", sentence.resonanceIds], ["usedFusions", sentence.fusionIds], ["usedGuidance", sentence.guidanceIds]] as const) {
      next[field] = [...new Set([...next[field], ...values])];
    }
    if (sentence.imageKey) next.usedImages = [...new Set([...next.usedImages, sentence.imageKey])];
    if (sentence.termDefinitionKey) next.usedTermDefinitions = [...new Set([...next.usedTermDefinitions, sentence.termDefinitionKey])];
    increment(next.usedPhrases, sentence.text);
    for (const phrase of ["쉽게 말하면", "재미있는 건", "결국", "이유는 생각보다 단순합니다"]) {
      if (sentence.text.includes(phrase)) increment(next.usedPhrases, phrase);
    }
    if (sentence.connectorId) {
      increment(next.usedConnectors, sentence.connectorId);
      next.recentConnectors = [...next.recentConnectors, sentence.connectorId].slice(-4);
    }
    if (sentence.explicitMbtiMention || sentence.explicitFusionPhrase) next.usedExplicitMbtiMentions++;
    if (sentence.endingStyle === "QUESTION") { section.questions++; next.questions++; }
    next.endingHistory = [...next.endingHistory, sentence.endingStyle].slice(-3);
    next.sentenceLengthHistory = [...next.sentenceLengthHistory, sentence.lengthClass].slice(-4);
    next.recentSubjects = [...next.recentSubjects, narrativeSubject(sentence.text)].slice(-3);
  }
  for (const word of TRACKED_NARRATIVE_WORDS) {
    const count = narrativeWordCount(block.plainText, word); increment(next.usedWords, word, count); increment(section.words, word, count);
  }
  next.usedParagraphPatterns = [...next.usedParagraphPatterns, block.patternId].slice(-2);
  next.usedPatternFamilies = [...next.usedPatternFamilies, block.patternFamily].slice(-2);
  next.recentOpenings = [...next.recentOpenings, openingFamily(block.sentences[0]?.text ?? "")].slice(-3);
  return next;
}
/** Plain arrays/objects: no lossy Map/Set JSON serialization. */
export const serializeNarrativeMemory = (memory: NarrativeMemory) => JSON.stringify(memory);
export function parseNarrativeMemory(json: string): NarrativeMemory | undefined {
  try {
    const value: unknown = JSON.parse(json); const base = freshNarrativeMemory();
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    for (const [key, expected] of Object.entries(base)) {
      const actual = (value as Record<string, unknown>)[key];
      if (Array.isArray(expected) ? !Array.isArray(actual) || actual.some(x => typeof x !== "string")
        : typeof expected === "number" ? !Number.isInteger(actual) || (actual as number) < 0
          : !actual || typeof actual !== "object" || Array.isArray(actual)) return undefined;
    }
    for (const key of ["usedEvidence", "usedAxisAsPrimary", "usedSemanticThemes", "usedConnectors", "usedPhrases", "usedWords"] as const) {
      if (Object.values((value as NarrativeMemory)[key]).some(n => !Number.isInteger(n) || n < 0)) return undefined;
    }
    for (const section of Object.values((value as NarrativeMemory).sectionCounters)) {
      if (!section || !Number.isInteger(section.questions) || section.questions < 0 || !section.words || typeof section.words !== "object"
        || Object.values(section.words).some(n => !Number.isInteger(n) || n < 0)) return undefined;
    }
    if ((value as NarrativeMemory).endingHistory.some(e => !ENDING_STYLES.includes(e))
      || (value as NarrativeMemory).sentenceLengthHistory.some(c => !["S", "M", "L"].includes(c))) return undefined;
    return structuredClone(value as NarrativeMemory);
  } catch { return undefined; }
}
