/**
 * P6d 실호출 원고 4권(책 한 권 = 작가 호출 1회 + 필요할 때 짧은 장 재요청 1회·수리 1회): 운영 경로와 같은 함수(enqueue → claim → runV5TicketJob)로 로컬 DB Book을 만든다.
 * 실행(로컬 Supabase가 떠 있어야 함):
 *   pnpm exec vitest run --config tools/p6d/vitest.p6d.config.ts                         (Sonnet 5.5, 대체 없음)
 *   P6D_ONLY=c1-full,me-full …   P6D_SKIP=pair-love …   P6D_ROUND=r1 …(회차 폴더)
 *   P6D_DRY=1 P6D_ONLY=c1-full …                                                          (작가 호출 없이 안전망만으로 만든 책 = I 샘플, 비용 0)
 * 결과: docs/v5/trial/p6d/<round>/<case>.{final.md,metrics.json}. 호출은 api-cost-log.md에 한 줄씩(단계 "P6d").
 * 상한(이번 단계): Anthropic $1.3, OpenAI $0 — 공급자별 "P6d" 줄 합 + 다음 책 최대 비용이 넘으면 멈춘다.
 * 같은 시험 계정으로 차례로 발행하므로 같은 사람의 앞 책을 이전 Book으로 읽는다(장면·문장·뜻 푼 특성, A3 실경로).
 */
import { randomUUID, createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
import { P6_MODELS } from "../p6/cases";
import { bookMetrics } from "../p6/metrics";
import { P6D_CASES } from "./cases";
import { p6bBookMetrics } from "../p6b/metrics";

const ROOT = resolve(import.meta.dirname, "../..");
const COST_LOG = join(ROOT, "docs/v5/api-cost-log.md");
const DRY = process.env.P6D_DRY === "1";
const only = process.env.P6D_ONLY ? new Set(process.env.P6D_ONLY.split(",")) : null;
const skip = new Set((process.env.P6D_SKIP ?? "").split(",").filter(Boolean));
const CAP: Record<string, number> = { anthropic: 1.3, openai: 0 };
const A = P6_MODELS.A;

function readKey(file: string, name: string): string {
  const line = readFileSync(file, "utf8").split("\n").find(l => l.startsWith(`${name}=`));
  return (line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "")) ?? "";
}
const kst = () => new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");
function spentSoFar(provider: string): number {
  return readFileSync(COST_LOG, "utf8").split("\n").filter(l => l.startsWith("| ") && l.includes("| P6d ") && l.includes(`| ${provider}/`))
    .reduce((a, l) => a + Number(l.split("|")[7]?.trim() || 0), 0);
}
function appendCostRows(rows: string[]): void {
  let text = readFileSync(COST_LOG, "utf8");
  const tableEnd = text.indexOf("\n\n누적 합계");
  let cum = Number(text.match(/누적 합계: \*\*\$([\d.]+)\*\*/)?.[1] ?? 0);
  const out = rows.map(r => { cum += Number(r.split("|")[7]); return `${r} ${cum.toFixed(8)} |`; });
  text = text.slice(0, tableEnd) + "\n" + out.join("\n") + text.slice(tableEnd);
  writeFileSync(COST_LOG, text.replace(/누적 합계: \*\*\$[\d.]+\*\*/, `누적 합계: **$${cum.toFixed(8)}**`));
}
/** 읽기용 원고: 표지 한 줄 + 장(카드 줄 포함) + 핵심 문장 표시(⟪ ⟫로 되돌려 보여 준다). */
function manuscript(d: V5BookDraft): string {
  const cards = new Map((d.timeline?.cards ?? []).map(c => [c.key, c]));
  const body = d.chapters.map(ch => renderChapter({ n: ch.n, title: ch.title, sections: ch.sections.map(s => {
    const ps = s.paragraphs.map((p, i) => { const k = s.keySpans?.[i]; return k ? `${p.slice(0, k[0])}⟪${p.slice(k[0], k[1])}⟫${p.slice(k[1])}` : p; });
    const c = cards.get(s.heading);
    return { heading: s.heading, paragraphs: ps, ...(c ? { card: { image: c.imageLine, ...(c.review ? { review: c.review } : { todo: c.todo }), caution: c.caution ?? null } } : {}) };
  }) }));
  return `[표지] ${d.coverLine ?? d.coreImage?.line ?? d.pairImage?.line ?? ""}\n\n${body.join("\n\n")}\n`;
}

