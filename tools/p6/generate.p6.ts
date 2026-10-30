/**
 * P6 실호출 원고(작가 단일 호출·스트리밍) → 안전망 → 로컬 DB Book. 운영 경로와 같은 함수를 쓴다:
 *   enqueue(RPC) → claim(v5) → runV5TicketJob(브리프·작가·장 저장·안전망·표·발행) → /reports/<reportId>.
 * 실행(로컬 Supabase가 떠 있어야 함, publish 경로가 server-only를 import해서 vitest로 돈다):
 *   P6_MODEL=A pnpm exec vitest run --config tools/p6/vitest.p6.config.ts      (A=Sonnet, B=gpt-6.1-terra)
 *   P6_ONLY=c1-full,x-major 로 사례를 고른다. 결과는 docs/v5/trial/p6/<model>/<case>.{final.md,metrics.json}, 호출은 api-cost-log.md에 한 줄씩.
 * 상한: 공급자별 누적(api-cost-log 표의 그 공급자 P6 줄 합)이 capUsd에 닿을 것 같으면(다음 책 최대 비용 추정) 멈춘다.
 */
import { randomUUID, createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { buildBrief } from "@/lib/brief";
import { CHECKOUT_POLICY_VERSIONS } from "@/lib/legal/policyVersions";
import { purchaseMetadata } from "@/lib/library/model";
import { priceFor } from "@/lib/llm/prices";
import { createCheckoutConsentEvidence } from "@/lib/payment/checkoutConsent";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import type { TicketPublicationStore } from "@/lib/tickets/publication";
import { payloadToBriefInput, type V5BookDraft, type V5Evidence } from "@/lib/writer/book";
import { renderChapter } from "@/lib/writer/format";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { kstDate, writerKnowledge } from "@/lib/writer/publish";
import { maxTokensFor } from "@/lib/writer/runner";
import { runV5TicketJob } from "@/lib/writer/ticketJob";
import { localSupabase } from "../../scripts/dev/local";
import { prepareLocalDb } from "../../scripts/dev/v5-db";
import { P6_CASES, P6_MODELS } from "./cases";
import { bookMetrics } from "./metrics";

const ROOT = resolve(import.meta.dirname, "../..");
const COST_LOG = join(ROOT, "docs/v5/api-cost-log.md");
const which = (process.env.P6_MODEL ?? "A") as keyof typeof P6_MODELS;
/** P6_DRY=1: 작가 호출 없이(스트림이 바로 실패 → 결정론 작가) 접수·발행·지표 배관만 확인. 비용 0. */
const DRY = process.env.P6_DRY === "1";
const M = P6_MODELS[which];
const only = process.env.P6_ONLY ? new Set(process.env.P6_ONLY.split(",")) : null;

/** env 파일에서 키 하나만 읽는다(메모리에만 둔다). */
function readKey(file: string, name: string): string {
  const line = readFileSync(file, "utf8").split("\n").find(l => l.startsWith(`${name}=`));
  return (line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "")) ?? "";
}
const kst = () => new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");
/** 이 공급자의 P6 누적 비용(로그 표의 비용 칸 합). */
function spentSoFar(provider: string): number {
  return readFileSync(COST_LOG, "utf8").split("\n").filter(l => l.startsWith("| ") && l.includes("| P6 ") && l.includes(`| ${provider}/`))
    .reduce((a, l) => a + Number(l.split("|")[7]?.trim() || 0), 0);
}
function appendCostRows(rows: string[]): void {
  let text = readFileSync(COST_LOG, "utf8");
  const tableEnd = text.indexOf("\n\n누적 합계");
  const prev = Number(text.match(/누적 합계: \*\*\$([\d.]+)\*\*/)?.[1] ?? 0);
  let cum = prev;
  const out = rows.map(r => { cum += Number(r.split("|")[7]); return `${r} ${cum.toFixed(8)} |`; });
  text = text.slice(0, tableEnd) + "\n" + out.join("\n") + text.slice(tableEnd);
  text = text.replace(/누적 합계: \*\*\$[\d.]+\*\*/, `누적 합계: **$${cum.toFixed(8)}**`);
  writeFileSync(COST_LOG, text);
}

