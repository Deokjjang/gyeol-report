import { expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";

// Captured at 0aa938a BEFORE changing either time-product entry.
const locks = [
  ["fe679cecdc36ebf6254377d98f1c9887ce3699b1ddc65e79afb9180df08c9f18", "f7344e7d346feb3a6375f6220a52ec31ce2c56dd5d097c210a16af5932d956d3", "17b8a1567a04d4f5e17ddd781187425f78623de7bd2491a69b70114500e0ac96"],
  ["2f5174beadff0c2205e8501ad98f7f7cb97c4ae8d87a0514a60ed0ff9c7fe552", "7e22895940af9e4f3075d1035822c5def124c7d78627e5d938df64645e8ef0d5", "f58e4aa9c13d6b888432616545c5efb32bec68b052ec3f39cb50cc291dfb096f"],
  ["dc65e1cff1fdaef863b242387ca333913335507ca0c3e296eb399150c0f16ae8", "d2b6fc40dcafd7de79170fb641dc45acf42fcf7749de8e83f766d1105c8d5fce", "17571a8443a3a6a43c54c2d517ec88c6f2898b07f92b6328a2f591db54ba3978"],
  ["da6593ae6c10583c2a6f28ee29c26b5609b409b4edcccde35dd512bb1b2454f4", "d0694ae557383ea3cd0b4cacd3f51cb7ac2d096c3e70ec3cc593b32fe44c6d7e", "e161afa18d5465c6ff7e4cd46b6c13d7e8e48bcc851ca65dd9d3fbebe24b5696"],
];
it.each([0, 1, 2, 3])("frozen product %s text/evidence/Book unchanged", async i => {
  const r = await generateV4ShadowReport(RUNTIME_FIXTURES[i].payload, SHADOW_CLOCK);
  if (!r.ok) return expect.unreachable(JSON.stringify(r));
  expect([v4Digest(r.draft), v4Digest(r.evidencePacket), v4Digest(projectBook(r.evidencePacket as V4RuntimeEvidence))]).toEqual(locks[i]);
}, 120000);
it("product adapters have no new scoring, IO, provider or business dependencies", () => {
  for (const f of ["timeProductContext", "majorProductAdapter", "annualProductAdapter"]) {
    const source = readFileSync(`src/lib/interpretation-v4/${f}.ts`, "utf8");
    expect(source).not.toMatch(/fetch\(|Math\.random|process\.env|from ["'][^"']*(?:supabase|openai|tickets|payment|coupons|analytics|comprehensiveScheduler)["']/);
    expect(source).not.toMatch(/priorityScore\s*[+*\/-]|newScore|newWeight|newThreshold/);
  }
});
