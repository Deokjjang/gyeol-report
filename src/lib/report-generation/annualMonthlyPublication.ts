import {
  buildAnnualMonthlyFortunes, type AnnualFortuneEvidencePacket,
} from "../report-knowledge/annualFortuneEvidence";
import { summarizeAnnualMonthFacts } from "../report-knowledge/annualMonthRelationFacts";
import type { EarthlyBranch, FiveElement } from "../report-knowledge/annualFortuneTypes";
import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";
import { ANNUAL_MONTH_CALCULATION_VERSION, buildAnnualMonthCalendar } from "../report-knowledge/annualMonthJie";
import { buildAnnualJieMonthlyPublication, monthSegmentPeriod } from "./annualMonthJiePublication";
import { buildAnnualFortuneReading } from "../report-knowledge/annualFortuneReading";

const elementNames: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };

// Monthly factual copy is server-owned, like ganji and pillar tables. The writer
// composes the rest of the report; it cannot reinterpret absence as a relation.
export function buildAnnualMonthlyPublication(packet: AnnualFortuneEvidencePacket): Pick<
  AnnualFortuneReportDraft, "monthlyFlow" | "monthlyHighlights" | "monthlyFlowReading"
> {
  if (packet.monthlyCalculationVersion === ANNUAL_MONTH_CALCULATION_VERSION) {
    const base = buildAnnualJieMonthlyPublication(packet.calendarMonths ?? []);
    if (!packet.annualReading) return base;
    const reading = packet.annualReading;
    return { ...base,
      monthlyFlow: base.monthlyFlow.map((row, i) => ({ ...row, headline: reading.months[i].title,
        body: reading.months[i].segments.map((s, j) => `${monthSegmentPeriod(packet.calendarMonths![i].segments[j])}: ${[s.core,s.balance,...s.scenes].join(" ")}`).join("\n\n"),
        advice: reading.months[i].segments.map((s,j)=>`${monthSegmentPeriod(packet.calendarMonths![i].segments[j])}: ${s.action}`).join("\n"),
      })),
      monthlyHighlights: reading.months.filter(m=>m.tier!=="basic").map(m=>({monthLabel:`${m.month}월`,headline:m.title,
        body:m.reasons.map(r=>r.text).join(" "),actionHint:"해당 월의 기간별 해석에서 실행 기준을 확인할 수 있습니다."})),
    };
  }
  // Unversioned snapshots retain their original approximation contract.
  const monthlyFlow = packet.monthlyFortunes.map(month => ({
    month: month.month, label: month.label, headline: month.monthTheme,
    monthGanji: month.ganji, monthlyBasis: "달력월 기준 운영 가이드",
    elementFocus: month.elements.map(e => elementNames[e]).join("·"),
    natalInteractionSummary: summarizeAnnualMonthFacts(month.relationFacts),
    body: month.interpretation, advice: month.actionHint,
  }));
  const monthlyHighlights = Array.from({ length: 4 }, (_, index) => {
    const months = packet.monthlyFortunes.slice(index * 3, index * 3 + 3);
    const monthLabel = `${index * 3 + 1}~${index * 3 + 3}월`;
    return {
      monthLabel, headline: `${monthLabel} · 월간지와 생활 관점`,
      body: months.map(month => month.interpretation).join(" "),
      actionHint: months.map(month => month.actionHint).join(" "),
    };
  });
  return {
    monthlyFlow, monthlyHighlights,
    monthlyFlowReading: "월별 간지와 십성은 12개월을 읽는 기본 관점입니다. 원국과의 연결·보완 작용과 마찰 작용은 서로 다른 근거로 나누어 봅니다. 같은 달에 함께 나타나더라도 좋은 달이나 나쁜 달로 단정하지 않습니다. 오행의 유입이나 십성만으로 한 달 전체의 유리함을 결정하지 않습니다.",
  };
}

export function buildAnnualReadingPublication(packet: AnnualFortuneEvidencePacket): Partial<AnnualFortuneReportDraft> {
  const r = packet.annualReading;
  if (!r) return {};
  const flow = (index: number) => ({ title:r.domains[index].title, summary:r.domains[index].body,
    supportingSignals:r.domains[index].scenes,frictionSignals:[r.costs],actionHint:r.domains[index].action });
  return { headline:r.headline, coreLine:r.headline,
    selectedYearSummary:[r.gains,r.costs].join(" "),
    majorAnnualCrossReading:[...r.crossPeriods.map(p=>`${p.startKst}~${p.endKstExclusive} 미만: ${p.text}`),packet.dayunSelection?.notice].filter(Boolean).join(" "),
    careerWorkFlow:flow(0),moneyResourceFlow:flow(1),relationshipFlow:flow(2),
    actionPlan:r.actions,
  };
}

export function annualReadingMatches(packet: AnnualFortuneEvidencePacket): boolean {
  if (packet.annualReading === undefined) return true;
  return packet.monthlyCalculationVersion === ANNUAL_MONTH_CALCULATION_VERSION &&
    JSON.stringify(orderedJson(packet.annualReading)) === JSON.stringify(orderedJson(buildAnnualFortuneReading(packet)));
}

// V2 checks the stored selected year's canonical calendar, never today's year.
// Legacy reads rebuild only their original relation rules, not the V2 calendar.
// Neither path recalculates Yun; compare the stored Dayun basis and derived IDs.
export function annualMonthlyEvidenceMatches(packet: AnnualFortuneEvidencePacket): boolean {
  const labels = packet.baseSaju.natalLabels;
  const elements = Object.keys(elementNames) as FiveElement[];
  const input = {
    dayMaster: packet.baseSaju.dayMaster,
    natalBranches: [packet.baseSaju.pillars.year, packet.baseSaju.pillars.month, packet.baseSaju.pillars.day, packet.baseSaju.pillars.hour]
      .filter((p): p is string => typeof p === "string").map(p => p[1] as EarthlyBranch),
    missingElements: elements.filter(e => labels.includes(`${elementNames[e]} 부족`)),
    heavyElements: elements.filter(e => labels.includes(`${elementNames[e]} 과다`)),
  };
  if (packet.monthlyCalculationVersion !== undefined) {
    if (packet.monthlyCalculationVersion !== ANNUAL_MONTH_CALCULATION_VERSION || !packet.customerDayun ||
        packet.monthlyFortunes.length !== 0 || packet.monthlyFortuneSeeds.length !== 0 || packet.targetYear !== packet.selectedYear) return false;
    const expected = buildAnnualMonthCalendar({ ...input, selectedYear: packet.selectedYear, customerDayun: packet.customerDayun });
    return expected.length === 12 && JSON.stringify(orderedJson(expected)) === JSON.stringify(orderedJson(packet.calendarMonths));
  }
  // A removed/unknown version must never reinterpret V2 as legacy.
  if (packet.calendarMonths !== undefined) return false;
  const expected = buildAnnualMonthlyFortunes({ ...input, targetYear: packet.selectedYear });
  return JSON.stringify(orderedJson(expected)) === JSON.stringify(orderedJson(packet.monthlyFortunes));
}

// JSON object key order is not part of the snapshot contract (including JSONB).
// Array order remains significant: it carries the month and participant order.
function orderedJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(orderedJson);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, orderedJson(item)]));
  }
  return value;
}
