import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { beforeAll, expect, it, vi } from 'vitest';
import { verifyTermSource } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/termSourceRevision';
import { explainTerm, hasTenGodContext, newTermMemory } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/termExplanation';
import { KOREAN_TERM_EXPLANATIONS as terms } from '@/lib/report-knowledge/korean-editorial-research/termExplanationResearch';
import { hash, recordHash } from '@/lib/report-knowledge/knowledge-integration-foundation/sourceReader';
import { ACTUAL_INVOKERS } from '../../../tools/global-specialist-integration-audit/invokers';
import { readGlobalArtifact } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/artifactReader';
import { prepareRehearsalRequest } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/planningRequest';
import { planGlobalBook } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/engine';
import { createEditorialInput } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/editorialInput';
import { constructClaim } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/claimEnvelope';
import type { V4RuntimeEvidence } from '@/lib/interpretation-v4/runtimeProjection';
import { generateV4ShadowReport } from '@/lib/interpretation-v4/runtimeShadow';
import { observeActualProfiles } from '@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/producers';
import { buildActualEvidenceGraph } from '@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine';
import { EvidenceKnowledgeIndex } from '@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/knowledge';
import type { ActualEvidenceNode, GraphKnowledgeInputs } from '@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/types';
import type { EngineRegistration } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/types';
import type { ProductContract } from '@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/types';
import type { EditorialInput, TypedEditorialClaim } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/types';
import locks from '../../fixtures/six-product-integration-01/source-locks.json';
vi.mock('server-only', () => ({}));
const root = resolve('.'), renderer = 'src/lib/interpretation-v4/compatibilityReleaseRenderer.ts';
const research = 'src/lib/report-knowledge/korean-editorial-research/termExplanationResearch.ts';
const technical = 'tests/fixtures/technical-stabilization-01/source-revision-contract.json';
const publication = 'tests/fixtures/publication-safety-01/source-revision-contract.json';
const reviewed = 'docs/validation/v4-knowledge-source-revision-contract-01/source-drift-resolution.json';
const targetIds = ['ker:term:2', 'ker:term:6', 'ker:term:7'];
const term = terms[2];
function copyRoot() {
  const destination = mkdtempSync(join(tmpdir(), 'gyeol-term-source-'));
  for (const file of [renderer, research, technical, publication, reviewed]) {
    mkdirSync(dirname(join(destination, file)), { recursive: true }); copyFileSync(file, join(destination, file));
  }
  return destination;
}
it.each(targetIds)('recognizes exact committed current Source for %s without approval', id => {
  const t = terms.find(t => t.id === id)!, r = verifyTermSource(root, t);
  expect(r.status).toBe('TECHNICALLY_VERIFIED_SOURCE');
  if (r.status !== 'TECHNICALLY_VERIFIED_SOURCE') return;
  expect(r.mode).toBe('VERIFIED_REVISION_CHAIN'); expect(r.originalSourceHash).toBe(t.sourceHash);
  expect(r.currentSourceHash).toBe(hash(readFileSync(renderer)));
  expect(r.proof).toMatchObject({ originalId: id, expectedHash: recordHash(t), actualHash: recordHash(t), qualification: {
    revisionCommit: '0a8e685b07f5cd60226ced986d4e3fe92f392b64', meaningApproved: false, customerApproved: false, newIndependentFacts: 0,
  } });
});
it('checks actual historical Git bytes while leaving the raw mismatch visible', () => {
  const revision = '0a8e685b07f5cd60226ced986d4e3fe92f392b64';
  expect(hash(execFileSync('git', ['show', `${revision}^:${renderer}`]))).toBe(term.sourceHash);
  expect(hash(execFileSync('git', ['show', `${revision}:${renderer}`]))).toBe(hash(readFileSync(renderer)));
  expect(readFileSync(research)).toEqual(execFileSync('git', ['show', `6d471db103d53dd9165e4832744501a686e59edc:${research}`]));
  expect(targetIds.filter(id => terms.find(t => t.id === id)!.sourceHash !== hash(readFileSync(renderer)))).toHaveLength(3);
});
it.each(['sourceHash', 'sourceFile', 'id', 'good', 'requiredDefinition'] as const)('blocks altered original research %s', key => {
  expect(verifyTermSource(root, { ...term, [key]: 'unapproved' }).status).toBe('WITHHELD');
});
it('blocks a forged fourth renderer record even with the current file hash', () => {
  expect(verifyTermSource(root, { ...term, id: 'ker:term:999', sourceHash: hash(readFileSync(renderer)) }).status).toBe('WITHHELD');
});
it.each([
  ['wrong commit', technical, (s: string) => s.replace('0a8e685b07f5cd60226ced986d4e3fe92f392b64', '0'.repeat(40))],
  ['missing chain', technical, (s: string) => { const j = JSON.parse(s); j.priorRevisions = []; return JSON.stringify(j); }],
  ['changed original receipt', publication, (s: string) => s + ' '],
  ['changed identity proof', reviewed, (s: string) => s.replace('ker:term:2', 'ker:term:999')],
  ['changed research file', research, (s: string) => s + '\n// unapproved\n'],
  ['other current hash', renderer, (s: string) => s + '\n// unapproved\n'],
  ['historical renderer only', renderer, () => execFileSync('git', ['show', `0a8e685b07f5cd60226ced986d4e3fe92f392b64^:${renderer}`], { encoding: 'utf8' })],
] as const)('blocks %s without modifying repository sources', (_name, file, mutate) => {
  const destination = copyRoot(); writeFileSync(join(destination, file), mutate(readFileSync(join(destination, file), 'utf8')));
  expect(verifyTermSource(destination, term).status).toBe('WITHHELD');
});
it.each([technical, publication, reviewed, renderer])('withholds missing %s', file => {
  const destination = copyRoot(); unlinkSync(join(destination, file)); expect(verifyTermSource(destination, term).status).toBe('WITHHELD');
});
it('preserves direct verification of every unaffected term', () => {
  for (const t of terms.filter(t => !targetIds.includes(t.id))) expect(verifyTermSource(root, t)).toMatchObject({ status: 'TECHNICALLY_VERIFIED_SOURCE', mode: 'ORIGINAL_SOURCE', currentSourceHash: t.sourceHash });
});
let input: EditorialInput, claims: TypedEditorialClaim[], actualNodes: ActualEvidenceNode[];
beforeAll(async () => {
  const entries = readGlobalArtifact(root + '/docs/validation/v4-global-specialist-integration-audit-01', 'global-engine-registry.json') as EngineRegistration[];
  const entry = entries.find(e => e.engineId === 'compatibility-parent-child')!;
  const contract = (entry.readerContract as { foundationProductContract: ProductContract[] }).foundationProductContract[0];
  const request = await prepareRehearsalRequest(root, { ...entry, invoke: ACTUAL_INVOKERS[entry.engineId] }, contract), plan = planGlobalBook(request);
  input = createEditorialInput(root, request, plan); claims = plan.selectedCandidateReferences.flatMap(a => { const c = constructClaim(input, a); return c?.directionWitnesses.length ? [c] : []; });
  const json = <T,>(f: string): T => JSON.parse(readFileSync(f, 'utf8'));
  const base = 'docs/validation/v4-knowledge-unified-catalog-01', old = 'docs/validation/v4-knowledge-source-verification-01', sem = 'docs/validation/v4-knowledge-semantic-domain-verification-01';
  const records = [...new Set(json<{ shard: string }[]>(base + '/knowledge-catalog.json').map(r => r.shard))].flatMap(f => json<GraphKnowledgeInputs['records']>(base + '/' + f));
  const knowledge = new EvidenceKnowledgeIndex({ records, sourceReceipts: json(old + '/source-verification-receipts.json'), decisions: json(sem + '/semantic-domain-decisions.json'), policyRules: json<{ rules: GraphKnowledgeInputs['policyRules'] }>(sem + '/verification-config.json').rules, staticAncestry: json(sem + '/ancestor-domain-audit.json'), readFile: f => readFileSync(f, 'utf8'), frozen: new Map(Object.entries(json<Record<string, string>>('docs/validation/v4-actual-evidence-graph-01/original-file-hashes.json'))) });
  const f = locks.find(f => f.product === 'compatibility' && f.id === 'A')!, generated = await generateV4ShadowReport(f.payload, f.clock);
  expect(generated.ok).toBe(true); if (!generated.ok) throw Error('EXISTING_REAL_GENERATOR_REQUIRED');
  const evidence = generated.evidencePacket as V4RuntimeEvidence, profiles = observeActualProfiles(evidence);
  actualNodes = buildActualEvidenceGraph({ evidence, profiles: profiles.profiles, context: { fixtureId: 'fixture-term-context', synthetic: true, evaluatedAt: evidence.generatedAt, owners: { personA: 'fixture-term-A', personB: 'fixture-term-B' }, catalogVersion: 'unified-catalog-v1', sourceVersion: 'source-verification-v1', semanticVersion: 'semantic-domain-v1' } }, knowledge).graph.nodes;
}, 180000);
it('recognizes Source but withholds three explanations on authentic synthetic context', () => {
  expect(claims).toHaveLength(2);
  for (const c of claims) for (const id of targetIds) expect(explainTerm(input, c, id, newTermMemory(input))).toMatchObject({ status: 'WITHHELD', reason: 'MISSING_REQUIRED_CONTEXT', newIndependentFacts: 0, text: '' });
});
it('preserves authenticated Input/Claim identity and TermMemory repetition control', () => {
  const c = claims[0], memory = newTermMemory(input);
  expect(explainTerm(input, { ...c }, 'ker:term:2', memory).status).toBe('WITHHELD');
  expect(explainTerm({ ...input }, c, 'ker:term:2', memory).status).toBe('WITHHELD');
  expect(explainTerm(input, c, 'ker:term:2', { mode: 'OFFLINE_TERM_REFERENCE' }).status).toBe('WITHHELD');
  const r = explainTerm(input, c, 'ker:term:13', memory);
  expect(r).toMatchObject({ status: 'GENERAL_USAGE_REFERENCE', actualCustomerClaims: 0, individualDefinitionOrInterpretationApproved: false, newIndependentFacts: 0 });
  expect(explainTerm(input, c, 'ker:term:13', memory).status).toBe('REFERENCE_ALREADY_INTRODUCED');
});
function actualContext(n = actualNodes.find(n => n.kind === 'DIRECTIONAL_RELATION_FACT')!) {
  return { owner: n.owner.fixtureOwnerId, direction: n.owner.slot === 'personA' ? 'A_TO_B' : 'B_TO_A', evidenceIds: [n.id], directionWitnesses: [{ nodeId: n.id, ownerId: n.owner.fixtureOwnerId, direction: n.direction! }], temporal: [] };
}
it('checks both existing actual A/B tenGod observations without creating a Claim', () => {
  const facts = actualNodes.filter(n => n.kind === 'DIRECTIONAL_RELATION_FACT'); expect(facts).toHaveLength(2);
  for (const n of facts) expect(hasTenGodContext(root, actualContext(n), actualNodes), JSON.stringify({ status: n.status, blockers: n.blockers })).toBe(true);
});
it.each(['missing participant', 'missing tenGod', 'changed tenGod', 'wrong reference', 'wrong direction', 'wrong owner', 'synthetic producer', 'missing parent', 'period promotion'] as const)('withholds %s from the existing actual context', variant => {
  const nodes = structuredClone(actualNodes), n = nodes.find(n => n.kind === 'DIRECTIONAL_RELATION_FACT')!, context = actualContext(n);
  if (variant === 'missing participant') n.participants = [];
  if (variant === 'missing tenGod') n.value = {};
  if (variant === 'changed tenGod') n.value = { receivedTenGod: { ...(n.value as { receivedTenGod: object }).receivedTenGod, tenGod: 'unverified' } };
  if (variant === 'wrong reference') n.direction!.recipientDayMaster = n.direction!.subjectDayMaster;
  if (variant === 'wrong direction') context.direction = context.direction === 'A_TO_B' ? 'B_TO_A' : 'A_TO_B';
  if (variant === 'wrong owner') context.owner = 'unentered-owner';
  if (variant === 'synthetic producer') n.producer.system = 'synthetic-only';
  if (variant === 'missing parent') nodes.splice(nodes.findIndex(p => p.id === n.ancestry.parentIds[0]), 1);
  if (variant === 'period promotion') Object.assign(context, { temporal: [{ scope: 'annual' }] });
  expect(hasTenGodContext(root, context, nodes)).toBe(false);
});

it('cannot verify an arbitrary file as a new term even with its exact current hash', () => {
  expect(verifyTermSource(root, { ...term, id: 'ker:term:unregistered', sourceFile: 'package.json', sourceHash: hash(readFileSync('package.json')) }).status).toBe('WITHHELD');
});
