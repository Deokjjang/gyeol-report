import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateV4ShadowReport, type V4ShadowClock } from '../../../interpretation-v4/runtimeShadow';
import { projectV4Composition, type V4RuntimeEvidence } from '../../../interpretation-v4/runtimeProjection';
import { createProductPreviewSnapshot } from '../../../report-generation/productPreviewSnapshot';
import { observeActualProfiles } from '../actual-evidence-graph/producers';
import { buildActualEvidenceGraph } from '../actual-evidence-graph/engine';
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from '../knowledge-binder/types';
import type { ProductSpecialistFoundation } from '../product-specialist-foundation/binderIntegration';
import { GlobalSpecialistRegistry } from '../global-specialist-integration/engineRegistry';
import { GlobalSpecialistAuditCoordinator } from '../global-specialist-integration/foundationCoordinator';
import type { CandidateEnvelope } from '../global-specialist-integration/types';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { hash } from '../sourceReader';
import { prepareStrictRequest } from '../global-book-planner/planningRequest';
import { assertOfflineIntegration } from './readerCatalog';
import { readerSourcePins } from './sourcePins';
import { integrateProduct } from './engine';
import { inspectStoredPublication, reopenStoredPublication } from './storedPublication';

export const ACTUAL_FIXTURE_FILE = 'tests/fixtures/six-product-integration-01/source-locks.json';
type Fixture = { product: string; id: string; payload: unknown; clock: V4ShadowClock };

/** Fresh existing calculations on registered fictional inputs. ACTUAL here
 * describes calculated Evidence, never real customers or synthetic approval.
 * The existing offline Binder observer must be installed by the CLI harness. */
