import { readFileSync } from "node:fs";
import { SourceReader, hash, recordHash, canonicalJson } from "../sourceReader";
import { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import { ActualGraphIndex, graphCoverage } from "../actual-evidence-graph/graph";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider, ApprovalRecord } from "../knowledge-binder/types";
import type { KnowledgeCatalogRecord, CatalogKey } from "../types";
import type { ActualEvidenceGraph, GraphInput } from "../actual-evidence-graph/types";
import type { SemanticConfig, SemanticDomainDecision } from "../semantic-domain-verification/types";
import { syntheticCareerConflicts } from "./reuseConstraints";
import { SYNTHETIC_FILE, createCareerSyntheticSession, selectCareerSynthetic, careerSyntheticOptions } from "./selectionEngine";
import type { CareerSyntheticMeaning, CareerSyntheticQuestion, CareerIntroduction, CareerSyntheticContext } from "./types";
import type { JobStatus } from "../../../report-generation/reportInputTypes";
type Fixture = {
    questions: CareerSyntheticQuestion[];
    materials: {
        id: string;
        questionId: string;
        root: string;
        meaning: CareerSyntheticMeaning;
    }[];
};
export type SyntheticVariant = {
    missingApproval?: boolean;
    wrongOwner?: boolean;
    referenceOnly?: boolean;
    withheldRoot?: boolean;
    badSourceHash?: boolean;
    missingFact?: boolean;
    missingGroupSource?: boolean;
    validAndGroup?: boolean;
    domainBlocked?: boolean;
    jobStatus?: JobStatus;
    workFunction?: string;
    missingRecommendation?: boolean;
    wrongProofRoot?: boolean;
    economicFacts?: string[];
    learningFacts?: string[];
};
/** Every record, graph observation, root and approval in this factory is newly
 * declared test data. No real research candidate/Graph is cloned or approved. */
