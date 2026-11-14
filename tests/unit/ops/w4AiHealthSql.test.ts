// W4 Q0 AI 상태 확인 — migration 20261115100000(PGlite, 외부 호출 0). 가짜 공급자(fetch)로 1분 크론을 분 단위로 흉내 낸다:
// 잔액 소진 → 즉시 멈춤·자동 재개 없음 / 장애 3분 → 멈춤 → 회복 5분 → 자동 재개 / 수동 멈춤은 회복해도 그대로 / 연결 주문 멈춤 → 회복 시 재개.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
// 크론 경로: 알림 일(runNotifyCycle)은 비우고, 저장소·봇은 이 파일의 PGlite·모의 텔레그램으로.
const route = vi.hoisted(() => ({ deps: null as unknown }));
vi.mock("@/lib/ops/notify/deps", () => ({ defaultBotDeps: () => route.deps }));
vi.mock("@/lib/ops/notify/flush", () => ({ runNotifyCycle: async () => ({ flushed: 0 }) }));
import { readFileSync } from "node:fs";
import { AI_HEALTH, classifyHealth, cronAiHealth, probeWriter } from "@/lib/ops/aiHealth";
import { anthropicAlarm, maybeAutoPause, type RunLite } from "@/lib/ops/generation/alerts";
import { fakeTelegram, opsNotifySql } from "../../helpers/opsNotify";
import { GET as opsNotifyCron } from "@/app/api/internal/ops-notify/route";

const W3 = "supabase/migrations/20261114100000_v5_w3_safety.sql", W4 = "supabase/migrations/20261115100000_v5_w4_ai_health.sql";
let h: Awaited<ReturnType<typeof opsNotifySql>>, tg: ReturnType<typeof fakeTelegram>;
const sales = { call: (a: string, d: Record<string, unknown> = {}) => h.rpc("ops_sales", a, d) };
const state = () => sales.call("status");
const health = () => h.one<{ value: Record<string, unknown> }>("select value from ops_settings where key='ai_health'").then(r => r?.value ?? null);
const auditOf = (action: string) => h.all<{ actor: string; detail: Record<string, unknown> }>("select actor,detail from ops_audit_log where action=$1 order by id", [action]);

/** 가짜 공급자: 분마다 정한 응답. 요청 본문은 남긴다(모양 확인). */
type Reply = { status: number; body?: string } | "timeout" | "network";
let script: Reply[] = [];
const bodies: Record<string, unknown>[] = [];
const fakeFetch = (async (_url: string | URL | Request, init?: RequestInit) => {
  bodies.push(JSON.parse(String(init?.body ?? "{}")));
  const r = script.shift() ?? { status: 200 };
  if (r === "network") throw new TypeError("fetch failed");
  if (r === "timeout") { await new Promise((_, rej) => { init?.signal?.addEventListener("abort", () => rej(Object.assign(new Error("aborted"), { name: "AbortError" }))); }); }
  const rr = r as { status: number; body?: string };
  return new Response(rr.body ?? JSON.stringify({ type: "message", content: [{ type: "text", text: "o" }], stop_reason: "max_tokens", usage: { input_tokens: 8, output_tokens: 1 } }), { status: rr.status });
}) as typeof fetch;
const env = { ANTHROPIC_API_KEY: "sk-test-not-real" };
/** 1분 지남: 지난 확인 시각을 61초 앞으로(40초 중복 막기를 넘김). */
const tick = () => h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '61 seconds')) where key='ai_health'");
/** 크론 한 번(= 1분). */
async function minute(r: Reply) { script = [r]; await tick(); return cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch }); }
/** 앱 경로 흉내: PostgREST처럼 session_user = authenticator, 역할 = service_role(W3 시험과 같은 방법). */
async function asApi<T>(f: () => Promise<T>): Promise<T> {
  await h.db.exec("reset role; set session authorization authenticator; set role service_role");
  try { return await f(); } finally { await h.db.exec("set session authorization postgres"); await h.db.exec("set role service_role"); }
}
const opsTexts = () => tg.sent("ops").map(m => m.text);
const R529 = { status: 529, body: '{"type":"error","error":{"type":"overloaded_error","message":"Overloaded"}}' };
const R402 = { status: 402, body: '{"type":"error","error":{"type":"billing_error","message":"Your credit balance is too low"}}' };
const R401 = { status: 401, body: '{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}' };

