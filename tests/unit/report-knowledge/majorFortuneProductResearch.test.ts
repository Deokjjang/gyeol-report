import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { expect, it } from "vitest";
import { MAJOR_RESEARCH_SOURCES as sources } from "@/lib/report-knowledge/major-fortune-product-research/sourceInventory";
import { MAJOR_CYCLE_RESEARCH as cycles } from "@/lib/report-knowledge/major-fortune-product-research/cycleResearch";
import { MAJOR_CYCLE_DEVELOPMENT as development } from "@/lib/report-knowledge/major-fortune-product-research/cycleDevelopmentResearch";
import { MAJOR_TEN_GOD_RESEARCH as gods } from "@/lib/report-knowledge/major-fortune-product-research/tenGodResearch";
import { MAJOR_PHASE_RESEARCH as phases } from "@/lib/report-knowledge/major-fortune-product-research/phaseResearch";
import { MAJOR_TRANSITION_RESEARCH as transitions } from "@/lib/report-knowledge/major-fortune-product-research/transitionResearch";
import { MAJOR_INTERACTION_RESEARCH as interactions } from "@/lib/report-knowledge/major-fortune-product-research/interactionResearch";
import { MAJOR_TEMPORAL_CROSSWALK as temporal } from "@/lib/report-knowledge/major-fortune-product-research/temporalCrosswalk";
import { MAJOR_YEAR_MATRIX as years } from "@/lib/report-knowledge/major-fortune-product-research/yearMatrix";
import { MAJOR_COMPARISON_RESEARCH as comparisons } from "@/lib/report-knowledge/major-fortune-product-research/comparisonResearch";
import { MAJOR_DOMAIN_RESEARCH as domains } from "@/lib/report-knowledge/major-fortune-product-research/domainResearch";
import { MAJOR_MBTI_CROSSWALK as mbti } from "@/lib/report-knowledge/major-fortune-product-research/mbtiCrosswalk";
import { MAJOR_AXIS_CROSSWALK as axes } from "@/lib/report-knowledge/major-fortune-product-research/axisCrosswalk";
import { MAJOR_FACET_CROSSWALK as facets } from "@/lib/report-knowledge/major-fortune-product-research/facetCrosswalk";
import { MAJOR_FUSION_CROSSWALK as fusion } from "@/lib/report-knowledge/major-fortune-product-research/fusionCrosswalk";
import { MAJOR_BINDING_DESIGN as binding } from "@/lib/report-knowledge/major-fortune-product-research/bindingDesign";
import { MAJOR_REJECTED_RESEARCH as rejected } from "@/lib/report-knowledge/major-fortune-product-research/rejectedResearch";
import { MAJOR_OBSERVED_PERIOD_RESEARCH as observed } from "@/lib/report-knowledge/major-fortune-product-research/observedPeriodResearch";
import type { Offline } from "@/lib/report-knowledge/major-fortune-product-research/researchTypes";
import type { ExistingCalculatedEvidenceId, MajorResearchId, SourceLocator } from "@/lib/report-knowledge/major-fortune-product-research/bindingProposalTypes";

type Assert<T extends true> = T;
export type ResearchIdCannotBeCalculatedEvidence = Assert<MajorResearchId extends ExistingCalculatedEvidenceId ? false : true>;
const doc = "docs/validation/v4-major-fortune-product-knowledge-01/";
const json = <T,>(name: string): T => JSON.parse(readFileSync(doc + name + ".json", "utf8"));
const sha = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
const all: readonly Offline[] = [...sources, ...cycles, ...development, ...gods, ...phases, ...transitions, ...interactions, ...temporal, ...years,
  ...comparisons, ...domains, ...mbti, ...axes, ...facets, ...fusion, ...binding, ...rejected, ...observed];
