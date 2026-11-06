/**
 * v5 궁합 점수 v2.2(P6e; v2.1은 P6c-ui2, v2는 P6c). 결정론·설명 가능. 규칙·출처·보정 내역: docs/v5/compat-score-v2.md.
 * v2.2: MBTI 15점(친구 18)을 대화의 결·마음의 기능·에너지·생활 리듬 세 부분(5점씩, 친구 6점씩)으로 나눠 이유 문장에 보이고, 항목 점수 = 세 부분 합.
 * 총점 = 기본 40 + 항목 7개 합(만점 60, 관계 유형별 배점 ITEM_MAX). MBTI가 한쪽이라도 없으면 MBTI 항목을 빼고
 * 그 몫을 사주 항목 만점에 나눠(itemMax) 여섯 항목 만점 합을 60으로 둔다(MBTI 근거를 만들지 않는다). 화면 항목 합 = 총점 − 40.
 * 항목마다 2~3문장 이유(그 명리 개념의 뜻 + 두 사람에게 적용된 모습)를 엔진 값으로 만든다. 점수 쪽과 브리프가 같은 문장을 쓴다.
 * 기존 Book의 점수(v4 compatibilityIndex, v5 compat-score-v5-1)는 스냅샷에 고정돼 바뀌지 않는다.
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import { elementState } from "@/lib/brief/chart";
import { ELEMENT_KO, HALF_HAP_PLAIN, josa, REL_PLAIN, tenGodLabel } from "@/lib/brief/labels";
import { BASE_POINTS } from "./display";
import { STEM_ELEMENT, STEM_YIN_YANG } from "@/lib/saju/constants";
import { detectRelations } from "@/lib/saju/detections/relations";
import { STEM_HAP_TABLE } from "@/lib/saju/detections/tables";
import type { RelationKind } from "@/lib/saju/detections/types";
import { getTenGod } from "@/lib/saju/tenGods";
import type { EarthlyBranch, FiveElement, HeavenlyStem, SajuCalcResult, TenGod } from "@/lib/saju/types";

export const COMPAT_SCORE_VERSION = "v2.2" as const;
/** 기본점(표시: compat/display.ts의 기본점 줄 — 점수 쪽 줄 합 = 총점). */
export const BASE_SCORE = BASE_POINTS;
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
 * v2 분포 보정(P6c, 문서 §3): 모든 세부 점수를 같은 규칙 max(0, (기준 − FLOOR) / (1 − FLOOR))로 내렸다. v2 Book은 스냅샷에 고정이라
 * 이 값은 기록·비교용이다(tools/p6c-score/calibrate.ts --floor).
 */
export const FLOOR = 0.36;
const lower = (x: number, floor: number) => Math.round(Math.max(0, (x - floor) / (1 - floor)) * 1000) / 1000;
export function tiersFor(floor: number): typeof BASE_TIERS {
  const map = <T extends Record<string, number | readonly number[]>>(o: T) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.map(x => lower(x, floor)) : lower(v as number, floor)])) as T;
  return { element: map(BASE_TIERS.element), dayMaster: map(BASE_TIERS.dayMaster), dayBranch: map(BASE_TIERS.dayBranch), yearMonth: map(BASE_TIERS.yearMonth), role: map(BASE_TIERS.role), yinYang: BASE_TIERS.yinYang.map(x => lower(x, floor)), mbti: map(BASE_TIERS.mbti) };
}
/**
 * v2.2 세부 점수(P6e, 문서 §9; v2.1은 §8). 목표: 7유형 × 무작위 1만 쌍에서 중앙값 68~70, 50 미만·90 이상 각 3~6%.
 * 방법(v2.1과 같음): 단계 순서는 그대로, 가장 좋은 단계는 만점, 가장 낮은 단계(충·원진·상극·둘 다 못 채움 등)는 0. 단계 사이를 벌려 항목마다
 * "맞으면 거의 만점, 아니면 거의 0"에 가깝게 했다(사후에 총점을 늘리거나 줄이지 않는다, 총점 = 40 + 항목 합 그대로).
 * v2.2: MBTI '무난'(기능이 겹치지도 부딪치지도 않음)과 'E/I만 같음'(J/P 다름)이 0이라 이유 문장과 어긋났다 → 둘 다 2/5(친구 2/6).
 * '대화 결 다름'은 0 그대로(결정: 이유 문장이 '가장 먼저 맞춰 갈 부분'으로 쓴다). 나머지 단계는 분포를 다시 맞추려고 옮겼다.
 * 대가(문서 §9.4): MBTI 부분 점수가 바닥을 올려 분산이 줄어, 연애·결혼·상사의 50 미만과 동료·부모의 90 이상이 2.3~2.9%로 목표 3%에 조금 못 미친다.
 * 값은 tools/p6c-ui2/optimize.ts(0.01 단위, 시드 2개, MBTI 범위 BOUNDS)로 찾고 표본 밖 시드로 확인했다. 바꾸면 COMPAT_SCORE_VERSION을 올린다.
 */
