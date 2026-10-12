import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAJU_FOUNDATION_KNOWLEDGE } from "@/lib/report-knowledge/sajuFoundationKnowledge";
import { analyzeRelations } from "@/lib/saju/relations";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, STEM_COMBINATIONS, BRANCH_COMBINATIONS, BRANCH_CLASHES, STEM_ELEMENT, STEM_YIN_YANG, BRANCH_MAIN_ELEMENT, BRANCH_YIN_YANG, HIDDEN_STEMS } from "@/lib/saju/constants";
import type { HeavenlyStem, EarthlyBranch } from "@/lib/saju/types";
import { createBranchRef, detectCrossBranchRelations } from "@/lib/report-knowledge/compatibilityRelationRules";
import { getBranchPairRelations, getAnnualBranchInteractions } from "@/lib/report-knowledge/annualFortuneYearRules";
import { relationPairs, normalizeBranch } from "@/lib/report-knowledge/sajuFeatureExtractionRules";
import type { RelationProfile, RelationCombination, RelationApplication, RelationKey, RelationDomain, RelationSource } from "@/lib/report-knowledge/relation-research/relationResearchTypes";
import { RELATION_BOUNDARIES } from "@/lib/report-knowledge/relation-research/relationBoundaries";
import { RELATION_REJECTED } from "@/lib/report-knowledge/relation-research/relationRejected";
import { RELATION_SCOPES } from "@/lib/report-knowledge/relation-research/relationScopes";
import { RELATION_RESEARCH_SOURCES } from "@/lib/report-knowledge/relation-research/sajuFoundationRelationSources";
import { RELATION_PROFILE_STEM_HAP } from "@/lib/report-knowledge/relation-research/relationProfileStemHap";
import { RELATION_PROFILE_YUKHAP } from "@/lib/report-knowledge/relation-research/relationProfileYukhap";
import { RELATION_PROFILE_CHUNG } from "@/lib/report-knowledge/relation-research/relationProfileChung";
import { RELATION_PROFILE_SAMHAP } from "@/lib/report-knowledge/relation-research/relationProfileSamhap";
import { RELATION_PROFILE_HYEONG } from "@/lib/report-knowledge/relation-research/relationProfileHyeong";
import { RELATION_PROFILE_HAE } from "@/lib/report-knowledge/relation-research/relationProfileHae";
import { RELATION_PROFILE_BANHAP } from "@/lib/report-knowledge/relation-research/relationProfileBanhap";
import { RELATION_PROFILE_PA } from "@/lib/report-knowledge/relation-research/relationProfilePa";
import { RELATION_PROFILE_WONJIN } from "@/lib/report-knowledge/relation-research/relationProfileWonjin";
import { RELATION_COMBINATIONS_STEM_HAP } from "@/lib/report-knowledge/relation-research/relationCombinationsStemHap";
import { RELATION_COMBINATIONS_YUKHAP } from "@/lib/report-knowledge/relation-research/relationCombinationsYukhap";
import { RELATION_COMBINATIONS_CHUNG } from "@/lib/report-knowledge/relation-research/relationCombinationsChung";
import { RELATION_COMBINATIONS_SAMHAP } from "@/lib/report-knowledge/relation-research/relationCombinationsSamhap";
import { RELATION_COMBINATIONS_HYEONG } from "@/lib/report-knowledge/relation-research/relationCombinationsHyeong";
import { RELATION_COMBINATIONS_HAE } from "@/lib/report-knowledge/relation-research/relationCombinationsHae";
import { RELATION_COMBINATIONS_BANHAP } from "@/lib/report-knowledge/relation-research/relationCombinationsBanhap";
import { RELATION_COMBINATIONS_PA } from "@/lib/report-knowledge/relation-research/relationCombinationsPa";
import { RELATION_COMBINATIONS_WONJIN } from "@/lib/report-knowledge/relation-research/relationCombinationsWonjin";
import { RELATION_APPLICATIONS_STEM_HAP } from "@/lib/report-knowledge/relation-research/relationApplicationsStemHap";
import { RELATION_APPLICATIONS_YUKHAP } from "@/lib/report-knowledge/relation-research/relationApplicationsYukhap";
import { RELATION_APPLICATIONS_CHUNG } from "@/lib/report-knowledge/relation-research/relationApplicationsChung";
import { RELATION_APPLICATIONS_SAMHAP } from "@/lib/report-knowledge/relation-research/relationApplicationsSamhap";
import { RELATION_APPLICATIONS_HYEONG } from "@/lib/report-knowledge/relation-research/relationApplicationsHyeong";
import { RELATION_APPLICATIONS_HAE } from "@/lib/report-knowledge/relation-research/relationApplicationsHae";
import { RELATION_APPLICATIONS_BANHAP } from "@/lib/report-knowledge/relation-research/relationApplicationsBanhap";
import { RELATION_APPLICATIONS_PA } from "@/lib/report-knowledge/relation-research/relationApplicationsPa";
import { RELATION_APPLICATIONS_WONJIN } from "@/lib/report-knowledge/relation-research/relationApplicationsWonjin";
const profiles: readonly RelationProfile[] = [...RELATION_PROFILE_STEM_HAP, ...RELATION_PROFILE_YUKHAP, ...RELATION_PROFILE_CHUNG, ...RELATION_PROFILE_SAMHAP, ...RELATION_PROFILE_HYEONG, ...RELATION_PROFILE_HAE, ...RELATION_PROFILE_BANHAP, ...RELATION_PROFILE_PA, ...RELATION_PROFILE_WONJIN];
const combinations: readonly RelationCombination[] = [...RELATION_COMBINATIONS_STEM_HAP, ...RELATION_COMBINATIONS_YUKHAP, ...RELATION_COMBINATIONS_CHUNG, ...RELATION_COMBINATIONS_SAMHAP, ...RELATION_COMBINATIONS_HYEONG, ...RELATION_COMBINATIONS_HAE, ...RELATION_COMBINATIONS_BANHAP, ...RELATION_COMBINATIONS_PA, ...RELATION_COMBINATIONS_WONJIN];
const applications: readonly RelationApplication[] = [...RELATION_APPLICATIONS_STEM_HAP, ...RELATION_APPLICATIONS_YUKHAP, ...RELATION_APPLICATIONS_CHUNG, ...RELATION_APPLICATIONS_SAMHAP, ...RELATION_APPLICATIONS_HYEONG, ...RELATION_APPLICATIONS_HAE, ...RELATION_APPLICATIONS_BANHAP, ...RELATION_APPLICATIONS_PA, ...RELATION_APPLICATIONS_WONJIN];

