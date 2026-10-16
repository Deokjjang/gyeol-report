import { digest } from '../global-specialist-integration/candidateEnvelope';
import { assertEditorialInput } from './editorialInput';
import { constructClaim } from './claimEnvelope';
import { validateMeaning } from './meaningPreservation';
import { newDisplayProof, registerGeneratedDisplay, displayedRecords } from './introducedMeaningLedger';
import { directionTransition } from './transitionComposer';
import { auditRepetition } from './semanticRepetition';
import type { EditorialDraft, EditorialInput } from './types';

export function auditDraft(input: EditorialInput, draft: EditorialDraft) {
  assertEditorialInput(input); const errors: string[] = [], proof = newDisplayProof(input);
  if (draft.mode !== input.plan.mode || draft.product !== input.plan.productScope || draft.relationship !== input.plan.relationshipScope || draft.engine !== input.request.registration.engineId) errors.push('DRAFT_SCOPE_CHANGED');
  if ([draft.actualOperatorApproved, draft.actualCustomerApproved, draft.actualCustomerEligible, draft.actualCustomerSelections, draft.actualCustomerClaims, draft.actualBookAllocations].some(n => n !== 0)) errors.push('CUSTOMER_AUTHORITY_FORBIDDEN');
  if (draft.mode === 'STRICT_CUSTOMER_POLICY' && (draft.sentences.length || draft.paragraphs.length || draft.displayRecords.length)) errors.push('STRICT_CUSTOMER_PROSE_FORBIDDEN');
  for (const p of draft.paragraphs) {
    const a = input.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === p.questionId), claim = a ? constructClaim(input, a) : null;
    if (!claim || p.completeCustomerParagraph !== false) { errors.push('UNVERIFIED_READER_BRIDGE'); continue; }
    if (digest(p.address) !== digest(claim.readerQuestion.address) || p.originalQuestion !== claim.readerQuestion.originalText
      || p.syntheticQuestionGloss !== claim.syntheticDefinition.syntheticQuestionGloss) errors.push('READER_QUESTION_CHANGED');
    for (const s of p.sentences) errors.push(...validateMeaning(input, claim, s, proof).errors);
    if (!registerGeneratedDisplay(input, p, proof)) errors.push('GENERATED_DISPLAY_PROOF_FAILED');
  }
  if (digest(draft.sentences) !== digest(draft.paragraphs.flatMap(p => p.sentences))) errors.push('SENTENCE_LEDGER_CHANGED');
  if (new Set(draft.sentences.map(s => s.id)).size !== draft.sentences.length) errors.push('DUPLICATE_SENTENCE_ID');
  if (digest(draft.displayRecords) !== digest(displayedRecords(proof))) errors.push('DISPLAY_RECORD_CHANGED');
  const ids = [...draft.paragraphs.map(p => p.questionId), ...draft.shortages.map(s => s.questionId)];
  if (ids.length !== input.request.questions.length || new Set(ids).size !== ids.length || input.request.questions.some(q => !ids.includes(q.id))) errors.push('ORIGINAL_QUESTION_COVERAGE_LOST');
  const transitions = draft.paragraphs.slice(1).flatMap((p, i) => { const t = directionTransition(draft.paragraphs[i], p); return t ? [t] : []; });
  if (digest(transitions) !== digest(draft.transitions)) errors.push('UNVERIFIED_TRANSITION_OR_NEW_CAUSALITY');
  if (digest(auditRepetition(draft.sentences)) !== digest(draft.repetition)) errors.push('REPETITION_AUDIT_CHANGED');
  const warnings = draft.repetition.filter(r => ['ROOT', 'OPENING', 'CLOSING', 'CLAIM', 'MEANING'].includes(r.kind));
  return { ok: errors.length === 0, errors: [...new Set(errors)].sort(), warnings, readerSatisfaction: 'NOT_PROVEN_HUMAN_REVIEW_REQUIRED',
    syntheticQuestionGlossIsNotVerifiedRealReaderBridge: true, completeCustomerBook: false, actualCustomerClaims: 0,
    sentences: draft.sentences.length, paragraphs: draft.paragraphs.length, shortages: draft.shortages.length,
    conditionsPreserved: errors.length === 0, newIndependentFacts: 0 };
}
