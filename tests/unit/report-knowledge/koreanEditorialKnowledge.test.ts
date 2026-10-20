import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { expect, it } from "vitest";
import { narrativeSurfaces } from "@/lib/interpretation-v4/narrativeEndings";
import { withKoreanParticle, type KoreanParticle } from "@/lib/report-knowledge/koreanCopyUtils";
import { KOREAN_EDITORIAL_FUNCTIONS as functions } from "@/lib/report-knowledge/korean-editorial-research/functionResearch";
import { KOREAN_CLAIM_RESEARCH as claims } from "@/lib/report-knowledge/korean-editorial-research/claimResearch";
import { KOREAN_EXPRESSION_MATERIALS as expressions } from "@/lib/report-knowledge/korean-editorial-research/expressionMaterials";
import { KOREAN_CONDITIONAL_SCENES as scenes } from "@/lib/report-knowledge/korean-editorial-research/sceneResearch";
import { KOREAN_PRODUCT_STYLES as products } from "@/lib/report-knowledge/korean-editorial-research/productStyles";
import { KOREAN_RELATIONSHIP_STUDIES as relationships } from "@/lib/report-knowledge/korean-editorial-research/relationshipStyles";
import { KOREAN_GRAMMAR_RESEARCH as grammar } from "@/lib/report-knowledge/korean-editorial-research/grammarResearch";
import { KOREAN_GRAMMAR_FIXTURES as fixtures } from "@/lib/report-knowledge/korean-editorial-research/grammarFixtures";
import { KOREAN_TRANSITION_RESEARCH as transitions } from "@/lib/report-knowledge/korean-editorial-research/transitionResearch";
import { KOREAN_RHYTHM_RESEARCH as rhythm } from "@/lib/report-knowledge/korean-editorial-research/rhythmResearch";
import { KOREAN_REJECTED_EXPRESSIONS as rejected } from "@/lib/report-knowledge/korean-editorial-research/rejectedMaterials";
import { KOREAN_EXPRESSION_BINDING as binding } from "@/lib/report-knowledge/korean-editorial-research/bindingDesign";
import { KOREAN_COMPATIBILITY_ROLE_VIEWS as roles } from "@/lib/report-knowledge/korean-editorial-research/compatibilityRoleViews";
import { KOREAN_EDITORIAL_SOURCES as sources } from "@/lib/report-knowledge/korean-editorial-research/sourceInventory";
import { KOREAN_TERM_EXPLANATIONS as terms } from "@/lib/report-knowledge/korean-editorial-research/termExplanationResearch";
import { KOREAN_BINDING_INVARIANT_FIXTURES as invariants } from "@/lib/report-knowledge/korean-editorial-research/invariantFixtures";
import type { Offline, Locator, SourcePointer, ResearchId, ActualEvidenceId, NounSlot, PredicateSlot } from "@/lib/report-knowledge/korean-editorial-research/researchTypes";

