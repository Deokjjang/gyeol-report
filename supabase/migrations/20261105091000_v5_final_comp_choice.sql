-- v5 최종(2-3): 보상 이용권 A = 2장, B = 1장. 장마다 고객이 '내가 쓰기 / 선물 링크 만들기'를 고른다(A는 두 장 다 내가 써도 된다).
-- 이벤트 이용권과 같은 종류·화면·규칙: gift_rewards 행(선물 링크 전용 아님)으로만 넣는다 → 서재 '이벤트 이용권' 목록에서
-- 내가 쓰기(use_self → 이용권 1장) 또는 선물 링크(link → 친구가 claim)를 고른다. 상품 범위·유효일은 설정값 그대로 이용권에 실린다.
-- 전제: 20261104180000_v5_p6e_ops.sql 적용 후(로컬 전용, 운영 미적용). 기존 행은 바꾸지 않는다(이미 지급된 보상은 지급 때 모양 그대로).
-- 설정 인자: aQty(A 총 장수)·aDays·bQty·bDays·products — 서버 코드(src/lib/ops/config.ts compConfig)가 넘긴다. 켜짐 여부(COMP_ENABLED)는 그대로 서버 설정.
-- 되돌리기: 이 파일의 두 replace를 반대로 넣는다(docs/v5/deploy-checklist.md).
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ops_comp(text,jsonb)') is null then raise exception 'COMP_CHOICE_PREREQUISITE_MISSING'; end if;
end $$;

create function pg_temp.comp_patch(p_old text, p_new text) returns void
language plpgsql as $$
declare def text; n integer;
begin
  def := pg_catalog.pg_get_functiondef('public.ops_comp(text,jsonb)'::regprocedure);
  n := (length(def) - length(replace(def, p_old, ''))) / length(p_old);
  if n <> 1 then raise exception 'COMP_CHOICE_PATCH_ANCHOR [%] found % expected 1', left(p_old, 70), n; end if;
  execute replace(def, p_old, p_new);
end $$;

-- 1) 장수: 본인용 이용권(report_tickets 직접 지급)을 없애고 모두 고를 수 있는 이용권으로. B로 먼저 받은 뒤 A로 지정되면 A 총 장수에서 받은 만큼 뺀다.
select pg_temp.comp_patch(
  $p$    if v_tier='B' then self_qty:=(p_data->>'bQty')::integer; gift_qty:=0; days:=(p_data->>'bDays')::integer;
    else self_qty:=greatest((p_data->>'aSelf')::integer-case when has_g then g.quantity else 0 end,0); gift_qty:=(p_data->>'aGift')::integer; days:=(p_data->>'aDays')::integer; end if;$p$,
  $p$    self_qty:=0;
    if v_tier='B' then gift_qty:=(p_data->>'bQty')::integer; days:=(p_data->>'bDays')::integer;
    else gift_qty:=greatest((p_data->>'aQty')::integer-case when has_g then g.quantity else 0 end,0); days:=(p_data->>'aDays')::integer; end if;$p$);

-- 2) 선물 링크 전용이 아니다: 장마다 내가 쓰거나 선물한다(이벤트 이용권과 같은 규칙).
select pg_temp.comp_patch(
  $p$values(v_user,'comp',true,array(select jsonb_array_elements_text(products)),exp)$p$,
  $p$values(v_user,'comp',false,array(select jsonb_array_elements_text(products)),exp)$p$);
commit;
