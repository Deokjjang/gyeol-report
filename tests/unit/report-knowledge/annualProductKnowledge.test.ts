import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { expect, it } from "vitest";
import { ANNUAL_RESEARCH_SOURCES as sources } from "@/lib/report-knowledge/annual-fortune-product-research/sourceInventory";
import { ANNUAL_CORE_RESEARCH as core } from "@/lib/report-knowledge/annual-fortune-product-research/annualCoreResearch";
import { ANNUAL_TEN_GOD_RESEARCH as annualGods } from "@/lib/report-knowledge/annual-fortune-product-research/annualTenGodResearch";
import { MONTHLY_TEN_GOD_RESEARCH as monthGods } from "@/lib/report-knowledge/annual-fortune-product-research/monthlyTenGodResearch";
import { MONTHLY_ELEMENT_RESEARCH as elements } from "@/lib/report-knowledge/annual-fortune-product-research/monthlyElementResearch";
import { ANNUAL_MONTH_MATRIX as months } from "@/lib/report-knowledge/annual-fortune-product-research/monthMatrix";
import { ANNUAL_TIME_BOUNDARY_RESEARCH as time } from "@/lib/report-knowledge/annual-fortune-product-research/timeBoundaryResearch";
import { ANNUAL_SCOPE_RESEARCH as scopes } from "@/lib/report-knowledge/annual-fortune-product-research/interactionResearch";
import { ANNUAL_RELATION_PRACTICES as relations } from "@/lib/report-knowledge/annual-fortune-product-research/relationPracticeResearch";
import { ANNUAL_DOMAIN_RESEARCH as domains } from "@/lib/report-knowledge/annual-fortune-product-research/domainResearch";
import { ANNUAL_INFORMATION_RESEARCH as information } from "@/lib/report-knowledge/annual-fortune-product-research/informationResearch";
import { ANNUAL_MONTH_CONNECTIONS as connections } from "@/lib/report-knowledge/annual-fortune-product-research/yearMonthConnectionResearch";
import { ANNUAL_BINDING_DESIGN as binding } from "@/lib/report-knowledge/annual-fortune-product-research/bindingDesign";
import { ANNUAL_REJECTED as rejected } from "@/lib/report-knowledge/annual-fortune-product-research/rejectedResearch";
import { ANNUAL_TEMPORAL_CROSSWALK as temporal } from "@/lib/report-knowledge/annual-fortune-product-research/temporalCrosswalk";
import { ANNUAL_MAJOR_HANDOFF as major } from "@/lib/report-knowledge/annual-fortune-product-research/majorResearchHandoff";
import { ANNUAL_AXIS_CROSSWALK as axes } from "@/lib/report-knowledge/annual-fortune-product-research/axisCrosswalk";
import { ANNUAL_FACET_CROSSWALK as facets } from "@/lib/report-knowledge/annual-fortune-product-research/facetCrosswalk";
import { ANNUAL_FUSION_CROSSWALK as fusion } from "@/lib/report-knowledge/annual-fortune-product-research/fusionCrosswalk";
import { ANNUAL_MBTI_CROSSWALK as mbti } from "@/lib/report-knowledge/annual-fortune-product-research/mbtiCrosswalk";
import { ANNUAL_OBSERVED_MONTH_VIEWS as views } from "@/lib/report-knowledge/annual-fortune-product-research/observedMonthViews";
import { ANNUAL_OBSERVED_APPLICATIONS as applications } from "@/lib/report-knowledge/annual-fortune-product-research/observedApplicationResearch";
import type { Offline, Locator, ExistingEvidenceId, ResearchId } from "@/lib/report-knowledge/annual-fortune-product-research/researchTypes";

