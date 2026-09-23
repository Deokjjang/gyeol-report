import type { AnnualCalendarMonth, AnnualJieRelationFact, AnnualMonthSegment } from "../report-knowledge/annualMonthJie";
import { explainAnnualMonthFact } from "../report-knowledge/annualMonthRelationFacts";
import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";

export const MONTH_JIE_BASIS = "절입 기준 월운 · 한국 표준시";
const elements = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
const pillar = (p: AnnualMonthSegment["monthPillar"]) => p.stem + p.branch;
export const monthSegmentPeriod = (s: AnnualMonthSegment) => `${s.startKst.slice(5, 19).replace("T", " ")}~${s.endKstExclusive.slice(5, 19).replace("T", " ")} 미만 KST`;

export function explainAnnualJieFact(f: AnnualJieRelationFact): string {
  if (f.source === "month_natal_branch" || f.source === "month_natal_element") return explainAnnualMonthFact(f);
  const source = f.counterpart.scope === "annual" ? `${f.counterpart.pillar} 세운` : `${f.counterpart.pillar} 대운`;
  const conditional = f.certainty === "conditional" ? `교운 범위 안에서 ${source}에 해당하는 경우, ` : "";
  return `${conditional}월지 ${f.monthBranch}와 ${source} 지지의 ${f.participants.join("")} ${f.type} 작용입니다.`;
}

export function describeAnnualMonthSegment(s: AnnualMonthSegment): string {
  const dayun = s.activeDayunContext;
  const names = dayun.cycles.map(c => `${c.ganji} 대운`);
  if (dayun.includesBeforeFirstCycle) names.unshift("첫 대운 시작 전");
  return `${monthSegmentPeriod(s)}: ${pillar(s.monthPillar)}월, 월간 ${s.stemTenGod}·월지 본기 ${s.branchTenGod}, 오행 ${s.elements.map(e => elements[e]).join("·")}입니다. 이 구간의 연주는 ${pillar(s.effectiveAnnualPillar)}이며 ${names.join(" / ")} ${dayun.status === "transition_uncertain" ? "중 어느 쪽인지 확정하지 않습니다. 교운 시각은 출생시간에 따른 범위로 보존합니다." : "구간입니다."}`;
}

export function annualCalendarMonthTitle(month: AnnualCalendarMonth): string {
  const jie = month.segments.flatMap(s => s.boundaryReason.filter(r => r.startsWith("jie:")).map(r => r.slice(4)));
  const transition = month.importanceCandidates.some(c => c.kind === "transition");
  return `${month.month}월 — ${jie.join("·")} 전후 흐름 변경${transition ? " · 교운 구간 확인" : ""}`;
}

export function buildAnnualJieMonthlyPublication(months: readonly AnnualCalendarMonth[]): Pick<AnnualFortuneReportDraft, "monthlyFlow" | "monthlyHighlights" | "monthlyFlowReading"> {
  const monthlyFlow = months.map(month => ({
    month: month.month, label: `${month.month}월`, headline: annualCalendarMonthTitle(month),
    // A calendar month has no single pillar. The writer must preserve null.
    monthGanji: null, monthlyBasis: MONTH_JIE_BASIS, elementFocus: null,
    natalInteractionSummary: month.segments.map(s => `${monthSegmentPeriod(s)}: ${s.relationFacts.length ? s.relationFacts.map(explainAnnualJieFact).join(" ") : "계산된 지지 관계와 부족·과다 오행 작용이 없습니다."}`).join("\n"),
    body: month.segments.map(describeAnnualMonthSegment).join("\n"),
    advice: "기간별 근거를 나누어 읽고, 서로 다른 구간의 작용을 한 달 내내 동시에 성립하는 것으로 합치지 마세요.",
  }));
  return {
    monthlyFlow,
    monthlyHighlights: months.map(month => ({
      monthLabel: `${month.month}월`, headline: annualCalendarMonthTitle(month),
      body: month.segments.map(s => `${monthSegmentPeriod(s)} · ${pillar(s.monthPillar)} (${s.stemTenGod}·${s.branchTenGod})`).join("\n"),
      actionHint: "절입과 교운 경계를 기준으로 아래 기간별 근거를 확인하세요.",
    })),
    monthlyFlowReading: "양력 1~12월 안에서 절입 전후의 월주와 입춘 전후의 연주를 나누어 읽습니다. 교운이 있는 달에는 해당 기간의 대운도 구분하며, 출생시간 때문에 확정할 수 없는 전환 범위는 그대로 남깁니다. 오행 유입이나 합충만으로 좋은 달·나쁜 달을 단정하지 않습니다.",
  };
}
