/**
 * P 측정용 로컬 시드(로컬 Supabase 전용, 다시 실행해도 된다): pnpm exec tsx tools/perf/seed.ts
 * - 계정: perf-a(책 10권 + 만료된 v4 1권, 이용권·이벤트·보상 이용권), perf-b(책 5권, 이용권 0),
 *   perf-re(이전 문서 버전 동의 = 재동의 대상 + 안 쓴 보상 이용권), perf-new(가입 동의 전 신규).
 * - 책은 로컬에 이미 있는 실제 스냅샷(v1·v2·v4 대형 450KB~1MB, v5 100~330KB)을 복제한다(운영과 같은 생성기 산출물).
 * - 출력: tools/perf/.state.json(계정 id·책 id) — 측정 스크립트가 읽는다(.gitignore).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { LOCAL_DEV_ACCOUNT } from "../../src/lib/account/localDevAccount";
import { localSupabase, psql, ROOT } from "../../scripts/dev/local";

const s = localSupabase();
const headers = { apikey: s.SERVICE_ROLE_KEY, authorization: `Bearer ${s.SERVICE_ROLE_KEY}`, "content-type": "application/json" };
const V4 = ["report_4627a98845684c309de936615a49f4a0", "report_a9861bfda5f7416fa9669d395ee851fd", "report_e52000519fb74c45aa21f266cdeaabf7", "report_b40c07ad86a04041abaae1ac6167496f"]; // v4·v2·v4·v1
const V5 = ["report_ebe8fccb513047488b340bb159215524", "report_c136f0c838d94fd0811717ca80883562", "report_b743ac3a17da4f308867071b97a1e93b", "report_2ed154e5008d4ccd91f131666071699c", "report_8dbe7218366449868ff33aaf364f1a58", "report_4d95800013d242e48022248ca9394bf2", "report_fe29cb0ed88a4a459c14f1b377a3a9bf"];

async function account(name: string, consent: "current" | "old" | "none"): Promise<string> {
  const email = `perf-${name}@gyeol.local`;
  const list = (await (await fetch(`${s.API_URL}/auth/v1/admin/users?per_page=1000`, { headers })).json() as { users: { id: string; email: string }[] }).users;
  let user = list.find(u => u.email === email);
  if (!user) {
    const r = await fetch(`${s.API_URL}/auth/v1/admin/users`, { method: "POST", headers, body: JSON.stringify({ email, password: LOCAL_DEV_ACCOUNT.password, email_confirm: true, user_metadata: { full_name: `성능 ${name}` } }) });
    if (!r.ok) throw new Error(`계정 생성 실패(${name}): HTTP ${r.status}`);
    user = await r.json() as { id: string; email: string };
  }
  await fetch(`${s.API_URL}/auth/v1/admin/users/${user.id}`, { method: "PUT", headers, body: JSON.stringify({ app_metadata: { provider: "google", providers: ["google"] } }) });
  if (consent !== "none") {
    // 기준 트리(문서 버전이 다른 판)를 잴 때는 PERF_CONSENT_VERSION=그 판 버전으로 동의를 넣는다(재동의 화면으로 빠지지 않게).
    const pinned = process.env.PERF_CONSENT_VERSION;
    const versions = consent === "current" ? (pinned ? { terms: pinned, privacy: pinned } : ACCOUNT_POLICY_VERSIONS) : { terms: "2026-06-14.1", privacy: "2026-09-22.1" };
    const consents = JSON.stringify(Object.entries(versions).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })));
    psql(`delete from public.account_consent_events where user_id='${user.id}';`, { quiet: true });
    psql(`select public.record_account_consent('${user.id}', gen_random_uuid(), '성능 ${name}', 'google', 'first_login', '${consents}'::jsonb);`, { quiet: true });
    psql(`insert into public.account_contacts(user_id,full_name,email,email_source) values('${user.id}','성능 ${name}','${email}','provider') on conflict(user_id) do nothing;`, { quiet: true });
  }
  return user.id;
}

const CLONE = `
create or replace function pg_temp.perf_clone(src text, u uuid, tag text, pub timestamptz) returns text language plpgsql as $f$
declare s public.paid_report_snapshots; o public.payment_orders; nid text := 'report_perf' || substr(md5(tag),1,24); noid text := 'perf_order_' || tag; snap jsonb;
begin
  if exists(select 1 from public.paid_report_snapshots where report_id=nid) then return nid; end if;
  select * into s from public.paid_report_snapshots where report_id=src;
  select * into o from public.payment_orders where payment_order_id=s.order_id;
  insert into public.payment_orders select (jsonb_populate_record(null::public.payment_orders, to_jsonb(o) || jsonb_build_object('payment_order_id',noid,'provider_order_id',noid,'provider_payment_id','perf_pk_'||tag,'report_id',nid,'coupon_redemption_id',null,'created_at',pub,'paid_at',pub))).*;
  insert into public.report_purchase_bindings(order_id,buyer_id,display_name,selected_year) values(noid,u,'성능 '||tag,null);
  snap := jsonb_set(s.snapshot_json,'{reportId}',to_jsonb(nid));
  insert into public.paid_report_snapshots select (jsonb_populate_record(null::public.paid_report_snapshots, to_jsonb(s) || jsonb_build_object('report_id',nid,'order_id',noid,'snapshot_json',snap,'published_at',pub,'created_at',pub,
    'expires_at', case when snap->>'productVersion'='v5' then null else pub+interval '2160 hours' end,'ticket_redemption_id',null))).*;
  return nid;
end $f$;`;

function clone(src: string, user: string, tag: string, daysAgo: number): string {
  return psql(`${CLONE} select pg_temp.perf_clone('${src}', '${user}', '${tag}', now() - interval '${daysAgo} days');`).trim().split("\n").pop()!;
}

async function main() {
  // 매번 perf 책·주문을 모두 지우고 다시 만든다(id는 md5(tag)라 실행마다 같다). 운영 id 길이(report_ + 32자)와 같아야 이용권 책 확인 경로까지 똑같이 탄다.
  psql(`delete from public.paid_report_snapshots where report_id like 'report_perf%'; delete from public.order_records where payment_order_id like 'perf_order_%'; delete from public.report_purchase_bindings where order_id like 'perf_order_%'; delete from public.gift_rewards where source_order_id like 'perf_order_%'; delete from public.payment_orders where payment_order_id like 'perf_order_%';`, { quiet: true });
  const a = await account("a", "current"), b = await account("b", "current"), re = await account("re", "old"), fresh = await account("new", "none");
  const books: Record<string, string[]> = { a: [], b: [], re: [] };
  // perf-a: v4 계열 3권(v4·v2·v1) + v5 7권 = 10권, 만료된 v4 1권(서재에서 사라져야 함).
  [V4[0], V4[1], V4[3]].forEach((r, i) => books.a.push(clone(r, a, `a_old${i}`, 10 + i)));
  V5.forEach((r, i) => books.a.push(clone(r, a, `a_v5_${i}`, i)));
  const expired = clone(V4[2], a, "a_expired", 30);
  // 발행 때 서재에 연결된 뒤 기한이 지난 상태(운영과 같은 순서): 발행일·기한을 함께 과거로 옮긴다(기한 = 발행 + 2160시간 제약).
  psql(`update public.paid_report_snapshots set published_at=now()-interval '95 days', expires_at=now()-interval '95 days'+interval '2160 hours' where report_id='${expired}' and expires_at>now();`, { quiet: true });
  // perf-b: v4 1권 + v5 4권.
  books.b.push(clone(V4[2], b, "b_old0", 20));
  V5.slice(0, 4).forEach((r, i) => books.b.push(clone(r, b, `b_v5_${i}`, i + 1)));
  // perf-re: v5 2권(재동의 전 열람 확인용).
  V5.slice(4, 6).forEach((r, i) => books.re.push(clone(r, re, `re_v5_${i}`, i + 1)));
  // 이용권: perf-a 일반 2장 + 이벤트(결제 1건) 1장 + 보상 1장, perf-re 보상 1장.
  psql(`select public.report_tickets('grant', '${a}', '{"quantity":2,"sourceType":"manual","sourceRef":"perf-seed","key":"perf-seed-a","reason":"LOCAL_DEV","expiresAt":"2026-11-30T23:59:59+09:00"}'::jsonb);`, { quiet: true });
  psql(`insert into public.gift_rewards(owner_user_id,source_order_id,kind,expires_at) values('${a}','perf_order_a_v5_0','event','2026-11-30T23:59:59+09:00') on conflict do nothing;`, { quiet: true });
  // 보상 이용권(팝업 ②③·재동의 한 줄은 캠페인 기록 comp_campaign_grants를 본다): perf-a B 1장, perf-re B 1장, perf-ca A 2장.
  const ca = await account("ca", "current");
  const zero = await account("zero", "current"); // 이용권·책이 없는 계정(0장 화면) — 원장은 지울 수 없어 따로 둔다

  for (const [u, tier, qty] of [[a, "B", 1], [re, "B", 1], [ca, "A", 2]] as const) {
    psql(`do $$ declare ids uuid[]; begin
      if not exists(select 1 from public.comp_campaign_grants where user_id='${u}') then
        with g as (insert into public.gift_rewards(owner_user_id,source_order_id,kind,expires_at) select '${u}',null,'comp','2026-11-30T23:59:59+09:00' from generate_series(1,${qty}) returning id) select array_agg(id) into ids from g;
        insert into public.comp_campaign_grants(campaign_id,user_id,tier,quantity,gift_ids,expires_at) values('perf-seed','${u}','${tier}',${qty},ids,'2026-11-30T23:59:59+09:00');
      end if; end $$;`, { quiet: true });
  }
  // 생성 대기 화면: 결제는 끝났고 원고를 쓰는 중인 책 1권(perf-a).
  const waiting = psql(`with o as (select * from public.payment_orders where payment_order_id='perf_order_a_v5_0')
    insert into public.payment_orders select (jsonb_populate_record(null::public.payment_orders, to_jsonb(o) || jsonb_build_object('payment_order_id','perf_order_a_wait','provider_order_id','perf_order_a_wait','provider_payment_id','perf_pk_a_wait','report_id','report_perf'||substr(md5('a_wait'),1,24),'paid_at',now(),'created_at',now()))).* from o on conflict do nothing;
    insert into public.report_purchase_bindings(order_id,buyer_id,display_name) values('perf_order_a_wait','${a}','성능 대기') on conflict do nothing;
    insert into public.paid_report_snapshots(report_id,order_id,product_type,status) values('report_perf'||substr(md5('a_wait'),1,24),'perf_order_a_wait','saju_mbti_full','GENERATING') on conflict do nothing;
    select 'report_perf'||substr(md5('a_wait'),1,24);`).trim().split("\n").pop()!;
  const state = { accounts: { a, b, re, new: fresh, ca, zero }, books, expired, waiting };
  writeFileSync(join(ROOT, "tools/perf/.state.json"), JSON.stringify(state, null, 1));
  console.log(JSON.stringify({ a: books.a.length, b: books.b.length, re: books.re.length, expired }));
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
