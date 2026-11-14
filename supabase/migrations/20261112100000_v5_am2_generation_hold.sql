-- AM2-3 6-1(덕짱님 결정 2026-11-12 「새 알림 종류 + migration 파일」): 결정론 대체본은 어느 상품도 내보내지 않는다.
-- 정식본(Sonnet)·임시본(OpenAI)이 모두 실패해 발행을 보류하면 처리 봇에 「발행 보류」 경보를 보낸다(주문당 1번 — dedupe_key 'hold:<reportId>').
-- 경보 넣기는 기존 ops_notify_enqueue(service_role 실행 권한)를 그대로 쓴다. 이 파일은 알림 종류 검사에 'generation_hold'만 더한다.
-- 운영 적용은 하지 않았다(저장소에만, 적용은 따로 승인). 적용 전 운영 코드가 이 종류를 넣으면 ops_notify_enqueue가 경고만 남기고 넘어간다(생성은 막지 않는다).
begin;
set local lock_timeout = '5s';
alter table public.ops_notifications drop constraint ops_notifications_kind_check;
alter table public.ops_notifications add constraint ops_notifications_kind_check
  check(kind in ('payment','refund','request','unpublished','notify_failed','reminder','share_failed','signup_surge','api_credit','generation_hold'));
commit;
