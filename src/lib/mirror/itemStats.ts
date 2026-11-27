/**
 * 「남이 본 나」 출시 후 문항 점검(운영자 화면 /admin/mirror-items, docs/mirror/SPEC.md 「출시 후 문항 점검」). 순수 함수 — 저장소 · 네트워크 0.
 *  ① 한쪽 답이 85%를 넘는 문항(자가 답 · 친구 답 따로, 「잘 모르겠어요」 제외) → 사람을 구분하지 못한다.
 *  ② 같은 면의 다른 문항과 따로 노는 문항: 자가 답으로 「이 문항(A=1) ↔ 같은 면 나머지 4문항의 A 수(0~4)」 피어슨 r(문항-나머지 상관). 0.2 미만이면 점검.
 *  ③ 친구의 「잘 모르겠어요」가 30%를 넘는 문항(그 문항에 들어온 친구 답 전체 중 건너뜀 비율).
 * 세 점검 모두 표본이 30개 미만이면 숫자만 보이고 「표본 부족」으로 둔다. 지금 문항 버전 답만 센다.
 * 친구 답은 보고서 · 기록판과 같은 기준으로 뺀다: 주인 기기 세션(주인 계정에 이은 세션 · 주인이 로그인한 기기) · 무효 세션(0.3초 미만 연속).
 * 우선 점검 2쌍(SPEC): 2번(사교)↔56번(거리), 46번(걱정)↔26번(추진) — 두 문항끼리 상관(|r|)이 각자 면 상관 중 낮은 쪽보다 크면 섞임 의심.
 */
import { MIRROR_FACETS, MIRROR_FACET_IDS, MIRROR_ITEMS, MIRROR_ITEM_BY_ID, facetIndex, type FacetId } from "../../data/mirror/items";

export const ITEM_STAT_RULES = { lopsided: 0.85, lowCorrelation: 0.2, skipShare: 0.3, minN: 30 } as const;
/** SPEC 「겹치는 지점 주의」: 문항 번호(1~60) 쌍. */
export const PRIORITY_PAIRS: readonly (readonly [number, number])[] = [[2, 56], [46, 26]];

export type SelfAnswerRow = { userId: string; itemId: string; version: number; choice: number };
export type FriendSessionRow = { id: string; ownerId: string; deviceHash: string; linkedUserId: string | null };
export type FriendAnswerRow = { sessionId: string; itemId: string; version: number; choice: number };
export type ItemStatsInput = {
  self: readonly SelfAnswerRow[];
  sessions: readonly FriendSessionRow[];
  answers: readonly FriendAnswerRow[];
  /** mirror_devices: 로그인한 채 쓴 기기(device_hash × user_id). */
  devices: readonly { deviceHash: string; userId: string }[];
  /** mirror_session_voids.session_id */
  voids: readonly string[];
};

export type Flag = "ok" | "flag" | "thin" | "flat";
export type Share = { n: number; a: number; top: "A" | "B" | null; topShare: number | null; flag: Flag };
export type ItemStatRow = {
  itemId: string; no: number; facet: FacetId; facetName: string; situation: string; a: string; b: string;
  self: Share;
  friend: Share & { skips: number; total: number; skipShare: number | null; skipFlag: Flag };
  corr: { n: number; r: number | null; flag: Flag };
};
export type PairRow = { a: ItemStatRow; b: ItemStatRow; n: number; r: number | null; flag: Flag };
export type ItemStatsResult = {
  items: ItemStatRow[];
  pairs: PairRow[];
  totals: { selfPeople: number; selfAnswers: number; sessions: number; friendAnswers: number; ownerDevice: number; voided: number };
};

const current = (itemId: string, version: number) => MIRROR_ITEM_BY_ID.get(itemId)?.version === version;
const itemNo = new Map(MIRROR_ITEMS.map((item, i) => [item.id, i + 1]));

