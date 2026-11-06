/** 원국 요약(시간 미상이면 시주 제외), 오행·음양·조후 판단, 현재 대운, 올해 기운 한 줄. */
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import { calculateCustomerDayun, type CustomerDayunCycle } from "@/lib/saju/customerDayun";
import { getAnnualPillar, judgeElementBalance, natalEntries, type ElementBalance } from "@/lib/saju/detections";
import type { ChartDetections } from "@/lib/saju/detections/types";
import { getYearPillarFromSolarDateTime } from "@/lib/saju/pillars";
import { getTenGod } from "@/lib/saju/tenGods";
import type { FiveElement, Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import { DAYUN_PHASE_KO, dayunPhase } from "@/lib/writer/safety/lint";
import type { Knowledge } from "./knowledge";
import { currentDayunAt, dayunLabel, dayunStartMs, monthsBetween, remainingKo, ELEMENT_KO, ganjiLabel, ganjiOf, GROUP_EASY, josa, TEN_GOD_KO, tenGodLabel } from "./labels";
import type { ChartBrief } from "./schema";
import { dropSourceSentences, splitSentences } from "@/lib/writer/safety/patterns";
import { coreImage } from "./coreImage";
import { GROUP_NAME_KO, groupLevelKoFor, groupStrength, supportConflictGroups, TEN_GOD_GROUP_KEYS, type GroupStrength, type TenGodGroupKey } from "@/lib/saju/groupStrength";

const ELEMENTS: readonly FiveElement[] = ["WOOD", "FIRE", "EARTH", "METAL", "WATER"];
/** 일간 강약 한 줄(P3.8 5: 강약에 해석이 없어 작가가 "힘이 남아도 모자라도" 같은 빈 문장으로 채웠다). */
const STRENGTH_READING: Record<string, string> = {
  VERY_STRONG: "내 힘이 아주 센 편이라, 남을 따라가기보다 내 판을 직접 짤 때 힘이 제대로 쓰입니다.",
  STRONG: "내 힘이 센 편이라, 맡은 일을 밀고 나가는 쪽에서 힘이 잘 쓰입니다.",
  BALANCED: "내 힘이 세지도 여리지도 않은 가운데라, 상황에 맞춰 밀고 당기기를 고를 수 있습니다.",
  WEAK: "내 힘이 여린 편이라, 받쳐 주는 사람과 정해진 틀이 있을 때 힘이 오래 갑니다.",
  VERY_WEAK: "내 힘이 많이 여린 편이라, 혼자 버티기보다 도움과 순서를 빌릴 때 힘이 납니다.",
};
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

/** 최종 A-6: 신약인데 비겁·인성이 강일 때 강약 한 문장 틀(두 라벨을 따로 주지 않는다). 아니면 null. */
export function supportFrame(level: string, gs: Readonly<Record<TenGodGroupKey, GroupStrength>>): string | null {
  const groups = supportConflictGroups(level, gs);
  if (!groups.length) return null;
  return `나를 돕는 기운(${groups.map(g => `${GROUP_EASY[g]}·${GROUP_NAME_KO[g]}`).join(", ")})은 있지만 태어난 계절에 눌려 전체 힘은 ${level === "VERY_WEAK" ? "많이 " : ""}약한 편`;
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

/** birthDate: 대운수(그 대운이 시작되는 때의 만 나이, labels.dayunStartManAge)를 세는 생일(운영 Q 8-1). */
export type DayunInfo = { readonly cycles: readonly CustomerDayunCycle[]; readonly birthDate?: string; readonly error?: string };
export function dayunOf(input: { birthDate: string; birthTime: string; birthTimeUnknown: boolean; approximateBirthTimeSlot?: string; gender: string | null; name: string }): DayunInfo {
  const r = calculateCustomerDayun({ birthDate: input.birthDate, birthTime: input.birthTime, birthTimeUnknown: input.birthTimeUnknown, approximateBirthTimeSlot: input.approximateBirthTimeSlot ?? "", gender: input.gender ?? "", name: input.name });
  if (!r.ok) return { cycles: [], error: r.error };
  return { cycles: r.value.cycles, birthDate: input.birthDate };
}
/** 기준 시각(ms): 발행 시각(baseAt)이 있으면 그것, 없으면 기준 날짜 KST 정오. */
export const baseMsOf = (baseDate: string, baseAt?: string) => (baseAt && Number.isFinite(Date.parse(baseAt)) ? Date.parse(baseAt) : Date.parse(`${baseDate}T12:00:00+09:00`));
/** 한 대운의 표기(다음 대운으로 끝 연·월까지). 6상품 공통. */
export const labelOf = (dayun: DayunInfo, c: CustomerDayunCycle) => dayunLabel(c, dayun.birthDate, dayun.cycles.find(x => x.index === c.index + 1));

export function inflowEffect(pillar: Pillar, st: ElementState) {
  const incoming = [...new Set([STEM_ELEMENT[pillar.stem], BRANCH_MAIN_ELEMENT[pillar.branch]])];
  const fills = incoming.filter(e => st.lacking.includes(e));
  const feeds = incoming.filter(e => st.excess.includes(e));
  return { incoming, fills, feeds };
}

/** 그해에 이르는 만 나이(그해 생일이 지난 뒤, P6b E-3). 카드·본문·대운 구간이 모두 이 값을 쓴다. */
export const manAge = (year: number, birthYear: number) => year - birthYear;

export function buildChartBrief(saju: SajuCalcResult, det: ChartDetections, k: Knowledge, opts: { gender: "MALE" | "FEMALE" | null; baseDate: string; baseAt?: string; dayun: DayunInfo; birthYear: number }): ChartBrief {
  const { pillars, dayMaster } = saju;
  const feature = (id: string) => k.features.get(id);
  const dm = feature(`dayMaster:${dayMaster}`);
  // 음양 설명은 비율에 맞는 것만(P6c B1): 성별 변형 trait는 P6a에서 중립으로 합쳐졌다. 예전 id(…:MALE)로 찾으면 없어서 균형 설명이 붙었다(하람 6:2).
  const yyId = `yinYang:${saju.yinYang.label}`;
  const bal = det.elementBalance;
  const top = bal.strongest, low = bal.weakest;
  const elementReading = [
    // 그림 한 줄(oneLiner) 대신 이 사람에게 주는 힘(P6b B-1).
    ...(top.level === "많음" ? [feature(`element:${top.element}:STRONG`)?.forYou.base] : []),
    ...(low.level === "부족" || low.level === "없음" ? [feature(`element:${low.element}:${low.level === "없음" ? "MISSING" : "WEAK"}`)?.forYou.base] : []),
  ].filter((x): x is string => Boolean(x));
  const climateItem = feature(`climate:${det.climate.featureKey}`);
  const { year, pillar: yearPillar } = sajuYearAt(opts.baseDate);
  const effect = yearEffectLine(year, yearPillar, bal, STEM_ELEMENT[dayMaster]);
  // 최종 A-5: 지금 대운은 교운 시각과 기준 시각(발행 시각)을 비교해 고른다(최지우: 교운 2026-11-26 전이면 앞 대운).
  const atMs = baseMsOf(opts.baseDate, opts.baseAt);
  const cur = currentDayunAt(opts.dayun.cycles, atMs);
  const curTenGod = cur ? getTenGod(dayMaster, cur.stem) : null;
  // 다음 대운은 늘 준다(P6c E1 커리어 타이밍: 남은 기간·전환 해). 대운 안의 위치(앞쪽·중간·끝 무렵)는 교운 시각부터 흐른 햇수로(최종 A-4).
  const next = cur ? opts.dayun.cycles.find(c => c.index === cur.index + 1) : undefined;
  const nextMs = cur ? (next ? dayunStartMs(next) : dayunStartMs(cur) + 10 * 365.2425 * 86_400_000) : 0;
  // 대운 안 몇 번째 해는 연도 카드와 같은 달력 연차(첫해 = 교운 해). 교운 시각으로 고른 대운이 달력상 10년을 넘는 날(최지우: 교운 전 11월)은 마지막 해로 묶는다.
  const yearIndex = cur ? Math.min(9, Math.max(0, year - cur.startYear)) : 0;
  const monthsLeft = cur ? monthsBetween(atMs, nextMs) : 0;
  return {
    pillars: { year: ganjiOf(pillars.year), month: ganjiOf(pillars.month), day: ganjiOf(pillars.day), ...(pillars.hour && det.hourIncluded ? { hour: ganjiOf(pillars.hour) } : {}) },
    dayMaster: { stem: dayMaster, name: dm?.name ?? dayMaster, easyName: dm?.easyName ?? "", metaphor: dm?.image.metaphor ?? "" },
    coreImage: coreImage({ stem: dayMaster, season: det.climate.season, strength: saju.structureAnalysis.dayMasterStrength.level, levels: bal.status, strongest: { element: top.element, level: top.level } }),
    // 최종 A-6: 신약인데 비겁·인성 강이면 강약 라벨(신약) 대신 한 문장 틀, 묶음 단계는 「있음」(groupsFact).
    strength: (({ level, labelKo }, frame) => ({ level, label: frame ?? labelKo, reading: STRENGTH_READING[level] ?? STRENGTH_READING.BALANCED, ...strengthNote(frame ? "전체 힘은 약한 편" : labelKo, top, low) }))(saju.structureAnalysis.dayMasterStrength, supportFrame(saju.structureAnalysis.dayMasterStrength.level, groupStrength(saju))),
    yinYang: { yin: saju.yinYang.yin, yang: saju.yinYang.yang, label: saju.yinYang.label, reading: feature(yyId)?.forYou.base ?? feature("yinYang:BALANCED")?.forYou.base ?? "" },
    elements: {
      strongest: { element: top.element, name: ELEMENT_KO[top.element], level: top.level, reason: top.reason },
      weakest: { element: low.element, name: ELEMENT_KO[low.element], level: low.level === "없음" ? "없음(땅속에도 없음)" : low.level, reason: low.reason },
      reading: elementReading,
      // 오행 유무(P6c B2): 겉 글자 수와 땅속(지장간) 유무. 겉 0·땅속 있음은 "겉에는 없고 땅속에 조금"으로만 쓴다.
      presence: Object.fromEntries(ELEMENTS.map(e => [e, { surface: bal.parts[e].visible, hidden: bal.parts[e].hidden > 0 }])) as Record<FiveElement, { surface: number; hidden: boolean }>,
      // 최종판2 1-8: 장소담 종합 3장 소제목 「불 3 · 흙 3 · 물 2가 자리 잡고…」 ↔ 본문 「가장 센 기운은 물」(겉 글자 수와 힘을 섞었다).
      ...(() => { const maxSurface = Math.max(...ELEMENTS.map(e => bal.parts[e].visible)), topN = bal.parts[top.element].visible;
        return topN < maxSurface ? { countVsStrength: `겉 글자 수(presence.surface)와 힘(strongest·weakest: 태어난 달 기운 두 배·땅속 글자 포함)은 다르다. ${ELEMENT_KO[top.element]}${ELEMENT_KO[top.element] === "나무" ? "는" : "은"} 겉 글자 ${topN}개지만 힘으로는 가장 세다. 개수를 말할 때는 개수, 힘을 말할 때는 힘이라고 밝히고, 한 소제목에서 섞으면 둘을 함께 쓴다` } : {}; })(),
    },
    climate: {
      season: SEASON_KO[det.climate.season],
      needs: det.climate.needs.filter(n => n.role !== "support").map(n => `${n.stem}(${ELEMENT_KO[STEM_ELEMENT[n.stem]]}) ${n.foundAt.length ? "있음" : "없음"}`),
      level: det.climate.level, lacking: [...det.climate.lackingElements], reading: climateItem?.forYou.base ?? "",
    },
    // 최종판3 8: 나이·연도·표기 줄은 6개 상품 공통 대운 표기 함수(dayunLabel) 하나에서. label = "무진 대운: 2027년 5월 무렵부터 (대운수 27)", start = "2027년 5월 무렵부터".
    currentDayun: cur && curTenGod ? {
      // 최종 A-4: years(엔진 연도 구간)는 코드 안에서만 쓰고, 작가에게는 교운 연·월 기간(period·until)과 남은 기간(remaining)을 준다.
      ...(({ ages, years, line, start, until, period }) => ({ ganji: ganjiOf(cur), ages, years, label: line, start, until, period }))(labelOf(opts.dayun, cur)), tenGod: tenGodLabel(curTenGod),
      // 위치 말(P6d C): 첫해·마지막 해는 이름 그대로, 그 밖은 앞쪽·중간·끝 무렵(대운 연도 카드와 같은 말). 남은 기간은 교운 시각 기준.
      phase: { yearIndex: yearIndex + 1, label: yearIndex === 0 ? "첫해" : yearIndex === 9 ? "마지막 해" : DAYUN_PHASE_KO[dayunPhase(yearIndex)], yearsLeft: Math.floor(monthsLeft / 12), remaining: `${remainingKo(atMs, nextMs)}(${labelOf(opts.dayun, cur).until})` },
      reading: dropSourceSentences(k.tenGodPeriod.get(curTenGod)?.year.meaning ?? ""),
      // 다음 대운은 십성 이름만 주면 작가가 문체 예시에서 뜻을 빌려 왔다(P3.7 r2): 쉬운 이름과 뜻 한 문장을 함께 준다.
      ...(next ? { next: (() => { const tg = getTenGod(dayMaster, next.stem); const f = k.features.get(`tenGod:${tg}`); const meaning = k.tenGodPeriod.get(tg)?.year.meaning.split(/(?<=[.!?])\s+/)[0]; return { ganji: ganjiOf(next), startYear: next.startYear, label: labelOf(opts.dayun, next).line, start: labelOf(opts.dayun, next).start, tenGod: tenGodLabel(tg), ...(f || meaning ? { reading: meaning ?? splitSentences(f!.meaning)[1] } : {}) }; })() } : {}),
    } : null,
    thisYear: { year, ganji: ganjiOf(yearPillar), tenGod: tenGodLabel(getTenGod(dayMaster, yearPillar.stem)), effect },
    groups: groupsFact(saju),
    positions: positionsFact(saju, det),
    ...(opts.gender ? { stars: starFacts(saju, det, opts.gender) } : {}),
  };
}

/**
 * 자리별 십성(P6e 5): 천간은 그 글자의 십성, 지지는 지장간 십성(본기 먼저). "월지의 비견"처럼 자리와 십성을 바꿔 쓰지 않게 작가·검사가 같은 값을 본다.
 * 시간 미상이면 시주는 없다. line은 작가용 한 줄.
 */
export function positionsFact(saju: SajuCalcResult, det: ChartDetections): NonNullable<ChartBrief["positions"]> {
  const ko = (t: TenGod | null | undefined) => (t ? TEN_GOD_KO[t] : "");
  const branch = (p: "year" | "month" | "day" | "hour") => { const b = saju.pillars[p]?.branch; return b ? saju.tenGods.hiddenStems.filter(h => h.branch === b && h.tenGod).sort((x, y) => y.weight - x.weight).map(h => ko(h.tenGod)) : []; };
  const hour = Boolean(saju.pillars.hour && det.hourIncluded);
  const v = { yearStem: [ko(saju.tenGods.stems.year)], monthStem: [ko(saju.tenGods.stems.month)], ...(hour ? { hourStem: [ko(saju.tenGods.stems.hour)] } : {}), yearBranch: branch("year"), monthBranch: branch("month"), dayBranch: branch("day"), ...(hour ? { hourBranch: branch("hour") } : {}) };
  const clean = Object.fromEntries(Object.entries(v).map(([k, xs]) => [k, [...new Set((xs as string[]).filter(Boolean))]])) as Record<string, string[]>;
  const L: Record<string, string> = { yearStem: "태어난 해 하늘 글자(연간)", monthStem: "태어난 달 하늘 글자(월간)", hourStem: "태어난 시각 하늘 글자(시간)", yearBranch: "태어난 해 땅 글자(연지)", monthBranch: "태어난 달 땅 글자(월지)", dayBranch: "태어난 날 땅 글자(일지)", hourBranch: "태어난 시각 땅 글자(시지)" };
  return { ...clean, line: Object.entries(clean).map(([k, xs]) => `${L[k]} ${xs[0]}${xs.length > 1 ? `(속에 ${xs.slice(1).join("·")})` : ""}`).join(" · ") + " — 자리와 십성은 이 값 그대로(하늘 글자와 땅 글자를 바꿔 쓰지 않는다)" } as NonNullable<ChartBrief["positions"]>;
}

/** 십성 묶음 세기(P6d A): 만세력 오행 칸 가중값 하나의 단계. */
export function groupsFact(saju: SajuCalcResult): NonNullable<ChartBrief["groups"]> {
  const gs = groupStrength(saju), lv = saju.structureAnalysis.dayMasterStrength.level, frame = supportFrame(lv, gs);
  const levels = Object.fromEntries(TEN_GOD_GROUP_KEYS.map(g => [GROUP_NAME_KO[g], groupLevelKoFor(lv, gs, g)])) as NonNullable<ChartBrief["groups"]>["levels"];
  return { levels, line: `${TEN_GOD_GROUP_KEYS.map(g => `${GROUP_EASY[g]}(${GROUP_NAME_KO[g]}) ${groupLevelKoFor(lv, gs, g)}`).join(" · ")}${frame ? ` — 「있음」은 ${frame}(chart.strength.label)이라는 한 문장으로만 쓴다. 강하다·약하다로 따로 말하지 않는다` : ""} — 만세력 오행 칸(겉 글자 + 지장간) 기준. 묶음 세기는 이 단계로만 쓰고 다른 말(옅다·보통 수준 등)로 바꾸지 않는다. 처음 나올 때 "내 방식의 힘(비겁)"처럼 쉬운 이름과 함께, 그 뒤로는 쉬운 이름만` };
}

/**
 * 배우자 별·자녀 별(P6c B4): 성별 기준 별과 자리를 사실 하나로. surface = 드러난 천간(일간 제외) 또는 지지 본기, hidden = 지장간에만, none = 없음.
 * 남 = 배우자 재성·자녀 관성, 여 = 배우자 관성·자녀 식상. 시간 미상이면 시주는 보지 않는다.
 */
const STAR_TENGODS = { WEALTH: ["偏財", "正財"], OFFICER: ["偏官", "正官"], OUTPUT: ["食神", "傷官"] } as const;
const POS_KO = { year: "태어난 해", month: "태어난 달", day: "태어난 날", hour: "태어난 시각" } as const;
export function starFacts(saju: SajuCalcResult, det: ChartDetections, gender: "MALE" | "FEMALE") {
  const one = (label: string, stars: readonly TenGod[]) => {
    const surface: string[] = [], hidden: string[] = [];
    for (const p of ["year", "month", "day", "hour"] as const) {
      const pillar = saju.pillars[p]; if (!pillar || (p === "hour" && !det.hourIncluded)) continue;
      const stemTg = p === "day" ? null : saju.tenGods.stems[p as "year" | "month" | "hour"];
      if (stemTg && stars.includes(stemTg)) surface.push(`${POS_KO[p]} 하늘 글자`);
      for (const h of saju.tenGods.hiddenStems.filter(x => x.branch === pillar.branch)) if (h.tenGod && stars.includes(h.tenGod)) (h.weight >= 0.5 ? surface : hidden).push(`${POS_KO[p]} 땅 글자${h.weight >= 0.5 ? "" : " 속"}`);
    }
    const where: "surface" | "hidden" | "none" = surface.length ? "surface" : hidden.length ? "hidden" : "none";
    const name = stars.map(t => tenGodLabel(t).replace(/\(.*\)/, "")).join("·");
    return { star: `${label}(${name})`, where, places: [...new Set([...surface, ...hidden])],
      line: where === "surface" ? `${label}(${name})이 ${[...new Set(surface)].join("·")}에 드러나 있음` : where === "hidden" ? `${label}(${name})은 겉에는 없고 ${[...new Set(hidden)].join("·")}에 조금 있음` : `${label}(${name})이 원국에 없음(정해진 틀보다 스스로 찾는 쪽으로 읽음)` };
  };
  return gender === "MALE"
    ? { spouse: one("배우자 별", STAR_TENGODS.WEALTH), child: one("자녀 별", STAR_TENGODS.OFFICER) }
    : { spouse: one("배우자 별", STAR_TENGODS.OFFICER), child: one("자녀 별", STAR_TENGODS.OUTPUT) };
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
