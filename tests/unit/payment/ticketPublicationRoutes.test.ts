import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { ticketAuth } from "../../helpers/ticketPublicationSql";
const setup = vi.hoisted(() => ({ book: false, account: false, auth: vi.fn(), store: vi.fn(), batch: vi.fn(), handler: vi.fn() }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => setup.book }));
vi.mock("../../../src/lib/account/gate", () => ({ accountPublicEnabled: () => setup.account }));
vi.mock("../../../src/lib/account/supabase", () => ({ createAccountPort: setup.auth }));
vi.mock("../../../src/lib/tickets/supabase", () => ({ createTicketPublicationStore: setup.store }));
vi.mock("../../../src/lib/tickets/publicHandler", () => ({ handleTicketPublication: setup.handler }));
vi.mock("../../../src/lib/tickets/publicationWorker", () => ({ runTicketPublicationBatch: setup.batch }));
import { GET, POST } from "../../../src/app/auth/[action]/route";
import { GET as worker } from "../../../src/app/api/internal/report-ticket-jobs/route";
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs(); setup.book = false; setup.account = false; });
describe("public ticket gates before dependency construction", () => {
  it("release config schedules both isolated workers once per minute", () => {
    const config = JSON.parse(readFileSync("vercel.json", "utf8"));
    expect(config.crons).toEqual([
      { path: "/api/internal/report-jobs", schedule: "* * * * *" },
      { path: "/api/internal/report-ticket-jobs", schedule: "* * * * *" },
    ]);
  });
  it.each([[false,false],[true,false],[false,true]])("Book %s / Account %s rejects redeem/status before Auth/DB", async (book, account) => {
    setup.book = book; setup.account = account;
    for (const action of ["ticket-redeem", "ticket-status"]) {
      const req = new NextRequest(`https://gyeolreport.com/auth/${action}`, { method: action === "ticket-redeem" ? "POST" : "GET" });
      expect((await (action === "ticket-redeem" ? POST : GET)(req, { params: Promise.resolve({ action }) })).status).toBe(404);
    }
    expect(setup.auth).not.toHaveBeenCalled(); expect(setup.store).not.toHaveBeenCalled(); expect(setup.handler).not.toHaveBeenCalled();
  });
  it("both gates delegate to verified handler, without acquisition/payment constructors", async () => {
    setup.book = true; setup.account = true;
    const auth = ticketAuth(), store = { call: vi.fn() }; setup.auth.mockReturnValue(auth); setup.store.mockReturnValue(store); setup.handler.mockResolvedValue(new Response(null, { status: 202 }));
    const req = new NextRequest("https://gyeolreport.com/auth/ticket-redeem", { method: "POST" });
    expect((await POST(req, { params: Promise.resolve({ action: "ticket-redeem" }) })).status).toBe(202);
    expect(setup.handler).toHaveBeenCalledWith(req, "redeem", auth, store);
  });
  it("unavailable RPC constructor returns a safe 503, not raw configuration details", async () => {
    setup.book = true; setup.account = true; setup.auth.mockReturnValue(ticketAuth());
    setup.store.mockImplementationOnce(() => { throw Error("PRIVATE_CONFIG_ERROR"); });
    const response = await POST(new NextRequest("https://gyeolreport.com/auth/ticket-redeem", { method: "POST" }), { params: Promise.resolve({ action: "ticket-redeem" }) });
    expect(response.status).toBe(503); expect(await response.text()).not.toContain("PRIVATE_CONFIG_ERROR");
  });
  it("Cron missing/wrong credentials is 401; correct auth behind OFF gates is 404", async () => {
    vi.stubEnv("CRON_SECRET", "local-test-only");
    for (const authorization of ["", "Bearer wrong"]) expect((await worker(new Request("https://gyeolreport.com/api/internal/report-ticket-jobs", { headers: { authorization } }))).status).toBe(401);
    expect((await worker(new Request("https://gyeolreport.com/api/internal/report-ticket-jobs", { headers: { authorization: "Bearer local-test-only" } }))).status).toBe(404);
    expect(setup.store).not.toHaveBeenCalled(); expect(setup.batch).not.toHaveBeenCalled();
  });
  it("authenticated, both-gates-on worker uses only bounded ticket batch", async () => {
    vi.stubEnv("CRON_SECRET", "local-test-only"); setup.book = true; setup.account = true;
    const store = { call: vi.fn() }; setup.store.mockReturnValue(store); setup.batch.mockResolvedValue({ ok: true });
    expect((await worker(new Request("https://gyeolreport.com/api/internal/report-ticket-jobs", { headers: { authorization: "Bearer local-test-only" } }))).status).toBe(200);
    expect(setup.batch).toHaveBeenCalledWith(store);
  });
});
