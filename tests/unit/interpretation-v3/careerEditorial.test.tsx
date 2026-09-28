import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/reports/create/route";
import ReportResultPage from "../../../src/app/reports/[reportId]/page";
import { createCareerV3, validateCareerV3 } from "../../../src/lib/report-generation/careerV3Generation";
import { careerV3CustomerText, isCareerV3Draft } from "../../../src/lib/interpretation-v3/careerEditorial";
import { CAREER_VOICES } from "../../../src/lib/interpretation-v3/careerPortraits";
import { interpretCareerContextV3 } from "../../../src/lib/interpretation-v3/careerContextV3";
import { interpretCareerContext } from "../../../src/lib/interpretation-v3/context";
import { storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { CareerReportV3View } from "../../../src/app/reports/[reportId]/CareerReportV3View";
import { CAREER_V3_FIXTURES, careerFixture } from "./careerFixtures";
import { createComprehensiveV3 } from "../../../src/lib/report-generation/comprehensiveV3Generation";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";

const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|ten_god_|day_pillar_|gwiin_|sinsal_|mbti:[A-Z]{4}:|careerEditorial:|careerContextV3:|career:portrait/;
afterEach(() => { expect(fetch).not.toHaveBeenCalled(); vi.unstubAllEnvs(); });

it.each(CAREER_V3_FIXTURES)("%s Career generate/publish/SSR, strong evidence and editorial balance", (...row) => {
  const { id, payload } = careerFixture(row), result = createCareerV3(payload)!;
  expect(result, id).not.toBeNull();
  const { draft, evidencePacket } = result, qa = draft.editorialAudit, text = careerV3CustomerText(draft), { facts, calculation } = evidencePacket.careerV3;
  if (process.env.CAREER_REVIEW_OUTPUT === "1") {
    writeFileSync(`/tmp/gyeol-career-${id}.json`, JSON.stringify(result));
    writeFileSync(`/tmp/gyeol-career-${id}.txt`, text);
  }
  expect(qa.errors, id).toEqual([]); expect(qa.rejected, id).toEqual([]); expect(qa.warnings, id).toEqual([]);
  expect(qa.audit.mix.character, id).toBeGreaterThan(0.5); expect(qa.audit.mix.advice, id).toBeLessThan(0.35);
  expect(validateProductPublication("career_money_study", draft, evidencePacket, payload).errors, id).toEqual([]);
  const snapshot = createProductPreviewSnapshot({ reportId: `career-v3-${id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "career_money_study", productSlug: "career-money-study", draft, evidencePacket });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const scenes = draft.chapters.flatMap(c => c.scenes);
  expect(scenes.some((s, i) => i > 0 && s.tone === scenes[i - 1].tone)).toBe(false);
  expect(new Set(scenes.map(s => s.form)).size).toBe(5);
  for (const s of scenes) for (const f of facts.filter(f => s.evidenceRefs.includes(f.id) && f.kind !== "mbti")) expect(storySupport(f.featureId, facts, calculation).substantial, `${id}/${s.id}/${f.id}`).toBe(true);
  expect(text).not.toMatch(internals);
  expect(text).toMatch(/좋은 패|좋은 기운/);
  const html = renderToStaticMarkup(createElement(CareerReportV3View, { draft, evidencePacket }));
  expect(html).toContain("career_v3.0-editorial.1"); expect(html).not.toContain("리포트를 준비하고 있습니다"); expect(html).not.toMatch(internals);
  expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(html.indexOf("data-story-signals")).toBeLessThan(html.indexOf('id="career-portrait"'));
  expect(html).toContain("data-all-signals");
  if (payload.userContext.jobStatus === "employee") {
    expect(draft.chapters.find(c => c.id === "possibilities")?.collapsed).toBe(true);
    expect(text.indexOf("직무로")).not.toBe(0);
    expect(draft.chapters[0].scenes.map(s => s.parts.map(p => p.text).join(" ")).join(" ")).toContain(payload.userContext.detailJob);
  }
  if (!payload.person.mbtiType) expect(scenes.some(s => s.evidenceRefs.some(ref => ref.includes(":mbti:")))).toBe(false);
});

it("12 charts across all 16 MBTI types plus unknown keep strong evidence, forms and publication", () => {
  const failures: unknown[] = [], endings = new Set<string>();
  for (const row of CAREER_V3_FIXTURES) {
    const { id, payload } = careerFixture(row);
    for (const mbtiType of [...Object.keys(CAREER_VOICES), ""]) {
      const r = createCareerV3({ ...payload, person: { ...payload.person, mbtiType } })!;
      const errors = validateProductPublication("career_money_study", r.draft, r.evidencePacket).errors;
      if (errors.length) failures.push({ id, mbtiType, errors, qa: r.draft.editorialAudit });
      const text = careerV3CustomerText(r.draft);
      expect(text).not.toMatch(internals);
      for (const name of ["도화", "홍염", "현침", "장성", "재고"]) if (!r.evidencePacket.careerV3.facts.some(f => JSON.stringify(f.value).includes(name))) expect(text).not.toContain(name);
      endings.add(r.draft.archetype);
    }
  }
  expect(failures).toEqual([]); expect(endings.size).toBeGreaterThanOrEqual(6);
}, 30_000);

it("local create → memory snapshot → full result page reads V3 with no provider", async () => {
  vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("REPORT_PERSISTENCE_MODE", "preview_memory"); vi.stubEnv("OPENAI_REPORT_WRITER_ENABLED", "0");
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const response = await POST(new Request("http://localhost/api/reports/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
  const body = await response.json();
  expect(response.status, JSON.stringify(body.diagnostic)).toBe(200);
  expect(body.diagnostic.externalCallCount).toBe(0);
  const html = renderToStaticMarkup(await ReportResultPage({ params: Promise.resolve({ reportId: body.reportId }) }));
  expect(html).toContain("career_v3.0-editorial.1"); expect(html).not.toContain("리포트를 불러오지 못했습니다"); expect(html).not.toMatch(internals);
});

it.each(["unknown", "approximate"])("%s birth time never becomes an exact V3 hero", async precision => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const person = { ...payload.person, birthTime: "", birthTimeUnknown: precision === "unknown", birthTimePrecision: precision, approximateBirthTimeSlot: precision === "approximate" ? "SASI" : "" };
  const result = await generateProductReport({ ...payload, person }, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", undefined, { careerVersion: "v3" });
  expect(result.externalCalls).toEqual([]);
  expect(result.ok, JSON.stringify(result)).toBe(true);
  if (result.ok) { expect(isCareerV3Draft(result.draft)).toBe(false); expect(validateProductPublication("career_money_study", result.draft, result.evidencePacket).ok).toBe(true); }
});

it("preserves all six committed Phase B customer drafts byte for byte", () => {
  const hashes = ["4d074fb7274be44b6ccdeb9128f276cb84b93c0a1e55163de589440625caf4d0", "0ff909df2e6b492d752149fbe65bccc736e94d4cc031ca4a6d51ad700fd8b0a6", "167a58cbcadf93f9d4f27f596211ba572949358e9aecc938ffe77fdfed0535ec", "1df9a25ab80f8d08389744d34398fc1f9a27b102a2067772489f7a33819d565b", "a6cde3108f368e9c39ca2cb5ecce5d7f097492898636b2c4fba8f2182871c62a", "47507839f8e860edde0115c57e72b0f6f235e8ede9d8f8ae75f8f4f16e12b396"];
  COMPREHENSIVE_V3_FIXTURES.forEach((row, i) => expect(hash(createComprehensiveV3(comprehensiveFixture(row).payload)!.draft)).toBe(hashes[i]));
});

it("developer, care, student and business scenes differ beyond job-name substitution", () => {
  const drafts = CAREER_V3_FIXTURES.map(row => createCareerV3(careerFixture(row).payload)!.draft);
  const text = drafts.map(careerV3CustomerText);
  for (const term of ["요구사항", "코드", "리뷰", "기술", "관리", "이직", "보상"]) expect(text[1]).toContain(term);
  for (const term of ["환자", "인계", "처치", "안전"]) expect(text[2]).toContain(term);
  expect(text[7]).not.toMatch(/승진|연봉|직급이 오를수록|CRM/);
  expect(drafts[7].chapters.findIndex(c => c.id === "learning")).toBe(1);
  const learningChars = (index: number) => drafts[index].chapters.find(c => c.id === "learning")!.scenes.flatMap(s => s.parts).reduce((n, p) => n + p.text.length, 0);
  expect(learningChars(7)).toBeGreaterThan(learningChars(0) * 1.5);
  for (const term of ["원가", "재방문", "가격", "브랜드", "확장", "맡기는"]) expect(text[4]).toContain(term);
  for (const term of ["견적", "단가", "정산", "수정", "포트폴리오"]) expect(text[5]).toContain(term);
});

it("taxonomy merges SaaS/sales/planning and extends only Career V3", () => {
  const work = interpretCareerContextV3("B2B SaaS 영업기획");
  expect(work.industry).toBe("software"); expect(work.analysisIntensity).toBe("high"); expect(work.salesIntensity).toBe("high"); expect(work.creativeIntensity).toBe("high");
  expect(work.keyWorkModes).toEqual(expect.arrayContaining(["기획", "협상", "CRM 검토"]));
  expect(work.outputTypes).toEqual(expect.arrayContaining(["계약", "기획안"]));
  expect(interpretCareerContext("간호사").industry).toBe("unknown");
  expect(interpretCareerContextV3("간호사").industry).toBe("healthcare");
});

it("same chart changes job, MBTI and employee/business without changing natal calculation", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const jobTexts = new Set<string>(), natal = new Set<string>();
  for (const job of ["백엔드 개발자", "간호사", "교사", "카페 사장", "네일아티스트", "생산관리", "세무사", "공무원"]) {
    const r = createCareerV3({ ...payload, userContext: { ...payload.userContext, detailJob: job } })!;
    jobTexts.add(careerV3CustomerText(r.draft)); natal.add(hash(r.evidencePacket.careerV3.calculation));
    expect(validateCareerV3(r.draft, r.evidencePacket), job).toEqual([]);
  }
  expect(jobTexts.size).toBe(8); expect(natal.size).toBe(1);
  const voices = new Set<string>();
  for (const type of [...Object.keys(CAREER_VOICES), ""]) {
    const r = createCareerV3({ ...payload, person: { ...payload.person, mbtiType: type } })!;
    expect(validateCareerV3(r.draft, r.evidencePacket), type).toEqual([]);
    const fusion = r.draft.chapters.flatMap(c => c.scenes).filter(s => s.angle.includes("fusion"));
    if (type) { expect(fusion).toHaveLength(2); voices.add(fusion.map(s => s.parts.filter(p => p.role === "character").map(p => p.text).join(" ")).join(" ")); }
    else expect(fusion).toHaveLength(0);
  }
  expect(voices.size).toBe(16);
  const employee = createCareerV3(payload)!, owner = createCareerV3({ ...payload, userContext: { ...payload.userContext, jobStatus: "business_owner" } })!;
  expect(hash(employee.evidencePacket.careerV3.calculation)).toBe(hash(owner.evidencePacket.careerV3.calculation));
  expect(careerV3CustomerText(owner.draft)).toContain("사장이 빠지면 멈추는 운영");
  expect(careerV3CustomerText(employee.draft)).not.toContain("사장이 빠지면 멈추는 운영");
});

it("explicit Career V3 bypasses even an enabled writer, legacy remains readable", async () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const result = await generateProductReport(payload, { enabled: true, config: { enabled: true, apiKey: "test-no-call", model: "test" } }, "normal_writer", undefined, { careerVersion: "v3" });
  expect(result.ok, JSON.stringify(result)).toBe(true);
  if (result.ok) { expect(isCareerV3Draft(result.draft)).toBe(true); expect(result.externalCalls).toEqual([]); }
  const legacy = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
  expect(legacy.ok).toBe(true);
  if (legacy.ok) { expect(isCareerV3Draft(legacy.draft)).toBe(false); expect(validateProductPublication("career_money_study", legacy.draft, legacy.evidencePacket).errors).toEqual([]); }
});

it("publication rejects edited prose, injected refs and missing evidence", () => {
  const r = createCareerV3(careerFixture(CAREER_V3_FIXTURES[0]).payload)!;
  const edited = structuredClone(r.draft);
  const forged = { ...edited, chapters: edited.chapters.map((c, i) => i ? c : { ...c, scenes: c.scenes.map((s, j) => j ? s : { ...s, headline: "무조건 성공합니다", evidenceRefs: ["invented"] }) }) };
  expect(validateCareerV3(forged, r.evidencePacket)).toContain("CAREER_V3_CONTENT_MISMATCH");
  expect(validateCareerV3(r.draft, {})).toContain("CAREER_V3_CONTRACT_REQUIRED");
});
