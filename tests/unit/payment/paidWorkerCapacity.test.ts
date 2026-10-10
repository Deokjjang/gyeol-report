import { writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { paidWorkerSql } from "../../helpers/paidWorkerSql";
import { runPaidReportBatch } from "../../../src/lib/book/paidWorkerBatch";

// Opt-in local model, NOT a production load test. The real SQL owns all job
// transitions; only arrivals, the clock and generation duration are simulated.
// Finance-01 representative wall/CPU ms (six products in equal rotation).
const wall = [6870.175, 1397.0, 2007.0, 4864.0, 2538.0, 2767.0];
const cpu = [7185.072, 1512.0, 2115.0, 5079.0, 2666.0, 2904.0];
const runtime = { enabled: false, reason: "flag_disabled" } as const;

it.skipIf(process.env.GYEOL_WORKER_CAPACITY !== "1")("real SQL local capacity simulation; no network / provider / Production", async () => {
  const { db, store } = await paidWorkerSql();
  const reports: object[] = [];
  try {
    const original = (await db.query<{ body: string }>("select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) as body")).rows[0].body;
    await db.exec("create function public.local_worker_now() returns timestamptz language sql stable as $$ select current_setting('local.worker_time')::timestamptz $$");
    // Test-only clock substitution; no claim/finish/retry/expiry rules changed.
    await db.exec(original.replace(/\b(?:clock_timestamp|now)\(\)/g, "public.local_worker_now()"));
    const epoch = Date.now();
    for (const scenario of [
      { name: "burst100", count: 100, spread: false },
      { name: "queue1000", count: 1000, spread: false },
      { name: "daily1000", count: 1000, spread: true },
      { name: "daily10000", count: 10000, spread: true },
    ]) for (const mode of ["before", "after"] as const) {
      await db.exec("truncate payment_orders cascade");
      const spreadMs = scenario.spread ? 86_400_000 / scenario.count : 0;
      await db.query(`with orders as (
        insert into payment_orders(payment_order_id,product_type,provider,amount,currency,status,input_snapshot,provider_order_id,paid_at,created_at,updated_at,report_id)
        select 'local-'||i,'saju_mbti_full','toss',1290,'KRW','paid','{}','local-'||i,
          $1::timestamptz+i*$2::double precision*interval '1 millisecond',
          $1::timestamptz+i*$2::double precision*interval '1 millisecond',$1::timestamptz,'report-local-'||i
        from generate_series(0,$3::int-1) i returning *)
        insert into report_input_snapshots(order_id,payload_json,expires_at)
          select payment_order_id,'{"reportInputPayload":{"productKey":"saju_mbti_full"}}',$1::timestamptz+interval '90 days' from orders`, [new Date(epoch).toISOString(), spreadMs, scenario.count]);
      await db.exec(`insert into paid_report_snapshots(report_id,order_id,product_type) select report_id,payment_order_id,product_type from payment_orders;
        insert into report_generation_jobs(order_id,report_id,created_at,next_retry_at) select payment_order_id,report_id,created_at,created_at from payment_orders`);
      let time = 0, finished = 0, failedAttempts = 0, completed24h = 0, totalCpuMs = 0, maxWaitMs = 0, sumWaitMs = 0, claims = 0, invocations = 0;
      const updateClock = () => db.query("select set_config('local.worker_time',$1,false)", [new Date(epoch + time).toISOString()]);
      const c = process.cpuUsage(), t = performance.now();
      while (finished < scenario.count && (!scenario.spread || time < 86_400_000)) {
        invocations++;
        // Conservative single cron at a time. No hypothetical parallel speedup.
        time = Math.ceil(time / 60_000) * 60_000;
        const invocationStart = time;
        await updateClock(); await store.call("expire"); time += 200;
        const runJob = async () => {
          await updateClock(); claims++;
          const claimed = await store.call("claim_job");
          const job = claimed.job as Record<string, unknown> | null;
          if (!claimed.ok || !job) return claimed;
          const index = Number(String(job.order_id).split("-")[1]);
          const duration = wall[index % wall.length] + 400; // DB latency assumption
          time += duration; totalCpuMs += cpu[index % cpu.length];
          await updateClock();
          const fail = index % 100 === 0 && job.attempt_count === 1; // 1% retry
          const result = await store.call("finish_job", {
            jobId: job.job_id, token: job.lease_token, success: !fail, durationMs: Math.round(duration),
            ...(fail ? { code: "GENERATION_EXCEPTION", stage: "generation" } : { gateVersion: "paid-report-v1", snapshot: { reportId: job.report_id, productType: "saju_mbti_full", productVersion: "v4", draft: {}, evidencePacket: {} } }),
          });
          expect(result.ok).toBe(true);
          if (fail) failedAttempts++;
          else { finished++; if (time <= 86_400_000) completed24h++; const wait = time - index * spreadMs; maxWaitMs = Math.max(maxWaitMs, wait); sumWaitMs += wait; }
          return result;
        };
        if (mode === "before") await runJob();
        else expect((await runPaidReportBatch(store, runtime, { runJob, now: () => time, startedAt: invocationStart, rss: () => 0 })).ok).toBe(true);
        time = Math.max(time, invocationStart + 60_000);
      }
      const totals = (await db.query<{ completed: number; reports: number; attempts: number }>(`select
        (select count(*)::int from report_generation_jobs where status='COMPLETED') as completed,
        (select count(*)::int from paid_report_snapshots where status='COMPLETED') as reports,
        (select count(*)::int from report_generation_attempts) as attempts`)).rows[0];
      expect(totals.completed).toBe(finished); expect(totals.reports).toBe(finished);
      expect(totals.attempts).toBe(finished + failedAttempts);
      if (!scenario.spread) expect(finished).toBe(scenario.count);
      const pending = (await db.query<{ oldest: Date | null }>("select min(created_at) as oldest from report_generation_jobs where status in ('QUEUED','RETRYING','RUNNING')")).rows[0].oldest;
      const used = process.cpuUsage(c);
      reports.push({ scenario: scenario.name, mode, ...totals, completed24h, remaining24h: scenario.count - completed24h, failedAttempts, duplicatePublications: totals.reports - finished, invocations, claims, observedHours: time / 3_600_000, meanDeliverySeconds: sumWaitMs / finished / 1000, maxDeliverySeconds: maxWaitMs / 1000, oldestPendingSeconds: pending ? (epoch + time - new Date(pending).getTime()) / 1000 : 0, modeledGenerationCpuSeconds: totalCpuMs / 1000, actualSimulationWallMs: performance.now() - t, actualSimulationCpuMs: (used.user + used.system) / 1000, simulatorPeakRssMiB: process.resourceUsage().maxRSS / 1024 });
      writeFileSync("/tmp/gyeol-ops-capacity-progress.json", JSON.stringify(reports, null, 2));
    }
    writeFileSync("/tmp/gyeol-ops-capacity.json", JSON.stringify({ classification: "LOCAL_SQL_SIMULATION_NOT_PRODUCTION", assumptions: { measuredFinanceWallMs: wall, measuredFinanceCpuMs: cpu, rpcPerJobMs: 400, expirePerInvocationMs: 200, firstAttemptFailureFraction: 0.01, rss: "admission bypassed in simulation; real generation memory measured separately", cron: "60 seconds, serialized, no skipped invocation assumed", snapshots: "small SQL envelopes; real publication validators covered separately" }, reports }, null, 2));
    expect(fetch).not.toHaveBeenCalled();
  } finally { await db.close(); }
}, 600_000);
