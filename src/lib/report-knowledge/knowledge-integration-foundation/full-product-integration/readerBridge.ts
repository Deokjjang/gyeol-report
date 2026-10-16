import { digest } from '../global-specialist-integration/candidateEnvelope';
import { recordHash } from '../sourceReader';
import { isRecord } from '../normalization';
import { syntheticAddress } from '../global-book-planner/optionAdapter';
import { assertEditorialInput } from '../korean-editorial-engine/editorialInput';
import { auditDraft } from '../korean-editorial-engine/wholeDraftAudit';
import type { EditorialDraft, EditorialInput } from '../korean-editorial-engine/types';
import type { ReaderBridge, ReaderCatalog } from './types';
import { assertReaderScope } from './readerCatalog';

const bridgeProofs = new WeakMap<readonly ReaderBridge[], { input: EditorialInput; catalog: ReaderCatalog; draftHash: string; bridgesHash: string }>();

export function assertBridgePlacement(catalog: ReaderCatalog, input: EditorialInput, draft: EditorialDraft, bridges: readonly ReaderBridge[]): void {
  assertEditorialInput(input); assertReaderScope(catalog, input.request);
  const proof = bridgeProofs.get(bridges);
  if (!proof || proof.input !== input || proof.catalog !== catalog || proof.draftHash !== digest(draft) || proof.bridgesHash !== digest(bridges)) throw Error('AUTHENTIC_UNCHANGED_READER_PLACEMENT_REQUIRED');
}

/** A native test address is never a verified Scheduler/customer Reader bridge. */
export function bridgeEditorialDraft(catalog: ReaderCatalog, input: EditorialInput, draft: EditorialDraft): ReaderBridge[] {
  assertReaderScope(catalog, input.request);
  const audit = auditDraft(input, draft);
  if (!audit.ok) throw Error('INVALID_INTEGRATED_EDITORIAL_DRAFT:' + audit.errors.join('|'));
  const bridges: ReaderBridge[] = input.request.questions.map(q => {
    const assignment = input.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === q.id);
    const paragraph = draft.paragraphs.find(p => p.questionId === q.id);
    const reasons: string[] = [], native = input.request.executionMode === 'ISOLATED_EDITORIAL_REHEARSAL';
    let placement: ReaderBridge['nativeSyntheticPlacement'] = 'WITHHELD';
    if (native) {
      reasons.push('NATIVE_SYNTHETIC_ID_IS_NOT_ORIGINAL_CUSTOMER_READER_ID', 'SCHEDULER_BRIDGE_NOT_PROVEN');
      const option = assignment && input.request.options.find(o => o.id === assignment.candidateId);
      const link = option?.originalQuestionLink;
      const exactQuestion = isRecord(link) && isRecord(link.nativeQuestion) && link.nativeQuestion.id === q.id
        && recordHash(link.nativeQuestion) === q.originalHash && digest(syntheticAddress(link.nativeQuestion)) === digest(q.address);
      const addressAvailable = q.address.periodId !== null || q.address.chapterId !== null && q.address.paragraphId !== null;
      if (!addressAvailable) reasons.push('ORIGINAL_PARAGRAPH_ADDRESS_MISSING');
      if (paragraph && assignment && exactQuestion && addressAvailable) placement = 'VERIFIED_NATIVE_SYNTHETIC_ADDRESS';
      if (paragraph && !exactQuestion) reasons.push('EXACT_NATIVE_QUESTION_SOURCE_REQUIRED');
    } else {
      reasons.push('CUSTOMER_APPROVAL_PENDING');
      if (q.original?.readerAgreement === 'REVIEW_REQUIRED') reasons.push('READER_SCHEDULER_BRIDGE_REVIEW_REQUIRED');
      if (q.original?.readerAgreement === 'PERIOD_CONTRACT') reasons.push('PERIOD_PRODUCER_READER_BRIDGE_REQUIRES_VERIFICATION');
    }
    if (!assignment) reasons.push(...(input.plan.unfilledQuestions.find(x => x.id === q.id)?.reasons ?? ['MISSING_PRIMARY_INFORMATION']));
    if (!paragraph) reasons.push(...(draft.shortages.find(x => x.questionId === q.id)?.reasons ?? ['EDITORIAL_NOT_GENERATED']));
    // All current real research remains unapproved; no synthetic fallback can
    // satisfy the exact original Reader identity/material/meaning contract.
    return {
      questionId: q.id, originalQuestionHash: digest(q), address: q.address,
      readerContractHash: digest(input.plan.readerContract), product: q.product, relationship: q.relationship,
      state: !native && q.original?.readerAgreement === 'REVIEW_REQUIRED' ? 'ADDITIONAL_VERIFICATION_REQUIRED'
        : !native && q.original?.readerAgreement === 'PERIOD_CONTRACT' ? 'UNSUPPORTED'
          : !assignment ? 'INSUFFICIENT_ORIGINAL_EVIDENCE' : 'WITHHELD_ORIGINAL_QUESTION_PRESERVED',
      reasons: [...new Set(reasons)].sort(), customerBridgeVerified: false, nativeSyntheticPlacement: placement,
      assignmentHash: assignment ? digest(assignment) : null, paragraphId: paragraph?.id ?? null,
      sentenceIds: paragraph?.sentences.map(s => s.id) ?? [],
    };
  });
  bridgeProofs.set(bridges, { input, catalog, draftHash: digest(draft), bridgesHash: digest(bridges) });
  return bridges;
}
