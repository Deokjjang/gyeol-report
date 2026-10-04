import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const effects = vi.hoisted(() => ({ database: vi.fn() }));
vi.mock("@electric-sql/pglite", () => ({ PGlite: class {
  constructor() { effects.database(); }
} }));
import { generateReview } from "../../../../src/app/dev/content-review/generate";
import { manualReviewAllowed } from "../../../../src/app/dev/content-review/gate";
import { POST } from "../../../../src/app/dev/content-review/api/route";
import { CASES, emptyReview, applyReviewEvent, reviewContext, type ReviewEvent, type ReviewResult } from "../../../../src/app/dev/content-review/model";
import { bookInputPayload } from "../../../../src/lib/book/form";
import { generateV4ShadowReport } from "../../../../src/lib/interpretation-v4/runtimeShadow";
import * as runtime from "../../../../src/lib/interpretation-v4/runtimeShadow";
import { projectBook } from "../../../../src/app/dev/book-preview/bookProjection";
import type { V4RuntimeEvidence } from "../../../../src/lib/interpretation-v4/runtimeProjection";
import { BookReader } from "../../../../src/app/dev/book-preview/BookReader";
import { bookExperiencePublicEnabled } from "../../../../src/lib/book/publicGate";
import { accountPublicEnabled } from "../../../../src/lib/account/gate";
import { manualReviewFixtures, REVIEW_NOW } from "./manualReviewFixtures";
const samples = manualReviewFixtures(), results = new Map<string, ReviewResult>();
const source = (file: string) => readFileSync(file, "utf8");
async function run(id: string, payload: unknown) {
  const events: ReviewEvent[] = [];
  await generateReview(id, randomUUID(), payload, REVIEW_NOW, event => events.push(event));
  return events;
}
beforeAll(async () => {
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("NETWORK_FORBIDDEN"))));
  for (const sample of samples) {
    const events = await run(sample.id, sample.payload), ready = events.at(-1)!;
    expect(ready, sample.id).toMatchObject({ phase: "ready" });
    expect(events.map(e => e.phase)).toEqual(["validating", "generating", "validating-output", "ready"]);
    results.set(sample.id, ready.result!);
  }
  expect(fetch).not.toHaveBeenCalled();
  mkdirSync("/tmp/gyeol-v4-12c", { recursive: true });
  writeFileSync("/tmp/gyeol-v4-12c/fixtures.json", JSON.stringify(samples));
  writeFileSync("/tmp/gyeol-v4-12c/results.json", JSON.stringify(Object.fromEntries(results)));
}, 60000);
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
afterAll(() => vi.unstubAllGlobals());

