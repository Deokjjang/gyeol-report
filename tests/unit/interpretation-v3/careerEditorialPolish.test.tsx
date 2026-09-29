import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CareerReportV3View } from "../../../src/app/reports/[reportId]/CareerReportV3View";
import { buildCareerV3, careerV3CustomerText, CAREER_V3_POLISH_VERSION } from "../../../src/lib/interpretation-v3/careerEditorial";
import { careerEditorialScenes } from "../../../src/lib/interpretation-v3/careerEditorialScenes";
import { buildCareerV3Polished } from "../../../src/lib/interpretation-v3/careerEditorialPolish";
import { interpretCareerContextV3 } from "../../../src/lib/interpretation-v3/careerContextV3";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { createCareerV3, validateCareerV3 } from "../../../src/lib/report-generation/careerV3Generation";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { CAREER_V3_FIXTURES, careerFixture } from "./careerFixtures";

const oldHashes = [
  "5cccb4921389e342ab9b8a5945551a4d6160e6e5fc2eab19d6cb6dd30a547f07", "b41785f417c634fc15d842f7b97acc9590d1ba6254fa021bcf5f1f3d81c566a4",
  "702ec3b22a12dd504cb6302335f836dd71f6aeb5d4dcdba0ab5592e970fe1648", "42e39fc9f05aa6859f026d39280593ad03702a50788fc9a18afbc9c63edc7f8f",
  "7fa6f728440184f35276d51f33e7e042951391955305aeff158b8e4234c28dc1", "6a832189f7ebbb1973d8b2b9c0b53b854ce1130a5fa99d57979b50fb75bfa731",
  "661c9b5fa962fd239d2371b22d4749ac15b7a12650b3a4fccbb61e80279be767", "61708c96bff47f37f2a4d6ae487cf5b9f85f00bd20dfcda55189a6526fc0bccc",
  "361b1158c18ad2694d62405b1bbb58d5da85cbde8f5436c7d00a1da64d5f41cc", "65f3cb8bf37bd9d4aa9255a8526d6e278f96226ad7df95943e76dc59a84cf5df",
  "c624a0e69f0f791eb93af6a38893ceac6a7cbc3b3e9a9c32dc329ca099c59561", "924fb5d27a68a83a77658cc04b1705997c61be5c43e8f0f82ed7a79046c4a027",
];
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const count = (text: string, word: string) => text.split(word).length - 1;
const meta = /원국에서 충분한 근거|원국 근거를|원국 근거가|이 조합을.+읽|같은 재능을.+읽|이번 리포트에서는|예측하는 숫자|읽는 대목|같은 강의를 들어도|의 힘도 함께 있어/;
const definition = /(?:겁재|비견|식신|상관|편재|정재|편관|정관|편인|정인|장성|반안|천을귀인|재고귀인|문창귀인|학당귀인|역마|도화|홍염|현침|화개)[은는]/;

