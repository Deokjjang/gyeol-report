/**
 * 세운·월운 기둥. 절기 계산은 기존 어댑터를 그대로 쓴다(새 천문 계산 없음).
 * 세운 = 立春 기준 해 기둥, 월운 = 그 사주 해의 寅월~丑월 12절월.
 */
import { getAnnualJieBoundaries } from "../../report-knowledge/annualMonthJie";
import { getYearPillarFromSolarDateTime } from "../pillars";
import type { EarthlyBranch, Pillar } from "../types";

/** 사주 해 year(立春~다음 立春)의 세운 기둥. 6월 중순은 늘 立春 뒤라 그 시점의 년주를 쓴다. */
export function getAnnualPillar(year: number): Pillar {
  return getYearPillarFromSolarDateTime(`${String(year).padStart(4, "0")}-06-15T12:00:00+09:00`);
}

export type MonthlyPillar = { readonly index: number; readonly branch: EarthlyBranch; readonly pillar: Pillar; readonly startKst: string };

/** 사주 해 year의 12절월(index 1=寅월 … 12=丑월). 丑월은 다음 양력해 小寒에서 시작한다. */
export function getMonthlyPillars(year: number): MonthlyPillar[] {
  const current = getAnnualJieBoundaries(year).filter((j) => j.afterMonth.branch !== "丑");
  const nextChou = getAnnualJieBoundaries(year + 1).find((j) => j.afterMonth.branch === "丑");
  const all = nextChou ? [...current, nextChou] : current;
  if (all.length !== 12) throw new Error(`monthly pillars unavailable for ${year}`);
  return all.map((j, i) => ({ index: i + 1, branch: j.afterMonth.branch, pillar: { stem: j.afterMonth.stem, branch: j.afterMonth.branch }, startKst: j.instantKst }));
}
