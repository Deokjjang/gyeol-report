import { digest } from '../global-specialist-integration/candidateEnvelope';
import { planGlobalBook } from '../global-book-planner/engine';
import { createEditorialInput, freeze } from '../korean-editorial-engine/editorialInput';
import { generateEditorialDraft } from '../korean-editorial-engine/engine';
import { loadReaderCatalog, assertOfflineIntegration, assertReaderScope } from './readerCatalog';
import { bridgeEditorialDraft } from './readerBridge';
import { adaptOfflineBook } from './bookAdapter';
import { integrationCoverage } from './coverage';
import { INTEGRATION_VERSION, type IntegrationResult, type IntegrationSession, type PlanningRequest } from './types';

const sessions = new WeakMap<IntegrationSession, string>();
export function integrateProduct(root: string, request: PlanningRequest): IntegrationSession {
  assertOfflineIntegration();
  const catalog = loadReaderCatalog(root); assertReaderScope(catalog, request);
  const plan = planGlobalBook(request), input = createEditorialInput(root, request, plan), draft = generateEditorialDraft(input);
  const bridges = bridgeEditorialDraft(catalog, input, draft), book = adaptOfflineBook(catalog, input, draft, bridges);
  const result: IntegrationResult = {
    version: INTEGRATION_VERSION, status: 'PARTIAL_WITH_VERIFIED_GAPS', mode: plan.mode, product: plan.productScope, relationship: plan.relationshipScope,
    fixtureId: plan.fixtureId, planHash: digest(plan), handoffHash: digest(input.handoff), requestProofHash: digest(request.originalInputProof),
    plan, draft, bridges, coverage: integrationCoverage(catalog, input, draft, bridges, book), book,
    actualOperatorApproved: 0, actualCustomerApproved: 0, actualCustomerEligible: 0, actualCustomerClaims: 0, actualBookAllocations: 0,
    wholeBookCompleted: false, humanQualityApproved: false, customerReady: false,
  };
  freeze(result); const session = Object.freeze({ input, result }); sessions.set(session, digest(result)); return session;
}

/** Revalidate against authenticated input and real generated display history,
 * not against a caller-supplied hash, cloned proof or completion flag. */
export function validateIntegrationResult(session: IntegrationSession, candidate: IntegrationResult = session.result) {
  assertOfflineIntegration();
  if (!sessions.has(session)) return { ok: false, errors: ['AUTHENTIC_INTEGRATION_SESSION_REQUIRED'] };
  try {
    if (digest(candidate) !== sessions.get(session)) return { ok: false, errors: ['INTEGRATION_SOURCE_MEANING_OR_AUTHORITY_CHANGED'] };
    const { input } = session, catalog = loadReaderCatalog(input.root);
    // Bridge construction invokes the original full draft audit and its
    // authenticated Plan/Handoff validator. Book placement consumes that
    // exact proof instead of executing the same complete audit repeatedly.
    const bridges = bridgeEditorialDraft(catalog, input, candidate.draft);
    const book = adaptOfflineBook(catalog, input, candidate.draft, bridges);
    const coverage = integrationCoverage(catalog, input, candidate.draft, bridges, book);
    const errors: string[] = [];
    if (digest(candidate.bridges) !== digest(bridges)) errors.push('READER_BRIDGE_CHANGED');
    if (digest(candidate.book) !== digest(book)) errors.push('BOOK_PLACEMENT_OR_EDITION_CHANGED');
    if (digest(candidate.coverage) !== digest(coverage)) errors.push('ORIGINAL_QUESTION_COVERAGE_CHANGED');
    return { ok: errors.length === 0, errors };
  } catch { return { ok: false, errors: ['INTEGRATION_VALIDATION_FAILED_CLOSED'] }; }
}

export function reopenOfflineIntegration(session: IntegrationSession, serialized: string): IntegrationResult | null {
  assertOfflineIntegration();
  try { const parsed = JSON.parse(serialized) as IntegrationResult; return validateIntegrationResult(session, parsed).ok ? parsed : null; }
  catch { return null; }
}
