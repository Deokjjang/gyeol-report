import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect } from "vitest";
import { projectV4Composition, validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../src/lib/interpretation-v4/runtimeProjection";
import locks from "../fixtures/technical-stabilization-01/current-edition-locks.json";
import majorEdition from "../fixtures/full-content-refinement-01/major-edition-locks.json";

/** Historical receipts remain immutable. The explicitly revised major copy has
 * separate current-edition receipts, never customer approval. */
export const editorialLocks = { ...locks, majorNarratives: majorEdition.majorNarratives, majorSeparation: majorEdition.majorSeparation };
export function editionRow<R extends Record<string, unknown>>(rows: R, id: string): R[keyof R] {
  expect(Object.hasOwn(rows, id), `missing versioned fixture: ${id}`).toBe(true);
  return rows[id as keyof R];
}
export function expectHistoricalEditorialFiles(): void {
  expect(locks.sourceSha).toBe("7ef25fcc0ae6f7765473433a826cb7cf96068a7b");
  for (const [file, digest] of Object.entries(locks.historicalFiles)) {
    expect(createHash("sha256").update(readFileSync(file)).digest("hex"), file).toBe(digest);
  }
}

/** Test-only compatibility view: validate the new seal/provenance first, then
 * compare every prior payload field against unchanged historical digest locks.
 * Never used by generation/storage; never edits a fixture or supplied packet. */
export function preFoundationEvidence(e: V4RuntimeEvidence): V4RuntimeEvidence {
  expect(validateV4Publication(e.productType, projectV4Composition(e.composition), e)).toEqual({ ok: true, errors: [] });
  if (e.foundationRevision === undefined) return structuredClone(e);
  expect(e.foundationRevision).toBe("foundation-engine-01");
  const { foundationRevision, foundation, contentDigest, ...body } = structuredClone(e);
  void foundationRevision; void foundation; void contentDigest;
  const result: Record<string, unknown> = { ...body.composition.result };
  delete result.foundationReferences;
  const oldBody = { ...body, composition: { ...body.composition, result } as V4RuntimeEvidence["composition"] };
  return { ...oldBody, contentDigest: v4Digest(oldBody) };
}
