/**
 * v5 궁합 점수 v2(P6c). 결정론·설명 가능. 규칙·출처·보정 내역: docs/v5/compat-score-v2.md.
 * 총점 = 기본 40 + 항목 7개 합(만점 60, 관계 유형별 배점 ITEM_MAX). MBTI가 한쪽이라도 없으면 MBTI 항목을 빼고
 * 사주 항목 합을 60점으로 환산한다(MBTI 근거를 만들지 않는다).
 * 항목마다 2~3문장 이유(그 명리 개념의 뜻 + 두 사람에게 적용된 모습)를 엔진 값으로 만든다. 점수 쪽과 브리프가 같은 문장을 쓴다.
 * 기존 Book의 점수(v4 compatibilityIndex, v5 compat-score-v5-1)는 스냅샷에 고정돼 바뀌지 않는다.
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import { elementState } from "@/lib/brief/chart";
import { ELEMENT_KO, josa, REL_PLAIN, tenGodLabel } from "@/lib/brief/labels";
import { STEM_ELEMENT, STEM_YIN_YANG } from "@/lib/saju/constants";
import { detectRelations } from "@/lib/saju/detections/relations";
import { STEM_HAP_TABLE } from "@/lib/saju/detections/tables";
import type { RelationKind } from "@/lib/saju/detections/types";
import { getTenGod } from "@/lib/saju/tenGods";
import type { EarthlyBranch, FiveElement, HeavenlyStem, SajuCalcResult, TenGod } from "@/lib/saju/types";

export const COMPAT_SCORE_VERSION = "v2" as const;
export const BASE_SCORE = 40;
export type CompatCategory = "love" | "marriage" | "parentChild" | "coworker" | "managerReport" | "businessPartner" | "friendship";
export type ItemKey = "element" | "dayMaster" | "dayBranch" | "yearMonth" | "role" | "yinYang" | "mbti";
export const ITEM_NAMES: Record<ItemKey, string> = {
  element: "오행 보완", dayMaster: "타고난 중심 관계", dayBranch: "생활 자리", yearMonth: "자란 환경·사회 자리", role: "서로에게 주는 역할", yinYang: "음양 균형", mbti: "MBTI",
};

/** 관계 유형별 배점(합 60). 근거: docs/v5/compat-score-v2.md §2. */
const LOVE = { element: 12, dayMaster: 10, dayBranch: 10, yearMonth: 6, role: 4, yinYang: 3, mbti: 15 };
const WORK = { ...LOVE, dayBranch: 6, yearMonth: 10 };
export const ITEM_MAX: Record<CompatCategory, Record<ItemKey, number>> = {
  love: LOVE, marriage: LOVE, coworker: WORK, businessPartner: WORK,
  parentChild: { ...LOVE, dayBranch: 5, yearMonth: 8, role: 7 },
  managerReport: { ...LOVE, dayBranch: 5, yearMonth: 9, role: 6 },
  friendship: { ...LOVE, dayBranch: 7, mbti: 18 },
};
/** 자란 환경(연지) 몫. 나머지는 사회 자리(월지). 일 관계는 사회 자리를, 부모·자녀는 자란 환경을 더 본다. */
const YEAR_SHARE: Record<CompatCategory, number> = { love: 0.5, marriage: 0.5, friendship: 0.5, parentChild: 2 / 3, coworker: 1 / 3, managerReport: 1 / 3, businessPartner: 1 / 3 };

/**
 * 항목 안의 세부 점수 기준(만점 대비 비율). 합의 기준(연애 배점): 오행 12/8/4, 일간 10/8/6/4, 일지 10/7/4/2, 연·월지 6/4/2, 음양 고르면 3.
 * 합의에 없던 단계(한쪽만 필요 없음, 합+형·파, 형·파·해의 연·월지, 역할, MBTI 세부)는 이웃 단계 사이에 둔다. 근거: 문서 §2.
 */
