import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
const ports = vi.hoisted(() => ({ book: true, account: true, owned: vi.fn(), paid: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => ports.book }));
vi.mock("../../../src/lib/account/gate", () => ({ accountPublicEnabled: () => ports.account }));
vi.mock("../../../src/lib/book/ownerAccess", () => ({ loadOwnedTicketBook: ports.owned }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: ports.paid }) }));
// The real six-product renderer is covered by ticketPublication.test. Here test
// routing authority and absence of paid/Meta behavior, without a second fixture.
vi.mock("../../../src/lib/book/storedReport", () => ({ validateBookPublication: vi.fn(), StoredBookReport: ({ shareOwner }: { shareOwner: { reportId: string } }) => <article data-ticket-book>{shareOwner.reportId}</article> }));
vi.mock("../../../src/components/analytics/MetaPurchaseTracker", () => ({ default: () => <div data-meta-purchase /> }));
import ReportPage from "../../../src/app/reports/[reportId]/page";
const id = `report_${"a".repeat(32)}`;
const render = async () => renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: id }) }));
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs(); ports.book = true; ports.account = true; });
describe("ticket owner before paid-order lookup", () => {
  it("owned completed ticket gets Book + share owner, never paid lookup or Purchase tracker", async () => {
    ports.owned.mockResolvedValue({ kind: "ticketBook", snapshot: { reportId: id } });
    const html = await render(); expect(html).toContain("data-ticket-book"); expect(html).toContain(id); expect(html).not.toContain("data-meta-purchase");
    expect(ports.paid).not.toHaveBeenCalled();
  });
  it("storage error is not presented as no ownership or redirected to payment", async () => {
    ports.owned.mockResolvedValue({ kind: "storageError" }); const html = await render();
    expect(html).toContain("열람 정보를 확인하지 못했습니다"); expect(html).not.toContain("결제하기"); expect(ports.paid).not.toHaveBeenCalled();
  });
  it("absent ticket proceeds to unchanged paid lookup; gate OFF never constructs ticket read", async () => {
    vi.stubEnv("NODE_ENV", "production");
    ports.owned.mockResolvedValue({ kind: "absent" }); ports.paid.mockResolvedValue({ ok: true, status: "QUEUED" });
    await render(); expect(ports.paid).toHaveBeenCalledWith("read_report", { reportId: id });
    ports.owned.mockClear(); ports.account = false; await render(); expect(ports.owned).not.toHaveBeenCalled();
  });
});
