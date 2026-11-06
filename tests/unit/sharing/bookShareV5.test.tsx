// hotfix-share(2026-11-06): 책 공유 링크가 V4·v5 모든 책에서 책 주인에게만 만들어지고, 같은 책은 같은 링크를 다시 쓰며,
// 받는 사람은 로그인 없이 연다. 실제 SQL(PGlite: 결제·이용권·서재·공유·추천 migration) + 결정론 V4 / 목업 v5 작가(외부 호출 0).
// 운영 증상: v5 책(결제 20:20:45·이용권 20:13:27)은 /api/book-share가 404(V4_REQUIRED) → 화면이 버튼을 지웠다.
// 운영 Q 추가(공유 재발 방지, 덕짱님 2026-11-07): 회귀 고정 형식 표 = v4·v5 × 결제·이용권, v5 결제는 출시 상품(LAUNCH_V5_PRODUCTS) 전부.
// 공유 조건 = 로그인한 책 주인 + 가입 동의 완료(문서 버전 무관). 문서 동의 버전을 올린 상태의 공유도 여기서 본다.
// ★ 새 책 형식(대운·세운 v5 등)을 열면 아래 FORMATS와 tests/unit/sharing/bookShareWebkit.test.ts 형식 표에 반드시 넣는다(CLAUDE.md 배포 체크리스트).
//   출시 목록(LAUNCH_V5_PRODUCTS)에 상품을 더하면 「형식 표」 시험이 먼저 실패한다.
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_POLICY_VERSIONS, accountSession, type AccountSnapshot } from "../../../src/lib/account/policy";
import { LAUNCH_V5_PRODUCTS } from "../../../src/lib/writer/flags";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { TICKET_A as A, TICKET_B as B, ticketAuth } from "../../helpers/ticketPublicationSql";
import { enqueue, llmDeps, mockTextFor, opsStoreOf, v5Queue, type Queue } from "../../helpers/v5Scenarios";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { runTicketPublicationJob } from "../../../src/lib/tickets/publicationWorker";
import { confirmPaidReport, runPaidReportJob, type PaidV5Builder } from "../../../src/lib/payment/paidReportReliability";
import { WRITER_DISABLED_RUNTIME as runtime } from "../../../src/lib/report-generation/writerDisabled";
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { bindCheckout, type LibraryPort } from "../../../src/lib/library/server";
import { sqlBookShareLibrary, sqlBookSharePort } from "../../../src/lib/book/shareLocalReview";
import { loadBookShare, loadSharedBookData, prepareBookShare } from "../../../src/lib/book/shareServer";
import { storedBook } from "../../../src/lib/book/storedReport";
import { bookKakaoCard, bookNativeData, type BookShareModel } from "../../../src/lib/book/shareModel";
import type { ShareStorePort } from "../../../src/lib/sharing/reportShareStore";
import type { AccountPort } from "../../../src/lib/account/handler";
import * as publicGate from "../../../src/lib/book/publicGate";
import * as shareStore from "../../../src/lib/sharing/reportShareStore";
import SharedPage from "../../../src/app/r/[token]/page";

let h: Queue;
const BUYER = "hotfix-share-buyer", OTHER = "hotfix-share-other";
const V5_PAID = LAUNCH_V5_PRODUCTS.map(product => `v5Paid:${product}`);
const FORMATS = ["v4Paid", "v4Ticket", "v5Ticket", ...V5_PAID] as const;
type Format = string;
const books: Record<Format, { reportId: string; port: ShareStorePort; owner: AccountPort; other: AccountPort }> = {};
const library = (): LibraryPort => sqlBookShareLibrary(h.db);
// 이용권 책: 주인은 TICKET_A(uuid 그대로). 결제 책: 서재 연결이 로컬 사용자 id를 uuid로 바꾼다(sqlBookShareLibrary·sqlBookSharePort가 같은 규칙).
const ticketPort = (): ShareStorePort => ({ ...sqlBookSharePort(h.db), async owned(reportId, user) { return (await h.db.query<{ r: { ok: boolean } }>("select book_share_publication($1,$2) r", [reportId, user])).rows[0].r.ok; } });
const post = (reportId: unknown) => new NextRequest("https://gyeolreport.com/api/book-share", { method: "POST", headers: { origin: "https://gyeolreport.com", "content-type": "application/json" }, body: JSON.stringify({ reportId }) });
const share = async (key: Format, who: "owner" | "other" | "anonymous" = "owner") => {
  const b = books[key], auth = who === "owner" ? b.owner : who === "other" ? b.other : ticketAuth(null);
  const response = await prepareBookShare(post(b.reportId), auth, library(), b.port);
  return { status: response.status, model: response.status === 200 ? (await response.json()).model as BookShareModel : null };
};
const links = async (reportId: string) => (await h.db.query<{ token: string }>("select token from report_share_links where report_id=$1", [reportId])).rows;

