/** 최종판2 1-1 확인(호출 0, 읽기만): 결제 경로가 구매자 계정의 같은 고객 이전 책을 읽는지. NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/prior-check.ts */
import { createClient } from "@supabase/supabase-js";
import { loadDevEnv } from "../llm/env";
import { paidPriorBooks } from "../../src/lib/ops/generation/paidPrior";
import { FINAL2_CASES } from "./cases";
async function main() {
  loadDevEnv();
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!/127\.0\.0\.1|localhost/.test(url)) throw new Error("not local");
  const db = createClient(url, key, { auth: { persistSession: false } });
  const order = "payment_order_5b0c2d2d-4e07-4cc0-b191-daf80466e9c1";
  for (const c of FINAL2_CASES) { const p = await paidPriorBooks(db, order, "report_new", c.payload); console.log(c.id, "이전 책", p.books, (p.products ?? []).join(","), "이미지", (p.images ?? []).slice(0, 4).join(" | ")); }
}
main().catch(e => { console.error(String(e).slice(0, 300)); process.exit(1); });
