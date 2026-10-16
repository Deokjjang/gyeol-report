import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { bootstrap, BASE } from './bootstrap.mjs';
import { context } from '../global-book-planner/context.mjs';
import { artifactWriter } from '../global-book-planner/deterministicArtifacts.mjs';

export async function run(destination = 'docs/validation/v4-full-product-integration-01') {
  assert(!process.env.VERCEL, 'OFFLINE_ONLY');
  const root = process.cwd(), out = path.resolve(destination), started = performance.now(), cpu = process.cpuUsage();
  assert(out === path.join(root, 'docs/validation/v4-full-product-integration-01') || out.startsWith('/tmp/') || out.startsWith('/private/tmp/'), 'OFFLINE_OUTPUT_ONLY');
  const sha = v => createHash('sha256').update(v).digest('hex');
  const tree = execFileSync('git', ['ls-tree', '-r', '-z', BASE], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const preserve = () => { for (const row of tree) {
    const [meta, file] = row.split('\t'), bytes = fs.readFileSync(file);
    assert.equal(createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex'), meta.split(' ')[2], file);
  } };
  preserve();
  const prefix = 'src/lib/report-knowledge/knowledge-integration-foundation/', folder = prefix + 'full-product-integration/';
  const own = [folder, 'tools/full-product-integration/'].flatMap(dir => fs.readdirSync(dir).filter(f => /\.(ts|mjs)$/.test(f)).map(f => dir + f));
  own.push('tests/fixtures/full-product-integration-01/reader-source-pins.json');
  const seal = own.sort().map(file => ({ file, sha256: sha(fs.readFileSync(file)) }));
  const b = bootstrap(root), c = await context(root); bootstrap(root);
  const { integrateProduct, validateIntegrationResult, reopenOfflineIntegration } = b.load(folder + 'engine.ts');
  const { loadReaderCatalog } = b.load(folder + 'readerCatalog.ts');
  const { prepareStrictRequest, prepareRehearsalRequest } = b.load(prefix + 'global-book-planner/planningRequest.ts');
  const { digest } = b.load(prefix + 'global-specialist-integration/candidateEnvelope.ts');
  const { collectPrivateTerms, validatePrivateExport } = b.load(prefix + 'semantic-domain-review-workbench/privacy.ts');
  const privateTerms = collectPrivateTerms(c.json('tests/fixtures/six-product-integration-01/source-locks.json'));
  collectPrivateTerms(c.json('docs/validation/v4-compatibility-friendship-product-knowledge-01/input-cases.json'), privateTerms);
  const catalog = loadReaderCatalog(root), strict = [], rehearsal = [], coverage = [], meanings = [], books = [], negatives = [], freshActual = [];
  // The exact existing offline observer captures native Binder candidates;
  // it never changes approvals, requirements or returned receipt contents.
  const { installBinderCapture } = b.load('tools/global-specialist-integration-audit/invokers.ts');
  const binder = b.load(prefix + 'knowledge-binder/engine.ts'), nativeBind = binder.bindKnowledgeCandidate;
  installBinderCapture(invoke => {
    const candidates = new Map();
    binder.bindKnowledgeCandidate = (candidate, ...args) => {
      const before = digest(candidate), receipt = nativeBind(candidate, ...args);
      assert.equal(digest(candidate), before); candidates.set(receipt.candidateCatalogKey, structuredClone(candidate)); return receipt;
    };
    try { return { result: invoke(), candidates }; } finally { binder.bindKnowledgeCandidate = nativeBind; }
  });
  const { integrateActualFixture } = b.load(folder + 'actualFixture.ts');
  const actualSelections = [['comprehensive', 'A'], ['career', 'A'], ['love', 'A'], ['major', 'A'], ['annual', 'A'],
    ...['A', 'marriage', 'parentChild', 'coworker', 'managerReport', 'businessPartner', 'friendship'].map(id => ['compatibility', id])];
  for (const [product, id] of actualSelections) {
    process.stderr.write('Fresh actual calculation → strict integration ' + product + '/' + id + '\n');
    const actual = await integrateActualFixture(root, { product, id }, { foundation: c.foundation, registry: c.registry });
    assert(actual.ok, JSON.stringify(actual.reasons)); assert(validateIntegrationResult(actual.session).ok);
    assert.equal(actual.session.result.actualBookAllocations, 0); assert.equal(actual.session.result.book.pages.length, 0);
    freshActual.push({ ...actual.observations, planHash: actual.session.result.planHash, handoffHash: actual.session.result.handoffHash,
      sourcePublication: 'EXISTING_WRITER_VALIDATED_SEPARATELY', newEditorialWholeBook: false });
    coverage.push({ engine: actual.session.input.request.registration.engineId, mode: 'STRICT_CUSTOMER_POLICY', executionBasis: 'FRESH_EXISTING_PRODUCERS',
      fixture: actual.observations.fixture, rows: actual.session.result.coverage });
  }
  const oldPlans = c.load(prefix + 'global-specialist-integration/artifactReader.ts').readGlobalArtifact('docs/validation/v4-global-book-planner-01', 'strict-customer-plan.json');
  for (const file of c.files) {
    const data = c.read(file.name.replace('.json', '')), entry = c.registry.byEngine.get(file.engineId);
    const request = prepareStrictRequest({ entry, registry: c.foundation.registry, envelopes: data.envelopes, receipts: data.originalReceipts,
      witnesses: c.witnesses.filter(w => w.fixtureId === file.fixtureId), originalInputProof: {
        source: 'docs/validation/v4-global-specialist-integration-audit-01/' + file.name,
        sha256: sha(fs.readFileSync('docs/validation/v4-global-specialist-integration-audit-01/' + file.name)),
      }, nativeConflicts: data.originalSemanticAudit });
    const session = integrateProduct(root, request), r = session.result;
    assert(validateIntegrationResult(session).ok); assert.equal(r.draft.sentences.length, 0); assert.equal(r.book.pages.length, 0);
    assert.equal(r.planHash, oldPlans.find(p => p.engine === entry.engineId && p.fixture === file.fixtureId).planHash);
    strict.push({ engine: entry.engineId, fixture: file.fixtureId, planHash: r.planHash, handoffHash: r.handoffHash,
      originalEvaluations: data.originalReceipts.length, questions: request.questions.length, sentences: 0, bookAllocations: 0 });
    coverage.push({ engine: entry.engineId, mode: r.mode, fixture: r.fixtureId, rows: r.coverage });
  }
  for (const [entry, display] of [...c.entries.map(e => [e, false]), [c.entries.find(e => e.engineId === 'compatibility-friendship'), true]]) {
    process.stderr.write('Integrating ' + entry.engineId + (display ? ' independent display' : '') + '\n');
    const contract = c.foundation.registry.products.find(p => p.productKey === entry.productKey && p.relationship === entry.relationshipCategory);
    const request = await prepareRehearsalRequest(root, entry, contract, display), session = integrateProduct(root, request), r = session.result;
    assert(validateIntegrationResult(session).ok); assert(reopenOfflineIntegration(session, JSON.stringify(r)));
    const originalQuestions = r.coverage.filter(q => q.namespace === 'ORIGINAL_RESEARCH_READER');
    assert.equal(originalQuestions.length, catalog.questions.filter(q => q.productKey === r.product && q.relationshipCategory === r.relationship).length);
    assert(originalQuestions.every(q => !q.bookDisplayPossible && !q.plannerAssigned));
    const generated = r.bridges.filter(q => q.paragraphId !== null);
    rehearsal.push({ engine: entry.engineId, displayFixture: display, product: r.product, relationship: r.relationship, planHash: r.planHash,
      handoffHash: r.handoffHash, originalReaderContract: r.plan.readerContract, temporalContractHash: r.book.temporalContractHash,
      originalReaderQuestions: originalQuestions.length, nativeQuestions: request.questions.length, nativeAssignments: r.plan.primaryInformation.length,
      editorialSentences: r.draft.sentences.length, editorialParagraphs: r.draft.paragraphs.length,
      nativeBookPages: r.book.pages.length, customerReaderBridges: 0, nativeWithheld: r.coverage.filter(q => q.namespace === 'NATIVE_SYNTHETIC_READER' && !q.bookDisplayPossible).length,
      customerReady: false, fullBookCompleted: false });
    coverage.push({ engine: entry.engineId, mode: r.mode, displayFixture: display, fixture: r.fixtureId, rows: r.coverage });
    meanings.push({ engine: entry.engineId, displayFixture: display, planHash: r.planHash, handoffHash: r.handoffHash,
      temporalContractHash: r.book.temporalContractHash, relationshipContractHash: digest(request.relationshipContract),
      ledger: r.draft.sentences, displayRecords: r.draft.displayRecords, generatedBridges: generated });
    books.push({ engine: entry.engineId, displayFixture: display, book: r.book, roundtrip: true });
    // Corruptions cross the actual integrated boundary; neither a stored hash
    // nor completion flags are treated as authority.
    const changes = [
      ['product question', x => { x.draft.paragraphs[0].questionId = 'different-product-question'; }],
      ['relationship material', x => { x.draft.sentences[0].materialId = 'different-category'; }],
      ['direction', x => { x.draft.sentences[0].direction = 'SWAPPED'; }],
      ['owner', x => { x.draft.sentences[0].owner = 'SWAPPED_ROLE'; }],
      ['period', x => { x.draft.sentences[0].temporal = []; x.book.temporalContractHash = 'other-period'; }],
      ['source hash', x => { x.draft.sentences[0].source.hash = 'forged'; }],
      ['evidence', x => { x.draft.sentences[0].evidenceIds = ['forged']; }],
      ['root', x => { x.draft.sentences[0].factRoots = []; }],
      ['meaning', x => { x.draft.sentences[0].meaningId = 'forged'; }],
      ['condition', x => { x.draft.sentences[0].conditionalScope.clause = ''; }],
      ['negation', x => { x.draft.sentences[0].negationScope = 'REVERSED'; }],
      ['unentered future event', x => { x.draft.sentences[0].actualText = '내년에 반드시 성공합니다.'; }],
      ['display proof', x => { x.draft.displayRecords = []; }],
      ['reader address', x => { x.bridges[0].address.paragraphId = 'P999'; }],
      ['customer allocation', x => { x.actualBookAllocations = 1; }],
      ['customer approval', x => { x.actualCustomerApproved = 1; }],
      ['synthetic promotion', x => { x.book.edition = 'v4'; x.book.customerEdition = true; }],
      ['false completion', x => { x.wholeBookCompleted = true; x.book.wholeBookCompleted = true; }],
      ['publisher bypass', x => { x.book.publisherValidation = 'PASS'; }],
      ['question lost', x => { x.coverage.pop(); }],
    ];
    for (const [name, change] of changes) {
      const changed = { ...r, ...structuredClone({ draft: r.draft, book: r.book, bridges: r.bridges, coverage: r.coverage }) };
      change(changed); const audit = validateIntegrationResult(session, changed);
      assert(!audit.ok, name); negatives.push({ engine: entry.engineId, displayFixture: display, name, rejected: true, errors: audit.errors });
    }
  }
  assert.equal(strict.length, 27); assert.equal(strict.reduce((n, r) => n + r.originalEvaluations, 0), 5073);
  assert.equal(new Set(rehearsal.map(r => r.engine)).size, 12);
  assert.equal(new Set(rehearsal.map(r => r.product)).size, 6);
  assert.equal(new Set(rehearsal.map(r => r.relationship).filter(Boolean)).size, 7);
  const originalIds = rehearsal.filter(r => !r.displayFixture).flatMap(r => catalog.questions.filter(q => q.productKey === r.product && q.relationshipCategory === r.relationship).map(q => q.id));
  assert.equal(new Set(originalIds).size, 2060);
  fs.mkdirSync(out, { recursive: true }); const writer = artifactWriter(out, v => validatePrivateExport(v, privateTerms));
  const write = (name, v) => writer.write(name, v);
  const manifest = { task: 'V4-FULL-PRODUCT-INTEGRATION-01', version: 'offline-full-product-integration-v1', baseSha: BASE,
    status: 'PARTIAL_WITH_VERIFIED_GAPS', protectedBaseFiles: tree.length, products: 6, specialistRoutes: 12, compatibilityCategories: 7,
    originalReaderQuestions: 2060, originalQuestionsLost: 0, customerReaderBridges: 0,
    syntheticSentences: rehearsal.filter(r => !r.displayFixture).reduce((n, r) => n + r.editorialSentences, 0),
    syntheticParagraphs: rehearsal.filter(r => !r.displayFixture).reduce((n, r) => n + r.editorialParagraphs, 0),
    nativeBookPages: rehearsal.filter(r => !r.displayFixture).reduce((n, r) => n + r.nativeBookPages, 0),
    actualOperatorApproved: 0, actualCustomerApproved: 0, actualCustomerEligible: 0, actualCustomerClaims: 0, actualBookAllocations: 0,
    wholeBookCompleted: false, humanQualityApproved: false, customerRuntimeActivated: false, negativeCasesBlocked: negatives.length,
    freshActualProductRoutes: freshActual.length, freshActualCustomerSentences: freshActual.reduce((n, r) => n + r.newCustomerSentences, 0) };
  write('integration-manifest.json', manifest); write('product-route-matrix.json', { strict, rehearsal });
  write('reader-bridge-audit.json', { verifiedCustomerBridges: 0, nativePlacementIsNotCustomerBridge: true,
    originalReaderContracts: catalog.contracts, generated: meanings.map(r => ({ engine: r.engine, displayFixture: r.displayFixture, bridges: r.generatedBridges })) });
  write('coverage-shortage-matrix.json', coverage);
  write('meaning-source-preservation.json', meanings.map(({ generatedBridges: omitted, ...r }) => { void omitted; return r; }));
  write('offline-book-representations.json', books);
  write('actual-product-integration.json', freshActual);
  write('approval-safety-audit.json', { strict, syntheticDefinitions: 'SYNTHETIC_TEST_ONLY', existingResearchMeaning: false,
    automaticClaimAnchorMapping: false, actualCustomerAuthorization: false, actualOperatorApproved: 0, actualCustomerApproved: 0,
    actualCustomerEligible: 0, actualCustomerClaims: 0, actualBookAllocations: 0, negativeCases: negatives });
  write('publication-safety-handoff.json', { status: 'NOT_STARTED', customerRuntimeEnabled: false,
    wholeBookCompleted: false, customerReady: false, required: ['Exact original Reader/Scheduler bridges', 'Source/domain/meaning resolution without gate changes',
      'Real approvals and independently authorized customer activation', 'CHILDREN and adult-child authority review', 'Legacy fallback and existing pair publication risk review', 'Human reading'] });
  preserve(); b.verify(); for (const s of seal) assert.equal(sha(fs.readFileSync(s.file)), s.sha256);
  write('execution-source-seal.json', seal);
  write('deterministic-validation.json', { files: writer.files.sort().map(file => ({ file, sha256: sha(fs.readFileSync(path.join(out, file))) })), measurementsExternal: true });
  const used = process.cpuUsage(cpu); process.stderr.write(JSON.stringify({ elapsedMs: performance.now() - started, cpuUserMs: used.user / 1000,
    cpuSystemMs: used.system / 1000, maxRssKiB: process.resourceUsage().maxRSS, heapSettingIsNotMinimumRequirement: true }) + '\n');
  return { out, manifest };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) process.stdout.write(JSON.stringify(await run(process.argv[2])) + '\n');
