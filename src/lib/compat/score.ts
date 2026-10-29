/**
 * v5 궁합 점수(P4). 결정론·설명 가능. 근거와 가중치: docs/v5/p4-compat-score.md.
 * 구성요소 6개(값 −1~1): ① 오행 보완 ② 일간 관계 ③ 일지(배우자궁) 관계 ④ 년지·월지 관계 ⑤ 두 사람 합산 음양 ⑥ MBTI.
 * 관계 유형 7종별 가중합 = 원점수(−1~1) → 유형별 단조 변환(분위 매듭, 무작위 1,000쌍 기준) → 35~95점.
 * 대칭: 모든 구성요소가 A·B 순서와 무관하므로 총점도 같다. A→B·B→A 방향 지표(십성 역할·채워 주는 기운)는 따로 낸다.
 * 기존 Book(v4 compatibilityIndex)의 점수는 바꾸지 않는다. 이 점수는 v5 브리프에서만 쓴다(버전 COMPAT_SCORE_VERSION).
 */
import type { MbtiType } from "@/data/knowledge-v5/schema";
import { ELEMENT_KO, josa } from "@/lib/brief/labels";
import { STEM_ELEMENT, STEM_YIN_YANG } from "@/lib/saju/constants";
import { natalEntries } from "@/lib/saju/detections/analyze";
import { ELEMENT_ORDER, judgeElementBalance } from "@/lib/saju/detections/elementBalance";
import { detectRelations } from "@/lib/saju/detections/relations";
import { STEM_HAP_TABLE } from "@/lib/saju/detections/tables";
import type { RelationHit } from "@/lib/saju/detections/types";
import { getTenGod } from "@/lib/saju/tenGods";
import type { EarthlyBranch, FiveElement, HeavenlyStem, SajuCalcResult } from "@/lib/saju/types";

export const COMPAT_SCORE_VERSION = "compat-score-v5-1" as const;
export type CompatCategory = "love" | "marriage" | "parentChild" | "coworker" | "managerReport" | "businessPartner" | "friendship";
export type ComponentKey = "element" | "dayMaster" | "dayBranch" | "yearMonth" | "yinYang" | "mbti";
export const COMPONENT_NAMES: Record<ComponentKey, string> = {
  element: "오행 보완", dayMaster: "타고난 중심 기운", dayBranch: "생활 자리(배우자 자리)", yearMonth: "자란 환경·사회 환경", yinYang: "음양 균형", mbti: "MBTI",
};

/** 관계 유형별 가중치(합 1). 근거: docs/v5/p4-compat-score.md §2. MBTI가 한쪽이라도 없으면 나머지로 다시 나눈다. */
export const CATEGORY_WEIGHTS: Record<CompatCategory, Record<ComponentKey, number>> = {
  love: { element: 0.17, dayMaster: 0.2, dayBranch: 0.2, yearMonth: 0.08, yinYang: 0.1, mbti: 0.25 },
  marriage: { element: 0.2, dayMaster: 0.15, dayBranch: 0.25, yearMonth: 0.15, yinYang: 0.1, mbti: 0.15 },
  parentChild: { element: 0.25, dayMaster: 0.25, dayBranch: 0.05, yearMonth: 0.15, yinYang: 0.1, mbti: 0.2 },
  coworker: { element: 0.2, dayMaster: 0.2, dayBranch: 0.05, yearMonth: 0.15, yinYang: 0.1, mbti: 0.3 },
  managerReport: { element: 0.2, dayMaster: 0.25, dayBranch: 0.05, yearMonth: 0.15, yinYang: 0.1, mbti: 0.25 },
  businessPartner: { element: 0.25, dayMaster: 0.2, dayBranch: 0.1, yearMonth: 0.15, yinYang: 0.1, mbti: 0.2 },
  friendship: { element: 0.15, dayMaster: 0.15, dayBranch: 0.1, yearMonth: 0.2, yinYang: 0.1, mbti: 0.3 },
};

/**
 * 원점수 → 점수 단조 변환 매듭(유형별). raw 분위 [0, 10, 50, 90, 100]% → [35, 45, 68, 88, 95]점, 사이는 직선.
 * tools/p4-compat/calibrate.ts가 무작위 1,000쌍(시드 20261029)으로 계산한 값을 고정했다. 매듭을 바꾸면 버전을 올린다.
 */
