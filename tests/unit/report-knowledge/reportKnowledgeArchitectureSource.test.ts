import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "docs/report-knowledge-architecture.md"),
  "utf8",
);

describe("report knowledge architecture document", () => {
  it("documents the REPORT-01 knowledge-base boundary", () => {
    const requiredMarkers = [
      "사주가 1차 근거",
      "MBTI는 보조 근거",
      "RAG/source collection is for DB building, not output copying",
      "내 MBTI가 이래서 그런 줄 알았는데, 사주에도 이 구조가 있었네",
      "OpenAI generation later",
      "REPORT-01 does not implement final content",
      "REPORT-02 expands Saju DB first",
      "사주 단독 해석 is required",
      "오행, 십성, 신살",
      "귀인, 일주 are first-class knowledge",
      "MBTI remains secondary",
      "source/RAG collection is used for DB refinement",
      "REPORT-03 expands MBTI DB",
      "reinforce, contrast, and personalize Saju interpretation",
      "All 16 types are structured",
      "No copied source paragraphs",
      "사주에는 이런 구조가 있고",
      "REPORT-04 expands fusion rules",
      "A reinforcement rule is used",
      "A contrast rule is used",
      "A compensation rule is used",
      "Before OpenAI generation",
      "The evidence packet is not final prose",
      "Saju remains primary",
      "MBTI supports and contrasts",
      "REPORT-05 maps computed Saju facts to knowledge entry ids",
      "Computed facts are not invented",
      "Mapping happens before evidence packet",
      "full manse calculation is separate from mapping",
      "REPORT-06 uses OpenAI only as writer",
      "OpenAI does not calculate Saju facts",
      "evidence packet comes before generation",
      "structured JSON draft is validated",
      "DB save/rendering happens later",
      "REPORT-07 persists validated draft JSON",
      "OpenAI generation happens before persistence",
      "DB save is separate from result rendering",
      "Validated snapshot only",
      "no result page rendering yet",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });
});
