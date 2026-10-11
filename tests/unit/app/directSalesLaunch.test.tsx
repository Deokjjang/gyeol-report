import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("../../../src/components/account/AccountSession", () => ({
  useAccountSession: () => ({ session: { status: "member", displayName: "출시검수" }, loaded: true, error: null, verifying: false, refresh: vi.fn(), base: "/auth" }),
  announceAccountChange: vi.fn(),
}));
import { bookExperiencePublicEnabled } from "../../../src/lib/book/publicGate";
import { accountPublicEnabled } from "../../../src/lib/account/gate";
import { ticketShopEnabled } from "../../../src/lib/tickets/shopGate";
import { ticketBundleCommerceEnabled, AUTOMATIC_BUNDLE_REFUND_ENABLED } from "../../../src/lib/tickets/bundleCatalog";
import { BUNDLE_PURCHASE_POLICY_VERSION } from "../../../src/lib/tickets/shopContract";
import { BookHomeRoute, BookInputRoute } from "../../../src/components/book/BookRoutes";
import { AccountScreen } from "../../../src/components/account/AccountScreen";
import { getReportProductCatalog } from "../../../src/lib/payment/reportProductCatalog";

describe("approved direct-sales launch boundary", () => {
  it("enables Book/account only; paid commerce and automatic refund stay closed", () => {
    expect(bookExperiencePublicEnabled()).toBe(true);
    expect(accountPublicEnabled()).toBe(true);
    expect(ticketBundleCommerceEnabled()).toBe(false);
    expect(ticketShopEnabled()).toBe(false);
    expect(BUNDLE_PURCHASE_POLICY_VERSION).toBeNull();
    expect(AUTOMATIC_BUNDLE_REFUND_ENABLED).toBe(false);
    const products = getReportProductCatalog().filter(p => p.isPurchasable);
    expect(products).toHaveLength(6);
    expect(products.every(p => p.amount === 1490)).toBe(true);
  });
  it("public home/input pass account ON but paid-shop OFF", async () => {
    expect((await BookHomeRoute({})).props.authEnabled).toBe(true);
    const input = (await BookInputRoute({})).props.children.props;
    expect(input).toMatchObject({ internal: false, authEnabled: true, ticketShopEnabled: false });
  });
  it("member library retains ticket balance without paid-store links", () => {
    const html = renderToStaticMarkup(<AccountScreen ticketShopEnabled={ticketShopEnabled()} />);
    expect(html).toContain("내 서재");
    expect(html).toContain("data-ticket-summary");
    expect(html).toContain("리포트 이용권");
    expect(html).not.toContain('href="/account/tickets"');
    expect(html).not.toContain("묶음 이용권 구매");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("free-ticket checkout uses summary/redeem independently of the paid-store gate", () => {
    const checkout = readFileSync("src/components/book/BookCheckout.tsx", "utf8");
    expect(checkout).toContain('"/auth"}/ticket-summary');
    expect(checkout).toContain('if (!internal && method === "ticket")');
    expect(checkout).toContain("await publication.submit(payload, consents");
    expect(checkout).toContain("리포트 이용권 1장 사용");
    expect(checkout).toContain("ticketShopEnabled && !ticketPending ? <button");
  });
});
