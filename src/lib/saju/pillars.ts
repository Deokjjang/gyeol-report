import { SEXAGENARY_CYCLE } from "./constants";
import type { Pillar } from "./types";

const DAY_PILLAR_EPOCH_DATE = "1984-02-02";
const DAY_PILLAR_EPOCH_INDEX = 0;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ParsedDate = {
  year: number;
  month: number;
  day: number;
};

function parseIsoDateStrict(value: string): ParsedDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Invalid calendar date.");
  }

  return { year, month, day };
}

function toUtcDateMs(date: ParsedDate): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

export function getDayPillarFromSolarDate(solarDate: string): Pillar {
  const epochMs = toUtcDateMs(parseIsoDateStrict(DAY_PILLAR_EPOCH_DATE));
  const targetMs = toUtcDateMs(parseIsoDateStrict(solarDate));
  const daysDiff = Math.round((targetMs - epochMs) / MS_PER_DAY);
  const cycleIndex = positiveModulo(
    DAY_PILLAR_EPOCH_INDEX + daysDiff,
    SEXAGENARY_CYCLE.length,
  );
  const pillar = SEXAGENARY_CYCLE[cycleIndex];

  if (!pillar) {
    throw new Error("Failed to resolve day pillar.");
  }

  return pillar;
}