const sources: readonly RelationSource[] = RELATION_RESEARCH_SOURCES;
const domains: readonly RelationDomain[] = ["personality", "career", "money", "study", "love", "marriage", "family", "relationships"];
const doc = "docs/validation/v4-saju-relation-knowledge-01";
const json = <T,>(file: string): T => JSON.parse(readFileSync(resolve(file), "utf8"));
const hash = (file: string) => createHash("sha256").update(readFileSync(resolve(file))).digest("hex");
const canonical = (members: readonly string[]) => [...members].sort().join("");
const byKey = (key: RelationKey) => combinations.filter(c => c.relation === key);
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(resolve(dir, e.name)) : [resolve(dir, e.name)]);
}
const branchLabels = { yukhap: "육합", chung: "충", hyeong: "형", hae: "해", pa: "파", banhap: "반합" } as const;
const crossLabels = { yukhap: "six_harmony", chung: "clash", hae: "harm", banhap: "half_harmony" } as const;
const ref = (person: "personA" | "personB", branch: string, position: "year" | "month" | "day" = "day") => createBranchRef({ person, personLabel: person, position, pillar: `甲${branch}` })!;

describe("offline relation knowledge research", () => {
  it("preserves all nine canonical identities, definitions and aliases", () => {
    const old = SAJU_FOUNDATION_KNOWLEDGE.filter(p => p.category === "relation");
    expect(profiles).toHaveLength(9);
    expect(profiles.map(p => p.targetId).sort()).toEqual(old.map(p => p.id).sort());
    for (const p of profiles) {
      const before = old.find(x => x.id === p.targetId)!;
      expect(p.existingDefinition).toBe(before.definition.text);
      expect(p.label).toBe(before.labelKo);
      for (const alias of before.aliases) expect(p.aliases).toContain(alias);
      expect(new Set(p.aliases).size).toBe(p.aliases.length);
      expect(p.hanja).not.toBe("");
      for (const d of p.distinctions) expect(profiles.some(x => x.key === d.other && x.key !== p.key)).toBe(true);
    }
  });
  it("has unique research IDs, separate from calculation evidence", () => {
    const records = [...profiles, ...combinations, ...applications, ...RELATION_BOUNDARIES, ...RELATION_REJECTED];
    expect(new Set(records.map(r => r.id)).size).toBe(records.length);
    for (const r of records) {
      expect(r.id).toMatch(/^rr:/); expect(r.runtimeEvidenceIds).toEqual([]);
      expect(r.connectedToRuntime).toBe(false); expect(r.approvedForCustomer).toBe(false);
      if ("producerScopeRefs" in r) {
        const key = "key" in r ? r.key : r.relation;
        const historicalOnly = "producerMembership" in r && r.producerMembership === "historical_group_only";
        expect(r.producerScopeRefs).toEqual(historicalOnly ? [] : RELATION_SCOPES.filter(s => (s.supported as readonly RelationKey[]).includes(key)).map(s => s.id));
        expect([...r.producerScopeRefs, ...r.unsupportedProducerScopeRefs].sort()).toEqual(RELATION_SCOPES.map(s => s.id).sort());
      }
    }
  });
  it("covers every actual table combination and two historical full punishment groups separately", () => {
    expect(Object.fromEntries(profiles.map(p => [p.key, byKey(p.key).length]))).toEqual({ stem_hap: 5, yukhap: 6, chung: 6, samhap: 4, hyeong: 13, hae: 6, banhap: 12, pa: 6, wonjin: 6 });
    expect(combinations.filter(c => c.producerMembership === "existing_table")).toHaveLength(62);
    expect(combinations.filter(c => c.producerMembership === "historical_group_only").map(c => c.members.join("")).sort()).toEqual(["丑戌未", "寅巳申"].sort());
    for (const key of profiles.map(p => p.key)) expect(new Set(byKey(key).map(c => canonical(c.members))).size).toBe(byKey(key).length);
    for (const [key, pairs] of [["stem_hap", STEM_COMBINATIONS], ["yukhap", BRANCH_COMBINATIONS], ["chung", BRANCH_CLASHES]] as const) expect(byKey(key).map(c => canonical(c.members)).sort()).toEqual(pairs.map(canonical).sort());
    expect(byKey("wonjin").map(c => canonical(c.members.map(normalizeBranch) as string[])).sort()).toEqual(relationPairs.wonjin.map(canonical).sort());
  });
  it.each(combinations)("keeps actual composition and non-predictive formation for $id", c => {
    expect(c.participants.map(x => x.symbol)).toEqual(c.members);
    expect(c.meaningClass).toBe("C_CONDITIONAL_RESEARCH"); expect(c.modern.class).toBe("D_MODERN_APPLICATION");
    for (const p of c.participants) {
      if (c.relation === "stem_hap") {
        expect(p.element).toBe(STEM_ELEMENT[p.symbol as HeavenlyStem]);
        expect(p.yinYang).toBe(STEM_YIN_YANG[p.symbol as HeavenlyStem].toLowerCase()); expect(p.hiddenStems).toEqual([]);
      } else {
        expect(p.element).toBe(BRANCH_MAIN_ELEMENT[p.symbol as EarthlyBranch]);
        expect(p.yinYang).toBe(BRANCH_YIN_YANG[p.symbol as EarthlyBranch].toLowerCase());
        expect(p.hiddenStems).toEqual(HIDDEN_STEMS[p.symbol as EarthlyBranch].map(s => s.stem));
      }
    }
    expect(c.exclusions.length).toBeGreaterThan(0); expect(c.uncertainties.length).toBeGreaterThan(0);
    for (const text of [c.formation, c.distinction, c.positive, c.risk, c.reversal, c.modern.condition, c.modern.action]) expect(text.trim()).not.toBe("");
    expect(c.overlaps).toEqual(combinations.filter(d => d.relation !== c.relation && canonical(d.members) === canonical(c.members)).map(d => d.id));
  });
  it("matches every ordered branch pair to the existing period producer, including unsupported negatives", () => {
    for (const left of EARTHLY_BRANCHES) for (const right of EARTHLY_BRANCHES) {
      const actual = getBranchPairRelations(left, right);
      const expected = Object.entries(branchLabels).filter(([key]) => byKey(key as RelationKey).some(c => canonical(c.members) === canonical([left, right]))).map(([, label]) => label).sort();
      expect(actual.map(x => x.type).sort(), left + right).toEqual(expected);
      expect(actual.every(x => canonical(x.branches) === canonical([left, right]))).toBe(true);
    }
  });
  it("matches all native stem pairs without inventing transformation or hidden-stem matches", () => {
    for (const left of HEAVENLY_STEMS) for (const right of HEAVENLY_STEMS) {
      const actual = analyzeRelations({ year: { stem: left, branch: "子" }, month: { stem: right, branch: "丑" }, day: { stem: left, branch: "辰" } });
      const pair = actual.stemCombinations.filter(r => r.positions.join(":") === "year:month");
      expect(pair.length > 0, left + right).toBe(byKey("stem_hap").some(c => canonical(c.members) === canonical([left, right])));
      expect(Object.keys(actual).sort()).toEqual(["branchClashes", "branchCombinations", "stemCombinations"].sort());
    }
  });
  it("matches all cross-person pair kinds while keeping unsupported kinds absent", () => {
    for (const left of EARTHLY_BRANCHES) for (const right of EARTHLY_BRANCHES) {
      const actual = detectCrossBranchRelations({ personARefs: [ref("personA", left)], personBRefs: [ref("personB", right)] });
      const expected = Object.entries(crossLabels).filter(([key]) => byKey(key as RelationKey).some(c => canonical(c.members) === canonical([left, right]))).map(([, label]) => label).sort();
      expect(actual.map(r => r.kind).sort(), left + right).toEqual(expected);
      for (const r of actual) expect(new Set(r.refs.map(x => x.person)).size).toBe(2);
    }
  });
  it("requires the actual third member for all four trines and keeps partial groups partial", () => {
    for (const c of byKey("samhap")) {
      const [annual, first, second] = c.members as [EarthlyBranch, EarthlyBranch, EarthlyBranch];
      const full = getAnnualBranchInteractions({ annualBranch: annual, natalBranches: [first, second] });
      expect(full.some(r => r.type === "삼합" && canonical(r.branches) === canonical(c.members))).toBe(true);
      const partial = getAnnualBranchInteractions({ annualBranch: annual, natalBranches: [first] });
      expect(partial.some(r => r.type === "삼합")).toBe(false); expect(partial.some(r => r.type === "반합")).toBe(true);
      const cross = detectCrossBranchRelations({ personARefs: [ref("personA", annual)], personBRefs: [ref("personB", first, "year"), ref("personB", second)] });
      expect(cross.some(r => r.kind === "three_harmony" && r.refs.length === 3)).toBe(true);
    }
  });
  it("documents rather than changes the first-ref cross-person limitation", () => {
    const a = [ref("personA", "申", "year"), ref("personA", "子", "month"), ref("personA", "辰")];
    const b = [ref("personB", "子")];
    expect(detectCrossBranchRelations({ personARefs: a, personBRefs: b }).some(r => r.kind === "three_harmony")).toBe(false);
    expect(RELATION_SCOPES.find(s => s.id === "cross_person")?.multiplicity).toContain("첫 ref");
  });
  it("does not fabricate an unknown hour, third branch, or target provenance", () => {
    const native = analyzeRelations({ year: { stem: "甲", branch: "子" }, month: { stem: "丙", branch: "辰" }, day: { stem: "庚", branch: "卯" } });
    expect([...native.stemCombinations, ...native.branchCombinations, ...native.branchClashes].flatMap(r => r.positions)).not.toContain("hour");
    const mixed = getAnnualBranchInteractions({ annualBranch: "申", natalBranches: ["子", "辰", "卯", "酉", "亥"] });
    expect(mixed.some(r => r.type === "삼합")).toBe(true);
    const scopes = RELATION_SCOPES.find(s => s.id === "natal_major")!;
    expect(scopes.producers.some(p => p.behavior.includes("혼합"))).toBe(true);
    expect(scopes.handoff.join(" ")).toContain("위치");
  });
  it("retains all previous 72 handoff identities with both modern research and direct-claim boundaries", () => {
    type Cell = { id: string; targetId: string; domain: string; after: string; approvedApplication: boolean; researchRefs: string[] };
    const before = json<{ cells: Cell[] }>("docs/validation/v4-foundation-saju-deep-knowledge-03/coverage-manifest.json").cells.filter(c => c.targetId.includes(":relation:"));
    const now = json<{ cells: Cell[]; approvedCustomerApplications: number }>(doc + "/coverage-manifest.json");
    expect(before).toHaveLength(72); expect(now.cells.map(c => c.id).sort()).toEqual(before.map(c => c.id).sort());
    expect(applications).toHaveLength(72); expect(RELATION_BOUNDARIES).toHaveLength(72); expect(now.approvedCustomerApplications).toBe(0);
    for (const p of profiles) {
      expect(applications.filter(a => a.targetId === p.targetId).map(a => a.domain).sort()).toEqual([...domains].sort());
      for (const domain of domains) {
        const a = applications.find(a => a.targetId === p.targetId && a.domain === domain)!;
        const b = RELATION_BOUNDARIES.find(b => b.relation === p.key && b.domain === domain)!;
        const c = now.cells.find(c => c.targetId === p.targetId && c.domain === domain)!;
        expect(c.researchRefs).toEqual([a.id, b.id]); expect(c.approvedApplication).toBe(false);
        expect(b.class).toBe("E_UNVERIFIED"); expect(b.needed).not.toBe(""); expect(b.prohibited).not.toBe("");
      }
    }
  });
  it.each(applications)("keeps two different conditional domain angles and explicit limits for $id", a => {
    const p = profiles.find(p => p.targetId === a.targetId)!;
    expect(a.formationRef).toBe(p.id + "#formation"); expect(a.structuralMeaningRef).toBe(p.id + "#inference");
    expect(a.class).toBe("D_MODERN_APPLICATION"); expect(a.sourceRefs.every(r => r.sourceId === "authored")).toBe(true);
    expect(a.readerQuestion).not.toBe(a.secondLens.question);
    expect(a.secondLens.conditionalAction).not.toBe(a.judgment);
    for (const x of [a.readerQuestion, a.positive, a.risk, a.excess, a.unexpected, a.conditionalScene, a.judgment, a.additionalEvidence, a.doNotApply, a.contrast, ...Object.values(a.secondLens)]) expect(x.trim()).not.toBe("");
    expect([a.positive, a.unexpected, a.conditionalScene].join(" ")).not.toMatch(/반드시|무조건|틀림없이|보장(?:된다|합니다)|이미.{0,20}겪/);
  });
  it("does not promote modern sources, academic abstracts or authored scenes into historical facts", () => {
    expect(sources.filter(s => s.kind === "historical_transcription")).toHaveLength(4);
    expect(sources.find(s => s.id === "kci")?.edition).toContain("초록");
    for (const c of [...profiles.map(p => p.traditional), ...combinations.map(c => c.traditional)]) {
      for (const r of c.sourceRefs) {
        const s = sources.find(s => s.id === r.sourceId); expect(s).toBeDefined(); expect(r.locator.trim()).not.toBe("");
        if (c.class === "A_HISTORICAL_TEXT") expect(s?.kind).toBe("historical_transcription");
      }
    }
    for (const key of ["pa", "wonjin", "banhap"] as const) expect(profiles.find(p => p.key === key)?.traditional.class).toBe("E_UNVERIFIED");
    const access = json<{ id: string; status: number; sha256: string; bytes: number }[]>(doc + "/source-access.json");
    expect(access).toHaveLength(8);
    for (const a of access) { expect(a.status).toBe(200); expect(a.sha256).toMatch(/^[a-f0-9]{64}$/); expect(a.bytes).toBeGreaterThan(1000); expect(sources.some(s => s.id === a.id)).toBe(true); }
  });
  it("separates actual producer support for all six scopes", () => {
    const expected = {
      natal: ["stem_hap", "yukhap", "chung", "wonjin"], cross_person: ["yukhap", "samhap", "banhap", "chung", "hae"],
      natal_major: ["yukhap", "samhap", "banhap", "chung", "hyeong", "hae", "pa"], natal_annual: ["yukhap", "samhap", "banhap", "chung", "hyeong", "hae", "pa"],
      natal_month: ["yukhap", "samhap", "banhap", "chung", "hyeong", "hae", "pa", "wonjin"], between_periods: ["yukhap", "banhap", "chung", "hyeong", "hae", "pa"],
    };
    expect(RELATION_SCOPES).toHaveLength(6);
    for (const scope of RELATION_SCOPES) {
      expect([...scope.supported].sort()).toEqual(expected[scope.id].sort());
      expect([...scope.supported, ...scope.unsupported].sort()).toEqual(profiles.map(p => p.key).sort());
      expect(scope.timeBoundary).not.toBe(""); for (const p of scope.producers) expect(existsSync(resolve(p.path)), p.path).toBe(true);
    }
    expect(RELATION_SCOPES.find(s => s.id === "natal")?.producers.some(p => p.symbol.includes("WONJIN_MATCHED_PAIR_NOT_EXPOSED"))).toBe(true);
  });
  it("keeps conflicts, alternate inventories and rejected claims separate", () => {
    const conflicts = json<{ autoMerged: boolean; items: { id: string; sourceIds: string[]; approvalRestriction: string }[] }>(doc + "/conflicts.json");
    expect(conflicts.autoMerged).toBe(false); expect(conflicts.items).toHaveLength(15);
    for (const c of conflicts.items) { expect(c.approvalRestriction).not.toBe(""); for (const id of c.sourceIds) expect(sources.some(s => s.id === id)).toBe(true); }
    expect(RELATION_REJECTED).toHaveLength(12); expect(new Set(RELATION_REJECTED.map(x => x.relation)).size).toBe(9);
    const variants = json<{ variants: { id: string; combinations: string[] }[] }>(doc + "/source-variant-inventories.json").variants;
    expect(variants.find(v => v.id === "repo:half12")?.combinations).toHaveLength(12);
    expect(variants.find(v => v.id === "modern:half8-with-king")?.combinations).toHaveLength(8);
    expect(variants.find(v => v.id === "modern:half4-without-king")?.combinations).toEqual(["申辰", "亥未", "寅戌", "巳丑"]);
  });
  it("audits meaning rather than counting repeated safety or translated scenes as new facts", () => {
    const audit = json<{ profileComparisons: unknown[]; limitations: string[]; sharedConceptsNotNewFacts: string[] }>(doc + "/semantic-audit.json");
    expect(audit.profileComparisons).toHaveLength(9); expect(audit.limitations.join(" ")).toContain("경험적 검증"); expect(audit.sharedConceptsNotNewFacts).toHaveLength(4);
    for (const field of ["readerQuestion", "contrast"] as const) expect(new Set(applications.map(a => a[field])).size).toBe(72);
  });
  it("preserves all 929 prior source files byte for byte", () => {
    const before = json<{ files: Record<string, string> }>(doc + "/preservation-manifest.json");
    expect(Object.keys(before.files)).toHaveLength(929);
    for (const [path, digest] of Object.entries(before.files)) expect(hash(path), path).toBe(digest);
  });
  it("has no runtime consumer, barrel, lookup, environment access, or executable generation", () => {
    const path = resolve("src/lib/report-knowledge/relation-research");
    for (const f of files(resolve("src")).filter(f => !f.startsWith(path))) expect(readFileSync(f, "utf8"), f).not.toMatch(/relation-research|RELATION_(?:PROFILE|COMBINATIONS|APPLICATIONS|BOUNDARIES|REJECTED|RESEARCH_SOURCES|SCOPES)/);
    for (const f of files(path)) expect(readFileSync(f, "utf8"), f).not.toMatch(/import\s+(?!type\b)|export\s+(?:\*|\{)|\b(?:fetch|require|calculateSaju|generateV4ShadowReport)\s*\(|process\.env|Date\.now|Math\.random|\bfunction\s/);
  });
});
