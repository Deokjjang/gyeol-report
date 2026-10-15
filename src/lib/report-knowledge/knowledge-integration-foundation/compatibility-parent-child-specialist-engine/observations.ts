import { readFileSync } from "node:fs";
import { generateV4ShadowReport } from "../../../interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../interpretation-v4/runtimeProjection";
import type { CompatibilityProduct } from "../../../interpretation-v4/compatibilityProductAdapter";
import { projectBook } from "../../../../app/dev/book-preview/bookProjection";
import { observeActualProfiles } from "../actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "../actual-evidence-graph/engine";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { canonicalJson } from "../sourceReader";
import type { CompatibilityReportInputPayload } from "../../../report-generation/reportInputTypes";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import {legacyRoleBoundary,swapRoleDeclaration} from "./roleValidator";
import { observePairWitnesses } from "../compatibility-love-specialist-engine/pairWitness";
type InputCase = { letter: string; variants: CompatibilityReportInputPayload[]; requiredPredicate: string; hypotheticalContext:{context:string}|null };
export async function auditPairObservations(root: string, foundation: ProductSpecialistFoundation) {
  const cases = JSON.parse(readFileSync(root + "/docs/validation/v4-compatibility-parent-child-product-knowledge-01/input-cases.json", "utf8")) as InputCase[];
  const baseline = JSON.parse(readFileSync(root + "/docs/validation/v4-compatibility-parent-child-specialist-engine-01/pair-baseline-digests.json", "utf8")) as { letter: string; variant: number; ok:boolean; error?:unknown; hashes?: Record<string, string> }[];
  const rows = [], expectedErrors = [], forbidden: string[] = [];
  for (const c of cases) for (const [variant, payload] of c.variants.entries()) {
    const g = await generateV4ShadowReport(payload, { evaluatedAt: "2026-10-12T12:00:00+09:00" });
    forbidden.push(payload.personA.name,payload.personB.name,payload.personA.birthDate,payload.personB.birthDate);
    if (!g.ok) {
      const before=baseline.find(b=>b.letter===c.letter&&b.variant===variant);
      if(!["Q","R"].includes(c.letter)||!before||before.ok||canonicalJson(g.error)!==canonicalJson(before.error))throw Error("UNEXPECTED_PARENT_CHILD_GENERATION_FAILURE:"+c.letter);
      expectedErrors.push({letter:c.letter,variant,ok:false,error:g.error,legacy:legacyRoleBoundary(payload),originalErrorPreserved:true});continue;
    }
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.input.kind !== "compatibility" || e.composition.product !== "saju_mbti_compatibility" || !("personA" in e.calculations)) throw Error("ACTUAL_PAIR_OUTPUT_REQUIRED");
    if (g.externalCalls?.length) throw Error("OFFLINE_EXTERNAL_CALL");
    const r = e.composition.result as CompatibilityProduct, book = projectBook(e), publication = validateV4Publication(e.productType, g.draft, e);
    if (!book || !publication.ok) throw Error("ORIGINAL_BOOK_PUBLICATION_INVALID");
    const hashes = { calculations: v4Digest(e.calculations), packet: v4Digest(e), narrative: v4Digest(r.narrative), integration: v4Digest(r.integration), book: v4Digest(book) }, before = baseline.find(b => b.letter === c.letter && b.variant === variant);
    if (!before || canonicalJson(before.hashes) !== canonicalJson(hashes)) throw Error("ORIGINAL_PAIR_RUNTIME_CHANGED:" + c.letter);
    const context = { fixtureId: "fixture-parent-child-observation-" + c.letter + "-" + variant, synthetic: true as const, evaluatedAt: e.generatedAt, owners: { personA: "observation:A", personB: "observation:B" }, catalogVersion: foundation.catalog.evidence.versions.catalog, sourceVersion: foundation.catalog.evidence.versions.source, semanticVersion: foundation.catalog.evidence.versions.semantic }, graphInput = { evidence: e, profiles: observeActualProfiles(e).profiles, context }, built = buildActualEvidenceGraph(graphInput, foundation.catalog.evidence);
    if (!built.ok) throw Error("ORIGINAL_PAIR_GRAPH_INVALID");
    const index = new ActualBindingIndex({ graph: built.graph, graphInput, product: "saju_mbti_compatibility", relationship: r.evidence.category, contexts: [], actualUserState: {} }, foundation.catalog), witnesses = observePairWitnesses(index);
    const errors = [...index.errors, ...witnesses.filter(w => w.kind !== "FUSION_DERIVATION").flatMap(w => w.errors)];
    const chapters = r.integration.readerEdition.chapters;
    if (chapters.length !== 9 || chapters.reduce((n, c) => n + c.paragraphs.length, 0) !== 36 || errors.length) throw Error("PAIR_READER_OR_WITNESS_CONTRACT_CHANGED:" + errors.join("|"));
    forbidden.push(e.input.personA.name, e.input.personB.name, e.input.personA.birthDate, e.input.personB.birthDate);
    rows.push({ letter: c.letter, variant, roleBoundary:legacyRoleBoundary(payload), actualDevelopmentalState:"UNKNOWN",hypotheticalResearchContext:c.hypotheticalContext?.context??null, roleVersion:r.evidence.roleVersion,roles:r.evidence.roles, adultV: c.letter==="V"?{address:"CH06.P4",excerpt:"자녀는 해보고 싶은 일과 도움이 필요한 곳을 말할 수 있으며, 부모가 안전과 최종 결정의 책임을 맡아야 합니다.", originalParagraphHash:v4Digest(chapters.find(c=>c.id==="CH06")!.paragraphs.find(p=>p.id==="CH06.P4")!.text),states:["ACTUAL_READER_ADULT_BOUNDARY_RISK","CURRENT_WRITER_UNCHANGED","SPECIALIST_ADULT_CONTEXT_WITHHELD","FUTURE_WRITER_REPAIR_REQUIRED"]}:null,relationship: r.evidence.category, requiredPredicate: c.requiredPredicate, hashes, originalDigestsMatch: true, score: r.compatibilityIndex, individualDigests: r.integration.individualDigests, directions: r.evidence.directions, canonical: witnesses.filter(w => w.kind === "CANONICAL_PAIR_FACT"), fusion: witnesses.filter(w => w.kind === "FUSION_DERIVATION").map(w => ({ nodeId: w.nodeId, owner: w.owner, originalEvidenceId: w.originalEvidenceId, pointer: w.pointer, errors: w.errors })), unsupportedCrossRelations: r.evidence.unsupportedCrossRelations, knownMbti: { A: !!e.input.personA.mbtiType, B: !!e.input.personB.mbtiType }, knownHour: { A: !!e.calculations.personA.pillars.hour, B: !!e.calculations.personB.pillars.hour }, readerDraft: { version: r.integration.readerEdition.version, chapters: chapters.length, paragraphs: chapters.reduce((n, c) => n + c.paragraphs.length, 0), digest: v4Digest(r.integration.readerEdition) }, readerValidation: r.integration.readerValidation, readerEditorial: r.integration.readerEditorial, publishedEdition: r.integration.publishedEdition, publishedBookDigest: v4Digest(book), fallback: r.integration.publishedEdition !== r.integration.readerEdition.version, errors });
  }
  const u = rows.filter(r => r.letter === "T"), v = rows.filter(r => r.letter === "S");
  const swaps = { nameOnly: { personAUnchanged: u[0].individualDigests.personA === u[1].individualDigests.personA, personBUnchanged: u[0].individualDigests.personB === u[1].individualDigests.personB, sameReceivedGod: canonicalJson(u[0].directions.aToB.receivedTenGod) === canonicalJson(u[1].directions.aToB.receivedTenGod) }, whole: { originalAIsNewB: v[0].individualDigests.personA === v[1].individualDigests.personB, originalBIsNewA: v[0].individualDigests.personB === v[1].individualDigests.personA, originalABIsNewBA: canonicalJson(v[0].directions.aToB) === canonicalJson(v[1].directions.bToA), originalBAIsNewAB: canonicalJson(v[0].directions.bToA) === canonicalJson(v[1].directions.aToB) } };
  if (Object.values(swaps.nameOnly).some(x => !x) || Object.values(swaps.whole).some(x => !x) || rows.length !== 38 || expectedErrors.length!==2) throw Error("ORIGINAL_SWAP_CONTRACT_CHANGED");
  return { rows, expectedErrors, roleSwapState:swapRoleDeclaration(true), swaps, forbidden, actualGenerationVariants: rows.length+expectedErrors.length, successfulVariants:rows.length, newlyIssuedSpecialistDisplays: 0 };
}
