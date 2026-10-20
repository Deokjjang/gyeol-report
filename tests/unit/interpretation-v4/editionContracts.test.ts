import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { storedBook } from "../../../src/lib/book/storedReport";
import type { BookData } from "../../../src/app/dev/book-preview/bookTypes";
import { editorialLocks, editionRow, expectHistoricalEditorialFiles } from "../../helpers/versionedEditorialLocks";

it("pins the separately captured unmodified Base receipts; old lock files remain immutable", () => {
  expectHistoricalEditorialFiles();
  const bytes = readFileSync("tests/fixtures/technical-stabilization-01/current-edition-locks.json");
  expect(createHash("sha256").update(bytes).digest("hex")).toBe("d749a43a089276031345c75adaa342ae9097535695ded87cdf81c2951c3e7e26");
  expect(Object.keys(editorialLocks.majorNarratives)).toHaveLength(6);
  expect(Object.keys(editorialLocks.majorSeparation)).toHaveLength(6);
  expect(Object.keys(editorialLocks.runtime)).toHaveLength(6);
});
it("rejects an unrecorded edition/input instead of accepting a fresh hash", () => {
  expect(() => editionRow(editorialLocks.runtime, "invented")).toThrow();
  expect(() => editionRow(editorialLocks.runtime, "__proto__")).toThrow();
});
it.each(["career", "love", "compatibility"])("reopens original %s edition without regeneration or snapshot mutation", product => {
  const saved = JSON.parse(readFileSync(`tests/fixtures/completed-report/${product}-editorial-base.json`, "utf8")) as { snapshot: unknown; book: BookData };
  const before = JSON.stringify(saved.snapshot);
  expect(storedBook(saved.snapshot)?.data).toEqual(saved.book);
  expect(storedBook(saved.snapshot, "https://example.test/r/original-edition")?.data).toEqual(saved.book);
  expect(JSON.stringify(saved.snapshot)).toBe(before);
});
