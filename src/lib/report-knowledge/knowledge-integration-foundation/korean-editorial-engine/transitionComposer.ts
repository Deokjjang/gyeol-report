import { RESEARCH } from './researchRegistry';
import type { EditorialDraft, EditorialParagraph } from './types';

/** Direction change is a reading instruction, never a new causal connection. */
export function directionTransition(from: EditorialParagraph, to: EditorialParagraph): EditorialDraft['transitions'][number] | null {
  const a = from.sentences[0], b = to.sentences[0];
  if (!a || !b || !['AB', 'A_TO_B'].includes(a.direction ?? '') || !['BA', 'B_TO_A'].includes(b.direction ?? '')) return null;
  const reference = RESEARCH.transitions.find(r => r.from === 'ab' && r.to === 'ba')!;
  return { from: from.questionId, to: to.questionId, researchRef: reference.id,
    text: reference.connective + ' 전하는 쪽을 살펴봅니다.', kind: 'EDITORIAL_CONNECTIVE', newIndependentFacts: 0 };
}
