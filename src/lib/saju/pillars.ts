import {
  BRANCH_INDEX,
  HEAVENLY_STEMS,
  HOUR_BRANCH_RANGES,
  HOUR_STEM_START_BY_DAY_STEM,
  MONTH_BRANCHES_BY_SOLAR_TERM,
  MONTH_STEM_START_BY_YEAR_STEM,
  SEXAGENARY_CYCLE,
  STEM_INDEX,
} from "./constants";
import {
  getActiveSolarTermBoundary,
  isBeforeIpchun,
} from "./solarTerms";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "./types";

const DAY_PILLAR_EPOCH_DATE = "1984-02-02";
const DAY_PILLAR_EPOCH_INDEX = 0;
const YEAR_PILLAR_REFERENCE_YEAR = 1984;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const KST_DATE_TIME_FORMAT_ERROR =
  "Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.";

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

function getKstYear(solarDateTimeKst: string): number {
  const match = /^(\d{4})-/.exec(solarDateTimeKst);

  if (!match) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  return Number(match[1]);
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

export function getYearPillarFromSolarDateTime(
  solarDateTimeKst: string,
): Pillar {
  const inputYear = getKstYear(solarDateTimeKst);
  const sajuYear = isBeforeIpchun(solarDateTimeKst)
    ? inputYear - 1
    : inputYear;
  const cycleIndex = positiveModulo(
    sajuYear - YEAR_PILLAR_REFERENCE_YEAR,
    SEXAGENARY_CYCLE.length,
  );
  const pillar = SEXAGENARY_CYCLE[cycleIndex];

  if (!pillar) {
    throw new Error("Failed to resolve year pillar.");
  }

  return pillar;
}

export function getMonthPillarFromSolarDateTime(
  solarDateTimeKst: string,
): Pillar {
  const activeBoundary = getActiveSolarTermBoundary(solarDateTimeKst);
  const monthBranch: EarthlyBranch = activeBoundary.monthBranch;
  const monthIndex = MONTH_BRANCHES_BY_SOLAR_TERM.indexOf(monthBranch);

  if (monthIndex < 0) {
    throw new Error("Failed to resolve month branch index.");
  }

  const yearPillar = getYearPillarFromSolarDateTime(solarDateTimeKst);
  const yearStem: HeavenlyStem = yearPillar.stem;
  const startStem = MONTH_STEM_START_BY_YEAR_STEM[yearStem];
  const startStemIndex = STEM_INDEX[startStem];
  const monthStem = HEAVENLY_STEMS[
    (startStemIndex + monthIndex) % HEAVENLY_STEMS.length
  ];

  if (!monthStem) {
    throw new Error("Failed to resolve month stem.");
  }

  return {
    stem: monthStem,
    branch: monthBranch,
  };
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
