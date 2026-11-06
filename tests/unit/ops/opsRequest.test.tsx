// 운영 Q 2·3·4부: 서재 문의 접수 서버(사유 둘·기기 정보·코드별 안내) · 문의 창 화면(사유 셋·안내 한 줄) · 웹훅/깨우기 경로 · 열람 기록(요청 범위 밖에서도 조용히). 외부 호출 0.
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest } from "next/server";
import { handleOrders } from "@/lib/ops/orders/handler";
import { OrderRequestForm } from "@/components/ops/OrderParts";
import { REQUEST_COPY, REQUEST_WINDOW_LINE, SUPPORT_CHAT_URL } from "@/lib/legal/socialLinks";
import { recordBookView, scheduleBookView, deviceKey } from "@/lib/ops/notify/views";
import { memberAccountPort, TEST_MEMBER } from "../../helpers/opsStoreStub";

const MEMBER = TEST_MEMBER;
const port = () => memberAccountPort() as unknown as Parameters<typeof handleOrders>[1];
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
function ops(submit: Record<string, unknown>) {
  const calls: { action: string; data: Record<string, unknown> }[] = [];
  return { calls, stores: {
    order: { call: async (action: string, data: Record<string, unknown> = {}) => { calls.push({ action, data }); return action === "summary" ? { ok: true, orders: [{ orderCode: "GR-F5C7", paymentOrderId: "po-1" }] } : { ok: false }; } },
    notify: { call: async (action: string, data: Record<string, unknown> = {}) => { calls.push({ action, data }); return submit; } },
    audit: async () => true,
  } };
}
const post = (body: Record<string, unknown>, ua = IPHONE) => new NextRequest("https://www.gyeolreport.com/auth/orders", { method: "POST", body: JSON.stringify(body),
  headers: { origin: "https://www.gyeolreport.com", "content-type": "application/json", "user-agent": ua } });

describe("문의 접수 서버(handleOrders POST)", () => {
  it("안 나옴·안 열림 접수: 기기 정보(user agent 요약)만 붙이고, 개인정보·메모는 붙이지 않는다", async () => {
    const o = ops({ ok: true, id: "q-1" });
    const r = await handleOrders(post({ op: "request", reason: "not_open", orderCode: "GR-F5C7", memo: "전화번호 010-1234-5678" }), port(), o.stores);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true, submitted: true, message: "접수됐어요. 확인 후 이 책 카드에서 결과를 알려 드릴게요." });
    expect(o.calls.find(c => c.action === "submit")?.data).toEqual({ userId: MEMBER.id, paymentOrderId: "po-1", reportId: null, reason: "not_open", device: "아이폰 사파리" });
  });
  it("이용권 책은 reportId로 접수한다", async () => {
    const o = ops({ ok: true, id: "q-2" });
    await handleOrders(post({ op: "request", reason: "not_open", reportId: "report_0123456789abcdef0123456789abcdef" }), port(), o.stores);
    expect(o.calls.find(c => c.action === "submit")?.data).toMatchObject({ paymentOrderId: null, reportId: "report_0123456789abcdef0123456789abcdef" });
  });
  it.each([
    ["MAKING", 409, REQUEST_COPY.making, { making: true }],
    ["NO_DOUBLE", 409, "같은 내용의 다른 결제가 없어요. 카카오톡 채널 상담원에게 문의해 주세요.", { channel: true }],
    ["ALREADY_OPEN", 409, "이미 접수된 요청이 있어요. 확인 후 이 책 카드에서 결과를 알려 드릴게요.", { submitted: true }],
    ["DAILY_LIMIT", 429, REQUEST_COPY.dailyLimit, { channel: true }],
  ])("%s → %i + 안내", async (code, status, error, extra) => {
    const r = await handleOrders(post({ op: "request", reason: code === "NO_DOUBLE" ? "double_paid" : "not_open", orderCode: "GR-F5C7" }), port(), ops({ ok: false, code }).stores);
    expect(r.status).toBe(status);
    expect(await r.json()).toEqual({ ok: false, code, error, ...extra });
  });
  it("옛 사유(환불을 원해요·기타·계산)는 받지 않는다", async () => {
    for (const reason of ["refund", "other", "calc_error", "delayed", "calc"]) {
      expect((await handleOrders(post({ op: "request", reason, orderCode: "GR-F5C7" }), port(), ops({ ok: true }).stores)).status).toBe(400);
    }
  });
  it("다른 출처에서 온 접수는 거절", async () => {
    const req = new NextRequest("https://www.gyeolreport.com/auth/orders", { method: "POST", body: "{}", headers: { origin: "https://evil.example", "content-type": "application/json" } });
    expect((await handleOrders(req, port(), ops({ ok: true }).stores)).status).toBe(403);
  });
});

describe("문의 창(서재 문의 창 아래 1줄 포함)", () => {
  it("사유 셋 + 안내 한 줄 + 「그 밖의 문의는 카카오톡 채널로」, 메모 칸 없음", () => {
    const html = renderToStaticMarkup(<OrderRequestForm orderCode="GR-F5C7" startOpen />);
    for (const t of [REQUEST_COPY.notOpen, REQUEST_COPY.doublePaid, REQUEST_COPY.calc, REQUEST_WINDOW_LINE, REQUEST_COPY.otherLink]) expect(html).toContain(t);
    expect(html).toContain(`href="${SUPPORT_CHAT_URL}"`);
    expect(html).not.toContain("textarea");
    expect(html).not.toContain("환불을 원해요");
    expect(html).not.toContain("제본이 너무 오래 걸려요");
    expect(html).not.toContain("기타 문의");
  });
  it("이용권 책에는 「두 번 결제」 사유가 없다, 열린 요청이 있으면 「접수됨」만", () => {
    expect(renderToStaticMarkup(<OrderRequestForm reportId="report_x" ticketBook startOpen />)).not.toContain(REQUEST_COPY.doublePaid);
    const done = renderToStaticMarkup(<OrderRequestForm orderCode="GR-F5C7" submitted />);
    expect(done).toContain(">접수됨<");
    expect(done).toContain("disabled");
  });
});

describe("경로·열람 기록", () => {
  it("텔레그램 웹훅: 비밀값이 다르면 401, 모르는 봇은 404", async () => {
    vi.stubEnv("TELEGRAM_SALES_BOT_TOKEN", "12345678:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    const { POST } = await import("@/app/api/telegram/[bot]/route");
    const req = (secret: string) => new Request("https://www.gyeolreport.com/api/telegram/sales", { method: "POST", body: "{}", headers: { "x-telegram-bot-api-secret-token": secret } });
    expect((await POST(req("x".repeat(64)), { params: Promise.resolve({ bot: "sales" }) })).status).toBe(401);
    expect((await POST(req("x"), { params: Promise.resolve({ bot: "other" }) })).status).toBe(404);
    vi.unstubAllEnvs();
  });
  it("열람 기록: 요청 범위 밖·저장소 없음이어도 던지지 않는다(책 열람을 막지 않는다), 기기는 해시 16자", async () => {
    await expect(scheduleBookView("report_x")).resolves.toBeUndefined();
    await expect(recordBookView("report_x", IPHONE)).resolves.toBeUndefined();
    expect(deviceKey(IPHONE)).toMatch(/^[a-f0-9]{16}$/);
    expect(deviceKey(null)).toBeNull();
  });
});