export const SCORE_POINTS = [35, 45, 68, 88, 95] as const;
export const RAW_KNOTS: Record<CompatCategory, readonly [number, number, number, number, number]> = {
  love: [-0.543, -0.156, 0.154, 0.419, 0.811],
  marriage: [-0.576, -0.171, 0.127, 0.381, 0.775],
  parentChild: [-0.488, -0.13, 0.187, 0.469, 0.838],
  coworker: [-0.507, -0.14, 0.176, 0.45, 0.814],
  managerReport: [-0.5, -0.135, 0.187, 0.46, 0.827],
  businessPartner: [-0.502, -0.142, 0.169, 0.443, 0.775],
  friendship: [-0.487, -0.147, 0.143, 0.398, 0.768],
};

/** 점수 구간과 본문 톤. 낮은 구간도 보완법을 반드시 쓰고, 이별을 권하지 않는다. */
export const SCORE_BANDS = [
  { min: 90, label: "타고난 짝", tone: "끌림과 편안함이 함께 있는 사이로 쓴다. 그래도 둘이 지킬 약속 하나는 쓴다", verdict: "끌림과 편안함이 함께 있는, 타고난 짝에 가까운 사이예요." },
  { min: 75, label: "잘 맞는 편", tone: "기본 합이 좋은 사이로 쓴다. 좋은 점을 먼저, 조율할 점은 짧고 구체적으로", verdict: "기본 합이 좋아 함께할수록 편해지는, 잘 맞는 편인 사이예요." },
  { min: 60, label: "맞춰 가면 좋아지는", tone: "잘 맞는 점과 맞출 점이 함께 있는 사이로 쓴다. 맞추는 방법을 장면으로 구체적으로", verdict: "잘 맞는 점과 맞출 점이 함께 있어, 맞춰 가면 좋아지는 사이예요." },
  { min: 45, label: "노력이 필요한", tone: "다른 점이 많은 사이로 솔직하게 쓰되, 차이를 역할로 나누는 보완법을 반드시 쓴다", verdict: "다른 점이 많아 노력이 필요한 사이지만, 차이를 역할로 나누면 서로에게 배울 거리가 많아요." },
  { min: 0, label: "서로 다른 세계", tone: "서로 다른 세계에서 온 두 사람으로 쓴다. 다름이 배울 거리가 되는 법과 보완법을 반드시 쓴다", verdict: "서로 다른 세계에서 온 두 사람이라, 다름을 배울 거리로 삼을 때 관계가 단단해져요." },
] as const;
export type ScoreBand = (typeof SCORE_BANDS)[number];
export const bandOf = (score: number): ScoreBand => SCORE_BANDS.find(b => score >= b.min)!;

export type CompatSide = { readonly saju: SajuCalcResult; readonly name: string; readonly mbti: MbtiType | null };
export type ConventionalFit = (a: MbtiType, b: MbtiType) => "좋음" | "보통" | "노력" | null;
export type CompatComponent = { readonly key: ComponentKey; readonly name: string; readonly weight: number; readonly value: number; readonly level: "좋음" | "보통" | "조율"; readonly line: string };
export type CompatDirection = { readonly tenGod: string; readonly role: string; readonly gives: string | null };
export type CompatScore = {
  readonly version: typeof COMPAT_SCORE_VERSION; readonly category: CompatCategory;
  readonly total: number; readonly raw: number; readonly band: ScoreBand;
  readonly components: readonly CompatComponent[];
  readonly direction: { readonly aToB: CompatDirection; readonly bToA: CompatDirection };
};

const clamp = (x: number, lo = -1, hi = 1) => Math.min(hi, Math.max(lo, x));
const r2 = (x: number) => Math.round(x * 100) / 100;
const levelOf = (v: number): CompatComponent["level"] => (v >= 0.25 ? "좋음" : v <= -0.25 ? "조율" : "보통");
const ko = (e: FiveElement) => ELEMENT_KO[e];
const GENERATES: Record<FiveElement, FiveElement> = { WOOD: "FIRE", FIRE: "EARTH", EARTH: "METAL", METAL: "WATER", WATER: "WOOD" };
const CONTROLS: Record<FiveElement, FiveElement> = { WOOD: "EARTH", EARTH: "WATER", WATER: "FIRE", FIRE: "METAL", METAL: "WOOD" };

