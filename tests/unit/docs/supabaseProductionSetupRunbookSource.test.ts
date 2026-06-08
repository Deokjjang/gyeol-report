import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const doc = readDoc("docs/supabase-production-setup-runbook.md");

describe("supabase production setup runbook source", () => {
  it("documents the current safe state and required project values", () => {
    const requiredMarkers = [
      "Supabase Production Setup Runbook",
      "preview_memory remains the default runtime",
      "/api/reports/create is not switched to Supabase in this task",
      "SUPABASE_URL=<project-url>",
      "SUPABASE_ANON_KEY=<anon-key>",
      "REPORT_PERSISTENCE_MODE=supabase",
    ];

    for (const marker of requiredMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("documents secret handling and migration commands", () => {
    const requiredMarkers = [
      "supabase db push",
      "Do not commit Supabase keys.",
      "Do not paste keys into chat.",
      "Do not use service role key",
      "Do not set Production to supabase until local smoke test passes and SUPABASE-01C is complete.",
      "Set REPORT_PERSISTENCE_MODE back to preview_memory",
    ];

    for (const marker of requiredMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("documents non-goals and avoids real secret-shaped values", () => {
    const requiredMarkers = [
      "No payment implementation.",
      "No route switch in this task.",
    ];
    const rejectedMarkers = ["ey" + "J", "service" + "_role", "postgresql" + "://"];

    for (const marker of requiredMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of rejectedMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
