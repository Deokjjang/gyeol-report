import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import type { ReportProductKey } from "../../../src/lib/report-generation/reportInputTypes";
import { completenessManifest } from "../../fixtures/report-sharing/completeness";
import { ROBUSTNESS_FIXTURES, ROBUSTNESS_COUNTEREXAMPLES } from "./robustnessFixtures";
import { interpretCareerContextV3 } from "../../../src/lib/interpretation-v3/careerContextV3";
import { careerEditorialScenes } from "../../../src/lib/interpretation-v3/careerEditorialScenes";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { auditNarrativeRepetition, narrativeParagraphs, repeatedFinalPunchlines } from "../../../src/lib/interpretation-v3/repetitionGuard";
import { createLoveV3, validateLoveV3 } from "../../../src/lib/report-generation/loveV3Generation";
import { createCompatibilityV3 } from "../../../src/lib/report-generation/compatibilityV3Generation";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { getCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { LoveReportV3View } from "../../../src/app/reports/[reportId]/LoveReportV3View";
import { compatibilityFixture } from "./compatibilityFixtures";
import { narrativeSentences } from "../../../src/lib/interpretation-v3/contentRevision";

const allBodies: Record<string, readonly string[]> = {};

it.each(Object.entries({ ...ROBUSTNESS_FIXTURES, ...ROBUSTNESS_COUNTEREXAMPLES }))("%s uses production generation and a complete persisted V3 snapshot", async (key, payload) => {
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-30T03:00:00Z"));
  try {
    const generated = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "normal_writer");
    expect(generated.ok, JSON.stringify(generated)).toBe(true);
    if (!generated.ok) return;
    expect(generated.externalCalls).toEqual([]);
    expect(generated.draft).toHaveProperty("productVersion", "v3");
    const paragraphs = narrativeParagraphs(generated.draft), repetition = auditNarrativeRepetition(paragraphs);
    if (key in ROBUSTNESS_FIXTURES) allBodies[key] = paragraphs;
    expect(repetition.exact, key).toEqual([]);
    expect(repetition.phrases, key).toEqual([]);
    expect(repetition.nearScenes.length, key).toBeLessThanOrEqual(2);
    const text = paragraphs.join("\n\n");
    expect(text).not.toMatch(/경계으로|경계이\s|경계을\s|겁재은|정재은|적용한 지침입니다|편인\s*·\s*화개살\s*·\s*화개살/);
    if (key === "career") { expect(text).toMatch(/예산/); expect(text).toMatch(/손익/); expect(text).not.toMatch(/불량|안전 확인|앞 공정/); }
    if (key === "love") { expect(text).toContain("병원 행정직"); expect(text).not.toMatch(/짝사랑|이별재회|임신합니다|아들을 낳/); }
    if (key === "major") { expect(text).toMatch(/상품|고객|팀/); expect(text).not.toMatch(/수업 준비|학생의 표정|동료 교사/); }
    if (key === "annual") { expect(text).not.toContain("지금의 직업에서"); for (const phrase of ["수습을 잘하면", "짧은 답장을 해석하다 보면"]) expect(text.split(phrase).length - 1).toBeLessThanOrEqual(1); }
    if (key === "studentCareer") expect(text).not.toMatch(/내 연봉|직장 상사|현재 회사/);
    if (key === "ownerCareer") { expect(text).toMatch(/고객|상품|현금흐름/); expect(text).not.toMatch(/수업 준비|학생의 표정/); }
    if (key === "unknownMbti") expect(text).not.toMatch(/ISFP|ENTJ|INFP|ENFP/);
    const snapshot = createProductPreviewSnapshot({ reportId: `report_robust_${key}`, createdAtIso: "2026-09-30T03:00:00Z", productKey: payload.productKey as ReportProductKey, productSlug: payload.productSlug as Parameters<typeof createProductPreviewSnapshot>[0]["productSlug"], draft: generated.draft as ProductPreviewSnapshotDraft, evidencePacket: generated.evidencePacket });
    expect(snapshot.ok, JSON.stringify(snapshot)).toBe(true);
    if (snapshot.ok) {
      const manifest = completenessManifest(snapshot.value);
      if (key === "major") {
        expect(manifest.years).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
        for (const year of manifest.sections.filter(s => /^year-20(?:2[6-9]|3[0-6])$/.test(s.id))) expect(year.text.length, year.id).toBeGreaterThanOrEqual(5);
      }
      if (key === "annual") {
        expect(manifest.collections.months).toBe(12);
        expect(manifest.currentMonths).toBe(1);
        expect(text).not.toMatch(/상사|연봉|승진|현재 회사|고객에게|시간·고객·기술/);
      }
      const dir = process.env.ROBUSTNESS_QA_DIR;
      if (dir) { mkdirSync(dir, { recursive: true }); writeFileSync(`${dir}/${key}.json`, JSON.stringify(snapshot.value)); writeFileSync(`${dir}/${key}-manifest.json`, JSON.stringify(manifest)); writeFileSync(`${dir}/${key}.txt`, text); writeFileSync(`${dir}/${key}-repetition.json`, JSON.stringify(repetition)); }
    }
  } finally { vi.useRealTimers(); }
});

it("exports before/after repetition counts from actual review snapshots when available", () => {
  const baseline = process.env.ROBUSTNESS_BASELINE_SNAPSHOTS, dir = process.env.ROBUSTNESS_QA_DIR;
  if (!baseline || !dir) return;
  const snapshots = Object.values(JSON.parse(readFileSync(baseline, "utf8"))) as { productKey: string; draft: unknown }[];
  const comparison = Object.entries(ROBUSTNESS_FIXTURES).map(([key, input]) => {
    const old = snapshots.find(s => s.productKey === input.productKey);
    const before = old ? narrativeParagraphs(old.draft) : [];
    return { key, before: before.length ? auditNarrativeRepetition(before) : null, after: auditNarrativeRepetition(allBodies[key]) };
  });
  writeFileSync(`${dir}/repetition-comparison.json`, JSON.stringify(comparison, null, 2));
});

