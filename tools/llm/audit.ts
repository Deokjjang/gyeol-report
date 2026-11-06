/**
 * 비용 대조(최종판2 0): 로컬 DB의 생성 기록(book_generation_runs, 비용이 난 Anthropic·OpenAI 시도)과 원장(.cache/llm-ledger.json)을 맞춰 본다.
 *   pnpm book:budget --audit
 * - DB에 비용이 있는데 원장에 그 책(report id)의 호출이 없거나 합이 다르면 "원장 밖 호출"로 출력한다(시각·주문·레인·비용).
 * - 원장에만 있는 호출(시험 1장·고침 도구 등 DB 기록이 없는 도구)은 따로 출력한다.
 * 읽기만 한다(로컬 Supabase 주소일 때만). 운영 DB에는 접속하지 않는다.
 */
import { createClient } from "@supabase/supabase-js";
import type { Ledger } from "./budget";
import { loadDevEnv } from "./env";

type Run = { id: number; report_id: string; lane: string; provider: string | null; model: string | null; outcome: string; cost_usd: number; created_at: string };
const kst = (iso: string) => new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");

export async function audit(l: Ledger, since = process.env.AUDIT_SINCE ?? l.scopes.final?.createdAt ?? "2026-11-04T00:00:00Z") {
  loadDevEnv();
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !/127\.0\.0\.1|localhost/.test(url)) { console.log("대조 안 함: 로컬 Supabase 주소가 아니다(운영 DB는 읽지 않는다)."); return; }
  const db = createClient(url, key, { auth: { persistSession: false } });
  const r = await db.from("book_generation_runs").select("id,report_id,lane,provider,model,outcome,cost_usd,created_at").gt("cost_usd", 0).gte("created_at", since).order("id");
  if (r.error) { console.log(`대조 실패: ${r.error.message}`); return; }
  const runs = (r.data ?? []) as Run[];
  const callsOf = (reportId: string) => l.calls.filter(c => c.stage.includes(reportId) || c.run.includes(reportId));
  const used = new Set<number>();
  console.log(`\n대조 기준 시각(KST): ${kst(since)} 이후 · DB 비용 시도 ${runs.length}건`);
  console.log("| DB id | 시각(KST) | 책 | 레인 | DB 비용 | 원장 합 | 판정 |\n|---|---|---|---|---|---|---|");
  let outside = 0;
  for (const run of runs) {
    const mine = callsOf(run.report_id).filter(c => !c.pending);
    // 같은 책의 여러 시도(작가·고침)는 DB 줄마다 비용이 따로라, 원장 합과 DB 합을 책 단위로 맞춘다.
    const dbSum = runs.filter(x => x.report_id === run.report_id).reduce((a, x) => a + Number(x.cost_usd), 0);
    const ledgerSum = mine.reduce((a, c) => a + c.costUsd, 0);
    l.calls.forEach((c, i) => { if (mine.includes(c)) used.add(i); });
    const ok = Math.abs(dbSum - ledgerSum) < 0.0005;
    if (!ok) outside++;
    console.log(`| ${run.id} | ${kst(run.created_at)} | ${run.report_id} | ${run.lane} | $${Number(run.cost_usd).toFixed(4)} | $${ledgerSum.toFixed(4)}(책 합 DB $${dbSum.toFixed(4)}) | ${ok ? "일치" : "**원장 밖 호출**"} |`);
  }
  const only = l.calls.filter((c, i) => !used.has(i) && Date.parse(c.at) >= Date.parse(since));
  console.log(`\n원장에만 있는 호출(DB 기록이 없는 도구): ${only.length}건 · $${only.reduce((a, c) => a + c.costUsd, 0).toFixed(4)}`);
  for (const c of only) console.log(`- ${kst(c.at)} ${c.stage} ${c.kind} $${c.costUsd.toFixed(4)}${c.pending ? " (끝나지 않음 — 최악 비용)" : ""}`);
  console.log(`\n원장 밖 호출: ${outside}건`);
}