export const TIERS: typeof BASE_TIERS = {
  element: { "filled+filled": 1, "filled+free": 0.97, "filled+missed": 0.02, "free+free": 0.02, "free+missed": 0.01, "missed+missed": 0 },
  dayMaster: { hap: 1, generate: 0.97, same: 0.03, control: 0 },
  dayBranch: { hap: 1, hapMixed: 0.94, none: 0.74, friction: 0.03, clash: 0 },
  yearMonth: { hap: 1, hapMixed: 0.94, none: 0.56, friction: 0, clash: 0 },
  role: { exact: 1, near: 0.58, generate: 0.5, peer: 0.5, other: 0 },
  yinYang: [1, 0.33, 0.21, 0],
  mbti: { talkSame: 1, talkDiff: 0, golden: 1, shared: 0.92, plain: 0.34, mirror: 0, rhythm: [1, 0.92, 0.37, 0] },
};

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
  return { tier: key, reason: `오행은 나무·불·흙·쇠·물 다섯 기운으로, 내게 모자란 기운을 상대가 가지고 있으면 함께 있을 때 편안해져요. ${applied}`,
    ab: nb.status === "filled" ? nb.element : null, ba: na.status === "filled" ? na.element : null };
}

// ---------- 타고난 중심 관계(일간) ----------
function dayMasterItem(a: CompatSide, b: CompatSide) {
  const sa = a.saju.dayMaster, sb = b.saju.dayMaster, ea = STEM_ELEMENT[sa], eb = STEM_ELEMENT[sb];
  const lead = `일간은 태어난 날의 하늘 글자로, 그 사람의 중심 기운이에요. ${a.name}의 ${josa(stemLabel(sa), "과와")} ${b.name}의 ${josa(stemLabel(sb), "은는")}`;
  if (STEM_HAP_TABLE.some(r => (r.pair[0] === sa && r.pair[1] === sb) || (r.pair[0] === sb && r.pair[1] === sa))) return { tier: "hap" as const, reason: `${lead} 서로 끌어당겨 하나로 묶이는 천간합이라, 처음부터 마음이 잘 끌리는 짝이에요.` };
  if (GENERATES[ea] === eb || GENERATES[eb] === ea) {
    const [X, Y, x, y] = GENERATES[ea] === eb ? [a.name, b.name, ea, eb] : [b.name, a.name, eb, ea];
    return { tier: "generate" as const, reason: `${lead} ${ko(x)} 기운이 ${ko(y)} 기운을 키워 주는 상생이라, ${josa(X, "이가")} 북돋우면 ${josa(Y, "이가")} 힘을 얻는 흐름이에요.` };
  }
  if (ea === eb) return { tier: "same" as const, reason: sa === sb ? `일간은 태어난 날의 하늘 글자로, 그 사람의 중심 기운이에요. ${josa(a.name, "과와")} ${b.name}의 일간은 둘 다 ${ira(stemLabel(sa))}, 서로를 거울처럼 알아보지만 같은 데서 고집이 부딪히기도 해요.`
    : `${lead} 둘 다 ${ko(ea)} 기운이라 서로를 거울처럼 알아보지만, 같은 데서 고집이 부딪히기도 해요.` };
  const [X, Y, x, y] = CONTROLS[ea] === eb ? [a.name, b.name, ea, eb] : [b.name, a.name, eb, ea];
  return { tier: "control" as const, reason: `${lead} ${ko(x)} 기운이 ${ko(y)} 기운을 누르는 상극이라, ${josa(X, "이가")} 기준을 세우면 ${josa(Y, "은는")} 눌린다고 느낄 수 있어 말의 세기를 맞추면 편해져요.` };
}

