import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { bootstrap } from './bootstrap.mjs';
const root = process.cwd(), out = path.resolve(process.argv[2] ?? '');
if (process.argv.length !== 3 || !out.startsWith('/private/tmp/') && !out.startsWith('/tmp/') || fs.existsSync(out) && fs.readdirSync(out).length) throw Error('NEW_EXTERNAL_OUTPUT_DIRECTORY_REQUIRED');
fs.mkdirSync(out, { recursive: true });
const { load } = bootstrap(root), { prepareOfflinePublication, observePublicationViews, validateOfflinePublication, reopenOfflinePublication } = load('src/lib/interpretation-v4/publication-safety/engine.ts');
const { v4Digest } = load('src/lib/interpretation-v4/runtimeProjection.ts');
const { inspectPublicationAncestry } = load('src/lib/interpretation-v4/publication-safety/ancestry.ts');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file)));
const inputFiles = ['src/lib/interpretation-v4/compatibilityProductAdapter.ts', 'src/lib/interpretation-v4/compatibilityReleaseRenderer.ts',
  'src/lib/report-generation/productPreviewSnapshot.ts', 'src/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualFixture.ts',
  'src/lib/interpretation-v4/publication-safety/engine.ts', 'src/lib/interpretation-v4/publication-safety/ancestry.ts',
  'tools/publication-safety/bootstrap.mjs', 'tools/publication-safety/verify.mjs', 'tools/publication-safety/source-risk-verify.mjs',
  'tests/unit/interpretation-v4/publicationSafety.test.ts', 'tests/unit/report-knowledge/compatibilityBusinessPartnerSpecialistArtifacts.test.ts',
  'tests/fixtures/publication-safety-01/source-revision-contract.json'];
