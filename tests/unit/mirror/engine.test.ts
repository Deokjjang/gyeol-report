import { describe, expect, it } from "vitest";
import { MIRROR_FACET_IDS, MIRROR_ITEMS, type FacetId } from "../../../src/data/mirror/items";
import {
  answerKey, attachmentOf, completeness, facetMatchRates, friendAnswerCount, friendAttachment, friendFacets, friendRank, friendType, growthStage, isGolden,
  knowRate, mean, openItemCount, selfAttachment, selfComplete, selfFacets, selfType, syncPercent, syncRate, toPercent, typeFromSides,
  type Choice, type FriendAnswer, type FriendSession, type SelfAnswers,
} from "../../../src/lib/mirror/engine";

const ids = (facet: FacetId) => MIRROR_ITEMS.filter(i => i.facet === facet).map(i => i.id);
/** 면마다 A쪽 개수를 정한 자가 답(앞에서부터 A). */
function selfWith(aCounts: Partial<Record<FacetId, number>>, fallback = 3): SelfAnswers {
  const out: Record<string, Choice> = {};
  for (const facet of MIRROR_FACET_IDS) ids(facet).forEach((id, k) => { out[id] = k < (aCounts[facet] ?? fallback) ? 0 : 1; });
  return out;
}
const session = (id: string, answers: FriendAnswer[], closeness: 1 | 2 | 3 = 2, ownerDevice = false): FriendSession => ({ id, closeness, ownerDevice, answers });

describe("내 점수(면별 A쪽 수 · 기운 쪽 · 강도)", () => {
  it("A 0~5개 → 기운 쪽은 3 이상 A, 강도는 2·3 약함 · 1·4 보통 · 0·5 뚜렷함", () => {
    const f = selfFacets(selfWith({ soc: 0, lead: 1, emp: 2, trust: 3, plan: 4, drive: 5 }));
    expect(f.slice(0, 6).map(x => [x!.aCount, x!.side, x!.strength])).toEqual([[0, "B", 3], [1, "B", 2], [2, "B", 1], [3, "A", 1], [4, "A", 2], [5, "A", 3]]);
  });
  it("5문항을 다 답하지 않은 면은 null, 60문항이 다 있어야 완료", () => {
    const self = { ...selfWith({}) } as Record<string, Choice>;
    delete self["soc-3"];
    expect(selfFacets(self)[0]).toBeNull();
    expect(selfComplete(self)).toBe(false);
    expect(selfComplete(selfWith({}))).toBe(true);
  });
});

describe("친구 점수 · 주인 기기 답 제외", () => {
  it("면별 A 비율: 건너뜀과 주인 기기 세션은 빠진다", () => {
    const f = friendFacets([
      session("s1", [{ itemId: "soc-1", choice: 0 }, { itemId: "soc-2", choice: 1 }]),
      session("s2", [{ itemId: "soc-1", choice: 0 }, { itemId: "soc-3", choice: "skip" }]),
      session("me", [{ itemId: "soc-1", choice: 1 }, { itemId: "lead-1", choice: 1 }], 3, true),
    ]);
    expect(f[0]).toEqual({ facet: "soc", a: 2, n: 3, ratio: 2 / 3 });
    expect(f[1]).toBeNull();
  });
});

describe("싱크로율", () => {
  it("손계산: 사교 (2/3 + 1)/2 = 0.8333, 주도 0 → 평균 0.4167 → 42%", () => {
    const self = selfWith({ soc: 1, lead: 5 }); // soc-1 A, soc-2 B / lead-1 A
    const sessions = [
      session("a", [{ itemId: "soc-1", choice: 0 }, { itemId: "soc-2", choice: 1 }, { itemId: "lead-1", choice: 1 }]),
      session("b", [{ itemId: "soc-1", choice: 0 }]),
      session("c", [{ itemId: "soc-1", choice: 1 }, { itemId: "soc-4", choice: "skip" }]),
    ];
    const rates = facetMatchRates(self, sessions);
    expect(rates[0]).toBeCloseTo(5 / 6, 10);
    expect(rates[1]).toBe(0);
    expect(rates.slice(2).every(r => r === null)).toBe(true);
    expect(syncRate(self, sessions)).toBeCloseTo(5 / 12, 10);
    expect(syncPercent(self, sessions)).toBe(42);
  });
  it("평균 함수: 면별 일치율 83·78·82·35·77·88·33·81·71·78 → 70.6 → 표시 71%", () => {
    const rates = [83, 78, 82, 35, 77, 88, 33, 81, 71, 78];
    expect(mean(rates)).toBeCloseTo(70.6, 10);
    // 실제 경로: 10면의 첫 문항에 친구 100명씩, 일치 수 = 위 숫자(확인 · 거리 면은 친구 답 없음 → 평균에서 빠짐).
    const self = selfWith({}, 5); // 전부 A
    const facets = MIRROR_FACET_IDS.slice(0, 10);
    const sessions = Array.from({ length: 100 }, (_, k) => session(`f${k}`, facets.map((facet, i) => ({ itemId: `${facet}-1`, choice: (k < rates[i] ? 0 : 1) as Choice }))));
    expect(facetMatchRates(self, sessions).map(r => r === null ? null : Math.round(r * 100))).toEqual([...rates, null, null]);
    expect(syncRate(self, sessions)! * 100).toBeCloseTo(70.6, 10);
    expect(syncPercent(self, sessions)).toBe(71);
  });
  it("친구 답 전에는 null(화면 ?%)", () => {
    expect(syncRate(selfWith({}), [])).toBeNull();
    expect(syncPercent(selfWith({}), [session("me", [{ itemId: "soc-1", choice: 0 }], 2, true)])).toBeNull();
    expect(toPercent(null)).toBeNull();
  });
});

