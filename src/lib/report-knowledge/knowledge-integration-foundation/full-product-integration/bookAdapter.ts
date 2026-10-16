import { digest } from '../global-specialist-integration/candidateEnvelope';
import type { EditorialDraft, EditorialInput } from '../korean-editorial-engine/types';
import type { OfflineBookRepresentation, ReaderBridge, ReaderCatalog } from './types';
import { assertBridgePlacement } from './readerBridge';

/** Partial test representation using the existing BookPage DTO. It is not a
 * V4 customer Edition, Publisher packet or replacement for a stored Book. */
export function adaptOfflineBook(catalog: ReaderCatalog, input: EditorialInput, draft: EditorialDraft, bridges: readonly ReaderBridge[]): OfflineBookRepresentation {
  assertBridgePlacement(catalog, input, draft, bridges);
  const book: OfflineBookRepresentation = {
    version: 'offline-synthetic-book-representation-v1', edition: 'SYNTHETIC_TEST_ONLY',
    product: input.plan.productScope, relationship: input.plan.relationshipScope,
    sourcePlanHash: digest(input.plan), readerContract: input.plan.readerContract, temporalContractHash: digest(input.request.temporalContract),
    pages: [], placements: [], wholeBookCompleted: false, customerEdition: false, publisherValidation: 'NOT_A_CUSTOMER_PUBLICATION',
  };
  for (const bridge of bridges) {
    if (bridge.nativeSyntheticPlacement !== 'VERIFIED_NATIVE_SYNTHETIC_ADDRESS') continue;
    const paragraph = draft.paragraphs.find(p => p.questionId === bridge.questionId)!;
    // Explicit original question/role address, never inferred P/S numbering.
    const pageId = 'offline-native:' + digest([input.request.fixtureId, bridge.questionId, bridge.address]);
    book.pages.push({ kind: 'narrative', id: pageId, title: bridge.address.originalAddress,
      paragraphs: [{ text: paragraph.text, notes: [], anchorId: pageId }], notes: [] });
    book.placements.push({ questionId: bridge.questionId, originalAddress: bridge.address, pageId,
      paragraphId: paragraph.id, sentenceIds: bridge.sentenceIds, ledgerHash: digest(paragraph.sentences) });
  }
  return book;
}
