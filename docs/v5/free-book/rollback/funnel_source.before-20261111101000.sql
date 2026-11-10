-- 운영 적용 전(2026-11-10 21:3x KST 읽기): ops_funnel md5 1134a55c4e431e42d62331d21c6e0a43(20261111090000의 정의와 같은 본문), funnel_daily 기본 키 (day, step, source, campaign),
-- ops_gift md5 64509223d1763ee4a85fd8e4b88c4a46. 되돌리기 순서: 코드를 이전 배포로 → 아래 실행.
begin;
-- 1) ops_funnel 이전 본문(content·land·free_book 없음)
create or replace function public.ops_funnel(p_action text, p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare v_step text; v_src text; v_cmp text; v_today date := (now() at time zone 'Asia/Seoul')::date; v_days integer; v_from date; v_from_ts timestamptz; v_today_ts timestamptz;
begin
  if p_action='hit' then
    v_step := coalesce(p_data->>'step','');
    if not v_step = any(array['free_view','home_view','product_view','input_start','input_done','pay_click','pay_open','ticket_click',
      'login_new','login_member','signup_grant','book_start','book_published','paid']) then return jsonb_build_object('ok',false,'code','STEP'); end if;
    v_src := lower(coalesce(p_data->>'source','')); if v_src !~ '^[a-z0-9_-]{1,40}$' then v_src := '-'; end if;
    v_cmp := lower(coalesce(p_data->>'campaign','')); if v_cmp !~ '^[a-z0-9_-]{1,64}$' then v_cmp := '-'; end if;
    if not exists(select 1 from public.funnel_daily f where f.day=v_today and f.step=v_step and f.source=v_src and f.campaign=v_cmp)
      and (select count(*) from public.funnel_daily f where f.day=v_today) >= 3000 then v_src := 'other'; v_cmp := 'other'; end if;
    insert into public.funnel_daily(day,step,source,campaign,n) values(v_today,v_step,v_src,v_cmp,1)
      on conflict (day,step,source,campaign) do update set n=public.funnel_daily.n+1;
    return jsonb_build_object('ok',true);
  elsif p_action='report' then
    v_days := least(greatest(coalesce(nullif(p_data->>'days','')::integer,7),1),31);
    v_from := v_today - (v_days - 1);
    v_from_ts := v_from::timestamp at time zone 'Asia/Seoul'; v_today_ts := v_today::timestamp at time zone 'Asia/Seoul';
    return jsonb_build_object('ok',true,'today',v_today,'from',v_from,
      'rows',(select coalesce(jsonb_agg(jsonb_build_object('day',f.day,'step',f.step,'source',f.source,'campaign',f.campaign,'n',f.n) order by f.day,f.step),'[]'::jsonb)
        from public.funnel_daily f where f.day>=v_from),
      'server',(select jsonb_build_object(
        'ordersToday',count(*) filter (where po.created_at>=v_today_ts),'orders',count(*),
        'paidToday',count(*) filter (where po.status in ('paid','refunded') and po.paid_at>=v_today_ts),'paid',count(*) filter (where po.status in ('paid','refunded') and po.paid_at>=v_from_ts))
        from public.payment_orders po where po.created_at>=v_from_ts and po.deleted_at is null and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))
        || (select jsonb_build_object('signupsToday',count(*) filter (where c0.completed_at>=v_today_ts),'signups',count(*))
          from public.account_contacts c0 join public.account_profiles p0 on p0.user_id=c0.user_id
          where c0.completed_at>=v_from_ts and p0.created_at>=v_from_ts and not public.ops_test_user(c0.user_id))
        || (select jsonb_build_object('grantsToday',count(*) filter (where g.created_at>=v_today_ts),'grants',count(*))
          from public.gift_rewards g where g.kind='signup' and g.created_at>=v_from_ts and not public.ops_test_user(g.owner_user_id))
        || (select jsonb_build_object('publishedToday',count(*) filter (where s0.published_at>=v_today_ts),'published',count(*))
          from public.paid_report_snapshots s0 left join public.report_ticket_redemptions r0 on r0.id=s0.ticket_redemption_id
          where s0.published_at>=v_from_ts and not public.ops_test_user(coalesce(r0.user_id, public.ops_order_user(s0.order_id)))));
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $$;
revoke all on function public.ops_funnel(text,jsonb) from public,anon,authenticated;
grant execute on function public.ops_funnel(text,jsonb) to service_role;
-- 2) content 칸 접기: 같은 (day,step,source,campaign)을 합친 뒤 기본 키를 되돌리고 칸을 지운다.
create temp table fd on commit drop as select day,step,source,campaign,sum(n)::integer n from public.funnel_daily group by 1,2,3,4;
delete from public.funnel_daily;
alter table public.funnel_daily drop constraint funnel_daily_pkey;
alter table public.funnel_daily drop column content;
alter table public.funnel_daily add primary key (day, step, source, campaign);
insert into public.funnel_daily(day,step,source,campaign,n) select day,step,source,campaign,n from fd;
-- 3) ops_gift('spend') 응답의 kind 빼기(동작은 같음 — 빼지 않아도 된다)
do $$ declare d text := pg_catalog.pg_get_functiondef('public.ops_gift(text,jsonb)'::regprocedure); begin
  if position($a$'moved',true,'kind',w.kind);$a$ in d) > 0 then execute replace(d, $a$return jsonb_build_object('ok',true,'moved',true,'kind',w.kind);$a$, $a$return jsonb_build_object('ok',true,'moved',true);$a$); end if;
end $$;
commit;
