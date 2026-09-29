import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as payload } from "../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { COMPATIBILITY_ROLE_VERSION } from "../../../src/lib/report-generation/reportInputTypes";
import { describeReportShare, reportShareMetadata, sanitizeShareName, SHARE_IMAGE } from "../../../src/lib/sharing/reportShareMetadata";
import { kakaoShareCard, copyShareLink } from "../../../src/lib/sharing/shareBrowser";

const mocks = vi.hoisted(() => ({
  rows: new Map<string, { report_id: string; token: string; revoked_at: string | null }>(),
  call: vi.fn(), fail: false,
}));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: mocks.call }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({
  from: () => {
    let field = "", value = "";
    let insert: { report_id: string; token: string } | undefined;
    const query = {
      select: () => query,
      eq: (f: string, v: string) => { field = f; value = v; return query; },
      abortSignal: () => query,
      upsert: (row: typeof insert) => { insert = row; return { abortSignal: () => query.maybeSingle() }; },
      maybeSingle: async () => {
        if (mocks.fail) return { error: { code: "MISSING_TABLE" }, data: null };
        if (insert && !mocks.rows.has(insert.report_id)) mocks.rows.set(insert.report_id, { ...insert, revoked_at: null });
        return { error: null, data: [...mocks.rows.values()].find(row => row[field as "report_id" | "token"] === value) ?? null };
      },
    };
    return query;
  },
}) }));
import { existingReportShareUrl, issuePublishedReportShare, loadSharedReport } from "../../../src/lib/sharing/reportShareStore";
import SharedPage, { generateMetadata } from "../../../src/app/r/[token]/page";
import ReportPage from "../../../src/app/reports/[reportId]/page";