type Assert<T extends true> = T;
export type ResearchNotEvidence = Assert<ResearchId extends ActualEvidenceId ? false : true>;
export type NounNotPredicate = Assert<NounSlot extends PredicateSlot ? false : true>;
const all: readonly Offline[] = [...functions, ...claims, ...expressions, ...scenes, ...products, ...relationships, ...grammar, ...fixtures, ...transitions, ...rhythm, ...rejected, ...binding, ...roles, ...sources, ...terms, ...invariants];
const doc = "docs/validation/v4-korean-editorial-knowledge-01/";
const json = <T,>(n: string): T => JSON.parse(readFileSync(doc + n + ".json", "utf8"));
const sha = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const cache = new Map<string, Promise<Record<string, unknown>>>();
async function original(ref: Locator | SourcePointer) {
  const l = "catalog" in ref ? (JSON.parse(readFileSync(ref.catalog, "utf8")) as { entries: Record<string, Locator> }).entries[ref.catalogKey] : ref;
  expect(l.originalId).toBe(ref.originalId); expect(l.recordSha256).toBe(ref.recordSha256); expect(l.sourceVersion).toBe(ref.sourceVersion);
  if (!cache.has(l.file)) cache.set(l.file, import(pathToFileURL(resolve(l.file)).href));
  const exports = await cache.get(l.file)!;
  const raw = (exports[l.exportName] as Record<string, unknown>[])[l.index];
  expect(raw.id).toBe(l.originalId); expect(sha(JSON.stringify(raw))).toBe(l.recordSha256);
  return raw;
}
it.each(all)("$id is unapproved offline research without scores or calculated Evidence IDs", r => {
  expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false);
  expect(r.runtimeEvidenceIds).toEqual([]); expect(r.existingScoreContribution).toBe(false);
  expect(r.review).toBe("editorial_research_not_customer_approved");
});
it("covers actual six product keys, seven relationship enums and independent rhetorical purposes", () => {
  expect(all).toHaveLength(392); expect(new Set(all.map(r => r.id)).size).toBe(all.length);
  expect(products.map(p => p.productKey)).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
  expect(relationships.map(r => r.category)).toEqual(["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"]);
  expect(functions.map(r => r.function)).toEqual(["opening", "explanation", "concretization", "positive", "risk", "blunt", "twist", "comparison", "fusion", "scene", "action", "transition", "summary", "closing"]);
  expect(new Set(functions.map(r => r.purpose)).size).toBe(14);
  const exported = { "editorial-function-inventory": functions, "expression-materials": expressions, "conditional-scenes": scenes, "product-expression-matrix": products, "relationship-expression-matrix": relationships, "paragraph-transition-research": transitions, "rejected-expression-materials": rejected };
  for (const [file, rows] of Object.entries(exported)) expect(json<unknown>(file)).toEqual(rows);
  const grammarExport = json<{ rules: unknown; fixtures: unknown; invariants: unknown }>("korean-grammar-contract");
  expect(grammarExport.rules).toEqual(grammar); expect(grammarExport.fixtures).toEqual(fixtures); expect(grammarExport.invariants).toEqual(invariants);
  for (const r of functions) { expect(r.good).not.toBe(r.bad); expect(r.inputs.length).toBeGreaterThan(0); expect(r.preservation.length).toBeGreaterThan(10); for (const id of r.sourceRefs) expect(sources.some(s => s.id === id)).toBe(true); }
});
it.each(claims)("$id preserves the actual specialized research question and source-local review state", async r => {
  const raw = await original(r.source);
  expect(raw.coreMeaning ?? raw.meaning).toBe(r.originalCoreMeaning);
  for (const [k, v] of Object.entries(r.sourceState)) expect(raw[k]).toEqual(v);
  expect(r.notNewInterpretation).toBe(true); expect(r.certainty).toBe("conditional");
});
it.each(expressions)("$expressionIdentity shares claim identity, required context, prohibited inference and all semantic units", r => {
  const claim = claims.find(c => c.id === r.claimRef)!;
  expect(claim).toBeTruthy(); expect(r.meaningIdentity).toBe(claim.meaningIdentity);
  expect(r.semanticUnits).toEqual(claim.semanticUnits); expect(r.requiredContext).toEqual(claim.requiredContext);
  expect(r.prohibitedInference).toEqual(claim.prohibitedInference);
  expect(r.meaningChangeAllowed).toBe(false); expect(r.newEvidenceCreated).toBe(false);
  const variants = expressions.filter(e => e.claimRef === r.claimRef);
  expect(variants).toHaveLength(2); expect(new Set(variants.map(e => e.text)).size).toBe(2);
  expect(r.humanReviewRequiredBeforeUse).toBe(true);
});
it.each(scenes)("$sceneIdentity requires hypothetical state and relevant actual or conditional context", r => {
  expect(r.status).toBe("hypothetical_only"); expect(r.notCustomerHistory).toBe(true);
  expect(r.requiredClaimApproval).toBe(true); expect(r.actors.length).toBeGreaterThan(0);
  for (const key of ["requiredUserState", "interpretationLink", "distinctiveInformation", "realismCondition", "excludedContext", "fictionalLead"] as const) expect(r[key].trim().length).toBeGreaterThan(0);
});
it.each(relationships)("$category keeps ten distinct relationship questions with both independent directions", async r => {
  await original(r.source); expect(r.aspects.map(x => x.key)).toEqual(["personA", "personB", "common", "difference", "ab", "ba", "positive", "conflict", "repair", "maintenance"]);
  expect(new Set(r.aspects.map(x => x.question)).size).toBe(10);
  expect(r.aspects[4].requiredEvidence).toContain("A→B"); expect(r.aspects[5].requiredEvidence).toContain("B→A");
  expect(r.originalRoleContract).toBe("9 chapters / 36 paragraphs / 144 sentence roles");
});
it.each(roles)("$address preserves the exact existing role in all seven research contracts", async r => {
  expect(sha(readFileSync(r.sourceFile))).toBe(r.sourceHash);
  expect(r.categorySources).toHaveLength(7); expect(r.referenceOnly).toBe(true); expect(r.notNewClaim).toBe(true);
  for (const source of r.categorySources) { const raw = await original(source.locator); expect(raw.originalRole).toBe(r.originalRole); }
  if (r.address.startsWith("CH05")) expect(r.directionContract).toContain("A→B");
  if (r.address.startsWith("CH06")) expect(r.directionContract).toContain("B→A");
});
it.each(fixtures.filter(f => f.disposition === "supported_existing_case"))("$id matches existing supported Hangul particle behavior", f => {
  const kind = f.existingProbe!.split(":")[1] as KoreanParticle;
  expect(withKoreanParticle(f.surface, kind)).toBe(f.preferred);
  expect(f.preferred).not.toBe(f.prohibited);
});
it("retains grammar exceptions as contracts and does not claim a universal grammar validator", () => {
  expect(grammar).toHaveLength(28); expect(fixtures).toHaveLength(46);
  for (const r of grammar) { expect(r.automationStatus).toBe("contract_only"); expect(r.correct).not.toBe(r.incorrect); for (const id of r.sourceRefs) expect(sources.some(s => s.id === id)).toBe(true); }
  expect(fixtures.filter(f => f.disposition === "unfixed_existing_limitation")).toHaveLength(4);
  const surfaces = narrativeSurfaces({ id: "offline-grammar-probe", text: "이 자료는 정보입니다.", role: "MYEONGLI_REASON", semanticTheme: "grammar-probe-only", primaryAxes: [], contexts: [], directnessLevel: 0, origin: "MYEONGLI", refs: { evidenceIds: [], claimIds: [], fusionIds: [], resonanceIds: [], guidanceIds: [], mbtiSourceNodeIds: [] } });
  expect(surfaces.find(s => s.id === "SOFT")?.text).toBe("이 자료는 정보여요.");
  // Records the existing helper limitation; this is not valid publication evidence.
  expect(invariants).toHaveLength(14); expect(invariants.every(r => !r.actualBindingImplemented)).toBe(true);
});
it("requires actual introduced meanings, logic, ownership and time before future transitions or binding", () => {
  expect(transitions).toHaveLength(15); expect(rhythm).toHaveLength(12); expect(binding).toHaveLength(9);
  for (const r of binding) { expect(r.implemented).toBe(false); expect(r.failureReasons).toHaveLength(2); expect(r.introducedLedgerRequirement.length).toBeGreaterThan(15); expect(r.time.length).toBeGreaterThan(15); }
  for (const r of transitions) { expect(r.good).not.toBe(r.bad); expect(r.previousRequirement.trim().length).toBeGreaterThan(0); expect(r.invalidWhen.trim().length).toBeGreaterThan(0); }
});
it.each(terms)("$term retains the source contract and licenses no new Saju fact", r => {
  expect(sha(readFileSync(r.sourceFile))).toBe(r.sourceHash);
  expect(r.terminologyStudyNotNewSajuFact).toBe(true); expect(r.good).not.toBe(r.bad);
});
it("preserves every inherited research record and all indexed existing source bytes", async () => {
  const rows = json<{ locator: Locator; originalState: Record<string, unknown> }[]>("inherited-research-inventory");
  expect(rows).toHaveLength(18218);
  for (const r of rows) { const raw = await original(r.locator); for (const [k, v] of Object.entries(r.originalState)) expect(raw[k]).toEqual(v); }
  const files = json<{ file: string; fileSha256: string; mandatory: boolean }[]>("existing-system-inventory");
  expect(files.filter(f => f.mandatory)).toHaveLength(17);
  for (const f of files) expect(sha(readFileSync(f.file))).toBe(f.fileSha256);
  expect(sha(readFileSync("src/lib/tickets/localDatabase.ts"))).toBe("931e1eba5d0bd46190d8a4e7eba1a45b376fd49819e8304416ded45aa7eab6c3");
}, 120000);
it("keeps every new source declaration static and absent from all runtime imports and exports", () => {
  const folder = "src/lib/report-knowledge/korean-editorial-research/";
  const walk = (p: string): string[] => readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(p + "/" + e.name) : [p + "/" + e.name]);
  for (const file of walk("src").filter(f => /\.(ts|tsx)$/.test(f))) {
    const ast = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    for (const s of ast.statements) {
      if (ts.isImportDeclaration(s) || ts.isExportDeclaration(s)) {
        const spec = s.moduleSpecifier as ts.StringLiteral | undefined;
        if (!file.startsWith(folder)) expect(spec?.text.includes("korean-editorial-research") ?? false).toBe(false);
        else if (ts.isImportDeclaration(s)) expect(s.importClause?.isTypeOnly).toBe(true);
      }
      if (file.startsWith(folder)) expect(ts.isFunctionDeclaration(s)).toBe(false);
    }
  }
});
