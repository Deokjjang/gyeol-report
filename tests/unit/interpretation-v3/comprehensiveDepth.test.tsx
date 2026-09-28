import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { createComprehensiveV3 } from "../../../src/lib/report-generation/comprehensiveV3Generation";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { buildComprehensiveFinal, comprehensiveCandidates, comprehensiveV3CustomerText, isComprehensiveV3Draft, type ComprehensiveV3Draft } from "../../../src/lib/interpretation-v3/comprehensive";
import { assembleComprehensiveDepth, DEPTH_COMPREHENSIVE_VERSION } from "../../../src/lib/interpretation-v3/comprehensiveDepth";
import { normalizeContext } from "../../../src/lib/interpretation-v3/context";
import { storySupport } from "../../../src/lib/interpretation-v3/comprehensiveStoryEvidence";
import { COMPREHENSIVE_EDITORIAL_MIX } from "../../../src/lib/interpretation-v3/editorialComposer";
import { REALITY_VOICES } from "../../../src/lib/interpretation-v3/comprehensiveExperienceCopy";
import { publicSignalRows } from "../../../src/lib/interpretation-v3/comprehensivePublicSignals";
import { ComprehensiveReportV3View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV3View";
import { COMPREHENSIVE_V3_FIXTURES, comprehensiveFixture } from "./comprehensiveFixtures";

const sha = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
const finalHashes = ["3bc2b0ad78fbfdaa00dcc7073091523563ab35e88471b7c0726011d72bea3884", "767b4d50cd6bec8f14080355c400890ca988161998b3e8029a18a2815c39d89b", "ea3c845877b0fe35085aa8af4ecdfa0df30f8dfe38d1fea1012ee7024b12981d", "522a8474e0dc09cd50c97508b362af81db5e9fcf68335416de0f5715c31db215", "f72719d9c59919ff0e90479d56b7c8460407e9d8e317eaf96ba6bcd7a07d117c", "eb9e8b38f4a3d0deafbb3ffe229d61e615ccbd745839da7dc8fabb989acf92b9"];
const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|ten_god_|day_pillar_|gwiin_|sinsal_|mbti:[A-Z]{4}:|comprehensiveDepth:|overuse:|portrait-main/;
const blocks = (d: ComprehensiveV3Draft) => [...d.opening, ...d.sections.flatMap(s => s.blocks)];
afterEach(() => expect(fetch).not.toHaveBeenCalled());

function fixture(row: readonly string[]) {
  const { id, payload } = comprehensiveFixture(row), result = createComprehensiveV3(payload)!;
  const { facts, calculation } = result.evidencePacket.comprehensiveV3;
  const input = { name: payload.person.name, facts, calculation, profileTable: result.draft.profileTable,
    context: normalizeContext({ lifeStatus: payload.userContext.jobStatus, fieldLabel: payload.userContext.detailJob, relationshipStatus: payload.userContext.relationshipStatus }), relationshipStatus: payload.userContext.relationshipStatus };
  return { id, payload, result, input, facts, calculation };
}

it.each(COMPREHENSIVE_V3_FIXTURES)("%s editorial depth, exact old snapshot, publish and SSR", (...row) => {
  const { id, payload, result, input, facts, calculation } = fixture(row), draft = result.draft, text = comprehensiveV3CustomerText(draft);
  const assembly = assembleComprehensiveDepth(input, comprehensiveCandidates(facts, true));
  const scenes = assembly.composition!.scenes;
  expect(scenes.some((s, i) => i > 0 && s.tone === scenes[i - 1].tone), id).toBe(false);
  const old = buildComprehensiveFinal(input);
  expect(sha(old)).toBe(finalHashes[id.charCodeAt(0) - 65]);
  expect(validateProductPublication("saju_mbti_full", JSON.parse(JSON.stringify(old)), result.evidencePacket).ok).toBe(true);
  const qa = draft.editorialAudit;
  process.stdout.write(JSON.stringify({ id, chars: text.length, mix: qa?.mix, rejected: qa?.rejected, warnings: qa?.warnings, publication: validateProductPublication("saju_mbti_full", draft, result.evidencePacket), questions: (text.match(/\?/g) ?? []).length }) + "\n");
  if (process.env.DEPTH_REVIEW_OUTPUT === "1") {
    writeFileSync(`/tmp/gyeol-depth-${id}.json`, JSON.stringify(result));
    writeFileSync(`/tmp/gyeol-depth-${id}.txt`, text);
    writeFileSync(`/tmp/gyeol-depth-assembly-${id}.json`, JSON.stringify(assembly.composition));
  }
  expect(draft.version).toBe(DEPTH_COMPREHENSIVE_VERSION);
  expect(qa?.rejected).toEqual([]); expect(qa?.warnings).toEqual([]); expect(qa?.errors).toEqual([]);
  for (const role of ["character", "explanation", "advice"] as const) {
    expect(qa!.mix[role], `${id}/${role}`).toBeGreaterThanOrEqual(COMPREHENSIVE_EDITORIAL_MIX[role][0]);
    expect(qa!.mix[role], `${id}/${role}`).toBeLessThanOrEqual(COMPREHENSIVE_EDITORIAL_MIX[role][1]);
  }
  const publication = validateProductPublication("saju_mbti_full", JSON.parse(JSON.stringify(draft)), result.evidencePacket);
  expect(publication.errors).toEqual([]);
  const snapshot = createProductPreviewSnapshot({ reportId: `depth-${id}`, createdAtIso: "2026-09-28T00:00:00Z", productKey: "saju_mbti_full", productSlug: "saju-mbti-full", draft, evidencePacket: result.evidencePacket });
  expect(snapshot.ok && isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const all = blocks(draft);
  const qs = (text.match(/\?/g) ?? []).length; expect(qs).toBeGreaterThanOrEqual(2); expect(qs).toBeLessThanOrEqual(5);
  expect(new Set(all.map(b => b.editorialForm)).size).toBe(5);
  for (const b of all.filter(b => b.kind !== "lifestyle")) {
    expect(b.evidenceRefs.length, b.id).toBeGreaterThan(0);
    for (const ref of b.evidenceRefs) expect(facts.some(f => f.id === ref), `${b.id}/${ref}`).toBe(true);
    if (b.prominence === "hero") for (const f of facts.filter(f => b.evidenceRefs.includes(f.id) && f.kind !== "mbti" && f.kind !== "spouse_palace")) expect(storySupport(f.featureId, facts, calculation).substantial, `${b.id}/${f.featureId}`).toBe(true);
    if (b.kind === "fusion") expect(facts.some(f => b.evidenceRefs.includes(f.id) && f.kind === "mbti" && f.featureId.includes(":traits:"))).toBe(true);
  }
  expect(all.some(b => b.kind === "compound")).toBe(true);
  expect(draft.sections.find(s => s.id === "balance")?.blocks).toHaveLength(5);
  expect(draft.patterns).toHaveLength(facts.some(f => f.featureId === "sinsal_yangin" && storySupport(f.featureId, facts, calculation).substantial) ? 4 : 3);
  expect(draft.directionEvidenceRefs.length).toBeGreaterThanOrEqual(3);
  expect(text).not.toMatch(internals); expect(text).not.toContain("잘 쓰면 ·");
  const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft, evidencePacket: result.evidencePacket }));
  expect(html).toContain(DEPTH_COMPREHENSIVE_VERSION); expect(html).not.toContain("리포트를 준비하고 있습니다"); expect(html).not.toMatch(internals);
  expect(html).toContain("data-all-signals"); expect(publicSignalRows(facts, calculation, draft).length).toBeGreaterThanOrEqual(10);
  expect(html.indexOf("리포트 목차")).toBeLessThan(html.indexOf("계산된 원국과 성향"));
  expect(html.indexOf("data-story-signals")).toBeLessThan(html.indexOf('id="v3-core"'));
  expect(draft.opening.flatMap(b => b.paragraphs ?? []).join(" ")).toContain(payload.person.name);
});

