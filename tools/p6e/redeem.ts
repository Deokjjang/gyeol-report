/**
 * P6e-ops: 로컬 검수 계정으로 이용권을 사용해 책을 접수한다(공개 API는 운영 도메인 출처만 받으므로 scripts/dev/v5-e2e.ts와 같은 RPC로).
 *   pnpm exec tsx tools/p6e/redeem.ts <계정이름|dev> <상품키> [--base http://localhost:3500] [--expect-fail]
 * 1) 접수 → 결과 코드 출력(보상 이용권은 설정한 상품만: 그 밖이면 NO_USABLE_TICKET)  2) 접수됐으면 이용권 워커를 돌려 발행까지 기다린다. 비밀값은 출력하지 않는다.
 */
import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { purchaseMetadata } from "../../src/lib/library/model";
import { CHECKOUT_POLICY_VERSIONS } from "../../src/lib/legal/policyVersions";
import { createCheckoutConsentEvidence } from "../../src/lib/payment/checkoutConsent";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { assertEnvFileLocal, assertLocal, localSupabase, readEnvFile, psql } from "../../scripts/dev/local";

const [who, product] = process.argv.slice(2);
const base = process.argv.includes("--base") ? process.argv[process.argv.indexOf("--base") + 1] : "http://localhost:3500";
assertLocal(base, "서버"); assertEnvFileLocal();
const person = { name: "검수", birthDate: "1995-03-14", birthTime: "08:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "FEMALE", mbtiType: "ENFP" };
const ctx = { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] };
const RAW: Record<string, unknown> = {
  saju_mbti_full: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person, userContext: ctx, productOptions: {} },
  career_money_study: { productKey: "career_money_study", productSlug: "career-money-study", person, userContext: ctx, productOptions: {} },
  major_fortune: { productKey: "major_fortune", productSlug: "major-fortune", person, userContext: ctx, productOptions: {} },
  annual_fortune: { productKey: "annual_fortune", productSlug: "annual-fortune", person, userContext: ctx, productOptions: { selectedYear: "2026" } },
};

async function main() {
  const s = localSupabase(), env = readEnvFile();
  const email = who === "dev" ? "v5-dev@gyeol.local" : `p6e-${who}@gyeol.local`;
  const userId = psql(`select id from auth.users where email='${email}'`);
  if (!userId || !RAW[product]) throw new Error("계정 또는 상품키가 올바르지 않음");
  const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const now = new Date(), n = normalizeReportInputPayload(RAW[product], { now: () => now });
  if (!n.ok) throw new Error(`입력 오류 ${n.error}`);
  const input = n.value as { productKey: string; person: { birthDate: string } };
  const consent = { policyVersions: CHECKOUT_POLICY_VERSIONS, assertions: { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true } };
  const requestId = randomUUID(), reportId = `report_${randomUUID().replaceAll("-", "")}`;
  const enq = await db.rpc("report_ticket_publication", { p_action: "enqueue", p_user: userId, p_data: { requestId, input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"), reportId, policyAt: now.toISOString(), consentEvidence: createCheckoutConsentEvidence(consent, input.person.birthDate, now), ...purchaseMetadata(input as never) } });
  const code = enq.error ? `ERROR ${enq.error.message}` : enq.data?.ok ? "ACCEPTED" : String(enq.data?.code);
  console.log(JSON.stringify({ who, product, result: code, ...(code === "ACCEPTED" ? { reportId } : {}) }));
  if (code !== "ACCEPTED") return;
  let state = "QUEUED";
  for (let i = 0; i < 20 && state !== "COMPLETED" && state !== "REVERSED"; i++) {
    await fetch(`${base}/api/internal/report-ticket-jobs`, { headers: { authorization: `Bearer ${env.CRON_SECRET}` }, signal: AbortSignal.timeout(300_000) }).catch(() => undefined);
    const st = await db.rpc("report_ticket_publication", { p_action: "status", p_user: userId, p_data: { requestId } });
    state = String(st.data?.state ?? "?");
  }
  console.log(JSON.stringify({ who, product, finalState: state, reportId }));
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
