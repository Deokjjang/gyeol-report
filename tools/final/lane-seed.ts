/**
 * 교체 레인 확인(최종판 4, 호출 0): 결제가 끝난(paid) 주문의 Book을 "임시본 발행됨 + Anthropic 2.5시간 실패 후 복구" 상태로 심는다(로컬 DB만).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/lane-seed.ts <reportId>
 * - 임시본 내용: 새 임시본(OpenAI)을 만들지 않는다 — 목업 작가(devMockStream, 결정론 장면 은행 글, 호출 0)로 만든 자리표시 Book. 입력·기준 시각은 그 주문의 것.
 * - 상태: paid_report_snapshots COMPLETED(자리표시), 결제 작업 COMPLETED, book_generation_state phase=interim(첫 실패 2.5시간 전, 다음 시도 = 지금).
 * 다음 단계: /api/internal/ops-jobs(교체 레인)가 Sonnet 정식본을 만들어 바꾸고 임시본을 book_snapshot_versions에 보관하는지 본다.
 * 다른 책 보호: 레인은 다음 시도 시각이 이른 책부터 잡는다(로컬 DB에 P6e 시험 임시본이 있다). 레인을 돌리기 전에
 *   lane-seed.ts hold <reportId>   — 이 책 말고 레인이 잡을 수 있는 책에 임대(lane_until)를 걸어 둔다(원래 값은 docs/v5/final/lane-hold.json)
 *   lane-seed.ts release           — 걸어 둔 임대만 원래 값(비어 있음)으로 되돌린다. 책 내용(snapshot)은 어느 쪽도 건드리지 않는다.
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { devMockStream } from "../../src/lib/ops/generation/devMock";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { ReportInputPayload } from "../../src/lib/report-generation/reportInputTypes";

const sql = (q: string) => execFileSync("docker", ["exec", "-i", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-v", "ON_ERROR_STOP=1"], { input: q, encoding: "utf8" }).trim();

const HOLD = new URL("../../docs/v5/final/lane-hold.json", import.meta.url).pathname;
const LANE_ELIGIBLE = `x.phase in ('interim','official','gave_up') and (x.phase='interim' or x.regenerate_requested_at is not null) and (x.lane_until is null or x.lane_until<now())`;

async function main() {
  if (process.argv[2] === "hold") {
    const keep = process.argv[3]; if (!/^report_[a-z0-9]+$/.test(keep ?? "")) { console.error("사용: lane-seed.ts hold <reportId>"); process.exit(2); }
    if (existsSync(HOLD)) { console.error("이미 걸어 둔 임대가 있다(release 먼저)"); process.exit(3); }
    const rows = sql(`select coalesce(json_agg(json_build_object('reportId',x.report_id,'laneToken',x.lane_token,'laneUntil',x.lane_until)),'[]') from public.book_generation_state x where x.report_id<>'${keep}' and ${LANE_ELIGIBLE};`);
    const list = JSON.parse(rows) as { reportId: string; laneToken: string | null; laneUntil: string | null }[];
    writeFileSync(HOLD, JSON.stringify({ at: new Date().toISOString(), keep, held: list }, null, 1) + "\n");
    if (list.length) sql(`update public.book_generation_state set lane_token='00000000-0000-4000-8000-00000000f1a1',lane_until=now()+interval '2 hours' where report_id in (${list.map(r => `'${r.reportId}'`).join(",")});`);
    console.log(`임대 걸음 ${list.length}권: ${list.map(r => r.reportId).join(", ") || "없음"} (원래 값 ${HOLD})`);
    return;
  }
  if (process.argv[2] === "release") {
    if (!existsSync(HOLD)) { console.log("걸어 둔 임대 없음"); return; }
    const h = JSON.parse(readFileSync(HOLD, "utf8")) as { held: { reportId: string; laneToken: string | null; laneUntil: string | null }[] };
    for (const r of h.held) sql(`update public.book_generation_state set lane_token=${r.laneToken ? `'${r.laneToken}'` : "null"},lane_until=${r.laneUntil ? `'${r.laneUntil}'` : "null"} where report_id='${r.reportId}' and lane_token='00000000-0000-4000-8000-00000000f1a1';`);
    renameSync(HOLD, HOLD.replace(/\.json$/, "-released.json"));
    console.log(`임대 되돌림 ${h.held.length}권`);
    return;
  }
  const reportId = process.argv[2];
  if (!/^report_[a-z0-9]+$/.test(reportId ?? "")) { console.error("사용: lane-seed.ts <reportId>"); process.exit(2); }
  const row = JSON.parse(sql(`select json_build_object('order', s.order_id, 'status', s.status, 'paid', o.status, 'job', j.status, 'payload', i.payload_json->'reportInputPayload', 'created', coalesce(i.payload_json->'bookGeneration'->>'evaluatedAt', j.created_at::text)) from public.paid_report_snapshots s join public.payment_orders o on o.payment_order_id=s.order_id join public.report_generation_jobs j on j.report_id=s.report_id left join public.report_input_snapshots i on i.order_id=o.payment_order_id where s.report_id='${reportId}'`) || "null");
  if (!row || row.paid !== "paid" || !row.payload) { console.error(`결제 완료 주문이 아니다: ${JSON.stringify(row)?.slice(0, 200)}`); process.exit(3); }
  if (row.status === "COMPLETED") { console.error("이미 발행된 Book이다(자리표시를 덮지 않는다)"); process.exit(3); }
  const payload = row.payload as ReportInputPayload, policyAt = new Date(row.created).toISOString();
  const sink = { async save() { return true; }, async load() { return []; } };
  const built = await buildV5Snapshot({ payload, reportId, policyAt, sink, deps: { provider: "anthropic", model: "mock-interim", fallback: null, stream: devMockStream("ok", payload, policyAt), people: async () => [] } });
  if (built.meta.chapters.some(c => c.source === "deterministic")) { console.error("자리표시 Book에 빈 장이 있다"); process.exit(4); }
  const snap = JSON.stringify(built.snapshot).replace(/\$snap\$/g, "");
  const out = sql(`begin;
update public.paid_report_snapshots set status='COMPLETED', snapshot_json=$snap$${snap}$snap$::jsonb, gate_version='paid-report-v1', published_at=now()-interval '30 minutes', expires_at=now()-interval '30 minutes'+interval '2160 hours' where report_id='${reportId}';
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