// ---------- 생활 자리(일지)·자란 환경·사회 자리(연지·월지) ----------
export type BranchTier = "hap" | "hapMixed" | "none" | "friction" | "clash";
const HAP: readonly RelationKind[] = ["YUKHAP", "SAMHAP"], CLASH: readonly RelationKind[] = ["CHUNG", "WONJIN"], FRICTION: readonly RelationKind[] = ["HYEONG", "PA", "HAE"];
// 최종판3 7: 반합 이름은 궁합 관계 목록·대운·세운 카드와 같은 문구(labels.HALF_HAP_PLAIN — "완성" 아님). 점수 단계는 그대로(반합 = 합 단계).
const relName = (k: RelationKind) => (k === "SAMHAP" ? HALF_HAP_PLAIN : REL_PLAIN[k]);
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
  return { tier: r.tier, reason: `일지는 태어난 날의 땅 글자로, 매일의 생활 감각과 가장 가까운 사람을 대하는 방식이 담긴 자리예요. ${branchLine("일지", a.name, b.name, x, y, r)}.` };
}
function yearMonthItem(a: CompatSide, b: CompatSide) {
  const yx = a.saju.pillars.year.branch, yy = b.saju.pillars.year.branch, mx = a.saju.pillars.month.branch, my = b.saju.pillars.month.branch;
  const yr = branchTier(yx, yy), mo = branchTier(mx, my);
  return { tier: [yr.tier, mo.tier] as const,
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
  const flow = flowOf(a.saju.dayMaster, b.saju.dayMaster), fit = roleFit(category, a.gender, b.gender);
  const samePol = STEM_YIN_YANG[a.saju.dayMaster] === STEM_YIN_YANG[b.saju.dayMaster];
  const tier: RoleTier = fit.ideal.includes(flow) ? (samePol === fit.samePolarity ? "exact" : "near") : flow === "peer" ? "peer" : flow === "aGenerates" || flow === "bGenerates" ? "generate" : "other";
  const ab = getTenGod(b.saju.dayMaster, a.saju.dayMaster), ba = getTenGod(a.saju.dayMaster, b.saju.dayMaster);
  const verdict = tier === "exact" ? "그 자리와 꼭 맞아요" : tier === "near" ? "그 자리와 거의 맞아요" : `그 자리와는 다르게 ${ROLE[ab]}에 가까운 사이예요`;
  const applied = ab === ba ? `두 사람은 서로에게 ${ira(tenGodLabel(ab))}` : `${b.name}에게 ${josa(a.name, "은는")} ${tenGodLabel(ab)}, ${a.name}에게 ${josa(b.name, "은는")} ${ira(tenGodLabel(ba))}`;
  return { tier, reason: `십성은 한 사람의 일간에서 본 상대 기운의 역할로, ${fit.principle} ${applied}, ${verdict}.` };
}

// ---------- 음양 균형 ----------
function yinYangItem(a: CompatSide, b: CompatSide) {
  const yin = a.saju.yinYang.yin + b.saju.yinYang.yin, yang = a.saju.yinYang.yang + b.saju.yinYang.yang;
  const gap = Math.abs(yin - yang) / (yin + yang || 1), step = gap <= 0.125 ? 0 : gap <= 0.25 ? 1 : gap <= 0.375 ? 2 : 3, side = yin > yang ? "음" : "양";
  const count = `음 글자가 ${yin}개, 양 글자가 ${yang}개`;
  const applied = step === 0 ? `둘을 합치면 ${count}로 고르게 맞아요.` : step === 1 ? `둘을 합치면 ${count}로 ${side} 쪽으로 조금 기울어요.` : `둘을 합치면 ${count}로 ${josa(side, "이가")} 많아 같은 리듬으로 쏠리기 쉬워요.`;
  return { tier: step, reason: `음양은 차분히 모으는 음과 밖으로 뻗는 양으로, 두 사람의 글자를 합쳐 고르면 함께 있을 때 한쪽으로 쏠리지 않아요. ${applied}` };
}

// ---------- MBTI ----------
/** 인지기능 순서(주·부·3차·열등). 통용되는 Myers-Briggs 기능 위계. */
export const FUNCTION_STACK: Record<MbtiType, readonly [string, string, string, string]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"], INTP: ["Ti", "Ne", "Si", "Fe"], ENTJ: ["Te", "Ni", "Se", "Fi"], ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"], INFP: ["Fi", "Ne", "Si", "Te"], ENFJ: ["Fe", "Ni", "Se", "Ti"], ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"], ISFJ: ["Si", "Fe", "Ti", "Ne"], ESTJ: ["Te", "Si", "Ne", "Fi"], ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"], ISFP: ["Fi", "Se", "Ni", "Te"], ESTP: ["Se", "Ti", "Fe", "Ni"], ESFP: ["Se", "Fi", "Te", "Ni"],
};
/** MBTI 세 부분의 단계(문서 §2-7). 리듬 = (J/P 다름 ? 2 : 0) + (E/I 다름 ? 1 : 0). */
function mbtiTier(x: MbtiType, y: MbtiType): MbtiTier {
  const fa = FUNCTION_STACK[x], fb = FUNCTION_STACK[y];
  const flipped = (p: string, q: string) => p[0] === q[0] && p[1] !== q[1];
  const golden = flipped(fa[0], fb[0]) && flipped(fa[1], fb[1]);
  const shared = [fa[0], fa[1]].some(f => f === fb[0] || f === fb[1]);
  const mirror = fa[0] === fb[3] || fb[0] === fa[3];
  return { talk: x[1] === y[1] ? "talkSame" : "talkDiff", fn: golden ? "golden" : shared ? "shared" : mirror ? "mirror" : "plain", rhythm: (x[3] === y[3] ? 0 : 2) + (x[0] === y[0] ? 0 : 1) };
}
/** MBTI 세 부분 이름(v2.2, 문서 §9). 화면 이유 첫 문장에 "대화의 결 0/5 · 마음의 기능 2/5 · 에너지·생활 리듬 2/5"처럼 보인다. */
export const MBTI_PARTS = { talk: "대화의 결", fn: "마음의 기능", rhythm: "에너지·생활 리듬" } as const;
export type MbtiPart = keyof typeof MBTI_PARTS;
/**
 * MBTI 세 부분 점수(v2.2). 부분 만점 = MBTI 배점 / 3(15 → 5, 친구 18 → 6), 부분 점수 = round(TIERS 비율 × 부분 만점).
 * MBTI 항목 점수 = 세 부분 점수 합이라, 이유 문장에 보이는 부분 점수를 더하면 언제나 항목 점수가 된다.
 */
