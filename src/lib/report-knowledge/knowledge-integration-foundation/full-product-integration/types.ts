import type { BookPage } from '../../../../app/dev/book-preview/bookTypes';
import type { GlobalBookPlan, GlobalBookPlanningRequest } from '../global-book-planner/types';
import type { EditorialDraft, EditorialInput } from '../korean-editorial-engine/types';
import type { ProductQuestionContract, ProductContract, ProductReaderAddress } from '../product-specialist-foundation/types';

export const INTEGRATION_VERSION = 'offline-full-product-integration-v1' as const;
export type BridgeState = 'EXACTLY_VERIFIED' | 'ADDITIONAL_VERIFICATION_REQUIRED' | 'UNSUPPORTED' | 'INSUFFICIENT_ORIGINAL_EVIDENCE' | 'WITHHELD_ORIGINAL_QUESTION_PRESERVED';
export type ReaderBridge = {
  questionId: string; originalQuestionHash: string; address: ProductReaderAddress;
  readerContractHash: string; product: GlobalBookPlan['productScope']; relationship: GlobalBookPlan['relationshipScope'];
  state: BridgeState; reasons: string[]; customerBridgeVerified: false;
  nativeSyntheticPlacement: 'VERIFIED_NATIVE_SYNTHETIC_ADDRESS' | 'WITHHELD';
  assignmentHash: string | null; paragraphId: string | null; sentenceIds: string[];
};
export type CoverageRow = {
  questionId: string; originalQuestionHash: string; address: ProductReaderAddress;
  namespace: 'ORIGINAL_RESEARCH_READER' | 'NATIVE_SYNTHETIC_READER';
  plannerAssigned: boolean; editorialGenerated: boolean; bridgeState: BridgeState;
  nativeSyntheticPlacement: ReaderBridge['nativeSyntheticPlacement']; bookDisplayPossible: boolean;
  reasons: string[]; gateReasons: { gate: string; state: string; reasons: readonly string[] }[];
};
export type OfflineBookRepresentation = {
  version: 'offline-synthetic-book-representation-v1'; edition: 'SYNTHETIC_TEST_ONLY';
  product: GlobalBookPlan['productScope']; relationship: GlobalBookPlan['relationshipScope'];
  sourcePlanHash: string; readerContract: ProductContract; temporalContractHash: string;
  pages: BookPage[];
  placements: { questionId: string; originalAddress: ProductReaderAddress; pageId: string; paragraphId: string; sentenceIds: string[]; ledgerHash: string }[];
  wholeBookCompleted: false; customerEdition: false; publisherValidation: 'NOT_A_CUSTOMER_PUBLICATION';
};
export type IntegrationResult = {
  version: typeof INTEGRATION_VERSION; status: 'PARTIAL_WITH_VERIFIED_GAPS'; mode: GlobalBookPlan['mode'];
  product: GlobalBookPlan['productScope']; relationship: GlobalBookPlan['relationshipScope'];
  fixtureId: string; planHash: string; handoffHash: string; requestProofHash: string;
  plan: GlobalBookPlan; draft: EditorialDraft; bridges: ReaderBridge[]; coverage: CoverageRow[];
  book: OfflineBookRepresentation; actualOperatorApproved: 0; actualCustomerApproved: 0;
  actualCustomerEligible: 0; actualCustomerClaims: 0; actualBookAllocations: 0;
  wholeBookCompleted: false; humanQualityApproved: false; customerReady: false;
};
export type ReaderCatalog = {
  root: string; questions: readonly (Pick<ProductQuestionContract, 'id' | 'productKey' | 'relationshipCategory' | 'address'> & { originalQuestionHash: string })[];
  contracts: readonly ProductContract[];
};
export type IntegrationSession = { input: EditorialInput; result: IntegrationResult };
export type PlanningRequest = GlobalBookPlanningRequest;
