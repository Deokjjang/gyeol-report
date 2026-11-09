-- 운영 Q 다음 배포(메타 복구와 함께): 깨우기 트리거(ops_notify_wake)는 문장 단위라 0줄 넣기에도 발동해 서버를 불렀다.
-- 1분 크론의 미발행 감지·누락 보충(insert … select … on conflict do nothing 두 문장)이 넣을 것이 없을 때마다 불려 운영에서 분당 2번.
-- 새로 들어온 줄(전이 표 new_rows)이 있을 때만 부른다. 트리거 이름·발동 시점(after insert, 문장 단위)·주소 규칙·실패 처리는 그대로라
-- 보고서 롤백 절의 disable/enable 문장도 그대로 쓴다. 되돌리기: 20261107100000의 함수·트리거 정의를 다시 실행(전이 표 없이).
drop trigger ops_notify_wake on public.ops_notifications;

create or replace function public.ops_notify_wake() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_url text;
begin
  if not exists(select 1 from new_rows) then return null; end if;
  select value->>'url' into v_url from public.ops_settings where key='notify_wake_url';
  if v_url is null or v_url !~ '^https://[a-z0-9.-]+/api/' or to_regnamespace('net') is null then return null; end if;
  execute 'select net.http_post(url := $1, body := ''{}''::jsonb, headers := ''{"Content-Type":"application/json"}''::jsonb, timeout_milliseconds := 5000)' using v_url;
  return null;
exception when others then
  return null;
end $$;

create trigger ops_notify_wake after insert on public.ops_notifications
  referencing new table as new_rows
  for each statement execute function public.ops_notify_wake();
