import { beforeAll, describe, expect, it } from "vitest";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { separateMajorChapter } from "../../../src/lib/interpretation-v4/majorEvidenceReading";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
import locks from "./majorEvidenceSeparationLocks.json";
import { editorialLocks, editionRow, expectHistoricalEditorialFiles } from "../../helpers/versionedEditorialLocks";

const results = new Map<string, Extract<V4RuntimeEvidence["composition"], { product: "major_fortune" }>["result"]>();
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES) {
    const g = await generateV4ShadowReport(f.payload, MAJOR_SAFETY_CLOCK);
    expect(g.ok).toBe(true);
    if (!g.ok) continue;
    expect(validateV4Publication("major_fortune", g.draft, g.evidencePacket)).toEqual({ ok: true, errors: [] });
    const e = g.evidencePacket as V4RuntimeEvidence;
    if (e.composition.product === "major_fortune") results.set(f.id, e.composition.result);
  }
}, 120000);

describe("Major natal and cycle evidence separation", () => {
  it.each(MAJOR_SAFETY_CASES)("$id: base calculations, all 14 year stories, transitions and selection remain identical", ({ id }) => {
    const r = results.get(id)!;
    expectHistoricalEditorialFiles();
    const current = editionRow(editorialLocks.majorSeparation, id);
    const frozen: Record<string, unknown> = Object.fromEntries(["evidence", "materials", "yearPlan", "years", "transitions", "behaviorBasis", "completeness", "contentPlan", "integration"]
      .map(k => [k, r[k as keyof typeof r]]));
    frozen.sections = r.narrative.sections.filter(s => !["core", "current-context", "relationships", "next-cycle"].includes(s.id));
    expect(v4Digest(frozen)).toBe(current.frozen);
    expect(r.years).toHaveLength(14);
    expect(r.editorial).toEqual([]);
    const blocks = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)];
    for (const blockId of Object.keys(locks.rows[id as keyof typeof locks.rows].blocks)) {
      const b = blocks.find(b => b.id === blockId)!;
      expect(b, blockId).toBeDefined();
    }
    // Later reviewed interaction/personalization editions change annual copy.
    // Pin every current block and proof separately from the immutable old locks.
    expect(Object.fromEntries(blocks.map(b => [b.id, { text: v4Digest(b.text), proof: v4Digest(b.proof) }]))).toEqual(current.blocks);
    const active = r.evidence.horizon.activeCycle!;
    const next = r.evidence.horizon.transitions.find(t => t.after.index > active.index)!.after;
    for (const blockId of ["next-boundary", "next-work"]) {
      const refs = blocks.find(b => b.id === blockId)!.proof.sourceRefs;
      for (const cycle of [active, next]) {
        expect(refs).toContain(`dayun-cycle:${cycle.index}:${cycle.ganji}`);
        expect(refs).toContain(`period-ten-god:${cycle.tenGod}`);
      }
    }
    expect(blocks.find(b => b.id === "big-flow")!.text).toContain(`${active.ganji} 대운에서 읽는 십성은 ${active.tenGod}`);
    for (const s of r.narrative.sections.filter(s => ["current-context", "next-cycle"].includes(s.id))) {
      const application = s.blocks.find(b => b.id.endsWith("-natal-application"));
      if (!application) continue;
      const cycle = s.id === "next-cycle" ? next : active;
      expect(application.text).toContain("자신의 모습과 맞는다면");
      expect(application.proof.sourceRefs).toContain(`dayun-cycle:${cycle.index}:${cycle.ganji}`);
      expect(application.proof.sourceRefs).toContain(`period-ten-god:${cycle.tenGod}`);
      expect(application.proof.features).toHaveLength(1);
      const natal = r.materials.selected.find(m => m.feature === application.proof.features[0])!;
      expect(natal).toBeDefined();
      expect(natal.evidence.every(e => e.usable)).toBe(true);
      expect(application.proof.sourceRefs.some(ref => ref.startsWith("SajuCalcResult:tenGods.distribution:"))).toBe(true);
      expect(application.proof.fusionIds).toEqual([]);
      expect(application.proof.sourceRefs.some(ref => ref.startsWith("mbti:"))).toBe(false);
    }
  });

  it.each([
    ["02-employee", "戊寅", "편재", "정재", "ten_god_zheng_cai", "正財"],
    ["03-freelance", "辛未", "상관", "편관", "ten_god_qi_sha", "偏官"],
  ])("%s: B/C actual transit is distinct from natal ten-god and MBTI", (id, ganji, god, natal, feature, source) => {
    const s = results.get(id)!.narrative.sections.find(s => s.id === "next-cycle")!;
    expect(s.blocks[0].text).toContain(`다음 ${ganji} 대운에서 읽는 십성은 ${god}입니다.`);
    const own = s.blocks.find(b => b.id === `next-cycle-why-${feature}`)!;
    expect(own.text).toContain(`태어날 때의 사주, 원국에서 읽습니다. ${natal}`);
    expect(own.proof.sourceRefs).toContain(`SajuCalcResult:tenGods.distribution:${source}`);
    expect(own.proof.sourceRefs.some(ref => ref.startsWith("period-ten-god:"))).toBe(false);
    expect(s.blocks.indexOf(own)).toBeGreaterThan(s.blocks.findIndex(b => b.id === "next-risk"));
    const mbti = s.blocks.find(b => b.id.startsWith("next-cycle-synthesis-"))!;
    expect(mbti.text).toContain("새 대운의 십성과는 별개로");
    expect(mbti.proof.sourceRefs.some(ref => ref.startsWith("period-ten-god:"))).toBe(false);
    expect(s.blocks.at(-1)!.text).toContain(`타고난 ${natal}`);
  });

  it("no natal material or no shared practical context: no invented connection", () => {
    const r = results.get("02-employee")!;
    const own = r.narrative.sections.find(s => s.id === "next-cycle")!.blocks.find(b => b.id === "next-cycle-why-ten_god_zheng_cai")!;
    const period = { ganji: "甲子", tenGod: "정인" as const, proof: { features: [], seedIds: [], fusionIds: [], sourceRefs: ["dayun-cycle:0:甲子", "period-ten-god:정인"] } };
    // 정재 and 정인 share identity, but none of work/money/learning.
    for (const packet of [r.materials, { ...r.materials, selected: [] }]) {
      expect(separateMajorChapter("next-cycle", [own], packet, period).some(b => b.id.endsWith("-natal-application"))).toBe(false);
    }
    const missing = { ganji: "戊寅", tenGod: "편재" as const, proof: { ...period.proof, sourceRefs: [] } };
    expect(separateMajorChapter("next-cycle", [own], r.materials, missing).some(b => b.id.endsWith("-natal-application"))).toBe(false);
  });
});
