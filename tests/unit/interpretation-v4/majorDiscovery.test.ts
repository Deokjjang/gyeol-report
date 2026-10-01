import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { it, expect } from "vitest";
import { majorNarrativeEvidence } from "../../../src/lib/interpretation-v4/majorEvidence";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
it("uses canonical fourteen years and exports the actual evidence for authoring", async () => {
  const packets = await Promise.all(MAJOR_NARRATIVE_FIXTURES.map(async f => ({ id: f.id, result: await majorNarrativeEvidence(f.payload, MAJOR_EVALUATED_AT) })));
  for (const { result } of packets) { expect(result.ok).toBe(true); if (result.ok) expect(result.years).toHaveLength(14); }
  if (process.env.V4_PHASE6A_EXPORT === "1") {
    mkdirSync("/tmp/gyeol-v4-phase6a", { recursive: true });
    writeFileSync("/tmp/gyeol-v4-phase6a/evidence.json", JSON.stringify(packets, null, 2));
    writeFileSync("/tmp/gyeol-v4-phase6a/compatibility-baseline.json", JSON.stringify(COMPATIBILITY_NARRATIVE_FIXTURES.map(f => {
      const r = composeCompatibilityNarrative(f.payload); expect(r.ok).toBe(true);
      return { id: f.id, hash: r.ok ? createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex") : null };
    }), null, 2));
  }
});
