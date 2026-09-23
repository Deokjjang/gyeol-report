import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateComprehensiveV2ProductDraft } from "../../../src/lib/report-generation/comprehensiveV2GenerationHandler";
import * as writer from "../../../src/lib/report-generation/openaiComprehensiveReportWriter";
import { buildOpenAIComprehensiveReportWriterMessages } from "../../../src/lib/report-generation/openaiReportWriterPrompt";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { MBTI_SOURCE_TYPES, getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { buildMyeongliMbtiBridgePacket } from "../../../src/lib/report-knowledge/bridge";
import { BRIDGE_HINT_FACTS, interactionKey } from "../../../src/lib/report-knowledge/bridge/factConditions";
import { getMbtiKnowledge } from "../../../src/lib/report-knowledge/knowledgeSelectors";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const customers = [
  { birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE" },
  { birthDate: "1980-05-15", birthTime: "09:30", gender: "FEMALE" },
  { birthDate: "2001-08-20", birthTime: "16:20", gender: "MALE" },
] as const;
function input(customer: (typeof customers)[number], mbtiType: SinglePersonGenerationInput["person"]["mbtiType"]): SinglePersonGenerationInput {
  return { kind: "comprehensiveV2", productKey: "saju_mbti_full", productSlug: "saju-mbti-full",
    person: { name: "가람", ...customer, birthTimeUnknown: false, approximateBirthTimeSlot: "", mbtiType, calendarType: "solar", timezone: "Asia/Seoul" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: {} };
}
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-23T03:00:00Z")); });
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("Fusion Bridge product boundaries", () => {
  for (const customer of customers) {
    it.each([...MBTI_SOURCE_TYPES, ""] as const)(`${customer.birthDate} × %s: real natal, source IDs, deterministic, publication`, async (mbtiType) => {
      const result = await generateComprehensiveV2ProductDraft(input(customer, mbtiType));
      expect(result.ok, JSON.stringify(result).slice(0,400)).toBe(true); if (!result.ok) return;
      const e = result.evidencePacket;
      expect(validateProductPublication("saju_mbti_full", result.draft, e).ok).toBe(true);
      const again = await generateComprehensiveV2ProductDraft(input(customer, mbtiType));
      expect(again).toEqual(result);
      if (!mbtiType) {
        expect(e.sections.flatMap((s) => s.fusion)).toEqual([]);
        expect(e.sajuMbtiBridgeEvidence ?? []).toEqual([]);
        expect(e.sajuEntryIds.length).toBeGreaterThan(0);
        return;
      }
      const source = getMbtiSourceProfile(mbtiType)!;
      const generatedScenes = e.sajuMbtiBridgeEvidence ?? [];
      expect(new Set(generatedScenes.map(s => s.interaction?.interactionId)).size).toBe(generatedScenes.length);
      for (const scene of generatedScenes.filter(s => s.interaction?.interactionId.startsWith("bridge-v2:"))) {
        expect(scene.interaction?.myeongliEvidenceIds.every(id => e.bridgeFactIds?.includes(id))).toBe(true);
        expect(scene.mbti).toBe(mbtiType);
        expect(scene.bridgeNeed).toBe("contextual_action");
        expect(scene.traitTopic).toBeDefined();
        for (const ref of scene.interaction!.mbtiEvidenceIds) {
          const [, type, , area, id] = ref.split(":");
          expect(type).toBe(mbtiType);
          expect(Object.entries(source.traits ?? {}).some(([a, ts]) => a === area && ts?.some(t => t.id === id))).toBe(true);
        }
        expect(JSON.stringify(result.draft)).toContain(scene.sceneSeed);
        expect(scene.sentenceSeed + scene.sceneSeed + scene.practicalSwitch).not.toMatch(/fallback|writer|validator|placeholder|internal|mock/iu);
      }
      const validTraitIds = new Set(Object.entries(source.traits ?? {}).flatMap(([area, ts]) => (ts ?? []).map((t) => `mbti:${mbtiType}:traits:${area}:${t.id}`)));
      const k = getMbtiKnowledge(mbtiType);
      const validTagIds = new Set([...k.traitTags, ...k.riskTags, ...k.sajuBridgeTags, ...k.relationshipPreferences.attracts, ...k.relationshipPreferences.needs, ...k.relationshipPreferences.risks].map((tag) => `mbti:${mbtiType}:tag:${tag}`));
      for (const section of e.sections) for (const f of section.fusion) {
        expect(f.interaction?.mbtiEvidenceIds.length).toBeGreaterThan(0);
        expect(f.interaction?.myeongliEvidenceIds.every((id) => e.bridgeFactIds?.includes(id))).toBe(true);
        for (const id of f.interaction!.mbtiEvidenceIds) expect(validTraitIds.has(id) || validTagIds.has(id), id).toBe(true);
      }
      const signals = [
        { kind: "shinsal" as const, label: "현침살" },
        { kind: "tenGod" as const, label: "정재" },
        { kind: "element" as const, label: "금" },
      ].filter((s) => (BRIDGE_HINT_FACTS[s.label] ?? []).some((id) => e.sajuEntryIds.includes(id)));
      const p = buildMyeongliMbtiBridgePacket({ mbtiType, productContext: "careerMoneyStudy", myeongliSignals: signals });
      expect(buildMyeongliMbtiBridgePacket({ mbtiType, productContext: "careerMoneyStudy", myeongliSignals: signals })).toEqual(p);
      for (const ev of p.evidences) {
        const factIds = new Set(ev.myeongliEvidence.signals.map((s) => s.id));
        const traces = ev.interactions ?? [];
        expect(new Set(traces.map(interactionKey)).size).toBe(traces.length);
        for (const t of traces) {
          expect(t.myeongliEvidenceIds.every((id) => factIds.has(id))).toBe(true);
          expect(t.mbtiEvidenceIds.every((id) => validTraitIds.has(id))).toBe(true);
        }
      }
      const empty = buildMyeongliMbtiBridgePacket({ mbtiType, productContext: "careerMoneyStudy", myeongliSignals: [] });
      expect(empty.evidences).toEqual([]);
    });
  }
  it("ENTJ → INTP changes interactions, never the natal facts", async () => {
    const a = await generateComprehensiveV2ProductDraft(input(customers[0], "ENTJ"));
    const b = await generateComprehensiveV2ProductDraft(input(customers[0], "INTP"));
    expect(a.ok && b.ok).toBe(true); if (!a.ok || !b.ok) return;
    expect(a.evidencePacket.sajuEntryIds).toEqual(b.evidencePacket.sajuEntryIds);
    expect(a.evidencePacket.sajuMbtiBridgeEvidence).not.toEqual(b.evidencePacket.sajuMbtiBridgeEvidence);
  });
  it.each([
    ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
    ["love_marriage_child", "love-marriage-child"], ["major_fortune", "major-fortune"],
    ["annual_fortune", "annual-fortune"], ["saju_mbti_compatibility", "compatibility"],
  ])("%s deterministic dispatcher → publish", async (productKey, productSlug) => {
    const base = input(customers[0], "ENTJ");
    const payload = productKey === "saju_mbti_compatibility"
      ? { productKey, productSlug, relationshipType: "friendship", personA: base.person, personB: { ...input(customers[1], "ISFJ").person, name: "나래" } }
      : { ...base, productKey, productSlug, productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {} };
    const r = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
    expect(r.ok, JSON.stringify(r).slice(0,400)).toBe(true);
    expect(r.externalCalls).toEqual([]);
  });
  it("mock writer and fallback receive the same matched facts; prompt uses no unrelated hint", async () => {
    const person = input(customers[0], "ENTJ");
    const local = await generateComprehensiveV2ProductDraft(person);
    expect(local.ok).toBe(true); if (!local.ok) return;
    let sent: Parameters<typeof writer.generateComprehensiveReportDraft>[0] | undefined;
    vi.spyOn(writer, "generateComprehensiveReportDraft").mockImplementation(async (request) => {
      sent = request;
      const { productVersion, ...draft } = local.draft;
      expect(productVersion).toBe("v2");
      return { draft, rawText: "", warnings: [] };
    });
    const written = await generateComprehensiveV2ProductDraft(person, { writer: { enabled: true, config: { enabled: true, apiKey: "mock-key", model: "mock-model" } } });
    expect(written.ok, JSON.stringify(written).slice(0,600)).toBe(true);
    expect(sent?.evidencePacket.sections).toEqual(local.evidencePacket.sections);
    expect(sent?.evidencePacket.sajuMbtiBridgeEvidence).toEqual(local.evidencePacket.sajuMbtiBridgeEvidence);
    const message = JSON.stringify(buildOpenAIComprehensiveReportWriterMessages({ mbtiType: "ENTJ", evidencePacket: local.evidencePacket }));
    expect(message).not.toContain("갑신일주의 압박 대응력");
  });
});
