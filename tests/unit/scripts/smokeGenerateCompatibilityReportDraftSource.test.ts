import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_generate_compatibility_report_draft.ts"),
  "utf8",
);

describe("smoke_generate_compatibility_report_draft source", () => {
  it("supports the deokmin-sodam compatibility fixture and safe skip output", () => {
    expect(source).toContain("--fixture");
    expect(source).toContain("deokmin-sodam-love");
    expect(source).toContain("compatibility fixture:");
    expect(source).toContain("relationship type:");
    expect(source).toContain("score total:");
    expect(source).toContain("SKIPPED, OpenAI writer not enabled");
    expect(source).toContain("draft version:");
    expect(source).toContain("done");
  });
});
