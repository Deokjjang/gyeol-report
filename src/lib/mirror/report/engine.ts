/**
 * 결 보고서 엔진(D5, docs/mirror/SPEC.md 「기록판과 결 보고서」). 순수 함수 — 저장소 · 네트워크 · 시각 · 외부 호출 0, 같은 입력이면 늘 같은 출력.
 * 문장은 src/data/mirror/reportBank.ts. 변형은 사용자 시드(seedKey) + 슬롯 해시에 호 번호를 더해 돌린다(같은 사람의 연속한 호에는 다른 변형).
 *
 * 꼭지(SPEC 표 · 덕짱님 확인 용어 2026-11-27):
 *  1 한 줄 판정 — 항상. 「가장 큰 숨은 면의 수식어 + 친구가 본 유형 이름」.
 *  2 숨길 수 없는 나 — 문항당 친구 3명 이상, 80% 이상이 같은 답 + 내 답도 같음. 장면 최대 3개(면이 겹치지 않게 먼저).
 *  3 나만 모르는 나 — 문항당 친구 3명 이상, 60% 이상이 내 답과 반대. 장면 최대 2개(꼭지 2에 나온 면은 뒤로).
 *  4 나만 아는 나 — 내 면 점수 뚜렷(5문항 중 4개 이상 한쪽) + 면당 친구 답 6개 이상 + 친구 비율 40~60%. 최대 2면. 꼭지 2 · 3 장면에 나온 면은 뺀다.
 *  5 가까울수록 보이는 나 — 아는 사이 · 가까운 사이 각 3명 이상, 한 면에서 두 묶음 답이 각 3개 이상이고 기운 쪽이 반대이며 비율 차 0.3 이상. 최대 2면.
 *  6 가까운 관계의 나 — 친구 · 가까운 사이 3명 이상(애착 경향: 내가 본 나 vs 가까운 사람이 본 나).
 *  7 친구들이 남긴 이야기 — 받은 이야기가 있을 때 1~2개.
 *  8 아직 아무도 모르는 나 — 항상(친구 답이 가장 적은 면 + 「친구에게 물어보기」).
 *  9 다음 호 — 항상(다음 호 날짜 + 열릴 꼭지. 심층 리포트 한 줄은 스냅샷 bridge).
 *  친구가 한 명뿐이면 꼭지 2~5 대신 「한 사람이 본 나」 하나(내 답과 다른 장면 위주).
 *
 * 문장 원칙(검사 기준 2026-11-27, 2차):
 *  - 장면 줄이 이미 말한 걸 되풀이하는 틀 문장 · 위로용 각주는 쓰지 않는다. 남는 문장은 「앞마디(뼈대 8가지 이상) + 면 · 쪽 마디」 한 문장.
 *  - 면 이름을 단정하려면 그 면 전체 같게 본 비율 70% 이상(꼭지 2), 밖에서 반대로 본 비율 60% 초과(꼭지 3). 반반(40~60%)이면 단정하지 않는다.
 *  - 바로 앞 문단과 끝맺음(마지막 7자)이 같거나, 한 보고서에서 같은 끝맺음이 세 번째가 되는 변형은 건너뛴다.
 *  - 한 보고서 안에서 같은 문항 장면은 두 번 나오지 않는다.
 *
 * 한 줄 판정 수식어: 꼭지 3(면 전체로도 밖에서 반대로 본 면) · 4 · 5 후보 중 「내 쪽 값과 친구 쪽 값의 차」가 가장 큰 면.
 *  같으면 3 → 5 → 4 순, 그다음 시드 순. 「한 사람이 본 나」는 그 친구가 면의 60%를 넘게 반대쪽을 고른 면이 후보다.
 *  대체 규칙: 숨은 면이 없으면 꼭지 2 첫 장면의 면(같게 본 비율 70% 이상일 때만) 수식어, 그것도 없으면 「아직 베일에 싸인」 계열.
 *  유형 이름은 친구가 본 유형(friendType — 대표 4면에 친구 답이 모두 있을 때), 없으면 내 유형(selfType).
 */
import { MIRROR_FACETS, MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, facetIndex, type FacetId, type MirrorItem } from "../../../data/mirror/items";
import {
  ATTACH_DIFF_FRONT, ATTACH_FRIEND, ATTACH_ITEM, ATTACH_ITEM_FRONT, ATTACH_NOTE, ATTACH_SAME, ATTACH_SAME_FRONT, ATTACH_SELF_FRONT, ATTACH_SELF_TYPE, ATTACH_SPLIT_BOTH, ATTACH_SPLIT_ONE,
  BAND, bandLevel, BLIND_FACET, BLIND_LINES, CLOSER_FRONT, CLOSER_LINES, CLOSER_NEXT_FRONT, HIDDEN_FRONT, hiddenLines, ITEM_ONLY_BACK, ITEM_ONLY_FRONT, MODIFIERS, MODIFIER_FALLBACK,
  NEXT_GROWTH, NEXT_HINT, NEXT_LEAD, NEXT_TAIL, ONE_FACET, OPEN_FRONT, OPEN_LINES, SECTION_TITLE, SELF_EXCEPTION_BACK, SELF_EXCEPTION_FRONT, SIDE_NOUN,
  evenWords, halfWord, isEven, isTight, softEndings, SPLIT_BACK, SPLIT_FRONT, STORIES_REST, SUMMARY_FRONT, SUMMARY_PREV, THIN_BACK, THIN_FRONT,
  UNKNOWN_BACK, UNKNOWN_EVEN, UNKNOWN_FRONT, UNKNOWN_QUESTION, ida, numRo, type ModifierKind,
} from "../../../data/mirror/reportBank";
import { STORY_KIND_LABEL } from "../../../data/mirror/stories";
import { josa } from "../../brief/labels";
import {
  CLOSENESS_LABEL, answeredFriends, facetMatchRates, friendAttachment, friendFacets, friendType, itemMatches, knowRate, selfAttachment, selfFacets, selfType, syncPercent,
  type Attachment, type AttachmentType, type Choice, type Closeness, type Side,
} from "../engine";
import { hash32 } from "../hash";
import { friendSentence } from "../text";
import { kstMonthDay, sceneLine } from "./format";
import type { ReportInput, ReportScene, ReportSection, ReportSnapshot, ReportStory, SectionKey } from "./types";

export { ida, numRo };

/** 꼭지 열림 기준(용어 확인 2026-11-27). */
export const REPORT_RULES = {
  openMinFriends: 3, openAgree: 0.8, openMaxScenes: 3,
  blindMinFriends: 3, blindOpposite: 0.6, blindMaxScenes: 2,
  hiddenMinAnswers: 6, hiddenSplitLow: 0.4, hiddenSplitHigh: 0.6, hiddenMaxFacets: 2,
  closerMinFriends: 3, closerMinAnswers: 3, closerGap: 0.3, closerMaxFacets: 2,
  attachMinFriends: 3, attachSceneMin: 3, attachSceneShare: 0.8,
  storiesMax: 2,
  /** 면 이름을 단정하는 기준: 꼭지 2는 같게 본 비율 70% 이상, 꼭지 3은 밖에서 반대로 본 비율 60% 초과. 면 단위 말에 필요한 답 수 · 반반 구간. */
  openFacetMatch: 0.7, facetMinAnswers: 6, splitLow: 0.4, splitHigh: 0.6,
} as const;
export const REPORT_BRIDGE = { text: "이 결이 어디서 왔는지, 사주로 더 깊이 보기 →", href: "/products/saju-mbti-full" } as const;
/** 한 보고서에서 같은 끝맺음 낱말 최대 횟수. */
const ENDING_MAX = 2;
/** 「~거예요」로 끝나는 문장(한 보고서에서 3분의 1 이하 · 연달음 0). */
const GEO_END = /거예요[.]$/;
/** 같은 「N 대 M」(두 수 순서 무관)은 한 보고서에서 숫자로 한 번만 — 두 번째부터는 말로. */
const VS_MAX = 1;
const vsKey = (a: number, b: number) => `${Math.max(a, b)}:${Math.min(a, b)}`;
export const vsKeysOf = (t: string) => [...t.matchAll(/(\d+) 대 (\d+)/g)].map(m => vsKey(Number(m[1]), Number(m[2])));
const LOCATION_WORDS = /곁에서|밖에서|가까이에서/;

type Tally = { n: number; a: number };
type ItemStat = { item: MirrorItem; mine: Choice; all: Tally; by: Record<Closeness, Tally> };
type Hidden = { kind: Exclude<ModifierKind, "open">; facet: FacetId; side: Side; gap: number };
const KIND_ORDER: Readonly<Record<Hidden["kind"], number>> = { blind: 0, closer: 1, hidden: 2 };

