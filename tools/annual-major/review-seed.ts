/**
 * AM 검토 묶음: 7부에서 만든 책(~/Desktop/gyeol-review/annual-major/<case>/snapshot.json)을 로컬 DB에 결제 Book으로 심는다(로컬 전용, 호출 0).
 *   pnpm exec tsx tools/annual-major/review-seed.ts [case ...]
 * 주문은 운영과 같은 RPC(paid_report_reliability create_order → confirm_claim → confirm_finish)로 만들고, 로컬 테스트 계정 서재에 묶는다.
 * 원고는 다시 만들지 않는다: 그 주문의 Book 자리에 7부 snapshot을 그대로 넣는다(reportId만 그 주문 것으로). 결제 작업은 COMPLETED로 닫아 워커가 잡지 않게 한다.
 * 결과: <case> → reportId 표를 ~/Desktop/gyeol-review/annual-major/review-state.json에 쓴다(다시 돌리면 그 권은 건너뛴다).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { localSupabase, psql } from "../../scripts/dev/local";
import { DEV_EMAIL } from "../../scripts/dev/v5-db";

const OUT = join(homedir(), "Desktop", "gyeol-review", "annual-major"); // final.ts OUT과 같은 곳(작가 모듈을 싣지 않으려고 따로 적음)

const PRICE: Record<string, number> = { annual_fortune: 3900, major_fortune: 5900 };
const STATE = join(OUT, "review-state.json");

/**
 * --wait <case>: 생성 대기 화면 캡처용 주문 하나(같은 입력, 결제 끝, GENERATING). 장 저장 행 4개(10장 중)와 1장 「먼저 읽기」 미리보기를 그 책의 7부 원고로 심고,
 * 남은 시간 계산(같은 상품 최근 30일 발행 소요 시간 중앙값, 표본 3개 이상)을 위해 이미 심은 7부 책들의 실측 소요 시간을 book_generation_runs에 적는다(로컬 전용).
 */
function seedWaiting(c: string, state: Record<string, { reportId: string; orderId: string; productType: string }>) {
  const snap = JSON.parse(readFileSync(join(OUT, c, "snapshot.json"), "utf8")) as { productType: string; draft: { chapters: { n: number; title: string; sections: { heading: string; paragraphs: string[] }[] }[] }; evidencePacket: { input: unknown } };
  const devId = psql(`select id from auth.users where email='${DEV_EMAIL}'`);
  const id = `am_wait_${c.replace(/[^a-z0-9]/g, "")}_${Date.now().toString(36)}`, amount = PRICE[snap.productType] ?? 1490;
  const input = JSON.stringify({ reportInputPayload: snap.evidencePacket.input, bookGeneration: { version: "v5", evaluatedAt: new Date().toISOString() } });
  const q = (tag: string, body: string) => { if (body.includes(`$${tag}$`)) throw new Error("구분자 포함"); return `$${tag}$${body}$${tag}$`; };
  psql(`select public.paid_report_reliability('create_order', jsonb_build_object('paymentOrderId','${id}','providerOrderId','${id}','productType','${snap.productType}','provider','toss','amount',${amount},'inputSnapshot',${q("in", input)}::jsonb))`, { quiet: true });
  psql(`with c as (select public.paid_report_reliability('confirm_claim', '{"orderId":"${id}","paymentKey":"k-${id}","amount":${amount}}'::jsonb) r) select public.paid_report_reliability('confirm_finish', jsonb_build_object('orderId','${id}','paymentKey','k-${id}','token',(select r->>'token' from c)))`, { quiet: true });
  const reportId = psql(`select report_id from public.payment_orders where payment_order_id='${id}'`);
  if (!/^report_[a-z0-9]+$/.test(reportId)) throw new Error("대기 주문 생성 실패");
  const total = snap.draft.chapters.length;
  const rows = snap.draft.chapters.slice(0, 4).map(ch => {
    const body: Record<string, unknown> = { n: ch.n, title: ch.title, sections: ch.sections, _total: total };
    if (ch.n === 1) body._preview = { n: ch.n, title: ch.title, sections: ch.sections, hidden: 0 };
    return `('${reportId}',${ch.n},'writer',${q("ch", JSON.stringify(body))}::jsonb)`;
  });
  psql(`select public.ops_generation('begin', jsonb_build_object('reportId','${reportId}','origin','paid','originRef','${id}'));
    update public.paid_report_snapshots set status='GENERATING' where report_id='${reportId}';
    update public.report_generation_jobs set next_retry_at=now()+interval '6 hours' where report_id='${reportId}';
    insert into public.ops_writer_chapters(report_id,chapter_n,source,chapter) values ${rows.join(",")};
    insert into public.report_purchase_bindings(order_id,buyer_id,display_name) values('${id}','${devId}','AM 검토') on conflict do nothing;
    insert into public.report_account_links(report_id,user_id,link_source,report_version) values('${reportId}','${devId}','purchase','v5') on conflict(report_id) do nothing;`, { quiet: true });
  // 남은 시간 표본: 심어 둔 7부 책(같은 상품)의 실측 소요 시간(check.md 「소요 N초」).
  for (const [k, v] of Object.entries(state)) {
    if (v.productType !== snap.productType || k.startsWith("wait")) continue;
    const sec = Number(readFileSync(join(OUT, k, "check.md"), "utf8").match(/소요 (\d+)초/)?.[1] ?? 0);
    if (sec > 0) psql(`insert into public.book_generation_runs(report_id,lane,provider,model,edition,outcome,cost_usd,calls,chapters,duration_ms) select '${v.reportId}','queue','anthropic','claude-sonnet-5-5','official','published',0,'[]'::jsonb,'[]'::jsonb,${sec * 1000} where not exists (select 1 from public.book_generation_runs where report_id='${v.reportId}' and outcome='published')`, { quiet: true });
  }
  state[`wait-${c}`] = { reportId, orderId: id, productType: snap.productType };
  writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
  console.log(`wait-${c}: ${reportId} GENERATING · 저장 장 4/${total}`);
}

