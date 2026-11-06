// hotfix-share(2026-11-06): 책 공유 링크가 V4·v5 모든 책에서 책 주인에게만 만들어지고, 같은 책은 같은 링크를 다시 쓰며,
// 받는 사람은 로그인 없이 연다. 실제 SQL(PGlite: 결제·이용권·서재·공유·추천 migration) + 결정론 V4 / 목업 v5 작가(외부 호출 0).
// 운영 증상: v5 책(결제 20:20:45·이용권 20:13:27)은 /api/book-share가 404(V4_REQUIRED) → 화면이 버튼을 지웠다.
import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { TICKET_A as A, TICKET_B as B, ticketAuth } from "../../helpers/ticketPublicationSql";
import { enqueue, llmDeps, mockTextFor, opsStoreOf, v5Queue, type Queue } from "../../helpers/v5Scenarios";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import { runTicketPublicationJob } from "../../../src/lib/tickets/publicationWorker";
import { confirmPaidReport, runPaidReportJob, type PaidV5Builder } from "../../../src/lib/payment/paidReportReliability";
import { WRITER_DISABLED_RUNTIME as runtime } from "../../../src/lib/report-generation/writerDisabled";
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
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
const books: Record<"v4" | "v5Ticket" | "v5Paid", { reportId: string; port: ShareStorePort; owner: AccountPort; other: AccountPort }> = {} as never;
const library = (): LibraryPort => sqlBookShareLibrary(h.db);
// 이용권 책: 주인은 TICKET_A(uuid 그대로). 결제 책: 서재 연결이 로컬 사용자 id를 uuid로 바꾼다(sqlBookShareLibrary·sqlBookSharePort가 같은 규칙).
const ticketPort = (): ShareStorePort => ({ ...sqlBookSharePort(h.db), async owned(reportId, user) { return (await h.db.query<{ r: { ok: boolean } }>("select book_share_publication($1,$2) r", [reportId, user])).rows[0].r.ok; } });
const post = (reportId: unknown) => new NextRequest("https://gyeolreport.com/api/book-share", { method: "POST", headers: { origin: "https://gyeolreport.com", "content-type": "application/json" }, body: JSON.stringify({ reportId }) });
const share = async (key: keyof typeof books, who: "owner" | "other" | "anonymous" = "owner") => {
  const b = books[key], auth = who === "owner" ? b.owner : who === "other" ? b.other : ticketAuth(null);
  const response = await prepareBookShare(post(b.reportId), auth, library(), b.port);
  return { status: response.status, model: response.status === 200 ? (await response.json()).model as BookShareModel : null };
};
const links = async (reportId: string) => (await h.db.query<{ token: string }>("select token from report_share_links where report_id=$1", [reportId])).rows;

beforeAll(async () => {
  h = await v5Queue();
  // 서재 연결(sqlBookShareLibrary)이 결제 회원을 auth.users에 넣는다(로컬 검수 DB와 같은 권한).
  await h.db.exec("reset role; grant select, insert on auth.users to service_role; set role service_role;");
  // V4 이용권 책(10-30·31 생성분과 같은 조건: 이용권 발행, 링크 없음).
  const v4 = await enqueue(h, RUNTIME_FIXTURES.find(f => f.id === "comprehensive")!.payload);
  expect(await runTicketPublicationJob(h.queue)).toMatchObject({ state: "COMPLETED" });
  books.v4 = { reportId: v4.reportId, port: ticketPort(), owner: ticketAuth(A), other: ticketAuth(B) };
  // v5 이용권 책(운영 20:13:27과 같은 경로: 이용권 큐 → v5 작가(목업) → 발행).
  process.env.WRITER_V5_PRODUCTS = "saju_mbti_full";
  try {
    const job = await enqueue(h);
    const { deps } = llmDeps([{ text: mockTextFor(job.input).text }]);
    expect(await runTicketPublicationJob(h.queue, undefined, { ...deps, ops: opsStoreOf(h), openAiKey: null })).toMatchObject({ state: "COMPLETED" });
    books.v5Ticket = { reportId: job.reportId, port: ticketPort(), owner: ticketAuth(A), other: ticketAuth(B) };
  } finally { delete process.env.WRITER_V5_PRODUCTS; }
  // v5 결제 책(운영 20:20:45와 같은 경로: 주문 → 회원 구매 연결 → 결제 확인 → v5 발행).
  const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: {} };
  expect(await h.paid.call("create_order", { paymentOrderId: "po-share-v5", providerOrderId: "pv-share-v5", productType: "saju_mbti_full", provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
  expect(await bindCheckout(new NextRequest("https://gyeolreport.com/api/payment-checkout/prepare"), NextResponse.json({}), "po-share-v5", payload, ticketAuth(BUYER), library())).not.toBeNull();
  const order = await confirmPaidReport({ orderId: "pv-share-v5", paymentKey: "mock-key", amount: 1290 }, h.paid, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: "pv-share-v5", amount: 1290, status: "DONE" } }));
  const v5: PaidV5Builder = async job => ({ snapshot: (await buildV5Snapshot({ payload: job.payload as never, reportId: job.report_id, policyAt: new Date(job.created_at).toISOString(), sink: { save: async () => true, load: async () => [] }, recover: false, deps: { provider: "openai", model: "", people: async () => [] } })).snapshot as unknown as Record<string, unknown> });
  expect(await runPaidReportJob(h.paid, runtime, vi.fn(), undefined, v5)).toMatchObject({ status: "COMPLETED" });
  books.v5Paid = { reportId: String(order.reportId), port: sqlBookSharePort(h.db), owner: ticketAuth(BUYER), other: ticketAuth(OTHER) };
  for (const key of ["v4", "v5Ticket", "v5Paid"] as const) {
    const version = (await h.db.query<{ v: string }>("select snapshot_json->>'productVersion' v from paid_report_snapshots where report_id=$1", [books[key].reportId])).rows[0].v;
    expect(version, key).toBe(key === "v4" ? "v4" : "v5");
    expect(await links(books[key].reportId)).toHaveLength(0);
  }
}, 180_000);
afterAll(async () => { await h?.db.close(); });

describe("책 공유 링크 발급(V4·v5, 책 주인만, 같은 책 같은 링크)", () => {
  it.each(["v4", "v5Ticket", "v5Paid"] as const)("%s: 주인 → 200 새 링크, 다시 → 같은 링크, 다른 계정·비로그인 → 403", async key => {
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

  it.each(["v4", "v5Ticket", "v5Paid"] as const)("%s: 받는 사람은 로그인 없이 표지 → 책 전체(열람 화면과 같은 본문)", async key => {
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
    const { model } = await share("v5Paid"), shared = (await loadBookShare(model!.shareToken!, books.v5Paid.port))!;
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

  it("공유 API는 추천(referral) 저장소에 기대지 않는다", () => {
    const route = readFileSync("src/app/api/book-share/route.ts", "utf8"), server = readFileSync("src/lib/book/shareServer.ts", "utf8");
    expect(route).not.toMatch(/referrals|createReferralStore/); expect(server).not.toMatch(/attachReferral|ReferralStore/);
    expect(server).not.toContain('"V4_REQUIRED"');
  });
});
