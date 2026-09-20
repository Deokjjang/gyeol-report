-- Read-only orphan report investigation.
-- A paid-looking row still requires authoritative payment/provider evidence.
-- No classification in this result is sufficient grounds to change a row.

select
  r.report_id,
  r.payment_order_id,
  r.payment_status,
  r.payment_amount,
  r.payment_provider,
  r.payment_paid_at,
  r.created_at,
  r.deleted_at,
  exists (
    select 1
    from public.payment_orders po
    where po.payment_order_id=r.payment_order_id
  ) as payment_order_exists
from public.reports r
where r.payment_order_id is not null
  and not exists (
    select 1
    from public.payment_orders po
    where po.payment_order_id=r.payment_order_id
  )
order by r.created_at,r.report_id;
