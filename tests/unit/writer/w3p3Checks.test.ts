/**
 * W3 P3 검사(4·5·6절): 노출 금지 HARD 규칙 · 개수 말 대조 · 수리 뒤 결정론 재검.
 * 양성 문장은 research-w2(3c2b7bac) 결함 인용(R7·CO4·LO1·LO7·5-5·4-4)과 저장소 원고 꼴, 음성 문장은 운영·저장소 말뭉치에서 본 일상어 꼴.
 */
import { describe, expect, it } from "vitest";
import { exposureHits, exposureOf, plainStrength } from "@/lib/writer/safety/exposure";
import { HARD_RULES, HINT } from "@/lib/writer/safety/p6c";
import { styleFlags } from "@/lib/writer/safety/style";
import type { FinalChapter } from "@/lib/writer/safety";

const ch = (n: number, paragraphs: string[][]): FinalChapter => ({ n, id: `c${n}`, title: `장 ${n}`, source: "writer", chars: 0, sections: paragraphs.map((ps, i) => ({ heading: `소제목 ${n}.${i}`, paragraphs: ps })) });

describe("W3 P3 4절 노출 금지", () => {
  it("판정 등급어(신약·신강·중화·과다·세기·힘 단계)를 잡는다", () => {
    const grade = [
      "남궁현님은 매우 신약한 사주라 혼자 버티기보다 도움을 빌려요.", // CO4 꼴
      "규칙의 힘은 약입니다.", // R7 「힘은 약입니다」
      "내 힘의 세기는 중화라서 상황에 맞춰 밀고 당겨요.",
      "내 힘의 세기는 신강이에요.",
      "여기에 토 과다가 겹칩니다.",
      "수가 과다한 사주는 정보가 넘쳐요.",
      "비겁 과다는 혼자 먼저 움직이게 해요.",
      "별의 세기는 보통입니다.",
      "값을 받는 힘은 보통이고, 성과를 크게 굴릴 때 붙어요.",
      "관성 세기 보통이라 규칙을 지키는 힘이 고르게 있어요.",
      "규칙의 힘(관성) 강, 배우는 힘(인성) 약.",
    ];
    for (const s of grade) expect(exposureOf(s)?.kind, s).toBe("grade");
  });
  it("생성 규칙 문구(시간 미상·입력 상태·가정으로만·기준으로 썼어요·기준일)를 잡는다", () => {
    const rule = [
      "시간 미상이 아니라 태어난 시각이 있어서 자녀 자리를 봐요.", // LO1
      "지금은 연애 중이고 자녀는 아직 입력된 게 없으니, 이건 가정 속 이야기예요.", // 4-4·5-2
      "입력하신 정보에 직업이 없어서 일반 장면으로 볼게요.",
      "부모님 이야기는 가정으로만 그려 볼게요.", // LO7
      "이 책은 2026년 11월 13일을 기준으로 썼어요.", // 5-5
      "기준일에 마지막 해를 지나고 있어요.", // 5-5
    ];
    for (const s of rule) expect(exposureOf(s)?.kind, s).toBe("rule");
  });
  it("일상어 꼴은 잡지 않는다(말뭉치 오탐 확인)", () => {
    const plain = [
      "과다 지출을 막으려면 한도를 먼저 정해 두세요.",
      "INTP는 지난 경험을 기준으로 삼는 유형이에요.",
      "관계를 맺는 힘은 약속을 지키는 데서 나와요.",
      "만드는 힘은 강하고, 받는 힘은 약한 편이에요.",
      "이 해의 세기는 무엇을 더할까요?",
      "식상의 세기가 약한 편이라 표현이 천천히 나와요.",
      "중화요리를 좋아하는 사람이에요.",
      "가족을 기준으로 나누면 두 갈래예요.",
      "데이터 입력 업무가 없는 날에는 쉬어 가세요.",
      "지금 버티는 힘이 여린 편이라 도움을 빌리면 수월해요.",
    ];
    for (const s of plain) expect(exposureHits(s), s).toEqual([]);
  });
  it("HARD 규칙이고 수리 힌트가 있다, time_deictic 힌트는 기준일을 권하지 않는다", () => {
    expect(HARD_RULES.has("grade_leak")).toBe(true);
    expect(HARD_RULES.has("rule_leak")).toBe(true);
    expect(HARD_RULES.has("fact_count")).toBe(true);
    expect(HINT.grade_leak.length).toBeGreaterThan(10);
    expect(HINT.time_deictic).not.toMatch(/기준일|기준 날짜/);
  });
  it("뜻 말(plainStrength)은 등급어가 아니다", () => {
    for (const lv of ["VERY_WEAK", "WEAK", "BALANCED", "STRONG", "VERY_STRONG"]) expect(exposureHits(`타고난 힘으로 보면 ${plainStrength(lv)}이에요.`)).toEqual([]);
  });
  it("용어 첫 등장 풀이 없음은 SOFT 깃발(term_unexplained)이다", () => {
    const flags = styleFlags([ch(1, [["당신 사주에는 편인이 두드러져요. 그래서 혼자 생각하는 시간이 길어요."]]), ch(2, [["편인이 다시 나와도 두 번째는 세지 않아요."]])]);
    const t = flags.filter(f => f.rule === "term_unexplained");
    expect(t.map(f => [f.chapter, f.detail])).toEqual([[1, "편인"]]);
    expect(HARD_RULES.has("term_unexplained" as never)).toBe(false);
    const ok = styleFlags([ch(1, [["당신 사주에는 편인(혼자 깊이 파고들어 배우는 힘)이 두드러져요."]])]);
    expect(ok.filter(f => f.rule === "term_unexplained")).toEqual([]);
  });
});
