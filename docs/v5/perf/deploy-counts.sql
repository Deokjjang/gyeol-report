-- P 배포(단계 1, 2026-11-06): migration 20261107090000 적용 직전·직후에 운영에서 돌리는 확인 SELECT(읽기 전용, 개인정보 열 없음).
-- 적용 직전 기대값(11-06 덕짱님·Claude Code 확인): 대상 42장·39명·사용 0·링크 0, 캠페인 기록 39·39, 누나 5장(12-06 11:06 KST), 이벤트 이용권 0, 선물 링크 0.
-- 대상 수·사용·링크가 기대값과 다르면 적용하지 않고 멈춰서 보고한다. (migration도 대상 중 사용·링크가 하나라도 있으면 PERF_D_TARGET_CHANGED로 멈춘다.)

-- 1) D 대상: 보상 캠페인 수령자의 보상 이용권(누나 계정 제외), 11-30 23:59:59 KST보다 늦게 끝나는 것.
select 'D 대상(보상 캠페인 이용권)' what, count(*) n, count(distinct g.owner_user_id) users,
  count(*) filter (where g.status<>'available' or g.used_at is not null or g.claimed_at is not null) used,
  count(*) filter (where g.token_hash is not null or g.gifted_at is not null) linked,
  min(g.expires_at) min_exp, max(g.expires_at) max_exp
  from public.gift_rewards g where g.kind='comp' and g.owner_user_id<>'d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55' and g.expires_at>'2026-11-30 23:59:59+09'
    and exists(select 1 from public.comp_campaign_grants c where c.user_id=g.owner_user_id);
select 'comp_campaign_grants' what, count(*) n from public.comp_campaign_grants where user_id<>'d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55' and expires_at>'2026-11-30 23:59:59+09'
union all select 'comp_grants', count(*) from public.comp_grants where user_id<>'d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55' and expires_at>'2026-11-30 23:59:59+09';
-- 2) 누나 계정(그대로 둘 5장).
select 'sister' what, count(*) n, min(expires_at) min_exp, max(expires_at) max_exp, count(*) filter (where status='available') available
  from public.gift_rewards where owner_user_id='d0dd2e4e-38cf-49b5-8dea-7a35ee54dd55';
-- 3) 이벤트 이용권·선물 링크(3번: 배포 전에 만들어진 선물 링크가 0이면 친구 첫 결제 보너스 삭제 그대로).
select 'event tickets' what, count(*) n from public.gift_rewards where kind='event'
union all select 'gift links(token 있음·보냄·받음)', count(*) from public.gift_rewards where token_hash is not null or gifted_at is not null or status in ('gifted','claimed');

-- 적용 뒤:
-- select target, count(*) n, min(old_expires_at), max(old_expires_at), min(new_expires_at) from public.ticket_expiry_adjustments group by target;
-- 위 1)·2)를 다시 돌려 D 대상 0, 누나 5장 12-06 11:06 그대로인지 본다.
