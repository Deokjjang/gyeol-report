import { writeFileSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createCompatibilityV3, validateCompatibilityV3 } from "../../../src/lib/report-generation/compatibilityV3Generation";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { createProductPreviewSnapshot, isProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { compatibilityRoleLabels, COMPATIBILITY_ROLE_VERSION, COMPATIBILITY_RELATIONSHIP_TYPES, MBTI_TYPES } from "../../../src/lib/report-generation/reportInputTypes";
import { compatibilityV3CustomerText, buildCompatibilityV3 } from "../../../src/lib/interpretation-v3/compatibilityEditorial";
import { CompatibilityReportV3View } from "../../../src/app/reports/[reportId]/CompatibilityReportV3View";
import { PAIR_SLOTS } from "../../../src/lib/interpretation-v3/compatibilityEditorialEvidence";
import { COMPATIBILITY_V3_FIXTURES, compatibilityFixture } from "./compatibilityFixtures";

const forbidden = /\d+\s*(?:점|\/\s*100|%)|[★☆⭐]|(?:궁합|관계)\s*(?:점수|등급|랭킹)|[SABCDF]\s*등급|원국 근거|이번 리포트|읽었습니다|실제 관계를 보장|A가 부모라면|B가 부모라면|A가 상사라면|B가 상사라면/;
const internals = /canonical-|SajuCalcResult:|evidenceRefs|sourceRefs|featureId|lineage|ten_god_|gwiin_|sinsal_|pair:received|compatibility-fixed-ab/;

describe("new compatibility role contract", () => {
  it("keeps the canonical seven enums and fixes only new roles", () => {
    expect(COMPATIBILITY_RELATIONSHIP_TYPES).toEqual(["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"]);
    expect(compatibilityRoleLabels("parentChild")).toEqual({ personA: "부모", personB: "자녀" });
    expect(compatibilityRoleLabels("managerReport")).toEqual({ personA: "상사", personB: "부하·팀원" });
    const fresh = normalizeReportInputPayload(compatibilityFixture("parentChild"));
    expect(fresh.ok && "compatibilityRoleVersion" in fresh.value && fresh.value.compatibilityRoleVersion).toBe(COMPATIBILITY_ROLE_VERSION);
    const { compatibilityRoleVersion: _v, ...legacy } = compatibilityFixture("parentChild"); void _v;
    const old = normalizeReportInputPayload(legacy); expect(old.ok && old.value).not.toHaveProperty("compatibilityRoleVersion");
    expect(createCompatibilityV3(legacy)).toBeNull();
    for (const value of [null, "", "reverse", 1, {}]) expect(normalizeReportInputPayload({ ...legacy, compatibilityRoleVersion: value })).toMatchObject({ ok: false, error: "INVALID_COMPATIBILITY_ROLE_VERSION" });
    const form = readFileSync("src/app/report/new/page.tsx", "utf8");
    expect(form).toContain("compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION");
    expect(form).toContain("nameLabelKo: `${compatibilityRoleLabels(compatibilityRelationshipType).personA} 이름`");
    expect(form).toContain("nameLabelKo: `${compatibilityRoleLabels(compatibilityRelationshipType).personB} 이름`");
  });
});

for (const { id, payload } of COMPATIBILITY_V3_FIXTURES) it(`${id}: generate → publish → snapshot → SSR`, () => {
  const r = createCompatibilityV3(payload)!; expect(r).not.toBeNull();
  const audit = r.draft.editorialAudit;
  expect(audit.errors, id).toEqual([]); expect(audit.rejected, id).toEqual([]); expect(audit.warnings, id).toEqual([]);
  expect(validateCompatibilityV3(r.draft, r.evidencePacket, payload), id).toEqual([]);
  expect(validateProductPublication(payload.productKey, r.draft, r.evidencePacket, payload)).toEqual({ ok: true, errors: [] });
  const text = compatibilityV3CustomerText(r.draft); expect(text).not.toMatch(forbidden); expect(text).not.toMatch(internals);
  expect(audit.audit.mix.character).toBeGreaterThanOrEqual(0.75); expect(audit.audit.mix.advice).toBeLessThanOrEqual(0.25);
  const scenes = r.draft.chapters.flatMap(c => c.scenes); expect(new Set(scenes.map(s => s.form)).size).toBeGreaterThanOrEqual(4);
  expect(scenes.filter(s => s.tone === "blunt" || s.tone === "reversal").length).toBeGreaterThanOrEqual(5);
  expect(r.draft.chapters[0].scenes[0].parts).toHaveLength(4); expect(r.draft.chapters.at(-1)!.scenes[0].parts).toHaveLength(5);
  const snapshot = createProductPreviewSnapshot({ reportId: id, createdAtIso: "2026-09-29T00:00:00Z", productKey: payload.productKey, productSlug: payload.productSlug, ...r });
  expect(snapshot.ok).toBe(true); if (snapshot.ok) expect(isProductPreviewSnapshot(JSON.parse(JSON.stringify(snapshot.value)))).toBe(true);
  const html = renderToStaticMarkup(createElement(CompatibilityReportV3View, r));
  expect(html).toContain("두 사람의 입력 정보"); expect(html).toContain(payload.personA.name); expect(html).toContain(payload.personB.name); expect(html).not.toMatch(internals); expect(html.replace(/<[^>]+>/g, " ").match(forbidden)).toBeNull();
  writeFileSync(`/tmp/gyeol-compatibility-e-${id}.json`, JSON.stringify({ payload, ...r }, null, 2));
  writeFileSync(`/tmp/gyeol-compatibility-e-${id}.txt`, text);
});

it("same pair changes category scenes/endings, never its calculated facts", () => {
  const bodies = new Set(), endings = new Set(), invariants = new Set();
  for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const r = createCompatibilityV3(compatibilityFixture(category))!;
    bodies.add(JSON.stringify(r.draft.chapters.filter(c => c.id.startsWith("life-")).map(c => c.scenes).flat()));
    endings.add(r.draft.chapters.at(-1)!.scenes[0].parts[3].text);
    invariants.add(JSON.stringify(r.evidencePacket.compatibilityV3.editorial.invariant));
  }
  expect(bodies.size).toBe(7); expect(endings.size).toBe(7); expect(invariants.size).toBe(1);
});

