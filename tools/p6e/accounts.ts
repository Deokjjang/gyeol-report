/**
 * P6e-ops 로컬 검수 계정(로컬 Supabase 전용): p6e-<이름>@gyeol.local, google 공급자 표시 + 약관 동의.
 *   pnpm exec tsx tools/p6e/accounts.ts sender friend friend2 cust
 * 로그인은 http://localhost:<포트>/dev/v5-login?as=<이름>&next=/account (next dev + 로컬 Supabase일 때만 동작).
 * 출력: 이름 → 계정 id(JSON). 로컬 가드(scripts/dev/local.ts)가 로컬이 아니면 중단한다.
 */
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { LOCAL_DEV_ACCOUNT } from "../../src/lib/account/localDevAccount";
import { localSupabase, psql } from "../../scripts/dev/local";

const s = localSupabase();
const headers = { apikey: s.SERVICE_ROLE_KEY, authorization: `Bearer ${s.SERVICE_ROLE_KEY}`, "content-type": "application/json" };
const list = async () => (await (await fetch(`${s.API_URL}/auth/v1/admin/users?per_page=500`, { headers })).json() as { users: { id: string; email: string }[] }).users;
const names = process.argv.slice(2).filter(n => /^[a-z0-9-]{2,20}$/.test(n));
async function main() {
const out: Record<string, string> = {};
for (const name of names) {
  const email = `p6e-${name}@gyeol.local`;
  let user = (await list()).find(u => u.email === email);
  if (!user) {
    const r = await fetch(`${s.API_URL}/auth/v1/admin/users`, { method: "POST", headers, body: JSON.stringify({ email, password: LOCAL_DEV_ACCOUNT.password, email_confirm: true, user_metadata: { full_name: `검수 ${name}` } }) });
    if (!r.ok) throw new Error(`계정 생성 실패(${name}): HTTP ${r.status}`);
    user = await r.json() as { id: string; email: string };
  }
  await fetch(`${s.API_URL}/auth/v1/admin/users/${user.id}`, { method: "PUT", headers, body: JSON.stringify({ app_metadata: { provider: "google", providers: ["google"] } }) });
  const consents = JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })));
  psql(`select public.record_account_consent('${user.id}', gen_random_uuid(), '로컬 검수', 'google', 'first_login', '${consents}'::jsonb);`, { quiet: true });
  out[name] = user.id;
}
console.log(JSON.stringify(out));
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
