/**
 * P 측정용: 로컬 perf 계정으로 로그인한 Supabase 세션 쿠키를 만든다(next start에서는 /dev/v5-login이 404라서).
 *   pnpm exec tsx tools/perf/cookies.ts a b re new  → tools/perf/.cookies-<이름>.json(Playwright 쿠키 형식, .gitignore)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createServerClient } from "@supabase/ssr";
import { LOCAL_DEV_ACCOUNT } from "../../src/lib/account/localDevAccount";
import { localSupabase, ROOT } from "../../scripts/dev/local";

const s = localSupabase();
async function main() {
  for (const name of process.argv.slice(2).filter(n => /^[a-z0-9-]{1,20}$/.test(n))) {
    const jar = new Map<string, string>();
    const auth = createServerClient(s.API_URL, s.ANON_KEY, { cookies: { getAll: () => [...jar].map(([n, v]) => ({ name: n, value: v })), setAll: cs => { for (const c of cs) jar.set(c.name, c.value); } } });
    const { error } = await auth.auth.signInWithPassword({ email: `perf-${name}@gyeol.local`, password: LOCAL_DEV_ACCOUNT.password });
    if (error) throw new Error(`로그인 실패(${name})`);
    const cookies = [...jar].map(([n, v]) => ({ name: n, value: v, domain: "localhost", path: "/", httpOnly: true, secure: false, sameSite: "Lax" as const, expires: Math.floor(Date.now() / 1000) + 3600 }));
    writeFileSync(join(ROOT, `tools/perf/.cookies-${name}.json`), JSON.stringify(cookies));
    console.log(name, cookies.map(c => c.name).join(","));
  }
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
