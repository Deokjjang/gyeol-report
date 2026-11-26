/**
 * 「남이 본 나」 계산 엔진(D0, docs/mirror/SPEC.md 「계산 규칙」). 순수 함수만 — 저장소 · 네트워크 · 시각을 읽지 않는다.
 * 선택값 0 = A쪽, 1 = B쪽. 친구 답의 "skip"은 「잘 모르겠어요」로, 점수와 개수 어디에도 들어가지 않는다.
 * 자가 답(SelfAnswers)은 지금 문항 버전의 답만 담아 넘긴다(옛 버전 답은 저장소에서 거른다).
 */
import { CLOSE_ONLY_FACETS, MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, type FacetId } from "../../data/mirror/items";

export type Choice = 0 | 1;
export type FriendChoice = Choice | "skip";
export type Closeness = 1 | 2 | 3;
export type Side = "A" | "B";
/** 1 약함 · 2 보통 · 3 뚜렷함 */
export type Strength = 1 | 2 | 3;
export type SelfAnswers = Readonly<Record<string, Choice>>;
export type FriendAnswer = { itemId: string; choice: FriendChoice };
/** ownerDevice: 주인 본인 기기에서 들어온 세션 — 친구 답에 넣지 않는다(SPEC 「주인 본인 기기」). */
export type FriendSession = { id: string; closeness: Closeness; ownerDevice?: boolean; answers: readonly FriendAnswer[] };

export const CLOSENESS_LABEL: Readonly<Record<Closeness, string>> = { 1: "아는 사이", 2: "친구", 3: "가까운 사이" };
export const STRENGTH_LABEL: Readonly<Record<Strength, string>> = { 1: "약함", 2: "보통", 3: "뚜렷함" };
/** 완성도 분모 · 첫 보고서가 열리는 친구 답 수. */
export const REPORT_ANSWERS = 60;
export const GOLDEN_MAX_SKIPS = 5;
const ITEMS_PER_FACET = 5;

export const mean = (xs: readonly number[]): number | null => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
/** 0~1 비율 → 화면 % (반올림). */
export const toPercent = (x: number | null): number | null => x === null ? null : Math.round(x * 100);

/** 그 친밀도에게 열린 면(아는 사이는 확인 · 거리 제외). */
export function openFacets(closeness: Closeness): FacetId[] {
  return MIRROR_FACET_IDS.filter(f => closeness !== 1 || !CLOSE_ONLY_FACETS.includes(f));
}
/** 그 친밀도에게 열린 문항 수(친구 · 가까운 사이 60, 아는 사이 50). */
export const openItemCount = (closeness: Closeness): number => openFacets(closeness).length * ITEMS_PER_FACET;

/** 주인 기기 답을 뺀, 점수에 들어가는 세션. */
export const countedSessions = (sessions: readonly FriendSession[]): FriendSession[] => sessions.filter(s => !s.ownerDevice);
const realAnswers = (s: FriendSession) => s.answers.filter((a): a is { itemId: string; choice: Choice } => a.choice !== "skip" && MIRROR_ITEM_BY_ID.has(a.itemId));

/** 비율(A쪽 비율 0~1)의 강도: 2.5(반반)에서 떨어진 정도. 자가 5문항(A 0~5개)은 2·3개 약함, 1·4개 보통, 0·5개 뚜렷함과 같다. */
export function strengthOfRatio(ratio: number): Strength {
  const d = Math.abs(2 * ratio - 1);
  return d < 0.4 ? 1 : d < 0.8 ? 2 : 3;
}

