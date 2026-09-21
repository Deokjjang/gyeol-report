import {
  BRANCH_INDEX,
  HEAVENLY_STEMS,
  HOUR_BRANCH_RANGES,
  HOUR_STEM_START_BY_DAY_STEM,
  SEXAGENARY_CYCLE,
  STEM_INDEX,
} from "./constants";
import { getSolarTermContext } from "./solarTerms";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "./types";

// HKO 2024 February calendar: 2024-02-04 is 戊戌 (cycle index 34).
// Count KST calendar dates with UTC date arithmetic, never host-local time.
const DAY_PILLAR_EPOCH_DATE = "2024-02-04";
const DAY_PILLAR_EPOCH_INDEX = 34;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ParsedDate = {
  year: number;
  month: number;
  day: number;
};

type ParsedBirthTime = {
  hour: number;
  minute: number;
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

function parseBirthTimeStrict(value: string): ParsedBirthTime {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("Invalid birth time format. Expected HH:mm.");
  }

  const [, hourValue, minuteValue] = match;
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("Invalid birth time format. Expected HH:mm.");
  }

  return { hour, minute };
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

export function getYearPillarFromSolarDateTime(solarDateTimeKst: string): Pillar {
  return getSolarTermContext(solarDateTimeKst).year;
}

export function getMonthPillarFromSolarDateTime(solarDateTimeKst: string): Pillar {
  return getSolarTermContext(solarDateTimeKst).month;
}

export function getHourBranchFromBirthTime(birthTime: string): EarthlyBranch {
  const { hour } = parseBirthTimeStrict(birthTime);
  const range = HOUR_BRANCH_RANGES.find((item) => {
    if (item.branch === "子") {
      return hour === 23 || hour === 0;
    }

    return hour >= item.startHour && hour <= item.endHour;
  });

  if (!range) {
    throw new Error("Failed to resolve hour branch.");
  }

  return range.branch;
}

export function getHourPillarFromBirthTime(
  birthTime: string,
  dayStem: HeavenlyStem,
): Pillar {
  const hourBranch = getHourBranchFromBirthTime(birthTime);
  const hourBranchIndex = BRANCH_INDEX[hourBranch];
  const startStem = HOUR_STEM_START_BY_DAY_STEM[dayStem];
  const startStemIndex = STEM_INDEX[startStem];
  const hourStem = HEAVENLY_STEMS[
    (startStemIndex + hourBranchIndex) % HEAVENLY_STEMS.length
  ];

  if (!hourStem) {
    throw new Error("Failed to resolve hour stem.");
  }

  return {
    stem: hourStem,
    branch: hourBranch,
  };
}