// ---------- ① 오행 보완 ----------
/** 얼마나 필요한가(비율 15% 이상 0, 0%면 1). */
const need = (s: number) => clamp((0.15 - s) / 0.15, 0, 1);
/** 얼마나 줄 수 있는가(15% 이하 0, 35% 이상 1). */
const give = (s: number) => clamp((s - 0.15) / 0.2, 0, 1);
/** 같은 쪽으로 쏠림(25% 이하 0, 40% 이상 1). */
const heavy = (s: number) => clamp((s - 0.25) / 0.15, 0, 1);

type Shares = Readonly<Record<FiveElement, number>>;
function fills(to: Shares, from: Shares): { amount: number; element: FiveElement | null } {
  let amount = 0, best: FiveElement | null = null, top = 0;
  for (const e of ELEMENT_ORDER) { const x = need(to[e]) * give(from[e]); amount += x; if (x > top) { top = x; best = e; } }
  return { amount: Math.min(1, amount), element: top > 0.05 ? best : null };
}
function elementComponent(a: Shares, b: Shares, A: string, B: string): { value: number; line: string; ab: FiveElement | null; ba: FiveElement | null } {
  const ab = fills(b, a), ba = fills(a, b); // ab: A가 B에게 채워 줌
  let clash = 0, clashE: FiveElement | null = null, shared = 0, sharedE: FiveElement | null = null;
  for (const e of ELEMENT_ORDER) {
    const c = heavy(a[e]) * heavy(b[e]); if (c > clash) { clash = c; clashE = e; }
    const s = need(a[e]) * need(b[e]); if (s > shared) { shared = s; sharedE = e; }
  }
  const value = r2(clamp(0.8 * (ab.amount + ba.amount) - 0.9 * clash - 0.5 * shared));
  // "적은 편인": 보완 원소는 비율로 고른다. 브리프의 '가장 부족한 기운'(한 개)과 다를 수 있어 "부족한"으로 쓰면 모순처럼 읽힌다(P3.6 B).
  const line = ab.element && ba.element ? `${A}에게 적은 편인 ${josa(ko(ba.element), "을를")} ${josa(B, "이가")}, ${B}에게 적은 편인 ${josa(ko(ab.element), "을를")} ${josa(A, "이가")} 채워 주는 사이예요`
    : ba.element ? `${A}에게 적은 편인 ${ko(ba.element)} 기운을 ${B}의 넉넉한 ${josa(ko(ba.element), "이가")} 채워 줘요`
      : ab.element ? `${B}에게 적은 편인 ${ko(ab.element)} 기운을 ${A}의 넉넉한 ${josa(ko(ab.element), "이가")} 채워 줘요`
        : clashE && clash >= 0.3 ? `둘 다 ${ko(clashE)} 기운이 많아 같은 쪽으로 쏠리기 쉬워요`
          : sharedE && shared >= 0.3 ? `둘 다 ${ko(sharedE)} 기운이 적어 함께 채울 거리가 같아요`
            : "기운의 많고 적음이 크게 겹치지도, 서로 채워 주지도 않는 무난한 사이예요";
  return { value, line: clashE && clash >= 0.3 && (ab.element || ba.element) ? `${line}. 다만 둘 다 ${ko(clashE)} 기운이 많아 같은 쪽으로 쏠리기도 해요` : line, ab: ab.element, ba: ba.element };
}

