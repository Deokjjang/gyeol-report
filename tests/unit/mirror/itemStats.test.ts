import { describe, expect, it } from "vitest";
import { MIRROR_ITEMS, type FacetId } from "../../../src/data/mirror/items";
import { computeItemStats, countedSessionIds, ITEM_STAT_RULES, pearson, PRIORITY_PAIRS, type FriendAnswerRow, type ItemStatsInput, type SelfAnswerRow } from "../../../src/lib/mirror/itemStats";

const ids = (facet: FacetId) => MIRROR_ITEMS.filter(i => i.facet === facet).map(i => i.id);
const empty = (): ItemStatsInput => ({ self: [], sessions: [], answers: [], devices: [], voids: [] });
const row = (userId: string, itemId: string, choice: number, version = 1): SelfAnswerRow => ({ userId, itemId, version, choice });
const hash = (n: number) => n.toString(16).padStart(64, "0");

describe("pearson", () => {
  it("완전 정비례 1 · 반비례 -1 · 분산 0이면 null", () => {
    expect(pearson([0, 1, 0, 1], [0, 2, 0, 2])).toBeCloseTo(1);
    expect(pearson([0, 1, 0, 1], [3, 1, 3, 1])).toBeCloseTo(-1);
    expect(pearson([1, 1, 1], [0, 1, 2])).toBeNull();
    expect(pearson([1], [1])).toBeNull();
  });
});

describe("세션 거르기(보고서 · 기록판과 같은 기준)", () => {
  it("주인 계정에 이은 세션 · 주인이 로그인한 기기 · 무효 세션은 뺀다", () => {
    const r = countedSessionIds({
      sessions: [
        { id: "s1", ownerId: "o", deviceHash: hash(1), linkedUserId: null },
        { id: "s2", ownerId: "o", deviceHash: hash(2), linkedUserId: "o" },
        { id: "s3", ownerId: "o", deviceHash: hash(3), linkedUserId: null },
        { id: "s4", ownerId: "o", deviceHash: hash(4), linkedUserId: "friend" },
        { id: "s5", ownerId: "p", deviceHash: hash(3), linkedUserId: null },
      ],
      devices: [{ deviceHash: hash(3), userId: "o" }],
      voids: ["s4"],
    });
    expect([...r.ids].sort()).toEqual(["s1", "s5"]);
    expect(r).toMatchObject({ ownerDevice: 2, voided: 1 });
  });
});

describe("① 한쪽 답 85% 초과", () => {
  it("표본 30 이상에서 86%면 점검, 85%는 아님, 30 미만은 표본 부족", () => {
    const item = ids("soc")[0], make = (n: number, a: number) => ({ ...empty(), self: Array.from({ length: n }, (_, i) => row(`u${i}`, item, i < a ? 0 : 1)) });
    const s86 = computeItemStats(make(50, 43)).items.find(x => x.itemId === item)!;
    expect(s86.self).toMatchObject({ n: 50, a: 43, top: "A", flag: "flag" });
    expect(s86.self.topShare).toBeCloseTo(0.86);
    expect(computeItemStats(make(40, 6)).items.find(x => x.itemId === item)!.self).toMatchObject({ top: "B", flag: "ok" }); // 34/40 = 85%
    expect(computeItemStats(make(20, 20)).items.find(x => x.itemId === item)!.self.flag).toBe("thin");
  });
  it("옛 문항 버전 · 잘못된 값은 세지 않는다", () => {
    const item = ids("soc")[0];
    const s = computeItemStats({ ...empty(), self: [row("u1", item, 0, 2), row("u2", item, 5), row("u3", item, 1)] }).items.find(x => x.itemId === item)!;
    expect(s.self).toMatchObject({ n: 1, a: 0 });
  });
});

