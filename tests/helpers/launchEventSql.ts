import { readFileSync } from "node:fs";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import type { PGlite } from "@electric-sql/pglite";
import { ticketPublicationSql } from "./ticketPublicationSql";
import { ACCOUNT_POLICY_VERSIONS } from "../../src/lib/account/policy";
import { LAUNCH_MIGRATION, LAUNCH_SCHEDULE_MIGRATION } from "../../src/lib/growth/launchLocal";
export const START = "2026-10-10T15:00:00Z", END = "2026-10-31T15:00:00Z";
export const versions = ACCOUNT_POLICY_VERSIONS;
export async function launchSql(beforeMigration?: (db: PGlite) => Promise<void>, beforeSchedule?: (db: PGlite) => Promise<void>) {
  const base = await ticketPublicationSql(), db = base.db;
  await db.exec("reset role");
  if (beforeMigration) await beforeMigration(db);
  await db.exec(readFileSync(LAUNCH_MIGRATION, "utf8"));
  if (beforeSchedule) await beforeSchedule(db);
  await db.exec(readFileSync(LAUNCH_SCHEDULE_MIGRATION, "utf8"));
  // ISOLATED TEST DB ONLY. No shipped clock parameter/session setting exists.
  await db.exec(`create table public.launch_test_clock(value timestamptz); insert into launch_test_clock values('${START}');
    grant select on launch_test_clock to service_role;
    create function public.launch_test_now() returns timestamptz language sql volatile as $$ select value from public.launch_test_clock $$;`);
  const defs = (await db.query<{ def: string }>("select pg_get_functiondef(p.oid) def from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname<>'launch_test_now' and p.prokind='f'")).rows;
  for (const { def } of defs) if (/clock_timestamp\(\)|\bnow\(\)/.test(def)) await db.exec(def.replace(/(?:pg_catalog\.)?clock_timestamp\(\)|\bnow\(\)/g, "public.launch_test_now()"));
  const defaults = (await db.query<{ table_schema: string; table_name: string; column_name: string; column_default: string }>("select table_schema,table_name,column_name,column_default from information_schema.columns where table_schema in ('public','auth') and column_default ~ '(clock_timestamp|now)\\(\\)' and data_type='timestamp with time zone'")).rows;
  for (const d of defaults) await db.exec(`alter table ${d.table_schema}.${d.table_name} alter column ${d.column_name} set default ${d.column_default.replace(/(?:pg_catalog\.)?clock_timestamp\(\)|\bnow\(\)/g, "public.launch_test_now()")}`);
  return { ...base, h: launchHelpers(db) };
}
export function launchHelpers(db: PGlite) {
  const clock = async (at: string) => { await db.query("update launch_test_clock set value=$1", [at]); };
  const call = async (fn: string, action: string, user: string | null = null, data: object = {}) => {
    if (!["growth_campaign", "book_referrals", "report_tickets", "report_ticket_publication"].includes(fn)) throw new Error("TEST_FUNCTION_DENIED");
    return db.transaction(async tx => {
      await tx.exec("set local role service_role");
      return (await tx.query<{ r: Record<string, unknown> }>(`select ${fn}($1,$2,$3::jsonb) r`, [action,user,JSON.stringify(data)])).rows[0].r;
    });
  };
  const tickets = (action: string, user: string, data: object = {}) => call("report_tickets", action, user, data);
  const campaign = (action: string, user: string | null, data: object = {}) => call("growth_campaign", action, user, data);
  const referral = (action: string, user: string | null, data: object = {}) => call("book_referrals", action, user, data);
  const hash = () => createHash("sha256").update(randomUUID()).digest("hex");
  const policy = async (budget: number | null = 100) => {
    await db.query(`insert into growth_campaigns(public_slug,name,message,status,starts_at,ends_at,offer_type,ticket_quantity)
      values('launch-20261029','LOCAL TEST','이벤트 안내','ACTIVE',$1,$2,'REPORT_TICKET',1) on conflict(public_slug) do update set status='ACTIVE'`, [START,END]);
    await db.query(`insert into launch_event_policy(id,campaign_id,total_limit,campaign_limit,referral_limit,inviter_limit,approved_at)
      select 'launch-20261029',id,$1,$1,$1,$1,case when $1::int is not null then public.launch_test_now()-interval '1 day' end from growth_campaigns where public_slug='launch-20261029'
      on conflict(id) do update set total_limit=$1,campaign_limit=$1,referral_limit=$1,inviter_limit=$1,approved_at=excluded.approved_at`, [budget]);
  };
  const user = async (old = false, consent = true) => {
    const id = randomUUID();
    await db.query("insert into auth.users(id,created_at) values($1,public.launch_test_now()+($2||' seconds')::interval)", [id,old ? -3600 : 0]);
    if (consent) await db.query("select record_account_consent($1,$2,'검수','google','first_login',$3::jsonb)", [id,randomUUID(),JSON.stringify(Object.entries(versions).map(([consent_type,document_version]) => ({consent_type,document_version,required:true,is_agreed:true})))]);
    return id;
  };
  const acquisition = async (id?: string) => {
    const contextHash = hash(); await campaign("capture", null, {slug:"launch-20261029",contextHash});
    const u = id ?? await user();
    return { user:u, contextHash, result:await campaign("attribute",u,{contextHash,versions}) };
  };
  const reserve = async (id: string): Promise<Record<string, unknown>> => {
    const data = {requestId:randomUUID(),reportId:`report_${randomUUID().replaceAll("-","")}`,inputHash:hash(),productType:"saju_mbti_full",input:{},displayName:"검수"};
    return {...await tickets("redeem",id,data), productType:data.productType};
  };
  const publish = async (id: string, r: Record<string, unknown>) => {
    const snapshot = {reportId:r.reportId,productType:r.productType,productVersion:"v4",draft:{},evidencePacket:{}};
    const result = await tickets("publish",id,{redemptionId:r.redemptionId,token:r.token,gateVersion:"paid-report-v1",snapshot});
    const stored = (await db.query<{ snapshot_json: unknown }>("select snapshot_json from paid_report_snapshots where report_id=$1", [r.reportId])).rows[0]?.snapshot_json;
    return {result,reportId:r.reportId,snapshot:stored};
  };
  const invite = async (id: string, reportId: unknown, snapshot: unknown) => {
    const shareToken = `gr_${randomBytes(24).toString("base64url")}`, tokenHash = hash();
    await db.query("insert into report_share_links(report_id,token) values($1,$2)", [reportId,shareToken]);
    const result = await referral("create",id,{reportId,snapshot,shareToken,tokenHash});
    return {result,shareToken,tokenHash};
  };
  const referred = async (invitation: object) => {
    const contextHash = hash();
    const captured = await referral("capture",null,{...invitation,contextHash});
    const id = await user();
    const source = await referral("context",id,{contextHash});
    return {user:id,contextHash,captured,result:await referral("attribute",id,{contextHash,versions,sourceSnapshot:source.snapshot})};
  };
  const count = async (table: string, where = "true") => Number((await db.query<{n: number}>(`select count(*)::int n from ${table} where ${where}`)).rows[0].n);
  const state = async () => (await db.query<{r: Record<string, unknown>}>("select launch_event_state() r")).rows[0].r;
  return {clock,call,tickets,campaign,referral,hash,policy,user,acquisition,reserve,publish,invite,referred,count,state};
}
