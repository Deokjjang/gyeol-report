/**
 * P6d 진단: 로컬 DB에 저장된 작가 장(report_writer_chapters, 수리 전 원고)을 다시 검사해 걸린 문장·규칙을 본다(호출 0).
 *   P6D_REPORTS=<case>=<reportId>,… pnpm exec vitest run --config tools/p6d/vitest.diag.config.ts
 * 결과: docs/v5/trial/p6d/diagnose.json(규칙·문장, 문체 규칙 db_copy·scene_repeat·prop_repeat·job_prop 제외).
 */
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "@/lib/writer/book";
import type { BookChapter } from "@/lib/writer/format";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { lintContext } from "@/lib/writer/publish";
import { applySafetyNet } from "@/lib/writer/safety";
import { lintBook, tidyBook, HARD_RULES } from "@/lib/writer/safety/p6c";
import { localSupabase } from "../../scripts/dev/local";
import { P6D_CASES } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
test("P6d 수리 전 원고 재검사", async () => {
  const k = loadKnowledge();
  const s = localSupabase(); const db = createClient(s.API_URL, s.SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const out: Record<string, unknown> = {};
  for (const pair of (process.env.P6D_REPORTS ?? "").split(",").filter(Boolean)) {
    const [caseId, reportId] = pair.split("=");
    const red = (await db.from("report_ticket_redemptions").select("id").eq("report_id", reportId).single()).data as { id: string } | null;
    if (!red) { out[caseId] = "redemption 없음"; continue; }
    const rows = ((await db.from("report_writer_chapters").select("chapter_n,source,chapter").eq("redemption_id", red.id)).data ?? []) as { chapter_n: number; source: string; chapter: BookChapter }[];
    const c = P6D_CASES.find(x => x.id === caseId)!;
    const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") }); if (!n.ok) continue;
    const brief = buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k);
    const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
    const { chapters } = applySafetyNet(brief, plan, new Map(rows.map(r => [r.chapter_n, { chapter: r.chapter, source: "writer" as const }])));
    const ctx = lintContext(brief, k, plan, []);
    const flags = lintBook(tidyBook(chapters, ctx).chapters, ctx).filter(f => !["db_copy", "scene_repeat", "prop_repeat", "job_prop"].includes(f.rule));
    out[caseId] = flags.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}${f.card ? `:${f.card}` : ""}`, rule: f.rule, hard: HARD_RULES.has(f.rule), detail: f.detail, sentence: f.sentence.slice(0, 200) }));
  }
  writeFileSync(join(ROOT, "docs/v5/trial/p6d/diagnose.json"), JSON.stringify(out, null, 1) + "\n");
}, 0);