it("A/B swaps preserve all core relation facts and reverse received-god/MBTI direction", () => {
  for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const payload = compatibilityFixture(category), a = createCompatibilityV3(payload)!, b = createCompatibilityV3({ ...payload, personA: payload.personB, personB: payload.personA })!;
    const ea = a.evidencePacket.compatibilityV3.editorial, eb = b.evidencePacket.compatibilityV3.editorial;
    expect(ea.invariant, category).toEqual(eb.invariant);
    expect(ea.direction.aToB).toEqual(eb.direction.bToA); expect(ea.direction.bToA).toEqual(eb.direction.aToB);
    const get = (r: typeof a, slot: string) => r.draft.chapters[1].scenes.find(s => s.subject === slot)!.parts;
    expect(get(a, "personA")).not.toEqual(get(a, "personB"));
    if (category !== "parentChild" && category !== "managerReport") {
      expect(a.draft.chapters[0].scenes[0].parts).toEqual(b.draft.chapters[0].scenes[0].parts);
      expect(get(a, "personA")).toEqual(get(b, "personB"));
    } else {
      const role = category === "parentChild" ? "부모" : "상사";
      expect(compatibilityV3CustomerText(a.draft)).toContain(`${role} ${payload.personA.name}님`);
      expect(compatibilityV3CustomerText(b.draft)).toContain(`${role} ${payload.personB.name}님`);
    }
  }
});

