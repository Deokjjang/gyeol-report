// W5 R2 수리 재설계(외부 호출 0, 합성 문장만): 규칙별 처리(다시 쓰기·문장 떼기·기록만) · 칸 순서 · 떼기 이음 확인 · 접속어 · 늘린 수리 답 거절 · 수리 뒤 정리(F1) · 칸 초과 HARD 문단.
import { describe, expect, it } from "vitest";
import { applyRepair3, repairItems, REPAIR3_MAX_ITEMS } from "@/lib/writer/repair3";
import { dropOverflowParagraphs, dropSentences, modeOf, postRepairTidy, priorityOf, reviewModeOf, stripConnectiveFlags, wordOverlap } from "@/lib/writer/repairPlan";
import { HINT, type LintFlag } from "@/lib/writer/safety/p6c";

const ch = (n: number, sections: string[][]) => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer" as const, chars: 0, sections: sections.map((ps, i) => ({ heading: `소제목 ${i}`, paragraphs: ps })) });
const flag = (rule: string, sentence: string, at: [number, number, number] = [1, 0, 0]): LintFlag => ({ chapter: at[0], section: at[1], paragraph: at[2], rule: rule as never, sentence, hint: HINT[rule as never] ?? "" });

describe("R2 규칙별 처리(R0 표)", () => {
  it("다시 쓰기 = 사실 HARD·grade_leak·guide_copy·근거 없는 장면·용어 풀이 / 떼기 = safety·rule_leak·negative_claim·fact_mark·물음 초과·재탕 / 기록만 = 문구 복사·접속어", () => {
    for (const r of ["fact_relation", "fact_term", "count_mismatch", "common_split", "pillar_claim", "grade_leak", "guide_copy", "scene_unbacked", "term_unexplained", "presumed_partner"]) expect(modeOf(r), r).toBe("rewrite");
    for (const r of ["safety", "rule_leak", "negative_claim", "fact_mark", "question_excess", "phrase_repeat", "notice_repeat", "scene_repeat", "advice_repeat", "seed_assert"]) expect(modeOf(r), r).toBe("drop");
    for (const r of ["db_copy", "seed_copy", "persona_copy", "connective_excess"]) expect(modeOf(r), r).toBe("none");
    expect([reviewModeOf("F"), reviewModeOf("I"), reviewModeOf("R"), reviewModeOf("L"), reviewModeOf("C")]).toEqual(["none", "rewrite", "drop", "drop", "drop"]);
    expect([priorityOf("fact_relation"), priorityOf("grade_leak"), priorityOf("scene_unbacked"), priorityOf("term_unexplained")]).toEqual([0, 1, 2, 3]);
  });
  it("수리 항목: 기록만·떼기 규칙은 칸을 받지 않고, 칸 순서는 사실 HARD → 노출 → 장면 → 그 밖, 칸이 차면 남은 HARD는 overflow", () => {
    const sens = Array.from({ length: 60 }, (_, i) => `문장 ${i}번은 그냥 평범한 설명이에요.`);
    const book = [ch(1, [[sens.join(" ")]])];
    const flags = [flag("db_copy", sens[0]), flag("term_unexplained", sens[1]), flag("scene_unbacked", sens[2]), flag("grade_leak", sens[3]), flag("safety", sens[4]),
      ...sens.slice(5, 50).map(s => flag("fact_relation", s))];
    const overflow = new Set<string>();
    const items = repairItems({ chapters: book, flags, issues: [], numbered: [], overflow });
    expect(items.length).toBe(REPAIR3_MAX_ITEMS);
    expect(items.map(i => i.original)).not.toContain(sens[0]);
    expect(items.map(i => i.original)).not.toContain(sens[4]);
    expect(items[0].original).toBe(sens[5]);
    expect(items.map(i => i.original)).not.toContain(sens[1]);
    expect(overflow.size).toBeGreaterThan(0);
    expect([...overflow][0]).toBe("1.0.0|fact_relation");
  });
});