beforeAll(async () => {
  h = await opsNotifySql();
  await h.asOwner(async () => {
    await h.db.exec(readFileSync(W3, "utf8")); await h.db.exec(readFileSync(W4, "utf8"));
    await h.db.exec("do $$ begin if not exists(select 1 from pg_roles where rolname='authenticator') then create role authenticator noinherit; end if; end $$; grant service_role to authenticator;");
  });
}, 240_000);
afterAll(async () => { await h?.db.close(); });
beforeEach(async () => {
  tg = fakeTelegram("777000111");
  await h.exec("delete from ops_settings where key in ('sales_pause','ai_health','anthropic_alarm')");
  script = []; bodies.length = 0;
});

describe("요청 모양·분류(공식 문서 기준)", () => {
  it("작가 모델에 max_tokens 1 · thinking between_tools · 스트림 없음 · 짧은 사용자 한 줄. 키는 헤더로만", async () => {
    const seen: { url: string; headers: Record<string, string>; body: Record<string, unknown> }[] = [];
    const f = (async (url: string, init: RequestInit) => { seen.push({ url, headers: init.headers as Record<string, string>, body: JSON.parse(String(init.body)) }); return new Response("{}", { status: 200 }); }) as unknown as typeof fetch;
    const p = await probeWriter({ apiKey: "sk-test-not-real", fetchImpl: f });
    expect(p).toMatchObject({ status: 200, error: null });
    expect(seen[0].url).toBe("https://api.anthropic.com/v1/messages");
    expect(seen[0].body).toEqual({ model: "claude-sonnet-5-5", max_tokens: 1, messages: [{ role: "user", content: "ok" }], thinking: { type: "between_tools" } });
    expect(seen[0].body).not.toHaveProperty("stream");
    expect(seen[0].body).not.toHaveProperty("output_config");
    expect(seen[0].headers["x-api-key"]).toBe("sk-test-not-real");
    expect(AI_HEALTH.maxTokens).toBe(1);
  });
  it("분류: 2xx=정상 · 402/billing·credit·spend limit=잔액 · 401/403/authentication·permission=인증 · 429·5xx·529·overloaded·시간 초과·끊김=장애 · 그 밖 4xx=other", () => {
    const c = (status: number | null, body = "", error: "timeout" | "network" | null = null) => classifyHealth({ status, body, error, ms: 1 });
    expect(c(200)).toBe("ok");
    expect(c(402)).toBe("billing");
    expect(c(400, '{"error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API"}}')).toBe("billing");
    expect(c(400, "You have reached your specified workspace API usage limits / spend limit")).toBe("billing");
    expect(c(429, "monthly spend limit reached")).toBe("billing");
    expect(c(401)).toBe("auth"); expect(c(403)).toBe("auth"); expect(c(400, "permission_error")).toBe("auth");
    expect(c(529)).toBe("outage"); expect(c(500)).toBe("outage"); expect(c(503)).toBe("outage"); expect(c(429, "rate_limit_error")).toBe("outage");
    expect(c(null, "", "timeout")).toBe("outage"); expect(c(null, "", "network")).toBe("outage");
    expect(c(400, "invalid_request_error: max_tokens")).toBe("other"); expect(c(404, "not_found_error")).toBe("other");
  });
  it("시간 초과는 장애로(가짜 공급자가 답하지 않음 → 제한 시간에 끊음)", async () => {
    script = ["timeout"];
    const p = await probeWriter({ apiKey: "k", fetchImpl: fakeFetch, timeoutMs: 30 });
    expect(p.error).toBe("timeout");
    expect(classifyHealth(p)).toBe("outage");
  });
  it("키가 없으면 부르지 않는다(skipped — 판매 상태 그대로, 행도 안 씀)", async () => {
    const r = await cronAiHealth({ sales, tg }, {}, { fetchImpl: fakeFetch });
    expect(r).toMatchObject({ result: "skipped", changed: null });
    expect(bodies).toHaveLength(0);
    expect(await health()).toBeNull();
  });
});

