import { createSajuCalendarContext } from "../saju/lunarJavascriptPillars";
import { getSolarTermInstants } from "../saju/solarTerms";
import { SAJU_CALENDAR_VERSION } from "../saju/calendarVersion";
import { formatDayunKst, type CustomerDayun, type CustomerDayunCycle, type DayunTimeRange } from "../saju/customerDayun";
import { buildAnnualMonthRelationFacts, type AnnualMonthRelationFact } from "./annualMonthRelationFacts";
import { getBranchPairRelations, getBranchElement, getStemElement, getTenGodForStemPair } from "./annualFortuneYearRules";
import type { AnnualBranchInteractionType, EarthlyBranch, FiveElement, HeavenlyStem, TenGod } from "./annualFortuneTypes";

export const ANNUAL_MONTH_CALCULATION_VERSION = "annual-month-jie-kst-v2" as const;
const jieByBranch: Record<EarthlyBranch, string> = { 丑: "소한", 寅: "입춘", 卯: "경칩", 辰: "청명", 巳: "입하", 午: "망종", 未: "소서", 申: "입추", 酉: "백로", 戌: "한로", 亥: "입동", 子: "대설" };
// Same main-hidden-stem convention as annualFortuneEvidence (not all hidden stems).
const mainStem: Record<EarthlyBranch, HeavenlyStem> = { 子: "癸", 丑: "己", 寅: "甲", 卯: "乙", 辰: "戊", 巳: "丙", 午: "丁", 未: "己", 申: "庚", 酉: "辛", 戌: "戊", 亥: "壬" };
type Pillar = { stem: HeavenlyStem; branch: EarthlyBranch };
export type MonthDayunContext = {
  status: "active" | "before_first_cycle" | "transition_uncertain";
  cycles: readonly Pick<CustomerDayunCycle, "index" | "ganji">[];
  includesBeforeFirstCycle: boolean;
  transitionRange: DayunTimeRange | null;
};
export type AnnualJieRelationFact = (AnnualMonthRelationFact & { certainty: "confirmed" }) | {
  id: string;
  source: "month_annual_branch" | "month_dayun_branch";
  type: AnnualBranchInteractionType;
  participants: readonly EarthlyBranch[];
  monthBranch: EarthlyBranch;
  counterpart: { scope: "annual"; pillar: string } | { scope: "dayun"; cycleIndex: number; pillar: string };
  certainty: "confirmed" | "conditional";
};
export type AnnualMonthSegment = {
  startKst: string;
  endKstExclusive: string;
  boundaryReason: readonly string[];
  monthPillar: Pillar;
  effectiveAnnualPillar: Pillar;
  activeDayunContext: MonthDayunContext;
  stemTenGod: TenGod;
  branchTenGod: TenGod;
  elements: readonly FiveElement[];
  relationFacts: readonly AnnualJieRelationFact[];
  evidenceIds: readonly string[];
  uncertainty: readonly { kind: "dayun_transition"; range: DayunTimeRange }[];
};
export type AnnualCalendarMonth = {
  month: number;
  startKst: string;
  endKstExclusive: string;
  segments: readonly AnnualMonthSegment[];
  importanceCandidates: readonly {
    kind: "transition" | "natal_interaction" | "annual_interaction" | "dayun_interaction" | "ten_god_shift" | "element_effect";
    evidenceIds: readonly string[];
  }[];
};
export type AnnualMonthCalendarInput = {
  selectedYear: number;
  dayMaster: HeavenlyStem;
  natalBranches: readonly EarthlyBranch[];
  missingElements: readonly FiveElement[];
  heavyElements: readonly FiveElement[];
  customerDayun: CustomerDayun;
};

export const monthPillarText = (p: Pillar): string => p.stem + p.branch;
const monthStart = (year: number, month: number): string => `${year}-${String(month).padStart(2, "0")}-01T00:00:00+09:00`;

