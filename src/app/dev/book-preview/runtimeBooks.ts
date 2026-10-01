import "server-only";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "../../../../tests/unit/interpretation-v4/runtimeFixtures";
import { NARRATIVE_FIXTURES } from "../../../../tests/unit/interpretation-v4/narrativeFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "../../../../tests/unit/interpretation-v4/compatibilityFixtures";
import { generateV4ShadowReport } from "../../../lib/interpretation-v4/runtimeShadow";
import type { V4RuntimeEvidence } from "../../../lib/interpretation-v4/runtimeProjection";
import { projectBook } from "./bookProjection";
import type { BookData, BookFixtureLink, BookLibrary } from "./bookTypes";
import { CATEGORIES } from "./model";

// Existing Phase 7 golden inputs, not new authored report text. Fixed reading
// clock keeps past/current/future and all canonical boundary tests reproducible.
const ids = ["full", "career", "love", "compatibility", "major", "annual"] as const;
const approximate = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", NARRATIVE_FIXTURES[0], "MYOSI");
export const BOOK_FIXTURES = [
  ...RUNTIME_FIXTURES.map((f, i) => ({ ...f, bookId: ids[i] })),
  { id: "full-unknown", bookId: "full" as const, payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", NARRATIVE_FIXTURES[11]) },
  { id: "full-approximate", bookId: "full" as const, payload: { ...approximate, person: { ...approximate.person, birthTime: "" } } },
  ...COMPATIBILITY_NARRATIVE_FIXTURES.slice(1).map(f => ({ id: `pair-${f.id}`, bookId: "compatibility" as const, payload: f.payload })),
];
export const BOOK_FIXTURE_LINKS: BookFixtureLink[] = BOOK_FIXTURES.map(f => {
  const p = f.payload;
  return { id: f.id, bookId: f.bookId, label: "personA" in p ? `${p.personA.name} · ${p.personB.name} / ${CATEGORIES.find(([id]) => id === p.relationshipType)?.[1]}`
    : `${p.person.name} / ${p.person.mbtiType || "MBTI 모름"} / ${p.person.birthTimePrecision === "unknown" ? "시간 모름" : p.person.birthTimePrecision === "approximate" ? "대략 시간" : "정확 시간"}` };
});
// Only the approved, finite fixture IDs enter this process-local cache. No DB,
// environment activation flag, user payload, token, shared URL or writer call.
const books = new Map<string, Promise<BookData | null>>();
export async function loadRuntimeBook(id: string): Promise<BookData | null> {
  const fixture = BOOK_FIXTURES.find(f => f.id === id);
  if (!fixture) return null;
  if (!books.has(id)) books.set(id, (async () => {
    const generated = await generateV4ShadowReport(fixture.payload, SHADOW_CLOCK);
    return generated.ok ? projectBook(generated.evidencePacket as V4RuntimeEvidence) : null;
  })());
  return books.get(id)!;
}
export async function loadBookLibrary(selected?: string): Promise<BookLibrary | null> {
  const choice = BOOK_FIXTURES.find(f => f.id === selected);
  const selectedFixtures = ids.map(bookId => choice?.bookId === bookId ? choice : BOOK_FIXTURES.find(f => f.bookId === bookId)!);
  const results = await Promise.all(selectedFixtures.map(f => loadRuntimeBook(f.id)));
  if (results.some(b => !b)) return null;
  return { books: results as BookData[], fixtures: BOOK_FIXTURE_LINKS, selected: choice?.id ?? "comprehensive" };
}
