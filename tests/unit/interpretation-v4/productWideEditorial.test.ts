import { describe, expect, it } from "vitest";
import { auditContentMbtiLinks, reviewedMbtiBehavior } from "../../../src/lib/interpretation-v4/contentMbti";
import { humanMbtiReason } from "../../../src/lib/interpretation-v4/narrativeMbtiReason";
import { freshNarrativeMemory } from "../../../src/lib/interpretation-v4/narrativeMemory";
import { schedulerInputs } from "./comprehensiveSchedulerFixtures";
import { realMbti } from "./fusionSemanticFixtures";

const types = [...new Set(auditContentMbtiLinks().map(r => r.type))];
describe("reviewed MBTI trait realization is source-specific, never a new Fusion rule", () => {
  it.each(types)("%s existing supported traits retain distinct behaviors", type => {
    const profile = realMbti(type), before = JSON.stringify(profile);
    const readings = profile.sourceNodes.flatMap(n => { const behavior = reviewedMbtiBehavior(n); return behavior ? [{ node: n, behavior }] : []; });
    expect(readings.length).toBeGreaterThanOrEqual(4);
    expect(new Set(readings.map(r => r.behavior)).size).toBe(readings.length);
    for (const { behavior } of readings) expect(behavior).not.toMatch(new RegExp(`^${type}(?:는|은|에게|의) `));
    expect(JSON.stringify(profile)).toBe(before);
  });
  it("real selected Love traits reuse the DB customer wording instead of generic care advice", () => {
    const p = realMbti("ESFP");
    expect(reviewedMbtiBehavior(p.sourceNodes.find(n => n.id === "mbti:ESFP:traits:love:romantic_surprise:plainKo")!)).toBe("사랑을 말로만 증명하지 않고, 상대가 웃는 장면을 직접 만들어 주고 싶어 합니다.");
    expect(reviewedMbtiBehavior(p.sourceNodes.find(n => n.id === "mbti:ESFP:traits:relationships:introvert_bridge:plainKo")!)).toContain("조용한 사람의 개별 감정");
  });
  it("unknown MBTI has no substituted behavior; forged values and reference-only nodes are rejected", () => {
    expect(realMbti(null).sourceNodes).toEqual([]);
    const node = realMbti("ISFJ").sourceNodes.find(n => reviewedMbtiBehavior(n))!;
    expect(reviewedMbtiBehavior({ ...node, value: "원본에 없는 주장" })).toBeUndefined();
    expect(reviewedMbtiBehavior({ ...node, classification: "REFERENCE_ONLY" })).toBeUndefined();
    expect(reviewedMbtiBehavior({ ...node, sourceDomain: "MYEONGLI_BRIDGE_HINT" })).toBeUndefined();
    expect(reviewedMbtiBehavior({ ...node, id: "invented:plainKo" })).toBeUndefined();
  });
  it("used-node memory moves to another equally relevant actual Fusion source, without changing inputs", () => {
    const input = schedulerInputs(), before = JSON.stringify(input), memory = freshNarrativeMemory();
    const candidates = [...input.fusion.reinforce, ...input.fusion.tensions, ...input.fusion.complements].filter(f => humanMbtiReason(input, f, "C2", memory));
    expect(candidates.length).toBeGreaterThan(0);
    for (const fusion of candidates) {
      const reason = humanMbtiReason(input, fusion, "C2", memory)!;
      expect(fusion.mbti.sourceNodeIds).toContain(reason.nodeId);
      expect(input.mbti.annotations.some(a => a.sourceNodeId === reason.nodeId && (a.axes[reason.axis] ?? 0) * reason.direction > 0)).toBe(true);
      const absent = { ...fusion, mbti: { ...fusion.mbti, sourceNodeIds: [] } };
      expect(humanMbtiReason(input, absent, "C2", memory)).toBeUndefined();
    }
    const fusion = candidates.find(f => {
      const first = humanMbtiReason(input, f, "C2", memory)!;
      const used = freshNarrativeMemory(); used.usedEvidence[first.nodeId] = 10;
      return humanMbtiReason(input, f, "C2", used)?.nodeId !== first.nodeId;
    });
    expect(fusion).toBeDefined();
    expect(JSON.stringify(input)).toBe(before);
  });
});
