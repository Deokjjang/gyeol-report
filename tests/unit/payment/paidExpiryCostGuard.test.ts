import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { costGuardPatch, paidWorkerSql, seedPaid } from "../../helpers/paidWorkerSql";

let sql: Awaited<ReturnType<typeof paidWorkerSql>>;
const payload = { productKey: "saju_mbti_full" };
const rows = async (table: string) => (await sql.db.query<Record<string, unknown>>(`select * from ${table}`)).rows;
const mutations = () => rows("local_mutations");
beforeAll(async () => {
  sql = await paidWorkerSql();
  await sql.db.exec(`create table local_mutations (relation text, operation text);
    create function local_count_mutations() returns trigger language plpgsql as $$ begin
      insert into local_mutations values (TG_TABLE_NAME,TG_OP); return null; end $$;`);
  for (const table of ["paid_report_snapshots", "report_generation_jobs", "report_generation_attempts", "report_input_snapshots", "payment_orders"]) {
    await sql.db.exec(`create trigger local_mutation after update or delete on ${table} for each row execute function local_count_mutations()`);
  }
}, 30000);
beforeEach(async () => { await sql.db.exec("truncate payment_orders cascade; truncate local_mutations"); });
afterAll(async () => { await sql?.db.close(); });

async function publish(id: string, version: "v3" | "v4" = "v4") {
  const reportId = await seedPaid(sql.store, id, payload);
  const claimed = await sql.store.call("claim_job");
  const job = claimed.job as Record<string, unknown>;
  expect(await sql.store.call("finish_job", { jobId: job.job_id, token: job.lease_token, success: true, gateVersion: "paid-report-v1", snapshot: { reportId, productType: payload.productKey, productVersion: version, draft: {}, evidencePacket: {} }, externalCalls: [{ model: "mock", outcome: "completed", inputTokens: 1, outputTokens: 1 }] })).toMatchObject({ status: "COMPLETED" });
  return reportId;
}
async function makeExpired() {
  await sql.db.exec("update paid_report_snapshots set published_at=now()-interval '2160 hours 1 second', expires_at=now()-interval '1 second'; update report_input_snapshots set expires_at=now()-interval '1 second'; update report_generation_attempts set validation_errors='[\"local diagnostic\"]'; truncate local_mutations");
}
async function assertNoMoreMutations() {
  await sql.db.exec("truncate local_mutations");
  for (let i = 0; i < 100; i++) expect(await sql.store.call("expire")).toEqual({ ok: true });
  expect(await mutations()).toEqual([]);
}

it("demonstrates old no-op writes, then stops all repeats with the minimal predicate patch", async () => {
  await sql.db.exec(readFileSync("scripts/paid_report_one_call_delivery_patch.sql", "utf8"));
  await publish("before"); await makeExpired();
  await sql.store.call("expire"); await sql.db.exec("truncate local_mutations");
  await sql.store.call("expire");
  expect(await mutations()).toHaveLength(3); // job + snapshot + already-empty errors
  await sql.db.exec(costGuardPatch);
  await assertNoMoreMutations();
});

it.each(["v3", "v4"] as const)("%s: first expiry clears data once, retains financial and external-call audit", async version => {
  await publish(version, version); await makeExpired();
  const orders = await rows("payment_orders");
  const attempts = await rows("report_generation_attempts");
  expect(await sql.store.call("expire")).toEqual({ ok: true });
  expect(await mutations()).toHaveLength(4); // three updates, one input DELETE
  expect(await rows("paid_report_snapshots")).toEqual([expect.objectContaining({ status: "EXPIRED", snapshot_json: null })]);
  expect(await rows("report_generation_jobs")).toEqual([expect.objectContaining({ status: "EXPIRED", lease_token: null, lease_until: null })]);
  expect(await rows("report_input_snapshots")).toEqual([]);
  expect(await rows("payment_orders")).toEqual(orders);
  expect(await rows("report_generation_attempts")).toEqual(attempts.map(a => ({ ...a, validation_errors: [] })));
  await assertNoMoreMutations();
});

it.each([false, true])("already EXPIRED with leftover snapshot=%s clears only leftovers", async leftover => {
  await publish("expired");
  const snapshot = (await rows("paid_report_snapshots"))[0].snapshot_json;
  await makeExpired(); await sql.store.call("expire");
  if (leftover) {
    // Live constraints reject this corruption. Remove/reinstate ONLY in the
    // disposable fixture to prove cleanup can repair an old invalid row too.
    await expect(sql.db.query("update paid_report_snapshots set snapshot_json=$1::jsonb", [JSON.stringify(snapshot)])).rejects.toThrow();
    await sql.db.exec("alter table paid_report_snapshots drop constraint paid_report_snapshots_publication_check");
    await sql.db.query("update paid_report_snapshots set snapshot_json=$1::jsonb", [JSON.stringify(snapshot)]);
    await sql.db.exec("update report_generation_jobs set lease_token=gen_random_uuid(),lease_until=now()");
  }
  await sql.db.exec("truncate local_mutations");
  await sql.store.call("expire");
  expect(await mutations()).toHaveLength(leftover ? 2 : 0);
  if (leftover) await sql.db.exec(`alter table paid_report_snapshots add constraint paid_report_snapshots_publication_check check (
    (status='COMPLETED' and snapshot_json is not null and gate_version='paid-report-v1')
    or status in ('QUEUED','GENERATING','RETRYING','FAILED_REQUIRES_ATTENTION') or (status='EXPIRED' and snapshot_json is null))`);
  await assertNoMoreMutations();
});

