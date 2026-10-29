import { mkdirSync, writeFileSync } from "node:fs";
import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectV4Tables, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { projectYinYang, buildContentEvidencePool, createContentSelection, planChapter } from "../../../src/lib/interpretation-v4/contentEvidence";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { conversationalVoice } from "../../../src/lib/interpretation-v4/contentSynthesis";
import { auditContentMbtiLinks } from "../../../src/lib/interpretation-v4/contentMbti";
import { NatalTable } from "../../../src/app/dev/book-preview/BookPages";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MATERIAL_REGISTRY } from "../../../src/lib/interpretation-v4/materialRegistry";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { singleRuntimeInput, SHADOW_CLOCK } from "./runtimeFixtures";
import { COMPATIBILITY_RELATIONSHIP_TYPES, COMPATIBILITY_ROLE_VERSION } from "../../../src/lib/report-generation/reportInputTypes";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";

const products = [["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"], ["love_marriage_child", "love-marriage-child"], ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"]] as const;

describe("Phase13A real-calculation content review exports", () => {
  it("exports twelve independent people, including an unknown hour and MBTI", () => {
    const dir = process.env.V4_CONTENT_REVIEW_EXPORT;
    if (dir) mkdirSync(dir, { recursive: true });
    for (const fixture of NARRATIVE_FIXTURES) {
      const input = fixtureInput(fixture);
      for (const [product, compose] of [["comprehensive", composeComprehensiveNarrative], ["career", composeCareerNarrative], ["love", composeLoveNarrative]] as const) {
        const result = compose(input);
        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        if (dir) {
          writeFileSync(`${dir}/${fixture.id}-${product}.txt`, narrativeText(result.narrative));
          writeFileSync(`${dir}/${fixture.id}-${product}.json`, JSON.stringify({ input, ...result }, null, 2));
        }
        expect(result.narrative.finalLine).not.toBe("");
        expect(result.editorial.filter(i => i.severity !== "Minor"), `${fixture.id}/${product}`).toEqual([]);
      }
    }
  });
  it.each(NARRATIVE_FIXTURES)("$id: six actual packets publish with unchanged calculation and complete Book data", async (fixture) => {
    const i = NARRATIVE_FIXTURES.indexOf(fixture), other = NARRATIVE_FIXTURES[(i + 1) % NARRATIVE_FIXTURES.length];
    const payloads: unknown[] = products.map(([key, slug]) => ({ ...singleRuntimeInput(key, slug, fixture, i === 6 ? "SINSI" : ""),
      ...(i === 6 ? { person: { ...singleRuntimeInput(key, slug, fixture, "SINSI").person, birthTime: "" } } : {}),
      productOptions: { contentVersion: "v3", ...(key === "annual_fortune" ? { selectedYear: "2026" } : {}) } }));
    payloads.push({ productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: COMPATIBILITY_RELATIONSHIP_TYPES[i % 7], compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
      personA: singleRuntimeInput("", "", fixture).person, personB: singleRuntimeInput("", "", other).person });
    for (const payload of payloads) {
      const r = await generateV4ShadowReport(payload, SHADOW_CLOCK);
      if (!r.ok && process.env.V4_CONTENT_REVIEW_EXPORT) {
        const key = (payload as { productKey: string }).productKey;
        const detail = key === "major_fortune" ? await composeMajorFortuneNarrative(payload, SHADOW_CLOCK.evaluatedAt) : key === "annual_fortune" ? await composeAnnualFortuneNarrative(payload, { currentDate: SHADOW_CLOCK.evaluatedAt }) : r;
        writeFileSync(`${process.env.V4_CONTENT_REVIEW_EXPORT}/${fixture.id}-${key}-failure.json`, JSON.stringify({ r, detail }, null, 2));
      }
      expect(r, `${fixture.id}/${(payload as { productKey: string }).productKey}: ${JSON.stringify(r.ok ? [] : r.error)}`).toMatchObject({ ok: true, externalCalls: [] });
      if (!r.ok) continue;
      const e = r.evidencePacket as V4RuntimeEvidence, c = e.composition;
      expect(validateV4Publication(c.product, r.draft, e)).toEqual({ ok: true, errors: [] });
      const book = projectBook(e); expect(book).not.toBeNull(); if (!book) continue;
      const notes = book.pages.flatMap(p => p.kind === "narrative" ? p.notes : []);
      expect(new Set(notes.map(n => n.name)).size).toBe(notes.length);
      for (const p of book.pages) if (p.kind === "narrative") {
        expect(p.notes.length).toBeLessThanOrEqual(2);
        expect(p.notes.every(n => !p.paragraphs.some(b => b.text.includes(n.text)))).toBe(true);
      }
      const appendix = book.pages.filter(p => p.kind === "appendix");
      expect(appendix).toHaveLength(book.people.length);
      expect(appendix.every(p => /모든 기운/.test(p.title))).toBe(true);
      for (const p of appendix) expect(new Set(p.items.map(f => `${f.group}:${f.name}`)).size).toBe(p.items.length);
      expect(JSON.stringify(book)).not.toMatch(/sourceRefs|provenance|v4_structure:|망신살|문곡귀인|복성귀인|천의성/);
      if (c.product === "major_fortune") expect(c.result.completeness).toMatchObject({ years: 14, futureYears: 10, ages: true, final: true });
      if (c.product === "annual_fortune") expect(c.result.completeness).toMatchObject({ months: 12, ordered: true, monthProvenance: true, final: true });
      if (c.product === "saju_mbti_compatibility") {
        expect(c.result.directions.aToB.targetPerson).toBe(c.result.persons.personB.personId);
        expect(c.result.directions.bToA.targetPerson).toBe(c.result.persons.personA.personId);
        expect(narrativeText(c.result.narrative)).not.toMatch(/\d+점|\d+%|[SAB]등급|별점/);
        for (const block of c.result.narrative.sections.flatMap(s => s.blocks)) {
          const kind = block.proof.sourceRefs.find(r => r.startsWith("content-relation:"))?.slice("content-relation:".length);
          if (kind) expect(c.result.evidence.relations.some(r => r.kind === kind && block.proof.sourceRefs.includes(`compatibilityRelationRules:detectCrossBranchRelations:${r.identity}`))).toBe(true);
        }
        if (c.result.evidence.category === "parentChild") expect(narrativeText(c.result.narrative)).not.toMatch(/아이가 학교|숙제를 끝내/);
        if (["parentChild", "friendship"].includes(c.result.evidence.category)) {
          const added = c.result.narrative.sections.flatMap(s => s.blocks).filter(b => /^(aToB|bToA)-response$/.test(b.id));
          expect(added.map(b => b.text).join(" ")).not.toMatch(/설레는 말|사랑받|연애|데이트|기념일/);
          expect(added.flatMap(b => b.proof.sourceRefs).join(" ")).not.toMatch(/:traits:(love|marriage):/);
        }
      } else {
        const yy = projectYinYang(e.calculations.person);
        expect(yy.total).toBe(e.calculations.person.pillars.hour ? 8 : 6);
        expect(yy.yin + yy.yang).toBe(yy.total);
        expect(projectV4Tables(e)[0].elements).toHaveLength(5);
        if (!fixture.mbti) expect(c.result.materials.fusions).toEqual([]);
        if (fixture.context.jobStatus === "homemaker" && ["career_money_study", "annual_fortune", "major_fortune"].includes(c.product))
          expect(narrativeText(c.result.narrative)).not.toMatch(/그만둔 까닭|퇴사|재취업|수입이 (?:잠시 )?쉬는|다시 맡을 역할|다시 시작하는 사람/);
      }
      const dir = process.env.V4_CONTENT_REVIEW_EXPORT;
      if (dir) {
        mkdirSync(`${dir}/runtime`, { recursive: true });
        writeFileSync(`${dir}/runtime/${fixture.id}-${c.product}.txt`, narrativeText(c.result.narrative));
        writeFileSync(`${dir}/runtime/${fixture.id}-${c.product}.json`, JSON.stringify({ payload, narrative: c.result.narrative,
          contentAudit: "contentAudit" in c.result ? c.result.contentAudit : undefined,
          contentPlan: "contentPlan" in c.result ? c.result.contentPlan : undefined, book }, null, 2));
      }
    }
  }, 30000);
  it("uses safe Korean conjugations without corrupting visible/hidden meaning", () => {
    expect(conversationalVoice("잘 보입니다. 말이 날카롭습니다. 좋은 힘입니다.", 1)).not.toMatch(/보예요|날카롭어요/);
    expect(conversationalVoice("책임감이 있습니다. 쉬지 않습니다. 기준이 됩니다.", 1)).toContain("쉬지 않아요");
    expect(conversationalVoice("다른 후보입니다. 필요한 정보입니다.", 1)).not.toMatch(/후보여요|정보여요/);
  });
  it("binds explanations to the scene's evidence even after novelty allocation is exhausted", () => {
    const input = fixtureInput(NARRATIVE_FIXTURES[8]);
    const material = buildMyeongliMaterialPacket(input);
    const pool = buildContentEvidencePool(input.calculation, material), state = createContentSelection();
    expect(pool.materials.some(m => m.feature === "ten_god_bijian")).toBe(true);
    state.rootUses.set("ten_god_bijian", 20);
    const plan = planChapter(pool, state, "natal-love-0", "relationships", ["gwiin_cheondeok"], ["ten_god_bijian"]);
    expect(plan.roots.map(m => m.feature)).toEqual(["ten_god_bijian"]);
    expect(plan.reasons).toContain("SCENE_EVIDENCE_ALIGNMENT");
    const unsupported = planChapter(pool, state, "absent", "relationships", [], ["unsupported-root"]);
    expect(unsupported.roots).toEqual([]);
  });
  it("all sixteen type links use real DB traits and supported feature labels", () => {
    const links = auditContentMbtiLinks();
    expect(new Set(links.map(l => l.type)).size).toBe(16);
    expect(links.filter(l => !l.supported)).toEqual([]);
    const labels = new Set(MATERIAL_REGISTRY.map(m => m.label));
    expect(links.flatMap(l => l.labels).filter(label => !labels.has(label))).toEqual([]);
  });
  it("renders canonical cell order and visible element bands, without guessing an unknown hour", async () => {
    for (const f of [NARRATIVE_FIXTURES[0], NARRATIVE_FIXTURES[2]]) {
      const result = await generateV4ShadowReport(singleRuntimeInput("saju_mbti_full", "saju-mbti-full", f), SHADOW_CLOCK);
      expect(result.ok).toBe(true); if (!result.ok) continue;
      const table = projectV4Tables(result.evidencePacket as V4RuntimeEvidence)[0];
      const html = renderToStaticMarkup(createElement(NatalTable, { data: table }));
      expect(html).toContain("오행의 구성");
      expect(html).toContain("천간·지지");
      expect(html).toMatch(/data-element="wood-green"/);
      expect(html).toMatch(/data-element="fire-red"/);
      const text = html.replace(/<[^>]*>/g, " ");
      for (const cell of [...Object.values(table.manse.stemRow), ...Object.values(table.manse.branchRow)]) {
        if (!cell) continue;
        expect(text).toContain(`${cell.ko} · ${cell.yinYang === "yin" ? "음" : "양"}`);
        const start = html.indexOf(`>${cell.hanja}</strong>`);
        expect(html.slice(start, html.indexOf("</td>", start))).toContain(`</span><span>`);
      }
      if (!f.time) {
        expect(table.manse.stemRow.hour).toBeNull();
        expect(html).toContain("미확인");
      }
    }
  });
});
