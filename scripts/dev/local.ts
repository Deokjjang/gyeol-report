/**
 * 로컬 개발 공용(P3 G): 로컬 Supabase 정보 읽기 + 로컬 가드.
 * 가드: DB·API 주소가 localhost(127.0.0.1·localhost·::1)가 아니면 즉시 중단한다. 운영 키·운영 DB를 쓰지 않는다.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "../..");
export const ENV_FILE = join(ROOT, ".env.development.local");
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

export function assertLocal(url: string, what: string): void {
  let host = "";
  try { host = new URL(url).hostname; } catch { /* 아래에서 중단 */ }
  if (!LOCAL_HOSTS.has(host)) { console.error(`중단: ${what} 주소가 로컬이 아닙니다(${host || "형식 오류"}). 로컬 개발 스크립트는 운영 DB에 접속하지 않습니다.`); process.exit(2); }
}

export type LocalSupabase = { API_URL: string; DB_URL: string; ANON_KEY: string; SERVICE_ROLE_KEY: string };
export function localSupabase(): LocalSupabase {
  const out = execFileSync("supabase", ["status", "-o", "json"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const s = JSON.parse(out.slice(out.indexOf("{"))) as LocalSupabase;
  assertLocal(s.API_URL, "Supabase API"); assertLocal(s.DB_URL, "DB");
  return s;
}

/** .env.development.local의 NEXT_PUBLIC_SUPABASE_URL·SUPABASE_URL이 있으면 로컬인지 검사한다. */
export function assertEnvFileLocal(): void {
  if (!existsSync(ENV_FILE)) return;
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_URL|LOCAL_DB_URL)=(.+)$/);
    if (m) assertLocal(m[2].trim().replace(/^"|"$/g, ""), `${ENV_FILE}의 ${m[1]}`);
  }
}

const BEGIN = "# >>> pnpm dev:v5 관리 구역(로컬 Supabase 값만, 자동 갱신) >>>", END = "# <<< pnpm dev:v5 관리 구역 <<<";
/** 로컬 Supabase 값만 관리 구역에 쓴다. 사용자가 넣은 다른 줄(OPENAI_API_KEY 등)은 그대로 둔다. */
export function writeLocalEnv(s: LocalSupabase, extra: Record<string, string>): void {
  // 표지 문구에 괄호가 있어 정규식으로 쓰려면 이스케이프해야 한다(안 하면 관리 구역이 실행마다 하나씩 늘어난다).
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const kept = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8").replace(new RegExp(`${esc(BEGIN)}[\\s\\S]*?${esc(END)}\\n?`, "g"), "").trimEnd() : "";
  const block = [BEGIN, `NEXT_PUBLIC_SUPABASE_URL=${s.API_URL}`, `SUPABASE_URL=${s.API_URL}`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${s.ANON_KEY}`, `SUPABASE_SERVICE_ROLE_KEY=${s.SERVICE_ROLE_KEY}`, `LOCAL_DB_URL=${s.DB_URL}`,
    ...Object.entries(extra).map(([k, v]) => `${k}=${v}`), END].join("\n");
  writeFileSync(ENV_FILE, `${kept ? `${kept}\n\n` : ""}${block}\n`, { mode: 0o600 });
}

export function readEnvFile(): Record<string, string> {
  if (!existsSync(ENV_FILE)) return {};
  return Object.fromEntries(readFileSync(ENV_FILE, "utf8").split("\n").flatMap(l => { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); return m ? [[m[1], m[2]]] : []; }));
}

export function dbContainer(): string {
  const names = execFileSync("docker", ["ps", "--format", "{{.Names}}"], { encoding: "utf8" }).split("\n").filter(n => n.startsWith("supabase_db_"));
  if (!names.length) { console.error("중단: 로컬 Supabase DB 컨테이너가 없습니다(supabase start 먼저)."); process.exit(2); }
  return names[0];
}

/** 로컬 DB 컨테이너 안의 psql로 실행(로컬 전용). */
export function psql(sql: string, opts: { quiet?: boolean } = {}): string {
  const r = spawnSync("docker", ["exec", "-i", dbContainer(), "psql", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-X", "-q", "-A", "-t"], { input: sql, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`psql 실패: ${(r.stderr || r.stdout).slice(0, 800)}`);
  if (!opts.quiet && r.stderr.trim()) process.stderr.write(r.stderr.split("\n").filter(l => !/NOTICE/.test(l)).join("\n"));
  return r.stdout.trim();
}
