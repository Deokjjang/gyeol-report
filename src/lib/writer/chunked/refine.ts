/**
 * AM2-10 2부 — 카드 정제 층(세운·대운 작가 카드 경로만, 결정론 · 호출 0). 4종 경로 · 지식 DB 원문 · 공용 조건 판정(brief/conditions)은 읽기만 한다.
 * 카드는 「지식 DB 문단 원문 + 엔진 등급 라벨」이 아니라 「한 사람에 대한 일관된 사실」이어야 한다(덕짱님 결정 2026-11-16 설계 A).
 *  1. 원자 문장: DB 문단을 문장으로 쪼개 종류를 붙인다 — 성향 · 장면 · 처방 · 규칙 · 면책 · 메타 · 조건(0부 해석표 5번과 같은 규칙).
 *  2. 조건 해소: 원국 값에 걸린 조건(「비견까지 강하면」 「짝이 두 쌍 이상이면」)은 엔진 값으로 판정 — 참이면 이유 꼴로, 거짓이면 뺀다, 판정 못 하면 빼고 적는다.
 *  3. 종류 거름: 규칙 · 면책 · 메타는 뺀다. 처방은 원국 근거 줄에서 뗀다(처방은 설계도 처방 배분으로만).
 *  4. 값 → 뜻: 카드 · 설계도 핵심 주장의 등급 낱말(보통 · 약 · 강 · 오름 · 내림 · 세기)을 그 등급의 뜻 문장으로(등급은 화면에만).
 *  5. 입력 적용: 문장이 전제하는 입력(결혼 상태 · 자녀)이 고객 입력과 맞지 않으면 뺀다(기혼에게 「…에게 끌리기 쉬운」).
 *  6. 성향 반대 정리: 같은 사람 · 같은 차원 반대 끝은 약한 쪽(덜 구체적인 출처)을 뺀다 — 성격표 대조(G3) · 권당 16.
 *  7. 기조 한 줄: 달마다 흐름 말 · 오르는 영역 · 조심할 영역 · 공망을 한 함수로(화면 카드 · key 지시가 같은 줄).
 */
import { conditionClauses } from "@/lib/brief/conditions";
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import type { Inputs } from "@/lib/brief/premise";
import { profileCodes } from "@/lib/brief/pairProfile";
import { profilePoles } from "../safety/contradiction";
import { materialKey } from "../prompt/materials";
import CARD_TAGS from "./card-tags.json";
import W7_TAGS from "./w7-tags.json";

