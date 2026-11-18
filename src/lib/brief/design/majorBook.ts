/**
 * AM2-13 3부 — 대운 「내 인생이라는 책」 결정론 데이터(호출 0). 대운 하나 = 인생의 한 장.
 * 모두 엔진(대운 · 교운기 · 세운 해 · 원국 오행) 값에서 만든다. 작가는 이 값을 지시 · 재료로만 받고, 화면이 사실을 보여 준다.
 *  - 장 제목 표(십성 10 → 제목, 덕짱님 확정 2026-11-17) · 장 번호(평생 지도 차례)
 *  - 채움 판정(세운 luckyOf와 같은 원천 × 대운 천간 · 지지 본기 오행, 넷 + 부족 없는 사람의 채움 말)
 *  - 막(10년 창 2027~2036 × 다음 대운 시작 해 · 교운기 S−1~S+1) · 전환 표(끝나는 것 / 시작되는 것)
 *  - 영역별 해 목록(해 칩 = 세운과 같은 domainSignals) · 6장 요약 조각 · ★ 해(keyYears) · 2027 사실(세운과 같은 함수) · 10년 안 장 넘김 해
 */
import type { FiveElement, Pillar, SajuCalcResult, TenGod } from "@/lib/saju/types";
import type { Knowledge } from "../knowledge";
import { BRANCH_MAIN_ELEMENT, STEM_ELEMENT } from "@/lib/saju/constants";
import type { ElementState } from "../chart";
import type { TimelineEntry } from "../schema";
import { coreLine, coreOf, TEN_GOD_SHORT } from "../core";
import { josa } from "../labels";
import { luckyOf, yearVerdict, type DomainKey } from "./annual";
import { relationsWithNatal, type LifetimeCycle } from "./major";

