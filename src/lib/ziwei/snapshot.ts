import "server-only";
/**
 * ZW-2 1부 — 자미 책 스냅샷의 명반 조각(서버 전용, 호출 0). 책을 만들 때 한 번 계산해 스냅샷(paid_report_snapshots.snapshot_json의 draft.ziwei)에 저장하고,
 * 화면 · 검사 · 다시 읽기는 저장된 명반만 쓴다(계산 기준이 바뀌어도 이미 받은 책은 그대로 — ZIWEI_CALC_VERSION으로 구별).
 * 다른 상품의 스냅샷 구조는 바꾸지 않는다(자미 책 초안에만 있는 칸).
 */
import { ZIWEI_CALC_VERSION } from "./basis";
import { computeZiweiChart } from "./chart";
import type { ZiweiChart, ZiweiGender } from "./types";
import type { ReportPersonInputPayload } from "@/lib/report-generation/reportInputTypes";

export type ZiweiSnapshotPart = { readonly calcVersion: typeof ZIWEI_CALC_VERSION; readonly chart: ZiweiChart };

/** 입력(결제 · 이용권 입력 원문의 person)과 기준일(YYYY-MM-DD, 책을 쓴 날)로 명반 조각을 만든다. 성별 · 시간대가 없으면 엔진이 오류를 낸다(입력 단계가 먼저 막는다). */
export function ziweiSnapshotPart(person: Pick<ReportPersonInputPayload, "birthDate" | "birthTime" | "birthTimeUnknown" | "approximateBirthTimeSlot" | "birthTimePrecision" | "gender"> & { readonly birthLongitude?: unknown }, asOf: string): ZiweiSnapshotPart {
  const chart = computeZiweiChart({
    birthDate: person.birthDate, birthTime: person.birthTime, birthTimeUnknown: person.birthTimeUnknown, approximateBirthTimeSlot: person.approximateBirthTimeSlot, birthTimePrecision: person.birthTimePrecision,
    ...(person.birthLongitude !== undefined ? { birthLongitude: person.birthLongitude } : {}), gender: person.gender as ZiweiGender,
  }, asOf);
  return { calcVersion: ZIWEI_CALC_VERSION, chart };
}

/** 저장된 조각 읽기: 계산 버전이 지금과 다르면 그 책의 명반은 저장본 그대로 쓰되 표시만 한다(다시 계산하지 않는다). 모양이 아니면 null. */
export function readZiweiSnapshotPart(x: unknown): (ZiweiSnapshotPart & { readonly current: boolean }) | null {
  if (!x || typeof x !== "object") return null;
  const v = x as { calcVersion?: unknown; chart?: unknown };
  const c = v.chart as ZiweiChart | undefined;
  if (typeof v.calcVersion !== "string" || !c || typeof c !== "object" || !Array.isArray(c.palaces) || c.palaces.length !== 12 || !Array.isArray(c.stars) || !Array.isArray(c.decadals)) return null;
  return { calcVersion: v.calcVersion as typeof ZIWEI_CALC_VERSION, chart: c, current: v.calcVersion === ZIWEI_CALC_VERSION };
}
