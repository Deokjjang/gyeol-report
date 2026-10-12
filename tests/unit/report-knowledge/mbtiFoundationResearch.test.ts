import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { MBTI_TYPES } from "@/lib/report-knowledge/mbtiKnowledgeTypes";
import { MBTI_TRAIT_AREAS, getMbtiSourceProfile } from "@/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { inventoryMbtiSource } from "@/lib/interpretation-v4/mbtiSourceAdapter";
import { annotateMbtiSource, validateMbtiAnnotations } from "@/lib/interpretation-v4/mbtiSemanticAnnotations";
import type { MbtiResearchMaterial } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchTypes";
import { MBTI_RESEARCH_SOURCES } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchSources";
import preservation from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/source-preservation.json";
import jsonPreservation from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/original-json-preservation.json";
import leaves from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/all-source-leaves.json";
import traits from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/existing-traits-audit.json";
import coverage from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/domain-coverage.json";
import pairs from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/pair-inventory.json";
import useCases from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/report-use-cases-audit.json";
import enrichment from "../../../docs/validation/v4-mbti-16type-knowledge-depth-01/enrichment-audit.json";
import { MBTI_RESEARCH_INTJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchINTJ";
import { MBTI_RESEARCH_INTP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchINTP";
import { MBTI_RESEARCH_ENTJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchENTJ";
import { MBTI_RESEARCH_ENTP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchENTP";
import { MBTI_RESEARCH_INFJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchINFJ";
import { MBTI_RESEARCH_INFP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchINFP";
import { MBTI_RESEARCH_ENFJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchENFJ";
import { MBTI_RESEARCH_ENFP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchENFP";
import { MBTI_RESEARCH_ISTJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchISTJ";
import { MBTI_RESEARCH_ISFJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchISFJ";
import { MBTI_RESEARCH_ESTJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchESTJ";
import { MBTI_RESEARCH_ESFJ } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchESFJ";
import { MBTI_RESEARCH_ISTP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchISTP";
import { MBTI_RESEARCH_ISFP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchISFP";
import { MBTI_RESEARCH_ESTP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchESTP";
import { MBTI_RESEARCH_ESFP } from "@/lib/report-knowledge/mbti-foundation-research/mbtiResearchESFP";
const materials: readonly MbtiResearchMaterial[] = [...MBTI_RESEARCH_INTJ, ...MBTI_RESEARCH_INTP, ...MBTI_RESEARCH_ENTJ, ...MBTI_RESEARCH_ENTP, ...MBTI_RESEARCH_INFJ, ...MBTI_RESEARCH_INFP, ...MBTI_RESEARCH_ENFJ, ...MBTI_RESEARCH_ENFP, ...MBTI_RESEARCH_ISTJ, ...MBTI_RESEARCH_ISFJ, ...MBTI_RESEARCH_ESTJ, ...MBTI_RESEARCH_ESFJ, ...MBTI_RESEARCH_ISTP, ...MBTI_RESEARCH_ISFP, ...MBTI_RESEARCH_ESTP, ...MBTI_RESEARCH_ESFP];
const sha = (s: string | Buffer) => createHash("sha256").update(s).digest("hex");
const researchDir = resolve("src/lib/report-knowledge/mbti-foundation-research");
const readJson = (type: string): unknown => JSON.parse(readFileSync(`docs/product/mbti/source/${type}.json`, "utf8").replace(/^\uFEFF/, ""));
function pointer(input: unknown, path: string): unknown {
  return path.split("/").slice(1).reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key.replace(/~1/g, "/").replace(/~0/g, "~")];
  }, input);
}
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(d => d.isDirectory() ? walk(resolve(dir, d.name)) : [resolve(dir, d.name)]);
}

describe("MBTI offline foundation research: provenance and unchanged runtime", () => {
  it("preserves every pre-existing source byte and all sixteen original JSON files", () => {
    expect(Object.keys(preservation)).toHaveLength(977);
    for (const [file, digest] of Object.entries(preservation)) expect(sha(readFileSync(file)), file).toBe(digest);
    expect(Object.keys(jsonPreservation)).toHaveLength(16);
    for (const [file, digest] of Object.entries(jsonPreservation)) expect(sha(readFileSync(file)), file).toBe(digest);
  });
  it("inventories the actual 1213 traits, 256 directed pairs, 96 usage areas and all gaps", () => {
    expect(traits).toHaveLength(1213); expect(pairs).toHaveLength(256); expect(useCases).toHaveLength(96); expect(enrichment).toHaveLength(16);
    expect(traits.filter(t => t.sourceCoverage === "direct")).toHaveLength(938);
    expect(traits.filter(t => t.sourceCoverage === "inferred")).toHaveLength(275);
    expect(pairs.filter(p => p.sourceCoverage === "direct")).toHaveLength(158);
    expect(pairs.filter(p => p.sourceCoverage === "inferred")).toHaveLength(98);
    expect(new Set(traits.map(t => t.sourceEvidenceId)).size).toBe(1213);
    expect(new Set(pairs.map(p => p.from + ":" + p.to)).size).toBe(256);
  });
  it.each(MBTI_TYPES)("compares every audited leaf against the real semantic adapter for %s", type => {
    const original = readJson(type);
    const inventory = inventoryMbtiSource(type, original);
    expect(inventory.hardErrors).toEqual([]);
    const annotated = annotateMbtiSource(type, inventory.nodes);
    expect(annotated.hardErrors).toEqual([]);
    expect(validateMbtiAnnotations(type, annotated.nodes, annotated.annotations)).toEqual([]);
    const audited = leaves.filter(l => l.type === type);
    expect(audited).toHaveLength(annotated.nodes.length);
    const actual = new Map(annotated.nodes.map(n => [n.sourcePath, n]));
    for (const item of audited) {
      const node = actual.get(item.pointer)!;
      expect(node, item.pointer).toBeDefined();
      expect(node.classification, item.pointer).toBe(item.classification);
      expect(node.reason, item.pointer).toBe(item.classificationReason);
      expect(node.sourceDomain, item.pointer).toBe(item.sourceDomain);
      expect(node.sourceCoverage ?? null, item.pointer).toBe(item.sourceCoverage);
    }
    for (const item of traits.filter(t => t.type === type)) {
      const originalTrait = pointer(original, item.pointer) as { id: string; plainKo: string; sourceCoverage: string };
      expect(originalTrait.id).toBe(item.traitId); expect(originalTrait.plainKo).toBe(item.meaning);
      expect(originalTrait.sourceCoverage).toBe(item.sourceCoverage);
    }
    expect(pointer(original, "/enrichment")).toEqual(enrichment.find(e => e.type === type)!.existing);
    for (const u of useCases.filter(u => u.type === type)) expect(pointer(original, "/reportUseCases/" + u.product)).toEqual(u.existingGuidance);
    const hints = pointer(original, "/relationshipHints/notablePairs") as { withType: string; sourceCoverage: string }[];
    expect(hints.map(p => p.withType).sort()).toEqual([...MBTI_TYPES].sort());
  });
  it.each(MBTI_TYPES)("validates every conditional application and source link for %s", type => {
    const own = materials.filter(m => m.type === type); expect(own).toHaveLength(32);
    const sourceIds = new Set<string>(MBTI_RESEARCH_SOURCES.map(s => s.id));
    for (const m of own) {
      expect(m.provenance).toBe("new_conditional_research"); expect(m.approvedForCustomer).toBe(false);
      expect(m.connectedToRuntime).toBe(false); expect(m.verification).toBe("editorial_reviewed_not_empirically_verified");
      expect(m.applicationGate).toContain("맞지 않거나");
      expect(m.fictionalExample.kind).toBe("fictional_not_user_history");
      for (const key of ["coreMeaning", "positiveExpression", "cautionExpression", "behaviorCandidate", "environmentCondition", "unexpectedFacet", "counterexample"] as const) expect(m[key].length, m.id + key).toBeGreaterThan(5);
      expect(m.basis).toHaveLength(2); expect(m.similarTypeContrast.basis.length).toBeGreaterThan(0);
      expect(m.similarTypeContrast.type).not.toBe(type); expect(m.similarTypeContrast.status).toBe("source_comparison_hypothesis_not_exclusive");
      for (const ref of [...m.basis, ...m.similarTypeContrast.basis]) {
        const sourceTrait = pointer(readJson(ref.type), ref.pointer) as { id: string; plainKo: string; sourceCoverage: string };
        expect(sourceTrait.id, m.id).toBe(ref.traitId); expect(sourceTrait.sourceCoverage).toBe(ref.sourceCoverage);
        expect(sha(sourceTrait.plainKo)).toBe(ref.sourceMeaningSha256);
        expect(ref.file).toBe(`docs/product/mbti/source/${ref.type}.json`);
        expect(ref.pointer).toMatch(new RegExp(`^/traits/${m.domain}/[0-9]+$`));
      }
      for (const ref of m.sourceRefs) expect(sourceIds.has(ref), m.id + ref).toBe(true);
      expect(m.sourceRefs).toContain("mbf:ethics");
    }
  });
  it.each(MBTI_TRAIT_AREAS)("has individually reviewed source conditions and multiple applications in %s", domain => {
    for (const type of MBTI_TYPES) {
      const cell = coverage.find(c => c.type === type && c.domain === domain)!;
      const rows = materials.filter(m => m.type === type && m.domain === domain);
      expect(cell).toBeDefined(); expect(rows).toHaveLength(2);
      expect(rows.map(r => r.id)).toEqual(cell.materialIds);
      expect(rows[0].coreMeaning).not.toBe(rows[1].coreMeaning);
      expect(rows[0].behaviorCandidate).not.toBe(rows[1].behaviorCandidate);
      expect(rows[0].fictionalExample.text).not.toBe(rows[1].fictionalExample.text);
      expect(cell.existingTraits).toBe(traits.filter(t => t.type === type && t.domain === domain).length);
      if (domain === "parenting" || domain === "child") for (const row of rows) expect(row.applicationGate).toContain("자녀 존재");
      if (domain === "investment" || domain === "money") for (const row of rows) expect(row.applicationGate).toContain("위험 감내");
    }
  });
  it("retains the inferred/direct distinction and never converts source labels into verification", () => {
    expect(materials).toHaveLength(512); expect(new Set(materials.map(m => m.id)).size).toBe(512);
    expect(coverage).toHaveLength(256);
    expect(materials.some(m => m.basis.some(b => b.sourceCoverage === "inferred"))).toBe(true);
    expect(materials.every(m => m.verification === "editorial_reviewed_not_empirically_verified")).toBe(true);
    expect(MBTI_RESEARCH_SOURCES.filter(s => s.id.startsWith("mbf:"))).toHaveLength(3);
  });
  it("keeps new data static, disconnected and absent from every old runtime entry", () => {
    for (const file of walk("src").filter(f => /\.[cm]?[jt]sx?$/.test(f))) {
      const code = readFileSync(file, "utf8");
      if (!file.startsWith(researchDir + "/")) expect(code, file).not.toMatch(/mbti-foundation-research|MBTI_RESEARCH_/);
      else {
        expect(code, file).not.toMatch(/\b(?:fetch|require|function)\s*\(|\b(?:Date|Map|Set)\b|\b(?:async|await)\b/);
        for (const statement of code.matchAll(/^import .*$/gm)) expect(statement[0]).toMatch(/^import type /);
      }
    }
    expect(getMbtiSourceProfile(null)).toBeNull(); expect(getMbtiSourceProfile("UNKNOWN")).toBeNull();
  });
  it("has no exact copied interpretation or deterministic sensitive outcome in authored applications", () => {
    const unique = new Set<string>();
    for (const m of materials) {
      const text = [m.coreMeaning,m.positiveExpression,m.cautionExpression,m.behaviorCandidate,m.environmentCondition,m.fictionalExample.text].join(" ");
      expect(unique.has(text), m.id).toBe(false); unique.add(text);
      expect(text, m.id).not.toMatch(/(?:반드시|무조건).*(?:성공|합격|수익|결혼)|(?:지능|범죄율|수익률).*(?:높다|낮다)|정신질환|신경 기능|뇌 기능/);
      expect(text, m.id).not.toMatch(/겪었|당했|했던 경험|당신의 자녀는/);
    }
  });
  it("keeps contrasts as source comparisons rather than pair recommendations or exclusive facts", () => {
    for (const m of materials) {
      expect(m.similarTypeContrast.interpretation).toContain(m.similarTypeContrast.type);
      expect(m.similarTypeContrast.interpretation).not.toMatch(/최고|최악|천생연분|우월|궁합 점수/);
    }
  });
});
