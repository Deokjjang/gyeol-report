import {
  analyzeFullElements,
  analyzeFullTenGods,
  analyzeVisibleYinYang,
  type PillarSet,
} from "./analyze";
import {
  getDayPillarFromSolarDate,
  getHourPillarFromBirthTime,
  getMonthPillarFromSolarDateTime,
  getYearPillarFromSolarDateTime,
} from "./pillars";
import { analyzeRelations } from "./relations";
import { detectShinsal } from "./shinsal";
import { getLunarJavascriptPillarsFromSolarDateTime } from "./lunarJavascriptPillars";
import { UnsupportedSolarTermYearError } from "./solarTerms";
import { analyzeSajuStructure } from "./structureAnalysis";
import type { SajuCalcInput, SajuCalcResult } from "./types";

const BIRTH_TIME_UNKNOWN_NOTICE =
  "출생시간을 모르면 년·월·일주 중심으로 분석됩니다.";

type FormattableRelation = {
  pair: readonly [string, string];
  positions: readonly [string, string];
};

type SajuCalcResultWithoutStructureAnalysis = Omit<
  SajuCalcResult,
  "structureAnalysis"
>;

function getBirthTimeForSolarTerm(input: SajuCalcInput): string {
  if (input.birthTimeUnknown) {
    return "12:00";
  }

  if (!input.birthTime) {
    throw new Error("Birth time is required when birthTimeUnknown is false.");
  }

  return input.birthTime;
}

function formatRelation(relation: FormattableRelation): string {
  return `${relation.positions[0]}-${relation.positions[1]}:${relation.pair[0]}${relation.pair[1]}`;
}

function getPillarsFromVerifiedTable(
  input: SajuCalcInput,
  birthTimeForSolarTerm: string,
  solarDateTimeKst: string,
): PillarSet {
  const day = getDayPillarFromSolarDate(input.birthDate);
  const hour = input.birthTimeUnknown
    ? undefined
    : getHourPillarFromBirthTime(birthTimeForSolarTerm, day.stem);
  const year = getYearPillarFromSolarDateTime(solarDateTimeKst);
  const month = getMonthPillarFromSolarDateTime(solarDateTimeKst);

  return hour
    ? {
        year,
        month,
        day,
        hour,
      }
    : {
        year,
        month,
        day,
      };
}

function getPillarsWithBroadYearFallback(
  input: SajuCalcInput,
  birthTimeForSolarTerm: string,
  solarDateTimeKst: string,
): PillarSet {
  try {
    return getPillarsFromVerifiedTable(
      input,
      birthTimeForSolarTerm,
      solarDateTimeKst,
    );
  } catch (error) {
    if (!(error instanceof UnsupportedSolarTermYearError)) {
      throw error;
    }

    const pillars = getLunarJavascriptPillarsFromSolarDateTime(solarDateTimeKst);

    return input.birthTimeUnknown
      ? {
          year: pillars.year,
          month: pillars.month,
          day: pillars.day,
        }
      : pillars;
  }
}

export function calculateSaju(input: SajuCalcInput): SajuCalcResult {
  const timezone = input.timezone as string;

  if (timezone !== "Asia/Seoul") {
    throw new Error("Only Asia/Seoul timezone is supported.");
  }

  if (input.calendarType === "LUNAR") {
    throw new Error("Lunar calendar conversion is not supported in V1.");
  }

  const notices: string[] = [];
  const birthTimeForSolarTerm = getBirthTimeForSolarTerm(input);
  const solarDateTimeKst = `${input.birthDate}T${birthTimeForSolarTerm}:00+09:00`;
  const pillars = getPillarsWithBroadYearFallback(
    input,
    birthTimeForSolarTerm,
    solarDateTimeKst,
  );
  const elements = analyzeFullElements(pillars);
  const tenGods = analyzeFullTenGods(pillars);
  const yinYang = analyzeVisibleYinYang(pillars);
  const relationAnalysis = analyzeRelations(pillars);
  const shinsal = detectShinsal(pillars);

  if (input.birthTimeUnknown) {
    notices.push(BIRTH_TIME_UNKNOWN_NOTICE);
  }

  const baseResult: SajuCalcResultWithoutStructureAnalysis = {
    input,
    converted: {
      solarDate: input.birthDate,
      ...(typeof input.isLeapMonth === "boolean"
        ? { isLeapMonth: input.isLeapMonth }
        : {}),
    },
    pillars,
    dayMaster: pillars.day.stem,
    tenGods,
    elements,
    yinYang,
    relations: {
      stemCombinations: relationAnalysis.stemCombinations.map(formatRelation),
      branchCombinations:
        relationAnalysis.branchCombinations.map(formatRelation),
      branchClashes: relationAnalysis.branchClashes.map(formatRelation),
    },
    shinsal,
    notices,
  };
  const structureAnalysis = analyzeSajuStructure(baseResult);

  return {
    ...baseResult,
    structureAnalysis,
  };
}
