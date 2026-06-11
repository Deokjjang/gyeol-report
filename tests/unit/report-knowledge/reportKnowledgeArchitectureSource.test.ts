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
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });
});
