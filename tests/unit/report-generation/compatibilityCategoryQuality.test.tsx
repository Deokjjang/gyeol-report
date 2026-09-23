import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateCompatibilityProductDraft } from "../../../src/lib/report-generation/compatibilityGenerationHandler";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { generateCompatibilityReportDraft } from "../../../src/lib/report-generation/openaiCompatibilityReportWriter";
import { buildOpenAICompatibilityReportWriterMessages, buildOpenAICompatibilityReportRepairMessages } from "../../../src/lib/report-generation/openaiCompatibilityReportWriterPrompt";
import { CompatibilityReportView } from "../../../src/app/reports/[reportId]/CompatibilityReportView";
import { compatibilityRelationshipTypes, type CompatibilityCanonicalRelationshipType } from "../../../src/lib/report-knowledge/compatibilityTypes";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import type { CompatibilityGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";

const personA = { name: "가람", birthDate: "1999-07-31", birthTime: "07:30", birthTimeUnknown: false,
  approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ", calendarType: "solar", timezone: "Asia/Seoul" } as const;
const personB = { ...personA, name: "나래", birthDate: "1996-12-06", birthTime: "14:15", gender: "FEMALE", mbtiType: "INTP" } as const;
const pairs: readonly (readonly [CompatibilityGenerationInput["personA"], CompatibilityGenerationInput["personB"]])[] = [
  [personA, personB],
  [{ ...personA, name: "다온", birthDate: "1980-05-18", birthTime: "10:15", mbtiType: "INTP" }, { ...personB, name: "서우", birthDate: "2001-03-02", birthTime: "16:20", mbtiType: "INTP" }],
  [{ ...personA, name: "한결", birthDate: "1990-01-10", birthTime: "09:20", mbtiType: "" }, { ...personB, name: "윤슬", birthDate: "1987-08-20", birthTime: "11:10", mbtiType: "ENFP" }],
];
const questions: Record<CompatibilityCanonicalRelationshipType, readonly string[]> = {
  love: ["끌림", "표현", "친밀감", "연락", "싸운", "데이트", "생활", "오래"],
  marriage: ["공동생활", "보완", "가사", "가족", "갈등", "지출", "부모 역할", "재합의"],
  parentChild: ["마음", "기대", "자율", "감정", "공부", "지원", "독립", "답답함"],
  coworker: ["강점", "분업", "마감", "보고", "피드백", "책임", "피로", "협업"],
  managerReport: ["권한", "지시", "자율권", "질문", "평가", "자원", "성장", "신뢰"],
  businessPartner: ["가치", "결정권", "위험", "이견", "갈등", "돈", "철수", "책임"],
  friendship: ["관심", "힘", "연락", "감정", "서운함", "약속", "생활", "우정"],
};
function input(category: CompatibilityCanonicalRelationshipType, pair = pairs[0], swap = false): CompatibilityGenerationInput {
  return { kind: "compatibility", productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: category,
    personA: pair[swap ? 1 : 0], personB: pair[swap ? 0 : 1], productOptions: {} };
}
async function generate(value: CompatibilityGenerationInput) {
  const result = await generateCompatibilityProductDraft(value);
  expect(result.ok, JSON.stringify(result)).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  expect(validateProductPublication("saju_mbti_compatibility", result.draft, result.evidencePacket)).toEqual({ ok: true, errors: [] });
  return result;
}
function rendered(draft: Awaited<ReturnType<typeof generate>>["draft"]) {
  return renderToStaticMarkup(createElement(CompatibilityReportView, { draft })).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}
const longSentences = (text: string) => new Set(text.split(/(?<=[.!?。！？])\s+/u).filter(s => s.length >= 40));
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); });

