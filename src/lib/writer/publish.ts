/**
 * v5 발행 조립(P3 C·F): 입력 → 브리프 → 작가(스트리밍 1회, 장 저장) → 안전망(결정론 보충) → v5 Book 스냅샷.
 * recover=true면 작가를 부르지 않고 저장된 장 + 결정론 작가로만 완성한다(회수 크론).
 * 어떤 단계가 실패해도 결정론 작가로 Book을 만든다. 만세력·MBTI 표만 기존 v4 계산을 빌리고, 실패하면 표 페이지 없이 낸다.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { BookPerson } from "@/app/dev/book-preview/bookTypes";
import { buildBrief, loadKnowledge, type Knowledge } from "@/lib/brief";
import { DEFAULT_KNOWLEDGE_ROOT } from "@/lib/brief/knowledge";
import { stableStringify } from "@/lib/brief/seed";
import type { Brief } from "@/lib/brief/schema";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { projectV4Tables, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { resolveLlmConfig, type LlmProvider } from "@/lib/llm";
import { birthTimeSlotLabel } from "@/lib/saju/birthTimePrecisionTypes";
import { SAJU_CALENDAR_VERSION } from "@/lib/saju/calendarVersion";
import type { ProductPreviewSnapshot } from "@/lib/report-generation/productPreviewSnapshot";
import type { ReportInputPayload } from "@/lib/report-generation/reportInputTypes";
import { withV5NatalRows } from "@/lib/report-tables/v5NatalRows";
import { analyzeChartDetections } from "@/lib/saju/detections";
import { assembleV5Book, createV5Snapshot, payloadToBriefInput, type WriterMeta } from "./book";
import { buildWriterPrompt, WRITER_PROMPT_VERSION } from "./prompt";
import { runWriter, type ChapterSink, type WriterOptions, type WriterRun } from "./runner";
import { applySafetyNet, type DraftChapter } from "./safety";

let knowledgeCache: { k: Knowledge; version: string } | null = null;
/** 지식 DB와 그 내용 해시(Book 메타데이터의 지식 버전). */
export function writerKnowledge(root = DEFAULT_KNOWLEDGE_ROOT): { k: Knowledge; version: string } {
  if (knowledgeCache) return knowledgeCache;
  const h = createHash("sha256");
  const walk = (dir: string) => { for (const f of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { const p = join(dir, f.name); if (f.isDirectory()) { if (f.name !== "legacy") walk(p); } else if (f.name.endsWith(".json")) h.update(f.name).update(readFileSync(p)); } };
  walk(root);
  knowledgeCache = { k: loadKnowledge(root), version: `knowledge-v5:${h.digest("hex").slice(0, 12)}` };
  return knowledgeCache;
}

export const briefHash = (b: Brief) => createHash("sha256").update(stableStringify(b)).digest("hex").slice(0, 16);
/** KST 기준 날짜(YYYY-MM-DD). */
export const kstDate = (iso: string) => new Date(Date.parse(iso) + 9 * 3_600_000).toISOString().slice(0, 10);

/** 만세력·MBTI 표(BookPerson): 기존 v4 계산을 한 번 빌려 고정한다. 십이신살·신살/귀인·합충형파해 줄은 v5 엔진 결과로 바꾼다(P6). 실패하면 빈 배열(표 페이지 없이 발행). */
export async function v4People(payload: ReportInputPayload, policyAt: string): Promise<BookPerson[]> {
  try {
    const v4 = await generateV4ShadowReport(payload, { evaluatedAt: policyAt, policyDate: policyAt });
    if (!v4.ok || !v4.evidencePacket) return [];
    const evidence = v4.evidencePacket as V4RuntimeEvidence;
    const tables = projectV4Tables(evidence);
    const persons = payload.productKey === "saju_mbti_compatibility" ? [[payload.personA, "A", "personA"], [payload.personB, "B", "personB"]] as const : [[payload.person, "주인공", "person"]] as const;
    return persons.map(([p, role, slot], i) => ({ name: p.name, role, birth: p.birthDate, gender: p.gender, precision: p.birthTimeUnknown ? "unknown" : p.birthTimePrecision ?? "exact", time: p.birthTime ?? "", mbti: p.mbtiType ?? "",
      // 대략 시간대도 같은 줄 형식(P6: 대략 입력이 "정확 · "(빈 시각)으로 나왔다). 새 책은 현재 달력 기준 시간대 이름.
      timeLabel: p.birthTimeUnknown ? "출생시간 모름" : p.birthTimePrecision === "approximate" ? `대략 · ${birthTimeSlotLabel(p.approximateBirthTimeSlot, SAJU_CALENDAR_VERSION) ?? "입력 시간대"}` : `정확 · ${p.birthTime}`,
      table: withV5NatalRows(tables[i], analyzeChartDetections(evidence.calculations[slot])) }));
  } catch { return []; }
}

export type V5BuildDeps = Partial<Pick<WriterOptions, "stream" | "now" | "sleep" | "budgetMs" | "apiKey" | "fetchImpl" | "maxOutputTokens">> & {
  readonly provider?: LlmProvider; readonly model?: string; readonly people?: (payload: ReportInputPayload, policyAt: string) => Promise<BookPerson[]>;
};

export async function buildV5Snapshot(a: { payload: ReportInputPayload; reportId: string; policyAt: string; sink: ChapterSink; recover?: boolean; deps?: V5BuildDeps }): Promise<{ snapshot: ProductPreviewSnapshot; meta: WriterMeta; run: WriterRun | null }> {
  const deps = a.deps ?? {};
  const now = deps.now ?? (() => Date.now()), started = now();
  const { k, version: knowledgeVersion } = writerKnowledge();
  const brief = buildBrief(payloadToBriefInput(a.payload, kstDate(a.policyAt)) as never, k);
  const plan = buildWriterPrompt(brief).chapters;
  const llm = resolveLlmConfig();
  const provider = deps.provider ?? llm.provider, model = deps.model ?? llm.model ?? "";
  let run: WriterRun | null = null;
  let drafts = new Map<number, DraftChapter>();
  if (!a.recover && model) {
    const envCap = Number(process.env.LLM_MAX_OUTPUT_TOKENS);
    try { run = await runWriter({ brief, provider, model, sink: a.sink, ...(envCap > 0 ? { maxOutputTokens: envCap } : {}), ...deps }); drafts = run.drafts; }
    catch { drafts = new Map(); }
  }
  if (a.recover || !run) { try { for (const s of await a.sink.load()) if (!drafts.has(s.n)) drafts.set(s.n, { chapter: s.chapter, source: s.source }); } catch { /* 저장소가 안 되면 결정론 작가로만 */ } }
  const { chapters: finals, report } = applySafetyNet(brief, plan, drafts);
  const people = await (deps.people ?? v4People)(a.payload, a.policyAt);
  const { draft, evidence } = assembleV5Book({
    brief, plan, finals, report, payload: a.payload, generatedAt: a.policyAt, people,
    writer: run && model ? { provider, model } : null, calls: run?.calls ?? [],
    tokens: { input: run?.usage.inputTokens ?? 0, cachedInput: run?.usage.cachedInputTokens ?? 0, output: run?.usage.outputTokens ?? 0 },
    costUsd: run?.costUsd ?? 0, durationMs: now() - started, briefHash: briefHash(brief), knowledgeVersion, promptVersion: WRITER_PROMPT_VERSION, recovered: Boolean(a.recover),
  });
  return { snapshot: createV5Snapshot({ reportId: a.reportId, createdAtIso: a.policyAt, draft, evidence }), meta: evidence.meta, run };
}