const sideOf = (c: Choice): Side => (c === 0 ? "A" : "B");
const flip = (s: Side): Side => (s === "A" ? "B" : "A");
const optText = (item: MirrorItem, side: Side) => (side === "A" ? item.self.a : item.self.b);
const facetName = (f: FacetId) => MIRROR_FACETS[facetIndex(f)].name;
/** 면 이름 여럿: 면 정의 순서(MIRROR_FACET_IDS)로 「확인 · 거리」. */
const facetNames = (fs: readonly FacetId[]) => [...new Set(fs)].sort((x, y) => facetIndex(x) - facetIndex(y)).map(facetName).join(" · ");
const ratioSide = (a: number, n: number): Side | null => (a * 2 > n ? "A" : a * 2 < n ? "B" : null);
const tallySide = (t: Tally, side: Side) => (side === "A" ? t.a : t.n - t.a);
const isSplit = (t: Tally) => t.n > 0 && t.a / t.n >= REPORT_RULES.splitLow && t.a / t.n <= REPORT_RULES.splitHigh;
/** 친밀도 묶음 인원 표시: 0명 · 3명 미만(익명 — 1~2명은 숫자를 보이지 않는다) · n명. */
const groupCount = (n: number) => (n === 0 ? "0명" : n < 3 ? "3명 미만" : `${n}명`);
/** 이 애착 유형이 그 면에서 기우는 쪽(확인 A = 불안, 거리 B = 회피). */
const attachSide = (type: AttachmentType, facet: "check" | "dist"): Side =>
  facet === "check" ? (type === "anxious" || type === "fearful" ? "A" : "B") : (type === "avoidant" || type === "fearful" ? "B" : "A");
/**
 * 끝맺음 낱말: 마지막 서술어에서 어미를 떼어 낸 말(「~쪽이에요」 · 「~쪽일 거예요」는 둘 다 「쪽」, 「~보였을 거예요」는 「보였」).
 * 이어진 두 문단이 같은 낱말로 끝나거나, 한 보고서에서 같은 낱말이 세 번째가 되면 겹친 것으로 본다.
 */
export function endingKey(t: string): string {
  const toks = t.trim().replace(/[.?!]+$/, "").split(/\s+/);
  let last = toks[toks.length - 1] ?? "";
  if (last === "거예요" && toks.length > 1) last = toks[toks.length - 2];
  return last.replace(/(이에요|예요|해요|어요|아요|여요|일|을|요)$/, "") || last;
}
export const endingOf = endingKey;
/** 앞마디의 이음말(쉼표 앞 마지막 낱말): 한 꼭지 안 이어진 두 문단이 같은 이음말(「갈렸으니」 · 「걸 보면」)로 시작하지 않게. */
export function connectiveOf(t: string): string {
  const i = t.indexOf(", ");
  if (i < 0) return "";
  const toks = t.slice(0, i).trim().split(/\s+/);
  return toks.slice(-2).join(" ").replace(/[\d「」“”]/g, "");
}

/** 장면 근거 줄의 꼴(한 꼭지에 같은 숫자 줄이 겹치면 다음 꼴로). 「이 질문도」처럼 앞줄에 기대는 말은 쓰지 않는다. */
const hiddenCount = (n: number, k: number) => [`친구 ${n}명 중 ${k}명이 같은 답`, `${n}명 중 ${k}명이 본인과 같은 답`, `같은 답 ${k}명 · 다른 답 ${n - k}명`, `본인과 같은 답 ${k}명(${n}명 중)`];
const closerCount = (n3: number, k3: number, n1: number, k1: number) => [
  `가까운 사이 ${n3}명 중 ${k3}명 · 아는 사이는 ${n1}명 중 ${k1}명이 반대 답`,
  `아는 사이 ${n1}명 중 ${k1}명이 반대 답 · 가까운 사이는 ${n3}명 중 ${k3}명`,
  `가까운 사이 ${k3}명(${n3}명 중) · 반대 답 아는 사이 ${k1}명(${n1}명 중)`,
];
const oneCount = (facet: string, differs: boolean) => differs
  ? [`${facet} 면 · 직접 고른 답과 다름`, `${facet} 면 · 이 친구는 다른 답`, `${facet} 면 · 본인 답과 엇갈림`, `${facet} 면 · 이 친구 답은 반대쪽`]
  : [`${facet} 면 · 직접 고른 답과 같음`, `${facet} 면 · 이 친구도 같은 답`, `${facet} 면 · 본인 답 그대로`, `${facet} 면 · 이 친구와 같은 쪽`];

