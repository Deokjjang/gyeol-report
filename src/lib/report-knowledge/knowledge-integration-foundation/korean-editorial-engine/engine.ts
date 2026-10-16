import { digest } from '../global-specialist-integration/candidateEnvelope';
import { assertEditorialInput } from './editorialInput';
import { constructClaim } from './claimEnvelope';
import { composeSentence, unitEligibility } from './sentenceComposer';
import { validateMeaning } from './meaningPreservation';
import { newDisplayProof, registerGeneratedDisplay, displayedRecords } from './introducedMeaningLedger';
import { EditorialMemory } from './narrativeMemoryAdapter';
import { auditRepetition, semanticApplicationKey } from './semanticRepetition';
import { directionTransition } from './transitionComposer';
import { EDITORIAL_VERSION, type EditorialDraft, type EditorialInput, type EditorialParagraph } from './types';

export function generateEditorialDraft(input: EditorialInput): EditorialDraft {
  assertEditorialInput(input);
  const draft: EditorialDraft = { version: EDITORIAL_VERSION, engine: input.request.registration.engineId, mode: input.plan.mode,
    product: input.plan.productScope, relationship: input.plan.relationshipScope, paragraphs: [], sentences: [], displayRecords: [], shortages: [], repetition: [], transitions: [],
    actualOperatorApproved: 0, actualCustomerApproved: 0, actualCustomerEligible: 0, actualCustomerSelections: 0, actualCustomerClaims: 0, actualBookAllocations: 0 };
  if (input.plan.mode === 'STRICT_CUSTOMER_POLICY') {
    draft.shortages = input.request.questions.map(q => ({ questionId: q.id, address: q.address, reasons: ['CUSTOMER_APPROVAL_PENDING'] })); return draft;
  }
  const memory = new EditorialMemory(), proof = newDisplayProof(input), meanings = new Set<string>(), advice = new Set<string>();
  const ordered = [...input.plan.selectedCandidateReferences].sort((a, b) => input.request.questions.findIndex(q => q.id === a.originalReaderQuestion.id) - input.request.questions.findIndex(q => q.id === b.originalReaderQuestion.id));
  for (const a of ordered) {
    const claim = constructClaim(input, a);
    if (!claim) { draft.shortages.push({ questionId: a.originalReaderQuestion.id, address: a.originalReaderQuestion.address, reasons: ['MISSING_SEMANTIC_UNITS', 'MISSING_PRIMARY_INFORMATION'] }); continue; }
    const unit = claim.syntheticDefinition.units.find(u => u.id === claim.syntheticDefinition.primaryUnit)!;
    const fn = unit.functions[0], errors = unitEligibility(input, claim, unit, fn, proof);
    const primary = composeSentence(input, claim, unit, fn, memory.phrases, proof);
    if (!primary || errors.length || !validateMeaning(input, claim, primary, proof).ok) {
      draft.shortages.push({ questionId: claim.readerQuestion.id, address: claim.readerQuestion.address, reasons: errors.length ? errors : ['UNRESOLVED_GRAMMAR_SLOT'] }); continue;
    }
    const key = semanticApplicationKey(primary, unit);
    const verifiedRecall = unit.kind === 'RECALL' && claim.originalAssignment.displayDependency?.kind === 'RECALL';
    if (!verifiedRecall && (meanings.has(key) || memory.phrases.has(primary.actualText))) { draft.shortages.push({ questionId: claim.readerQuestion.id, address: claim.readerQuestion.address, reasons: ['DUPLICATE_MEANING'] }); continue; }
    const sentences = [primary];
    // A second sentence is optional. Never fill a paragraph quota by paraphrase.
    const action = claim.syntheticDefinition.units.find(u => u.id !== unit.id && u.functions.includes('action'));
    const adviceKey = action ? digest([action.adviceIdentity, claim.owner, claim.direction, claim.temporal]) : null;
    if (action && action.object.surface !== unit.object.surface && !advice.has(adviceKey!)) {
      const s = composeSentence(input, claim, action, 'action', memory.phrases, proof);
      if (s && s.actualText !== primary.actualText && validateMeaning(input, claim, s, proof).ok) { sentences.push(s); advice.add(adviceKey!); }
    }
    const paragraph: EditorialParagraph = { id: 'kee:paragraph:' + digest([input.request.fixtureId, claim.readerQuestion.id]), address: claim.readerQuestion.address,
      questionId: claim.readerQuestion.id, originalQuestion: claim.readerQuestion.originalText, syntheticQuestionGloss: claim.syntheticDefinition.syntheticQuestionGloss,
      sentences, text: sentences.map(s => s.actualText).join(' '), completeCustomerParagraph: false };
    if (!registerGeneratedDisplay(input, paragraph, proof)) { draft.shortages.push({ questionId: claim.readerQuestion.id, address: claim.readerQuestion.address, reasons: ['MEANING_VALIDATION_REQUIRED'] }); continue; }
    meanings.add(key); sentences.forEach(s => memory.observe(s)); draft.paragraphs.push(paragraph); draft.sentences.push(...sentences);
  }
  draft.shortages.push(...input.plan.unfilledQuestions.map(q => ({ questionId: q.id, address: q.address, reasons: q.reasons })));
  draft.displayRecords = displayedRecords(proof); draft.repetition = auditRepetition(draft.sentences);
  draft.transitions = draft.paragraphs.slice(1).flatMap((p, i) => { const t = directionTransition(draft.paragraphs[i], p); return t ? [t] : []; });
  assertEditorialInput(input); return draft;
}
