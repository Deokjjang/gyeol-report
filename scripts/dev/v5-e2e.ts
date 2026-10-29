/**
 * P3 H 종단 시험(로컬 서버 + 로컬 Supabase + 실호출 OpenAI). pnpm dev:v5 로 서버를 띄운 뒤:
 *   pnpm exec tsx scripts/dev/v5-e2e.ts [--base http://localhost:3100] [--budget 1] [--only saju_mbti_full]
 * 이용권 경로: 공개 API(/auth/ticket-redeem)는 운영 도메인 출처만 받으므로(로컬 예외 없음, 보안 설계) 같은 서버 함수와 같은 RPC('enqueue')로
 * 로컬 DB에 접수하고, 로컬 서버의 워커 라우트(/api/internal/report-ticket-jobs, CRON_SECRET)가 v5 작가로 책을 만든다.
 * 그 뒤 로컬 Supabase 계정 쿠키로 /reports/<id> 페이지를 열어 확인한다. 비용은 docs/v5/api-cost-log.md에 호출마다 한 줄.
 */
import { createHash, randomUUID } from "node:crypto";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { CHECKOUT_POLICY_VERSIONS } from "../../src/lib/legal/policyVersions";
import { purchaseMetadata } from "../../src/lib/library/model";
import { createCheckoutConsentEvidence } from "../../src/lib/payment/checkoutConsent";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { assertEnvFileLocal, assertLocal, localSupabase, readEnvFile, ROOT } from "./local";
import { DEV_EMAIL, DEV_PASSWORD, prepareLocalDb } from "./v5-db";

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg("--base", "http://localhost:3100"), BUDGET = Number(arg("--budget", "1")), ONLY = arg("--only", "");
assertLocal(BASE, "서버"); assertEnvFileLocal();
const env = readEnvFile();
// --no-key: 키 없이 배관만 확인(작가 호출 0 → 결정론 작가). 실호출 시험은 키가 있어야 한다.
const NO_KEY = process.argv.includes("--no-key");
if (!env.OPENAI_API_KEY && !NO_KEY) { console.error("중단: .env.development.local에 OPENAI_API_KEY가 없습니다(배관만 볼 때는 --no-key)."); process.exit(2); }

const ev = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const P = (k: string) => { const p = ev.persons[k]; return { name: p.name, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: p.approximateBirthTimeSlot, gender: p.gender, mbtiType: p.mbtiType }; };
const C = (k: string) => { const c = ev.contexts[k]; return { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob, focusAreas: [] }; };
const single = (productKey: string, productSlug: string, person: string, ctx: string, options: Record<string, string> = {}) => ({ productKey, productSlug, person: P(person), userContext: C(ctx), productOptions: options });
const CASES: [string, unknown][] = [
  ["종합 · c1 하람(정시·ENTJ)", single("saju_mbti_full", "saju-mbti-full", "haram", "c1")],
  ["커리어 · c1 하람", single("career_money_study", "career-money-study", "haram", "c1")],
  ["연애 · c2 서윤(시간 미상·INFP·연애 중)", single("love_marriage_child", "love-marriage-child", "seoyun", "c2")],
  ["대운 · 지우(ISFJ)", single("major_fortune", "major-fortune", "jiwoo", "c1")],
  ["세운 2026 · 도윤(ESTP)", single("annual_fortune", "annual-fortune", "doyun", "c1", { selectedYear: "2026" })],
  ["궁합 연인 · 하람×지우", { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "love", personA: P("haram"), personB: P("jiwoo") }],
  ["궁합 동료 · 도윤×서윤(B 시간 미상)", { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: "coworker", personA: P("doyun"), personB: P("seoyun") }],
];

async function cookieHeader(s: ReturnType<typeof localSupabase>): Promise<string> {
  const jar = new Map<string, string>();
  const auth = createServerClient(s.API_URL, s.ANON_KEY, { cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: cs => { for (const c of cs) jar.set(c.name, c.value); } } });
  const { error } = await auth.auth.signInWithPassword({ email: DEV_EMAIL, password: DEV_PASSWORD });
  if (error) throw new Error(`로그인 실패: ${error.message}`);
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

const kst = () => new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");
function costLogTotal(): number { const m = readFileSync(join(ROOT, "docs/v5/api-cost-log.md"), "utf8").match(/누적 합계: \*\*\$([\d.]+)\*\*/); return m ? Number(m[1]) : 0; }