// Use canonical month changes to select Jie from the existing 24-term adapter.
// No new ephemeris, host-local Date getters, or raw UTC+8 Solar inputs here.
export function getAnnualJieBoundaries(year: number) {
  const start = monthStart(year, 1), end = monthStart(year + 1, 1);
  return getSolarTermInstants(start, end)
    .filter(t => t >= Date.parse(start) && t < Date.parse(end))
    .flatMap(t => {
      const before = createSajuCalendarContext(formatDayunKst(t - 1000));
      const after = createSajuCalendarContext(formatDayunKst(t));
      return monthPillarText(before.pillars.month) === monthPillarText(after.pillars.month) ? [] : [{
        instantKst: formatDayunKst(t), name: jieByBranch[after.pillars.month.branch],
        beforeMonth: before.pillars.month, afterMonth: after.pillars.month,
        beforeYear: before.pillars.year, afterYear: after.pillars.year,
      }];
    });
}

function activeDayun(basis: CustomerDayun, instant: number): MonthDayunContext {
  let previous: CustomerDayunCycle | undefined;
  for (const cycle of basis.cycles) {
    const range = cycle.startSolarRange;
    if (instant < Date.parse(range.earliestKst)) break;
    if (instant < Date.parse(range.latestKst)) return {
      status: "transition_uncertain", cycles: [previous, cycle].filter((c): c is CustomerDayunCycle => c !== undefined)
        .map(({ index, ganji }) => ({ index, ganji })),
      includesBeforeFirstCycle: previous === undefined, transitionRange: range,
    };
    previous = cycle;
  }
  return { status: previous ? "active" : "before_first_cycle",
    cycles: previous ? [{ index: previous.index, ganji: previous.ganji }] : [],
    includesBeforeFirstCycle: !previous, transitionRange: null };
}

function segmentFacts(input: AnnualMonthCalendarInput, segment: Pick<AnnualMonthSegment, "monthPillar" | "effectiveAnnualPillar" | "activeDayunContext">, month: number, prefix: string): AnnualJieRelationFact[] {
  const p = segment.monthPillar;
  const natal = buildAnnualMonthRelationFacts({ ...input, monthGanji: {
    year: input.selectedYear, month, label: `${month}월`, ganji: monthPillarText(p), ...p,
    stemElement: getStemElement(p.stem), branchElement: getBranchElement(p.branch),
    elementSummary: "", basis: "solar_term_exact",
  } }).map(f => ({ ...f, id: `${prefix}:${f.id}`, certainty: "confirmed" as const }));
  const counterparts: { source: "month_annual_branch" | "month_dayun_branch"; value: string; counterpart: Extract<AnnualJieRelationFact, { counterpart: unknown }>["counterpart"]; certainty: "confirmed" | "conditional" }[] = [{
    source: "month_annual_branch", value: monthPillarText(segment.effectiveAnnualPillar),
    counterpart: { scope: "annual", pillar: monthPillarText(segment.effectiveAnnualPillar) }, certainty: "confirmed",
  }, ...segment.activeDayunContext.cycles.map(c => ({
    source: "month_dayun_branch" as const, value: c.ganji,
    counterpart: { scope: "dayun" as const, cycleIndex: c.index, pillar: c.ganji },
    certainty: segment.activeDayunContext.status === "transition_uncertain" ? "conditional" as const : "confirmed" as const,
  }))];
  return [...natal, ...counterparts.flatMap(c => getBranchPairRelations(p.branch, c.value[1] as EarthlyBranch).map(f => ({
    id: `${prefix}:${c.source}:${c.counterpart.scope === "dayun" ? c.counterpart.cycleIndex : c.value}:${f.type}:${f.branches.join("")}`,
    source: c.source, type: f.type, participants: f.branches, monthBranch: p.branch,
    counterpart: c.counterpart, certainty: c.certainty,
  })))];
}

