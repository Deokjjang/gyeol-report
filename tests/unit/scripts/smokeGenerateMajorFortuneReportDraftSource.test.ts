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
    expect(scriptSource).toContain("--write-preview");
    expect(scriptSource).toContain("deokmin-current-major-fortune");
  });

  it("skips OpenAI when the writer is disabled", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("SKIP draft generation, OpenAI writer disabled");
    expect(scriptSource).toContain("SKIP draft generation, OpenAI writer env incomplete");
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
    expect(scriptSource).toContain("generic timeline warnings:");
    expect(scriptSource).toContain("repeated summary warnings:");
    expect(scriptSource).toContain("weak strategy warnings:");
    expect(scriptSource).toContain("relationship status misuse warnings:");
    expect(scriptSource).toContain("strong year title repeat warnings:");
    expect(scriptSource).toContain("repeated theme warnings:");
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
