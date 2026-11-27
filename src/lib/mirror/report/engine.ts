/**
 * 결 보고서 엔진(D5 → 명령 3 1-2, docs/mirror/SPEC.md 「기록판과 결 보고서」). 순수 함수 — 저장소 · 네트워크 · 시각 · 외부 호출 0, 같은 입력이면 늘 같은 출력.
 * 문장은 src/data/mirror/reportBank.ts(규칙 a~h는 그 파일 머리말). 변형은 사용자 시드(seedKey) + 슬롯 해시에 호 번호를 더해 돌린다.
 *
 * 꼭지(SPEC 표 · 덕짱님 확인 용어 2026-11-27):
 *  1 한 줄 판정 — 항상. 「가장 큰 숨은 면의 수식어 + 친구가 본 유형 이름」 + 요약 첫 문단(친구 수 · 답 수 → 싱크로율 → 총평).
 *  2 숨길 수 없는 나 — 문항당 친구 3명 이상, 80% 이상이 같은 답 + 내 답도 같음. 장면 최대 3개(면이 겹치지 않게 먼저).
 *  3 나만 모르는 나 — 문항당 친구 3명 이상, 60% 이상이 내 답과 반대. 장면 최대 2개.
 *  4 나만 아는 나 — 내 면 뚜렷(5문항 중 4개 이상 한쪽) + 면당 친구 답 6개 이상 + 친구 비율 40~60%. 최대 2면.
 *  5 가까울수록 보이는 나 — 아는 사이 · 가까운 사이 각 3명 이상, 한 면에서 두 묶음 답이 각 3개 이상 · 기운 쪽이 반대 · 비율 차 0.3 이상. 최대 2면.
 *  6 가까운 관계의 나 — 친구 · 가까운 사이 3명 이상. 유형은 확인 · 거리 두 면 근거 짝으로만 말한다.
 *  7 친구들이 남긴 이야기 — 받은 이야기가 있을 때 1~2개.
 *  8 아직 아무도 모르는 나 — 항상(친구 답이 가장 적은 면 + 「친구에게 물어보기」).
 *  9 다음 호 — 항상(열릴 꼭지 + 날짜. 심층 리포트 한 줄은 스냅샷 bridge).
 *  친구가 한 명뿐이면 꼭지 2~5 대신 「한 사람이 본 나」 하나(덕짱님 결정 2026-11-27: 규칙 d의 예외 — 장면은 비율 없이 「이 친구는 …를 골랐어요」,
 *  면 문장은 그 친구가 그 면 5문항을 다 답했을 때만).
 *
 * 꼭지 모양(명령 3 1-2): 첫 문장(lead) → 문장들(body) → 장면 목록(scenes) · 이야기 → 마지막 한 줄(closing).
 *  장면이 두 면 이상이면 첫 문장은 면을 특정하지 않는 숫자 문장(LEADS)이고, 면마다 문장은 body에, 마지막 한 줄은 맨 끝에 말한 면(가장 큰 차이)에 붙는다.
 *
 * 한 줄 판정 수식어: 꼭지 3(면 전체로도 밖에서 반대로 본 면) · 4 · 5 후보 중 「내 쪽 값과 친구 쪽 값의 차」가 가장 큰 면. 같으면 3 → 5 → 4 순, 그다음 시드 순.
 *  대체: 꼭지 2의 면(같게 본 비율 70% 이상), 그것도 없으면 싱크로율 구간(MODIFIER_FALLBACK).
 */
import { MIRROR_FACETS, MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, facetIndex, type FacetId, type MirrorItem } from "../../../data/mirror/items";
import {
  ATTACH_CLOSE, ATTACH_DIFF, ATTACH_FRIEND, ATTACH_ITEM, ATTACH_SELF_AGAIN, ATTACH_NOTE, ATTACH_NOUN, ATTACH_SAME, ATTACH_SELF, ATTACH_SPLIT_BOTH, ATTACH_SPLIT_ONE, ATTACH_THIN, ATTACH_UNDECIDED,
  BAND, BAND_FACETS, BAND_TOP, BLIND_EXCEPT, BLIND_EXCEPT_SCENE, BLIND_FACET, BLIND_SAME, BLIND_SPLIT, CLOSE, CLOSE_PLAIN, CLOSER_G1, CLOSER_G1_NAMED, CLOSER_G3, CLOSER_ONE,
  HEDGE, HIDDEN_FRIEND, HIDDEN_SELF, LEADS, MODIFIERS, MODIFIER_FALLBACK, NEXT_CLOSE, NEXT_GROWTH, NEXT_HINT, NEXT_LEAD, NEXT_NOBLIND, NEXT_ONE,
  ITEM_PUNCH, ONE_CLOSE, ONE_FACET, ONE_LEAD, ONE_PERFECT, OPEN_FACET, POINTER, SECTION_TITLE, SELF_COUNT, SELF_COUNT_AGAIN, SIDE_NOUN, STORIES_CLOSE, STORIES_LEAD, STORIES_REST,
  SUMMARY_COUNT, SUMMARY_PREV, SUMMARY_SYNC, UNKNOWN_BODY, UNKNOWN_CLOSE, UNKNOWN_EVEN, UNKNOWN_EVEN_CLOSE, UNKNOWN_LEAD, UNKNOWN_QUESTION, VAGUE_SUMMARY,
  bandLevel, bestWord, hiddenBucket, ida, numIra, numRo, type ModifierKind,
} from "../../../data/mirror/reportBank";
import { STORY_KIND_LABEL, type StoryKind } from "../../../data/mirror/stories";
import {
  CLOSENESS_LABEL, answeredFriends, facetMatchRates, friendAttachment, friendFacets, friendType, itemMatches, knowRate, selfAttachment, selfFacets, selfType, syncPercent,
  type Attachment, type Choice, type Closeness, type Side,
} from "../engine";
import { hash32 } from "../hash";
import { friendSentence } from "../text";
import { kstMonthDay, sceneLine } from "./format";
import type { ReportInput, ReportScene, ReportSection, ReportSnapshot, ReportStory, SectionKey } from "./types";

export { ida, numRo };

/** 꼭지 열림 기준(용어 확인 2026-11-27) + 문장 규칙(명령 3 1-2). */
export const REPORT_RULES = {
  openMinFriends: 3, openAgree: 0.8, openMaxScenes: 3,
  blindMinFriends: 3, blindOpposite: 0.6, blindMaxScenes: 2,
  hiddenMinAnswers: 6, hiddenSplitLow: 0.4, hiddenSplitHigh: 0.6, hiddenMaxFacets: 2,
  closerMinFriends: 3, closerMinAnswers: 3, closerGap: 0.3, closerMaxFacets: 2,
  attachMinFriends: 3, attachSceneShare: 0.8,
  storiesMax: 2,
  /** 면 이름을 단정하는 기준: 꼭지 2는 같게 본 비율 70% 이상, 꼭지 3은 밖에서 반대로 본 비율 60% 초과. */
  openFacetMatch: 0.7, splitLow: 0.4, splitHigh: 0.6,
  /** 규칙 d: 장면 줄 = 그 문항 친구 답 3개 이상, 면 이름을 단 문장 = 그 면 친구 답 6개 이상. */
  sceneMinAnswers: 3, facetMinAnswers: 6,
  /** 규칙 e: 한 문장 70자 이하 · 쉼표 한 번 · 숫자 쌍 하나. 규칙 g: 마지막 한 줄 8~36자(25자 안팎 — 장면 보기를 인용하면 길어진다). */
  sentenceMax: 70, commaMax: 1, pairMax: 1, closingMin: 8, closingMax: 36,
  /** 규칙 a: 두 면 근거가 모두 이 비율 이상(자가 5/5)이면 「~이에요」, 아니면 「~에 가까워요」. */
  attachStrong: 0.9,
  /** 총평을 면으로 말하는 기준: 잘 맞힌 면 75% 이상 · 많이 엇갈린 면 50% 이하. */
  bestFacet: 0.75, worstFacet: 0.5,
} as const;
export const REPORT_BRIDGE = { text: "이 결이 어디서 왔는지, 사주로 더 깊이 보기 →", href: "/products/saju-mbti-full" } as const;
/** 한 보고서에서 같은 끝맺음 낱말 최대 횟수(명령 3: 문장이 짧아져 문장 수가 늘어 2 → 3. 이어진 두 문장은 여전히 같은 끝맺음 금지). */
const ENDING_MAX = 3;
/** 같은 「N 대 M」(두 수 순서 무관)은 한 보고서에서 숫자로 한 번만. */
const VS_MAX = 1;
const vsKey = (a: number, b: number) => `${Math.max(a, b)}:${Math.min(a, b)}`;
export const vsKeysOf = (t: string) => [...t.matchAll(/(\d+) 대 (\d+)/g)].map(m => vsKey(Number(m[1]), Number(m[2])));
const TYPE_LABEL = /불안-회피형|안정형|불안형|회피형/;
/** 이 애착 유형이 그 면에서 기우는 쪽(확인 A = 불안, 거리 B = 회피). */
const attachSide = (type: Attachment["type"], facet: "check" | "dist"): Side =>
  facet === "check" ? (type === "anxious" || type === "fearful" ? "A" : "B") : (type === "avoidant" || type === "fearful" ? "B" : "A");
/** 가까운 관계 2면 — 면 숫자 · 결론은 꼭지 6(가까운 관계의 나)만 말한다. */
const ATTACH_FACETS: ReadonlySet<FacetId> = new Set(["check", "dist"]);
/** 애착 유형 문장(규칙 a로 끝맺음이 「~에 가까워요 · ~형이에요」로 정해진 문장). */
const fixedEnding = (t: string) => TYPE_LABEL.test(t) && /(가까워요|형이에요)[.]$/.test(t);
/** 「3개 중 3개가」 → 「3개 모두」. */
const tidy = (t: string) => t.replace(/(\d+)개 중 \1개(?:가|를|나) /g, "$1개 모두 ");

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

/**
 * 끝맺음 낱말: 마지막 서술어에서 어미를 떼어 낸 말(「~쪽이에요」 → 「쪽」, 「골랐어요」 → 「골랐」).
 * 이어진 두 문장이 같은 낱말로 끝나거나, 한 보고서에서 같은 낱말이 세 번째가 되면 겹친 것으로 본다.
 */
