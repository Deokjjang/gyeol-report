import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { normalize } from "node:path";
import { expect } from "vitest";
import revisionRaw from "../fixtures/knowledge-source-revision-contract-01/source-revision-contract.json";
import stagingRaw from "../fixtures/protected-staging-integration-01/source-revision-contract.json";
import raw from "../fixtures/technical-stabilization-01/source-revision-contract.json";

export type ProtectionContract = {
  baseSha: string; customerRuntimeActivated: boolean; researchSourcesChanged: boolean;
  historicalHashFilesRewritten: boolean;
  priorRevisions: { task: string; commit: string; file: string; before: string; after: string }[];
  currentDeltas: Record<string, { before: string; after: string }>;
  immutableReceipts: Record<string, string>;
};
export const protectionContract: ProtectionContract = raw;
export const stagingProtectionContract = stagingRaw;
// Frozen receipts remain historical; this test-only edition extends the same chain.
export const sourceRevisionContract = revisionRaw;
const reviewedTechnical = JSON.stringify(raw), reviewedStaging = JSON.stringify(stagingRaw), reviewedRevision = JSON.stringify(revisionRaw);
const technicalManifestSha = "9ca5f4e57ce09eda79e613b338c62c0438206cbd4c3ee0a49d2a5e4196662323";
const revisionManifestSha = "3f4343013b014b43c6d693f8679d88214a2c5c0387798ae1ef53e4ec277c1e50";
if (createHash("sha256").update(readFileSync("tests/fixtures/technical-stabilization-01/source-revision-contract.json")).digest("hex") !== technicalManifestSha) throw Error("EXACT_TECHNICAL_RECEIPT_REQUIRED");
if (createHash("sha256").update(readFileSync("tests/fixtures/knowledge-source-revision-contract-01/source-revision-contract.json")).digest("hex") !== revisionManifestSha) throw Error("EXACT_SOURCE_TEST_RECEIPT_REQUIRED");
export function validateSourceRevisionContract(contract = sourceRevisionContract): void {
  if (JSON.stringify(contract) !== reviewedRevision) throw Error("EXACT_SOURCE_TEST_REVISION_REQUIRED");
}
const stagingManifestSha = "bcb18bf24fa3418e52a83c10fa683054c3ccf44581299be930f2f73ee3f191e8";
if (createHash("sha256").update(readFileSync("tests/fixtures/protected-staging-integration-01/source-revision-contract.json")).digest("hex") !== stagingManifestSha) throw Error("EXACT_STAGING_TEST_RECEIPT_REQUIRED");
const stagingFiles = ["tests/unit/interpretation-v4/runtimeShadow.test.tsx", "tests/unit/report-knowledge/compatibilityBusinessPartnerSpecialistEngine.test.ts"] as const;
export function validateStagingProtectionContract(contract = stagingProtectionContract): void {
  if (contract.baseSha !== "1b89d8d90fdad2b0a82b783e2d948c9cc5de878f" || [contract.customerRuntimeActivated, contract.researchSourcesChanged, contract.historicalHashFilesRewritten].some(v => v !== false)) throw Error("STAGING_PRESERVATION_REQUIRED");
  if (Object.keys(contract.currentDeltas).sort().join("|") !== [...stagingFiles].sort().join("|")) throw Error("EXACT_STAGING_TEST_SCOPE_REQUIRED");
  if (JSON.stringify(contract) !== reviewedStaging) throw Error("EXACT_STAGING_TEST_CHAIN_REQUIRED");
  for (const file of stagingFiles) {
    const delta = contract.currentDeltas[file], reviewed = stagingProtectionContract.currentDeltas[file];
    if (delta.before !== reviewed.before || delta.after !== reviewed.after || !/^[a-f0-9]{64}$/.test(delta.after)) throw Error("EXACT_STAGING_TEST_CHAIN_REQUIRED");
  }
}

export function validateProtectionContract(contract = protectionContract): void {
  if (contract.baseSha !== "7ef25fcc0ae6f7765473433a826cb7cf96068a7b") throw Error("EXACT_BASE_REQUIRED");
  if ([contract.customerRuntimeActivated, contract.researchSourcesChanged, contract.historicalHashFilesRewritten].some(value => value !== false)) throw Error("PRESERVATION_GATES_REQUIRED");
  for (const [file, delta] of Object.entries(contract.currentDeltas)) {
    if (!/^tests\/unit\/.*\.tsx?$/.test(file) || normalize(file) !== file || !/^[a-f0-9]{64}$/.test(delta.before) || !/^[a-f0-9]{64}$/.test(delta.after)) throw Error("EXACT_TEST_REVISION_REQUIRED");
  }
  // Scope, commit, identity, every link and immutable receipt must match the sealed contract.
  if (JSON.stringify(contract) !== reviewedTechnical) throw Error("EXACT_SOURCE_REVISION_CONTRACT_REQUIRED");
}
export function versionedFileHash(file: string, historicalHash: string, contract = protectionContract): string {
  validateProtectionContract(contract);
  let expected = historicalHash;
  for (const revision of contract.priorRevisions.filter(row => row.file === file)) {
    // A receipt may originate before or after an independently approved revision.
    expect([revision.before, revision.after], `${file}: unrecognized historical revision`).toContain(expected);
    if (expected === revision.before) expected = revision.after;
  }
  const delta = contract.currentDeltas[file];
  if (delta) {
    expect(expected, `${file}: technical revision must start at exact Base bytes`).toBe(delta.before);
    expected = delta.after;
  }
  validateStagingProtectionContract();
  const stagingDelta = stagingProtectionContract.currentDeltas[file as keyof typeof stagingProtectionContract.currentDeltas];
  if (stagingDelta) {
    expect(expected, `${file}: staging fixture preparation must start at exact technical Base bytes`).toBe(stagingDelta.before);
    expected = stagingDelta.after;
  }
  validateSourceRevisionContract();
  const sourceDelta = sourceRevisionContract.currentDeltas[file as keyof typeof sourceRevisionContract.currentDeltas];
  if (sourceDelta) {
    expect(expected, `${file}: Source verification revision must start at exact staging Base bytes`).toBe(sourceDelta.before);
    expected = sourceDelta.after;
  }
  return expected;
}
export function expectVersionedFile(file: string, historicalHash: string): void {
  expect(createHash("sha256").update(readFileSync(file)).digest("hex"), file).toBe(versionedFileHash(file, historicalHash));
}
