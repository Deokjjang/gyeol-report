import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(
    process.cwd(),
    "scripts/smoke_generate_love_marriage_child_report_draft.ts",
  ),
  "utf8",
);

describe("smoke_generate_love_marriage_child_report_draft source", () => {
  it("supports deokmin-love fixture and write-preview mode", () => {
    expect(scriptSource).toContain("--fixture");
    expect(scriptSource).toContain("--write-preview");
    expect(scriptSource).toContain("deokmin-love");
    expect(scriptSource).toContain(".tmp/love-marriage-child-report-preview");
    expect(scriptSource).toContain("getPreviewUrl");
    expect(scriptSource).toContain("love-marriage-child-report-preview");
  });

  it("uses writer disabled fallback without a static writer import", () => {
    expect(scriptSource).toContain("OPENAI_REPORT_WRITER_ENABLED");
    expect(scriptSource).toContain("OpenAI writer disabled");
    expect(scriptSource).toContain("OpenAI writer env incomplete");
    expect(scriptSource).toContain("buildScreenQaDraft");
    expect(scriptSource).toContain("handleScreenQaDraft");
    expect(scriptSource).toContain("await import(");
    expect(scriptSource).toContain(
      "../src/lib/report-generation/openaiLoveMarriageChildReportWriter",
    );
    expect(scriptSource).not.toContain(
      "from \"../src/lib/report-generation/openaiLoveMarriageChildReportWriter\"",
    );
  });

  it("includes all launch preview draft sections", () => {
    for (const marker of [
      "headline",
      "openingSummary",
      "loveStyle",
      "attractionPattern",
      "loveStrengths",
      "loveFriction",
      "marriageRhythm",
      "householdMoneyAndRoleSplit",
      "conflictRecovery",
      "parentMode",
      "breakupReunionPattern",
      "relationshipTimingHints",
      "actionPlan",
      "riskManagement",
      "safetyNotes",
    ]) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("keeps child and breakup reunion wording inside safe boundaries", () => {
    expect(scriptSource).toContain("부모가 되었을 때");
    expect(scriptSource).toContain("내 반복 패턴");
    expect(scriptSource).toContain("감정 처리");

    for (const forbidden of [
      "자녀운",
      "자식복",
      "재회 확률",
      "상대가 돌아온다",
      "placeholder",
    ]) {
      expect(scriptSource).not.toContain(forbidden);
    }
  });
});