// 결제 책: 주문 → 회원 구매 연결 → 결제 확인 → 결제 워커(v5 작가 목업 또는 기존 V4 엔진) 발행. 운영 결제 경로와 같은 함수.
const fixture = (id: string) => RUNTIME_FIXTURES.find(f => f.id === id)!.payload as Record<string, unknown>;
const PAID_PAYLOADS: Record<string, Record<string, unknown>> = {
  saju_mbti_full: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: {} },
  career_money_study: fixture("career"), love_marriage_child: fixture("love"), saju_mbti_compatibility: fixture("compatibility"),
};
const v5Builder: PaidV5Builder = async job => ({ snapshot: (await buildV5Snapshot({ payload: job.payload as never, reportId: job.report_id, policyAt: new Date(job.created_at).toISOString(), sink: { save: async () => true, load: async () => [] }, recover: false, deps: { provider: "openai", model: "", people: async () => [] } })).snapshot as unknown as Record<string, unknown> });
let paidSeq = 0;
async function paidBook(payload: Record<string, unknown>, v5: boolean): Promise<string> {
  const n = ++paidSeq, po = `po-share-${n}`, pv = `pv-share-${n}`;
  expect(await h.paid.call("create_order", { paymentOrderId: po, providerOrderId: pv, productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
  expect(await bindCheckout(new NextRequest("https://gyeolreport.com/api/payment-checkout/prepare"), NextResponse.json({}), po, payload as never, ticketAuth(BUYER), library())).not.toBeNull();
  const order = await confirmPaidReport({ orderId: pv, paymentKey: `mock-key-${n}`, amount: 1290 }, h.paid, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: pv, amount: 1290, status: "DONE" } }));
  // V4 결제 책: 운영 결제 워커의 V4 경로(runPublicPaidReportJob bookGeneration v4)와 같은 생성기·검사(로컬 검수 runLocalBookJob과 같음).
  const at = new Date().toISOString();
  expect(await (v5 ? runPaidReportJob(h.paid, runtime, vi.fn(), undefined, v5Builder) : runPaidReportJob(h.paid, runtime, p => generateV4ShadowReport(p, { evaluatedAt: at, policyDate: at }), validateV4Publication)), String(payload.productKey)).toMatchObject({ status: "COMPLETED" });
  return String(order.reportId);
}

beforeAll(async () => {
  h = await v5Queue();
  // 서재 연결(sqlBookShareLibrary)이 결제 회원을 auth.users에 넣는다(로컬 검수 DB와 같은 권한).
  await h.db.exec("reset role; grant select, insert on auth.users to service_role; set role service_role;");
  // V4 이용권 책(10-30·31 생성분과 같은 조건: 이용권 발행, 링크 없음).
  const v4 = await enqueue(h, fixture("comprehensive"));
  expect(await runTicketPublicationJob(h.queue)).toMatchObject({ state: "COMPLETED" });
  books.v4Ticket = { reportId: v4.reportId, port: ticketPort(), owner: ticketAuth(A), other: ticketAuth(B) };
  // V4 결제 책(v5 이전 결제분과 같은 조건: 결제 워커의 기존 V4 엔진).
  books.v4Paid = { reportId: await paidBook(fixture("comprehensive"), false), port: sqlBookSharePort(h.db), owner: ticketAuth(BUYER), other: ticketAuth(OTHER) };
  // v5 이용권 책(운영 20:13:27과 같은 경로: 이용권 큐 → v5 작가(목업) → 발행).
  process.env.WRITER_V5_PRODUCTS = "saju_mbti_full";
  try {
    const job = await enqueue(h);
    const { deps } = llmDeps([{ text: mockTextFor(job.input).text }]);
    expect(await runTicketPublicationJob(h.queue, undefined, { ...deps, ops: opsStoreOf(h), openAiKey: null })).toMatchObject({ state: "COMPLETED" });
    books.v5Ticket = { reportId: job.reportId, port: ticketPort(), owner: ticketAuth(A), other: ticketAuth(B) };
  } finally { delete process.env.WRITER_V5_PRODUCTS; }
  // v5 결제 책(운영 20:20:45와 같은 경로), 출시 4종 모두.
  for (const product of LAUNCH_V5_PRODUCTS) books[`v5Paid:${product}`] = { reportId: await paidBook(PAID_PAYLOADS[product], true), port: sqlBookSharePort(h.db), owner: ticketAuth(BUYER), other: ticketAuth(OTHER) };
  for (const key of FORMATS) {
    const row = (await h.db.query<{ v: string; p: string }>("select snapshot_json->>'productVersion' v, product_type p from paid_report_snapshots where report_id=$1", [books[key].reportId])).rows[0];
    expect(row.v, key).toBe(key.startsWith("v4") ? "v4" : "v5");
    if (key.startsWith("v5Paid:")) expect(row.p, key).toBe(key.slice("v5Paid:".length));
    expect(await links(books[key].reportId)).toHaveLength(0);
  }
}, 420_000);
afterAll(async () => { await h?.db.close(); });

