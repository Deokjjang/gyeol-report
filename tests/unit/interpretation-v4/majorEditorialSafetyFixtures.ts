import { MAJOR_NARRATIVE_FIXTURES } from "./majorFixtures";
import type { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";

type MajorResult = Extract<Awaited<ReturnType<typeof composeMajorFortuneNarrative>>, { ok: true }>;

export const MAJOR_SAFETY_CLOCK = { evaluatedAt: "2026-10-12T12:00:00+09:00" };
const base = MAJOR_NARRATIVE_FIXTURES[0].payload;
const noTime = { birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" };
export const MAJOR_SAFETY_CASES = [
  ...MAJOR_NARRATIVE_FIXTURES.slice(0, 3),
  { id: "04-time-unknown", payload: { ...base, person: { ...base.person, ...noTime } } },
  { id: "05-mbti-unknown", payload: { ...base, person: { ...base.person, mbtiType: "" } } },
  { id: "06-both-unknown", payload: { ...base, person: { ...base.person, ...noTime, mbtiType: "" } } },
];

/** Mask only authorized copy slots. All other text, IDs, proofs, calculations,
 * period selection, personalization and structure remain in the baseline lock.
 * Hedge counts are recomputed from the newly conditional copy, not engine data. */
export function majorSafetyInvariant(result: Pick<MajorResult, "years" | "transitions">): unknown {
  const texts = new Set(["current-setting", "next-boundary", "final-direction"]);
  for (const t of result.transitions) for (const role of ["work", "people", "life"]) texts.add(`transition-${t.year}-${role}`);
  for (const y of result.years) {
    if (result.transitions.some(t => t.year === y.year)) texts.add(`${y.year}-boundary`);
    if (y.annual.tenGod === "정재" && y.timePosition !== "past") texts.add(`${y.year}-character`);
    if (y.annual.tenGod === "식신" || y.timePosition === "past") texts.add(`${y.year}-gift`);
    if (y.timePosition === "past") {
      texts.add(`${y.year}-friction`);
      texts.add(`${y.year}-harmony`);
    }
  }
  const visit = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(visit);
    if (typeof value !== "object" || value === null) return value;
    const row = value as Record<string, unknown>;
    return Object.fromEntries(Object.entries(row).map(([key, child]) => [key,
      key === "hedgeChapters" ? "<copy-dependent-count>" :
      key === "text" && texts.has(String(row.id)) ? "<authorized-copy>" :
      key === "title" && (row.id === "next-cycle" || String(row.id).startsWith("transition-")) ? "<authorized-title>" : visit(child)]));
  };
  return visit(result);
}
