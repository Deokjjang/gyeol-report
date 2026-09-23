import {
  buildAnnualMonthlyFortunes, type AnnualFortuneEvidencePacket,
} from "../report-knowledge/annualFortuneEvidence";
import { summarizeAnnualMonthFacts } from "../report-knowledge/annualMonthRelationFacts";
import type { EarthlyBranch, FiveElement } from "../report-knowledge/annualFortuneTypes";
import type { AnnualFortuneReportDraft } from "./annualFortuneReportDraftTypes";

const elementNames: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };

// Monthly factual copy is server-owned, like ganji and pillar tables. The writer
// composes the rest of the report; it cannot reinterpret absence as a relation.
export function buildAnnualMonthlyPublication(packet: AnnualFortuneEvidencePacket): Pick<
  AnnualFortuneReportDraft, "monthlyFlow" | "monthlyHighlights" | "monthlyFlowReading"
> {
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

// Rebuild only the existing inexpensive month relation rules, never the calendar
// or Dayun engine. Compare facts AND their derived display fields, including IDs.
export function annualMonthlyEvidenceMatches(packet: AnnualFortuneEvidencePacket): boolean {
  const labels = packet.baseSaju.natalLabels;
  const elements = Object.keys(elementNames) as FiveElement[];
  const expected = buildAnnualMonthlyFortunes({
    targetYear: packet.selectedYear, dayMaster: packet.baseSaju.dayMaster,
    natalBranches: [packet.baseSaju.pillars.year, packet.baseSaju.pillars.month, packet.baseSaju.pillars.day, packet.baseSaju.pillars.hour]
      .filter((p): p is string => typeof p === "string").map(p => p[1] as EarthlyBranch),
    missingElements: elements.filter(e => labels.includes(`${elementNames[e]} 부족`)),
    heavyElements: elements.filter(e => labels.includes(`${elementNames[e]} 과다`)),
  });
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