describe("가짜 공급자 시뮬레이션(분 단위)", () => {
  it("① 잔액 소진 → 첫 확인에서 즉시 멈춤(reason billing) + 알림 1번. 계속 잔액 오류여도 다시 알리지 않음. 회복 10분이어도 자동 재개 없음", async () => {
    expect(await minute(R402)).toMatchObject({ result: "billing", changed: "paused" });
    expect(await state()).toMatchObject({ on: true, by: "auto", reason: "billing" });
    for (let i = 0; i < 3; i++) expect(await minute(R402)).toMatchObject({ changed: null });
    for (let i = 0; i < 10; i++) expect(await minute({ status: 200 })).toMatchObject({ result: "ok", changed: null });
    expect(await state()).toMatchObject({ on: true, reason: "billing" });
    expect(opsTexts()).toEqual(["🚨 <b>4종 판매 자동 멈춤</b> · Anthropic 잔액·결제 오류 · HTTP 402 · 자동 재개 안 함 — 풀리면 [다시 열기]"]);
    expect(tg.sent("ops")[0].markup).toEqual({ inline_keyboard: [[{ text: "다시 열기", callback_data: "sl:resume" }]] });
    expect(await health()).toMatchObject({ result: "ok", okStreak: 10, outStreak: 0, status: 200 });
    // 버튼으로 다시 열기 → 판매 중. 그대로 정상이면 아무 일 없음.
    expect(await sales.call("resume", { by: "telegram" })).toMatchObject({ on: false, changed: true });
    expect(await minute({ status: 200 })).toMatchObject({ changed: null });
    expect((await state()).on).toBe(false);
  });
  it("①' 인증 오류(401) → 즉시 멈춤(reason auth), 자동 재개 없음", async () => {
    expect(await minute(R401)).toMatchObject({ result: "auth", changed: "paused" });
    for (let i = 0; i < 6; i++) await minute({ status: 200 });
    expect(await state()).toMatchObject({ on: true, reason: "auth" });
    expect(opsTexts()).toEqual(["🚨 <b>4종 판매 자동 멈춤</b> · Anthropic 인증·권한 오류 · HTTP 401 · 자동 재개 안 함 — 풀리면 [다시 열기]"]);
  });
  it("② 장애 2분은 그대로, 3분 연속 → 멈춤(outage) → 회복 4분은 그대로, 5분 연속 → 자동 재개 + 알림(멈춤·재개 각 1번)", async () => {
    expect(await minute(R529)).toMatchObject({ result: "outage", changed: null });
    expect(await minute("network")).toMatchObject({ result: "outage", changed: null });
    expect((await state()).on).toBe(false);
    expect(await minute({ status: 503 })).toMatchObject({ result: "outage", changed: "paused" });
    expect(await state()).toMatchObject({ on: true, by: "auto", reason: "outage" });
    expect(await minute(R529)).toMatchObject({ changed: null });
    for (let i = 0; i < 4; i++) expect(await minute({ status: 200 })).toMatchObject({ changed: null });
    expect((await state()).on).toBe(true);
    expect(await minute({ status: 200 })).toMatchObject({ changed: "resumed" });
    expect(await state()).toMatchObject({ on: false, by: "auto", reason: "recovered" });
    expect(opsTexts()).toEqual([
      "🚨 <b>4종 판매 자동 멈춤</b> · AI 서버 장애 3분 연속 · HTTP 503 · 5분 연속 정상이면 자동 재개",
      "▶️ <b>4종 판매 자동 재개</b> · AI 상태 확인 5분 연속 정상(멈춤 이유: AI 상태 확인 장애)",
    ]);
    expect(tg.sent("ops")[1].markup).toEqual({ inline_keyboard: [[{ text: "4종 멈춤", callback_data: "sl:pause" }]] });
    expect((await auditOf("sales_resumed")).at(-1)).toMatchObject({ actor: "system", detail: { by: "auto", reason: "recovered", detail: { source: "health", from: "outage", okStreak: 5 } } });
  });
  it("②' 장애 사이에 정상이 끼면 처음부터(연속만 셈). other(400 등)도 연속을 끊는다", async () => {
    await minute(R529); await minute(R529); await minute({ status: 200 }); await minute(R529); await minute(R529);
    expect((await state()).on).toBe(false);
    await minute({ status: 400, body: "invalid_request_error" });
    await minute(R529); await minute(R529);
    expect((await state()).on).toBe(false);
    expect(await minute(R529)).toMatchObject({ changed: "paused" });
  });
  it("②'' 지난 확인이 3분 넘게 비면(크론 빠짐) 처음부터, 40초 안 중복 호출은 세지 않음(RECENT)", async () => {
    await minute(R529); await minute(R529);
    await h.exec("update ops_settings set value=jsonb_set(value,'{at}',to_jsonb(now()-interval '4 minutes')) where key='ai_health'");
    script = [R529];
    expect(await cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch })).toMatchObject({ changed: null });
    expect(await health()).toMatchObject({ outStreak: 1 });
    script = [R529];
    expect(await cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch })).toMatchObject({ changed: null });
    expect(await health()).toMatchObject({ outStreak: 1 });
  });
  it("③ 손으로 멈춘 것은 회복이 계속돼도 그대로(자동 재개 없음), 장애·잔액이 나도 이유를 바꾸지 않음", async () => {
    await sales.call("pause", { by: "telegram", reason: "manual" });
    for (let i = 0; i < 8; i++) expect(await minute({ status: 200 })).toMatchObject({ changed: null });
    await minute(R529); await minute(R529); await minute(R529); await minute(R402);
    expect(await state()).toMatchObject({ on: true, by: "telegram", reason: "manual" });
    expect(opsTexts()).toEqual([]);
  });
  it("④ 연결 오류 주문 멈춤(10분 3건) → 상태 확인 5분 연속 정상 → 자동 재개. 멈추기 전의 정상 횟수는 세지 않는다", async () => {
    for (let i = 0; i < 7; i++) await minute({ status: 200 });
    expect(await health()).toMatchObject({ okStreak: 7 });
    const run = (id: string): RunLite => ({ report_id: id, outcome: "deferred", created_at: new Date().toISOString(), calls: [{ kind: "first", cls: "connection" }], product: "saju_mbti_full" });
    const sent: string[] = [];
    expect(await maybeAutoPause((a, d) => sales.call(a, d), async t => { sent.push(t); }, [run("c1"), run("c2"), run("c3")], Date.now() + 1000)).toBe(true);
    expect(sent[0]).toContain("AI 상태 확인이 5분 연속 정상이면 자동으로 다시 열어요");
    expect(await state()).toMatchObject({ on: true, reason: "connection" });
    expect(await health()).toMatchObject({ okStreak: 0 });
    for (let i = 0; i < 4; i++) expect(await minute({ status: 200 })).toMatchObject({ changed: null });
    expect(await minute({ status: 200 })).toMatchObject({ changed: "resumed" });
    expect(opsTexts()).toEqual(["▶️ <b>4종 판매 자동 재개</b> · AI 상태 확인 5분 연속 정상(멈춤 이유: 연결 오류 연속)"]);
  });
  it("⑤ 장애로 멈춘 중 잔액 오류 → 이유를 billing으로 올림(알림 1번) → 이후 회복해도 자동 재개 없음", async () => {
    await minute(R529); await minute(R529); await minute(R529);
    expect(await minute(R402)).toMatchObject({ changed: "escalated" });
    expect(await state()).toMatchObject({ on: true, by: "auto", reason: "billing" });
    for (let i = 0; i < 6; i++) expect(await minute({ status: 200 })).toMatchObject({ changed: null });
    expect((await state()).on).toBe(true);
    expect(opsTexts()).toEqual([
      "🚨 <b>4종 판매 자동 멈춤</b> · AI 서버 장애 3분 연속 · HTTP 529 · 5분 연속 정상이면 자동 재개",
      "🚨 <b>4종 판매 멈춤 이유 바뀜</b> · Anthropic 잔액·결제 오류 · HTTP 402 · 자동 재개 안 함 — 풀리면 [다시 열기]",
    ]);
    expect((await auditOf("sales_pause_escalated")).at(-1)).toMatchObject({ actor: "system", detail: { from: "outage", reason: "billing" } });
  });
  it("⑥ 작가 호출 잔액 경보(alarm)도 reason billing|auth로 멈추고, 자동 멈춤(장애) 중이면 올린다 — 쿨다운 중에도", async () => {
    const sent: string[] = [];
    expect(await anthropicAlarm((a, d) => sales.call(a, d), async t => { sent.push(t); }, "anthropic_credit")).toBe(true);
    expect(await state()).toMatchObject({ on: true, by: "auto", reason: "billing" });
    for (let i = 0; i < 6; i++) await minute({ status: 200 });
    expect((await state()).on).toBe(true);
    await sales.call("resume", { by: "telegram" });
    await minute(R529); await minute(R529); await minute(R529);
    expect(await state()).toMatchObject({ reason: "outage" });
    // 1시간 쿨다운 안: 경보는 다시 안 보내지만 이유는 auth로 올린다.
    expect(await anthropicAlarm((a, d) => sales.call(a, d), async t => { sent.push(t); }, "anthropic_auth")).toBe(false);
    expect(await state()).toMatchObject({ on: true, reason: "auth" });
    for (let i = 0; i < 6; i++) await minute({ status: 200 });
    expect((await state()).on).toBe(true);
    expect(sent).toHaveLength(1);
  });
  it("⑦ 여러 워커가 같은 분에 겹쳐 불러도 멈춤 알림은 1번(잠금 + 40초 중복 막기)", async () => {
    await minute(R529); await minute(R529); await tick();
    script = [R529, R529];
    const [a, b] = await Promise.all([cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch }), cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch })]);
    expect([a?.changed, b?.changed].filter(Boolean)).toEqual(["paused"]);
    expect(opsTexts()).toHaveLength(1);
  });
  it("⑧ 결과는 ops_settings 한 행만(분마다 덮어씀). 상태 확인은 생성 기록·감사(멈춤·재개 말고)에 줄을 남기지 않는다", async () => {
    const count = async (t: string) => (await h.one<{ n: number }>(`select count(*)::int n from ${t}`)).n;
    const runs0 = await count("book_generation_runs");
    for (let i = 0; i < 5; i++) {
      await tick(); // 시험용 시계 당김은 CLI처럼 감사에 남는다 — 그 뒤부터 센다.
      const audit0 = await count("ops_audit_log");
      script = [{ status: 200 }];
      expect(await asApi(() => cronAiHealth({ sales, tg }, env, { fetchImpl: fakeFetch }))).toMatchObject({ result: "ok", changed: null });
      expect(await count("ops_audit_log")).toBe(audit0);
    }
    expect(await count("ops_settings where key='ai_health'")).toBe(1);
    expect(await count("book_generation_runs")).toBe(runs0);
  });
  it("⑨ 잘못된 결과 값은 거절, service_role은 ops_settings에 직접 못 쓴다(쓰기는 ops_sales만)", async () => {
    expect(await sales.call("health", { result: "great" })).toMatchObject({ ok: false, code: "INVALID" });
    await expect(h.db.query("insert into ops_settings(key,value) values('ai_health','{}')")).rejects.toThrow();
  });
});

