import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MIRROR_FACETS, MIRROR_FACET_IDS, MIRROR_ITEMS } from "../../../src/data/mirror/items";
import { fillName, friendSentence } from "../../../src/lib/mirror/text";
import { optionOrder, pickBundle, selfQuizOrder } from "../../../src/lib/mirror/order";

const NAMES = ["민지", "민수", "서연", "하은", "지훈"];

describe("문항 데이터", () => {
  it("12면 × 5문항 = 60, id 고정(면-번호) · 버전 1", () => {
    expect(MIRROR_FACETS.map(f => f.id)).toEqual([...MIRROR_FACET_IDS]);
    expect(MIRROR_ITEMS).toHaveLength(60);
    expect(new Set(MIRROR_ITEMS.map(i => i.id)).size).toBe(60);
    for (const f of MIRROR_FACET_IDS) expect(MIRROR_ITEMS.filter(i => i.facet === f).map(i => i.id)).toEqual([1, 2, 3, 4, 5].map(n => `${f}-${n}`));
    expect(MIRROR_ITEMS.every(i => i.version === 1)).toBe(true);
  });
  it("자가용 문장은 SPEC 「60문항 초안」 표와 글자 하나까지 같다", () => {
    const spec = readFileSync(join(process.cwd(), "docs/mirror/SPEC.md"), "utf8");
    const section = spec.slice(spec.indexOf("## 60문항 초안"), spec.indexOf("## 별자리 모양"));
    const rows = section.split("\n").filter(l => /^\| \d+ \| /.test(l)).map(l => l.split("|").slice(1, -1).map(c => c.trim()));
    expect(rows).toHaveLength(60);
    rows.forEach(([n, facetName, situation, a, b], k) => {
      const item = MIRROR_ITEMS[k];
      expect(Number(n)).toBe(k + 1);
      expect(MIRROR_FACETS.find(f => f.id === item.facet)!.name).toBe(facetName);
      expect(item.self).toEqual({ situation, a, b });
    });
  });
  it("친구용 문장: 모든 문항에 주인 이름이 들어가고 자리표가 남지 않는다", () => {
    for (const item of MIRROR_ITEMS) {
      expect(`${item.friend.situation} ${item.friend.a} ${item.friend.b}`).toContain("{이름");
      for (const name of NAMES) {
        const s = friendSentence(item, name), all = `${s.situation} ${s.a} ${s.b}`;
        expect(all).toContain(name);
        expect(all).not.toMatch(/[{}]/);
      }
    }
  });
  it("친구용 문장에는 1인칭(나 · 내)이 남지 않는다", () => {
    // 남이 한 말을 그대로 옮긴 따옴표 안(예: "그건 내가 할게")은 뺀다.
    for (const item of MIRROR_ITEMS) expect(`${item.friend.situation} ${item.friend.a} ${item.friend.b}`.replace(/"[^"]*"/g, ""), item.id).not.toMatch(/(^|\s)(내가|내|나의|나도|나를|나한테)\s|^나는\s/);
  });
});

describe("이름 조사(받침)", () => {
  it("은/는 · 이/가 · 을/를 · 와/과 · 의", () => {
    const t = "{이름:은는}|{이름:이가}|{이름:을를}|{이름:과와}|{이름:의}|{이름}";
    expect(NAMES.map(n => fillName(t, n))).toEqual([
      "민지는|민지가|민지를|민지와|민지의|민지",
      "민수는|민수가|민수를|민수와|민수의|민수",
      "서연은|서연이|서연을|서연과|서연의|서연",
      "하은은|하은이|하은을|하은과|하은의|하은",
      "지훈은|지훈이|지훈을|지훈과|지훈의|지훈",
    ]);
  });
  it("문장 예: 감정 형용사는 친구 시점", () => {
    expect(friendSentence(MIRROR_ITEMS[0], "서연")).toEqual({ situation: "서연은 주말에 약속이 하나도 없으면", a: "누구 만날 사람 없나 찾아본다", b: "혼자 쉴 수 있어서 반가워한다" });
    expect(friendSentence(MIRROR_ITEMS.find(i => i.id === "dist-5")!, "민지").situation).toBe("가까운 사람이 민지의 고민에 같이 나서 주면");
  });
});

describe("순서", () => {
  it("자가 60문항: 12개씩 다섯 바퀴, 바퀴마다 면 1개씩, 같은 사람은 늘 같은 순서", () => {
    const order = selfQuizOrder("user-1");
    expect(new Set(order.map(i => i.id)).size).toBe(60);
    for (let r = 0; r < 5; r++) expect(new Set(order.slice(r * 12, r * 12 + 12).map(i => i.facet)).size).toBe(12);
    expect(selfQuizOrder("user-1").map(i => i.id)).toEqual(order.map(i => i.id));
    expect(selfQuizOrder("user-2").map(i => i.id)).not.toEqual(order.map(i => i.id));
  });
  it("A·B 화면 순서: 문항마다 섞이고 같은 사람은 늘 같다", () => {
    const flips = MIRROR_ITEMS.filter(i => optionOrder("user-1", i.id)[0] === 1).length;
    expect(flips).toBeGreaterThan(15);
    expect(flips).toBeLessThan(45);
    expect(MIRROR_ITEMS.map(i => optionOrder("user-1", i.id))).toEqual(MIRROR_ITEMS.map(i => optionOrder("user-1", i.id)));
    expect(MIRROR_ITEMS.map(i => optionOrder("user-1", i.id).join())).not.toEqual(MIRROR_ITEMS.map(i => optionOrder("user-9", i.id).join()));
  });
});

describe("친구 묶음 고르기", () => {
  it("면마다 1문항(친구 12 · 아는 사이 10, 확인 · 거리 없음)", () => {
    const b2 = pickBundle({ closeness: 2, asked: new Set(), ownerCounts: new Map(), seed: "s" });
    expect(b2).toHaveLength(12);
    expect(new Set(b2.map(i => i.facet)).size).toBe(12);
    const b1 = pickBundle({ closeness: 1, asked: new Set(), ownerCounts: new Map(), seed: "s" });
    expect(b1).toHaveLength(10);
    expect(b1.some(i => i.facet === "check" || i.facet === "dist")).toBe(false);
  });
  it("그 주인에게 답이 가장 적게 쌓인 문항부터", () => {
    const counts = new Map(MIRROR_ITEMS.map(i => [i.id, i.id.endsWith("-4") ? 0 : 3]));
    const b = pickBundle({ closeness: 3, asked: new Set(), ownerCounts: counts, seed: "s" });
    expect(b.every(i => i.id.endsWith("-4"))).toBe(true);
  });
  it("같은 친구에게 같은 문항은 두 번 내지 않는다: 친구 5묶음 = 60, 아는 사이 5묶음 = 50, 그 뒤는 빈 묶음", () => {
    for (const [closeness, total] of [[2, 60], [1, 50]] as const) {
      const asked = new Set<string>();
      for (let k = 0; k < 5; k++) for (const item of pickBundle({ closeness, asked, ownerCounts: new Map(), seed: "f" })) { expect(asked.has(item.id)).toBe(false); asked.add(item.id); }
      expect(asked.size).toBe(total);
      expect(pickBundle({ closeness, asked, ownerCounts: new Map(), seed: "f" })).toHaveLength(0);
    }
  });
});