export function mbtiParts(t: MbtiTier, max: number, T: Tiers = TIERS): { readonly max: number; readonly points: Readonly<Record<MbtiPart, number>> } {
  const m = max / 3;
  return { max: m, points: { talk: Math.round(T.mbti[t.talk] * m), fn: Math.round(T.mbti[t.fn] * m), rhythm: Math.round(T.mbti.rhythm[t.rhythm] * m) } };
}
/** 부분 점수의 결: 만점 대비 0.7 이상 = 강점, 0.3 미만(0/5·1/5) = 먼저 맞춰 갈 부분, 그 사이 = 무난. 문장의 결은 단계가 아니라 이 점수로 고른다(점수와 말이 어긋나지 않게). */
type PartLevel = "high" | "mid" | "low";
const partLevel = (p: number, max: number): PartLevel => (p / max >= 0.7 ? "high" : p / max < 0.3 ? "low" : "mid");
/** good: 강점·무난(이어지는 꼴 …하고 / 끝나는 꼴 …해요). low: 먼저 맞춰 갈 부분(…하고 / …하니 + 맞춰 갈 거리). */
type PartText = { readonly kind: "good"; readonly and: string; readonly end: string } | { readonly kind: "low"; readonly and: string; readonly so: string; readonly task: string };
const good = (and: string, end: string): PartText => ({ kind: "good", and, end });
const low = (and: string, so: string, task: string): PartText => ({ kind: "low", and, so, task });
function talkText(x: MbtiType, y: MbtiType, aName: string, bName: string, level: PartLevel): PartText {
  if (x[1] === y[1]) {
    const head = x[1] === "N" ? "둘 다 N이라 대화가 생각과 가능성 쪽으로" : "둘 다 S라 대화가 구체적인 사실과 경험 쪽으로";
    if (level === "low") return low(`${head} 쏠려 이야기가 한쪽으로만 흐르기 쉽고`, `${head} 쏠려 이야기가 한쪽으로만 흐르기 쉬우니`, "이야기의 폭");
    return level === "high" ? good(`${head} 잘 흐르고`, `${head} 잘 흘러요`) : good(`${head} 흐르는 편이고`, `${head} 흐르는 편이에요`);
  }
  const [n, s] = x[1] === "N" ? [aName, bName] : [bName, aName];
  const head = `대화의 결이 달라 ${josa(n, "은는")} 큰 그림부터, ${josa(s, "은는")} 구체적인 사실부터 말하`;
  if (level === "low") return low(`${head}고`, `${head}니`, "말의 순서");
  const fill = `대화의 결은 달라도 ${josa(n, "은는")} 큰 그림을, ${josa(s, "은는")} 구체적인 사실을 보태`;
  return good(`${fill} 주고`, `${fill} 줘요`);
}
function fnText(fn: MbtiTier["fn"], level: PartLevel): PartText {
  if (level === "low") return fn === "mirror"
    ? low("한 사람이 가장 잘 쓰는 마음의 기능이 다른 사람에게는 가장 낯설어 답답할 때가 있고", "한 사람이 가장 잘 쓰는 마음의 기능이 다른 사람에게는 가장 낯설어 답답할 때가 있으니", "서로의 생각 방식")
    : low("마음의 기능이 서로 잘 맞물리지 않고", "마음의 기능이 서로 잘 맞물리지 않으니", "서로의 생각 방식");
  const [and, end] = {
    golden: ["주로 쓰는 마음의 기능이 같은 축에서 방향만 반대라 서로의 빈칸을 채워 주고", "주로 쓰는 마음의 기능이 같은 축에서 방향만 반대라 서로의 빈칸을 채워 줘요"],
    shared: ["가장 자주 쓰는 마음의 기능이 겹쳐 말이 빨리 통하고", "가장 자주 쓰는 마음의 기능이 겹쳐 말이 빨리 통해요"],
    plain: ["마음의 기능이 겹치지도 부딪치지도 않아 큰 걸림 없이 어울리고", "마음의 기능이 겹치지도 부딪치지도 않아 큰 걸림 없이 어울려요"],
    mirror: ["한 사람이 가장 잘 쓰는 마음의 기능이 다른 사람에게는 가장 낯설어 서로 배울 게 많고", "한 사람이 가장 잘 쓰는 마음의 기능이 다른 사람에게는 가장 낯설어 서로 배울 게 많아요"],
  }[fn];
  return good(and, end);
}
function rhythmText(x: MbtiType, rhythm: number, level: PartLevel): PartText {
  const plan = x[3] === "J" ? "계획을 세우는" : "그때그때 맞춰 가는";
  if (level === "low") return [
    low(`에너지를 쓰는 방향도 ${plan} 생활 리듬도 같아 같은 데서 함께 지치기 쉽고`, `에너지를 쓰는 방향도 ${plan} 생활 리듬도 같아 같은 데서 함께 지치기 쉬우니`, "쉬는 때를 나누는 일"),
    low(`${plan} 생활 리듬은 같지만 에너지를 쓰는 방향이 달라 쉬는 방식이 엇갈리고`, `${plan} 생활 리듬은 같지만 에너지를 쓰는 방향이 달라 쉬는 방식이 엇갈리니`, "쉬는 방식"),
    low(`둘 다 ${x[0]}라 에너지를 쓰는 방향은 같지만 한 사람은 계획을, 한 사람은 즉흥을 좋아하고`, `둘 다 ${x[0]}라 에너지를 쓰는 방향은 같지만 한 사람은 계획을, 한 사람은 즉흥을 좋아하니`, "일정을 짜는 방식"),
    low("에너지를 쓰는 방향도 계획과 즉흥의 생활 리듬도 다르고", "에너지를 쓰는 방향도 계획과 즉흥의 생활 리듬도 다르니", "하루의 박자"),
  ][rhythm];
  return [
    good(`에너지를 쓰는 방향도 ${plan} 생활 리듬도 같아 함께 움직이기 편하고`, `에너지를 쓰는 방향도 ${plan} 생활 리듬도 같아 함께 움직이기 편해요`),
    good(`에너지를 쓰는 방향은 달라도 ${plan} 생활 리듬이 같아 하루의 박자가 잘 맞고`, `에너지를 쓰는 방향은 달라도 ${plan} 생활 리듬이 같아 하루의 박자가 잘 맞아요`),
    good(`둘 다 ${x[0]}라 에너지를 쓰는 방향이 같아 계획과 즉흥의 차이만 맞추면 함께 지내기 편하고`, `둘 다 ${x[0]}라 에너지를 쓰는 방향이 같아 계획과 즉흥의 차이만 맞추면 함께 지내기 편해요`),
    good("에너지를 쓰는 방향도 생활 리듬도 달라 서로에게 없는 박자를 보태 주고", "에너지를 쓰는 방향도 생활 리듬도 달라 서로에게 없는 박자를 보태 줘요"),
  ][rhythm];
}
/**
 * MBTI 이유(v2.2): ① 개념 + 부분 점수, ② 강점·무난한 부분(점수 높은 순), ③ 0/5·1/5 부분 = "가장 먼저 맞춰 갈 부분". 2~3문장.
 * 문장의 결은 부분 점수로 고른다: 0점 부분을 강점처럼 쓰지 않고, 높은 부분을 맞춰 갈 거리로 쓰지 않는다.
 */
