import { describe, expect, it } from "vitest";
import { CLAIM_LEVELS, type ClaimDefinition } from "../../../src/lib/interpretation-v4/claimCore";
import { CLAIM_REGISTRY, FORTUNE_CLAIM_IDS, LEVEL4_CLAIM_IDS } from "../../../src/lib/interpretation-v4/claimRegistry";
import { assessClaimLevel, type ClaimLevelSupport } from "../../../src/lib/interpretation-v4/claimEvaluator";
import { inspectClaimRegistry, CLAIM_FORBIDDEN_LANGUAGE } from "../../../src/lib/interpretation-v4/claimDiagnostics";
import { myAtom, myProfile, mbtiProfile, repeated, realMbti, fuse } from "./fusionSemanticFixtures";
import { CLAIM_SCENARIOS, strong, integrated, claim, claims, marker, wealth, officer, withComposite } from "./claimFixtures";
import type { SemanticSignature } from "../../../src/lib/interpretation-v4/semanticCore";
import { TEN_GOD_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationTenGods";

describe("explicit 41-rule contract", () => {
  it("all exact IDs, level-specific copy and direct fortune allowlists", () => {
    expect(CLAIM_REGISTRY).toHaveLength(41); expect(CLAIM_SCENARIOS).toHaveLength(41);
    expect(inspectClaimRegistry(CLAIM_REGISTRY)).toEqual([]);
    expect(CLAIM_REGISTRY.filter(c => c.maxLevel === 4).map(c => c.id).sort()).toEqual([...LEVEL4_CLAIM_IDS].sort());
    expect(CLAIM_REGISTRY.filter(c => c.fortuneClaim).map(c => c.id).sort()).toEqual([...FORTUNE_CLAIM_IDS].sort());
    const copy = CLAIM_REGISTRY.flatMap(d => [...Object.values(d.claimsByLevel), ...(d.alternativeLevel3 ? [d.alternativeLevel3] : [])]);
    expect(new Set(copy).size).toBe(copy.length); copy.forEach(s => expect(s).not.toMatch(CLAIM_FORBIDDEN_LANGUAGE));
  });
  it.each(CLAIM_SCENARIOS)("%s positive and empty-source negative", (prefix, axes, extras) => {
    const found = claim(strong(axes, extras), prefix);
    expect(found, prefix).toBeDefined(); expect(found!.level).toBe(3); expect(found!.confidenceBand).toBe("HIGH");
    expect(claim(myProfile([]), prefix)).toBeUndefined();
  });
  it.each(CLAIM_SCENARIOS)("%s requires every explicitly required axis", (prefix, axes, extras) => {
    const definition = CLAIM_REGISTRY.find(d => d.id.startsWith(`${prefix}_`))!;
    for (const required of definition.requiredAxes) {
      const without = { ...axes }; delete without[required.axis];
      const other = (extras ?? []).map(e => { const copy = structuredClone(e); delete copy.axes[required.axis]; return copy; });
      expect(claim(strong(without, other), prefix), required.axis).toBeUndefined();
    }
  });
  it("invalid registry contracts fail explicitly", () => {
    const mutate = (change: (d: ClaimDefinition[]) => void) => { const r = structuredClone(CLAIM_REGISTRY); change(r); return inspectClaimRegistry(r).map(e => e.code); };
    expect(mutate(r => { r[0].id = "unknown"; })).toContain("UNKNOWN_CLAIM_ID");
    expect(mutate(r => { r[1].id = r[0].id; })).toContain("DUPLICATE_CLAIM_ID");
    expect(mutate(r => { r[0].requiredAxes[0].axis = "fake" as never; })).toContain("INVALID_AXIS_REQUIREMENT");
    expect(mutate(r => { r[0].preferredFusionIds = ["C999"]; })).toContain("UNKNOWN_FUSION_ID");
    expect(mutate(r => { r[0].fortuneClaim = true; })).toContain("FORTUNE_FLAG_MISMATCH");
    expect(mutate(r => { r[0].maxLevel = 4; })).toContain("UNAUTHORIZED_LEVEL4");
    expect(mutate(r => { r[0].claimsByLevel[0] = "금지"; })).toContain("INVALID_COPY_LEVEL_MAPPING");
  });
});

describe("level 0–4 uses independent support, never raw score cutoffs", () => {
  const zero: ClaimLevelSupport = { credibleSupport: false, main: false, strong: false, independentSupportCount: 0, independentMyeongliFamilies: 0,
    nonAmplifierMyeongli: false, myeongliMain: false, actualMbtiMain: false, validFusionMain: false, structuralComposite: false, unresolvedContradiction: false, allowLevel4: false };
  it("weak/main/strong/explicit composite levels", () => {
    expect(CLAIM_LEVELS).toEqual([0, 1, 2, 3, 4]); expect(assessClaimLevel(zero)).toBe(0);
    expect(assessClaimLevel({ ...zero, credibleSupport: true })).toBe(1);
    expect(assessClaimLevel({ ...zero, credibleSupport: true, main: true })).toBe(2);
    expect(assessClaimLevel({ ...zero, credibleSupport: true, independentSupportCount: 2 })).toBe(2);
    const high = { ...zero, credibleSupport: true, main: true, strong: true, nonAmplifierMyeongli: true, independentMyeongliFamilies: 2 };
    expect(assessClaimLevel(high)).toBe(3); expect(assessClaimLevel({ ...high, allowLevel4: true })).toBe(3);
    expect(assessClaimLevel({ ...high, allowLevel4: true, structuralComposite: true })).toBe(4);
    expect(assessClaimLevel({ ...high, allowLevel4: true, structuralComposite: true, unresolvedContradiction: true })).toBe(3);
    expect(assessClaimLevel({ ...high, nonAmplifierMyeongli: false })).toBe(2);
  });
  it("same-family repetition and three fused views are not three families", () => {
    const m = myProfile(Array.from({ length: 8 }, (_, i) => myAtom(`same:${i}`, { LEADERSHIP: 2 }, { family: "SAME" })));
    expect(claim(m, "S01")?.level).toBe(2);
    const b = mbtiProfile(repeated({ LEADERSHIP: 2 }));
    const c = claim(m, "S01", b)!;
    expect(c.level).toBe(3); expect(c.evidence.independentMyeongliFamilies).toEqual(["SAME"]);
    expect(c.evidence.mbtiSourceNodeIds).toHaveLength(3); expect(c.evidenceDiversity).toBe(1);
    expect(c.evidence.fusionCandidateIds.length).toBeGreaterThan(0);
  });
});

describe("fortune requires primary Myeongli even with very strong actual MBTI", () => {
  it("money style is not wealth fortune", () => {
    const m = strong({ RESOURCE_SENSE: 2, PRACTICALITY: 2 });
    expect(claim(m, "M01")?.level).toBe(3); expect(claim(m, "M08", realMbti("ENTJ"))).toBeUndefined();
  });
  it("M08 L4 survives removing MBTI when natal composite is sufficient", () => {
    const m = withComposite(strong({ RESOURCE_SENSE: 2, CREATION: 2 }, [wealth(), marker("JAEGO")]), "OUTPUT_TO_WEALTH", ["RESOURCE_SENSE", "CREATION"]);
    expect(claim(m, "M08")?.customerClaim).toBe("재물 쪽에는 좋은 패가 있습니다.");
    expect(claim(m, "M08", realMbti("ENTJ"))?.level).toBe(4);
    expect(claim(m, "M08")?.evidence.mbtiSourceNodeIds).toEqual([]);
  });
  it("a genuine C040 SIGNATURE cannot turn a supportive money axis into wealth fortune", () => {
    const m = strong({ MEANING: 2 }, [myAtom("money-support", { RESOURCE_SENSE: 1 }, { tier: "AMPLIFIER", strength: "MEDIUM", family: "support-only" })]);
    const b = mbtiProfile([...repeated({ RESOURCE_SENSE: 2, PRACTICALITY: 2 }), ...repeated({ RESOURCE_SENSE: 2, PRACTICALITY: 2 }, 3, "MONEY")]);
    expect(fuse(m, b).complements.some(f => f.ruleId === "C040" && f.strength === "SIGNATURE")).toBe(true);
    expect(claim(m, "M01", b)).toBeDefined(); expect(claim(m, "M08", b)).toBeUndefined();
  });
  it.each(FORTUNE_CLAIM_IDS)("%s MBTI cannot replace a missing primary axis or marker", id => {
    const [prefix, axes, extras] = CLAIM_SCENARIOS.find(([p]) => id.startsWith(`${p}_`))!;
    // All personality axes can be strong in MBTI, but no natal primary sources.
    const specs = Object.entries(axes).flatMap(([a, value]) => repeated({ [a]: value } as SemanticSignature));
    specs.push(...repeated({ SOCIAL_ATTUNEMENT: 2, CARE: 2, CHARISMA: 2 }, 3, "LOVE"));
    const b = mbtiProfile(specs);
    expect(claim(myProfile([]), prefix, b)).toBeUndefined();
    const emptyAxes = (extras ?? []).map(e => ({ ...e, axes: {} }));
    expect(claim(myProfile(emptyAxes), prefix, b)).toBeUndefined();
  });
  it.each(["S03", "S04", "S08"])("%s explicit nonamplifier composite unlocks level4", prefix => {
    const [, axes, extras] = CLAIM_SCENARIOS.find(([p]) => p === prefix)!;
    const m = withComposite(strong(axes, extras), "WEALTH_AND_STATUS", ["RESOURCE_SENSE", "STATUS_DRIVE"]);
    expect(claim(m, prefix)?.level).toBe(4);
  });
  it("every S08 primary gate is necessary even when MBTI supplies that axis", () => {
    const b = realMbti("ENTJ");
    const good = strong({ RESOURCE_SENSE: 2, STATUS_DRIVE: 2, GOAL_DRIVE: 2 }, [wealth(), officer(), marker("BANAN")]);
    for (const removed of ["wealth", "officer", "marker:BANAN"]) {
      expect(claim(integrated(good.evidence.filter(e => e.id !== removed)), "S08", b), removed).toBeUndefined();
    }
    for (const axis of ["RESOURCE_SENSE", "STATUS_DRIVE", "GOAL_DRIVE", "LEADERSHIP"] as const) {
      if (axis === "LEADERSHIP") continue; // alternative to GOAL_DRIVE: remove both together below
      const atoms = good.evidence.map(e => { const c = structuredClone(e); delete c.axes[axis]; if (axis === "GOAL_DRIVE") delete c.axes.LEADERSHIP; return c; });
      expect(claim(integrated(atoms), "S08", b), axis).toBeUndefined();
    }
  });
  it.each(["CHEONEUL", "DOHWA", "HONGYEOM", "JANGSEONG", "BANAN", "MUNCHANG", "HAKDANG", "HYEONCHIM"] as const)("%s alone cannot produce strong claims", key => {
    const p = claims(myProfile([marker(key)]), realMbti("ENFJ"));
    expect(p.candidates.every(c => c.level < 3)).toBe(true);
    expect(p.candidates.some(c => c.customerClaim === "사람복이 있습니다.")).toBe(false);
  });
  it("장성+반안 share a family and still need natal officer/leadership", () => {
    const m = myProfile([marker("JANGSEONG"), marker("BANAN")]);
    expect(claim(m, "S09", realMbti("ENTJ"))).toBeUndefined();
    expect(claim(m, "S03", realMbti("ENTJ"))).toBeUndefined();
  });
  it("천을's two tags are not two independent supports; L4 requires a real composite", () => {
    expect(claim(myProfile([marker("CHEONEUL")]), "P01")).toBeUndefined();
    expect(claim(myProfile([marker("CHEONEUL"), marker("CHEONDEOK")]), "P01")).toBeUndefined();
    const m = strong({ CARE: 2, SOCIAL_ATTUNEMENT: 2 }, [marker("CHEONEUL")]);
    expect(claim(m, "P01")?.level).toBe(3);
    const composite = withComposite(m, "WEAK_SELF_PEER_SUPPORT", ["CARE"]);
    expect(claim(composite, "P01")?.customerClaim).toBe("사람복이 있습니다.");
  });
  it("first impression and intimacy remain different claims with distinct tag gates", () => {
    const m = strong({ CHARISMA: 2, CARE: 2 }, [marker("DOHWA")]);
    expect(claim(m, "A01")).toBeDefined(); expect(claim(m, "A02")).toBeUndefined();
    const both = strong({ CHARISMA: 2, CARE: 2 }, [marker("DOHWA"), marker("HONGYEOM")]);
    expect(claim(both, "A01")?.customerClaim).not.toBe(claim(both, "A02")?.customerClaim);
  });
});

describe("fact bombs are evidence-sensitive, not insults", () => {
  it("precision alone never invents lateness", () => {
    const axes = { PRECISION: 2, STRUCTURE_STYLE: 2 };
    expect(claim(strong(axes), "F03")?.customerClaim).toBe("남들이 충분히 잘됐다고 해도 고칠 부분부터 먼저 보는 편입니다.");
    expect(claim(strong({ ...axes, ACTION_TEMPO: -1 }), "F03")?.customerClaim).toContain("시작이나 마감이 늦어지기도");
    expect(claim(strong({ ...axes, DECISION_STYLE: -1 }), "F03")?.customerClaim).not.toContain("늦어");
    expect(claim(strong({ DEPTH: 2, CURIOSITY: 2 }), "F05")).toBeUndefined();
  });
  it("actual slow-before / fast-after conflict preserves both claims and fusion IDs", () => {
    const m = strong({ DEPTH: 2, CURIOSITY: 2, ACTION_TEMPO: -2 });
    const b = mbtiProfile(repeated({ ACTION_TEMPO: 2, DECISION_STYLE: 2 }));
    const p = claims(m, b), pair = p.candidates.filter(c => ["F05_OVERTHINKING", "F06_TOO_FAST"].includes(c.id));
    expect(pair).toHaveLength(2); expect(pair.every(c => c.conflictGroupId === "DECISION_TIMING")).toBe(true);
    expect(p.diagnostics.conflictGroups.find(g => g.id === "DECISION_TIMING")?.fusionIds.length).toBeGreaterThan(0);
  });
  it("F05 can reuse actual 편인 shadow, while F03 still needs timing evidence", () => {
    const shadow = myAtom("resource-shadow", { DEPTH: 2 }, { sourceKey: "偏印", family: "RESOURCE", strength: "MEDIUM", shadowMeaning: TEN_GOD_SEMANTICS.偏印.shadowMeaning });
    const m = strong({ DEPTH: 2, CURIOSITY: 2, PRECISION: 2, STRUCTURE_STYLE: 2 }, [shadow]);
    expect(claim(m, "F05")?.level).toBe(3);
    expect(claim(m, "F03")?.customerClaim).not.toContain("늦어");
    const invented = { ...shadow, shadowMeaning: "임의의 지연 해석" };
    expect(claim(strong({ DEPTH: 2, CURIOSITY: 2 }, [invented]), "F05")).toBeUndefined();
  });
  it("F06 keeps the real fast-but-planned complement without counting it twice", () => {
    const m = strong({ ACTION_TEMPO: 2, DECISION_STYLE: 2 });
    const b = mbtiProfile(repeated({ STRATEGY: 2, PRECISION: 2 }));
    const c = claim(m, "F06", b)!;
    expect(c.relatedFusionIds.some(id => id.includes("C021"))).toBe(true);
    expect(c.evidence.independentMyeongliFamilies).toHaveLength(2);
  });
  it("care with limits caps F07; fast but planned does not delete F06", () => {
    expect(claim(strong({ CARE: 2, DUTY: 2, BOUNDARY: 2 }), "F07")?.level).toBe(2);
    const m = strong({ CARE: 2, DUTY: 2 });
    const b = mbtiProfile(repeated({ BOUNDARY: 2, AUTONOMY: 2 }, 3, "RELATIONSHIPS"));
    const limited = claim(m, "F07", b)!;
    expect(limited.level).toBe(2); expect(limited.diagnostics.warnings).toContain("CARE_WITH_LIMITS_CAP_LEVEL2");
    expect(claim(strong({ ACTION_TEMPO: 2, DECISION_STYLE: 2, PRECISION: 2, STRATEGY: 2 }), "F06")).toBeDefined();
  });
  it("stable income and business opportunities are valid conflicting desires", () => {
    const p = claims(strong({ STABILITY: 2, DUTY: 1, RESOURCE_SENSE: 2, OPPORTUNITY_SENSE: 2, EXPANSION: 2, AUTONOMY: 1 }));
    expect(p.diagnostics.conflictGroups.find(g => g.id === "STABILITY_AND_OPPORTUNITY")?.claimIds).toHaveLength(2);
    expect(p.diagnostics.hardErrors).toEqual([]);
  });
});
