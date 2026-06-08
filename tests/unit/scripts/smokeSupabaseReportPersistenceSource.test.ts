import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readScript(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const source = readScript("scripts/smoke_supabase_report_persistence.ts");

describe("supabase report persistence smoke script source", () => {
  it("is env-gated and uses the deterministic smoke fixture", () => {
    const requiredMarkers = [
      "REPORT_PERSISTENCE_MODE",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SMOKE",
      "1996-12-06",
      "ENTJ",
      "preview_memory",
      "supabase",
      "accessTokenHash",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not contain payment, unlock, or secret-role markers", () => {
    const rejectedMarkers = [
      "service" + "_role",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "check" + "out",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
