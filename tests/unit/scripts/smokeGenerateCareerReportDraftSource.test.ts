import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_career_report_draft.ts"),
  "utf8",
);

describe("smoke_generate_career_report_draft source", () => {
  it("supports fixture, all, and write-preview modes", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("--all");
    expect(source).toContain("--write-preview");
    expect(source).toContain("deokmin-career");
  });

  it("skips OpenAI when writer is disabled", () => {
    expect(source).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(source).toContain("writer:");
    expect(source).toContain("disabled");
    expect(source).toContain("SKIP draft generation, OpenAI writer disabled");
  });

  it("prints career draft and financial QA counters", () => {
    expect(source).toContain("career report draft fixture:");
    expect(source).toContain("recommended jobs:");
    expect(source).toContain("money style:");
    expect(source).toContain("investment style:");
    expect(source).toContain("study strategy:");
    expect(source).toContain("financial guarantee warnings:");
    expect(source).toContain("ticker warnings:");
    expect(source).toContain("hard claim warnings:");
  });

  it("prints preview snapshot path and URL", () => {
    expect(source).toContain("getCareerReportPreviewSnapshotRelativePath");
    expect(source).toContain("getCareerReportPreviewUrl");
    expect(source).toContain(".tmp/career-report-preview");
    expect(source).toContain("http://localhost:3000/dev/career-report-preview");
  });
});