function mbtiReason(a: CompatSide, b: CompatSide, x: MbtiType, y: MbtiType, t: MbtiTier, parts: ReturnType<typeof mbtiParts>): string {
  const order: readonly MbtiPart[] = ["talk", "fn", "rhythm"], p = parts.points;
  const level = (k: MbtiPart) => partLevel(p[k], parts.max);
  const text: Record<MbtiPart, PartText> = { talk: talkText(x, y, a.name, b.name, level("talk")), fn: fnText(t.fn, level("fn")), rhythm: rhythmText(x, t.rhythm, level("rhythm")) };
  const goods = order.filter(k => text[k].kind === "good").sort((k, l) => p[l] - p[k]).map(k => text[k] as Extract<PartText, { kind: "good" }>);
  const lows = order.filter(k => text[k].kind === "low").map(k => text[k] as Extract<PartText, { kind: "low" }>);
  const lead = `${x}인 ${josa(a.name, "과와")} ${y}인 ${josa(b.name, "은는")}`;
  const tasks = lows.map(l => l.task), taskLine = tasks.length === 1 ? tasks[0] : `${josa(tasks.slice(0, -1).join(", "), "과와")} ${tasks.at(-1)}`;
  const breakdown = order.map(k => `${MBTI_PARTS[k]} ${p[k]}/${parts.max}`).join(" · ");
  return [
    `MBTI는 대화의 결(N/S), 마음이 먼저 쓰는 기능, 에너지와 생활 리듬(E/I·J/P)을 나눠 봐요(${breakdown}).`,
    goods.length ? `${lead} ${goods.map((g, i) => (i < goods.length - 1 ? g.and : g.end)).join(", ")}.` : "",
    lows.length ? `${goods.length ? "다만" : lead} ${lows.map((l, i) => (i < lows.length - 1 ? l.and : l.so)).join(", ")}, ${josa(taskLine, "이가")} ${tasks.length === 1 ? "가장 " : ""}먼저 맞춰 갈 부분이에요.` : "",
  ].filter(Boolean).join(" ");
}