// ---------- ② 일간 관계 ----------
function dayMasterComponent(a: HeavenlyStem, b: HeavenlyStem, A: string, B: string): { value: number; line: string } {
  const ea = STEM_ELEMENT[a], eb = STEM_ELEMENT[b], samePol = STEM_YIN_YANG[a] === STEM_YIN_YANG[b];
  if (STEM_HAP_TABLE.some(r => (r.pair[0] === a && r.pair[1] === b) || (r.pair[0] === b && r.pair[1] === a))) return { value: 1, line: "태어난 날의 중심 기운이 서로 끌어당겨 하나로 묶이는 짝(천간합)이에요" };
  if (GENERATES[ea] === eb) return { value: 0.6, line: `${A}의 ${ko(ea)} 기운이 ${B}의 ${ko(eb)} 기운을 키워 주는 흐름(상생)이에요` };
  if (GENERATES[eb] === ea) return { value: 0.6, line: `${B}의 ${ko(eb)} 기운이 ${A}의 ${ko(ea)} 기운을 키워 주는 흐름(상생)이에요` };
  if (ea === eb) return a === b ? { value: 0.2, line: `둘 다 같은 ${ko(ea)} 기운이라 서로를 거울처럼 알아보지만, 같은 데서 고집이 붙기도 해요` } : { value: 0.35, line: `같은 ${ko(ea)} 기운의 음과 양이라 나란히 걷는 동료처럼 통해요` };
  const [x, y, X, Y] = CONTROLS[ea] === eb ? [ea, eb, A, B] : [eb, ea, B, A];
  return { value: samePol ? -0.6 : -0.3, line: `${X}의 ${ko(x)} 기운이 ${Y}의 ${ko(y)} 기운을 다잡는 흐름(상극)이라 ${samePol ? "속도와 주도권을 맞추는 약속이 필요해요" : "기준을 세워 주되 말의 세기를 조절하면 좋아요"}` };
}

// ---------- ③④ 지지 관계 ----------
const BRANCH_POS: Partial<Record<RelationHit["kind"], number>> = { YUKHAP: 1, SAMHAP: 0.6 };
const BRANCH_NEG: Partial<Record<RelationHit["kind"], number>> = { CHUNG: -1, HYEONG: -0.6, HAE: -0.5, WONJIN: -0.4, PA: -0.3 };
const BRANCH_LINE: Record<string, string> = {
  YUKHAP: "손을 맞잡듯 붙는 자리(육합)", SAMHAP: "같은 목표로 모이는 자리(반합)", SAME: "같은 글자라 생활 감각이 닮은 자리",
  CHUNG: "정면으로 부딪치는 자리(충)", HYEONG: "말투와 기준이 서로를 긁기 쉬운 자리(형)", HAE: "작은 서운함이 쌓이기 쉬운 자리(해)", WONJIN: "괜히 신경이 쓰이는 자리(원진)", PA: "약속이 어긋나기 쉬운 자리(파)",
};
/** 두 지지 한 쌍: 가장 좋은 합 하나 + 가장 센 부딪힘 하나(같은 쌍의 해·원진 중복 감점 방지). */
export function branchPair(x: EarthlyBranch, y: EarthlyBranch): { value: number; pos: string | null; neg: string | null } {
  const hits = detectRelations([{ position: "year", pillar: { stem: "甲", branch: x } }, { position: "month", pillar: { stem: "甲", branch: y } }]).filter(h => h.kind !== "STEM_HAP");
  let pos = 0, neg = 0, posK: string | null = null, negK: string | null = null;
  for (const h of hits) {
    const p = BRANCH_POS[h.kind] ?? 0, n = h.kind === "HYEONG" && h.subtype === "자형" ? -0.4 : BRANCH_NEG[h.kind] ?? 0;
    if (p > pos) { pos = p; posK = h.kind; }
    if (n < neg) { neg = n; negK = h.kind; }
  }
  if (!posK && !negK && x === y) { pos = 0.2; posK = "SAME"; }
  return { value: pos + neg, pos: posK, neg: negK };
}
function branchLine(r: ReturnType<typeof branchPair>, place: string): string {
  if (r.pos && r.neg) return `${place}가 ${BRANCH_LINE[r.pos]}이면서 ${BRANCH_LINE[r.neg]}이기도 해요`;
  if (r.pos) return `${place}가 ${BRANCH_LINE[r.pos]}예요`;
  if (r.neg) return `${place}가 ${BRANCH_LINE[r.neg]}라 거리와 속도를 조절하면 좋아요`;
  return `${place}끼리 특별히 당기지도 부딪치지도 않아요`;
}