export type SelfFacet = { facet: FacetId; aCount: number; side: Side; strength: Strength };
/** 내 점수: 면마다 5문항 중 A쪽 수(0~5), 3 이상이면 A쪽. 5문항을 다 답하지 않은 면은 null. 결과는 MIRROR_FACET_IDS 순서. */
export function selfFacets(self: SelfAnswers): (SelfFacet | null)[] {
  return MIRROR_FACET_IDS.map(facet => {
    const items = MIRROR_ITEMS.filter(i => i.facet === facet), answered = items.filter(i => self[i.id] === 0 || self[i.id] === 1);
    if (answered.length < ITEMS_PER_FACET) return null;
    const aCount = answered.filter(i => self[i.id] === 0).length;
    return { facet, aCount, side: aCount >= 3 ? "A" : "B", strength: strengthOfRatio(aCount / ITEMS_PER_FACET) };
  });
}
export const selfComplete = (self: SelfAnswers): boolean => MIRROR_ITEMS.every(i => self[i.id] === 0 || self[i.id] === 1);
export const selfAnsweredCount = (self: SelfAnswers): number => MIRROR_ITEMS.filter(i => self[i.id] === 0 || self[i.id] === 1).length;

export type FriendFacet = { facet: FacetId; a: number; n: number; ratio: number };
/** 친구 점수: 그 면에 쌓인 친구 답 전체에서 A쪽 비율. 답이 없는 면은 null. */
export function friendFacets(sessions: readonly FriendSession[]): (FriendFacet | null)[] {
  const a = new Map<FacetId, number>(), n = new Map<FacetId, number>();
  for (const s of countedSessions(sessions)) for (const ans of realAnswers(s)) {
    const facet = MIRROR_ITEM_BY_ID.get(ans.itemId)!.facet;
    n.set(facet, (n.get(facet) ?? 0) + 1);
    if (ans.choice === 0) a.set(facet, (a.get(facet) ?? 0) + 1);
  }
  return MIRROR_FACET_IDS.map(facet => n.get(facet) ? { facet, a: a.get(facet) ?? 0, n: n.get(facet)!, ratio: (a.get(facet) ?? 0) / n.get(facet)! } : null);
}

export type ItemMatch = { itemId: string; facet: FacetId; matched: number; total: number; rate: number };
/** 문항마다 "친구 답 중 내 답과 같은 비율"(내 답과 친구 답이 둘 다 있는 문항만). */
export function itemMatches(self: SelfAnswers, sessions: readonly FriendSession[]): ItemMatch[] {
  const m = new Map<string, { matched: number; total: number }>();
  for (const s of countedSessions(sessions)) for (const ans of realAnswers(s)) {
    const mine = self[ans.itemId];
    if (mine !== 0 && mine !== 1) continue;
    const cur = m.get(ans.itemId) ?? { matched: 0, total: 0 };
    cur.total++; if (ans.choice === mine) cur.matched++;
    m.set(ans.itemId, cur);
  }
  return MIRROR_ITEMS.flatMap(i => { const c = m.get(i.id); return c ? [{ itemId: i.id, facet: i.facet, ...c, rate: c.matched / c.total }] : []; });
}
/** 면별 일치율: 그 면 문항 일치율의 평균. 친구 답이 없는 면은 null. MIRROR_FACET_IDS 순서. */
export function facetMatchRates(self: SelfAnswers, sessions: readonly FriendSession[]): (number | null)[] {
  const items = itemMatches(self, sessions);
  return MIRROR_FACET_IDS.map(facet => mean(items.filter(i => i.facet === facet).map(i => i.rate)));
}
/** 싱크로율(0~1): 친구 답이 있는 면끼리 면별 일치율을 다시 평균. 친구 답 전에는 null(화면 ?%). */
export function syncRate(self: SelfAnswers, sessions: readonly FriendSession[]): number | null {
  return mean(facetMatchRates(self, sessions).filter((r): r is number => r !== null));
}
export const syncPercent = (self: SelfAnswers, sessions: readonly FriendSession[]): number | null => toPercent(syncRate(self, sessions));

/** 친구 답 수(건너뜀 · 주인 기기 제외). */
export const friendAnswerCount = (sessions: readonly FriendSession[]): number => countedSessions(sessions).reduce((s, x) => s + realAnswers(x).length, 0);
/** 완성도: 친구 답 수 ÷ 60, 최대 100%. */
export function completeness(sessions: readonly FriendSession[]): { answers: number; ratio: number; percent: number; reportReady: boolean } {
  const answers = friendAnswerCount(sessions), ratio = Math.min(1, answers / REPORT_ANSWERS);
  return { answers, ratio, percent: Math.round(ratio * 100), reportReady: answers >= REPORT_ANSWERS };
}

