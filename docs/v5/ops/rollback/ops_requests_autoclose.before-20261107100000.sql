CREATE OR REPLACE FUNCTION public.ops_requests_autoclose(p_order text, p_label text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare n integer; c text;
begin
  update public.order_requests set status='done',resolved_at=now(),resolved_by='auto',
    admin_note=left('자동 처리: '||p_label||' · '||to_char(now() at time zone 'Asia/Seoul','YYYY-MM-DD HH24:MI')||' (KST)',1000)
    where payment_order_id=p_order and status='open';
  get diagnostics n = row_count;
  if n>0 then
    select order_code into c from public.order_records where payment_order_id=p_order;
    insert into public.ops_audit_log(actor,action,target,detail) values('system','request_auto_done',coalesce(c,p_order),jsonb_build_object('count',n,'by',p_label));
  end if;
  return n;
end $function$
