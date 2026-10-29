/**
 * P3 이용권 큐 v5 시나리오(PGlite + 목업 LLM, 비용 0). 테스트와 tools/p3-writer/failure-injection.ts가 같이 쓴다.
 */
import { randomUUID, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { buildBrief } from "@/lib/brief";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { runTicketPublicationJob } from "@/lib/tickets/publicationWorker";
import { payloadToBriefInput, projectV5Book, type V5Evidence } from "@/lib/writer/book";
import { kstDate, writerKnowledge } from "@/lib/writer/publish";
import { runV5RecoveryBatch } from "@/lib/writer/ticketJob";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import { mockBookText, mockOpenAi, type MockBehavior } from "./llmMock";
import { ticketPublicationSql, TICKET_A as A } from "./ticketPublicationSql";

export const V5_MIGRATION = "supabase/migrations/20261029130000_v5_writer_jobs.sql";
export const RAW_FULL = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "하람", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: {} };

export async function v5Queue() {
  const h = await ticketPublicationSql();
  await h.db.exec(`reset role; ${readFileSync(V5_MIGRATION, "utf8")} set role service_role;`);
  await h.db.query("select report_tickets('grant',$1,$2::jsonb)", [A, JSON.stringify({ quantity: 50, sourceType: "manual", sourceRef: "p3-v5", key: `p3:${randomUUID()}`, reason: "P3_TEST" })]);
  return h;
}
export type Queue = Awaited<ReturnType<typeof v5Queue>>;

export async function enqueue(h: Queue, raw: unknown = RAW_FULL, policyAt = "2026-10-27T03:00:00.000Z") {
  const n = normalizeReportInputPayload(raw, { now: () => new Date(policyAt) });
  if (!n.ok) throw new Error(`payload: ${n.error}`);
  const input = n.value;
  const r = await h.queue.call("enqueue", A, { requestId: randomUUID(), input, productType: input.productKey, inputHash: createHash("sha256").update(JSON.stringify(input)).digest("hex"),
    reportId: `report_${randomUUID().replaceAll("-", "")}`, policyAt, consentEvidence: { version: "checkout-consent-v1" }, displayName: "검수" });
  if (!r.ok) throw new Error(`enqueue: ${r.code}`);
  return { input, redemptionId: String(r.redemptionId), reportId: String(r.reportId) };
}

export async function readBook(h: Queue, reportId: string) {
  const row = (await h.db.query<{ status: string; snapshot_json: ProductPreviewSnapshot | null }>("select status,snapshot_json from paid_report_snapshots where report_id=$1", [reportId])).rows[0];
  const snapshot = row?.snapshot_json ?? null;
  const book = snapshot ? projectV5Book(snapshot) : null;
  const meta = snapshot ? (snapshot.evidencePacket as V5Evidence).meta : null;
  return { status: row?.status, snapshot, opens: Boolean(book), book, meta };
}

export const llmDeps = (behaviors: MockBehavior[], budgetMs?: number) => {
  const m = mockOpenAi(behaviors);
  return { m, deps: { provider: "openai" as const, model: "gpt-4o-mini", apiKey: "sk-test-mock", fetchImpl: m.fetch, sleep: async () => undefined, people: async () => [], ...(budgetMs ? { budgetMs } : {}) } };
};

/** 결정론 원고 기반 목업 책 텍스트(이 입력의 브리프로 만든다). */
export function mockTextFor(input: unknown, policyAt = "2026-10-27T03:00:00.000Z") {
  const brief = buildBrief(payloadToBriefInput(input as never, kstDate(policyAt)) as never, writerKnowledge().k);
  return { brief, text: mockBookText(brief) };
}

export type ScenarioResult = { name: string; state: string; opens: boolean; sources: string; calls: number; ms: number; note?: string };
const summarize = (sources: string[]) => Object.entries(sources.reduce<Record<string, number>>((m, s) => ((m[s] = (m[s] ?? 0) + 1), m), {})).map(([k, v]) => `${k} ${v}`).join(" · ");

/** 한 시나리오: 접수 → 워커(목업 LLM) → (필요하면 회수) → 저장된 Book을 연다. */
export async function scenario(h: Queue, name: string, behaviors: (text: string, brief: ReturnType<typeof mockTextFor>["brief"]) => MockBehavior[], opts: { budgetMs?: number; kill?: boolean } = {}): Promise<ScenarioResult> {
  const t0 = Date.now();
  const job = await enqueue(h);
  const { text, brief } = mockTextFor(job.input);
  const { m, deps } = llmDeps(behaviors(text, brief), opts.budgetMs);
  let note: string | undefined;
  if (opts.kill) {
    // 워커가 장 3개를 저장한 뒤 멈춘다(강제 종료 흉내). 작가 lease를 지나게 한 뒤 회수 크론이 완성한다.
    const worker = runTicketPublicationJob(h.queue, undefined, deps);
    for (let i = 0; i < 200; i++) { const n = (await h.db.query<{ c: number }>("select count(*)::int c from report_writer_chapters where redemption_id=$1", [job.redemptionId])).rows[0].c; if (n >= 3) break; await new Promise(r => setTimeout(r, 20)); }
    await h.db.exec("reset role"); await h.db.query("update report_ticket_redemptions set writer_lease_until=clock_timestamp()-interval '1 second' where id=$1", [job.redemptionId]); await h.db.exec("set role service_role");
    const rec = await runV5RecoveryBatch(h.queue, { deps: { people: async () => [] } });
    const late = await worker;
    note = `회수 ${rec.processed}건, 늦게 깨어난 원래 워커: ${late.code ?? (late.ok ? "ok" : "fail")}`;
  } else {
    await runTicketPublicationJob(h.queue, undefined, deps);
  }
  const b = await readBook(h, job.reportId);
  return { name, state: b.status ?? "-", opens: b.opens, sources: summarize(b.meta?.chapters.map(c => c.source) ?? []), calls: m.calls.length, ms: Date.now() - t0, ...(note ? { note } : {}) };
}

export const SCENARIOS: { name: string; behaviors: Parameters<typeof scenario>[2]; opts?: Parameters<typeof scenario>[3] }[] = [
  { name: "정상", behaviors: text => [{ text }] },
  { name: "출력 전 5xx → 재시도", behaviors: text => [{ status: 503 }, { text }] },
  { name: "출력 전 429 → 재시도", behaviors: text => [{ status: 429 }, { status: 429 }, { text }] },
  { name: "중간 끊김 → 이어쓰기", behaviors: text => [{ text, cutAt: text.indexOf("## 7. ") + 40 }, { text: text.slice(text.indexOf("## 6. ")) }] },
  { name: "length 종료 → 이어쓰기", behaviors: text => [{ text: text.slice(0, text.indexOf("## 9. ") + 40), finish: "incomplete" }, { text: text.slice(text.indexOf("## 8. ")) }] },
  { name: "타임아웃 → 결정론 보충", behaviors: text => [{ text, cutAt: text.indexOf("## 5. ") + 40, hang: true }], opts: { budgetMs: 6_000 } },
  { name: "인증 실패(401, 재시도 안 함) → 전부 결정론", behaviors: () => [{ status: 401 }] },
  { name: "워커 강제 종료 → 회수 크론", behaviors: text => [{ text, cutAt: text.indexOf("## 4. ") + 40, hang: true }], opts: { budgetMs: 8_000, kill: true } },
];
