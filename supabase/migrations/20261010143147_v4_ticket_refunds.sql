-- COMMERCE-04B. PREPARED ONLY; never applied to Production in this phase.
-- Requires bundle commerce + publication queue. Existing launch wrapper is preserved.
begin;
set local lock_timeout = '5s';
do $$ begin
  if to_regprocedure('public.ticket_bundle_commerce(text,uuid,jsonb)') is null
    or to_regprocedure('public.report_tickets(text,uuid,jsonb)') is null
    or to_regclass('public.ticket_bundle_refunds') is not null then
    raise exception 'REFUND_MIGRATION_BASE_REVIEW_REQUIRED';
  end if;
end $$;

create table public.ticket_bundle_refunds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  order_id text not null references public.ticket_bundle_orders(id),
  grant_id uuid not null, foreign key(grant_id,user_id) references public.report_ticket_grants(id,user_id),
  request_id text not null check(request_id ~ '^[a-zA-Z0-9_-]{16,100}$'),
  reason_code text not null check(reason_code in ('UNUSED','STATUTORY','SERVICE_FAILURE','DUPLICATE_PAYMENT','OTHER')),
  state text not null default 'REQUESTED' check(state in ('REQUESTED','HELD','REVIEW_REQUIRED','APPROVED','PG_CANCEL_PENDING','PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED','WITHDRAWN','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION')),
  original_amount integer not null check(original_amount>0), original_quantity integer not null check(original_quantity>0),
  approved_amount integer, approved_quantity integer,
  review_ref text check(length(review_ref) between 1 and 100),
  actor_ref text not null default 'member' check(length(actor_ref) between 1 and 100),
  idempotency_key text not null unique default 'ticket-refund-'||gen_random_uuid()::text,
  cancel_reason text not null default '미사용 이용권 비례 환불 '||gen_random_uuid()::text,
  first_attempt_at timestamptz, claim_token uuid, claim_until timestamptz,
  provider_cancel_ref text unique check(length(provider_cancel_ref) between 1 and 64),
  provider_balance integer, provider_canceled_at timestamptz,
  failure_code text,
  created_at timestamptz not null default clock_timestamp(), updated_at timestamptz not null default clock_timestamp(),
  unique(user_id,request_id), unique(id,user_id),
  check((approved_amount is null and approved_quantity is null) or
    (approved_amount>0 and approved_amount<=original_amount and approved_quantity>0 and approved_quantity<=original_quantity
     and original_amount%original_quantity=0 and approved_amount=(original_amount/original_quantity)*approved_quantity)),
  check(state not in ('APPROVED','PG_CANCEL_PENDING','PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED') or approved_amount is not null),
  check(state not in ('PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED') or
    (first_attempt_at is not null and provider_cancel_ref is not null and provider_canceled_at is not null and provider_balance=original_amount-approved_amount))
);
create unique index ticket_bundle_one_active_refund on public.ticket_bundle_refunds(order_id) where state<>'WITHDRAWN';
create index ticket_bundle_refunds_owner on public.ticket_bundle_refunds(user_id,created_at desc);
create index ticket_bundle_refunds_recovery on public.ticket_bundle_refunds(updated_at) where state in ('PG_CANCEL_PENDING','PG_CANCEL_CONFIRMED','LEDGER_SETTLED','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION');
create table public.ticket_bundle_refund_audit (
  id bigint generated always as identity primary key,
  refund_id uuid not null references public.ticket_bundle_refunds(id),
  from_state text, to_state text not null, review_ref text, actor_ref text not null, failure_code text,
  at timestamptz not null default clock_timestamp()
);
create index ticket_bundle_refund_audit_request on public.ticket_bundle_refund_audit(refund_id,id);
alter table public.ticket_bundle_refunds enable row level security;
alter table public.ticket_bundle_refund_audit enable row level security;
revoke all on public.ticket_bundle_refunds,public.ticket_bundle_refund_audit from public,anon,authenticated,service_role;
grant select,insert,update on public.ticket_bundle_refunds to service_role;
grant select,insert on public.ticket_bundle_refund_audit to service_role;
grant usage on sequence public.ticket_bundle_refund_audit_id_seq to service_role;
create trigger ticket_refund_audit_immutable before update or delete on public.ticket_bundle_refund_audit for each row execute function public.ticket_immutable();
create trigger ticket_refund_no_delete before delete on public.ticket_bundle_refunds for each row execute function public.ticket_immutable();