const sourceCache = new Map<string, Promise<Record<string, unknown>>>();
async function original(locator: SourceLocator): Promise<unknown> {
  if (!sourceCache.has(locator.file)) sourceCache.set(locator.file, import(pathToFileURL(resolve(locator.file)).href));
  const sourceExports = await sourceCache.get(locator.file)!;
  const rows = sourceExports[locator.exportName];
  expect(Array.isArray(rows)).toBe(true);
  const row = (rows as unknown[])[locator.index];
  expect(sha(JSON.stringify(row))).toBe(locator.recordSha256);
  expect((row as { id: string }).id).toBe(locator.originalId);
  return row;
}
it.each(all)("$id remains offline, unapproved and contributes no calculated Evidence or score", r => {
  expect(r.productKey).toBe("major_fortune"); expect(r.id).toMatch(/^mfpr:/);
  expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false);
  expect(r.existingScoreContribution).toBe(false); expect(r.runtimeEvidenceIds).toEqual([]);
});
it("has unique research IDs and separates reference coverage from independent meanings", () => {
  expect(new Set(all.map(r => r.id)).size).toBe(all.length);
  expect(temporal).toHaveLength(410); expect(axes).toHaveLength(36); expect(facets).toHaveLength(109);
  expect(fusion).toHaveLength(164); expect(mbti).toHaveLength(16);
  const manifest = json<{ referenceRecordsAreNotNewIndependentMeanings: boolean; relativeYearQuestionsAreAnalyticalViewsNot168CalculatedFacts: boolean }>("coverage-manifest");
  expect(manifest.referenceRecordsAreNotNewIndependentMeanings).toBe(true);
  expect(manifest.relativeYearQuestionsAreAnalyticalViewsNot168CalculatedFacts).toBe(true);
});
it.each([...temporal, ...axes, ...facets, ...fusion])("$id retains the exact original record and its unsupported/unverified state", async r => {
  expect(r.originalState).toEqual(await original(r.locator));
  expect(r.referenceOnly).toBe(true); expect(r.bindingImplemented).toBe(false);
});
it("withholds inherited E/F/G materials and monthly-only observations without promoting them to major facts", () => {
  for (const r of temporal) {
    const s = r.originalState as { class?: string; scope?: string; id: string };
    if (s.class === "F") expect(r.majorUse).toBe("withhold_rejected");
    if (s.class === "E") expect(r.majorUse).toBe("withhold_unverified");
    if (s.class === "G") expect(r.majorUse).toBe("withhold_unsupported");
    if (!["E", "F", "G"].includes(s.class ?? "") && (s.id.startsWith("tr:month:") || ["natal_wolun", "dayun_wolun", "saeun_wolun"].includes(s.scope ?? ""))) {
      expect(["outside_major_annual_scope", "withhold_unsupported"]).toContain(r.majorUse);
    }
  }
});
it.each(mbti)("$type retains all original per-domain MBTI conditions without making time predictions", async r => {
  expect(r.sourceLocators).toHaveLength(32); expect(r.originalStates).toHaveLength(32);
  for (const [i, locator] of r.sourceLocators.entries()) expect(await original(locator)).toEqual(r.originalStates[i]);
  expect(r.scope).toBe("personal_only"); expect(r.invalid).toContain("MBTI로"); expect(r.missingPolicy).toContain("보류");
});
it.each(gods)("$god distinguishes long-term, natal and annual roles, positive/risk/twist and domain conditions", async r => {
  for (const key of ["core", "positive", "risk", "distinction", "natalRequired", "elementRequired", "environment", "surprising", "twist"] as const) expect(r[key].length).toBeGreaterThan(8);
  expect(new Set([r.positive, r.risk, r.surprising, r.twist]).size).toBe(4);
  expect(Object.keys(r.domains)).toEqual(["work", "money", "learning", "relationship"]);
  expect(new Set(Object.values(r.layerRoles)).size).toBe(3);
  const inherited = await original(r.inheritedRole) as { god: string };
  expect(inherited.god).toBe(r.god); expect(r.verification).toBe("conditional_editorial");
});
it.each(development)("$god has different long-term development questions without predicting events from elapsed years", r => {
  const fields = [r.earlyQuestion, r.middleQuestion, r.lateQuestion, r.continuity, r.positive, r.risk, r.twist, r.counterexample];
  expect(fields.every(v => typeof v === "string" && v.length > 15)).toBe(true);
  expect(new Set(fields).size).toBe(8);
  expect(r.verification).toBe("conditional_editorial_not_phase_forecast");
  expect(gods.some(g => g.god === r.god)).toBe(true);
  expect((r.requires as readonly string[]).length).toBe(4);
});
it("covers the existing finite contracts without fixed years, invented cycles or new weights", () => {
  expect(cycles).toHaveLength(16); expect(gods).toHaveLength(10); expect(phases).toHaveLength(3);
  expect(transitions.map(r => r.state)).toEqual(["exact", "range", "before", "after", "uncertain", "pre-first", "unjudgeable"]);
  expect(interactions.map(r => r.scope)).toEqual(["natal_dayun", "natal_saeun", "dayun_saeun", "natal_dayun_saeun"]);
  expect(domains).toHaveLength(8); expect(comparisons).toHaveLength(9);
  expect(years.map(y => y.offset)).toEqual(Array.from({ length: 14 }, (_, i) => i - 3));
  expect(binding.map(r => r.stage)).toEqual(["natal", "dayun", "active", "annual", "relations", "validity", "research", "allocation", "prose"]);
  expect(binding.every(r => !r.implemented)).toBe(true);
  expect(rejected.find(r => r.id.endsWith("no-transition-fourteen"))?.reason).toContain("불가능");
});
it.each(years)("$yearExpression preserves twelve analytical questions and honest missing-evidence handling", y => {
  expect(y.cyclePositionNotDeterminedByOffset).toBe(true);
  expect(y.questions).toHaveLength(12); expect(new Set(y.questions.map(q => q.key)).size).toBe(12);
  expect(y.timePosition).toBe(y.offset < 0 ? "past" : y.offset === 0 ? "current" : "future");
  for (const q of y.questions) {
    expect(q.requires.length).toBeGreaterThan(8); expect(q.notCalculatedEvidence).toBe(true);
    expect(q.missingPolicy.length).toBeGreaterThan(8);
  }
});
it.each(observed)("$id uses actual participants and original IDs from a freshly generated offline year", r => {
  const ref = r.sourceObservation as { caseId: string; year: number; recordSha256: string };
  const baseline = json<{ id: string; years?: { year: number; cycle: unknown; annual: unknown }[]; transitions?: { year: number }[] }[]>("baseline-generation");
  const c = baseline.find(c => c.id === ref.caseId)!;
  const year = c.years!.find(y => y.year === ref.year)!;
  expect(sha(JSON.stringify(year))).toBe(ref.recordSha256);
  expect(r.observedFacts).toEqual({ cycle: year.cycle, annual: year.annual, transition: c.transitions!.find(t => t.year === ref.year) ?? null });
});
it("retains every inherited research record and source contract, including Vercel trace repair", async () => {
  const inherited = json<{ locator: SourceLocator }[]>("inherited-research-inventory");
  expect(inherited).toHaveLength(15563);
  for (const r of inherited) await original(r.locator);
  const execution = json<{ file: string; sha256: string }[]>("execution-source-inventory");
  for (const r of execution) expect(sha(readFileSync(r.file))).toBe(r.sha256);
  expect(sha(readFileSync("src/lib/tickets/localDatabase.ts"))).toBe("931e1eba5d0bd46190d8a4e7eba1a45b376fd49819e8304416ded45aa7eab6c3");
}, 120000);
it.each(sources)("$key keeps source verification status separate from customer approval", s => {
  if (s.file) expect(sha(readFileSync(s.file))).toBe(s.fileSha256);
  expect(s.limitation.length).toBeGreaterThan(12);
  if (s.url) expect(s.status).toBe("historical_transcription_read_not_empirical");
});
it("keeps the registry declarative and unimported by runtime code", () => {
  const root = "src/lib/report-knowledge/major-fortune-product-research/";
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(dir + "/" + e.name) : [dir + "/" + e.name]);
  for (const file of walk("src").filter(f => /\.(ts|tsx)$/.test(f))) {
    const ast = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    for (const statement of ast.statements) {
      if (ts.isImportDeclaration(statement)) {
        if (file.startsWith(root)) expect(statement.importClause?.isTypeOnly).toBe(true);
        else expect((statement.moduleSpecifier as ts.StringLiteral).text.includes("major-fortune-product-research")).toBe(false);
      }
      if (file.startsWith(root)) expect(ts.isFunctionDeclaration(statement)).toBe(false);
    }
  }
});
