-- 20261109100000 되돌리기(운영 본문 그대로 보관, 적용 전 md5 5776877fcec6393789ccc552d64aa84f — pg_get_functiondef 기준). 트리거도 전이 표 없이 다시 만든다.
drop trigger ops_notify_wake on public.ops_notifications;
CREATE OR REPLACE FUNCTION public.ops_notify_wake()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_url text;
begin
  select value->>'url' into v_url from public.ops_settings where key='notify_wake_url';
  if v_url is null or v_url !~ '^https://[a-z0-9.-]+/api/' or to_regnamespace('net') is null then return null; end if;
  execute 'select net.http_post(url := $1, body := ''{}''::jsonb, headers := ''{"Content-Type":"application/json"}''::jsonb, timeout_milliseconds := 5000)' using v_url;
  return null;
exception when others then
  return null;
end $function$;
create trigger ops_notify_wake after insert on public.ops_notifications
  for each statement execute function public.ops_notify_wake();