test(`P6 실호출 원고 ${which} ${M.model}`, async () => {
  const apiKey = DRY ? "dry" : readKey(M.keyFile, M.keyName);
  if (!apiKey) throw new Error(`${M.keyName} 없음(${M.keyFile})`);
  const s = localSupabase();
  const seed = await prepareLocalDb();
  const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const store: TicketPublicationStore = { async call(action, user, data = {}) {
    const r = await db.rpc("report_ticket_publication", { p_action: action, p_user: user, p_data: data });
    return !r.error && r.data && typeof r.data.ok === "boolean" ? r.data : { ok: false, code: r.error?.message ?? "STORAGE_UNAVAILABLE" };
  } };
  const consent = { policyVersions: CHECKOUT_POLICY_VERSIONS, assertions: { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true } };
  const price = priceFor(M.provider, M.model)!;
  const dir = join(ROOT, "docs/v5/trial/p6", DRY ? "dry" : which); mkdirSync(dir, { recursive: true });
  const { k } = writerKnowledge();

  for (const c of P6_CASES.filter(x => !only || only.has(x.id))) {
    if (existsSync(join(dir, `${c.id}.metrics.json`)) && !only) { console.log(c.id, "이미 있음, 건너뜀"); continue; }
    const now = new Date();
    const n = normalizeReportInputPayload(c.payload, { now: () => now });
    if (!n.ok) throw new Error(`${c.id} 입력 오류 ${n.error}`);
    const input = n.value as { productKey: string; person?: { birthDate: string }; personA?: { birthDate: string } };
    // 다음 책의 최대 비용(출력 상한 전부 + 입력 추정 + 이어쓰기 1회 여유)을 더해도 상한 안일 때만 부른다.
    const prompt = buildWriterPrompt(buildBrief(payloadToBriefInput(input as never, kstDate(now.toISOString())) as never, k));
    const inTok = Math.ceil((prompt.system.length + prompt.user.length) / 1.3);
    const worst = (maxTokensFor(prompt.chapters, M.model) * price.output + inTok * 2 * price.input) / 1e6;
    const spent = spentSoFar(M.provider);
    if (spent + worst > M.capUsd) { console.log(`중단: ${M.provider} 누적 $${spent.toFixed(4)} + 다음 책 최대 $${worst.toFixed(4)} > 상한 $${M.capUsd}`); break; }

    const evidence = createCheckoutConsentEvidence(consent, (input.person ?? input.personA)!.birthDate, now);
    const requestId = randomUUID(), reportId = `report_${randomUUID().replaceAll("-", "")}`;
    const enq = await store.call("enqueue", seed.userId, { requestId, input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"), reportId, policyAt: now.toISOString(), consentEvidence: evidence, ...purchaseMetadata(input) });
    if (!enq.ok) throw new Error(`${c.id} 접수 실패 ${enq.code}`);
    const job = await store.call("claim", null, { v5Products: [input.productKey] });
    if (!job.ok || job.reportId !== reportId) throw new Error(`${c.id} claim이 다른 작업을 가져옴(${job.reportId ?? job.code})`);
    const t0 = Date.now();
    const dry = DRY ? { stream: async () => ({ text: "", finishReason: "error" as const, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "dry", message: "dry" } }) } : {};
    const result = await runV5TicketJob(store, job, { provider: M.provider, model: M.model, apiKey, ...dry });
    const ms = Date.now() - t0;
    const snap = (await db.from("paid_report_snapshots").select("status,snapshot_json").eq("report_id", reportId).single()).data as { status: string; snapshot_json: { draft: V5BookDraft; evidencePacket: V5Evidence } } | null;
    const meta = snap?.snapshot_json.evidencePacket.meta;
    const rows = (meta?.calls ?? []).filter(x => x.requestId || x.usage.outputTokens).map(x =>
      `| ${kst()} | P6 ${c.label} (${which}) | ${M.provider}/${M.model} | ${x.usage.inputTokens} | ${x.usage.cachedInputTokens} | ${x.usage.outputTokens} | ${(x.costUsd ?? 0).toFixed(8)} | ${x.finish}${x.error ? ` (${x.error})` : ""} | ${x.requestId ?? "-"} |`);
    if (rows.length) appendCostRows(rows);
    if (!snap) { writeFileSync(join(dir, `${c.id}.metrics.json`), JSON.stringify({ case: c.id, reportId, error: result.code ?? "NO_SNAPSHOT", calls: meta?.calls }, null, 1) + "\n"); console.log(c.id, "발행 실패", result.code); continue; }
    const draft = snap.snapshot_json.draft;
    writeFileSync(join(dir, `${c.id}.final.md`), draft.chapters.map(ch => renderChapter({ n: ch.n, title: ch.title, sections: ch.sections })).join("\n\n") + "\n");
    const m = { case: c.id, label: c.label, which, provider: M.provider, model: M.model, reportId, status: snap.status, wallMs: ms, ...bookMetrics(draft, snap.snapshot_json.evidencePacket) };
    writeFileSync(join(dir, `${c.id}.metrics.json`), JSON.stringify(m, null, 1) + "\n");
    console.log(JSON.stringify({ case: c.id, reportId, chars: m.chars, det: m.deterministicChapters, del: m.deletions, cost: m.costUsd, sec: Math.round(ms / 1000), calls: m.calls.map(x => x.finish).join("→") }));
  }
}, 0);
