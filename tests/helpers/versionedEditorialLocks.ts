import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect } from "vitest";
import locks from "../fixtures/technical-stabilization-01/current-edition-locks.json";

/** Test receipts captured from the unmodified Base, never customer approval. */
export const editorialLocks = locks;
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
