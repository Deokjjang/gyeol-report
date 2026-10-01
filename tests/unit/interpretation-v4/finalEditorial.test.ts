import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { careerInputs } from "./careerFixtures";
import { loveInputs } from "./loveFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES, ANNUAL_CLOCK } from "./annualFixtures";
import { auditEditorial, editorialInvariant, type AuditReport } from "./finalEditorialAudit";
import baseline from "./finalEditorialBaseline.json";
import { annualSceneDetail } from "../../../src/lib/interpretation-v4/annualSceneDetails";
import { majorContext } from "../../../src/lib/interpretation-v4/majorContext";
import type { TenGod } from "../../../src/lib/report-knowledge/annualFortuneTypes";

type MajorPacket = Extract<Awaited<ReturnType<typeof composeMajorFortuneNarrative>>, { ok: true }>;
type AnnualPacket = Extract<Awaited<ReturnType<typeof composeAnnualFortuneNarrative>>, { ok: true }>;

const rows: AuditReport[] = [], packets: Record<string, unknown> = {};
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
function add(id: string, product: string, result: { ok: boolean; narrative?: AuditReport["narrative"] }, golden?: string) {
  expect(result.ok, id).toBe(true);
  if (result.narrative) { rows.push({ id, product, golden, narrative: result.narrative }); packets[id] = result; }
}
beforeAll(async () => {
  for (const f of NARRATIVE_FIXTURES) add(`comprehensive-${f.id}`, "comprehensive", composeComprehensiveNarrative(fixtureInput(f)));
  for (const { fixture: f, input } of careerInputs()) add(`career-${f.id}`, "career", composeCareerNarrative(input));
  for (const { fixture: f, input } of loveInputs()) add(`love-${f.id}`, "love", composeLoveNarrative(input));
  for (const f of COMPATIBILITY_NARRATIVE_FIXTURES) add(`compatibility-${f.id}`, "compatibility", composeCompatibilityNarrative(f.payload));
  for (const f of MAJOR_NARRATIVE_FIXTURES) add(`major-${f.id}`, "major", await composeMajorFortuneNarrative(f.payload, MAJOR_EVALUATED_AT));
  for (const f of ANNUAL_NARRATIVE_FIXTURES) add(`annual-${f.id}`, "annual", await composeAnnualFortuneNarrative(f.payload, f.clock));
  // Same complete person/context, not just the same name; real calculated birth fixtures.
  for (const i of [0, 6, 1]) {
    const f = NARRATIVE_FIXTURES[i], input = fixtureInput(f), id = `golden-${f.mbti}`;
    add(`${id}-comprehensive`, "comprehensive", composeComprehensiveNarrative(input), id);
    add(`${id}-career`, "career", composeCareerNarrative(input), id);
    add(`${id}-love`, "love", composeLoveNarrative(input), id);
    const person = { name: f.name, birthDate: f.date, birthTime: f.time, birthTimePrecision: "exact", birthTimeUnknown: false, mbtiType: f.mbti, gender: f.gender, approximateBirthTimeSlot: "" };
    const payload = { person, userContext: { ...f.context, focusAreas: [] }, productOptions: { contentVersion: "v3" } };
    add(`${id}-major`, "major", await composeMajorFortuneNarrative({ ...payload, productKey: "major_fortune", productSlug: "major-fortune" }, MAJOR_EVALUATED_AT), id);
    add(`${id}-annual`, "annual", await composeAnnualFortuneNarrative({ ...payload, productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { ...payload.productOptions, selectedYear: "2026" } }, ANNUAL_CLOCK), id);
    const pair = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;
    add(`${id}-compatibility`, "compatibility", composeCompatibilityNarrative({ ...pair, personA: person, personB: pair.personB }), id);
  }
}, 60000);

