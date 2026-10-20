import { editorialLocks, expectEditorialFoundations } from "./productWideAssertions";
import { beforeAll, expect, it } from "vitest";
import locks from "./annualEditorialQualityLocks.json";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "./majorEditorialSafetyFixtures";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "./runtimeFixtures";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { annualMonthInteractions } from "../../../src/lib/interpretation-v4/annualInteractionReading";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { storedBook } from "../../../src/lib/book/storedReport";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";

const payload = (i: number, year = 2026) => ({ ...MAJOR_SAFETY_CASES[i].payload,
  productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { contentVersion: "v4", selectedYear: String(year) } });
async function generate(i: number, year = 2026, clock = MAJOR_SAFETY_CLOCK, policyDate?: string) {
  const g = await generateV4ShadowReport(payload(i, year), { ...clock, ...(policyDate ? { policyDate } : {}) });
  if (!g.ok) return expect.unreachable(JSON.stringify(g));
  const e = g.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "annual_fortune" || !("integration" in e.composition.result)) return expect.unreachable();
  return { g, e, r: e.composition.result };
}
type Sample = Awaited<ReturnType<typeof generate>>;
const results: Sample[] = [];
beforeAll(async () => { for (let i = 0; i < 6; i++) results.push(await generate(i)); }, 120000);
const allBlocks = (s: Sample) => [...s.r.narrative.opening, ...s.r.narrative.sections.flatMap(section => section.blocks)];

it.each([0, 1, 2, 3, 4, 5])("A-F %s preserves all calculated evidence and actual MBTI/Fusion integration", i => {
  const { r, g } = results[i], lock = locks.annual["ABCDEF"[i] as "A"];
  expect(v4Digest(r.evidence)).toBe(lock.evidence);
  expect(v4Digest(r.materials)).toBe(lock.materials);
  expect(v4Digest(r.integration)).toBe(lock.integration);
  expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, n) => n + 1));
  const refs = new Set(r.evidence.segments.flatMap(s => s.evidenceIds));
  for (const m of r.months) for (const b of m.blocks) for (const ref of b.proof.sourceRefs.filter(ref => ref.startsWith("month-v2:"))) expect(refs.has(ref), ref).toBe(true);
  expect(g.externalCalls).toEqual([]);
  expect(r.editorial).toEqual([]);
  expect(narrativeText(r.narrative)).not.toMatch(/힘에 힘|시간에서|목소리을|대화[’']?이|M[가-힣]+TI|undefined|NaN/);
});

it("C separates natal 편관 from 壬申 편재 and 丙午 편인 without dropping its source", () => {
  const s = results[2], chapter = s.r.narrative.sections.find(c => c.id === "dayun-cross")!;
  expect(chapter.blocks.find(b => b.id === "dayun-cross-1")!.text).toMatch(/丙午 세운은 편인, 壬申 대운은 편재/);
  const root = chapter.blocks.find(b => b.id === "dayun-cross-why-ten_god_qi_sha")!;
  expect(root.text).toContain("원국의 편관");
  expect(root.proof.sourceRefs).toContain("SajuCalcResult:tenGods.distribution:偏官");
  const fortune = s.r.narrative.sections.find(c => c.id === "fortune")!;
  expect(fortune.blocks.find(b => b.id === "fortune-planned-assertion")!.text).toContain("타고난 장점");
  expect(fortune.blocks[0].id).toBe("fortune-underneath");
});

it("same 겁재 has different facts, applications and cautions for A3/B7/C1", () => {
  const months = [results[0].r.months[2], results[1].r.months[6], results[2].r.months[0]];
  expect(months.map(m => m.god)).toEqual(["겁재", "겁재", "겁재"]);
  const readings = months.map(m => m.blocks.find(b => b.id.endsWith("-interaction"))!);
  expect(readings[0].proof.sourceRefs).toContain("month-v2:2026:3:2:month:2026:3:branch:형:子卯");
  expect(readings[1].proof.sourceRefs).toContain("month-v2:2026:7:2:month:2026:7:branch:반합:未卯");
  expect(readings[2].proof.sourceRefs).toContain("month-v2:2026:1:2:month:2026:1:branch:형:丑戌");
  expect(months[0].action.action).toContain("함께할 사람과 맡을 일");
  expect(readings[0].text).toMatch(/반복되는 부담|되풀이되는 부담/);
  expect(months[0].action.action).toContain("맡은 범위와 쉬어 갈 때");
  expect(months[1].action.action).toContain("동료와 공을 나누는 공동 업무");
  expect(readings[1].text).toContain("반합");
  expect(months[2].action.action).toContain("다른 전문가와 작업 범위");
  expect(readings[2].text).toMatch(/반복되는 부담|되풀이되는 부담/);
  expect(new Set(months.map(m => m.action.action)).size).toBe(3);
  expect(new Set(months.map(m => m.action.avoid)).size).toBe(3);
});

