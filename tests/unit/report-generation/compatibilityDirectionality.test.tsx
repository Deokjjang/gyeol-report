import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { generateCompatibilityProductDraft } from "../../../src/lib/report-generation/compatibilityGenerationHandler";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { generateCompatibilityReportDraft } from "../../../src/lib/report-generation/openaiCompatibilityReportWriter";
import { sanitizeCompatibilityVisibleText } from "../../../src/lib/report-generation/compatibilityReportDraftValidator";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import type { CompatibilityGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";
import { compatibilityRelationshipTypes } from "../../../src/lib/report-knowledge/compatibilityTypes";
import { getMbtiRelationshipPair } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";

const personA = { name: "가람", birthDate: "1999-07-31", birthTime: "07:30", birthTimeUnknown: false,
  approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ", calendarType: "solar", timezone: "Asia/Seoul" } as const;
const personB = { ...personA, name: "나래", birthDate: "1996-12-06", birthTime: "14:15", gender: "FEMALE", mbtiType: "INTP" } as const;
function input(category: CompatibilityGenerationInput["relationshipType"] = "love", types: readonly CompatibilityGenerationInput["personA"]["mbtiType"][] = ["ENTJ", "INTP"], swap = false): CompatibilityGenerationInput {
  const a = { ...personA, mbtiType: types[0] };
  const b = { ...personB, mbtiType: types[1] };
  return { kind: "compatibility", productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: category,
    personA: swap ? b : a, personB: swap ? a : b, productOptions: {} };
}
async function generate(value = input()) {
  const result = await generateCompatibilityProductDraft(value);
  expect(result.ok, JSON.stringify(result)).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  expect(validateProductPublication("saju_mbti_compatibility", result.draft, result.evidencePacket)).toEqual({ ok: true, errors: [] });
  return result;
}
function render(draft: Awaited<ReturnType<typeof generate>>["draft"]) {
  return renderToStaticMarkup(createElement(CompatibilityReportView, { draft }));
}
function symmetricBranchFacts(packet: Awaited<ReturnType<typeof generate>>["evidencePacket"]) {
  return [...new Set(packet.sajuCompatibility.branchInteractions.flatMap((item) => item.split(" · ")))].sort();
}

describe("compatibility person, direction and unassigned domain roles", () => {
  for (const types of [["ENTJ", "INTP"], ["ISFJ", "ENFP"], ["INTP", "INTP"], ["", "ENFP"], ["", ""]] as const) {
    for (const category of compatibilityRelationshipTypes) {
      it(`${types.join("/")} ${category}: swap preserves people and reverses only direction`, async () => {
        const forward = await generate(input(category, types));
        const reverse = await generate(input(category, types, true));
        const f = forward.evidencePacket.directionEvidence;
        const r = reverse.evidencePacket.directionEvidence;
        expect(f.persons.personA).toEqual(r.persons.personB);
        expect(f.persons.personA.mbti).toBe(types[0] || null);
        expect(f.persons.personB.mbti).toBe(types[1] || null);
        if (!types[0]) expect(f.persons.personA.traits).toEqual([]);
        if (!types[1]) expect(f.persons.personB.traits).toEqual([]);
        expect(f.persons.personB).toEqual(r.persons.personA);
        expect(f.aToB).toEqual(r.bToA);
        for (const direction of [f.aToB, f.bToA]) {
          const owner = direction.subjectPerson === f.persons.personA.personId ? f.persons.personA : f.persons.personB;
          expect(direction.bridgeContext.subjectPerson).toBe(owner.personId);
          for (const id of direction.bridgeContext.subjectScenes) {
            const scene = owner.bridgeScenes.find(scene => scene.interactionId === id)!;
            expect(scene).toBeDefined();
            if (category !== "love" && category !== "marriage") expect(scene.contexts.some(c => c === "love" || c === "marriage")).toBe(false);
          }
        }
        expect(f.bToA).toEqual(r.aToB);
        expect(symmetricBranchFacts(forward.evidencePacket)).toEqual(symmetricBranchFacts(reverse.evidencePacket));
        expect(forward.evidencePacket.mbtiCompatibility.sharedGround).toEqual(reverse.evidencePacket.mbtiCompatibility.sharedGround);
        expect(forward.evidencePacket.score.totalScore).toBe(reverse.evidencePacket.score.totalScore);
        expect(forward.draft.relationshipAnalysis.aToBFatigue).toBe(reverse.draft.relationshipAnalysis.bToAFatigue);
        expect(forward.draft.relationshipAnalysis.bToAFatigue).toBe(reverse.draft.relationshipAnalysis.aToBFatigue);
        const kind = category === "parentChild" || category === "managerReport" ? "role-asymmetric" : "symmetric";
        expect(f.categoryRole).toEqual({ category, kind, assignments: { personA: null, personB: null } });
        const html = render(forward.draft);
        expect(html).toContain("가람"); expect(html).toContain("나래");
        expect(html).not.toContain(f.persons.personA.personId);
        expect(html).not.toContain("님은 해결을 위해 속도를 내지만");
        const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
        expect(plain.length).toBeGreaterThan(5000);
        expect(new Set(plain.split(/(?<=[.!?])\s+/u).filter((s) => s.length >= 40)).size).toBeGreaterThan(50);
      });
    }
  }

  it("a person's profile does not depend on the partner or relationship category", async () => {
    const original = await generate();
    const changed = input("businessPartner", ["ENTJ", "ISFJ"]);
    const alternate = await generate({ ...changed, personB: { ...changed.personB, name: "새봄", birthDate: "1980-05-18", birthTime: "10:15" } });
    expect(original.evidencePacket.directionEvidence.persons.personA).toEqual(alternate.evidencePacket.directionEvidence.persons.personA);
    expect(original.evidencePacket.directionEvidence.aToB.targetPerson).not.toBe(alternate.evidencePacket.directionEvidence.aToB.targetPerson);
  });

  it("original P0: ENTJ communication follows 가람; reverse input never gives it to 나래", async () => {
    const { evidencePacket, draft } = await generate(input("love", ["ENTJ", "INTP"], true));
    expect(evidencePacket.directionEvidence.persons.personB.traits.find((t) => t.area === "communication")?.label).toBe("명료한 주장");
    expect(draft.relationshipAnalysis.bToAFatigue).toContain("가람님의 ENTJ의 명료한 주장");
    expect(draft.relationshipAnalysis.aToBFatigue).toContain("나래님의 INTP의 상시 직설");
    const html = render(draft);
    // DOM paragraph contents follow the existing labels, regardless of Korean subject particle.
    const aSection = html.slice(html.indexOf("A가 B에게 주는 피로"), html.indexOf("B가 A에게 주는 피로"));
    const bSection = html.slice(html.indexOf("B가 A에게 주는 피로"));
    expect(aSection).toContain(draft.relationshipAnalysis.aToBFatigue);
    expect(aSection).not.toContain(draft.relationshipAnalysis.bToAFatigue);
    expect(bSection).toContain(draft.relationshipAnalysis.bToAFatigue);
    expect(html).toContain(draft.relationshipAnalysis.aToBFatigue);
    expect(html).toContain(draft.relationshipAnalysis.bToAFatigue);
  });

  it("keeps independently sourced pair entries and the receiving person's ten-god viewpoint", async () => {
    const { evidencePacket: { directionEvidence: e } } = await generate();
    expect(e.aToB.mbtiPair?.friction).toEqual(getMbtiRelationshipPair("ENTJ", "INTP")?.friction);
    expect(e.bToA.mbtiPair?.friction).toEqual(getMbtiRelationshipPair("INTP", "ENTJ")?.friction);
    expect(e.aToB.mbtiPair?.friction).not.toEqual(e.bToA.mbtiPair?.friction);
    expect(e.aToB.receivedTenGod).toMatchObject({ viewerDayStem: "丁", targetDayStem: "甲", tenGodKo: "정인" });
    expect(e.bToA.receivedTenGod).toMatchObject({ viewerDayStem: "甲", targetDayStem: "丁", tenGodKo: "상관" });
  });

  it("same type retains identical MBTI traits but different actual natal evidence", async () => {
    const { evidencePacket: { directionEvidence: { persons } } } = await generate(input("love", ["INTP", "INTP"]));
    expect(persons.personA.traits.map((t) => t.reading)).toEqual(persons.personB.traits.map((t) => t.reading));
    expect(persons.personA.pillars).not.toEqual(persons.personB.pillars);
    expect(persons.personA.natal.map((t) => t.featureId)).not.toEqual(persons.personB.natal.map((t) => t.featureId));
  });

  it("rejects reversed prose, subject/target, source IDs, person MBTI, and invented domain roles", async () => {
    const result = await generate();
    const reversed = structuredClone(result.draft);
    Object.assign(reversed.relationshipAnalysis, { aToBFatigue: reversed.relationshipAnalysis.bToAFatigue });
    expect(validateProductPublication("saju_mbti_compatibility", reversed, result.evidencePacket).errors).toContain("COMPATIBILITY_DIRECTION_TEXT_MISMATCH");
    for (const mutation of [
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.aToB, { subjectPerson: e.directionEvidence.persons.personB.personId }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.aToB, { evidenceIds: ["invented", "invented"] }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.persons.personA, { mbti: "ISFJ" }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.aToB, { evidenceIds: e.directionEvidence.persons.personA.traits.slice(0, 2).map((t) => t.evidenceId) }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.aToB, { receivedTenGod: e.directionEvidence.bToA.receivedTenGod }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.aToB, { element: e.directionEvidence.bToA.element }),
      (e: typeof result.evidencePacket) => Object.assign(e.directionEvidence.categoryRole.assignments, { personA: "parent" }),
    ]) {
      const e = structuredClone(result.evidencePacket); mutation(e);
      expect(validateProductPublication("saju_mbti_compatibility", result.draft, e).ok).toBe(false);
    }
  });

  it("writer and repair retain both direction sources and never silently rewrite reversed fatigue", async () => {
    const result = await generate(input("friendship", ["ISFJ", "ENFP"], true));
    const draft = structuredClone(result.draft);
    Object.assign(draft, { openingSummary: "함께 보내는 시간과 혼자 쉬는 시간을 합의하면 약속을 지키는 방식도 더 선명해집니다." });
    const bad = structuredClone(draft);
    Object.assign(bad.relationshipAnalysis, { aToBFatigue: draft.relationshipAnalysis.bToAFatigue, bToAFatigue: draft.relationshipAnalysis.aToBFatigue });
    const requests: string[] = [];
    const fetchImpl = vi.fn<typeof fetch>(async (_url, init) => {
      requests.push(String(init?.body));
      return new Response(JSON.stringify({ output_text: JSON.stringify(requests.length === 1 ? bad : draft) }), { status: 200 });
    });
    const written = await generateCompatibilityReportDraft({ evidencePacket: result.evidencePacket,
      config: { enabled: true, apiKey: "sk-test", model: "test-model", fetchImpl } });
    expect(written.repaired).toBe(true); expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(written.draft.openingSummary).toBe(draft.openingSummary);
    expect(written.draft.relationshipAnalysis.aToBFatigue).toBe(draft.relationshipAnalysis.aToBFatigue);
    for (const request of requests) {
      expect(request).toContain(result.evidencePacket.directionEvidence.persons.personA.personId);
      expect(request).toContain(result.evidencePacket.directionEvidence.persons.personB.personId);
      expect(request).toContain("categoryRole");
    }
    expect(requests[1]).toContain("COMPATIBILITY_DIRECTION_TEXT_MISMATCH");
    const plain = sanitizeCompatibilityVisibleText(result.evidencePacket.directionEvidence.aToB.fatigue, written.draft.relationshipType);
    expect(written.draft.relationshipAnalysis.aToBFatigue).toBe(plain);
  });
});
