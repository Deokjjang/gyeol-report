import { SAJU_CALENDAR_VERSION } from "./calendarVersion";
import type { Pillar } from "./types";

// Client-safe input SSOT. 子 belongs to the date on which the slot ends.
export const BIRTH_TIME_SLOT_DEFINITIONS = [
  { value: "JASI", labelKo: "자시 전날 23:00~당일 00:59", startMinute: -60, endMinute: 60 },
  { value: "CHUKSI", labelKo: "축시 01:00~02:59", startMinute: 60, endMinute: 180 },
  { value: "INSI", labelKo: "인시 03:00~04:59", startMinute: 180, endMinute: 300 },
  { value: "MYOSI", labelKo: "묘시 05:00~06:59", startMinute: 300, endMinute: 420 },
  { value: "JINSI", labelKo: "진시 07:00~08:59", startMinute: 420, endMinute: 540 },
  { value: "SASI", labelKo: "사시 09:00~10:59", startMinute: 540, endMinute: 660 },
  { value: "OSI", labelKo: "오시 11:00~12:59", startMinute: 660, endMinute: 780 },
  { value: "MISI", labelKo: "미시 13:00~14:59", startMinute: 780, endMinute: 900 },
  { value: "SINSI", labelKo: "신시 15:00~16:59", startMinute: 900, endMinute: 1020 },
  { value: "YUSI", labelKo: "유시 17:00~18:59", startMinute: 1020, endMinute: 1140 },
  { value: "SULSI", labelKo: "술시 19:00~20:59", startMinute: 1140, endMinute: 1260 },
  { value: "HAESI", labelKo: "해시 21:00~22:59", startMinute: 1260, endMinute: 1380 },
] as const;
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
  calendarVersion: typeof SAJU_CALENDAR_VERSION;
  birthTimePrecision: BirthTimePrecision;
  birthDate: string;
  approximateBirthTimeSlot?: ApproximateBirthTimeSlot;
  range: { startKst: string; endKstExclusive: string };
  stable: Record<PillarKey, boolean>;
  candidates: Record<PillarKey, readonly Pillar[]>;
  confirmed: Partial<Record<PillarKey, Pillar>>;
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
