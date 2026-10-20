import { readFileSync } from 'node:fs';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { hash } from '../sourceReader';
import { isRecord } from '../normalization';
import { readGlobalArtifact } from '../global-specialist-integration/artifactReader';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { assertPlanningRequest } from '../global-book-planner/planningRequest';
import { freeze } from '../korean-editorial-engine/editorialInput';
import type { EngineRegistration } from '../global-specialist-integration/types';
import type { ProductContract, ProductQuestionContract } from '../product-specialist-foundation/types';
import type { PlanningRequest, ReaderCatalog } from './types';
import { readerSourcePins } from './sourcePins';

const cached = new Map<string, ReaderCatalog>();
const proofs = new WeakMap<ReaderCatalog, { questions: Map<string, string>; contracts: Map<string, string> }>();
// The frozen archive is JSON. Optional undefined locator properties in the
// live Registry have no JSON field; compare its persisted representation,
// while the Planner/Editorial retain their exact original in-memory hashes.
const persistedQuestionHash = (q: ProductQuestionContract) => digest(JSON.parse(JSON.stringify(q)));
export function assertOfflineIntegration(): void {
  if (process.env.VERCEL || typeof window !== 'undefined') throw Error('FULL_PRODUCT_INTEGRATION_OFFLINE_ONLY');
}
function verifySources(root: string): void {
  assertOfflineIntegration();
  for (const [file, expected] of Object.entries(readerSourcePins(root))) {
    if (hash(readFileSync(join(root, file))) !== expected) throw Error('INTEGRATION_READER_SOURCE_CHANGED:' + file);
  }
}
export function loadReaderCatalog(root: string): ReaderCatalog {
  root = resolve(root); verifySources(root);
  const prior = cached.get(root); if (prior) return prior;
  const directory = join(root, 'docs/validation/v4-global-specialist-integration-audit-01');
  const data = readGlobalArtifact(directory, 'global-reader-question-index.json');
  const registrations = readGlobalArtifact(directory, 'global-engine-registry.json') as EngineRegistration[];
  if (!isRecord(data) || !Array.isArray(data.questions) || data.questions.length !== 2060) throw Error('ORIGINAL_READER_REGISTRY_REQUIRED');
  const questions = data.questions as ProductQuestionContract[];
  const contracts = registrations.flatMap(e => (e.readerContract as { foundationProductContract: ProductContract[] }).foundationProductContract);
  if (new Set(questions.map(q => q.id)).size !== questions.length || contracts.length !== 12) throw Error('ORIGINAL_READER_SCOPE_REQUIRED');
  // Keep only identities here; the unchanged Foundation owns the full Registry.
  // Full archived requirement/source trees need not be retained a second time.
  const identities = questions.map(q => ({ id: q.id, productKey: q.productKey, relationshipCategory: q.relationshipCategory,
    address: q.address, originalQuestionHash: digest(q) }));
  const catalog = freeze({ root, questions: identities, contracts });
  proofs.set(catalog, { questions: new Map(identities.map(q => [q.id, q.originalQuestionHash])), contracts: new Map(contracts.map(c => [JSON.stringify([c.productKey, c.relationship]), digest(c)])) });
  cached.set(root, catalog); return catalog;
}
export function assertReaderScope(catalog: ReaderCatalog, request: PlanningRequest): void {
  assertPlanningRequest(request); verifySources(catalog.root);
  const proof = proofs.get(catalog);
  if (!proof || proof.contracts.get(JSON.stringify([request.productKey, request.relationshipCategory])) !== digest(request.readerContract)) throw Error('EXACT_ORIGINAL_READER_CONTRACT_REQUIRED');
  if (request.executionMode === 'STRICT_CUSTOMER_POLICY') {
    const expected = catalog.questions.filter(q => q.productKey === request.productKey && q.relationshipCategory === request.relationshipCategory);
    if (request.questions.length !== expected.length || request.questions.some(q => q.synthetic || !q.original || proof.questions.get(q.id) !== persistedQuestionHash(q.original)
      || digest(q.address) !== digest(q.original.address))) throw Error('EXACT_ORIGINAL_QUESTION_IDENTITIES_REQUIRED');
  } else if (request.questions.some(q => !q.synthetic || q.original !== null || q.product !== request.productKey || q.relationship !== request.relationshipCategory)) {
    throw Error('NATIVE_SYNTHETIC_QUESTION_SCOPE_REQUIRED');
  }
  const source = request.originalInputProof.source, full = resolve(catalog.root, source), rel = relative(catalog.root, full);
  if (isAbsolute(source) || rel.startsWith('../') || rel === '..' || !/^(?:tests\/fixtures|docs\/validation)\//.test(source)) throw Error('OFFLINE_INPUT_SOURCE_PATH_REQUIRED');
  if (hash(readFileSync(full)) !== request.originalInputProof.sha256) throw Error('ORIGINAL_PLANNING_INPUT_SOURCE_CHANGED');
}