describe("R2 문장 떼기 · 접속어", () => {
  it("뗀 뒤 다음 문장 접속어를 떼고, 다음 문장이 앞말에 기대면 SOFT는 남긴다(HARD는 함께 뗀다), 앞 물음의 답이면 물음도 뗀다", () => {
    // W6.1: 번호 말(「두 번째 …」「네 번째 …」)로 시작하는 문장이 같은 장에 둘 이상이면 목록 항목이라 개선 떼기를 하지 않는다 — 이 시험의 뜻(접속어 떼기)은 번호 없는 문장으로 본다.
    const p = "첫 문장은 근거예요. 가운데 문장은 재탕이에요. 그래서 다음 문장이 이어져요. 마지막 문장도 있어요.";
    // W7 m1: 내용 반복 규칙(phrase_repeat 등)은 문단 끝 문장만 뗀다 — 접속어 떼기는 노출 규칙(rule_leak)으로 본다.
    const r = dropSentences([ch(1, [[p, "다른 문단이에요. 또 다른 문장이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "가운데 문장은 재탕이에요.", rule: "rule_leak", hard: true }]);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("첫 문장은 근거예요. 다음 문장이 이어져요. 마지막 문장도 있어요.");
    const mid = dropSentences([ch(1, [[p, "다른 문단이에요. 또 다른 문장이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "가운데 문장은 재탕이에요.", rule: "phrase_repeat", hard: false }]);
    expect(mid.chapters[0].sections[0].paragraphs[0]).toBe(p);
    expect(mid.dropped[0].kept).toBe("mid");
    const end = dropSentences([ch(1, [[p, "다른 문단이에요. 또 다른 문장이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "마지막 문장도 있어요.", rule: "phrase_repeat", hard: false }]);
    expect(end.chapters[0].sections[0].paragraphs[0]).toBe("첫 문장은 근거예요. 가운데 문장은 재탕이에요. 그래서 다음 문장이 이어져요.");
    const lean = "첫 문장이에요. 같은 말을 또 했어요. 이처럼 앞말에 기대는 문장이에요. 끝 문장이에요.";
    const soft = dropSentences([ch(1, [[lean, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "같은 말을 또 했어요.", rule: "phrase_repeat", hard: false }]);
    expect(soft.chapters[0].sections[0].paragraphs[0]).toBe(lean);
    expect(soft.dropped[0].kept).toBe("leans");
    const hard = dropSentences([ch(1, [[lean, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "같은 말을 또 했어요.", rule: "fact_mark", hard: true }]);
    expect(hard.chapters[0].sections[0].paragraphs[0]).toBe("첫 문장이에요. 끝 문장이에요.");
    // W6 S0-1: 개선 규칙(HARD여도 — 노출 rule_leak)은 떼고 난 문단이 3문장 이상일 때만 뗀다.
    const thin = dropSentences([ch(1, [[lean, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "같은 말을 또 했어요.", rule: "rule_leak", hard: true }]);
    expect(thin.chapters[0].sections[0].paragraphs[0]).toBe(lean);
    expect(thin.dropped[0].kept).toBe("thin");
    const ask = "근거 문장이에요. 이런 편이죠? 그 답이 되는 문장이에요. 마지막 문장이에요.";
    const q = dropSentences([ch(1, [[ask, "다른 문단이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "그 답이 되는 문장이에요.", rule: "fact_mark", hard: true }]);
    expect(q.chapters[0].sections[0].paragraphs[0]).toBe("근거 문장이에요. 마지막 문장이에요.");
  });
  it("「~때문입니다」로 앞말에 기대는 다음 문장(W4 2차 궁합 3장 끊김) · 핵심 문장 ⟪⟫ · 소제목에 문장 둘뿐이면 SOFT는 떼지 않는다", () => {
    const p = "둘은 통념으로 보면 보통 궁합이에요. 안정을 지키는 쪽과 새 시도를 하는 쪽이 만났기 때문입니다. 끝 문장이에요.";
    const r = dropSentences([ch(1, [[p, "다른 문단."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "둘은 통념으로 보면 보통 궁합이에요.", rule: "safety", hard: true, detail: "hour_pillar" }]);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("끝 문장이에요.");
    const key = dropSentences([ch(1, [["⟪핵심 문장이에요.⟫ 다른 문장이에요. 셋째 문장이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "핵심 문장이에요.", rule: "phrase_repeat", hard: false }]);
    expect(key.dropped[0].kept).toBe("key");
    const two = dropSentences([ch(1, [["하나예요. 둘이에요."]])], [{ chapter: 1, section: 0, paragraph: 0, sentence: "둘이에요.", rule: "question_excess", hard: false }]);
    expect(two.dropped[0].kept).toBe("only_sentence");
  });
  it("접속어 과다: 걸린 문장의 앞 접속어만 뗀다(문단 첫 문장은 그대로)", () => {
    const r = stripConnectiveFlags([ch(1, [["첫 문장이에요. 그래서 둘째 문장이에요."]])], [flag("connective_excess", "그래서 둘째 문장이에요.")]);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("첫 문장이에요. 둘째 문장이에요.");
    expect(r.count).toBe(1);
  });
});

describe("R2 늘린 수리 답 거절 · 수리 뒤 정리(F1) · 칸 초과 문단", () => {
  it("원문보다 문장이 많은 수리 답은 받지 않는다(W4 13건 — 겹침·반쪽 되돌림의 주원인)", () => {
    const book = [ch(1, [["앞 문장이에요. 겁살도 한몫해요. 뒤 문장이에요."]])];
    const items = [{ id: 1, kind: "sentence" as const, chapter: 1, section: 0, paragraph: 0, original: "겁살도 한몫해요.", problems: ["x"], source: ["lint" as const] }];
    const r = applyRepair3(book, items, new Map([[1, "겁살도 한몫해요. 이건 상대에게도 있는 기운이라 결단이 빨라요."]]));
    expect(r.applied).toEqual([]); expect(r.rejected.length).toBe(1);
    expect(r.chapters[0].sections[0].paragraphs[0]).toBe("앞 문장이에요. 겁살도 한몫해요. 뒤 문장이에요.");
    const ok = applyRepair3(book, items, new Map([[1, "겁살이 결단을 빠르게 해요."]]));
    expect(ok.applied.length).toBe(1);
  });
  it("수리 문장이 이웃과 같은 뜻이면 원문으로 · 끊긴 문장이면 원문으로 · 같은 문단 두 수리가 같은 구절이면 뒤를 원문으로 · 이웃 70% 같은 문장은 뒤를 뗀다", () => {
    const p = "편인이 식신을 누르는 도식이라 재미가 식고 의욕이 끊기는 일이 생깁니다. 그러면 재미가 식고 의욕이 끊기는 일이 생기고 손이 멈춰요. 다음 문장이에요.";
    const applied = [{ id: 1, kind: "sentence" as const, at: "1.0.0", before: "강의를 찾아 듣는 편이에요.", after: "그러면 재미가 식고 의욕이 끊기는 일이 생기고 손이 멈춰요.", source: ["lint"] }];
    const r = postRepairTidy([ch(1, [[p]])], applied);
    expect(r.records[0].rule).toBe("f1_same_meaning");
    expect(r.chapters[0].sections[0].paragraphs[0]).toContain("강의를 찾아 듣는 편이에요.");
    const broken = postRepairTidy([ch(1, [["앞 문장이에요. 고친 문장이 끝나지 않고 이어지고 다음 문장이에요."]])], [{ id: 1, kind: "sentence" as const, at: "1.0.0", before: "원래 문장이에요.", after: "고친 문장이 끝나지 않고 이어지고", source: ["lint"] }]);
    expect(broken.records.map(x => x.rule)).toContain("f1_broken");
    expect(broken.chapters[0].sections[0].paragraphs[0]).toBe("앞 문장이에요. 원래 문장이에요. 다음 문장이에요.");
    const conv = "사람 모이는 자리를 앞두고 도윤님은 집 안 정리부터 시작해요. 가운데 문장은 다른 이야기예요. 도윤님은 사람 모이는 자리를 앞두고 더 느긋한 하린님을 보며 놀라요.";
    const c2 = postRepairTidy([ch(1, [[conv]])], [
      { id: 1, kind: "sentence" as const, at: "1.0.0", before: "연인의 친구가 오는 날 도윤님은 청소부터 시작해요.", after: "사람 모이는 자리를 앞두고 도윤님은 집 안 정리부터 시작해요.", source: ["lint"] },
      { id: 2, kind: "sentence" as const, at: "1.0.0", before: "도윤님이 놀라는 지점은 하린님의 여유예요.", after: "도윤님은 사람 모이는 자리를 앞두고 더 느긋한 하린님을 보며 놀라요.", source: ["lint"] }]);
    expect(c2.records.map(x => x.rule)).toContain("f1_converge");
    expect(c2.chapters[0].sections[0].paragraphs[0]).toContain("도윤님이 놀라는 지점은 하린님의 여유예요.");
    const nb = postRepairTidy([ch(1, [["다툼이 생기면 바로 따지지 않고 일단 덮어 두는 쪽이에요. 다툼이 생기면 바로 따지지 않고 일단 덮어 두는 쪽이라 늦게 말해요. 셋째 문장이에요. 끝이에요."]])], []);
    expect(nb.records.map(x => x.rule)).toEqual(["f1_neighbor"]);
    expect(nb.chapters[0].sections[0].paragraphs[0]).toBe("다툼이 생기면 바로 따지지 않고 일단 덮어 두는 쪽이에요. 셋째 문장이에요. 끝이에요.");
    // W6 S0-1: 떼면 3문장 아래로 줄어드는 문단은 기록만(본문을 얇게 만들지 않는다).
    const nb3 = "다툼이 생기면 바로 따지지 않고 일단 덮어 두는 쪽이에요. 다툼이 생기면 바로 따지지 않고 일단 덮어 두는 쪽이라 늦게 말해요. 끝이에요.";
    expect(postRepairTidy([ch(1, [[nb3]])], []).chapters[0].sections[0].paragraphs[0]).toBe(nb3);
    expect(wordOverlap("오늘은 비가 와요.", "내일은 맑아요.")).toBe(0);
  });
  it("칸이 모자라 못 고친 HARD가 남은 문단은 문단째 지운다 — 장에 문단이 하나뿐이면 지우지 않는다", () => {
    const book = [ch(1, [["틀린 사실 문장이에요. 다른 문장이에요.", "다음 문단이에요."]]), ch(2, [["하나뿐인 문단의 틀린 문장이에요."]])];
    const rem = [flag("fact_relation", "틀린 사실 문장이에요."), flag("fact_relation", "하나뿐인 문단의 틀린 문장이에요.", [2, 0, 0])];
    const r = dropOverflowParagraphs(book, rem, new Set(["1.0.0|fact_relation", "2.0.0|fact_relation"]));
    expect(r.chapters[0].sections[0].paragraphs).toEqual(["다음 문단이에요."]);
    expect(r.chapters[1].sections[0].paragraphs).toEqual(["하나뿐인 문단의 틀린 문장이에요."]);
    expect(r.dropped).toEqual([{ at: "1.0.0", rule: "fact_relation" }]);
  });
});
