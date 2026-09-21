import {
  analyzeFullElements,
  analyzeFullTenGods,
  analyzeVisibleYinYang,
} from "./analyze";
import { analyzeRelations } from "./relations";
import { detectShinsal } from "./shinsal";
import { resolveBirthTimeCalculation, UncertainBirthTimeError } from "./birthTimePrecision";
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

function formatRelation(relation: FormattableRelation): string {
  return `${relation.positions[0]}-${relation.positions[1]}:${relation.pair[0]}${relation.pair[1]}`;
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
  const calendar = resolveBirthTimeCalculation(input);
  const { year, month, day, hour } = calendar.confirmed;
  if (!year || !month || !day) throw new UncertainBirthTimeError(calendar);
  const pillars = { year, month, day, ...(hour ? { hour } : {}) };
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
    calculationVersion: calendar.calendarVersion,
    birthTimeContext: calendar,
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
