import { beforeAll, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
import { MAJOR_MEANINGS } from "../../../src/lib/interpretation-v4/majorMaterials";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
const samples = new Map<string, Extract<V4RuntimeEvidence["composition"], { product: "major_fortune" }>["result"]>();
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const g = await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK);
    expect(g.ok, f.id).toBe(true); if (!g.ok) continue;
    expect(validateV4Publication("major_fortune", g.draft, g.evidencePacket).ok).toBe(true);
    expect(g.externalCalls).toEqual([]);
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "major_fortune") return expect.unreachable();
    expect(projectBook(e)?.pages.at(-1)?.kind).toBe("back");
    samples.set(f.id, e.composition.result);
  }
}, 120000);
it.each(MAJOR_SAFETY_CASES)("$id connects fourteen actual years without carrying today's occupation into other years", ({ id }) => {
  const r = samples.get(id)!;
  expect(r.writerVersion).toBe("major-full-content-refinement-01-v2");
  expect(r.years).toHaveLength(14);
  expect(r.editorial).toEqual([]);
  const metadata = r.transitions.map(({ blocks, ...t }) => { expect(blocks.length).toBeGreaterThanOrEqual(4); return t; });
  expect(metadata).toEqual(r.evidence.horizon.transitions);
  for (const y of r.years) {
    const character = y.blocks.find(b => b.id === `${y.year}-character`)!;
    const connected = r.years.filter(v => Math.abs(v.year - y.year) === 1 || (v.year < y.year && v.annual.tenGod === y.annual.tenGod));
    expect(connected.some(v => character.text.includes(String(v.year)))).toBe(true);
    if (y.timePosition !== "current") {
      const text = y.blocks.map(b => b.text).join(" ");
      expect(text).not.toMatch(/당신의 고객|현재 회사|상품의 방향|매출 뒤의 이유|연봉 협상|촬영 의뢰/);
    }
    const t = r.transitions.find(t => t.year === y.year);
    if (t) {
      expect(character.text).toContain(t.before.ganji);
      expect(character.text).toContain(t.after.ganji);
      expect(character.text).toContain("전환이 완료된 뒤");
    }
  }
  // Full cycle-theme definitions appear at the first row and actual boundaries,
  // rather than being copied into every annual chapter.
  expect(r.years.filter(y => y.blocks.some(b => b.text.includes("큰 배경인 ‘"))).length).toBeLessThanOrEqual(r.transitions.length + 1);
  expect(r.narrative.finalLine).toContain(MAJOR_MEANINGS[r.evidence.horizon.activeCycle!.tenGod].gift);
  expect(r.narrative.finalLine).not.toMatch(/하세요|고르세요/);
});
