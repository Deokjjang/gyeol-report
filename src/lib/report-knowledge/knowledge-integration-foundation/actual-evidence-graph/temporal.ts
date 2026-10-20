import type { EvidenceTemporalWindow } from "./types";
export type IntersectionResult = { state: "CONFIRMED_INTERSECTION" | "CONDITIONAL_INTERSECTION" | "NO_INTERSECTION" | "UNKNOWN_INTERVAL" | "UNSUPPORTED_COMBINATION"; start: string | null; endExclusive: string | null; reason: string | null };
export function intersectEvidencePeriods(periods: readonly EvidenceTemporalWindow[], compositeLayers = 2): IntersectionResult {
  const result = (state: IntersectionResult["state"], reason: string | null = null): IntersectionResult => ({ state, start: null, endExclusive: null, reason });
  if (compositeLayers > 2 || periods.some(p => !p.compatibleCombination)) return result("UNSUPPORTED_COMBINATION", "UNSUPPORTED_COMPOSITE");
  if (!periods.length || periods.some(p => p.certainty === "unknown" || !p.start || !p.endExclusive || !Number.isFinite(Date.parse(p.start)) || !Number.isFinite(Date.parse(p.endExclusive)) || Date.parse(p.start) >= Date.parse(p.endExclusive))) return result("UNKNOWN_INTERVAL");
  const start = Math.max(...periods.map(p => Date.parse(p.start!))), end = Math.min(...periods.map(p => Date.parse(p.endExclusive!)));
  if (start >= end) return result("NO_INTERSECTION", "NO_TIME_INTERSECTION");
  return { state: periods.some(p => p.certainty !== "confirmed" || p.transitionRange && p.transitionRange.earliestKst !== p.transitionRange.latestKst) ? "CONDITIONAL_INTERSECTION" : "CONFIRMED_INTERSECTION", start: new Date(start).toISOString(), endExclusive: new Date(end).toISOString(), reason: null };
}
export function temporalPosition(p: EvidenceTemporalWindow, now: string): "past" | "current" | "future" | "unknown" {
  if (!p.start || !p.endExclusive || !Number.isFinite(Date.parse(now))) return "unknown";
  return Date.parse(now) < Date.parse(p.start) ? "future" : Date.parse(now) >= Date.parse(p.endExclusive) ? "past" : "current";
}