/** 장 제목 표(덕짱님 0부 답 2 — 나이에 상관없이 맞는 말, 돈 · 몫 · 「혼자」 겹침 없이). */
export const CHAPTER_TITLE: Readonly<Record<TenGod, string>> = {
  比肩: "내 힘으로 서는 장", 劫財: "겨루며 함께 크는 장", 食神: "손에 익은 것을 만들어 내는 장", 傷官: "틀을 깨고 드러내는 장", 偏財: "크게 움직이며 넓히는 장",
  正財: "차곡차곡 쌓아 가는 장", 偏官: "무게를 견디며 단단해지는 장", 正官: "자리와 책임을 갖추는 장", 偏印: "깊이 파고드는 장", 正印: "배우며 채우는 장",
};
/** 십성 주제 한 마디(DB ten-god-period 첫 문장을 10년 말로 — 화면 장 머리 · 맞대기 카드). */
export const TEN_GOD_THEME: Readonly<Record<TenGod, string>> = {
  比肩: "나와 같은 기운이 들어오는 10년", 劫財: "내 것을 나눠 가지려는 힘이 들어오는 10년", 食神: "내가 만들어 내는 기운이 들어오는 10년", 傷官: "틀을 깨는 쪽으로 나가는 기운이 들어오는 10년",
  偏財: "크고 움직이는 돈이 들어오는 10년", 正財: "정해지고 꾸준한 돈이 들어오는 10년", 偏官: "나를 누르고 다그치는 힘이 들어오는 10년", 正官: "나를 바르게 다스리는 힘이 들어오는 10년",
  偏印: "나를 돕되 옆길로 끌고 가는 기운이 들어오는 10년", 正印: "나를 낳고 돌봐 주는 기운이 들어오는 10년",
};
/** 전환 표(십성 → 그 장을 닫을 때 끝나는 것 / 열 때 시작되는 것). 쌍은 지금.끝 + 다음.시작 — 방향은 두 십성 자기 뜻에서만 나온다(옛 D22 「버는 법에서 지키는 법으로」 꼴 0). */
export const TRANSITION: Readonly<Record<TenGod, { readonly end: string; readonly start: string; readonly word: RegExp }>> = {
  比肩: { end: "내 힘으로 버티며 내 몫을 지키던 방식", start: "내 힘으로 서서 내 속도를 지키는 방식", word: /내 힘|내 몫|내 속도/ },
  劫財: { end: "사람들과 겨루며 몫을 나누던 방식", start: "겨루며 함께 크는 자극을 쓰는 방식", word: /겨루/ },
  食神: { end: "손에 익은 것을 꾸준히 만들어 내던 방식", start: "손에 익은 일을 즐겁게 만들어 내는 방식", word: /손에 익|만들어 내/ },
  傷官: { end: "틀을 깨며 말과 생각을 드러내던 방식", start: "틀을 깨고 새 방식으로 드러내는 방식", word: /틀을 깨/ },
  偏財: { end: "크게 움직이며 판을 넓히던 방식", start: "크게 움직이는 돈과 바깥 판을 다루는 방식", word: /크게 움직|넓히|바깥 판/ },
  正財: { end: "정해진 몫을 차곡차곡 쌓아 지키던 방식", start: "꾸준한 몫을 차곡차곡 쌓아 가는 방식", word: /차곡차곡|꾸준한 몫|정해진 몫/ },
  偏官: { end: "압박을 정면으로 받아 내며 버티던 방식", start: "무게를 견디며 결단하는 방식", word: /압박|무게|결단/ },
  正官: { end: "자리와 규칙을 지키며 신뢰를 쌓던 방식", start: "자리와 책임을 갖추며 신뢰를 쌓는 방식", word: /자리와 (규칙|책임)|신뢰/ },
  偏印: { end: "혼자 깊이 파고들며 다른 길을 찾던 방식", start: "깊이 파고드는 공부와 낯선 시선을 쓰는 방식", word: /파고들|파고드/ },
  正印: { end: "배우고 도움을 받으며 채우던 방식", start: "배우며 채우고 믿고 기대는 방식", word: /배우/ },
};
export type FillKind = "fill" | "excess" | "both" | "even";
export const FILL_LABEL: Readonly<Record<FillKind, string>> = { fill: "부족한 기운을 채워 주는 장", excess: "이미 많은 기운이 더 쌓이는 장", both: "채움과 쌓임이 함께 오는 장", even: "고른 장" };
/** 원국에 부족 · 없음이 없는 사람(luckyOf = 가장 강한 기운이 낳는 기운)의 채움 말(덕짱님 0부 답 3). */
export const FILL_HELP_LABEL = "나를 돕는 기운을 채워 주는 장";
const EL_KO: Readonly<Record<FiveElement, string>> = { WOOD: "나무", FIRE: "불", EARTH: "흙", METAL: "쇠", WATER: "물" };
const READ: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
export type Fill = { readonly kind: FillKind; readonly label: string; readonly element: FiveElement; readonly why: string };
/** 채움 판정: E = luckyOf(없음 → 부족 → 가장 강한 기운이 낳는 기운). 대운 천간 · 지지 본기 오행에 E가 있으면 채움, 많은 기운이 있으면 쌓임, 둘 다면 함께, 아니면 고른 장. */
export function fillOf(st: ElementState, strongest: FiveElement, hanja: string): Fill {
  const E = luckyOf(st, strongest).element, s = STEM_ELEMENT[hanja[0] as keyof typeof STEM_ELEMENT] as FiveElement, b = BRANCH_MAIN_ELEMENT[hanja[1] as keyof typeof BRANCH_MAIN_ELEMENT] as FiveElement;
  const lacking = st.missing.length > 0 || st.lacking.length > 0;
  const fills = [s, b].includes(E), heap = [s, b].some(x => st.excess.includes(x as never));
  const kind: FillKind = fills && heap ? "both" : fills ? "fill" : heap ? "excess" : "even";
  const glyph = (i: number) => `${i === 0 ? "하늘" : "땅"} 글자 ${READ[hanja[i]] ?? hanja[i]}(${EL_KO[i === 0 ? s : b]})`;
  const parts: string[] = [];
  [0, 1].forEach(i => { const el = i === 0 ? s : b; if (el === E) parts.push(`${glyph(i)} — ${lacking ? "부족한" : "나를 돕는"} ${josa(EL_KO[E], "을를")} 채움`); else if (st.excess.includes(el as never)) parts.push(`${glyph(i)} — 이미 많은 ${EL_KO[el]}`); });
  const label = (kind === "fill" || kind === "both") && !lacking ? (kind === "fill" ? FILL_HELP_LABEL : FILL_LABEL.both) : FILL_LABEL[kind];
  return { kind, label, element: E, why: parts.join(" · ") || `하늘 ${EL_KO[s]} · 땅 ${EL_KO[b]} — 채우거나 쌓이는 쪽 없이 고르게` };
}