export function endingKey(t: string): string {
  const toks = t.trim().replace(/[.?!]+$/, "").split(/\s+/);
  let last = toks[toks.length - 1] ?? "";
  if (last === "거예요" && toks.length > 1) last = toks[toks.length - 2];
  return last.replace(/[」”]/g, "").replace(/(이에요|예요|해요|어요|아요|여요|일|을|요)$/, "") || last;
}
export const endingOf = endingKey;
/** 앞마디의 이음말(쉼표 앞 마지막 두 낱말): 한 꼭지 안 이어진 두 문장이 같은 이음말로 시작하지 않게. */
export function connectiveOf(t: string): string {
  const i = t.indexOf(", ");
  if (i < 0) return "";
  const toks = t.slice(0, i).trim().split(/\s+/);
  return toks.slice(-2).join(" ").replace(/[\d「」“”]/g, "");
}

/* ───────── 문장 규칙(규칙 b · e · f) — 엔진이 변형을 고를 때와 점검기가 같이 쓴다 ───────── */
/** 숫자 쌍: 「N개 중 M개」 · 「N 대 M」 · 「N/M」. 애착 근거 짝(「a/b · c/d」)은 하나로 센다. */
export function numberPairs(t: string): number {
  const s = t.replace(/\d+\/\d+ · [^\d]*?\d+\/\d+/g, "§");
  return (s.match(/§/g)?.length ?? 0) + (s.match(/\d+(?:명|개|문항)? 중 \d+/g)?.length ?? 0) + (s.match(/\d+ 대 \d+/g)?.length ?? 0) + (s.match(/\d+\/\d+/g)?.length ?? 0);
}
/** 따옴표 · 낫표 안(문항 원문 · 보기 원문)은 빼고 본 문장. */
const bare = (t: string) => t.replace(/「[^」]*」|“[^”]*”|'[^']*'/g, "□");
/** 한 문장의 규칙 위반(없으면 빈 배열). */
export function sentenceProblems(t: string): string[] {
  const out: string[] = [];
  if (t.length > REPORT_RULES.sentenceMax) out.push(`길이 ${t.length}자`);
  const b = bare(t);
  const commas = (b.match(/, /g) ?? []).length;
  if (commas > REPORT_RULES.commaMax) out.push(`쉼표 ${commas}번`);
  const pairs = numberPairs(t);
  if (pairs > REPORT_RULES.pairMax) out.push(`숫자 쌍 ${pairs}개`);
  if (HEDGE.test(b)) out.push(`말끝 흐림 「${b.match(HEDGE)![0]}」`);
  if (/거예요[.]?$/.test(t) && !/일 거예요[.]?$/.test(t)) out.push("「일 거예요」가 아닌 추측");
  if (POINTER.test(b)) out.push(`지시어 「${b.match(POINTER)![0]}」`);
  if (!/요[.]$/.test(t)) out.push("해요체 끝맺음 아님");
  return out;
}

/** 장면 근거 줄의 꼴(한 꼭지에 같은 숫자 줄이 겹치면 다음 꼴로). */
const hiddenCount = (n: number, k: number) => [`친구 ${n}명 중 ${k}명이 같은 답`, `${n}명 중 ${k}명이 본인과 같은 답`, `같은 답 ${k}명 · 다른 답 ${n - k}명`, `본인과 같은 답 ${k}명(${n}명 중)`];
const closerCount = (n3: number, k3: number, n1: number, k1: number) => [
  `가까운 사이 ${n3}명 중 ${k3}명 · 아는 사이는 ${n1}명 중 ${k1}명이 반대 답`,
  `아는 사이 ${n1}명 중 ${k1}명이 반대 답 · 가까운 사이는 ${n3}명 중 ${k3}명`,
  `가까운 사이 ${k3}명(${n3}명 중) · 반대 답 아는 사이 ${k1}명(${n1}명 중)`,
];

