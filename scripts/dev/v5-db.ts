/**
 * 로컬 개발 DB 준비(P3 G): 저장소 migration 전부 + scripts/*.sql 패치를 정해진 순서로 적용하고 최소 시드를 넣는다. 다시 실행해도 된다.
 *   pnpm exec tsx scripts/dev/v5-db.ts
 * 순서: 0001~0013 → reconcile → 결제 패치 7개 → 나머지 timestamp migration(이용권 큐 패치는 ticket_bundle_commerce 바로 뒤) → v5 작가 작업.
 * 001_init.sql(레거시)은 기존 로더처럼 제외한다. 운영 데이터 정리용 일회성 migration(production_test_data_cleanup)은 빈 DB에서 일부러 중단되므로 로컬에서는 건너뛴다. 시드: 테스트 계정(google 공급자로 표시) + 동의 + 무료 이용권 20장. 상품 목록은 코드에 있다(테이블 없음).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { localSupabase, psql, ROOT } from "./local";

export const DEV_EMAIL = "v5-dev@gyeol.local";
export const DEV_PASSWORD = "local-dev-only-password";
const RECONCILE = "20260920163924_production_reliability_reconcile.sql";
const PAID_PATCHES = ["paid_report_quarantine_recovery_patch", "paid_payment_confirm_recovery_queue_patch", "paid_report_publish_expiry_patch", "paid_report_external_call_guard_patch", "paid_checkout_consent_evidence_patch", "paid_report_one_call_delivery_patch", "paid_worker_expiry_cost_guard_patch"].map(n => `scripts/${n}.sql`);
const QUEUE_AFTER = "20261010095005_v4_ticket_bundle_commerce.sql";
const LOCAL_SKIP = new Set(["20260920171500_production_test_data_cleanup.sql"]);

export function migrationOrder(): string[] {
  const all = readdirSync(join(ROOT, "supabase/migrations")).filter(f => f.endsWith(".sql"));
  const numbered = all.filter(f => /^\d{4}_/.test(f)).sort().map(f => `supabase/migrations/${f}`);
  const stamped = all.filter(f => /^\d{14}_/.test(f) && f !== RECONCILE && !LOCAL_SKIP.has(f)).sort();
  return [...numbered, `supabase/migrations/${RECONCILE}`, ...PAID_PATCHES, ...stamped.flatMap(f => f === QUEUE_AFTER ? [`supabase/migrations/${f}`, "scripts/report_ticket_publication_queue_patch.sql"] : [`supabase/migrations/${f}`])];
}

async function main() {
  const s = localSupabase();
  psql("create schema if not exists local_dev; create table if not exists local_dev.applied(name text primary key, applied_at timestamptz not null default now());", { quiet: true });
  const done = new Set(psql("select name from local_dev.applied;").split("\n").filter(Boolean));
  let applied = 0;
  for (const f of migrationOrder()) {
    if (done.has(f)) continue;
    psql(readFileSync(join(ROOT, f), "utf8").replace(/^﻿/, ""), { quiet: true });
    psql(`insert into local_dev.applied(name) values('${f.replace(/'/g, "''")}');`, { quiet: true });
    applied++;
  }
  // 시드: 테스트 계정(GoTrue 관리 API, 로컬) → google 공급자 표시 → 동의 → 이용권.
  const headers = { apikey: s.SERVICE_ROLE_KEY, authorization: `Bearer ${s.SERVICE_ROLE_KEY}`, "content-type": "application/json" };
  const list = await (await fetch(`${s.API_URL}/auth/v1/admin/users?per_page=200`, { headers })).json() as { users: { id: string; email: string }[] };
  let user = list.users.find(u => u.email === DEV_EMAIL);
  if (!user) {
    const r = await fetch(`${s.API_URL}/auth/v1/admin/users`, { method: "POST", headers, body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD, email_confirm: true, user_metadata: { full_name: "로컬 검수" } }) });
    if (!r.ok) throw new Error(`계정 생성 실패: HTTP ${r.status}`);
    user = await r.json() as { id: string; email: string };
  }
  // 서비스는 kakao·google 공급자만 회원으로 본다. 로컬 계정은 비밀번호로 로그인하되 공급자 표시만 google로 둔다.
  const upd = await fetch(`${s.API_URL}/auth/v1/admin/users/${user.id}`, { method: "PUT", headers, body: JSON.stringify({ app_metadata: { provider: "google", providers: ["google"] } }) });
  if (!upd.ok) throw new Error(`공급자 표시 실패: HTTP ${upd.status}`);
  const consents = JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })));
  psql(`select public.record_account_consent('${user.id}', gen_random_uuid(), '로컬 검수', 'google', 'first_login', '${consents}'::jsonb);`, { quiet: true });
  psql(`select public.report_tickets('grant', '${user.id}', '{"quantity":20,"sourceType":"manual","sourceRef":"local-dev-seed","key":"local-dev-seed","reason":"LOCAL_DEV"}'::jsonb);`, { quiet: true });
  const tickets = psql(`select coalesce(sum(quantity_delta),0) from public.report_ticket_ledger where user_id='${user.id}';`);
  console.log(JSON.stringify({ appliedNow: applied, totalApplied: done.size + applied, user: DEV_EMAIL, tickets: Number(tickets) }));
}

if (process.argv[1]?.endsWith("v5-db.ts")) main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
