import { createRequire } from "node:module";

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
} from "./constants";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "./types";

const KST_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+09:00$/;
const KST_DATE_TIME_FORMAT_ERROR =
  "Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.";
const LUNAR_JAVASCRIPT_MIN_SOLAR_YEAR = 1;
const LUNAR_JAVASCRIPT_MAX_SOLAR_YEAR = 9999;

type ParsedKstDateTime = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
};

type SolarFactory = {
  readonly fromYmdHms: (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
  ) => unknown;
};

type LunarJavascriptModule = {
  readonly Solar: SolarFactory;
};

type SolarLike = {
  readonly getLunar: () => unknown;
};

type LunarLike = {
  readonly getEightChar: () => unknown;
};

type EightCharLike = {
  readonly getYear: () => unknown;
  readonly getMonth: () => unknown;
};

const nodeRequire = createRequire(import.meta.url);
const lunarJavascriptModule: unknown = nodeRequire("lunar-javascript");

function hasFunctionProperty<Key extends string>(
  value: unknown,
  key: Key,
): value is Record<Key, (...args: unknown[]) => unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record[key] === "function";
}

function isLunarJavascriptModule(
  value: unknown,
): value is LunarJavascriptModule {
  if (
    typeof value !== "object" ||
    value === null ||
    !("Solar" in value) ||
    typeof value.Solar !== "object" ||
    value.Solar === null
  ) {
    return false;
  }

  return hasFunctionProperty(value.Solar, "fromYmdHms");
}

function isSolarLike(value: unknown): value is SolarLike {
  return hasFunctionProperty(value, "getLunar");
}

function isLunarLike(value: unknown): value is LunarLike {
  return hasFunctionProperty(value, "getEightChar");
}

function isEightCharLike(value: unknown): value is EightCharLike {
  return (
    hasFunctionProperty(value, "getYear") &&
    hasFunctionProperty(value, "getMonth")
  );
}

function isHeavenlyStem(value: string): value is HeavenlyStem {
  return (HEAVENLY_STEMS as readonly string[]).includes(value);
}

function isEarthlyBranch(value: string): value is EarthlyBranch {
  return (EARTHLY_BRANCHES as readonly string[]).includes(value);
}

function parseKstDateTime(value: string): ParsedKstDateTime {
  const match = KST_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue] =
    match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const second = Number(secondValue);

  if (hour > 23 || minute > 59 || second > 59) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  if (
    year < LUNAR_JAVASCRIPT_MIN_SOLAR_YEAR ||
    year > LUNAR_JAVASCRIPT_MAX_SOLAR_YEAR
  ) {
    throw new UnsupportedSolarTermYearError(year);
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
}

function parsePillar(value: unknown): Pillar {
  if (typeof value !== "string" || Array.from(value).length !== 2) {
    throw new Error("Invalid lunar-javascript pillar output.");
  }

  const [stemValue, branchValue] = Array.from(value);

  if (
    stemValue === undefined ||
    branchValue === undefined ||
    !isHeavenlyStem(stemValue) ||
    !isEarthlyBranch(branchValue)
  ) {
    throw new Error("Invalid lunar-javascript pillar output.");
  }

  return {
    stem: stemValue,
    branch: branchValue,
  };
}

function getSolarFactory(): SolarFactory {
  if (!isLunarJavascriptModule(lunarJavascriptModule)) {
    throw new Error("lunar-javascript Solar factory is not available.");
  }

  return lunarJavascriptModule.Solar;
}

// The library expresses JieQi in fixed UTC+8 civil coordinates (lunar.js qiAccurate).
// Only this comparison coordinate is shifted; the customer's KST date/time is retained.
export function getSolarTermContext(solarDateTimeKst: string) {
  const parsed = parseKstDateTime(solarDateTimeKst);
  const comparison = new Date(Date.parse(solarDateTimeKst) + 8 * 60 * 60 * 1000);
  try {
    const solar = getSolarFactory().fromYmdHms(
      comparison.getUTCFullYear(),
      comparison.getUTCMonth() + 1,
      comparison.getUTCDate(),
      comparison.getUTCHours(),
      comparison.getUTCMinutes(),
      comparison.getUTCSeconds(),
    );
    if (!isSolarLike(solar)) {
      throw new Error("Invalid calendar result.");
    }
    const lunar = solar.getLunar();
    if (!isLunarLike(lunar)) {
      throw new Error("Invalid calendar result.");
    }
    const eightChar = lunar.getEightChar();
    if (!isEightCharLike(eightChar)) {
      throw new Error("Invalid calendar result.");
    }
    return {
      comparisonDateTimeUtc8: comparison.toISOString().slice(0, 19) + "+08:00",
      year: parsePillar(eightChar.getYear()),
      month: parsePillar(eightChar.getMonth()),
    };
  } catch {
    throw new UnsupportedSolarTermYearError(parsed.year);
  }
}

export class UnsupportedSolarTermYearError extends Error {
  constructor(readonly year: number) {
    super(`Solar term data for year ${year} is not available.`);
    this.name = "UnsupportedSolarTermYearError";
  }
}

// Read all term events (including non-Jie terms, harmless extra checkpoints).
// Raw library objects stay inside this adapter; callers receive absolute instants.
export function getSolarTermInstants(startKst: string, endKst: string): readonly number[] {
  const instants = new Set<number>();
  for (const value of [startKst, endKst]) {
    parseKstDateTime(value);
    const civil = new Date(Date.parse(value) + 8 * 60 * 60 * 1000);
    const solar = getSolarFactory().fromYmdHms(civil.getUTCFullYear(), civil.getUTCMonth() + 1,
      civil.getUTCDate(), civil.getUTCHours(), civil.getUTCMinutes(), civil.getUTCSeconds());
    if (!isSolarLike(solar)) throw new Error("Invalid calendar result.");
    const lunar = solar.getLunar();
    if (!hasFunctionProperty(lunar, "getJieQiTable")) throw new Error("Calendar events unavailable.");
    const table = lunar.getJieQiTable();
    if (typeof table !== "object" || table === null) throw new Error("Calendar events unavailable.");
    for (const term of Object.values(table)) {
      if (!hasFunctionProperty(term, "toYmdHms")) throw new Error("Invalid calendar event.");
      const date = term.toYmdHms();
      if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
        throw new Error("Invalid calendar event.");
      }
      const instant = Date.parse(date.replace(" ", "T") + "+08:00");
      if (!Number.isFinite(instant)) throw new Error("Invalid calendar event.");
      instants.add(instant);
    }
  }
  return [...instants].sort((a, b) => a - b);
}
