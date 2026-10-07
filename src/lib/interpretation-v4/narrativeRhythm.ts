import type { NarrativeBlockDraft } from "./narrativeCore";
import type { MeaningSignature } from "./narrativeMeaningSignature";

export type OpeningFamily = "PERSON_DIRECT" | "BEHAVIOR_FIRST" | "VALUE_FIRST" | "DESIRE_FIRST" | "SCENE_FIRST" | "CONTRAST_FIRST" | "RESULT_FIRST" | "IMAGE_FIRST" | "ACTION_FIRST" | "QUESTION_FIRST";
export type ClauseShape = "SINGLE_ASSERTION" | "A_AND_B" | "A_BUT_B" | "WHEN_A_THEN_B" | "BECAUSE_A_B" | "A_TO_B" | "OUTER_INNER" | "BEFORE_AFTER" | "STRENGTH_SHADOW" | "PROBLEM_ACTION";
export type NarrativeRhythmSignature = { openingFamily: OpeningFamily; clauseShape: ClauseShape; sentenceRoleSequence: string[]; endingShape: string[];
  behaviorFamily: string; traitArcRole: string; section: string; candidateId: string };
export function clauseShape(text: string): ClauseShape {
  if (/밖에서.*혼자|겉.*속/.test(text)) return "OUTER_INNER";
  if (/전에는.*뒤|시작할 때.*이어갈|생각할 때.*실행/.test(text)) return "BEFORE_AFTER";
  if (/잘.*지만|강.*지칠|챙기.*늘어/.test(text)) return "STRENGTH_SHADOW";
  if (/때|되면|생기면|보이면/.test(text)) return "WHEN_A_THEN_B";
  if (/때문|이유/.test(text)) return "BECAUSE_A_B";
  if (/하지만|면서도|보다.*아니/.test(text)) return "A_BUT_B";
  if (/뒤|다음|이어/.test(text)) return "A_TO_B";
  if (/말고|대신/.test(text)) return "PROBLEM_ACTION";
  if (/뿐 아니라|같이|함께/.test(text)) return "A_AND_B";
  return "SINGLE_ASSERTION";
}
export function rhythmSignature(block: NarrativeBlockDraft, meaning: MeaningSignature): NarrativeRhythmSignature {
  const first = block.sentences[0], text = first?.text ?? "";
  const openingFamily: OpeningFamily = first?.role === "ACTION" ? "ACTION_FIRST" : /[?]$/.test(text) ? "QUESTION_FIRST"
    : first?.role === "GOOD_RESULT" ? "RESULT_FIRST" : first?.role === "IMAGE" ? "IMAGE_FIRST" : first?.role === "LIFE_SCENE" ? "SCENE_FIRST"
    : /하지만|면서도|아니/.test(text) ? "CONTRAST_FIRST" : /사람(?:입니다|이에요|이죠)/.test(text) ? "PERSON_DIRECT"
    : /싶|원하/.test(text) ? "DESIRE_FIRST" : /중요|기준|납득/.test(text) ? "VALUE_FIRST" : "BEHAVIOR_FIRST";
  return { openingFamily, clauseShape: clauseShape(text), sentenceRoleSequence: block.sentenceRoles, endingShape: block.endingSequence,
    behaviorFamily: meaning.behaviorFamily, traitArcRole: meaning.traitArcRole, section: meaning.section, candidateId: meaning.candidateId };
}
export function rhythmPenalty(current: NarrativeRhythmSignature, previous: readonly NarrativeRhythmSignature[]) {
  const last = previous.at(-1);
  return Number(last?.section === current.section && last.openingFamily === current.openingFamily) * 3
    + Number(last?.clauseShape === current.clauseShape) * 2
    + previous.filter(p => p.behaviorFamily === current.behaviorFamily && p.traitArcRole === current.traitArcRole && p.clauseShape === current.clauseShape).length * 12;
}
