import { describe, expect, it } from "vitest";
import { MIRROR_ITEMS } from "../../../src/data/mirror/items";
import { constellation, edgeKey, facetAngle, friendConstellation, SHAPE, selfConstellation } from "../../../src/lib/mirror/constellation";
import type { Choice, FriendSession, SelfAnswers } from "../../../src/lib/mirror/engine";
import { seededRandom } from "../../../src/lib/mirror/hash";

const randomSelf = (rand: () => number): SelfAnswers => Object.fromEntries(MIRROR_ITEMS.map(i => [i.id, (rand() < 0.5 ? 0 : 1) as Choice]));

describe("별자리 모양", () => {
  it("무작위 답 100명: 선 구조(이어진 점 쌍 집합)가 서로 다른 비율 95% 이상", () => {
    for (const seed of [11, 2026, 4242]) {
      const rand = seededRandom(seed), keys = new Set<string>();
      for (let p = 0; p < 100; p++) keys.add(edgeKey(selfConstellation(randomSelf(rand))));
      expect(keys.size, `seed ${seed}`).toBeGreaterThanOrEqual(95);
    }
  });
  it("같은 답은 늘 같은 모양, 답 하나만 달라도 흔들림 씨앗이 달라진다", () => {
    const self = randomSelf(seededRandom(7));
    expect(selfConstellation(self)).toEqual(selfConstellation({ ...self }));
    const flipped = { ...self, "worry-3": (1 - self["worry-3"]) as Choice };
    expect(selfConstellation(flipped).seed).not.toBe(selfConstellation(self).seed);
  });
  it("별 12개 · 자기 방향 근처 · 겹치지 않음 · 선은 최소 신장 트리 안(11개 이하)", () => {
    const rand = seededRandom(99);
    for (let p = 0; p < 200; p++) {
      const s = selfConstellation(randomSelf(rand));
      expect(s.points).toHaveLength(12);
      expect(s.edges.length).toBeLessThanOrEqual(11);
      for (const pt of s.points) {
        const r = Math.hypot(pt.x, pt.y);
        expect(r).toBeLessThan(1.05);
        let diff = Math.atan2(pt.y, pt.x) - facetAngle(pt.index);
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        expect(Math.abs(diff)).toBeLessThan(0.6);
      }
      for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) expect(Math.hypot(s.points[i].x - s.points[j].x, s.points[i].y - s.points[j].y)).toBeGreaterThan(SHAPE.minSep - 1e-6);
      for (const [a, b] of s.edges) { const p = s.points.find(x => x.index === a)!, q = s.points.find(x => x.index === b)!; expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeLessThanOrEqual(SHAPE.maxEdge + 1e-9); }
    }
  });
  it("강도가 셀수록 중심에서 멀고 밝다 · 기운 쪽으로 비켜선다", () => {
    const strong = constellation([{ side: "A", strength: 1 }], "k"), weak = constellation([{ side: "A", strength: 0.2 }], "k"), bSide = constellation([{ side: "B", strength: 1 }], "k");
    const r = (x: typeof strong) => Math.hypot(x.points[0].x, x.points[0].y);
    expect(r(strong)).toBeGreaterThan(r(weak));
    expect(strong.points[0].brightness).toBeGreaterThan(weak.points[0].brightness);
    // 12시(면 0): A쪽은 반시계(왼쪽, x<0), B쪽은 시계(오른쪽, x>0)
    expect(strong.points[0].x).toBeLessThan(bSide.points[0].x);
  });
  it("남이 본 별자리: 같은 함수 · 같은 흔들림 씨앗, 친구 답이 없는 면은 별이 없다", () => {
    const self = randomSelf(seededRandom(5));
    expect(friendConstellation([], self).points).toHaveLength(0);
    const sessions: FriendSession[] = [{ id: "a", closeness: 2, answers: MIRROR_ITEMS.filter(i => i.facet === "soc" || i.facet === "emo").map(i => ({ itemId: i.id, choice: self[i.id] })) }];
    const fc = friendConstellation(sessions, self), sc = selfConstellation(self);
    expect(fc.points.map(p => p.facet)).toEqual(["soc", "emo"]);
    expect(fc.seed).toBe(sc.seed);
    // 친구가 주인과 똑같이 답한 면은 주인 별과 같은 쪽 · 같은 강도
    expect(fc.points[0].side).toBe(sc.points[0].side);
    expect(fc.points[0].strength).toBeCloseTo(sc.points[0].strength, 10);
  });
});
