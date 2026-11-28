/**
 * 「남이 본 나」 로컬 시험 서버: pnpm mirror:trial  (다시 빌드만 강제: pnpm mirror:trial --build)
 * 맥의 로컬 배포 빌드(next start)를 Cloudflare 빠른 터널(https) + 앱 밖 기본 인증(Caddy, 비밀번호 1개)으로 열어 맥 · 폰(Wi-Fi · LTE)에서 써 본다.
 * 순서: 로컬 DB 확인 · 실행 → 시험 계정 준비 → (필요하면) 빌드 → 터널(주소 받기) → 서버 → 프록시 → 터널로 열리는지 확인 → 주소 · 비밀번호를 한 번 출력.
 *   터널 주소를 서버가 출처로 알아야 해서 cloudflared를 서버보다 먼저 띄운다(서버 · 프록시가 뜨기 전에는 아무도 주소를 모른다).
 * Ctrl+C 한 번에 터널 · 프록시 · 서버를 모두 끈다(로컬 Supabase는 그대로 둔다). 다시 켜면 새 주소 · 새 비밀번호가 나온다.
 * 지키는 것: 로컬 Supabase만(scripts/dev/local.ts 가드) · 유료 API 키 변수는 빈 값으로 덮음 · 토스 승인은 tools/p6d/toss-mock.mjs 대역(test_ 가짜 키, 프로세스 env만) · 저장소에 비밀번호를 쓰지 않음.
 */
import { execFileSync, spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertEnvFileLocal, assertLocal, localSupabase, psql, readEnvFile, ROOT } from "./local";
import { prepareLocalDb } from "./v5-db";

const APP_PORT = 3460, PROXY_PORT = 3461, USER = "gyeol";
const EXCLUDE = "realtime,storage-api,imgproxy,mailpit,studio,edge-runtime,logflare,vector,supavisor,postgres-meta";
/** 시험 서버 프로세스에서 빈 값으로 덮는 변수: 유료 · 외부 호출 키(작가 · 알림 · 카카오 관리 · 메타 전환). */
const BLANK = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY", "XAI_API_KEY", "LLM_API_KEY",
  "KAKAO_ADMIN_KEY", "META_CONVERSIONS_ACCESS_TOKEN", "TELEGRAM_OPS_BOT_TOKEN", "TELEGRAM_SALES_BOT_TOKEN", "NEXT_PUBLIC_META_PIXEL_ID", "NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY"];
