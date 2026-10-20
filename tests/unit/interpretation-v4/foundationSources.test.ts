import { buildContentEvidencePool, createContentSelection, planChapter, fusionDomains } from "../../../src/lib/interpretation-v4/contentEvidence";
import { collectComprehensiveCandidates } from "../../../src/lib/interpretation-v4/comprehensiveCandidateAdapter";
import { schedulerInputs } from "./comprehensiveSchedulerFixtures";
import { describe, expect, it } from "vitest";
import { buildFoundationReferences, materialFoundationReferences } from "../../../src/lib/interpretation-v4/evidenceFoundation";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { fixtureInput, NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { fuse, realMbti } from "./fusionSemanticFixtures";

const input = fixtureInput(NARRATIVE_FIXTURES[0]);
const built = buildIntegratedMyeongliProfile(input.calculation);
if (!built.ok) throw new Error("Actual calculation fixture failed");
const myeongli = built.value;
const types = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
describe("existing knowledge inventories at the real generation boundary", () => {
  it.each(types)("%s links scoring source traits, actual atoms and dependent Fusion without prior promotion", type => {
    const mbti = realMbti(type), fusion = fuse(myeongli, mbti);
    const refs = buildFoundationReferences({ myeongli, mbti, fusion });
    expect(refs.filter(r => r.basis === "natal")).toHaveLength(myeongli.evidence.length);
    const traits = refs.filter(r => r.basis === "mbti");
    expect(traits.length).toBeGreaterThan(0);
    for (const r of traits) {
      const source = mbti.sourceNodes.find(n => n.id === r.id)!;
      expect(source.classification).toBe("SCORING_SEMANTIC");
      expect(source.sourcePath).toMatch(/^\/traits\/.*\/plainKo$/);
      expect(r.support).toBe(source.sourceCoverage === "direct" ? "direct-source" : "derived");
    }
    const allFusion = [...fusion.reinforce, ...fusion.tensions, ...fusion.complements];
    expect(refs.filter(r => r.basis === "fusion")).toHaveLength(allFusion.length);
    for (const r of refs.filter(r => r.basis === "fusion")) {
      expect(r.support).toBe("conditional");
      expect(r.dependencies.every(id => refs.some(ref => ref.id === id))).toBe(true);
      expect(r.lineage).toEqual([...new Set(r.dependencies.flatMap(id => refs.find(ref => ref.id === id)!.lineage))].sort());
    }
    expect(refs.some(r => r.id.includes("dimension_prior"))).toBe(false);
    const other = buildFoundationReferences({ myeongli, mbti, fusion }, "personB");
    expect(other.every(r => r.subject === "personB")).toBe(true);
    expect(other.some(r => r.lineage.some(id => id.startsWith("person:")))).toBe(false);
  });
  it("unknown MBTI emits no invented type or Fusion; held materials never become reference roots", () => {
    const mbti = realMbti(null), fusion = fuse(myeongli, mbti);
    expect(buildFoundationReferences({ myeongli, mbti, fusion }).every(r => r.basis === "natal")).toBe(true);
    const packet = buildMyeongliMaterialPacket(input), refs = materialFoundationReferences(packet);
    expect(refs.map(r => r.id)).toEqual(packet.selected.map(r => r.feature));
    expect(refs.every(r => r.dependencies.length && r.lineage.length && r.sourceRefs.length)).toBe(true);
  });
});

describe("actual content selection consumes the foundation contract", () => {
  it("keeps foreign-person and temporal observations out of natal chapter roots", () => {
    const packet = buildMyeongliMaterialPacket(input), pool = buildContentEvidencePool(input.calculation, packet);
    const normal = planChapter(pool, createContentSelection(), "work", "work");
    expect(normal.roots.length).toBeGreaterThan(0);
    const wrongPerson = { ...pool, materials: pool.materials.map(m => ({ ...m, evidence: m.evidence.map(d => ({ ...d, evidence: { ...d.evidence, subject: "personB" as const } })) })) };
    expect(planChapter(wrongPerson, createContentSelection(), "work", "work").roots).toEqual([]);
    const wrongTime = { ...pool, materials: pool.materials.map(m => ({ ...m, evidence: m.evidence.map(d => ({ ...d, evidence: { ...d.evidence, period: "2027" } })) })) };
    expect(planChapter(wrongTime, createContentSelection(), "work", "work").roots).toEqual([]);
    const fusion = packet.fusions[0];
    expect(fusion).toBeDefined();
    expect(fusionDomains({ ...fusion, ruleId: "unregistered-rule" })).toEqual([]);
  });
  it("retains unresolved upstream IDs and excludes their candidates instead of laundering the missing root", () => {
    const profiles = schedulerInputs();
    const baseline = collectComprehensiveCandidates(profiles);
    expect(baseline.some(c => c.primaryEligible && !c.invalidReasons.length)).toBe(true);
    const changed = structuredClone(profiles);
    changed.claims.candidates[0].evidence.myeongliEvidenceIds.push("missing:actual-observation");
    const row = collectComprehensiveCandidates(changed).find(c => c.sourceType === "CLAIM" && c.sourceId === changed.claims.candidates[0].id)!;
    expect(row.evidenceIds).toContain("missing:actual-observation");
    expect(row.primaryEligible).toBe(false);
    expect(row.invalidReasons).toContain("UNRESOLVED_SOURCE_DEPENDENCY");
  });
});