it("six customers have different closing lines; guard detects injected repetitions and near scenes", () => {
  expect(Object.keys(allBodies)).toHaveLength(6);
  expect(repeatedFinalPunchlines(Object.values(allBodies))).toEqual([]);
  const sample = "같은 부탁을 여러 번 들어주다 보면 내가 원하는 일을 시작할 시간은 뒤로 밀려나기 쉽습니다.";
  expect(auditNarrativeRepetition([sample, sample, sample]).exact).toHaveLength(1);
  expect(auditNarrativeRepetition([sample, sample, sample]).phrases.length).toBeGreaterThan(0);
  const long = sample + " 주변의 기대를 정리한 뒤에는 다음 선택에 필요한 여유도 다시 돌아볼 수 있습니다.";
  expect(auditNarrativeRepetition([long, long]).nearScenes).toHaveLength(1);
  expect(repeatedFinalPunchlines([[sample], [sample]])).toEqual([sample]);
});

it.each(["exact", "approximate", "unknown"])("Love %s uses the existing confirmed pillar contract and V3 UI", precision => {
  const base = ROBUSTNESS_FIXTURES.love;
  const person = { ...base.person, birthTimePrecision: precision, birthTime: precision === "exact" ? "09:30" : "", birthTimeUnknown: precision === "unknown", approximateBirthTimeSlot: precision === "approximate" ? "SASI" : "" };
  const result = createLoveV3({ ...base, person })!;
  expect(result).toBeTruthy(); expect(validateLoveV3(result.draft, result.evidencePacket)).toEqual([]);
  const calculation = result.evidencePacket.loveV3.calculation, table = getCanonicalNatalTable(result.evidencePacket)!;
  expect(calculation.pillars).toEqual(calculation.birthTimeContext!.confirmed);
  expect(table.precision).toBe(precision);
  if (precision === "unknown") {
    expect(calculation.pillars.hour).toBeUndefined(); expect(table.pillars.some(p => p.columnId === "hour")).toBe(false);
    expect(table.features.flatMap(f => f.positions)).not.toContain("hour");
  }
  const html = renderToStaticMarkup(createElement(LoveReportV3View, result));
  expect(html).toContain("love_v3.0-editorial.2"); expect(html).toContain('id="love-direction"');
  if (precision === "unknown") expect(html).toContain("일부 시주 기반 해석은 제외됩니다");
});

it("pair endings reflect directional needs, not only renamed people", () => {
  const a = createCompatibilityV3(ROBUSTNESS_FIXTURES.compatibility)!;
  const b = createCompatibilityV3(compatibilityFixture("love"))!;
  const end = (d: typeof a.draft) => d.chapters.at(-1)!.scenes.at(-1)!.parts.at(-1)!.text;
  expect(end(a.draft)).not.toBe(end(b.draft));
  const swapped = createCompatibilityV3({ ...ROBUSTNESS_FIXTURES.compatibility, personA: ROBUSTNESS_FIXTURES.compatibility.personB, personB: ROBUSTNESS_FIXTURES.compatibility.personA })!;
  expect(end(swapped.draft)).toBe(end(a.draft));
});

it.each(["love", "marriage", "friendship", "businessPartner", "coworker", "parentChild", "managerReport"] as const)("%s final sentence changes with the pair, not just its names", category => {
  const a = createCompatibilityV3({ ...ROBUSTNESS_FIXTURES.compatibility, relationshipType: category })!;
  const b = createCompatibilityV3(compatibilityFixture(category))!;
  expect(a).toBeTruthy(); expect(b).toBeTruthy();
  const last = (d: typeof a.draft) => narrativeSentences(d.chapters.at(-1)!.scenes.at(-1)!.parts.at(-1)!.text).at(-1);
  expect(last(a.draft)).not.toBe(last(b.draft));
});

it("real pre-patch saved snapshots remain readable when supplied for release QA", () => {
  const path = process.env.ROBUSTNESS_LEGACY_SNAPSHOTS;
  if (!path) return;
  const snapshots = JSON.parse(readFileSync(path, "utf8")) as Record<string, { productKey: ReportProductKey; draft: unknown; evidencePacket: unknown }>;
  expect(Object.keys(snapshots).length).toBeGreaterThanOrEqual(6);
  for (const [key, snapshot] of Object.entries(snapshots)) expect(validateProductPublication(snapshot.productKey, snapshot.draft, snapshot.evidencePacket).errors, key).toEqual([]);
});

it.each([
  ["제조업 재무기획 과장", "employee", "manufacturing", "finance_planning", /예산|손익/, /불량|안전|공정/],
  ["온라인 교육사업 대표", "business_owner", "education", "business_operations", /고객|상품|운영/, /수업|학생|교사/],
  ["온라인 강사", "freelancer", "education", "teaching", /학생|수업/, /처치/],
  ["병원 행정직", "employee", "healthcare", "administration", /서류|안내/, /처치|환자의 작은 변화/],
  ["제조업 품질관리", "employee", "manufacturing", "field_operations", /공정|불량/, /수업/],
] as const)("function-first: %s", (job, status, industry, fn, included, excluded) => {
  const work = interpretCareerContextV3(job, true, status);
  expect(work.industry).toBe(industry); expect(work.function).toBe(fn);
  const scenes = Object.values(careerEditorialScenes(normalizeContext({ lifeStatus: status, fieldLabel: job }), work)).join(" ");
  expect(scenes).toMatch(included); expect(scenes).not.toMatch(excluded);
});