// ---------- 방향 지표(브리프·결정론 작가용) ----------
/** from이 to에게 어떤 사람인가: to의 일간 기준 from 일간의 십성. */
function direction(from: CompatSide, to: CompatSide, gives: FiveElement | null): CompatDirection {
  const tg = getTenGod(to.saju.dayMaster, from.saju.dayMaster);
  return { tenGod: tenGodLabel(tg), role: `${to.name}에게 ${josa(from.name, "은는")} ${ROLE[tg]}`, gives: gives ? `${from.name}의 ${ko(gives)} 기운이 ${to.name}에게 모자란 쪽을 채워 줌` : null };
}

const levelOf = (frac: number): CompatItem["level"] => (frac >= 0.75 ? "좋음" : frac <= 0.4 ? "조율" : "보통");

type Tiers = typeof BASE_TIERS;
export type RoleTier = keyof Tiers["role"];
/** 항목마다 고른 단계(점수 = 만점 × TIERS 비율). 보정 도구가 같은 단계로 다른 비율표를 잴 수 있게 점수와 따로 둔다. */
export type CompatTiers = {
  readonly element: keyof Tiers["element"]; readonly dayMaster: keyof Tiers["dayMaster"]; readonly dayBranch: BranchTier;
  /** [연지, 월지] */ readonly yearMonth: readonly [BranchTier, BranchTier]; readonly role: RoleTier; readonly yinYang: number;
  readonly mbti: MbtiTier | null;
};
export type MbtiTier = { readonly talk: "talkSame" | "talkDiff"; readonly fn: "golden" | "shared" | "plain" | "mirror"; readonly rhythm: number };
/** 단계 → 만점 대비 비율. 연·월지는 YEAR_SHARE로 섞고, MBTI는 세 부분 평균(점수는 itemPoints: 세 부분 점수 합). */
export function itemFractions(category: CompatCategory, t: CompatTiers, T: Tiers = TIERS): Partial<Record<ItemKey, number>> {
  const w = YEAR_SHARE[category];
  return { element: T.element[t.element], dayMaster: T.dayMaster[t.dayMaster], dayBranch: T.dayBranch[t.dayBranch], yearMonth: w * T.yearMonth[t.yearMonth[0]] + (1 - w) * T.yearMonth[t.yearMonth[1]],
    role: T.role[t.role], yinYang: T.yinYang[t.yinYang], ...(t.mbti ? { mbti: (T.mbti[t.mbti.talk] + T.mbti[t.mbti.fn] + T.mbti.rhythm[t.mbti.rhythm]) / 3 } : {}) };
}
/** 항목 만점. MBTI가 없으면 MBTI 몫을 사주 항목 만점 비율대로 나눠 합 60을 지킨다(가장 큰 나머지부터 1점씩, 같으면 앞 항목).
 * 그래서 화면의 항목 점수 합은 언제나 총점 − 40이다. */
