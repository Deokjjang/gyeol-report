import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isVerifiedBookConsumer } from "./bookBoundary";
import { describe, expect, it } from "vitest";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { narrativeText, reviewNarrative } from "../../../src/lib/interpretation-v4/editorialGuard";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { MBTI_TYPES, RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import { depthFeature } from "../../../src/lib/interpretation-v4/materialDepth";
import { analyzeV4Strength } from "../../../src/lib/interpretation-v4/strength";
import { buildCanonicalNatalTable } from "../../../src/lib/report-knowledge/natalTableEvidence";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { natalTexture } from "../../../src/lib/interpretation-v4/narrativeNatalTexture";
import type { NarrativeInput } from "../../../src/lib/interpretation-v4/narrativeTypes";
import { FUSION_RULES } from "../../../src/lib/interpretation-v4/fusionRules";

const results = NARRATIVE_FIXTURES.map(fixture => ({ fixture, input: fixtureInput(fixture), result: composeComprehensiveNarrative(fixtureInput(fixture)) }));

describe("V4 offline comprehensive editorial", () => {
  for (const { fixture, result } of results) it(`${fixture.id}: real calculation, complete prose and no editorial repetition`, () => {
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.narrative.opening.length).toBeGreaterThanOrEqual(3);
    expect(result.narrative.opening.length).toBeLessThanOrEqual(9);
    expect(result.narrative.sections.at(-1)?.id).toBe("direction");
    expect(result.narrative.sections.map(s => s.domain)).toEqual(expect.arrayContaining(["work", "money", "relationships", "love", "study", "strengths"]));
    expect(result.editorial).toEqual([]);
    expect(result.narrative.finalLine).not.toBe("");
    expect(narrativeText(result.narrative)).not.toMatch(/망신살|문곡귀인|복성귀인|천의성/);
    for (const b of [...result.narrative.opening, ...result.narrative.sections.flatMap(s => s.blocks)]) expect(b.proof.sourceRefs.length, b.id).toBeGreaterThan(0);
  });
  it("exports twelve readable full texts and packets only with an explicit local-review flag", () => {
    if (process.env.V4_PHASE4_EXPORT !== "1") return;
    const directory = "/tmp/gyeol-v4-phase4a";
    mkdirSync(directory, { recursive: true });
    const index: string[] = [];
    for (const { fixture, result } of results) {
      if (!result.ok) continue;
      const header = `${fixture.name} · ${fixture.gender} · ${fixture.date} ${fixture.time ?? "출생시간 모름"} · ${fixture.mbti ?? "MBTI 모름"}\n${fixture.context.jobStatus} · ${fixture.context.detailJob} · ${fixture.context.relationshipStatus || "관계 미선택"}`;
      writeFileSync(`${directory}/${fixture.id}.md`, `${header}\n\n${narrativeText(result.narrative)}\n`);
      writeFileSync(`${directory}/${fixture.id}.json`, JSON.stringify({ fixture, ...result }, null, 2));
      index.push(`- [${fixture.name}](${fixture.id}.md): ${result.narrative.headline} / ${result.editorial.map(i => `${i.severity}:${i.code}:${i.location}`).join(", ") || "automated guard clear"}`);
    }
    writeFileSync(`${directory}/index.md`, `# V4 Phase 4A offline review\n\n${index.join("\n")}\n`);
  });
  it("uses distinct characters and final lines rather than replacing names", () => {
    const reports = results.flatMap(r => r.result.ok ? [r.result.narrative] : []);
    expect(new Set(reports.map(r => r.headline)).size).toBe(12);
    expect(new Set(reports.map(r => r.finalLine)).size).toBe(12);
    expect(new Set(reports.map(r => r.sections.map(s => s.id).join(","))).size).toBeGreaterThan(1);
  });
});