// ---------- 1. 원자 문장 · 종류 ----------
export type AtomKind = "trait" | "scene" | "rx" | "rule" | "disclaimer" | "meta" | "cond";
/** 문단 → 문장(「 · 」로 이은 마디도 나눈다). */
export const atomsOf = (text: string) => text.split(/ · |(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
/** 규칙: 산정 · 학파 메모(「년지는 보지 않습니다」 「인오술은 술, 신자진은 진…」 「한 번만 세지만」 「…있을 때 성립합니다」). */
export const RULE = /보지 않습니다|(?:만|를|을) 보고 다른 기둥|성립합니다|이루어지는 (?:관계|구성)입니다|(?:한 번만|따로) 셉니다|세지만|[가-힣]{3}은 [가-힣], [가-힣]{3}은 [가-힣]|처럼 붙은 자리끼리|(?:보조|그다음)으로 봅니다|물상으로 봅니다|먼저 보고 [가-힣]+(?:은|는) 그다음|기준으로 (?:셉|칩)니다|(?:에|이) 있을 때 (?:봅|성립)|해당 간지|(?:으로|로) 읽습니다|세지 않습니다/;
/** 면책: 「…의 확정이 아닙니다」 「…라는 뜻은 아닙니다」. */
export const DISCLAIMER = /(?:확정|결핍|단정)이 아닙니다|(?:뜻|말)[은이] 아닙니다|뜻이지 [^.]*아닙니다|깨진다고 보지 않습니다|사람마다 다릅니다|단정할 수 없|참고로만/;
/** 메타: 책 · 읽는 법 · 쓰는 법 말. */
export const META = /읽어 (?:주|보)세요|참고하세요|(?:으로|로) 쓰면 됩니다/;
/** 처방: 행동 권유 꼴(「…세요」 「…해 두면 힘이 덜 듭니다」 「'여기까지만 도와줘' 한마디가 …데려갑니다」). */
export const RX = /세요[.!]?$|(?:해|정해|잡아|적어|맞춰|나눠) 두면|두면 [^.]*(?:덜|지킵|남습|좋|편합|가볍)|한마디가 [^.]*(?:데려|바꿉|지킵)|습관이 [^.]*(?:지킵|지켜 줍)|(?:면|는 게|편이) 좋습니다|일정처럼 잡아|해 보세요/;
/** 장면: 때 · 자리가 있는 순간(「지적을 받은 날 밤에…」). 빼지 않는다(꼬리표만). */
export const SCENE = /(?:날|순간|밤|아침)(?:에는|에|이면)? |할 때마다|하는 날/;
/** 원국 값에 걸린 조건절을 가르는 낱말(생활 조건 「끌리는 사람이 나타나면」은 조건으로 보지 않는다). */
const CHART_WORD = /(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성|일주|월주|연주|시주|일지|월지|연지|년지|시지|일간|바탕 글자|땅 글자|하늘 글자|두 쌍|두 개|둘이|두 자리|짝이|신강|신약|(?:나무|불|흙|쇠|물|금|목|화|토|수) 글자|(?:봄|여름|가을|겨울)생|간지|자리에 (?:있|오|놓|걸리|깔))/g;
export const chartClauses = (s: string) => conditionClauses(`${s} `).filter(c => new RegExp(CHART_WORD.source).test(c));
/** 원국 말 뒤에 이음 꼴(「…깔고 있어 무대에 서면」 「정인이 앉은 자리라 …받으면」)이 오면 원국 쪽은 이미 사실 서술이고 조건은 생활 쪽이다. */
const statedThenLife = (clause: string) => { const ms = [...clause.matchAll(CHART_WORD)]; const last = ms[ms.length - 1]; if (!last) return false; return /(?:[어아고라서]|어서|니까) [가-힣]/.test(clause.slice(last.index! + last[0].length)); };
/** 남은 원국 조건절(완료 기준 「카드의 조건 문장 0」 — 원국 쪽이 사실 서술이고 조건이 생활 쪽인 꼴은 뺀다). */
export const conditionLeft = (s: string) => chartClauses(s).filter(c => !statedThenLife(c));

export type AtomCtx = { readonly chart: ChartFacts; readonly positions?: readonly string[]; readonly name?: string; readonly inputs: Inputs; readonly natal: boolean };
export type AtomResult = { readonly text: string | null; readonly kind: AtomKind; readonly why?: string; readonly cond?: "true" | "false" | "unknown" };

// ---------- 2. 조건 해소 ----------
const GROUP_OF: Readonly<Record<string, string>> = { 비견: "비겁", 겁재: "비겁", 식신: "식상", 상관: "식상", 편재: "재성", 정재: "재성", 편관: "관성", 정관: "관성", 편인: "인성", 정인: "인성" };
const SEAT: Readonly<Record<string, readonly string[]>> = { 일주: ["day"], 월주: ["month"], 연주: ["year"], 시주: ["hour"], 일지: ["day"], 월지: ["month"], 연지: ["year"], 년지: ["year"], 시지: ["hour"] };
const SEAT_KO: Readonly<Record<string, string>> = { 해: "year", 달: "month", 날: "day", 시각: "hour" };
const EL: Readonly<Record<string, string>> = { 나무: "WOOD", 목: "WOOD", 불: "FIRE", 화: "FIRE", 흙: "EARTH", 토: "EARTH", 쇠: "METAL", 금: "METAL", 물: "WATER", 수: "WATER" };
/** 조건 판정에 쓰는 원국 값(브리프에서 읽는다 — 계산은 다시 하지 않는다). */
export type ChartFacts = { readonly monthMain: string; readonly strong: boolean; readonly weak: boolean; readonly levels: Readonly<Record<string, string>>; readonly surface: ReadonlyMap<string, number>; readonly any: ReadonlySet<string>; readonly presence: Readonly<Record<string, { surface: number }>>; readonly strongest: string; readonly weakest: string; readonly season: string };
export function chartFacts(brief: Brief): ChartFacts {
  const c = brief.chart, p = c.positions, surface = new Map<string, number>(), any = new Set<string>();
  if (p) {
    for (const xs of [p.yearStem, p.monthStem, p.hourStem ?? []]) for (const t of xs) { surface.set(t, (surface.get(t) ?? 0) + 1); any.add(t); }
    for (const xs of [p.yearBranch, p.monthBranch, p.dayBranch, p.hourBranch ?? []]) xs.forEach((t, i) => { if (i === 0) surface.set(t, (surface.get(t) ?? 0) + 1); any.add(t); });
  }
  return { monthMain: p?.monthBranch[0] ?? "", strong: /STRONG/.test(c.strength.level) && !/WEAK/.test(c.strength.level), weak: /WEAK/.test(c.strength.level), levels: (c.groups?.levels ?? {}) as Record<string, string>, surface, any,
    presence: (c.elements.presence ?? {}) as Record<string, { surface: number }>, strongest: c.elements.strongest.element, weakest: c.elements.weakest.element, season: c.climate.season };
}
const groupLevel = (f: ChartFacts, g: string) => f.levels[g] ?? "";
const UP = /강하|많|넘치|두꺼|세(?:면|고|지)|둘 이상|두 개 이상/, DOWN = /약하|없|적|부족|모자라/, HAS = /받쳐|받치|이어|드러나|흐르|흘러|있|생해|누르|다스리|함께|깔|앉|더해/;
/** 원자 조건 하나: 참 · 거짓 · 모름(null). */
function judgeOption(o0: string, x: AtomCtx): boolean | null {
  let o = o0;
  const out: boolean[] = [], f = x.chart, pos = x.positions ?? [], seatKnown = x.positions !== undefined;
  // 일간 강약(「타고난 바탕 글자가 (이미) 강하면/약하면」 · 「받쳐 줄 힘이 있으면」).
  const dm = o.match(/(?:타고난 바탕 글자|일간)(?:이|가) (?:이미 )?(강|약)/); if (dm) out.push(dm[1] === "강" ? f.strong : f.weak);
  if (/바탕 글자가 받쳐 줄 힘이 있|일간이 감당할 힘이 있/.test(o)) out.push(!f.weak);
  // 「월지 본기가 식신이면」: 태어난 달 땅 글자의 본기 십성.
  const mm = o.match(/월지 본기가 (비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인)/); if (mm) { out.push(f.monthMain === mm[1]); o = o.replace(mm[0], ""); }
  if (/신강/.test(o)) out.push(f.strong); if (/신약/.test(o)) out.push(f.weak);
  // 십성 묶음 · 십성 하나: 「인성이 받쳐 주면」 「비겁과 식상이 함께 강하면」 「비견까지 강하면」 「정재와 인성이 약하면」 「재성이 정인을 누르면」.
  // 관계(합 · 충 · 형 · 묶임 · 두 글자가 노림)가 낀 조건은 여기서 판정하지 않는다(모름 → 뺀다).
  if (/충|[^가-힣]형|파(?:가| )|묶이|노리|합하|합으로/.test(o)) return null;
  const hits = [...o.matchAll(/(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성)/g)];
  if (hits.length) {
    const wantOf = (seg: string): "up" | "down" | "has" | null => (UP.test(seg) ? "up" : DOWN.test(seg) ? "down" : HAS.test(seg) ? "has" : null);
    const final = wantOf(o.slice(hits[hits.length - 1].index! + hits[hits.length - 1][1].length));
    hits.forEach((m, i) => {
      const nm = m[1], seg = o.slice(m.index! + nm.length, i + 1 < hits.length ? hits[i + 1].index : undefined);
      // 「A와 B가 함께 강하면」 「A나 B가」 = 끝 동사를 함께 받는다 · 「A가 B를 누르면」 = A는 있음 · 「A가 약한데 B만 강하면」 = 제 동사.
      const want = /^\s*(?:과|와|이나|나|,|·)\s*$/.test(seg) ? final : wantOf(seg) ?? (i + 1 < hits.length ? "has" : final);
      if (!want) return;
      const g = GROUP_OF[nm], isTg = Boolean(g), lv = groupLevel(f, isTg ? g : nm), n = isTg ? f.surface.get(nm) ?? 0 : 0;
      if (want === "up") out.push(isTg ? n >= 2 || (n >= 1 && lv === "강") : lv === "강");
      else if (want === "down") out.push(isTg ? n === 0 : lv === "약");
      else out.push(isTg ? f.any.has(nm) : lv !== "약");
    });
  }
  // 개수 · 짝(이 특징이 놓인 자리 수): 「두 개면」 「두 자리에 있으면」 · 「두 쌍이면」 「짝이 두 쌍 이상이면」(이웃 짝 둘 = 세 자리).
  if (seatKnown && /두 쌍|짝이 두/.test(o)) out.push(pos.length >= 3);
  else if (seatKnown && /두 개|둘이|두 자리|글자가 두 자리/.test(o)) out.push(pos.length >= 2);
  // 자리: 「일지나 태어난 달 땅 글자에 …있으면」 · 「일주가 백호면」(이 특징이 그 자리에).
  const seats = [...o.matchAll(/(일주|월주|연주|시주|일지|월지|연지|년지|시지)|태어난 (해|달|날|시각) (?:땅|하늘) 글자/g)].flatMap(m => (m[1] ? SEAT[m[1]] : [SEAT_KO[m[2]]]));
  if (seatKnown && seats.length && /에 (?:[가-힣()]+ ){0,2}(?:있|오|놓|걸리|깔|앉)|일주가 [가-힣 ]+(?:이)?면/.test(o)) out.push(seats.some(s => pos.includes(s)));
  // 오행 글자 많고 적음.
  // 오행 많고 적음(「쇠 글자가 더 많으면」 「금이 많고」 「불 글자가 원국에 없으면」 「화 글자가 셋을 넘고」).
  for (const el of o.matchAll(/(?<![가-힣])(나무|불|흙|쇠|물|금|목|화|토|수)(?: 글자)?(?:이|가) (?:원국에 |사주에 )?(?:셋을 (넘)|(?:더 )?(많|없|약하|적))/g)) {
    const e = EL[el[1]], w = el[2] ? "많" : el[3], n = f.presence[e]?.surface ?? 0;
    out.push(w === "많" ? f.strongest === e || n >= 3 : w === "없" ? n === 0 : f.weakest === e);
  }
  // 계절.
  const se = o.match(/(봄|여름|가을|겨울)(?:생|에 태어)/); if (se) out.push(f.season === se[1]);
  if (!out.length) return null;
  return out.every(Boolean);
}
/** 조건절 하나(「거나」 선택지 가운데 하나라도 참이면 참). */
export function judgeClause(clause: string, x: AtomCtx): boolean | null {
  const vs = clause.split(/거나 /).map(o => judgeOption(o, x));
  if (vs.some(v => v === true)) return true;
  if (vs.every(v => v === false)) return false;
  return null;
}
/** 참인 조건절을 이유 꼴로(「강하면」 → 「강해」 · 「받쳐 주면」 → 「받쳐 주어」 · 「두 개면」 → 「두 개라」). 못 바꾸면 null. */
export function asReason(clause: string): string | null {
  const rules: [RegExp, string][] = [[/하면$/, "해"], [/되면$/, "돼"], [/있으면$/, "있어"], [/없으면$/, "없어"], [/많으면$/, "많아"], [/두꺼우면$/, "두꺼워"], [/주면$/, "주어"], [/지면$/, "져"],
    [/드러나면$/, "드러나"], [/만나면$/, "만나"], [/누르면$/, "눌러"], [/흐르면$/, "흘러"], [/오면$/, "와"], [/놓이면$/, "놓여"], [/걸리면$/, "걸려"], [/겹치면$/, "겹쳐"], [/받치면$/, "받쳐"], [/이면$/, "이라"], [/([가-힣])면$/, "$1라"]];
  for (const [re, to] of rules) if (re.test(clause)) return clause.replace(re, to);
  return null;
}

// ---------- 5. 입력 적용(세운·대운만 — 4종 낱말표 premise.ts는 그대로) ----------
/** 문장이 전제하는 연애 상태. single = 상대를 고르는 꼴(솔로 · 미입력만) · partner = 지금 상대가 있다는 꼴(연애 중 · 기혼) · married = 부부 꼴 · notMarried = 결혼을 앞에 둔 꼴. */
/** AM2-12 1부 1: solo = 만나는 사람이 없다는 꼴(솔로 · 미입력만 — 썸 아님) · single = 연인이 없는 마음 꼴(솔로 · 썸 · 미입력). */
const NEED_REL: readonly [RegExp, "single" | "solo" | "partner" | "married" | "notMarried"][] = [
  [/끌리기 쉬운|끌리는 (?:흐름|때|쪽|경향)|에게 끌리|마음이 가기 쉬운 (?:사람|상대)|썸|호감 가는 사람|가벼운 만남보다/, "single"],
  [/새 인연|소개팅|좋아하는 사람이 생기|연인이 생기면|인연이 (?:다가|찾아)|끌리는 사람이 나타나|첫 만남|새로운 사람을 만나|새 만남|새로운 만남|만남 기회|인연이 닿기|주변의 소개/, "solo"],
  [/결혼을 생각한다면|결혼 준비|연애나 결혼을 생각/, "notMarried"],
  [/배우자와|부부 사이|결혼 생활|함께 사는 집/, "married"],
  [/연인과는|연인과의|둘의 관계가|상대와의 약속/, "partner"],
];
const NEED_CHILD = /자녀를|아이를 (?:키우|돌보)|육아/;
export function inputClash(s: string, x: Inputs): string | null {
  for (const [re, need] of NEED_REL) if (re.test(s)) {
    const ok = need === "single" ? x.rel === "single" || x.rel === "none" || x.rel === "some" : need === "solo" ? x.rel === "single" || x.rel === "none" : need === "notMarried" ? x.rel !== "married" : need === "married" ? x.rel === "married" : x.rel === "dating" || x.rel === "married";
    if (!ok) return `연애 입력(${x.rel})과 맞지 않는 전제(${need})`;
  }
  if (NEED_CHILD.test(s) && x.children !== "has") return "자녀 입력 없음";
  return null;
}

/** 원자 문장 하나를 정제: 남길 글(바꿨으면 바꾼 글) 또는 null(뺌)과 종류 · 까닭. */
/** 값 칸 머리의 자리(「겁살(劫煞) (태어난 날) — …」 「(태어난 달·태어난 날)」) — 특징 자리를 모르는 줄에서 조건 판정에 쓴다. */
const headSeats = (s: string): string[] | undefined => { const m = s.match(/\((태어난 [^)]+)\) — /); if (!m) return undefined; return [...m[1].matchAll(/태어난 (해|달|날|시각)/g)].map(z => SEAT_KO[z[1]]); };
export function refineAtom(s: string, x0: AtomCtx): AtomResult {
  const hs = x0.positions === undefined ? headSeats(s) : undefined, x = hs ? { ...x0, positions: hs } : x0;
  if (RULE.test(s)) return { text: null, kind: "rule", why: "규칙" };
  if (DISCLAIMER.test(s)) {
    const head = s.match(/^(.*[가-힣]) ?(?:이고|이며), [^,]*(?:뜻|말)[은이] 아닙니다\.$/);
    return head ? { text: `${head[1]}입니다.`, kind: "trait", why: "면책 마디 뗌" } : { text: null, kind: "disclaimer", why: "면책" };
  }
  if (META.test(s)) return { text: null, kind: "meta", why: "메타" };
  let t = s, cond: AtomResult["cond"];
  for (const cl of chartClauses(t)) {
    const v = judgeClause(cl, x);
    if (v === false) return { text: null, kind: "cond", why: `조건 거짓: ${cl}`, cond: "false" };
    if (v === null) return { text: null, kind: "cond", why: `조건 판정 못 함: ${cl}`, cond: "unknown" };
    cond = "true";
    if (statedThenLife(cl)) continue;
    const r = asReason(cl); if (!r) return { text: null, kind: "cond", why: `조건 참 · 이유 꼴 못 만듦: ${cl}`, cond: "unknown" };
    t = t.replace(cl, r);
  }
  const clash = inputClash(t, x.inputs); if (clash) return { text: null, kind: "trait", why: clash };
  if (x.natal && RX.test(t)) return { text: null, kind: "rx", why: "처방(근거 줄에서 뗌)" };
  return { text: t, kind: SCENE.test(t) ? "scene" : "trait", ...(cond ? { cond } : {}), ...(t !== s ? { why: "조건 참 → 이유 꼴" } : {}) };
}
/** 정제 기록(도구 · 보고용, 마지막 책). */
export type RefineLog = { dropped: { kind: AtomKind; text: string; why: string }[]; changed: { from: string; to: string }[]; unknown: string[]; tidy: { text: string; why: string }[]; tidyOver: { text: string; why: string }[]; kept: { text: string; owner: string; d: readonly (readonly [string, 1 | -1, number])[] }[] };
export const newRefineLog = (): RefineLog => ({ dropped: [], changed: [], unknown: [], tidy: [], tidyOver: [], kept: [] });
export const refineLog: { last?: RefineLog } = {};
/** 문단(「 · 」로 이은 마디들)을 정제해 다시 잇는다. drop = 성향 반대 정리로 뺄 원문 문장. */
export function refineText(text: string, x: AtomCtx, log: RefineLog, drop?: ReadonlySet<string>, sep = " · "): string {
  const kept: string[] = [];
  for (const a of atomsOf(text)) {
    if (drop?.has(a)) continue;
    const r = refineAtom(a, x);
    if (r.text === null) { log.dropped.push({ kind: r.kind, text: a, why: r.why ?? "" }); if (r.cond === "unknown") log.unknown.push(a); continue; }
    if (r.text !== a) log.changed.push({ from: a, to: r.text });
    kept.push(r.text);
  }
  return kept.join(sep);
}

// ---------- 4. 값 → 뜻(등급 낱말은 화면에만) ----------
const GROUP_EASY: Readonly<Record<string, string>> = { 비겁: "내 방식대로 서려는 힘", 식상: "생각을 말과 결과물로 내놓는 힘", 재성: "돈과 기회를 붙잡는 힘", 관성: "규칙과 책임을 지키는 힘", 인성: "배우고 도움을 받아들이는 힘" };
const LEVEL_MEAN: Readonly<Record<string, string>> = { 강: "이 크게 자리 잡은 편", 있음: "이 고르게 있는 편", 보통: "이 고르게 있는 편", 약: "이 타고나 약해 따로 챙겨야 하는 쪽" };
/** 연애 신호(그 해) 등급 → 고객 문장(연애 상태별). */
export function loveSignalMeaning(arrow: string, rel: string): string {
  const pair = rel === "dating" || rel === "married";
  if (/오름|↑/.test(arrow)) return pair ? "둘 사이에 다정한 기운이 오르기 쉬운 해" : "연애 쪽 기운이 올라 마음이 움직이기 쉬운 해";
  if (/내림|↓/.test(arrow)) return pair ? "둘 사이에서 속도를 늦추고 서로를 살필 일이 많은 해" : "연애 쪽은 서두르기보다 속도를 늦추고 살피는 해";
  return pair ? "둘 사이가 크게 출렁이지 않고 평소 속도로 가는 해" : "연애 쪽이 크게 오르지도 늦춰지지도 않고 평소 속도로 가는 해";
}
/** 카드 글의 등급 낱말을 뜻 말로. rel = 고객 연애 입력(premise Inputs.rel). */
export function gradeToMeaning(t: string, rel: string): string {
  return t
    .replace(/이 해의 연애 신호: (오름|보통|내림)/g, (_m, a: string) => loveSignalMeaning(a, rel))
    .replace(/(재성|비겁|식상|관성|인성)\(([^)]*)\) (강|보통|약|있음)(?![가-힣])/g, (_m, g: string, easy: string, lv: string) => `${GROUP_EASY[g] ?? easy}(${g})${LEVEL_MEAN[lv]}`)
    .replace(/([가-힣]+(?: [가-힣]+)?)\((비겁|식상|재성|관성|인성)\) (강|보통|약|있음)(?![가-힣])/g, (_m, easy: string, g: string, lv: string) => `${easy}(${g})${LEVEL_MEAN[lv]}`)
    .replace(/다섯 힘의 세기/g, "다섯 힘").replace(/내 힘의 세기: [^·|]+/g, "타고난 힘의 크기")
    .replace(/흐름 (?:느림|잔잔|보통|활발|거셈)\(([^)]+)\)/g, "$1")
    .replace(/\(같은 세기\)/g, "(여러 달이 함께)")
    .replace(/(가장 (?:강한|약한) 기운: [^(]+\([^)]+\))\((?:강|보통|약|매우 강|매우 약|없음|과다)\)/g, "$1");
}
/** 등급 낱말 찾기(완료 기준 「본문용 카드 등급 낱말 0」 — 시험 · 도구가 같은 정규식을 쓴다). 「약 5년」 같은 어림 말 · 「가장 강한」 같은 서술은 뺀다. */
export const GRADE_WORD = /(?:\)|:|신호|흐름) ?(?:강|보통|약|오름|내림)(?![가-힣])|\((?:강|보통|약|매우 강|매우 약)\)|같은 세기\)|보통 세기|다섯 힘의 세기|내 힘의 세기|세기:/;

