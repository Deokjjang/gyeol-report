-- Read-only inventory: safe before and after 0013. Never returns customer payloads.
-- This is an audit, NOT a restorable backup. Take pg_dump before migration.
begin read only;

select current_database() as database_name, current_user as audit_role,
       current_setting('server_version') as postgres_version, now() as audited_at;

with expected(name) as (values
  ('payment_orders'), ('report_input_snapshots'), ('paid_report_snapshots'),
  ('report_generation_jobs'), ('report_generation_attempts'))
select e.name, c.oid is not null as exists, c.relrowsecurity as rls_enabled
from expected e left join pg_class c on c.oid=to_regclass('public.' || e.name)
order by e.name;

-- Distinguish active 0001 schema (report_id) from legacy 001_init (id).
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema='public' and table_name in
  ('reports','payment_orders','report_input_snapshots','paid_report_snapshots',
   'report_generation_jobs','report_generation_attempts')
order by table_name, ordinal_position;

select c.relname as table_name, con.conname as constraint_name, con.contype,
       con.convalidated, pg_get_constraintdef(con.oid) as definition
from pg_constraint con join pg_class c on c.oid=con.conrelid
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in
  ('payment_orders','report_input_snapshots','paid_report_snapshots',
   'report_generation_jobs','report_generation_attempts')
order by c.relname, con.conname;

select tablename, indexname, indexdef from pg_indexes
where schemaname='public' and tablename in
  ('payment_orders','report_input_snapshots','paid_report_snapshots',
   'report_generation_jobs','report_generation_attempts')
order by tablename, indexname;

select tablename, policyname, roles, cmd, qual, with_check from pg_policies
where schemaname='public' and tablename in
  ('payment_orders','report_input_snapshots','paid_report_snapshots',
   'report_generation_jobs','report_generation_attempts')
order by tablename, policyname;

-- Effective privileges include PUBLIC grants and role membership.
select c.relname as table_name, r.rolname,
       has_table_privilege(r.oid,c.oid,'SELECT') as can_select,
       has_table_privilege(r.oid,c.oid,'INSERT') as can_insert,
       has_table_privilege(r.oid,c.oid,'UPDATE') as can_update,
       has_table_privilege(r.oid,c.oid,'DELETE') as can_delete
from pg_class c join pg_namespace n on n.oid=c.relnamespace
cross join pg_roles r
where n.nspname='public' and c.relname in
  ('report_input_snapshots','paid_report_snapshots',
   'report_generation_jobs','report_generation_attempts')
and r.rolname in ('anon','authenticated','service_role')
order by c.relname,r.rolname;

select p.oid::regprocedure::text as function_signature, p.prosecdef as security_definer,
       p.proconfig as function_settings, md5(pg_get_functiondef(p.oid)) as definition_hash,
       r.rolname, has_function_privilege(r.oid,p.oid,'EXECUTE') as can_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace cross join pg_roles r
where n.nspname='public' and p.proname in
  ('paid_report_reliability','create_ready_payment_order','mark_toss_payment_order_paid',
   'fulfill_paid_saju_mbti_report','save_comprehensive_report_draft_snapshot',
   'get_generated_comprehensive_report_result','get_paid_saju_mbti_report_result',
   'find_paid_report_by_access_token_hash')
and r.rolname in ('anon','authenticated','service_role')
order by function_signature,r.rolname;

select p.oid::regprocedure::text as function_signature,
       position('FAILED_REQUIRES_ATTENTION' in p.prosrc)>0 as attention_state_present,
       position('admin_retry' in p.prosrc)>0 as admin_retry_present,
       position('skip locked' in lower(p.prosrc))>0 as concurrent_claim_present,
       position('90 days' in p.prosrc)>0 as paid_input_expiry_present
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='paid_report_reliability';

-- Only describes migration history availability; inspect versions separately if present.
select to_regclass('supabase_migrations.schema_migrations') is not null as has_migration_history;

commit;
