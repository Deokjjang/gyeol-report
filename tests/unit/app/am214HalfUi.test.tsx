// AM2-14 4부(호출 0): 대운 반값 화면 — 세운 책 끝 · 서재 세운 카드 버튼(닫힘 「12월 1일 공개」 · 결제로 안 넘어감 / 열림 = 대운 입력 링크), 결제 화면 「세운 구매 혜택 · 반값」.
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams("product=major-fortune"), useRouter: () => ({ push: () => {}, replace: () => {} }) }));
import { ShelfCard } from "../../../src/components/account/LibraryHome";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { BookCheckout } from "../../../src/components/book/BookCheckout";
import { MAJOR_HALF_CTA, MAJOR_HALF_CTA_CLOSED, MAJOR_HALF_LINE } from "../../../src/lib/book/product";
import { FORTUNE_SALES_OPEN_AT } from "../../../src/lib/ops/config";
import { majorHalfPriceKrw, reportPriceKrw } from "../../../src/lib/payment/reportProductCatalog";
import type { ShelfBook } from "../../../src/lib/library/shelf";

const OPEN = Date.parse(FORTUNE_SALES_OPEN_AT);
afterEach(() => { vi.useRealTimers(); });
const at = (t: number) => { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(t); };
const shelf = (productType: string): ShelfBook => ({ reportId: "report_aaaaaaaaaaaaaaaa", productType, title: "나의 2027", displayName: "하린", coverColor: "#CED1D4", ink: "#111111", state: "ready", href: "/reports/report_aaaaaaaaaaaaaaaa",
  publishedAt: "2026-12-01T01:00:00Z", openEnded: true, expiresAt: null, orderCode: "GR-AB12", viaTicket: false, madeAt: "2026-12-01T00:50:00Z", request: null, refundedAt: null });

describe("AM2-14 4부 대운 반값 버튼", () => {
  it("서재 세운 카드: 판매 전 = 「12월 1일 공개」(링크 없음) · 판매 시작 뒤 = 대운 입력(그 세운 미리 채움) 링크 · 세운이 아닌 카드엔 없음", () => {
    at(OPEN - 60_000);
    const closed = renderToStaticMarkup(<ShelfCard book={shelf("annual_fortune")} onChanged={() => {}} />);
    expect(closed).toContain(`${MAJOR_HALF_CTA} · ${MAJOR_HALF_CTA_CLOSED}`); expect(closed).not.toContain("product=major-fortune");
    at(OPEN);
    const open = renderToStaticMarkup(<ShelfCard book={shelf("annual_fortune")} onChanged={() => {}} />);
    expect(open).toContain('href="/report/new?product=major-fortune&amp;from=report_aaaaaaaaaaaaaaaa"'); expect(open).toContain(MAJOR_HALF_CTA); expect(open).not.toContain(MAJOR_HALF_CTA_CLOSED);
    expect(renderToStaticMarkup(<ShelfCard book={shelf("saju_mbti_full")} onChanged={() => {}} />)).not.toContain(MAJOR_HALF_CTA);
  });
  it("세운 책 끝 「이어 보기」 쪽: 판매 전 = 닫힘 문구(결제로 안 넘어감) · 뒤 = 대운 입력 링크(책 id를 싣지 않는다)", () => {
    const data = { bookId: "annual", title: "나의 2027", people: [], pages: [] } as never;
    const page = { kind: "continue", title: "앞으로 10년의 흐름, 대운으로 이어 보기", text: "…", href: "/report/new?product=major-fortune&from=annual" } as never;
    at(OPEN - 1);
    const closed = renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
    expect(closed).toContain('data-continue-major="closed"'); expect(closed).toContain(MAJOR_HALF_CTA_CLOSED); expect(closed).not.toContain("href=\"/report/new");
    at(OPEN + 1);
    const open = renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
    expect(open).toContain('href="/report/new?product=major-fortune&amp;from=annual"'); expect(open).toContain(`${MAJOR_HALF_CTA} →`);
  });
});

describe("AM2-14 4부 결제 화면", () => {
  const payload = { productKey: "major_fortune", productSlug: "major-fortune", person: { name: "윤태민", birthDate: "1998-11-03", birthTime: "10:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTP" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] }, productOptions: {} } as never;
  it("「세운 구매 혜택 · 반값」 줄과 반값 금액, 반값이 없으면 정가만", () => {
    const HALF = majorHalfPriceKrw(), PRICE = reportPriceKrw("major_fortune");
    const withHalf = renderToStaticMarkup(<BookCheckout payload={payload} now="2026-12-02T00:00:00.000Z" internal authEnabled={false} discount={{ from: "annual", amount: HALF, original: PRICE }} onPublishing={() => {}} onError={() => {}} />);
    expect(withHalf).toContain(MAJOR_HALF_LINE); expect(withHalf).toContain(`${PRICE.toLocaleString("ko-KR")}원 → ${HALF.toLocaleString("ko-KR")}원`);
    expect(withHalf).toMatch(new RegExp(`PRICE</dt><dd>${HALF.toLocaleString("ko-KR")}원`));
    expect(withHalf).not.toMatch(/7일|같은 사람/);
    const plain = renderToStaticMarkup(<BookCheckout payload={payload} now="2026-12-02T00:00:00.000Z" internal authEnabled={false} onPublishing={() => {}} onError={() => {}} />);
    expect(plain).not.toContain(MAJOR_HALF_LINE); expect(plain).toMatch(new RegExp(`PRICE</dt><dd>${PRICE.toLocaleString("ko-KR")}원`));
  });
});
