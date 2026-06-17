import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/compatibility-preview/page.tsx"),
  "utf8",
);
const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/CompatibilityReportView.tsx"),
  "utf8",
);
const writerSource = readFileSync(
  join(process.cwd(), "src/lib/report-generation/openaiCompatibilityReportWriter.ts"),
  "utf8",
);
const combinedSource = `${pageSource}\n${viewSource}\n${writerSource}`;

describe("compatibility preview page source", () => {
  it("adds a gated dev preview route with fixture query support", () => {
    expect(pageSource).toContain("searchParams");
    expect(pageSource).toContain("fixture");
    expect(pageSource).toContain("snapshot");
    expect(pageSource).toContain('snapshotMode === "latest"');
    expect(pageSource).toContain("deokmin-sodam-love");
    expect(pageSource).toContain('process.env.NODE_ENV !== "production"');
    expect(pageSource).toContain("COMPATIBILITY_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).toContain("buildCompatibilityEvidencePacketFromFixture");
    expect(pageSource).toContain("readCompatibilityPreviewSnapshot");
    expect(pageSource).toContain("generateCompatibilityReportDraft");
    expect(pageSource).toContain("CompatibilityReportView");
    expect(pageSource).toContain("Preview snapshot not found. Run:");
    expect(pageSource).toContain("--write-preview");
    expect(pageSource).toContain("preview snapshot");
    expect(pageSource).toContain("dev-only metadata");
    expect(pageSource).toContain('devStatus="preview snapshot"');
    expect(pageSource.indexOf('if (snapshotMode === "latest")')).toBeLessThan(
      pageSource.indexOf("const packet = buildCompatibilityEvidencePacketFromFixture"),
    );
    expect(pageSource).toContain("redactPreviewDiagnosticLine");
    expect(pageSource).toContain("sk-[redacted]");
    expect(pageSource).toContain(
      "OpenAI writer is disabled. Enable OPENAI_REPORT_WRITER_ENABLED=1",
    );
  });

  it("renders the compatibility report sections needed for browser review", () => {
    const requiredMarkers = [
      "사주×MBTI 궁합 리포트 v1.0",
      "종합 궁합 점수",
      "draft.scoreSummary.scoreLabel",
      "draft.scoreSummary.scoreCaution",
      "끌림",
      "대화",
      "생활 리듬",
      "갈등 회복",
      "장기 안정성",
      "성장 보완",
      "두 사람 만세력 비교",
      "연주",
      "월주",
      "일주",
      "시주",
      "draft.chapters.map",
      "chapter.directHitScenes",
      "chapter.practicalAdvice",
      "오늘부터 할 일",
      "안전 안내",
      "조율형 궁합",
    ];

    for (const marker of requiredMarkers) {
      expect(combinedSource).toContain(marker);
    }
  });

  it("does not expose secrets or candidate recommendation copy", () => {
    expect(pageSource).not.toContain("OPENAI_API_KEY");
    expect(pageSource).not.toContain("TOSS_SECRET_KEY");
    expect(pageSource).not.toContain("Authorization");
    expect(combinedSource).not.toContain("MBTI 후보");
    expect(combinedSource).not.toContain("추천 유형");
    expect(viewSource).not.toContain("preview snapshot");
    expect(viewSource).not.toContain("dev preview");
  });
});