/** 시험 계정: 친구 수(아이디 trial.f<N>). cust(책 있는 기존 회원)는 매번 이 기능 데이터만 지운다. */
const OWNERS: readonly [string, number][] = [["t0", 0], ["t5", 5], ["t40", 40], ["t100", 100]];
const BUILD_STAMP = join(ROOT, ".next", "mirror-trial-stamp");

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const children: ChildProcess[] = [];
let tmp = "", stopping = false;
function stopAll(code = 0): never {
  stopping = true;
  for (const c of children.reverse()) if (c.pid && c.exitCode === null) { try { process.kill(-c.pid, "SIGTERM"); } catch { /* 이미 끝남 */ } }
  if (tmp) rmSync(tmp, { recursive: true, force: true });
  process.exit(code);
}
process.on("SIGINT", () => { console.log("\n끕니다: 터널 · 프록시 · 서버"); stopAll(0); });
process.on("SIGTERM", () => stopAll(0));
function run(cmd: string, args: string[], env: NodeJS.ProcessEnv, label: string, onLine?: (line: string) => void): ChildProcess {
  const c = spawn(cmd, args, { cwd: ROOT, env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  children.push(c);
  for (const s of [c.stdout!, c.stderr!]) s.on("data", (b: Buffer) => { for (const line of b.toString().split("\n").filter(Boolean)) { onLine?.(line); if (process.env.MIRROR_TRIAL_VERBOSE) console.log(`[${label}] ${line}`); } });
  c.on("exit", code => { if (!stopping) { console.error(`중단: ${label}이(가) 끝났어요(코드 ${code}). 나머지도 끕니다.`); stopAll(1); } });
  return c;
}
const tsx = (args: string[]) => execFileSync("pnpm", ["exec", "tsx", ...args], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();

async function main() {
  // 1) 로컬 DB: Docker → 로컬 Supabase → migration · 테스트 계정(v5-db). 주소가 로컬이 아니면 local.ts 가드가 중단한다.
  if (spawnSync("docker", ["info"], { stdio: "ignore" }).status !== 0) {
    console.log("Docker Desktop을 켭니다…"); spawnSync("open", ["-a", "Docker"]);
    for (let i = 0; i < 60 && spawnSync("docker", ["info"], { stdio: "ignore" }).status !== 0; i++) await sleep(2000);
  }
  if (spawnSync("supabase", ["status"], { cwd: ROOT, stdio: "ignore" }).status !== 0) {
    console.log("로컬 Supabase를 시작합니다…"); execFileSync("supabase", ["start", "-x", EXCLUDE], { cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] });
  }
  const local = localSupabase(); assertEnvFileLocal();
  const db = await prepareLocalDb();
  console.log(`1/6 로컬 DB: ${new URL(local.DB_URL).host} (migration 이번에 ${db.appliedNow}개)`);

  // 2) 시험 계정: 친구 0 · 5 · 40 · 100명(매번 친구 다시 채움), 기존 회원 cust(이 기능 데이터만 지움 — 책 · 동의는 그대로).
  tsx(["tools/p6e/accounts.ts", ...OWNERS.map(([n]) => n)]);
  for (const [name, friends] of OWNERS) {
    tsx(["scripts/dev/mirror-seed.ts", "--as", name, "--owner-ready", `trial.f${friends}`, "--friends", "0", "--reset"]);
    if (friends) tsx(["scripts/dev/mirror-seed.ts", "--as", name, "--friends", String(friends), "--seed", String(7000 + friends)]);
  }
  tsx(["scripts/dev/mirror-seed.ts", "--as", "cust", "--wipe"]);
  const custBooks = psql(`select count(*) from public.report_account_links l join auth.users u on u.id=l.user_id where u.email='p6e-cust@gyeol.local' and l.revoked_at is null;`);
  console.log(`2/6 시험 계정: 친구 ${OWNERS.map(([, n]) => n).join(" · ")}명, 기존 회원 책 ${custBooks}권`);

  // 서버 환경: 로컬 Supabase 값 + 시험 모드 + 유료 키 빈 값 + 토스 대역. 빌드도 같은 값으로(NEXT_PUBLIC_*는 빌드에 박힌다).
  tmp = mkdtempSync(join(tmpdir(), "mirror-trial-"));
  const file = readEnvFile();
  const base: NodeJS.ProcessEnv = { ...process.env, NEXT_PUBLIC_SUPABASE_URL: local.API_URL, SUPABASE_URL: local.API_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: local.ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: local.SERVICE_ROLE_KEY,
    LOCAL_DB_URL: local.DB_URL, CRON_SECRET: file.CRON_SECRET ?? `local-${randomBytes(12).toString("hex")}`, LLM_PROVIDER: file.LLM_PROVIDER ?? "openai", LLM_MODEL: file.LLM_MODEL ?? "gpt-4o-mini",
    MIRROR_LOCAL_TRIAL: "1", TOSS_PAYMENTS_SECRET_KEY: "test_sk_mirror_trial_mock", NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY: "test_ck_mirror_trial_mock", TOSS_MOCK_DIR: `${tmp}/`, NEXT_TELEMETRY_DISABLED: "1" };
  for (const k of BLANK) base[k] = "";
  delete base.VERCEL; delete base.VERCEL_ENV;
  for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL", "LOCAL_DB_URL"]) assertLocal(base[k]!, k);

  // 3) 빌드: 빌드에 들어가는 파일(src · public · 설정)이 그대로이고 시험 환경으로 만든 빌드가 있으면 다시 만들지 않는다.
  const IN = ["src", "public", "package.json", "pnpm-lock.yaml", "next.config.ts", "tsconfig.json", "postcss.config.mjs"];
  const git = (...a: string[]) => execFileSync("git", a, { cwd: ROOT });
  const stampHash = createHash("sha256").update(git("ls-tree", "-r", "HEAD", "--", ...IN)).update(git("diff", "HEAD", "--", ...IN)).update(local.API_URL);
  for (const f of execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", ...IN], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean)) stampHash.update(f).update(readFileSync(join(ROOT, f)));
  const stamp = stampHash.digest("hex");
  if (process.argv.includes("--build") || !existsSync(BUILD_STAMP) || readFileSync(BUILD_STAMP, "utf8") !== stamp) {
    console.log("3/6 배포 빌드를 만듭니다(몇 분 걸려요)…");
    const r = spawnSync("pnpm", ["exec", "next", "build"], { cwd: ROOT, env: { ...base, NODE_ENV: "production", NODE_OPTIONS: "--max-old-space-size=8192" }, stdio: ["ignore", "ignore", "inherit"] });
    if (r.status !== 0) { console.error("중단: 빌드 실패"); stopAll(1); }
    writeFileSync(BUILD_STAMP, stamp);
  } else console.log("3/6 빌드: 지금 코드 그대로라 다시 만들지 않아요");

  // 4) 터널: 프록시 포트로 빠른 터널을 열고 주소를 받는다.
  let origin = "";
  run("cloudflared", ["tunnel", "--no-autoupdate", "--url", `http://127.0.0.1:${PROXY_PORT}`], base, "터널", line => { const m = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/.exec(line); if (m && !origin) origin = m[0]; });
  for (let i = 0; i < 60 && !origin; i++) await sleep(500);
  if (!origin) { console.error("중단: 터널 주소를 받지 못했어요"); stopAll(1); }
  console.log(`4/6 터널: ${origin}`);

  // 5) 서버(next start, 맥 안에서만 듣는다) — 토스 승인 대역을 프로세스에 끼운다.
  run("pnpm", ["exec", "next", "start", "-p", String(APP_PORT), "-H", "127.0.0.1"], { ...base, NODE_ENV: "production", MIRROR_TRIAL_ORIGIN: origin, NODE_OPTIONS: `--import ${join(ROOT, "tools/p6d/toss-mock.mjs")}` }, "서버");
  for (let i = 0; i < 120; i++) { try { if ((await fetch(`http://127.0.0.1:${APP_PORT}/start`, { redirect: "manual" })).status < 500) break; } catch { /* 아직 */ } await sleep(500); }
  console.log(`5/6 서버: 127.0.0.1:${APP_PORT}`);

  // 6) 프록시: 기본 인증(비밀번호 1개, bcrypt 해시만 임시 파일에) + 서버가 낸 localhost 이동 주소를 터널 주소로.
  //    X-Forwarded-Proto는 http로 고정한다 — 터널이 넣은 https가 넘어가면 next start가 /@아이디 → /u/아이디 다시 쓰기를 https://localhost:포트로 보내 TLS 오류(500)가 난다.
  const password = randomBytes(9).toString("base64url");
  const hash = execFileSync("caddy", ["hash-password", "--plaintext", password], { encoding: "utf8" }).trim();
  writeFileSync(join(tmp, "Caddyfile"), `{
\tadmin off
\tauto_https off
\tpersist_config off
}
http://:${PROXY_PORT} {
\tbind 127.0.0.1
\tbasic_auth {
\t\t${USER} ${hash}
\t}
\treverse_proxy 127.0.0.1:${APP_PORT} {
\t\theader_up X-Forwarded-Proto http
\t\theader_down Location "^https?://(localhost|127\\.0\\.0\\.1):${APP_PORT}" "${origin}"
\t}
}
`, { mode: 0o600 });
  run("caddy", ["run", "--config", join(tmp, "Caddyfile"), "--adapter", "caddyfile"], { ...process.env, HOME: tmp, XDG_DATA_HOME: tmp, XDG_CONFIG_HOME: tmp }, "프록시");
  const auth = `Basic ${Buffer.from(`${USER}:${password}`).toString("base64")}`;
  let ok = false;
  for (let i = 0; i < 90 && !ok; i++) { try { ok = (await fetch(`${origin}/`, { headers: { authorization: auth }, redirect: "manual" })).status === 200; } catch { /* DNS 전파 중 */ } if (!ok) await sleep(1000); }
  const locked = await fetch(`${origin}/`, { redirect: "manual" }).then(r => r.status).catch(() => 0);
  console.log(`6/6 프록시: 비밀번호 없이 ${locked}, 비밀번호로 ${ok ? 200 : "확인 못 함"}`);

  console.log(`\n────────────────────────────────────────
 주소      ${origin}
 아이디    ${USER}
 비밀번호  ${password}
 로그인 화면 아래 「시험 계정」에서 계정을 고르세요.
 끄기: 이 창에서 Ctrl+C (맥이 잠자기에 들어가면 연결이 끊겨요)
────────────────────────────────────────`);
  await new Promise(() => { /* Ctrl+C까지 */ });
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); stopAll(1); });
