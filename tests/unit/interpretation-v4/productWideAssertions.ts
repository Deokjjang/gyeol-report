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
  const r = record(e.composition.result), integration = record(r.integration), evidence = record(r.evidence);
  expect({ calculations: v4Digest(e.calculations), mbtiTables: v4Digest(e.mbtiTables), natalTables: v4Digest(e.natalTableEvidence),
    materials: v4Digest(r.materials ?? null), index: v4Digest(r.compatibilityIndex ?? null), directions: v4Digest(evidence.directions ?? null),
    individuals: v4Digest(integration.individualDigests ?? integration.personalDigest ?? integration.profileDigests ?? null),
    periods: v4Digest(r.transitions ?? null), years: Array.isArray(r.years) ? r.years.map(y => record(y).year) : null,
    months: Array.isArray(r.months) ? r.months.map(m => record(m).month) : null }).toEqual(expected);
}
