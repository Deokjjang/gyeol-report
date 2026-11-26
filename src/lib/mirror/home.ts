/**
 * 홈 화면 숫자(서버에서 계산해 보낸다). 친구 답 원본 · 세션 id는 화면에 보내지 않는다(익명, SPEC 「익명」).
 * 친구 별은 친밀도 · 황금별 · 놓일 면 · 내 답과 맞았는지만 담는다.
 */
import { MIRROR_ITEM_BY_ID, facetIndex } from "../../data/mirror/items";
import { answeredFriends, completeness, growthStage, isGolden, syncPercent, type Closeness, type FriendSession, type SelfAnswers } from "./engine";
import { hash32 } from "./hash";

export type FriendStar = { key: string; facet: number; matched: boolean; closeness: Closeness; golden: boolean };
export type HomeView = { sync: number | null; answers: number; completeness: number; reportReady: boolean; friends: number; stage: number; stars: FriendStar[] };

/** 친구 별 하나: 그 친구가 가장 많이 답한 면 옆에 놓이고(같으면 시드 순), 그 면에서 내 답과 절반 이상 같으면 내 별 쪽, 아니면 반대쪽. */
export function friendStar(session: FriendSession, self: SelfAnswers): FriendStar | null {
  const per = new Map<number, { n: number; m: number }>();
  for (const a of session.answers) {
    const item = MIRROR_ITEM_BY_ID.get(a.itemId);
    if (!item || a.choice === "skip") continue;
    const f = facetIndex(item.facet), cur = per.get(f) ?? { n: 0, m: 0 };
    cur.n++; if (self[a.itemId] === a.choice) cur.m++;
    per.set(f, cur);
  }
  if (!per.size) return null;
  const key = hash32(`star:${session.id}`).toString(36);
  const [facet, c] = [...per.entries()].sort((x, y) => y[1].n - x[1].n || hash32(`${key}:${x[0]}`) - hash32(`${key}:${y[0]}`))[0];
  return { key, facet, matched: c.m * 2 >= c.n, closeness: session.closeness, golden: session.answers.length > 0 && isGolden(session) };
}

export function homeView(self: SelfAnswers, sessions: readonly FriendSession[]): HomeView {
  const friends = answeredFriends(sessions), c = completeness(sessions);
  return {
    sync: syncPercent(self, sessions), answers: c.answers, completeness: c.percent, reportReady: c.reportReady,
    friends: friends.length, stage: growthStage(friends.length),
    stars: friends.map(s => friendStar(s, self)).filter((s): s is FriendStar => s !== null),
  };
}
