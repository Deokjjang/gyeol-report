-- 운영 xscosaueqpatcqzbgkbl 적용 전 본문(2026-11-06 보관, md5 3da60cfac7c74187fd8d2a3c61d3ef33). 롤백: 이 파일을 그대로 실행.
CREATE OR REPLACE FUNCTION public.report_tickets(p_action text, p_user uuid, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare r jsonb;
begin
  if p_action='grant' and p_data->>'sourceType' in ('manual','promotion','referral','welcome') and nullif(p_data->>'expiresAt','') is null then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_user::text,10));
    p_data:=p_data||coalesce((select case when g.expires_at is null then '{}'::jsonb else jsonb_build_object('expiresAt',g.expires_at) end
        from public.report_ticket_grants g where g.user_id=p_user and g.idempotency_key=p_data->>'key'),
      jsonb_build_object('expiresAt',clock_timestamp()+interval '30 days'));
  end if;
  r:=public.report_tickets_before_final3(p_action,p_user,p_data);
  if p_action='summary' and r->>'ok'='true' then
    r:=r||jsonb_build_object('lots',(select coalesce(jsonb_agg(jsonb_build_object('quantity',x.q,'expiresAt',x.expires_at) order by x.expires_at nulls last,x.granted_at),'[]')
      from (select g.id,g.expires_at,g.granted_at,sum(l.quantity_delta)::integer q from public.report_ticket_grants g join public.report_ticket_ledger l on l.grant_id=g.id
        where g.user_id=p_user and (g.expires_at is null or g.expires_at>clock_timestamp()) group by g.id,g.expires_at,g.granted_at having sum(l.quantity_delta)>0) x));
  end if;
  return r;
end $function$;
