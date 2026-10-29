/** 원국 요약(시간 미상이면 시주 제외), 오행·음양·조후 판단, 현재 대운, 올해 기운 한 줄. */
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import { calculateCustomerDayun, type CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { getAnnualPillar } from "@/lib/saju/detections";
import type { ChartDetections } from "@/lib/saju/detections/types";
import { getYearPillarFromSolarDateTime } from "@/lib/saju/pillars";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, Pillar, SajuCalcResult } from "@/lib/saju/types";
import type { Knowledge } from "./knowledge";
import { ELEMENT_KO, ganjiLabel, ganjiOf, josa, tenGodLabel } from "./labels";
import type { ChartBrief } from "./schema";

const ELEMENTS: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
const SEASON_KO = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" } as const;

export type ElementState = { readonly excess: FiveElement[]; readonly lacking: FiveElement[]; readonly missing: FiveElement[] };
export function elementState(saju: SajuCalcResult): ElementState {
  const has = (e: FiveElement, s: string) => saju.elements.labels.includes(`${e}_${s}` as never);
  return {
    excess: ELEMENTS.filter(e => has(e, "STRONG")),
    lacking: ELEMENTS.filter(e => has(e, "WEAK") || has(e, "MISSING")),
    missing: ELEMENTS.filter(e => has(e, "MISSING")),
  };
}

/** 기준일이 속한 사주 해(立春 기준)와 그 해 기둥. */
export function sajuYearAt(baseDate: string): { year: number; pillar: Pillar } {
  const pillar = getYearPillarFromSolarDateTime(`${baseDate}T12:00:00+09:00`);
  const y = Number(baseDate.slice(0, 4));
  const same = (p: Pillar) => p.stem === pillar.stem && p.branch === pillar.branch;
  return { year: same(getAnnualPillar(y)) ? y : y - 1, pillar };
}

export type DayunInfo = { readonly cycles: readonly CustomerDayunCycle[]; readonly error?: string };
export function dayunOf(input: { birthDate: string; birthTime: string; birthTimeUnknown: boolean; approximateBirthTimeSlot?: string; gender: string | null; name: string }): DayunInfo {
  const r = calculateCustomerDayun({ birthDate: input.birthDate, birthTime: input.birthTime, birthTimeUnknown: input.birthTimeUnknown, approximateBirthTimeSlot: input.approximateBirthTimeSlot ?? "", gender: input.gender ?? "", name: input.name });
  return r.ok ? { cycles: r.value.cycles } : { cycles: [], error: r.error };
}

export function inflowEffect(pillar: Pillar, st: ElementState) {
  const incoming = [...new Set([STEM_ELEMENT[pillar.stem], BRANCH_MAIN_ELEMENT[pillar.branch]])];
  const fills = incoming.filter(e => st.lacking.includes(e));
  const feeds = incoming.filter(e => st.excess.includes(e));
  return { incoming, fills, feeds };
}

export function buildChartBrief(saju: SajuCalcResult, det: ChartDetections, k: Knowledge, opts: { gender: "MALE" | "FEMALE" | null; baseDate: string; dayun: DayunInfo }): ChartBrief {
  const { pillars, dayMaster } = saju;
  const feature = (id: string) => k.features.get(id);
  const dm = feature(`dayMaster:${dayMaster}`);
  const st = elementState(saju);
  const yyId = saju.yinYang.label === "BALANCED" ? "yinYang:BALANCED" : `yinYang:${saju.yinYang.label}${opts.gender ? `:${opts.gender}` : ""}`;
  const elementReading = [
    ...st.excess.map(e => feature(`element:${e}:STRONG`)?.oneLiner),
    ...st.lacking.map(e => feature(`element:${e}:${st.missing.includes(e) ? "MISSING" : "WEAK"}`)?.oneLiner),
  ].filter((x): x is string => Boolean(x));
  const climateItem = feature(`climate:${det.climate.featureKey}`);
  const { year, pillar: yearPillar } = sajuYearAt(opts.baseDate);
  const eff = inflowEffect(yearPillar, st);
  const ko = (es: FiveElement[]) => es.map(e => ELEMENT_KO[e]).join("·");
  const effect = `${year}년 ${josa(ganjiLabel(yearPillar), "은는")} ${ko(eff.incoming)} 기운이 들어오는 해입니다. `
    + (eff.fills.length ? `원래 부족한 ${josa(ko(eff.fills), "을를")} 채워 줍니다. ` : "")
    + (eff.feeds.length ? `이미 많은 ${josa(ko(eff.feeds), "을를")} 더 보탭니다. ` : "")
    + (!eff.fills.length && !eff.feeds.length ? "부족하거나 넘치는 기운을 크게 건드리지는 않습니다." : "");
  const cur = opts.dayun.cycles.find(c => c.startYear <= year && year <= c.endYear);
  const curTenGod = cur ? getTenGod(dayMaster, cur.stem) : null;
  const next = cur && cur.endYear - year <= 2 ? opts.dayun.cycles.find(c => c.index === cur.index + 1) : undefined;
  return {
    pillars: { year: ganjiOf(pillars.year), month: ganjiOf(pillars.month), day: ganjiOf(pillars.day), ...(pillars.hour && det.hourIncluded ? { hour: ganjiOf(pillars.hour) } : {}) },
    dayMaster: { stem: dayMaster, name: dm?.name ?? dayMaster, easyName: dm?.easyName ?? "", metaphor: dm?.image.metaphor ?? "" },
    strength: { level: saju.structureAnalysis.dayMasterStrength.level, label: saju.structureAnalysis.dayMasterStrength.labelKo },
    yinYang: { yin: saju.yinYang.yin, yang: saju.yinYang.yang, label: saju.yinYang.label, reading: feature(yyId)?.oneLiner ?? "" },
    elements: {
      status: Object.fromEntries(ELEMENTS.map(e => [e, st.excess.includes(e) ? "많음" : st.missing.includes(e) ? "없음(땅속에도 없음)" : st.lacking.includes(e) ? (saju.elements.visible[e] === 0 ? "부족(겉 글자는 없고 땅속에 조금 있음 — '하나도 없다'고 쓰지 않는다)" : "부족") : "보통"])) as Record<FiveElement, string>,
      excess: st.excess, lacking: st.lacking, missing: st.missing, reading: elementReading,
    },
    climate: {
      season: SEASON_KO[det.climate.season],
      needs: det.climate.needs.filter(n => n.role !== "support").map(n => `${n.stem}(${ELEMENT_KO[STEM_ELEMENT[n.stem]]}) ${n.foundAt.length ? "있음" : "없음"}`),
      level: det.climate.level, lacking: [...det.climate.lackingElements], reading: climateItem?.oneLiner ?? "",
    },
    currentDayun: cur && curTenGod ? {
      ganji: ganjiOf(cur), ages: `${cur.startAge}~${cur.endAge}세`, years: `${cur.startYear}~${cur.endYear}`, tenGod: tenGodLabel(curTenGod),
      reading: k.tenGodPeriod.get(curTenGod)?.year.meaning ?? "",
      ...(next ? { next: { ganji: ganjiOf(next), startYear: next.startYear, tenGod: tenGodLabel(getTenGod(dayMaster, next.stem)) } } : {}),
    } : null,
    thisYear: { year, ganji: ganjiOf(yearPillar), tenGod: tenGodLabel(getTenGod(dayMaster, yearPillar.stem)), effect: effect.trim() },
  };
}
