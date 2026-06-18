import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_annual_fortune_report_draft.ts"),
  "utf8",
);

describe("smoke_generate_annual_fortune_report_draft source", () => {
  it("supports fixture selection, safe skip output, and annual evidence summary", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("--write-preview");
    expect(source).toContain("deokmin-2026-current");
    expect(source).toContain("annual fortune draft fixture:");
    expect(source).toContain("mode:");
    expect(source).toContain("year:");
    expect(source).toContain("ganji:");
    expect(source).toContain("ten god:");
    expect(source).toContain("user context:");
    expect(source).toContain("life status:");
    expect(source).toContain("field label:");
    expect(source).toContain("context translation hints");
    expect(source).toContain("preferredSceneNouns");
    expect(source).not.toContain("interestArea");
    expect(source).toContain("vague copy warnings:");
    expect(source).toContain("hard claim warnings:");
    expect(source).toContain("internal artifact warnings:");
    expect(source).toContain("raw English labels:");
    expect(source).toContain("repeated term warnings:");
    expect(source).toContain("generic final advice labels:");
    expect(source).toContain("final advice domain mismatch warnings:");
    expect(source).toContain("repeated terminology warnings:");
    expect(source).toContain("monthly evidence missing warnings:");
    expect(source).toContain("domain context overreach warnings:");
    expect(source).toContain("missing difficulty signal warnings:");
    expect(source).toContain("missing opportunity signal warnings:");
    expect(source).toContain("hero duplication warnings:");
    expect(source).toContain("future development wording warnings:");
    expect(source).toContain("final advice domain lock warnings:");
    expect(source).toContain("abnormal script warnings:");
    expect(source).toContain("monthly basis repetition warnings:");
    expect(source).toContain("grammar residue warnings:");
    expect(source).toContain("parenthetical term warnings:");
    expect(source).toContain("monthly basis:");
    expect(source).toContain("calendar_month_approximation");
    expect(source).toContain("life area signals");
    expect(source).toContain("difficulty signals");
    expect(source).toContain("opportunity signals");
    expect(source).toContain("SKIP draft generation, OpenAI writer disabled");
    expect(source).toContain("SKIP draft generation, OpenAI writer env incomplete");
  });

  it("writes annual-fortune-preview snapshots only after draft generation", () => {
    expect(source).toContain("generateAnnualFortuneReportDraft");
    expect(source).toContain("validateAnnualFortuneReportDraft");
    expect(source).toContain("writeAnnualFortunePreviewSnapshot");
    expect(source).toContain("getAnnualFortunePreviewSnapshotRelativePath");
    expect(source).toContain("getAnnualFortunePreviewUrl");
    expect(source).toContain("preview snapshot written:");
    expect(source).toContain("Open in browser:");
    expect(source).toContain("snapshot:");
    expect(source).toContain("url:");
    expect(source).toContain("monthly flow count:");
    expect(source).toContain("annualFortuneResponseFormatName");
    expect(source).toContain("schema approx chars:");
    expect(source).not.toContain("writeLine(`OPENAI_API_KEY");
    expect(source).not.toContain("Authorization");
  });
});