create function public.ticket_refund_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='UPDATE' then
    if row(new.id,new.user_id,new.order_id,new.grant_id,new.request_id,new.reason_code,new.original_amount,new.original_quantity,new.idempotency_key,new.cancel_reason,new.created_at)
      is distinct from row(old.id,old.user_id,old.order_id,old.grant_id,old.request_id,old.reason_code,old.original_amount,old.original_quantity,old.idempotency_key,old.cancel_reason,old.created_at)
      or (old.approved_amount is not null and row(new.approved_amount,new.approved_quantity,new.review_ref) is distinct from row(old.approved_amount,old.approved_quantity,old.review_ref))
      or (old.first_attempt_at is not null and new.first_attempt_at is distinct from old.first_attempt_at)
      or (old.provider_cancel_ref is not null and row(new.provider_cancel_ref,new.provider_balance,new.provider_canceled_at) is distinct from row(old.provider_cancel_ref,old.provider_balance,old.provider_canceled_at)) then
      raise exception 'REFUND_FACT_IMMUTABLE';
    end if;
    if new.state<>old.state and not (
      (old.state='REQUESTED' and new.state='HELD') or
      (old.state='HELD' and new.state='REVIEW_REQUIRED') or
      (old.state='REVIEW_REQUIRED' and new.state in ('APPROVED','WITHDRAWN','MANUAL_SETTLEMENT_REQUIRED')) or
      (old.state='APPROVED' and new.state in ('PG_CANCEL_PENDING','WITHDRAWN','MANUAL_SETTLEMENT_REQUIRED')) or
      (old.state='PG_CANCEL_PENDING' and new.state in ('PG_CANCEL_CONFIRMED','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION')) or
      (old.state in ('MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION') and new.state in ('PG_CANCEL_CONFIRMED','WITHDRAWN')) or
      (old.state='PG_CANCEL_CONFIRMED' and new.state='LEDGER_SETTLED') or
      (old.state='LEDGER_SETTLED' and new.state='COMPLETED')
    ) then raise exception 'REFUND_STATE_INVALID'; end if;
    if new.state='WITHDRAWN' and old.first_attempt_at is not null then raise exception 'REFUND_FINANCIAL_OUTCOME_PENDING'; end if;
  end if;
  new.updated_at:=clock_timestamp();
  return new;
end $$;
create trigger ticket_refund_validate before insert or update on public.ticket_bundle_refunds for each row execute function public.ticket_refund_guard();
create function public.ticket_refund_audit_change() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='INSERT' then
    insert into public.ticket_bundle_refund_audit(refund_id,to_state,review_ref,actor_ref,failure_code) values(new.id,new.state,new.review_ref,new.actor_ref,new.failure_code);
  elsif row(new.state,new.review_ref,new.actor_ref,new.failure_code,new.claim_token) is distinct from row(old.state,old.review_ref,old.actor_ref,old.failure_code,old.claim_token) then
    insert into public.ticket_bundle_refund_audit(refund_id,from_state,to_state,review_ref,actor_ref,failure_code) values(new.id,old.state,new.state,new.review_ref,new.actor_ref,new.failure_code);
  end if;
  return new;
end $$;
create trigger ticket_refund_audit after insert or update on public.ticket_bundle_refunds for each row execute function public.ticket_refund_audit_change();

-- Preserve the order facts/transition guard; allow only a proven pre-PG withdrawal.
do $$ declare body text; needle text:='(old.status=''REFUND_PENDING'' and new.status=''REFUNDED'')'; begin
  body:=pg_get_functiondef('public.ticket_bundle_order_guard()'::regprocedure);
  if position(needle in body)=0 then raise exception 'REFUND_ORDER_GUARD_BASE'; end if;
  execute replace(body,needle,needle||' or (old.status=''REFUND_PENDING'' and new.status=''GRANTED'' and exists(select 1 from public.ticket_bundle_refunds f where f.order_id=old.id and f.request_id=old.refund_request_id and f.state=''WITHDRAWN'' and f.first_attempt_at is null) and not exists(select 1 from public.ticket_bundle_refunds f where f.order_id=old.id and f.state<>''WITHDRAWN''))');
