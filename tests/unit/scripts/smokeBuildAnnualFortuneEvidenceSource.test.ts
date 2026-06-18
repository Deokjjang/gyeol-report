import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_build_annual_fortune_evidence.ts"),
  "utf8",
);

describe("smoke_build_annual_fortune_evidence source", () => {
  it("supports fixture selection and prints annual fortune evidence summary", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("annual fortune fixture:");
    expect(source).toContain("target year:");
    expect(source).toContain("mode:");
    expect(source).toContain("ganji:");
    expect(source).toContain("year element:");
    expect(source).toContain("day master:");
    expect(source).toContain("annual ten god:");
    expect(source).toContain("fills missing:");
    expect(source).toContain("overloads heavy:");
    expect(source).toContain("branch interactions");
    expect(source).toContain("life area signals");
    expect(source).toContain("difficulty signals");
    expect(source).toContain("opportunity signals");
    expect(source).not.toContain("openaiCompatibilityReportWriter");
    expect(source).not.toContain("generateCompatibilityReportDraft");
  });
});