// ---------- ⑤ 음양 ----------
function yinYangComponent(a: SajuCalcResult, b: SajuCalcResult): { value: number; line: string } {
  const yin = a.yinYang.yin + b.yinYang.yin, yang = a.yinYang.yang + b.yinYang.yang, total = yin + yang;
  if (!total) return { value: 0, line: "음양을 셀 글자가 부족해요" };
  const value = r2(clamp(2 * (1 - Math.abs(yin - yang) / total) - 1));
  const side = yin > yang ? "음" : "양";
  return { value, line: Math.abs(yin - yang) <= total * 0.125 ? `둘을 합치면 음과 양이 ${yin}:${yang}로 고르게 맞아요` : `둘을 합치면 ${side}의 글자가 ${Math.max(yin, yang)}:${Math.min(yin, yang)}로 많아 같은 리듬으로 쏠리기 쉬워요` };
}

// ---------- ⑥ MBTI ----------
/** 인지기능 순서(주·부·3차·열등). 통용되는 Myers-Briggs 기능 위계. */
export const FUNCTION_STACK: Record<MbtiType, readonly [string, string, string, string]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"], INTP: ["Ti", "Ne", "Si", "Fe"], ENTJ: ["Te", "Ni", "Se", "Fi"], ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"], INFP: ["Fi", "Ne", "Si", "Te"], ENFJ: ["Fe", "Ni", "Se", "Ti"], ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"], ISFJ: ["Si", "Fe", "Ti", "Ne"], ESTJ: ["Te", "Si", "Ne", "Fi"], ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"], ISFP: ["Fi", "Se", "Ni", "Te"], ESTP: ["Se", "Ti", "Fe", "Ni"], ESFP: ["Se", "Fi", "Te", "Ni"],
};
const LETTER_SCORE = [-0.4, 0, 0.4, 0.3, 0.1] as const;
function mbtiComponent(a: MbtiType, b: MbtiType, conv: ConventionalFit | undefined): { value: number; line: string } {
  const fa = FUNCTION_STACK[a], fb = FUNCTION_STACK[b];
  const flipped = (x: string, y: string) => x[0] === y[0] && x[1] !== y[1];
  const golden = flipped(fa[0], fb[0]) && flipped(fa[1], fb[1]);
  const sharedTop = [fa[0], fa[1]].filter(f => f === fb[0] || f === fb[1]).length;
  const mirror = Number(fa[0] === fb[3]) + Number(fb[0] === fa[3]);
  const fn = golden ? 1 : clamp(0.35 * sharedTop - 0.3 * mirror);
  const shared = [...a].filter((c, i) => b[i] === c).length;
  const letters = clamp(LETTER_SCORE[shared] + (a[1] === b[1] ? 0.2 : 0));
  const fitScore = (f: ReturnType<ConventionalFit>) => (f === "좋음" ? 1 : f === "노력" ? -1 : 0);
  const fits = conv ? [conv(a, b), conv(b, a)].filter(Boolean) : [];
  const c = fits.length ? fits.reduce((n, f) => n + fitScore(f), 0) / fits.length : 0;
  const value = r2(clamp(0.45 * c + 0.35 * fn + 0.2 * letters));
  const line = golden ? `${a}와 ${b}는 생각의 축이 같고 방향만 반대라, 서로의 빈칸을 채우는 조합이에요`
    : mirror ? `한 사람이 가장 잘 쓰는 마음의 기능이 다른 사람에게는 가장 낯선 기능이라, 서로가 신기하면서도 답답할 수 있어요`
      : sharedTop ? `가장 자주 쓰는 마음의 기능을 함께 써서 말이 빨리 통하는 조합이에요`
        : c > 0 ? `${a}와 ${b}는 흔히 잘 맞는다고 하는 조합(통념)이에요`
          : c < 0 ? `${a}와 ${b}는 생각하는 순서가 달라 맞춰 갈 게 있는 조합이에요`
            : `${shared}글자가 같아 닮은 점과 다른 점이 섞인 조합이에요`;
  return { value, line };
}

