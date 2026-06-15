import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts", "smoke_audit_saju_features.ts"),
  "utf8",
);

describe("smoke saju feature audit script source", () => {
  it("uses the deterministic feature audit without OpenAI or Supabase dependencies", () => {
    expect(source).toContain("auditComputedSajuFeatures");
    expect(source).toContain("formatSajuFeatureAuditResult");
    expect(source).toContain("丙子");
    expect(source).toContain("己亥");
    expect(source).toContain("甲申");
    expect(source).toContain("丁未");
    expect(source).toContain("audit");
    expect(source).not.toContain("OPENAI_API_KEY");
    expect(source).not.toContain("SUPABASE_SERVICE_ROLE");
    expect(source).not.toContain("generateComprehensiveReportDraft");
  });
});
