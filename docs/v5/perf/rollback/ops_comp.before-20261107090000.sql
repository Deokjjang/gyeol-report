-- 운영 xscosaueqpatcqzbgkbl 적용 전 본문(2026-11-06 보관, md5 90e0e3be3b0ff43117f8655c0430ab72). 롤백: 이 파일을 그대로 실행.
CREATE OR REPLACE FUNCTION public.ops_comp(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare v_user uuid:=nullif(p_data->>'userId','')::uuid; d public.comp_designations%rowtype; g public.comp_grants%rowtype; po public.payment_orders%rowtype; o public.order_records%rowtype;
  v_tier text; has_d boolean; has_g boolean; self_qty integer; gift_qty integer; days integer; exp timestamptz; t jsonb; w public.gift_rewards%rowtype; gids uuid[]:='{}'; tids uuid[]:='{}';
  i integer; n integer; products jsonb:=coalesce(p_data->'products','[]'); lim integer:=least(coalesce((p_data->>'limit')::integer,100),500);
begin
  if p_action='sync' then
    -- 서재를 열 때마다(멱등): 등급 판정 → 가입 정보를 마친 계정만 지급. 이미 지급했으면 그 상태만 돌려준다.
    if v_user is null then return jsonb_build_object('ok',false,'code','MEMBER_REQUIRED'); end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user::text,23));
    select * into d from public.comp_designations where user_id=v_user; has_d:=found;
    v_tier:=case when has_d then 'A' when exists(select 1 from public.upgrade_roster where user_id=v_user) then 'B' else null end;
    if v_tier is null then return jsonb_build_object('ok',true,'tier',null,'state','none'); end if;
    if not coalesce((p_data->>'enabled')::boolean,false) then return jsonb_build_object('ok',true,'tier',v_tier,'state','off'); end if;
    select * into g from public.comp_grants where user_id=v_user; has_g:=found;
    if has_g and (g.tier=v_tier or v_tier='B') then
      return jsonb_build_object('ok',true,'tier',g.tier,'state','granted','quantity',g.quantity,'expiresAt',g.expires_at,'fresh',false);
    end if;
    if not exists(select 1 from public.account_contacts where user_id=v_user) then return jsonb_build_object('ok',true,'tier',v_tier,'state','waiting_profile'); end if;
    self_qty:=0;
    if v_tier='B' then gift_qty:=(p_data->>'bQty')::integer; days:=(p_data->>'bDays')::integer;
    else gift_qty:=greatest((p_data->>'aQty')::integer-case when has_g then g.quantity else 0 end,0); days:=(p_data->>'aDays')::integer; end if;
    if jsonb_typeof(products)<>'array' or jsonb_array_length(products)=0 or coalesce(days,0)<1 or coalesce(self_qty,0)+coalesce(gift_qty,0)<1 then return jsonb_build_object('ok',false,'code','COMP_CONFIG_INVALID'); end if;
    exp:=now()+make_interval(days=>least(days,30));
    if self_qty>0 then
      t:=public.report_tickets('grant',v_user,jsonb_build_object('quantity',self_qty,'sourceType','promotion','sourceRef','comp:'||v_tier||':'||v_user,'key','comp:'||v_tier||':'||v_user,
        'reason','COMP_'||v_tier,'expiresAt',exp,'productScopes',products));
      if not coalesce((t->>'ok')::boolean,false) then return jsonb_build_object('ok',false,'code','GRANT_FAILED'); end if;
      tids:=array[(t->>'grantId')::uuid];
    end if;
    for i in 1..coalesce(gift_qty,0) loop
      insert into public.gift_rewards(owner_user_id,kind,gift_only,product_scopes,expires_at) values(v_user,'comp',false,array(select jsonb_array_elements_text(products)),exp) returning * into w;
      gids:=gids||w.id;
    end loop;
    insert into public.comp_grants(user_id,tier,quantity,ticket_grant_ids,gift_ids,expires_at) values(v_user,v_tier,self_qty+gift_qty,tids,gids,exp)
      on conflict(user_id) do update set tier=excluded.tier,quantity=public.comp_grants.quantity+excluded.quantity,
        ticket_grant_ids=public.comp_grants.ticket_grant_ids||excluded.ticket_grant_ids,gift_ids=public.comp_grants.gift_ids||excluded.gift_ids,
        expires_at=greatest(public.comp_grants.expires_at,excluded.expires_at);
    select * into g from public.comp_grants where user_id=v_user;
    return jsonb_build_object('ok',true,'tier',v_tier,'state','granted','quantity',g.quantity,'expiresAt',g.expires_at,'fresh',true);
  elsif p_action='designate' then
    -- 보상 A 지정: 주문코드 또는 토스 주문번호로 환불 완료 주문을 찾아 그 계정을 지정한다.
    select p.* into po from public.payment_orders p join public.order_records r on r.payment_order_id=p.payment_order_id
      where (nullif(p_data->>'orderCode','') is not null and r.order_code=upper(p_data->>'orderCode'))
         or (nullif(p_data->>'providerOrderId','') is not null and p.provider_order_id=p_data->>'providerOrderId') limit 1;
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into o from public.order_records where payment_order_id=po.payment_order_id;
    if po.status<>'refunded' then return jsonb_build_object('ok',false,'code','NOT_REFUNDED','status',po.status,'orderCode',o.order_code); end if;
    v_user:=o.user_id;
    if v_user is null then select b.buyer_id into v_user from public.report_purchase_bindings b where b.order_id=po.payment_order_id and b.buyer_id is not null limit 1; end if;
    if v_user is null and o.buyer_email is not null then
      select count(*) into n from public.account_contacts where email=lower(o.buyer_email);
      if n=1 then select user_id into v_user from public.account_contacts where email=lower(o.buyer_email); end if;
    end if;
    if v_user is null then return jsonb_build_object('ok',false,'code','NO_ACCOUNT','orderCode',o.order_code); end if;
    insert into public.comp_designations(user_id,order_code,designated_by) values(v_user,o.order_code,nullif(p_data->>'adminUserId','')::uuid) on conflict do nothing;
    get diagnostics n = row_count;
    return jsonb_build_object('ok',true,'userId',v_user,'orderCode',o.order_code,'already',n=0);
  elsif p_action='admin' then
    -- 관리자 "기존 가입자" 탭: 등급·지급 상태·사용 여부와 등급별 인원. 가입 정보 입력 전이면 waiting_profile, 입력했는데 아직 안 넣었으면 ready.
    return (with base as (
        select dd.user_id,'A'::text tier,dd.order_code,dd.designated_at from public.comp_designations dd
        union all select u.user_id,'B',null,null from public.upgrade_roster u where not exists(select 1 from public.comp_designations dd where dd.user_id=u.user_id)),
      m as (
        select b.user_id,b.tier,b.order_code,c.email,f.last_login_at,gr.granted_at,gr.expires_at,coalesce(gr.quantity,0) quantity,
          case when gr.user_id is not null then 'granted' when c.user_id is not null then 'ready' else 'waiting_profile' end state,
          coalesce((select -sum(l.quantity_delta) from public.report_ticket_ledger l where l.grant_id=any(gr.ticket_grant_ids) and l.event_type not in ('GRANT','EXPIRE')),0)::integer used_tickets,
          coalesce(cardinality(gr.ticket_grant_ids),0) ticket_lots,
          (select count(*) from public.gift_rewards gw where gw.id=any(gr.gift_ids) and gw.status in ('used_self','gifted','claimed'))::integer used_gifts,
          coalesce(cardinality(gr.gift_ids),0) gift_lots
        from base b left join public.account_contacts c on c.user_id=b.user_id left join public.account_provider_facts f on f.user_id=b.user_id left join public.comp_grants gr on gr.user_id=b.user_id)
      select jsonb_build_object('ok',true,
        'counts',jsonb_build_object(
          'A',jsonb_build_object('total',count(*) filter (where tier='A'),'granted',count(*) filter (where tier='A' and state='granted'),'ready',count(*) filter (where tier='A' and state='ready'),
            'waitingProfile',count(*) filter (where tier='A' and state='waiting_profile'),'used',count(*) filter (where tier='A' and (used_tickets>0 or used_gifts>0))),
          'B',jsonb_build_object('total',count(*) filter (where tier='B'),'granted',count(*) filter (where tier='B' and state='granted'),'ready',count(*) filter (where tier='B' and state='ready'),
            'waitingProfile',count(*) filter (where tier='B' and state='waiting_profile'),'used',count(*) filter (where tier='B' and (used_tickets>0 or used_gifts>0)))),
        'members',coalesce((select jsonb_agg(jsonb_build_object('userId',x.user_id,'tier',x.tier,'orderCode',x.order_code,'email',x.email,'lastLoginAt',x.last_login_at,'state',x.state,'grantedAt',x.granted_at,
            'expiresAt',x.expires_at,'quantity',x.quantity,'usedTickets',x.used_tickets,'ticketLots',x.ticket_lots,'usedGifts',x.used_gifts,'giftLots',x.gift_lots)
          order by x.tier,x.last_login_at desc nulls last) from (select * from m order by tier,last_login_at desc nulls last limit lim) x),'[]')) from m);
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $function$;
