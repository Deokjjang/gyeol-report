import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, it, expect } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildComprehensiveV3Legacy, comprehensiveV3CustomerText, isComprehensiveV3Draft, type ComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { composeComprehensiveV31, comprehensiveSelectionTrace, ENRICHED_COMPREHENSIVE_VERSION } from "../../../src/lib/interpretation-v3/comprehensiveComposition";
import { comprehensiveCandidates } from "../../../src/lib/interpretation-v3/comprehensive";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";
import { featureRows, SIGNAL_STORIES } from "../../../src/lib/interpretation-v3/comprehensiveEditorial";
import { ATOMIC_BY_ID, ATOMIC_REGISTRY } from "../../../src/lib/interpretation-v3/atomicRegistry";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { validateV3Copy } from "../../../src/lib/interpretation-v3/engine";
import { getCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { ComprehensiveReportV3View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV3View";
import type { Evidence } from "../../../src/lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../src/lib/saju/types";

const runtime = { enabled: false, reason: "flag_disabled" } as const;
const generate = (payload: unknown) => generateProductReport(payload, runtime, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
type Packet = { comprehensiveV3: { calculation: SajuCalcResult; facts: Evidence[] } };
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
// Captured from 2e13ed9 before editing: a byte-for-byte guard for stored V3 drafts.
const LEGACY_HASHES: Record<string, string> = {
  A: "bb0f305e272dcde35fb9de75ca57139c2d4b55d03d710affb5f049094be6a0b1",
  B: "72d09797d2a41e587f6d4414a9a08de3ee6b0eeb892449ecbadde73c0e6edd6c",
  C: "f9efc6d20351249c58367a7ffa890da70062df12686c0ae24808a5892cc98706",
  D: "58f8c4f20f6fa7d0073ad8aea7c44ef28cad4a82de3a280965dd120508280ff8",
  E: "66e05a5994cbe1a20abca32570ac47abcf3494130eb38918720329ae7f8251f1",
};
function metrics(draft: ComprehensiveV3Draft, facts: readonly Evidence[]) {
  const blocks = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)];
  const main = draft.sections.flatMap(s => s.blocks);
  // Meaningful interactions only: context/summary reuse is not another fusion.
  const fusions = new Set(blocks.filter(b => (b.kind === "fusion" || b.kind === "compound") && b.evidenceRefs.some(id => facts.some(f => f.id === id && f.kind === "mbti"))).map(b => b.id === "portrait" ? b.compoundId : b.id));
  const compounds = new Set(blocks.flatMap(b => b.compoundIds ?? (b.compoundId ? [b.compoundId] : b.kind === "compound" ? [b.id] : [])));
  const used = new Set([...blocks.flatMap(b => b.evidenceRefs), ...draft.patterns.flatMap(p => p.evidenceRefs)]);
  const text = comprehensiveV3CustomerText(draft);
  const sentences = text.split(/[.!?]\s*|\n+/u).map(s => s.replace(/\s+/gu, " ").trim()).filter(s => s.length >= 40);
  return { chars: text.length, repeated40: sentences.length - new Set(sentences).size, questions: (text.match(/\?/g) ?? []).length,
    compound: compounds.size, fusion: fusions.size, context: main.filter(b => b.kind === "context").length,
    positive: new Set(main.flatMap(b => b.positiveFeatureIds ?? [])).size,
    uniqueFeatures: new Set(facts.filter(f => used.has(f.id) && ATOMIC_BY_ID.has(f.featureId)).map(f => f.featureId)).size,
    hedges: (text.match(/가능성이 있습니다|일 수도 있습니다|로 볼 수 있습니다|처럼 나타날 수 있습니다|수 있습니다/gu) ?? []).length,
    safety: (text.match(/안전 안내|참고 자료|보장하지 않|단정할 수 없/gu) ?? []).length };
}
afterEach(() => expect(fetch).not.toHaveBeenCalled());
it.each(COMPREHENSIVE_V3_FIXTURES)("%s enriched: sources, prose, density, SSR and selection trace", async (...row) => {
  const { payload, id } = comprehensiveFixture(row);
  const result = await generate(payload);
  expect(result.ok, JSON.stringify(result.ok ? null : result)).toBe(true);
  if (!result.ok || !isComprehensiveV3Draft(result.draft)) return;
  const draft = result.draft, packet = result.evidencePacket as Packet, facts = packet.comprehensiveV3.facts;
  expect(draft.version).toBe(ENRICHED_COMPREHENSIVE_VERSION);
  expect(validateProductPublication("saju_mbti_full", draft, packet)).toEqual({ ok: true, errors: [] });
  expect(result.externalCalls).toEqual([]);
  const paragraphs = draft.opening.flatMap(b => b.paragraphs ?? []);
  expect(paragraphs.length).toBeGreaterThanOrEqual(3); expect(paragraphs.length).toBeLessThanOrEqual(6);
  expect(draft.opening.every(b => !b.headline && !b.reading && !b.action && !b.why)).toBe(true);
  expect(draft.direction.split("\n\n")).toHaveLength(4);
  const body = comprehensiveV3CustomerText(draft), m = metrics(draft, facts);
  expect(m.repeated40).toBe(0); expect(m.hedges).toBe(0); expect(m.safety).toBe(0);
  expect(m.questions).toBeLessThanOrEqual(3);
  expect(validateV3Copy(body)).toEqual([]);
  const sections = new Map(draft.sections.map(s => [s.id, s]));
  expect(sections.has("money")).toBe(true);
  for (const id of ["people", "love"]) expect(sections.get(id)?.blocks.map(b => [...(b.paragraphs ?? []), b.action].join(" ")).join(" ").length).toBeGreaterThan(300);
  const giftCount = sections.get("gifts")?.blocks.length ?? 0;
  const eligibleGood = new Set(facts.filter(f => f.certainty === "confirmed" && SIGNAL_STORIES[f.featureId] && (f.kind === "gwiin" || ["twelve_sinsal_jangseong", "twelve_sinsal_hwagae", "sinsal_dohwa", "sinsal_hongyeom", "sinsal_cheonmunseong"].includes(f.featureId))).map(f => f.featureId));
  expect(giftCount).toBeGreaterThanOrEqual(Math.min(3, eligibleGood.size)); expect(giftCount).toBeLessThanOrEqual(5);
  const allRefs = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)].flatMap(b => b.evidenceRefs);
  for (const ref of [...allRefs, ...draft.directionEvidenceRefs, ...draft.patterns.flatMap(p => p.evidenceRefs)]) expect(facts.some(f => f.id === ref), ref).toBe(true);
  const rows = featureRows(facts);
  expect(new Set(rows.map(r => r.featureId)).size).toBe(rows.length);
  for (const f of facts.filter(f => f.kind === "gwiin" || f.kind === "shinsal")) if (ATOMIC_BY_ID.has(f.featureId)) expect(rows.some(r => r.featureId === f.featureId)).toBe(true);
  const trace = comprehensiveSelectionTrace(facts, draft);
  expect(trace).toHaveLength(ATOMIC_REGISTRY.length);
  for (const t of trace) { expect(t.reason).toBeTruthy(); expect(t.observed).toBe(facts.some(f => f.featureId === t.featureId)); }
  for (const f of facts.filter(f => ["sinsal_dohwa", "sinsal_hongyeom"].includes(f.featureId))) {
    expect(sections.get("love")?.blocks.some(b => b.evidenceRefs.includes(f.id))).toBe(true);
  }
  for (const block of sections.get("balance")?.blocks ?? []) {
    expect(block.ideas?.length).toBeGreaterThanOrEqual(2); expect(block.ideas?.length).toBeLessThanOrEqual(5);
    expect(block.evidenceRefs.every(id => facts.some(f => f.id === id && f.kind === "element" && f.certainty === "confirmed"))).toBe(true);
  }
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: packet }));
  expect(html).not.toContain("리포트를 준비하고 있습니다");
  expect(html.match(/aria-expanded="false"/g)).toHaveLength(payload.person.mbtiType ? 2 : 1);
  expect(html.indexOf("data-v31-elements")).toBeLessThan(html.indexOf('id="v3-core"'));
  expect(html).not.toContain("전체 원국 표식과 해석 근거");
  expect(html).not.toContain("오행 · 전체 원국 표식 · 합충형파해");
  expect(html.match(/data-v31-integrated/g)).toHaveLength(1);
  expect(html).toContain("계산 기준 자세히 보기");
  expect(html).not.toMatch(/<details[^>]*\sopen(?:[=>\s])/);
  if (process.env.V31_REVIEW_OUTPUT === "1") {
    writeFileSync("/tmp/gyeol-v31-after-" + id + ".json", JSON.stringify(result));
    writeFileSync("/tmp/gyeol-v31-after-" + id + ".txt", body);
    writeFileSync("/tmp/gyeol-v31-trace-" + id + ".json", JSON.stringify(trace, null, 2));
  }
  process.stdout.write(JSON.stringify({ fixture: id, ...m, gifts: giftCount, patterns: draft.patterns.length, directionChars: draft.direction.length }) + "\n");
});
it.each(COMPREHENSIVE_V3_FIXTURES.filter(r => r[0] !== "F"))("%s stored Phase 2 V3 retains its exact draft and publishes", async (...row) => {
  const { payload, id } = comprehensiveFixture(row);
  const result = await generate(payload);
  expect(result.ok).toBe(true); if (!result.ok || !isComprehensiveV3Draft(result.draft)) return;
  const packet = structuredClone(result.evidencePacket) as Packet;
  packet.comprehensiveV3.facts = packet.comprehensiveV3.facts.filter(f => !f.featureId.endsWith("_weak"));
  const draft = buildComprehensiveV3Legacy({ name: payload.person.name, facts: packet.comprehensiveV3.facts,
    context: normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob, relationshipStatus: payload.userContext.relationshipStatus }),
    relationshipStatus: payload.userContext.relationshipStatus, profileTable: result.draft.profileTable });
  expect(hash(draft)).toBe(LEGACY_HASHES[id]);
  expect(validateProductPublication("saju_mbti_full", draft, packet)).toEqual({ ok: true, errors: [] });
  expect(renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: packet }))).not.toContain("리포트를 준비하고 있습니다");
});
it("Gaon: canonical metal weak, genuine multi-scene fusion and complete selected-feature audit", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const r = await generate(payload); expect(r.ok).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) return;
  const { calculation, facts } = (r.evidencePacket as Packet).comprehensiveV3;
  expect(calculation.elements.visible.METAL).toBe(0); expect(calculation.elements.weighted.METAL).toBe(0.2);
  expect(calculation.elements.labels).toContain("METAL_WEAK");
  const metal = r.draft.sections.find(s => s.id === "balance")?.blocks.find(b => b.id === "balance:metal");
  expect(metal?.ideas?.join(" ")).toMatch(/웨이트 트레이닝/);
  expect(metal?.paragraphs?.join(" ")).toContain("약함");
  expect(metal?.paragraphs?.join(" ")).not.toContain("없음");
  expect(metrics(r.draft, facts).fusion).toBeGreaterThan(3);
  expect(metrics(r.draft, facts).compound).toBeGreaterThan(7);
  expect(r.draft.direction).toContain("이번 주");
  const trace = comprehensiveSelectionTrace(facts, r.draft);
  for (const id of ["sinsal_baekho", "sinsal_yangin", "twelve_sinsal_yeokma", "twelve_sinsal_jangseong", "twelve_sinsal_banan", "gwiin_cheoneul", "gwiin_cheondeok", "twelve_sinsal_hwagae", "gwiin_jaego", "sinsal_cheonmunseong", "shinsal:GOSINSAL"]) {
    const row = trace.find(t => t.featureId === id);
    expect(row?.observed, id).toBe(true); expect(row?.reason).toBeTruthy();
  }
  expect(trace.find(t => t.featureId === "gwiin_cheondeok")?.decision).toBe("table-only");
  expect(comprehensiveV3CustomerText(r.draft)).not.toMatch(/도화|홍염/);
  // A type string alone cannot retain the newly authored ENTJ scenes.
  const withoutTraits = facts.filter(f => !f.featureId.includes(":traits:"));
  const noFusion = composeComprehensiveV31({ name: payload.person.name, facts: withoutTraits,
    context: normalizeContext({ lifeStatus: "employee" }), relationshipStatus: "dating", profileTable: r.draft.profileTable },
  comprehensiveCandidates(withoutTraits, true));
  expect(noFusion.sections.flatMap(s => s.blocks).some(b => b.id.startsWith("composition:entj-"))).toBe(false);
});
it("fixtures really contain the targeted signals; no invented attraction or strength score", async () => {
  for (const index of [0, 2, 3, 4, 5]) {
    const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[index]);
    const r = await generate(payload); expect(r.ok).toBe(true); if (!r.ok) continue;
    const natal = getCanonicalNatalTable(r.evidencePacket)!;
    if (index === 0) expect(natal.features.filter(f => f.category === "gwiin").length).toBeGreaterThanOrEqual(3);
    if (index === 2) expect(natal.features.map(f => f.id)).toEqual(expect.arrayContaining(["ten_god_zheng_cai", "ten_god_pian_cai"]));
    if (index === 3) expect(natal.features.map(f => f.id)).toEqual(expect.arrayContaining(["sinsal_dohwa", "sinsal_hongyeom"]));
    if (index === 4) expect((r.evidencePacket as Packet).comprehensiveV3.facts.some(f => f.kind === "mbti")).toBe(false);
    if (index === 5) expect(new Set(natal.features.filter(f => /yeokma/.test(f.id)).flatMap(f => f.positions)).size).toBeGreaterThanOrEqual(2);
  }
});
it("rejects edits to rich prose, ideas, folded facts and evidence instead of bypassing validation", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const r = await generate(payload); expect(r.ok).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) return;
  const bad = structuredClone(r.draft) as unknown as { opening: { paragraphs: string[] }[]; sections: { blocks: { ideas?: string[] }[] }[] };
  bad.opening[0].paragraphs[0] += " 반드시 승진합니다.";
  expect(validateProductPublication("saju_mbti_full", bad, r.evidencePacket).ok).toBe(false);
  const packet = structuredClone(r.evidencePacket) as Packet;
  packet.comprehensiveV3.facts = packet.comprehensiveV3.facts.map(f => f.featureId === "element_metal_weak" ? { ...f, certainty: "weak" } : f);
  expect(validateProductPublication("saju_mbti_full", r.draft, packet).ok).toBe(false);
  const editedIdeas = structuredClone(r.draft) as unknown as typeof bad;
  const balance = editedIdeas.sections.flatMap(s => s.blocks).find(b => b.ideas);
  balance!.ideas![0] = "매일 하면 돈이 반드시 들어옵니다.";
  expect(validateProductPublication("saju_mbti_full", editedIdeas, r.evidencePacket).ok).toBe(false);
});