it("no fact, bad participants, missing IDs and conditional Dayun cannot create a relationship", () => {
  const e = results[0].r.evidence, m = e.months[2];
  expect(annualMonthInteractions(e, { ...m, focus: { ...m.focus, relationFacts: [] } }, "겁재")).toBeNull();
  expect(annualMonthInteractions(e, { ...m, focus: { ...m.focus, evidenceIds: [] } }, "겁재")).toBeNull();
  const branches = m.focus.relationFacts.filter(f => f.source !== "month_natal_element");
  expect(annualMonthInteractions(e, { ...m, focus: { ...m.focus, relationFacts: branches.map(f => ({ ...f, participants: [] })) } }, "겁재")).toBeNull();
  const cycle = e.months[9];
  const conditional = cycle.focus.relationFacts.flatMap(f => f.source === "month_dayun_branch" ? [{ ...f, certainty: "conditional" as const }] : []);
  expect(annualMonthInteractions(e, { ...cycle, focus: { ...cycle.focus, relationFacts: conditional } }, "편인")).toBeNull();
});

it("uncertain transition range is never described as one exact transition", () => {
  const e = results[0].r.evidence, m = e.months[2];
  const ended = annualMonthInteractions(e, { ...m, focus: { ...m.focus,
    boundaryReason: ["dayun_uncertainty_end"] } }, "겁재");
  expect(ended?.text).toContain("전환 가능 범위를 지난 뒤");
  expect(ended?.text).not.toContain("일 대운 전환 뒤");
  const noActive = annualMonthInteractions(e, { ...m, focus: { ...m.focus,
    activeDayunContext: { ...m.focus.activeDayunContext, status: "transition_uncertain" } } }, "겁재");
  expect(noActive?.sourceRefs.some(ref => ref.includes("month_dayun_branch"))).toBe(false);
});

it("unknown hour and MBTI remain absent rather than guessed", () => {
  for (const i of [3, 5]) {
    const { r } = results[i];
    expect(r.evidence.calculation.pillars.hour).toBeUndefined();
    expect(r.months.flatMap(m => m.blocks).filter(b => b.id.endsWith("-interaction")).some(b => b.text.includes("시지"))).toBe(false);
  }
  for (const i of [4, 5]) for (const b of allBlocks(results[i])) {
    expect(b.proof.fusionIds).toEqual([]);
    expect(b.proof.sourceRefs.some(ref => ref.startsWith("mbti:"))).toBe(false);
  }
});

it("learning month does not abruptly insert an unrelated intimacy gift", () => {
  const m = results[0].r.months[9];
  expect(m.god).toBe("편인");
  expect(m.selectedTransit?.feature).not.toBe("sinsal_hongyeom");
  expect(m.blocks.map(b => b.text).join(" ")).not.toContain("가까워질수록 살아나는 매력");
});

it("2024 辰戌 충 keeps actors, the scheduling criterion and the actual monthly action", async () => {
  const s = await generate(0, 2024), m = s.r.months[9];
  expect(v4Digest(s.r.evidence)).toBe(locks.annual["A-2024-leap"].evidence);
  const b = m.blocks.find(b => b.id.endsWith("-interaction"))!;
  expect(b.proof.sourceRefs).toContain("month-v2:2024:10:2:month_annual_branch:甲辰:충:辰戌");
  expect(b.text).toMatch(/甲辰 세운의 지지 辰.*월운 지지 戌.*辰·戌 충/);
  expect(b.text).toContain("일정과 역할을 조정");
  expect(m.action.action).toContain("새 고객층");
  expect(m.blocks.map(b => b.text).join(" ")).not.toContain("바깥 기회와 돈의 연결을 중요하게 보면서도");
  expect(s.r.narrative.sections.at(-1)!.title).toBe("2024년에서 가져갈 배움");
  expect(s.r.editorial).toEqual([]);
}, 120000);

