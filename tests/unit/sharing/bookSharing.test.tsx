import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { createLocalShareFixture, localBookShareDatabase, sqlBookShareLibrary, sqlBookSharePort } from "../../../src/lib/book/shareLocalReview";
import { loadBookShare, loadSharedBookData, prepareBookShare } from "../../../src/lib/book/shareServer";
import { createLocalAccountPort } from "../../../src/lib/account/localReview";
import { claimHash } from "../../../src/lib/library/server";
import { ACCOUNT_POLICY_VERSIONS } from "../../../src/lib/account/policy";
import { projectBookShare, bookShareMetadata, bookKakaoCard, bookNativeData } from "../../../src/lib/book/shareModel";
import { BOOKS } from "../../../src/lib/book/product";
import { storedBook } from "../../../src/lib/book/storedReport";
import { renderBookOg, ogFontText } from "../../../src/lib/book/bookOg";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { SharedBookEntry } from "../../../src/components/book/SharedBookEntry";
import { BookShareActions } from "../../../src/components/book/BookShareActions";
import { bookShareEvent } from "../../../src/lib/book/shareEvents";
import { nativeShare, copyShareLink } from "../../../src/lib/sharing/shareBrowser";
import { POST as publicShare } from "../../../src/app/api/book-share/route";
import { GET as publicData } from "../../../src/app/r/[token]/book-data/route";
import { GET as publicOg } from "../../../src/app/r/[token]/book-og/route";
import { bookExperiencePublicEnabled } from "../../../src/lib/book/publicGate";
import { accountPublicEnabled } from "../../../src/lib/account/gate";
import type { BookShareModel } from "../../../src/lib/book/shareModel";
import type { PGlite } from "@electric-sql/pglite";
import type { AccountPort } from "../../../src/lib/account/handler";
import * as publicGate from "../../../src/lib/book/publicGate";
import * as shareStore from "../../../src/lib/sharing/reportShareStore";
import SharedPage, { generateMetadata } from "../../../src/app/r/[token]/page";

const origin = "http://127.0.0.1:3189";
const req = (body: unknown, cookie = "", source = origin) => new NextRequest(`${origin}/dev/book-flow/share`, { method: "POST", headers: { host: "127.0.0.1:3189", origin: source, cookie }, body: JSON.stringify(body) });
const noOp = () => {};
let db: PGlite;
const fixtures: Array<{ id: string; reportId: string; cookie: string; model: BookShareModel }> = [];
beforeAll(async () => {
  db = (await localBookShareDatabase())!;
  for (const f of RUNTIME_FIXTURES) {
    const payload = f.payload.productKey === "annual_fortune" ? { ...structuredClone(f.payload), productOptions: { selectedYear: String(new Date().getFullYear()) } } : structuredClone(f.payload);
    const response = await createLocalShareFixture(req({}), payload);
    expect(response.status, `${f.id} ${await response.clone().text()} ${JSON.stringify((await db.query("select failure_stage,error_code from report_generation_attempts")).rows)}`).toBe(200);
    const { reportId } = await response.json(), cookie = response.cookies.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    const request = req({ reportId }, cookie);
    const issued = await prepareBookShare(request, createLocalAccountPort(request)!, sqlBookShareLibrary(db), sqlBookSharePort(db), true);
    expect(issued.status).toBe(200);
    fixtures.push({ id: f.id, reportId, cookie, model: (await issued.json()).model });
  }
  if (process.env.BOOK_SHARE_REVIEW_EXPORT) { mkdirSync(process.env.BOOK_SHARE_REVIEW_EXPORT, { recursive: true }); writeFileSync(`${process.env.BOOK_SHARE_REVIEW_EXPORT}/models.json`, JSON.stringify(fixtures.map(f => f.model), null, 2)); writeFileSync(`${process.env.BOOK_SHARE_REVIEW_EXPORT}/inputs.json`, JSON.stringify(RUNTIME_FIXTURES)); }
}, 60000);
afterAll(async () => { await db?.close(); });