it.each(CAREER_V3_FIXTURES)("%s C2 preserves C snapshots and polishes input/body without changing evidence", (...row) => {
  const { id, payload } = careerFixture(row), latest = createCareerV3(payload)!;
  const { facts, calculation } = latest.evidencePacket.careerV3;
  const context = normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob });
  const old = buildCareerV3({ name: payload.person.name, mbti: payload.person.mbtiType, facts, calculation, context });
  expect(hash(old)).toBe(oldHashes[id.charCodeAt(0) - 65]);
  expect(validateCareerV3(old, latest.evidencePacket)).toEqual([]);
  const oldSnapshot = createProductPreviewSnapshot({ reportId: `legacy-career-${id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "career_money_study", productSlug: "career-money-study", draft: old, evidencePacket: latest.evidencePacket });
  expect(oldSnapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(oldSnapshot.value)))).toBe(true);
  const oldHtml = renderToStaticMarkup(createElement(CareerReportV3View, { draft: old, evidencePacket: latest.evidencePacket }));
  expect(oldHtml).toContain('data-report-version="career_v3.0-editorial.1"');

  const { draft, evidencePacket } = latest, text = careerV3CustomerText(draft), body = draft.chapters.flatMap(c => c.scenes);
  expect(draft.version).toBe(CAREER_V3_POLISH_VERSION);
  expect(validateProductPublication("career_money_study", draft, evidencePacket, payload).errors).toEqual([]);
  expect(text).not.toMatch(meta); expect(text).not.toMatch(definition);
  expect(draft.editorialAudit.audit.mix.advice).toBeLessThan(old.editorialAudit.audit.mix.advice);
  expect(body.filter(s => s.parts.every(p => p.role !== "advice")).length / body.length).toBeGreaterThan(0.7);
  const ending = draft.chapters.find(c => c.id === "direction")!.scenes[0];
  expect(ending.parts.length).toBeGreaterThanOrEqual(4); expect(ending.parts.length).toBeLessThanOrEqual(6);
  expect(ending.parts.map(p => p.text).join(" ")).not.toMatch(/겁재|식신|편재|정재|정관|편관|정인|편인|장성|반안|천을|재고|원국|기운|읽었/);
  // C2 may augment final references with already-strong money evidence, never
  // swap any old scene's natal/MBTI anchor or invent a new feature.
  for (const scene of body) expect(scene.evidenceRefs).toEqual(expect.arrayContaining([...old.chapters.flatMap(c => c.scenes).find(s => s.id === scene.id)!.evidenceRefs]));
  const html = renderToStaticMarkup(createElement(CareerReportV3View, { draft, evidencePacket }));
  const panel = html.slice(html.indexOf("data-career-input"), html.indexOf("</dl>"));
  expect(html.indexOf("data-career-input")).toBeGreaterThan(html.indexOf(draft.title));
  expect(html.indexOf("data-career-input")).toBeLessThan(html.indexOf("리포트 목차"));
  expect(panel).toContain(payload.userContext.detailJob || "미입력");
  expect(panel).toContain(payload.person.mbtiType || "모름");
  expect(panel).not.toContain(payload.person.birthDate);
  expect(html).not.toMatch(/roleFamily|sales_operations|regulated_analysis|customer_service|care_operations|field_operations|analysisIntensity|careerEditorial:|careerContextV3:/);
  expect(html).not.toMatch(/계산 기준|근거 더 보기|전문 근거|천간·지장간의 십성|원국 전체의 파생 근거/u);
  const settings = careerEditorialScenes(context, interpretCareerContextV3(context.fieldLabel ?? "", true, context.lifeStatus));
  expect(Object.values(settings).filter(scene => text.includes(scene)).length).toBeGreaterThanOrEqual(5);
  if (payload.userContext.detailJob) expect(count(text, payload.userContext.detailJob)).toBeLessThanOrEqual(3);
  if (process.env.CAREER_C2_REVIEW_OUTPUT === "1") {
    writeFileSync(`/tmp/gyeol-career-c2-${id}.json`, JSON.stringify(latest));
    writeFileSync(`/tmp/gyeol-career-c2-${id}.txt`, text);
  }
});

it("B2B scenes replace repeated labels, use dimensions rather than fixture identity", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]), result = createCareerV3(payload)!;
  const text = careerV3CustomerText(result.draft);
  for (const word of ["CRM", "고객 요구 분석", "재계약", "보고서"]) expect(count(text, word), word).toBeLessThanOrEqual(2);
  for (const scene of ["고객 미팅", "제안·협상", "제품팀 일정", "실적 분석", "후배에게", "평가·보상", "이직 공고"]) expect(text).toContain(scene);
  const context = normalizeContext({ lifeStatus: "employee", fieldLabel: "B2B SaaS 영업기획" });
  expect(careerEditorialScenes(context, interpretCareerContextV3(context.fieldLabel!))).toEqual(careerEditorialScenes({ ...context, fieldLabel: "엔터프라이즈 소프트웨어 sales" }, interpretCareerContextV3("엔터프라이즈 소프트웨어 sales")));
  const renamed = createCareerV3({ ...payload, person: { ...payload.person, name: "새이름" } })!;
  const scenes = (r: typeof result) => r.draft.chapters.flatMap(c => c.scenes).filter(s => !["first-minute", "final-person"].includes(s.angle));
  expect(scenes(renamed)).toEqual(scenes(result));
});

it("same raw job has five distinct lived experiences without changing the chart", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]);
  const cases = [
    ["employee", ["평가", "연봉", "이직", "후배"]], ["business_owner", ["가격", "원가", "직원", "브랜드", "확장"]],
    ["freelancer", ["견적", "수정", "정산일", "단가", "포트폴리오"]], ["student", ["전공", "과제", "인턴", "첫 직업"]],
    ["job_seeker", ["면접", "직무군", "진입방식", "첫 선택"]],
  ] as const;
  const charts = new Set<string>(), scenes = new Set<string>();
  for (const [jobStatus, words] of cases) {
    const r = createCareerV3({ ...payload, userContext: { ...payload.userContext, jobStatus } })!;
    expect(validateCareerV3(r.draft, r.evidencePacket)).toEqual([]);
    charts.add(hash(r.evidencePacket.careerV3.calculation));
    const text = careerV3CustomerText(r.draft); words.forEach(w => expect(text).toContain(w));
    if (jobStatus === "student" || jobStatus === "job_seeker") expect(text).not.toMatch(/내 설계|내 전문성에서 멀어지는 의뢰|연봉|직급|CRM/);
    scenes.add(r.draft.chapters.find(c => c.id === "current")!.scenes.map(s => s.parts.map(p => p.text).join(" ")).join(" "));
  }
  expect(charts.size).toBe(1); expect(scenes.size).toBe(5);
});

it("raw input stays raw and escaped, unknown MBTI is not normalized into a type", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[9]);
  const raw = "고객상담 <&> " + "아주긴직업설명".repeat(18);
  const r = createCareerV3({ ...payload, userContext: { ...payload.userContext, detailJob: raw } })!;
  expect(validateCareerV3(r.draft, r.evidencePacket)).toEqual([]);
  const html = renderToStaticMarkup(createElement(CareerReportV3View, r));
  expect(html).toContain("고객상담 &lt;&amp;&gt;"); expect(html).toContain("모름");
  expect(html).not.toContain("<script>"); expect(html).toContain("overflow-wrap:anywhere");
});

it("C2 cannot be relabeled as a legacy snapshot to bypass the copy contract", () => {
  const r = createCareerV3(careerFixture(CAREER_V3_FIXTURES[0]).payload)!;
  expect(validateCareerV3({ ...r.draft, version: "career_v3.0-editorial.1" }, r.evidencePacket)).toContain("CAREER_V3_CONTENT_MISMATCH");
});

it("removing fortune evidence removes its praise instead of filling a generic good-luck slot", () => {
  const { payload } = careerFixture(CAREER_V3_FIXTURES[0]), result = createCareerV3(payload)!;
  const { facts, calculation } = result.evidencePacket.careerV3;
  const removed = ["gwiin_cheoneul", "gwiin_jaego", "twelve_sinsal_jangseong", "twelve_sinsal_banan", "twelve_sinsal_yeokma"];
  const draft = buildCareerV3Polished({ name: payload.person.name, mbti: payload.person.mbtiType, calculation,
    facts: facts.filter(f => !removed.includes(f.featureId)), context: normalizeContext({ lifeStatus: "employee", fieldLabel: payload.userContext.detailJob }) });
  expect(draft.editorialAudit.rejected).toEqual([]); expect(draft.editorialAudit.warnings).toEqual([]);
  const text = careerV3CustomerText(draft);
  expect(text).not.toMatch(/사람복도 실력의 일부|귀인의 도움|축적의 좋은 패|명예와 리더십의 좋은 직업운|자리와 인정의 좋은 패|이동과 외부 접점에서 기회/);
  expect(draft.chapters.flatMap(c => c.scenes.flatMap(s => s.evidenceRefs)).some(ref => removed.some(feature => ref.includes(feature)))).toBe(false);
});