// ---------- 6. 성향 반대 정리(카드 원국 · MBTI 줄) ----------
export type Dim = readonly [string, 1 | -1, number];
const CARD_TAG_ITEMS = (CARD_TAGS as unknown as { items: Readonly<Record<string, { k: string; d: readonly Dim[] }>> }).items;
/** 문장의 성향 차원: W7 꼬리표(persona-tags — 원문 sha1 열쇠) 먼저, 없으면 이 판 꼬리표(card-tags.json — W7이 덮지 못한 문장만). */
export function dimsOf(s: string, k: Knowledge, field?: string): readonly Dim[] {
  const t = k.personaTags.get(materialKey(s)) ?? (field ? k.personaTags.get(materialKey(field)) : undefined) ?? CARD_TAG_ITEMS[materialKey(s)];
  const base = t && (t.k === "trait" || t.k === "situ") ? (t.d as readonly Dim[]) : [];
  // AM2-11 1부 4: card-tags의 20차원 밖 이름(dutifulness · caretaking …)만 붙은 문장은 W7 20차원 꼬리표를 더한다(세운 · Fusion 꼬리표와 같은 말로 맞댄다 — P10 annual-1 「끝맺음이 깔끔」 ↔ 「흥미가 식으면 접기」).
  const extra = W7_CARD[materialKey(s)]?.d ?? [];
  return extra.length ? [...base, ...extra.filter(([d]) => !base.some(([d2]) => d2 === d))] : base;
}
const W7_CARD = (W7_TAGS as unknown as { card: Readonly<Record<string, { d: readonly Dim[] }>> }).card;
const W7_FUSION = (W7_TAGS as unknown as { fusion: Readonly<Record<string, { s: string; d: readonly Dim[] }>> }).fusion;
const fusionSents = new Map<string, { n: string; d: readonly Dim[] }[]>();
for (const [key, v] of Object.entries(W7_FUSION)) { const id = key.replace(/#\d+$/, ""); fusionSents.set(id, [...(fusionSents.get(id) ?? []), { n: v.s.replace(/\b(?:Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\b/g, "").replace(/[^가-힣]/g, ""), d: v.d }]); }
/** AM2-11 1부 4: Fusion 짝 이유 글(가공된 why)의 성향 차원 — 그 규칙 문장 가운데 글에 든 것(한글만 앞 12자)의 꼬리표. */
export function fusionDims(ruleId: string, text: string): readonly Dim[] {
  const n = text.replace(/[^가-힣]/g, ""), out: Dim[] = [];
  for (const x of fusionSents.get(ruleId) ?? []) if (x.n.length >= 6 && n.includes(x.n.slice(0, 12))) for (const d of x.d) if (!out.some(o => o[0] === d[0])) out.push(d);
  return out;
}
/** 한 Fusion 문장(원문 그대로 가른 것)의 차원 — 짝 이유 문장 하나를 뺄 때 쓴다. */
export function fusionSentenceDims(ruleId: string, sentence: string): readonly Dim[] { return fusionDims(ruleId, sentence); }
export const hasTag = (s: string, k: Knowledge, field?: string) => Boolean(k.personaTags.get(materialKey(s)) ?? (field ? k.personaTags.get(materialKey(field)) : undefined) ?? CARD_TAG_ITEMS[materialKey(s)]);
/** 성격표(4종 personProfileOf · AM2-9 annualTidy와 같은 계산): 특성 차원 × 점수 + MBTI 차원 × 1.5 × 가장 큰 점수. */
export function cardPoles(brief: Brief, k: Knowledge): ReadonlyMap<string, 1 | -1> {
  const v = new Map<string, number>(), add = (tags: Readonly<Record<string, number>>, w: number) => { for (const [d, x] of Object.entries(tags)) v.set(d, (v.get(d) ?? 0) + x * w); };
  for (const t of brief.traits) { const f = k.features.get(t.featureId); if (f && f.family !== "relation") add(f.dimensionTags, t.score); }
  const mp = brief.mbti ? k.mbti.get(brief.mbti.type as never) : undefined; if (mp) add(mp.dimensionTags, 1.5 * Math.max(1, ...brief.traits.map(t => t.score)));
  return profilePoles(profileCodes(brief.mbti?.type ?? null, v, brief.traits.map(t => t.featureId)));
}
/** 출처의 구체성(높을수록 남긴다): 일주 4 · 자리가 있는 십성·신살·운성 3 · 그 밖 원국 2 · MBTI 1. */
export const specificity = (featureId: string | null, seats: number) => (featureId === null ? 1 : /^dayPillar/.test(featureId) ? 4 : /^(tenGod|shinsal|twelveStage|gwiin|noble):/.test(featureId) && seats > 0 ? 3 : 2);
export const CARD_MAX_DROPS = 16;
export type TidyItem = { readonly text: string; readonly owner: string; readonly rank: number; readonly order: number; /** 문장이 든 칸 원문(W7 꼬리표는 칸 단위) */ readonly field?: string };
/**
 * 같은 사람 · 같은 차원 반대 끝 정리(W8.1 짝 정리 차례 · AM2-9 tidyScope와 같은 셈): ① 두 끝 모두 세기 2+ ② 성격표 반대(G3) ③ 세기 1이 낀 짝.
 * 약한 쪽 = 덜 구체적인 출처 → 그 차원 세기가 작은 쪽 → 뒤에 나온 줄. 상한(권당 16)을 넘는 몫은 빼지 않고 기록(tidyOver)으로 남긴다.
 */
export function tidyCard(items: readonly TidyItem[], k: Knowledge, poles: ReadonlyMap<string, 1 | -1>, log: RefineLog, cap = CARD_MAX_DROPS): Set<string> {
  const gone = new Set<string>(); let left = cap;
  const dims = new Map(items.map(i => [i.text, dimsOf(i.text, k, i.field)] as const));
  // AM2-11 1부 4: 한 출처(특성 · MBTI 줄)의 마지막 남은 문장은 빼지 않는다(줄째 사라지면 그 근거를 쓰는 장 · 동음 표시가 빈다 — 남긴 짝으로 기록).
  const liveOf = (owner: string) => items.filter(i => i.owner === owner && !gone.has(i.text)).length;
  const drop = (it: TidyItem, why: string) => { if (gone.has(it.text)) return; if (left > 0 && liveOf(it.owner) > 1) { gone.add(it.text); left--; log.tidy.push({ text: it.text, why }); } else if (!log.tidyOver.some(o => o.text === it.text)) log.tidyOver.push({ text: it.text, why }); };
  const clash = (a: readonly Dim[], b: readonly Dim[], min: number) => a.find(([d, p, s]) => s >= min && b.some(([d2, p2, s2]) => d2 === d && p2 === -p && s2 >= min))?.[0];
  const pairs = (min: number) => { for (let j = 1; j < items.length; j++) for (let i = 0; i < j; i++) { const a = items[i], b = items[j]; if (a.owner === b.owner || gone.has(a.text) || gone.has(b.text)) continue;
    const d = clash(dims.get(a.text)!, dims.get(b.text)!, min); if (!d) continue;
    const sa = dims.get(a.text)!.find(x => x[0] === d)![2], sb = dims.get(b.text)!.find(x => x[0] === d)![2];
    const lose = a.rank !== b.rank ? (a.rank < b.rank ? a : b) : sa !== sb ? (sa < sb ? a : b) : (a.order > b.order ? a : b);
    drop(lose, `${d} 반대 끝(「${(lose === a ? b : a).text.slice(0, 24)}」)`); } };
  pairs(2);
  for (const it of items) { if (gone.has(it.text)) continue; const ds = dims.get(it.text)!;
    const opp = ds.filter(([d, p]) => poles.get(d) === -p).reduce((s, x) => s + x[2], 0), agree = ds.filter(([d, p]) => poles.get(d) === p).reduce((s, x) => s + x[2], 0);
    if (opp > 0 && opp > agree) drop(it, `성격표 ${ds.find(([d, p]) => poles.get(d) === -p)![0]} 반대`); }
  pairs(1);
  log.kept.push(...items.filter(i => !gone.has(i.text)).map(i => ({ text: i.text, owner: i.owner, d: dims.get(i.text)! })));
  return gone;
}

/** 장면 씨앗 고를 때: 정리 뒤 남은 원국 · MBTI 문장이나 성격표와 반대 끝이면 그 씨앗을 고르지 않는다(꼬리표 없는 씨앗은 통과). */
export function clashesCard(text: string, kept: readonly TidyItem[], k: Knowledge, poles: ReadonlyMap<string, 1 | -1>): boolean {
  const d = dimsOf(text, k, text); if (!d.length) return false;
  const opp = d.filter(([dd, p]) => poles.get(dd) === -p).reduce((s, x) => s + x[2], 0), agree = d.filter(([dd, p]) => poles.get(dd) === p).reduce((s, x) => s + x[2], 0);
  if (opp > 0 && opp > agree) return true;
  return kept.some(i => dimsOf(i.text, k, i.field).some(([dd, p]) => d.some(([d2, p2]) => d2 === dd && p2 === -p)));
}

// ---------- 7. 기조 한 줄(tone.ts — 화면 코드도 쓰는 가벼운 모듈) ----------
export { toneOf, type Tone } from "./tone";
