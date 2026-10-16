import { digest } from '../global-specialist-integration/candidateEnvelope';
import type { EditorialDraft, SemanticUnit, SentenceLedger } from './types';

export function scopedMeaningKey(s: SentenceLedger) {
  return digest([s.primaryClaimId, s.meaningId, s.owner, s.direction, s.temporal, s.conditionalScope, s.negationScope]);
}
export function auditRepetition(sentences: readonly SentenceLedger[]): EditorialDraft['repetition'] {
  const audit: EditorialDraft['repetition'] = [];
  for (const scope of ['PARAGRAPH', 'CHAPTER', 'BOOK'] as const) {
    for (const kind of ['ROOT', 'CLAIM', 'MEANING', 'PHRASE', 'OPENING', 'CLOSING', 'SCENE', 'ADVICE', 'TERM'] as const) {
      const groups = new Map<string, string[]>();
      for (const s of sentences) {
        const prefix = scope === 'BOOK' ? '' : scope === 'CHAPTER' ? s.readerAddress.chapterId ?? s.readerAddress.periodId ?? s.questionId : s.questionId;
        const items = kind === 'ROOT' ? s.factRoots : kind === 'CLAIM' ? [s.primaryClaimId] : kind === 'MEANING' ? [s.meaningId]
          : kind === 'PHRASE' ? [s.actualText] : kind === 'OPENING' ? [s.actualText.split(' ').slice(0, 3).join(' ')]
          : kind === 'CLOSING' ? [s.actualText.split(' ').slice(-3).join(' ')] : kind === 'SCENE' && s.sceneSource ? [s.sceneSource.id]
          : kind === 'ADVICE' && s.practicalAdviceIdentity ? [s.practicalAdviceIdentity] : [];
        for (const value of items) {
          const key = digest([prefix, value, s.owner, s.direction, s.temporal]);
          groups.set(key, [...(groups.get(key) ?? []), s.id]);
        }
      }
      for (const [key, occurrences] of groups) if (occurrences.length > 1) audit.push({ scope, kind, key, occurrences,
        blocked: kind === 'PHRASE' && occurrences.every(id => sentences.find(s => s.id === id)?.kind !== 'RECALL') });
    }
  }
  return audit;
}
export function semanticApplicationKey(s: SentenceLedger, u: SemanticUnit) {
  // Author-declared unit IDs or alternate wording cannot create a second meaning.
  return digest([s.owner, s.direction, s.temporal, u.condition.clause, u.negationScope, u.subject, u.object, u.predicate]);
}