function main() {
  localSupabase(); // 로컬 가드(주소가 localhost가 아니면 중단)
  const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) as Record<string, { reportId: string; orderId: string; productType: string }> : {};
  if (process.argv[2] === "--wait") { seedWaiting(process.argv[3] ?? "annual-1", state); return; }
  const want = process.argv.slice(2);
  const cases = readdirSync(OUT).filter(d => existsSync(join(OUT, d, "snapshot.json")) && (!want.length || want.includes(d))).sort();
  const devId = psql(`select id from auth.users where email='${DEV_EMAIL}'`);
  if (!/^[0-9a-f-]{36}$/.test(devId)) throw new Error("로컬 테스트 계정 없음(dev-local.ts 먼저)");
  for (const c of cases) {
    if (state[c]) { console.log(`${c}: 이미 심음 ${state[c].reportId}`); continue; }
    const snap = JSON.parse(readFileSync(join(OUT, c, "snapshot.json"), "utf8")) as { reportId: string; productType: string; evidencePacket: { input: unknown } };
    const id = `am_review_${c.replace(/[^a-z0-9]/g, "")}_${Date.now().toString(36)}`, amount = PRICE[snap.productType] ?? 1490;
    const input = JSON.stringify({ reportInputPayload: snap.evidencePacket.input, bookGeneration: { version: "v5", evaluatedAt: new Date().toISOString() } });
    psql(`select public.paid_report_reliability('create_order', jsonb_build_object('paymentOrderId','${id}','providerOrderId','${id}','productType','${snap.productType}','provider','toss','amount',${amount},'inputSnapshot',$in$${input}$in$::jsonb))`, { quiet: true });
    psql(`with c as (select public.paid_report_reliability('confirm_claim', '{"orderId":"${id}","paymentKey":"k-${id}","amount":${amount}}'::jsonb) r) select public.paid_report_reliability('confirm_finish', jsonb_build_object('orderId','${id}','paymentKey','k-${id}','token',(select r->>'token' from c)))`, { quiet: true });
    const reportId = psql(`select report_id from public.payment_orders where payment_order_id='${id}'`);
    if (!/^report_[a-z0-9]+$/.test(reportId)) throw new Error(`${c}: 주문 생성 실패`);
    const body = JSON.stringify({ ...snap, reportId });
    if (body.includes("$snap$")) throw new Error("원고에 구분자 포함");
    psql(`update public.paid_report_snapshots set status='COMPLETED', snapshot_json=$snap$${body}$snap$::jsonb, gate_version='paid-report-v1', published_at=now() where report_id='${reportId}';
      update public.report_generation_jobs set status='COMPLETED' where report_id='${reportId}';
      insert into public.report_purchase_bindings(order_id,buyer_id,display_name) values('${id}','${devId}','AM 검토') on conflict do nothing;
      insert into public.report_account_links(report_id,user_id,link_source,report_version) values('${reportId}','${devId}','purchase','v5') on conflict(report_id) do nothing;`, { quiet: true });
    const ok = psql(`select status from public.paid_report_snapshots where report_id='${reportId}'`);
    state[c] = { reportId, orderId: id, productType: snap.productType };
    writeFileSync(STATE, JSON.stringify(state, null, 1) + "\n");
    console.log(`${c}: ${reportId} ${ok}`);
  }
}
main();
