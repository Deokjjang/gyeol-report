import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { expectVersionedFile, protectionContract, validateProtectionContract, versionedFileHash } from "../../helpers/versionedProtection";

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
