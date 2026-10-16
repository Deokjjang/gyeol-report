import { digest } from '../global-specialist-integration/candidateEnvelope';
import type { EditorialDraft, EditorialInput } from '../korean-editorial-engine/types';
import type { CoverageRow, OfflineBookRepresentation, ReaderBridge, ReaderCatalog } from './types';

export function integrationCoverage(catalog: ReaderCatalog, input: EditorialInput, draft: EditorialDraft, bridges: readonly ReaderBridge[], book: OfflineBookRepresentation): CoverageRow[] {
  const { request, plan } = input;
  const rows: CoverageRow[] = request.questions.map(q => {
    const bridge = bridges.find(b => b.questionId === q.id)!;
    const options = request.options.filter(o => o.questionId === q.id);
    const gates = options.flatMap(o => request.bindingReceipts.get(o.receiptKey)?.allTwelveGateResults ?? []);
    return { questionId: q.id, originalQuestionHash: digest(q), address: q.address,
      namespace: q.synthetic ? 'NATIVE_SYNTHETIC_READER' : 'ORIGINAL_RESEARCH_READER',
      plannerAssigned: plan.selectedCandidateReferences.some(a => a.originalReaderQuestion.id === q.id),
      editorialGenerated: draft.paragraphs.some(p => p.questionId === q.id), bridgeState: bridge.state,
      nativeSyntheticPlacement: bridge.nativeSyntheticPlacement, bookDisplayPossible: book.placements.some(p => p.questionId === q.id),
      reasons: bridge.reasons,
      gateReasons: gates.filter(g => !['PASS', 'NOT_APPLICABLE'].includes(g.state)).map(g => ({ gate: g.gate, state: g.state, reasons: g.reasons })),
    };
  });
  if (request.executionMode === 'ISOLATED_EDITORIAL_REHEARSAL') {
    // Preserve all actual questions separately. Native IDs or nearby chapter
    // labels never silently cover any of the 2,060 original Reader questions.
    rows.push(...catalog.questions.filter(q => q.productKey === request.productKey && q.relationshipCategory === request.relationshipCategory).map(q => ({
      questionId: q.id, originalQuestionHash: q.originalQuestionHash, address: q.address, namespace: 'ORIGINAL_RESEARCH_READER' as const,
      plannerAssigned: false, editorialGenerated: false, bridgeState: 'WITHHELD_ORIGINAL_QUESTION_PRESERVED' as const,
      nativeSyntheticPlacement: 'WITHHELD' as const, bookDisplayPossible: false,
      reasons: ['CUSTOMER_APPROVAL_PENDING', 'NO_EXACT_NATIVE_TO_ORIGINAL_QUESTION_BRIDGE'], gateReasons: [],
    })));
  }
  return rows;
}
