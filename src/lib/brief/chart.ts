/** 원국 요약(시간 미상이면 시주 제외), 오행·음양·조후 판단, 현재 대운, 올해 기운 한 줄. */
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import { calculateCustomerDayun, type CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { getAnnualPillar, judgeElementBalance, natalEntries, type ElementBalance } from "@/lib/saju/detections";
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
/** 오행 단일 판단(detections/elementBalance)에서 파생: 많음은 가장 강한 기운 하나만, 부족·없음은 여럿. */
export function elementState(saju: SajuCalcResult): ElementState {
  return stateOf(judgeElementBalance(natalEntries(saju)));
}
/**
 * 일간 강약과 오행 쏠림은 다른 저울이다(P3.7 1-2): "힘이 약한데 물이 넘친다"를 모순으로 읽지 않게 한 문장으로 풀어 준다.
 * 오행이 고르면(많음·부족·없음 없음) 쓰지 않는다.
 */
function strengthNote(label: string, top: { element: FiveElement; level: string }, low: { element: FiveElement; level: string }): { note?: string } {
  const skew = [top.level === "많음" ? `${ELEMENT_KO[top.element]} 많음` : "", low.level === "부족" || low.level === "없음" ? `${ELEMENT_KO[low.element]} ${low.level}` : ""].filter(Boolean);
  if (!skew.length) return {};
  return { note: `내 힘의 세기(${label})와 사주 전체 기운의 쏠림(${skew.join("·")})은 다른 저울입니다. 앞은 나를 받쳐 주는 힘이 얼마나 큰지, 뒤는 여덟 글자에 어떤 기운이 많고 적은지입니다.` };
}

export function stateOf(b: ElementBalance): ElementState {
  return {
    excess: ELEMENTS.filter(e => b.status[e] === "많음"),
    lacking: ELEMENTS.filter(e => b.status[e] === "부족" || b.status[e] === "없음"),
    missing: ELEMENTS.filter(e => b.status[e] === "없음"),
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
  const yyId = saju.yinYang.label === "BALANCED" ? "yinYang:BALANCED" : `yinYang:${saju.yinYang.label}${opts.gender ? `:${opts.gender}` : ""}`;
  const bal = det.elementBalance;
  const top = bal.strongest, low = bal.weakest;
  const elementReading = [
    ...(top.level === "많음" ? [feature(`element:${top.element}:STRONG`)?.oneLiner] : []),
    ...(low.level === "부족" || low.level === "없음" ? [feature(`element:${low.element}:${low.level === "없음" ? "MISSING" : "WEAK"}`)?.oneLiner] : []),
  ].filter((x): x is string => Boolean(x));
  const climateItem = feature(`climate:${det.climate.featureKey}`);
  const { year, pillar: yearPillar } = sajuYearAt(opts.baseDate);
  const effect = yearEffectLine(year, yearPillar, bal, STEM_ELEMENT[dayMaster]);
  const cur = opts.dayun.cycles.find(c => c.startYear <= year && year <= c.endYear);
  const curTenGod = cur ? getTenGod(dayMaster, cur.stem) : null;
  const next = cur && cur.endYear - year <= 2 ? opts.dayun.cycles.find(c => c.index === cur.index + 1) : undefined;
  return {
    pillars: { year: ganjiOf(pillars.year), month: ganjiOf(pillars.month), day: ganjiOf(pillars.day), ...(pillars.hour && det.hourIncluded ? { hour: ganjiOf(pillars.hour) } : {}) },
    dayMaster: { stem: dayMaster, name: dm?.name ?? dayMaster, easyName: dm?.easyName ?? "", metaphor: dm?.image.metaphor ?? "" },
    strength: { level: saju.structureAnalysis.dayMasterStrength.level, label: saju.structureAnalysis.dayMasterStrength.labelKo, ...strengthNote(saju.structureAnalysis.dayMasterStrength.labelKo, top, low) },
    yinYang: { yin: saju.yinYang.yin, yang: saju.yinYang.yang, label: saju.yinYang.label, reading: feature(yyId)?.oneLiner ?? "" },
    elements: {
      strongest: { element: top.element, name: ELEMENT_KO[top.element], level: top.level, reason: top.reason },
      weakest: { element: low.element, name: ELEMENT_KO[low.element], level: low.level === "없음" ? "없음(땅속에도 없음)" : low.level, reason: low.reason },
      reading: elementReading,
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
    thisYear: { year, ganji: ganjiOf(yearPillar), tenGod: tenGodLabel(getTenGod(dayMaster, yearPillar.stem)), effect },
  };
}

const GENERATES: Record<FiveElement, FiveElement> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CONTROLS: Record<FiveElement, FiveElement> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
/** 올해 기운 한 줄: 오행 단일 판단(가장 강한·가장 약한 기운)에서 파생한다. */
export function yearEffectLine(year: number, pillar: Pillar, bal: ElementBalance, dayElement: FiveElement): string {
  const incoming = [...new Set([STEM_ELEMENT[pillar.stem], BRANCH_MAIN_ELEMENT[pillar.branch]])];
  const top = bal.strongest, low = bal.weakest, weak = low.level === "부족" || low.level === "없음";
  const ko = (es: readonly FiveElement[]) => es.map(e => ELEMENT_KO[e]).join("·");
  const lines: string[] = [];
  if (weak && incoming.includes(low.element)) lines.push(`가장 약한 ${josa(ELEMENT_KO[low.element], "을를")} 채워 줍니다.`);
  else if (weak && incoming.some(e => GENERATES[e] === low.element)) lines.push(`가장 약한 ${josa(ELEMENT_KO[low.element], "을를")} 살려 주는 쪽입니다.`);
  if (incoming.includes(top.element)) lines.push(top.level === "많음" ? `이미 가장 강한 ${josa(ELEMENT_KO[top.element], "을를")} 더 키웁니다.` : `가장 강한 ${ELEMENT_KO[top.element]} 쪽에 힘이 더 실립니다.`);
  else if (incoming.some(e => CONTROLS[e] === top.element)) lines.push(`가장 강한 ${josa(ELEMENT_KO[top.element], "을를")} 눌러 균형을 잡아 줍니다.`);
  if (incoming.includes(dayElement)) lines.push("태어난 날의 기운과 같은 기운이라 내 힘이 보태집니다.");
  if (!lines.length) lines.push(weak ? `가장 강한 ${josa(ELEMENT_KO[top.element], "과와")} 가장 약한 ${josa(ELEMENT_KO[low.element], "을를")} 직접 건드리지는 않습니다.` : `가장 강한 ${josa(ELEMENT_KO[top.element], "을를")} 직접 건드리지는 않습니다.`);
  return `${year}년 ${josa(ganjiLabel(pillar), "은는")} ${ko(incoming)} 기운이 들어오는 해입니다. ${lines.join(" ")}`;
}