export function buildReport(input: ReportInput): ReportSnapshot {
  const { self, ownerName, seedKey, issueNo } = input;
  const shift = Math.max(0, Math.floor(issueNo) - 1);
  const rank = (key: string) => hash32(`${seedKey}:rank:${key}`);
  const startOf = (slot: string, n: number) => (hash32(`${seedKey}:${slot}`) + shift) % n;

  // ── 변형 고르기: 호 번호로 돌리고, 바로 앞 문단 · 이 보고서의 끝맺음과 겹치는 변형은 건너뛴다 ──
  let lastEnd = "";
  const endCount = new Map<string, number>();
  const usedBySlot = new Map<string, Set<number>>();
  const ok = (t: string, avoid = "") => { const e = endingKey(t); return e !== lastEnd && e !== avoid && (endCount.get(e) ?? 0) < ENDING_MAX; };
  // 「~거예요」 밀도: 지금까지 실은 문장의 3분의 1 이하, 바로 앞 문장도 「거예요」면 안 된다(그러면 softEndings로 바꾼다).
  let sentN = 0, geoN = 0, lastGeo = false;
  const geoOk = (t: string) => {
    let n = sentN, g = geoN, prev = lastGeo;
    for (const x of sentencesOf(t)) { n++; const isG = GEO_END.test(x); if (isG && (prev || (g + 1) * 3 > n)) return false; if (isG) g++; prev = isG; }
    return true;
  };
  // 같은 「N 대 M」 횟수(면별로 어디서 보였는지도 — 「앞서 본 것처럼」은 같은 면에서 보였을 때만).
  const vsCount = new Map<string, number>(), vsFacets = new Map<string, Set<FacetId>>();
  const vsOk = (t: string) => { const c = new Map<string, number>(); for (const k of vsKeysOf(t)) { c.set(k, (c.get(k) ?? 0) + 1); if ((vsCount.get(k) ?? 0) + c.get(k)! > VS_MAX) return false; } return true; };
  const noteVs = (t: string, facet: FacetId) => { for (const k of vsKeysOf(t)) vsFacets.set(k, (vsFacets.get(k) ?? new Set()).add(facet)); return t; };
  const fine = (t: string, avoid = "") => ok(t, avoid) && geoOk(t) && vsOk(t);
  let lastConnective = "", lastFrame = "";
  let sectionCounts = new Set<string>();
  const newSection = () => { lastConnective = ""; lastFrame = ""; sectionCounts = new Set(); };
  /** 장면 근거 줄: 이 꼭지에서 아직 안 쓴 꼴을 앞에서부터 고른다(같은 숫자 줄이 한 꼭지에 두 번 서지 않게). */
  const countLine = (forms: readonly string[]) => { const c = forms.find(f => !sectionCounts.has(f)) ?? forms[forms.length - 1]; sectionCounts.add(c); return c; };
  /** 한 후보의 꼴: 원문, 그다음 「거예요」를 바꾼 꼴(시드로 돌린 순서). */
  const formsOf = (t: string, slot: string) => { const soft = softEndings(t); const r = soft.length ? startOf(`${slot}:soft`, soft.length) : 0; return [t, ...soft.slice(r), ...soft.slice(0, r)]; };
  /** 완성 문장 후보 중 하나(슬롯별로 이미 쓴 번호는 피한다). */
  function choose(options: readonly string[], slot: string, family = slot, avoid = ""): string {
    const used = usedBySlot.get(family) ?? new Set<number>();
    const n = options.length, start = startOf(slot, n);
    const tests: ((i: number, t: string) => boolean)[] = [(i, t) => !used.has(i) && fine(t, avoid), (_, t) => fine(t, avoid), (_, t) => ok(t, avoid) && geoOk(t), (_, t) => geoOk(t)];
    for (const test of tests) for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      for (const t of formsOf(options[i], `${slot}:${i}`)) if (test(i, t)) { used.add(i); usedBySlot.set(family, used); return t; }
    }
    used.add(start); usedBySlot.set(family, used);
    return options[start];
  }
  /** 정해진 한 문장: 끝맺음 · 「거예요」 밀도 · 「N 대 M」에 맞는 꼴. */
  const fit = (t: string, slot: string, avoid = "") => { const forms = formsOf(t, slot); return forms.find(x => fine(x, avoid)) ?? forms.find(x => geoOk(x)) ?? t; };
  /** 앞마디 하나(슬롯별로 겹치지 않게, 이 꼭지 바로 앞 문단과 이음말 · 틀이 다르게, 같은 「N 대 M」 세 번째는 피한다). */
  function front<V>(list: readonly ((v: V) => string)[], v: V, slot: string, key = ""): string {
    const used = usedBySlot.get(`front:${slot}`) ?? new Set<number>();
    const n = list.length, start = startOf(`front:${slot}:${key}`, n);
    const texts = list.map(f => f(v));
    const tests: ((t: string) => boolean)[] = [
      t => connectiveOf(t) !== lastConnective && frameOf(t, [ownerName]) !== lastFrame && vsOk(t),
      t => frameOf(t, [ownerName]) !== lastFrame && vsOk(t),
      t => vsOk(t),
      () => true,
    ];
    let i = -1;
    for (const test of tests) for (let k = 0; k < n && i < 0; k++) { const j = (start + k) % n; if (!used.has(j) && test(texts[j])) i = j; }
    if (i < 0) i = start;
    used.add(i); usedBySlot.set(`front:${slot}`, used);
    lastConnective = connectiveOf(texts[i]) || lastConnective;
    return texts[i];
  }
  /** 이 문장을 보고서에 싣는다(끝맺음 · 「거예요」 · 「N 대 M」 · 틀 기록). */
  const emit = (t: string) => {
    const e = endingKey(t); lastEnd = e; endCount.set(e, (endCount.get(e) ?? 0) + 1);
    for (const x of sentencesOf(t)) { sentN++; lastGeo = GEO_END.test(x); if (lastGeo) geoN++; }
    for (const k of vsKeysOf(t)) vsCount.set(k, (vsCount.get(k) ?? 0) + 1);
    lastFrame = frameOf(t, [ownerName]);
    return t;
  };
  const say = <V>(list: readonly ((v: V) => string)[], v: V, slot: string) => emit(choose(list.map(f => f(v)), slot));
  const sayWith = (head: string, clauses: readonly string[], slot: string, family?: string, avoid = "") => emit(choose(clauses.map(c => head + c), slot, family ?? slot, avoid));

  const friends = answeredFriends(input.sessions);
  const sync = syncPercent(self, input.sessions) ?? 0;
  const matches = itemMatches(self, input.sessions);
  const answers = matches.reduce((s, m) => s + m.total, 0);
  const mineFacets = selfFacets(self), ff = friendFacets(input.sessions), fmr = facetMatchRates(self, input.sessions);
  const groupSize = (c: Closeness) => friends.filter(s => s.closeness === c).length;
  const facetTally = (f: FacetId): Tally => { const x = ff[facetIndex(f)]; return x ? { n: x.n, a: x.a } : { n: 0, a: 0 }; };
  const selfSide = (f: FacetId): Side => mineFacets[facetIndex(f)]!.side;
  const selfCount = (f: FacetId, side: Side) => { const m = mineFacets[facetIndex(f)]!; return side === "A" ? m.aCount : 5 - m.aCount; };
  const matchRate = (f: FacetId) => fmr[facetIndex(f)];

  // 문항별 집계(주인 기기 · 건너뜀 제외, 친밀도별).
  const stats = new Map<string, ItemStat>();
  for (const s of friends) for (const a of s.answers) {
    if (a.choice === "skip") continue;
    const item = MIRROR_ITEM_BY_ID.get(a.itemId), mine = self[a.itemId];
    if (!item || (mine !== 0 && mine !== 1)) continue;
    const st = stats.get(item.id) ?? { item, mine, all: { n: 0, a: 0 }, by: { 1: { n: 0, a: 0 }, 2: { n: 0, a: 0 }, 3: { n: 0, a: 0 } } };
    st.all.n++; st.by[s.closeness].n++;
    if (a.choice === 0) { st.all.a++; st.by[s.closeness].a++; }
    stats.set(item.id, st);
  }
  const statList = MIRROR_ITEMS.map(i => stats.get(i.id)).filter((x): x is ItemStat => !!x);
  const maxItemN = Math.max(0, ...statList.map(s => s.all.n));
  const agreeOf = (st: ItemStat) => tallySide(st.all, sideOf(st.mine));
  const shareFor = (item: MirrorItem, side: Side, count: string) => { const fs = friendSentence(item, ownerName); return { count, text: `${count}: ${fs.situation} ${side === "A" ? fs.a : fs.b}` }; };
  const diverse = <T extends { facet: FacetId }>(sorted: T[], max: number): T[] => {
    const out: T[] = [], seen = new Set<FacetId>();
    for (const x of sorted) if (out.length < max && !seen.has(x.facet)) { out.push(x); seen.add(x.facet); }
    for (const x of sorted) if (out.length < max && !out.includes(x)) out.push(x);
    return out;
  };
  /** 한 보고서 안에서 이미 쓴 문항 · 장면으로 쓴 면. */
  const usedItems = new Set<string>(), sceneFacets = new Set<FacetId>();
  const takeScene = (sc: ReportScene) => { usedItems.add(sc.itemId); sceneFacets.add(sc.facet); return sc; };

  const one = friends.length === 1;
  const level = bandLevel(sync);
  // ── 한 줄 판정 아래 요약(화면 순서대로 먼저 만든다 — 끝맺음 점검이 위에서 아래로 흐르게). 구간 말은 싱크로율 구간과 맞춘다 ──
  const summaryWho = { who: one ? "친구 한 명이" : `친구 ${friends.length}명이`, n: answers };
  const summary: string[] = [sayWith(front(SUMMARY_FRONT, summaryWho, "summary"), BAND[level], `summary:band:${level}`)];
  if (input.previous) summary.push(say(SUMMARY_PREV, { p: input.previous.stats.sync, s: sync }, "summary:prev"));

  const sections: ReportSection[] = [];
  const candidates: Hidden[] = [];
  let openTop: { facet: FacetId; side: Side } | null = null;
  const facetsOf = { blind: [] as FacetId[], hidden: [] as FacetId[], closer: [] as FacetId[] };
  const flags = { perItem3: maxItemN >= REPORT_RULES.openMinFriends, facet6: ff.some(f => (f?.n ?? 0) >= REPORT_RULES.hiddenMinAnswers) };

  if (one) sections.push(oneSection());
  else {
    // ── 꼭지 2 숨길 수 없는 나 ──
    const open = statList.filter(st => st.all.n >= REPORT_RULES.openMinFriends && agreeOf(st) / st.all.n >= REPORT_RULES.openAgree)
      .map(st => ({ st, facet: st.item.facet, rate: agreeOf(st) / st.all.n }))
      .sort((x, y) => y.rate - x.rate || y.st.all.n - x.st.all.n || rank(x.st.item.id) - rank(y.st.item.id));
    if (open.length) {
      newSection();
      const chosen = diverse(open, REPORT_RULES.openMaxScenes);
      const scenes = chosen.map(({ st }): ReportScene => {
        const s = sideOf(st.mine), n = st.all.n, k = agreeOf(st), count = `친구 ${n}명 중 ${k}명`;
        const forms = k === n ? [`${count} · 본인도 같은 답`, `${n}명 모두 본인과 같은 답`, `친구 ${n}명이 다 같은 답`, `같은 답 ${k}명 · 다른 답 0명`]
          : [`${count} · 본인도 같은 답`, `${n}명 중 ${k}명이 본인과 같은 답`, `같은 답 ${k}명 · 다른 답 ${n - k}명`, `본인과 같은 답 ${k}명(${n}명 중)`];
        return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, s), mine: optText(st.item, s), count: countLine(forms), share: shareFor(st.item, s, count) });
      });
      // 면 이름은 그 면 전체 같게 본 비율 70% 이상이고 면 점수 방향이 장면과 같을 때만 단정한다. 아니면 장면만 보여 준다.
      const strong = chosen.map(c => ({ c, side: sideOf(c.st.mine), r: matchRate(c.facet) }))
        .filter(x => { const t = facetTally(x.c.facet); return x.r !== null && x.r >= REPORT_RULES.openFacetMatch && selfSide(x.c.facet) === x.side && t.n >= REPORT_RULES.facetMinAnswers && tallySide(t, x.side) / t.n >= REPORT_RULES.openFacetMatch; })
        .sort((x, y) => y.r! - x.r! || rank(x.c.facet) - rank(y.c.facet))[0];
      const lead: string[] = [];
      if (strong) {
        const f = strong.c.facet, t = facetTally(f);
        openTop = { facet: f, side: strong.side };
        lead.push(sayWith(front(OPEN_FRONT, { name: facetName(f), n: t.n, k: tallySide(t, strong.side), pct: Math.round(strong.r! * 100) }, "open", f), OPEN_LINES[f][strong.side], `open:${f}:${strong.side}:${strong.c.st.item.id}`));
      }
      sections.push({ key: "open", title: SECTION_TITLE.open, lead, scenes, body: [], notes: [] });
    }

    // ── 꼭지 3 나만 모르는 나 ──
    const openFacets = new Set(sceneFacets);
    const blind = statList.filter(st => !usedItems.has(st.item.id) && st.all.n >= REPORT_RULES.blindMinFriends && (st.all.n - agreeOf(st)) / st.all.n >= REPORT_RULES.blindOpposite)
      .map(st => ({ st, facet: st.item.facet, rate: (st.all.n - agreeOf(st)) / st.all.n }))
      .sort((x, y) => Number(openFacets.has(x.facet)) - Number(openFacets.has(y.facet)) || y.rate - x.rate || y.st.all.n - x.st.all.n || rank(x.st.item.id) - rank(y.st.item.id));
    if (blind.length) {
      newSection();
      const chosen = diverse(blind, REPORT_RULES.blindMaxScenes);
      const scenes = chosen.map(({ st }): ReportScene => {
        const seen = flip(sideOf(st.mine)), n = st.all.n, k = n - agreeOf(st), count = `친구 ${n}명 중 ${k}명`;
        const forms = k === n ? [count, `${n}명 모두 반대 답`, `친구 ${n}명이 다 반대쪽`, `반대 답 ${k}명 · 같은 답 0명`]
          : [count, `${n}명 중 ${k}명이 반대 답`, `반대 답 ${k}명 · 같은 답 ${n - k}명`, `반대쪽 ${k}명(${n}명 중)`];
        return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, seen), mine: optText(st.item, sideOf(st.mine)), count: countLine(forms), share: shareFor(st.item, seen, count) });
      });
      facetsOf.blind = [...new Set(chosen.map(c => c.facet))];
      // 면마다 한 문장: 면 점수 방향이 맞고 밖에서 60% 넘게 반대로 볼 때만 면 단위로, 아니면 그 장면 단위로.
      const body = facetsOf.blind.map(f => {
        const c = chosen.find(x => x.facet === f)!, mine = sideOf(c.st.mine), seen = flip(mine), t = facetTally(f), name = facetName(f), scene = c.st.item.self.situation, key = `${f}:${c.st.item.id}`;
        const back = (list: readonly ((v: { scene: string }) => string)[]) => list.map(g => g({ scene }));
        if (selfSide(f) !== mine) return sayWith(front(SELF_EXCEPTION_FRONT, { name, k: selfCount(f, seen), side: SIDE_NOUN[f][seen] }, "blind:self", key), back(SELF_EXCEPTION_BACK), `blind:self:back:${key}`, "blind:self:back");
        if (t.n < REPORT_RULES.facetMinAnswers) return sayWith(front(THIN_FRONT, { name, n: t.n }, "blind:thin", key), back(THIN_BACK), `blind:thin:back:${key}`, "blind:thin:back");
        const k = tallySide(t, seen);
        if (k / t.n > REPORT_RULES.splitHigh) {
          candidates.push({ kind: "blind", facet: f, side: seen, gap: c.rate });
          return sayWith(front(BLIND_FACET, { name, n: t.n, k, side: SIDE_NOUN[f][seen], scene }, "blind", key), BLIND_LINES[f][seen], `blind:${key}:${seen}`, `blind:${f}`);
        }
        if (isSplit(t)) return noteVs(sayWith(front(SPLIT_FRONT, { name, n: t.n, a: tallySide(t, mine), b: k }, "blind:split", key), back(SPLIT_BACK), `blind:split:back:${key}`, "blind:split:back"), f);
        return sayWith(front(ITEM_ONLY_FRONT, { name, n: t.n, k: tallySide(t, mine) }, "blind:item", key), back(ITEM_ONLY_BACK), `blind:item:back:${key}`, "blind:item:back");
      });
      sections.push({ key: "blind", title: SECTION_TITLE.blind, lead: [], scenes, body, notes: [] });
    }

    // ── 꼭지 4 나만 아는 나 ──
    const hidden = MIRROR_FACET_IDS.flatMap((facet, i) => {
      const m = mineFacets[i], f = ff[i];
      if (sceneFacets.has(facet) || !m || !f || Math.abs(m.aCount - 2.5) < 1.5 || f.n < REPORT_RULES.hiddenMinAnswers || f.ratio < REPORT_RULES.hiddenSplitLow || f.ratio > REPORT_RULES.hiddenSplitHigh) return [];
      return [{ facet, side: m.side, gap: Math.abs(m.aCount / 5 - f.ratio), f, aCount: m.aCount }];
    }).sort((x, y) => y.gap - x.gap || rank(x.facet) - rank(y.facet)).slice(0, REPORT_RULES.hiddenMaxFacets);
    if (hidden.length) {
      newSection();
      facetsOf.hidden = hidden.map(h => h.facet);
      const scenes: ReportScene[] = [], body: string[] = [];
      for (const h of hidden) {
        // 예시 장면: 그 면에서 내 답이 그쪽이고 친구 답이 반반에 가장 가까운 문항(답 3개 이상을 먼저).
        const split = (st: ItemStat) => Math.abs(st.all.a / st.all.n - 0.5) + (st.all.n < 3 ? 1 : 0);
        const ex = statList.filter(st => st.item.facet === h.facet && !usedItems.has(st.item.id) && sideOf(st.mine) === h.side && st.all.n >= 2 && Math.abs(st.all.a / st.all.n - 0.5) <= 0.1 + 1e-9)
          .sort((x, y) => split(x) - split(y) || y.all.n - x.all.n || rank(x.item.id) - rank(y.item.id))[0];
        if (ex) {
          const exSide = ratioSide(ex.all.a, ex.all.n) ?? flip(h.side);
          scenes.push(takeScene({ itemId: ex.item.id, facet: h.facet, situation: ex.item.self.situation, picked: optText(ex.item, exSide), mine: optText(ex.item, h.side), count: countLine(hiddenCount(ex.all.n, tallySide(ex.all, h.side))) }));
        }
        const key = `${h.facet}:${h.side}:${ex?.item.id ?? "-"}`;
        const head = front(HIDDEN_FRONT, { name: facetName(h.facet), k5: h.side === "A" ? h.aCount : 5 - h.aCount, side: SIDE_NOUN[h.facet][h.side], n: h.f.n, m: tallySide(h.f, h.side) }, "hidden", key);
        // 결론 마디는 밖에서 알아본 비율 구간(45% 미만 · 45~55% · 55% 초과)에 맞는 말만 — 앞마디가 이미 고른 정도를 말했으면 비율 없이 결의 뜻만.
        body.push(noteVs(sayWith(head, hiddenLines(h.facet, h.side, tallySide(h.f, h.side) / h.f.n, head), `hidden:${key}`, `hidden:${h.facet}`), h.facet));
        candidates.push({ kind: "hidden", facet: h.facet, side: h.side, gap: h.gap });
      }
      sections.push({ key: "hidden", title: SECTION_TITLE.hidden, lead: [], scenes, body, notes: [] });
    }

    // ── 꼭지 5 가까울수록 보이는 나 ──
    if (groupSize(1) >= REPORT_RULES.closerMinFriends && groupSize(3) >= REPORT_RULES.closerMinFriends) {
      const earlier = new Set([...sceneFacets, ...hidden.map(h => h.facet)]);
      const closer = MIRROR_FACET_IDS.flatMap(facet => {
        const items = statList.filter(st => st.item.facet === facet);
        const g1 = items.reduce((t, st) => ({ n: t.n + st.by[1].n, a: t.a + st.by[1].a }), { n: 0, a: 0 });
        const g3 = items.reduce((t, st) => ({ n: t.n + st.by[3].n, a: t.a + st.by[3].a }), { n: 0, a: 0 });
        if (g1.n < REPORT_RULES.closerMinAnswers || g3.n < REPORT_RULES.closerMinAnswers) return [];
        const s1 = ratioSide(g1.a, g1.n), s3 = ratioSide(g3.a, g3.n), gap = Math.abs(g1.a / g1.n - g3.a / g3.n);
        if (!s1 || !s3 || s1 === s3 || gap < REPORT_RULES.closerGap) return [];
        return [{ facet, s1, s3, g1, g3, gap, items }];
      }).sort((x, y) => Number(earlier.has(x.facet)) - Number(earlier.has(y.facet)) || y.gap - x.gap || rank(x.facet) - rank(y.facet)).slice(0, REPORT_RULES.closerMaxFacets);
      if (closer.length) {
        newSection();
        facetsOf.closer = closer.map(c => c.facet);
        const scenes: ReportScene[] = [], body: string[] = [];
        for (const c of closer) {
          // 장면: 그 문항에서도 두 묶음이 각자 같은 쪽을 고른 문항(묶음마다 답 2개 이상). 없으면 장면 없이 면 숫자만.
          const ex = c.items.filter(st => !usedItems.has(st.item.id) && st.by[3].n >= 2 && st.by[1].n >= 2 && ratioSide(st.by[3].a, st.by[3].n) === c.s3 && ratioSide(st.by[1].a, st.by[1].n) === c.s1)
            .sort((x, y) => (y.by[1].n + y.by[3].n) - (x.by[1].n + x.by[3].n) || rank(x.item.id) - rank(y.item.id))[0];
          if (ex) scenes.push(takeScene({ itemId: ex.item.id, facet: c.facet, situation: ex.item.self.situation, picked: optText(ex.item, c.s3), mine: optText(ex.item, sideOf(ex.mine)),
            count: countLine(closerCount(ex.by[3].n, tallySide(ex.by[3], c.s3), ex.by[1].n, tallySide(ex.by[1], c.s1))) }));
          const key = `${c.facet}:${c.s3}:${ex?.item.id ?? "-"}`;
          // 둘째 면은 첫 면과 다른 틀(「~도 · 역시」 + 괄호 숫자)로.
          const head = front(c === closer[0] ? CLOSER_FRONT : CLOSER_NEXT_FRONT, { name: facetName(c.facet), s1: SIDE_NOUN[c.facet][c.s1], n1: c.g1.n, k1: tallySide(c.g1, c.s1), s3: SIDE_NOUN[c.facet][c.s3], n3: c.g3.n, k3: tallySide(c.g3, c.s3) }, c === closer[0] ? "closer" : "closer:next", key);
          body.push(sayWith(head, CLOSER_LINES[c.facet][c.s3], `closer:${key}`, `closer:${c.facet}`));
          candidates.push({ kind: "closer", facet: c.facet, side: c.s3, gap: c.gap });
        }
        sections.push({ key: "closer", title: SECTION_TITLE.closer, lead: [], scenes, body, notes: [] });
      }
    }
  }

  // ── 꼭지 6 가까운 관계의 나 ──
  const closeFriends = friends.filter(s => s.closeness !== 1);
  const mineAttach = selfAttachment(self), theirAttach = friendAttachment(input.sessions, self);
  if (closeFriends.length >= REPORT_RULES.attachMinFriends && mineAttach && theirAttach) sections.push(attachSection(mineAttach, theirAttach));

  // ── 꼭지 7 친구들이 남긴 이야기 ──
  if (input.stories.length) {
    const total = input.stories.length;
    const sorted = [...input.stories].sort((x, y) => y.hearts - x.hearts || Date.parse(y.createdAt) - Date.parse(x.createdAt) || rank(x.id) - rank(y.id));
    const chosen: ReportStory[] = [sorted[0]];
    const second = sorted.slice(1).find(s => s.kind !== sorted[0].kind) ?? sorted[1];
    if (second && REPORT_RULES.storiesMax > 1) chosen.push(second);
    sections.push({
      key: "stories", title: one ? SECTION_TITLE.storiesOne : SECTION_TITLE.stories, lead: [], scenes: [],
      body: total > chosen.length ? [say(STORIES_REST, { k: total - chosen.length }, "stories")] : [],
      notes: [], stories: chosen.map(s => ({ kind: s.kind, kindLabel: STORY_KIND_LABEL[s.kind], body: s.body, closenessLabel: CLOSENESS_LABEL[s.closeness] })),
    });
  }

  // ── 꼭지 8 아직 아무도 모르는 나 ──
  sections.push(unknownSection());

  // ── 한 줄 판정 ──
  candidates.sort((x, y) => y.gap - x.gap || KIND_ORDER[x.kind] - KIND_ORDER[y.kind] || rank(`v:${x.facet}`) - rank(`v:${y.facet}`));
  const top = candidates[0];
  const pickMod = (list: readonly string[]) => list[startOf("verdict", list.length)];
  // 대체 수식어는 싱크로율 구간에 맞춘다(「베일」 계열은 45% 미만일 때만 — 요약과 반대로 읽히지 않게).
  const modifier = top ? pickMod(MODIFIERS[top.kind][top.facet][top.side]) : openTop ? pickMod(MODIFIERS.open[openTop.facet][openTop.side]) : pickMod(MODIFIER_FALLBACK[level]);
  const typeTitle = (friendType(input.sessions, self) ?? selfType(self))?.title ?? "";

  // ── 꼭지 9 다음 호 ──
  sections.push(nextSection());

  // 판정 바로 아래 요약이 판정과 같은 낱말(「큰 줄기」)을 쓰면 요약 변형을 바꾼다(끝맺음은 보고서 점검과 같은 기준).
  const title = [modifier, typeTitle].filter(Boolean).join(" ");
  if (sharedWords(title, summary[0]).length) {
    const later = sections.flatMap(sec => [...sec.lead, ...sec.body, ...sec.notes.filter(x => x !== ATTACH_NOTE)]).map(endingKey);
    const all = SUMMARY_FRONT.flatMap(f => BAND[level].map(b => f(summaryWho) + b)), r0 = startOf("summary:alt", all.length);
    const endOk = (t: string) => !!input.previous || (endingKey(t) !== later[0] && later.filter(e => e === endingKey(t)).length < ENDING_MAX);
    const alt = [...all.slice(r0), ...all.slice(0, r0)].find(t => !sharedWords(title, t).length && endOk(t));
    if (alt) summary[0] = alt;
  }

  const size = (c: Closeness) => { const n = groupSize(c); return n >= 3 ? n : null; };
  return {
    version: 1, issueNo, issuedAt: input.issuedAt, nextIssueAt: input.nextIssueAt, ownerName,
    verdict: { title, sync, summary: summary.join(" ") },
    sections,
    evidence: {
      facets: MIRROR_FACET_IDS.map((facet, i) => ({ facet, name: MIRROR_FACETS[i].name, domain: MIRROR_FACETS[i].domain, selfA: mineFacets[i]?.aCount ?? 0, friendA: ff[i]?.a ?? 0, friendN: ff[i]?.n ?? 0, match: fmr[i] === null ? null : Math.round(fmr[i]! * 100) })),
      answers, friends: friends.length, byCloseness: { 1: size(1), 2: size(2), 3: size(3) },
    },
    bridge: { ...REPORT_BRIDGE },
    stats: { sync, answers, friends: friends.length, friendRatios: ff.map(f => (f ? f.ratio : null)), matchRates: fmr },
  };

  /* ── 꼭지별 만들기(위 계산을 그대로 쓴다) ── */

  function oneSection(): ReportSection {
    const s = friends[0], k = knowRate(s, self);
    const mineOf = (id: string) => self[id] as Choice;
    const real = s.answers.filter((a): a is { itemId: string; choice: Choice } => a.choice !== "skip" && stats.has(a.itemId));
    const facetOf = (id: string) => stats.get(id)!.item.facet;
    const differ = real.filter(a => a.choice !== mineOf(a.itemId)), same = real.filter(a => a.choice === mineOf(a.itemId));
    // 판정 후보: 그 친구가 면의 60%를 넘게 「본인 면 점수와 반대쪽」을 고른 면(숫자는 그 쪽을 고른 수). 4문항 이상 답해서 하나도 안 틀린 면은 따로 짚는다.
    const perfect: FacetId[] = [];
    const perFacet = new Map<FacetId, { n: number; seen: number }>();
    for (const facet of MIRROR_FACET_IDS) {
      const inFacet = real.filter(a => facetOf(a.itemId) === facet), m = mineFacets[facetIndex(facet)];
      if (!m) continue;
      const seenSide = flip(m.side), seen = inFacet.filter(a => sideOf(a.choice) === seenSide).length;
      perFacet.set(facet, { n: inFacet.length, seen });
      if (inFacet.length >= 3 && seen / inFacet.length > REPORT_RULES.splitHigh) candidates.push({ kind: "blind", facet, side: seenSide, gap: Math.abs(seen / inFacet.length - selfCount(facet, seenSide) / 5) });
      if (inFacet.length >= 4 && inFacet.every(a => a.choice === mineOf(a.itemId))) perfect.push(facet);
    }
    candidates.sort((x, y) => y.gap - x.gap || rank(`one:${x.facet}`) - rank(`one:${y.facet}`));
    const order = (list: typeof real) => [...list].sort((x, y) => {
      const cx = candidates.findIndex(c => c.facet === facetOf(x.itemId)), cy = candidates.findIndex(c => c.facet === facetOf(y.itemId));
      return (cx < 0 ? 99 : cx) - (cy < 0 ? 99 : cy) || rank(x.itemId) - rank(y.itemId);
    }).map(a => ({ a, facet: facetOf(a.itemId) }));
    const scene = (a: { itemId: string; choice: Choice }, differs: boolean): ReportScene => {
      const st = stats.get(a.itemId)!;
      return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, sideOf(a.choice)), mine: optText(st.item, sideOf(mineOf(a.itemId))), count: countLine(oneCount(facetName(st.item.facet), differs)) });
    };
    // 판정 후보 면의 장면은 그 친구가 본 쪽과 같은 방향만(풀이 문장과 장면이 엇갈리지 않게).
    const consistent = differ.filter(a => { const c = candidates.find(x => x.facet === facetOf(a.itemId)); return !c || sideOf(a.choice) === c.side; });
    const diffScenes = diverse(order(consistent), 4).map(x => scene(x.a, true));
    const sameScenes = diverse(order(same).filter(x => !perfect.length || perfect.includes(x.facet)), 2).map(x => scene(x.a, false));
    const lead: string[] = [];
    if (k) lead.push(emit(choose([`이 친구는 ${josa(ownerName, "을를")} ${k.percent}% 알고 있어요.`, `${josa(ownerName, "을를")} 아는 정도는 ${k.percent}%예요.`, `이 친구가 맞힌 비율은 ${k.percent}%예요.`], "one:lead")));
    // 고른 주체는 보고서(「이 친구가 골랐다」로 읽히지 않게).
    if (differ.length) {
      const d = differ.length, k = diffScenes.length, m = sameScenes.length;
      lead.push(emit(choose(m
        ? [`다르게 본 ${d}개 중 ${k}개, 똑같이 본 장면 ${m}개를 추려 보여 드려요.`, `아래에는 다르게 본 ${d}개 중 ${k}개, 그리고 똑같이 본 장면 ${m}개를 추려 뒀어요.`, `다르게 본 ${d}개 가운데 ${k}개, 똑같이 본 장면 ${m}개를 아래에 모아 보여 드려요.`]
        : [`다르게 본 ${d}개 중 ${k}개를 추려 보여 드려요.`, `아래에는 다르게 본 ${d}개 중 ${k}개를 추려 뒀어요.`, `다르게 본 ${d}개 가운데 ${k}개를 아래에 모아 보여 드려요.`], "one:pick")));
    }
    const body: string[] = [emit(choose([`${real.length}개 답이 모두 한 사람의 눈이라, 정답이라기보다 이 친구에게 비친 모습이에요.`, `한 사람이 ${real.length}개를 다 답한 거라, 한 친구의 눈으로 본 모습이라고 읽으면 돼요.`, `${real.length}개 모두 한 친구의 답이라, 여러 사람의 평균과는 다를 수 있어요.`], "one:view"))];
    for (const c of candidates.slice(0, 2)) {
      const pf = perFacet.get(c.facet)!;
      body.push(sayWith(front(ONE_FACET, { name: facetName(c.facet), n: pf.n, k: pf.seen, side: SIDE_NOUN[c.facet][c.side] }, "one"), BLIND_LINES[c.facet][c.side].filter(l => !LOCATION_WORDS.test(l)), `one:${c.facet}`));
    }
    if (perfect.length) body.push(emit(choose([`${facetNames(perfect.slice(0, 3))} 면은 이 친구가 하나도 안 틀렸어요.`, `${facetNames(perfect.slice(0, 3))} 면은 이 친구 답이 본인 답과 전부 같아요.`, `이 친구가 ${facetNames(perfect.slice(0, 3))} 면은 다 맞혔어요.`], "one:perfect")));
    return { key: "one", title: SECTION_TITLE.one, lead, scenes: [...diffScenes, ...sameScenes], body, notes: [] };
  }

  function attachSection(mine: Attachment, theirs: Attachment): ReportSection {
    const closeTally = (f: FacetId): Tally => statList.filter(st => st.item.facet === f).reduce((t, st) => ({ n: t.n + st.by[2].n + st.by[3].n, a: t.a + st.by[2].a + st.by[3].a }), { n: 0, a: 0 });
    const tc = closeTally("check"), td = closeTally("dist"), n = closeFriends.length;
    const cs = selfSide("check"), ds = selfSide("dist");
    const best = statList.filter(st => (st.item.facet === "check" || st.item.facet === "dist") && !usedItems.has(st.item.id)).map(st => {
      const t = { n: st.by[2].n + st.by[3].n, a: st.by[2].a + st.by[3].a }, side: Side = t.a * 2 >= t.n ? "A" : "B", m = tallySide(t, side);
      return { st, n: t.n, m, side, share: t.n ? m / t.n : 0 };
    }).filter(x => x.n >= REPORT_RULES.attachSceneMin && x.share >= REPORT_RULES.attachSceneShare)
      .sort((x, y) => y.share - x.share || y.n - x.n || rank(x.st.item.id) - rank(y.st.item.id))[0];
    // 스스로 본 유형: 그 유형 쪽으로 직접 고른 문항 하나를 예로 든다(장면 낱말이 사람마다 다르다).
    const ownEx = MIRROR_ITEMS.filter(i => (i.facet === "check" && self[i.id] === (cs === "A" ? 0 : 1)) || (i.facet === "dist" && self[i.id] === (ds === "A" ? 0 : 1)))
      .filter(i => i.id !== best?.st.item.id).sort((x, y) => rank(`own:${x.id}`) - rank(`own:${y.id}`))[0];
    newSection();
    const typeLines = ATTACH_SELF_TYPE.map(f => f({ label: mine.label, near: mine.near }));
    const lead: string[] = [ownEx ? sayWith(front(ATTACH_SELF_FRONT, { scene: ownEx.self.situation, ans: optText(ownEx, ownEx.facet === "check" ? cs : ds) }, "attach:self", ownEx.id), typeLines, `attach:type:${ownEx.id}`, "attach:type") : emit(choose(typeLines, "attach:type"))];
    const body: string[] = [];
    const splitC = isSplit(tc), splitD = isSplit(td);
    // 확인 · 거리 한 장면 줄은 마디가 정해져 있어 먼저 만들고, 그 앞 문장은 끝맺음이 겹치지 않게 고른다.
    const itemLine = best ? ATTACH_ITEM[best.st.item.id]?.[best.side] ?? null : null;
    const clearInfo = splitC !== splitD ? (splitC ? { f: "dist" as const, t: td } : { f: "check" as const, t: tc }) : null;
    const vs = (t: Tally) => [Math.max(t.a, t.n - t.a), Math.min(t.a, t.n - t.a)] as const;
    /** 반반 쪽 면의 숫자: 같은 「N 대 M」이 이미 나왔으면 숫자 대신 말로(같은 면에서 나왔으면 「앞서 본 것처럼」, 아니면 고른 정도 말만). */
    const show = (f: FacetId, t: Tally) => {
      const [a, b] = vs(t), k = vsKey(a, b);
      const kind = (vsCount.get(k) ?? 0) + 1 <= VS_MAX ? "num" as const : vsFacets.get(k)?.has(f) ? "seen" as const : "words" as const;
      return { kind, a, b, k };
    };
    const word = (x: ReturnType<typeof show>) => (x.kind === "words" ? evenWords(x.a, x.b) : halfWord(x.a, x.b));
    const part = (name: string, x: ReturnType<typeof show>) =>
      x.kind === "num" ? `${name} 면이 ${x.a} 대 ${numRo(x.b)} ${word(x)}` : x.kind === "seen" ? `${name} 면이 앞서 본 것처럼 ${word(x)}` : `${name} 면이 ${word(x)}`;
    if (splitC && splitD) {
      const c = show("check", tc), d = show("dist", td);
      // 두 면을 한 말로: 둘 다 같은 수면 「딱 반반」, 둘 다 45~55%면 「거의 반반」, 둘 다 차이 1 이하면 「팽팽한 편」, 아니면 「크게 기울진 않은 편」.
      const half = c.a === c.b && d.a === d.b ? "딱 반반" : isEven(c.a, c.b) && isEven(d.a, d.b) ? "거의 반반" : isTight(c.a, c.b) && isTight(d.a, d.b) ? "팽팽한 편" : "크게 기울진 않은 편";
      const seenAny = c.kind === "seen" || d.kind === "seen";
      // 두 면의 수가 같으면 한 번에(「확인 · 거리 면 모두 19 대 18로」 · 이미 나온 수면 「앞서 본 것과 같은 수로」).
      const both = c.k === d.k ? `확인 · 거리 면 모두 ${c.kind === "num" ? `${c.a} 대 ${numRo(c.b)}` : seenAny ? "앞서 본 것과 같은 수로" : ""} ${word(c)}`.replace(/\s+/g, " ")
        : c.kind === "num" && d.kind === "num" ? `확인 면 ${c.a} 대 ${c.b}, 거리 면 ${d.a} 대 ${numRo(d.b)} 둘 다 ${half}`
        : c.kind === "seen" && d.kind === "seen" ? `앞서 본 것처럼 확인 · 거리 면 둘 다 ${half}`
        : c.kind !== "words" && d.kind !== "words" && word(c) === word(d) ? `확인 면은 ${c.kind === "num" ? `${c.a} 대 ${numRo(c.b)}` : "앞서 본 대로"}, 거리 면은 ${d.kind === "num" ? `${d.a} 대 ${numRo(d.b)}` : "앞서 본 대로"} 둘 다 ${word(c)}`
        : `${part("확인", c)}이고 ${part("거리", d)}`;
      body.push(noteVs(noteVs(say(ATTACH_SPLIT_BOTH, { n, both }, "attach:split2"), "check"), "dist"));
    }
    else if (clearInfo) {
      // 가까운 사람 답이 반반(40~60%)인 면이 있으면 유형을 단정하지 않는다.
      const splitF = clearInfo.f === "dist" ? "check" : "dist", splitT = clearInfo.f === "dist" ? tc : td, side = ratioSide(clearInfo.t.a, clearInfo.t.n)!;
      const sh = show(splitF, splitT);
      const sp = sh.kind === "num" ? `${sh.a} 대 ${numRo(sh.b)} ${halfWord(sh.a, sh.b)}` : sh.kind === "seen" ? `앞서 본 것처럼 ${halfWord(sh.a, sh.b)}` : evenWords(sh.a, sh.b);
      body.push(noteVs(say(ATTACH_SPLIT_ONE, { n, clear: facetName(clearInfo.f), cn: clearInfo.t.n, ck: tallySide(clearInfo.t, side), cside: SIDE_NOUN[clearInfo.f][side], split: facetName(splitF), sp }, "attach:split1"), splitF));
    } else {
      const same = mine.type === theirs.type, sc = ratioSide(tc.a, tc.n) ?? cs, sd = ratioSide(td.a, td.n) ?? ds;
      const v = { n, label: theirs.label, near: theirs.near, cn: tc.n, ck: tallySide(tc, sc), cs: SIDE_NOUN.check[sc], dn: td.n, dk: tallySide(td, sd), ds: SIDE_NOUN.dist[sd] };
      const head = front(same ? ATTACH_SAME_FRONT : ATTACH_DIFF_FRONT, v, "attach:view", theirs.type) + (theirs.near ? "아직 뚜렷하진 않지만 " : "");
      body.push(sayWith(head, same ? ATTACH_SAME[mine.type] : ATTACH_FRIEND[theirs.type], `attach:${same ? "same" : "diff"}:${theirs.type}:${tc.n}:${td.n}`, `attach:${same ? "same" : "diff"}`, itemLine ? endingKey(itemLine) : ""));
    }
    const scenes: ReportScene[] = [];
    if (best) {
      scenes.push(takeScene({ itemId: best.st.item.id, facet: best.st.item.facet, situation: best.st.item.self.situation, picked: optText(best.st.item, best.side), mine: optText(best.st.item, sideOf(best.st.mine)), count: `친구 · 가까운 사이 ${best.n}명 중 ${best.m}명` }));
      // 앞 문장을 받쳐 주면 「특히」, 반대면 「다만」. 반반인 면이 있으면: 또렷한 면과 같은 쪽 장면이면 「특히」, 아니면 「다만」.
      const facet = best.st.item.facet as "check" | "dist";
      const supports = splitC && splitD ? false : clearInfo ? clearInfo.f === facet && ratioSide(clearInfo.t.a, clearInfo.t.n) === best.side : attachSide(theirs.type, facet) === best.side;
      if (itemLine) body.push(emit(fit(front(ATTACH_ITEM_FRONT, { rel: supports ? "특히" : "다만", cnt: best.m === best.n ? `${best.n}명 모두` : `${best.n}명 중 ${best.m}명이` }, "attach:item", best.st.item.id) + itemLine, `attach:item:${best.st.item.id}`)));
    }
    return { key: "attach", title: SECTION_TITLE.attach, lead, scenes, body, notes: [ATTACH_NOTE] };
  }

  function unknownSection(): ReportSection {
    newSection();
    const counts = MIRROR_FACET_IDS.map((facet, i) => ({ facet, n: ff[i]?.n ?? 0 }));
    const min = Math.min(...counts.map(c => c.n));
    const tied = counts.filter(c => c.n === min).map(c => c.facet);
    let line: string;
    if (tied.length >= 6 && min > 0) line = say(UNKNOWN_EVEN, { min, one }, "unknown:even");
    else {
      const pair = tied.length === 2 && tied[0] === "check" && tied[1] === "dist";
      const single = tied.length === 1 ? tied[0] : null, close = single === "check" || single === "dist";
      // 동률이면 같이 부른다(확인 · 거리는 면 정의 순서). 두 면 이상이면 풀이도 그 면들 전체로.
      const subj = pair ? "친구 · 가까운 사이만 답하는 확인 · 거리 면" : single ? `${close ? "친구 · 가까운 사이만 답하는 " : ""}${facetName(single)} 면` : `${facetNames(tied)} 면`;
      const qt = pair ? "마음을 자주 확인하고 싶은지와 가까이 기대는지는" : single ? `${UNKNOWN_QUESTION[single]}는` : "이 면들은";
      const bucket = min === 0 ? "zero" : min < REPORT_RULES.hiddenMinAnswers ? "few" : "enough";
      const head = front(UNKNOWN_FRONT[bucket], { subj, min, answers }, `unknown:${bucket}`);
      line = sayWith(head, UNKNOWN_BACK[bucket].map(f => f({ qt, need: REPORT_RULES.hiddenMinAnswers - min, more: min + 3, min })), `unknown:${bucket}:back:${tied.join("-")}:${min}`, `unknown:${bucket}:back`);
    }
    return { key: "unknown", title: SECTION_TITLE.unknown, lead: [line], scenes: [], body: [], notes: [], ask: true };
  }

  function nextSection(): ReportSection {
    const opened = new Set<SectionKey>(sections.map(s => s.key));
    const prev = input.previous, date = kstMonthDay(input.nextIssueAt);
    const growth = prev && answers > prev.stats.answers ? `${choose(NEXT_GROWTH.map(g => g({ d: answers - prev.stats.answers })), "next:growth")} ` : "";
    newSection();
    const lead = emit(growth + choose(NEXT_LEAD.map(g => g({ date, n: answers, sync })), `next:lead:${answers}`));
    const body: string[] = [];
    if (one) body.push(emit(choose(["지금은 한 사람의 눈뿐이라, 친구가 한 명만 더 답해도 두 사람의 눈을 나란히 놓고 볼 거예요.", "친구가 한 명 더 답하면 두 사람이 본 모습이 겹쳐지기 시작해요.", "다음 친구가 답하면 이 친구와 같은 장면을 봤는지가 드러나요."], "next:one")));
    if (!one && flags.perItem3 && !opened.has("blind")) body.push(emit(choose([`답 ${answers}개 중에서는 아직 친구 다수가 반대로 본 장면이 없어요.`, `지금까지 ${answers}개 답에서 친구 다수가 반대로 고른 장면은 나오지 않았어요.`, `${answers}개를 모아도 반대로 갈린 장면은 아직 없어요.`, `반대로 본 장면은 답 ${answers}개 안에서 아직 안 보여요.`], "next:noblind")));
    // 열릴 꼭지: 조건 둘까지 한 문장으로, 괄호에는 그 조건에 맞는 묶음 인원(1~2명은 「3명 미만」).
    const hints: string[] = [];
    if (!one && !flags.perItem3) hints.push(front(NEXT_HINT.perItem, { g: `질문당 최대 ${maxItemN}명` }, "hint:perItem"));
    if (!one && !opened.has("closer") && (groupSize(1) < REPORT_RULES.closerMinFriends || groupSize(3) < REPORT_RULES.closerMinFriends)) hints.push(front(NEXT_HINT.closer, { g: `아는 사이 ${groupCount(groupSize(1))} · 가까운 사이 ${groupCount(groupSize(3))}` }, "hint:closer"));
    if (!opened.has("attach") && closeFriends.length < REPORT_RULES.attachMinFriends) hints.push(front(NEXT_HINT.attach, { g: `친구 · 가까운 사이 ${groupCount(closeFriends.length)}` }, "hint:attach"));
    if (!one && !flags.facet6) hints.push(front(NEXT_HINT.facet, { g: `가장 많은 면이 ${Math.max(0, ...ff.map(f => f?.n ?? 0))}개` }, "hint:facet"));
    if (!opened.has("stories")) hints.push(front(NEXT_HINT.stories, { g: "0개" }, "hint:stories").replace(SECTION_TITLE.stories, one ? SECTION_TITLE.storiesOne : SECTION_TITLE.stories));
    const h = hints.slice(0, 2);
    if (h.length) body.push(emit(choose(NEXT_TAIL.map(t => `${h.join(", ")} ${t}`), "next:tail")));
    return { key: "next", title: SECTION_TITLE.next, lead: [lead], scenes: [], body, notes: [] };
  }
}