const products = [
  ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"], ["saju_mbti_compatibility", "compatibility"],
  ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"],
] as const;
const fixtures: Record<string, ProductPreviewSnapshot> = {};
const expiry = () => new Date(Date.now() + 86400000).toISOString();
beforeAll(async () => {
  for (const [productKey, productSlug] of products) {
    const input = { ...payload, productKey, productSlug, productOptions: { contentVersion: "v3", selectedYear: "2026" },
      ...(productKey === "saju_mbti_compatibility" ? { compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
        relationshipType: "love", personA: payload.person,
        personB: { ...payload.person, name: "유나", birthDate: "1993-10-17", gender: "FEMALE", mbtiType: "INFJ" } } : {}) };
    const result = await generateProductReport(input, { enabled: false, reason: "flag_disabled" }, "deterministic_fallback", undefined,
      { comprehensiveVersion: "v3", careerVersion: "v3", loveVersion: "v3", majorFortuneVersion: "v3", annualVersion: "v3" });
    expect(result.ok).toBe(true);
    if (!result.ok) continue;
    const built = createProductPreviewSnapshot({ reportId: "report_sharefixture_" + productSlug, createdAtIso: new Date().toISOString(),
      productKey, productSlug, draft: result.draft as ProductPreviewSnapshotDraft, evidencePacket: result.evidencePacket });
    expect(built.ok).toBe(true);
    if (built.ok) fixtures[productSlug] = { ...built.value, access: { mode: "paid", isPaid: true, isUnlocked: true } };
  }
  if (process.env.SHARE_QA_DIR) {
    mkdirSync(process.env.SHARE_QA_DIR, { recursive: true });
    writeFileSync(process.env.SHARE_QA_DIR + "/snapshots.json", JSON.stringify(fixtures));
  }
}, 30000);
beforeEach(() => {
  mocks.rows.clear(); mocks.fail = false;
  vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:3140");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "local-fixture-only");
  vi.stubEnv("NODE_ENV", "production");
  mocks.call.mockReset().mockImplementation(async (action, data) => {
    const snapshot = Object.values(fixtures).find(s => s.reportId === data.reportId);
    return action === "read_report" && snapshot ? { ok: true, status: "COMPLETED", expiresAt: expiry(), snapshot }
      : { ok: false, code: "REPORT_NOT_FOUND" };
  });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("published report sharing", () => {
  it.each(products)("shares the complete %s V3 report through the same renderer", async (_, slug) => {
    const snapshot = fixtures[slug], before = JSON.stringify(snapshot);
    const issued = await issuePublishedReportShare(snapshot.reportId);
    expect(issued.ok).toBe(true); if (!issued.ok) return;
    expect(issued.data.url).toMatch(/^https:\/\/gyeolreport\.com\/r\/gr_[A-Za-z0-9_-]{32}$/);
    expect(issued.data.url).not.toContain(snapshot.reportId);
    expect(issued.data.title).toContain(payload.person.name + "님의");
    const token = issued.data.url.split("/").at(-1)!;
    const shared = await loadSharedReport(token);
    expect(shared?.snapshot).toEqual(snapshot);
    const directHtml = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: snapshot.reportId }) }));
    const sharedHtml = renderToStaticMarkup(await SharedPage({ params: Promise.resolve({ token }) }));
    expect(sharedHtml).toBe(directHtml);
    expect(sharedHtml.match(/aria-label="리포트 공유하기"/g)).toHaveLength(1);
    expect(sharedHtml).toContain("나도 내 리포트 보기");
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(mocks.call.mock.calls.every(call => call[0] === "read_report")).toBe(true);
    const meta = await generateMetadata({ params: Promise.resolve({ token }) });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
    expect(meta.openGraph).toMatchObject({ url: issued.data.url, title: issued.data.title });
    const serialized = JSON.stringify(meta);
    for (const privateValue of [payload.person.birthDate, payload.person.mbtiType, snapshot.reportId, "evidencePacket", "payment"]) expect(serialized).not.toContain(privateValue);
  });
  it("simultaneous issuance reuses exactly one random link", async () => {
    const results = await Promise.all(Array.from({ length: 8 }, () => issuePublishedReportShare(fixtures["saju-mbti-full"].reportId)));
    expect(results.every(r => r.ok)).toBe(true);
    expect(new Set(results.map(r => r.ok && r.data.url)).size).toBe(1);
    expect(mocks.rows.size).toBe(1);
  });
  it("does not issue or serve expired, refunded, incomplete or invalid reports", async () => {
    const id = fixtures["saju-mbti-full"].reportId;
    const issued = await issuePublishedReportShare(id); if (!issued.ok) return;
    const token = issued.data.url.split("/").at(-1)!;
    for (const response of [
      { ok: false, code: "REPORT_NOT_FOUND" },
      { ok: true, status: "EXPIRED", snapshot: null },
      { ok: true, status: "GENERATING", snapshot: null },
      { ok: true, status: "COMPLETED", expiresAt: new Date(0).toISOString(), snapshot: fixtures["saju-mbti-full"] },
      { ok: true, status: "COMPLETED", expiresAt: expiry(), snapshot: { ...fixtures["saju-mbti-full"], evidencePacket: null } },
      { ok: true, status: "COMPLETED", expiresAt: expiry(), snapshot: { ...fixtures["saju-mbti-full"], access: { mode: "preview", isPaid: false, isUnlocked: false } } },
    ]) {
      mocks.call.mockResolvedValue(response);
      expect((await issuePublishedReportShare(id)).ok).toBe(false);
      expect(await loadSharedReport(token)).toBeNull();
    }
  });
  it("revocation is respected and cannot be overwritten by issuance", async () => {
    const id = fixtures["saju-mbti-full"].reportId;
    const issued = await issuePublishedReportShare(id); if (!issued.ok) return;
    mocks.rows.get(id)!.revoked_at = new Date().toISOString();
    expect(await loadSharedReport(issued.data.url.split("/").at(-1)!)).toBeNull();
    expect(await existingReportShareUrl(id)).toBeNull();
    expect((await issuePublishedReportShare(id)).ok).toBe(false);
  });
  it("missing storage or configuration fails closed", async () => {
    mocks.fail = true;
    expect((await issuePublishedReportShare(fixtures["saju-mbti-full"].reportId)).ok).toBe(false);
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(await loadSharedReport("gr_" + "a".repeat(32))).toBeNull();
  });
  it("rejects malformed tokens and report IDs before lookups", async () => {
    for (const token of ["report_private", "../", "gr_" + "a".repeat(10000), "<script>"]) expect(await loadSharedReport(token)).toBeNull();
    expect((await issuePublishedReportShare("../report")).ok).toBe(false);
    expect(mocks.call).not.toHaveBeenCalled();
  });
});