describe("책 공유 링크 발급(V4·v5, 책 주인만, 같은 책 같은 링크)", () => {
  it("형식 표: v4·v5 × 결제·이용권, v5 결제는 출시 상품 전부(출시 목록에 대운·세운 등을 더하면 여기 행을 더할 때까지 실패)", () => {
    expect(FORMATS).toEqual(expect.arrayContaining(["v4Paid", "v4Ticket", "v5Ticket"]));
    for (const product of LAUNCH_V5_PRODUCTS) expect(Object.keys(books), product).toContain(`v5Paid:${product}`);
    expect(Object.keys(PAID_PAYLOADS).sort()).toEqual([...LAUNCH_V5_PRODUCTS].sort());
  });

  it.each(FORMATS)("%s: 주인 → 200 새 링크, 다시 → 같은 링크, 다른 계정·비로그인 → 403", async key => {
    const first = await share(key);
    expect(first.status).toBe(200);
    expect(first.model).toMatchObject({ isShareable: true, shareUrl: expect.stringMatching(/^https:\/\/gyeolreport\.com\/r\/gr_[A-Za-z0-9_-]{32}$/) });
    expect(first.model!.referral).toBeUndefined();
    expect(await links(books[key].reportId)).toEqual([{ token: first.model!.shareToken }]);
    const again = await Promise.all([share(key), share(key), share(key)]);
    for (const r of again) { expect(r.status).toBe(200); expect(r.model!.shareUrl).toBe(first.model!.shareUrl); }
    expect(await links(books[key].reportId)).toHaveLength(1);
    expect((await share(key, "other")).status).toBe(403);
    expect((await share(key, "anonymous")).status).toBe(403);
    // 카카오·공유하기·복사가 모두 같은 링크(초대 토큰 없음).
    expect(bookKakaoCard(first.model!).buttons[0].link).toEqual({ mobileWebUrl: first.model!.shareUrl, webUrl: first.model!.shareUrl });
    expect(bookNativeData(first.model!).url).toBe(first.model!.shareUrl);
  });

  it.each(FORMATS)("%s: 받는 사람은 로그인 없이 표지 → 책 전체(열람 화면과 같은 본문)", async key => {
    const { model } = await share(key), token = model!.shareToken!, port = books[key].port;
    const shared = (await loadBookShare(token, port))!;
    expect(shared.model).toMatchObject({ shareToken: token, isShareable: true, reportVersion: "v4" });
    const book = (await loadSharedBookData(token, port))!;
    expect(book.data).toEqual(storedBook(shared.snapshot)!.data);
    expect(book.data.pages.at(-1)?.kind).toBe("back");
    expect(JSON.stringify(book)).not.toMatch(/report_[a-f0-9]{32}|evidencePacket|paymentKey|orderId/);
    const enabled = vi.spyOn(publicGate, "bookExperiencePublicEnabled").mockReturnValue(true), original = shareStore.loadSharedReport;
    const read = vi.spyOn(shareStore, "loadSharedReport").mockImplementation((t, validator) => original(t, validator, port));
    try {
      const html = renderToStaticMarkup(await SharedPage({ params: Promise.resolve({ token }) }));
      expect(html).toContain(`aria-label="${model!.displayTitle} 펼치기"`);
      expect(html).not.toContain(books[key].reportId); expect(html).not.toContain("리포트를 열 수 없습니다");
    } finally { read.mockRestore(); enabled.mockRestore(); }
  });

  it("v5 표지 이름·제목은 주인의 열람 화면과 같다(궁합 외부 표기는 첫 사람만 — V4와 같은 정책)", async () => {
    const key = "v5Paid:saju_mbti_full", { model } = await share(key), shared = (await loadBookShare(model!.shareToken!, books[key].port))!;
    expect(model!.displayName).toBe("김도윤");
    expect(model!.displayTitle).toBe(storedBook(shared.snapshot)!.share.displayTitle);
  });

  it("주인이 아닌 요청은 링크를 새로 만들지 않는다", async () => {
    const before = (await h.db.query("select 1 from report_share_links")).rows.length;
    const id = books.v5Ticket.reportId;
    for (const auth of [ticketAuth(B), ticketAuth(null), ticketAuth(A, false)]) expect((await prepareBookShare(post(id), auth, library(), ticketPort())).status).toBe(403);
    expect((await prepareBookShare(post("report_not_a_real_book_000000"), ticketAuth(A), library(), ticketPort())).status).toBe(403);
    expect((await h.db.query("select 1 from report_share_links")).rows.length).toBe(before);
  });

  // 운영 Q 추가: 공유 조건 = 로그인한 책 주인 + 가입 동의 완료(문서 버전 무관). 운영 기존 회원 두 무리(2026-11-07 읽기: 예전 판 06-14.1/09-22.1 38명,
  // 어제 판 11-06.1 4명) 모두 공유된다. 문서 동의 버전을 올려 재동의가 필요한 상태(결제·이용권은 막힘)에서도 공유는 된다. 동의를 거뒀거나 기록이 없으면 403.
  it.each(FORMATS)("%s: 동의 버전 무관 — 예전 판·어제 판·버전을 올린 상태의 주인 200 같은 링크, 동의 거둠·동의 없음 403(행 그대로)", async key => {
    const b = books[key], owner = (await b.owner.currentUser())!;
    const consents = (v: { terms: string; privacy: string }, agreed = true) => (["terms", "privacy"] as const).map(consent_type => ({ consent_type, document_version: v[consent_type], is_agreed: agreed, required: true, recorded_at: "2026-11-06T13:00:00.000Z" }));
    const as = (snapshot: AccountSnapshot): AccountPort => ({ ...b.owner, read: async () => snapshot });
    const current = await share(key), url = current.model!.shareUrl;
    const ok = async (snapshot: AccountSnapshot) => { const r = await prepareBookShare(post(b.reportId), as(snapshot), library(), b.port); expect(r.status).toBe(200); expect(((await r.json()).model as BookShareModel).shareUrl).toBe(url); };
    await ok({ profile: owner, consents: consents({ terms: "2026-06-14.1", privacy: "2026-09-22.1" }) });
    await ok({ profile: owner, consents: consents({ terms: "2026-11-06.1", privacy: "2026-11-06.1" }) });
    const saved = { ...ACCOUNT_POLICY_VERSIONS }, agreedNow: AccountSnapshot = { profile: owner, consents: consents(saved) };
    Object.assign(ACCOUNT_POLICY_VERSIONS as Record<string, string>, { terms: "2099-01-01.1", privacy: "2099-01-01.1" });
    try {
      expect(accountSession(owner, agreedNow).status).toBe("needs_consent"); // 결제·이용권은 재동의 흐름 그대로
      await ok(agreedNow);
    } finally { Object.assign(ACCOUNT_POLICY_VERSIONS as Record<string, string>, saved); }
    const before = await links(b.reportId);
    const withdrawn: AccountSnapshot = { profile: owner, consents: [...consents(saved, false), ...consents(saved)] }; // 최신순: 가장 최근이 거부
    for (const snapshot of [withdrawn, { profile: owner, consents: [] }, { profile: null, consents: consents(saved) }]) expect((await prepareBookShare(post(b.reportId), as(snapshot), library(), b.port)).status).toBe(403);
    expect(await links(b.reportId)).toEqual(before);
  });

  it("실패 응답(4xx·5xx)만 경보 함수로 넘긴다(상태 코드 + 책 id — 책 id는 DB가 버전을 읽는 데만 쓴다), 경보가 터져도 응답은 그대로", async () => {
    const b = books.v5Ticket, calls: [number, string | null][] = [], alarm = (status: number, reportId: string | null) => { calls.push([status, reportId]); };
    expect((await prepareBookShare(post(b.reportId), b.owner, library(), b.port, false, alarm)).status).toBe(200);
    expect((await prepareBookShare(post(b.reportId), ticketAuth(B), library(), b.port, false, alarm)).status).toBe(403);
    expect((await prepareBookShare(post("x"), b.owner, library(), b.port, false, alarm)).status).toBe(400);
    expect((await prepareBookShare(new NextRequest("https://gyeolreport.com/api/book-share"), b.owner, library(), b.port, false, alarm)).status).toBe(405);
    expect(calls).toEqual([[403, b.reportId], [400, null], [405, null]]);
    expect((await prepareBookShare(post(b.reportId), ticketAuth(B), library(), b.port, false, () => { throw new Error("ALARM_DOWN"); })).status).toBe(403);
    const route = readFileSync("src/app/api/book-share/route.ts", "utf8");
    expect(route).toMatch(/prepareBookShare\(request, auth, createLibraryPort\(\), undefined, false, shareFailureAlarm\)/);
    expect(route).toMatch(/if \(!auth\) \{ shareFailureAlarm\(503, null\);/);
  });

  it("공유 API는 추천(referral) 저장소에 기대지 않는다", () => {
    const route = readFileSync("src/app/api/book-share/route.ts", "utf8"), server = readFileSync("src/lib/book/shareServer.ts", "utf8");
    expect(route).not.toMatch(/referrals|createReferralStore/); expect(server).not.toMatch(/attachReferral|ReferralStore/);
    expect(server).not.toContain('"V4_REQUIRED"');
  });
});