async function main() {
  const s = localSupabase();
  const seed = await prepareLocalDb();
  const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const cookie = await cookieHeader(s);
  const consent = { policyVersions: CHECKOUT_POLICY_VERSIONS, assertions: { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true } };
  let spent = 0, cumulative = costLogTotal();
  const rows: string[] = ["| 사례 | reportId | 최종 상태 | 페이지 | 장별 source | 호출(종료) | 입력/출력 토큰 | 비용(USD) | 소요(초) | 출력 글자/토큰 |", "|---|---|---|---|---|---|---|---|---|---|"];
  const logRows: string[] = [];
  for (const [label, raw] of CASES) {
    if (ONLY && !JSON.stringify(raw).includes(ONLY)) continue;
    if (spent >= BUDGET * 0.9) { rows.push(`| ${label} | - | 건너뜀(예산) | | | | | | | |`); continue; }
    const now = new Date();
    const n = normalizeReportInputPayload(raw, { now: () => now });
    if (!n.ok) { rows.push(`| ${label} | - | 입력 오류 ${n.error} | | | | | | | |`); continue; }
    const input = n.value as { productKey: string; person?: { birthDate: string }; personA?: { birthDate: string } };
    const evidence = createCheckoutConsentEvidence(consent, (input.person ?? input.personA)!.birthDate, now);
    const requestId = randomUUID(), reportId = `report_${randomUUID().replaceAll("-", "")}`;
    const t0 = Date.now();
    const enq = await db.rpc("report_ticket_publication", { p_action: "enqueue", p_user: seed.userId, p_data: { requestId, input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"), reportId, policyAt: now.toISOString(), consentEvidence: evidence, ...purchaseMetadata(input) } });
    if (enq.error || !enq.data?.ok) { rows.push(`| ${label} | - | 접수 실패 ${enq.error?.message ?? enq.data?.code} | | | | | | | |`); continue; }
    let state = "QUEUED";
    for (let i = 0; i < 20 && state !== "COMPLETED" && state !== "REVERSED"; i++) {
      await fetch(`${BASE}/api/internal/report-ticket-jobs`, { headers: { authorization: `Bearer ${env.CRON_SECRET}` }, signal: AbortSignal.timeout(900_000) }).catch(() => undefined);
      const st = await db.rpc("report_ticket_publication", { p_action: "status", p_user: seed.userId, p_data: { requestId } });
      state = String(st.data?.state ?? "?");
    }
    const ms = Date.now() - t0;
    const snap = (await db.from("paid_report_snapshots").select("status,snapshot_json").eq("report_id", reportId).single()).data as { status: string; snapshot_json: { productVersion: string; draft: { chapters: { title: string }[] }; evidencePacket: { meta: { calls: { finish: string; error?: string; usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number }; costUsd: number | null; requestId: string | null; chars: number }[]; chapters: { source: string }[]; costUsd: number; tokens: { input: number; output: number } } } } } | null;
    const meta = snap?.snapshot_json?.evidencePacket?.meta;
    const page = await fetch(`${BASE}/reports/${reportId}`, { headers: { cookie } });
    const html = await page.text();
    const firstTitle = snap?.snapshot_json?.draft?.chapters?.[0]?.title ?? "@@";
    const opens = page.ok && html.includes(firstTitle) && !html.includes("저장된 책 정보를 확인할 수 없습니다");
    const sources = Object.entries((meta?.chapters ?? []).reduce<Record<string, number>>((m, c) => ((m[c.source] = (m[c.source] ?? 0) + 1), m), {})).map(([k, v]) => `${k} ${v}`).join(" · ");
    const outChars = (meta?.calls ?? []).reduce((a, c) => a + c.chars, 0), outTok = meta?.tokens.output ?? 0;
    spent += meta?.costUsd ?? 0;
    for (const c of meta?.calls ?? []) {
      cumulative += c.costUsd ?? 0;
      logRows.push(`| ${kst()} | P3 H ${label} | openai/${env.LLM_MODEL ?? "gpt-4o-mini"} | ${c.usage.inputTokens} | ${c.usage.cachedInputTokens} | ${c.usage.outputTokens} | ${(c.costUsd ?? 0).toFixed(8)} | ${c.finish}${c.error ? ` (${c.error})` : ""} | ${c.requestId ?? "-"} | ${cumulative.toFixed(8)} |`);
    }
    rows.push(`| ${label} | \`${reportId}\` | ${state}/${snap?.status ?? "-"} (${snap?.snapshot_json?.productVersion ?? "-"}) | ${opens ? `열림(${page.status})` : `실패(${page.status})`} | ${sources} | ${(meta?.calls ?? []).map(c => c.finish).join("→") || "0"} | ${meta?.tokens.input ?? 0}/${outTok} | ${(meta?.costUsd ?? 0).toFixed(5)} | ${Math.round(ms / 1000)} | ${outTok ? (outChars / outTok).toFixed(2) : "-"} |`);
    console.log(rows.at(-1));
  }
  if (logRows.length) {
    const path = join(ROOT, "docs/v5/api-cost-log.md");
    let text = readFileSync(path, "utf8");
    const tableEnd = text.indexOf("\n\n누적 합계");
    text = text.slice(0, tableEnd) + "\n" + logRows.join("\n") + text.slice(tableEnd);
    text = text.replace(/누적 합계: \*\*\$[\d.]+\*\*/, `누적 합계: **$${cumulative.toFixed(8)}**`);
    writeFileSync(path, text);
  }
  const out = join(ROOT, NO_KEY ? "docs/v5/p3-e2e-nokey.md" : "docs/v5/p3-e2e.md");
  writeFileSync(out, `# P3 종단 시험(실호출 OpenAI, 로컬 서버·로컬 Supabase)\n\n실행: \`pnpm exec tsx scripts/dev/v5-e2e.ts\` · ${kst()} KST · 이번 실행 비용 $${spent.toFixed(5)}\n\n${rows.join("\n")}\n`);
  appendFileSync(out, "");
  console.log(`비용 $${spent.toFixed(5)}, 결과 ${out}`);
}
main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