export async function integrateActualFixture(root: string, selection: { product: string; id: string }, services: {
  foundation: ProductSpecialistFoundation; registry: GlobalSpecialistRegistry;
}) {
  assertOfflineIntegration();
  const bytes = readFileSync(join(root, ACTUAL_FIXTURE_FILE));
  if (hash(bytes) !== readerSourcePins(root)[ACTUAL_FIXTURE_FILE]) throw Error('ORIGINAL_INPUT_FIXTURE_SOURCE_CHANGED');
  const fixture = (JSON.parse(bytes.toString()) as Fixture[]).find(f => f.product === selection.product && f.id === selection.id);
  if (!fixture) throw Error('REGISTERED_OFFLINE_INPUT_REQUIRED');
  const generated = await generateV4ShadowReport(fixture.payload, fixture.clock);
  if (!generated.ok) return { ok: false as const, stage: 'EXISTING_PRODUCT_GENERATION', reasons: [generated.error.message] };
  if (generated.externalCalls?.length) throw Error('OFFLINE_EXTERNAL_PROSE_FORBIDDEN');
  const evidence = generated.evidencePacket as V4RuntimeEvidence, before = digest(evidence), observed = observeActualProfiles(evidence);
  if (observed.failures.length) return { ok: false as const, stage: 'EXISTING_PROFILE_PRODUCERS', reasons: observed.failures };
  const owners = evidence.input.kind === 'compatibility' ? { personA: 'fixture-person-A', personB: 'fixture-person-B' } : { person: 'fixture-person' };
  const knowledge = services.foundation.catalog.evidence;
  const built = buildActualEvidenceGraph({ evidence, profiles: observed.profiles, context: {
    fixtureId: 'fixture-' + fixture.product + '-' + fixture.id, synthetic: true, evaluatedAt: evidence.generatedAt, owners,
    catalogVersion: knowledge.versions.catalog, sourceVersion: knowledge.versions.source, semanticVersion: knowledge.versions.semantic,
  } }, knowledge);
  if (!built.ok || !built.inputUnchanged) return { ok: false as const, stage: 'ACTUAL_EVIDENCE_GRAPH', reasons: built.graph.validation.errors.map(e => e.code) };
  const relationship = evidence.composition.product === 'saju_mbti_compatibility' ? evidence.composition.result.evidence.category : null;
  if (built.graph.relationship !== relationship) throw Error('ACTUAL_RELATIONSHIP_SCOPE_CHANGED');
  const declaredContexts = services.foundation.catalog.input.config.products.find(p => p.id === built.graph.product)?.declaredContexts;
  const request: KnowledgeBindingRequest = { graph: built.graph, graphInput: { evidence, profiles: observed.profiles, context: built.graph.context },
    product: built.graph.product, relationship,
    contexts: Array.isArray(declaredContexts) ? declaredContexts : [],
    actualUserState: evidence.input.kind === 'compatibility' ? {} : evidence.input.userContext };
  // Coordinator writes metadata on its own registration; do not mutate the
  // caller's shared Registry or add an injectable approval provider.
  const registry = new GlobalSpecialistRegistry([...services.registry.byEngine.values()].map(e => ({ ...e })));
  const entry = registry.route(request); registry.assertRequest(entry, request);
  const prepared = services.foundation.run(request);
  let emitted: { envelopes: CandidateEnvelope[]; receipts: KnowledgeBindingReceipt[]; semantic: unknown } | null = null;
  const coordinator = new GlobalSpecialistAuditCoordinator(registry, (_entry, _fixture, envelopes, receipts, semantic) => { emitted = { envelopes, receipts, semantic }; });
  coordinator.capture(services.foundation, request, prepared); await Promise.all(coordinator.pending);
  const native = emitted as { envelopes: CandidateEnvelope[]; receipts: KnowledgeBindingReceipt[]; semantic: unknown } | null;
  if (!native) throw Error('NATIVE_SPECIALIST_HANDOFF_REQUIRED');
  const planning = prepareStrictRequest({ entry, registry: services.foundation.registry, envelopes: native.envelopes, receipts: native.receipts,
    witnesses: [...coordinator.witnesses.values()], originalInputProof: { source: ACTUAL_FIXTURE_FILE, sha256: hash(bytes) }, nativeConflicts: native.semantic });
  const session = integrateProduct(root, planning);
  const reportId = 'offline-integration-' + fixture.product + '-' + fixture.id;
  const created = createProductPreviewSnapshot({ reportId, createdAtIso: evidence.generatedAt, productKey: evidence.productType,
    productSlug: evidence.input.productSlug, draft: projectV4Composition(evidence.composition), evidencePacket: evidence });
  if (!created.ok) return { ok: false as const, stage: 'EXISTING_SNAPSHOT_FACTORY', reasons: [created.error] };
  const snapshot = created.value;
  const publication = inspectStoredPublication(snapshot), reopened = reopenStoredPublication(JSON.stringify(snapshot));
  if (!publication.ok || !reopened.ok) return { ok: false as const, stage: 'EXISTING_PUBLISHER_REOPEN', reasons: [...publication.errors, ...reopened.errors] };
  if (before !== digest(evidence) || publication.bookHash !== reopened.bookHash) throw Error('EXISTING_CALCULATION_OR_BOOK_CHANGED');
  return { ok: true as const, session, publication,
    observations: { fixture: built.graph.context.fixtureId, product: built.graph.product, relationship: built.graph.relationship,
      inputHash: digest(fixture.payload), calculationHash: digest(evidence.calculations), profileHash: digest(observed.profiles),
      actualGraphHash: digest(built.graph), nativeReceiptHash: digest(native.receipts), evidenceHash: before,
      nativeEvaluations: native.receipts.length, graphValidation: built.graph.validation.status,
      graphNodes: built.graph.nodes.length, existingBookHash: publication.bookHash, storedRoundtrip: true,
      existingWriterIsNotNewEditorialIntegration: true, newCustomerSentences: session.result.draft.sentences.length,
      newCustomerAllocations: session.result.actualBookAllocations, graphCalendarRecalculations: observed.birthCalendarRecalculations } };
}