describe("1분 크론(ops-notify) 연결", () => {
  const call = () => opsNotifyCron(new Request("http://localhost/api/internal/ops-notify", { headers: { authorization: "Bearer cron-test" } }));
  it("운영 배포에서만 상태 확인을 부른다(미리보기·로컬은 부르지 않음). 응답엔 결과·바뀜만", async () => {
    route.deps = { sales, tg };
    const real = globalThis.fetch;
    globalThis.fetch = fakeFetch;
    try {
      vi.stubEnv("CRON_SECRET", "cron-test"); vi.stubEnv("ANTHROPIC_API_KEY", "sk-test-not-real");
      vi.stubEnv("VERCEL_ENV", "preview");
      expect(await (await call()).json()).toMatchObject({ ok: true, health: null });
      expect(bodies).toHaveLength(0);
      vi.stubEnv("VERCEL_ENV", "production");
      script = [R402];
      expect(await (await call()).json()).toMatchObject({ ok: true, flushed: 0, health: { result: "billing", changed: "paused" } });
      expect(bodies).toHaveLength(1);
      expect(await state()).toMatchObject({ on: true, reason: "billing" });
      expect(opsTexts()).toHaveLength(1);
    } finally { globalThis.fetch = real; vi.unstubAllEnvs(); }
  });
  it("저장소가 실패해도 크론은 200(다른 일을 막지 않음)", async () => {
    route.deps = { sales: { call: async () => { throw new Error("db down"); } }, tg };
    const real = globalThis.fetch;
    globalThis.fetch = fakeFetch;
    try {
      vi.stubEnv("CRON_SECRET", "cron-test"); vi.stubEnv("ANTHROPIC_API_KEY", "sk-test-not-real"); vi.stubEnv("VERCEL_ENV", "production");
      const r = await call();
      expect(r.status).toBe(200);
      expect(await r.json()).toMatchObject({ ok: true, health: null });
    } finally { globalThis.fetch = real; vi.unstubAllEnvs(); }
  });
});
