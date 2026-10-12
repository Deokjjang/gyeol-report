import { beforeAll, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { majorInteractionReading } from "../../../src/lib/interpretation-v4/majorInteractionReading";
import { majorYearPeriod } from "../../../src/lib/interpretation-v4/majorPeriodCopy";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK as clock } from "./majorEditorialSafetyFixtures";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { MAJOR_NARRATIVE_FIXTURES } from "./majorFixtures";
import { RUNTIME_FIXTURES } from "./runtimeFixtures";
import locks from "./majorReaderQualityLocks.json";

const main = { productKey: "major_fortune", productSlug: "major-fortune", person: { name: "윤시우", birthDate: "1983-09-02", birthTime: "05:10", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, birthTimePrecision: "exact", approximateBirthTimeSlot: "" },
  userContext: { jobStatus: "employee", detailJob: "기획자", relationshipStatus: "", focusAreas: [] }, productOptions: { contentVersion: "v4" } };
const cases = [{ id: "S", payload: main }, ...MAJOR_SAFETY_CASES.map((f, i) => ({ id: "ABCDEF"[i], payload: f.payload })),
  { id: "S-mbti", payload: { ...main, person: { ...main.person, mbtiType: "" } } }];
async function generate(payload: unknown, evaluatedAt = clock.evaluatedAt) {
  const g = await generateV4ShadowReport(payload, { evaluatedAt });
  if (!g.ok) return expect.unreachable(JSON.stringify(g));
  const e = g.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "major_fortune" || !("integration" in e.composition.result)) return expect.unreachable();
  return { g, e, r: e.composition.result };
}
type Sample = Awaited<ReturnType<typeof generate>>;
const samples = new Map<string, Sample>();
const body = ({ r }: Sample) => [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].map(b => b.text).join("\n");
const year = (id: string, y: number) => samples.get(id)!.r.years.find(r => r.year === y)!;
beforeAll(async () => { for (const f of cases) samples.set(f.id, await generate(f.payload)); }, 120000);

