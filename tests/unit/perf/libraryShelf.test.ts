// P 추가 F·B·A·D: 서재 책장(구매 내역 합침·만료 책 숨김) · 인앱 브라우저 판별 · 이용권 기한(순수 함수, 외부 호출 0).
import { describe, expect, it } from "vitest";
import { buildShelf, cardResult, stillMaking, type ShelfOrder, type ShelfRequest } from "@/lib/library/shelf";
import { REQUEST_RESULT_COPY } from "@/lib/legal/socialLinks";
import type { LibraryRow } from "@/lib/library/model";
import { externalBrowserUrl, inAppBrowser } from "@/lib/account/inAppBrowser";
import { EVENT_TICKET_EXPIRES_AT, kstMonthDayLabel, ticketExpiresAt } from "@/lib/ops/config";

const NOW = Date.parse("2026-11-06T12:00:00+09:00");
const id = (n: number) => `report_${String(n).padStart(32, "0")}`;
const row = (n: number, o: Partial<LibraryRow> = {}): LibraryRow => ({ reportId: id(n), productType: "saju_mbti_full", displayName: "하람", selectedYear: null, publishedAt: `2026-11-0${n % 5 + 1}T00:00:00Z`, expiresAt: "infinity", reportVersion: "v5", status: "available", source: "paid", ...o });
const order = (n: number, o: Partial<ShelfOrder> = {}): ShelfOrder => ({ orderCode: `GR-${n}`, reportId: id(n), productType: "saju_mbti_full", paymentStatus: "paid", bookStatus: "COMPLETED", createdAt: "2026-11-05T00:00:00Z", paidAt: "2026-11-05T00:00:00Z", refundState: null, ...o });

describe("서재 책장(buildShelf)", () => {
  it("완성된 책: 카드 링크·v5는 기한 없음·주문코드 / 이용권 책은 「이용권으로 만든 책」", () => {
    const books = buildShelf([row(1), row(2, { source: "ticket" }), row(3, { reportVersion: "v4", expiresAt: "2026-12-30T00:00:00Z" })], [order(1)], [], NOW);
    expect(books.map(b => [b.reportId, b.state, b.href, b.orderCode, b.viaTicket, b.openEnded])).toEqual(expect.arrayContaining([
      [id(1), "ready", `/reports/${id(1)}`, "GR-1", false, true],
      [id(2), "ready", `/reports/${id(2)}`, null, true, true],
      [id(3), "ready", `/reports/${id(3)}`, null, false, false],
    ]));
    expect(books.find(b => b.reportId === id(3))?.expiresAt).toBe("2026-12-30T00:00:00Z");
  });
  it("기한이 지난 v5 이전 책·열 수 없는 책(환불·회수)은 서재에 남기지 않는다(「만료됨」 카드 없음)", () => {
    const books = buildShelf([row(1, { reportVersion: "v4", expiresAt: "2026-11-01T00:00:00Z" }), row(2, { status: "expired" }), row(3, { status: "unavailable" }), row(4)], [], [], NOW);
    expect(books.map(b => b.reportId)).toEqual([id(4)]);
  });
  it("만드는 중(결제 주문·이용권 접수) / 확인이 필요해요(생성 실패) — 위에, 완성 책은 그 아래 최근 발행 순", () => {
    const books = buildShelf([row(1), row(2)], [order(5, { bookStatus: "GENERATING" }), order(6, { bookStatus: "FAILED_REQUIRES_ATTENTION" }), order(7, { bookStatus: null }), order(8, { paymentStatus: "refunded", bookStatus: "GENERATING" })],
      [{ reportId: id(9), productType: "career_money_study", state: "QUEUED", createdAt: "2026-11-06T00:00:00Z" }], NOW);
    expect(books.slice(0, 4).map(b => b.state).sort()).toEqual(["attention", "making", "making", "making"]);
    expect(books.find(b => b.reportId === id(9))).toMatchObject({ state: "making", href: null, viaTicket: true });
    expect(books.find(b => b.reportId === id(8))).toBeUndefined(); // 환불된 주문은 만드는 중으로 보이지 않는다
    expect(books.slice(4).map(b => b.reportId)).toEqual([id(2), id(1)]);
  });
  it("책 본문은 들어 있지 않다(요약 칸만)", () => {
    const [b] = buildShelf([row(1)], [], [], NOW);
    // 운영 Q 2부: 문의 결과·환불 카드용 칸(madeAt·request·refundedAt)만 더해졌다 — 본문·입력값 없음.
    expect(Object.keys(b).sort()).toEqual(["coverColor", "displayName", "expiresAt", "href", "ink", "madeAt", "openEnded", "orderCode", "publishedAt", "refundedAt", "reportId", "request", "state", "title", "viaTicket"]);
  });
});