it("MBTI counterfactual changes behavior, keeps natal invariants and never infers unknown types", () => {
  const variants = new Set(), invariants = new Set(), failures: unknown[] = [];
  for (const mbtiType of MBTI_TYPES) {
    const payload = compatibilityFixture(), r = createCompatibilityV3({ ...payload, personA: { ...payload.personA, mbtiType } })!;
    const errors = validateCompatibilityV3(r.draft, r.evidencePacket); if (errors.length) failures.push({ mbtiType, errors, qa: r.draft.editorialAudit });
    variants.add(r.draft.chapters[1].scenes[0].parts.map(p => p.text).join(" ")); invariants.add(JSON.stringify(r.evidencePacket.compatibilityV3.editorial.invariant));
  }
  expect(failures).toEqual([]); expect(variants.size).toBe(MBTI_TYPES.length); expect(invariants.size).toBe(1);
  for (const types of [["", "INFP"], ["", ""]]) {
    const payload = compatibilityFixture(), r = createCompatibilityV3({ ...payload, personA: { ...payload.personA, mbtiType: types[0] }, personB: { ...payload.personB, mbtiType: types[1] } })!;
    expect(validateCompatibilityV3(r.draft, r.evidencePacket)).toEqual([]);
    expect(r.evidencePacket.compatibilityV3.editorial.facts.filter(f => f.subject === "personA" && f.kind === "mbti")).toEqual([]);
    expect(r.draft.people.personA.mbti).toBe("");
    if (!types[1]) expect(compatibilityV3CustomerText(r.draft)).not.toMatch(/ENTJ|INFP|INFJ|ENFP/);
  }
});

it("charm counterfactual uses real visible/intimate/both/neither evidence only", () => {
  for (const [i, dohwa, hongyeom] of [[0, false, false], [1, true, true], [2, true, false], [3, false, true]] as const) {
    const r = createCompatibilityV3(compatibilityFixture("love", i, 4))!, text = compatibilityV3CustomerText(r.draft);
    expect(text.includes("도화"), String(i)).toBe(dohwa); expect(text.includes("홍염"), String(i)).toBe(hongyeom);
    if (dohwa) expect(text).toContain("첫인상에서 시선을 끄는"); if (hongyeom) expect(text).toContain("가까워질수록 매력이 짙어지는");
    const e = r.evidencePacket.compatibilityV3.editorial, excluded = e.facts.filter(f => /dohwa|hongyeom/.test(f.featureId)).map(f => f.id);
    const weak = buildCompatibilityV3({ ...e, substantial: e.substantial.filter(id => !excluded.includes(id)) }, "love");
    expect(compatibilityV3CustomerText(weak)).not.toMatch(/도화|홍염/);
  }
});

it("rejects forged roles, content, category, facts and version; old input remains legacy without provider calls", async () => {
  const payload = compatibilityFixture("parentChild"), r = createCompatibilityV3(payload)!;
  expect(validateCompatibilityV3({ ...r.draft, people: { ...r.draft.people, personA: { ...r.draft.people.personA, role: "자녀" } } }, r.evidencePacket)).toContain("COMPATIBILITY_V3_CONTENT_MISMATCH");
  expect(validateCompatibilityV3(r.draft, { ...r.evidencePacket, inputBasis: { ...r.evidencePacket.inputBasis, compatibilityRoleVersion: undefined } })).toContain("COMPATIBILITY_V3_ROLE_CONTRACT_REQUIRED");
  expect(validateCompatibilityV3(r.draft, r.evidencePacket, { ...payload, relationshipType: "love" })).toContain("COMPATIBILITY_V3_INPUT_MISMATCH");
  expect(validateCompatibilityV3(r.draft, { ...r.evidencePacket, personAChartSummary: { ...r.evidencePacket.personAChartSummary, mbti: "ISFP" } })).toContain("COMPATIBILITY_V3_CHART_INPUT_MISMATCH");
  expect(validateCompatibilityV3(r.draft, { ...r.evidencePacket, personBChartSummary: { ...r.evidencePacket.personBChartSummary, dayMaster: "甲" } })).toContain("COMPATIBILITY_V3_CHART_INPUT_MISMATCH");
  const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("NO_EXTERNAL_CALLS"));
  try {
    const runtime = { enabled: false as const, reason: "flag_disabled" as const };
    const result = await generateProductReport(payload, runtime, "normal_writer"); expect(result.ok, JSON.stringify(result)).toBe(true); expect(result.externalCalls).toEqual([]);
    const invalid = await generateProductReport({ ...payload, compatibilityRoleVersion: "reverse" }, runtime, "normal_writer"); expect(invalid.ok).toBe(false);
    const { compatibilityRoleVersion: _version, ...oldPayload } = payload; void _version;
    const legacy = await generateProductReport(oldPayload, runtime, "deterministic_fallback"); expect(legacy.ok).toBe(true);
    if (legacy.ok) { expect(legacy.draft).not.toHaveProperty("version", r.draft.version); expect(validateProductPublication(payload.productKey, legacy.draft, legacy.evidencePacket).ok).toBe(true); }
    expect(fetchMock).not.toHaveBeenCalled();
  } finally { fetchMock.mockRestore(); }
});

