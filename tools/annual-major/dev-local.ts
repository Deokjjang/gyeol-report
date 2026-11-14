/**
 * AM 검토 묶음용 로컬 개발 서버(로컬 Supabase · 토스 대역 · 목업 작가, 외부 유료 호출 0).
 *   pnpm exec tsx tools/annual-major/dev-local.ts            (PORT 기본 3400)
 * pnpm dev:v5와 같은 준비(Docker → supabase start → 로컬 DB·테스트 계정)를 하되 .env.development.local은 건드리지 않는다
 * (그 파일에는 7부 작가 키가 있다 — 로컬 값은 이 프로세스 환경으로만 넘긴다. 프로세스 환경이 env 파일보다 먼저다).
 * 지킴:
 *   - 로컬 가드: Supabase API·DB 주소가 localhost가 아니면 중단(scripts/dev/local.ts). 운영 키·운영 DB는 쓰지 않는다.
 *   - 작가 키를 이 서버에서는 일부러 막는다: ANTHROPIC_API_KEY·OPENAI_API_KEY·LLM_API_KEY = local-disabled, LLM_BUDGET_* 없음(devBudget 거절), OPS_MOCK_WRITER=ok(목업 작가).
 *   - 결제: 토스 승인·취소는 tools/p6d/toss-mock.mjs가 받는다(NODE_OPTIONS --import, 키는 test_ 자리값).
 *   - 판매: 로컬에서 대운·세운 결제 흐름을 보려고 FORTUNE_SALES_OPEN=1 + FORTUNE_SALES_OPEN_AT_TEST(지난 시각, 개발 전용) + 자리 가격(세운 3,900 · 대운 5,900 — 결정 전 자리값).
 *   - CRON_SECRET은 실행마다 무작위(로컬 전용). 캡처 도구가 워커를 부르게 .cache/am-dev.json(git 밖)에 둔다.
 */
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { localSupabase, ROOT } from "../../scripts/dev/local";
import { prepareLocalDb } from "../../scripts/dev/v5-db";

const EXCLUDE = "realtime,storage-api,imgproxy,mailpit,studio,edge-runtime,logflare,vector,supavisor,postgres-meta";
const PORT = process.env.PORT ?? "3400";

async function main() {
  if (spawnSync("docker", ["info"], { stdio: "ignore" }).status !== 0) { console.error("Docker Desktop이 꺼져 있다"); process.exit(2); }
  if (spawnSync("supabase", ["status"], { cwd: ROOT, stdio: "ignore" }).status !== 0) execFileSync("supabase", ["start", "-x", EXCLUDE], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
  const db = await prepareLocalDb();
  console.log(`로컬 DB 준비: 이번에 적용 ${db.appliedNow}개(누적 ${db.totalApplied}), 테스트 계정 ${db.user}`);
  const s = localSupabase();
  const cron = `local-${randomBytes(12).toString("hex")}`, tossDir = join(ROOT, ".cache", "toss-mock") + "/";
  mkdirSync(tossDir, { recursive: true });
  writeFileSync(join(ROOT, ".cache", "am-dev.json"), JSON.stringify({ base: `http://localhost:${PORT}`, cronSecret: cron, userId: db.userId }, null, 1));
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: s.API_URL, SUPABASE_URL: s.API_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: s.ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: s.SERVICE_ROLE_KEY, LOCAL_DB_URL: s.DB_URL,
    NEXT_PUBLIC_APP_URL: `http://localhost:${PORT}`, CRON_SECRET: cron,
    WRITER_V5_PRODUCTS: "saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune",
    TICKET_WORKER_MAX_RSS_MB: "16384", PAID_WORKER_MAX_RSS_MB: "16384",
    OPS_MOCK_WRITER: "ok", ANTHROPIC_API_KEY: "local-disabled", OPENAI_API_KEY: "local-disabled", LLM_API_KEY: "local-disabled",
    LLM_BUDGET_SCOPE: undefined, LLM_BUDGET_RUN: undefined,
    NODE_OPTIONS: `--import ${join(ROOT, "tools/p6d/toss-mock.mjs")}`, TOSS_MOCK_DIR: tossDir,
    NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY: "test_ck_local_mock", TOSS_PAYMENTS_SECRET_KEY: "test_sk_local_mock", TOSS_CONFIRM_API_ENABLED: "1", PAID_REPORT_RELIABILITY_ENABLED: "1",
    FORTUNE_SALES_OPEN: "1", FORTUNE_SALES_OPEN_AT_TEST: "2000-01-01T00:00:00+09:00", FORTUNE_PRICE_ANNUAL_KRW: "3900", FORTUNE_PRICE_MAJOR_KRW: "5900",
  };
  for (const k of Object.keys(env)) if (env[k] === undefined) delete env[k];
  console.log(`next dev: http://localhost:${PORT}`);
  const child = spawn("pnpm", ["exec", "next", "dev", "-p", PORT], { cwd: ROOT, stdio: "inherit", env });
  child.on("exit", code => process.exit(code ?? 0));
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