describe("완성도", () => {
  it("친구 답 수 ÷ 60(건너뜀 · 주인 기기 제외), 최대 100%", () => {
    const answers = (n: number, skip = 0): FriendAnswer[] => [...MIRROR_ITEMS.slice(0, n).map(i => ({ itemId: i.id, choice: 0 as Choice })), ...MIRROR_ITEMS.slice(n, n + skip).map(i => ({ itemId: i.id, choice: "skip" as const }))];
    expect(completeness([session("a", answers(12, 3)), session("b", answers(18))])).toEqual({ answers: 30, ratio: 0.5, percent: 50, reportReady: false });
    expect(completeness([session("a", answers(40)), session("b", answers(25)), session("me", answers(60), 3, true)])).toEqual({ answers: 65, ratio: 1, percent: 100, reportReady: true });
    expect(friendAnswerCount([session("a", answers(60))])).toBe(60);
  });
});

describe("아는 정도 % · 순위", () => {
  const self = selfWith({}, 5); // 전부 A
  const pick = (matched: number, total: number, id: string, ownerDevice = false) => session(id, MIRROR_ITEMS.slice(0, total).map((it, k) => ({ itemId: it.id, choice: (k < matched ? 0 : 1) as Choice })), 2, ownerDevice);
  it("그 친구 답(건너뜀 제외) 중 주인 답과 같은 비율", () => {
    const s = session("x", [{ itemId: "soc-1", choice: 0 }, { itemId: "soc-2", choice: 0 }, { itemId: "soc-3", choice: 0 }, { itemId: "soc-4", choice: 0 }, { itemId: "soc-5", choice: 1 }, { itemId: "lead-1", choice: "skip" }]);
    expect(knowRate(s, self)).toEqual({ matched: 4, answered: 5, percent: 80 });
    expect(knowRate(session("y", [{ itemId: "soc-1", choice: "skip" }]), self)).toBeNull();
  });
  it("답한 친구 3명 이상일 때만, 같은 %는 같은 등수, 주인 기기는 세지 않는다", () => {
    const two = [pick(8, 10, "a"), pick(6, 10, "b"), pick(10, 10, "me", true)];
    expect(friendRank(two, self, "a")).toBeNull();
    const four = [pick(8, 10, "a"), pick(6, 10, "b"), pick(4, 5, "c"), pick(4, 10, "d"), pick(10, 10, "me", true)];
    expect(["a", "b", "c", "d"].map(id => friendRank(four, self, id))).toEqual([{ rank: 1, total: 4 }, { rank: 3, total: 4 }, { rank: 1, total: 4 }, { rank: 4, total: 4 }]);
    expect(friendRank(four, self, "me")).toBeNull();
  });
});

describe("애착 경향(확인 × 거리)", () => {
  it("SPEC 4칸 표 그대로", () => {
    const s = (side: "A" | "B", strength: 1 | 2 | 3 = 3) => ({ side, strength });
    expect(attachmentOf(s("B"), s("A")).label).toBe("안정형");   // 믿고 기다림 × 가까이 기댐
    expect(attachmentOf(s("B"), s("B")).label).toBe("회피형");   // 믿고 기다림 × 혼자 해결
    expect(attachmentOf(s("A"), s("A")).label).toBe("불안형");   // 자주 확인 × 가까이 기댐
    expect(attachmentOf(s("A"), s("B")).label).toBe("불안-회피형");
  });
  it("두 면 모두 약하면 ~에 가까움, 하나라도 약하지 않으면 아님", () => {
    expect(selfAttachment(selfWith({ check: 2, dist: 3 }))).toEqual({ type: "secure", label: "안정형", near: true });
    expect(selfAttachment(selfWith({ check: 2, dist: 5 }))).toEqual({ type: "secure", label: "안정형", near: false });
  });
  it("친구가 본 애착: 아는 사이 답은 쓰지 않고, 반반이면 주인 쪽", () => {
    const self = selfWith({ check: 4, dist: 1 }); // 불안-회피형
    const f = friendAttachment([
      session("a", [{ itemId: "check-1", choice: 1 }, { itemId: "dist-1", choice: 0 }], 3),
      session("b", [{ itemId: "check-2", choice: 0 }, { itemId: "dist-2", choice: 0 }], 2),
      session("c", [{ itemId: "check-3", choice: 1 }, { itemId: "dist-3", choice: 1 }], 1),
    ], self);
    // 확인: A 1 · B 1 → 반반 → 주인 쪽 A(자주 확인), 거리: A 2 → 가까이 기댐 → 불안형, 확인 강도 약함 · 거리 뚜렷함
    expect(f).toEqual({ type: "anxious", label: "불안형", near: false });
  });
});