it("all scene references belong to both actual people and substantial roots, not arbitrary ranking", () => {
  const r = createCompatibilityV3(compatibilityFixture())!, e = r.evidencePacket.compatibilityV3.editorial;
  for (const scene of r.draft.chapters.flatMap(c => c.scenes)) {
    for (const slot of PAIR_SLOTS) expect(scene.evidenceRefs.some(id => e.facts.some(f => f.id === id && f.subject === slot))).toBe(true);
    expect(scene.evidenceRefs.some(id => e.substantial.includes(id))).toBe(true);
  }
  expect(r.draft).not.toHaveProperty("score"); expect(r.draft).not.toHaveProperty("ranking");
});

it("all 17 × 17 MBTI pairs and twelve varied natal inputs remain publishable", () => {
  const failures: unknown[] = [];
  for (const a of MBTI_TYPES) for (const b of MBTI_TYPES) {
    const p = compatibilityFixture(), r = createCompatibilityV3({ ...p, personA: { ...p.personA, mbtiType: a }, personB: { ...p.personB, mbtiType: b } })!;
    const errors = validateCompatibilityV3(r.draft, r.evidencePacket);
    if (errors.length) failures.push({ a, b, errors, rejected: r.draft.editorialAudit.rejected, warnings: r.draft.editorialAudit.warnings });
  }
  for (let i = 0; i < 12; i++) for (const category of COMPATIBILITY_RELATIONSHIP_TYPES) {
    const r = createCompatibilityV3(compatibilityFixture(category, i, (i + 3) % 12))!;
    const errors = validateCompatibilityV3(r.draft, r.evidencePacket);
    if (errors.length) failures.push({ i, category, errors, rejected: r.draft.editorialAudit.rejected, warnings: r.draft.editorialAudit.warnings });
  }
  expect(failures).toEqual([]);
}, 30_000);

it("unknown time and same-name inputs do not invent hour facts or lose direction", () => {
  const p = compatibilityFixture();
  for (const personA of [{ ...p.personA, birthTime: "", birthTimeUnknown: true }, { ...p.personA, name: p.personB.name }]) {
    const r = createCompatibilityV3({ ...p, personA })!;
    expect(validateProductPublication(p.productKey, r.draft, r.evidencePacket)).toEqual({ ok: true, errors: [] });
    expect(r.draft.chapters[1].scenes).toHaveLength(2);
    if (personA.birthTimeUnknown) {
      expect(r.evidencePacket.compatibilityV3.editorial.relations.every(r => r.refs.every(ref => ref.person !== "personA" || ref.position !== "hour"))).toBe(true);
      expect(renderToStaticMarkup(createElement(CompatibilityReportV3View, r))).toContain("출생시간 범위에서 확인된 원국만");
    }
  }
});
