import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SAJU_FOUNDATION_KNOWLEDGE } from "@/lib/report-knowledge/sajuFoundationKnowledge";
import { STRUCTURE_RULES } from "@/lib/interpretation-v4/structureRules";
import { COMPOSITE_STRENGTH } from "@/lib/report-knowledge/composite-structure-research/compositeStructureStrength";
import { COMPOSITE_FLOW } from "@/lib/report-knowledge/composite-structure-research/compositeStructureFlow";
import { COMPOSITE_TENSION } from "@/lib/report-knowledge/composite-structure-research/compositeStructureTension";
import { COMPOSITE_WEIGHT } from "@/lib/report-knowledge/composite-structure-research/compositeStructureWeight";
import { COMPOSITE_ABSENCE } from "@/lib/report-knowledge/composite-structure-research/compositeStructureAbsence";
import { COMPOSITE_ELEMENT } from "@/lib/report-knowledge/composite-structure-research/compositeStructureElement";
import { COMPOSITE_PRINCIPLE } from "@/lib/report-knowledge/composite-structure-research/compositeStructurePrinciple";
import { COMPOSITE_APPLICATIONS_STRENGTH } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsStrength";
import { COMPOSITE_APPLICATIONS_FLOW } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsFlow";
import { COMPOSITE_APPLICATIONS_TENSION } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsTension";
import { COMPOSITE_APPLICATIONS_WEIGHT } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsWeight";
import { COMPOSITE_APPLICATIONS_ABSENCE } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsAbsence";
import { COMPOSITE_APPLICATIONS_ELEMENT } from "@/lib/report-knowledge/composite-structure-research/compositeApplicationsElement";
import { COMPOSITE_BOUNDARIES } from "@/lib/report-knowledge/composite-structure-research/compositeStructureBoundaries";
import { COMPOSITE_REJECTED } from "@/lib/report-knowledge/composite-structure-research/compositeStructureRejected";
import { COMPOSITE_SOURCES } from "@/lib/report-knowledge/composite-structure-research/sajuFoundationCompositeSources";
import type { CompositeProfile, CompositeApplication, CompositeDomain, CompositeSource } from "@/lib/report-knowledge/composite-structure-research/compositeStructureTypes";

const profiles: readonly CompositeProfile[] = [...COMPOSITE_STRENGTH, ...COMPOSITE_FLOW, ...COMPOSITE_TENSION, ...COMPOSITE_WEIGHT, ...COMPOSITE_ABSENCE, ...COMPOSITE_ELEMENT, ...COMPOSITE_PRINCIPLE];
const applications: readonly CompositeApplication[] = [...COMPOSITE_APPLICATIONS_STRENGTH, ...COMPOSITE_APPLICATIONS_FLOW, ...COMPOSITE_APPLICATIONS_TENSION, ...COMPOSITE_APPLICATIONS_WEIGHT, ...COMPOSITE_APPLICATIONS_ABSENCE, ...COMPOSITE_APPLICATIONS_ELEMENT];
const sources: readonly CompositeSource[] = COMPOSITE_SOURCES;
const domains: readonly CompositeDomain[] = ["personality", "career", "money", "study", "love", "marriage", "family", "relationships"];
const dir = "docs/validation/v4-saju-composite-structure-knowledge-01";
const json = <T,>(file: string): T => JSON.parse(readFileSync(resolve(file), "utf8"));
const hash = (path: string) => createHash("sha256").update(readFileSync(resolve(path))).digest("hex");
function files(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap(x => x.isDirectory() ? files(resolve(path, x.name)) : [resolve(path, x.name)]);
}
const get = (key: CompositeProfile["key"]) => profiles.find(p => p.key === key)!;

