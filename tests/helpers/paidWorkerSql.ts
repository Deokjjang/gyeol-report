import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import type { ReliabilityResult, ReliabilityStore } from "../../src/lib/payment/paidReportReliabilityStore";

export const costGuardPatch = readFileSync("scripts/paid_worker_expiry_cost_guard_patch.sql", "utf8");
export async function paidWorkerSql(applyGuard = true) {
  const db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const name of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) {
    await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8").replace(/^\uFEFF/u, ""));
  }
  for (const name of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql", "scripts/paid_checkout_consent_evidence_patch.sql", "scripts/paid_report_one_call_delivery_patch.sql"]) await db.exec(readFileSync(name, "utf8"));
  if (applyGuard) await db.exec(costGuardPatch);
  const store: ReliabilityStore = { async call(action, data = {}) {
    return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
  } };
  return { db, store };
}

// Synthetic paid inputs only. Actual RPC supplies IDs, leases and publication.
export async function seedPaid(store: ReliabilityStore, id: string, payload: unknown, extra: object = {}) {
  const product = (payload as { productKey: string }).productKey;
  const created = await store.call("create_order", { paymentOrderId: id, providerOrderId: id, productType: product, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload, ...extra } });
  if (!created.ok) throw new Error("LOCAL_CREATE_FAILED");
  const claim = await store.call("confirm_claim", { orderId: id, paymentKey: `mock-${id}`, amount: 1290 });
  const result = await store.call("confirm_finish", { orderId: id, paymentKey: `mock-${id}`, token: claim.token });
  if (!result.ok) throw new Error("LOCAL_CONFIRM_FAILED");
  return String(result.reportId);
}
