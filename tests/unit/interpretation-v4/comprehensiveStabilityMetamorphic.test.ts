import { beforeAll, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import * as manuscript from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";

const original = singleRuntimeInput("saju_mbti_full", "saju-mbti-full", {
  id: "stability-metamorphic", name: "준호", date: "1989-09-21", time: "17:40", gender: "MALE", mbti: "INTP",
  context: { jobStatus: "freelancer", detailJob: "프리랜서 번역가", relationshipStatus: "single" },
});
async function generate(payload: typeof original) {
  const spy = vi.spyOn(manuscript, "renderComprehensiveManuscript");
  try {
    const result = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    const input = spy.mock.calls.at(-1)?.[0];
    const rendered = spy.mock.results.at(-1)?.value as ReturnType<typeof manuscript.renderComprehensiveManuscript> | undefined;
    expect(result.ok, JSON.stringify({ codes: result.ok ? [] : result.error.message,
      hard: rendered?.ok ? rendered.draft.validation.hardViolations : [] })).toBe(true);
    if (!result.ok || !input || !rendered?.ok) return expect.unreachable("SUPPORTED_PUBLICATION_REQUIRED");
    const e = result.evidencePacket as V4RuntimeEvidence;
    expect(validateV4Publication(e.productType, result.draft, e)).toEqual({ ok: true, errors: [] });
    expect(rendered.draft.validation.hardViolations).toEqual([]);
    expect(result.externalCalls).toEqual([]);
    return { result, evidence: e, input, draft: rendered.draft,
      sentences: Object.values(rendered.draft.sections).flatMap(s => s.blocks.flatMap(b => b.sentences)) };
  } finally { spy.mockRestore(); }
}
let baseline: Awaited<ReturnType<typeof generate>>;
beforeAll(async () => { baseline = await generate(original); }, 120000);
it("same input and explicit clock produce identical draft and evidence", async () => {
  const again = await generate(structuredClone(original));
  expect(again.result).toEqual(baseline.result);
  expect(again.draft).toEqual(baseline.draft);
}, 120000);
it("name-only change preserves calculated evidence and required publication roles", async () => {
  const payload = structuredClone(original); payload.person.name = "다른표시이름";
  const changed = await generate(payload);
  expect(changed.input.profiles.myeongli).toEqual(baseline.input.profiles.myeongli);
  expect(changed.input.plan).toEqual(baseline.input.plan);
}, 120000);
it("MBTI unknown removes MBTI evidence without guessing a replacement", async () => {
  const payload = structuredClone(original); payload.person.mbtiType = "";
  const changed = await generate(payload);
  expect(changed.input.profiles.mbti.available).toBe(false);
  expect(changed.evidence.mbtiTables.person).toBeNull();
  expect(changed.sentences.every(s => !s.mbtiSourceNodeIds.length && !s.explicitMbtiMention)).toBe(true);
}, 120000);
it("unknown time removes hour provenance without inventing a pillar", async () => {
  const payload = structuredClone(original);
  Object.assign(payload.person, { birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" });
  const changed = await generate(payload);
  expect(changed.sentences.every(s => s.evidenceIds.every(id => !id.includes(":hour:")))).toBe(true);
  expect(changed.evidence.calculations.person.pillars.hour).toBeFalsy();
}, 120000);
