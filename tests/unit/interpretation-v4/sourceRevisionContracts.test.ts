import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { KOREAN_TERM_EXPLANATIONS } from "@/lib/report-knowledge/korean-editorial-research/termExplanationResearch";
import { SourceReader, hash, recordHash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import type { KnowledgeSourcePointer } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { type ProtectionContract, sourceRevisionContract, validateSourceRevisionContract, expectVersionedFile, protectionContract, validateProtectionContract, versionedFileHash } from "../../helpers/versionedProtection";

it("pins exact revisions without replacing historical hash receipts", () => {
  expect(createHash("sha256").update(readFileSync("tests/fixtures/technical-stabilization-01/source-revision-contract.json")).digest("hex"))
    .toBe("1c2495895978aeccdfd43f30b84e474d7fbc7c5b7b45b616b1c63c5edc8ae9b1");
  validateProtectionContract();
  expect(Object.keys(protectionContract.currentDeltas)).toHaveLength(19);
  for (const [file, hash] of Object.entries(protectionContract.immutableReceipts)) {
    expect(createHash("sha256").update(readFileSync(file)).digest("hex"), file).toBe(hash);
  }
  for (const [file, delta] of Object.entries(protectionContract.currentDeltas)) expectVersionedFile(file, delta.before);
});
it("accepts only the exact old-to-new Publication and tracing revisions", () => {
  for (const revision of protectionContract.priorRevisions) {
    expectVersionedFile(revision.file, revision.before);
    expectVersionedFile(revision.file, revision.after);
  }
});
it("rejects a fabricated historical source hash", () => {
  expect(() => versionedFileHash(protectionContract.priorRevisions[0].file, "0".repeat(64))).toThrow();
});
it("rejects a delta that does not start at the exact Base", () => {
  const altered = structuredClone(protectionContract), [file, delta] = Object.entries(altered.currentDeltas)[0];
  const original = delta.before;
  delta.before = "0".repeat(64);
  expect(() => versionedFileHash(file, original, altered)).toThrow();
});
it("cannot authorize an application source change through a test revision", () => {
  const altered = structuredClone(protectionContract);
  altered.currentDeltas["src/lib/interpretation-v4/runtimeShadow.ts"] = { before: "0".repeat(64), after: "1".repeat(64) };
  expect(() => validateProtectionContract(altered)).toThrow("EXACT_TEST_REVISION_REQUIRED");
});
it("cannot authorize path traversal through a test revision", () => {
  const altered = structuredClone(protectionContract);
  altered.currentDeltas["tests/unit/../../src/engine.ts"] = { before: "0".repeat(64), after: "1".repeat(64) };
  expect(() => validateProtectionContract(altered)).toThrow("EXACT_TEST_REVISION_REQUIRED");
});
it.each(["customerRuntimeActivated", "researchSourcesChanged", "historicalHashFilesRewritten"] as const)("cannot change %s through a technical receipt", key => {
  const altered = structuredClone(protectionContract);
  altered[key] = true;
  expect(() => validateProtectionContract(altered)).toThrow("PRESERVATION_GATES_REQUIRED");
});

it.each(protectionContract.priorRevisions)('proves historical Git bytes and ancestry for $file', revision => {
  const bytes = (version: string) => execFileSync('git', ['show', `${version}:${revision.file}`]);
  expect(hash(bytes(`${revision.commit}^`))).toBe(revision.before);
  expect(hash(bytes(revision.commit))).toBe(revision.after);
  expect(() => execFileSync('git', ['merge-base', '--is-ancestor', revision.commit, sourceRevisionContract.baseSha])).not.toThrow();
});
it.each([
  ['wrong commit', (c: ProtectionContract) => { c.priorRevisions[1].commit = '0'.repeat(40); }],
  ['missing chain', (c: ProtectionContract) => { c.priorRevisions.splice(1, 1); }],
  ['identity swap', (c: ProtectionContract) => { c.priorRevisions[1].file = c.priorRevisions[0].file; }],
  ['mixed edition', (c: ProtectionContract) => { c.priorRevisions[1].after = c.priorRevisions[0].after; }],
  ['unapproved source', (c: ProtectionContract) => { c.priorRevisions.push({ ...c.priorRevisions[0], file: 'src/lib/report-knowledge/sajuKnowledgeBase.ts' }); }],
  ['altered receipt', (c: ProtectionContract) => { c.immutableReceipts[Object.keys(c.immutableReceipts)[0]] = '0'.repeat(64); }],
  ['unreviewed test hash', (c: ProtectionContract) => { Object.values(c.currentDeltas)[0].after = '0'.repeat(64); }],
] as const)('rejects %s instead of granting a revision', (_name, change) => {
  const bad = structuredClone(protectionContract); change(bad);
  expect(() => validateProtectionContract(bad)).toThrow('EXACT_SOURCE_REVISION_CONTRACT_REQUIRED');
});
it('extends only the two reviewed preservation assertions without rewriting old receipts', () => {
  validateSourceRevisionContract();
  expect(sourceRevisionContract.baseSha).toBe('fdc93c0a60b20bbdd848a7ba1535afad588506b3');
  expect(Object.keys(sourceRevisionContract.currentDeltas).sort()).toEqual([
    'tests/unit/report-knowledge/knowledgeSemanticDomainVerification.test.ts',
    'tests/unit/report-knowledge/knowledgeSourceVerification.test.ts',
  ]);
  for (const [file, delta] of Object.entries(sourceRevisionContract.currentDeltas)) expectVersionedFile(file, delta.before);
  const bad = structuredClone(sourceRevisionContract);
  bad.currentDeltas['tests/unit/report-knowledge/knowledgeSourceVerification.test.ts'].after = '0'.repeat(64);
  expect(() => validateSourceRevisionContract(bad)).toThrow('EXACT_SOURCE_TEST_REVISION_REQUIRED');
});
const termFile = 'src/lib/report-knowledge/korean-editorial-research/termExplanationResearch.ts';
const termVersion = '6d471db103d53dd9165e4832744501a686e59edc';
const termHashes = [
  ['ker:term:2', 2, '3491269989b877441c187ab14b42c14a1ceb96b47b70eb395df99cc0f8a5249f'],
  ['ker:term:6', 6, 'dd0300fa41cf042a5250cd1477b4cf7b75e69f0a41ce95031325a83d0d08dec7'],
  ['ker:term:7', 7, '9dcedb8cfb1841a5482d4cdb774bea3a5458bd9f063a1ac096917a78395c750d'],
] as const;
const termPointer = (index: number = 2): KnowledgeSourcePointer => ({ file: termFile, exportName: 'KOREAN_TERM_EXPLANATIONS', index,
  originalId: KOREAN_TERM_EXPLANATIONS[index].id, recordSha256: recordHash(KOREAN_TERM_EXPLANATIONS[index]), sourceVersion: termVersion });
const termReader = () => new SourceReader(process.cwd(), async file => import(/* @vite-ignore */ pathToFileURL(file).href), [termVersion]);
it.each(termHashes)('connects %s to its exact historical renderer edition for integrity only', async (id, index, recordSha) => {
  expect(hash(readFileSync(termFile))).toBe('1c2c64a1d4e005fe4849a8ff9789b20399dc5ca41f1ce6a08aec885f7ce2dddc');
  expect(readFileSync(termFile)).toEqual(execFileSync('git', ['show', `${termVersion}:${termFile}`]));
  const located = await termReader().locate({ ...termPointer(index), originalId: id, recordSha256: recordSha });
  expect(located.code).toBeUndefined(); expect(located.value).toEqual(KOREAN_TERM_EXPLANATIONS[index]);
  const term = KOREAN_TERM_EXPLANATIONS[index], revision = protectionContract.priorRevisions[1];
  expect(term.sourceFile).toBe(revision.file); expect(term.sourceHash).toBe(revision.before);
  expect(hash(execFileSync('git', ['show', `${termVersion}:${term.sourceFile}`]))).toBe(term.sourceHash);
  expectVersionedFile(term.sourceFile, term.sourceHash);
  // Existing raw Source and runtime holds stay observable; this grants no meaning approval.
  expect(term.sourceHash).not.toBe(hash(readFileSync(term.sourceFile)));
  expect(term.approvedForCustomer).toBe(false); expect(term.connectedToRuntime).toBe(false);
  expect(term.runtimeEvidenceIds).toEqual([]);
});
it.each([
  ['arbitrary hash', { recordSha256: '0'.repeat(64) }, 'RECORD_HASH_MISMATCH'],
  ['wrong commit', { sourceVersion: '0'.repeat(40) }, 'UNKNOWN_SOURCE_VERSION'],
  ['missing record', { index: 999 }, 'POINTER_MISSING'],
  ['identity swap', { originalId: 'ker:term:6' }, 'ID_MISMATCH'],
  ['mixed record edition', { index: 6 }, 'ID_MISMATCH'],
  ['mixed file edition', { fileSha256: protectionContract.priorRevisions[1].after }, 'FILE_HASH_MISMATCH'],
] as const)('blocks term %s without fallback', async (_name, altered, code) => {
  expect((await termReader().locate({ ...termPointer(), ...altered })).code).toBe(code);
});
it('blocks altered research content without rewriting the actual file', async () => {
  const modified = KOREAN_TERM_EXPLANATIONS.map((term, index) => index === 2 ? { ...term, good: 'UNAPPROVED_RESEARCH_CHANGE' } : term);
  const reader = new SourceReader(process.cwd(), async () => ({ KOREAN_TERM_EXPLANATIONS: modified }), [termVersion]);
  expect((await reader.locate(termPointer())).code).toBe('RECORD_HASH_MISMATCH');
  expect(() => expectVersionedFile(termFile, '0'.repeat(64))).toThrow();
});
it('rejects another source identity hash as a renderer edition', () => {
  expect(() => versionedFileHash(protectionContract.priorRevisions[1].file, protectionContract.priorRevisions[0].before)).toThrow();
});