type Assert<T extends true> = T;
export type ResearchCannotBecomeEvidence = Assert<ResearchId extends ExistingEvidenceId ? false : true>;
const doc = "docs/validation/v4-annual-fortune-product-knowledge-01/";
const json = <T,>(name: string): T => JSON.parse(readFileSync(doc + name + ".json", "utf8"));
const sha = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const studies = [...core, ...annualGods, ...monthGods, ...elements, ...months, ...time, ...scopes, ...relations, ...domains, ...information, ...connections, ...applications];
const crosswalks = [...temporal, ...major, ...axes, ...facets, ...fusion];
const all: readonly Offline[] = [...sources, ...studies, ...binding, ...rejected, ...crosswalks, ...mbti, ...views];
const cache = new Map<string, Promise<Record<string, unknown>>>();
async function original(l: Locator): Promise<Record<string, unknown>> {
  if (!cache.has(l.file)) cache.set(l.file, import(pathToFileURL(resolve(l.file)).href));
  const sourceExports = await cache.get(l.file)!;
  const rows = sourceExports[l.exportName]; expect(Array.isArray(rows)).toBe(true);
  const row = (rows as Record<string, unknown>[])[l.index];
  expect(row.id).toBe(l.originalId); expect(sha(JSON.stringify(row))).toBe(l.recordSha256);
  return row;
}
it.each(all)("$id remains offline, unapproved, score-free and has no runtime Evidence IDs", r => {
  expect(r.productKey).toBe("annual_fortune"); expect(r.id).toMatch(/^afpr:/);
  expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false);
  expect(r.existingScoreContribution).toBe(false); expect(r.runtimeEvidenceIds).toEqual([]);
});
it.each(studies)("$id has separate condition, positive/risk/twist, action, fictional scene and exclusions", r => {
  const fields = [r.meaning, r.positive, r.risk, r.twist, r.action, r.counterexample];
  expect(fields.every(v => v.length > 8)).toBe(true); expect(new Set(fields).size).toBe(6);
  expect(r.scene.hypothetical).toBe(true); expect(r.scene.isCustomerHistory).toBe(false);
  expect(r.scene.text.length).toBeGreaterThan(10); expect(r.requires.length).toBeGreaterThan(0);
  expect(r.disallowed.length).toBeGreaterThan(0);
  for (const id of r.sourceRefs) expect(sources.some(s => s.id === id)).toBe(true);
});
it.each(crosswalks)("$id retains exact source hashes and source-local review states without new rules", async r => {
  const raw = await original(r.locator);
  for (const [key, value] of Object.entries(r.originalState)) expect(raw[key]).toEqual(value);
  expect(r.referenceOnly).toBe(true); expect(r.bindingImplemented).toBe(false);
});
it.each(mbti)("$type retains 32 original per-domain sources and primary direct/inferred conditions", async r => {
  expect(r.locators).toHaveLength(32);
  for (const l of r.locators) {
    const raw = await original(l.locator);
    for (const key of ["basis", "domain", "sourceRefs", "applicationGate", "provenance"] as const) expect(raw[key]).toEqual(l[key]);
  }
  expect(r.scope).toBe("personal_only"); expect(r.pairPolicy).toContain("no A/B");
});
it("covers all finite product scopes without fixing year, segment count or composite verdict", () => {
  expect(new Set(all.map(r => r.id)).size).toBe(all.length);
  const gods = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];
  expect(annualGods.map(r => r.god)).toEqual(gods); expect(monthGods.map(r => r.god)).toEqual(gods);
  for (const [i, monthly] of monthGods.entries()) {
    for (const field of ["positive", "risk", "twist", "action"] as const) expect(monthly[field]).not.toBe(annualGods[i][field]);
  }
  expect(elements.map(r => r.element)).toEqual(["wood", "fire", "earth", "metal", "water"]);
  expect(months.map(r => r.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  expect(new Set(months.map(r => r.primaryMeaning)).size).toBe(12);
  expect(months.every(r => r.notFixedToYear && !r.segmentCountFixed && r.notMonthlyFate)).toBe(true);
  expect(scopes.map(r => r.scope)).toEqual(["natal_saeun", "natal_wolun", "dayun_saeun", "dayun_wolun", "saeun_wolun", "natal_dayun_saeun", "natal_saeun_wolun", "natal_dayun_saeun_wolun"]);
  expect(scopes.slice(5).every(r => r.compositeVerdictSupported === false)).toBe(true);
  expect(domains).toHaveLength(8); expect(time).toHaveLength(10);
  expect(temporal).toHaveLength(410); expect(major).toHaveLength(863);
  expect(axes).toHaveLength(36); expect(facets).toHaveLength(109); expect(fusion).toHaveLength(164);
  expect(binding).toHaveLength(12); expect(binding.every(r => !r.implemented)).toBe(true);
  for (const r of binding) {
    for (const field of ["ownerContract", "periodContract", "certaintyContract", "sourceAncestryContract", "sourceVersionContract", "duplicatePolicy"] as const) expect(r[field].length).toBeGreaterThan(12);
    expect(r.failureReasons.length).toBeGreaterThan(0); expect(r.counterexamples.length).toBeGreaterThan(0);
    expect(r.approvalConditions).toHaveLength(3);
  }
});
it("retains inherited unsupported, unverified and rejected temporal material as withheld", () => {
  for (const r of temporal) {
    if (r.originalState.class === "F") expect(r.applicationPolicy).toBe("withhold_rejected");
    if (r.originalState.class === "E") expect(r.applicationPolicy).toBe("withhold_unverified");
    if (r.originalState.class === "G" || r.originalState.producerSupport === "unsupported") expect(r.applicationPolicy).toBe("withhold_unsupported");
  }
});
it.each(views)("$caseId/$month observed coverage matches the actual source matrix", r => {
  const matrix = json<{ caseId: string; month: number; focus: unknown; segmentCount: number; allSegmentOriginalIds: readonly string[]; displayedProofSourceRefs: readonly string[] }[]>("monthly-information-matrix");
  const raw = matrix.find(x => x.caseId === r.caseId && x.month === r.month)!;
  expect(sha(JSON.stringify(raw))).toBe(r.sourceObservation.recordSha256);
  expect(r.actualFocus).toEqual(raw.focus); expect(r.segmentCount).toBe(raw.segmentCount);
  expect(r.originalFactIds).toEqual(raw.allSegmentOriginalIds); expect(r.displayedProofSourceRefs).toEqual(raw.displayedProofSourceRefs);
  expect(r.notNewMeaningOrEvidence).toBe(true);
  const diversity = json<{ caseId: string; month: number; actualFocus: { monthPillar: unknown; effectiveAnnualPillar: unknown; activeDayunContext: unknown }; newCalculatedEvidence: boolean }[]>("monthly-diversity-matrix");
  expect(diversity).toHaveLength(132);
  const entry = diversity.find(x => x.caseId === r.caseId && x.month === r.month)!;
  const focus = raw.focus as { pillar: unknown; effectiveAnnual: unknown; dayun: unknown };
  expect(entry.actualFocus.monthPillar).toEqual(focus.pillar);
  expect(entry.actualFocus.effectiveAnnualPillar).toEqual(focus.effectiveAnnual);
  expect(entry.actualFocus.activeDayunContext).toEqual(focus.dayun);
  expect(entry.newCalculatedEvidence).toBe(false);
});
it.each(applications)("$id is conditional research against an actual matching period observation", r => {
  const ref = r.sourceObservation as { caseId: string; month: number; recordSha256: string };
  const matrix = json<{ caseId: string; month: number; focus: unknown }[]>("monthly-information-matrix");
  const raw = matrix.find(x => x.caseId === ref.caseId && x.month === ref.month)!;
  expect(sha(JSON.stringify(raw))).toBe(ref.recordSha256);
  expect((r.actualScope as { focus: unknown }).focus).toEqual(raw.focus);
  expect(r.bindingImplemented).toBe(false);
});
it("distinguishes annual pre/post-transition detection, empty focus and genuine three-actor formation", () => {
  type Segment = { startKst: string; relationFacts: { source: string; type: string; certainty: string; participants?: string[] }[] };
  type Observation = { id: string; calendar?: { month: number; segments: Segment[] }[]; annualStemRelations?: { annualStem: string }[] };
  const baseline = json<Observation[]>("baseline-generation");
  const future = baseline.find(r => r.id === "FUTURE_OFFLINE")!.calendar![3].segments;
  expect(future).toHaveLength(3);
  expect(future[1].relationFacts.some(f => f.source === "month_dayun_branch" && f.type === "반합")).toBe(true);
  expect(future[2].relationFacts.filter(f => f.source === "month_dayun_branch")).toEqual([]);
  type Focus = { relationFacts: Segment["relationFacts"] };
  const detailed = json<{ id: string; months?: { month: number; focus: Focus }[] }[]>("baseline-generation");
  expect(detailed.find(r => r.id === "B")!.months![7].focus.relationFacts.filter(f => f.source !== "month_natal_element")).toEqual([]);
  const trine = detailed.find(r => r.id === "H_STUDENT")!.months![7].focus.relationFacts.find(f => f.type === "삼합")!;
  expect(new Set(trine.participants).size).toBe(3);
});
it.each(sources)("$key preserves source status, file hash and explicit limits", r => {
  if (r.file) expect(sha(readFileSync(r.file))).toBe(r.fileSha256);
  expect(r.limitation.length).toBeGreaterThan(10);
  if (r.url) expect(r.verification).toBe("historical_transcription_read_not_empirical");
});
it("retains all inherited records and every audited existing source file", async () => {
  const inventory = json<{ locator: Locator; originalState: Record<string, unknown> }[]>("inherited-research-inventory");
  expect(inventory).toHaveLength(16426);
  for (const r of inventory) {
    const raw = await original(r.locator);
    for (const [key, value] of Object.entries(r.originalState)) expect(raw[key]).toEqual(value);
  }
  for (const r of json<{ file: string; sha256: string }[]>("execution-source-inventory")) expect(sha(readFileSync(r.file))).toBe(r.sha256);
  expect(sha(readFileSync("src/lib/tickets/localDatabase.ts"))).toBe("931e1eba5d0bd46190d8a4e7eba1a45b376fd49819e8304416ded45aa7eab6c3");
}, 120000);
it("does not register new research with runtime and contains only static data/type declarations", () => {
  const folder = "src/lib/report-knowledge/annual-fortune-product-research/";
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(dir + "/" + e.name) : [dir + "/" + e.name]);
  for (const file of walk("src").filter(f => /\.(ts|tsx)$/.test(f))) {
    const ast = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    for (const statement of ast.statements) {
      if (ts.isImportDeclaration(statement)) {
        if (file.startsWith(folder)) expect(statement.importClause?.isTypeOnly).toBe(true);
        else expect((statement.moduleSpecifier as ts.StringLiteral).text.includes("annual-fortune-product-research")).toBe(false);
      }
      if (file.startsWith(folder)) expect(ts.isFunctionDeclaration(statement)).toBe(false);
    }
  }
});
