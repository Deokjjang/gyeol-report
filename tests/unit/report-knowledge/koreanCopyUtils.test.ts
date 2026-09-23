import { describe, expect, it } from "vitest";

import {
  joinKoreanSentences,
  normalizeKoreanSentenceSpacing,
  removeDuplicateKoreanPeriods,
  removeRepeatedLeadingLabel,
  withKoreanParticle,
  correctKoreanParticleSlots,
} from "../../../src/lib/report-knowledge/koreanCopyUtils";

describe("Korean copy utilities", () => {
  it.each([
    ["영업기획", "called", "영업기획이라는"], ["화", "object", "화를"], ["토", "object", "토를"],
    ["세운", "with", "세운과"], ["대운", "with", "대운과"], ["활용", "subject", "활용이"],
    ["통제", "object", "통제를"], ["길", "to", "길로"], ["금", "to", "금으로"],
    ["나", "topic", "나는"], ["1", "to", "1로"], ["6", "object", "6을"],
    ["CRM", "object", "CRM을(를)"], ["戊辰", "subject", "戊辰이(가)"],
    ["B2B 영업기획", "called", "B2B 영업기획이라는"], ["‘통제’", "object", "‘통제’를"],
  ] as const)("%s / %s has a deterministic particle", (word, kind, expected) => {
    expect(withKoreanParticle(word, kind)).toBe(expected);
  });
  it("repairs only documented source slots without rewriting facts", () => {
    expect(correctKoreanParticleSlots("활용가 실제로 필요하고 통제을 살피며 화을 결과물로 옮깁니다.")).toBe("활용이 실제로 필요하고 통제를 살피며 화를 결과물로 옮깁니다.");
    expect(correctKoreanParticleSlots("1993년 癸酉 / 丁卯 / 戊戌 / 丁巳")).toBe("1993년 癸酉 / 丁卯 / 戊戌 / 丁巳");
  });
  it("normalizes spacing and duplicate punctuation", () => {
    expect(removeDuplicateKoreanPeriods("이미지입니다..")).toBe("이미지입니다.");
    expect(normalizeKoreanSentenceSpacing("기운입니다.막힌 길입니다..")).toBe(
      "기운입니다. 막힌 길입니다.",
    );
  });

  it("removes repeated leading labels from product copy", () => {
    expect(
      removeRepeatedLeadingLabel(
        "금여록은 좋은 조건에서 살아납니다. 금여록은 품격과 안정감이 중요합니다.",
        "금여록",
      ),
    ).toBe("좋은 조건에서 살아납니다. 품격과 안정감이 중요합니다.");
  });

  it("joins Korean sentence fragments with safe boundaries", () => {
    expect(
      joinKoreanSentences([
        "중요한 순간에 도움과 기회가 붙는 기운",
        "막힌 길에서 귀한 사람이 손을 내미는 통로",
      ]),
    ).toBe(
      "중요한 순간에 도움과 기회가 붙는 기운입니다. 막힌 길에서 귀한 사람이 손을 내미는 통로입니다.",
    );
    expect(
      joinKoreanSentences("돈과 자원을 담는 창고", "계좌를 나눌수록 살아납니다."),
    ).toBe("돈과 자원을 담는 창고입니다. 계좌를 나눌수록 살아납니다.");
  });
});