it("default explicit V3 uses depth without provider calls", async () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const r = await generateProductReport(payload, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", undefined, { comprehensiveVersion: "v3" });
  expect(r.ok, r.ok ? "" : JSON.stringify(r)).toBe(true);
  if (r.ok && isComprehensiveV3Draft(r.draft)) { expect(r.draft.version).toBe(DEPTH_COMPREHENSIVE_VERSION); expect(r.externalCalls).toEqual([]); }
});

it("does not invent MBTI for unknown, and preserves natal calculation across the 16-type counterfactual", () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]);
  const texts = new Set<string>(), natal = new Set<string>();
  for (const type of [...REALITY_VOICES.map(r => r.trait.split(":")[0]), ""]) {
    const r = createComprehensiveV3({ ...payload, person: { ...payload.person, mbtiType: type } })!;
    const text = comprehensiveV3CustomerText(r.draft);
    texts.add(text); natal.add(sha(r.evidencePacket.comprehensiveV3.calculation));
    expect(r.draft.editorialAudit?.rejected, type).toEqual([]); expect(r.draft.editorialAudit?.warnings, type).toEqual([]);
    if (!type) expect(text).not.toMatch(/ENTJ|INFP|Te–Ni|MBTI의/);
  }
  expect(texts.size).toBe(17); expect(natal.size).toBe(1);
});

