// AM2-14 1부(호출 0): 세운 상품 이름 「나의 2027」 · 세운 · 대운 소개 — 판매 화면(홈 · 입력 · 결제 · 결제 완료 · 서재 진행 카드)은 신년판 연도,
// 과거 책(저장 연도 2026)의 표시는 그대로.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const nav = vi.hoisted(() => ({ product: "annual-fortune" }));
vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams(`product=${nav.product}`), useRouter: () => ({ push: () => {}, replace: () => {} }) }));
vi.mock("../../../src/components/book/useSalesPaused", () => ({ useSalesPaused: () => null }));
import { BookHomeRoute } from "../../../src/components/book/BookRoutes";
import { BookShelf } from "../../../src/components/book/BookShelf";
import { BookInput, FortuneIntro } from "../../../src/components/book/BookInput";
import { OrderSummaryCard } from "../../../src/components/ops/OrderParts";
import { BOOKS, readerTitle } from "../../../src/lib/book/product";
import { annualProductYear, FORTUNE_REOPEN_LINE } from "../../../src/lib/ops/config";
import { DAYUN_UNDETERMINABLE_MESSAGE } from "../../../src/lib/saju/dayunReadiness";
import { preparePaymentCheckoutSession } from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import { customerProductLabelKo, getReportProduct, reportPriceKrw } from "../../../src/lib/payment/reportProductCatalog";
import { buildShelf } from "../../../src/lib/library/shelf";
import type { ReportProductType } from "../../../src/lib/payment/reportProductTypes";

const annual = BOOKS.find(b => b.id === "annual")!, major = BOOKS.find(b => b.id === "major")!;
const NOW = Date.parse("2026-11-24T03:00:00.000Z");

