import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/smoke_product_preview_flows.ts"),
  "utf8",
);

describe("product preview flow smoke source", () => {
  it("covers all connected product preview payloads", () => {
    const requiredMarkers = [
      "career-money-study",
      "career_money_study",
      "love-marriage-child",
      "love_marriage_child",
      "major-fortune",
      "major_fortune",
      "annual-fortune",
      "annual_fortune",
      "saju_mbti_compatibility",
      "compatibility:",
      "POST(createJsonRequest",
      "snapshotKind",
      "product_preview",
      "draft productType",
      "reportId",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("covers all compatibility relationship types", () => {
    const relationshipTypeMarkers = [
      "love",
      "marriage",
      "parentChild",
      "coworker",
      "managerReport",
      "businessPartner",
      "friendship",
      "draft relationshipType",
      "evidence relationshipType",
    ];

    for (const marker of relationshipTypeMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks annual selectedYear in draft and evidence", () => {
    expect(scriptSource).toContain('selectedYear: "2026"');
    expect(scriptSource).toContain("draft targetYear");
    expect(scriptSource).toContain("evidence selectedYear");
  });

  it("keeps the smoke script away from paid or external writer imports", () => {
    const forbiddenMarkers = [
      "lib/payment",
      "lib/supabase",
      "openai",
      "OpenAI",
      "SUPABASE",
      "payment/",
    ];

    for (const marker of forbiddenMarkers) {
      expect(scriptSource).not.toContain(marker);
    }
  });

  it("marks failures with process exit code", () => {
    expect(scriptSource).toContain("process.exitCode = 1");
    expect(scriptSource).toContain("FAIL");
    expect(scriptSource).toContain("PASS");
  });
});
