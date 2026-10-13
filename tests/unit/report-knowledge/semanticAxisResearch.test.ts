import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SEMANTIC_AXES, BIPOLAR_AXES, STRENGTH_AXES, BIPOLAR_DIRECTIONS } from "@/lib/interpretation-v4/semanticCore";
import { BROAD_SEMANTIC_THEMES, broadTheme } from "@/lib/interpretation-v4/foundationRanking";
import { V4_DOMAINS } from "@/lib/interpretation-v4/types";
import { AXIS_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/axisProfiles";
import { SEMANTIC_FACETS } from "@/lib/report-knowledge/semantic-axis-research/semanticFacets";
import { BIPOLAR_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/bipolarDirections";
import { STRENGTH_SIGNAL_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/strengthSignals";
import { LEGACY_TAG_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/legacyTags";
import { BROAD_THEME_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/broadThemes";
import { CONTEXT_DOMAIN_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/contextDomains";
import { SEMANTIC_APPLICABILITY } from "@/lib/report-knowledge/semantic-axis-research/applicability";
import { COMPOSITE_MEANINGS } from "@/lib/report-knowledge/semantic-axis-research/compositeMeanings";
import { NEW_AXIS_CANDIDATES } from "@/lib/report-knowledge/semantic-axis-research/newAxisCandidates";
import { SEMANTIC_AUDIT } from "@/lib/report-knowledge/semantic-axis-research/semanticAudit";
import { SEMANTIC_RESEARCH_POLICY, SEMANTIC_RESEARCH_SOURCES } from "@/lib/report-knowledge/semantic-axis-research/semanticResearchSources";
import { FUSION_BIPOLAR_MEANINGS, FUSION_STRENGTH_MEANINGS } from "@/lib/interpretation-v4/fusionMeanings";
import { compatibilityRelationshipTypes } from "@/lib/report-knowledge/compatibilityTypes";
import { MATERIAL_REGISTRY } from "@/lib/interpretation-v4/materialRegistry";
import { FUSION_RULES } from "@/lib/interpretation-v4/fusionRules";
const doc = "docs/validation/v4-semantic-axis-knowledge-expansion-01/";
const json = <T>(file: string): T => JSON.parse(readFileSync(doc + file, "utf8")) as T;
const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const axes = new Set<string>(SEMANTIC_AXES), sources = new Set<string>(SEMANTIC_RESEARCH_SOURCES.map(s => s.id));
const all = [...AXIS_RESEARCH, ...SEMANTIC_FACETS, ...BIPOLAR_RESEARCH, ...STRENGTH_SIGNAL_RESEARCH, ...LEGACY_TAG_RESEARCH, ...BROAD_THEME_RESEARCH, ...CONTEXT_DOMAIN_RESEARCH, ...SEMANTIC_APPLICABILITY, ...COMPOSITE_MEANINGS, ...NEW_AXIS_CANDIDATES, ...SEMANTIC_AUDIT];
const contexts = ["identity", "work", "money", "social", "love", "stress", "learning", "recovery"];
const categories = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"];
const products = ["comprehensive", "career", "love", "compatibility", "major_fortune", "annual_fortune"];
function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(resolve(dir,d.name)) : [resolve(dir,d.name)]); }

describe("isolated semantic knowledge research", () => {
  it("keeps every pre-existing source, research, fixture, snapshot and report byte", () => {
    const locks = json<Record<string,string>>("existing-files-preservation.json");
    expect(Object.keys(locks)).toHaveLength(2074);
    for (const [file,digest] of Object.entries(locks)) expect(sha(readFileSync(file)),file).toBe(digest);
  });
  it("covers exact existing axes and creates no scored axis", () => {
    expect(AXIS_RESEARCH.map(x=>x.axis)).toEqual([...SEMANTIC_AXES]);
    expect(AXIS_RESEARCH.filter(x=>x.kind === "bipolar").map(x=>x.axis)).toEqual([...BIPOLAR_AXES]);
    expect(AXIS_RESEARCH.filter(x=>x.kind === "strength").map(x=>x.axis)).toEqual([...STRENGTH_AXES]);
    expect(new Set(all.map(x=>x.id)).size).toBe(all.length);
    for (const r of all) { expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false); expect(r.existingScoreContribution).toBe(false); expect(r.runtimeEvidenceIds).toEqual([]); for (const s of r.sourceRefs) expect(sources.has(s),s).toBe(true); }
    expect(SEMANTIC_RESEARCH_POLICY.empiricalClaim).toBe("none");
  });
  it.each(SEMANTIC_AXES)("preserves distinct, conditional material and applicability for %s", axis => {
    const p=AXIS_RESEARCH.find(x=>x.axis===axis)!, fs=SEMANTIC_FACETS.filter(x=>x.axis===axis), app=SEMANTIC_APPLICABILITY.find(x=>x.axis===axis)!;
    expect(p.facets).toEqual(fs.map(f=>f.id)); expect(p.definitionRelation).toBe("conditional_decomposition_not_replacement");
    const original = p.kind === "bipolar" ? JSON.stringify(FUSION_BIPOLAR_MEANINGS[axis as keyof typeof FUSION_BIPOLAR_MEANINGS]) : FUSION_STRENGTH_MEANINGS[axis as keyof typeof FUSION_STRENGTH_MEANINGS];
    expect(p.existingDefinition).toBe(original); expect(fs.length).toBeGreaterThan(1);
    expect(new Set(fs.map(f=>f.definition)).size).toBe(fs.length);
    for (const key of ["definition","distinction","positive","risk","weakSignalLimit","twist","environment","counterexample","fictionalScene","prohibitedClaim"] as const) expect(p[key].length).toBeGreaterThan(8);
    expect(p.fictionalScene).toContain("가상"); expect(axes.has(p.distinguishAxis)).toBe(true);
    expect(Object.keys(app.products)).toEqual(products); expect(categories).toEqual([...compatibilityRelationshipTypes]); expect(Object.keys(app.relationships)).toEqual(categories);
    expect(new Set(Object.values(app.relationships).map(x=>x.question)).size).toBe(7);
    expect(new Set(Object.values(app.products).map(x=>x.question)).size).toBe(6);
    for (const f of fs) { expect(f.parent).toBe(p.id); expect(f.notIndependentEvidence).toBe(true); expect(f.condition.length).toBeGreaterThan(7); expect(f.applicabilityRef).toBe(app.id); expect(f.applicabilityMode).toBe("parent_questions_intersect_own_condition"); expect(axes.has(f.distinguishAxis)).toBe(true); }
  });
  it.each(BIPOLAR_AXES)("preserves both original directions without defect inference: %s", axis => {
    const rows=BIPOLAR_RESEARCH.filter(x=>x.axis===axis); expect(rows).toHaveLength(2);
    expect(rows.map(x=>x.direction)).toEqual([-1,1]); expect(rows.map(x=>x.label)).toEqual([...BIPOLAR_DIRECTIONS[axis]]);
    expect(rows[0].positive).not.toBe(rows[1].positive);
    for (const r of rows) expect(r.defectInferenceAllowed).toBe(false);
  });
  it("distinguishes weak, absent, contrary and unresolved strength signals", () => {
    expect(STRENGTH_SIGNAL_RESEARCH.map(x=>x.state)).toEqual(["supported","weak","absent","contrary_observed","unresolved"]);
    expect(STRENGTH_SIGNAL_RESEARCH.find(x=>x.state==="contrary_observed")!.forbidden).toContain("낮은 값");
    expect(STRENGTH_SIGNAL_RESEARCH.find(x=>x.state==="absent")!.meaning).toContain("관찰하지 못함");
  });
  it("cross-references actual tags, Materials and Fusion traits without equivalence", () => {
    const inv=json<{tags:string[]}>("existing-semantic-inventory.json"); expect(LEGACY_TAG_RESEARCH.map(x=>x.tag)).toEqual(inv.tags);
    for (const r of LEGACY_TAG_RESEARCH) {
      expect(r.exactEquivalenceApproved).toBe(false);
      expect(r.existingMaterials).toEqual(MATERIAL_REGISTRY.filter(m=>m.semanticTags.includes(r.tag)).map(m=>m.feature));
      expect(r.existingFusionRuleIds).toEqual(FUSION_RULES.filter(f=>f.myeongliTag===r.tag||f.trait[2]===r.tag).map(f=>f.id));
      for (const a of r.relatedAxes) expect(axes.has(a)).toBe(true);
    }
    expect(LEGACY_TAG_RESEARCH.find(x=>x.tag==="help")!.relation).toBe("NOT_EQUIVALENT");
    expect(LEGACY_TAG_RESEARCH.find(x=>x.tag==="wealth")!.relation).toBe("NOT_EQUIVALENT");
    expect(LEGACY_TAG_RESEARCH.find(x=>x.tag==="expression-gap")!.relation).toBe("NO_TRAIT_INFERENCE");
  });
  it("audits themes against actual membership and reports the existing empty tie", () => {
    expect(BROAD_THEME_RESEARCH).toHaveLength(16);
    for (const r of BROAD_THEME_RESEARCH) expect(r.axes).toEqual(BROAD_SEMANTIC_THEMES[r.theme as keyof typeof BROAD_SEMANTIC_THEMES]);
    expect(BROAD_THEME_RESEARCH.flatMap(x=>x.overlappingAxisIds)).toEqual([]);
    expect(broadTheme([])).toBe("ACTION_AND_INITIATIVE");
    expect(SEMANTIC_AUDIT.find(x=>x.id==="sar:audit:empty-theme")!.currentDefectConfirmed).toBe(true);
  });
  it("covers all 80 context/domain pairs and forbids outcome inference", () => {
    expect(CONTEXT_DOMAIN_RESEARCH).toHaveLength(80);
    expect(new Set(CONTEXT_DOMAIN_RESEARCH.map(x=>x.context+":"+x.domain))).toEqual(new Set(contexts.flatMap(c=>V4_DOMAINS.map(d=>c+":"+d))));
    expect(CONTEXT_DOMAIN_RESEARCH.filter(x=>x.domain==="success/fortune").every(x=>x.relation==="not_transferable")).toBe(true);
    expect(CONTEXT_DOMAIN_RESEARCH.find(x=>x.context==="social"&&x.domain==="relationships")!.relation).toBe("partial_scope");
  });
  it("keeps compounds and new candidates research-only and without fabricated Evidence", () => {
    expect(COMPOSITE_MEANINGS).toHaveLength(12); expect(NEW_AXIS_CANDIDATES).toHaveLength(2);
    for(const c of COMPOSITE_MEANINGS){expect(c.axes.length).toBeGreaterThan(1);expect(c.notNewAxis).toBe(true);expect(c.notIndependentEvidence).toBe(true);}
    for(const n of NEW_AXIS_CANDIDATES){expect(n.disposition).toBe("research_only_no_scoring");expect(n.verificationRequired.length).toBeGreaterThan(2);}
  });
  it("accounts for all existing research records, without losing original state or cross-person scope", () => {
    const summary=json<{researchFiles:number;researchRecords:number;traits:number;traitUnscored:number;oldPairs:number}>("survey-summary.json");
    expect(summary).toMatchObject({researchFiles:117,researchRecords:2991,traits:1213,traitUnscored:143,oldPairs:256});
    const survey=json<{rows:{id:string;originalId:string;file:string;classification:string;family:string;existingRelatedAxes:string[];connectedToRuntime:boolean;approvedForCustomer:boolean}[]}>("source-semantic-survey.json").rows;
    expect(survey).toHaveLength(2991); expect(new Set(survey.map(x=>x.id)).size).toBe(2991);
    expect(survey.filter(x=>x.originalId.startsWith("mkr:"))).toHaveLength(512);
    expect(survey.filter(x=>x.originalId.startsWith("mpr:"))).toHaveLength(256);
    for(const r of survey){expect(r.connectedToRuntime).toBe(false);expect(r.approvedForCustomer).toBe(false);expect("ABCDEF").toContain(r.classification);if(r.family==="mbtiPair")expect(r.existingRelatedAxes).toEqual([]);}
  });
  it("resolves every scope gate without manufacturing specialized interpretation", () => {
    const gates=json<{products:Record<string,{requires:string[];excludes:string[]}>;relationships:Record<string,{requires:string[];excludes:string[]}>}>("applicability-gates.json");
    expect(Object.keys(gates.products)).toEqual(products);expect(Object.keys(gates.relationships)).toEqual(categories);
    for(const a of SEMANTIC_APPLICABILITY) {
      for(const [key,row] of Object.entries(a.products)){expect(row.gateRef).toBe("sar:gate:product:"+key);expect(gates.products[key].requires.length).toBeGreaterThan(0);expect(gates.products[key].excludes.length).toBeGreaterThan(0);}
      for(const [key,row] of Object.entries(a.relationships)){expect(row.gateRef).toBe("sar:gate:relationship:"+key);expect(gates.relationships[key].requires.length).toBeGreaterThan(0);}
    }
  });
  it("keeps full source provenance paths in documentation without runtime loading", () => {
    const refs=json<{repositoryReferences:{id:string;file:string;status:string}[]}>("source-verification.json").repositoryReferences;
    expect(refs).toHaveLength(3);
    for(const r of refs){expect(readFileSync(r.file,"utf8").length).toBeGreaterThan(0);expect(sources.has(r.id)).toBe(true);expect(r.status).toBe("repository_checked_not_empirical");}
  });
  it("keeps all new modules static, with type-only dependencies, and no external runtime consumer", () => {
    const own="/report-knowledge/semantic-axis-research/";
    for(const file of walk("src").filter(f=>/\.(ts|tsx)$/.test(f))) {
      const code=readFileSync(file,"utf8");
      if(file.includes(own)) {
        expect(code).not.toMatch(/\b(?:fetch|require|setTimeout|setInterval)\s*\(/);
        expect(code).not.toMatch(/^import(?! type)[\s{]/m);
        expect(code).not.toMatch(/export (?:async )?function/);
      } else expect(code,file).not.toContain("semantic-axis-research/");
    }
    for(const s of SEMANTIC_RESEARCH_SOURCES) if("file" in s) expect(readFileSync(s.file,"utf8").length).toBeGreaterThan(0);
  });
});
