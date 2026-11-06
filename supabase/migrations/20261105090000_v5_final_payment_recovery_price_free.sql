-- v5 최종(2-4): 결제 복구 대기열(claim_payment_recovery)이 가격 숫자(1290·1490)를 직접 비교하던 조각을 없앤다.
-- 승인 때 금액 대조는 하나뿐이다: 주문을 만들 때 서버가 카탈로그 가격으로 저장한 금액(payment_orders.amount) == 토스 금액.
--  - 콜백 승인: confirm_claim이 저장 금액과 요청 금액을, confirmPaidReport(TS)가 토스 응답 금액과 요청 금액을 대조한다(그대로).
--  - 복구 승인: 저장 금액으로 토스에 승인을 요청하고 응답 금액을 대조한다(paymentConfirmRecovery.ts, 그대로).
-- 그래서 여기서는 금액 모양(토스 최소 100원 이상)만 본다. 가격을 바꿔도(REPORT_PRICE_KRW 한 줄) 바꾸기 전 주문의 복구가
-- RECOVERY_ORDER_MISMATCH로 멈추지 않는다. 지금 가격(1490)에서는 동작이 같다.
-- 함수 본문의 그 한 조각만 바꾼다(작업자·만료·동의·권한은 그대로, CREATE OR REPLACE라 권한 유지). 기존 행은 건드리지 않는다.
-- 되돌리기: 같은 방식으로 'o.amount<100 or o.currency' → 'o.amount not in (1290,1490) or o.currency' (docs/v5/deploy-checklist.md).
begin;
set local lock_timeout = '5s';
do $price$
declare body text;
begin
  body := pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
  if position('o.amount not in (1290,1490) or o.currency' in body) > 0 then
    execute replace(body, 'o.amount not in (1290,1490) or o.currency', 'o.amount<100 or o.currency');
  elsif position('o.amount<100 or o.currency' in body) = 0 then
    -- 예상한 본문이 아니면 손대지 않고 멈춘다(운영 적용 순서 확인).
    raise exception 'REVIEW_PRICE_FREE_RECOVERY_BASE';
  end if;
end $price$;
commit;
