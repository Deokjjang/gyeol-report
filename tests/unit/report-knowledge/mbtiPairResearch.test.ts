import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MBTI_TYPES } from "@/lib/report-knowledge/mbtiKnowledgeTypes";
import { getMbtiRelationshipPair } from "@/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import type { MbtiPairResearch } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairResearchTypes";
import { MBTI_PAIR_RESEARCH_SOURCES, MBTI_PAIR_RESEARCH_POLICY } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairResearchSources";
import preservation from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/source-preservation.json";
import originals from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/original-json-preservation.json";
import individuals from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/individual-research-preservation.json";
import inventory from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/source-pair-inventory.json";
import hints from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/relationship-hints-preservation.json";
import comparisons from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/directional-comparison.json";
import names from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/relation-name-review.json";
import joint from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/joint-authored-review.json";
import coverage from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/coverage-manifest.json";
import duplication from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/duplication-audit.json";
import rejected from "../../../docs/validation/v4-mbti-pair-relation-knowledge-01/rejected-interpretations.json";
import { MBTI_PAIR_RESEARCH_INTJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairINTJ";
import { MBTI_PAIR_RESEARCH_INTP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairINTP";
import { MBTI_PAIR_RESEARCH_ENTJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairENTJ";
import { MBTI_PAIR_RESEARCH_ENTP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairENTP";
import { MBTI_PAIR_RESEARCH_INFJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairINFJ";
import { MBTI_PAIR_RESEARCH_INFP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairINFP";
import { MBTI_PAIR_RESEARCH_ENFJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairENFJ";
import { MBTI_PAIR_RESEARCH_ENFP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairENFP";
import { MBTI_PAIR_RESEARCH_ISTJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairISTJ";
import { MBTI_PAIR_RESEARCH_ISFJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairISFJ";
import { MBTI_PAIR_RESEARCH_ESTJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairESTJ";
import { MBTI_PAIR_RESEARCH_ESFJ } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairESFJ";
import { MBTI_PAIR_RESEARCH_ISTP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairISTP";
import { MBTI_PAIR_RESEARCH_ISFP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairISFP";
import { MBTI_PAIR_RESEARCH_ESTP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairESTP";
import { MBTI_PAIR_RESEARCH_ESFP } from "@/lib/report-knowledge/mbti-pair-research/mbtiPairESFP";
const materials: readonly MbtiPairResearch[] = [...MBTI_PAIR_RESEARCH_INTJ, ...MBTI_PAIR_RESEARCH_INTP, ...MBTI_PAIR_RESEARCH_ENTJ, ...MBTI_PAIR_RESEARCH_ENTP, ...MBTI_PAIR_RESEARCH_INFJ, ...MBTI_PAIR_RESEARCH_INFP, ...MBTI_PAIR_RESEARCH_ENFJ, ...MBTI_PAIR_RESEARCH_ENFP, ...MBTI_PAIR_RESEARCH_ISTJ, ...MBTI_PAIR_RESEARCH_ISFJ, ...MBTI_PAIR_RESEARCH_ESTJ, ...MBTI_PAIR_RESEARCH_ESFJ, ...MBTI_PAIR_RESEARCH_ISTP, ...MBTI_PAIR_RESEARCH_ISFP, ...MBTI_PAIR_RESEARCH_ESTP, ...MBTI_PAIR_RESEARCH_ESFP];
const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
function canonical(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  const obj = v as Record<string, unknown>;
  return "{" + Object.keys(obj).sort().map(k => JSON.stringify(k) + ":" + canonical(obj[k])).join(",") + "}";
}
const readJson = (type: string): unknown => JSON.parse(readFileSync(`docs/product/mbti/source/${type}.json`, "utf8").replace(/^\uFEFF/, ""));
function pointer(input: unknown, path: string): unknown {
  return path.split("/").slice(1).reduce<unknown>((v, key) => v !== null && typeof v === "object" ? (v as Record<string, unknown>)[key.replace(/~1/g, "/").replace(/~0/g, "~")] : undefined, input);
}
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(resolve(dir, d.name)) : [resolve(dir, d.name)]);
}
const byId = new Map(materials.map(m => [m.id, m]));
const sourceIds = new Set<string>(MBTI_PAIR_RESEARCH_SOURCES.map(s => s.id));

describe("offline MBTI directed pair research and preservation", () => {
  it("preserves all old runtime, source JSON and individual research bytes", () => {
    expect(Object.keys(preservation)).toHaveLength(995);
    expect(Object.keys(originals)).toHaveLength(16);
    expect(Object.keys(individuals)).toHaveLength(46);
    for (const files of [preservation, originals, individuals]) for (const [file, digest] of Object.entries(files)) expect(sha(readFileSync(file)), file).toBe(digest);
  });
  it("covers the exact Cartesian product, including self pairs and both directions", () => {
    expect(materials).toHaveLength(256); expect(byId.size).toBe(256);
    expect([...byId.keys()].sort()).toEqual(MBTI_TYPES.flatMap(a => MBTI_TYPES.map(b => `mpr:${a}:${b}`)).sort());
    expect(new Set(materials.map(m => m.jointReviewId)).size).toBe(136);
    expect(materials.filter(m => m.sourceType === m.targetType)).toHaveLength(16);
    expect(joint).toHaveLength(136); expect(coverage.cells).toHaveLength(256);
  });
  it("retains all 256 original records, every field pointer/hash and relationship hints", () => {
    for (const row of inventory) {
      const original = readJson(row.sourceType);
      expect(pointer(original, row.pointer)).toEqual(row.original);
      expect(sha(canonical(row.original))).toBe(row.sha256);
      for (const [field, ref] of Object.entries(row.fields)) {
        const v = pointer(original, ref.pointer);
        expect(v).toEqual((row.original as Record<string, unknown>)[field]); expect(sha(canonical(v))).toBe(ref.sha256);
      }
      const reverse = inventory.find(p => p.sourceType === row.targetType && p.targetType === row.sourceType)!;
      expect(row.reverse.sha256).toBe(reverse.sha256);
      const m = byId.get(row.id)!;
      expect(m.sourceRecord).toMatchObject({ file: row.file, pointer: row.pointer, sha256: row.sha256, sourceCoverage: row.original.sourceCoverage, label: row.original.label, sourceRelationName: row.original.sourceRelationName });
      expect(m.reverseSourceRecord).toMatchObject({ file: reverse.file, pointer: reverse.pointer, sha256: reverse.sha256 });
      expect(m.reverseSourceStatus).toBe("present");
    }
    for (const h of hints) {
      const original = readJson(h.type);
      expect(sha(canonical(pointer(original, h.pointer)))).toBe(h.sha256);
      expect(pointer(original, h.pointer + "/comfortableTypes")).toEqual(h.comfortableTypes);
      expect(pointer(original, h.pointer + "/challengingTypes")).toEqual(h.challengingTypes);
    }
  });
  it("reproduces the baseline counts without promoting inferred or correcting source names", () => {
    expect(materials.filter(m => m.sourceRecord.sourceCoverage === "direct")).toHaveLength(158);
    expect(materials.filter(m => m.sourceRecord.sourceCoverage === "inferred")).toHaveLength(98);
    expect(inventory.filter(m => m.labelMismatch)).toHaveLength(148);
    expect(comparisons.filter(m => m.sourceNameMismatch)).toHaveLength(144);
    expect(inventory.filter(m => m.sameReportLine)).toHaveLength(40);
    expect(inventory.filter(m => m.genericReportLine)).toHaveLength(72);
    for (const p of inventory.filter(m => m.genericReportLine || m.sameReportLine || m.original.sourceCoverage === "inferred")) {
      const m = byId.get(p.id)!;
      expect(m.provenance).toBe("two_trait_conditional_comparison");
      expect(m.existingSourceStatus).toBe("source_local_" + p.original.sourceCoverage);
      expect(m.fictionalScenes).toHaveLength(2); expect(m.counterexample.length).toBeGreaterThan(10);
    }
  });
  it.each(MBTI_TYPES)("resolves both people's real trait pointers for every %s direction", type => {
    const own = materials.filter(m => m.sourceType === type); expect(own).toHaveLength(16);
    for (const m of own) {
      expect(m.sourceTraitRefs).toHaveLength(12); expect(m.targetTraitRefs).toHaveLength(12);
      for (const [owner, refs] of [[m.sourceType, m.sourceTraitRefs], [m.targetType, m.targetTraitRefs]] as const) {
        expect(new Set(refs.map(r => r.domain)).size).toBe(6);
        for (const r of refs) {
          const actual = pointer(readJson(owner), r.pointer) as { id: string; sourceCoverage: string; plainKo: string };
          expect(r.type).toBe(owner); expect(r.file).toBe(`docs/product/mbti/source/${owner}.json`);
          expect(r.pointer).toMatch(new RegExp(`^/traits/${r.domain}/[0-9]+$`));
          expect(actual.id, m.id).toBe(r.traitId); expect(actual.sourceCoverage).toBe(r.sourceCoverage);
          expect(sha(actual.plainKo)).toBe(r.plainKoSha256);
        }
      }
    }
  });
  it.each(MBTI_TYPES)("preserves independently authored directional viewpoints for %s", type => {
    for (const m of materials.filter(m => m.sourceType === type)) {
      const reverse = byId.get(`mpr:${m.targetType}:${m.sourceType}`)!;
      expect(m.sharedGround).toBe(reverse.sharedGround); expect(m.difference).toBe(reverse.difference);
      expect(m.fictionalScenes).toEqual(reverse.fictionalScenes);
      if (m.sourceType !== m.targetType) {
        expect(m.directionalContribution).toBe(reverse.targetContribution);
        expect(m.friction.sourceIntentionCandidate).toBe(reverse.friction.targetIntentionCandidate);
        expect(m.friction.targetMayMisreadSource).toBe(reverse.friction.sourceMayMisreadTarget);
        expect(m.repair.sourceQuestion).toBe(reverse.repair.targetQuestion);
        expect([m.directionalContribution,m.friction.sourceIntentionCandidate,m.repair.sourceQuestion]).not.toEqual([reverse.directionalContribution,reverse.friction.sourceIntentionCandidate,reverse.repair.sourceQuestion]);
      } else {
        expect(m.difference).toMatch(/알 수 없|구분 불가|배정할 수 없|확인/);
        expect(m.sourceTraitRefs).toEqual(m.targetTraitRefs);
      }
    }
  });
  it("compares every original field in both directions and keeps unresolved genealogy explicit", () => {
    expect(names).toHaveLength(86);
    expect(names.map(n => n.name).sort()).toEqual([...new Set(inventory.map(p => p.original.sourceRelationName))].sort());
    for (const n of names) {
      expect(n.originalGenealogy).toBe("unverified"); expect(n.mbtiMapping).toBe("not_established");
      expect(n.aliasStatus).toBe("terminology_candidate_not_original_lineage");
      for (const ref of n.sourceRefs) expect(sourceIds.has(ref), ref).toBe(true);
      if (n.termFamily === "benefit" || n.termFamily === "supervision") expect(n.directionality).toBe("asymmetric_family_roles_unverified");
    }
    expect(names.find(n => n.name === "False Identical")?.termFamily).toBeNull();
    for (const c of comparisons) {
      const row = inventory.find(p => p.id === c.id)!;
      const reverse = inventory.find(p => p.id === c.reverseId)!;
      for (const [key, value] of Object.entries(c.fieldComparisons)) {
        const a = (row.original as Record<string, unknown>)[key], b = (reverse.original as Record<string, unknown>)[key];
        expect(value.same).toBe(canonical(a) === canonical(b)); expect(value.forwardHash).toBe(sha(canonical(a))); expect(value.reverseHash).toBe(sha(canonical(b)));
      }
      expect(c.reasonClasses).toContain("F_ORIGINAL_LINEAGE_AND_EMPIRICAL_VALIDITY_UNVERIFIED");
      expect(c.actualContradictionVerified).toBe(false);
    }
  });
  it("keeps missing-reverse and unknown-type policies explicit without inventing records", () => {
    expect(MBTI_PAIR_RESEARCH_POLICY.reverseMissing).toBe("missing_do_not_invent");
    expect(MBTI_PAIR_RESEARCH_POLICY.unknownType).toBe("no_research_record_no_type_guess");
    expect(materials.some(m => m.sourceType as string === "UNKNOWN")).toBe(false);
    expect(getMbtiRelationshipPair(null, "INTJ")).toBeNull();
    expect(getMbtiRelationshipPair("INTJ", null)).toBeNull();
    expect(getMbtiRelationshipPair("UNKNOWN", "INTJ")).toBeNull();
    // There is no new lookup implementation to fabricate an absent reverse view.
  });
  it("labels all fiction, category gates and unapproved comparison candidates explicitly", () => {
    const categories = ["love","marriage","parent_child","coworkers","manager_team","business","friends"];
    for (const m of materials) {
      expect(m.verification).toBe("editorially_reviewed_conditional_not_empirical");
      expect(m.connectedToRuntime).toBe(false); expect(m.approvedForCustomer).toBe(false);
      expect(m.relationNameReview.mappingStatus).toBe("not_established"); expect(m.relationNameReview.approvedForCustomer).toBe(false);
      expect(m.applicationGate).toContain("맞지 않거나"); expect(m.disallowedClaims).toHaveLength(6);
      expect(m.categoryApplicability.map(c => c.category)).toEqual(categories);
      expect(m.categoryApplicability.every(c => c.scope === "basic_interaction_candidate_only")).toBe(true);
      expect(m.categoryApplicability.find(c => c.category === "parent_child")!.gate).toContain("발달 단계");
      expect(m.categoryApplicability.find(c => c.category === "manager_team")!.gate).toContain("권력 문제");
      expect(m.categoryApplicability.find(c => c.category === "business")!.gate).toContain("계약");
      for (const s of m.fictionalScenes) expect(s.kind).toBe("fictional_not_user_history");
      for (const ref of m.sourceRefs) expect(sourceIds.has(ref), m.id + ref).toBe(true);
    }
    const scenes = materials.flatMap(m => m.fictionalScenes);
    expect(new Set(scenes.map(s => s.id)).size).toBe(272); expect(new Set(scenes.map(s => s.text)).size).toBe(272);
    expect(scenes).toHaveLength(512);
    for (const claim of rejected) for (const ref of claim.sourceRefs) expect(sourceIds.has(ref), ref).toBe(true);
  });
  it("counts legitimate reuse separately and detects copied dossiers or unsafe authored claims", () => {
    const full = joint.map(row => canonical(Object.fromEntries(Object.entries(row).filter(([key]) => key !== "pair"))));
    expect(new Set(full).size).toBe(136); expect(duplication.fullJointDossierExactDuplicates).toBe(0);
    expect(duplication.empiricalPairFacts).toBe(0);
    for (const row of joint) {
      for (const [field, text] of Object.entries(row).filter(([key]) => key !== "pair")) expect(text, row.pair + field).not.toMatch(/(?:반드시|무조건).*(?:성공|수익|결혼|이별)|(?:만족도|성공률).*(?:높다|낮다)|정신질환|뇌 기능|겪었|당했|했던 경험/);
    }
    const groups = Object.values(duplication.repeatedFieldGroups).flat();
    expect(groups).toHaveLength(11);
    for (const group of groups) expect(group.disposition).toContain("고유 지식으로 계산하지 않음");
    expect(duplication.nearAgreementPairs).toHaveLength(1);
  });
  it("keeps every new registry file static, type-only and absent from runtime consumers", () => {
    const dir = resolve("src/lib/report-knowledge/mbti-pair-research");
    expect(readdirSync(dir)).toHaveLength(18); expect(readdirSync(dir)).not.toContain("index.ts");
    for (const file of walk("src").filter(f => /\.[cm]?[jt]sx?$/.test(f))) {
      const code = readFileSync(file, "utf8");
      if (!file.startsWith(dir + "/")) expect(code, file).not.toMatch(/mbti-pair-research|MBTI_PAIR_RESEARCH/);
      else {
        expect(code, file).not.toMatch(/\b(?:fetch|require|function)\s*\(|\b(?:async|await)\b/);
        for (const statement of code.matchAll(/^import .*$/gm)) expect(statement[0]).toMatch(/^import type /);
      }
    }
  });
});
