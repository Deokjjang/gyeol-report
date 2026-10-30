/**
 * 팩폭(과사용) 문장의 조건절을 원국과 대조한다(P3 A4). "~면" 조건절만 본다("~이라" 같은 사실 서술은 그 요소 자체의 뜻).
 * 조건절은 "거나"로 나뉜 선택지 중 하나라도 맞으면 성립. 선택지 안의 원자 조건(자리·인접 십성·관계·오행 다소·신살 동반·계절)이
 * 하나라도 원국과 어긋나면 그 선택지는 거짓. 알아보지 못한 원자는 판단하지 않는다(통과).
 * 신강·신약·십성 묶음 조건은 traits.overuseFits가 따로 본다.
 */
import { BRANCH_MAIN_ELEMENT, HIDDEN_STEMS, STEM_ELEMENT } from "@/lib/saju/constants";
import type { ChartDetections, ChartPosition } from "@/lib/saju/detections/types";
import { getTenGod } from "@/lib/saju/tenGods";
import type { EarthlyBranch, FiveElement, HeavenlyStem, SajuCalcResult, TenGod } from "@/lib/saju/types";

export type ConditionCtx = {
  readonly saju: SajuCalcResult;
  readonly det: ChartDetections;
  /** 이 요소가 놓인 자리(위치 가족만). */
  readonly positions: readonly ChartPosition[];
  /** 원국에서 감지된 지식 id 전체(신살 동반 확인용). */
  readonly hitIds: ReadonlySet<string>;
};