/** 친구 한 명의 아는 정도: 그 친구 답(건너뜀 제외) 중 주인 자가 답과 같은 비율. */
export function knowRate(session: FriendSession, self: SelfAnswers): { matched: number; answered: number; percent: number } | null {
  const answered = realAnswers(session).filter(a => self[a.itemId] === 0 || self[a.itemId] === 1);
  if (!answered.length) return null;
  const matched = answered.filter(a => self[a.itemId] === a.choice).length;
  return { matched, answered: answered.length, percent: Math.round((matched / answered.length) * 100) };
}

/** 답한 친구: 주인 기기가 아니고, 건너뛰지 않은 답이 1개 이상인 세션. */
export const answeredFriends = (sessions: readonly FriendSession[]): FriendSession[] => countedSessions(sessions).filter(s => realAnswers(s).length > 0);

/** 친구 순위(답한 친구 3명 이상일 때만): 아는 정도 %(화면 숫자) 높은 순, 같은 %는 같은 등수. */
export function friendRank(sessions: readonly FriendSession[], self: SelfAnswers, sessionId: string): { rank: number; total: number } | null {
  const scored = answeredFriends(sessions).map(s => ({ id: s.id, p: knowRate(s, self)?.percent ?? null })).filter((x): x is { id: string; p: number } => x.p !== null);
  if (scored.length < 3) return null;
  const me = scored.find(x => x.id === sessionId);
  if (!me) return null;
  return { rank: 1 + scored.filter(x => x.p > me.p).length, total: scored.length };
}

/** 친구 비율로 본 기운 쪽: 정확히 반반이면 주인 쪽. */
export function friendSide(ratio: number, ownerSide: Side): Side { return ratio > 0.5 ? "A" : ratio < 0.5 ? "B" : ownerSide; }

export type AttachmentType = "secure" | "anxious" | "avoidant" | "fearful";
export const ATTACHMENT_LABEL: Readonly<Record<AttachmentType, string>> = { secure: "안정형", anxious: "불안형", avoidant: "회피형", fearful: "불안-회피형" };
export type Attachment = { type: AttachmentType; label: string; near: boolean };
/**
 * 애착 경향(확인 × 거리): 확인 A(자주 확인하고 싶은) = 불안 높음, 거리 B(혼자 해결하는) = 회피 높음.
 * 믿고 기다림 × 가까이 기댐 = 안정형 · 믿고 기다림 × 혼자 해결 = 회피형 · 자주 확인 × 가까이 기댐 = 불안형 · 자주 확인 × 혼자 해결 = 불안-회피형.
 * 두 면 모두 약하면 near(화면 "~에 가까워요").
 */
export function attachmentOf(check: { side: Side; strength: Strength }, dist: { side: Side; strength: Strength }): Attachment {
  const anxious = check.side === "A", avoidant = dist.side === "B";
  const type: AttachmentType = anxious ? (avoidant ? "fearful" : "anxious") : (avoidant ? "avoidant" : "secure");
  return { type, label: ATTACHMENT_LABEL[type], near: check.strength === 1 && dist.strength === 1 };
}
const CHECK = MIRROR_FACET_IDS.indexOf("check"), DIST = MIRROR_FACET_IDS.indexOf("dist");
export function selfAttachment(self: SelfAnswers): Attachment | null {
  const f = selfFacets(self), c = f[CHECK], d = f[DIST];
  return c && d ? attachmentOf(c, d) : null;
}
/** 친구들이 본 애착 경향(친구 · 가까운 사이 답만 — 아는 사이는 이 두 면을 받지 않는다). 반반이면 주인 쪽. */
export function friendAttachment(sessions: readonly FriendSession[], self: SelfAnswers): Attachment | null {
  const mine = selfFacets(self), ff = friendFacets(sessions.filter(s => s.closeness !== 1));
  const pick = (i: number) => { const f = ff[i], m = mine[i]; return f && m ? { side: friendSide(f.ratio, m.side), strength: strengthOfRatio(f.ratio) } : null; };
  const c = pick(CHECK), d = pick(DIST);
  return c && d ? attachmentOf(c, d) : null;
}