export function itemMax(category: CompatCategory, withMbti: boolean): Partial<Record<ItemKey, number>> {
  const m = ITEM_MAX[category];
  if (withMbti) return { ...m };
  const keys = (Object.keys(m) as ItemKey[]).filter(k => k !== "mbti"), full = keys.reduce((n, k) => n + m[k], 0);
  const raw = keys.map(k => m[k] * 60 / full), out = raw.map(Math.floor);
  const order = keys.map((_, i) => i).sort((x, y) => raw[y] - out[y] - (raw[x] - out[x]) || x - y);
  for (let i = 0, left = 60 - out.reduce((n, x) => n + x, 0); i < left; i++) out[order[i]]++;
  return Object.fromEntries(keys.map((k, i) => [k, out[i]]));
}

/** 항목 점수(화면 막대). 사주 항목 = round(비율 × 만점), MBTI = 세 부분 점수 합(mbtiParts). 총점 = 40 + 합. 보정 도구도 이 함수로 잰다. */
export function itemPoints(category: CompatCategory, t: CompatTiers, T: Tiers = TIERS): Partial<Record<ItemKey, number>> {
  const f = itemFractions(category, t, T), max = itemMax(category, !!t.mbti);
  return Object.fromEntries((Object.keys(max) as ItemKey[]).map(k => {
    if (k !== "mbti" || !t.mbti) return [k, Math.round(f[k]! * max[k]!)];
    const p = mbtiParts(t.mbti, max.mbti!, T).points;
    return [k, p.talk + p.fn + p.rhythm];
  }));
}

