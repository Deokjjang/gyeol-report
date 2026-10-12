import { beforeAll, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
import locks from "./annualReaderQualityLocks.json";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK as clock } from "./majorEditorialSafetyFixtures";
import { RUNTIME_FIXTURES } from "./runtimeFixtures";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { annualMonthInteractions } from "../../../src/lib/interpretation-v4/annualInteractionReading";
import { projectBook } from "../../../src/app/dev/book-preview/bookProjection";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { storedBook } from "../../../src/lib/book/storedReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";

const main = { productKey: "annual_fortune", productSlug: "annual-fortune", person: { name: "한예린", birthDate: "2000-12-14", birthTime: "11:50", gender: "FEMALE", mbtiType: "INTJ", birthTimeUnknown: false, birthTimePrecision: "exact", approximateBirthTimeSlot: "" },
  userContext: { jobStatus: "student", detailJob: "", relationshipStatus: "", focusAreas: [] }, productOptions: { contentVersion: "v4", selectedYear: "2026" } };
const cases = [{ id: "H", payload: main }, ...MAJOR_SAFETY_CASES.map((f, i) => ({ id: "ABCDEF"[i], payload: { ...f.payload, productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: main.productOptions } })),
  ...["employee", "freelancer", "business_owner"].map(jobStatus => ({ id: `H-${jobStatus}`, payload: { ...main, userContext: { ...main.userContext, jobStatus } } })),
  { id: "H2025", payload: { ...main, productOptions: { ...main.productOptions, selectedYear: "2025" } } },
  { id: "H2027", payload: { ...main, productOptions: { ...main.productOptions, selectedYear: "2027" } }, clock: { ...clock, policyDate: "2027-10-12T12:00:00+09:00" } },
  { id: "C2028", payload: { ...MAJOR_SAFETY_CASES[2].payload, productKey: "annual_fortune", productSlug: "annual-fortune", productOptions: { ...main.productOptions, selectedYear: "2028" } }, clock: { ...clock, policyDate: "2028-10-12T12:00:00+09:00" } }];
async function generate(payload: unknown, at: typeof clock & { policyDate?: string } = clock) {
  const g = await generateV4ShadowReport(payload, at);
  if (!g.ok) return expect.unreachable(JSON.stringify(g));
  const e = g.evidencePacket as V4RuntimeEvidence;
  if (e.composition.product !== "annual_fortune" || !("integration" in e.composition.result)) return expect.unreachable();
  return { g, e, r: e.composition.result };
}
type Sample = Awaited<ReturnType<typeof generate>>;
const samples = new Map<string, Sample>();
beforeAll(async () => { for (const f of cases) samples.set(f.id, await generate(f.payload, "clock" in f ? f.clock : clock)); }, 120000);
const text = (s: Sample) => [...s.r.narrative.opening, ...s.r.narrative.sections.flatMap(c => c.blocks)].map(b => b.text).join("\n");

