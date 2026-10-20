import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FUSION_RULES } from "@/lib/interpretation-v4/fusionRules";
import { FUSION_COMPLEMENT_RULES, GROUP_CONTEXTS } from "@/lib/interpretation-v4/fusionComplementRegistry";
import { FUSION_CONDITION_SPLITS } from "@/lib/interpretation-v4/fusionCore";
import { SEMANTIC_AXES, BIPOLAR_AXES } from "@/lib/interpretation-v4/semanticCore";
import { compatibilityRelationshipTypes } from "@/lib/report-knowledge/compatibilityTypes";
import { MBTI_TYPES } from "@/lib/report-knowledge/mbtiKnowledgeTypes";
import { SEMANTIC_FACETS } from "@/lib/report-knowledge/semantic-axis-research/semanticFacets";
import { LEGACY_TAG_RESEARCH } from "@/lib/report-knowledge/semantic-axis-research/legacyTags";
import { SEMANTIC_APPLICABILITY } from "@/lib/report-knowledge/semantic-axis-research/applicability";
import { LEGACY_FUSION_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/legacyFusionResearch";
import { COMPLEMENT_FUSION_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/complementFusionResearch";
import { NEW_FUSION_CANDIDATES } from "@/lib/report-knowledge/fusion-knowledge-research/newFusionCandidates";
import { TENSION_SPLIT_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/tensionSplitResearch";
import { FUSION_GROUP_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/fusionGroupResearch";
import { FACET_FUSION_STUDIES } from "@/lib/report-knowledge/fusion-knowledge-research/facetFusionStudies";
import { FUSION_SCOPE_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/fusionScopeResearch";
import { FUSION_APPLICABILITY_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/fusionApplicabilityResearch";
import { FUSION_RELATION_CONTRACTS } from "@/lib/report-knowledge/fusion-knowledge-research/fusionRelationContracts";
import { REJECTED_FUSION_RESEARCH } from "@/lib/report-knowledge/fusion-knowledge-research/rejectedFusionResearch";
import { FUSION_RESEARCH_POLICY, FUSION_RESEARCH_SOURCE_IDS } from "@/lib/report-knowledge/fusion-knowledge-research/fusionResearchSources";
import type { ExistingCalculatedEvidenceId, FusionResearchId, FusionMaterial } from "@/lib/report-knowledge/fusion-knowledge-research/fusionResearchTypes";
const doc="docs/validation/v4-fusion-semantic-knowledge-depth-01/";
const json=<T>(f:string):T=>JSON.parse(readFileSync(doc+f,"utf8")) as T;
const sha=(v:string|Buffer)=>createHash("sha256").update(v).digest("hex");
function pointer(input:unknown,path:string):unknown{return path.split("/").slice(1).reduce<unknown>((v,k)=>v!==null&&typeof v==="object"?(v as Record<string,unknown>)[k.replace(/~1/g,"/").replace(/~0/g,"~")]:undefined,input);}
function walk(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(resolve(dir,d.name)):[resolve(dir,d.name)]);}
const materials=[...LEGACY_FUSION_RESEARCH,...COMPLEMENT_FUSION_RESEARCH,...NEW_FUSION_CANDIDATES];
const all=[...materials,...TENSION_SPLIT_RESEARCH,...FUSION_GROUP_RESEARCH,...FACET_FUSION_STUDIES,...FUSION_SCOPE_RESEARCH,...FUSION_APPLICABILITY_RESEARCH,...FUSION_RELATION_CONTRACTS,...REJECTED_FUSION_RESEARCH];
const byId=new Map(all.map(x=>[x.id,x]));const facets=new Map(SEMANTIC_FACETS.map(f=>[f.id,f]));const sourceIds=new Set<string>(FUSION_RESEARCH_SOURCE_IDS);
type Assert<T extends true>=T;
type ResearchCannotBeCalculatedEvidence=Assert<FusionResearchId extends ExistingCalculatedEvidenceId?false:true>;
const typeProof:ResearchCannotBeCalculatedEvidence=true;
function checkTraitRefs(r:FusionMaterial){for(const t of r.mbti.traitRefs){const bytes=readFileSync(t.file),raw:unknown=JSON.parse(bytes.toString().replace(/^\uFEFF/,""));const trait=pointer(raw,t.pointer) as {id:string;sourceCoverage:string;plainKo:string};expect(trait.id).toBe(t.traitId);expect(trait.sourceCoverage).toBe(t.sourceCoverage);expect(sha(bytes)).toBe(t.sourceVersion);expect(sha(JSON.stringify(trait))).toBe(t.sha256);expect(sha(trait.plainKo)).toBe(t.plainKoSha256);expect(t.pointer).toMatch(/^\/traits\/[^/]+\/\d+$/);}}

describe("offline Fusion knowledge, reference and isolation contracts",()=>{
  it("preserves every pre-existing source, research, fixture and report byte",()=>{const locks=json<Record<string,string>>("existing-files-preservation.json");expect(Object.keys(locks)).toHaveLength(2133);for(const [f,h]of Object.entries(locks))expect(sha(readFileSync(f)),f).toBe(h);});
  it("covers exactly 44/96/8/10 without changing the original registries",()=>{
    expect(LEGACY_FUSION_RESEARCH.map(r=>r.existingRuleId)).toEqual(FUSION_RULES.map(r=>r.id));expect(COMPLEMENT_FUSION_RESEARCH.map(r=>r.existingRuleId)).toEqual(FUSION_COMPLEMENT_RULES.map(r=>r.id));
    expect(FUSION_GROUP_RESEARCH.map(g=>g.group)).toEqual(Object.keys(GROUP_CONTEXTS));expect(TENSION_SPLIT_RESEARCH.map(s=>s.split)).toEqual([...FUSION_CONDITION_SPLITS]);
    expect(FUSION_COMPLEMENT_RULES.every(r=>!r.positiveMeaning&&!r.shadowMeaning)).toBe(true);
    expect(NEW_FUSION_CANDIDATES).toHaveLength(24);expect(NEW_FUSION_CANDIDATES.filter(r=>r.novelty==="source_task_extension")).toHaveLength(6);
  });
  it.each(LEGACY_FUSION_RESEARCH)("$existingRuleId keeps its actual original rule and trait source",r=>{
    const original=FUSION_RULES.find(x=>x.id===r.existingRuleId)!;expect(sha(JSON.stringify(original))).toBe(r.existingRuleSha256);expect(r.legacyKind).toBe(original.kind);expect(r.originalMeaning).toBe(original.insightSeed);expect(r.originalDomains).toEqual(original.domains);expect(r.myeongli.features).toEqual(original.features);
    expect(r.mbti.traitRefs).toHaveLength(1);expect(r.mbti.traitRefs[0]).toMatchObject({type:original.type,area:original.trait[0],traitId:original.trait[1]});checkTraitRefs(r);
    expect(r.myeongli.researchRefs.length).toBeGreaterThan(0);expect(r.orientationPolicy).toBe("fixed_source_roles");
  });
  it.each(COMPLEMENT_FUSION_RESEARCH)("$existingRuleId gives distinct positive, risk, reversal and prerequisites",r=>{
    const original=FUSION_COMPLEMENT_RULES.find(x=>x.id===r.existingRuleId)!;expect(sha(JSON.stringify(original))).toBe(r.existingRuleSha256);expect(r.group).toBe(original.group);expect(r.contexts).toEqual(original.contexts);expect(r.originalMeaning).toBe(original.sourceDescription);
    expect(r.facets.map(f=>({axis:f.axis,direction:f.direction}))).toEqual([original.axisA,original.axisB]);expect(r.facets[0].axis).not.toBe(r.facets[1].axis);
    expect(r.myeongli.features).toEqual([]);expect(r.mbti.traitRefs).toEqual([]);expect(r.mbti.sourceStatus).toBe("specific_source_not_yet_bound");expect(r.orientationPolicy).toBe("both_source_assignments_require_independent_review");
    for(const k of ["jointReason","positive","risk","goodIntentionMistake","twist","counterexample","distinction"] as const)expect(r[k].length).toBeGreaterThan(12);
    expect(r.positive).not.toBe(r.risk);expect(r.twist).not.toBe(r.positive);expect(r.conditions.length).toBeGreaterThan(1);expect(r.exclusions.length).toBeGreaterThan(1);
  });
  it.each(NEW_FUSION_CANDIDATES)("$id uses a real primary trait and conditional source-task meaning",r=>{checkTraitRefs(r);expect(r.origin).toBe("new_candidate");expect(r.myeongli.researchRefs.length).toBeGreaterThan(0);expect(r.distinction.length).toBeGreaterThan(12);expect(r.conditions.length).toBeGreaterThan(1);expect(r.existingRuleId).toBeUndefined();});
  it.each(MBTI_TYPES)("audits each %s type without equalizing rule counts",type=>{expect(NEW_FUSION_CANDIDATES.some(r=>r.mbti.traitRefs.some(t=>t.type===type))).toBe(true);const audit=json<{type:string;legacyRuleCount:number;traitCount:number;frequencyStatus:string}[]>("mbti-16type-gap-audit.json").find(t=>t.type===type)!;expect(audit.legacyRuleCount).toBe(FUSION_RULES.filter(r=>r.type===type).length);expect(audit.traitCount).toBeGreaterThan(0);expect(audit.frequencyStatus).toBe("static_rule_coverage_not_production_selection_frequency");});
  it.each(TENSION_SPLIT_RESEARCH)("$split retains hypotheses and explicit unresolved conditions",s=>{expect(s.resolutionIsObservedHistory).toBe(false);expect(s.unresolved.length).toBeGreaterThan(12);expect(s.insufficient.length).toBeGreaterThan(12);expect(s.extraSourceRequired.length).toBeGreaterThan(10);expect(s.fictionalScene).toContain("가상");});
  it("resolves all 36 axes and 109 actual facets, including explicit withheld-direction studies",()=>{
    expect(new Set(materials.flatMap(r=>r.facets.map(f=>f.axis)))).toEqual(new Set(SEMANTIC_AXES));const used=new Set([...materials.flatMap(r=>r.facets.map(f=>f.facetRef)),...FACET_FUSION_STUDIES.map(s=>s.facetRef)]);expect(used).toEqual(new Set(SEMANTIC_FACETS.map(f=>f.id)));
    for(const r of materials)for(const f of r.facets){expect(facets.get(f.facetRef)?.axis).toBe(f.axis);expect(facets.get(f.facetRef)?.definition).toBe(f.definition);if(f.direction<0)expect(BIPOLAR_AXES).toContain(f.axis);}
    expect(FACET_FUSION_STUDIES).toHaveLength(5);for(const s of FACET_FUSION_STUDIES){expect(s.newFusionRule).toBe(false);for(const id of s.relatedResearchRefs)expect(byId.has(id),id).toBe(true);}
  });
  it("resolves original research references without promoting review or support",()=>{
    const inherited=json<{file:string;export:string;index:number;originalId:string;recordSha256:string;originalState:Record<string,unknown>}[]>("inherited-research-index.json");
    const catalog=json<{key:string;id:string;file:string;exportName:string;index:number;recordSha256:string}[]>("source-ref-catalog.json");
    for(const r of materials)for(const ref of r.myeongli.researchRefs){const locator=catalog.find(x=>"source-ref-catalog.json#"+x.key===ref.auditRef)!;expect(locator).toBeDefined();const actual=inherited.find(s=>s.file===locator.file&&s.export===locator.exportName&&s.index===locator.index&&s.originalId===ref.id)!;expect(actual,ref.id).toBeDefined();expect(ref.recordSha256).toBe(actual.recordSha256);expect(ref.originalStatus).toEqual(actual.originalState);}
    const gap=LEGACY_FUSION_RESEARCH.filter(r=>r.legacyKind==="complement");for(const g of gap)expect(g.myeongli.researchRefs.every(s=>s.relation==="related_not_equivalent")).toBe(true);
  });
  it("preserves original tags and all 22 prior tag relations without approving a new connection",()=>{
    const used=new Set<string>();
    for(const r of materials){
      const axes=r.facets.map(f=>f.axis), review=r.legacyTagReview;
      expect(review.use).toBe("reference_only_no_new_semanticConnection");
      const expected=LEGACY_TAG_RESEARCH.filter(t=>t.relatedAxes.some(a=>axes.includes(a)));
      expect(review.relatedTags.map(t=>t.tag)).toEqual(expected.map(t=>t.tag));
      for(const ref of review.relatedTags){const original=LEGACY_TAG_RESEARCH.find(t=>t.id===ref.researchRef)!;expect(ref.tag).toBe(original.tag);expect(ref.relation).toBe(original.relation);expect(ref.exactEquivalenceApproved).toBe(false);used.add(ref.tag);}
      if(r.origin==="legacy_rule"){const original=FUSION_RULES.find(x=>x.id===r.existingRuleId)!;expect(review.originalMyeongliTag).toBe(original.myeongliTag);expect(review.originalMbtiTag).toBe(original.trait[2]);}
      else{expect(review.originalMyeongliTag).toBeUndefined();expect(review.originalMbtiTag).toBeUndefined();}
    }
    expect(used).toEqual(new Set(LEGACY_TAG_RESEARCH.map(t=>t.tag)));expect(used.size).toBe(22);
  });
  it("uses stable unique IDs and never grants runtime, empirical or customer approval",()=>{
    expect(byId.size).toBe(all.length);expect(typeProof).toBe(true);
    for(const r of all){expect(r.id).toMatch(/^fkr:/);expect(r.connectedToRuntime).toBe(false);expect(r.approvedForCustomer).toBe(false);expect(r.existingScoreContribution).toBe(false);expect(r.runtimeEvidenceIds).toEqual([]);for(const s of r.sourceRefs)expect(sourceIds.has(s),s).toBe(true);}
    expect(FUSION_RESEARCH_POLICY).toMatchObject({newRuntimeRules:0,newEvidenceFacts:0,empiricalValidityClaim:"none",sourceDirectMeansEmpirical:false,legacySemanticKindsAreAutomaticallyEquivalent:false});
    expect(LEGACY_FUSION_RESEARCH.filter(r=>r.mbti.traitRefs.some(t=>t.sourceCoverage==="inferred"))).toHaveLength(3);
  });
  it("distinguishes original facts, facet decomposition and Fusion wrappers",()=>{for(const r of materials){expect(r.sourceFactPolicy).toBe("myeongli_fact_and_mbti_source_not_three_independent_facts");expect(r.missingEvidencePolicy).toBe("withhold_no_fallback_fact");expect(r.scopeRef).toBe("fkr:scope:individual");}for(const s of FUSION_SCOPE_RESEARCH){expect(s.independentFactsAdded).toBe(0);expect(s.counterpartInferenceAllowed).toBe(false);expect(s.periodCalculationFromMbtiAllowed).toBe(false);expect(s.failures.length).toBeGreaterThan(2);}});
  it("preserves role questions and forbids work/money scope becoming love or period evidence",()=>{
    expect(FUSION_APPLICABILITY_RESEARCH).toHaveLength(164);const rels=[...compatibilityRelationshipTypes];const products=["comprehensive","career","love","compatibility","major_fortune","annual_fortune"];
    for(const app of FUSION_APPLICABILITY_RESEARCH){expect(Object.keys(app.products)).toEqual(products);expect(Object.keys(app.relationships)).toEqual(rels);expect(app.products.major_fortune.status).toBe("temporal_evidence_required");expect(app.products.annual_fortune.status).toBe("temporal_evidence_required");
      for(const ref of [...Object.values(app.products),...Object.values(app.relationships)].flatMap(c=>c.questionRefs)){const [id,fragment]=ref.split("#"),[group,key]=fragment.split(":");const parent=SEMANTIC_APPLICABILITY.find(a=>a.id===id)!;expect(parent).toBeDefined();expect(group==="products"?Object.hasOwn(parent.products,key):Object.hasOwn(parent.relationships,key)).toBe(true);}}
    const money=FUSION_APPLICABILITY_RESEARCH.find(a=>a.materialId==="fkr:complement:C037")!;expect(money.relationships.love.status).toBe("not_transferable");expect(money.products.love.status).toBe("not_transferable");
  });
  it("audits every original pair without calling shared axes equivalent",()=>{
    const lp=json<{a:string;b:string;independentFactsAdded:number}[]>("legacy-pair-audit.json"),cp=json<{a:string;b:string;sameAxisDirectionPair:boolean;exactClaimEquivalenceApproved:boolean}[]>("complement-pair-audit.json");expect(lp).toHaveLength(946);expect(cp).toHaveLength(4560);expect(new Set(lp.map(p=>p.a+":"+p.b)).size).toBe(946);expect(new Set(cp.map(p=>p.a+":"+p.b)).size).toBe(4560);expect(cp.filter(p=>p.sameAxisDirectionPair).map(p=>[p.a,p.b])).toEqual([["C001","C081"]]);expect(cp.every(p=>p.exactClaimEquivalenceApproved===false)).toBe(true);
  });
  it("separates legacy and semantic relations and rejects invalid inference classes",()=>{
    expect(FUSION_RELATION_CONTRACTS.map(r=>r.relation)).toEqual(["reinforce","tension","complement"]);
    for(const r of FUSION_RELATION_CONTRACTS){expect(r.empiricalConfidenceIncreased).toBe(false);expect(r.notEquivalentBecause.length).toBeGreaterThan(12);}
    expect(REJECTED_FUSION_RESEARCH).toHaveLength(16);expect(new Set(REJECTED_FUSION_RESEARCH.map(r=>r.failure))).toEqual(new Set(["UNSUPPORTED_PRODUCER","UNVERIFIED_MODERN_APPLICATION","EMPIRICAL_PROMOTION","DUPLICATE_UNDERLYING_FACT","PAIR_AS_INDIVIDUAL","OWNER_MISMATCH","DIRECTION_SWAP","TIME_SCOPE_MISMATCH","OUTSIDE_INTERVAL","NEGATIVE_AS_DEFECT","ABSENCE_AS_OPPOSITE","OUTCOME_GUARANTEE","FICTION_AS_HISTORY","NO_JOINT_MECHANISM","FORCED_COMBINATION"]));
    for(const r of REJECTED_FUSION_RESEARCH){expect(r.review).toBe("rejected");expect(r.requiredBeforeReconsidering.length).toBeGreaterThan(8);}
  });
  it("keeps static modules type-only with no external import, lookup, generator or barrel",()=>{
    const own="/report-knowledge/fusion-knowledge-research/";for(const file of walk("src").filter(f=>/\.(ts|tsx)$/.test(f))){const code=readFileSync(file,"utf8");if(file.includes(own)){expect(code).not.toMatch(/^import(?! type)[\s{]/m);expect(code).not.toMatch(/export (?:async )?function|\b(?:fetch|require|setTimeout|setInterval)\s*\(/);expect(file).not.toMatch(/\/index\.ts$/);}else expect(code,file).not.toContain("fusion-knowledge-research/");}
    expect(materials.every(r=>r.fictionalScene.kind==="fictional_not_customer_history"&&r.fictionalScene.text.includes("가상"))).toBe(true);
  });
});