/** 리뷰용 평문(원문 저장 · 직접 읽기). 화면과 같은 순서 · 같은 문장. */
export function reportToText(r: ReportSnapshot): string {
  const out: string[] = [`결 보고서 ${r.issueNo}호 · ${r.ownerName}`, "", r.verdict.title, `싱크로율 ${r.verdict.sync}%`, r.verdict.summary, ""];
  for (const s of r.sections) {
    out.push(`■ ${s.title}`);
    out.push(...s.lead);
    for (const sc of s.scenes) { out.push(`  · ${sceneLine(s.key, sc)}`); out.push(`    ${sc.count}${sc.share ? "  [장면 공유]" : ""}`); }
    for (const st of s.stories ?? []) out.push(`  · [${st.kindLabel} · ${st.closenessLabel}] ${st.body}`);
    out.push(...s.body);
    for (const n of s.notes) out.push(`  ※ ${n}`);
    if (s.ask) out.push("  [친구에게 물어보기]");
    if (s.key === "next") out.push(`  ${r.bridge.text} (${r.bridge.href})`);
    out.push("");
  }
  out.push("[근거 모두 보기]");
  out.push(`친구 ${r.evidence.friends}명 · 답 ${r.evidence.answers}개 · 아는 사이 ${r.evidence.byCloseness[1] ?? "-"} · 친구 ${r.evidence.byCloseness[2] ?? "-"} · 가까운 사이 ${r.evidence.byCloseness[3] ?? "-"}`);
  for (const f of r.evidence.facets) out.push(`  ${f.domain} · ${f.name}: 내 답 A쪽 ${f.selfA}/5 · 친구 답 A쪽 ${f.friendA}/${f.friendN} · 같게 본 비율 ${f.match === null ? "-" : `${f.match}%`}`);
  return out.join("\n");
}