it.each(["QUEUED", "RUNNING", "RETRYING", "FAILED_REQUIRES_ATTENTION"])("unpublished %s with retained input is untouched; abandoned input becomes attention, never EXPIRED", async status => {
  await seedPaid(sql.store, "unpublished", payload);
  await sql.db.query("update report_generation_jobs set status=$1,lease_token=gen_random_uuid(),lease_until=now()+interval '10 minutes'", [status]);
  await sql.db.query("update paid_report_snapshots set status=$1", [status === "RUNNING" ? "GENERATING" : status]);
  const jobs = await rows("report_generation_jobs"), reports = await rows("paid_report_snapshots");
  await sql.db.exec("truncate local_mutations"); await sql.store.call("expire");
  expect(await mutations()).toEqual([]); expect(await rows("report_generation_jobs")).toEqual(jobs);
  expect(await rows("paid_report_snapshots")).toEqual(reports);
  await sql.db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'; truncate local_mutations");
  await sql.store.call("expire");
  expect(await rows("paid_report_snapshots")).toEqual([expect.objectContaining({ status: "FAILED_REQUIRES_ATTENTION", published_at: null, expires_at: null })]);
  expect(await rows("report_generation_jobs")).toEqual([expect.objectContaining({ status: "FAILED_REQUIRES_ATTENTION", last_error_code: "INPUT_RETENTION_EXPIRED", lease_token: null, lease_until: null })]);
  await assertNoMoreMutations();
  expect(await sql.store.call("claim_job")).toMatchObject({ job: null });
  expect(await mutations()).toEqual([]); // batching must not re-touch attention
});

it("published recovery RUNNING expires normally; stale worker cannot resurrect it", async () => {
  const reportId = await publish("recovery");
  const snapshot = (await rows("paid_report_snapshots"))[0].snapshot_json;
  await sql.store.call("quarantine", { reportId, expectedSnapshot: snapshot });
  await sql.store.call("admin_retry", { reportId });
  const job = (await sql.store.call("claim_job")).job as Record<string, unknown>;
  await makeExpired(); await sql.store.call("expire");
  expect(await sql.store.call("finish_job", { jobId: job.job_id, token: job.lease_token, success: true, snapshot })).toMatchObject({ ok: false, code: "STALE_LEASE" });
  expect((await rows("paid_report_snapshots"))[0].status).toBe("EXPIRED");
  await assertNoMoreMutations();
});

it("no targets is write-free; repeat patch preserves function ACL/settings/contracts", async () => {
  await assertNoMoreMutations();
  const metadata = () => sql.db.query("select prosrc,proacl,proconfig,prosecdef,proowner from pg_proc where oid='public.paid_report_reliability(text,jsonb)'::regprocedure");
  const before = await metadata(); await sql.db.exec(costGuardPatch);
  expect(await metadata()).toEqual(before);
  for (const role of ["anon", "authenticated", "service_role"]) expect((await sql.db.query<{ allowed: boolean }>("select has_function_privilege($1,'public.paid_report_reliability(text,jsonb)','EXECUTE') as allowed", [role])).rows[0].allowed).toBe(role === "service_role");
  for (const file of ["paid_report_one_call_delivery_verify.sql", "paid_report_publish_expiry_verify.sql", "paid_report_external_call_guard_verify.sql", "paid_checkout_consent_evidence_verify.sql"]) expect((await sql.db.query<{ pass: boolean }>(readFileSync(`scripts/${file}`, "utf8"))).rows.every(r => r.pass), file).toBe(true);
  await sql.db.exec(readFileSync("scripts/paid_worker_queue_diagnostics.sql", "utf8"));
  expect(await mutations()).toEqual([]);
});

it("unexpected deployed predicates fail closed instead of replacing an unknown function", async () => {
  const before = (await sql.db.query<{ body: string }>("select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) as body")).rows[0].body;
  const different = before.replace("where x.report_id=s.report_id and s.expires_at<=now()", "where x.report_id=s.report_id and s.expires_at < now()");
  expect(different).not.toBe(before);
  await sql.db.exec(different);
  try {
    await expect(sql.db.exec(costGuardPatch)).rejects.toThrow("PAID_WORKER_COST_GUARD_SOURCE_REVIEW_REQUIRED");
  } finally { await sql.db.exec("rollback"); await sql.db.exec(before); }
});
