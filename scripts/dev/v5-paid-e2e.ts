/**
 * P3.5 B 결제 경로 종단 시험(로컬 서버 + 로컬 Supabase, 외부 호출 0). PORT=3200 pnpm dev:v5 로 서버를 띄운 뒤:
 *   pnpm exec tsx scripts/dev/v5-paid-e2e.ts --expect v5 [--base http://localhost:3200]   (WRITER_V5_PRODUCTS 켬)
 *   pnpm exec tsx scripts/dev/v5-paid-e2e.ts --expect legacy                               (플래그 끔: 기존 v4 발행이어야 함)
 * 결제 확정: 실제 테스트 결제는 Toss 결제창(브라우저)이 발급한 paymentKey가 있어야 confirm이 되므로, 확정 직후 단계부터 주입한다
 * (같은 confirm RPC에 가짜 Toss 승인 DONE을 넘김 — 기존 PGlite 결제 시험과 같은 방식). 그 뒤는 실제 워커 라우트·실제 책 페이지.
 */
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createAnnualCommerceAcceptance } from "../../src/lib/payment/annualPurchasePolicy";
import { confirmPaidReport } from "../../src/lib/payment/paidReportReliability";
import { createPaidReportReliabilityStore } from "../../src/lib/payment/paidReportReliabilityStore";
import { assertEnvFileLocal, assertLocal, readEnvFile, ROOT } from "./local";

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("--base", "http://localhost:3200"), EXPECT = arg("--expect", "v5");
assertLocal(BASE, "서버"); assertEnvFileLocal();
const env = readEnvFile();
assertLocal(env.SUPABASE_URL ?? "", "DB");
const store = createPaidReportReliabilityStore({ ...env, NODE_ENV: "development" } as NodeJS.ProcessEnv);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const person = (name: string, birthDate: string, birthTime: string, gender: string, mbtiType: string) => ({ name, birthDate, birthTime, birthTimeUnknown: !birthTime, birthTimePrecision: birthTime ? "exact" : "unknown", approximateBirthTimeSlot: "", gender, mbtiType, calendarType: "solar", timezone: "Asia/Seoul" });
const haram = person("하람", "1996-12-06", "09:30", "MALE", "ENTJ"), seoyun = person("서윤", "1989-03-21", "", "FEMALE", "INFP");
const ctx = { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] };
const CASES: [string, Record<string, unknown>, Record<string, unknown>?][] = [
  ["종합 · 하람", { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: haram, userContext: ctx, productOptions: {} }],
  ["궁합 연인 · 하람×서윤", { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", personA: haram, personB: seoyun, productOptions: {} }],
  ["세운 2026 · 하람", { productKey: "annual_fortune", productSlug: "annual-fortune", person: haram, userContext: ctx, productOptions: { selectedYear: "2026" } }, { annualCommerceAcceptance: createAnnualCommerceAcceptance(2026, new Date()) }],
];

async function main() {
  const rows = ["| 사례 | reportId | 결제 상태 | 발행 상태 | 판(productVersion) | 장별 source | 페이지 | 소요(초) |", "|---|---|---|---|---|---|---|---|"];
  let failed = 0;
  for (const [label, payload, extra] of CASES) {
    const started = Date.now();
    const paymentOrderId = `po_${randomUUID()}`, providerOrderId = `e2e_${randomUUID().slice(0, 12)}`;
    const created = await store.call("create_order", { paymentOrderId, providerOrderId, productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload, bookGeneration: { version: "v4", evaluatedAt: new Date().toISOString() }, ...(extra ?? {}) } }); // 실제 checkout(prepare)이 고정하는 판 바인딩과 같은 모양
    if (!created.ok) throw new Error(`create_order 실패: ${created.code}`);
    // 결제 확정 직후 단계부터 주입: 같은 confirm RPC, Toss 승인 응답만 가짜(DONE).
    const confirmed = await confirmPaidReport({ orderId: providerOrderId, paymentKey: `e2e-${randomUUID()}`, amount: 1290 }, store,
      async input => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: input.orderId, amount: input.amount, status: "DONE", approvedAt: new Date().toISOString() } }));
    const reportId = String(confirmed.reportId ?? "");
    if (!confirmed.ok || !reportId) throw new Error(`confirm 실패: ${confirmed.code}`);
    let read: Awaited<ReturnType<typeof store.call>> = { ok: false };
    for (let i = 0; i < 40; i++) {
      const res = await fetch(`${BASE}/api/internal/report-jobs`, { headers: { authorization: `Bearer ${env.CRON_SECRET}` } });
      if (!res.ok && res.status !== 503) throw new Error(`워커 라우트 ${res.status}`);
      read = await store.call("read_report", { reportId });
      if (read.status === "COMPLETED" || read.status === "FAILED_REQUIRES_ATTENTION") break;
      await sleep(1500);
    }
    const snap = read.snapshot as { productVersion?: string; evidencePacket?: { meta?: { chapters?: { source: string }[] } } } | null;
    const order = await store.call("find_order", { paymentOrderId });
    const page = await fetch(`${BASE}/reports/${reportId}`);
    const html = await page.text();
    const version = snap?.productVersion ?? "-";
    const sources = (snap?.evidencePacket?.meta?.chapters ?? []).reduce<Record<string, number>>((a, c) => ({ ...a, [c.source]: (a[c.source] ?? 0) + 1 }), {});
    const pageOk = page.status === 200 && !/저장된 책 정보를 확인할 수 없습니다|책의 열람 정보를 확인하지 못했습니다/.test(html);
    const ok = read.status === "COMPLETED" && pageOk && (EXPECT === "v5" ? version === "v5" : version === "v4");
    if (!ok) failed++;
    rows.push(`| ${label} | \`${reportId}\` | ${(order.order as { status?: string } | undefined)?.status ?? "-"} | ${read.status} | ${version} | ${Object.entries(sources).map(([k, v]) => `${k} ${v}`).join(" · ") || "-"} | ${page.status}${pageOk ? " 열림" : " 실패"} | ${Math.round((Date.now() - started) / 1000)} |`);
    console.log(rows.at(-1));
  }
  const file = join(ROOT, `docs/v5/p35-paid-e2e-${EXPECT}.md`);
  writeFileSync(file, `# P3.5 B 결제 경로 종단 시험 — ${EXPECT === "v5" ? "WRITER_V5_PRODUCTS 켬" : "플래그 끔(기존 경로)"}\n\n로컬 서버 ${BASE} + 로컬 Supabase. 결제 확정 직후 단계부터 주입(같은 confirm RPC, Toss 승인 응답만 DONE). 외부 호출 0, LLM 키 없음(v5 작가는 결정론).\n\n${rows.join("\n")}\n`);
  console.log(failed ? `실패 ${failed}건` : "전부 통과", file);
  process.exit(failed ? 1 : 0);
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
