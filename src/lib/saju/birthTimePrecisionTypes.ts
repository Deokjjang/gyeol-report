import { SAJU_CALENDAR_VERSION, type SajuCalendarVersion } from "./calendarVersion";
import { DEFAULT_SAJU_TIME_POLICY, type ZiHourRule } from "./calcPolicy";
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
// Labels show today's Seoul civil clock (UTC+9) for each solar 시진: Seoul solar time runs ~32 minutes behind.
export const SLOT_LABEL_CIVIL_SHIFT_MINUTES = 540 - Math.round(DEFAULT_SAJU_TIME_POLICY.longitude * 4);
const clock = (minute: number) => {
  const m = ((minute % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
function slotLabel(slot: (typeof SLOTS)[number], shift = SLOT_LABEL_CIVIL_SHIFT_MINUTES): string {
  const start = slot.startMinute + shift;
  const end = slot.endMinute + shift - 1;
  return `${slot.nameKo} ${start < 0 ? "전날 " : ""}${clock(start)}~${start < 0 ? "당일 " : ""}${clock(end)}`;
}
export const BIRTH_TIME_SLOT_DEFINITIONS = SLOTS.map((slot) => ({ ...slot, labelKo: slotLabel(slot) }));
// Stored reports keep the label they were computed with: saju-calendar-kst-v2 slots were civil KST hours.
export function birthTimeSlotLabel(slot: unknown, calendarVersion: unknown): string | undefined {
  const definition = SLOTS.find((value) => value.value === slot);
  if (!definition) return;
  return calendarVersion === SAJU_CALENDAR_VERSION ? slotLabel(definition) : slotLabel(definition, 0);
}
export type ApproximateBirthTimeSlot = (typeof BIRTH_TIME_SLOT_DEFINITIONS)[number]["value"];
export type BirthTimePrecision = "exact" | "approximate" | "unknown";
export type BirthTimeInput = {
  birthTime?: unknown;
  birthTimeUnknown?: unknown;
  approximateBirthTimeSlot?: unknown;
  birthTimePrecision?: unknown;
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
  calcVersion: "v5-lmt";
  zone: "Asia/Seoul";
  // Civil input as typed: YYYY-MM-DDTHH:mm for exact, YYYY-MM-DD otherwise.
  civilDateTime: string;
  utcOffsetMinutes: number;
  ambiguous: boolean;
  nonexistent: boolean;
  longitude: number;
  longitudeSource: "default-seoul";
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
  if (!basis || basis.calcVersion !== "v5-lmt" || birthTimePrecision === "unknown" || typeof basis.solarTimeCorrectionMinutes !== "number") return;
  const minutes = Math.round(basis.solarTimeCorrectionMinutes);
  const era = basis.utcOffsetMinutes === 570 || basis.utcOffsetMinutes === 600 ? " (당시 서머타임 반영)"
    : basis.utcOffsetMinutes === 510 ? " (당시 표준시 UTC+8:30 반영)" : "";
  return `출생지 경도 기준 시간 보정 ${minutes > 0 ? "+" : ""}${minutes}분 적용${era}`;
}
