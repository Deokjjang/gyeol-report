/**
 * AM2-11 1부 시험(호출 0): P11 재료 고침 — 바람 달 영역별 · 고리 자리 = 첫 핵심 관계 자리 · 재료 지시어 → 이름 · 십이운성 · 신살 종류 이름 ·
 * Fusion 짝(결정 2) · 책 전체 성향 반대 정리 · 엔진 주장 대조 셋(자리 · 달 × 영역 방향 · 흐름 세기).
 */
import { describe, expect, it } from "vitest";
import { intakeOf } from "../../../tools/annual-major/am2-brief";
import { payloadFor } from "../../../tools/annual-major/am2-6-books";
import { cardEngineIssues, type BlockCtx } from "@/lib/writer/chunked/check";
import { deicticsIn, nameDeictics } from "@/lib/writer/chunked/names";
import { am211Flags } from "@/lib/writer/chunked/claims";
import { pairLog } from "@/lib/writer/chunked/intake";
import type { FinalChapter } from "@/lib/writer/safety";

const BOOKS = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1"] as const;
const books = Object.fromEntries(BOOKS.map(id => [id, intakeOf(payloadFor(id))])) as Record<(typeof BOOKS)[number], ReturnType<typeof intakeOf>>;
const ctx = (id: (typeof BOOKS)[number]): BlockCtx => ({ intake: books[id].intake, brief: books[id].brief, ...(books[id].brief.mbti ? { mbtiType: books[id].brief.mbti!.type } : {}) });
const ch = (n: number, heading: string, paragraphs: string[], keys?: string[]): FinalChapter => ({ n, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading, paragraphs }], ...(keys ? { keys } : {}) });
const rules = (id: (typeof BOOKS)[number], c: FinalChapter) => am211Flags([c], ctx(id)).map(f => f.rule);