describe("unconnected composite structure research", () => {
  it("covers the actual 29 canonical targets, preserving their identity and definitions", () => {
    const old = SAJU_FOUNDATION_KNOWLEDGE.filter(p => p.category === "structure");
    expect(profiles).toHaveLength(29);
    expect(profiles.map(p => p.targetId).sort()).toEqual(old.map(p => p.id).sort());
    for (const p of profiles) {
      const before = old.find(x => x.id === p.targetId)!;
      expect(p.label).toBe(before.labelKo); expect(p.aliases).toEqual(before.aliases);
      expect(p.existingDefinition.text).toBe(before.definition.text);
      expect(p.existingDefinition.class).toBe("B_REPOSITORY");
    }
  });
  it("maps all 14 real V4 rules once and keeps the exact rule contracts", () => {
    const data = json<{ rules: { rule: unknown; targetId: string }[] }>(dir + "/runtime-mapping.json");
    expect(data.rules.map(x => x.rule)).toEqual(STRUCTURE_RULES);
    const mapped = profiles.flatMap(p => p.support.v4RuleIds);
    expect(mapped.sort()).toEqual(STRUCTURE_RULES.map(r => r.id).sort());
    expect(new Set(mapped).size).toBe(14);
    for (const x of data.rules) expect(profiles.some(p => p.targetId === x.targetId)).toBe(true);
  });
  it("separates V4 candidates, legacy heuristics, available facts and knowledge-only principles", () => {
    expect(profiles.filter(p => p.support.classification === "A_DETECTED_CANDIDATE")).toHaveLength(20);
    expect(profiles.filter(p => p.support.classification === "B_FACTS_NO_V4_DETECTOR")).toHaveLength(5);
    expect(profiles.filter(p => p.support.classification === "C_KNOWLEDGE_ONLY")).toHaveLength(4);
    for (const key of ["weak_output", "weak_officer", "fire_metal", "water_weak"] as const) {
      expect(get(key).support.v4RuleIds).toEqual([]); expect(get(key).support.legacyPatternCodes).toHaveLength(1);
    }
    expect(get("toda_maegeum").support.actualBehavior).toContain("V2");
    for (const key of ["geumda_mokjeol", "mokda_hwasik", "suda_mokbu"] as const) expect(get(key).support.actualBehavior).toContain("producer");
    for (const p of profiles) {
      expect(p.support.runtimeEvidenceIds).toEqual([]);
      expect(p.support.insufficientForTraditionalFormation).toBe(true);
      for (const path of p.support.codeRefs) expect(existsSync(resolve(path)), path).toBe(true);
    }
  });
  it.each(profiles)("keeps formation, counterconditions and distinct interpretation for $key", p => {
    expect(Object.values(p.formation)).toHaveLength(8);
    for (const text of Object.values(p.formation)) expect(text.trim().length).toBeGreaterThan(10);
    expect(p.counterconditions.length).toBeGreaterThanOrEqual(3);
    expect(p.distinctions.length).toBeGreaterThan(0);
    for (const x of p.distinctions) { expect(x.otherTargetId).not.toBe(p.targetId); expect(profiles.some(q => q.targetId === x.otherTargetId)).toBe(true); }
    for (const text of [p.researchDefinition, p.inference.mechanism, p.inference.positive, p.inference.risk, p.inference.strengthToRisk, p.inference.weaknessToResource, p.inference.limits]) expect(text.length).toBeGreaterThan(15);
    expect(p.inference.class).toBe("C_CONDITIONAL_RESEARCH"); expect(p.connectedToRuntime).toBe(false);
  });
  it("reviews exactly the previous 232 handoff cells without changing their prior manifest", () => {
    type Cell = { id: string; targetId: string; domain: string; after: string; approvedApplication: boolean; researchRefs: string[] };
    const old = json<{ cells: Cell[] }>("docs/validation/v4-foundation-saju-deep-knowledge-03/coverage-manifest.json").cells.filter(c => c.targetId.includes(":structure:"));
    const now = json<{ cells: Cell[]; approvedCustomerApplications: number }>(dir + "/coverage-manifest.json");
    expect(old).toHaveLength(232); expect(now.cells.map(c => c.id).sort()).toEqual(old.map(c => c.id).sort());
    expect(old.every(c => c.after === "COMPOSITE_HANDOFF_ONLY")).toBe(true);
    expect(now.approvedCustomerApplications).toBe(0);
    const materials = [...applications, ...COMPOSITE_BOUNDARIES];
    expect(materials).toHaveLength(232);
    for (const p of profiles) expect(materials.filter(m => m.targetId === p.targetId).map(m => m.domain).sort()).toEqual([...domains].sort());
    for (const c of now.cells) {
      const m = materials.find(m => m.targetId === c.targetId && m.domain === c.domain)!;
      expect(c.after).toBe(m.class); expect(c.researchRefs).toContain(m.id); expect(c.approvedApplication).toBe(false);
    }
  });
  it.each(applications)("keeps domain-specific conditional modern material $id", m => {
    const p = profiles.find(p => p.id === m.profileRef)!;
    expect(p.targetId).toBe(m.targetId);
    expect(m.class).toBe("D_MODERN_APPLICATION"); expect(m.approvedForCustomer).toBe(false); expect(m.connectedToRuntime).toBe(false);
    expect(m.formationRef).toBe(p.id + "#formation"); expect(m.structuralMeaningRef).toBe(p.id + "#inference");
    expect(m.conditionalScene).toMatch(/면/);
    for (const value of [m.readerQuestion, m.core, m.positive, m.risk, m.excess, m.unexpected, m.action, m.additionalEvidence, m.contrast, m.doNotApply]) expect(value.trim().length).toBeGreaterThan(5);
    expect([m.core, m.positive, m.risk, m.excess, m.unexpected, m.conditionalScene].join(" ")).not.toMatch(/반드시|무조건|보장(?:된다|합니다)|틀림없이|이미.{0,20}겪/);
    expect(m.sourceRefs.every(r => r.sourceId === "authored")).toBe(true);
  });
  it("keeps unresolved definitions and judging principles out of application approval", () => {
    expect(COMPOSITE_BOUNDARIES).toHaveLength(56); expect(applications).toHaveLength(176);
    for (const key of ["mokda_hwasik", "water_weak", "season_command", "support_restraint", "temperature", "moisture", "mediation"] as const) {
      expect(applications.filter(m => m.targetId === get(key).targetId)).toHaveLength(0);
      expect(COMPOSITE_BOUNDARIES.filter(m => m.targetId === get(key).targetId)).toHaveLength(8);
    }
    for (const m of COMPOSITE_BOUNDARIES) {
      expect(m.class).toBe("E_UNVERIFIED"); expect(m.approvedForCustomer).toBe(false);
      expect(m.additionalEvidence.length).toBeGreaterThan(10); expect(m.gap.length).toBeGreaterThan(10); expect(m.doNotApply).toContain("금지");
    }
  });
  it("does not turn incomplete-chart absence into ability or family claims", () => {
    for (const key of ["no_resource", "no_output"] as const) {
      const p = get(key); expect(p.formation.additional).toContain("미상 시주"); expect(p.traditional[0].class).toBe("E_UNVERIFIED");
      expect(p.counterconditions.join(" ")).toContain("시주 미확정");
      for (const m of applications.filter(x => x.targetId === p.targetId)) expect(m.additionalEvidence).toContain("실제");
    }
  });
  it("resolves every statement at its actual source level", () => {
    expect(sources.filter(s => s.kind === "historical_transcription")).toHaveLength(7);
    for (const p of profiles) for (const statement of [p.existingDefinition, ...p.traditional]) for (const ref of statement.sourceRefs) {
      const s = sources.find(s => s.id === ref.sourceId); expect(s).toBeDefined(); expect(ref.locator.trim()).not.toBe("");
      if (statement.class === "A_TEXT_CHECKED") { expect(s?.kind).toBe("historical_transcription"); expect(s?.accessed).toBe("2026-10-13"); }
    }
    for (const m of [...applications, ...COMPOSITE_BOUNDARIES, ...COMPOSITE_REJECTED]) for (const ref of m.sourceRefs) expect(sources.some(s => s.id === ref.sourceId)).toBe(true);
    const captures = json<{ id: string; sha256: string; bytes: number }[]>(dir + "/source-access.json");
    expect(captures).toHaveLength(7); for (const x of captures) { expect(x.sha256).toMatch(/^[a-f0-9]{64}$/); expect(x.bytes).toBeGreaterThan(1000); }
  });
  it("separates prohibited counterexamples from all usable materials", () => {
    expect(COMPOSITE_REJECTED).toHaveLength(29);
    expect(new Set(COMPOSITE_REJECTED.map(x => x.targetId)).size).toBe(29);
    for (const x of COMPOSITE_REJECTED) { expect(x.class).toBe("F_REJECTED"); expect(x.approvedForCustomer).toBe(false); expect(x.whyRejected.length).toBeGreaterThan(15); }
    const validIds = new Set<string>([...applications, ...COMPOSITE_BOUNDARIES].map(x => x.id));
    for (const x of COMPOSITE_REJECTED) expect(validIds.has(x.id)).toBe(false);
  });
  it("keeps actual source disagreements open instead of rewriting legacy definitions", () => {
    expect(get("mokda_hwasik").traditional[0].class).toBe("E_UNVERIFIED");
    expect(get("mokda_hwasik").formation.additional).toContain("feeds_fire");
    expect(get("moisture").traditional[0].sourceRefs[0].locator).toContain("寒暖論");
    const conflicts = json<{ autoMerged: boolean; items: { kind: string }[] }>(dir + "/conflicts.json");
    expect(conflicts.autoMerged).toBe(false); expect(new Set(conflicts.items.map(x => x.kind)).size).toBe(7);
  });
  it("checks exact reuse without claiming unique psychology from string diversity", () => {
    for (const field of ["readerQuestion", "core", "positive", "risk", "excess", "unexpected", "conditionalScene", "action", "contrast"] as const) expect(new Set(applications.map(x => x[field])).size, field).toBe(applications.length);
    for (const field of ["researchDefinition"] as const) expect(new Set(profiles.map(x => x[field])).size).toBe(profiles.length);
    const audit = json<{ profileComparisons: unknown[]; limitations: string[] }>(dir + "/semantic-audit.json");
    expect(audit.profileComparisons).toHaveLength(29); expect(audit.limitations.join(" ")).toContain("경험적 검증");
  });
  it("preserves every baseline source byte, including calculations, writers, evidence and Books", () => {
    const before = json<{ files: Record<string, string> }>(dir + "/preservation-manifest.json");
    expect(Object.keys(before.files)).toHaveLength(912);
    for (const [path, digest] of Object.entries(before.files)) expect(hash(path), path).toBe(digest);
  });
  it("has no runtime imports or executable registry logic", () => {
    const path = resolve("src/lib/report-knowledge/composite-structure-research");
    for (const f of files(resolve("src")).filter(f => !f.startsWith(path))) expect(readFileSync(f, "utf8"), f).not.toMatch(/composite-structure-research|COMPOSITE_(APPLICATIONS|BOUNDARIES|STRENGTH|FLOW|TENSION|WEIGHT|ABSENCE|ELEMENT|PRINCIPLE|REJECTED|SOURCES)/);
    for (const f of files(path)) expect(readFileSync(f, "utf8"), f).not.toMatch(/import\s+(?!type\b)|export\s+(?:\*|\{)|\b(?:fetch|require|calculateSaju|generateV4ShadowReport)\s*\(|process\.env|Date\.now|Math\.random|\bfunction\s/);
  });
});