export function buildReport(input: ReportInput): ReportSnapshot {
  const { self, ownerName, seedKey, issueNo } = input;
  const shift = Math.max(0, Math.floor(issueNo) - 1);
  const rank = (key: string) => hash32(`${seedKey}:rank:${key}`);
  const startOf = (slot: string, n: number) => (hash32(`${seedKey}:${slot}`) + shift) % n;

  // ── 변형 고르기: 호 번호로 돌리고, 규칙(길이 · 쉼표 · 숫자 쌍 · 말끝 흐림 · 지시어), 끝맺음 겹침, 같은 「N 대 M」, 바로 앞 문장과 같은 첫머리를 피한다 ──
  let lastEnd = "", lastLine = "", curKey = "verdict";
  const endCount = new Map<string, number>(), vsCount = new Map<string, number>(), usedLines = new Set<string>(), usedBySlot = new Map<string, Set<number>>();
  let sectionCounts = new Set<string>(), sectionEnds = new Set<string>(), sectionFrames = new Set<string>();
  const newSection = (key: string) => { curKey = key; lastLine = ""; sectionCounts = new Set(); sectionEnds = new Set(); sectionFrames = new Set(); };
  // 같은 사람의 다음 호: 지난 호의 같은 꼭지에서 쓴 뼈대는 피한다(형식이 정해진 줄은 뺀다).
  const prevSk = new Set(input.previous ? reportSentences(input.previous).flatMap(g => g.lines.filter(x => !COUNT_LINE.test(x)).map(x => `${g.key}|${skeletonOf(x, [ownerName])}`)) : []);
  // 틀(뼈대 첫 두 낱말) · 끝(뼈대 마지막 두 낱말)도 지난 호의 같은 꼭지와 겹치지 않게(앞 · 뒤 한쪽만 바꾼 같은 문장 틀을 막는다).
  // 지난 호와 견주는 첫머리는 뼈대 앞 네 낱말(「같은 쪽을 고른 친구 답은 …」처럼 확 드러나는 같은 시작) — 두 낱말은 흔한 말(「친구 답」)까지 막는다.
  const openOf = (t: string) => skeletonOf(t, [ownerName]).replace(/^@ 면(은|에서는|에서|을|도|의)?\s+/, "").split(/\s+/).slice(0, 4).join(" ");
  const tailOf = (t: string) => skeletonOf(t, [ownerName]).split(/\s+/).slice(-2).join(" ");
  const prevFrames = new Set(input.previous ? reportSentences(input.previous).flatMap(g => g.lines.filter(x => !COUNT_LINE.test(x)).flatMap(x => [`${g.key}|f|${openOf(x)}`, `${g.key}|t|${tailOf(x)}`])) : []);
  const freshOk = (t: string) => !prevSk.size || COUNT_LINE.test(t) || (!prevSk.has(`${curKey}|${skeletonOf(t, [ownerName])}`) && !prevFrames.has(`${curKey}|f|${openOf(t)}`));
  /** 끝 틀까지 다르면 더 좋다(먼저 고르는 조건에만 — 안 되면 첫머리 · 뼈대만 지킨다). */
  const tailFresh = (t: string) => !prevSk.size || COUNT_LINE.test(t) || !prevFrames.has(`${curKey}|t|${tailOf(t)}`);
  /** 지난 호에서 본인 5문항 수를 이미 말한 면(2호에서는 「지난 호와 같이」 꼴로). */
  const prevSelf = new Set<FacetId>(input.previous ? MIRROR_FACETS.filter(fc => reportSentences(input.previous!).some(g => g.lines.some(x => x.includes(`${fc.name} 면`) && /5문항/.test(x)))).map(fc => fc.id) : []);
  // 끝맺음: 바로 앞 문장과 다르고, 한 보고서에서 3번까지, 한 꼭지 안에서는 한 번만.
  const endOk = (t: string) => { if (fixedEnding(t)) return true; const e = endingKey(t); return e !== lastEnd && (endCount.get(e) ?? 0) < ENDING_MAX && !sectionEnds.has(e); };
  const vsOk = (t: string) => { const c = new Map<string, number>(); for (const k of vsKeysOf(t)) { c.set(k, (c.get(k) ?? 0) + 1); if ((vsCount.get(k) ?? 0) + c.get(k)! > VS_MAX) return false; } return true; };
  const shapeOk = (t: string) => sentenceProblems(t).length === 0;
  const flowOk = (t: string) => !lastLine || (skeletonOf(t, [ownerName]).slice(0, 10) !== skeletonOf(lastLine, [ownerName]).slice(0, 10) && frameOf(t, [ownerName]) !== frameOf(lastLine, [ownerName])
    && (!connectiveOf(t) || connectiveOf(t) !== connectiveOf(lastLine)));
  // 한 꼭지 안에서 같은 틀(뼈대 첫 두 낱말)은 한 번만(이어지지 않아도 — 두 면을 나란히 말할 때 같은 틀로 겹치지 않게).
  const frameOk = (t: string) => !sectionFrames.has(frameOf(t, [ownerName]));
  const fine = (t: string) => endOk(t) && vsOk(t) && shapeOk(t) && flowOk(t) && frameOk(t) && freshOk(t) && tailFresh(t) && !usedLines.has(t);
  function choose(options: readonly string[], slot: string, family = slot): string {
    const used = usedBySlot.get(family) ?? new Set<number>();
    const n = options.length, start = startOf(slot, n);
    const tests: ((i: number, t: string) => boolean)[] = [
      (i, t) => !used.has(i) && fine(t), (_, t) => fine(t), (_, t) => endOk(t) && vsOk(t) && shapeOk(t) && flowOk(t) && frameOk(t) && freshOk(t) && !usedLines.has(t),
        (_, t) => shapeOk(t) && vsOk(t) && endOk(t) && flowOk(t) && freshOk(t) && !usedLines.has(t),
      (_, t) => shapeOk(t) && vsOk(t) && endOk(t) && freshOk(t) && !usedLines.has(t),
      // 지난 호와 겹치지 않는 것을 꼭지 안 끝맺음 한 번보다 먼저 지킨다(바로 앞 문장과 같은 끝맺음은 여전히 피한다).
      (_, t) => shapeOk(t) && vsOk(t) && freshOk(t) && endingKey(t) !== lastEnd && !usedLines.has(t),
      (_, t) => shapeOk(t) && vsOk(t) && endOk(t) && !usedLines.has(t),
      (_, t) => shapeOk(t) && endingKey(t) !== lastEnd && !usedLines.has(t), (_, t) => shapeOk(t) && !usedLines.has(t), (_, t) => shapeOk(t), () => true,
    ];
    for (const test of tests) for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      if (test(i, options[i])) { used.add(i); usedBySlot.set(family, used); return options[i]; }
    }
    return options[start];
  }
  /** 이 문장을 보고서에 싣는다(끝맺음 · 「N 대 M」 · 바로 앞 문장 기록). 애착 유형 문장은 끝맺음이 규칙 a로 정해져 끝맺음 세기에서 뺀다. */
  const emit = (t: string) => {
    const e = endingKey(t);
    if (!fixedEnding(t)) { lastEnd = e; endCount.set(e, (endCount.get(e) ?? 0) + 1); sectionEnds.add(e); }
    for (const k of vsKeysOf(t)) vsCount.set(k, (vsCount.get(k) ?? 0) + 1);
    usedLines.add(t); lastLine = t; sectionFrames.add(frameOf(t, [ownerName]));
    return t;
  };
  type F<V> = readonly ((v: V) => string)[];
  const say = <V>(list: F<V>, v: V, slot: string, family?: string) => emit(choose(list.map(f => tidy(f(v))), slot, family));
  const sayLines = (lines: readonly string[], slot: string, family?: string) => emit(choose(lines, slot, family));
  /** 장면 근거 줄: 이 꼭지에서 아직 안 쓴 꼴을 앞에서부터. */
  const countLine = (forms: readonly string[]) => { const c = forms.find(f => !sectionCounts.has(f)) ?? forms[forms.length - 1]; sectionCounts.add(c); return c; };

  const friends = answeredFriends(input.sessions);
  const one = friends.length === 1;
  const sync = syncPercent(self, input.sessions) ?? 0;
  const matches = itemMatches(self, input.sessions);
  const answers = matches.reduce((s, m) => s + m.total, 0);
  const mineFacets = selfFacets(self), ff = friendFacets(input.sessions), fmr = facetMatchRates(self, input.sessions);
  const groupSize = (c: Closeness) => friends.filter(s => s.closeness === c).length;
  const facetTally = (f: FacetId): Tally => { const x = ff[facetIndex(f)]; return x ? { n: x.n, a: x.a } : { n: 0, a: 0 }; };
  /** 「아직 아무도 모르는 나」가 말할 면: 친구 답이 가장 적은 면들(6면 이상이 같고 0개가 아니면 even — 면을 말하지 않는다). 이름은 앞 3면까지. */
  const unknownTarget = () => {
    const counts = MIRROR_FACET_IDS.map((facet, i) => ({ facet, n: ff[i]?.n ?? 0 }));
    const min = Math.min(...counts.map(c => c.n));
    const tied = counts.filter(c => c.n === min).map(c => c.facet);
    return { min, tied, even: tied.length >= 6 && min > 0, named: tied.slice(0, 3) };
  };
  const facetOk = (f: FacetId) => facetTally(f).n >= REPORT_RULES.facetMinAnswers;
  const selfSide = (f: FacetId): Side => mineFacets[facetIndex(f)]!.side;
  const selfCount = (f: FacetId, side: Side) => { const m = mineFacets[facetIndex(f)]!; return side === "A" ? m.aCount : 5 - m.aCount; };
  const matchRate = (f: FacetId) => fmr[facetIndex(f)];
  const noun = (f: FacetId, s: Side) => SIDE_NOUN[f][s];

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
  const section = (key: SectionKey, title: string, parts: Partial<Omit<ReportSection, "key" | "title">> & { closing: string }): ReportSection =>
    ({ key, title, lead: [], scenes: [], body: [], notes: [], ...parts });

  const level = bandLevel(sync);
  // ── 요약 첫 문단(규칙 h): 친구 수 · 답 수 → 싱크로율 → 주어가 분명한 총평. 화면 순서대로 먼저 만든다(끝맺음 점검이 위에서 아래로 흐르게) ──
  newSection("verdict");
  const who = one ? { s: "이 친구가", e: "이 친구 눈에" } : { s: "친구들이", e: "친구들 눈에" };
  const summary: string[] = [emit(SUMMARY_COUNT({ one, friends: friends.length, answers }))];
  // 2호부터는 싱크로율 문장 하나가 지난 호와 견준 꼴(규칙 h: 싱크로율은 한 번).
  summary.push(input.previous ? say(SUMMARY_PREV, { p: input.previous.stats.sync, s: sync }, "summary:prev") : say(SUMMARY_SYNC, { sync }, "summary:sync"));
  {
    const rated = MIRROR_FACET_IDS.map((f, i) => ({ f, r: fmr[i] })).filter((x): x is { f: FacetId; r: number } => x.r !== null && facetOk(x.f) && !ATTACH_FACETS.has(x.f))
      .sort((x, y) => y.r - x.r || rank(`best:${x.f}`) - rank(`best:${y.f}`));
    const best = rated[0] && rated[0].r >= REPORT_RULES.bestFacet ? rated[0].f : null;
    const worstEntry = [...rated].reverse()[0];
    const worst = worstEntry && worstEntry.r <= REPORT_RULES.worstFacet && worstEntry.f !== best ? worstEntry.f : null;
    const pct = (f: FacetId | null) => (f ? Math.round(matchRate(f)! * 100) : 0);
    const fv = { ...who, best: best ? facetName(best) : "", worst: worst ? facetName(worst) : "", bp: pct(best), wp: pct(worst), bw: bestWord(pct(best)) };
    const lines = level === "high" && worst ? BAND_FACETS.highWorst.map(f => f(fv))
      : level === "low" && best ? BAND_FACETS.lowBest.map(f => f(fv))
      : level !== "high" && level !== "low" && best && worst ? BAND_FACETS.mixed.map(f => f(fv))
      : (sync >= 90 ? BAND_TOP : BAND[level]).map(f => f(who));
    summary.push(sayLines(lines, `summary:band:${level}`));
  }

  const sections: ReportSection[] = [];
  const candidates: Hidden[] = [];
  let openTop = null as { facet: FacetId; side: Side } | null;
  const flags = { perItem3: maxItemN >= REPORT_RULES.openMinFriends, facet6: ff.some(f => (f?.n ?? 0) >= REPORT_RULES.hiddenMinAnswers) };

  if (one) sections.push(oneSection());
  else {
    // 나만 아는 나(면 단위)를 먼저 고른다 — 그 면의 문항은 나만 모르는 나 장면으로 쓰지 않는다(면 이야기가 장면 하나로 빠지지 않게). 화면 순서는 SPEC 표대로.
    const o = openSection();
    const h = hiddenSection();
    const b = blindSection(h?.facets ?? []);
    for (const x of [o, b, h?.section]) if (x) sections.push(x);
    const c = closerSection(h?.facets ?? []); if (c) sections.push(c);
  }

  // ── 꼭지 6 가까운 관계의 나 ──
  const closeFriends = friends.filter(s => s.closeness !== 1);
  const mineAttach = selfAttachment(self), theirAttach = friendAttachment(input.sessions, self);
  if (closeFriends.length >= REPORT_RULES.attachMinFriends && mineAttach) sections.push(attachSection(mineAttach, theirAttach));

  // ── 꼭지 7 친구들이 남긴 이야기 ──
  if (input.stories.length) sections.push(storiesSection());

  // ── 꼭지 8 아직 아무도 모르는 나 ──
  sections.push(unknownSection());

  // ── 한 줄 판정 ──
  candidates.sort((x, y) => y.gap - x.gap || KIND_ORDER[x.kind] - KIND_ORDER[y.kind] || rank(`v:${x.facet}`) - rank(`v:${y.facet}`));
  const top = candidates[0];
  const typeTitle = (friendType(input.sessions, self) ?? selfType(self))?.title ?? "";
  // 수식어가 유형 이름과 같은 낱말을 쓰지 않게(「혼자 해결하는 … 해결사」) — 겹치면 다른 변형.
  const stems = typeTitle.split(" ").map(w => w.slice(0, 2));
  const pickMod = (list: readonly string[]) => { const ok = list.filter(m => !stems.some(st => st && m.includes(st))); const pool = ok.length ? ok : list; return pool[startOf("verdict", pool.length)]; };
  const modifier = top ? pickMod(MODIFIERS[top.kind][top.facet][top.side]) : openTop ? pickMod(MODIFIERS.open[openTop.facet][openTop.side]) : pickMod(MODIFIER_FALLBACK[level]);

  // ── 꼭지 9 다음 호 ──
  sections.push(nextSection());

  const title = [modifier, typeTitle].filter(Boolean).join(" ");
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

  /** 장면 보기의 결론 한 줄(ITEM_PUNCH — 고른 쪽). 이미 쓴 줄이면 없음. */
  function scenePunch(sc: ReportScene | undefined): string | null {
    if (!sc) return null;
    const item = MIRROR_ITEM_BY_ID.get(sc.itemId), p = ITEM_PUNCH[sc.itemId];
    if (!item || !p) return null;
    const line = p[item.self.a === sc.picked ? "A" : "B"];
    // 끝맺음 · 첫머리 규칙을 못 지키면 쓰지 않는다(대신 일반 한 줄).
    return usedLines.has(line) || !shapeOk(line) || !endOk(line) || !flowOk(line) || !freshOk(line) ? null : line;
  }

  /** 장면이 한 면이면 그 면 문장을 첫 문장으로, 여러 면이면 면을 특정하지 않는 숫자 문장(LEADS). */
  function leadFor(kind: keyof typeof LEADS, facets: readonly FacetId[], k: number, facetLine: (() => string) | null): string {
    if (facets.length === 1 && facetLine) return facetLine();
    return say(LEADS[kind], leadV(k), `${kind}:lead`);
  }
  function leadV(k: number, facets: readonly FacetId[] = []) {
    return { k, n: friends.length, m: facets.reduce((x, f) => x + facetTally(f).n, 0), g1: groupSize(1), g3: groupSize(3) };
  }

  function openSection(): ReportSection | null {
    // 확인 · 거리 문항은 「가까운 관계의 나」만 다룬다(장면도).
    const open = statList.filter(st => !ATTACH_FACETS.has(st.item.facet) && st.all.n >= REPORT_RULES.openMinFriends && agreeOf(st) / st.all.n >= REPORT_RULES.openAgree)
      .map(st => ({ st, facet: st.item.facet, rate: agreeOf(st) / st.all.n }))
      .sort((x, y) => y.rate - x.rate || y.st.all.n - x.st.all.n || rank(x.st.item.id) - rank(y.st.item.id));
    if (!open.length) return null;
    newSection("open");
    const chosen = diverse(open, REPORT_RULES.openMaxScenes);
    const scenes = chosen.map(({ st }): ReportScene => {
      const s = sideOf(st.mine), n = st.all.n, k = agreeOf(st), count = `친구 ${n}명 중 ${k}명`;
      const forms = k === n ? [`${count} · 본인도 같은 답`, `${n}명 모두 본인과 같은 답`, `친구 ${n}명이 다 같은 답`, `같은 답 ${k}명 · 다른 답 0명`]
        : [`${count} · 본인도 같은 답`, `${n}명 중 ${k}명이 본인과 같은 답`, `같은 답 ${k}명 · 다른 답 ${n - k}명`, `본인과 같은 답 ${k}명(${n}명 중)`];
      return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, s), mine: optText(st.item, s), count: countLine(forms), n, share: shareFor(st.item, s, count) });
    });
    const facets = [...new Set(chosen.map(c => c.facet))];
    // 면 이름은 그 면 전체 같게 본 비율 70% 이상 · 친구 답 6개 이상 · 면 점수 방향이 장면과 같을 때만 단정한다.
    const strong = chosen.map(c => ({ c, side: sideOf(c.st.mine), r: matchRate(c.facet) }))
      .filter(x => { const t = facetTally(x.c.facet); return !ATTACH_FACETS.has(x.c.facet) && x.r !== null && x.r >= REPORT_RULES.openFacetMatch && selfSide(x.c.facet) === x.side && facetOk(x.c.facet) && tallySide(t, x.side) / t.n >= REPORT_RULES.openFacetMatch; })
      .sort((x, y) => y.r! - x.r! || rank(x.c.facet) - rank(y.c.facet))[0];
    const facetLine = strong ? () => { const f = strong.c.facet, t = facetTally(f); return say(OPEN_FACET, { name: facetName(f), n: t.n, k: tallySide(t, strong.side), noun: noun(f, strong.side) }, `open:facet:${f}`, "open:facet"); } : null;
    const single = facets.length === 1 && !!strong && strong.c.facet === facets[0];
    const lead = [leadFor("open", facets, open.length, single ? facetLine : null)];
    const body: string[] = [];
    if (strong && !single) body.push(facetLine!());
    if (strong) openTop = { facet: strong.c.facet, side: strong.side };
    // 면으로 단정할 근거가 없으면 가장 많이 같은 답이 나온 장면의 결론 한 줄(보기를 그대로 되풀이하지 않는다).
    const punch = scenePunch(scenes[0]);
    const closing = strong ? sayLines(CLOSE.open[strong.c.facet][strong.side], `open:close:${strong.c.facet}`, "open:close")
      : punch ? emit(punch) : sayLines(CLOSE_PLAIN.openAny, "open:any");
    return section("open", SECTION_TITLE.open, { lead, body, scenes, closing });
  }

  function blindSection(hiddenFacets: readonly FacetId[]): ReportSection | null {
    const openFacets = new Set(sceneFacets), skip = new Set(hiddenFacets);
    const blind = statList.filter(st => !usedItems.has(st.item.id) && !skip.has(st.item.facet) && !ATTACH_FACETS.has(st.item.facet) && st.all.n >= REPORT_RULES.blindMinFriends && (st.all.n - agreeOf(st)) / st.all.n >= REPORT_RULES.blindOpposite)
      .map(st => ({ st, facet: st.item.facet, rate: (st.all.n - agreeOf(st)) / st.all.n }))
      .sort((x, y) => Number(openFacets.has(x.facet)) - Number(openFacets.has(y.facet)) || y.rate - x.rate || y.st.all.n - x.st.all.n || rank(x.st.item.id) - rank(y.st.item.id));
    if (!blind.length) return null;
    newSection("blind");
    const chosen = diverse(blind, REPORT_RULES.blindMaxScenes);
    const scenes = chosen.map(({ st }): ReportScene => {
      const seen = flip(sideOf(st.mine)), n = st.all.n, k = n - agreeOf(st), count = `친구 ${n}명 중 ${k}명`;
      const forms = k === n ? [count, `${n}명 모두 반대 답`, `친구 ${n}명이 다 반대쪽`, `반대 답 ${k}명 · 같은 답 0명`]
        : [count, `${n}명 중 ${k}명이 반대 답`, `반대 답 ${k}명 · 같은 답 ${n - k}명`, `반대쪽 ${k}명(${n}명 중)`];
      return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, seen), mine: optText(st.item, sideOf(st.mine)), count: countLine(forms), n, share: shareFor(st.item, seen, count) });
    });
    // 면마다 경우를 정한다: 면 전체로도 반대(strong) · 본인 면 점수가 친구 쪽(except) · 반반(split) · 면 전체로는 본인 쪽(same) · 답 부족(thin).
    type Case = { f: FacetId; kind: "strong" | "except" | "split" | "same" | "thin"; mine: Side; seen: Side; scene: string; gap: number };
    const cases: Case[] = [...new Set(chosen.map(c => c.facet))].map(f => {
      const c = chosen.find(x => x.facet === f)!, mine = sideOf(c.st.mine), seen = flip(mine), t = facetTally(f);
      const base = { f, mine, seen, scene: c.st.item.self.situation, gap: c.rate };
      // 확인 · 거리 면의 면 숫자는 「가까운 관계의 나」가 말한다(같은 숫자를 두 꼭지에서 되풀이하지 않게) — 여기서는 장면만.
      if (!facetOk(f) || ATTACH_FACETS.has(f)) return { ...base, kind: "thin" as const };
      if (selfSide(f) !== mine) return { ...base, kind: "except" as const };
      if (tallySide(t, seen) / t.n > REPORT_RULES.splitHigh) return { ...base, kind: "strong" as const };
      if (isSplit(t)) return { ...base, kind: "split" as const };
      return { ...base, kind: "same" as const };
    });
    // 마지막 한 줄은 면 전체로도 반대로 본 면(차이가 가장 큰 것)에 붙는다 — 그 면을 맨 뒤에 말한다.
    const strongs = cases.filter(c => c.kind === "strong").sort((x, y) => y.gap - x.gap);
    const primary = strongs[0] ?? null;
    for (const c of strongs) candidates.push({ kind: "blind", facet: c.f, side: c.seen, gap: c.gap });
    const ordered = primary ? [...cases.filter(c => c !== primary), primary] : cases;
    const talk = ordered.filter(c => c.kind !== "thin");
    const lines = (c: Case): string[] => {
      const t = facetTally(c.f), name = facetName(c.f), key = `${c.f}:${c.kind}`;
      if (c.kind === "strong") return [say(BLIND_FACET, { name, n: t.n, k: tallySide(t, c.seen), noun: noun(c.f, c.seen) }, `blind:facet:${key}`, "blind:facet"),
        // 2호에서 지난 호에 이미 말한 본인 답 수는 되풀이하지 않는다(친구 쪽 숫자만).
        ...(prevSelf.has(c.f) ? [] : [say(SELF_COUNT, { m: selfCount(c.f, c.mine), noun: noun(c.f, c.mine) }, `blind:self:${key}`, "self")])];
      if (c.kind === "except") return [say(BLIND_EXCEPT, { name, m: selfCount(c.f, c.seen), noun: noun(c.f, c.seen) }, `blind:except:${key}`, "blind:except"), say(BLIND_EXCEPT_SCENE, { scene: c.scene }, `blind:exscene:${key}`, "blind:exscene")];
      if (c.kind === "split") { const a = Math.max(t.a, t.n - t.a), b = Math.min(t.a, t.n - t.a); return [say(BLIND_SPLIT, { name, a, b }, `blind:split:${key}`, "blind:split")]; }
      return [say(BLIND_SAME, { name, n: t.n, k: tallySide(t, c.mine) }, `blind:same:${key}`, "blind:same")];
    };
    const facets = [...new Set(chosen.map(c => c.facet))];
    let lead: string[], body: string[] = [];
    if (facets.length === 1 && talk.length === 1) { const ls = lines(talk[0]); lead = [ls[0]]; body = ls.slice(1); }
    else { lead = [say(LEADS.blind, leadV(blind.length), "blind:lead")]; for (const c of talk) body.push(...lines(c)); }
    // 면으로 단정할 근거가 없으면 마지막 한 줄은 장면에서: 친구 다수가 고른 보기(「~다」로 끝나는 보기).
    const punch = scenePunch(scenes[0]);
    const closing = primary ? sayLines(CLOSE.blind[primary.f][primary.seen], `blind:close:${primary.f}`, "blind:close")
      : talk.length && talk.every(c => c.kind === "except" || c.kind === "same") ? sayLines(CLOSE_PLAIN.blindFew, "blind:few")
      : punch ? emit(punch) : sayLines(CLOSE_PLAIN.blindAny, "blind:any");
    return section("blind", SECTION_TITLE.blind, { lead, body, scenes, closing });
  }

  function hiddenSection(): { section: ReportSection; facets: FacetId[] } | null {
    const hidden = MIRROR_FACET_IDS.flatMap((facet, i) => {
      const m = mineFacets[i], f = ff[i];
      if (sceneFacets.has(facet) || ATTACH_FACETS.has(facet) || !m || !f || Math.abs(m.aCount - 2.5) < 1.5 || f.n < REPORT_RULES.hiddenMinAnswers || f.ratio < REPORT_RULES.hiddenSplitLow || f.ratio > REPORT_RULES.hiddenSplitHigh) return [];
      return [{ facet, side: m.side, gap: Math.abs(m.aCount / 5 - f.ratio), f, aCount: m.aCount }];
    }).sort((x, y) => y.gap - x.gap || rank(x.facet) - rank(y.facet)).slice(0, REPORT_RULES.hiddenMaxFacets);
    if (!hidden.length) return null;
    newSection("hidden");
    const scenes: ReportScene[] = [];
    for (const h of hidden) {
      // 예시 장면: 그 면에서 내 답이 그쪽이고 친구 답(3개 이상)이 반반에 가장 가까운 문항.
      const ex = statList.filter(st => st.item.facet === h.facet && !usedItems.has(st.item.id) && sideOf(st.mine) === h.side && st.all.n >= REPORT_RULES.sceneMinAnswers && Math.abs(st.all.a / st.all.n - 0.5) <= 0.1 + 1e-9)
        .sort((x, y) => Math.abs(x.all.a / x.all.n - 0.5) - Math.abs(y.all.a / y.all.n - 0.5) || y.all.n - x.all.n || rank(x.item.id) - rank(y.item.id))[0];
      if (ex) {
        const exSide = ratioSide(ex.all.a, ex.all.n) ?? flip(h.side);
        scenes.push(takeScene({ itemId: ex.item.id, facet: h.facet, situation: ex.item.self.situation, picked: optText(ex.item, exSide), mine: optText(ex.item, h.side), count: countLine(hiddenCount(ex.all.n, tallySide(ex.all, h.side))), n: ex.all.n }));
      }
      candidates.push({ kind: "hidden", facet: h.facet, side: h.side, gap: h.gap });
    }
    // 가장 차이가 큰 면을 맨 뒤에 말하고, 마지막 한 줄을 그 면에 붙인다. 장면이 있는 면은 맨 뒤로(마지막 한 줄이 장면과 같은 면이 되게).
    const shown = new Set(scenes.map(sc => sc.facet));
    const ordered = [...hidden].reverse().sort((x, y) => Number(shown.has(x.facet)) - Number(shown.has(y.facet)));
    const lines = (h: typeof hidden[number]) => {
      const k5 = h.side === "A" ? h.aCount : 5 - h.aCount, m = tallySide(h.f, h.side), key = `${h.facet}:${h.side}`;
      return [prevSelf.has(h.facet) ? say(SELF_COUNT_AGAIN, { m: k5, noun: noun(h.facet, h.side), name: facetName(h.facet) }, `hidden:again:${key}`, "again") : say(HIDDEN_SELF, { name: facetName(h.facet), k5, noun: noun(h.facet, h.side) }, `hidden:self:${key}:${h.f.n}`, "hidden:self"),
        say(HIDDEN_FRIEND[hiddenBucket(m / h.f.n)], { n: h.f.n, m }, `hidden:friend:${key}`, `hidden:friend:${hiddenBucket(m / h.f.n)}`)];
    };
    let lead: string[], body: string[] = [];
    if (ordered.length === 1) { const ls = lines(ordered[0]); lead = [ls[0]]; body = ls.slice(1); }
    else { lead = [say(LEADS.hidden, leadV(ordered.length, ordered.map(h => h.facet)), "hidden:lead")]; for (const h of ordered) body.push(...lines(h)); }
    const last = ordered[ordered.length - 1];
    // 친구 답의 절반 이상이 본인과 같은 쪽이면 「본인만 알아요」 꼴은 쓰지 않는다.
    const lastShare = tallySide(last.f, last.side) / last.f.n, lines0 = CLOSE.hidden[last.facet][last.side];
    const pool = lastShare >= 0.5 ? lines0.filter(l => !/본인만/.test(l)) : lines0;
    const closing = sayLines(pool.length ? pool : lines0, `hidden:close:${last.facet}`, "hidden:close");
    return { section: section("hidden", SECTION_TITLE.hidden, { lead, body, scenes, closing }), facets: hidden.map(h => h.facet) };
  }

  function closerSection(hiddenFacets: readonly FacetId[]): ReportSection | null {
    if (groupSize(1) < REPORT_RULES.closerMinFriends || groupSize(3) < REPORT_RULES.closerMinFriends) return null;
    const earlier = new Set([...sceneFacets, ...hiddenFacets]);
    const closer = MIRROR_FACET_IDS.flatMap(facet => {
      const items = statList.filter(st => st.item.facet === facet);
      const g1 = items.reduce((t, st) => ({ n: t.n + st.by[1].n, a: t.a + st.by[1].a }), { n: 0, a: 0 });
      const g3 = items.reduce((t, st) => ({ n: t.n + st.by[3].n, a: t.a + st.by[3].a }), { n: 0, a: 0 });
      if (g1.n < REPORT_RULES.closerMinAnswers || g3.n < REPORT_RULES.closerMinAnswers || !facetOk(facet)) return [];
      const s1 = ratioSide(g1.a, g1.n), s3 = ratioSide(g3.a, g3.n), gap = Math.abs(g1.a / g1.n - g3.a / g3.n);
      if (!s1 || !s3 || s1 === s3 || gap < REPORT_RULES.closerGap) return [];
      return [{ facet, s1, s3, g1, g3, gap, items }];
    }).sort((x, y) => Number(earlier.has(x.facet)) - Number(earlier.has(y.facet)) || y.gap - x.gap || rank(x.facet) - rank(y.facet)).slice(0, REPORT_RULES.closerMaxFacets);
    if (!closer.length) return null;
    newSection("closer");
    const scenes: ReportScene[] = [];
    for (const c of closer) {
      // 장면: 그 문항에서도 두 묶음이 각자 같은 쪽을 고른 문항. 친밀도별 숫자를 보이니 묶음마다 답 3개 이상(SPEC 익명 — 3명 이상일 때만).
      const ex = c.items.filter(st => !usedItems.has(st.item.id) && st.by[3].n >= REPORT_RULES.closerMinAnswers && st.by[1].n >= REPORT_RULES.closerMinAnswers && st.all.n >= REPORT_RULES.sceneMinAnswers && ratioSide(st.by[3].a, st.by[3].n) === c.s3 && ratioSide(st.by[1].a, st.by[1].n) === c.s1)
        .sort((x, y) => (y.by[1].n + y.by[3].n) - (x.by[1].n + x.by[3].n) || rank(x.item.id) - rank(y.item.id))[0];
      if (ex) scenes.push(takeScene({ itemId: ex.item.id, facet: c.facet, situation: ex.item.self.situation, picked: optText(ex.item, c.s3), mine: optText(ex.item, sideOf(ex.mine)),
        count: countLine(closerCount(ex.by[3].n, tallySide(ex.by[3], c.s3), ex.by[1].n, tallySide(ex.by[1], c.s1))), n: ex.all.n }));
      candidates.push({ kind: "closer", facet: c.facet, side: c.s3, gap: c.gap });
    }
    const ordered = [...closer].reverse();
    const lines = (c: typeof closer[number], named: boolean) => {
      const key = `${c.facet}:${c.s3}`, v1 = { name: facetName(c.facet), n: c.g1.n, k: tallySide(c.g1, c.s1), noun: noun(c.facet, c.s1) }, v3 = { name: facetName(c.facet), n: c.g3.n, k: tallySide(c.g3, c.s3), noun: noun(c.facet, c.s3) };
      return [say(named ? CLOSER_G1_NAMED : CLOSER_G1, v1, `closer:g1:${key}`, named ? "closer:g1n" : "closer:g1"), say(CLOSER_G3, v3, `closer:g3:${key}`, "closer:g3")];
    };
    let lead: string[], body: string[] = [];
    if (ordered.length === 1) { lead = [say(CLOSER_ONE, { name: facetName(ordered[0].facet) }, "closer:one")]; body = lines(ordered[0], false); }
    else { lead = [say(LEADS.closer, leadV(ordered.length), "closer:lead")]; for (const c of ordered) body.push(...lines(c, true)); }
    const last = ordered[ordered.length - 1];
    const closing = sayLines(CLOSE.closer[last.facet][last.s3], `closer:close:${last.facet}`, "closer:close");
    return section("closer", SECTION_TITLE.closer, { lead, body, scenes, closing });
  }

  function oneSection(): ReportSection {
    newSection("one");
    const s = friends[0], k = knowRate(s, self);
    const mineOf = (id: string) => self[id] as Choice;
    const real = s.answers.filter((a): a is { itemId: string; choice: Choice } => a.choice !== "skip" && stats.has(a.itemId));
    const facetOf = (id: string) => stats.get(id)!.item.facet;
    const differ = real.filter(a => a.choice !== mineOf(a.itemId)), same = real.filter(a => a.choice === mineOf(a.itemId));
    // 면 문장은 그 친구가 그 면 5문항을 다 답했을 때만(덕짱님 결정). 판정 후보: 5문항 중 60% 넘게 본인 면 점수와 반대쪽을 고른 면.
    const perfect: FacetId[] = [];
    const perFacet = new Map<FacetId, { n: number; seen: number; seenSide: Side }>();
    const oneCands: { facet: FacetId; side: Side; gap: number }[] = [];
    for (const facet of MIRROR_FACET_IDS) {
      const inFacet = real.filter(a => facetOf(a.itemId) === facet), m = mineFacets[facetIndex(facet)];
      if (!m) continue;
      const seenSide = flip(m.side), seen = inFacet.filter(a => sideOf(a.choice) === seenSide).length;
      perFacet.set(facet, { n: inFacet.length, seen, seenSide });
      if (inFacet.length < 5) continue;
      if (seen / inFacet.length > REPORT_RULES.splitHigh) oneCands.push({ facet, side: seenSide, gap: Math.abs(seen / inFacet.length - selfCount(facet, seenSide) / 5) });
      if (inFacet.every(a => a.choice === mineOf(a.itemId))) perfect.push(facet);
    }
    oneCands.sort((x, y) => y.gap - x.gap || rank(`one:${x.facet}`) - rank(`one:${y.facet}`));
    for (const c of oneCands) candidates.push({ kind: "blind", facet: c.facet, side: c.side, gap: c.gap });
    const order = (list: typeof real) => [...list].sort((x, y) => {
      const cx = oneCands.findIndex(c => c.facet === facetOf(x.itemId)), cy = oneCands.findIndex(c => c.facet === facetOf(y.itemId));
      return (cx < 0 ? 99 : cx) - (cy < 0 ? 99 : cy) || rank(x.itemId) - rank(y.itemId);
    }).map(a => ({ a, facet: facetOf(a.itemId) }));
    const scene = (a: { itemId: string; choice: Choice }, differs: boolean): ReportScene => {
      const st = stats.get(a.itemId)!;
      return takeScene({ itemId: st.item.id, facet: st.item.facet, situation: st.item.self.situation, picked: optText(st.item, sideOf(a.choice)), mine: optText(st.item, sideOf(mineOf(a.itemId))),
        count: differs ? `직접 고른 답은 「${optText(st.item, sideOf(mineOf(a.itemId)))}」` : countLine(["본인 답과 같아요", "본인도 같은 답", "직접 고른 답과 같아요"]), n: 1 });
    };
    // 판정 후보 면의 장면은 그 친구가 본 쪽과 같은 방향만(문장과 장면이 엇갈리지 않게).
    const consistent = differ.filter(a => { const c = oneCands.find(x => x.facet === facetOf(a.itemId)); return !c || sideOf(a.choice) === c.side; });
    const diffScenes = diverse(order(consistent), 4).map(x => scene(x.a, true));
    const sameScenes = diverse(order(same).filter(x => !perfect.length || perfect.includes(x.facet)), 2).map(x => scene(x.a, false));
    const lead = [say(ONE_LEAD, { d: differ.length, n: real.length }, "one:lead")];
    const body: string[] = [];
    // 마지막 한 줄은 판정 후보 첫 면에 — 그 면을 맨 뒤에 말한다.
    const talk = oneCands.slice(0, 2).reverse();
    for (const c of talk) { const pf = perFacet.get(c.facet)!; body.push(say(ONE_FACET, { name: facetName(c.facet), n: pf.n, k: pf.seen, noun: noun(c.facet, c.side) }, `one:facet:${c.facet}`, "one:facet")); }
    const names = facetNames(perfect.slice(0, 3));
    if (perfect.length && talk.length) body.push(say(ONE_PERFECT, { names }, "one:perfect"));
    // 마지막 한 줄: 판정 후보 면에서 이 친구가 고른 장면의 결론(면 문장 · 보기를 되풀이하지 않게). 후보가 없으면 아는 정도 구간.
    const lastC = talk[talk.length - 1];
    const onePunch = lastC ? scenePunch(diffScenes.find(sc => sc.facet === lastC.facet)) : null;
    const closing = onePunch ? emit(onePunch) : say(ONE_CLOSE[!k || k.percent < 50 ? "low" : k.percent < 70 ? "mid" : "high"], { k: k?.percent ?? 0 }, "one:close");
    return section("one", SECTION_TITLE.one, { lead, body, scenes: [...diffScenes, ...sameScenes], closing });
  }

  function attachSection(mine: Attachment, theirs: Attachment | null): ReportSection {
    newSection("attach");
    const closeTally = (f: FacetId): Tally => statList.filter(st => st.item.facet === f).reduce((t, st) => ({ n: t.n + st.by[2].n + st.by[3].n, a: t.a + st.by[2].a + st.by[3].a }), { n: 0, a: 0 });
    const tc = closeTally("check"), td = closeTally("dist");
    const cs = selfSide("check"), ds = selfSide("dist"), cSelf = selfCount("check", cs), dSelf = selfCount("dist", ds);
    // 규칙 a: 유형은 두 면 근거 짝으로만. 두 면 모두 뚜렷(5/5)할 때만 「~이에요」.
    const selfPair = `${ATTACH_NOUN.check[cs]} ${cSelf}/5 · ${ATTACH_NOUN.dist[ds]} ${dSelf}/${numIra(5)}`;
    // 2호부터는 자가 답이 그대로라 유형을 다시 말하지 않는다(같은 문장이 호마다 되풀이되지 않게) — 유형은 가까운 사람 눈 문장이 말한다.
    const again = !!input.previous?.sections.some(s => s.key === "attach");
    const bare = `${ATTACH_NOUN.check[cs]} ${cSelf}/5 · ${ATTACH_NOUN.dist[ds]} ${dSelf}/5`;
    const lead = [again ? say(ATTACH_SELF_AGAIN, { pair: bare }, "attach:again") : say(ATTACH_SELF, { pair: selfPair, label: mine.label, strong: cSelf === 5 && dSelf === 5 }, "attach:self")];
    const body: string[] = [];
    let view: Attachment = mine;
    const enough = tc.n >= REPORT_RULES.facetMinAnswers && td.n >= REPORT_RULES.facetMinAnswers;
    const people = closeFriends.length;
    // 답이 모자란 확인 · 거리 면은 바로 뒤 「아직 아무도 모르는 나」가 말하면 여기서는 되풀이하지 않는다.
    const u = unknownTarget(), told = !u.even && u.min < REPORT_RULES.facetMinAnswers && u.named.some(f => f === "check" || f === "dist");
    if (!enough) { if (!told) body.push(say(ATTACH_THIN, { need: REPORT_RULES.facetMinAnswers }, "attach:thin")); }
    else if (isSplit(tc) && isSplit(td)) { body.push(say(ATTACH_SPLIT_BOTH, {}, "attach:split2")); body.push(say(ATTACH_UNDECIDED, { n: people }, "attach:undecided")); }
    else if (isSplit(tc) || isSplit(td)) {
      const t = isSplit(tc) ? tc : td, name = isSplit(tc) ? "확인" : "거리";
      body.push(say(ATTACH_SPLIT_ONE, { name, a: Math.max(t.a, t.n - t.a), b: Math.min(t.a, t.n - t.a) }, "attach:split1"));
      body.push(say(ATTACH_UNDECIDED, { n: people }, "attach:undecided"));
    } else if (theirs) {
      const sc = ratioSide(tc.a, tc.n) ?? cs, sd = ratioSide(td.a, td.n) ?? ds, ck = tallySide(tc, sc), dk = tallySide(td, sd);
      const pair = `${ATTACH_NOUN.check[sc]} ${ck}/${tc.n} · ${ATTACH_NOUN.dist[sd]} ${dk}/${numIra(td.n)}`;
      const strong = ck / tc.n >= REPORT_RULES.attachStrong && dk / td.n >= REPORT_RULES.attachStrong;
      body.push(say(ATTACH_FRIEND, { pair, label: theirs.label, strong }, "attach:friend"));
      body.push(say(theirs.type === mine.type ? ATTACH_SAME : ATTACH_DIFF, { n: people }, `attach:${theirs.type === mine.type ? "same" : "diff"}:${theirs.type}`, theirs.type === mine.type ? "attach:same" : "attach:diff"));
      view = theirs;
    }
    // 친구 · 가까운 사이 80% 이상(3명 이상)이 한쪽을 고른 확인 · 거리 장면 하나 + 꼭지 유일한 추측 문장(「~일 거예요」).
    const best = statList.filter(st => (st.item.facet === "check" || st.item.facet === "dist") && !usedItems.has(st.item.id)).map(st => {
      const t = { n: st.by[2].n + st.by[3].n, a: st.by[2].a + st.by[3].a }, side: Side = t.a * 2 >= t.n ? "A" : "B", m = tallySide(t, side);
      return { st, n: t.n, m, side, share: t.n ? m / t.n : 0 };
    // 장면 · 추측 한 줄은 꼭지 결론(마지막 한 줄의 유형)과 같은 방향일 때만 — 서로 부딪히지 않게.
    }).filter(x => x.n >= REPORT_RULES.sceneMinAnswers && x.share >= REPORT_RULES.attachSceneShare && attachSide(view.type, x.st.item.facet as "check" | "dist") === x.side)
      .sort((x, y) => y.share - x.share || y.n - x.n || rank(x.st.item.id) - rank(y.st.item.id))[0];
    const scenes: ReportScene[] = [];
    // 2호: 지난 호에 실은 추측 한 줄 · 장면은 되풀이하지 않는다.
    const prevAttach = input.previous?.sections.find(s => s.key === "attach");
    const seenBefore = !!best && !!prevAttach && (prevAttach.scenes.some(sc => sc.itemId === best.st.item.id) || prevAttach.body.includes(ATTACH_ITEM[best.st.item.id]?.[best.side] ?? "\u0000"));
    if (best && !seenBefore) {
      scenes.push(takeScene({ itemId: best.st.item.id, facet: best.st.item.facet, situation: best.st.item.self.situation, picked: optText(best.st.item, best.side), mine: optText(best.st.item, sideOf(best.st.mine)), count: `친구 · 가까운 사이 ${best.n}명 중 ${best.m}명`, n: best.n }));
      const guess = ATTACH_ITEM[best.st.item.id]?.[best.side];
      if (guess) body.push(emit(guess));
    }
    // 가까운 사람 눈이 본인과 다른 유형이면 누구의 눈인지 밝힌다(「가까이선 …」).
    const other = view !== mine && view.type !== mine.type;
    const closing = sayLines(other ? ATTACH_CLOSE[view.type].filter(l => !l.startsWith("가까")).map(l => `가까이선 ${l}`) : ATTACH_CLOSE[view.type], `attach:close:${view.type}`, "attach:close");
    return section("attach", SECTION_TITLE.attach, { lead, body, scenes, notes: [ATTACH_NOTE], closing });
  }

  function storiesSection(): ReportSection {
    newSection("stories");
    const total = input.stories.length;
    // 지난 호에 실은 이야기는 뒤로(새 이야기가 있으면 그것부터).
    const shownBefore = new Set((input.previous?.sections ?? []).flatMap(s => s.stories ?? []).map(s => s.body));
    const sorted = [...input.stories].sort((x, y) => Number(shownBefore.has(x.body)) - Number(shownBefore.has(y.body)) || y.hearts - x.hearts || Date.parse(y.createdAt) - Date.parse(x.createdAt) || rank(x.id) - rank(y.id));
    const chosen: ReportStory[] = [sorted[0]];
    const second = sorted.slice(1).find(s => s.kind !== sorted[0].kind) ?? sorted[1];
    if (second && REPORT_RULES.storiesMax > 1) chosen.push(second);
    const kinds = [...new Set(chosen.map(s => `「${STORY_KIND_LABEL[s.kind]}」`))].join(" · ");
    const lead = [say(STORIES_LEAD, { total, shown: chosen.length, kinds }, "stories:lead")];
    const body = total > chosen.length ? [say(STORIES_REST, { k: total - chosen.length }, "stories:rest")] : [];
    const counts = new Map<StoryKind, number>();
    for (const s of input.stories) counts.set(s.kind, (counts.get(s.kind) ?? 0) + 1);
    const ranked = [...counts].sort((x, y) => y[1] - x[1] || rank(`kind:${x[0]}`) - rank(`kind:${y[0]}`));
    const most = ranked[0] && ranked[0][1] >= 2 && (!ranked[1] || ranked[1][1] < ranked[0][1]) ? ranked[0] : null;
    const heartsTop = sorted.length > 1 && sorted[0].hearts > 0 && sorted[1].hearts < sorted[0].hearts;
    const closing = most ? say(STORIES_CLOSE.most, { label: STORY_KIND_LABEL[most[0]], k: most[1] }, "stories:most")
      : heartsTop ? say(STORIES_CLOSE.hearts, { label: STORY_KIND_LABEL[sorted[0].kind], k: sorted[0].hearts }, "stories:hearts")
      : say(STORIES_CLOSE.plain, { label: sorted[0].kind, k: 1 }, "stories:plain");
    return section("stories", one ? SECTION_TITLE.storiesOne : SECTION_TITLE.stories, {
      lead, body, closing, stories: chosen.map(s => ({ kind: s.kind, kindLabel: STORY_KIND_LABEL[s.kind], body: s.body, closenessLabel: CLOSENESS_LABEL[s.closeness] })),
    });
  }

  function unknownSection(): ReportSection {
    newSection("unknown");
    const { min, tied, even, named } = unknownTarget();
    if (even) {
      const lead = [say(UNKNOWN_EVEN, { min }, "unknown:even")];
      return section("unknown", SECTION_TITLE.unknown, { lead, closing: say(UNKNOWN_EVEN_CLOSE, { min, one }, "unknown:evenclose"), ask: true });
    }
    const pair = tied.length === 2 && tied[0] === "check" && tied[1] === "dist";
    const single = tied.length === 1 ? tied[0] : null, close = pair || single === "check" || single === "dist";
    const subj = `${facetNames(named)} 면`;
    const qt = pair ? "마음을 자주 확인하고 싶은지와 가까이 기대는지" : single ? UNKNOWN_QUESTION[single] : "이 면들의 결";
    const bucket = min === 0 ? "zero" : min < REPORT_RULES.facetMinAnswers ? "few" : "enough";
    const lead = [say(UNKNOWN_LEAD[bucket], { subj, min }, `unknown:${bucket}`)];
    const body = (single || pair) && bucket !== "enough" ? [say(UNKNOWN_BODY[bucket], { qt, need: REPORT_RULES.facetMinAnswers - min, min }, `unknown:body:${bucket}`)] : [];
    const closing = say(UNKNOWN_CLOSE, { subj, close, min }, "unknown:close");
    return section("unknown", SECTION_TITLE.unknown, { lead, body, closing, ask: true });
  }

  function nextSection(): ReportSection {
    newSection("next");
    const opened = new Set<SectionKey>(sections.map(s => s.key));
    const prev = input.previous, date = kstMonthDay(input.nextIssueAt);
    const lead = [prev && answers > prev.stats.answers ? say(NEXT_GROWTH, { d: answers - prev.stats.answers }, "next:growth") : say(NEXT_LEAD, { n: answers, no: issueNo }, "next:lead")];
    const body: string[] = [];
    if (one) body.push(emit(NEXT_ONE));
    if (!one && flags.perItem3 && !opened.has("blind")) body.push(say(NEXT_NOBLIND, { n: answers }, "next:noblind"));
    // 열릴 꼭지: 두 개까지, 한 문장에 하나씩.
    const hints: (readonly [string, string])[] = [];
    if (!one && !flags.perItem3) hints.push(NEXT_HINT.perItem);
    if (!one && !opened.has("closer") && (groupSize(1) < REPORT_RULES.closerMinFriends || groupSize(3) < REPORT_RULES.closerMinFriends)) hints.push(NEXT_HINT.closer);
    if (!opened.has("attach") && closeFriends.length < REPORT_RULES.attachMinFriends) hints.push(NEXT_HINT.attach);
    if (!one && !flags.facet6) hints.push(NEXT_HINT.facet);
    if (!opened.has("stories")) hints.push(one ? NEXT_HINT.storiesOne : NEXT_HINT.stories);
    hints.slice(0, 2).forEach((h, i) => body.push(sayLines(h, `next:hint:${i}`)));
    return section("next", SECTION_TITLE.next, { lead, body, closing: say(NEXT_CLOSE, { date }, "next:close") });
  }
}