describe("safe share cards and browser fallbacks", () => {
  it("limits names, strips markup/control characters and only projects allowed metadata", () => {
    expect(sanitizeShareName("<b>홍길동</b>\u202e\n")).toBe("홍길동");
    expect(Array.from(sanitizeShareName("가".repeat(100))).length).toBe(20);
    const data = { ...describeReportShare({ productSlug: "major-fortune", draft: { personLabel: "<b>홍길동</b>" } }), url: "https://gyeolreport.com/r/gr_" + "a".repeat(32) };
    expect(data.title).toBe("홍길동님의 대운 리포트");
    expect(kakaoShareCard(data)).toMatchObject({ content: { imageUrl: SHARE_IMAGE, title: data.title }, buttons: [{ title: "리포트 보기", link: { webUrl: data.url, mobileWebUrl: data.url } }] });
    expect(reportShareMetadata(data).twitter).toMatchObject({ card: "summary_large_image", images: [SHARE_IMAGE] });
    expect(reportShareMetadata(null).robots).toMatchObject({ index: false });
  });
  it("clipboard denial falls back to selection copy and reports failure for manual selection", async () => {
    const field = { value: "", style: { cssText: "" }, setAttribute: vi.fn(), select: vi.fn(), remove: vi.fn() };
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    vi.stubGlobal("HTMLElement", class {});
    const execCommand = vi.fn().mockReturnValue(false);
    vi.stubGlobal("document", { createElement: () => field, activeElement: null, body: { appendChild: vi.fn() }, execCommand });
    expect(await copyShareLink("https://gyeolreport.com/r/test")).toBe(false);
    expect(field.select).toHaveBeenCalled(); expect(field.remove).toHaveBeenCalled();
    execCommand.mockReturnValue(true);
    expect(await copyShareLink("https://gyeolreport.com/r/test")).toBe(true);
  });
});

describe("share mapping migration in local Postgres", () => {
  let db: PGlite;
  beforeAll(async () => {
    db = new PGlite();
    await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create table public.paid_report_snapshots(report_id text primary key);");
    await db.exec(readFileSync("supabase/migrations/20260929113608_report_share_links.sql", "utf8"));
  });
  afterAll(async () => { await db?.close(); });
  it("uses RLS and blocks public/authenticated enumeration", async () => {
    expect((await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where relname='report_share_links'")).rows[0].relrowsecurity).toBe(true);
    for (const role of ["anon", "authenticated", "service_role"]) {
      const result = await db.query<{ allowed: boolean }>("select has_table_privilege($1, 'public.report_share_links', 'SELECT') as allowed", [role]);
      expect(result.rows[0].allowed).toBe(role === "service_role");
    }
  });
  it("enforces token uniqueness, valid format, one mapping per report and cascade deletion", async () => {
    await db.exec("insert into paid_report_snapshots values ('report_a'), ('report_b')");
    const token = "gr_" + "a".repeat(32);
    await db.query("insert into report_share_links(report_id,token) values ($1,$2)", ["report_a", token]);
    await expect(db.query("insert into report_share_links(report_id,token) values ($1,$2)", ["report_b", token])).rejects.toThrow();
    await expect(db.query("insert into report_share_links(report_id,token) values ($1,$2)", ["report_a", "gr_" + "b".repeat(32)])).rejects.toThrow();
    await expect(db.query("insert into report_share_links(report_id,token) values ($1,$2)", ["report_b", "report_b"])).rejects.toThrow();
    await db.exec("delete from paid_report_snapshots where report_id='report_a'");
    expect((await db.query("select * from report_share_links")).rows).toHaveLength(0);
  });
});