end $$;

alter table public.report_ticket_ledger add column refund_id uuid references public.ticket_bundle_refunds(id);
alter table public.report_ticket_ledger drop constraint report_ticket_ledger_event_type_check;
alter table public.report_ticket_ledger drop constraint report_ticket_ledger_check;
alter table public.report_ticket_ledger add constraint report_ticket_ledger_event_type_check check(event_type in ('GRANT','REDEEM','REVERSAL','EXPIRE','REFUND'));
alter table public.report_ticket_ledger add constraint report_ticket_ledger_check check(
  (event_type='GRANT' and quantity_delta>0 and redemption_id is null and refund_id is null) or
  (event_type='REDEEM' and quantity_delta=-1 and redemption_id is not null and refund_id is null) or
  (event_type='REVERSAL' and quantity_delta=1 and redemption_id is not null and refund_id is null) or
  (event_type='EXPIRE' and quantity_delta<0 and redemption_id is null and refund_id is null) or
  (event_type='REFUND' and quantity_delta<0 and redemption_id is null and report_id is null and product_type is null and refund_id is not null));
create unique index report_ticket_once_per_refund on public.report_ticket_ledger(refund_id) where refund_id is not null;
create function public.ticket_refund_event_guard() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if new.event_type='REFUND' and not exists(
    select 1 from public.ticket_bundle_refunds f join public.ticket_bundle_orders o on o.id=f.order_id
    join public.report_ticket_grants g on g.id=f.grant_id
    where f.id=new.refund_id and f.user_id=new.user_id and f.grant_id=new.grant_id and f.state='PG_CANCEL_CONFIRMED'
      and o.status='REFUND_PENDING' and o.user_id=f.user_id and o.grant_id=f.grant_id and g.source_type='purchase' and g.source_ref=o.id
      and f.provider_cancel_ref is not null and new.quantity_delta=-f.approved_quantity and new.idempotency_key='refund:'||f.id
      and not exists(select 1 from public.report_ticket_redemptions r where r.grant_id=f.grant_id and r.state in ('RUNNING','QUEUED'))
  ) then raise exception 'REFUND_EVIDENCE_REQUIRED'; end if;
  return new;
end $$;
create trigger ticket_refund_event_validate before insert on public.report_ticket_ledger for each row execute function public.ticket_refund_event_guard();

-- Only a safe, explicit customer projection; no payment key, provider cancel ID or review reference.
create function public.ticket_refund_view(f public.ticket_bundle_refunds) returns jsonb language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('requestId',f.request_id,'state',f.state,'reasonCode',f.reason_code,'amount',f.approved_amount,
    'quantity',f.approved_quantity,'partial',f.approved_amount<f.original_amount,'createdAt',f.created_at,'updatedAt',f.updated_at,
    'canWithdraw',f.first_attempt_at is null and f.state in ('REVIEW_REQUIRED','APPROVED','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION'));
$$;