it.each(cases)("$id: exact baseline calculations, complete evidence, MBTI/Fusion and 14 years", ({ id, payload }) => {
  const { e, r, g } = samples.get(id)!;
  expect(v4Digest({ calculations: e.calculations, evidence: r.evidence, materials: r.materials, integration: r.integration,
    periods: r.years.map(y => ({ year: y.year, annual: y.annual, cycle: y.cycle, beforeCycle: y.beforeCycle, age: y.age, timePosition: y.timePosition })) })).toBe(locks.major[id as keyof typeof locks.major].invariant);
  expect(r.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
  expect(r.editorial).toEqual([]); expect(g.externalCalls).toEqual([]);
  expect(body(samples.get(id)!)).not.toMatch(/선택에 보탤 내 바탕은|의 반대편도 살펴보세요|연결되는 역할과 약속의 범위 확인|감각을 믿고 맡겼다는|붙드는 시간에서 당연하게|오래 지킬 선택을 오래 지켜|함께할 사람의 기준을 함께 다룰|꾸준히 보여줄 솜씨를 잘 만든다는|정재을|편인였습니다|\$\{|undefined|NaN/);
  for (const y of r.years) for (const b of y.blocks) {
    for (const ref of b.proof.sourceRefs.filter(ref => /^major:\d+:[^:]+:year:/.test(ref))) expect(y.annual.evidenceIds).toContain(ref);
    for (const feature of b.proof.features) expect(r.materials.selected.some(m => m.feature === feature)).toBe(true);
    for (const seed of b.proof.seedIds) {
      const root = r.materials.selected.find(m => m.material.seeds.some(s => s.id === seed));
      expect(root, seed).toBeDefined(); expect(b.proof.features).toContain(root!.feature);
      expect(b.proof.sourceRefs).toEqual(expect.arrayContaining([...root!.sourceRefs]));
    }
  }
  if (!payload.person.mbtiType) { expect(r.materials.fusions).toEqual([]); expect(body(samples.get(id)!)).not.toMatch(/ENTJ|INFJ|ENFP/); }
  if (payload.person.birthTimeUnknown) expect(r.evidence.calculation.pillars.hour).toBeUndefined();
});

it("S 2027/2029/2032 bind different harmony scopes to actual yearly decisions", () => {
  const r = samples.get("S")!.r;
  const cases = [[2027, "삼합", "亥·卯·未", "공통 목표와 각자의 기여", "외부 제안"],
    [2029, "육합", "辰·酉", "종료 조건", "도움을 청할 기준"], [2032, "반합", "子·申", "작은 시도", "서로 보탤 실력"]] as const;
  for (const [n, type, branches, action, focus] of cases) {
    const y = year("S", n), reading = majorInteractionReading(r.evidence, y), gift = y.blocks.find(b => b.id === `${n}-gift`)!;
    expect(gift.text).toContain(type); expect(gift.text).toContain(branches); expect(gift.text).toContain(action); expect(gift.text).toContain(focus);
    for (const ref of reading.harmonyIds) expect(gift.proof.sourceRefs).toContain(ref);
  }
  expect(year("S", 2027).blocks.find(b => b.id === "2027-gift")!.text).toContain("원국 연지 亥·원국 시지 卯");
  expect(year("S", 2029).blocks.find(b => b.id === "2029-gift")!.text).toContain("대운 丙辰의 지지 辰");
  expect(year("S", 2032).blocks.find(b => b.id === "2032-gift")!.text).toContain("원국 월지 申");
});

it.each([[2023, 2033], [2024, 2034], [2025, 2035], [2026, 2036]])("same god %s/%s compares the actual changed major and decision", (a, b) => {
  const first = year("S", a), later = year("S", b), c = later.blocks.find(v => v.id === `${b}-character`)!;
  expect(first.annual.tenGod).toBe(later.annual.tenGod); expect(first.cycle.ganji).toBe("丙辰"); expect(later.cycle.ganji).toBe("乙卯");
  expect(c.text).toContain(`${a}년(丙辰·정재)`); expect(c.text).toContain("손으로 만들어 남기는 결과");
  expect(first.blocks.find(v => v.id === `${a}-gift`)!.proof.seedIds).not.toEqual(later.blocks.find(v => v.id === `${b}-gift`)!.proof.seedIds);
});

it("2034 expression selects the actual precision/work seed instead of intimate attraction", () => {
  const y = year("S", 2034), gift = y.blocks.find(b => b.id === "2034-gift")!;
  expect(gift.proof.features).toContain("sinsal_hyeonchim"); expect(gift.proof.seedIds).toContain("sinsal_hyeonchim:work");
  expect(gift.text).toContain("숫자와 설명이 맞지 않는 곳");
  expect(y.blocks.some(b => b.proof.features.includes("sinsal_hongyeom"))).toBe(false);
});

it("2031 prose, contents, timeline and notes qualify the post-November period", () => {
  const { r, e } = samples.get("S")!, y = year("S", 2031), period = majorYearPeriod(r.evidence, y), book = projectBook(e)!;
  expect(period.explanation).toContain("2031년 연초부터 2031-11-30 15:10:00 KST 직전까지는 丙辰(정재)");
  expect(period.explanation).toContain("같은 시각부터 乙卯(식신)"); expect(period.explanation).toContain("남은 기간");
  const section = r.narrative.sections.find(s => s.id === "year-2031")!;
  expect(section.title).toContain("2031-11-30 15:10 한국시간 전후");
  expect(y.blocks.find(b => b.id === "2031-character")!.text).not.toContain("2031년은 乙卯");
  const timeline = book.pages.find(p => p.kind === "timeline")!;
  if (timeline.kind !== "timeline") return expect.unreachable();
  expect(timeline.years.find(y => y.year === 2031)).toMatchObject({ cycle: "丙辰 → 乙卯", transition: "2031-11-30 15:10 한국시간 전후" });
  const page = book.pages.find(p => p.id === "chapter-year-2031")!;
  if (page.kind !== "narrative") return expect.unreachable();
  expect(page.notes.some(n => n.text.includes("丙辰 → 乙卯") && n.text.includes("전환 완료 뒤"))).toBe(true);
  const contents = book.pages.find(p => p.kind === "contents")!;
  if (contents.kind !== "contents") return expect.unreachable();
  expect(contents.entries.some(c => c.title.includes("2031-11-30 15:10"))).toBe(true);
});

it("2031 transition instant minus 1ms / exact / plus 1ms uses canonical active cycle", async () => {
  const t = samples.get("S")!.r.evidence.horizon.transitions[0], at = Date.parse(t.startSolarKst!);
  expect(t.startSolarKst).toBe("2031-11-30T15:10:00+09:00");
  for (const delta of [-1, 0, 1]) {
    const { r } = await generate(main, new Date(at + delta).toISOString());
    expect(r.evidence.horizon.activeCycle?.ganji).toBe(delta < 0 ? "丙辰" : "乙卯");
  }
}, 120000);

it("time-unknown ranges stay ranges; S's existing uncertain policy stays blocked", async () => {
  for (const id of ["D", "F"]) {
    const { r } = samples.get(id)!;
    for (const t of r.evidence.horizon.transitions) {
      expect(t.startSolarKst).toBeNull();
      expect(majorYearPeriod(r.evidence, year(id, t.year)).explanation).toContain("두 시각 사이에는 대운을 확정하지 않습니다");
    }
  }
  for (const mbtiType of ["ENTJ", ""]) {
    const g = await generateV4ShadowReport({ ...main, person: { ...main.person, birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", mbtiType } }, clock);
    expect(g).toMatchObject({ ok: false, error: { validationErrors: ["DAYUN_UNCERTAIN"] } });
  }
});

it("no relations / missing reason / mismatched actors never invent a reading", () => {
  const { r } = samples.get("B")!, y = year("B", 2028);
  expect(majorInteractionReading(r.evidence, y)).toMatchObject({ harmony: "", tension: "", harmonyAction: "", tensionAction: "" });
  const s = samples.get("S")!.r, real = year("S", 2027);
  for (const annual of [{ ...real.annual, reasons: [] }, { ...real.annual, natalRelations: real.annual.natalRelations.map(v => ({ ...v, branches: ["子"] as typeof v.branches })) }]) {
    expect(majorInteractionReading(s.evidence, { ...real, annual }).harmony).toBe("");
  }
});

it.each(cases)("$id deterministic paid generation, lossless Book and owner/shared snapshot reopen", async ({ id, payload }) => {
  const { g, e, r } = samples.get(id)!, book = projectBook(e)!;
  expect(await generateV4ShadowReport(payload, clock)).toEqual(g);
  expect(validateV4Publication("major_fortune", g.draft, e)).toEqual({ ok: true, errors: [] });
  expect(book.pages.filter(p => p.kind === "narrative").flatMap(p => p.paragraphs.map(b => b.text)))
    .toEqual([...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].map(b => b.text));
  const made = createProductPreviewSnapshot({ reportId: `reader-${id}`, createdAtIso: e.generatedAt, productKey: "major_fortune", productSlug: "major-fortune", draft: g.draft as ProductPreviewSnapshotDraft, evidencePacket: e });
  expect(made.ok).toBe(true); if (!made.ok) return;
  const saved = JSON.parse(JSON.stringify(made.value)), hash = v4Digest(saved);
  expect(storedBook(saved)?.data).toEqual(book); expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(hash);
}, 120000);

it("S all Book pages render without lost paragraphs or leaked internal IDs", () => {
  const book = projectBook(samples.get("S")!.e)!;
  for (const page of book.pages) {
    const html = renderToStaticMarkup(createElement(BookReader, { data: book, page, onPage() {}, onNote() {}, onShare() {} }));
    expect(html).not.toMatch(/sourceRefs|ten_god_|NaN|\[object Object\]/);
    if (page.kind === "narrative") for (const b of page.paragraphs) expect(html).toContain(renderToStaticMarkup(createElement("span", null, b.text)).slice(6, -7));
  }
});

it.each(RUNTIME_FIXTURES.filter(f => f.payload.productKey !== "major_fortune"))("$id other product draft/full evidence/Book hashes match untouched Base", async f => {
  const g = await generateV4ShadowReport(f.payload, clock); expect(g.ok).toBe(true); if (!g.ok) return;
  expect([v4Digest(g.draft), v4Digest(g.evidencePacket), v4Digest(projectBook(g.evidencePacket as V4RuntimeEvidence))])
    .toEqual(locks.products.find(p => p.id === f.id)!.hashes);
}, 120000);

it("same-participant harmony and strain are explained once, with both proofs and distinct actions", async () => {
  const r = await composeMajorFortuneNarrative(MAJOR_NARRATIVE_FIXTURES[5].payload, clock.evaluatedAt);
  expect(r.ok).toBe(true); if (!r.ok) return;
  expect(r.editorial).toEqual([]);
  const y = r.years.find(y => y.year === 2031)!, reading = majorInteractionReading(r.evidence, y);
  expect(reading.harmony).toContain("寅·亥 육합"); expect(reading.harmony).toContain("寅·亥 파"); expect(reading.tension).toBe("");
  const harmony = y.blocks.find(b => b.id === "2031-harmony")!, friction = y.blocks.find(b => b.id === "2031-friction")!;
  expect(harmony.text).toContain("寅·亥 육합"); expect(harmony.text).toContain("寅·亥 파");
  expect(harmony.text.match(/대운 丙寅의 지지 寅/g)).toHaveLength(1);
  expect(harmony.proof.sourceRefs).toEqual(expect.arrayContaining([...reading.harmonyIds, ...reading.tensionIds]));
  expect(friction.text).toContain(reading.tensionAction); expect(friction.proof.sourceRefs).toEqual(expect.arrayContaining(reading.tensionIds));
});
