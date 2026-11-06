-- v5 최종3(배포 차단 위험 1): 열람 격리(quarantine)가 고객 Book을 바꾸지 않게 한다.
-- 예전 동작: 열람 검사가 실패하면 앱이 paid_report_reliability('quarantine')을 불렀다.
--  - 기본 migration 본문(0013·20260920163924): status='FAILED_REQUIRES_ATTENTION', snapshot_json=null → 내용이 지워져 복구 불가.
--  - R1 패치 본문(scripts/paid_report_quarantine_recovery_patch.sql 이후, 운영 확인 완료): 내용은 남기지만 status가 바뀌어
--    read_report가 snapshot을 돌려주지 않는다 → 고객이 책을 못 본다. admin_retry는 원본 복원이 아니라 재생성(QUEUED)이다.
-- 이 판의 앱(paidReportReliability.readPublishedReport)은 열람 중 quarantine을 부르지 않는다(검사 실패는 로그만).
-- 이 migration은 DB 쪽도 막는다: quarantine 동작은 어떤 행도 바꾸지 않고 {ok:true, quarantined:false}만 돌려준다.
-- 옛 앱으로 되돌려 배포해도(롤백) 열람이 고객 Book의 status·snapshot_json을 바꾸지 못한다.
-- 함수 본문의 'quarantine' 분기 첫 줄에만 return 한 줄을 넣는다(기본·R1 어느 본문이든 같은 자리, 나머지 동작·권한은 그대로,
-- CREATE OR REPLACE라 소유자·권한 유지). 기존 행은 건드리지 않는다. 다시 실행해도 같다(이미 들어 있으면 그대로 둔다).
-- 되돌리기: 1-0에서 보관한 paid_report_reliability 본문을 다시 실행(docs/v5/final3/deploy-risk-report.md).
begin;
set local lock_timeout = '5s';
do $read_no_quarantine$
declare
  body text;
  head constant text := 'elsif p_action = ''quarantine'' then';
begin
  body := pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
  if position('READ_QUARANTINE_DISABLED' in body) > 0 then
    return;
  end if;
  -- 예상한 본문이 아니면(분기가 없거나 둘 이상) 손대지 않고 멈춘다.
  if (length(body) - length(replace(body, head, ''))) / length(head) <> 1 then
    raise exception 'REVIEW_READ_NO_QUARANTINE_BASE';
  end if;
  execute replace(body, head, head || E'\n'
    || E'    -- v5 최종3: 열람 격리 없음. 고객 Book(status·snapshot_json)은 열람으로 바뀌지 않는다.\n'
    || E'    return jsonb_build_object(''ok'',true,''quarantined'',false,''code'',''READ_QUARANTINE_DISABLED'');');
end $read_no_quarantine$;
commit;