/** 피어슨 r. 한쪽이라도 모두 같은 값이면(분산 0) null. */
export function pearson(xs: readonly number[], ys: readonly number[]): number | null {
  const n = xs.length;
  if (n < 2 || ys.length !== n) return null;
  const mx = xs.reduce((s, x) => s + x, 0) / n, my = ys.reduce((s, y) => s + y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  return sxx === 0 || syy === 0 ? null : sxy / Math.sqrt(sxx * syy);
}

function share(n: number, a: number): Share {
  if (n === 0) return { n, a, top: null, topShare: null, flag: "thin" };
  const top = a * 2 >= n ? "A" as const : "B" as const, topShare = Math.max(a, n - a) / n;
  return { n, a, top, topShare, flag: n < ITEM_STAT_RULES.minN ? "thin" : topShare > ITEM_STAT_RULES.lopsided ? "flag" : "ok" };
}

/** 셈에 넣을 친구 세션: 주인 기기(주인 계정에 이은 세션 · 주인이 로그인한 기기)와 무효 세션을 뺀다. */
export function countedSessionIds(input: Pick<ItemStatsInput, "sessions" | "devices" | "voids">): { ids: Set<string>; ownerDevice: number; voided: number } {
  const ownerDevices = new Set(input.devices.map(d => `${d.deviceHash}|${d.userId}`)), voids = new Set(input.voids);
  const ids = new Set<string>();
  let ownerDevice = 0, voided = 0;
  for (const s of input.sessions) {
    if (s.linkedUserId === s.ownerId || ownerDevices.has(`${s.deviceHash}|${s.ownerId}`)) { ownerDevice++; continue; }
    if (voids.has(s.id)) { voided++; continue; }
    ids.add(s.id);
  }
  return { ids, ownerDevice, voided };
}

export function computeItemStats(input: ItemStatsInput): ItemStatsResult {
  // 자가 답: 사람 × 문항(지금 버전).
  const byUser = new Map<string, Map<string, 0 | 1>>();
  let selfAnswers = 0;
  for (const r of input.self) {
    if (!current(r.itemId, r.version) || (r.choice !== 0 && r.choice !== 1)) continue;
    const m = byUser.get(r.userId) ?? new Map<string, 0 | 1>();
    m.set(r.itemId, r.choice); byUser.set(r.userId, m); selfAnswers++;
  }
  const people = [...byUser.values()];

  // 친구 답: 셈에 넣는 세션만.
  const counted = countedSessionIds(input);
  const friend = new Map<string, { n: number; a: number; skips: number }>();
  let friendAnswers = 0;
  for (const r of input.answers) {
    if (!counted.ids.has(r.sessionId) || !current(r.itemId, r.version) || ![0, 1, 2].includes(r.choice)) continue;
    const t = friend.get(r.itemId) ?? { n: 0, a: 0, skips: 0 };
    if (r.choice === 2) t.skips++; else { t.n++; if (r.choice === 0) t.a++; }
    friend.set(r.itemId, t); friendAnswers++;
  }

  // 문항-나머지 상관: 그 면 5문항을 다 답한 사람만.
  const facetItems = new Map<FacetId, string[]>(MIRROR_FACET_IDS.map(f => [f, MIRROR_ITEMS.filter(i => i.facet === f).map(i => i.id)]));
  const corrOf = (itemId: string, facet: FacetId) => {
    const ids = facetItems.get(facet)!, xs: number[] = [], ys: number[] = [];
    for (const m of people) {
      if (!ids.every(id => m.has(id))) continue;
      xs.push(m.get(itemId) === 0 ? 1 : 0);
      ys.push(ids.filter(id => id !== itemId && m.get(id) === 0).length);
    }
    const r = pearson(xs, ys), n = xs.length;
    const flag: Flag = n < ITEM_STAT_RULES.minN ? "thin" : r === null ? "flat" : r < ITEM_STAT_RULES.lowCorrelation ? "flag" : "ok";
    return { n, r, flag };
  };

  const items = MIRROR_ITEMS.map((item): ItemStatRow => {
    const sa = people.filter(m => m.has(item.id)), self = share(sa.length, sa.filter(m => m.get(item.id) === 0).length);
    const f = friend.get(item.id) ?? { n: 0, a: 0, skips: 0 }, total = f.n + f.skips, skipShare = total ? f.skips / total : null;
    return {
      itemId: item.id, no: itemNo.get(item.id)!, facet: item.facet, facetName: MIRROR_FACETS[facetIndex(item.facet)].name,
      situation: item.self.situation, a: item.self.a, b: item.self.b,
      self, friend: { ...share(f.n, f.a), skips: f.skips, total, skipShare, skipFlag: total < ITEM_STAT_RULES.minN ? "thin" : skipShare! > ITEM_STAT_RULES.skipShare ? "flag" : "ok" },
      corr: corrOf(item.id, item.facet),
    };
  });

  const byNo = new Map(items.map(x => [x.no, x]));
  const pairs = PRIORITY_PAIRS.map(([p, q]): PairRow => {
    const a = byNo.get(p)!, b = byNo.get(q)!, xs: number[] = [], ys: number[] = [];
    for (const m of people) if (m.has(a.itemId) && m.has(b.itemId)) { xs.push(m.get(a.itemId) === 0 ? 1 : 0); ys.push(m.get(b.itemId) === 0 ? 1 : 0); }
    const r = pearson(xs, ys), n = xs.length, own = [a.corr.r, b.corr.r].filter((x): x is number => x !== null);
    // 두 문항끼리(방향 무관 |r|)가 각자 면 안에서보다 더 붙어 다니면 섞임 의심.
    const flag: Flag = n < ITEM_STAT_RULES.minN ? "thin" : r === null ? "flat" : own.length && Math.abs(r) > Math.min(...own) ? "flag" : "ok";
    return { a, b, n, r, flag };
  });

  return { items, pairs, totals: { selfPeople: people.length, selfAnswers, sessions: counted.ids.size, friendAnswers, ownerDevice: counted.ownerDevice, voided: counted.voided } };
}