-- Customer: quote/request/withdraw. Operators: approve/claim/attention/confirm/settle/complete.
-- ALL calls service-role only. HTTP handler exposes only the three customer actions.
-- Lock order always account(10) -> order -> refund -> append-only ledger.
create function public.ticket_bundle_refunds_rpc(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare o public.ticket_bundle_orders%rowtype; g public.report_ticket_grants%rowtype; f public.ticket_bundle_refunds%rowtype;
  remaining integer; used integer; pending integer; refunded integer; unit integer; estimate integer; q jsonb; stamp timestamptz;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  stamp:=clock_timestamp();
  select * into o from public.ticket_bundle_orders where id=p_data->>'bundleOrderId' and user_id=p_user for update;
  if not found then return jsonb_build_object('ok',false,'code','ORDER_NOT_FOUND'); end if;
  select * into g from public.report_ticket_grants where id=o.grant_id and user_id=p_user;
  if not found or g.source_type<>'purchase' or g.source_ref<>o.id or g.quantity<>o.quantity or o.paid_at is null or o.provider_payment_id is null
    or o.status not in ('GRANTED','REFUND_PENDING','REFUNDED') then return jsonb_build_object('ok',false,'code','PURCHASE_REVIEW_REQUIRED'); end if;
  select coalesce(sum(quantity_delta),0)::integer,coalesce(-sum(quantity_delta) filter(where event_type='REFUND'),0)::integer into remaining,refunded from public.report_ticket_ledger where grant_id=g.id;
  select count(*) filter(where state='COMPLETED'),count(*) filter(where state in ('RUNNING','QUEUED')) into used,pending from public.report_ticket_redemptions where grant_id=g.id;
  unit:=case when o.amount%o.quantity=0 then o.amount/o.quantity else null end;
  estimate:=case when unit is not null and remaining>=0 and remaining+used+pending+refunded=o.quantity and (g.expires_at is null or g.expires_at>stamp) then unit*remaining else null end;
  q:=jsonb_build_object('bundleOrderId',o.id,'purchased',o.quantity,'paidAmount',o.amount,'unitPrice',unit,'used',used,'remaining',remaining,'pending',pending,'refunded',refunded,
    'estimate',estimate,'reviewRequired',true,'held',o.status='REFUND_PENDING','quotedAt',stamp);
  if p_action='request' then
    if coalesce(p_data->>'requestId','') !~ '^[a-zA-Z0-9_-]{16,100}$' or coalesce(p_data->>'reasonCode','') not in ('UNUSED','STATUTORY','SERVICE_FAILURE','DUPLICATE_PAYMENT','OTHER') then return jsonb_build_object('ok',false,'code','INVALID_INPUT'); end if;
    select * into f from public.ticket_bundle_refunds where user_id=p_user and request_id=p_data->>'requestId' for update;
    if found then
      if f.order_id<>o.id or f.reason_code<>p_data->>'reasonCode' then return jsonb_build_object('ok',false,'code','REQUEST_CONFLICT'); end if;
      return jsonb_build_object('ok',true,'quote',q,'refund',public.ticket_refund_view(f));
    end if;
    if o.status<>'GRANTED' or exists(select 1 from public.ticket_bundle_refunds where order_id=o.id and state<>'WITHDRAWN') then return jsonb_build_object('ok',false,'code','REFUND_ALREADY_REQUESTED'); end if;
    insert into public.ticket_bundle_refunds(user_id,order_id,grant_id,request_id,reason_code,original_amount,original_quantity)
      values(p_user,o.id,g.id,p_data->>'requestId',p_data->>'reasonCode',o.amount,o.quantity) returning * into f;
    update public.ticket_bundle_orders set status='REFUND_PENDING',refund_state='REVIEW_REQUIRED',refund_request_id=f.request_id,refund_requested_at=stamp,updated_at=stamp where id=o.id;
    update public.ticket_bundle_refunds set state='HELD' where id=f.id;
    update public.ticket_bundle_refunds set state='REVIEW_REQUIRED' where id=f.id returning * into f;
    q:=q||jsonb_build_object('held',true);
  else
    select * into f from public.ticket_bundle_refunds where order_id=o.id
      and (p_data->>'requestId' is null or request_id=p_data->>'requestId') order by created_at desc limit 1 for update;
    if p_action='quote' then return jsonb_build_object('ok',true,'quote',q,'refund',case when f.id is not null then public.ticket_refund_view(f) else null end); end if;
    if f.id is null then return jsonb_build_object('ok',false,'code','REFUND_NOT_FOUND'); end if;
    if p_action='withdraw' then
      if f.state='WITHDRAWN' then return jsonb_build_object('ok',true,'refund',public.ticket_refund_view(f)); end if;
      if f.first_attempt_at is not null or f.state not in ('REVIEW_REQUIRED','APPROVED','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION') then return jsonb_build_object('ok',false,'code','FINANCIAL_REVIEW_PENDING'); end if;
      update public.ticket_bundle_refunds set state='WITHDRAWN',actor_ref='member' where id=f.id returning * into f;
      update public.ticket_bundle_orders set status='GRANTED',refund_state='NONE',updated_at=stamp where id=o.id;
      q:=q||jsonb_build_object('held',false);
    else
      -- A separate trusted operator procedure supplies the review reference; never an HTTP customer field.
      if coalesce(p_data->>'operatorRef','') !~ '^[a-zA-Z0-9_-]{8,100}$' then return jsonb_build_object('ok',false,'code','OPERATOR_REVIEW_REQUIRED'); end if;
      update public.ticket_bundle_refunds set actor_ref=p_data->>'operatorRef' where id=f.id;
      if p_action='approve' then
        if f.state<>'REVIEW_REQUIRED' or f.reason_code<>'UNUSED' or pending>0 or estimate is null or estimate<=0 or refunded<>0 or g.expires_at is not null
          or estimate is distinct from (p_data->>'approvedAmount')::integer or remaining is distinct from (p_data->>'approvedQuantity')::integer then return jsonb_build_object('ok',false,'code','REQUOTE_OR_SEPARATE_REVIEW_REQUIRED','quote',q); end if;
        update public.ticket_bundle_refunds set state='APPROVED',approved_amount=estimate,approved_quantity=remaining,review_ref=p_data->>'operatorRef' where id=f.id returning * into f;
      elsif p_action='claim' then
        if f.state not in ('APPROVED','PG_CANCEL_PENDING','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION','PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED') or f.approved_amount is null then return jsonb_build_object('ok',false,'code','APPROVAL_REQUIRED'); end if;
        if f.state in ('PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED') then return jsonb_build_object('ok',true,'refund',public.ticket_refund_view(f)); end if;
        if f.claim_until>stamp then return jsonb_build_object('ok',false,'code','REFUND_BUSY'); end if;
        -- Claim fences network work. Recovery may GET in attention states, but never POST there.
        update public.ticket_bundle_refunds set state=case when state='APPROVED' then 'PG_CANCEL_PENDING' else state end,
          first_attempt_at=coalesce(first_attempt_at,stamp),claim_token=gen_random_uuid(),claim_until=stamp+interval '2 minutes' where id=f.id returning * into f;
        return jsonb_build_object('ok',true,'refund',public.ticket_refund_view(f),'intent',jsonb_build_object(
          'paymentKey',o.provider_payment_id,'providerOrderId',o.provider_order_id,'originalAmount',o.amount,'amount',f.approved_amount,'quantity',f.approved_quantity,
          'idempotencyKey',f.idempotency_key,'cancelReason',f.cancel_reason,'firstAttemptAt',f.first_attempt_at,'token',f.claim_token,
          'canPost',f.state='PG_CANCEL_PENDING' and stamp<f.first_attempt_at+interval '15 days'));
      elsif p_action='attention' then
        if f.state not in ('APPROVED','PG_CANCEL_PENDING','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION') then return jsonb_build_object('ok',false,'code','STATE_CONFLICT'); end if;
        if f.claim_token is distinct from (p_data->>'token')::uuid or f.claim_until<=stamp then return jsonb_build_object('ok',false,'code','STALE_CLAIM'); end if;
        update public.ticket_bundle_refunds set state='MANUAL_SETTLEMENT_REQUIRED',failure_code=case when p_data->>'code' in ('METHOD_REVIEW','PROVIDER_MISMATCH','IDEMPOTENCY_EXPIRED','PROVIDER_REJECTED') then p_data->>'code' else 'PROVIDER_REVIEW' end,
          claim_until=null where id=f.id returning * into f;
      elsif p_action='confirm' then
        if f.state in ('PG_CANCEL_CONFIRMED','LEDGER_SETTLED','COMPLETED') then
          return jsonb_build_object('ok',f.provider_cancel_ref=p_data->>'transactionKey','refund',public.ticket_refund_view(f));
        end if;
        if f.state not in ('PG_CANCEL_PENDING','MANUAL_SETTLEMENT_REQUIRED','FAILED_REQUIRES_ATTENTION') or f.claim_token is distinct from (p_data->>'token')::uuid or f.claim_until<=stamp then return jsonb_build_object('ok',false,'code','STALE_CLAIM'); end if;
        if o.provider_payment_id is distinct from p_data->>'paymentKey' or o.provider_order_id is distinct from p_data->>'providerOrderId' or p_data->>'currency' is distinct from 'KRW'
          or o.amount is distinct from (p_data->>'totalAmount')::integer or f.approved_amount is distinct from (p_data->>'cancelAmount')::integer
          or o.amount-f.approved_amount is distinct from (p_data->>'balanceAmount')::integer or f.cancel_reason is distinct from p_data->>'cancelReason'
          or p_data->>'cancelStatus' is distinct from 'DONE' or coalesce(length(p_data->>'transactionKey'),0) not between 1 and 64
          or (p_data->>'canceledAt')::timestamptz is null or (p_data->>'canceledAt')::timestamptz<f.first_attempt_at-interval '1 second'
          or (p_data->>'canceledAt')::timestamptz>stamp+interval '1 minute' then return jsonb_build_object('ok',false,'code','PROVIDER_MISMATCH'); end if;
        update public.ticket_bundle_refunds set state='PG_CANCEL_CONFIRMED',provider_cancel_ref=p_data->>'transactionKey',provider_balance=(p_data->>'balanceAmount')::integer,
          provider_canceled_at=(p_data->>'canceledAt')::timestamptz,claim_until=null where id=f.id returning * into f;
      elsif p_action='settle' then
        if f.state in ('LEDGER_SETTLED','COMPLETED') then return jsonb_build_object('ok',true,'refund',public.ticket_refund_view(f)); end if;
        if f.state<>'PG_CANCEL_CONFIRMED' or pending<>0 or remaining<>f.approved_quantity or refunded<>0 then return jsonb_build_object('ok',false,'code','LEDGER_REVIEW_REQUIRED'); end if;
        insert into public.report_ticket_ledger(user_id,grant_id,event_type,quantity_delta,refund_id,idempotency_key,reason)
          values(p_user,g.id,'REFUND',-f.approved_quantity,f.id,'refund:'||f.id,'PURCHASE_PROPORTIONAL_REFUND');
        update public.ticket_bundle_refunds set state='LEDGER_SETTLED' where id=f.id returning * into f;
      elsif p_action='complete' then
        if f.state='COMPLETED' then return jsonb_build_object('ok',true,'refund',public.ticket_refund_view(f)); end if;
        if f.state<>'LEDGER_SETTLED' or remaining<>0 or refunded<>f.approved_quantity then return jsonb_build_object('ok',false,'code','LEDGER_REVIEW_REQUIRED'); end if;
        update public.ticket_bundle_refunds set state='COMPLETED' where id=f.id returning * into f;
        update public.ticket_bundle_orders set status='REFUNDED',refund_state='VERIFIED_REFUNDED',refunded_at=stamp,provider_cancel_ref=f.provider_cancel_ref,updated_at=stamp where id=o.id;
      else return jsonb_build_object('ok',false,'code','UNKNOWN_ACTION'); end if;
    end if;
  end if;
  return jsonb_build_object('ok',true,'quote',q,'refund',public.ticket_refund_view(f));
end $$;

-- Presentation balance: held lots remain in the ledger, but are not spendable.
-- Do not change FEFO or silently spend another source. Publication retains REFUND_HOLD.
alter function public.report_tickets(text,uuid,jsonb) rename to report_tickets_before_refunds;
create function public.report_tickets(p_action text,p_user uuid,p_data jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare r jsonb; held integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
  r:=public.report_tickets_before_refunds(p_action,p_user,p_data);
  if p_action in ('summary','history','reconcile') and r->>'ok'='true' then
    select coalesce(sum(l.quantity_delta),0)::integer into held from public.report_ticket_ledger l
      join public.ticket_bundle_orders o on o.grant_id=l.grant_id
      join public.report_ticket_grants g on g.id=l.grant_id
      where l.user_id=p_user and o.status='REFUND_PENDING' and (g.expires_at is null or g.expires_at>clock_timestamp());
    r:=r||jsonb_build_object('quantity',(r->>'quantity')::integer-held,'heldQuantity',held);
  end if;
  return r;
end $$;
revoke all on function public.ticket_refund_guard(),public.ticket_refund_audit_change(),public.ticket_refund_event_guard(),public.ticket_refund_view(public.ticket_bundle_refunds),public.ticket_bundle_refunds_rpc(text,uuid,jsonb),public.report_tickets(text,uuid,jsonb),public.report_tickets_before_refunds(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.ticket_refund_guard(),public.ticket_refund_audit_change(),public.ticket_refund_event_guard(),public.ticket_refund_view(public.ticket_bundle_refunds),public.ticket_bundle_refunds_rpc(text,uuid,jsonb),public.report_tickets(text,uuid,jsonb),public.report_tickets_before_refunds(text,uuid,jsonb) to service_role;
commit;
