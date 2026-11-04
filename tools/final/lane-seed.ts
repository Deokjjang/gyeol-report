/**
 * 교체 레인 확인(최종판 4, 호출 0): 결제가 끝난(paid) 주문의 Book을 "임시본 발행됨 + Anthropic 2.5시간 실패 후 복구" 상태로 심는다(로컬 DB만).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/lane-seed.ts <reportId>
 * - 임시본 내용: 새 임시본(OpenAI)을 만들지 않는다 — 목업 작가(devMockStream, 결정론 장면 은행 글, 호출 0)로 만든 자리표시 Book. 입력·기준 시각은 그 주문의 것.
 * - 상태: paid_report_snapshots COMPLETED(자리표시), 결제 작업 COMPLETED, book_generation_state phase=interim(첫 실패 2.5시간 전, 다음 시도 = 지금).
 * 다음 단계: /api/internal/ops-jobs(교체 레인)가 Sonnet 정식본을 만들어 바꾸고 임시본을 book_snapshot_versions에 보관하는지 본다.
 */
import { execFileSync } from "node:child_process";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { ReportInputPayload } from "../../src/lib/report-generation/reportInputTypes";

const sql = (q: string) => execFileSync("docker", ["exec", "-i", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: q, encoding: "utf8" }).trim();

async function main() {
  const reportId = process.argv[2];
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: lane-seed.ts <reportId>"); process.exit(2); }
  const row = JSON.parse(sql(`select json_build_object('order', s.order_id, 'status', s.status, 'paid', o.status, 'job', j.status, 'payload', o.input_snapshot->'reportInputPayload', 'created', coalesce(o.input_snapshot->'bookGeneration'->>'evaluatedAt', j.created_at::text)) from public.paid_report_snapshots s join public.payment_orders o on o.payment_order_id=s.order_id join public.report_generation_jobs j on j.report_id=s.report_id where s.report_id='${reportId}'`) || "null");
  if (!row || row.paid !== "paid") { console.error(`결제 완료 주문이 아니다: ${JSON.stringify(row)?.slice(0, 200)}`); process.exit(3); }
  if (row.status === "COMPLETED") { console.error("이미 발행된 Book이다(자리표시를 덮지 않는다)"); process.exit(3); }
  const payload = row.payload as ReportInputPayload, policyAt = new Date(row.created).toISOString();
  const sink = { async save() { return true; }, async load() { return []; } };
  const built = await buildV5Snapshot({ payload, reportId, policyAt, sink, deps: { provider: "anthropic", model: "mock-interim", fallback: null, stream: devMockStream("ok", payload, policyAt), people: async () => [] } });
  if (built.meta.chapters.some(c => c.source === "deterministic")) { console.error("자리표시 Book에 빈 장이 있다"); process.exit(4); }
  const snap = JSON.stringify(built.snapshot).replace(/\$snap\$/g, "");
  const out = sql(`begin;
update public.paid_report_snapshots set status='COMPLETED', snapshot_json=$snap$${snap}$snap$::jsonb, gate_version='paid-report-v1', published_at=now()-interval '30 minutes' where report_id='${reportId}';
update public.report_generation_jobs set status='COMPLETED', lease_token=null, lease_until=null, last_error_code='LANE_TEST_INTERIM' where report_id='${reportId}';
insert into public.book_generation_state(report_id,origin,origin_ref,phase,first_attempt_at,first_failure_at,failures,next_at,interim_at,last_reason)
  values('${reportId}','paid','${row.order}','interim',now()-interval '150 minutes',now()-interval '150 minutes',4,now()-interval '1 minute',now()-interval '30 minutes','interim:자리표시(최종판 교체 레인 확인, 호출 0)')
  on conflict(report_id) do update set phase='interim',first_failure_at=excluded.first_failure_at,failures=excluded.failures,next_at=excluded.next_at,interim_at=excluded.interim_at,last_reason=excluded.last_reason,lane_token=null,lane_until=null;
insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,reason,cost_usd,duration_ms)
  values('${reportId}','queue','anthropic','claude-sonnet-5-5',null,'deferred','official:pre_output:http_529(장애 기록, 자리표시)',0,0),
        ('${reportId}','interim',null,'mock-interim','interim','published','interim:자리표시(최종판 교체 레인 확인, 호출 0)',0,0);
commit;
select phase||' '||next_at||' '||first_failure_at from public.book_generation_state where report_id='${reportId}';`);
  console.log(`심음: ${reportId} → ${out.split("\n").at(-1)}`);
}
void main();
