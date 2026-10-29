/**
 * 로컬 v5 개발 서버 한 번에 띄우기(P3 G): pnpm dev:v5
 * Docker Desktop → 로컬 Supabase(supabase start) → DB 준비(v5-db) → .env.development.local 관리 구역에 로컬 값만 기록 → 로컬 가드 → next dev.
 * OpenAI 키(OPENAI_API_KEY)는 사용자가 .env.development.local에 직접 한 줄 넣는다(관리 구역 밖, 자동으로 건드리지 않음).
 */
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { assertEnvFileLocal, localSupabase, readEnvFile, ROOT, writeLocalEnv } from "./local";
import { prepareLocalDb } from "./v5-db";

const EXCLUDE = "realtime,storage-api,imgproxy,mailpit,studio,edge-runtime,logflare,vector,supavisor,postgres-meta";
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  if (spawnSync("docker", ["info"], { stdio: "ignore" }).status !== 0) {
    console.log("Docker Desktop을 켭니다…"); spawnSync("open", ["-a", "Docker"]);
    for (let i = 0; i < 60 && spawnSync("docker", ["info"], { stdio: "ignore" }).status !== 0; i++) await sleep(2000);
  }
  if (spawnSync("supabase", ["status"], { cwd: ROOT, stdio: "ignore" }).status !== 0) {
    console.log("로컬 Supabase를 시작합니다…"); execFileSync("supabase", ["start", "-x", EXCLUDE], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
  }
  const db = await prepareLocalDb();
  console.log(`로컬 DB 준비: 이번에 적용 ${db.appliedNow}개(누적 ${db.totalApplied}), 테스트 계정 ${db.user}, 이용권 ${db.tickets}장`);
  const prev = readEnvFile();
  const s = localSupabase();
  writeLocalEnv(s, {
    CRON_SECRET: prev.CRON_SECRET ?? `local-${randomBytes(12).toString("hex")}`,
    WRITER_V5_PRODUCTS: prev.WRITER_V5_PRODUCTS ?? "saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility,major_fortune,annual_fortune",
    LLM_PROVIDER: prev.LLM_PROVIDER ?? "openai", LLM_MODEL: prev.LLM_MODEL ?? "gpt-4o-mini",
    // next dev는 RSS가 수 GB라 이용권 워커의 메모리 상한(1.25GiB)에 바로 걸린다. 개발 모드에서만 읽힌다.
    TICKET_WORKER_MAX_RSS_MB: prev.TICKET_WORKER_MAX_RSS_MB ?? "16384",
    PAID_WORKER_MAX_RSS_MB: prev.PAID_WORKER_MAX_RSS_MB ?? "16384",
  });
  assertEnvFileLocal();
  if (!readEnvFile().OPENAI_API_KEY) console.log("알림: OPENAI_API_KEY가 없어 v5 작가는 결정론 작가로만 책을 만듭니다(.env.development.local에 한 줄 추가).");
  console.log(`next dev를 시작합니다: http://localhost:${process.env.PORT ?? "3100"}`);
  const child = spawn("pnpm", ["exec", "next", "dev", "-p", process.env.PORT ?? "3100"], { cwd: ROOT, stdio: "inherit" });
  child.on("exit", code => process.exit(code ?? 0));
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