describe("V4 Book share, real V4 generation and existing SQL", () => {
  it.each(RUNTIME_FIXTURES)("$id: direct/shared full text, tables, final, appendix parity; private cover entry", async ({ id }) => {
    const f = fixtures.find(f => f.id === id)!, shared = (await loadBookShare(f.model.shareToken!, sqlBookSharePort(db)))!;
    const book = (await loadSharedBookData(f.model.shareToken!, sqlBookSharePort(db)))!;
    expect(book.data).toEqual(storedBook(shared.snapshot)!.data);
    expect(JSON.stringify(book)).not.toMatch(/contentDigest|sourceRefs|provenance|paymentKey|orderId|reportId|evidencePacket/);
    const markup = (data: typeof book.data) => data.pages.map(page => renderToStaticMarkup(<BookReader data={data} page={page} onNote={noOp} onShare={noOp} onPage={noOp} />)).join("");
    expect(markup(book.data)).toEqual(markup(storedBook(shared.snapshot)!.data));
    expect(book.data.pages.at(-1)?.kind).toBe("back");
    expect(book.data.pages.some(p => p.kind === "appendix")).toBe(true);
    if (id === "major") { const timeline = book.data.pages.find(p => p.kind === "timeline"); expect(timeline?.kind === "timeline" && timeline.years).toHaveLength(14); expect(timeline?.kind === "timeline" && timeline.years.filter(y => y.time === "앞으로")).toHaveLength(10); }
    if (id === "annual") { const months = book.data.pages.find(p => p.kind === "months"); expect(months?.kind === "months" && months.months.map(m => m.month)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]); }
    if (id === "compatibility") { const pair = book.data.pages.find(p => p.kind === "pair"); expect(pair?.kind === "pair" && pair.directions).toHaveLength(2); expect(book.data.people).toHaveLength(2); expect(f.model.displayName).toBe(book.data.people[0].name); expect(JSON.stringify(book)).not.toMatch(/\bscore\b|\bgrade\b|67점/); }
    const entry = renderToStaticMarkup(<SharedBookEntry model={f.model} local />);
    for (const p of book.data.people) for (const value of [p.birth, p.mbti, p.timeLabel].filter(Boolean)) expect(entry).not.toContain(value);
    expect(entry).not.toContain(f.reportId); expect(entry).not.toContain("data-narrative");
    expect(entry).toContain(`aria-label="${f.model.displayTitle} 펼치기"`);
    expect(entry).not.toMatch(/내 서재|이용권|쿠폰/);
    const meta = JSON.stringify(bookShareMetadata(f.model));
    expect(meta).not.toMatch(/\d{4}-\d{2}-\d{2}|ENTJ|INTP|ESFJ|ISFP|paymentKey|report_|provenance/);
    expect(bookShareMetadata(f.model).robots).toMatchObject({ index: false, follow: false, noarchive: true });
    expect(bookShareMetadata(f.model).alternates?.canonical).toBe(f.model.shareUrl);
    expect(f.model).toMatchObject({ reportVersion: "v4", isShareable: true, coverColor: BOOKS.find(b => b.productKey === f.model.productType)!.color });
  });
  it("Kakao/native allowlist and genuine copy URL; support channel never used", async () => {
    for (const f of fixtures) {
      const card = bookKakaoCard(f.model);
      expect(card.content.imageUrl).toBe(`${f.model.shareUrl}/book-og`);
      expect(card.buttons).toEqual([{ title: "책 펼쳐보기", link: { mobileWebUrl: f.model.shareUrl, webUrl: f.model.shareUrl } }]);
      expect(card.content).toMatchObject({ imageWidth: 1200, imageHeight: 630, description: "한 권 펼쳐보세요." });
      expect(JSON.stringify(card)).not.toMatch(/pf.kakao.com|report_|ENTJ|생년/);
      const share = vi.fn(async () => {}), copy = vi.fn(async () => {});
      vi.stubGlobal("navigator", { share, clipboard: { writeText: copy } });
      expect(await nativeShare(bookNativeData(f.model))).toBe("shared");
      expect(share).toHaveBeenCalledWith({ title: f.model.displayTitle, text: "한 권 펼쳐보세요.", url: f.model.shareUrl });
      expect(await copyShareLink(f.model.shareUrl!)).toBe(true); expect(copy).toHaveBeenCalledWith(f.model.shareUrl);
    }
    vi.stubGlobal("navigator", { share: async () => { throw new DOMException("cancel", "AbortError"); } }); expect(await nativeShare(bookNativeData(fixtures[0].model))).toBe("cancelled");
    vi.stubGlobal("navigator", {}); expect(await nativeShare(bookNativeData(fixtures[0].model))).toBe("fallback");
    expect(readFileSync("src/app/dev/book-preview/BookPages.tsx", "utf8")).toContain('href="http://pf.kakao.com/_sbHaX/chat"');
  });
  it("internally enabled /r entry and data use the stored V4 version, never expose the private report ID", async () => {
    const f = fixtures[0], original = shareStore.loadSharedReport;
    const enabled = vi.spyOn(publicGate, "bookExperiencePublicEnabled").mockReturnValue(true);
    const read = vi.spyOn(shareStore, "loadSharedReport").mockImplementation((token, validator) => original(token, validator, sqlBookSharePort(db)));
    try {
      const params = Promise.resolve({ token: f.model.shareToken! });
      const html = renderToStaticMarkup(await SharedPage({ params }));
      expect(html).toContain(`${f.model.displayTitle} 펼치기`);
      expect(html).not.toContain(f.reportId); expect(html).not.toContain("data-narrative-paragraph");
      expect(await generateMetadata({ params })).toEqual(bookShareMetadata(f.model));
      const response = await publicData(new Request(`${origin}/r/${f.model.shareToken}/book-data`), { params });
      expect(response.status).toBe(200);
      expect((await response.json()).data).toEqual((await loadSharedBookData(f.model.shareToken!, sqlBookSharePort(db)))!.data);
    } finally { read.mockRestore(); enabled.mockRestore(); }
  });
  it("share UI uses three buttons; shared final excludes every owner action", () => {
    const actions = renderToStaticMarkup(<BookShareActions model={fixtures[0].model} local />);
    expect(actions.match(/<button/g)).toHaveLength(3); expect(actions).not.toMatch(/SDK|SHARE YOUR|내 서재|쿠폰|이용권/);
    const reader = readFileSync("src/components/book/BookReading.tsx", "utf8");
    expect(reader).toContain('shared ? <a'); expect(reader).toContain('owner={shared ? undefined : shareOwner}');
  });
  it("parallel share issuance reuses active high-entropy token", async () => {
    const f = fixtures[0];
    const responses = await Promise.all(Array.from({ length: 8 }, async () => { const r = req({ reportId: f.reportId }, f.cookie); return prepareBookShare(r, createLocalAccountPort(r)!, sqlBookShareLibrary(db), sqlBookSharePort(db), true); }));
    for (const response of responses) expect((await response.json()).model.shareToken).toBe(f.model.shareToken);
    expect(f.model.shareToken).toMatch(/^gr_[A-Za-z0-9_-]{32}$/);
    expect((await db.query("select 1 from report_share_links where report_id=$1", [f.reportId])).rows).toHaveLength(1);
  });
  it("raw report ID, another account, share token cookie and client permission fields cannot issue/claim", async () => {
    const f = fixtures[0];
    for (const cookie of ["", `shareToken=${f.model.shareToken}`, f.cookie.replace(/=[^;]+/, `=${f.model.shareToken}`)]) {
      const r = req({ reportId: f.reportId }, cookie); expect((await prepareBookShare(r, createLocalAccountPort(r)!, sqlBookShareLibrary(db), sqlBookSharePort(db), true)).status).toBe(403);
    }
    const invalid = req({ reportId: f.reportId, isShareable: true }, f.cookie); expect((await prepareBookShare(invalid, createLocalAccountPort(invalid)!, sqlBookShareLibrary(db), sqlBookSharePort(db), true)).status).toBe(400);
    expect(await sqlBookShareLibrary(db).claim(f.reportId, "attacker", claimHash(f.model.shareToken!), true)).toBe("unavailable");
    const cross = req({ reportId: f.reportId }, f.cookie, "https://evil.example"); expect((await prepareBookShare(cross, createLocalAccountPort(cross)!, sqlBookShareLibrary(db), sqlBookSharePort(db), true)).status).toBe(403);
    expect(await loadBookShare(f.reportId, sqlBookSharePort(db))).toBeNull();
  });
  it("ownership claim changes who may issue without giving a share viewer ownership", async () => {
    const f = fixtures[5], library = sqlBookShareLibrary(db), hash = claimHash(f.cookie.split("=")[1]);
    expect(await library.claim(f.reportId, "new-owner", hash, true)).toBe("owned");
    const old = req({ reportId: f.reportId }, f.cookie);
    expect((await prepareBookShare(old, createLocalAccountPort(old)!, library, sqlBookSharePort(db), true)).status).toBe(403);
    const user = { id: "new-owner", provider: "kakao" as const, displayName: "회원" };
    const auth: AccountPort = { ...createLocalAccountPort(old)!, currentUser: async () => user, read: async () => ({ profile: user, consents: Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, is_agreed: true, required: true, recorded_at: new Date().toISOString() })) }) };
    expect((await prepareBookShare(req({ reportId: f.reportId }), auth, library, sqlBookSharePort(db), true)).status).toBe(200);
  });
  it("expired/cancelled/unpublished/corrupt and revoked reports fail closed, no token resurrection", async () => {
    const f = fixtures[1], base = sqlBookSharePort(db), read = await base.read("read_report", { reportId: f.reportId });
    for (const change of [{ expiresAt: "2000-01-01T00:00:00Z" }, { status: "GENERATING" }, { ok: false }, { snapshot: { ...read.snapshot as object, access: { mode: "preview", isPaid: false, isUnlocked: false } } }, { snapshot: { ...read.snapshot as object, draft: {} } }]) {
      expect(await loadBookShare(f.model.shareToken!, { ...base, read: async () => ({ ...read, ...change }) })).toBeNull();
    }
    await db.query("update report_share_links set revoked_at=now() where report_id=$1", [f.reportId]);
    expect(await loadSharedBookData(f.model.shareToken!, base)).toBeNull();
    const request = req({ reportId: f.reportId }, f.cookie); expect((await prepareBookShare(request, createLocalAccountPort(request)!, sqlBookShareLibrary(db), base, true)).status).toBe(404);
    expect((await base.find("report_id", f.reportId))?.token).toBe(f.model.shareToken);
  });
  it("gates OFF deny public issue/read/OG even with query overrides; no referrals/rewards", async () => {
    expect(bookExperiencePublicEnabled()).toBe(false); expect(accountPublicEnabled()).toBe(false);
    expect((await publicShare(req({ reportId: fixtures[0].reportId }, fixtures[0].cookie))).status).toBe(404);
    const params = Promise.resolve({ token: fixtures[0].model.shareToken! }), r = new Request(`${origin}/r/x/book-data?v4=true`);
    expect((await publicData(r, { params })).status).toBe(404); expect((await publicOg(r, { params })).status).toBe(404);
    expect((await db.query("select 1 from report_ticket_ledger")).rows).toHaveLength(0);
    const events: unknown[] = []; vi.stubGlobal("window", { dispatchEvent: (e: CustomEvent) => events.push(e.detail) });
    bookShareEvent("shared_cta_clicked", "major_fortune", false); expect(events).toHaveLength(0);
    bookShareEvent("shared_cta_clicked", "major_fortune", true); expect(events).toEqual([{ event: "shared_cta_clicked", productType: "major_fortune" }]);
  });
  it("actual SQL cancellation and unpublished/expired states revoke reads without regenerating", async () => {
    const f = fixtures[2], port = sqlBookSharePort(db);
    const order = (await db.query<{ order_id: string }>("select order_id from paid_report_snapshots where report_id=$1", [f.reportId])).rows[0].order_id;
    for (const status of ["ready", "canceled", "refunded"]) {
      await db.query("update payment_orders set status=$1 where payment_order_id=$2", [status, order]);
      expect(await loadBookShare(f.model.shareToken!, port)).toBeNull();
    }
    await db.query("update payment_orders set status='paid' where payment_order_id=$1", [order]);
    const previous = (await db.query<{ published_at: string; expires_at: string; status: string; snapshot_json: unknown }>("select published_at::text,expires_at::text,status,snapshot_json from paid_report_snapshots where report_id=$1", [f.reportId])).rows[0];
    // Preserve the real 90-day access contract rather than bypassing SQL constraints.
    await db.query("update paid_report_snapshots set published_at=published_at-interval '91 days',expires_at=expires_at-interval '91 days' where report_id=$1", [f.reportId]);
    expect(await loadSharedBookData(f.model.shareToken!, port)).toBeNull();
    await db.query("update paid_report_snapshots set published_at=$1,expires_at=$2,status='GENERATING',snapshot_json=null where report_id=$3", [previous.published_at, previous.expires_at, f.reportId]);
    expect(await loadSharedBookData(f.model.shareToken!, port)).toBeNull();
    await db.query("update paid_report_snapshots set status=$1,snapshot_json=$2::jsonb where report_id=$3", [previous.status, JSON.stringify(previous.snapshot_json), f.reportId]);
    expect(await loadBookShare(f.model.shareToken!, port)).not.toBeNull();
  });
  it("6 OG images + long names/year/compatibility, no remote assets", async () => {
    for (const [i, model] of fixtures.map(f => f.model).entries()) {
      const response = await renderBookOg(model), png = Buffer.from(await response.arrayBuffer());
      expect(png.subarray(1, 4).toString()).toBe("PNG"); expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
      expect(response.headers.get("Cache-Control")).toContain("no-store");
      if (process.env.BOOK_SHARE_REVIEW_EXPORT) writeFileSync(`${process.env.BOOK_SHARE_REVIEW_EXPORT}/og-${i + 1}.png`, png);
    }
    const long = projectBookShare({ productType: "saju_mbti_compatibility", names: "김아름다운하늘빛고운별꽃사랑가나다라마바사아자차" })!;
    expect(Array.from(long.displayName)).toHaveLength(20);
    const png = Buffer.from(await (await renderBookOg(long)).arrayBuffer());
    if (process.env.BOOK_SHARE_REVIEW_EXPORT) writeFileSync(`${process.env.BOOK_SHARE_REVIEW_EXPORT}/og-long-compatibility.png`, png);
    expect(ogFontText("서진 ENTJ 2026")).toBe("서진 ENTJ 2026"); expect(ogFontText("😀")).toBe("□");
    // Satori may fetch its bundled data: WASM; no HTTP font/image/provider request.
    expect(vi.mocked(fetch).mock.calls.map(c => String(c[0])).filter(url => /^https?:/.test(url))).toEqual([]);
  }, 30000);
});
