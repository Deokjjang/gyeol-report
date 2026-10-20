import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { COMPATIBILITY_READER_CHAPTERS } from "@/lib/interpretation-v4/compatibilityReleaseContracts";
import { godEffects } from "@/lib/interpretation-v4/compatibilityInteractions";
import { buildMbtiSemanticProfile } from "@/lib/interpretation-v4/mbtiSemanticProfile";
import { RELATIONSHIP_DOMAINS } from "@/lib/interpretation-v4/relationshipProductView";
import { FRIENDSHIP_MATERIALS as materials } from "@/lib/report-knowledge/compatibility-friendship-research/paragraphResearch";
import { FRIENDSHIP_CHAPTERS as chapters } from "@/lib/report-knowledge/compatibility-friendship-research/chapterResearch";
import { FRIENDSHIP_ROLES as roles } from "@/lib/report-knowledge/compatibility-friendship-research/sentenceRoleResearch";
import { FRIENDSHIP_CONCEPTS as concepts } from "@/lib/report-knowledge/compatibility-friendship-research/friendshipConcepts";
import { FRIENDSHIP_EXTERNAL_SOURCES as sources } from "@/lib/report-knowledge/compatibility-friendship-research/sourceRegistry";
import { FRIENDSHIP_CANONICAL_CROSSWALK as canonical } from "@/lib/report-knowledge/compatibility-friendship-research/canonicalRelationCrosswalk";
import { FRIENDSHIP_PAIR_CROSSWALK as pairs } from "@/lib/report-knowledge/compatibility-friendship-research/mbtiPairCrosswalk";
import { FRIENDSHIP_FUSION_CROSSWALK as fusion } from "@/lib/report-knowledge/compatibility-friendship-research/fusionCrosswalk";
import { FRIENDSHIP_SEMANTIC_CROSSWALK as facets } from "@/lib/report-knowledge/compatibility-friendship-research/semanticCrosswalk";
import { FRIENDSHIP_MBTI_TRAIT_CROSSWALK as traits } from "@/lib/report-knowledge/compatibility-friendship-research/individualMbtiCrosswalk";
import { FRIENDSHIP_PERSON_LENSES as lenses } from "@/lib/report-knowledge/compatibility-friendship-research/personResearch";
import { FRIENDSHIP_DIRECTIONS as directions } from "@/lib/report-knowledge/compatibility-friendship-research/directionalResearch";
import { FRIENDSHIP_TEN_GOD_STUDIES as gods } from "@/lib/report-knowledge/compatibility-friendship-research/recipientTenGodResearch";
import { FRIENDSHIP_REPAIR_STUDIES as repairs } from "@/lib/report-knowledge/compatibility-friendship-research/conflictRepairResearch";
import { FRIENDSHIP_CATEGORY_DIFFERENCES as differences } from "@/lib/report-knowledge/compatibility-friendship-research/categoryDifferenceResearch";
import { FRIENDSHIP_LIFE_CONTEXTS as life } from "@/lib/report-knowledge/compatibility-friendship-research/lifeContextResearch";
import { FRIENDSHIP_BINDING_DESIGN as design } from "@/lib/report-knowledge/compatibility-friendship-research/bindingDesign";
import { FRIENDSHIP_REJECTED as rejected } from "@/lib/report-knowledge/compatibility-friendship-research/rejectedResearch";
import { FRIENDSHIP_SOURCE_GROUPS as groups } from "@/lib/report-knowledge/compatibility-friendship-research/sourceInventory";
import type { Offline, ResearchId, ExistingEvidenceId } from "@/lib/report-knowledge/compatibility-friendship-research/researchTypes";
type Assert<T extends true> = T;
export type ResearchCannotBecomeEvidence = Assert<ResearchId extends ExistingEvidenceId ? false : true>;

