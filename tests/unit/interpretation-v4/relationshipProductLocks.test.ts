import { expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";

it("Career 7A text/evidence/Book remains frozen at the 7B boundary", async () => {
  const r = await generateV4ShadowReport(RUNTIME_FIXTURES[1].payload, SHADOW_CLOCK);
  if (!r.ok) return expect.unreachable(JSON.stringify(r));
  expect([v4Digest(r.draft), v4Digest(r.evidencePacket), v4Digest(projectBook(r.evidencePacket as V4RuntimeEvidence))]).toEqual([
    "2f5174beadff0c2205e8501ad98f7f7cb97c4ae8d87a0514a60ed0ff9c7fe552",
    "7e22895940af9e4f3075d1035822c5def124c7d78627e5d938df64645e8ef0d5",
    "f58e4aa9c13d6b888432616545c5efb32bec68b052ec3f39cb50cc291dfb096f",
  ]);
}, 120000);
it("new relationship boundary contains no scheduler, IO, score or peer-type inference", () => {
  for (const name of ["relationshipProductView", "relationshipProductNarrative", "loveProductAdapter", "compatibilityProductView", "compatibilityProductAdapter"]) {
    const s = readFileSync(`src/lib/interpretation-v4/${name}.ts`, "utf8");
    expect(s).not.toMatch(/fetch\(|Math\.random|process\.env|from ["'][^"']*(?:comprehensiveScheduler|comprehensiveManuscriptRenderer|openai|supabase|payment|tickets|coupons|account|analytics)["']/);
  }
  expect(readFileSync("src/lib/interpretation-v4/compatibilityProductView.ts", "utf8")).not.toMatch(/\.score\s*[<>+*-]|newScore|\*\s*100/);
});