export function computeCompatScore(category: CompatCategory, a: CompatSide, b: CompatSide): CompatScore {
  const el = elementItem(a, b), dm = dayMasterItem(a, b), db = dayBranchItem(a, b), ym = yearMonthItem(a, b), ro = roleItem(a, b, category), yy = yinYangItem(a, b);
  const mt = a.mbti && b.mbti ? mbtiTier(a.mbti, b.mbti) : null;
  const tiers: CompatTiers = { element: el.tier, dayMaster: dm.tier, dayBranch: db.tier, yearMonth: ym.tier, role: ro.tier, yinYang: yy.tier, mbti: mt };
  const frac = itemFractions(category, tiers), max = itemMax(category, !!mt), pts = itemPoints(category, tiers);
  const reasons: Partial<Record<ItemKey, string>> = { element: el.reason, dayMaster: dm.reason, dayBranch: db.reason, yearMonth: ym.reason, role: ro.reason, yinYang: yy.reason,
    ...(mt ? { mbti: mbtiReason(a, b, a.mbti!, b.mbti!, mt, mbtiParts(mt, max.mbti!)) } : {}) };
  // 수준(좋음·보통·조율): MBTI는 화면 점수(세 부분 합) 기준, 사주 항목은 비율 기준.
  const items = (Object.keys(max) as ItemKey[]).map(key => ({ key, name: ITEM_NAMES[key], points: pts[key]!, max: max[key]!, level: levelOf(key === "mbti" ? pts[key]! / max[key]! : frac[key]!), reason: reasons[key]! }));
  const total = BASE_SCORE + items.reduce((n, i) => n + i.points, 0), scaled = !mt;
  const notice = scaled ? `두 사람의 명리를 정해진 규칙으로 계산했어요. MBTI를 다 알지 못해 MBTI 항목은 빼고, 그 ${ITEM_MAX[category].mbti}점을 사주 항목에 나눠 기본 40점에 여섯 항목(60점 만점)의 점수를 더했어요.`
    : "두 사람의 명리와 MBTI를 정해진 규칙으로 계산했어요. 기본 40점에 일곱 항목(60점 만점)의 점수를 더했어요.";
  return { version: COMPAT_SCORE_VERSION, category, total, band: bandOf(total), items, scaled, notice, direction: { aToB: direction(a, b, el.ab), bToA: direction(b, a, el.ba) } };
}

/** 보정 도구용: 점수 없이 단계만. */
export function compatTiers(category: CompatCategory, a: CompatSide, b: CompatSide): CompatTiers {
  return { element: elementItem(a, b).tier, dayMaster: dayMasterItem(a, b).tier, dayBranch: dayBranchItem(a, b).tier, yearMonth: yearMonthItem(a, b).tier,
    role: roleItem(a, b, category).tier, yinYang: yinYangItem(a, b).tier, mbti: a.mbti && b.mbti ? mbtiTier(a.mbti, b.mbti) : null };
}
