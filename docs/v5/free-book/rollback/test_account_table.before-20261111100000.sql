-- 운영 적용 전 본문(2026-11-10 21:06 KST, pg_get_functiondef 읽기 전용, md5 c10b2126821f68fbe0f67fde89b7e547).
-- 되돌리기: 아래를 실행하면 ops_test_user가 설정값(ops_settings 'test_accounts')만 본다. 표는 함수를 되돌린 뒤 지운다(지우지 않아도 쓰이지 않음).
begin;

CREATE OR REPLACE FUNCTION public.ops_test_user(p_user uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select p_user is not null and coalesce((select jsonb_typeof(s.value->'ids')='array' and s.value->'ids' ? p_user::text from public.ops_settings s where s.key='test_accounts'), false);
$function$;

-- drop table if exists public.ops_test_accounts;
commit;
