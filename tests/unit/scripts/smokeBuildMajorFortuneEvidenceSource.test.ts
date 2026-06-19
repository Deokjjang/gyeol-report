import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_build_major_fortune_evidence.ts"),
  "utf8",
);

describe("smoke_build_major_fortune_evidence source", () => {
  it("supports fixture selection and prints major fortune evidence summary", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("deokmin-current-major-fortune");
    expect(source).toContain("major fortune fixture:");
    expect(source).toContain("current cycle:");
    expect(source).toContain("ganji:");
    expect(source).toContain("ten god:");
    expect(source).toContain("cycle basis:");
    expect(source).toContain("cycle position:");
    expect(source).toContain("decade archetype:");
    expect(source).toContain("calculation basis:");
    expect(source).toContain("cycle year timeline:");
    expect(source).toContain("strategic themes");
    expect(source).toContain("long range risks");
    expect(source).toContain("long range opportunities");
    expect(source).toContain("relationship hints");
    expect(source).toContain("life area signals");
    expect(source).toContain("difficulty signals");
    expect(source).toContain("opportunity signals");
    expect(source).toContain("strong years within cycle");
    expect(source).toContain("10-year timeline");
  });

  it("does not import OpenAI writer", () => {
    expect(source).not.toContain("openai");
    expect(source).not.toContain("generateMajorFortuneReportDraft");
  });
});
