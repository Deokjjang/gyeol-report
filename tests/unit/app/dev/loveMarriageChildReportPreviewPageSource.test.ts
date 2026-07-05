import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/love-marriage-child-report-preview/page.tsx"),
  "utf8",
);

describe("love marriage child report preview page source", () => {
  it("adds a gated dev preview route with fixture and snapshot query support", () => {
    expect(pageSource).toContain("fixture?: string");
    expect(pageSource).toContain("snapshot?: string");
    expect(pageSource).toContain("getFixtureId");
    expect(pageSource).toContain("getSnapshotMode");
    expect(pageSource).toContain("LOVE_MARRIAGE_CHILD_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).toContain("\"latest\"");
  });

  it("uses the deokmin-love fixture and renders the report view", () => {
    expect(pageSource).toContain("deokmin-love");
    expect(pageSource).toContain("buildLoveMarriageChildReportEvidence");
    expect(pageSource).toContain("buildScreenQaDraft");
    expect(pageSource).toContain("LoveMarriageChildReportView");
    expect(pageSource).toContain("evidencePacket={snapshot.evidencePacket}");
    expect(pageSource).toContain("evidencePacket={evidencePacket}");
  });

  it("reads optional preview snapshots without importing the writer", () => {
    expect(pageSource).toContain(".tmp/love-marriage-child-report-preview");
    expect(pageSource).toContain("readPreviewSnapshot");
    expect(pageSource).toContain("저장된 화면");
    expect(pageSource).toContain("샘플 화면");
    expect(pageSource).not.toContain("openaiLoveMarriageChildReportWriter");
    expect(pageSource).not.toContain("generateLoveMarriageChildReportDraft");
  });

  it("keeps child and breakup reunion wording inside safe boundaries", () => {
    expect(pageSource).toContain("부모가 되었을 때");
    expect(pageSource).toContain("내 반복 패턴");
    expect(pageSource).toContain("감정 처리");

    for (const forbidden of [
      "자녀운",
      "자식복",
      "재회 확률",
      "상대가 돌아온다",
      "placeholder",
    ]) {
      expect(pageSource).not.toContain(forbidden);
    }
  });
});