it.each(cases)("$id keeps baseline calculation, every relation ID, MBTI and Fusion", ({ id }) => {
  const { e, r, g } = samples.get(id)!;
  const lock = locks.annual[id as keyof typeof locks.annual];
  expect(v4Digest({ calculations: e.calculations, evidence: r.evidence, materials: r.materials, integration: r.integration })).toBe(lock.invariant);
  expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  expect(r.editorial).toEqual([]);
  expect(g.externalCalls).toEqual([]);
  for (const m of r.months) {
    for (const b of m.blocks) {
      const refs = b.id.endsWith("-interaction") ? m.focus.evidenceIds : r.evidence.months[m.month - 1].segments.flatMap(segment => segment.evidenceIds);
      for (const ref of b.proof.sourceRefs.filter(ref => ref.startsWith("month-v2:"))) expect(refs).toContain(ref);
    }
    const meaning = m.blocks.find(b => b.id.endsWith("-meaning"))!.text;
    expect(meaning).toContain(m.focus.monthPillar.stem + m.focus.monthPillar.branch);
    expect(meaning).toContain(m.god);
    expect(meaning).toContain(r.evidence.raw.dayMaster);
  }
  expect(text(samples.get(id)!)).not.toMatch(/목소리을|대화[’']?이|M[가-힣]+TI|undefined|NaN|시간의 흐름과 구분해 보면|대운·세운의 십성과는 별개로/);
});

it("H2/H4/H5 use different decisions for different real contacts, including the secondary tension", () => {
  const ms = samples.get("H")!.r.months;
  expect(ms[1].action.action).toContain("참여 비용");
  expect(ms[3].action.action).toContain("도움을 청할 기준");
  expect(ms[3].action.action).toContain("부담이 되풀이된다면");
  expect(ms[4].action.action).toContain("기한과 완료 기준");
  expect(ms[4].action.action).toContain("연결 가능성");
  for (const n of [2, 4, 5]) expect(ms[n - 1].action.action).not.toContain("이미 합의한 부분");
  const apr = ms[3].blocks.find(b => b.id.endsWith("-interaction"))!;
  expect(apr.text).toMatch(/원국 월지 子.*辰·子 반합.*원국 연지 辰.*辰·辰 형/);
  expect(apr.proof.sourceRefs).toContain("month-v2:2026:4:2:month:2026:4:branch:형:辰辰");
});

it("H10 connects both exact natal actors to output and scheduling, never guarantees harmony or failure", () => {
  const m = samples.get("H")!.r.months[9], b = m.blocks.find(b => b.id.endsWith("-interaction"))!;
  expect(b.text).toMatch(/원국 일지 午·시지 午.*戌·午 반합.*원국 연지 辰.*辰·戌 충/);
  expect(b.text).toContain("실제 결과로 보여줄");
  expect(m.action.action).toMatch(/발표나 실습.*기존 일정.*완성할 범위와 마무리 순서/);
  expect(b.proof.sourceRefs).toEqual(expect.arrayContaining(["month-v2:2026:10:2:month:2026:10:branch:반합:戌午", "month-v2:2026:10:2:month:2026:10:branch:충:辰戌"]));
});

it("H12 keeps external opportunity, time/cost, learning and the actual clash in one domain", () => {
  const m = samples.get("H")!.r.months[11];
  expect(m.god).toBe("편재");
  expect(m.action.action).toMatch(/외부 활동의 시간·비용·배울 내용.*기존 일정/);
  expect(m.blocks.map(b => b.text).join(" ")).not.toContain("가까운 사람과 정하는 약속");
  expect(m.blocks.find(b => b.id.endsWith("-interaction"))!.text).toMatch(/子·午 충.*子·辰 반합/);
  expect(samples.get("H")!.r.months[1].action).not.toEqual(m.action);
});

it("input context changes scenes/actions without changing a single calculated monthly fact", () => {
  const h = samples.get("H")!;
  for (const id of ["H-employee", "H-freelancer", "H-business_owner"]) {
    const s = samples.get(id)!;
    expect(s.e.calculations).toEqual(h.e.calculations);
    expect(s.r.months.map(m => m.focus)).toEqual(h.r.months.map(m => m.focus));
    expect(s.r.months.map(m => m.action.action)).not.toEqual(h.r.months.map(m => m.action.action));
  }
  expect(text(h)).not.toMatch(/시간을 파는|해법의 값을 받는|당신의 고객|연봉/);
  expect(text(h)).toContain("공부와 진로 탐색");
  expect(h.r.narrative.opening[1].text).toContain("상황이 달라진다면");
  expect(new Set(h.r.months.map(m => m.action.action)).size).toBe(12);
});

it("missing facts do not generate any relationship, or any constraints borrowed from another month", () => {
  const s = samples.get("H")!, m = s.r.evidence.months[1];
  expect(annualMonthInteractions(s.r.evidence, { ...m, focus: { ...m.focus, relationFacts: [] } }, "편재")).toBeNull();
  expect(samples.get("H")!.r.months[10].blocks.some(b => b.id.endsWith("-interaction"))).toBe(false);
  expect(samples.get("H")!.r.months[10].action.action).not.toMatch(/연결 가능성|기존 일정과 겹친다면/);
});

it.each(["hour", "mbti", "both"])("H unknown %s preserves absence and does not invent evidence", async missing => {
  const noTime = { birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", approximateBirthTimeSlot: "" };
  const s = await generate({ ...main, person: { ...main.person, ...(missing !== "mbti" ? noTime : {}), ...(missing !== "hour" ? { mbtiType: "" } : {}) } });
  expect(s.r.months).toHaveLength(12);
  expect(s.r.editorial).toEqual([]);
  if (missing !== "mbti") {
    expect(s.r.evidence.calculation.pillars.hour).toBeUndefined();
    expect(text(s)).not.toContain("시지");
  }
  if (missing !== "hour") {
    expect(s.r.integration.represented.flatMap(p => p.mbtiNodes)).toEqual([]);
    expect(text(s)).not.toMatch(/INTJ|MBTI의 성향/);
  }
}, 120000);

it("2025 is retrospective; 2027 is explicitly offline and still rejected operationally", async () => {
  expect(samples.get("H2025")!.r.narrative.sections.at(-1)!.title).toBe("2025년에서 가져갈 배움");
  expect(samples.get("H2027")!.r.narrative.sections.at(-1)!.title).toBe("2027년을 준비하는 기준");
  const blocked = await generateV4ShadowReport(cases.find(f => f.id === "H2027")!.payload, clock);
  expect(blocked.ok).toBe(false);
  expect(JSON.stringify(blocked)).toContain("SELECTED_YEAR_INVALID");
});

it("the reader's year ranges meet at the exact Lichun instant without claiming an overlapping day", () => {
  const blocks = samples.get("H")!.r.narrative.sections.find(s => s.id === "dayun-cross")!.blocks;
  expect(blocks.find(b => b.id === "dayun-cross-0")!.text).toContain("2월 4일 05:02:08 KST 직전까지");
  expect(blocks.find(b => b.id === "dayun-cross-1")!.text).toMatch(/^2월 4일 05:02:08 KST부터/);
  const boundary = samples.get("H")!.r.evidence.months[1].segments.find(s => s.boundaryReason.some(r => r.startsWith("jie:")))!;
  expect(boundary.startKst).toBe("2026-02-04T05:02:08+09:00");
});

it.each(["H", "A", "B", "C", "D", "E", "F"])("%s deterministic generation and lossless Book store/owner/shared reopen", async id => {
  const s = samples.get(id)!, f = cases.find(f => f.id === id)!;
  expect((await generate(f.payload)).g).toEqual(s.g);
  expect(validateV4Publication("annual_fortune", s.g.draft, s.e)).toEqual({ ok: true, errors: [] });
  const made = createProductPreviewSnapshot({ reportId: `annual-reader-${id}`, createdAtIso: s.e.generatedAt, productKey: "annual_fortune", productSlug: "annual-fortune", draft: s.g.draft as ProductPreviewSnapshotDraft, evidencePacket: s.e });
  if (!made.ok) return expect.unreachable();
  const saved = JSON.parse(JSON.stringify(made.value)), hash = v4Digest(saved), book = projectBook(s.e)!;
  expect(storedBook(saved)?.data).toEqual(book);
  expect(storedBook(saved, "https://gyeolreport.com/r/abcdefghijklmnopqrstuvwx")?.data).toEqual(book);
  expect(v4Digest(saved)).toBe(hash);
  expect(book.pages.filter(p => p.kind === "narrative").flatMap(p => p.paragraphs.map(b => b.text))).toEqual([...s.r.narrative.opening, ...s.r.narrative.sections.flatMap(c => c.blocks)].map(b => b.text));
  if (id === "H") for (const page of book.pages) expect(renderToStaticMarkup(createElement(BookReader, { data: book, page, onPage() {}, onNote() {}, onShare() {} }))).not.toMatch(/NaN|undefined|sourceRefs|\[object Object\]/);
}, 120000);

it.each(locks.products)("protected $id exact base narrative, evidence and Book hashes", async lock => {
  const f = RUNTIME_FIXTURES.find(f => f.id === lock.id)!;
  const g = await generateV4ShadowReport(f.payload, clock);
  if (!g.ok) return expect.unreachable();
  expect([v4Digest(g.draft), v4Digest(g.evidencePacket), v4Digest(projectBook(g.evidencePacket as V4RuntimeEvidence))]).toEqual(lock.hashes);
}, 120000);
