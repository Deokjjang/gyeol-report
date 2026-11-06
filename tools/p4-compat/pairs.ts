// 무작위 쌍 생성(결정론, 시드 고정). P4 궁합 점수 진단·분포 측정 공통.
import { COMPATIBILITY_ROLE_VERSION, type CompatibilityRelationshipType } from "../../src/lib/report-generation/reportInputTypes";
import { MBTI_TYPES } from "../../src/data/knowledge-v5/schema";

export const CATEGORIES: CompatibilityRelationshipType[] = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"];
export function rng(seed: number) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export type RandPerson = { name: string; birthDate: string; birthTime: string; birthTimeUnknown: boolean; mbtiType: string; gender: "MALE" | "FEMALE" };
export function randomPerson(r: () => number, i: number): RandPerson {
  const y = 1960 + Math.floor(r() * 50), m = 1 + Math.floor(r() * 12), d = 1 + Math.floor(r() * 28);
  const unknown = r() < 0.2, h = Math.floor(r() * 24), mi = Math.floor(r() * 60);
  return { name: `p${i}`, birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, birthTime: unknown ? "" : `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`,
    birthTimeUnknown: unknown, mbtiType: r() < 0.1 ? "" : MBTI_TYPES[Math.floor(r() * 16)], gender: r() < 0.5 ? "MALE" : "FEMALE" };
}
export function randomPairs(n: number, seed = 20261029) { const r = rng(seed); return Array.from({ length: n }, (_, i) => [randomPerson(r, 2 * i), randomPerson(r, 2 * i + 1)] as const); }
export const toPayloadPerson = (p: RandPerson) => ({ ...p, birthTimePrecision: p.birthTimeUnknown ? "unknown" : "exact", approximateBirthTimeSlot: "", calendarType: "solar", timezone: "Asia/Seoul" });
export const toPayload = (a: RandPerson, b: RandPerson, category: CompatibilityRelationshipType) =>
  ({ productKey: "saju_mbti_compatibility" as const, productSlug: "compatibility" as const, compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION, relationshipType: category, personA: toPayloadPerson(a), personB: toPayloadPerson(b) });
export function stats(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b), q = (p: number) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))];
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  return { n: xs.length, min: s[0], p10: q(0.1), p25: q(0.25), median: q(0.5), p75: q(0.75), p90: q(0.9), max: s.at(-1)!, mean: +mean.toFixed(2), sd: +sd.toFixed(2) };
}