const doc = "docs/validation/v4-compatibility-friendship-product-knowledge-01/";
const json = <T,>(name: string): T => JSON.parse(readFileSync(doc + name, "utf8"));
const sha = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const pointer = (v: unknown, p: string): unknown => p.split("/").slice(1).reduce((a, key) => (a as Record<string, unknown>)[key.replace(/~1/g, "/").replace(/~0/g, "~")], v);
const primary = new Map<string, unknown>();
function mbti(file: string): unknown {
  if (!primary.has(file)) primary.set(file, JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, "")));
  return primary.get(file);
}
const all: readonly Offline[] = [...materials, ...chapters, ...roles, ...concepts, ...sources, ...canonical, ...pairs, ...fusion, ...facets, ...traits, ...lenses, ...directions, ...gods, ...repairs, ...differences, ...life, ...design, ...rejected, ...groups];
const byId = new Map(materials.map(m => [m.id, m]));
it("preserves the original complete 9/36/144 contract without renaming chapter titles or roles", () => {
  expect(json("original-contract.json")).toEqual(COMPATIBILITY_READER_CHAPTERS);
  expect(chapters).toHaveLength(9); expect(materials).toHaveLength(36); expect(roles).toHaveLength(144);
  expect(chapters.map(c => c.originalTitle)).toEqual(COMPATIBILITY_READER_CHAPTERS.map(c => c.title));
  expect(chapters.map(c => c.originalKey)).toEqual(COMPATIBILITY_READER_CHAPTERS.map(c => c.key));
  expect(new Set(roles.map(r => r.address)).size).toBe(144);
});
it.each(all)("$id never becomes a runtime fact, approved customer claim or score", r => {
  expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false);
  expect(r.existingScoreContribution).toBe(false); expect(r.runtimeEvidenceIds).toEqual([]);
  expect(r.relationshipType).toBe("friendship"); expect(r.id).toMatch(/^frpr:/);
});
it.each(materials)("$address keeps independent information, role-specific meanings, owners and hypothetical facts", m => {
  const [c, p] = m.address.split(".");
  const original = COMPATIBILITY_READER_CHAPTERS.find(ch => ch.id === c)!.paragraphs.find(row => row.id === p)!;
  expect(m.roleContributions.map(r => r.originalRole)).toEqual(original.sentences);
  expect(m.roleContributions.map(r => r.address)).toEqual([1, 2, 3, 4].map(i => m.address + ".S" + i));
  expect(new Set(m.roleContributions.map(r => r.knowledge)).size).toBe(4);
  for (const key of ["readerQuestion", "coreMeaning", "additionalMeaning", "positive", "risk", "bluntWeakness", "twist", "counterexample", "distinction"] as const) expect(m[key].length).toBeGreaterThan(10);
  expect(new Set([m.coreMeaning, m.additionalMeaning, m.positive, m.risk, m.bluntWeakness, m.twist]).size).toBe(6);
  expect(m.scene.status).toBe("hypothetical_only"); expect(m.scene.isCustomerHistory).toBe(false);
  expect(Object.values(m.actualRelationshipFacts).every(v => v === "UNKNOWN")).toBe(true);
  expect(m.binding.sourceUsePolicy).toBe("only_systems_actually_supporting_claim");
  expect(m.binding.missingMbti).toBe("withhold_own_mbti_pair_and_fusion_claims");
  expect(m.binding.validNatalNotDiscarded).toBe(true);
  expect(m.actions.A).not.toBe(m.actions.B);
  for (const id of m.facetRefs) expect(facets.some(f => f.sourceId === id)).toBe(true);
  for (const id of m.conceptIds) expect(concepts.some(c => c.id === id)).toBe(true);
  for (const use of m.ownedSources) expect([...groups, ...sources].some(r => r.id === use.sourceRef)).toBe(true);
  if (m.mode === "SELF_A") expect(m.ownedSources.some(s => s.owner === "B")).toBe(false);
  if (m.mode === "SELF_B") expect(m.ownedSources.some(s => s.owner === "A")).toBe(false);
  if (["REPAIR", "RECALL"].includes(m.mode)) {
    expect(m.binding.introducedGroups.length).toBeGreaterThan(0);
    for (const group of m.binding.introducedGroups) {
      expect(group.allActuallyDisplayed).toBe(true); expect(group.samePeopleContextRootsAndDirection).toBe(true);
      expect(group.compatibleDisplayedSubsetOnly).toBe(true);
      for (const ref of group.materialIds) expect(byId.get(ref)!.address < m.address).toBe(true);
    }
  }
});
it("counts topic/role/index reuse separately from independent editorial meanings", () => {
  expect(new Set(materials.map(m => m.coreMeaning)).size).toBe(36);
  expect(new Set(materials.map(m => m.readerQuestion)).size).toBe(36);
  expect(new Set(materials.map(m => m.positive)).size).toBe(36);
  expect(new Set(materials.map(m => m.risk)).size).toBe(36);
  expect(new Set(materials.map(m => m.twist)).size).toBe(36);
  expect(new Set(concepts.map(c => c.topic))).toEqual(new Set(Array.from({ length: 26 }, (_, i) => i + 1)));
  expect(roles.every(r => !r.independentFact)).toBe(true);
  expect(new Set(all.map(r => r.id)).size).toBe(all.length);
});
it.each(directions)("$direction $materialAddress preserves the recipient viewpoint and does not force asymmetric meaning", r => {
  const ab = r.direction === "A_TO_B";
  expect(r.subject).toBe(ab ? "A" : "B"); expect(r.recipient).toBe(ab ? "B" : "A");
  expect(r.tenGodViewer).toBe(ab ? "B.dayMaster" : "A.dayMaster");
  expect(r.tenGodTarget).toBe(ab ? "A.dayMaster" : "B.dayMaster");
  expect(r.noForcedDifference).toBe(true); expect(r.actualEffect).toBe("UNKNOWN");
});
it.each(gods)("$god keeps existing effects as definitions, not observed friendship outcomes", r => {
  expect(r.originalEffect).toBe(godEffects[r.god]); expect(r.originalLocator.pointer).toBe("/" + r.god);
  expect(r.originalLocator.recordSha256).toBe(sha(JSON.stringify(godEffects[r.god])));
  expect(r.definitionIsObservedEffect).toBe(false); expect(r.noForcedDifference).toBe(true);
});
const profiles = new Map([...new Set(traits.map(r => r.originalState.type as string))].map(type => {
  const p = buildMbtiSemanticProfile(type); expect(p.ok).toBe(true); return [type, p.ok ? p.value : null] as const;
}));
it.each(traits)("$sourceId preserves primary trait content, source state, annotations and projection", r => {
  expect(pointer(mbti(r.locator.file), r.locator.pointer!)).toEqual(r.originalState.raw);
  expect(sha(JSON.stringify(r.originalState.raw))).toBe(r.locator.recordSha256);
  expect(sha(readFileSync(r.locator.file))).toBe(r.locator.fileSha256);
  const type = r.originalState.type as string, p = profiles.get(type)!;
  const node = p.sourceNodes.find(n => n.sourcePath === r.locator.pointer + "/plainKo");
  expect(r.originalState.node).toEqual(node ? { id: node.id, classification: node.classification, sourceDomain: node.sourceDomain, sourcePath: node.sourcePath } : null);
  expect(r.originalState.annotations).toEqual(p.annotations.filter(a => a.sourceNodeId === node?.id));
  const allowed: readonly string[] = RELATIONSHIP_DOMAINS.filter(d => d !== "LOVE" && d !== "MARRIAGE");
  expect(r.originalState.currentProjectionAllowed).toBe(!!node && node.classification === "SCORING_SEMANTIC" && allowed.includes(node.sourceDomain!));
  if (node?.sourceDomain === "CHILDREN") expect(r.originalState.currentProjectionAllowed).toBe(false);
});
it.each(lenses)("$owner $type uses only its entered type and never receives the other person's traits", r => {
  expect(r.questions).toHaveLength(3); expect(r.sources).toHaveLength(3);
  for (const q of r.questions) expect(traits.some(t => t.sourceId === q.sourceId && t.originalState.type === r.type && t.originalState.sourceCoverage === q.sourceCoverage)).toBe(true);
  expect(r.otherPersonCannotSubstitute).toBe(true); expect(r.conditionalQuestionNotTypeFact).toBe(true);
});
it("audits every type and directed Pair while retaining direct/inferred and unverified lineage", () => {
  expect(traits).toHaveLength(1213); expect(lenses).toHaveLength(32); expect(pairs).toHaveLength(256);
  const records = pairs.map(r => r.originalState.sourceRecord as { sourceCoverage: string });
  expect(records.filter(r => r.sourceCoverage === "direct")).toHaveLength(158);
  expect(records.filter(r => r.sourceCoverage === "inferred")).toHaveLength(98);
  expect(new Set(pairs.map(r => r.id)).size).toBe(256);
  for (const r of pairs) expect(r.originalState.relationNameReview).toMatchObject({ mappingStatus: "not_established", approvedForCustomer: false });
});
it.each(pairs)("$sourceId retains the two actual directed primary records", r => {
  type Ref = { file: string; pointer: string; sourceCoverage: string };
  for (const ref of [r.originalState.sourceRecord, r.originalState.reverseSourceRecord] as Ref[]) {
    expect(ref).toBeTruthy(); const original = pointer(mbti(ref.file), ref.pointer) as { sourceCoverage: string };
    expect(original.sourceCoverage).toBe(ref.sourceCoverage);
  }
});
it("keeps 34 supported canonical memberships separate from 30 unsupported definitions", () => {
  expect(canonical).toHaveLength(64);
  expect(canonical.filter(r => ["yukhap", "samhap", "banhap", "chung", "hae"].includes(r.originalState.relation as string))).toHaveLength(34);
  expect(canonical.filter(r => ["stem_hap", "hyeong", "pa", "wonjin"].includes(r.originalState.relation as string))).toHaveLength(30);
  expect(fusion).toHaveLength(164); expect(facets).toHaveLength(109);
  for (const m of materials.filter(m => m.address === "CH09.P2")) expect(m.binding.introducedGroups.flatMap(g => g.materialIds)).toEqual([materials.find(m => m.address === "CH01.P2")!.id]);
});
it.each(repairs)("$key links an actual problem to different recovery information without demanding forgiveness", r => {
  expect(r.frictionAddress.startsWith("CH07.")).toBe(true);
  expect(materials.some(m => m.address === r.frictionAddress)).toBe(true);
  for (const p of r.repairAddresses) expect(materials.some(m => m.address === p && m.mode === "REPAIR")).toBe(true);
  expect(r.firstQuestion).not.toBe(r.hypotheticalTrigger); expect(r.agreement).not.toBe(r.recheck);
  expect(r.personAAction).not.toBe(r.personBAction); expect(r.assumesActualConflict).toBe(false);
  expect(r.requiresForgiveness).toBe(false); expect(r.stopCondition.length).toBeGreaterThan(10);
});
it("distinguishes all six previous categories and does not copy their meanings or scenes by replacing roles", () => {
  expect(differences).toHaveLength(6);
  type Old = { category: string; retained: unknown; file: string; index: number; exportName: string; recordSha256: string };
  const old = json<Old[]>("inherited-six-category-audit.json");
  expect(old).toHaveLength(8799);
  const normalize = (s: string) => s.replace(/사업 파트너|상사|팀원|부하|관리자|부모|자녀|배우자|연인|동료|직장|친구|우정|\bA\b|\bB\b/g, "PERSON").replace(/\s/g, "");
  const oldMaterials = ["love", "marriage", "parent-child", "coworker", "manager-report", "business-partner"].flatMap(c => Array.from({ length: 9 }, (_, i) => JSON.parse(readFileSync(`docs/validation/v4-compatibility-${c}-product-knowledge-01/chapter${String(i + 1).padStart(2, "0")}Materials.json`, "utf8")) as { coreMeaning: string; fictionalScene: { text: string } }[]).flat());
  expect(oldMaterials).toHaveLength(676);
  for (const m of materials) {
    expect(oldMaterials.some(o => normalize(o.coreMeaning) === normalize(m.coreMeaning))).toBe(false);
    expect(oldMaterials.some(o => normalize(o.fictionalScene.text) === normalize(m.scene.text))).toBe(false);
  }
});
it("preserves all base files including the Vercel trace fix and every inherited research DB", () => {
  const locked = json<Record<string, string>>("existing-files-preservation.json"); expect(Object.keys(locked)).toHaveLength(3537);
  for (const [file, hash] of Object.entries(locked)) expect(sha(readFileSync(file)), file).toBe(hash);
});
function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]); }
it("has static type-only data and no imports or registration in existing runtime source", () => {
  const dir = resolve("src/lib/report-knowledge/compatibility-friendship-research");
  for (const file of walk("src")) {
    const text = readFileSync(file, "utf8");
    if (file.startsWith(dir)) expect(text, file).not.toMatch(/import\s+(?!type)|export\s+(?:function|default)|new Map|new Set|fetch\(/);
    else expect(text, file).not.toContain("compatibility-friendship-research");
  }
});
it("separates checked literature scope from editorial examples and held claims", () => {
  expect(sources).toHaveLength(7);
  expect(sources.filter(s => s.access === "full_paper_sections")).toHaveLength(3);
  expect(sources.filter(s => s.access === "abstract_only")).toHaveLength(3);
  expect(sources.filter(s => s.access === "author_commentary")).toHaveLength(1);
  expect(rejected.some(r => r.status === "held")).toBe(true);
  expect(life.every(r => r.actualState === "UNKNOWN" && !r.inevitableSequence)).toBe(true);
  expect(design.every(r => r.failure === "withhold" && !r.newEngineImplemented)).toBe(true);
});

it("keeps the machine coverage manifest consistent and connects every conflict paragraph to recovery", () => {
  const manifest = json<{ chapterCount: number; paragraphCount: number; sentenceRoleCount: number;
    addresses: string[]; roleAddresses: string[]; specialistStructures: { frictionRepairPairs: number };
    editorialCandidateCounts: { conditionalIndependentQuestions: number; displayedMeaningRecall: number } }>("coverage-manifest.json");
  expect(manifest.chapterCount).toBe(chapters.length); expect(manifest.paragraphCount).toBe(materials.length);
  expect(manifest.sentenceRoleCount).toBe(roles.length); expect(manifest.addresses).toEqual(materials.map(m => m.address));
  expect(manifest.roleAddresses).toEqual(roles.map(r => r.address));
  expect(manifest.editorialCandidateCounts.conditionalIndependentQuestions).toBe(materials.filter(m => m.mode !== "RECALL").length);
  expect(manifest.editorialCandidateCounts.displayedMeaningRecall).toBe(materials.filter(m => m.mode === "RECALL").length);
  expect(manifest.specialistStructures.frictionRepairPairs).toBe(repairs.length);
  expect(new Set(repairs.map(r => r.frictionAddress))).toEqual(new Set(["CH07.P1", "CH07.P2", "CH07.P3", "CH07.P4"]));
});