describe("12C actual generation, independent inputs and complete current Book", () => {
  it.each(samples)("$id arbitrary input → unchanged current V4 packet → every Book chapter SSR", async sample => {
    const result = results.get(sample.id)!;
    const direct = await generateV4ShadowReport(sample.payload, { evaluatedAt: REVIEW_NOW });
    expect(direct.ok).toBe(true); if (!direct.ok) return;
    expect(result.book).toEqual(projectBook(direct.evidencePacket as V4RuntimeEvidence));
    expect(result.facts.digest).toBe((direct.evidencePacket as V4RuntimeEvidence).contentDigest);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(result.book.people[0].name).toBe(sample.form.person.name);
    expect(result.book.pages.at(-1)?.kind).toBe("back");
    for (const page of result.book.pages) {
      const html = renderToStaticMarkup(<BookReader data={result.book} page={page} onNote={() => {}} onPage={() => {}} onShare={() => {}} />);
      expect(html).not.toMatch(/sourceRefs|evidenceIds|seedIds|fusionIds|normalizedContext/);
    }
    expect(reviewContext(result)).toContain(sample.form.person.name);
    expect(result.share.isShareable).toBe(false);
    expect(result.share.shareToken).toBeNull();
  });
  it("six independent mutable input objects and stale generation suppression", () => {
    const state = emptyReview(2026);
    state.A.form.person.name = "독립";
    state.D.form.personB.name = "별도";
    expect(state.B.form.person.name).toBe(""); expect(state.D.form.person.name).toBe("");
    const current = { ...state.A, generationId: "new" };
    expect(applyReviewEvent(current, { phase: "ready", caseId: "A", generationId: "old", result: results.get("A") })).toBe(current);
    expect(applyReviewEvent(current, { phase: "ready", caseId: "A", generationId: "new", result: results.get("A") }).phase).toBe("ready");
  });
  it("unknown/approximate time retained, Love dating, pair independent, 14 years and 12 months", () => {
    expect(JSON.stringify(results.get("C")!.facts.input)).toContain('"birthTimePrecision":"unknown"');
    expect(JSON.stringify(results.get("C")!.facts.input)).toContain('"relationshipStatus":"dating"');
    expect(JSON.stringify(results.get("E")!.facts.input)).toContain('"birthTimePrecision":"approximate"');
    expect(results.get("D")!.book.people.map(p => p.name)).toEqual(["현우", "소연"]);
    expect(JSON.stringify(results.get("D")!.book)).not.toMatch(/\d+\s*(?:점|%|퍼센트)|[★☆]|"score"/);
    const major = results.get("E")!.book.pages.find(p => p.kind === "timeline")!;
    expect(major.years).toHaveLength(14); expect(major.years.filter(y => y.time === "앞으로")).toHaveLength(10);
    expect(major.years.every(y => Number.isInteger(y.age))).toBe(true);
    const annual = results.get("F")!.book.pages.find(p => p.kind === "months")!;
    expect(annual.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(results.get("F")!.book.title).toContain("2026");
  });
  it("MBTI unknown and arbitrary changed name are not replaced with fixtures", async () => {
    const form = structuredClone(samples[0].form); form.person.name = "검수이름나"; form.person.mbtiType = "";
    const end = (await run("A", bookInputPayload(CASES[0].book, form))).at(-1)!;
    expect(end.phase).toBe("ready"); expect(end.result!.book.people[0].name).toBe("검수이름나");
    expect(end.result!.book.people[0].table.mbti).toBeNull();
  });
  it.each(["parentChild", "managerReport", "friendship", "marriage", "coworker", "businessPartner"])("canonical compatibility category/role %s", async category => {
    const payload = { ...samples[3].payload, relationshipType: category };
    const end = (await run("D", payload)).at(-1)!;
    expect(end.phase).toBe("ready");
    const pair = end.result!.book.pages.find(p => p.kind === "pair")!;
    expect(pair.directions).toHaveLength(2);
    if (category === "parentChild") expect(end.result!.book.people.map(p => p.role)).toEqual(["부모", "자녀"]);
    if (category === "managerReport") expect(end.result!.book.people.map(p => p.role)).toEqual(["상사", "부하·팀원"]);
  });
  it("canonical input validation rejects invalid date, wrong product/case, invalid year", async () => {
    const form = structuredClone(samples[0].form); form.person.birthDate = "2999-01-01";
    expect((await run("A", bookInputPayload(CASES[0].book, form))).at(-1)!.phase).toBe("failed");
    expect((await run("B", samples[0].payload)).at(-1)!.error).toContain("CASE_PRODUCT_MISMATCH");
    const annual = structuredClone(samples[5].form); annual.person.selectedYear = "2027";
    expect((await run("F", bookInputPayload(CASES[5].book, annual))).at(-1)!.phase).toBe("failed");
  });
  it("parallel cases cannot exchange inputs/results and regeneration uses new identity", async () => {
    const pair = await Promise.all([run("A", samples[0].payload), run("B", samples[1].payload)]);
    expect(pair.map(e => e.at(-1)!.result!.book.people[0].name)).toEqual(["서윤", "민재"]);
    expect(pair[0].at(-1)!.generationId).not.toBe(results.get("A")!.generationId);
  });
  it("past selectedYear uses the existing annual contract, no hardcoded 2026", async () => {
    const form = structuredClone(samples[5].form); form.person.selectedYear = "2025";
    const end = (await run("F", bookInputPayload(CASES[5].book, form))).at(-1)!;
    expect(end.phase).toBe("ready"); expect(end.result!.book.title).toContain("2025"); expect(end.result!.facts.months).toBe(12);
  });
  it("corrupt or incomplete output cannot become a ready Book", async () => {
    const generated = await generateV4ShadowReport(samples[0].payload, { evaluatedAt: REVIEW_NOW });
    expect(generated.ok).toBe(true); if (!generated.ok) return;
    vi.spyOn(runtime, "generateV4ShadowReport").mockResolvedValueOnce({ ...generated, draft: { ...(generated.draft as Record<string, unknown>), finalLine: "" } } as typeof generated);
    const end = (await run("A", samples[0].payload)).at(-1)!;
    expect(end.phase).toBe("failed"); expect(end.error).toContain("completeness:"); expect(end.result).toBeUndefined();
  });
});

describe("12C fail-closed routes and side-effect boundary", () => {
  const request = (host = "127.0.0.1:3193", origin = `http://${host}`) => new Request(`http://${host}/dev/content-review/api`, { method: "POST", headers: { host, origin, "content-type": "application/json" }, body: "{}" });
  it("production, remote hosts, deployed/CI env and cross-origin are inaccessible", async () => {
    vi.stubEnv("VERCEL", ""); vi.stubEnv("CI", ""); vi.stubEnv("NODE_ENV", "production");
    expect(manualReviewAllowed(request())).toBe(false); expect((await POST(request())).status).toBe(404);
    vi.stubEnv("NODE_ENV", "development");
    expect(manualReviewAllowed(request())).toBe(true);
    expect(manualReviewAllowed(request("example.com"))).toBe(false);
    expect(manualReviewAllowed(request("127.0.0.1:3193", "https://evil.test"))).toBe(false);
    vi.stubEnv("VERCEL", "1"); expect(manualReviewAllowed(request())).toBe(false);
    vi.stubEnv("VERCEL", ""); vi.stubEnv("CI", "true"); expect(manualReviewAllowed(request())).toBe(false);
  });
  it("malformed review request gets HTTP error, not stack trace", async () => {
    vi.stubEnv("VERCEL", ""); vi.stubEnv("CI", ""); vi.stubEnv("NODE_ENV", "development");
    expect((await POST(request())).status).toBe(400);
  });
  it("manual adapter never invokes business writers and public gates remain false", () => {
    const adapter = source("src/app/dev/content-review/generate.ts");
    expect(adapter).not.toMatch(/from ["'].*(?:localReview|payment|tickets|coupons|referrals|growth|library|analytics|supabase)/);
    expect(adapter).toContain("generateV4ShadowReport(payload"); expect(adapter).toContain("validateV4Publication(");
    expect(fetch).not.toHaveBeenCalled();
    expect(effects.database).not.toHaveBeenCalled();
    expect(bookExperiencePublicEnabled()).toBe(false); expect(accountPublicEnabled()).toBe(false);
    const ui = source("src/app/dev/content-review/ReviewBook.tsx");
    expect(ui).toContain("BookReadingPresentation"); expect(ui).not.toContain("shareOwner="); expect(ui).not.toContain("saveToLibrary=");
    expect(source("src/app/dev/content-review/storage.ts")).toContain("gyeol:manual-content-review:v1");
  });
});