describe("서재 문의 결과·환불 카드(운영 Q 2부)", () => {
  const req = (o: Partial<ShelfRequest>): ShelfRequest => ({ orderCode: "GR-1", reportId: id(1), reason: "not_open", status: "done", resolution: "guide", resolvedAt: "2026-11-06T02:00:00Z", createdAt: "2026-11-06T01:00:00Z", ...o });
  it("처리 결과 4종 문구(7일 동안), 안내는 카카오톡 채널 버튼", () => {
    const one = (r: Partial<ShelfRequest>) => cardResult(buildShelf([row(1)], [order(1)], [], NOW, [req(r)])[0], NOW);
    expect(one({ resolution: "refund" })).toEqual({ kind: "refund", text: REQUEST_RESULT_COPY.refund, channel: false });
    expect(one({ resolution: "regenerate" })).toEqual({ kind: "regenerate", text: "다시 만들어 드렸어요.", channel: false });
    expect(one({ resolution: "ticket" })).toEqual({ kind: "ticket", text: "이용권을 다시 드렸어요. 서재에서 확인해 주세요.", channel: false });
    expect(one({ resolution: "guide" })).toEqual({ kind: "guide", text: REQUEST_RESULT_COPY.guideNotOpen, channel: true });
    expect(one({ resolution: "guide", reason: "double_paid" })?.text).toBe(REQUEST_RESULT_COPY.guideOther);
    expect(one({ resolution: "guide", resolvedAt: "2026-10-30T02:00:00Z" })).toBeNull(); // 7일 지나면 사라진다
  });
  it("열린 요청은 결과 없이 「접수됨」 상태(request.status=open)", () => {
    const [b] = buildShelf([row(1)], [order(1)], [], NOW, [req({ status: "open", resolution: null, resolvedAt: null })]);
    expect(b.request).toMatchObject({ status: "open" });
    expect(cardResult(b, NOW)).toBeNull();
  });
  it("이용권 책은 주문코드 없이 reportId로 결과를 찾는다", () => {
    const [b] = buildShelf([row(2, { source: "ticket" })], [], [], NOW, [req({ orderCode: null, reportId: id(2), resolution: "ticket" })]);
    expect(cardResult(b, NOW)?.kind).toBe("ticket");
  });
  it("환불된 주문 카드는 7일 동안만 「환불됐어요」, 그 뒤에는 서재에서 사라진다", () => {
    const refunded = (at: string) => buildShelf([row(1, { status: "unavailable" })], [order(1, { paymentStatus: "refunded", refundedAt: at, refundState: "done" })], [], NOW);
    const [b] = refunded("2026-11-05T00:00:00Z");
    expect(b).toMatchObject({ state: "refunded", href: null, orderCode: "GR-1" });
    expect(cardResult(b, NOW)).toEqual({ kind: "refund", text: "환불됐어요. 결제수단에 따라 바로 또는 영업일 3~5일 안에 돌아가요.", channel: false });
    expect(refunded("2026-10-29T00:00:00Z")).toEqual([]);
  });
  it("결제 30분 안이고 만드는 중이면 「안 나와요」 대신 기다려 달라고 한다(stillMaking)", () => {
    const at = (iso: string) => buildShelf([], [order(5, { bookStatus: "GENERATING", paidAt: iso })], [], NOW)[0];
    expect(stillMaking(at(new Date(NOW - 10 * 60_000).toISOString()), NOW)).toBe(true);
    expect(stillMaking(at(new Date(NOW - 40 * 60_000).toISOString()), NOW)).toBe(false);
  });
});

describe("인앱 브라우저(P 추가 A)", () => {
  const ios = (app: string) => `Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ${app}`;
  it("카카오톡·인스타그램·페이스북·네이버를 알아본다, 사파리·크롬은 아님", () => {
    expect(inAppBrowser(ios("KAKAOTALK 10.8.5"))).toBe("kakaotalk");
    expect(inAppBrowser(ios("Instagram 300.0.0"))).toBe("instagram");
    expect(inAppBrowser(ios("[FBAN/FBIOS;FBAV/450.0]"))).toBe("facebook");
    expect(inAppBrowser(ios("NAVER(inapp; search; 1000; 12.0)"))).toBe("naver");
    expect(inAppBrowser("Mozilla/5.0 (Linux; Android 14; SM-S918N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0 Mobile Safari/537.36")).toBe("webview");
    expect(inAppBrowser(ios("Version/18.0 Safari/604.1"))).toBeNull();
    expect(inAppBrowser("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36")).toBeNull();
  });
  it("기본 브라우저로 열기: 카카오톡 스킴, 안드로이드는 크롬 intent, 아이폰 다른 앱은 메뉴 안내(null)", () => {
    const url = "https://www.gyeolreport.com/login?next=%2Freport%2Fnew";
    expect(externalBrowserUrl("kakaotalk", ios("KAKAOTALK"), url)).toBe(`kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`);
    expect(externalBrowserUrl("instagram", "Mozilla/5.0 (Linux; Android 14) Instagram", url)).toBe("intent://www.gyeolreport.com/login?next=%2Freport%2Fnew#Intent;scheme=https;package=com.android.chrome;end");
    expect(externalBrowserUrl("instagram", ios("Instagram"), url)).toBeNull();
  });
});

describe("이용권 기한(P 추가 D)", () => {
  it("이번 이벤트 기한 전에는 11월 30일 23:59:59 KST, 지난 뒤에는 발급일 + 30일", () => {
    expect(ticketExpiresAt(NOW)).toBe(new Date(Date.parse(EVENT_TICKET_EXPIRES_AT)).toISOString());
    expect(kstMonthDayLabel(ticketExpiresAt(NOW))).toBe("11월 30일");
    expect(ticketExpiresAt(Date.parse("2026-12-01T00:00:00+09:00"))).toBe(new Date(Date.parse("2026-12-31T00:00:00+09:00")).toISOString());
    expect(kstMonthDayLabel("not a date")).toBe("");
  });
});