export function buildAnnualMonthCalendar(input: AnnualMonthCalendarInput): readonly AnnualCalendarMonth[] {
  if (!Number.isInteger(input.selectedYear) || input.selectedYear < 1 || input.selectedYear > 9998 ||
      input.customerDayun.calendarVersion !== SAJU_CALENDAR_VERSION || !input.customerDayun.cycles.length) return [];
  const jie = getAnnualJieBoundaries(input.selectedYear);
  if (jie.length !== 12) return [];
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1, startKst = monthStart(input.selectedYear, month);
    const endKstExclusive = monthStart(month === 12 ? input.selectedYear + 1 : input.selectedYear, month === 12 ? 1 : month + 1);
    const start = Date.parse(startKst), end = Date.parse(endKstExclusive);
    const boundaries = new Map<number, string[]>([[start, ["calendar_month_start"]], [end, []]]);
    const add = (instant: string, reason: string) => {
      const t = Date.parse(instant);
      if (t < start || t >= end) return;
      boundaries.set(t, [...(boundaries.get(t) ?? []), reason]);
    };
    jie.forEach(j => add(j.instantKst, `jie:${j.name}`));
    input.customerDayun.cycles.forEach(c => {
      const r = c.startSolarRange;
      if (r.earliestKst === r.latestKst) add(r.earliestKst, "dayun_transition");
      else { add(r.earliestKst, "dayun_uncertainty_start"); add(r.latestKst, "dayun_uncertainty_end"); }
    });
    const times = [...boundaries.keys()].sort((a, b) => a - b);
    const segments = times.slice(0, -1).map((t, i): AnnualMonthSegment => {
      const prefix = `month-v2:${input.selectedYear}:${month}:${i + 1}`;
      const { pillars } = createSajuCalendarContext(formatDayunKst(t));
      const activeDayunContext = activeDayun(input.customerDayun, t);
      const base = { monthPillar: pillars.month, effectiveAnnualPillar: pillars.year, activeDayunContext };
      const relationFacts = segmentFacts(input, base, month, prefix);
      return {
        ...base, startKst: formatDayunKst(t), endKstExclusive: formatDayunKst(times[i + 1]), boundaryReason: boundaries.get(t) ?? [],
        stemTenGod: getTenGodForStemPair(input.dayMaster, pillars.month.stem),
        branchTenGod: getTenGodForStemPair(input.dayMaster, mainStem[pillars.month.branch]),
        elements: [...new Set([getStemElement(pillars.month.stem), getBranchElement(pillars.month.branch)])],
        relationFacts, evidenceIds: ["month", "annual", "dayun", "ten_gods", "elements"].map(k => `${prefix}:${k}`).concat(relationFacts.map(f => f.id)),
        uncertainty: activeDayunContext.transitionRange ? [{ kind: "dayun_transition", range: activeDayunContext.transitionRange }] : [],
      };
    });
    const importanceCandidates: AnnualCalendarMonth["importanceCandidates"][number][] = [];
    segments.forEach((s, i) => {
      if (s.boundaryReason.some(r => r.startsWith("dayun")) || s.uncertainty.length) importanceCandidates.push({ kind: "transition", evidenceIds: [s.evidenceIds[2]] });
      if (i && (s.stemTenGod !== segments[i - 1].stemTenGod || s.branchTenGod !== segments[i - 1].branchTenGod)) importanceCandidates.push({ kind: "ten_god_shift", evidenceIds: [segments[i - 1].evidenceIds[3], s.evidenceIds[3]] });
      for (const f of s.relationFacts) importanceCandidates.push({ kind: f.source === "month_natal_branch" ? "natal_interaction" : f.source === "month_annual_branch" ? "annual_interaction" : f.source === "month_dayun_branch" ? "dayun_interaction" : "element_effect", evidenceIds: [f.id] });
    });
    return { month, startKst, endKstExclusive, segments, importanceCandidates };
  });
}
