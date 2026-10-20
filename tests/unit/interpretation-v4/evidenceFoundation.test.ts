import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import { validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import {
  compareMaterialIndependence, inspectEvidenceFoundation, inspectMaterialCoverage,
} from "../../../src/lib/interpretation-v4/evidenceFoundation";
import type { FoundationReference } from "../../../src/lib/interpretation-v4/evidenceFoundation";
import type { NarrativeBlock, NarrativeSection } from "../../../src/lib/interpretation-v4/narrativeTypes";

const block = (id: string, text: string, feature: string, theme = "precision"): NarrativeBlock => ({
  id, text, tone: "observation", mode: "prose",
  editorial: { variant: "fixture", theme },
  proof: { features: feature ? [feature] : [], seedIds: [], fusionIds: [], sourceRefs: [] },
});
const reference = (id: string, basis: FoundationReference["basis"]): FoundationReference => ({
  id, basis, subject: "person", scope: basis === "input" ? "current-context" : "natal", support: "calculated",
  domains: ["identity"], lineage: [id], sourceRefs: ["fixture:calculated"], dependencies: [],
});
const section = (id: string, blocks: NarrativeBlock[], domain: NarrativeSection["domain"] = "identity"): NarrativeSection => ({
  id, title: id, domain, blocks,
});

describe("V4 evidence foundation: scope, independence, provenance, reuse", () => {
  it("tracks root support separately from input context and editorial labels", () => {
    const a = block("root", "이 사람의 실제 계산을 해석합니다.", "ten_god_shi_shen");
    const b = { ...block("input", "직업 입력에 대한 조건부 설명입니다.", ""), proof: {
      features: [], seedIds: [], fusionIds: [], sourceRefs: ["input:detailJob"],
    } };
    const c = { ...block("editorial", "연출용 문장입니다.", ""), proof: {
      features: [], seedIds: [], fusionIds: [], sourceRefs: ["v4:generic-narrative-template"],
    } };
    const r = inspectEvidenceFoundation({
      opening: [a], sections: [section("context", [b, c])],
    }, { references: [reference("ten_god_shi_shen", "natal"), reference("input:detailJob", "input")] });
    expect(r.chapters[0].rootedBlocks).toBe(1);
    expect(r.chapters[1].contextualBlocks).toBe(1);
    expect(r.chapters[1].supportedBlocks).toBe(1);
    expect(r.issues).toContainEqual({
      code: "GENERIC_REFERENCE_ONLY", location: "context/editorial", severity: "review",
    });
  });

  it("preserves distinction between two domains using the same root", () => {
    const r = inspectEvidenceFoundation({ opening: [block("a", "성향 설명", "root")],
      sections: [section("work", [block("b", "일에서의 표현", "root")], "work")] });
    expect(r.issues.some(i => i.code === "REUSED_THEME_WITHOUT_NEW_SUPPORT")).toBe(false);
  });

  it("signals reused themes with unchanged roots inside the same domain", () => {
    const r = inspectEvidenceFoundation({ opening: [block("a", "첫 문장", "root")],
      sections: [section("one", [block("b", "다른 장에서 같은 이야기", "root")]),
        section("two", [block("c", "새로운 근거", "new-root")])] },
      { references: [reference("root", "natal"), reference("new-root", "natal")] });
    expect(r.issues).toContainEqual({
      code: "REUSED_THEME_WITHOUT_NEW_SUPPORT", location: "one/b", severity: "review",
    });
    expect(r.issues.some(i => i.location === "two/c")).toBe(false);
  });

  it("detects duplicate chapter and local block IDs, missing and empty content", () => {
    const data = { opening: [block("a", "", "")], sections: [
      section("same", [block("a", "첫 문장", ""), block("a", "둘째 문장", "root")]),
      section("same", [block("c", "셋째 문장", "root")]),
    ] };
    const before = JSON.stringify(data);
    const r = inspectEvidenceFoundation(data);
    expect(r.issues.map(i => i.code)).toEqual(expect.arrayContaining([
      "DUPLICATE_CHAPTER_ID", "DUPLICATE_BLOCK_ID", "EMPTY_NARRATIVE", "MISSING_PROOF",
    ]));
    expect(JSON.stringify(data)).toBe(before);
  });

  it("checks reported roots against an optional verified material inventory", () => {
    const before = block("a", "계산 근거가 필요합니다.", "unverified-natal");
    const b: NarrativeBlock = { ...before, proof: { ...before.proof, fusionIds: ["unknown-fusion"] } };
    const r = inspectEvidenceFoundation({
      opening: [b], sections: [],
    }, { knownFeatures: ["known"], knownFusionIds: ["known-fusion"] });
    expect(r.issues.map(i => i.code)).toContain("UNKNOWN_FEATURE_REFERENCE");
    expect(r.issues.map(i => i.code)).toContain("UNKNOWN_FUSION_REFERENCE");
  });

  it("does not use different labels as independent support without lineage", () => {
    const a = { feature: "saju-a", category: "other", lineage: ["calc:root-1"] };
    const b = { feature: "saju-b", category: "other", lineage: ["calc:root-1", "calc:root-2"] };
    const c = { feature: "saju-c", category: "other", lineage: ["calc:root-3"] };
    expect(compareMaterialIndependence(a, b)).toBe("dependent");
    expect(compareMaterialIndependence(a, c)).toBe("independent");
    expect(compareMaterialIndependence(a, { ...c, lineage: [] })).toBe("unknown");
    expect(compareMaterialIndependence(a, a)).toBe("dependent");
    expect(compareMaterialIndependence(
      { feature: "master", category: "dayMaster", lineage: ["one"] },
      { feature: "pillar", category: "dayPillar", lineage: ["two"] },
    )).toBe("dependent");
  });

  it("separates unused verified materials, withheld materials and unseen roots", () => {
    type Packet = Parameters<typeof inspectMaterialCoverage>[1];
    const packet = {
      selected: [{ feature: "shown" }, { feature: "not-shown" }],
      held: [{ feature: "suppressed" }],
      fusions: [{ ruleId: "match" }, { ruleId: "not-selected" }],
    } as unknown as Packet;
    const authored = block("a", "첫 문장", "shown");
    const another = { ...block("b", "보류된 근거는 원고에 남으면 안 됩니다.", "suppressed"),
      proof: { features: ["suppressed", "outside"], fusionIds: ["match", "unmatched"], seedIds: [], sourceRefs: [] } };
    const r = inspectMaterialCoverage({ opening: [authored], sections: [section("one", [another])] }, packet);
    expect(r.realizedSelected).toEqual(["shown"]);
    expect(r.unusedSelected).toEqual(["not-shown"]);
    expect(r.referencedHeld).toEqual(["suppressed"]);
    expect(r.outsidePacketFeatures).toEqual(["outside"]);
    expect(r.realizedFusion).toEqual(["match"]);
    expect(r.outsidePacketFusion).toEqual(["unmatched"]);
  });

  it("does not block intentional fact reuse merely for sharing the same root", () => {
    const r = inspectEvidenceFoundation({ opening: [block("a", "앞의 설명", "root")],
      sections: [section("later", [block("b", "같은 근거의 다른 문단", "root")])] });
    expect(r.issues.every(issue => issue.severity === "review")).toBe(true);
  });
});


describe("six real V4 generators preserve Book shape with foundation inspection", () => {
  it.each(RUNTIME_FIXTURES)("$id produces an intact sealed Book without structural evidence errors", async ({ id, payload }) => {
    const generated = await generateV4ShadowReport(payload, SHADOW_CLOCK);
    expect(generated.ok, id).toBe(true);
    if (!generated.ok) return;
    const e = generated.evidencePacket as V4RuntimeEvidence;
    const audit = inspectEvidenceFoundation(e.composition.result.narrative);
    expect(audit.issues.filter(issue => issue.severity === "error"), id).toEqual([]);
    expect(audit.chapters.length, id).toBeGreaterThan(4);
    expect(validateV4Publication(e.productType, generated.draft, e)).toEqual({ ok: true, errors: [] });
  }, 120000);
});

describe("foundation producer-backed references", () => {
  it("never treats source prefixes or arbitrary feature labels as calculated facts", () => {
    const forged = { ...block("forged", "검사 문장", "invented"), proof: { features: ["invented"], seedIds: [], fusionIds: [], sourceRefs: ["period-ten-god:정재", "dayun-cycle:99:甲子", "input:jobStatus"] } };
    const result = inspectEvidenceFoundation({ opening: [forged], sections: [] });
    expect(result.chapters[0].supportedBlocks).toBe(0);
    expect(result.traces[0].references).toEqual([]);
  });
  it("recognizes actual semantic atoms without relabeling metadata as natal evidence", () => {
    const b = { ...block("atom", "실제 근거", ""), proof: { features: [], seedIds: [], fusionIds: [], sourceRefs: ["natal:day:stem:甲", "metadata:edition"] } };
    const result = inspectEvidenceFoundation({ opening: [b], sections: [] }, { references: [reference("natal:day:stem:甲", "natal")] });
    expect(result.chapters[0].rootedBlocks).toBe(1);
    expect(result.traces[0].unresolved).toEqual(["metadata:edition"]);
  });
  it("canonicalizes aliases and excludes metadata-only lineage from independent votes", () => {
    const a = { feature: "sinsal_dohwa", category: "marker", lineage: ["person:natal:sinsal_dohwa"] };
    expect(compareMaterialIndependence(a, { ...a, feature: "shinsal:TWELVE_NYEONSAL" })).toBe("dependent");
    expect(compareMaterialIndependence(a, { feature: "other", category: "marker", lineage: ["docs/source.json"] })).toBe("unknown");
    expect(compareMaterialIndependence({ ...a, subject: "personA" }, { ...a, subject: "personB" })).toBe("independent");
  });
});