const POS_WORD: Record<string, ChartPosition> = { 년: "year", 연: "year", 월: "month", 일: "day", 시: "hour" };
const ELEMENT_WORD: Record<string, FiveElement> = { 나무: "WOOD", 목: "WOOD", 불: "FIRE", 화: "FIRE", 흙: "EARTH", 토: "EARTH", 쇠: "METAL", 금: "METAL", 물: "WATER", 수: "WATER" };
const TEN_GOD_WORD: Record<string, TenGod> = { 비견: "比肩", 겁재: "劫財", 식신: "食神", 상관: "傷官", 편재: "偏財", 정재: "正財", 편관: "偏官", 정관: "正官", 편인: "偏印", 정인: "正印" };
const STEM_WORD: Record<string, HeavenlyStem> = { 갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸" };
const BRANCH_WORD: Record<string, EarthlyBranch> = { 자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥" };
const SHINSAL_WORD: Record<string, string> = { 괴강: "shinsal:GOEGANG", 양인: "shinsal:YANGIN", 백호: "shinsal:BAEKHODAESAL", 도화: "shinsal:DOHWASAL", 홍염: "shinsal:HONGYEOMSAL", 역마: "shinsal:YEOKMASAL", 화개: "shinsal:HWAGAE", 현침: "shinsal:HYEONCHIMSAL", 원진: "shinsal:WONJIN", 귀문: "shinsal:GWIMUN", 고신: "shinsal:GOSINSAL", 과숙: "shinsal:GWASUKSAL" };
const SEASON_WORD: Record<string, string> = { 봄: "spring", 여름: "summer", 가을: "autumn", 겨울: "winter" };
const ORDER: readonly ChartPosition[] = ["year", "month", "day", "hour"];

type Slot = { readonly pos: ChartPosition; readonly row: "stem" | "branch"; readonly element: FiveElement; readonly tenGod: TenGod | null; readonly glyph: string };
function slots(saju: SajuCalcResult, det: ChartDetections): Slot[] {
  const dm = saju.pillars.day.stem;
  return ORDER.filter(p => p !== "hour" || det.hourIncluded).flatMap(pos => {
    const pillar = saju.pillars[pos]; if (!pillar) return [];
    return [
      { pos, row: "stem" as const, element: STEM_ELEMENT[pillar.stem], tenGod: pos === "day" ? null : getTenGod(dm, pillar.stem), glyph: pillar.stem },
      { pos, row: "branch" as const, element: BRANCH_MAIN_ELEMENT[pillar.branch], tenGod: getTenGod(dm, HIDDEN_STEMS[pillar.branch][0].stem), glyph: pillar.branch },
    ];
  });
}
const adjacent = (a: Slot, b: Slot) => a !== b && ((a.pos === b.pos && a.row !== b.row) || (a.row === b.row && Math.abs(ORDER.indexOf(a.pos) - ORDER.indexOf(b.pos)) === 1));

/** 원자 조건 하나를 평가: true/false, 알아보지 못하면 null. */
function atoms(text: string, ctx: ConditionCtx): boolean[] {
  const out: boolean[] = [];
  const { saju, det } = ctx;
  const all = slots(saju, det);
  const bal = det.elementBalance;
  // 자리: "일지에 ~ 있으면", "월지나 일지에", "년지에 놓이면"
  const posM = text.match(/((?:[년연월일시](?:지|주)(?:나 |이나 |·)?)+)에/);
  if (posM) {
    const ps = [...posM[1].matchAll(/([년연월일시])(지|주)/g)].map(m => ({ pos: POS_WORD[m[1]], row: m[2] }));
    if (ps.some(p => p.pos === "hour") && !det.hourIncluded && ps.every(p => p.pos === "hour")) out.push(false);
    const elem = text.match(/(나무|불|흙|쇠|물|[목화토금수]) ?(글자|기운)/);
    const glyph = text.match(/(?<![가-힣])([갑을병정무기경신임계자축인묘진사오미신유술해])(목|화|토|금|수)(?:가|이|와|과)/);
    if (elem) out.push(ps.some(p => all.some(s => s.pos === p.pos && (p.row === "주" || s.row === "branch") && s.element === ELEMENT_WORD[elem[1]])));
    else if (glyph) {
      const g = STEM_WORD[glyph[1]] && ELEMENT_WORD[glyph[2]] === STEM_ELEMENT[STEM_WORD[glyph[1]]] ? STEM_WORD[glyph[1]] : BRANCH_WORD[glyph[1]];
      out.push(ps.some(p => all.some(s => s.pos === p.pos && s.glyph === g)));
    } else if (ctx.positions.length) out.push(ps.some(p => ctx.positions.includes(p.pos)));
  }
  // 인접: "편인이 바로 옆에서 식신을", "불 글자가 바로 옆에서 누르는"
  if (/바로 옆|옆에서|옆 기둥|옆에 붙/.test(text)) {
    const tgs = [...text.matchAll(/(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)/g)].map(m => TEN_GOD_WORD[m[1]]);
    const el = text.match(/(나무|불|흙|쇠|물) 글자/);
    if (tgs.length >= 2) out.push(all.some(a => a.tenGod === tgs[0] && all.some(b => b.tenGod === tgs[1] && adjacent(a, b))));
    else if (el) { const day = all.find(s => s.pos === "day" && s.row === "stem")!; out.push(all.some(s => adjacent(s, day) && s.element === ELEMENT_WORD[el[1]])); }
  }
  // 관계: "자오충이 되면", "인사신 삼형", "묘유충"
  for (const m of text.matchAll(/(?<![가-힣])([자축인묘진사오미신유술해]{2,3})\s?(충|합|형|파|해|삼형|원진)/g)) {
    const key = [...m[1]].map(c => BRANCH_WORD[c]).join("");
    const kind = { 충: "CHUNG", 합: null, 형: "HYEONG", 삼형: "HYEONG", 파: "PA", 해: "HAE", 원진: "WONJIN" }[m[2]];
    const same = (a: string, b: string) => a.length === b.length && [...a].every(c => b.includes(c));
    out.push(det.relations.some(r => (!kind || r.kind === kind) && same(r.key, key)));
  }
  // 오행 다소: "토 글자가 많거나", "물 글자가 없으면"
  for (const m of text.matchAll(/(나무|불|흙|쇠|물|[목화토금수]) 글자가 (많|여럿|넘치|없|약하|적)/g)) {
    const e = ELEMENT_WORD[m[1]]; const st = bal.status[e];
    out.push(/많|여럿|넘치/.test(m[2]) ? st === "많음" || bal.parts[e].visible >= 3 : st === "부족" || st === "없음");
  }
  // 십성 있음·없음: "정관이 없으면", "편인이 있으면"
  for (const m of text.matchAll(/(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)(?:이|가|까지|도) (있|없)으면/g)) {
    const n = saju.tenGods.distribution[TEN_GOD_WORD[m[1]]] ?? 0;
    out.push(m[2] === "있" ? n > 0 : n === 0);
  }
  // 천간 글자 있음·없음: "계수가 없으면", "갑목이 있으면"
  for (const m of text.matchAll(/(?<![가-힣])([갑을병정무기경신임계])(목|화|토|금|수)(?:이|가) (있|없)/g)) {
    const stem = STEM_WORD[m[1]]; if (ELEMENT_WORD[m[2]] !== STEM_ELEMENT[stem]) continue;
    const present = all.some(s => s.row === "stem" && s.glyph === stem) || all.some(s => s.row === "branch" && HIDDEN_STEMS[s.glyph as EarthlyBranch].some(h => h.stem === stem));
    out.push(m[3] === "있" ? present : !present);
  }
  // 월지 본기: "월지 본기가 겁재면"(P3.8 r1: 월지 亥 본기는 정관인데 겁재 조건 문장을 단정)
  for (const m of text.matchAll(/([년연월일시])지 (?:본기|속 기운)(?:가|이) (비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)/g)) {
    const slot = all.find(s => s.pos === POS_WORD[m[1]] && s.row === "branch");
    out.push(Boolean(slot) && slot!.tenGod === TEN_GOD_WORD[m[2]]);
  }
  // 두 천간이 함께: "갑목과 경금이 함께 있으면"(P3.8 r1: 庚이 없는데 단정)
  for (const m of text.matchAll(/(?<![가-힣])([갑을병정무기경신임계])(목|화|토|금|수)(?:과|와) ([갑을병정무기경신임계])(목|화|토|금|수)(?:이|가) (함께|같이|모두) 있/g)) {
    const has = (c: string) => { const st = STEM_WORD[c]; return all.some(s => s.row === "stem" && s.glyph === st) || all.some(s => s.row === "branch" && HIDDEN_STEMS[s.glyph as EarthlyBranch].some(h => h.stem === st)); };
    out.push(has(m[1]) && has(m[3]));
  }
  // 십성 많음: "상관이 많고", "겁재가 많으면"(드러난 글자 + 지장간 무게 2 이상)
  for (const m of text.matchAll(/(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)(?:이|가) 많/g)) out.push((saju.tenGods.distribution[TEN_GOD_WORD[m[1]]] ?? 0) >= 2);
  // 일간 음양: "일간까지 음이면", "일간이 양이면"
  for (const m of text.matchAll(/일간(?:까지|이|도|마저)? (음|양)이면/g)) out.push((["甲", "丙", "戊", "庚", "壬"].includes(saju.pillars.day.stem)) === (m[1] === "양"));
  // 이 요소가 일주에: "일주가 백호면", "일주가 해당 간지이거나"
  if (/일주가 (백호|괴강|해당|그 간지)/.test(text) && ctx.positions.length) out.push(ctx.positions.includes("day"));
  // 기둥 수: "해당 기둥이 둘 이상이면", "백호 기둥이 둘 이상이면"
  if (/(해당|그|백호|괴강) 기둥이 (둘|두 개) 이상/.test(text) && ctx.positions.length) out.push(ctx.positions.length >= 2);
  // 신살 동반: "괴강·양인과 함께 있으면"
  if (/함께 있|같이 있|겹치면|만나면/.test(text)) {
    const names = Object.keys(SHINSAL_WORD).filter(n => text.includes(n));
    if (names.length) out.push(names.some(n => ctx.hitIds.has(SHINSAL_WORD[n])));
  }
  // 계절: "봄생이거나", "겨울생이면"
  for (const m of text.matchAll(/(봄|여름|가을|겨울)(생|에 태어)/g)) out.push(det.climate.season === SEASON_WORD[m[1]]);
  return out;
}

/** 조건절("~면", "~일수록")을 뽑는다. 쉼표·마침표 사이에서 조건 어미로 끝나는 구간. */
export function conditionClauses(line: string): string[] {
  return [...line.matchAll(/[^,.!?]*?(?:으면|이면|하면|되면|있으면|없으면|놓이면|걸리면|누르면|만나면|겹치면|많으면|약하면|면|일수록)(?=[\s,])/g)].map(m => m[0].trim()).filter(c => c.length > 2);
}

export function conditionsHold(line: string, ctx: ConditionCtx): boolean {
  for (const clause of conditionClauses(line)) {
    const options = clause.split(/거나 /);
    const verdicts = options.map(o => atoms(o, ctx));
    if (verdicts.every(v => v.length > 0 && v.includes(false)) && verdicts.some(v => v.length)) return false;
  }
  return true;
}
