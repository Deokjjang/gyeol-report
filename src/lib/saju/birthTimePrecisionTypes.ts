import { SAJU_CALC_VERSION_ID, SAJU_CALENDAR_VERSION, type SajuCalendarVersion } from "./calendarVersion";
import { DEFAULT_SAJU_TIME_POLICY, type LongitudeSource, type ZiHourRule } from "./calcPolicy";
import { utcOffsetMinutesAt } from "./solarTime";
import type { Pillar } from "./types";

// Client-safe input SSOT. Slots are 시진 in local mean solar time (v5-lmt); minutes are
// relative to the birth date's solar midnight. 子 belongs to the date on which the slot ends.
const SLOTS = [
  { value: "JASI", nameKo: "자시", startMinute: -60, endMinute: 60 },
  { value: "CHUKSI", nameKo: "축시", startMinute: 60, endMinute: 180 },
  { value: "INSI", nameKo: "인시", startMinute: 180, endMinute: 300 },
  { value: "MYOSI", nameKo: "묘시", startMinute: 300, endMinute: 420 },
  { value: "JINSI", nameKo: "진시", startMinute: 420, endMinute: 540 },
  { value: "SASI", nameKo: "사시", startMinute: 540, endMinute: 660 },
  { value: "OSI", nameKo: "오시", startMinute: 660, endMinute: 780 },
  { value: "MISI", nameKo: "미시", startMinute: 780, endMinute: 900 },
  { value: "SINSI", nameKo: "신시", startMinute: 900, endMinute: 1020 },
  { value: "YUSI", nameKo: "유시", startMinute: 1020, endMinute: 1140 },
  { value: "SULSI", nameKo: "술시", startMinute: 1140, endMinute: 1260 },
  { value: "HAESI", nameKo: "해시", startMinute: 1260, endMinute: 1380 },
] as const;
// Labels show today's Korean civil clock (UTC+9) for each solar 시진 at the default longitude
// (127.5°E runs 30 minutes behind). A birthplace longitude is not collected by the intake form.
export const SLOT_LABEL_CIVIL_SHIFT_MINUTES = 540 - Math.round(DEFAULT_SAJU_TIME_POLICY.longitude * 4);
const clock = (minute: number) => {
  const m = ((minute % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
// endShift: 시진 끝 순간의 시계 차이(서머타임이 바뀌는 날에만 시작과 다르다). 끝이 다음 날로 넘어가면 「다음 날」.
function slotLabel(slot: (typeof SLOTS)[number], shift = SLOT_LABEL_CIVIL_SHIFT_MINUTES, endShift = shift): string {
  const start = slot.startMinute + shift;
  const end = slot.endMinute + endShift - 1;
  return `${slot.nameKo} ${start < 0 ? "전날 " : ""}${clock(start)}~${start < 0 ? "당일 " : end >= 1440 ? "다음 날 " : ""}${clock(end)}`;
}
export const BIRTH_TIME_SLOT_DEFINITIONS = SLOTS.map((slot) => ({ ...slot, labelKo: slotLabel(slot) }));
/**
 * 날짜별 대략 시간대 라벨(운영 Q 8-2): 시진은 태양시(동경 127.5°)라 시계로는 그날의 UTC 오프셋(tzdata — 서머타임 UTC+10·+9:30,
 * 옛 표준시 UTC+8:30)에 따라 다르다. 시계 차이 = UTC 오프셋 − 경도×4(분). 시진 시작·끝 순간의 오프셋을 따로 봐서 서머타임이 바뀌는 날도 맞다.
 * 계산(birthTimePrecision의 시진 범위)은 그대로이고 라벨만 바뀐다. 날짜가 없거나 이상하면, 또는 브라우저가 시간대 자료를 못 주면 undefined
 * (부르는 쪽이 지금 시계 UTC+9 라벨을 쓴다). 예: 1987-07-01 유시 18:30~20:29, 1957-07-01 유시 18:00~19:59, 1960-01-01 유시 17:00~18:59.
 */
export function datedSlotLabel(slot: unknown, birthDate: unknown): string | undefined {
  const definition = SLOTS.find((value) => value.value === slot);
  if (!definition || typeof birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return;
  const solarMidnight = Date.parse(`${birthDate}T00:00:00Z`);
  if (!Number.isFinite(solarMidnight) || new Date(solarMidnight).toISOString().slice(0, 10) !== birthDate) return;
  const longitudeMinutes = Math.round(DEFAULT_SAJU_TIME_POLICY.longitude * 4);
  try {
    const shiftAt = (solarMinute: number) => Math.round(utcOffsetMinutesAt(solarMidnight + (solarMinute - longitudeMinutes) * 60_000, DEFAULT_SAJU_TIME_POLICY.zone)) - longitudeMinutes;
    return slotLabel(definition, shiftAt(definition.startMinute), shiftAt(definition.endMinute - 1));
  } catch { return; }
}
/** 입력 화면 선택지(운영 Q 8-2): 생년월일을 넣으면 그날 시계 기준 라벨, 넣기 전에는 지금 시계(UTC+9) 라벨. */
export function birthTimeSlotOptions(birthDate: unknown): readonly ((typeof BIRTH_TIME_SLOT_DEFINITIONS)[number])[] {
  return BIRTH_TIME_SLOT_DEFINITIONS.map((slot) => ({ ...slot, labelKo: datedSlotLabel(slot.value, birthDate) ?? slot.labelKo }));
}
// Stored reports keep the label they were computed with: saju-calendar-kst-v2 slots were civil KST hours.
// birthDate(운영 Q 8-2): 새 책·확인 화면은 생년월일의 당시 시계 기준 라벨(datedSlotLabel). 없으면 지금 시계(UTC+9) 라벨.
export function birthTimeSlotLabel(slot: unknown, calendarVersion: unknown, birthDate?: unknown): string | undefined {
  const definition = SLOTS.find((value) => value.value === slot);
  if (!definition) return;
  return calendarVersion === SAJU_CALENDAR_VERSION ? datedSlotLabel(slot, birthDate) ?? slotLabel(definition) : slotLabel(definition, 0);
}
export type ApproximateBirthTimeSlot = (typeof BIRTH_TIME_SLOT_DEFINITIONS)[number]["value"];
export type BirthTimePrecision = "exact" | "approximate" | "unknown";
export type BirthTimeInput = {
  birthTime?: unknown;
  birthTimeUnknown?: unknown;
  approximateBirthTimeSlot?: unknown;
  birthTimePrecision?: unknown;
  // Degrees east. Absent: DEFAULT_SAJU_TIME_POLICY.longitude.
  birthLongitude?: unknown;
};
export function normalizeBirthTimePrecision(input: BirthTimeInput) {
  const time = typeof input.birthTime === "string" ? input.birthTime.trim() : "";
  const slot = input.approximateBirthTimeSlot ?? "";
  const unknown = input.birthTimeUnknown === true;
  const definition = BIRTH_TIME_SLOT_DEFINITIONS.find((value) => value.value === slot);
  if ((input.birthTime != null && typeof input.birthTime !== "string") ||
      (input.birthTimeUnknown != null && typeof input.birthTimeUnknown !== "boolean") ||
      (slot !== "" && !definition)) return { ok: false as const };
  const precision: BirthTimePrecision = unknown ? "unknown" : definition ? "approximate" : "exact";
  if ((input.birthTimePrecision !== undefined && input.birthTimePrecision !== precision) ||
      (unknown && (time !== "" || slot !== "")) ||
      (precision === "approximate" && time !== "") ||
      (precision === "exact" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) return { ok: false as const };
  return { ok: true as const, precision, time, slot: definition?.value ?? ("" as const) };
}
export const PILLAR_KEYS = ["year", "month", "day", "hour"] as const;
export type PillarKey = (typeof PILLAR_KEYS)[number];
export type BirthTimeCalculationContext = {
  calendarVersion: SajuCalendarVersion;
  birthTimePrecision: BirthTimePrecision;
  birthDate: string;
  approximateBirthTimeSlot?: ApproximateBirthTimeSlot;
  range: { startKst: string; endKstExclusive: string };
  stable: Record<PillarKey, boolean>;
  candidates: Record<PillarKey, readonly Pillar[]>;
  confirmed: Partial<Record<PillarKey, Pillar>>;
  // v5-lmt only. Absent on legacy (saju-calendar-kst-v2) snapshots.
  timeBasis?: BirthTimeBasis;
};
export type BirthTimeBasis = {
  calcVersion: typeof SAJU_CALC_VERSION_ID;
  zone: "Asia/Seoul";
  // Civil input as typed: YYYY-MM-DDTHH:mm for exact, YYYY-MM-DD otherwise.
  civilDateTime: string;
  utcOffsetMinutes: number;
  ambiguous: boolean;
  nonexistent: boolean;
  longitude: number;
  longitudeSource: LongitudeSource;
  equationOfTime: boolean;
  ziHourRule: ZiHourRule;
  // Solar time minus civil time at the range start (negative = clock ahead of the sun).
  solarTimeCorrectionMinutes: number;
  slotBasis: "local_mean_solar" | "apparent_solar";
};
export type BirthTimeContexts = Partial<Record<"person" | "personA" | "personB", BirthTimeCalculationContext>>;
export function withBirthTimeEvidence<T>(packet: T, contexts: BirthTimeContexts) {
  return {
    ...packet,
    calendarVersion: SAJU_CALENDAR_VERSION,
    birthTimePrecision: contexts.person?.birthTimePrecision ?? {
      personA: contexts.personA?.birthTimePrecision, personB: contexts.personB?.birthTimePrecision,
    },
    birthTimeContexts: contexts,
  };
}
// The typed civil time of an exact context. v5-lmt keeps it in timeBasis (the range is an absolute
// instant, which differs from the civil clock in UTC+8:30 and summer-time periods).
export function contextMatchesExactTime(context: Pick<BirthTimeCalculationContext, "range" | "timeBasis">, birthDate: string, time: string): boolean {
  return context.timeBasis
    ? context.timeBasis.civilDateTime === `${birthDate}T${time}`
    : context.range.startKst.startsWith(`${birthDate}T${time}:`);
}
// One customer-facing line next to the 만세력 table. Legacy snapshots and unknown birth times get none.
export function solarTimeCorrectionNote(context: unknown): string | undefined {
  if (context === null || typeof context !== "object") return;
  const { timeBasis: basis, birthTimePrecision } = context as Partial<BirthTimeCalculationContext>;
  if (!basis || basis.calcVersion !== SAJU_CALC_VERSION_ID || birthTimePrecision === "unknown" ||
      typeof basis.solarTimeCorrectionMinutes !== "number" || typeof basis.longitude !== "number") return;
  // "태양시 기준 · 30분 보정 (09:30 → 09:00)": typed time and the solar time the pillars use.
  const minutes = Math.round(basis.solarTimeCorrectionMinutes);
  const head = basis.longitudeSource === "birthplace" ? `태양시 기준(출생지 동경 ${basis.longitude}°)` : "태양시 기준";
  const era = basis.utcOffsetMinutes === 570 || basis.utcOffsetMinutes === 600 ? " · 당시 서머타임 반영"
    : basis.utcOffsetMinutes === 510 ? " · 당시 표준시 UTC+8:30 반영" : "";
  const typed = basis.civilDateTime.match(/T(\d{2}):(\d{2})$/);
  // 1954-61 standard time was UTC+8:30, i.e. exactly the 127.5°E meridian.
  if (minutes === 0) return `${head} · 보정 없음${typed ? ` (${typed[1]}:${typed[2]})` : ""}${era}`;
  if (!typed) return `${head} · ${Math.abs(minutes)}분 보정${era}`;
  const from = Number(typed[1]) * 60 + Number(typed[2]), to = from + minutes, day = to < 0 ? "전날 " : to >= 1440 ? "다음 날 " : "";
  const hm = (m: number) => `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String(((m % 60) + 60) % 60).padStart(2, "0")}`;
  return `${head} · ${Math.abs(minutes)}분 보정 (${hm(from)} → ${day}${hm(to)})${era}`;
}
