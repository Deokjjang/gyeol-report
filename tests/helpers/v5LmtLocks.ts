import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect } from "vitest";
import { v4Digest } from "../../src/lib/interpretation-v4/runtimeProjection";
import { DAYUN_CALCULATION_VERSION, LEGACY_DAYUN_CALCULATION_VERSIONS, LEGACY_SAJU_CALENDAR_VERSIONS, SAJU_CALENDAR_VERSION } from "../../src/lib/saju/calendarVersion";

// Regression baseline after the v5-lmt calendar (saju-calendar-v5-lmt): NOT a quality approval.
// Historical lock fixtures stay byte-identical. An entry here, keyed by the historical expected value
// (a hash string as is, anything else by v4Digest), replaces that value for this engine.
// Reasons per lock: docs/manseryeok-lock-rebaseline.md. Regenerate with V5_LOCK_RECORD=1 and
// --no-file-parallelism; recording never fails a lock, so review the diff of the JSON file.
const FILE = resolve(__dirname, "../fixtures/v5-lmt-rebaseline/locks.json");
type Entry = unknown | { readonly v4Digest: string };
const load = (): Record<string, Entry> => JSON.parse(readFileSync(FILE, "utf8"));
const overlay = load();
const keyOf = (historical: unknown) => typeof historical === "string" ? historical : `v4Digest:${v4Digest(historical ?? null)}`;
const isDigestEntry = (value: unknown): value is { v4Digest: string } =>
  value !== null && typeof value === "object" && Object.keys(value).length === 1 && typeof (value as { v4Digest?: unknown }).v4Digest === "string";
// Large objects are kept as their digest so the overlay stays reviewable.
const entryFor = (actual: unknown): Entry => JSON.stringify(actual ?? null).length > 2_000 ? { v4Digest: v4Digest(actual ?? null) } : actual ?? null;

// key: when the historical baseline is looked up by input (and a pinned input has none), name the slot.
export function expectLock(actual: unknown, historical: unknown, message?: string, key = keyOf(historical)) {
  if (process.env.V5_LOCK_RECORD === "1") {
    if (v4Digest(actual ?? null) === v4Digest(historical ?? null)) return;
    const current = load(), entry = entryFor(actual);
    if (key in current && v4Digest(current[key]) !== v4Digest(entry)) throw Error(`V5_LOCK_CONFLICT:${key}`);
    writeFileSync(FILE, JSON.stringify({ ...current, [key]: entry }, null, 1) + "\n");
    return;
  }
  const expected = key in overlay ? overlay[key] : historical;
  if (isDigestEntry(expected)) expect(v4Digest(actual ?? null), message).toBe(expected.v4Digest);
  else expect(actual, message).toEqual(expected);
}

// True when a named slot has (or, while recording, may get) a v5-lmt baseline.
export function hasV5Lock(key: string): boolean {
  return process.env.V5_LOCK_RECORD === "1" || key in overlay;
}

// Historical proof/source refs name the kst-v2 engine versions; v5-lmt evidence names the current ones.
export function currentVersionRefs(values: readonly string[]): string[] {
  return values.map((value) => value.replace(LEGACY_SAJU_CALENDAR_VERSIONS[0], SAJU_CALENDAR_VERSION)
    .replace(LEGACY_DAYUN_CALCULATION_VERSIONS[0], DAYUN_CALCULATION_VERSION));
}