describe("seven compatibility buying questions", () => {
  for (const [pairIndex, pair] of pairs.entries()) {
    it(`${pairIndex}: seven publish/SSR reports keep information and answer distinct questions`, async () => {
      const renderedByCategory: string[] = [];
      const longFields: Record<string, string>[] = [];
      for (const category of compatibilityRelationshipTypes) {
        const result = await generate(input(category, pair));
        const plan = result.evidencePacket.categoryReading!;
        const text = rendered(result.draft);
        renderedByCategory.push(text);
        expect(plan.category).toBe(category);
        expect(plan.scenes).toHaveLength(8);
        for (const [i, scene] of plan.scenes.entries()) {
          expect(scene.title).toContain(questions[category][i]);
          expect(text).toContain(scene.title);
          expect(text).toContain(scene.action);
          expect(scene.sources.some(s => s.kind === "saju")).toBe(true);
          for (const source of scene.sources.filter(s => s.kind === "mbti-person")) {
            const owner = Object.values(result.evidencePacket.directionEvidence.persons).find(p => p.personId === source.subjectPerson)!;
            expect(owner.traits.some(t => t.evidenceId === source.id && t.area === source.field)).toBe(true);
          }
          for (const source of scene.sources.filter(s => s.kind === "saju" && s.subjectPerson && s.field !== "cross_ten_god")) {
            const owner = Object.values(result.evidencePacket.directionEvidence.persons).find(p => p.personId === source.subjectPerson)!;
            expect(owner.natal.some(n => n.evidenceId === source.id && n.featureId === source.field)).toBe(true);
          }
          for (const source of scene.sources.filter(s => s.kind === "mbti-pair")) {
            const direction = [result.evidencePacket.directionEvidence.aToB, result.evidencePacket.directionEvidence.bToA]
              .find(d => d.subjectPerson === source.subjectPerson && d.targetPerson === source.targetPerson)!;
            expect(source.id).toBe(`${direction.mbtiPair!.evidenceId}:${source.field}`);
            if (!["love", "marriage"].includes(category)) {
              expect(source.field).not.toMatch(/lovePattern|marriagePattern/);
              expect(source.text).not.toMatch(/연애|결혼|연인|애정|사랑|배우자|부부|데이트|스킨십|설렘/);
            }
          }
        }
        expect(text).toContain("가장 잘 맞는 부분");
        expect(text).toContain("가장 부딪히는 부분");
        expect(text).toContain("유지하는 핵심 조건");
        expect(text).not.toMatch(/placeholder|fallback|writer|validator|personId|subjectPerson/iu);
        expect(text.length).toBeGreaterThan(pairIndex === 0 ? 8850 : pairIndex === 1 ? 8000 : 7154);
        const analysis = result.draft.relationshipAnalysis;
        longFields.push(Object.fromEntries(Object.entries(analysis).flatMap(([key, value]) =>
          typeof value === "string" ? [[key, value]] : value.map((line, i) => [`${key}.${i}`, line])).filter(([, v]) => v.length >= 40)));
        if (!pair[0].mbtiType) {
          expect(plan.scenes.flatMap(s => s.sources).some(s => s.kind.startsWith("mbti") && s.subjectPerson === result.evidencePacket.directionEvidence.persons.personA.personId)).toBe(false);
          expect(text).toContain(`${pair[0].name}님은 MBTI 미입력`);
        }
        expect(plan.role.assignments).toEqual({ personA: null, personB: null });
      }
      // Facts can recur; buying-question prose must not collapse to one shared report.
      const sharedFields = Object.entries(longFields[0]).filter(([key, value]) => longFields.every(fields => fields[key] === value));
      expect(sharedFields.length).toBeLessThanOrEqual(3);
      const sets = renderedByCategory.map(longSentences);
      for (const [i, set] of sets.entries()) {
        const others = new Set(sets.flatMap((s, j) => j === i ? [] : [...s]));
        expect([...set].filter(sentence => !others.has(sentence)).length).toBeGreaterThanOrEqual(40);
      }
    });
    for (const category of compatibilityRelationshipTypes) {
      it(`${pairIndex}/${category}: swap preserves source ownership and inverts directions`, async () => {
        const a = await generate(input(category, pair));
        const b = await generate(input(category, pair, true));
        expect(a.evidencePacket.directionEvidence.persons.personA).toEqual(b.evidencePacket.directionEvidence.persons.personB);
        expect(a.draft.relationshipAnalysis.aToBFatigue).toBe(b.draft.relationshipAnalysis.bToAFatigue);
        const sources = (r: typeof a) => r.evidencePacket.categoryReading!.scenes.flatMap(scene => scene.sources)
          .filter(source => source.kind === "mbti-person" || source.kind === "mbti-pair" || source.field === "cross_ten_god" && source.subjectPerson)
          .sort((x, y) => x.id.localeCompare(y.id));
        expect(sources(a)).toEqual(sources(b));
        expect(rendered(b.draft)).toContain(pair[0].name);
        expect(rendered(b.draft)).toContain(pair[1].name);
      });
    }
  }

  for (const category of compatibilityRelationshipTypes) {
    it(`${category}: writer and repair retain the same questions and directional sources`, async () => {
      const result = await generate(input(category));
      const bad = structuredClone(result.draft);
      Object.assign(bad.relationshipAnalysis, { aToBFatigue: bad.relationshipAnalysis.bToAFatigue });
      const requests: string[] = [];
      const fetchImpl = vi.fn<typeof fetch>(async (_url, init) => {
        requests.push(String(init?.body));
        return new Response(JSON.stringify({ output_text: JSON.stringify(requests.length === 1 ? bad : result.draft) }), { status: 200 });
      });
      const written = await generateCompatibilityReportDraft({ evidencePacket: result.evidencePacket,
        config: { enabled: true, apiKey: "test-key", model: "mock", fetchImpl } });
      expect(written.repaired).toBe(true);
      expect(fetchImpl).toHaveBeenCalledTimes(2);
      expect(validateProductPublication("saju_mbti_compatibility", written.draft, result.evidencePacket).ok).toBe(true);
      for (const request of requests) {
        for (const scene of result.evidencePacket.categoryReading!.scenes) {
          expect(request).toContain(scene.title);
          for (const source of scene.sources) expect(request).toContain(source.id);
        }
      }
      for (const scene of result.evidencePacket.categoryReading!.scenes) expect(rendered(written.draft)).toContain(scene.title);
      const normal = buildOpenAICompatibilityReportWriterMessages({ evidencePacket: result.evidencePacket });
      const repair = buildOpenAICompatibilityReportRepairMessages({ evidencePacket: result.evidencePacket, previousDraftText: "{}", validationErrors: ["INVALID"] });
      expect(repair.user).toContain(normal.user);
      expect(repair.developer).toContain("다른 category의 장면이나 임의 성격 역할로 대체하지 마라");
    });
  }

  for (const type of MBTI_TYPES.filter(Boolean)) {
    it(`${type}: all category source selections publish without romance leakage into work/family`, async () => {
      for (const category of compatibilityRelationshipTypes) {
        const result = await generate(input(category, [{ ...personA, mbtiType: type }, personB]));
        if (!["love", "marriage"].includes(category)) {
          for (const scene of result.evidencePacket.categoryReading!.scenes) {
            expect(scene.sources.filter(source => source.kind === "mbti-pair").map(s => s.text).join(" "))
              .not.toMatch(/연애|결혼|연인|애정|사랑|배우자|부부|데이트|스킨십|설렘/);
          }
        }
      }
    });
  }

  it("rejects altered category, role and source attribution without requiring new metadata on legacy evidence", async () => {
    const result = await generate(input("businessPartner"));
    for (const mutation of [
      (p: NonNullable<typeof result.evidencePacket.categoryReading>) => Object.assign(p, { category: "love" }),
      (p: NonNullable<typeof result.evidencePacket.categoryReading>) => Object.assign(p.scenes[0].sources[0], { subjectPerson: "invented-person" }),
      (p: NonNullable<typeof result.evidencePacket.categoryReading>) => Object.assign(p.scenes[0].sources[0], { field: "lovePattern" }),
      (p: NonNullable<typeof result.evidencePacket.categoryReading>) => Object.assign(p.role.assignments, { personA: "manager" }),
    ]) {
      const packet = structuredClone(result.evidencePacket); mutation(packet.categoryReading!);
      expect(validateProductPublication("saju_mbti_compatibility", result.draft, packet).ok).toBe(false);
    }
    // Future editorial wording alone must not quarantine a previously valid snapshot.
    const earlierCopy = structuredClone(result.evidencePacket);
    Object.assign(earlierCopy.categoryReading!.scenes[0], { title: "함께 일하는 관계의 장점", scene: "이전 버전의 관계 장면", reading: "이전 버전의 해석 문구" });
    expect(validateProductPublication("saju_mbti_compatibility", result.draft, earlierCopy).ok).toBe(true);
    const legacy = { ...result.evidencePacket };
    delete legacy.categoryReading;
    expect(validateProductPublication("saju_mbti_compatibility", result.draft, legacy).ok).toBe(true);
  });
});