describe("AM2-11 1부 재료 고침", () => {
  it("바람 달은 영역마다 — 그 영역 칩 달 전부(annual-1: 일 8 · 9 · 12월, 연애 2 · 7 · 8 · 9 · 10 · 11월, 사람 2 · 12월)", () => {
    const { intake, brief } = books["annual-1"];
    const v = (name: string) => intake.lines.find(l => l.value === name)?.meaning;
    expect(v("바람의 일 쪽이 오르는 달")).toBe("8월 · 무신월, 9월 · 기유월, 12월 · 임자월");
    // 3부 측정 중 고침: 앞 세 달만 자르지 않는다 — 연애 칩 오름 달 전부.
    expect(v("바람의 연애 쪽이 오르는 달")).toBe("2월 · 임인월, 7월 · 정미월, 8월 · 무신월, 9월 · 기유월, 10월 · 경술월, 11월 · 신해월");
    expect(v("바람의 연애 쪽 속도를 늦출 달")).toBe("3월 · 계묘월, 6월 · 병오월, 12월 · 임자월, 2028년 1월 · 계축월");
    expect(v("바람의 사람 쪽이 오르는 달")).toBe("2월 · 임인월, 12월 · 임자월");
    expect(intake.lines.some(l => /그 바람과 이어지는 영역이 오르는 달|^바람과 이어지는 영역이 오르는 달/.test(l.value))).toBe(false);
    for (const id of BOOKS) expect(cardEngineIssues(books[id].intake, books[id].brief).filter(i => i.rule === "wish_chip")).toEqual([]);
    void brief;
  });
  it("고리 자리 = 첫 핵심 관계 자리 · 재료 지시어 0", () => {
    for (const id of BOOKS) expect(cardEngineIssues(books[id].intake, books[id].brief).filter(i => i.rule === "link_seat" || i.rule === "deictic")).toEqual([]);
    const p6a = books["annual-p6a"].intake.chapters.flatMap(c => c.keys ?? []).find(k => k.key === "2027-M12")!;
    const seat = (p6a.links ?? []).find(l => l.kind === "seat")!;
    expect(seat.text).toMatch(/앞: 9월 · 기유월 태어난 날 자리의 지지형\(다듬음\) · 2028년 1월 · 계축월 태어난 날 자리의 〔금국 반합/);
    expect(deicticsIn(seat.text)).toEqual([]);
    const w = books["annual-1"].intake.chapters.flatMap(c => c.keys ?? []).find(k => k.wishLink)!;
    expect(w.wishLink).toMatch(/2027년 정미년 한 해에도 태어난 날 자리에 오미합/);
  });
  it("지시어 → 이름(조사는 이름 받침에 맞춤) · 장소 관용은 그대로", () => {
    const c = { year: "2027년", dayun: "계축 대운" };
    expect(nameDeictics("이 대운은 2032년 4월 무렵까지", c)).toBe("계축 대운은 2032년 4월 무렵까지");
    expect(nameDeictics("명리와 MBTI로 보면 이 해를 어떻게 겪을까?", c)).toBe("명리와 MBTI로 보면 2027년을 어떻게 겪을까?");
    expect(nameDeictics("그 해가 속한 대운", c)).toBe("2027년이 속한 대운");
    expect(nameDeictics("태어난 날 땅 글자 오와 육합 · 살릴 점: 그 자리의 사람·일과 붙고", c)).toBe("태어난 날 땅 글자 오와 육합 · 살릴 점: 태어난 날 자리의 사람·일과 붙고");
    expect(nameDeictics("상대가 고민하면 그 자리에서 예약까지 끝내 둡니다.", c)).toBe("상대가 고민하면 그 자리에서 예약까지 끝내 둡니다.");
    expect(nameDeictics("이 자리의 색깔과 소리를 그대로 받아들입니다.", c, undefined, { mbti: true })).toBe("눈앞의 색깔과 소리를 그대로 받아들입니다.");
    expect(deicticsIn("마음이 달아오르기 쉬운 해 · 습관이 자리 잡기 쉬운 달 · 이번 묶음")).toEqual([]);
  });
  it("십이운성 · 신살 줄 이름에는 종류를 붙인다", () => {
    const vs = books["annual-1"].intake.lines.map(l => l.value);
    // AM2-12 1부 3: annual-1의 사(死) · 쇠(衰) 줄은 뜻 문장이 정리로 다 빠져 카드에서 빠진다(숙제 조각 · 이름만 남기지 않음) — 남는 운성 · 신살 줄은 종류 이름이 붙는다.
    expect(vs).toContain("태어난 날 자리의 신살 홍염살");
    expect(vs.filter(v => /자리의 (?:십이운성 )?(?:장생|목욕|관대|건록|제왕|쇠|병|사|묘|절|태|양)(?:\(|$)/.test(v)).every(v => /자리의 십이운성 /.test(v))).toBe(true);
    expect(vs.some(v => /십이운성 (?:사|쇠)/.test(v))).toBe(false);
  });
  it("짝은 Fusion DB 규칙만(결정 2) — 계산 짝은 빼고, 짝 없는 MBTI 절의 원국 줄은 그 절에서 뺀다", () => {
    const p6b = books["annual-p6b"].intake;
    expect(p6b.pairs.some(p => p.fusionId === "fusion:tenGod:比肩:ISTJ")).toBe(true);
    intakeOf(payloadFor("annual-p6b"));
    expect(pairLog.last?.removedComputed).toEqual(expect.arrayContaining(["화개(華蓋):mbtiLink"]));
    const subj = new Map(p6b.lines.map(l => [l.id, l.subject] as const));
    const love3 = p6b.chapters.find(c => c.id === "love")!.sections!.find(s => /지킬 한 가지/.test(s.q))!;
    expect(love3.lines.every(id => subj.get(id) === "mbti")).toBe(true);
    // Fusion 규칙 대상이 유형 글자(「E」)여도 그 사람 규칙이다(annual-p5 도화살 × E).
    const p5 = books["annual-p5"].intake, p5love = p5.chapters.find(c => c.id === "love")!.sections!.find(s => /지킬 한 가지/.test(s.q))!;
    expect(p5.pairs.some(p => p.myeongri === p5love.lines.find(id => p5.lines.find(l => l.id === id)?.subject === "natal"))).toBe(true);
  });
  it("책 전체 성향 반대 정리 — 범위를 넘는 반대 쌍(annual-1 Y20 「꼭 필요한 지출까지 미루기」 ↔ Fusion 「계산보다 송금이 먼저」)", () => {
    const a1 = books["annual-1"].intake;
    const used = a1.lines.filter(l => a1.chapters.some(c => [...(c.sections ?? []).flatMap(s => s.lines), ...(c.keys ?? []).flatMap(k => k.lines)].includes(l.id)));
    expect(used.some(l => /꼭 필요한 지출까지 미루기/.test(l.value))).toBe(false);
    expect(a1.lines.some(l => /끝맺음이 깔끔합니다/.test(l.meaning))).toBe(false);
  });
});

describe("AM2-11 1부 6 엔진 주장 대조 셋 — 걸려야 할 원문(P9 · P10) · 통과해야 할 원문", () => {
  it("seat_ref: P10 annual-p6a 2028년 1월 「…같은 자리에 있었지만」 걸림 / P9 annual-p6b 「같은 자리의 앞 달인 11월 · 신해월은 …」 통과", () => {
    expect(rules("annual-p6a", ch(7, "2027-M12", ["태어난 시각 자리에서 축미충이 일어나 부딪쳐 바꿀 계기가 생깁니다. 9월 · 기유월에는 지지형이 같은 자리에 있었지만, 이번에는 금국 반합이 놓여 한 기운으로 모이는 힘으로 바뀌어요."], ["2027-M12"]))).toContain("seat_ref");
    expect(rules("annual-p6b", ch(7, "2027-M12", ["같은 자리의 앞 달인 11월 · 신해월은 목국이 모이는 달이었는데, 이번에는 축미충이 닫혀 있던 창고를 여는 부딪침으로 와요. 기혼인 당신에게는 가까운 사이에서 살필 쪽이에요."], ["2027-M12"]))).not.toContain("seat_ref");
  });
  it("month_dir: P10 annual-1 「일과 연애, 사람 쪽 소망이 이 세 달에 모이기 쉬워요」 걸림 / 「돈이 오르는 달은 …」 통과", () => {
    expect(rules("annual-1", ch(1, "적어 준 바람은 이 해와 어떻게 만날까?", ["이 바람과 이어지는 영역이 오르는 달은 2월 · 임인월, 7월 · 정미월, 10월 · 경술월입니다. 일과 연애, 사람 쪽 소망이 이 세 달에 모이기 쉬워요."]))).toContain("month_dir");
    expect(rules("annual-1", ch(3, "2027년 돈은 어디서 들어올까?", ["돈이 오르는 달은 1월 · 신축월, 7월 · 정미월, 8월 · 무신월, 9월 · 기유월, 10월 · 경술월, 2028년 1월 · 계축월입니다."]))).not.toContain("month_dir");
  });
  it("flow_claim: P9 annual-p6b 11월 「이 달의 기운이 한결 순하게 옵니다」(흐름 5) 걸림 / P10 annual-p6a 「흐름이 가장 잔잔한 달은 10월 · 경술월과 11월 · 신해월」 통과", () => {
    expect(rules("annual-p6b", ch(7, "2027-M10", ["일과 관계가 모두 자리 잡은 사람에게는 이 달의 기운이 한결 순하게 옵니다."], ["2027-M10"]))).toContain("flow_claim");
    expect(rules("annual-p6a", ch(6, "쉬어 가야 할 달과 쉬는 법은?", ["흐름이 가장 잔잔한 달은 10월 · 경술월과 11월 · 신해월이에요."]))).not.toContain("flow_claim");
  });
});

describe("AM2-11 3부 측정 중 고침 — P11 판독이 찾은 엔진 값 틀림(걸림) · 맞는 원문(통과)", () => {
  it("seat_ref 되짚기: P11 annual-1 10월 「태어난 날 자리에서 화국이 모입니다. … 같은 자리에 진술충도 겹쳐」(진술충은 달·시각) 걸림", () => {
    const p = "태어난 날 자리에서 화국이 모입니다. 표현과 열정이 크게 모이는 힘이라, 가까운 사람 쪽 마음이 한곳으로 쏠리기 쉬워요. 솔로인 당신에게는 마음 가는 사람이 생기면 속도가 붙는 쪽으로 읽힙니다. 같은 자리에 진술충도 겹쳐, 고집과 고집이 부딪쳐 바꿀 계기가 생기기도 합니다.";
    expect(rules("annual-1", ch(7, "2027-M09", [p], ["2027-M09"]))).toContain("seat_ref");
    expect(rules("annual-1", ch(7, "2027-M09", [p.replace("같은 자리에 진술충도", "태어난 달·태어난 시각 자리에는 진술충도")], ["2027-M09"]))).not.toContain("seat_ref");
  });
  it("prev_month: P11 annual-p5 8월 「앞 달 자오충이 부딪침이었다면」(자오충은 6월) 걸림 / 6월 「앞 달 을경합이 맺힘이었다면」 통과", () => {
    expect(rules("annual-p5", ch(7, "2027-M07", ["앞 달 자오충이 부딪침이었다면, 이번에는 같은 자리에서 흩어진 생각이 모이는 차이가 있습니다."], ["2027-M07"]))).toContain("prev_month");
    expect(rules("annual-p5", ch(7, "2027-M05", ["앞 달 을경합이 맺힘이었다면, 이번에는 같은 자리에서 부딪침이 나오는 차이가 있어요."], ["2027-M05"]))).not.toContain("prev_month");
  });
  it("list_full: P11 annual-1 「연애 쪽이 오르는 달은 2 · 7 · 8월」 걸림 / 전부 · 「부터 … 까지」 통과", () => {
    expect(rules("annual-1", ch(1, "적어 준 바람은 2027년과 어떻게 만날까?", ["연애 쪽이 오르는 달은 2월 · 임인월, 7월 · 정미월, 8월 · 무신월이에요."]))).toContain("list_full");
    expect(rules("annual-1", ch(1, "적어 준 바람은 2027년과 어떻게 만날까?", ["연애 쪽이 오르는 달은 2월 · 임인월, 7월 · 정미월, 8월 · 무신월, 9월 · 기유월, 10월 · 경술월, 11월 · 신해월이에요."]))).not.toContain("list_full");
    expect(rules("annual-1", ch(1, "적어 준 바람은 2027년과 어떻게 만날까?", ["연애 쪽이 오르는 달은 2월 · 임인월과 7월 · 정미월부터 11월 · 신해월까지예요."]))).not.toContain("list_full");
  });
  it("바람 달 줄이 칩 달을 빼먹으면 카드 검사(wish_chip)가 잡는다 — 지금 카드 0", () => {
    for (const id of BOOKS) expect(cardEngineIssues(books[id].intake, books[id].brief).filter(i => i.rule === "wish_chip")).toEqual([]);
  });
});