it("present and explicit offline future titles; actual 2027 purchase policy still rejects", async () => {
  expect(results[0].r.narrative.sections.at(-1)!.title).toBe("올해를 잘 쓰는 핵심");
  const future = await generate(0, 2027, MAJOR_SAFETY_CLOCK, "2027-10-12T12:00:00+09:00");
  expect(future.r.narrative.sections.at(-1)!.title).toBe("2027년을 준비하는 기준");
  expect(v4Digest(future.r.evidence)).toBe(locks.annual["A-2027-simulation"].evidence);
  const blocked = await generateV4ShadowReport(payload(0, 2027), MAJOR_SAFETY_CLOCK);
  expect(blocked.ok).toBe(false);
  expect(JSON.stringify(blocked)).toContain("SELECTED_YEAR_INVALID");
}, 120000);

it.each([-1000, 0, 1000])("Lichun exact boundary %s ms retains real year/month and relation intervals", async delta => {
  const at = new Date(Date.parse("2026-02-04T05:02:08+09:00") + delta).toISOString();
  const s = await generate(0, 2026, { evaluatedAt: at }), m = s.r.months[1];
  expect(m.focus.monthPillar).toEqual(delta < 0 ? { stem: "己", branch: "丑" } : { stem: "庚", branch: "寅" });
  expect(m.focus.effectiveAnnualPillar).toEqual(delta < 0 ? { stem: "乙", branch: "巳" } : { stem: "丙", branch: "午" });
  expect(s.r.editorial).toEqual([]);
  expect(narrativeText(s.r.narrative)).not.toContain("午과");
}, 120000);

it.each([-1000, 0, 1000])("2028 Dayun boundary %s ms never extends the old cycle beyond its interval", async delta => {
  const at = new Date(Date.parse("2028-04-23T21:42:00+09:00") + delta).toISOString();
  const s = await generate(2, 2028, { evaluatedAt: at }), m = s.r.months[3];
  expect(m.focus.activeDayunContext.cycles[0].ganji).toBe(delta < 0 ? "壬申" : "辛未");
  const interaction = m.blocks.find(b => b.id.endsWith("-interaction"));
  for (const ref of interaction?.proof.sourceRefs ?? []) expect(m.focus.evidenceIds).toContain(ref);
  if (delta >= 0) expect(interaction?.text ?? "").not.toContain("壬申 대운");
  expect(s.r.editorial).toEqual([]);
}, 120000);

it.each([0, 1, 2, 3, 4, 5])("A-F %s deterministic publication and immutable JSON Book owner/shared projection", async i => {
  const s = results[i];
  expect((await generate(i)).g).toEqual(s.g);
  expect(validateV4Publication("annual_fortune", s.g.draft, s.e)).toEqual({ ok: true, errors: [] });
  const made = createProductPreviewSnapshot({ reportId: `annual-editorial-${i}`, createdAtIso: s.e.generatedAt,
    productKey: "annual_fortune", productSlug: "annual-fortune", draft: s.g.draft as ProductPreviewSnapshotDraft, evidencePacket: s.e });
  if (!made.ok) return expect.unreachable();
  const saved = JSON.parse(JSON.stringify(made.value)), digest = v4Digest(saved), book = projectBook(s.e);
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(digest);
}, 120000);

it.each(locks.products)("protected product $id keeps current copy receipts and original source facts", async lock => {
  const f = RUNTIME_FIXTURES.find(f => f.id === lock.id)!;
  const g = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
  if (!g.ok) return expect.unreachable();
  expect([v4Digest(g.draft), v4Digest(g.evidencePacket), v4Digest(projectBook(g.evidencePacket as V4RuntimeEvidence))]).toEqual(editorialLocks.groups.runtime[f.id as keyof typeof editorialLocks.groups.runtime]);
  expectEditorialFoundations(g.evidencePacket as V4RuntimeEvidence, f.payload, SHADOW_CLOCK);
}, 120000);