export const BASE_TIERS = {
  /** 사람마다 filled(모자란 기운을 상대가 가짐)·free(모자란 기운 없음)·missed(상대도 많지 않음). */
  element: { "filled+filled": 1, "filled+free": 0.83, "filled+missed": 0.67, "free+free": 0.67, "free+missed": 0.5, "missed+missed": 0.33 },
  dayMaster: { hap: 1, generate: 0.8, same: 0.6, control: 0.4 },
  dayBranch: { hap: 1, hapMixed: 0.8, none: 0.7, friction: 0.4, clash: 0.2 },
  yearMonth: { hap: 1, hapMixed: 0.83, none: 0.67, friction: 0.5, clash: 0.33 },
  role: { exact: 1, near: 0.75, generate: 0.5, peer: 0.5, other: 0.25 },
  /** 두 사람 합산 음양 차이 비율 ≤1/8·≤1/4·≤3/8·그 이상. */
  yinYang: [1, 0.67, 0.33, 0],
  /** 5점씩: 대화 결(N/S 같음 5·다름 2), 기능 보완(짝 기능 5·주기능 공유 4·무난 3·열등기능 맞닿음 2), 에너지·생활 리듬(J/P 같음 3·다름 1 + E/I 같음 2·다름 1). */
  mbti: { talkSame: 1, talkDiff: 0.4, golden: 1, shared: 0.8, plain: 0.6, mirror: 0.4, rhythm: [1, 0.8, 0.6, 0.4] },
};
/**
 * 분포 보정(문서 §3): 모든 세부 점수를 같은 규칙 max(0, (기준 − FLOOR) / (1 − FLOOR))로 내린다. 가장 좋은 단계는 만점 그대로,
 * 단계 순서도 그대로다. FLOOR는 무작위 1만 쌍 × 7유형의 중앙값이 70이 되게 고른 값(tools/p6c-score/calibrate.ts). 바꾸면 버전을 올린다.
 */
export const FLOOR = 0.36;
const lower = (x: number, floor: number) => Math.round(Math.max(0, (x - floor) / (1 - floor)) * 1000) / 1000;
export function tiersFor(floor: number): typeof BASE_TIERS {
  const map = <T extends Record<string, number | readonly number[]>>(o: T) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.map(x => lower(x, floor)) : lower(v as number, floor)])) as T;
  return { element: map(BASE_TIERS.element), dayMaster: map(BASE_TIERS.dayMaster), dayBranch: map(BASE_TIERS.dayBranch), yearMonth: map(BASE_TIERS.yearMonth), role: map(BASE_TIERS.role), yinYang: BASE_TIERS.yinYang.map(x => lower(x, floor)), mbti: map(BASE_TIERS.mbti) };
}
export const TIERS = tiersFor(FLOOR);

/** 점수 구간(합의 이름). 낮은 구간도 보완법을 반드시 쓰고, 이별을 권하지 않는다. */
export const SCORE_BANDS = [
  { min: 90, label: "천생연분", tone: "끌림과 편안함이 함께 있는 사이로 쓴다. 그래도 둘이 지킬 약속 하나는 쓴다", verdict: "끌림과 편안함이 함께 있는, 천생연분에 가까운 사이예요." },
  { min: 80, label: "잘 맞는 사이", tone: "기본 합이 좋은 사이로 쓴다. 좋은 점을 먼저, 조율할 점은 짧고 구체적으로", verdict: "기본 합이 좋아 함께할수록 편해지는, 잘 맞는 사이예요." },
  { min: 70, label: "끌림과 보완이 있는 사이", tone: "서로 끌리는 점과 채워 주는 점이 분명한 사이로 쓴다. 맞출 점은 장면 하나로 짧게", verdict: "서로 끌리는 점과 채워 주는 점이 분명한, 끌림과 보완이 있는 사이예요." },
  { min: 60, label: "맞춰 가면 좋아지는 사이", tone: "잘 맞는 점과 맞출 점이 함께 있는 사이로 쓴다. 맞추는 방법을 장면으로 구체적으로", verdict: "잘 맞는 점과 맞출 점이 함께 있어, 맞춰 가면 좋아지는 사이예요." },
  { min: 50, label: "노력이 필요한 사이", tone: "다른 점이 많은 사이로 솔직하게 쓰되, 차이를 역할로 나누는 보완법을 반드시 쓴다", verdict: "다른 점이 많아 노력이 필요한 사이지만, 차이를 역할로 나누면 서로에게 배울 거리가 많아요." },
  { min: 0, label: "서로 다른 세계", tone: "서로 다른 세계에서 온 두 사람으로 쓴다. 다름이 배울 거리가 되는 법과 보완법을 반드시 쓴다", verdict: "서로 다른 세계에서 온 두 사람이라, 다름을 배울 거리로 삼을 때 관계가 단단해져요." },
] as const;
export type ScoreBand = (typeof SCORE_BANDS)[number];
export const bandOf = (score: number): ScoreBand => SCORE_BANDS.find(b => score >= b.min)!;