describe("Phase 7A six-product editorial audit (read-only diagnostics)", () => {
  it.each(Object.entries(baseline.rows))("%s: reviewed prose and pre-edit calculation/selection/proofs", (id, expected) => {
    const r = rows.find(r => r.id === id)!;
    expect(digest(r.narrative)).toBe(expected.after);
    expect(digest(editorialInvariant(packets[id] as Record<string, unknown>, r.narrative))).toBe(expected.invariant);
  });
  it("no within-report repetition, unresolved guard issue or negative-led packet", () => {
    const a = auditEditorial(rows);
    expect(a.summary.withinReportIssues).toBe(0);
    for (const d of a.diagnostics) expect(d.counts.positive, d.id).toBeGreaterThan(d.counts.shadow);
  });
  it.each(["ENTJ", "INTP", "ENFP"])("%s: one person, six domains; only three shared natal facts remain", mbti => {
    const golden = rows.filter(r => r.golden === `golden-${mbti}`), a = auditEditorial(golden);
    expect(golden).toHaveLength(6);
    expect(new Set(golden.map(r => r.narrative.headline)).size).toBe(6);
    expect(new Set(golden.map(r => r.narrative.finalLine)).size).toBe(6);
    expect(a.crossProduct).toHaveLength(3);
    // Remaining overlap must be backed by the same natal seed, not reusable scene copy.
    for (const duplicate of a.crossProduct) {
      const seedSets = duplicate.locations.map(location => {
        const [id, block] = location.split("/");
        const n = rows.find(r => r.id === id)!.narrative;
        return [...n.opening, ...n.sections.flatMap(s => s.blocks)].find(b => b.id === block)!.proof.seedIds;
      });
      expect(seedSets[0].some(id => seedSets.every(set => set.includes(id))), duplicate.text).toBe(true);
    }
    const core = packets[`golden-${mbti}-comprehensive`] as { materials: unknown };
    for (const product of ["career", "love", "major", "annual"]) {
      expect((packets[`golden-${mbti}-${product}`] as { materials: unknown }).materials).toEqual(core.materials);
    }
  });
  it.each(["ENTJ", "INTP", "ENFP"])("%s: identical current Dayun and exact transition instants across Major/Annual", mbti => {
    const m = packets[`golden-${mbti}-major`] as MajorPacket, a = packets[`golden-${mbti}-annual`] as AnnualPacket;
    expect(Date.parse(m.evidence.evaluatedAt)).toBe(Date.parse(a.evidence.clock.currentDate));
    expect(a.evidence.months[9].focus.activeDayunContext.cycles).toContainEqual({
      index: m.evidence.horizon.activeCycle!.index, ganji: m.evidence.horizon.activeCycle!.ganji,
    });
    for (const t of m.evidence.horizon.transitions) {
      expect(a.evidence.raw.customerDayun!.cycles.find(c => c.index === t.after.index)?.startSolarKst).toBe(t.startSolarKst);
    }
  });
  it("all Major/Annual exports retain complete dated horizons, provenance and final sections", () => {
    for (const r of rows) {
      if (r.product === "major") {
        const p = packets[r.id] as MajorPacket;
        expect(p.completeness).toMatchObject({ years: 14, futureYears: 10, ages: true, final: true });
        expect(p.transitions).toHaveLength(p.evidence.horizon.transitions.length);
        expect(p.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => p.evidence.currentYear - 3 + i));
      }
      if (r.product === "annual") {
        const p = packets[r.id] as AnnualPacket;
        expect(p.completeness).toMatchObject({ months: 12, opening: true, fortune: true, final: true, monthProvenance: true, ordered: true });
        expect(p.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
        expect(p.narrative.headline).toContain(String(p.evidence.selectedYear));
      }
      expect(r.narrative.sections.at(-1)?.blocks.length, r.id).toBeGreaterThan(0);
      expect(r.narrative.finalLine, r.id).not.toBe("");
    }
  });
  it("targeted scenes are genuinely different without replacing evidence or future status", () => {
    const text = (id: string) => narrativeText(rows.find(r => r.id === id)!.narrative);
    expect(text("comprehensive-07-nayeong")).toContain("빼곡하게 적어둔 메모");
    expect(text("career-04-yujin")).toContain("남들이 안 누른 버튼");
    expect(text("career-07-nayeong")).toContain("상대에게는 며칠을 아껴준 일");
    expect(text("love-04-doyun")).toContain("같이 봤던 영화");
    expect(text("love-08-yerin")).toContain("둘만 아는 별명");
    expect(text("compatibility-06-business")).toContain("이번엔 네가 있어서 됐다");
    expect(text("compatibility-08-love")).toContain("서로의 취향이 데이트의 재료");
    expect(text("annual-03-freelance")).toContain("상대의 반응이 다음 질문");
    expect(text("annual-04-student")).toContain("실습 영상과 지금의 움직임");
    const major = packets["major-04-student"] as MajorPacket;
    const laterScenes = major.years.filter(y => y.year >= major.evidence.currentYear + 3).flatMap(y => y.blocks.filter(b => b.id.endsWith("-scene"))).map(b => b.text).join(" ");
    expect(laterScenes).toContain("사는 곳과 하루의 순서");
    expect(laterScenes).not.toMatch(/졸업한 뒤|입사했|승진했|지금 수업|현재 회사|당신의 배우자/);
    const finance = text("major-06-transition");
    expect(finance).not.toContain("반가운 힘으로 보태질 수");
  });
  it("all ten monthly meanings have distinct usable scenes in six work modes; practical study is not fixture-bound", () => {
    const gods: TenGod[] = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];
    const base = majorContext(fixtureInput(NARRATIVE_FIXTURES[0]));
    for (const mode of ["employee", "business", "freelance", "student", "seeker", "resting"] as const) {
      const c = { ...base, mode, raw: "" };
      const scenes = gods.flatMap(god => [annualSceneDetail(c, god, 0), annualSceneDetail(c, god, 1)]);
      expect(new Set(scenes).size, mode).toBe(20);
      for (const scene of scenes) expect(scene.length).toBeGreaterThan(35);
      if (["student", "seeker", "resting"].includes(mode)) expect(scenes.join(" ")).not.toMatch(/내 연봉|상사|당신의 고객|현재 회사/);
    }
    for (const raw of ["체육 전공", "무용 전공", "조리 실습"]) {
      const c = { ...base, mode: "student" as const, raw };
      expect(annualSceneDetail(c, "식신", 0)).toContain("실습");
      expect(annualSceneDetail(c, "식신", 1)).toContain("영상");
      expect(annualSceneDetail(c, "정재", 0)).toContain("준비물");
    }
    const generic = { ...base, mode: "employee" as const }, finance = { ...generic, fn: "finance_planning" as const };
    for (const god of gods) for (const variant of [0, 1]) expect(annualSceneDetail(finance, god, variant)).not.toBe(annualSceneDetail(generic, god, variant));
  });
  it("exports the unchanged source packets, full customer texts and candidate reports", () => {
    const phase = process.env.V4_FINAL_AUDIT_EXPORT;
    if (phase !== "before" && phase !== "after") return;
    const dir = `/tmp/gyeol-v4-final-audit/${phase}`; mkdirSync(dir, { recursive: true });
    for (const r of rows) {
      writeFileSync(`${dir}/${r.id}.md`, narrativeText(r.narrative));
      writeFileSync(`${dir}/${r.id}.json`, JSON.stringify(packets[r.id], null, 2));
    }
    const cohorts = rows.filter(r => !r.golden), golden = rows.filter(r => r.golden);
    const audit = { cohort: auditEditorial(cohorts), golden: Object.fromEntries(["ENTJ", "INTP", "ENFP"].map(mbti => [mbti, auditEditorial(golden.filter(r => r.golden === `golden-${mbti}`))])) };
    writeFileSync(`${dir}/duplication-report.json`, JSON.stringify(audit, null, 2));
    writeFileSync(`${dir}/hashes.json`, JSON.stringify(Object.fromEntries(rows.map(r => [r.id, digest(r.narrative)])), null, 2));
    writeFileSync(`${dir}/index.md`, rows.map(r => `- [${r.id}](${r.id}.md) · ${r.narrative.headline}`).join("\n"));
    writeFileSync(`${dir}/golden-comparison.md`, golden.map(r => `# ${r.id}\n\n${narrativeText(r.narrative)}`).join("\n\n---\n\n"));
  });
  it("generates the full cohort plus three six-product golden sets without internal prose", () => {
    expect(rows).toHaveLength(66);
    for (const r of rows) expect(narrativeText(r.narrative), r.id).not.toMatch(/sourceRefs|provenance|confidence|v4_structure:|ten_god_|sinsal_|gwiin_|undefined|KPI|최적화|메타인지|내적 자원/);
  });
});
