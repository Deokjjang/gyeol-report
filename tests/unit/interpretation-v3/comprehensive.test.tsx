import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateNewProductPublication, validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { comprehensiveCoverage, comprehensiveV3CustomerText, isComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { ComprehensiveReportV3View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV3View";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import type { ComprehensiveReportV2Draft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";
import type { Evidence } from "../../../src/lib/interpretation-v3/types";
import { getCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import type { ComprehensiveReportEvidencePacket } from "../../../src/lib/report-knowledge/comprehensiveReportEvidenceTypes";

const runtime = { enabled: false, reason: "flag_disabled" } as const;
const generate = (payload: unknown) => generateProductReport(payload, runtime, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
afterEach(() => expect(fetch).not.toHaveBeenCalled());
it("explicit V3 bypasses the provider even with an enabled writer runtime", async () => {
  const transport = vi.fn<typeof fetch>();
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const result = await generateProductReport(payload, { enabled: true, config: { enabled: true, apiKey: "mock-only", model: "mock-only", fetchImpl: transport } }, "normal_writer", undefined, { comprehensiveVersion: "v3" });
  expect(result.ok).toBe(true); expect(transport).not.toHaveBeenCalled(); expect(result.externalCalls).toEqual([]);
});
export function textMetrics(text: string) {
  const sentences = text.replace(/<[^>]*>/g, " ").split(/[.!?]\s*|\n+/u).map(s => s.replace(/\s+/gu, " ").trim()).filter(s => s.length >= 40);
  const counts = new Map<string, number>();
  for (const s of sentences) counts.set(s, (counts.get(s) ?? 0) + 1);
  return { chars: text.length, repeated40: [...counts.values()].reduce((n, c) => n + Math.max(0, c - 1), 0),
    hedges: (text.match(/가능성이 있습니다|일 수도 있습니다|로 볼 수 있습니다|처럼 나타날 수 있습니다|실제 경험과 비교|단정할 수 없습니다|참고 자료|수 있습니다/gu) ?? []).length,
    safety: (text.match(/안전 안내|안전 문구|참고 자료|단정할 수 없|보장하지 않|참고 콘텐츠|참고하세요|확정하지 않습니다|질병 예측이 아니라|수익을 약속하지 않/gu) ?? []).length };
}
it.each(COMPREHENSIVE_V3_FIXTURES)("%s: V3 generate → publish → snapshot → SSR", async (...row) => {
  const { id, payload } = comprehensiveFixture(row);
  const result = await generate(payload);
  expect(result.ok, JSON.stringify(result)).toBe(true);
  if (!result.ok || !isComprehensiveV3Draft(result.draft)) return;
  const draft = result.draft;
  const openingSignals = new Set(draft.opening.flatMap(b => b.labels)).size;
  expect(openingSignals).toBeGreaterThanOrEqual(3);
  expect(openingSignals).toBeLessThanOrEqual(7);
  expect(result.externalCalls).toEqual([]);
  expect(validateNewProductPublication("saju_mbti_full", draft, result.evidencePacket, payload)).toEqual({ ok: true, errors: [] });
  const snapshot = createProductPreviewSnapshot({ reportId: `comprehensive-v3-${id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "saju_mbti_full", productSlug: "saju-mbti-full", draft, evidencePacket: result.evidencePacket });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: result.evidencePacket }));
  expect(html).toContain("comprehensive_v3.2-story.1");
  expect(html).not.toContain("리포트를 준비하고 있습니다");
  expect(html).not.toContain("안전 안내");
  const blocks = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)];
  const packet = result.evidencePacket as { comprehensiveV3: { facts: readonly Evidence[] } };
  const facts = packet.comprehensiveV3.facts;
  for (const b of blocks) { expect(b.evidenceRefs.length, b.id).toBeGreaterThan(0); expect(b.evidenceRefs.every(id => facts.some(f => f.id === id)), b.id).toBe(true); }
  expect(blocks.filter(b => b.kind === "compound").length).toBeGreaterThan(0);
  if (payload.person.mbtiType) expect(blocks.filter(b => b.kind === "fusion").length).toBeGreaterThan(0);
  else { expect(facts.some(f => f.kind === "mbti")).toBe(false); expect(html).not.toMatch(/ENTJ|INFP|ISTP|ENFJ/); }
  expect(draft.patterns.length).toBeGreaterThanOrEqual(3);
  expect(comprehensiveCoverage(facts, draft).registryAvailable).toBeGreaterThan(190);
  expect(textMetrics(comprehensiveV3CustomerText(draft)).hedges).toBe(0);
  process.stdout.write(JSON.stringify({ fixture: id, ...textMetrics(comprehensiveV3CustomerText(draft)), sections: draft.sections.map(s => s.id), compound: blocks.filter(b => b.kind === "compound").length, fusion: blocks.filter(b => b.kind === "fusion").length, coverage: comprehensiveCoverage(facts, draft) }) + "\n");
  expect(comprehensiveCoverage(facts, draft).warnings).toEqual([]);
  expect(textMetrics(comprehensiveV3CustomerText(draft)).repeated40).toBe(0);
  expect(comprehensiveV3CustomerText(draft)).not.toMatch(/evidence|공개 지식|결제 후|[a-z]+_[a-z]+/);
});
it("MBTI counterfactual changes actual behavior while natal evidence stays identical", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const results = await Promise.all(["ENTJ", "INFP", ""].map(mbtiType => generate({ ...payload, person: { ...payload.person, mbtiType } })));
  for (const result of results) expect(result.ok, JSON.stringify(result.ok ? null : result)).toBe(true);
  const natal = results.map(r => r.ok ? (r.evidencePacket as { comprehensiveV3: { facts: readonly Evidence[] } }).comprehensiveV3.facts.filter(f => f.kind !== "mbti") : []);
  expect(natal[0]).toEqual(natal[1]); expect(natal[0]).toEqual(natal[2]);
  const texts = results.map(r => r.ok && isComprehensiveV3Draft(r.draft) ? comprehensiveV3CustomerText(r.draft) : "");
  expect(texts[0]).toContain("감정에도 정답을 요구할 때");
  expect(texts[1]).toContain("비유 옆에 원래 정의");
  expect(texts[2]).not.toMatch(/ENTJ|INFP|MBTI의/);
});
it("career and detailed job change work/money/study directives, never natal facts", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const contexts = [["employee", "소프트웨어 개발"], ["business_owner", "제조 품질"], ["student", "디자인"]];
  const results = await Promise.all(contexts.map(([jobStatus, detailJob]) => generate({ ...payload, userContext: { ...payload.userContext, jobStatus, detailJob } })));
  const facts = results.map(r => r.ok ? (r.evidencePacket as { comprehensiveV3: { facts: readonly Evidence[] } }).comprehensiveV3.facts : []);
  expect(facts[0]).toEqual(facts[1]); expect(facts[0]).toEqual(facts[2]);
  for (const domain of ["career", "money", "study"]) {
    const actions = results.map(r => r.ok && isComprehensiveV3Draft(r.draft) ? r.draft.sections.find(s => s.id === domain)?.blocks.find(b => b.kind === "context")?.action : undefined);
    expect(actions.every(Boolean)).toBe(true); expect(new Set(actions).size).toBe(3);
  }
  const texts = results.map(r => r.ok && isComprehensiveV3Draft(r.draft) ? comprehensiveV3CustomerText(r.draft) : "");
  expect(texts[0]).toContain("유지보수"); expect(texts[1]).toContain("재작업"); expect(texts[2]).toContain("두 가지 표현");
});
it("relationship status selects a different concrete agreement", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const results = await Promise.all(["single", "dating", "married"].map(relationshipStatus => generate({ ...payload, userContext: { ...payload.userContext, relationshipStatus } })));
  const actions = results.map(r => r.ok && isComprehensiveV3Draft(r.draft) ? r.draft.sections.find(s => s.id === "love")?.blocks.find(b => b.kind === "context")?.action : undefined);
  expect(actions.every(Boolean)).toBe(true); expect(new Set(actions).size).toBe(3);
});
it("validates reordered snapshot JSON, and rejects unsupported facts or altered customer copy", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const result = await generate(payload); expect(result.ok).toBe(true); if (!result.ok) return;
  const reordered = (v: unknown): unknown => Array.isArray(v) ? v.map(reordered) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, reordered(x)])) : v;
  expect(validateProductPublication("saju_mbti_full", reordered(result.draft), reordered(result.evidencePacket)).ok).toBe(true);
  const bad = structuredClone(result.draft) as { direction: string };
  bad.direction = "천을귀인으로 반드시 부자가 됩니다.";
  expect(validateProductPublication("saju_mbti_full", bad, result.evidencePacket).ok).toBe(false);
  const packet = structuredClone(result.evidencePacket) as { comprehensiveV3: { facts: Evidence[] } };
  packet.comprehensiveV3.facts.push({ ...packet.comprehensiveV3.facts[0], id: "unsupported", featureId: "invented" });
  expect(validateProductPublication("saju_mbti_full", result.draft, packet).errors).toContain("V3_FACTS_MISMATCH");
});
it("unknown birth time keeps professional facts but never publishes weighted lifestyle guidance", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const result = await generate({ ...payload, person: { ...payload.person, birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown" } });
  expect(result.ok, JSON.stringify(result)).toBe(true); if (!result.ok || !isComprehensiveV3Draft(result.draft)) return;
  expect(result.draft.sections.some(s => s.id === "balance")).toBe(false);
  expect(result.draft.profileTable.hourPillar ?? "").toBe("");
});
it("keeps V2 snapshot publication and renderer available for the same input", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const result = await generateProductReport(payload, runtime, "deterministic_fallback", undefined, { comprehensiveVersion: "v2" });
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(validateProductPublication("saju_mbti_full", result.draft, result.evidencePacket).ok).toBe(true);
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV2View, { draft: result.draft as ComprehensiveReportV2Draft, evidencePacket: result.evidencePacket }));
  expect(html).not.toContain("리포트를 준비하고 있습니다");
  expect(html).not.toContain("comprehensive_v3.1");
  const v3 = await generate(payload);
  expect(v3.ok).toBe(true); if (!v3.ok || !isComprehensiveV3Draft(v3.draft)) return;
  const v2 = result.draft as ComprehensiveReportV2Draft;
  const packet = result.evidencePacket as ComprehensiveReportEvidencePacket;
  const good = getCanonicalNatalTable(result.evidencePacket)!.features.filter(f => f.category === "gwiin" || ["sinsal_dohwa", "sinsal_hongyeom", "twelve_sinsal_banan"].includes(f.id));
  const blocks = [...v3.draft.opening, ...v3.draft.sections.flatMap(s => s.blocks)];
  const v3facts = (v3.evidencePacket as { comprehensiveV3: { facts: readonly Evidence[] } }).comprehensiveV3.facts;
  const used = new Set(blocks.filter(b => b.action).flatMap(b => b.evidenceRefs));
  process.stdout.write(JSON.stringify({ legacyShapeComparison: {
    v2: { compound: packet.narrativePlan!.themes.filter(t => new Set(t.sajuEvidenceIds).size >= 2).length,
      fusion: new Set(packet.narrativePlan!.sections.flatMap(s => s.interactionIds)).size,
      context: 0, positive: good.filter(f => v2.sajuFeatureChapter?.items.some(i => f.aliases.includes(i.rawLabel) && i.practicalUse)).length },
    v3: { compound: blocks.filter(b => b.kind === "compound").length,
      fusion: blocks.filter(b => b.evidenceRefs.some(id => v3facts.some(f => f.id === id && f.kind === "mbti"))).length,
      context: blocks.filter(b => b.kind === "context").length,
      positive: good.filter(f => used.has(`person:natal:${f.id}`)).length },
  } }) + "\n");
});
