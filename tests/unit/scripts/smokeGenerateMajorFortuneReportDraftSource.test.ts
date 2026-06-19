import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_major_fortune_report_draft.ts"),
  "utf8",
);

describe("smoke_generate_major_fortune_report_draft source", () => {
  it("supports fixture and write-preview args", () => {
    expect(scriptSource).toContain("--fixture");
    expect(scriptSource).toContain("--all");
    expect(scriptSource).toContain("--write-preview");
    expect(scriptSource).toContain("deokmin-current-major-fortune");
  });

  it("skips OpenAI when the writer is disabled", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("writer: ${isWriterEnabled() ? \"enabled\" : \"disabled\"}");
    expect(scriptSource).toContain("SKIP draft generation, OpenAI writer disabled");
    expect(scriptSource).toContain("SKIP draft generation, OpenAI writer env incomplete");
  });

  it("prints matrix readiness per fixture without OpenAI", () => {
    expect(scriptSource).toContain("writeMatrixReadinessSummary");
    expect(scriptSource).toContain("evidence: PASS");
    expect(scriptSource).toContain("timeline:");
    expect(scriptSource).toContain("relationship hints:");
    expect(scriptSource).toContain("strong year push/reduce:");
    expect(scriptSource).toContain("matrix similarity warnings:");
    expect(scriptSource).toContain("fixture leakage warnings:");
    expect(scriptSource).toContain("relationship hint warnings:");
    expect(scriptSource).toContain("likely area diversity warnings:");
    expect(scriptSource).toContain("technical term leakage warnings:");
  });

  it("prints current cycle, phase timeline, and strong years counts", () => {
    expect(scriptSource).toContain("current cycle:");
    expect(scriptSource).toContain("ganji:");
    expect(scriptSource).toContain("ten god:");
    expect(scriptSource).toContain("cycle basis:");
    expect(scriptSource).toContain("cycle position:");
    expect(scriptSource).toContain("calculation basis:");
    expect(scriptSource).toContain("decade cards:");
    expect(scriptSource).toContain("phase timeline:");
    expect(scriptSource).toContain("cycle year timeline:");
    expect(scriptSource).toContain("major fortune timeline rows:");
    expect(scriptSource).toContain("myeongli layers:");
    expect(scriptSource).toContain("compact daeun seun timeline");
    expect(scriptSource).toContain("strong years:");
    expect(scriptSource).toContain("safety notes:");
  });

  it("prints validation quality counters and preview URL", () => {
    expect(scriptSource).toContain("hard claim warnings:");
    expect(scriptSource).toContain("internal artifact warnings:");
    expect(scriptSource).toContain("repeated terminology warnings:");
    expect(scriptSource).toContain("annual-tone warnings:");
    expect(scriptSource).toContain("decade-tone warnings:");
    expect(scriptSource).toContain("strong year reason warnings:");
    expect(scriptSource).toContain("missing cycle year warnings:");
    expect(scriptSource).toContain("cycle index leak warnings:");
    expect(scriptSource).toContain("technical term warnings:");
    expect(scriptSource).toContain("small event overfocus warnings:");
    expect(scriptSource).toContain("wrong cycle basis warnings:");
    expect(scriptSource).toContain("empty myeongli basis warnings:");
    expect(scriptSource).toContain("duplicate big theme warnings:");
    expect(scriptSource).toContain("duplicate strong year push warnings:");
    expect(scriptSource).toContain("duplicate strong year reduce warnings:");
    expect(scriptSource).toContain("duplicate top push warnings:");
    expect(scriptSource).toContain("duplicate top reduce warnings:");
    expect(scriptSource).toContain("short strategy body warnings:");
    expect(scriptSource).toContain("unknown status exposure warnings:");
    expect(scriptSource).toContain("weak specificity warnings:");
    expect(scriptSource).toContain("unknown relationship pill warnings:");
    expect(scriptSource).toContain("slash-separated whyStrong warnings:");
    expect(scriptSource).toContain("duplicate strong year headline warnings:");
    expect(scriptSource).toContain("weak auxiliary star warnings:");
    expect(scriptSource).toContain("timeline spacing warnings:");
    expect(scriptSource).toContain("age basis repetition warnings:");
    expect(scriptSource).toContain("generic timeline warnings:");
    expect(scriptSource).toContain("repeated summary warnings:");
    expect(scriptSource).toContain("weak strategy warnings:");
    expect(scriptSource).toContain("relationship status misuse warnings:");
    expect(scriptSource).toContain("strong year title repeat warnings:");
    expect(scriptSource).toContain("repeated strategy warnings:");
    expect(scriptSource).toContain("repeated theme warnings:");
    expect(scriptSource).toContain("safety note warnings:");
    expect(scriptSource).toContain("safety notes repaired:");
    expect(scriptSource).toContain("getMajorFortunePreviewSnapshotRelativePath");
    expect(scriptSource).toContain("getMajorFortunePreviewUrl");
    expect(scriptSource).toContain("url:");
  });

  it("does not statically import the OpenAI writer", () => {
    expect(scriptSource).not.toContain(
      "from \"../src/lib/report-generation/openaiMajorFortuneReportWriter\"",
    );
    expect(scriptSource).toContain(
      "import(\"../src/lib/report-generation/openaiMajorFortuneReportWriter\")",
    );
  });
});