/** 유형: 대표 면 4개(사교 · 상상 · 공감 · 계획)로 16가지(SPEC 「유형 이름」). */
const NOUN = [["모험가", "해결사"], ["몽상가", "장인"]] as const;
const ADJ = [["다정한", "자유로운"], ["단단한", "기발한"]] as const;
const LINE = {
  soc: ["사람 속에서 힘을 얻고", "혼자만의 시간에 힘을 얻고"], imag: ["상상과 감성으로 세상을 보고", "현실과 감각으로 세상을 보고"],
  emp: ["마음부터 챙기고", "해결부터 찾고"], plan: ["계획대로 나아가는 사람", "흐름을 타며 나아가는 사람"],
} as const;
export const TYPE_FACETS = ["soc", "imag", "emp", "plan"] as const;
export type MirrorType = { key: string; title: string; line: string };
export function typeFromSides(sides: Readonly<Record<typeof TYPE_FACETS[number], Side>>): MirrorType {
  const b = (f: typeof TYPE_FACETS[number]) => sides[f] === "A" ? 0 : 1;
  return {
    key: TYPE_FACETS.map(f => sides[f]).join(""),
    title: `${ADJ[b("emp")][b("plan")]} ${NOUN[b("soc")][b("imag")]}`,
    line: TYPE_FACETS.map(f => LINE[f][b(f)]).join(", "),
  };
}
export function selfType(self: SelfAnswers): MirrorType | null {
  const f = selfFacets(self), sides = {} as Record<typeof TYPE_FACETS[number], Side>;
  for (const id of TYPE_FACETS) { const x = f[MIRROR_FACET_IDS.indexOf(id)]; if (!x) return null; sides[id] = x.side; }
  return typeFromSides(sides);
}
/** 친구들이 본 유형: 네 면 모두 친구 답이 있어야 하고, 비율이 정확히 반반이면 주인 쪽. */
export function friendType(sessions: readonly FriendSession[], self: SelfAnswers): MirrorType | null {
  const mine = selfFacets(self), ff = friendFacets(sessions), sides = {} as Record<typeof TYPE_FACETS[number], Side>;
  for (const id of TYPE_FACETS) {
    const i = MIRROR_FACET_IDS.indexOf(id), f = ff[i], m = mine[i];
    if (!f || !m) return null;
    sides[id] = friendSide(f.ratio, m.side);
  }
  return typeFromSides(sides);
}

/** 성장 단계(답한 친구 수 0 · 1 · 3 · 5 · 15 · 40 · 100). 이름은 화면에 쓰지 않고 연출 세기에만 쓴다. */
export const GROWTH_THRESHOLDS = [0, 1, 3, 5, 15, 40, 100] as const;
export function growthStage(friendCount: number): number {
  let stage = 0;
  GROWTH_THRESHOLDS.forEach((t, i) => { if (friendCount >= t) stage = i; });
  return stage;
}

/** 황금별: 그 친구에게 열린 문항을 끝까지 진행하고(친구 · 가까운 사이 60, 아는 사이 50) 건너뛰기 5개 이하. */
export function isGolden(session: Pick<FriendSession, "closeness" | "answers">): boolean {
  const open = new Set(openFacets(session.closeness)), seen = new Set<string>();
  let skips = 0;
  for (const a of session.answers) {
    const item = MIRROR_ITEM_BY_ID.get(a.itemId);
    if (!item || !open.has(item.facet) || seen.has(a.itemId)) continue;
    seen.add(a.itemId); if (a.choice === "skip") skips++;
  }
  return seen.size >= openItemCount(session.closeness) && skips <= GOLDEN_MAX_SKIPS;
}

/** 60개 답 문자열(문항 정의 순서, A · B · 미답 -). 별자리 흔들림의 씨앗. */
export const answerKey = (self: SelfAnswers): string => MIRROR_ITEMS.map(i => self[i.id] === 0 ? "A" : self[i.id] === 1 ? "B" : "-").join("");
