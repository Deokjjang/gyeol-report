// 로컬 E2E 전용: dev 서버 프로세스의 fetch에서 api.tosspayments.com만 가로채 문서 형식의 응답을 돌려준다(실제 토스 호출 없음).
// 상태는 파일에 둔다(여러 서버 프로세스 공유, TOSS_MOCK_DIR). 비밀값은 기록하지 않는다(Basic 헤더가 test_ 키인지 여부만).
// 쓰는 법: NODE_OPTIONS="--import <절대경로>/tools/p6d/toss-mock.mjs" TOSS_MOCK_DIR=<임시 폴더> pnpm dev:v5
// 왜: 토스 샌드박스 결제창은 카드사 실제 인증(앱)으로 넘어가 자동화할 수 없다. 결제창은 테스트 키로 띄워 확인하고, 승인·취소만 이 대역이 받는다.
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
const DIR = process.env.TOSS_MOCK_DIR ?? new URL(".", import.meta.url).pathname, STORE = DIR + "toss-mock-state.json", LOG = DIR + "toss-mock.log";
const load = () => existsSync(STORE) ? JSON.parse(readFileSync(STORE, "utf8")) : { payments: {}, idem: {} };
const keep = s => writeFileSync(STORE, JSON.stringify(s, null, 1));
const realFetch = globalThis.fetch;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
globalThis.fetch = async function mockedFetch(input, init = {}) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.startsWith("https://api.tosspayments.com/")) return realFetch(input, init);
  const headers = new Headers(init.headers ?? (typeof input === "object" && "headers" in input ? input.headers : undefined));
  const auth = headers.get("authorization") ?? "";
  const testKey = auth.startsWith("Basic ") && Buffer.from(auth.slice(6), "base64").toString().startsWith("test_");
  const method = (init.method ?? "GET").toUpperCase(), path = new URL(url).pathname, body = init.body ? JSON.parse(String(init.body)) : {};
  appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), method, path: path.replace(/\/payments\/[^/]+/, m => m.length > 40 ? m.slice(0, 30) + "…" : m), testKey, idem: headers.get("idempotency-key") ?? null }) + "\n");
  if (!testKey) return json({ code: "UNAUTHORIZED_KEY", message: "mock: test key required" }, 401);
  const s = load(), idem = headers.get("idempotency-key");
  if (idem && s.idem[idem]) return json(s.payments[s.idem[idem]]);
  if (method === "POST" && path === "/v1/payments/confirm") {
    const prev = s.payments[body.paymentKey];
    if (prev) return json({ code: "ALREADY_PROCESSED_PAYMENT", message: "이미 처리된 결제 입니다." }, 400);
    const now = new Date().toISOString();
    const p = { mId: "tosspayments", paymentKey: body.paymentKey, orderId: body.orderId, orderName: "mock", status: "DONE", method: "카드", currency: "KRW", totalAmount: body.amount, balanceAmount: body.amount,
      suppliedAmount: Math.round(body.amount / 1.1), vat: body.amount - Math.round(body.amount / 1.1), isPartialCancelable: true, requestedAt: now, approvedAt: now, cancels: null,
      receipt: { url: `https://dashboard.tosspayments.com/receipt/redirection?transactionId=mock_${randomUUID().slice(0, 8)}` } };
    s.payments[p.paymentKey] = p; if (idem) s.idem[idem] = p.paymentKey; keep(s); return json(p);
  }
  let m = path.match(/^\/v1\/payments\/orders\/(.+)$/);
  if (method === "GET" && m) { const p = Object.values(s.payments).find(x => x.orderId === decodeURIComponent(m[1])); return p ? json(p) : json({ code: "NOT_FOUND_PAYMENT", message: "mock" }, 404); }
  m = path.match(/^\/v1\/payments\/([^/]+)(\/cancel)?$/);
  if (m) {
    const key = decodeURIComponent(m[1]), p = s.payments[key];
    if (!p) return json({ code: "NOT_FOUND_PAYMENT", message: "mock" }, 404);
    if (method === "GET") return json(p);
    if (method === "POST" && m[2]) {
      if (p.status === "CANCELED") return json({ code: "ALREADY_CANCELED_PAYMENT", message: "이미 취소된 결제 입니다." }, 400);
      const amount = body.cancelAmount ?? p.balanceAmount;
      p.cancels = [...(p.cancels ?? []), { transactionKey: "mocktx" + randomUUID().replace(/-/g, "").slice(0, 20), cancelAmount: amount, cancelReason: body.cancelReason, cancelStatus: "DONE", canceledAt: new Date().toISOString(), taxFreeAmount: 0, refundableAmount: 0 }];
      p.balanceAmount -= amount; p.status = p.balanceAmount === 0 ? "CANCELED" : "PARTIAL_CANCELED";
      s.payments[key] = p; if (idem) s.idem[idem] = key; keep(s); return json(p);
    }
  }
  return json({ code: "MOCK_UNSUPPORTED", message: path }, 404);
};