describe("유형 16가지", () => {
  it("SPEC 예: 사람 속 · 상상 · 해결부터 · 흐름 따라 = 기발한 모험가", () => {
    expect(typeFromSides({ soc: "A", imag: "A", emp: "B", plan: "B" })).toEqual({ key: "AABB", title: "기발한 모험가", line: "사람 속에서 힘을 얻고, 상상과 감성으로 세상을 보고, 해결부터 찾고, 흐름을 타며 나아가는 사람" });
    expect(typeFromSides({ soc: "B", imag: "B", emp: "A", plan: "A" }).title).toBe("다정한 장인");
    expect(typeFromSides({ soc: "A", imag: "B", emp: "A", plan: "B" }).title).toBe("자유로운 해결사");
    expect(typeFromSides({ soc: "B", imag: "A", emp: "B", plan: "A" }).title).toBe("단단한 몽상가");
    const all = new Set<string>();
    for (const soc of ["A", "B"] as const) for (const imag of ["A", "B"] as const) for (const emp of ["A", "B"] as const) for (const plan of ["A", "B"] as const) all.add(typeFromSides({ soc, imag, emp, plan }).title);
    expect(all.size).toBe(16);
  });
  it("내 유형은 자가 답, 친구 유형은 친구 비율(정확히 반반이면 주인 쪽, 네 면 다 있어야 함)", () => {
    const self = selfWith({ soc: 4, imag: 1, emp: 5, plan: 0 });
    expect(selfType(self)?.title).toBe("자유로운 해결사");
    const sessions = [
      session("a", [{ itemId: "soc-1", choice: 1 }, { itemId: "imag-1", choice: 0 }, { itemId: "emp-1", choice: 1 }, { itemId: "plan-1", choice: 0 }]),
      session("b", [{ itemId: "soc-2", choice: 0 }, { itemId: "imag-2", choice: 0 }, { itemId: "emp-2", choice: 1 }, { itemId: "plan-2", choice: 0 }]),
    ];
    // 사교 반반 → 주인 A, 상상 A, 공감 B, 계획 A → 단단한 모험가
    expect(friendType(sessions, self)?.title).toBe("단단한 모험가");
    expect(friendType([sessions[0]].map(s => ({ ...s, answers: s.answers.slice(0, 3) })), self)).toBeNull();
  });
});

describe("성장 단계 · 황금별", () => {
  it("답한 친구 수 0 · 1 · 3 · 5 · 15 · 40 · 100", () => {
    expect([0, 1, 2, 3, 4, 5, 14, 15, 39, 40, 99, 100, 500].map(growthStage)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  });
  it("열린 문항을 끝까지 + 건너뛰기 5개 이하(친구 · 가까운 사이 60, 아는 사이 50)", () => {
    expect([openItemCount(1), openItemCount(2), openItemCount(3)]).toEqual([50, 60, 60]);
    const run = (closeness: 1 | 2 | 3, skips: number, drop = 0) => {
      const open = MIRROR_ITEMS.filter(i => closeness !== 1 || (i.facet !== "check" && i.facet !== "dist")).slice(drop);
      return isGolden({ closeness, answers: open.map((i, k) => ({ itemId: i.id, choice: k < skips ? "skip" as const : 0 as Choice })) });
    };
    expect(run(2, 5)).toBe(true);
    expect(run(3, 6)).toBe(false);
    expect(run(2, 0, 1)).toBe(false);
    expect(run(1, 5)).toBe(true);
    expect(run(1, 0, 1)).toBe(false);
  });
});

describe("답 문자열", () => {
  it("문항 정의 순서의 A · B · -", () => {
    const key = answerKey({ "soc-1": 0, "soc-2": 1 });
    expect(key).toHaveLength(60);
    expect(key.slice(0, 3)).toBe("AB-");
  });
});