export type CompatSide = { readonly saju: SajuCalcResult; readonly name: string; readonly mbti: MbtiType | null; readonly gender: "MALE" | "FEMALE" | null };
export type CompatItem = { readonly key: ItemKey; readonly name: string; readonly points: number; readonly max: number; readonly level: "좋음" | "보통" | "조율"; readonly reason: string };
export type CompatDirection = { readonly tenGod: string; readonly role: string; readonly gives: string | null };
export type CompatScore = {
  readonly version: typeof COMPAT_SCORE_VERSION; readonly category: CompatCategory;
  readonly total: number; readonly band: ScoreBand; readonly items: readonly CompatItem[];
  /** MBTI가 없어 사주 항목 합을 60점으로 환산했는가. notice: 점수 쪽 아래 계산 안내 한 줄. */
  readonly scaled: boolean; readonly notice: string;
  readonly direction: { readonly aToB: CompatDirection; readonly bToA: CompatDirection };
};

const ko = (e: FiveElement) => ELEMENT_KO[e];
/** 받침에 맞춰 "~이라/~라". */
const ira = (w: string) => (josa(w, "이가").endsWith("이") ? `${w}이라` : `${w}라`);
const GENERATES: Record<FiveElement, FiveElement> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CONTROLS: Record<FiveElement, FiveElement> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };
const STEM_NAME: Record<HeavenlyStem, string> = { 甲: "갑목", 乙: "을목", 丙: "병화", 丁: "정화", 戊: "무토", 己: "기토", 庚: "경금", 辛: "신금", 壬: "임수", 癸: "계수" };
const ELEMENT_HANJA: Record<FiveElement, string> = { WOOD: "木", FIRE: "火", EARTH: "土", METAL: "金", WATER: "水" };
const BRANCH_NAME: Record<EarthlyBranch, string> = { 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
const stemLabel = (s: HeavenlyStem) => `${STEM_NAME[s]}(${s}${ELEMENT_HANJA[STEM_ELEMENT[s]]})`;
const branchLabel = (b: EarthlyBranch) => `${BRANCH_NAME[b]}(${b})`;

// ---------- 오행 보완 ----------
type Need = { status: "filled" | "free" | "missed"; element: FiveElement | null };
/** to의 모자란 기운(브리프 lacking과 같은 판단) 중 from이 넉넉한(가장 강한 기운이거나 겉 글자 2개 이상) 것. 브리프 complement와 같은 규칙. */
function needOf(to: SajuCalcResult, from: SajuCalcResult): Need {
  const t = elementState(to), f = elementState(from);
  if (!t.lacking.length) return { status: "free", element: null };
  const fill = t.lacking.find(e => f.excess.includes(e) || (from.elements.visible[e] ?? 0) >= 2);
  return fill ? { status: "filled", element: fill } : { status: "missed", element: t.lacking[0] };
}
function elementItem(a: CompatSide, b: CompatSide) {
  const na = needOf(a.saju, b.saju), nb = needOf(b.saju, a.saju); // na: A의 모자란 기운을 B가 채우는가
  const key = [na.status, nb.status].sort().join("+") as keyof typeof TIERS.element;
  const part = (n: Need, who: string, other: string) => n.status === "filled" ? `${who}에게 모자란 ${josa(ko(n.element!), "을를")} ${josa(other, "이가")} 넉넉히 가지고 있어 채워 줘요`
    : n.status === "missed" ? `${who}에게 모자란 ${josa(ko(n.element!), "은는")} ${other}도 많지 않아 함께 채워 갈 거리예요` : `${josa(who, "은는")} 크게 모자란 기운이 없어요`;
  const applied = na.status === "free" && nb.status === "free" ? "두 사람 모두 크게 모자란 기운이 없어, 서로 채워 줄 일도 한쪽으로 쏠릴 일도 적어요." : `${part(na, a.name, b.name)}. ${part(nb, b.name, a.name)}.`;
  return { frac: TIERS.element[key], reason: `오행은 나무·불·흙·쇠·물 다섯 기운으로, 내게 모자란 기운을 상대가 가지고 있으면 함께 있을 때 편안해져요. ${applied}`,
    ab: nb.status === "filled" ? nb.element : null, ba: na.status === "filled" ? na.element : null };
}

// ---------- 타고난 중심 관계(일간) ----------
function dayMasterItem(a: CompatSide, b: CompatSide) {
  const sa = a.saju.dayMaster, sb = b.saju.dayMaster, ea = STEM_ELEMENT[sa], eb = STEM_ELEMENT[sb], T = TIERS.dayMaster;
  const lead = `일간은 태어난 날의 하늘 글자로, 그 사람의 중심 기운이에요. ${a.name}의 ${josa(stemLabel(sa), "과와")} ${b.name}의 ${josa(stemLabel(sb), "은는")}`;
  if (STEM_HAP_TABLE.some(r => (r.pair[0] === sa && r.pair[1] === sb) || (r.pair[0] === sb && r.pair[1] === sa))) return { frac: T.hap, reason: `${lead} 서로 끌어당겨 하나로 묶이는 천간합이라, 처음부터 마음이 잘 끌리는 짝이에요.` };
  if (GENERATES[ea] === eb || GENERATES[eb] === ea) {
    const [X, Y, x, y] = GENERATES[ea] === eb ? [a.name, b.name, ea, eb] : [b.name, a.name, eb, ea];
    return { frac: T.generate, reason: `${lead} ${ko(x)} 기운이 ${ko(y)} 기운을 키워 주는 상생이라, ${josa(X, "이가")} 북돋우면 ${josa(Y, "이가")} 힘을 얻는 흐름이에요.` };
  }
  if (ea === eb) return { frac: T.same, reason: sa === sb ? `일간은 태어난 날의 하늘 글자로, 그 사람의 중심 기운이에요. ${josa(a.name, "과와")} ${b.name}의 일간은 둘 다 ${ira(stemLabel(sa))}, 서로를 거울처럼 알아보지만 같은 데서 고집이 부딪히기도 해요.`
    : `${lead} 둘 다 ${ko(ea)} 기운이라 서로를 거울처럼 알아보지만, 같은 데서 고집이 부딪히기도 해요.` };
  const [X, Y, x, y] = CONTROLS[ea] === eb ? [a.name, b.name, ea, eb] : [b.name, a.name, eb, ea];
  return { frac: T.control, reason: `${lead} ${ko(x)} 기운이 ${ko(y)} 기운을 누르는 상극이라, ${josa(X, "이가")} 기준을 세우면 ${josa(Y, "은는")} 눌린다고 느낄 수 있어 말의 세기를 맞추면 편해져요.` };
}

// ---------- 생활 자리(일지)·자란 환경·사회 자리(연지·월지) ----------
export type BranchTier = "hap" | "hapMixed" | "none" | "friction" | "clash";
const HAP: readonly RelationKind[] = ["YUKHAP", "SAMHAP"], CLASH: readonly RelationKind[] = ["CHUNG", "WONJIN"], FRICTION: readonly RelationKind[] = ["HYEONG", "PA", "HAE"];
const relName = (k: RelationKind) => (k === "SAMHAP" ? "반합(세 글자 중 두 글자가 한 기운으로 모임)" : REL_PLAIN[k]);
/** 두 지지 한 쌍의 관계 단계. 합이 있으면 합이 앞선다(탐합망충, 형·파가 섞이면 한 단계 아래). 충·원진이 형·파·해보다 세다. 방합 두 글자와 같은 글자(자형 제외)는 관계 없음. */
export function branchTier(x: EarthlyBranch, y: EarthlyBranch): { tier: BranchTier; kinds: RelationKind[] } {
  const found = new Set(detectRelations([{ position: "year", pillar: { stem: "甲", branch: x } }, { position: "month", pillar: { stem: "甲", branch: y } }]).map(h => h.kind));
  const has = (ks: readonly RelationKind[]) => ks.filter(k => found.has(k));
  const tier: BranchTier = has(HAP).length ? (has([...CLASH, ...FRICTION]).length ? "hapMixed" : "hap") : has(CLASH).length ? "clash" : has(FRICTION).length ? "friction" : "none";
  return { tier, kinds: [...has(HAP), ...has(CLASH), ...has(FRICTION)] };
}
type Place = "일지" | "연지" | "월지";
/** 자리마다 다른 말: 일지 = 생활, 연지 = 자란 집, 월지 = 밖에서 움직이는 방식(같은 조언이 한 쪽에 겹치지 않게). */
const BRANCH_EFFECT: Record<Place, Record<BranchTier, string>> = {
  일지: {
    hap: "서로 맞물려 같이 지낼수록 생활이 편해져요",
    hapMixed: "잘 맞다가도 사소한 생활 습관에서 어긋날 수 있어요",
    none: "특별히 당기지도 부딪치지도 않아, 생활 방식은 이야기하며 맞추면 돼요",
    friction: "작은 생활 습관에서 서운함이 쌓이기 쉬워, 그때그때 말로 풀면 좋아요",
    clash: "생활 방식이 정면으로 부딪치기 쉬워, 각자의 시간과 공간을 정해 두면 훨씬 편해져요",
  },
  연지: {
    hap: "자란 집의 분위기가 닮아 가족 이야기가 편하게 통해요",
    hapMixed: "자란 분위기는 통하지만 집안의 작은 습관에서 차이가 날 수 있어요",
    none: "자란 환경이 특별히 닮지도 부딪치지도 않아요",
    friction: "자란 집의 습관이 조금 달라, 서로의 집안 방식을 먼저 물어보면 좋아요",
    clash: "자란 집의 분위기가 정반대였을 수 있어, 서로의 집안 방식을 먼저 물어보면 좋아요",
  },
  월지: {
    hap: "밖에서 움직이는 방식이 맞물려 함께 일을 벌이기 좋아요",
    hapMixed: "밖에서는 잘 맞물리지만 일의 순서에서 작은 마찰이 날 수 있어요",
    none: "밖에서 움직이는 방식이 특별히 닮지도 부딪치지도 않아요",
    friction: "밖에서 일하는 방식이 조금씩 어긋나, 일의 순서를 미리 맞추면 좋아요",
    clash: "밖에서 일하는 방식이 정면으로 부딪치기 쉬워, 역할을 미리 나눠 두면 좋아요",
  },
};
/** 관계 이름은 둘까지: 합이 섞이면 "합이지만 (가장 센 마찰)도 섞여". */
function branchPhrase(r: ReturnType<typeof branchTier>, place: Place): string {
  const [first, second] = r.kinds.map(relName), effect = BRANCH_EFFECT[place][r.tier];
  if (!first) return effect;
  if (r.tier === "hapMixed") return `${first}이지만 ${second}도 섞여, ${effect}`;
  return `${ira(second ? `${josa(first, "과와")} ${second}` : first)} ${effect}`;
}
/** "A의 일지 축(丑)과 B의 일지 진(辰)은 …" / 같은 글자면 "A과 B의 일지는 둘 다 해(亥)라 …". */
function branchLine(place: Place, aName: string, bName: string, x: EarthlyBranch, y: EarthlyBranch, r: ReturnType<typeof branchTier>): string {
  if (x !== y) return `${aName}의 ${place} ${josa(branchLabel(x), "과와")} ${bName}의 ${place} ${josa(branchLabel(y), "은는")} ${branchPhrase(r, place)}`;
  const both = `${josa(aName, "과와")} ${bName}의 ${place}는 둘 다 ${branchLabel(x)}`;
  return r.kinds.length ? `${both}인데, 같은 글자끼리 ${branchPhrase(r, place)}` : `${ira(both)} 감각이 닮았고 특별히 부딪치지 않아요`;
}
function dayBranchItem(a: CompatSide, b: CompatSide) {
  const x = a.saju.pillars.day.branch, y = b.saju.pillars.day.branch, r = branchTier(x, y);
  return { frac: TIERS.dayBranch[r.tier], reason: `일지는 태어난 날의 땅 글자로, 매일의 생활 감각과 가장 가까운 사람을 대하는 방식이 담긴 자리예요. ${branchLine("일지", a.name, b.name, x, y, r)}.` };
}
function yearMonthItem(a: CompatSide, b: CompatSide, category: CompatCategory) {
  const yx = a.saju.pillars.year.branch, yy = b.saju.pillars.year.branch, mx = a.saju.pillars.month.branch, my = b.saju.pillars.month.branch;
  const yr = branchTier(yx, yy), mo = branchTier(mx, my), w = YEAR_SHARE[category];
  return { frac: w * TIERS.yearMonth[yr.tier] + (1 - w) * TIERS.yearMonth[mo.tier],
    reason: `연지는 자란 집과 어린 시절 환경을, 월지는 사회에서 움직이는 방식을 보여 주는 자리예요. ${branchLine("연지", a.name, b.name, yx, yy, yr)}. ${branchLine("월지", a.name, b.name, mx, my, mo)}.` };
}

// ---------- 서로에게 주는 역할(십성) ----------
type Flow = "aControls" | "bControls" | "aGenerates" | "bGenerates" | "peer";
function flowOf(a: HeavenlyStem, b: HeavenlyStem): Flow {
  const ea = STEM_ELEMENT[a], eb = STEM_ELEMENT[b];
  return ea === eb ? "peer" : CONTROLS[ea] === eb ? "aControls" : CONTROLS[eb] === ea ? "bControls" : GENERATES[ea] === eb ? "aGenerates" : "bGenerates";
}
/** 관계 유형에 맞는 자리(전통 육친·사회 관계 십성): 맞는 흐름, 정(음양 다름)·편(음양 같음) 중 더 맞는 쪽, 개념 문장. 근거: 문서 §2-4. */
function roleFit(category: CompatCategory, ga: CompatSide["gender"], gb: CompatSide["gender"]): { ideal: readonly Flow[]; samePolarity: boolean; principle: string } {
  if (category === "love" || category === "marriage") {
    // 남성에게 여성은 재성(남성이 극함), 여성에게 남성은 관성 — 같은 흐름이다. 성별이 같거나 모르면 어느 쪽이 극하든 맞는 자리.
    const ideal: Flow[] = ga === "MALE" && gb === "FEMALE" ? ["aControls"] : ga === "FEMALE" && gb === "MALE" ? ["bControls"] : ["aControls", "bControls"];
    return { ideal, samePolarity: false, principle: "연애·결혼에서는 남성에게 상대가 재성(아끼고 지키는 기운), 여성에게 상대가 관성(기준을 세워 주는 기운)일 때 서로의 자리를 자연스럽게 채운다고 봐요." };
  }
  if (category === "parentChild") {
    // A=부모, B=자녀. 자녀에게 어머니는 정인(어머니가 생함), 아버지는 편재(자녀가 극함). 성별을 모르면 둘 다.
    const ideal: Flow[] = ga === "FEMALE" ? ["aGenerates"] : ga === "MALE" ? ["bControls"] : ["aGenerates", "bControls"];
    return { ideal, samePolarity: ga === "MALE", principle: "부모·자녀에서는 자녀에게 어머니가 정인(받쳐 주고 채워 주는 기운), 아버지가 편재(넓게 챙겨 주는 기운)일 때 전통적인 부모 자리와 맞는다고 봐요." };
  }
  // A=상사. 팀원에게 상사가 정관(상사가 극함)이나 정인(상사가 생함).
  if (category === "managerReport") return { ideal: ["aControls", "aGenerates"], samePolarity: false, principle: "직장에서는 팀원에게 상사가 정관(기준을 세워 주는 기운)이나 정인(받쳐 주는 기운)일 때 위아래 자리가 자연스럽다고 봐요." };
  if (category === "businessPartner") return { ideal: ["aGenerates", "bGenerates"], samePolarity: false, principle: "사업 파트너는 한쪽이 만들고 다른 쪽이 받쳐 주는 상생(식신과 정인)일 때 일을 나누기 좋다고 봐요." };
  return { ideal: ["peer"], samePolarity: true, principle: category === "coworker" ? "동료 사이에서는 서로가 비견(나란히 걷는 같은 기운)일 때 자연스러운 자리라고 봐요." : "친구 사이에서는 서로가 비견(나란히 걷는 같은 기운)일 때 편하게 어울린다고 봐요." };
}
const ROLE: Record<TenGod, string> = {
  比肩: "나란히 걷는 같은 편", 劫財: "어깨를 겨루며 함께 뛰는 동료",
  食神: "마음을 편하게 쏟게 만드는 사람", 傷官: "말과 재주를 꺼내게 만드는 사람",
  偏財: "챙기고 이끌어 주고 싶어지는 사람", 正財: "차곡차곡 아끼고 지키고 싶은 사람",
  偏官: "긴장감을 주며 크게 단련시키는 사람", 正官: "기준을 세워 주고 바로잡아 주는 사람",
  偏印: "남다른 시선으로 생각을 넓혀 주는 사람", 正印: "받쳐 주고 채워 주는 사람",
};
function roleItem(a: CompatSide, b: CompatSide, category: CompatCategory) {
  const flow = flowOf(a.saju.dayMaster, b.saju.dayMaster), fit = roleFit(category, a.gender, b.gender), T = TIERS.role;
  const samePol = STEM_YIN_YANG[a.saju.dayMaster] === STEM_YIN_YANG[b.saju.dayMaster];
  const frac = fit.ideal.includes(flow) ? (samePol === fit.samePolarity ? T.exact : T.near) : flow === "peer" ? T.peer : flow === "aGenerates" || flow === "bGenerates" ? T.generate : T.other;
  const ab = getTenGod(b.saju.dayMaster, a.saju.dayMaster), ba = getTenGod(a.saju.dayMaster, b.saju.dayMaster);
  const verdict = frac === T.exact ? "그 자리와 꼭 맞아요" : frac === T.near ? "그 자리와 거의 맞아요" : `그 자리와는 다르게 ${ROLE[ab]}에 가까운 사이예요`;
  const applied = ab === ba ? `두 사람은 서로에게 ${ira(tenGodLabel(ab))}` : `${b.name}에게 ${josa(a.name, "은는")} ${tenGodLabel(ab)}, ${a.name}에게 ${josa(b.name, "은는")} ${ira(tenGodLabel(ba))}`;
  return { frac, reason: `십성은 한 사람의 일간에서 본 상대 기운의 역할로, ${fit.principle} ${applied}, ${verdict}.` };
}

// ---------- 음양 균형 ----------
function yinYangItem(a: CompatSide, b: CompatSide) {
  const yin = a.saju.yinYang.yin + b.saju.yinYang.yin, yang = a.saju.yinYang.yang + b.saju.yinYang.yang;
  const gap = Math.abs(yin - yang) / (yin + yang || 1), step = gap <= 0.125 ? 0 : gap <= 0.25 ? 1 : gap <= 0.375 ? 2 : 3, side = yin > yang ? "음" : "양";
  const count = `음 글자가 ${yin}개, 양 글자가 ${yang}개`;
  const applied = step === 0 ? `둘을 합치면 ${count}로 고르게 맞아요.` : step === 1 ? `둘을 합치면 ${count}로 ${side} 쪽으로 조금 기울어요.` : `둘을 합치면 ${count}로 ${josa(side, "이가")} 많아 같은 리듬으로 쏠리기 쉬워요.`;
  return { frac: TIERS.yinYang[step], reason: `음양은 차분히 모으는 음과 밖으로 뻗는 양으로, 두 사람의 글자를 합쳐 고르면 함께 있을 때 한쪽으로 쏠리지 않아요. ${applied}` };
}

// ---------- MBTI ----------
/** 인지기능 순서(주·부·3차·열등). 통용되는 Myers-Briggs 기능 위계. */
export const FUNCTION_STACK: Record<MbtiType, readonly [string, string, string, string]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"], INTP: ["Ti", "Ne", "Si", "Fe"], ENTJ: ["Te", "Ni", "Se", "Fi"], ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"], INFP: ["Fi", "Ne", "Si", "Te"], ENFJ: ["Fe", "Ni", "Se", "Ti"], ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"], ISFJ: ["Si", "Fe", "Ti", "Ne"], ESTJ: ["Te", "Si", "Ne", "Fi"], ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"], ISFP: ["Fi", "Se", "Ni", "Te"], ESTP: ["Se", "Ti", "Fe", "Ni"], ESFP: ["Se", "Fi", "Te", "Ni"],
};
function mbtiItem(a: CompatSide, b: CompatSide, x: MbtiType, y: MbtiType) {
  const T = TIERS.mbti, fa = FUNCTION_STACK[x], fb = FUNCTION_STACK[y];
  const flipped = (p: string, q: string) => p[0] === q[0] && p[1] !== q[1];
  const golden = flipped(fa[0], fb[0]) && flipped(fa[1], fb[1]);
  const shared = [fa[0], fa[1]].some(f => f === fb[0] || f === fb[1]);
  const mirror = fa[0] === fb[3] || fb[0] === fa[3];
  const fn = golden ? T.golden : shared ? T.shared : mirror ? T.mirror : T.plain;
  const talk = x[1] === y[1] ? T.talkSame : T.talkDiff;
  const rhythm = T.rhythm[(x[3] === y[3] ? 0 : 2) + (x[0] === y[0] ? 0 : 1)];
  const [n, s] = x[1] === "N" ? [a.name, b.name] : [b.name, a.name];
  const talkLine = x[1] === y[1] ? `둘 다 ${x[1] === "N" ? "N이라 대화가 생각과 가능성" : "S라 대화가 구체적인 사실과 경험"} 쪽으로 잘 흘러요` : `대화의 결이 달라 ${josa(n, "은는")} 큰 그림부터, ${josa(s, "은는")} 구체적인 사실부터 말해요`;
  const fnLine = golden ? "생각의 축이 같고 방향만 반대라 서로의 빈칸을 채우고" : shared ? "가장 자주 쓰는 마음의 기능이 겹쳐 말이 빨리 통하고" : mirror ? "한 사람이 가장 잘 쓰는 기능이 다른 사람에게는 가장 낯설어 신기하면서도 답답할 수 있고" : "마음의 기능이 겹치지도 부딪치지도 않고";
  const rhythmLine = x[3] === y[3] ? `${x[3] === "J" ? "계획을 세우는" : "그때그때 맞춰 가는"} 생활 리듬이 같아요` : "한 사람은 계획을, 한 사람은 즉흥을 좋아해 생활 리듬은 맞춰 갈 게 있어요";
  return { frac: (talk + fn + rhythm) / 3, reason: `MBTI는 대화의 결(N/S), 마음이 먼저 쓰는 기능, 에너지와 생활 리듬(E/I·J/P)을 보여 줘요. ${x}인 ${josa(a.name, "과와")} ${y}인 ${josa(b.name, "은는")} ${talkLine}. ${fnLine}, ${rhythmLine}.` };
}

