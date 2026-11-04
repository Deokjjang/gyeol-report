/**
 * P6d-ops 로컬 시험 데이터: 과거 결제 주문 2건(형식 provider_order_…, gyeol2026…)을 로컬 테스트 계정에 연결한다(운영 DB와 무관, 로컬 가드).
 * ① provider_order_<uuid>: 회원 결제(구매 묶음 buyer_id) ② gyeol20260915-…: 비회원 결제 뒤 서재 연결(report_account_links, guest_claim).
 * 둘 다 이 migration 전에 있던 주문처럼 order_records.legacy=true로 둔다(①은 백필처럼 계정이 채워지고, ②는 비어 있다).
 * 실행: pnpm exec tsx tools/p6d/seed-legacy.ts → 결과 JSON(주문코드·reportId)을 출력.
 */
import { randomUUID } from "node:crypto";
import { assertEnvFileLocal, psql } from "../../scripts/dev/local";
import { LOCAL_DEV_ACCOUNT } from "../../src/lib/account/localDevAccount";

assertEnvFileLocal();
const user = psql(`select id from auth.users where email='${LOCAL_DEV_ACCOUNT.email}';`);
const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "옛주문", birthDate: "1994-05-17", birthTime: "07:20", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "INFP" },
  userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "디자이너", focusAreas: [] }, productOptions: {} };
const rpc = (action: string, data: object) => JSON.parse(psql(`select public.paid_report_reliability('${action}', '${JSON.stringify(data).replace(/'/g, "''")}'::jsonb);`));
function paid(poId: string, providerOrderId: string) {
  const created = rpc("create_order", { paymentOrderId: poId, providerOrderId, productType: "saju_mbti_full", provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } });
  if (!created.ok) throw new Error(`create_order ${poId}: ${created.code}`);
  return poId;
}
const tag = randomUUID().slice(0, 8);
const a = paid(`legacy_member_${tag}`, `provider_order_${randomUUID()}`);
psql(`select public.bind_report_purchase('${a}','${user}',null,'옛주문',null);`, { quiet: true });
const b = paid(`legacy_guest_${tag}`, `gyeol20260915-${tag}`);
const reports: Record<string, string> = {};
for (const po of [a, b]) {
  const providerOrderId = psql(`select provider_order_id from public.payment_orders where payment_order_id='${po}';`);
  const claim = rpc("confirm_claim", { orderId: providerOrderId, paymentKey: `legacy-key-${po}`, amount: 1290 });
  const fin = rpc("confirm_finish", { orderId: providerOrderId, paymentKey: `legacy-key-${po}`, token: claim.token });
  if (!fin.ok) throw new Error(`confirm ${po}: ${fin.code}`);
  reports[po] = fin.reportId;
}
// ②: 비회원 주문을 나중에 서재로 가져온 경우(기존 guest_claim 링크).
psql(`insert into public.report_account_links(report_id,user_id,link_source,report_version) values('${reports[b]}','${user}','guest_claim','v5') on conflict do nothing;`, { quiet: true });
// 이 migration 전 주문처럼: legacy 표시, ①은 백필이 구매 묶음에서 계정을 채운 상태, ②는 계정 없음.
psql(`update public.order_records set legacy=true,user_id=case when payment_order_id='${a}' then '${user}'::uuid else null end,buyer_name=null,buyer_email=null where payment_order_id in ('${a}','${b}');`, { quiet: true });
const codes = psql(`select string_agg(payment_order_id||'='||order_code||'='||(select provider_order_id from public.payment_orders p where p.payment_order_id=r.payment_order_id),';') from public.order_records r where payment_order_id in ('${a}','${b}');`);
console.log(JSON.stringify({ user, reports, codes }, null, 1));