// ---------- 방향 지표 ----------
const ROLE: Record<string, string> = {
  比肩: "나란히 걷는 같은 편", 劫財: "어깨를 겨루며 함께 뛰는 동료",
  食神: "마음을 편하게 쏟게 만드는 사람", 傷官: "말과 재주를 꺼내게 만드는 사람",
  偏財: "챙기고 이끌어 주고 싶어지는 사람", 正財: "차곡차곡 아끼고 지키고 싶은 사람",
  偏官: "긴장감을 주며 크게 단련시키는 사람", 正官: "기준을 세워 주고 바로잡아 주는 사람",
  偏印: "남다른 시선으로 생각을 넓혀 주는 사람", 正印: "받쳐 주고 채워 주는 사람",
};
const TEN_GOD_KO: Record<string, string> = { 比肩: "비견", 劫財: "겁재", 食神: "식신", 傷官: "상관", 偏財: "편재", 正財: "정재", 偏官: "편관", 正官: "정관", 偏印: "편인", 正印: "정인" };
/** from이 to에게 어떤 사람인가: to의 일간 기준 from 일간의 십성. */
function direction(from: CompatSide, to: CompatSide, gives: FiveElement | null): CompatDirection {
  const tg = getTenGod(to.saju.dayMaster, from.saju.dayMaster);
  return { tenGod: `${TEN_GOD_KO[tg]}(${tg})`, role: `${to.name}에게 ${from.name}은 ${ROLE[tg]}`, gives: gives ? `${from.name}의 ${ko(gives)} 기운이 ${to.name}에게 적은 쪽을 채워 줌` : null };
}

/** 원점수 → 점수(유형별 분위 매듭, 단조 증가). */
export function rawToScore(raw: number, category: CompatCategory): number {
  const k = RAW_KNOTS[category], p = SCORE_POINTS;
  if (raw <= k[0]) return p[0];
  if (raw >= k[4]) return p[4];
  for (let i = 1; i < k.length; i++) if (raw <= k[i]) { const t = (raw - k[i - 1]) / (k[i] - k[i - 1] || 1); return Math.round(p[i - 1] + t * (p[i] - p[i - 1])); }
  return p[4];
}

export function computeCompatScore(category: CompatCategory, a: CompatSide, b: CompatSide, opts: { conventional?: ConventionalFit } = {}): CompatScore {
  const sa = judgeElementBalance(natalEntries(a.saju)).shares, sb = judgeElementBalance(natalEntries(b.saju)).shares;
  const el = elementComponent(sa, sb, a.name, b.name);
  const dm = dayMasterComponent(a.saju.dayMaster, b.saju.dayMaster, a.name, b.name);
  const day = branchPair(a.saju.pillars.day.branch, b.saju.pillars.day.branch);
  const yr = branchPair(a.saju.pillars.year.branch, b.saju.pillars.year.branch), mo = branchPair(a.saju.pillars.month.branch, b.saju.pillars.month.branch);
  const ym = r2(clamp((yr.value + mo.value) / 2));
  const yy = yinYangComponent(a.saju, b.saju);
  const mb = a.mbti && b.mbti ? mbtiComponent(a.mbti, b.mbti, opts.conventional) : null;
  const parts: { key: ComponentKey; value: number; line: string }[] = [
    { key: "element", value: el.value, line: el.line },
    { key: "dayMaster", value: dm.value, line: dm.line },
    { key: "dayBranch", value: r2(clamp(day.value)), line: branchLine(day, "두 사람의 생활 자리") },
    { key: "yearMonth", value: ym, line: Math.abs(yr.value) >= Math.abs(mo.value) ? branchLine(yr, "자란 환경의 자리") : branchLine(mo, "사회에서 움직이는 자리") },
    { key: "yinYang", value: yy.value, line: yy.line },
    ...(mb ? [{ key: "mbti" as const, value: mb.value, line: mb.line }] : []),
  ];
  const w = CATEGORY_WEIGHTS[category], wsum = parts.reduce((n, p) => n + w[p.key], 0);
  const components = parts.map(p => ({ key: p.key, name: COMPONENT_NAMES[p.key], weight: r2(w[p.key] / wsum), value: p.value, level: levelOf(p.value), line: p.line }));
  const raw = Math.round(components.reduce((n, c) => n + (w[c.key] / wsum) * c.value, 0) * 1000) / 1000;
  const total = rawToScore(raw, category);
  return { version: COMPAT_SCORE_VERSION, category, total, raw, band: bandOf(total), components, direction: { aToB: direction(a, b, el.ab), bToA: direction(b, a, el.ba) } };
}