// ---------- 방향 지표(브리프·결정론 작가용) ----------
/** from이 to에게 어떤 사람인가: to의 일간 기준 from 일간의 십성. */
function direction(from: CompatSide, to: CompatSide, gives: FiveElement | null): CompatDirection {
  const tg = getTenGod(to.saju.dayMaster, from.saju.dayMaster);
  return { tenGod: tenGodLabel(tg), role: `${to.name}에게 ${josa(from.name, "은는")} ${ROLE[tg]}`, gives: gives ? `${from.name}의 ${ko(gives)} 기운이 ${to.name}에게 모자란 쪽을 채워 줌` : null };
}

const levelOf = (frac: number): CompatItem["level"] => (frac >= 0.75 ? "좋음" : frac <= 0.4 ? "조율" : "보통");

export function computeCompatScore(category: CompatCategory, a: CompatSide, b: CompatSide): CompatScore {
  const el = elementItem(a, b);
  const parts: { key: ItemKey; frac: number; reason: string }[] = [
    { key: "element", frac: el.frac, reason: el.reason }, { key: "dayMaster", ...dayMasterItem(a, b) }, { key: "dayBranch", ...dayBranchItem(a, b) },
    { key: "yearMonth", ...yearMonthItem(a, b, category) }, { key: "role", ...roleItem(a, b, category) }, { key: "yinYang", ...yinYangItem(a, b) },
    ...(a.mbti && b.mbti ? [{ key: "mbti" as const, ...mbtiItem(a, b, a.mbti, b.mbti) }] : []),
  ];
  const max = ITEM_MAX[category];
  const items = parts.map(p => ({ key: p.key, name: ITEM_NAMES[p.key], points: Math.round(p.frac * max[p.key]), max: max[p.key], level: levelOf(p.frac), reason: p.reason }));
  const sum = items.reduce((n, i) => n + i.points, 0), full = items.reduce((n, i) => n + i.max, 0), scaled = full < 60;
  const total = BASE_SCORE + (scaled ? Math.round(sum * 60 / full) : sum);
  const notice = scaled ? `두 사람의 명리를 정해진 규칙으로 계산했어요. MBTI를 다 알지 못해 MBTI 항목은 빼고, 사주 항목 ${full}점 만점을 60점으로 바꿔 기본 40점에 더했어요.`
    : "두 사람의 명리와 MBTI를 정해진 규칙으로 계산했어요. 기본 40점에 일곱 항목(60점 만점)의 점수를 더했어요.";
  return { version: COMPAT_SCORE_VERSION, category, total, band: bandOf(total), items, scaled, notice, direction: { aToB: direction(a, b, el.ab), bToA: direction(b, a, el.ba) } };
}
