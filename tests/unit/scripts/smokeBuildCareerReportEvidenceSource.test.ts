import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_build_career_report_evidence.ts"),
  "utf8",
);

describe("smoke_build_career_report_evidence source", () => {
  it("supports fixture selection and all-fixture matrix mode", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("--all");
    expect(source).toContain("deokmin-career");
    expect(source).toContain("fixture:");
    expect(source).toContain("mbti:");
    expect(source).toContain("lifeStatus:");
    expect(source).toContain("field:");
  });

  it("prints career evidence sections and QA warnings", () => {
    expect(source).toContain("combined profile:");
    expect(source).toContain("recommended jobs");
    expect(source).toContain("money style");
    expect(source).toContain("investment style");
    expect(source).toContain("study style");
    expect(source).toContain("same jobs across all fixtures warnings:");
    expect(source).toContain("specific stock ticker detected warnings:");
    expect(source).toContain("guaranteed return detected warnings:");
    expect(source).toContain("hard deterministic claim detected warnings:");
    expect(source).toContain("Deokmin leakage warnings:");
  });

  it("does not import OpenAI", () => {
    expect(source).not.toContain("openai");
    expect(source).not.toContain("generateCareerReportDraft");
  });
});