describe("evidence, counterfactuals and unchanged boundaries", () => {
  it("uses the real Jia ENTJ with three overlapping roots and the actual money/name composite", () => {
    const { input, result } = results[0];
    expect(input.calculation.dayMaster).toBe("甲");
    expect(result.ok).toBe(true); if (!result.ok) return;
    const root = result.narrative.opening[0];
    expect(root.proof.fusionIds).toEqual(["entj-needle", "entj-pressure", "entj-wealth"]);
    expect(result.materials.fortuneComposites.some(f => f.ruleId === "wealth-and-name")).toBe(true);
    expect(narrativeText(result.narrative)).toMatch(/돈과 이름/);
    expect(narrativeText(result.narrative)).toMatch(/말도 같이 뾰족/);
    expect(narrativeText(result.narrative)).toMatch(/잘될 힘/);
  });
  it("all narrative claims retain actual eligible evidence, seed and Fusion provenance", () => {
    for (const { result, input } of results) {
      if (!result.ok) continue;
      const table = buildCanonicalNatalTable(input.calculation.birthTimeContext!);
      const features = new Set([...(input.calculation.pillars.hour ? ["natal:yin-yang"] : []), ...result.materials.selected.map(m => m.feature), ...result.materials.symbolicElements.map(e => e.material.feature),
        ...result.materials.fusions.flatMap(f => f.myeongliEvidence.map(d => depthFeature(d.evidence.feature))),
        ...(table?.relations.map(r => `natal-relation:${r.id}`) ?? []),
        ...(table?.pillars.flatMap(p => p.twelveLifeStage?.map(s => `natal-life-stage:${p.columnId}:${s}`) ?? []) ?? [])]);
      const seedIds = new Set([...result.materials.selected.flatMap(m => m.material.seeds.map(s => s.id)), ...result.materials.symbolicElements.flatMap(e => e.material.seeds.map(s => s.id))]);
      const fusions = new Set(result.materials.fusions.map(f => f.ruleId));
      for (const p of [...result.narrative.opening, ...result.narrative.sections.flatMap(s => s.blocks), { proof: result.narrative.finalProof }]) {
        for (const feature of p.proof.features) expect(features.has(feature), feature).toBe(true);
        for (const id of p.proof.seedIds) expect(seedIds.has(id), id).toBe(true);
        for (const id of p.proof.fusionIds) expect(fusions.has(id), id).toBe(true);
      }
      const unsupported = result.materials.held.map(h => h.feature);
      const customerFeatures = result.narrative.sections.flatMap(s => s.blocks.flatMap(b => b.proof.features));
      expect(customerFeatures.filter(f => unsupported.includes(f) && !f.startsWith("element:"))).toEqual([]);
    }
  });
  it("covers nine female/three male charts, twelve day pillars, weak/strong and the five supported flows", () => {
    expect(NARRATIVE_FIXTURES.filter(f => f.gender === "FEMALE")).toHaveLength(9);
    expect(new Set(results.map(r => JSON.stringify(r.input.calculation.pillars.day))).size).toBe(12);
    const levels = results.map(r => analyzeV4Strength(r.input.calculation).level);
    expect(levels.some(l => l === "weak" || l === "veryWeak")).toBe(true);
    expect(levels.some(l => l === "strong" || l === "veryStrong")).toBe(true);
    const features = results.flatMap(r => r.result.ok ? r.result.materials.selected.map(m => m.feature) : []);
    for (const id of ["wealthHeavyWeakDaymaster", "outputCreatesWealth", "wealthCreatesOfficer", "officerResourceFlow", "killingResourceFlow", "hurtingOfficerMeetsOfficer"])
      expect(features).toContain(`v4_structure:${id}`);
  });
  it("does not invent the missing hour, weak elements, attraction markers or MBTI", () => {
    const unknownHour = results[2].result;
    expect(unknownHour.ok).toBe(true); if (unknownHour.ok) {
      expect(unknownHour.materials.symbolicElements).toEqual([]);
      expect(unknownHour.narrative.sections.some(s => s.id === "environment")).toBe(false);
    }
    for (const { result } of results) if (result.ok) {
      const text = narrativeText(result.narrative);
      if (!result.materials.selected.some(m => m.feature === "sinsal_dohwa")) expect(text).not.toContain("도화");
      if (!result.materials.selected.some(m => m.feature === "sinsal_hongyeom")) expect(text).not.toContain("홍염");
    }
    const unknown = results.at(-1)!.result;
    expect(unknown.ok).toBe(true); if (unknown.ok) {
      expect(unknown.materials.fusions).toEqual([]);
      expect(narrativeText(unknown.narrative)).not.toMatch(/MBTI|[IE][NS][FT][JP]/);
      expect(unknown.narrative.sections.at(-1)!.blocks.length).toBeGreaterThanOrEqual(3);
      expect(narrativeText(unknown.narrative)).not.toMatch(/현재.*바리스타.*일|면접|현재 직장/);
    }
  });
  it.each(MBTI_TYPES)("same calculated chart × %s is deterministic, safe and free of internal duplicates", mbti => {
    for (const { input } of results) {
      const calculationBefore = JSON.stringify(input.calculation);
      const r = composeComprehensiveNarrative({ ...input, mbti });
      expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.editorial).toEqual([]);
      expect(composeComprehensiveNarrative({ ...input, mbti })).toEqual(r);
      expect(JSON.stringify(input.calculation)).toBe(calculationBefore);
    }
  });
  it("same chart with a different MBTI changes its fused character, not only a label", () => {
    const input = results[0].input;
    const entj = composeComprehensiveNarrative(input), intp = composeComprehensiveNarrative({ ...input, mbti: "INTP" });
    expect(entj.ok && intp.ok).toBe(true); if (!entj.ok || !intp.ok) return;
    expect(entj.narrative.headline).not.toBe(intp.narrative.headline);
    expect(entj.narrative.opening[0].text.replace(/ENTJ/g, "TYPE")).not.toBe(intp.narrative.opening[0].text.replace(/INTP/g, "TYPE"));
    expect(entj.materials.selected).toEqual(intp.materials.selected);
  });
  it("real low-output chart expresses complement without promoting weak natal evidence to a hero", () => {
    const calculation = calculateSaju({ birthDate: "1988-03-06", birthTime: "09:30", birthTimeUnknown: false, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    const r = composeComprehensiveNarrative({ ...results[1].input, calculation });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.narrative.opening[0].proof.fusionIds).toEqual(["enfp-expression"]);
    expect(r.materials.fusions.find(f => f.ruleId === "enfp-expression")!.strength).toBe("supporting");
    expect(r.narrative.opening[0].text).toContain("다른 출구");
    expect(r.editorial).toEqual([]);
    if (process.env.V4_PHASE4_EXPORT === "1") writeFileSync("/tmp/gyeol-v4-phase4a/counterfactual-complement.md", narrativeText(r.narrative));
  });
  it("same MBTI with a different natal structure changes the opening and narrative selection", () => {
    const a = results[0].result, b = results[3].result;
    expect(a.ok && b.ok).toBe(true); if (!a.ok || !b.ok) return;
    expect(a.narrative.headline).not.toBe(b.narrative.headline);
    expect(a.narrative.opening[0].proof.fusionIds).not.toEqual(b.narrative.opening[0].proof.fusionIds);
    expect(a.narrative.sections.some(s => s.id === "why")).toBe(false);
    expect(b.narrative.sections.some(s => s.id === "why")).toBe(true);
  });
  it.each(RELATIONSHIP_STATUSES)("relationship %s only selects the authorized setting", relationshipStatus => {
    const r = composeComprehensiveNarrative({ ...results[0].input, context: { ...results[0].input.context, relationshipStatus } });
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.editorial).toEqual([]);
    const text = r.narrative.sections.find(s => s.id === "love")!.blocks.map(b => b.text).join(" ");
    if (relationshipStatus === "single") expect(text).not.toMatch(/기혼|집안일을 마친 뒤|연애가 익숙/);
    if (relationshipStatus === "married") expect(text).toMatch(/기혼/);
    if (relationshipStatus === "") expect(text).not.toMatch(/지금은 솔로|기혼|썸에서는|결혼을 준비하면/);
    expect(r.materials).toEqual(results[0].result.ok ? results[0].result.materials : null);
  });
  it("job input selects contextual scenes without becoming evidence of a trait", () => {
    const base = results[0].input;
    const finance = composeComprehensiveNarrative({ ...base, context: { ...base.context, detailJob: "제조업 재무기획 과장" } });
    const medical = composeComprehensiveNarrative({ ...base, context: { ...base.context, detailJob: "병원 행정직" } });
    expect(finance.ok && medical.ok).toBe(true); if (!finance.ok || !medical.ok) return;
    expect(finance.materials).toEqual(medical.materials);
    expect(narrativeText(finance.narrative)).toContain("실적과 계획");
    expect(narrativeText(medical.narrative)).toContain("전화 문의");
    expect(narrativeText(medical.narrative)).not.toMatch(/수술|환자를 치료|재계약|CRM/);
  });
  it("names and genders never choose characters or endings", () => {
    const original = results[1].result;
    const renamed = composeComprehensiveNarrative({ ...results[1].input, name: "다른 이름" });
    expect(original.ok && renamed.ok).toBe(true); if (!original.ok || !renamed.ok) return;
    expect(renamed.narrative).toEqual(original.narrative);
    const calculation = calculateSaju({ ...results[1].input.calculation.input, gender: "MALE" });
    const otherGender = composeComprehensiveNarrative({ ...results[1].input, calculation });
    expect(otherGender.ok).toBe(true); if (otherGender.ok) expect(otherGender.narrative).toEqual(original.narrative);
  });
  it("rejects unverified natal context and invalid existing enums without new schema or exceptions", () => {
    const input = results[0].input;
    expect(composeComprehensiveNarrative({ ...input, calculation: { ...input.calculation, calculationVersion: "fake" } as NarrativeInput["calculation"] }).ok).toBe(false);
    expect(composeComprehensiveNarrative({ ...input, context: { ...input.context, relationshipStatus: "reunion" } } as unknown as NarrativeInput)).toEqual({ ok: false, errors: ["INVALID_NARRATIVE_INPUT"] });
  });
  it("reads supported life-stage texture from the canonical table, not a new rule", () => {
    const found = [];
    for (let day = 1; day <= 28; day++) {
      const calculation = calculateSaju({ birthDate: `1994-11-${String(day).padStart(2, "0")}`, birthTime: "09:30", birthTimeUnknown: false, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
      const blocks = natalTexture({ ...results[0].input, calculation });
      const stage = blocks.find(b => b.id === "natal-stage");
      if (stage) found.push(stage);
    }
    expect(found.length).toBeGreaterThan(0);
    expect(found.every(b => b.proof.sourceRefs.includes("canonical-natal-table-v1"))).toBe(true);
  });
  it("remains offline and outside every product route, generation and delivery runtime", () => {
    const files = readdirSync("src/lib/interpretation-v4").filter(f => /narrative|comprehensiveComposer|copyRealizer|editorialGuard/i.test(f));
    const source = files.map(f => readFileSync(`src/lib/interpretation-v4/${f}`, "utf8")).join("\n");
    expect(source).not.toMatch(/fetch\(|Math\.random|Date\.now|new Date|process\.env|openai|supabase|toss|from ["']react|["']use (?:client|server)["']/i);
    expect(source).not.toMatch(/1990-07-18|서진|서윤|1994-11-18/);
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.[tj]sx?$/.test(e.name) ? [`${dir}/${e.name}`] : []);
    for (const file of [...walk("src/app"), ...walk("src/lib/report-generation")]) {
      const source = readFileSync(file, "utf8");
      if (!isVerifiedBookConsumer(file, source)) expect(source, file).not.toMatch(/interpretation-v4/);
    }
  });
  it("the guard reports duplicate, technical and unsupported prose instead of silently deleting it", () => {
    const r = results[0].result; if (!r.ok) return;
    const broken = { ...r.narrative, opening: [...r.narrative.opening, { ...r.narrative.opening[0], id: "duplicate" },
      { ...r.narrative.opening[0], id: "leak", text: "KPI를 최적화합니다. sinsal_fake가 있습니다. 수익을 보장합니다." }] };
    const issues = reviewNarrative(broken).map(i => i.code);
    expect(issues).toEqual(expect.arrayContaining(["DUPLICATE_SENTENCE", "REPEATED_LONG_PHRASE", "TECHNICAL_OR_META_COPY", "INTERNAL_SOURCE_EXPOSED", "UNSUPPORTED_GUARANTEE"]));
    expect(broken.opening.at(-1)?.text).toContain("KPI");
  });
  it("every existing reviewed Fusion rule has a deliberately authored signature mapping", () => {
    const source = readFileSync("src/lib/interpretation-v4/narrativeSignatures.ts", "utf8");
    for (const rule of FUSION_RULES) expect(source, rule.id).toContain(`"${rule.id}"`);
  });
});