const inputHashes = () => Object.fromEntries(inputFiles.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
const risks = { love: ['O', 'Q'], marriage: ['M', 'N', 'AB'], 'parent-child': ['L', 'M', 'V', 'A'], coworker: ['L', 'M', 'AG', 'W'], 'manager-report': ['L', 'M', 'AL', 'AJ', 'AK'], 'business-partner': ['L', 'M', 'AO', 'AM', 'AN'], friendship: ['L0', 'M0', 'A0', 'H0'] };
inputFiles.push('tests/fixtures/six-product-integration-01/source-locks.json', ...Object.keys(risks).map(cat => `docs/validation/v4-compatibility-${cat}-product-knowledge-01/input-cases.json`));
const beforeInputs = inputHashes();
const cases = [], results = [], changes = [], children = [], negatives = [];
for (const [cat, letters] of Object.entries(risks)) {
  const file = `docs/validation/v4-compatibility-${cat}-product-knowledge-01/input-cases.json`;
  for (const letter of letters) {
    const row = read(file).find(c => (c.letter ?? c.id) === letter);
    if (!row) throw Error('ORIGINAL_FIXTURE_NOT_FOUND:' + cat + '/' + letter);
    for (const [variant, payload] of (row.variants ?? [row.payload]).entries()) cases.push({ id: cat + '/' + letter + '/' + variant, file, letter, variant, payload, clock: { evaluatedAt: '2026-10-12T12:00:00+09:00' } });
  }
}
for (const product of ['comprehensive', 'career', 'love', 'major', 'annual', 'compatibility']) {
  const locks = read('tests/fixtures/six-product-integration-01/source-locks.json').filter(f => f.product === product && (product === 'compatibility' ? ['A', 'marriage', 'parentChild', 'coworker', 'managerReport', 'businessPartner', 'friendship'].includes(f.id) : f.id === 'A'));
  for (const f of locks) cases.push({ ...f, id: 'route/' + product + '/' + f.id, file: 'tests/fixtures/six-product-integration-01/source-locks.json' });
}
const started = performance.now(), cpu = process.cpuUsage();
for (const c of cases) {
  const session = await prepareOfflinePublication(c.payload, c.clock);
  if (!session.ok) { results.push({ id: c.id, generated: false, errors: session.errors }); continue; }
  const r = session.result, old = session.original.evidencePacket, current = r.evidence;
  const mask = text => { let s = text; for (const slot of ['personA', 'personB', 'person']) { const person = old.input[slot]; if (person?.name) s = s.replaceAll(person.name, '{' + slot + '}'); } return s; };
  const before = old.composition.result, after = current.composition.result;
  const pair = current.composition.product === 'saju_mbti_compatibility';
  const beforeParagraphs = pair ? before.integration.readerEdition.chapters.flatMap(c => c.paragraphs) : [];
  for (const p of pair ? after.integration.readerEdition.chapters.flatMap(c => c.paragraphs) : []) {
    const b = beforeParagraphs.find(b => b.id === p.id);
    const authorityChange = after.evidence.category === 'parentChild' && ['CH06.P4', 'CH08.P2'].includes(p.id);
    const ancestrySelectionChange = b && b.sentences.some((s, i) => s.mbtiSourceNodeIds.some(id => id.includes(':traits:child:')) || s.sourceCandidateId !== p.sentences[i]?.sourceCandidateId || s.provenance.sourceRegistryKey.startsWith('comparison:') && s.provenance.sourceRegistryKey !== p.sentences[i]?.provenance.sourceRegistryKey);
    if (b && b.text !== p.text) changes.push({ case: c.id, address: p.id, classification: authorityChange || ancestrySelectionChange ? 'INTENDED_SAFETY_CORRECTION' : 'INTENDED_EDITORIAL_CORRECTION', reason: authorityChange ? 'Unverified parental authority removed' : ancestrySelectionChange ? 'Full-ancestry eligibility; distinct independently supported roots' : 'Independent paragraph purpose or distinct actual MBTI source; no synonym-only validator exemption', beforeTextHash: v4Digest(b.text), afterTextHash: v4Digest(p.text), before: mask(b.text), after: mask(p.text), sourceBefore: b.sentences.map(s => ({ id: s.sourceCandidateId ?? s.provenance.sourceRegistryKey, roots: s.individualEvidenceIds, nodes: s.mbtiSourceNodeIds, fusion: s.fusionIds, direction: s.directionId ?? null })), sourceAfter: p.sentences.map(s => ({ id: s.sourceCandidateId ?? s.provenance.sourceRegistryKey, roots: s.individualEvidenceIds, nodes: s.mbtiSourceNodeIds, fusion: s.fusionIds, direction: s.directionId ?? null })) });
  }
  const row = { id: c.id, fixtureFile: c.file, inputHash: v4Digest(c.payload), generated: true, validGeneratedContent: r.validGeneratedContent, safeToPublish: r.safeToPublish, approvedForCustomerUse: false, humanQualityApproved: false,
    errors: r.errors, calculationUnchanged: v4Digest(old.calculations) === v4Digest(current.calculations), fullOriginalSnapshotHash: r.originalHash,
    scoreUnchanged: pair ? v4Digest(before.compatibilityIndex) === v4Digest(after.compatibilityIndex) : true,
    directionUnchanged: pair ? v4Digest(before.evidence.directions) === v4Digest(after.evidence.directions) : true,
    profilesUnchanged: pair ? v4Digest(before.integration.individualDigests) === v4Digest(after.integration.individualDigests) : true,
    originalWriterDefaultHash: v4Digest(before.narrative), correctedWriterHash: v4Digest(after.narrative),
    unaffectedNarrativeUnchanged: pair ? null : v4Digest(before.narrative) === v4Digest(after.narrative),
    readerEditionBefore: pair ? before.integration.readerEdition.version : null, publishedEditionBefore: pair ? before.integration.publishedEdition : null,
    hardErrorsBefore: pair ? before.integration.readerValidation.hardErrors : [], qualityBefore: pair ? before.integration.readerValidation.qualityIssues : [], editorialBefore: pair ? before.integration.readerEditorial : [],
    readerEditionAfter: pair ? after.integration.readerEdition.version : null, publishedEditionAfter: pair ? after.integration.publishedEdition : null,
    hardErrorsAfter: pair ? after.integration.readerValidation.hardErrors : [], qualityAfter: pair ? after.integration.readerValidation.qualityIssues : [], editorialAfter: pair ? after.integration.readerEditorial : [],
    chapters: pair ? after.integration.readerEdition.chapters.length : after.narrative.sections.length + 1,
    paragraphs: pair ? after.integration.readerEdition.chapters.reduce((n, c) => n + c.paragraphs.length, 0) : null,
    roles: pair ? after.integration.readerEdition.chapters.reduce((n, c) => n + c.paragraphs.reduce((n, p) => n + p.sentences.length, 0), 0) : null,
    years: current.composition.product === 'major_fortune' ? after.years.length : null, months: current.composition.product === 'annual_fortune' ? after.months.length : null,
    legacy: r.legacyFallback, storedRoundtrip: r.safeToPublish ? reopenOfflinePublication(session, JSON.stringify(r)) !== null : reopenOfflinePublication(session, JSON.stringify(r)) === null,
    newCustomerAllocations: 0, newClaims: 0, storedReopen: r.safeToPublish ? 'VERIFIED' : 'WITHHELD_NO_SNAPSHOT_OR_ACCESS', snapshotEmitted: r.snapshot !== null, bookHash: r.bookHash };
  if (!row.calculationUnchanged || !row.scoreUnchanged || !row.directionUnchanged || !row.profilesUnchanged || row.unaffectedNarrativeUnchanged === false) throw Error('UNINTENDED_REGRESSION:' + c.id);
  results.push(row);
  if (pair && ['coworker/W', 'manager-report/AJ', 'manager-report/AK', 'business-partner/AM', 'business-partner/AN', 'friendship/A0', 'friendship/H0'].some(id => c.id.startsWith(id + '/'))) {
    const address = c.id.startsWith('friendship/H0/') ? 'CH04.P1' : 'CH07.P1';
    const views = observePublicationViews(old).original;
    const oldP = before.integration.readerEdition.chapters.flatMap(c => c.paragraphs).find(p => p.id === address);
    const newP = after.integration.readerEdition.chapters.flatMap(c => c.paragraphs).find(p => p.id === address);
    if (!oldP || !newP) throw Error('ORIGINAL_CHILDREN_READER_ADDRESS_MISSING:' + c.id);
    const provenance = [];
    for (const slot of ['personA', 'personB']) {
      const view = views[slot], nodes = oldP.sentences.flatMap(s => s.mbtiSourceNodeIds).filter(id => view.profiles.mbti.sourceNodes.some(n => n.id === id));
      provenance.push({ owner: slot, ...inspectPublicationAncestry(view, [...new Set(nodes)]) });
    }
    children.push({ id: c.id, inputHash: row.inputHash, address, product: current.productType, relationship: after.evidence.category, readerQuestion: oldP.purpose, customerSchedulerBridge: 'UNVERIFIED', sourceGroup: 'EXISTING_WRITER_COMPARISON_NOT_NEW_RESEARCH_APPROVAL', before: mask(oldP.text), beforeHash: v4Digest(oldP), provenance,
      originalChildrenReproduced: provenance.some(p => p.ancestors.some(a => a.domain === 'CHILDREN')),
      afterHash: v4Digest(newP), after: mask(newP.text),
      correctedSourceChecks: r.safety.ancestry.filter(a => a.address.startsWith(address)), safeToPublish: r.safeToPublish,
      publishedEdition: after.integration.publishedEdition, newCustomerAllocations: 0 });
  }
  if (c.id === 'parent-child/V/0') {
    if (!validateOfflinePublication(session).ok) throw Error('POSITIVE_CONTROL_REQUIRED_FOR_NEGATIVES');
    const mutations = {
      'CHILDREN domain transfer': x => { x.safety.ancestry[0].ancestors[0].domain = 'CHILDREN'; },
      'missing full ancestry': x => { x.safety.ancestry[0].ancestors = []; },
      'wrong person': x => { x.safety.ancestry[0].owner = 'personB'; },
      'A/B direction': x => { x.evidence.composition.result.evidence.directions.aToB.subjectPerson = 'forged'; },
      'fixed role reversal': x => { x.evidence.composition.result.evidence.roles.personA = 'child'; },
      'adult autonomy deprivation': x => { x.draft.sections[0].paragraphs[0] = '부모가 최종 결정권을 가집니다.'; },
      'guardian inference': x => { x.unenteredFacts.guardianship = 'CONFIRMED'; },
      'unknown to confirmed': x => { x.unenteredFacts.consent = 'CONFIRMED'; },
      'invented relation': x => { x.evidence.composition.result.evidence.relations[0].identity = 'invented'; },
      'source hash forgery': x => { x.safety.ancestry[0].ancestors[0].sourceHash = 'forged'; },
      'question mapping': x => { x.safety.ancestry[0].address = 'psq:invented'; },
      'undisplayed Recall': x => { x.evidence.composition.result.integration.readerEdition.chapters.splice(6, 1); },
      'unsupported meaning': x => { x.evidence.composition.result.integration.readerEdition.chapters[0].paragraphs[0].sentences[0].semanticTheme = 'invented'; },
      'title-only bridge': x => { x.customerReaderBridgeVerified = true; },
      'failed prose as Legacy': x => { x.evidence.composition.result.integration.publishedEdition = 'compatibility-product-13d-7b-v1'; },
      'version masquerade': x => { x.snapshot.productVersion = 'v3'; },
      'digest forgery': x => { x.evidence.contentDigest = 'forged'; },
      'wrong product evidence': x => { x.evidence.productType = 'annual_fortune'; },
      'synthetic customer approval': x => { x.approvedForCustomerUse = true; x.actualBookAllocations = 1; },
      'stored book regeneration': x => { x.originalHash = 'regenerated'; },
    };
    for (const [name, mutate] of Object.entries(mutations)) { const x = structuredClone(r); mutate(x); const check = validateOfflinePublication(session, x); if (check.ok) throw Error('NEGATIVE_ACCEPTED:' + name); negatives.push({ name, blocked: true, errors: check.errors }); }
    if (validateOfflinePublication({ ...session }).ok) throw Error('CLONED_SESSION_ACCEPTED');
    negatives.push({ name: 'cloned private receipt', blocked: true });
  }
  process.stdout.write(c.id + ' ' + (r.safeToPublish ? 'SAFE_OFFLINE' : r.errors.join('|')) + '\n');
}
const write = (file, value) => fs.writeFileSync(path.join(out, file), JSON.stringify(value, null, 2) + '\n');
if (JSON.stringify(beforeInputs) !== JSON.stringify(inputHashes())) throw Error('PUBLICATION_SOURCE_CHANGED_DURING_RUN');
write('source-input-hashes.json', beforeInputs);
write('compatibility-publication-validation.json', results);
write('children-provenance-validation.json', children);
write('before-after-publication.json', changes);
write('negative-validation.json', negatives);
write('publication-safety-manifest.json', { task: 'V4-PUBLICATION-SAFETY-01', baseSha: 'c315a04e31b316a88e1f0bc28169484379187a13', cases: results.length, generated: results.filter(r => r.generated).length, safeOffline: results.filter(r => r.safeToPublish).length, withheld: results.filter(r => !r.safeToPublish).map(r => ({ id: r.id, errors: r.errors })), originalChildrenCases: children.length, childrenReproduced: children.filter(r => r.originalChildrenReproduced).length, changes: changes.length, negatives: negatives.length, actualOperatorApproved: 0, actualCustomerApproved: 0, actualCustomerEligible: 0, actualCustomerClaims: 0, actualBookAllocations: 0, customerActivationAuthorized: false, humanQualityApproved: false });
const hashes = Object.fromEntries(fs.readdirSync(out).sort().map(f => [f, crypto.createHash('sha256').update(fs.readFileSync(path.join(out, f))).digest('hex')]));
write('deterministic-output.json', hashes);
fs.writeFileSync(path.join(path.dirname(out), path.basename(out) + '-resources.json'), JSON.stringify({ wallMs: performance.now() - started, cpuMicros: process.cpuUsage(cpu), maxRSSBytes: process.resourceUsage().maxRSS * 1024, nodeVersion: process.version, heapIsTestSettingNotMinimum: true }));