export const WINDOW: readonly [number, number] = [2027, 2036];
export type Act = { readonly n: 1 | 2 | 3; readonly name: string; readonly years: readonly number[] };
export const ACT_NAME: Readonly<Record<1 | 2 | 3, string>> = { 1: "지금 장의 남은 쪽", 2: "문턱", 3: "다음 장의 시작과 한가운데" };
/** 막: 다음 대운 시작 해 S, 교운기 S−1~S+1(엔진 교운기 줄과 같은 값). 빈 막은 두지 않는다(이웃 막에 합침 = 그 막 없이 이어짐). */
export function actsOf(nextStart: number | undefined, win: readonly [number, number] = WINDOW): Act[] {
  const ys = Array.from({ length: win[1] - win[0] + 1 }, (_, i) => win[0] + i);
  if (nextStart === undefined) return [{ n: 1, name: ACT_NAME[1], years: ys }];
  const a: Act[] = [{ n: 1, name: ACT_NAME[1], years: ys.filter(y => y < nextStart - 1) }, { n: 2, name: ACT_NAME[2], years: ys.filter(y => y >= nextStart - 1 && y <= nextStart + 1) }, { n: 3, name: ACT_NAME[3], years: ys.filter(y => y > nextStart + 1) }];
  return a.filter(x => x.years.length);
}
/** 5장을 두 묶음으로: 막 경계에 가장 가까운 곳에서, 두 묶음이 각각 4~6해(앞 묶음 해 수). */
export function decadeSplit(acts: readonly Act[], total = 10): number {
  const bounds = acts.slice(0, -1).map(a => acts.slice(0, acts.indexOf(a) + 1).reduce((s, x) => s + x.years.length, 0));
  const cands = [4, 5, 6].filter(n => total - n >= 4 && total - n <= 6);
  return [...cands].sort((x, y) => Math.min(...bounds.map(b => Math.abs(b - x)), 99) - Math.min(...bounds.map(b => Math.abs(b - y)), 99) || Math.abs(x - 5) - Math.abs(y - 5))[0] ?? 5;
}

export const MAJOR_DOMAINS: readonly DomainKey[] = ["money", "work", "love", "people", "mind"];
export const MAJOR_DOMAIN_KO: Readonly<Record<DomainKey, string>> = { money: "돈", work: "일", love: "사랑", people: "사람", mind: "마음" };
export type DomainYears = Readonly<Record<DomainKey, { readonly up: readonly number[]; readonly down: readonly number[] }>>;
type Signaled = TimelineEntry & { signals?: Readonly<Record<DomainKey, string>> };
/** 영역별 오르는 해 · 살필 해(해 칩 그대로, 빠짐 0). */
export function domainYearsOf(entries: readonly Signaled[], win: readonly [number, number] = WINDOW): DomainYears {
  const ys = entries.filter(e => e.kind === "year" && Number(e.key) >= win[0] && Number(e.key) <= win[1] && e.signals);
  return Object.fromEntries(MAJOR_DOMAINS.map(d => [d, { up: ys.filter(e => e.signals![d] === "↑").map(e => Number(e.key)), down: ys.filter(e => e.signals![d] === "↓").map(e => Number(e.key)) }])) as unknown as DomainYears;
}
/** 6장 요약 조각(영역마다 오르는 해 수 · 어느 막에 몰림) — 해 목록은 본문에 주지 않는다. */
export function domainSummary(dy: DomainYears, acts: readonly Act[]): Readonly<Record<DomainKey, string>> {
  return Object.fromEntries(MAJOR_DOMAINS.map(d => {
    const up = dy[d].up, down = dy[d].down.length;
    if (!up.length) return [d, `오르는 해 없음 · 살필 해 ${down}`];
    const per = acts.map(a => ({ a, n: up.filter(y => a.years.includes(y)).length })), max = Math.max(...per.map(x => x.n)), top = per.filter(x => x.n === max);
    const where = top.length === 1 ? `${top[0].a.name}에 몰림` : top.length === acts.length && acts.length > 1 ? "막마다 고루" : `${top.map(x => x.a.name).join(" · ")}에 나뉨`;
    return [d, `오르는 해 ${up.length} · ${where}`];
  })) as unknown as Readonly<Record<DomainKey, string>>;
}

/** 2027 사실(세운과 같은 함수): 하늘 · 땅 십성과 쉬운 뜻 · 핵심 관계와 자리 · 해 판정 말. */
export function factsOf2027(e: TimelineEntry | undefined, o: { loveUp?: boolean; work?: boolean } = {}) {
  if (!e) return null;
  const tg = (x: string) => x.replace(/\(.*\)$/, "").trim(), sky = tg(e.tenGod.stem), ground = tg(e.tenGod.branch);
  return { year: Number(e.key), ganji: e.ganji.hangul, sky, ground, skyLine: TEN_GOD_SHORT[sky] ?? "", groundLine: TEN_GOD_SHORT[ground] ?? "", core: coreLine(coreOf(e), o), verdict: yearVerdict(e.flow.score) };
}