/** 리뷰용 평문(원문 저장 · 직접 읽기). 화면과 같은 순서 · 같은 문장(첫 문장 → 문장들 → 안내 → 장면 · 이야기 → 마지막 한 줄). */
export function reportToText(r: ReportSnapshot): string {
  const out: string[] = [`결 보고서 ${r.issueNo}호 · ${r.ownerName}`, "", r.verdict.title, `싱크로율 ${r.verdict.sync}%`, r.verdict.summary, ...(r.verdict.compare ? [r.verdict.compare] : []), ""];
  for (const s of r.sections) {
    out.push(`■ ${s.title}`);
    out.push(...s.lead, ...s.body);
    for (const n of s.notes) out.push(`  ※ ${n}`);
    for (const sc of s.scenes) { out.push(`  · ${sceneLine(s.key, sc)}`); out.push(`    ${sc.count}${sc.share ? "  [장면 공유]" : ""}`); }
    for (const st of s.stories ?? []) out.push(`  · [${st.kindLabel} · ${st.closenessLabel}] ${st.body}`);
    out.push(`▶ ${s.closing}`);
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
 * 반복 점검 — 견본 스크립트와 시험이 같이 쓴다. 예외: 꼭지 제목 · 장면 줄 · 근거 줄 · 「10개 질문으로 본 경향이에요」 · 유료 다리 줄 · 이야기 원문,
 * 그리고 형식이 정해진 줄(요약 첫 두 문장 「친구 N명이 M개를 답했어요」 · 싱크로율, 다음 호 날짜 줄, 다음 호 열림 안내).
 *  (a) 한 보고서 안: 이어진 두 문장의 끝맺음 낱말이 같음 · 같은 끝맺음 낱말 3번 이상 · 한 꼭지 안 이어진 두 문장의 이음말 또는 첫머리 · 틀이 같음 · 한 꼭지 안 똑같은 줄.
 *  (b) 같은 사람의 호끼리: 같은 꼭지의 뼈대가 같음 — sameOwnerSkeletons(앞 호, 다음 호).
 *  (c) 다른 사람 사이: 글자까지 똑같은 문장 · 쉼표 마디(숫자 포함).
 */
export function skeletonOf(sentence: string, names: readonly string[] = []): string {
  let s = sentence.replace(/「[^」]*」/g, "「」").replace(/“[^”]*”/g, "“”").replace(/\d+/g, "#");
  for (const n of [...MIRROR_FACETS.map(f => f.name), ...names].sort((x, y) => y.length - x.length)) s = s.split(n).join("@");
  return s;
}
/** 두 글에 같이 나오는 낱말(토씨를 떼고 앞 두 글자로 비교, 한 글자 · 숫자 든 낱말은 뺀다). */
export function sharedWords(a: string, b: string): string[] {
  const words = (t: string) => new Set(t.replace(/[.,「」“”()·]/g, " ").split(/\s+/).filter(w => w && !/\d/.test(w)).map(w => (w.replace(/(은|는|이|가|을|를|에서|에|도|의|와|과|로|으로)$/, "") || w).slice(0, 2)).filter(w => w.length >= 2));
  const wb = words(b);
  return [...words(a)].filter(w => wb.has(w));
}
/** 문장의 틀: 뼈대에서 앞의 「@ 면(은 · 에서 · 도 …)」을 떼고 첫 두 낱말(토씨 뗌). */
export function frameOf(line: string, names: readonly string[] = []): string {
  const sk = skeletonOf(line, names).replace(/^@ 면(은|에서는|에서|을|도|의)?\s+/, "");
  return sk.split(/\s+/).slice(0, 2).map(w => w.replace(/(은|는|이|가|을|를|에서|에|도|의|와|과)$/, "") || w).join(" ");
}
/** 같은 사람의 호끼리도 같을 수밖에 없는 줄: 요약 첫 문장(친구 수 · 답 수). */
const COUNT_LINE = /^친구 (\d+명|한 명)이 \d+개를 답했어요\.$/;
/** 형식이 정해진 줄(다른 사람 사이 반복 점검에서 뺀다): 요약 첫 두 문장 · 다음 호 열림 안내 · 날짜 줄 · 친구 한 명 안내 · 가까운 사람 답 모자람 안내. */
const FIXED_LINE = new RegExp([
  "^친구 (\\d+명|한 명)이 \\d+개를 답했어요\\.$", "싱크로율은 \\d+%예요\\.$", "^다음 호는 \\d+월 \\d+일에 열려요\\.$", "^\\d+월 \\d+일부터 다음 호를 받을 수 있어요\\.$", "^\\d+월 \\d+일에 다음 호가 나와요\\.$", "^다음 호 날짜는 \\d+월 \\d+일이에요\\.$",
  ...Object.values(NEXT_HINT).flat().map(h => `^${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), `^${NEXT_ONE}$`,
  // 가까운 관계의 나 — 답이 모자랄 때 안내(기준 개수만 담은 정해진 줄).
  ...NEXT_LEAD.map(f => `^${f({ n: 0, no: 1 }).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
  ...ATTACH_THIN.map(f => `^${f({ need: REPORT_RULES.facetMinAnswers }).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
].join("|"));
const sentencesOf = (line: string) => line.split(/(?<=[.?!])\s+/).map(x => x.trim()).filter(Boolean);
export function reportSentences(r: ReportSnapshot, withClosing = true): { key: string; lines: string[] }[] {
  return [{ key: "verdict", lines: [...sentencesOf(r.verdict.summary), ...(r.verdict.compare ? [r.verdict.compare] : [])] }, ...r.sections.map(s => ({ key: s.key, lines: [...s.lead, ...s.body, ...(withClosing ? [s.closing] : [])] }))];
}
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
    if (fixedEnding(line)) return;
    const e = endingKey(line);
    ends.set(e, (ends.get(e) ?? 0) + 1);
    if (i > 0 && !fixedEnding(flat[i - 1]) && e === endingKey(flat[i - 1])) out.push(`${id} 끝맺음 연속 「${e}」`);
  });
  for (const [e, c] of ends) if (c > ENDING_MAX) out.push(`${id} 끝맺음 ${c}번 「${e}」`);
  const vsN = new Map<string, number>();
  for (const k of flat.flatMap(vsKeysOf)) vsN.set(k, (vsN.get(k) ?? 0) + 1);
  for (const [k, c] of vsN) if (c > VS_MAX) out.push(`${id} 같은 「N 대 M」 ${c}번 「${k.replace(":", " 대 ")}」`);
  for (const s of r.sections) {
    const se = new Map<string, number>();
    for (const line of [...s.lead, ...s.body, s.closing]) if (!fixedEnding(line) && !FIXED_LINE.test(line)) se.set(endingKey(line), (se.get(endingKey(line)) ?? 0) + 1);
    for (const [e, c] of se) if (c > 1) out.push(`${id} ${s.key} 꼭지 안 같은 끝맺음 ${c}번 「${e}」`);
    const seen = new Set<string>();
    for (const line of [...s.lead, ...s.body, s.closing, ...s.scenes.map(sc => sc.count)]) {
      if (seen.has(line)) out.push(`${id} ${s.key} 같은 줄 두 번 「${line.slice(0, 16)}…」`);
      seen.add(line);
    }
  }
  return out;
}
/** (b) 같은 사람의 앞 호 · 다음 호: 같은 꼭지에서 뼈대가 같은 문장(형식이 정해진 줄은 뺀다). */
export function sameOwnerSkeletons(a: ReportSnapshot, b: ReportSnapshot): string[] {
  const sk = (r: ReportSnapshot) => new Set(reportSentences(r).flatMap(g => g.lines.filter(x => !COUNT_LINE.test(x)).map(x => `${g.key}|${skeletonOf(x, [r.ownerName])}`)));
  const sb = sk(b);
  return [...sk(a)].filter(x => sb.has(x));
}
/**
 * (c) 다른 사람 사이: 같은 꼭지에서 글자까지 똑같은 문장 · 마디(형식이 정해진 줄은 뺀다).
 * 꼭지 마지막 한 줄(closing)도 뺀다 — 면 · 쪽(애착은 유형)마다 정한 결론이라 같은 면 · 쪽이 나온 다른 사람과는 같을 수 있다.
 * 애착 유형 문장(규칙 a 꼴) · 가까운 관계의 나 추측 한 줄도 뺀다 — 답 수 · 유형(문항 · 쪽)이 같으면 같은 문장이 맞다.
 * 한 사람의 보고서 안(a)과 같은 사람의 호끼리(b)는 마지막 한 줄도 겹치지 않게 본다.
 */
export function exactDuplicates(reports: readonly { id: string; snapshot: ReportSnapshot }[]): string[] {
  const seen = new Map<string, Set<string>>();
  for (const { id, snapshot } of reports) for (const g of reportSentences(snapshot, false)) for (const sen of g.lines) {
    // 애착 유형 문장(규칙 a의 정해진 꼴: 근거 짝 + 유형)도 뺀다 — 답 수와 유형이 같은 사람과는 같을 수 있다.
    // 본인 5문항 수만 말하는 문장(「… 5문항 중 4개를 …」)도 뺀다 — 그 사람의 자가 답으로 정해져, 같은 답을 한 사람과는 같을 수 있다.
    // 가까운 관계의 나 추측 한 줄(ATTACH_ITEM)도 문항 · 쪽마다 정한 한 문장이라 뺀다.
    if (FIXED_LINE.test(sen) || fixedEnding(sen) || (g.key === "attach" && /일 거예요\.$/.test(sen))) continue;
    for (const seg of new Set([sen.replace(/[.?!]$/, ""), ...segmentsOf(sen)])) { const k = `${g.key}|${seg}`; seen.set(k, (seen.get(k) ?? new Set()).add(id)); }
  }
  return [...seen].filter(([, ids]) => ids.size > 1).map(([k, ids]) => `글자 그대로 ${[...ids].join("·")} ${k}`);
}
export function repetitionFindings(reports: readonly { id: string; snapshot: ReportSnapshot }[]): string[] {
  return [...reports.flatMap(r => withinReportFindings(r.id, r.snapshot)), ...exactDuplicates(reports)];
}

/**
 * 문장 규칙 점검(명령 3 1-2 규칙 a~h) — repetitionFindings와 같이 견본마다 돌고, report.test.ts가 지킨다.
 *  a 유형 이름이 든 문장은 두 면 근거 짝(a/b · c/d)을 담고 장면 인용(“…”)이 없다 · 두 면 모두 90% 이상이면 「~이에요」, 아니면 「~에 가까워요」.
 *  b · e · f 문장마다 sentenceProblems(말끝 흐림 · 「일 거예요」 아닌 추측 · 70자 · 쉼표 · 숫자 쌍 · 지시어) + 「일 거예요」는 꼭지당 한 문장.
 *  c 첫 문장이 말하는 면 ⊆ 장면의 면, 장면이 두 면 이상이면 첫 문장은 면을 말하지 않는다(가까운 관계 · 한 사람이 본 나는 뺀다).
 *  d 장면 문항 친구 답 3개 이상(한 사람이 본 나는 뺀다) · 면 이름을 단 문장은 그 면 친구 답 6개 이상(아직 아무도 모르는 나 · 다음 호 · 한 사람이 본 나는 뺀다).
 *  g 꼭지마다 마지막 한 줄: 8~32자 · 단정형(「거예요」 아님) · 숫자 쌍 없음.
 *  h 요약 첫 문단은 세 문장: 「친구 N명이 M개를 답했어요.」 → 싱크로율 → 주어(친구들 · 이 친구)로 시작하는 총평.
 */
export function styleFindings(id: string, r: ReportSnapshot): string[] {
  const out: string[] = [];
  const nameRe = new RegExp(`(${MIRROR_FACETS.map(f => f.name).join("|")}) 면`, "g");
  const facetIdOf = new Map(MIRROR_FACETS.map(f => [f.name, f.id] as const));
  const nounFacet = MIRROR_FACET_IDS.flatMap(f => (["A", "B"] as const).map(s => [SIDE_NOUN[f][s], f] as const));
  const mentions = (t: string): Set<FacetId> => {
    const set = new Set<FacetId>();
    for (const m of t.matchAll(nameRe)) set.add(facetIdOf.get(m[1])!);
    for (const [nn, f] of nounFacet) if (t.includes(`「${nn}」`)) set.add(f);
    return set;
  };
  const friendN = new Map(r.evidence.facets.map(f => [f.facet, f.friendN] as const));
  // h
  const sum = sentencesOf(r.verdict.summary);
  if (sum.length !== 3) out.push(`${id} h 요약 첫 문단 ${sum.length}문장`);
  if (!/^친구 (\d+명|한 명)이 \d+개를 답했어요\.$/.test(sum[0] ?? "")) out.push(`${id} h 첫 문장 「${sum[0] ?? ""}」`);
  if (!/싱크로율/.test(sum[1] ?? "") || !/\d+%/.test(sum[1] ?? "")) out.push(`${id} h 둘째 문장에 싱크로율 없음`);
  if (!/^(친구들|이 친구)/.test(sum[2] ?? "") || VAGUE_SUMMARY.test(sum[2] ?? "")) out.push(`${id} h 총평 주어 「${sum[2] ?? ""}」`);
  for (const t of [...sum, ...(r.verdict.compare ? [r.verdict.compare] : [])]) for (const p of sentenceProblems(t)) out.push(`${id} verdict ${p} 「${t.slice(0, 20)}…」`);
  for (const s of r.sections) {
    const lines = [...s.lead, ...s.body];
    for (const t of [...lines, s.closing]) for (const p of sentenceProblems(t)) out.push(`${id} ${s.key} ${p} 「${t.slice(0, 20)}…」`);
    const guesses = [...lines, s.closing].filter(t => /거예요[.]$/.test(t)).length;
    if (guesses > 1) out.push(`${id} ${s.key} b 추측 ${guesses}문장`);
    // g
    if (!s.closing) out.push(`${id} ${s.key} g 마지막 한 줄 없음`);
    else {
      if (s.closing.length < REPORT_RULES.closingMin || s.closing.length > REPORT_RULES.closingMax) out.push(`${id} ${s.key} g 마지막 한 줄 ${s.closing.length}자`);
      if (/거예요[.]$/.test(s.closing)) out.push(`${id} ${s.key} g 마지막 한 줄이 추측`);
      if (numberPairs(s.closing)) out.push(`${id} ${s.key} g 마지막 한 줄에 숫자 쌍`);
    }
    // c
    if (["open", "blind", "hidden", "closer"].includes(s.key) && s.lead[0]) {
      const sf = new Set(s.scenes.map(x => x.facet)), lm = mentions(s.lead[0]);
      if (sf.size > 1 && lm.size) out.push(`${id} ${s.key} c 장면 ${sf.size}면인데 첫 문장이 면을 특정 「${s.lead[0].slice(0, 20)}…」`);
      if (sf.size && [...lm].some(f => !sf.has(f))) out.push(`${id} ${s.key} c 첫 문장 면이 장면과 다름 「${s.lead[0].slice(0, 20)}…」`);
    }
    // d
    if (s.key !== "one") for (const sc of s.scenes) if (sc.n < REPORT_RULES.sceneMinAnswers) out.push(`${id} ${s.key} d 장면 ${sc.itemId} 답 ${sc.n}개`);
    if (!["unknown", "next", "one"].includes(s.key)) for (const t of [...lines, s.closing]) for (const m of t.matchAll(nameRe)) {
      const f = facetIdOf.get(m[1])!;
      if ((friendN.get(f) ?? 0) < REPORT_RULES.facetMinAnswers) out.push(`${id} ${s.key} d ${m[1]} 면 답 ${friendN.get(f) ?? 0}개로 면 문장`);
    }
    // a
    for (const t of [...lines, s.closing]) if (TYPE_LABEL.test(t)) {
      const fr = [...t.matchAll(/(\d+)\/(\d+)/g)].map(m => Number(m[1]) / Number(m[2]));
      if (fr.length < 2 || !/\d+\/\d+ · .*\d+\/\d+/.test(t)) out.push(`${id} ${s.key} a 유형에 근거 짝 없음 「${t.slice(0, 24)}…」`);
      if (/“/.test(t)) out.push(`${id} ${s.key} a 장면 하나로 유형 설명`);
      const strong = fr.length >= 2 && fr.every(x => x >= REPORT_RULES.attachStrong);
      if (strong ? !/형이에요[.]$/.test(t) : !/가까워요[.]$/.test(t)) out.push(`${id} ${s.key} a 강도와 끝맺음이 안 맞음 「${t.slice(-14)}」`);
    }
  }
  return out;
}
