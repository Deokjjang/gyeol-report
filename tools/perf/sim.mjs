/**
 * P 측정용 preload(제품 코드 무변경): NODE_OPTIONS="--import <이 파일>" next start
 * - PERF_DB_RTT_MS: Supabase로 나가는 fetch마다 왕복 지연을 더한다(iad1↔서울 ≈180, icn1↔서울 ≈3).
 * - PERF_EDGE_MS: 함수 경로(PERF_EDGE_RE) 요청마다 엣지→함수 왕복을 더한다(운영 iad1 실측 ≈200, icn1 ≈5).
 * - 요청마다 Supabase 호출 목록(경로·시작·길이)을 Server-Timing 헤더와 PERF_LOG(JSONL)에 남긴다.
 *   stages = 겹치지 않는 순차 단계 수(줄줄이 기다린 횟수), calls = 전체 호출 수.
 * - PERF_PUBLIC_HOST=1: 운영 빌드는 운영 출처만 받으므로(account/origin.ts) 들어오는 요청의 Host·Origin·Referer를
 *   https://www.gyeolreport.com으로 바꾸고, 나가는 Location은 다시 http://localhost:<포트>로 되돌린다(측정 전용, 제품 코드 무변경).
 */
import { AsyncLocalStorage } from "node:async_hooks";
import http from "node:http";
import { appendFileSync } from "node:fs";

const DB_RTT = Number(process.env.PERF_DB_RTT_MS ?? 0);
const EDGE = Number(process.env.PERF_EDGE_MS ?? 0);
const EDGE_RE = new RegExp(process.env.PERF_EDGE_RE ?? "^/(auth|api|reports|r|gift|login|payments|account/tickets)(/|\\?|$)");
const LOG = process.env.PERF_LOG;
const PUBLIC = process.env.PERF_PUBLIC_HOST === "1", PUB = "https://www.gyeolreport.com";
const als = new AsyncLocalStorage();
const sleep = ms => new Promise(r => setTimeout(r, ms));

const origFetch = globalThis.fetch;
globalThis.fetch = async function (input, init) {
  const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input?.url ?? "";
  if (!SUPA || !url.startsWith(SUPA)) return origFetch.call(this, input, init);
  const ctx = als.getStore();
  const t0 = performance.now();
  if (DB_RTT) await sleep(DB_RTT);
  const res = await origFetch.call(this, input, init);
  const t1 = performance.now();
  if (ctx) {
    const u = new URL(url);
    let name = u.pathname.replace(/^\/rest\/v1\//, "").replace(/^\/auth\/v1\//, "auth/");
    const sel = u.searchParams.get("select");
    if (sel && !name.startsWith("rpc")) name += `[${sel.slice(0, 40)}]`;
    let bytes = Number(res.headers.get("content-length") ?? NaN);
    ctx.calls.push({ name, method: init?.method ?? "GET", start: Math.round(t0 - ctx.t0), dur: Math.round(t1 - t0), bytes: Number.isFinite(bytes) ? bytes : null });
  }
  return res;
};

function stages(calls) {
  const s = [...calls].sort((a, b) => a.start - b.start); let n = 0, end = -1;
  for (const c of s) { if (c.start >= end) { n++; end = c.start + c.dur; } else end = Math.max(end, c.start + c.dur); }
  return n;
}
function timing(ctx) {
  const total = Math.round(performance.now() - ctx.t0);
  const parts = [`app;dur=${total}`, `sb;desc="calls ${ctx.calls.length} stages ${stages(ctx.calls)}"`];
  ctx.calls.slice(0, 20).forEach((c, i) => parts.push(`q${i};desc="${c.name.replace(/"/g, "'")}@${c.start}";dur=${c.dur}`));
  return parts.join(", ");
}

const origEmit = http.Server.prototype.emit;
http.Server.prototype.emit = function (ev, req, res) {
  if (ev !== "request") return origEmit.apply(this, arguments);
  // eslint-disable-next-line @typescript-eslint/no-this-alias -- Node 서버 emit을 그대로 넘긴다(측정 도구)
  const args = arguments, self = this;
  let local = null;
  if (PUBLIC) {
    local = `http://${req.headers.host}`;
    req.headers.host = "www.gyeolreport.com"; req.headers["x-forwarded-host"] = "www.gyeolreport.com"; req.headers["x-forwarded-proto"] = "https";
    for (const h of ["origin", "referer"]) if (typeof req.headers[h] === "string" && req.headers[h].startsWith(local)) req.headers[h] = PUB + req.headers[h].slice(local.length);
    // next start는 initURL을 http(s)://<hostname>:<port>로 만든다 → 요청 메타에 쓰일 때 운영 출처로 고친다.
    const META = Symbol.for("NextInternalRequestMeta"); let meta = req[META];
    const fix = m => { if (m && typeof m.initURL === "string") m.initURL = m.initURL.replace(/^https?:\/\/[^/]+/, PUB); return m; };
    Object.defineProperty(req, META, { configurable: true, enumerable: false, get() { return fix(meta); }, set(v) { meta = fix(v); } });
  }
  const ctx = { t0: performance.now(), url: req.url, calls: [] };
  const ow = res.writeHead;
  res.writeHead = function (...a) {
    try { if (local && !res.headersSent) { const loc = res.getHeader("location"); if (typeof loc === "string" && loc.startsWith(PUB)) res.setHeader("location", local + loc.slice(PUB.length)); const h0 = a.find(x => x && typeof x === "object" && !Array.isArray(x)); if (h0) for (const k of Object.keys(h0)) if (k.toLowerCase() === "location" && typeof h0[k] === "string" && h0[k].startsWith(PUB)) h0[k] = local + h0[k].slice(PUB.length); } } catch {}
    try { if (!res.headersSent) { const h = a.find(x => x && typeof x === "object" && !Array.isArray(x)); if (h) h["server-timing"] = timing(ctx); else res.setHeader("server-timing", timing(ctx)); } } catch {}
    return ow.apply(this, a);
  };
  res.on("finish", () => {
    if (!LOG || /^\/_next\/(static|image)|\.(ico|png|svg|woff2?)$/.test(req.url)) return;
    try { appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), method: req.method, url: req.url, status: res.statusCode, total: Math.round(performance.now() - ctx.t0), edge: ctx.edge ?? 0, stages: stages(ctx.calls), calls: ctx.calls }) + "\n"); } catch {}
  });
  const run = () => als.run(ctx, () => origEmit.apply(self, args));
  const path = (req.url ?? "").split("#")[0];
  if (EDGE && EDGE_RE.test(path)) { ctx.edge = EDGE; setTimeout(run, EDGE); return true; }
  return run();
};