/**
 * 반복 점검(검사 기준 3차) — 견본 스크립트와 시험이 같이 쓴다. 예외: 꼭지 제목 · 장면 줄 · 근거 줄 · 「10개 질문으로 본 경향이에요」 · 유료 다리 줄 · 이야기 원문.
 *  (a) 한 보고서 안: 이어진 두 문단의 끝맺음 낱말이 같음 · 같은 끝맺음 낱말 3번 이상 · 한 꼭지 안 이어진 두 문단의 이음말 또는 뼈대 첫머리가 같음
 *      · 한 꼭지 안 똑같은 줄(장면 근거 줄 포함, 4차) · 앞줄에 기대는 「이 질문도」 근거 줄.
 *  (b) 같은 사람의 호끼리: 같은 꼭지의 뼈대가 같음 — sameOwnerSkeletons(앞 호, 다음 호).
 *  (c) 다른 사람 사이: 글자까지 똑같은 문장 마디(문장 → 쉼표로 나눈 마디, 숫자 포함).
 * 2차 점검기가 (c)를 놓친 이유: 문장 전체의 뼈대만 비교해서, 앞마디가 다르면 쉼표 뒤 같은 마디(뱅크 마디 · 같은 날짜가 든 앞마디)가 문장 하나로 잡히지 않았다.
 */