export type LifeChapter = { readonly n: number; readonly ganji: string; readonly hanja: string; readonly tenGod: string; readonly tg: TenGod; readonly title: string; readonly theme: string; readonly ages: string; readonly startAge: number;
  readonly startYear: number; readonly endYear: number; readonly start: string; readonly current: boolean; readonly next: boolean; readonly past: boolean; readonly tocOnly: boolean; readonly fill: Fill };
/** 평생 지도 → 인생의 장(번호 · 제목 · 만 나이 · 지금 · 다음 · 채움). 만 85세 넘어 시작하는 장은 목차에만(본문 근거 밖). */
export function lifeChaptersOf(life: readonly LifetimeCycle[], st: ElementState, strongest: FiveElement, thisYear: number): LifeChapter[] {
  const ci = life.findIndex(c => c.current);
  return life.map((c, i) => { const tg = (c.tenGod.match(/\((.+)\)/)?.[1] ?? c.tenGod) as TenGod, startAge = Number(c.ages.match(/\d+/)?.[0] ?? 0);
    return { n: i + 1, ganji: c.ganji, hanja: c.hanja, tenGod: c.tenGod, tg, title: CHAPTER_TITLE[tg], theme: TEN_GOD_THEME[tg], ages: c.ages, startAge, startYear: c.startYear, endYear: c.endYear,
      start: c.label.match(/(\d{4}년 (?:\d{1,2}(?:~\d{1,2})?월 )?무렵부터)/)?.[1] ?? `${c.startYear}년 무렵부터`, current: i === ci, next: ci >= 0 && i === ci + 1, past: c.endYear < thisYear, tocOnly: startAge > 85, fill: fillOf(st, strongest, c.hanja) }; });
}

export type MajorPlan = {
  readonly chapters: readonly LifeChapter[]; readonly now?: number; readonly next?: number;
  readonly position?: { readonly yearIndex: number; readonly label: string; readonly remaining: string };
  readonly turn?: { readonly year: number; readonly start: string; readonly ganji: string; readonly range: readonly [number, number] };
  readonly acts: readonly Act[]; readonly split: number;
  readonly transition?: { readonly from: TenGod; readonly to: TenGod; readonly end: string; readonly start: string };
  readonly domains: DomainYears; readonly summary: Readonly<Record<DomainKey, string>>; readonly stars: readonly number[];
  readonly y2027: ReturnType<typeof factsOf2027>; readonly nowRelations: readonly string[]; readonly nextRelations: readonly string[];
};
/** 대운 책 결정론 계획 하나(브리프 timeline.major · 책 초안 · 화면이 같은 값을 쓴다). */
export function majorPlanOf(a: { saju: SajuCalcResult; k: Knowledge; st: ElementState; strongest: FiveElement; life: readonly LifetimeCycle[]; entries: readonly Signaled[]; thisYear: number;
  phase?: { yearIndex: number; label: string; remaining: string }; loveUp?: boolean; work?: boolean }): MajorPlan {
  const chapters = lifeChaptersOf(a.life, a.st, a.strongest, a.thisYear), now = chapters.find(c => c.current), next = chapters.find(c => c.next);
  const acts = actsOf(next?.startYear), dy = domainYearsOf(a.entries);
  const pil = (h: string): Pillar => ({ stem: h[0] as Pillar["stem"], branch: h[1] as Pillar["branch"] });
  return { chapters, ...(now ? { now: now.n } : {}), ...(next ? { next: next.n } : {}), ...(a.phase ? { position: a.phase } : {}),
    ...(next ? { turn: { year: next.startYear, start: next.start, ganji: next.ganji, range: [next.startYear - 1, next.startYear + 1] as const } } : {}),
    acts, split: decadeSplit(acts),
    ...(now && next ? { transition: { from: now.tg, to: next.tg, end: TRANSITION[now.tg].end, start: TRANSITION[next.tg].start } } : {}),
    domains: dy, summary: domainSummary(dy, acts), stars: a.entries.filter(e => e.keyYear).map(e => Number(e.key)).sort((x, y) => x - y),
    y2027: factsOf2027(a.entries.find(e => e.kind === "year" && Number(e.key) === WINDOW[0]), { ...(a.loveUp !== undefined ? { loveUp: a.loveUp } : {}), ...(a.work !== undefined ? { work: a.work } : {}) }),
    nowRelations: now ? relationsWithNatal(a.saju, a.k, pil(now.hanja)) : [], nextRelations: next ? relationsWithNatal(a.saju, a.k, pil(next.hanja)) : [] };
}