export async function careerSyntheticFixture(root: string, questionIds = [1, 2, 3, 4, 5], variant: SyntheticVariant = {}, ledger: readonly CareerIntroduction[] = []) {
    const text = readFileSync(root + "/" + SYNTHETIC_FILE, "utf8"), fixture = JSON.parse(text) as Fixture, rows = fixture.materials, configFile = "docs/validation/v4-knowledge-semantic-domain-verification-01/verification-config.json", config = JSON.parse(readFileSync(root + "/" + configFile, "utf8")) as SemanticConfig;
    const manifestFiles = ["docs/validation/v4-knowledge-unified-catalog-01/coverage-manifest.json", "docs/validation/v4-knowledge-source-verification-01/source-verification-manifest.json", "docs/validation/v4-knowledge-semantic-domain-verification-01/semantic-domain-manifest.json", configFile], frozen = new Map([...manifestFiles.map(f => [f, hash(readFileSync(root + "/" + f))] as const), [SYNTHETIC_FILE, hash(text)] as const]);
    const records: KnowledgeCatalogRecord[] = rows.map((r, i) => ({ catalogKey: `kc:v1:${hash(r.id)}`, originalId: r.id, namespace: "RESEARCH", family: "career-specialist-synthetic-fixture", kind: "PRODUCT_SPECIALIST", locator: { file: SYNTHETIC_FILE, pointer: `/materials/${i}`, recordSha256: recordHash(r), fileSha256: hash(text), sourceVersion: hash(text) }, review: { sourceExistence: "PRESENT", hashIntegrity: "MATCH", researchReview: "SYNTHETIC_ONLY", traditionalSourceVerification: null, mbtiSourceCoverage: null, meaningReview: "SYNTHETIC_REVIEW", calculationApplicability: "REQUIRES_ACTUAL_EVIDENCE", productApplicability: "DECLARED_CONDITIONS_ONLY", customerApproved: false }, applicability: { products: ["career_money_study"], relationships: [], fields: {}, ownership: { policy: "ACTUAL_PERSON_REQUIRED", declared: "person", parentChildAndManagerRolesMustMatch: true }, direction: { policy: "ACTUAL_DIRECTION_REQUIRED_IF_DECLARED", declared: null, recipientTenGodMustBeCalculated: true, reverseIsIndependent: true }, temporal: { declared: null, start: null, end: null, certainty: null, actors: null, supportedProducers: null, unsupportedProducers: null, excludedWindows: null, actualWindowSupplier: "FUTURE_EVIDENCE_GRAPH", unknownIsNotTimeless: true }, domainValidation: "DECLARED_ONLY" }, originalState: { syntheticOnly: true }, metadata: { syntheticOnly: true }, groupSemantics: "NOT_DECLARED", connectedToRuntime: false }));
    const reader = new SourceReader(root, async () => ({})), input = { records, edges: [], sourceReceipts: [], domainQueue: [], sourceGroups: [], directReviews: [], config, frozen }, knowledge = { records, sourceReceipts: [], decisions: [], policyRules: config.rules, staticAncestry: [], readFile: (f: string) => readFileSync(root + "/" + f, "utf8"), frozen };
    const decisions: SemanticDomainDecision[] = variant.domainBlocked ? records.map(r => ({decisionKey:"synthetic:career:policy:"+r.originalId,catalogKey:r.catalogKey,originalId:r.originalId,researchFamily:r.family,originalRecordHash:r.locator.recordSha256!,sourceVerificationReferenceKeys:[],originalMeaning:"UNKNOWN",targetMeaning:"UNKNOWN",sourceDomain:"SYNTHETIC_ONLY",targetDomain:"SYNTHETIC_ONLY",targetProduct:["career_money_study"],targetRelationship:[],context:null,semanticAxis:null,semanticFacet:null,semanticRelation:"INSUFFICIENT_VERIFICATION",declaredRelationNotApproved:null,requiredEvidence:[],requiredUserState:null,counterexamples:[],prohibitedInference:["EXPLICIT_SYNTHETIC_DOMAIN_PROHIBITION"],originalPolicyRefs:["synthetic:career:policy"],ancestryRefs:[],originalSourceReviewState:{syntheticOnly:true},domain:{state:"PROHIBITED",originalDomain:"SYNTHETIC_ONLY",targetDomain:"SYNTHETIC_ONLY",automaticEquivalence:false},products:[],relationships:[],reviewMethod:"DETERMINISTIC_STRUCTURAL_CHECK",reviewActorType:"MECHANICAL",reviewState:"UNREVIEWED",decisionState:"EXPLICITLY_PROHIBITED",blockingReasons:[],receiptKey:"synthetic:career:policy-receipt",customerApproved:false,actualCalculatedEvidence:"NOT_SUPPLIED",runtimeConnected:false})) : [];
    const catalog = new KnowledgeBinderCatalog(reader, input, knowledge, decisions), context = { fixtureId: "synthetic:career:selection", synthetic: true as const, evaluatedAt: "2026-10-12T12:00:00+09:00", owners: { person: "synthetic:career:owner" }, catalogVersion: catalog.evidence.versions.catalog, sourceVersion: catalog.evidence.versions.source, semanticVersion: catalog.evidence.versions.semantic }, graphIndex = new ActualGraphIndex(context);
    const nodes = new Map<string, string>();
    for (const r of rows) {
        if (nodes.has(r.root) || variant.missingFact)
            continue;
        const n = graphIndex.add({ kind: variant.referenceOnly ? "SOURCE_DECLARATION" : "CALCULATED_NATAL_FACT", owner: { slot: "person", fixtureOwnerId: variant.wrongOwner ? "synthetic:career:other" : context.owners.person, originalPersonId: null }, producer: { file: SYNTHETIC_FILE, symbol: "declaredSyntheticFact", version: "synthetic-career-v1", system: "synthetic-only" }, fact: { producerEvidenceId: "synthetic:career:fact:" + r.root, observationPointer: "/synthetic/facts/" + r.root, addressability: "ORIGINAL_ID", rootId: variant.referenceOnly ? null : "synthetic:career:root:" + r.root, rootType: variant.referenceOnly ? null : "PRODUCER_OBSERVATION", independentFact: !variant.referenceOnly }, value: { featureDefinitionId: "synthetic:career:feature:" + r.root }, participants: [], direction: null, temporal: null, certainty: "confirmed", sources: [], blockers: [] });
        if (variant.withheldRoot)
            graphIndex.block(n, "UNKNOWN_BIRTH_TIME");
        nodes.set(r.root, n.id);
    }
    const careerContext:CareerSyntheticContext={jobStatus:variant.jobStatus??"freelancer",effectiveFunction:variant.workFunction??"engineering",detailContextId:"synthetic:career:context:one",recommendationProofs:variant.missingRecommendation?[]:[{id:"synthetic:career:route:review",roots:[variant.wrongProofRoot?"synthetic:career:root:y":"synthetic:career:root:x"],complete:true}],economicFacts:variant.economicFacts??[],learningFacts:variant.learningFacts??[]};
    graphIndex.add({kind:"CONTEXT_INPUT",owner:{slot:"person",fixtureOwnerId:context.owners.person,originalPersonId:null},producer:{file:SYNTHETIC_FILE,symbol:"declaredSyntheticContext",version:"synthetic-career-v1",system:"synthetic-only"},fact:{producerEvidenceId:"synthetic:career:context-input",observationPointer:"/synthetic/context",addressability:"ORIGINAL_ID",rootId:null,rootType:null,independentFact:false},value:careerContext,participants:[],direction:null,temporal:null,certainty:"confirmed",sources:[],blockers:[]});
    const validation = graphIndex.finalize(), ns = [...graphIndex.nodes.values()], graph: ActualEvidenceGraph = { version: "actual-evidence-graph-v1", context, product: "career_money_study", relationship: null, nodes: ns, edges: graphIndex.edges, receipts: [], coverage: graphCoverage(ns, graphIndex.edges), validation, customerApproval: 0, runtimeConnection: 0, specialistClaimsEmitted: 0 };
    // The isolated Binder consumes only generatedAt/input from this metadata-only
    // envelope. It is deliberately not a generated report, never sent to a
    // Foundation/composer/Book validator, and contains no actual customer content.
    const metadata = { generatedAt: context.evaluatedAt, input: { kind: "careerMoneyStudy", productKey: "career_money_study", productSlug: "career-money-study", person: { name: "synthetic-only", birthDate: "", birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "", calendarType: "solar", timezone: "Asia/Seoul" }, userContext: { jobStatus: variant.jobStatus??"freelancer", relationshipStatus: "", detailJob: "", focusAreas: [] }, productOptions: {} } };
    const graphInput = { evidence: metadata, profiles: {}, context } as unknown as GraphInput;
    const candidates: KnowledgeCandidate[] = records.map((record, i) => { const r = rows[i], sourceCheck = { state: "PASS" as const, reasons: [], actualRecordHash: recordHash(r), fileHash: hash(text) }; catalog.sourceChecks.set(record.catalogKey, sourceCheck); catalog.raw.set(record.catalogKey, r); const c: KnowledgeCandidate = { record, classification: "INTERPRETATION_CANDIDATE", classificationReason: "SYNTHETIC_FIXTURE_ONLY", sourceCheck, provenance: "SYNTHETIC_TEST_ONLY", requirement: { catalogKey: record.catalogKey, originalId: r.id, knowledgeKind: "PRODUCT_SPECIALIST", adapter: "ISOLATED_SYNTHETIC_CONTRACT", products: ["career_money_study"], relationships: [], readerQuestion: r.questionId, coreMeaning: r.meaning.meaningId, chapterId: fixture.questions.find(q=>q.id===r.questionId)!.chapter, paragraphId: null, sentenceRole: null, claimIdentity: r.meaning.claimId, meaningIdentity: r.meaning.meaningId, sourceRequirements: [{ id: r.id + ":source", originalField: "/root", originalDeclaration: { syntheticOnly: true, root: r.root }, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_NATAL_FACT"], owner: "person", evidenceId: "synthetic:career:fact:" + r.root, fields: [] }, required: true, gaps: [] }], sourceGroups: [], sourceGroupSemantics: "NOT_DECLARED", requiredOwner: ["person"], requiredDirection: [], requiredParticipants: null, requiredTemporalScope: null, compositeLayers: 2, requiredContext: [], requiredUserState: [{key:"jobStatus",allowed:r.meaning.jobStatuses,originalField:"/meaning/jobStatuses"}], producerRequirements: [], counterexamples: [], prohibitions: {}, originalReviewState: { syntheticMeaningReviewed: true }, originalSourceLocators: [record.locator], unresolvedConditions: [], requiresIntroducedLedger: !!r.meaning.recallOf, introducedIds: r.meaning.recallOf ? [r.meaning.recallOf] : [], applicabilityState: "MACHINE_CHECKABLE" } }; if(variant.missingGroupSource||variant.validAndGroup){const second=structuredClone(c.requirement.sourceRequirements[0]);second.id=r.id+":second-required-source";if(variant.missingGroupSource)second.selector!.evidenceId="synthetic:career:absent-required-source";c.requirement.sourceRequirements.push(second);c.requirement.sourceGroupSemantics="ALL_DIRECT_SOURCES";c.requirement.sourceGroups=[{originalIndex:0,originalId:"synthetic:career:and-group:"+r.id,semantics:"ALL_DIRECT_SOURCES",sourceRequirementIds:c.requirement.sourceRequirements.map(s=>s.id),typePredicates:[],originalDeclaration:{syntheticOnly:true,allRequired:true},originalTechnicalState:"DECLARED_SOURCES_VERIFIED",requiresDisplayedLedger:false}];}
        catalog.candidates.set(record.catalogKey, c); return c; });
    if (variant.badSourceHash)
        candidates[0].sourceCheck = { ...candidates[0].sourceCheck, fileHash: "bad" };
    const request: KnowledgeBindingRequest = { graph, graphInput, product: "career_money_study", relationship: null, contexts: ["work", "closing"], actualUserState: {jobStatus:variant.jobStatus??"freelancer"}, introducedLedger: ledger.map(l => ({ catalogKey: records.find(r => r.originalId === l.materialId)?.catalogKey ?? "kc:v1:synthetic-prior", materialId: l.materialId, meaningId: l.meaningId, claimId: l.claimId, ownerIds: [l.owner], nodeIds: l.nodeIds, rootIds: l.roots, direction: null, product: "career_money_study", relationship: null, context: [l.context], actuallyDisplayed: true, readerQuestion: "synthetic:career:q:1", action: "synthetic-prior", conditions: [] })) };
    const approvalsById = new Map<CatalogKey, ApprovalRecord>(), authentic = new WeakSet<object>();
    const provider: KnowledgeBindingApprovalProvider = { lookup: r => variant.missingApproval ? null : approvalsById.get(r.catalogKey) ?? null, verifyAuthenticity: r => authentic.has(r) };
    const bindingIndex = new ActualBindingIndex(request, catalog);
    for (const c of candidates) {
        const expected = bindKnowledgeCandidate(c, bindingIndex, catalog).approvalRequirement, approval: ApprovalRecord = { ...expected, approvalVersion: "synthetic-career-v1", approverIdentity: "synthetic:career:fixture-reviewer", reviewRecord: "synthetic:career:fixture-approval", operatorApproved: true, customerApproved: true, issuedAt: "2026-01-01T00:00:00+09:00", expiresAt: "2027-01-01T00:00:00+09:00", revoked: false };
        authentic.add(approval);
        approvalsById.set(c.record.catalogKey, approval);
    }
    const questions = fixture.questions.filter(q => questionIds.some(id => q.id === "synthetic:career:q:" + id)), meanings = new Map(rows.map(r => [r.id, r.meaning]));

    const session = await createCareerSyntheticSession(catalog, request, candidates, questions, meanings, provider, careerContext, ledger);
    return { session, request, catalog, candidates, questions, meanings, provider, careerContext, options: careerSyntheticOptions(session), nodes, sourceDigest: hash(canonicalJson(fixture)) };
}
export async function runCareerSyntheticValidation(root:string){
 const f=await careerSyntheticFixture(root),methods=["FIRST_ELIGIBLE","QUESTION_FIT_FIRST","CONSTRAINT_AWARE_SELECTION"] as const,comparison=methods.map(m=>selectCareerSynthetic(f.session,m)),negative=[];
 for(const[name,variant]of Object.entries({missingApproval:{missingApproval:true},wrongOwner:{wrongOwner:true},sourceDefinition:{referenceOnly:true},withheldRoot:{withheldRoot:true},sourceHash:{badSourceHash:true},missingFact:{missingFact:true},missingGroupSource:{missingGroupSource:true},domainBlocked:{domainBlocked:true},wrongStatus:{jobStatus:"student" as const},unknownFunction:{workFunction:"unknown"}})){const n=await careerSyntheticFixture(root,[1,2,3,4,5],variant);negative.push({name,eligible:n.options.filter(o=>o.eligible).length,reasons:[...new Set(n.options.flatMap(o=>o.reasons))]});}
 const semantic=await careerSyntheticFixture(root,[6,7]),fit=await careerSyntheticFixture(root,[8]),missing=await careerSyntheticFixture(root,[9]),prior=f.options.find(o=>o.id==="synthetic:career:a")!;
 const display:CareerIntroduction={materialId:prior.id,meaningId:prior.meaning.meaningId,claimId:prior.meaning.claimId,owner:prior.owner,mbtiType:prior.mbtiType,roots:prior.roots,nodeIds:prior.receipt.selectedActualEvidence,context:prior.meaning.context,actuallyDisplayed:true,displayRecord:"synthetic:career:display:one",jobStatus:prior.jobStatus,effectiveFunction:prior.effectiveFunction,detailContextId:prior.detailContextId,questionId:prior.questionId};
 const closing=await careerSyntheticFixture(root,[9],{},[display]),domain=[];
 for(const[name,ids,variant]of [["money-missing",[10],{}],["money-entered",[10],{economicFacts:["synthetic:career:money:netProfit"]}],["skill-missing",[11],{learningFacts:["synthetic:career:learning:interest"]}],["skill-entered",[11],{learningFacts:["synthetic:career:learning:independentPerformance"]}],["recommendation-missing",[12],{missingRecommendation:true}],["recommendation-matched",[12],{}],["recommendation-root-mismatch",[12],{wrongProofRoot:true}]] as const){const n=await careerSyntheticFixture(root,[...ids],variant as SyntheticVariant);domain.push({name,options:n.options,selection:selectCareerSynthetic(n.session,"CONSTRAINT_AWARE_SELECTION")});}
 return {mode:"SYNTHETIC_ELIGIBLE_SELECTION_TEST",sourceFile:SYNTHETIC_FILE,sourceDigest:f.sourceDigest,comparison,negative,searchLimitCase:selectCareerSynthetic(f.session,"CONSTRAINT_AWARE_SELECTION",1),questionFitComparison:methods.map(m=>selectCareerSynthetic(fit.session,m)),semantic:{edges:syntheticCareerConflicts(semantic.options),selection:selectCareerSynthetic(semantic.session,"CONSTRAINT_AWARE_SELECTION")},closing:{withoutDisplay:missing.options.filter(o=>o.eligible).length,withDisplay:closing.options.filter(o=>o.eligible).length,selection:selectCareerSynthetic(closing.session,"CONSTRAINT_AWARE_SELECTION"),plannedSelectionNotDisplay:true},domain,actualResearchApproved:0,customerClaimsEmitted:0,options:f.options};
}