export function skeletonOf(sentence: string, names: readonly string[] = []): string {
  let s = sentence.replace(/「[^」]*」/g, "「」").replace(/“[^”]*”/g, "“”").replace(/\d+/g, "#");
  for (const n of [...MIRROR_FACETS.map(f => f.name), ...names].sort((x, y) => y.length - x.length)) s = s.split(n).join("@");
  return s;
}
/** 두 글에 같이 나오는 낱말(토씨를 떼고 앞 두 글자로 비교, 한 글자 · 숫자 든 낱말은 뺀다). 판정 제목과 요약이 같은 낱말을 쓰지 않게. */
export function sharedWords(a: string, b: string): string[] {
  const words = (t: string) => new Set(t.replace(/[.,「」“”()·]/g, " ").split(/\s+/).filter(w => w && !/\d/.test(w)).map(w => (w.replace(/(은|는|이|가|을|를|에서|에|도|의|와|과|로|으로)$/, "") || w).slice(0, 2)).filter(w => w.length >= 2));
  const wb = words(b);
  return [...words(a)].filter(w => wb.has(w));
}
/** 문장의 틀: 뼈대에서 앞의 「@ 면(은 · 에서 · 도 …)」을 떼고 첫 두 낱말(토씨 뗌). 한 꼭지 안 이어진 두 문단의 틀이 같으면 겹친 것으로 본다. */
export function frameOf(line: string, names: readonly string[] = []): string {
  const sk = skeletonOf(line, names).replace(/^@ 면(은|에서는|에서|을|도|의)?\s+/, "");
  return sk.split(/\s+/).slice(0, 2).map(w => w.replace(/(은|는|이|가|을|를|에서|에|도|의|와|과)$/, "") || w).join(" ");
}
export function reportSentences(r: ReportSnapshot): { key: string; lines: string[] }[] {
  return [{ key: "verdict", lines: [r.verdict.summary] }, ...r.sections.map(s => ({ key: s.key, lines: [...s.lead, ...s.body, ...s.notes.filter(n => n !== ATTACH_NOTE)] }))];
}
const sentencesOf = (line: string) => line.split(/(?<=[.?!])\s+/).map(x => x.trim()).filter(Boolean);
/** 문장을 쉼표 마디로(괄호 안 쉼표는 나누지 않는다). 짧은 마디(5자 이하)는 뺀다. */
export const segmentsOf = (sentence: string) => sentence.split(/,\s+(?![^(]*\))/).map(x => x.trim().replace(/[.?!]$/, "")).filter(x => x.length > 5);
/** (a) 한 보고서 안. */
export function withinReportFindings(id: string, r: ReportSnapshot): string[] {
  const out: string[] = [], flat: string[] = [], ends = new Map<string, number>();
  for (const g of reportSentences(r)) {
    g.lines.forEach((line, i) => {
      flat.push(line);
      if (i > 0 && g.key !== "verdict") {
        const prev = g.lines[i - 1], c = connectiveOf(line);
        if (c && c === connectiveOf(prev)) out.push(`${id} ${g.key} 이음말 연속 「${c}」`);
        if (skeletonOf(line, [r.ownerName]).slice(0, 10) === skeletonOf(prev, [r.ownerName]).slice(0, 10)) out.push(`${id} ${g.key} 첫머리 연속 「${line.slice(0, 12)}…」`);
        else if (frameOf(line, [r.ownerName]) === frameOf(prev, [r.ownerName])) out.push(`${id} ${g.key} 틀 연속 「${frameOf(line, [r.ownerName])}」`);
      }
    });
  }
  flat.forEach((line, i) => {
    const e = endingKey(line);
    ends.set(e, (ends.get(e) ?? 0) + 1);
    if (i > 0 && e === endingKey(flat[i - 1])) out.push(`${id} 끝맺음 연속 「${e}」`);
  });
  for (const [e, c] of ends) if (c > ENDING_MAX) out.push(`${id} 끝맺음 ${c}번 「${e}」`);
  // 「~거예요」: 문장 3분의 1 이하 · 이어진 두 문장 연달음 0.
  const sens = flat.flatMap(sentencesOf), geo = sens.map(x => GEO_END.test(x));
  const g = geo.filter(Boolean).length;
  if (g * 3 > sens.length) out.push(`${id} 「거예요」 ${g}/${sens.length}문장`);
  geo.forEach((x, i) => { if (i > 0 && x && geo[i - 1]) out.push(`${id} 「거예요」 연달음 「${sens[i].slice(0, 14)}…」`); });
  // 같은 「N 대 M」 세 번 이상.
  const vsN = new Map<string, number>();
  for (const k of flat.flatMap(vsKeysOf)) vsN.set(k, (vsN.get(k) ?? 0) + 1);
  for (const [k, c] of vsN) if (c > VS_MAX) out.push(`${id} 같은 「N 대 M」 ${c}번 「${k.replace(":", " 대 ")}」`);
  // 한 꼭지 안 똑같은 줄(문단 · 장면 근거 줄 모두)과 앞줄에 기대는 「이 질문도」.
  for (const s of r.sections) {
    const seen = new Set<string>();
    for (const line of [...s.lead, ...s.body, ...s.scenes.map(sc => sc.count)]) {
      if (seen.has(line)) out.push(`${id} ${s.key} 같은 줄 두 번 「${line.slice(0, 16)}…」`);
      seen.add(line);
    }
    for (const sc of s.scenes) if (/질문도/.test(sc.count)) out.push(`${id} ${s.key} 근거 줄 「도」 「${sc.count}」`);
  }
  return out;
}
/** (b) 같은 사람의 앞 호 · 다음 호: 같은 꼭지에서 뼈대가 같은 문장. */
export function sameOwnerSkeletons(a: ReportSnapshot, b: ReportSnapshot): string[] {
  const sk = (r: ReportSnapshot) => new Set(reportSentences(r).flatMap(g => g.lines.flatMap(sentencesOf).map(x => `${g.key}|${skeletonOf(x, [r.ownerName])}`)));
  const sb = sk(b);
  return [...sk(a)].filter(x => sb.has(x));
}
/** (c) 다른 사람 사이: 같은 꼭지에서 글자까지 똑같은 마디. */
export function exactDuplicates(reports: readonly { id: string; snapshot: ReportSnapshot }[]): string[] {
  const seen = new Map<string, Set<string>>();
  for (const { id, snapshot } of reports) for (const g of reportSentences(snapshot)) for (const line of g.lines) for (const sen of sentencesOf(line)) {
    for (const seg of new Set([sen.replace(/[.?!]$/, ""), ...segmentsOf(sen)])) { const k = `${g.key}|${seg}`; seen.set(k, (seen.get(k) ?? new Set()).add(id)); }
  }
  return [...seen].filter(([, ids]) => ids.size > 1).map(([k, ids]) => `글자 그대로 ${[...ids].join("·")} ${k}`);
}
export function repetitionFindings(reports: readonly { id: string; snapshot: ReportSnapshot }[]): string[] {
  return [...reports.flatMap(r => withinReportFindings(r.id, r.snapshot)), ...exactDuplicates(reports)];
}