describe("② 문항-나머지 상관", () => {
  it("그 면 5문항을 다 답한 사람만, 따로 노는 문항은 r이 낮아 점검", () => {
    const [i1, i2, i3, i4, i5] = ids("worry");
    const self: SelfAnswerRow[] = [];
    // 40명: 1~4번은 같이 움직이고(사람마다 전부 A 또는 전부 B), 5번은 그와 무관하게 번갈아.
    for (let u = 0; u < 40; u++) {
      const a = u % 2 === 0 ? 0 : 1;
      for (const id of [i1, i2, i3, i4]) self.push(row(`u${u}`, id, a));
      self.push(row(`u${u}`, i5, Math.floor(u / 2) % 2));
    }
    self.push(row("partial", i1, 0)); // 면을 다 답하지 않은 사람은 상관에서 빠진다
    const items = computeItemStats({ ...empty(), self }).items;
    const c1 = items.find(x => x.itemId === i1)!.corr, c5 = items.find(x => x.itemId === i5)!.corr;
    expect(c1.n).toBe(40);
    expect(c1.flag).toBe("ok");
    expect(c1.r!).toBeGreaterThan(0.9);
    expect(c5.flag).toBe("flag");
    expect(Math.abs(c5.r!)).toBeLessThan(ITEM_STAT_RULES.lowCorrelation);
    expect(items.find(x => x.itemId === i1)!.self.n).toBe(41);
  });
  it("표본 30 미만은 표본 부족, 모두 같은 답이면 계산하지 않는다", () => {
    const facet = ids("plan");
    const few = computeItemStats({ ...empty(), self: Array.from({ length: 10 }, (_, u) => facet.map(id => row(`u${u}`, id, u % 2))).flat() }).items.find(x => x.itemId === facet[0])!;
    expect(few.corr.flag).toBe("thin");
    const flat = computeItemStats({ ...empty(), self: Array.from({ length: 40 }, (_, u) => facet.map(id => row(`u${u}`, id, 0))).flat() }).items.find(x => x.itemId === facet[0])!;
    expect(flat.corr).toMatchObject({ n: 40, r: null, flag: "flat" });
  });
});

describe("③ 친구 「잘 모르겠어요」 30% 초과", () => {
  it("건너뜀은 한쪽 답 비율에서 빼고 건너뜀 비율로만, 뺀 세션의 답은 세지 않는다", () => {
    const item = ids("emo")[1];
    const sessions = Array.from({ length: 41 }, (_, i) => ({ id: `s${i}`, ownerId: "o", deviceHash: hash(i), linkedUserId: i === 40 ? "o" : null }));
    const answers: FriendAnswerRow[] = sessions.map((s, i) => ({ sessionId: s.id, itemId: item, version: 1, choice: i < 13 ? 2 : i % 2 }));
    const x = computeItemStats({ ...empty(), sessions, answers }).items.find(r => r.itemId === item)!;
    expect(x.friend).toMatchObject({ skips: 13, total: 40, skipFlag: "flag", n: 27 });
    expect(x.friend.skipShare).toBeCloseTo(13 / 40);
    const fewer = answers.map((a, i) => (i < 12 ? a : { ...a, choice: i % 2 }));
    expect(computeItemStats({ ...empty(), sessions, answers: fewer }).items.find(r => r.itemId === item)!.friend.skipFlag).toBe("ok"); // 12/40 = 30%
  });
});

describe("우선 점검 2쌍", () => {
  it("SPEC 번호 2↔56, 46↔26이 사교 · 거리 · 걱정 · 추진 문항을 가리킨다", () => {
    const s = computeItemStats(empty());
    expect(PRIORITY_PAIRS).toEqual([[2, 56], [46, 26]]);
    expect(s.pairs.map(p => [p.a.itemId, p.b.itemId])).toEqual([["soc-2", "dist-1"], ["worry-1", "drive-1"]]);
    expect(s.items).toHaveLength(60);
    expect(s.items.map(x => x.no)).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });
  it("두 문항이 각자 면보다 서로 더 붙어 다니면 섞임 의심", () => {
    const self: SelfAnswerRow[] = [];
    for (let u = 0; u < 40; u++) {
      const x = u % 2;
      for (const id of ids("soc")) self.push(row(`u${u}`, id, id === "soc-2" ? x : Math.floor(u / 2) % 2));
      for (const id of ids("dist")) self.push(row(`u${u}`, id, id === "dist-1" ? x : Math.floor(u / 4) % 2));
    }
    const p = computeItemStats({ ...empty(), self }).pairs[0];
    expect(p.n).toBe(40);
    expect(p.r!).toBeCloseTo(1);
    expect(p.flag).toBe("flag");
  });
});
