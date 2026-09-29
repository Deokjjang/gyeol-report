import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, afterEach } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { buildComprehensiveV31, buildComprehensiveV32, comprehensiveCandidates, comprehensiveV3CustomerText, isComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { STORY_COMPREHENSIVE_VERSION, storyFeatureRows, validateStoryCopy, storySelectionTrace } from "../../../src/lib/interpretation-v3/comprehensiveStorytelling";
import { compoundProminence, storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { ATOMIC_BY_ID } from "../../../src/lib/interpretation-v3/atomicRegistry";
import { ComprehensiveReportV3View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV3View";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";
import type { Evidence } from "../../../src/lib/interpretation-v3/types";
import type { SajuCalcResult } from "../../../src/lib/saju/types";
import type { ComprehensiveV3Draft, ComprehensiveV3Input } from "../../../src/lib/interpretation-v3/comprehensive";

const runtime = { enabled: false, reason: "flag_disabled" } as const;
// Frozen V3.2 story contract. Phase 2D has a separate current-version suite.
const generate = async (payload: unknown) => {
  const result = await generateProductReport(payload, runtime, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
  if (!result.ok || !isComprehensiveV3Draft(result.draft)) return result;
  const p = payload as ReturnType<typeof comprehensiveFixture>["payload"], packet = result.evidencePacket as Packet;
  return { ...result, draft: buildComprehensiveV32({ name: p.person.name, facts: packet.comprehensiveV3.facts, calculation: packet.comprehensiveV3.calculation,
    context: normalizeContext({ lifeStatus: p.userContext.jobStatus, fieldLabel: p.userContext.detailJob, relationshipStatus: p.userContext.relationshipStatus }),
    relationshipStatus: p.userContext.relationshipStatus, profileTable: result.draft.profileTable }) };
};
type Packet = { comprehensiveV3: { facts: Evidence[]; calculation: SajuCalcResult } };
const hashes = ["d4238ca8da718d5cbef2aba78c7572e48f2d9d08c1914b28f0b2f81f9a0ffd51", "620fea0225216fce6ccb242a93cc6cac9b1f656c65c5e555fc855adc01f00ce2", "d791f44291eab6125e09114db0d9327b43bc9ec65baf7482c5b3e694243c2cc9", "9c15ab6f86bc7d503b4e1d63bb5701d6538026d6a5f6ec6af7aaaea9432ea4ad", "34841df442eef474b969a8e773ea2e249993497cddd79d7a03e6a8b4c6d317dc", "6036aa009f920a32acbea48a2dbe1a710e82ada78862d08e8e37e98392f1fa90"];
const sha = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
export function storyMetrics(draft: ComprehensiveV3Draft, facts: readonly Evidence[], input: ComprehensiveV3Input & { calculation: SajuCalcResult }) {
  const blocks = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)], text = comprehensiveV3CustomerText(draft);
  const compound = new Set(blocks.flatMap(b => b.compoundIds ?? (b.compoundId ? [b.compoundId] : b.kind === "compound" ? [b.id] : [])));
  const sentences = text.split(/[.!?]\s*|\n+/u).map(s => s.replace(/\s+/gu, " ").trim()).filter(s => s.length >= 40);
  const used = new Set([...blocks.flatMap(b => b.evidenceRefs), ...draft.patterns.flatMap(p => p.evidenceRefs)]);
  const candidateProminence = new Map(comprehensiveCandidates(facts, true).filter(b => b.kind === "compound").map(b => [b.id, compoundProminence(b, input).prominence]));
  const strongIds = [...compound].filter(id => candidateProminence.get(id) === "hero" || blocks.some(b => b.compoundId === id && b.prominence === "hero"));
  const discoveries = blocks.flatMap(b => b.discoveryKey ? [b.discoveryKey] : []);
  return { chars: text.length, compound: compound.size, strongCompounds: strongIds.length,
    weakCompoundPromotions: [...compound].filter(id => candidateProminence.get(id) === "supporting").length,
    fusion: new Set(blocks.filter(b => ["compound", "fusion"].includes(b.kind) && b.evidenceRefs.some(id => facts.some(f => f.id === id && f.kind === "mbti"))).map(b => b.compoundId ?? b.id)).size,
    features: new Set(facts.filter(f => used.has(f.id) && ATOMIC_BY_ID.has(f.featureId) && ["day_pillar", "ten_god", "gwiin", "shinsal"].includes(f.kind)).map(f => f.featureId)).size,
    questions: (text.match(/\?/g) ?? []).length, repeated40: sentences.length - new Set(sentences).size,
    modes: new Set(blocks.map(b => b.writingMode).filter(Boolean)).size,
    gifts: draft.sections.find(s => s.id === "gifts")?.blocks.length ?? 0,
    repeatedDiscoveries: discoveries.length ? discoveries.length - new Set(discoveries).size : null };
}
afterEach(() => expect(fetch).not.toHaveBeenCalled());
it.each(COMPREHENSIVE_V3_FIXTURES)("%s V3.2 generation, source/style/variety, old snapshot compatibility", async (...row) => {
  const { payload, id } = comprehensiveFixture(row), r = await generate(payload);
  expect(r.ok, JSON.stringify(r.ok ? null : r)).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) return;
  const { facts, calculation } = (r.evidencePacket as Packet).comprehensiveV3;
  const input = { name: payload.person.name, facts, calculation, profileTable: r.draft.profileTable, context: normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob, relationshipStatus: payload.userContext.relationshipStatus }), relationshipStatus: payload.userContext.relationshipStatus };
  const before = buildComprehensiveV31(input), draft = r.draft;
  expect(sha(before)).toBe(hashes[id.charCodeAt(0) - 65]);
  expect(validateProductPublication("saju_mbti_full", before, r.evidencePacket).ok).toBe(true);
  expect(renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft: before, evidencePacket: r.evidencePacket }))).not.toContain("리포트를 준비하고 있습니다");
  expect(draft.version).toBe(STORY_COMPREHENSIVE_VERSION);
  expect(validateProductPublication("saju_mbti_full", draft, r.evidencePacket)).toEqual({ ok: true, errors: [] });
  const text = comprehensiveV3CustomerText(draft), m = storyMetrics(draft, facts, input);
  if (process.env.V32_REVIEW_OUTPUT === "1") { writeFileSync(`/tmp/gyeol-v32-${id}.json`, JSON.stringify(r)); writeFileSync(`/tmp/gyeol-v32-${id}.txt`, text); }
  expect(validateStoryCopy(text)).toEqual([]);
  expect(m.repeated40).toBe(0); expect(m.repeatedDiscoveries).toBe(0); expect(m.modes).toBeGreaterThanOrEqual(7);
  expect(m.questions).toBeGreaterThanOrEqual(2); expect(m.questions).toBeLessThanOrEqual(4);
  const blocks = [...draft.opening, ...draft.sections.flatMap(s => s.blocks)];
  expect(blocks.some((b, i) => i > 0 && b.writingMode === blocks[i - 1].writingMode)).toBe(false);
  for (const b of blocks) { expect(b.evidenceRefs.every(id => facts.some(f => f.id === id))).toBe(true); expect(b.labels.length).toBeLessThanOrEqual(b.id.startsWith("portrait") ? 7 : 4); }
  for (const section of draft.sections) expect(section.blocks.some(b => b.discoveryKey)).toBe(true);
  expect(draft.opening.flatMap(b => b.paragraphs ?? []).length).toBeGreaterThanOrEqual(4);
  expect(draft.opening[0].paragraphs?.join(" ")).not.toMatch(/상사|담당자|승인|제안서|조직의 방향|공식 역할/);
  expect(draft.direction.split("\n\n")).toHaveLength(4);
  expect(draft.direction.split("\n\n").at(-1)).not.toMatch(/상사|업무|담당자/);
  for (const name of ["love", "people"]) {
    const section = draft.sections.find(s => s.id === name);
    expect(section?.blocks.some(b => (b.paragraphs?.length ?? 0) > 0 && b.action)).toBe(true);
    expect(section?.blocks.every(b => b.evidenceRefs.length >= 1 && b.labels.length <= 4)).toBe(true);
  }
  const rows = storyFeatureRows(facts, calculation);
  expect(validateStoryCopy(rows.map(r => r.meaning + " " + r.power).join(" "))).toEqual([]);
  expect(new Set(rows.map(r => r.featureId)).size).toBe(rows.length);
  expect(rows.some(r => r.featureId.startsWith("structure:"))).toBe(true);
  expect(rows.some(r => r.featureId.includes("COMBINATION") || r.featureId.includes("CLASH"))).toBe(true);
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: r.evidencePacket }));
  expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(html.indexOf("내 명리에 있는 주요 기운")).toBeLessThan(html.indexOf("대담한 통솔자") < 0 ? Infinity : html.indexOf("대담한 통솔자"));
  expect(html).not.toMatch(/계산 기준|근거 더 보기|전문 근거|천간·지장간의 십성|원국 전체의 파생 근거/u); expect(html).not.toContain("data-v31-elements"); expect(html).not.toContain("data-story-elements"); // inside collapsed Manse client slot
  expect(html.match(/aria-expanded="false"/g)).toHaveLength(payload.person.mbtiType ? 2 : 1);
  const trace = storySelectionTrace(input, comprehensiveCandidates(facts, true), draft);
  expect(trace.filter(t => t.prominence === "supporting" && t.sections.length)).toEqual([]);
  for (const b of blocks.filter(b => b.kind === "compound" && b.prominence === "hero")) {
    expect(compoundProminence(b, input).prominence, b.id).toBe("hero");
  }
  if (id === "A") {
    expect(trace.find(t => t.id === "pair:pian_cai+zheng_cai")?.prominence).toBe("supporting");
    expect(trace.find(t => t.id === "pair:pian_cai+zheng_cai")?.supports.map(s => s.weight)).toEqual([0.1, 0.1]);
    expect(draft.sections.find(s => s.id === "money")?.blocks[0].compoundId).not.toBe("pair:pian_cai+zheng_cai");
    expect(text).not.toContain("회사에서는 일정표"); expect(text).toContain("감정에도 정답을 요구할 때");
  }
  if (id === "D" || id === "E") expect(storySupport("sinsal_hyeonchim", facts, calculation).positions.length).toBeGreaterThanOrEqual(2);
  if (id === "D") expect(draft.sections.find(s => s.id === "love")?.blocks.find(b => b.compoundId === "story:attraction")?.prominence).toBe("supporting"); // confirmed mark, but no direct dohwa position in current canonical output
  if (id === "E") expect(m.fusion).toBe(0);
  if (process.env.V32_REVIEW_OUTPUT === "1") { writeFileSync(`/tmp/gyeol-v32-${id}.json`, JSON.stringify(r)); writeFileSync(`/tmp/gyeol-v32-${id}.txt`, text); writeFileSync(`/tmp/gyeol-v32-trace-${id}.json`, JSON.stringify(trace, null, 2)); }
  process.stdout.write(JSON.stringify({ id, before: storyMetrics(before, facts, input), after: m }) + "\n");
});
it("minor-only pair never becomes hero through duplicate evidence or a job label", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]), r = await generate(payload);
  expect(r.ok).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) return;
  const { facts, calculation } = (r.evidencePacket as Packet).comprehensiveV3;
  const pair = comprehensiveCandidates(facts, true).find(b => b.id === "pair:pian_cai+zheng_cai")!;
  for (const job of ["employee", "business_owner"]) {
    const input = { name: "가온", facts: [...facts, ...facts.filter(f => pair.evidenceRefs.includes(f.id)).map(f => ({ ...f, id: f.id + ":duplicate" }))], calculation, context: normalizeContext({ lifeStatus: job }), relationshipStatus: "dating", profileTable: r.draft.profileTable };
    expect(compoundProminence(pair, input).prominence).toBe("supporting");
  }
});
it("new story and mode metadata remain within deterministic publication validation", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]), r = await generate(payload);
  expect(r.ok).toBe(true); if (!r.ok || !isComprehensiveV3Draft(r.draft)) return;
  const bad = structuredClone(r.draft) as unknown as { opening: { paragraphs: string[]; writingMode: string }[] };
  bad.opening[0].paragraphs[0] += " 만들 수 있습니다.";
  expect(validateProductPublication("saju_mbti_full", bad, r.evidencePacket).ok).toBe(false);
  expect(validateStoryCopy("기회가 열릴 수 있습니다.")).not.toEqual([]);
  bad.opening[0].writingMode = "invented";
  expect(validateProductPublication("saju_mbti_full", bad, r.evidencePacket).ok).toBe(false);
});
