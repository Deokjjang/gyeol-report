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
  const expected = rows[v4Digest([payload, clock])];
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
  expect({ calculations: v4Digest(e.calculations), mbtiTables: v4Digest(e.mbtiTables), natalTables: v4Digest(e.natalTableEvidence),
    materials: v4Digest(r.materials ?? null), index, directions: v4Digest(evidence.directions ?? null),
    individuals: v4Digest(integration.individualDigests ?? integration.personalDigest ?? integration.profileDigests ?? null),
    periods: v4Digest(r.transitions ?? null), years: Array.isArray(r.years) ? r.years.map(y => record(y).year) : null,
    months: Array.isArray(r.months) ? r.months.map(m => record(m).month) : null }).toEqual(expected);
}
