import { editorialLocks, expectEditorialFoundations } from "./productWideAssertions";
import { beforeAll, describe, expect, it } from "vitest";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { createMajorYearPersonalization } from "../../../src/lib/interpretation-v4/majorYearPersonalization";
import { majorInteractionReading } from "../../../src/lib/interpretation-v4/majorInteractionReading";
import { MATERIAL_BY_FEATURE } from "../../../src/lib/interpretation-v4/materialRegistry";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
import locks from "./majorPersonalizationLocks.json";
import { currentVersionRefs, expectLock } from "../../helpers/v5LmtLocks";

type Result = Extract<V4RuntimeEvidence["composition"], { product: "major_fortune" }>["result"];
const results = new Map<string, Result>();
const packets = new Map<string, V4RuntimeEvidence>();
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const g = await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK);
    expect(g.ok).toBe(true);
    if (!g.ok) continue;
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product !== "major_fortune") continue;
    results.set(f.id, e.composition.result); packets.set(f.id,e);
    expect(await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK)).toEqual(g);
  }
}, 120000);

const normalize = (text: string) => text.replace(/\d{4}년/g, "<YEAR>");
describe("Major evidence-bound personalization", () => {
  it.each(MAJOR_SAFETY_CASES)("$id: immutable calculations/periods/provenance with reviewed common copy", ({ id, payload }) => {
    const r = results.get(id)!;
    const invariant = { ...Object.fromEntries(["evidence", "materials", "yearPlan", "transitions", "behaviorBasis", "completeness", "contentPlan", "integration"].map(k => [k, r[k as keyof Result]])),
      narrative: { ...r.narrative, sections: r.narrative.sections.filter(s => !s.id.startsWith("year-")) },
      years: r.years.map(y => ({ ...Object.fromEntries(Object.entries(y).filter(([key]) => key !== "blocks")), blockIds: y.blocks.map(b => b.id) })) };
    const old = locks.rows[id as keyof typeof locks.rows];
    expectEditorialFoundations(packets.get(id)!, payload, MAJOR_SAFETY_CLOCK);
    expectLock(v4Digest(invariant), editorialLocks.groups.major[id as keyof typeof editorialLocks.groups.major]);
    expect(r.editorial).toEqual([]);
    for (const y of r.years) for (const b of y.blocks) {
      const previous = locks.proofs[old.proofs[b.id as keyof typeof old.proofs] as keyof typeof locks.proofs];
      for (const key of ["features", "seedIds", "fusionIds", "sourceRefs"] as const) expect(b.proof[key]).toEqual(expect.arrayContaining(currentVersionRefs(previous[key])));
      for (const seedId of b.proof.seedIds.filter(s => !(previous.seedIds as string[]).includes(s))) {
        const root = r.materials.selected.find(m => m.material.seeds.some(s => s.id === seedId));
        expect(root, seedId).toBeDefined();
        expect(root!.evidence.every(d => d.usable && d.strength === "strong")).toBe(true);
        expect(b.proof.features).toContain(root!.feature);
        expect(b.proof.sourceRefs).toEqual(expect.arrayContaining([...root!.sourceRefs]));
      }
      if (y.year >= 2029) expect(b.text).not.toContain(payload.userContext.detailJob);
    }
    for (const y of r.years) {
      const reading = majorInteractionReading(r.evidence, y), text = y.blocks.map(b => b.text).join(" ");
      for (const id of [...reading.harmonyIds, ...reading.tensionIds]) {
        expect(text).toContain(`${id.split(":")[8].split("").join("·")} ${id.split(":")[7]}`);
      }
      const gift = y.blocks.find(b => b.id === `${y.year}-gift`)!;
      const annual = [...MATERIAL_BY_FEATURE.values()].find(m => m.feature.startsWith("ten_god_") && m.label === y.annual.tenGod)!;
      for (const feature of gift.proof.features) {
        const root = r.materials.selected.find(m => m.feature === feature)!;
        expect(["dayMaster", "dayPillar"].includes(root.material.category)
          || MATERIAL_BY_FEATURE.get(feature)!.semanticTags.some(t => annual.semanticTags.includes(t))).toBe(true);
      }
    }
  });

  it.each([
    [2031, 2029, "sinsal_dohwa", "ten_god_qi_sha", "주목받는 힘", "책임감과 리더십"],
    [2035, 2033, "ten_god_zheng_guan", "gwiin_jaego", "조건이 불분명", "남기고 쌓는"],
    [2036, 2034, "twelve_sinsal_jangseong", "day_master_muto", "방향을 보여주는", "마지막까지 남아"],
  ] as const)("A %s / C %s: same annual god, genuinely different supported strengths", (ay, cy, af, cf, at, ct) => {
    const a = results.get("01-business")!.years.find(y => y.year === ay)!;
    const c = results.get("03-freelance")!.years.find(y => y.year === cy)!;
    expect(a.annual.tenGod).toBe(c.annual.tenGod);
    const ag = a.blocks.find(b => b.id === `${ay}-gift`)!, cg = c.blocks.find(b => b.id === `${cy}-gift`)!;
    expect(ag.proof.features).toContain(af); expect(cg.proof.features).toContain(cf);
    expect(ag.text).toContain(at); expect(cg.text).toContain(ct);
    // Check the actual authored seed text, not dates, participant names or terminology.
    const authored = (r: Result, ids: readonly string[]) => r.materials.selected.flatMap(m => m.material.seeds.filter(s => ids.includes(s.id)).map(s => s.text));
    expect(authored(results.get("01-business")!, ag.proof.seedIds)).not.toEqual(authored(results.get("03-freelance")!, cg.proof.seedIds));
    expect(a.blocks.every((b, i) => normalize(b.text) === normalize(c.blocks[i]?.text ?? ""))).toBe(false);
  });

  it("A/C repeated whole paragraphs decrease; remaining definitions need no synonym disguise", () => {
    const a = results.get("01-business")!.years.flatMap(y => y.blocks), c = results.get("03-freelance")!.years.flatMap(y => y.blocks);
    const shared = a.flatMap(b => c.filter(d => normalize(d.text) === normalize(b.text)).map(d => [b, d]));
    expect(shared.length).toBeLessThan(10); // 1bfe836 baseline: 10; pre-interaction audit: 21.
    for (const [b, d] of shared) {
      expect(b.proof.features.some(f => d.proof.features.includes(f))
        || b.proof.sourceRefs.some(ref => /^(period-ten-god:|content-period:)/.test(ref) && d.proof.sourceRefs.includes(ref))).toBe(true);
    }
  });

  it("B 2027 no longer repeats the procedure/meeting topic in all three paragraphs", () => {
    const y = results.get("02-employee")!.years.find(y => y.year === 2027)!;
    const scene = y.blocks.find(b => b.id === "2027-scene")!, gift = y.blocks.find(b => b.id === "2027-gift")!;
    expect(scene.text).toContain("이유를 알아야");
    expect(gift.proof.features).toContain("sinsal_gwimun");
    expect(gift.text).toContain("작은 단서");
    expect(scene.text + gift.text).not.toContain("반복되는 절차");
  });

  it("missing usable evidence retains the authored fallback; names do not choose variants", () => {
    const r = results.get("01-business")!, y = r.years.find(y => y.year === 2031)!;
    const empty = { ...r.evidence, materials: { ...r.evidence.materials, selected: [], fusions: [] } };
    expect(createMajorYearPersonalization(empty, [])(y, y.blocks)).toEqual(y.blocks);
    const renamed = { ...r.evidence, input: { ...r.evidence.input, name: "Different Name" } };
    expect(createMajorYearPersonalization(renamed, [])(y, y.blocks)).toEqual(createMajorYearPersonalization(r.evidence, [])(y, y.blocks));
  });
});
