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
    expect(source).toContain("--all");
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
    expect(source).toContain("major fortune timeline rows:");
    expect(source).toContain("myeongli layers:");
    expect(source).toContain("hidden stems:");
    expect(source).toContain("strategic themes");
    expect(source).toContain("long range risks");
    expect(source).toContain("long range opportunities");
    expect(source).toContain("relationship hints");
    expect(source).toContain("life area signals");
    expect(source).toContain("difficulty signals");
    expect(source).toContain("opportunity signals");
    expect(source).toContain("strong years within cycle");
    expect(source).toContain("compact daeun seun timeline");
    expect(source).toContain("10-year timeline");
    expect(source).toContain("push");
    expect(source).toContain("reduce");
  });

  it("supports matrix smoke output and QA counters", () => {
    expect(source).toContain("major fortune fixture matrix:");
    expect(source).toContain("fixture:");
    expect(source).toContain("major ten-god:");
    expect(source).toContain("relationshipStatus:");
    expect(source).toContain("likely areas:");
    expect(source).toContain("matrix similarity warnings:");
    expect(source).toContain("fixture leakage warnings:");
    expect(source).toContain("relationship hint warnings:");
    expect(source).toContain("likely area diversity warnings:");
    expect(source).toContain("technical term leakage warnings:");
  });

  it("does not import OpenAI writer", () => {
    expect(source).not.toContain("openai");
    expect(source).not.toContain("generateMajorFortuneReportDraft");
  });
});
