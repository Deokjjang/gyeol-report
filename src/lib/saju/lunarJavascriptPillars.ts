import { createRequire } from "node:module";

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
} from "./constants";
import { UnsupportedSolarTermYearError } from "./solarTerms";
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

export type LunarJavascriptPillarSet = {
  readonly year: Pillar;
  readonly month: Pillar;
  readonly day: Pillar;
  readonly hour: Pillar;
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
  readonly getDay: () => unknown;
  readonly getTime: () => unknown;
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
    hasFunctionProperty(value, "getMonth") &&
    hasFunctionProperty(value, "getDay") &&
    hasFunctionProperty(value, "getTime")
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

export function getLunarJavascriptPillarsFromSolarDateTime(
  solarDateTimeKst: string,
): LunarJavascriptPillarSet {
  const parsed = parseKstDateTime(solarDateTimeKst);

  if (
    parsed.year < LUNAR_JAVASCRIPT_MIN_SOLAR_YEAR ||
    parsed.year > LUNAR_JAVASCRIPT_MAX_SOLAR_YEAR
  ) {
    throw new UnsupportedSolarTermYearError(parsed.year);
  }

  try {
    // Pass normalized KST civil fields to the local calendar engine. Near solar-term
    // boundaries rely on the engine's built-in JieQi precision.
    const solar = getSolarFactory().fromYmdHms(
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.hour,
      parsed.minute,
      parsed.second,
    );

    if (!isSolarLike(solar)) {
      throw new Error("lunar-javascript Solar result is invalid.");
    }

    const lunar = solar.getLunar();

    if (!isLunarLike(lunar)) {
      throw new Error("lunar-javascript Lunar result is invalid.");
    }

    const eightChar = lunar.getEightChar();

    if (!isEightCharLike(eightChar)) {
      throw new Error("lunar-javascript EightChar result is invalid.");
    }

    return {
      year: parsePillar(eightChar.getYear()),
      month: parsePillar(eightChar.getMonth()),
      day: parsePillar(eightChar.getDay()),
      hour: parsePillar(eightChar.getTime()),
    };
  } catch (error) {
    if (error instanceof UnsupportedSolarTermYearError) {
      throw error;
    }

    throw new UnsupportedSolarTermYearError(parsed.year);
  }
}
