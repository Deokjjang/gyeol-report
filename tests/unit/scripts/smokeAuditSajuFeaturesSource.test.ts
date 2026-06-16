import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts", "smoke_audit_saju_features.ts"),
  "utf8",
);

describe("smoke saju feature audit script source", () => {
  it("uses fixture-based deterministic feature audit without OpenAI or Supabase", () => {
    expect(source).toContain("auditComputedSajuFeatures");
    expect(source).toContain("formatSajuFeatureAuditResult");
    expect(source).toContain("calculateExternalManseParity");
    expect(source).toContain("--fixture");
    expect(source).toContain("deokmin");
    expect(source).toContain("sodam-intp");
    expect(source).toContain("default");
    expect(source).not.toContain("OPENAI_API_KEY");
    expect(source).not.toContain("SUPABASE_SERVICE_ROLE");
    expect(source).not.toContain("generateComprehensiveReportDraft");
  });
});
