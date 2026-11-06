CREATE OR REPLACE FUNCTION public.ops_admin(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare q text:=nullif(trim(coalesce(p_data->>'q','')),''); lim integer:=least(coalesce((p_data->>'limit')::integer,50),200); x public.order_records%rowtype; po public.payment_orders%rowtype; result jsonb;
begin
  if p_action in ('search','delayed') then
    select coalesce(jsonb_agg(row_to_json(t)::jsonb),'[]') into result from (
      select r.order_code "orderCode",o.payment_order_id "paymentOrderId",o.provider_order_id "providerOrderId",o.product_type "productType",o.amount,o.status "paymentStatus",
        o.created_at "createdAt",o.paid_at "paidAt",o.report_id "reportId",r.buyer_name "buyerName",r.buyer_email "buyerEmail",r.user_id "userId",r.legacy,
        s.status "bookStatus",g.phase "edition",g.failures,g.last_reason "lastReason",j.status "jobStatus",rf.state "refundState",
        (select count(*) from public.order_requests q0 where q0.payment_order_id=o.payment_order_id and q0.status='open') "openRequests"
      from public.payment_orders o join public.order_records r on r.payment_order_id=o.payment_order_id
        left join public.paid_report_snapshots s on s.report_id=o.report_id left join public.book_generation_state g on g.report_id=o.report_id
        left join public.report_generation_jobs j on j.report_id=o.report_id left join public.order_refunds rf on rf.payment_order_id=o.payment_order_id
      where (p_action<>'delayed' or (o.status='paid' and o.paid_at<now()-interval '30 minutes' and coalesce(s.status,'') not in ('COMPLETED','EXPIRED')))
        and (q is null or r.order_code ilike '%'||q||'%' or o.provider_order_id ilike '%'||q||'%' or o.payment_order_id ilike '%'||q||'%'
          or r.buyer_email ilike '%'||q||'%' or r.buyer_name ilike '%'||q||'%' or o.report_id ilike '%'||q||'%')
        and (nullif(p_data->>'product','') is null or o.product_type=p_data->>'product')
        and (nullif(p_data->>'from','') is null or o.created_at>=(p_data->>'from')::timestamptz)
        and (nullif(p_data->>'to','') is null or o.created_at<(p_data->>'to')::timestamptz)
        and (p_action='delayed' or coalesce((p_data->>'includeReady')::boolean,false) or o.status<>'ready')
      order by o.created_at desc limit lim) t;
    if p_action='delayed' then
      -- 이용권 Book도 지연 목록에 함께 보인다(주문 없음).
      return jsonb_build_object('ok',true,'orders',result,'tickets',(select coalesce(jsonb_agg(jsonb_build_object('redemptionId',r0.id,'reportId',r0.report_id,'productType',r0.product_type,
        'state',r0.state,'createdAt',r0.created_at,'notBefore',r0.not_before,'failures',g.failures,'lastReason',g.last_reason) order by r0.created_at),'[]')
        from public.report_ticket_redemptions r0 left join public.book_generation_state g on g.report_id=r0.report_id
        where r0.state in ('QUEUED','RUNNING') and r0.created_at<now()-interval '30 minutes'));
    end if;
    return jsonb_build_object('ok',true,'orders',result);
  elsif p_action='requests' then
    return jsonb_build_object('ok',true,'requests',(select coalesce(jsonb_agg(jsonb_build_object('id',q0.id,'orderCode',r.order_code,'reason',q0.reason,'memo',q0.memo,'status',q0.status,
      'createdAt',q0.created_at,'productType',o.product_type,'paymentStatus',o.status,'buyerName',r.buyer_name,'adminNote',q0.admin_note,'resolvedAt',q0.resolved_at,'resolvedBy',q0.resolved_by) order by q0.created_at),'[]')
      from public.order_requests q0 join public.order_records r on r.payment_order_id=q0.payment_order_id join public.payment_orders o on o.payment_order_id=q0.payment_order_id
      where q0.status=coalesce(nullif(p_data->>'status',''),'open')));
  elsif p_action='request_done' then
    update public.order_requests set status='done',admin_note=left(p_data->>'note',1000),resolved_at=now(),resolved_by='admin' where id=(p_data->>'id')::uuid and status='open';
    return jsonb_build_object('ok',found);
  elsif p_action='detail' then
    select * into x from public.order_records where order_code=upper(p_data->>'orderCode');
    if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
    select * into po from public.payment_orders where payment_order_id=x.payment_order_id;
    return jsonb_build_object('ok',true,'order',jsonb_build_object('orderCode',x.order_code,'paymentOrderId',po.payment_order_id,'providerOrderId',po.provider_order_id,
        'paymentKey',po.provider_payment_id,'productType',po.product_type,'amount',po.amount,'status',po.status,'createdAt',po.created_at,'paidAt',po.paid_at,'refundedAt',po.refunded_at,
        'reportId',po.report_id,'buyerName',x.buyer_name,'buyerEmail',x.buyer_email,'buyerPhone',x.buyer_phone,'userId',x.user_id,'legacy',x.legacy,'receiptUrl',x.receipt_url,'noticeVersion',x.notice_version),
      'input',(select i.payload_json->'reportInputPayload' from public.report_input_snapshots i where i.order_id=po.payment_order_id),
      'book',(select jsonb_build_object('status',s.status,'publishedAt',s.published_at,'expiresAt',s.expires_at,'productVersion',s.snapshot_json->>'productVersion',
        'meta',s.snapshot_json->'evidencePacket'->'meta'->'writer','costUsd',s.snapshot_json->'evidencePacket'->'meta'->'costUsd') from public.paid_report_snapshots s where s.report_id=po.report_id),
      'job',(select to_jsonb(j) - 'lease_token' from public.report_generation_jobs j where j.report_id=po.report_id),
      'attempts',(select coalesce(jsonb_agg(jsonb_build_object('run',a.run_number,'attempt',a.attempt,'startedAt',a.started_at,'finishedAt',a.finished_at,'errorCode',a.error_code,'stage',a.failure_stage) order by a.run_number,a.attempt),'[]')
        from public.report_generation_attempts a where a.report_id=po.report_id),
      'state',(select to_jsonb(g) - 'lane_token' from public.book_generation_state g where g.report_id=po.report_id),
      'runs',(select coalesce(jsonb_agg(to_jsonb(b) order by b.id),'[]') from public.book_generation_runs b where b.report_id=po.report_id),
      'versions',(select coalesce(jsonb_agg(jsonb_build_object('edition',v.edition,'reason',v.reason,'archivedAt',v.archived_at) order by v.id),'[]') from public.book_snapshot_versions v where v.report_id=po.report_id),
      'requests',(select coalesce(jsonb_agg(to_jsonb(q0) order by q0.created_at),'[]') from public.order_requests q0 where q0.payment_order_id=po.payment_order_id),
      'refund',(select to_jsonb(f) from public.order_refunds f where f.payment_order_id=po.payment_order_id),
      'audit',(select coalesce(jsonb_agg(to_jsonb(l) order by l.id),'[]') from public.ops_audit_log l where l.target in (po.payment_order_id,x.order_code,coalesce(po.report_id,''))));
  elsif p_action='legacy_members' then
    -- 기존 가입자(명단) 현황: 이메일 확보(가입 정보 이메일 또는 공급자 확정 이메일)·최근 로그인·주문 유무.
    with m as (
      select u.user_id,u.joined_at,f.last_login_at,c.completed_at,(c.email is not null or coalesce(f.email_trusted,false)) secured,c.upgrade_state,
        (select count(*) from public.order_records r join public.payment_orders o on o.payment_order_id=r.payment_order_id where r.user_id=u.user_id and o.status in ('paid','refunded'))
        +(select count(*) from public.report_purchase_bindings b join public.payment_orders o on o.payment_order_id=b.order_id
            where b.buyer_id=u.user_id and o.status in ('paid','refunded') and not exists(select 1 from public.order_records r where r.payment_order_id=b.order_id and r.user_id=u.user_id)) orders
      from public.upgrade_roster u left join public.account_contacts c on c.user_id=u.user_id left join public.account_provider_facts f on f.user_id=u.user_id)
    select jsonb_build_object('ok',true,'total',count(*),'emailSecured',count(*) filter (where secured),'emailMissing',count(*) filter (where not secured),
      'withOrders',count(*) filter (where orders>0),'profileDone',count(*) filter (where completed_at is not null),'eligible',count(*) filter (where upgrade_state='eligible'),
      'members',coalesce((select jsonb_agg(jsonb_build_object('userId',m2.user_id,'joinedAt',m2.joined_at,'lastLoginAt',m2.last_login_at,'emailSecured',m2.secured,'orders',m2.orders,'upgradeState',m2.upgrade_state)
        order by m2.last_login_at desc nulls last) from (select * from m order by last_login_at desc nulls last limit lim) m2),'[]')) into result from m;
    return result;
  end if;
  return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION');
end $function$
