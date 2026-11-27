/**
 * 기록판 숫자(서버 계산, SPEC 「기록판과 결 보고서」). 친구 답 원본 · 세션 id는 보내지 않는다(익명).
 * 친밀도별 수는 그 묶음이 3명 이상일 때만, 아니면 null(화면에서 숨김).
 */
import { MIRROR_FACETS, MIRROR_FACET_IDS, type FacetId } from "../../data/mirror/items";
import { friendConstellation, selfConstellation, type ConstellationShape } from "./constellation";
import { answeredFriends, completeness, facetMatchRates, friendFacets, REPORT_ANSWERS, selfFacets, syncPercent, type Closeness, type FriendSession, type SelfAnswers, type Side } from "./engine";

export const ISSUE_GAP_DAYS = 7;
export type BoardFacet = { facet: FacetId; domain: string; name: string; a: string; b: string; self: { aCount: number; side: Side }; friend: { ratio: number; n: number } | null; match: number | null };
export type IssueState = { count: number; latest: number | null; canIssue: boolean; remaining: number; nextAt: string | null };
export type BoardView = {
  sync: number | null; answers: number; completeness: number; friends: number; golden: number;
  byCloseness: Record<Closeness, number | null>;
  facets: BoardFacet[];
  shapes: { self: ConstellationShape; friend: ConstellationShape | null };
  issue: IssueState;
};

/** 보고서 받기 상태: 친구 답 60개부터, 마지막 발행 + 7일. */
export function issueState(answers: number, issues: readonly { issueNo: number; issuedAt: string }[], now: Date): IssueState {
  const last = issues.reduce<{ issueNo: number; issuedAt: string } | null>((m, x) => !m || x.issueNo > m.issueNo ? x : m, null);
  const nextAt = last ? new Date(Date.parse(last.issuedAt) + ISSUE_GAP_DAYS * 86_400_000).toISOString() : null;
  const remaining = Math.max(0, REPORT_ANSWERS - answers);
  return { count: issues.length, latest: last?.issueNo ?? null, canIssue: remaining === 0 && (!nextAt || Date.parse(nextAt) <= now.getTime()), remaining, nextAt };
}

export function boardView(self: SelfAnswers, sessions: readonly FriendSession[], issues: readonly { issueNo: number; issuedAt: string }[], now: Date): BoardView {
  const friends = answeredFriends(sessions), c = completeness(sessions), mine = selfFacets(self), ff = friendFacets(sessions), match = facetMatchRates(self, sessions);
  const by = (k: Closeness) => { const n = friends.filter(s => s.closeness === k).length; return n >= 3 ? n : null; };
  return {
    sync: syncPercent(self, sessions), answers: c.answers, completeness: c.percent, friends: friends.length,
    golden: sessions.filter(s => !s.ownerDevice && s.golden).length,
    byCloseness: { 1: by(1), 2: by(2), 3: by(3) },
    facets: MIRROR_FACET_IDS.map((facet, i) => {
      const f = MIRROR_FACETS[i], m = mine[i], x = ff[i];
      return { facet, domain: f.domain, name: f.name, a: f.a, b: f.b, self: { aCount: m?.aCount ?? 0, side: m?.side ?? "A" }, friend: x ? { ratio: x.ratio, n: x.n } : null, match: match[i] };
    }),
    shapes: { self: selfConstellation(self), friend: friends.length ? friendConstellation(sessions, self) : null },
    issue: issueState(c.answers, issues, now),
  };
}