describe("AM2-14 1부 세운 이름 「나의 2027」", () => {
  it("신년판 연도는 env 없이 2027", () => { expect(annualProductYear({})).toBe(2027); expect(annualProductYear()).toBe(2027); });
  it("홈 카드: 달력 해(11월 = 2026)가 아니라 신년판 연도를 넘긴다 — 표지 · 이름표 「나의 2027」, 닫힘 안내 그대로", async () => {
    const route = await BookHomeRoute({});
    expect(route.props.year).toBe(2027);
    const html = renderToStaticMarkup(createElement(BookShelf, { inputPath: "/report/new", year: route.props.year, closed: ["major_fortune", "annual_fortune"] }));
    expect(html).toContain("나의 2027");
    expect(html).toContain(FORTUNE_REOPEN_LINE);
    expect(html).not.toContain("나의 2026");
    expect(html).not.toContain("나의 한 해");
  });
  it("입력 닫힘 안내: 머리 「나의 2027 / NOTICE」 · 소개 · 12월 1일 공개, 「나의 한 해」 없음", () => {
    nav.product = "annual-fortune";
    const a = renderToStaticMarkup(createElement(BookInput, { internal: false, now: "2026-11-24T03:00:00.000Z", closed: ["major_fortune", "annual_fortune"] }));
    expect(a).toContain("data-sales-closed");
    expect(a).toContain("나의 2027 / NOTICE");
    expect(a).toContain("1월 다리와 열두 절기월, 13개월을 달 카드로 펼치고 한 해 흐름표와 2027년 운을 쓰는 법을 담았어요.");
    expect(a).toContain("세운(나의 2027)은 2027년 흐름을 담아 12월 1일에 새로 공개해요");
    expect(a).not.toMatch(/나의 한 해|나의 2026/);
    nav.product = "major-fortune";
    const m = renderToStaticMarkup(createElement(BookInput, { internal: false, now: "2026-11-24T03:00:00.000Z", closed: ["major_fortune", "annual_fortune"] }));
    expect(m).toContain("앞으로의 나 / NOTICE");
    expect(m).toContain("내 인생이라는 책의 차례에서 지금 장과 다음 장을 읽고, 두 장 사이 문턱을 맞대 본 뒤 10년 영역 지도와 10년 실천 지도로 정리해요.");
    nav.product = "annual-fortune";
  });
  it("입력 첫 쪽 소개: 이름 · 가격(세운 정가 / 대운 정가 · 세운 구매자 반값) — 확정 예언 말 없음", () => {
    const a = renderToStaticMarkup(createElement(FortuneIntro, { book: annual, withPrice: true }));
    expect(a).toContain(`나의 2027 · ${reportPriceKrw("annual_fortune").toLocaleString("ko-KR")}원`);
    const m = renderToStaticMarkup(createElement(FortuneIntro, { book: major, withPrice: true }));
    expect(m).toMatch(/앞으로의 나 · [\d,]+원 · 세운을 산 분은 [\d,]+원/);
    for (const html of [a, m]) expect(html).not.toMatch(/됩니다|생깁니다|일어납니다|반드시/);
    expect(renderToStaticMarkup(createElement(FortuneIntro, { book: BOOKS[0], withPrice: true }))).toBe("");
  });
  it("대운 시각 미상 안내 · 세운 권하는 링크: 「세운(나의 2027)」", () => {
    expect(DAYUN_UNDETERMINABLE_MESSAGE).toBe("이 생일은 대운을 정확히 계산할 수 없어요. 대운(앞으로의 나) 대신 세운(나의 2027)을 권해요 — 세운은 이 입력 그대로 만들 수 있어요.");
  });
  it("결제 이름(토스 orderName · 카카오 itemName · 결제 완료 「상품」): 세운만 「나의 2027」, 4종 · 대운은 카탈로그 이름 그대로", () => {
    for (const key of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as ReportProductType[]) {
      const r = preparePaymentCheckoutSession({ paymentOrderId: "po", providerOrderId: "provider_order_x", productType: key, provider: "toss", currency: "KRW", status: "ready", amount: reportPriceKrw(key) } as never);
      expect(r.ok).toBe(true);
      const want = key === "annual_fortune" ? "나의 2027" : getReportProduct(key)!.labelKo;
      if (r.ok) { expect(r.session.productLabelKo).toBe(want); expect((r.session.providerPayload as { orderName?: string }).orderName).toBe(want); }
      expect(customerProductLabelKo(key)).toBe(want);
    }
    const card = (productType: string) => renderToStaticMarkup(createElement(OrderSummaryCard, { order: { orderCode: "ABC123", productType, amount: 3900, paymentStatus: "paid", createdAt: "2026-12-01T00:10:00Z", paidAt: "2026-12-01T00:10:00Z", refundedAt: null, reportId: null, receiptUrl: null, bookStatus: null, edition: null, refundState: null, openRequests: 0 } }));
    expect(card("annual_fortune")).toContain("<dd>나의 2027</dd>");
    expect(card("saju_mbti_full")).toContain("<dd>사주×MBTI 종합 리포트</dd>");
    expect(card("major_fortune")).toContain("<dd>대운 리포트</dd>");
  });
  it("서재: 만드는 중 · 환불 카드의 세운은 「나의 2027」, 완성 카드는 저장 연도(과거 「나의 2026」 그대로)", () => {
    const paidAt = new Date(NOW - 60_000).toISOString();
    const shelf = buildShelf(
      [{ reportId: "report_aaaaaaaaaaaaaaaa", productType: "annual_fortune", displayName: "하린", selectedYear: "2026", publishedAt: "2026-11-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z", reportVersion: "v4", status: "available", source: "ticket" }],
      [{ orderCode: "MAKE01", reportId: "report_bbbbbbbbbbbbbbbb", productType: "annual_fortune", paymentStatus: "paid", bookStatus: "QUEUED", createdAt: paidAt, paidAt, refundState: "none" },
        { orderCode: "REFD01", reportId: "report_cccccccccccccccc", productType: "annual_fortune", paymentStatus: "refunded", bookStatus: null, createdAt: paidAt, paidAt, refundState: "done", refundedAt: paidAt }],
      [], NOW);
    const by = (id: string) => shelf.find(b => b.reportId === id)?.title;
    expect(by("report_aaaaaaaaaaaaaaaa")).toBe("나의 2026");
    expect(by("report_bbbbbbbbbbbbbbbb")).toBe("나의 2027");
    expect(by("report_cccccccccccccccc")).toBe("나의 2027");
    expect(readerTitle(annual, "2026")).toBe("나의 2026");
  });
});