test("P6d 실호출 원고(Sonnet 5.5)", async () => {
  const keyA = DRY ? "dry" : readKey(A.keyFile, A.keyName);
  if (!keyA) throw new Error("키 없음");
  const s = localSupabase();
  const seed = await prepareLocalDb();
  const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const rpc = (fn: string): TicketPublicationStore => ({ async call(action, user, data = {}) {
    const r = await db.rpc(fn, { p_action: action, p_user: user, p_data: data });
    return !r.error && r.data && typeof r.data.ok === "boolean" ? r.data : { ok: false, code: r.error?.message ?? "STORAGE_UNAVAILABLE" };
  } });
  // 운영과 같이: 발행은 report_ticket_publication, 이전 Book 읽기(library·read)는 이용권 RPC. 이번 실행에서 만든 책만 이전 Book으로 본다.
  const runIds = new Set<string>(), tickets = rpc("report_tickets");
  const store = rpc("report_ticket_publication");
  const priorReader: TicketPublicationStore = { async call(action, user, data) {
    const r = await tickets.call(action, user, data);
    return action === "library" && Array.isArray(r.items) ? { ...r, items: (r.items as { reportId: string }[]).filter(x => runIds.has(x.reportId)) } : r;
  } };
  const consent = { policyVersions: CHECKOUT_POLICY_VERSIONS, assertions: { inputAccuracy: true, digitalReportStart: true, refundRestriction: true, termsAccepted: true, privacyAccepted: true, refundAccepted: true, age14OrOlder: true } };
  const dir = join(ROOT, "docs/v5/trial/p6d", DRY ? "safety-only" : process.env.P6D_ROUND ?? ""); mkdirSync(dir, { recursive: true });
  const { k } = writerKnowledge();

  for (const c of P6D_CASES.filter(x => (!only || only.has(x.id)) && !skip.has(x.id))) {
    const now = new Date();
    const n = normalizeReportInputPayload(c.payload, { now: () => now });
    if (!n.ok) throw new Error(`${c.id} 입력 오류 ${n.error}`);
    const input = n.value as { productKey: string; person?: { birthDate: string }; personA?: { birthDate: string } };
    const prompt = buildWriterPrompt(buildBrief(payloadToBriefInput(input as never, kstDate(now.toISOString())) as never, k), { knowledge: k });
    const inTok = Math.ceil((prompt.system.length + prompt.user.length) / 1.3);
    const price = priceFor(A.provider, A.model)!;
    // 최악: 첫 호출 최대 출력 + 수리·재요청(입력 다시 + 출력 1/3).
    const worst = (maxTokensFor(prompt.chapters, A.model) * 1.33 * price.output + inTok * 3 * price.input) / 1e6;
    if (!DRY && spentSoFar(A.provider) + worst > CAP.anthropic) { console.log(`중단: anthropic P6d 누적 $${spentSoFar(A.provider).toFixed(4)} + 최대 $${worst.toFixed(4)} > $${CAP.anthropic}`); break; }

    const evidence = createCheckoutConsentEvidence(consent, (input.person ?? input.personA)!.birthDate, now);
    const requestId = randomUUID(), reportId = `report_${randomUUID().replaceAll("-", "")}`;
    const enq = await store.call("enqueue", seed.userId, { requestId, input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"), reportId, policyAt: now.toISOString(), consentEvidence: evidence, ...purchaseMetadata(input) });
    if (!enq.ok) throw new Error(`${c.id} 접수 실패 ${enq.code}`);
    const job = await store.call("claim", null, { v5Products: [input.productKey] });
    if (!job.ok || job.reportId !== reportId) throw new Error(`${c.id} claim이 다른 작업(${job.reportId ?? job.code})`);
    const t0 = Date.now();
    const dry = DRY ? { stream: async () => ({ text: "", finishReason: "error" as const, usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 }, costUsd: 0, requestId: null, error: { code: "dry", message: "dry" } }) } : {};
    const result = await runV5TicketJob(store, job, { priorReader, provider: A.provider, model: A.model, apiKey: keyA, fallback: null, ...dry });
    const ms = Date.now() - t0;
    runIds.add(reportId);
    const snap = (await db.from("paid_report_snapshots").select("status,snapshot_json").eq("report_id", reportId).single()).data as { status: string; snapshot_json: { draft: V5BookDraft; evidencePacket: V5Evidence } } | null;
    const meta = snap?.snapshot_json.evidencePacket.meta;
    const rows = (meta?.calls ?? []).filter(x => x.requestId || x.usage.outputTokens || x.error).map(x =>
      `| ${kst()} | P6d ${c.label}${process.env.P6D_ROUND ? ` ${process.env.P6D_ROUND}` : ""}${x.kind === "repair" ? " 수리" : x.kind === "redo" ? " 재요청" : ""} | ${x.provider ?? A.provider}/${x.model ?? A.model} | ${x.usage.inputTokens} | ${x.usage.cachedInputTokens} | ${x.usage.outputTokens} | ${(x.costUsd ?? 0).toFixed(8)} | ${x.finish}${x.error ? ` (${x.error})` : ""} | ${x.requestId ?? "-"} |`);
    if (rows.length && !DRY) appendCostRows(rows);
    if (!snap) { writeFileSync(join(dir, `${c.id}.metrics.json`), JSON.stringify({ case: c.id, reportId, error: result.code ?? "NO_SNAPSHOT", calls: meta?.calls }, null, 1) + "\n"); console.log(c.id, "발행 실패", result.code); continue; }
    const draft = snap.snapshot_json.draft;
    writeFileSync(join(dir, `${c.id}.final.md`), manuscript(draft));
    const m = { case: c.id, label: c.label, reportId, status: snap.status, wallMs: ms, fallback: meta?.fallback ?? null, priorBooks: meta?.priorBooks ?? 0, explainedFromPrior: meta?.explained?.length ?? 0,
      coverLine: draft.coverLine ?? null, keySpans: draft.chapters.reduce((a, ch) => a + ch.sections.filter(x => x.keySpans?.some(Boolean)).length, 0), sections: draft.chapters.reduce((a, ch) => a + ch.sections.length, 0),
      ...bookMetrics(draft, snap.snapshot_json.evidencePacket), p6b: p6bBookMetrics(draft, snap.snapshot_json.evidencePacket), p6c: meta?.safety.metrics?.p6c ?? null, ledger: meta?.ledger ?? null };
    writeFileSync(join(dir, `${c.id}.metrics.json`), JSON.stringify(m, null, 1) + "\n");
    console.log(JSON.stringify({ case: c.id, reportId, chars: m.chars, det: m.deterministicChapters, cost: m.costUsd, sec: Math.round(ms / 1000), calls: m.calls.map(x => `${x.kind}:${x.finish}`).join("→"), p6c: m.p6c && { flags: m.p6c.flags, repaired: m.p6c.repaired, remaining: m.p6c.remaining, cover: m.p6c.cover } }));
  }
}, 0);
