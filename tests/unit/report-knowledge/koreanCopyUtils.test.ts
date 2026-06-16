import { describe, expect, it } from "vitest";

import {
  joinKoreanSentences,
  normalizeKoreanSentenceSpacing,
  removeDuplicateKoreanPeriods,
  removeRepeatedLeadingLabel,
} from "../../../src/lib/report-knowledge/koreanCopyUtils";

describe("Korean copy utilities", () => {
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