it("102 natal/MBTI combinations retain provenance, varied human behavior and publishable SSR", () => {
  const issues: unknown[] = [], endings = new Set<string>();
  for (const row of COMPREHENSIVE_V3_FIXTURES) {
    const { id, payload } = comprehensiveFixture(row), behaviors = new Set<string>(), natal = new Set<string>();
    for (const type of [...REALITY_VOICES.map(r => r.trait.split(":")[0]), ""]) {
      const r = createComprehensiveV3({ ...payload, person: { ...payload.person, mbtiType: type } })!;
      const qa = r.draft.editorialAudit!, publication = validateProductPublication("saju_mbti_full", r.draft, r.evidencePacket);
      if (!publication.ok || qa.rejected.length || qa.warnings.length) issues.push({ id, type, publication, qa });
      const fs = r.evidencePacket.comprehensiveV3.facts, calc = r.evidencePacket.comprehensiveV3.calculation;
      natal.add(sha(calc));
      const bs = blocks(r.draft);
      const character = bs.filter(b => b.kind === "fusion").flatMap(b => b.paragraphs?.filter((_, i) => b.editorialRoles?.[i] === "character") ?? []).join(" ");
      if (type) { expect(character.length, `${id}/${type}`).toBeGreaterThan(0); behaviors.add(character); }
      else expect(bs.some(b => b.kind === "fusion")).toBe(false);
      for (const b of bs.filter(b => b.prominence === "hero")) for (const f of fs.filter(f => b.evidenceRefs.includes(f.id) && f.kind !== "mbti" && f.kind !== "spouse_palace")) {
        expect(storySupport(f.featureId, fs, calc).substantial, `${id}/${type}/${b.id}`).toBe(true);
      }
      const html = renderToStaticMarkup(createElement(ComprehensiveReportV3View, { draft: r.draft, evidencePacket: r.evidencePacket }));
      expect(html).not.toMatch(internals); expect(html).not.toContain("리포트를 준비하고 있습니다");
    }
    expect(behaviors.size, id).toBe(16); expect(natal.size).toBe(1);
    endings.add(createComprehensiveV3(payload)!.draft.direction.split("\n\n").at(-1)!);
  }
  expect(issues).toEqual([]); expect(endings.size).toBe(6);
}, 30_000);

it("strong precision has five distinct life manifestations; weak wealth and absent attraction cannot lead", () => {
  const a = fixture(COMPREHENSIVE_V3_FIXTURES[0]), d = fixture(COMPREHENSIVE_V3_FIXTURES[3]);
  const expressions = blocks(d.result.draft).filter(b => b.id.startsWith("precision-"));
  expect(expressions).toHaveLength(5); expect(new Set(expressions.map(b => b.paragraphs?.join(" "))).size).toBe(5);
  for (const b of expressions) expect(b.evidenceRefs.some(id => d.facts.find(f => f.id === id)?.featureId === "sinsal_hyeonchim")).toBe(true);
  for (const b of blocks(a.result.draft).filter(b => b.prominence === "hero")) expect(b.evidenceRefs.some(id => a.facts.find(f => f.id === id)?.featureId.match(/ten_god_(pian|zheng)_cai/))).toBe(false);
  for (const row of COMPREHENSIVE_V3_FIXTURES) {
    const { result, facts } = fixture(row), text = comprehensiveV3CustomerText(result.draft);
    for (const [id, label] of [["sinsal_dohwa", "도화"], ["sinsal_hongyeom", "홍염"]]) if (!facts.some(f => f.featureId === id)) expect(text).not.toContain(label);
  }
});

it("young/student and unspecified work contexts stay valid without adult-life invention", () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[3]);
  for (const [birthDate, jobStatus] of [["2010-03-22", "student"], ["1984-06-15", "other"]]) {
    const p = { ...payload, person: { ...payload.person, birthDate }, userContext: { ...payload.userContext, jobStatus, detailJob: "", relationshipStatus: "single" } };
    const r = createComprehensiveV3(p)!;
    expect(r.draft.editorialAudit?.rejected, birthDate).toEqual([]);
    expect(r.draft.editorialAudit?.warnings, birthDate).toEqual([]);
    expect(validateProductPublication("saju_mbti_full", r.draft, r.evidencePacket).errors).toEqual([]);
    expect(comprehensiveV3CustomerText(r.draft)).not.toMatch(/승진|직장 상사|퇴근|연봉|결혼 생활|배우자와|납품|견적|계약 규모/);
    expect(createComprehensiveV3(p)?.draft).toEqual(r.draft);
  }
});

it("additional birth dates and both genders publish without invented filler or editorial rejection", () => {
  const { payload } = comprehensiveFixture(COMPREHENSIVE_V3_FIXTURES[0]), issues: unknown[] = [];
  for (const [i, year] of [1984, 1990, 1996, 2002, 2010].entries()) for (const [j, suffix] of ["01-15", "05-08", "09-23"].entries()) {
    const birthDate = `${year}-${suffix}`;
    const p = { ...payload, person: { ...payload.person, birthDate, birthTime: "12:30", gender: j % 2 ? "FEMALE" : "MALE", mbtiType: REALITY_VOICES[(i * 3 + j) % 16].trait.split(":")[0] } };
    const r = createComprehensiveV3(p)!;
    const check = validateProductPublication("saju_mbti_full", r.draft, r.evidencePacket);
    if (!check.ok) issues.push({ birthDate, errors: check.errors, rejected: r.draft.editorialAudit?.rejected, warnings: r.draft.editorialAudit?.warnings, patterns: r.draft.patterns.length,
      gifts: r.draft.sections.find(s => s.id === "gifts")?.blocks.map(b => ({ id: b.id, form: b.editorialForm, mode: b.writingMode })) });
  }
  expect(issues).toEqual([]);
});
