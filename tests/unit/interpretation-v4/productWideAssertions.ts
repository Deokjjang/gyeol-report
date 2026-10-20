import temporal from "../../fixtures/full-content-refinement-01/temporal-foundations.json";
import currentLocks from "../../fixtures/full-content-refinement-01/output-locks.json";
import { COMPATIBILITY_INDEX_VERSION } from "../../../src/lib/interpretation-v4/compatibilityIndex";
import { buildLegacyCompatibilityIndex } from "../../../src/lib/interpretation-v4/compatibilityIndexLegacy";
import { expect } from "vitest";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import locks from "../../fixtures/product-wide-editorial-01/output-locks.json";
export { default as editorialLocks } from "../../fixtures/full-content-refinement-01/output-locks.json";
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
/** The editorial output lock may change; these pre-upgrade engine/source
 * signatures may not. Historical snapshot/lock fixtures remain unmodified. */
export function expectEditorialFoundations(e: V4RuntimeEvidence, payload: unknown, clock: unknown) {
  const rows: Readonly<Record<string, typeof locks.preservation[keyof typeof locks.preservation]>> = locks.preservation;
  const extra: Readonly<Record<string, typeof temporal.preservation[keyof typeof temporal.preservation]>> = temporal.preservation;
  const key = v4Digest([payload, clock]);
  const expected = rows[key] ?? extra[key];
  expect(expected, "missing pre-upgrade foundation baseline").toBeDefined();
  let index = v4Digest(record(e.composition.result).compatibilityIndex ?? null);
  if (e.composition.product === "saju_mbti_compatibility" && e.composition.result.compatibilityIndex?.version === COMPATIBILITY_INDEX_VERSION) {
    const current: Readonly<Record<string, typeof currentLocks.preservation[keyof typeof currentLocks.preservation]>> = currentLocks.preservation;
    expect(index, "new versioned index output").toBe(current[v4Digest([payload, clock])]?.index);
    // Preserve the old calibration too; only the explicitly versioned new
    // interpretation index may differ from this original foundation baseline.
    index = v4Digest(buildLegacyCompatibilityIndex(e.composition.result.evidence));
  }
  const r = record(e.composition.result), integration = record(r.integration), evidence = record(r.evidence);
  let periods = v4Digest(r.transitions ?? null);
  if (e.composition.product === "major_fortune" && r.writerVersion === "major-full-content-refinement-01-v2") {
    const original: Readonly<Record<string, typeof temporal.temporalMetadata[keyof typeof temporal.temporalMetadata]>> = temporal.temporalMetadata;
    const transitions = e.composition.result.transitions.map(t => Object.fromEntries(Object.entries(t).filter(([k]) => k !== "blocks")));
    expect({ transitions, horizon: e.composition.result.evidence.horizon }).toEqual(original[key]);
    const current: Readonly<Record<string, typeof currentLocks.preservation[keyof typeof currentLocks.preservation]>> = currentLocks.preservation;
    expect(periods, "versioned transition prose receipt").toBe(current[key]?.periods);
    // Only transition paragraphs changed. Canonical boundaries/ranges/cycles
    // above still match the unmodified Base exactly.
    periods = expected.periods;
  }

  expect({ calculations: v4Digest(e.calculations), mbtiTables: v4Digest(e.mbtiTables), natalTables: v4Digest(e.natalTableEvidence),
    materials: v4Digest(r.materials ?? null), index, directions: v4Digest(evidence.directions ?? null),
    individuals: v4Digest(integration.individualDigests ?? integration.personalDigest ?? integration.profileDigests ?? null),
    periods, years: Array.isArray(r.years) ? r.years.map(y => record(y).year) : null,
    months: Array.isArray(r.months) ? r.months.map(m => record(m).month) : null }).toEqual(expected);
}
