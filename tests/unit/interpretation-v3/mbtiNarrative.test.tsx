import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import EditorialPreview from "../../../src/app/dev/v3-editorial-preview/page";
import { MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { createCareerV3, validateCareerV3 } from "../../../src/lib/report-generation/careerV3Generation";
import { createLoveV3, validateLoveV3 } from "../../../src/lib/report-generation/loveV3Generation";
import { createCompatibilityV3, validateCompatibilityV3 } from "../../../src/lib/report-generation/compatibilityV3Generation";
import { endingWarnings, narrativeRhythm, selectNarrativeTraits } from "../../../src/lib/interpretation-v3/mbtiNarrative";
import { buildCareerV3Polished } from "../../../src/lib/interpretation-v3/careerEditorialPolish";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { careerV3CustomerText } from "../../../src/lib/interpretation-v3/careerEditorial";
import { CareerReportV3View } from "../../../src/app/reports/[reportId]/CareerReportV3View";
import { careerFixture, CAREER_V3_FIXTURES } from "./careerFixtures";
import { loveFixture, LOVE_V3_FIXTURES } from "./loveFixtures";
import { compatibilityFixture } from "./compatibilityFixtures";

it("smooths only supported conjugations and reports remaining repeated endings", () => {
  const text = ["잘합니다. 힘이 있습니다. 기준을 만듭니다.", "결론입니다. 내일도 합니다. 결과입니다."];
  expect(endingWarnings(text).length).toBeGreaterThan(0);
  expect(endingWarnings(narrativeRhythm(text)).length).toBeLessThan(endingWarnings(text).length);
  expect(narrativeRhythm(["계획입니다. 방향입니다. 리더입니다."]).join(" ")).toContain("리더예요");
  expect(narrativeRhythm(["계획입니다. 방향입니다. 힘입니다."]).join(" ")).toContain("힘이에요");
  expect(narrativeRhythm(["계획입니다. 방향입니다. 보입니다."]).join(" ")).toContain("보여요");
  expect(narrativeRhythm(["계획입니다. 방향입니다. 붙입니다."]).join(" ")).toContain("붙입니다");
});

it.each(MBTI_TYPES.filter(Boolean))("%s library changes real copy, with supported provenance and no repeated traits", mbtiType => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const result = createCareerV3({ ...payload, person: { ...payload.person, mbtiType } })!;
  expect(validateCareerV3(result.draft, result.evidencePacket)).toEqual([]);
  const { narrativeAudit } = result.draft;
  expect(narrativeAudit.length).toBeGreaterThan(1);
  expect(new Set(narrativeAudit.map(a => a.traitId)).size).toBe(narrativeAudit.length);
  for (const entry of narrativeAudit) {
    expect(entry.sourceRefs[0]).toContain(`${mbtiType}.json:traits:`);
    expect(entry.evidenceRefs.every(id => result.evidencePacket.careerV3.facts.some(f => f.id === id))).toBe(true);
  }
  const html = renderToStaticMarkup(createElement(CareerReportV3View, result));
  expect(html).toContain("data-mbti-identity");
  expect(html).not.toMatch(/리포트 활용 포인트|인지 기능 서열|narrativeAudit|mbti-library-1|docs\/product/);
});

it("freezes pre-library snapshots and rejects tampered enrichment", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]), r = createCareerV3(payload)!;
  const { facts, calculation } = r.evidencePacket.careerV3;
  const old = buildCareerV3Polished({ name: payload.person.name, mbti: payload.person.mbtiType, facts, calculation,
    context: normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob, relationshipStatus: payload.userContext.relationshipStatus }) });
  expect(validateCareerV3(JSON.parse(JSON.stringify(old)), r.evidencePacket)).toEqual([]);
  expect(renderToStaticMarkup(createElement(CareerReportV3View, { ...r, draft: old }))).not.toContain("data-mbti-identity");
  expect(validateCareerV3({ ...r.draft, narrativeAudit: [] }, r.evidencePacket)).toContain("CAREER_V3_CONTENT_MISMATCH");
  expect(endingWarnings([careerV3CustomerText(r.draft)]).length).toBeLessThan(endingWarnings([careerV3CustomerText(old)]).length);
});

it("never infers an unknown MBTI or turns absent myeongli into an amplification", () => {
  expect(selectNarrativeTraits({ product: "major_fortune", domain: "career", section: "current", mbti: "", selectedSignals: [] })).toEqual([]);
  expect(selectNarrativeTraits({ product: "major_fortune", domain: "career", section: "current", mbti: "ENTJ", selectedSignals: [] }).every(t => t.kind !== "amplification" && !t.matchedEvidence.length)).toBe(true);
});

it("love and pair preserve publication while MBTI body changes beyond a chip", () => {
  const { payload } = loveFixture(LOVE_V3_FIXTURES[0]);
  for (const mbtiType of ["ENTJ", "INFP"]) {
    const r = createLoveV3({ ...payload, person: { ...payload.person, mbtiType } })!;
    expect(validateLoveV3(r.draft, r.evidencePacket)).toEqual([]);
  }
  const results = ["ENTJ", "INFP"].map(mbtiType => {
    const input = compatibilityFixture("friendship");
    return createCompatibilityV3({ ...input, personA: { ...input.personA, mbtiType } })!;
  });
  results.forEach(r => expect(validateCompatibilityV3(r.draft, r.evidencePacket)).toEqual([]));
  expect(results[0].draft.chapters.find(c => c.id === "directions")?.scenes).not.toEqual(results[1].draft.chapters.find(c => c.id === "directions")?.scenes);
});

it.each(["comprehensive", "career", "love", "compatibility"])("local %s preview renders the new edition without network or persistence", async product => {
  const html = renderToStaticMarkup(await EditorialPreview({ searchParams: Promise.resolve({ product }) }));
  expect(html.includes("data-mbti-identity")).toBe(true);
  expect(fetch).not.toHaveBeenCalled();
});

it("never exposes the editorial QA route in Production", async () => {
  vi.stubEnv("NODE_ENV", "production");
  try { await expect(EditorialPreview({ searchParams: Promise.resolve({ product: "career" }) })).rejects.toThrow(); }
  finally { vi.unstubAllEnvs(); }
});
