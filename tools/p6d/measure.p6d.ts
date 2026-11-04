/**
 * P6d 지표: 저장된 원고(final.md)를 P6d 검사로 다시 센다(호출 0). P6c 최종 7권(전) · P6d 최종 4권(후).
 *   pnpm exec vitest run --config tools/p6d/vitest.measure.config.ts → docs/v5/trial/p6d/measure.json
 * 사실·금지 규칙(HARD_RULES)과 문체 규칙을 나눠 센다. 원고의 ⟪ ⟫는 지우고 본다. 브리프는 같은 입력·기준일(2026-11-04)로 다시 만든다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "vitest";
import { buildBrief, loadKnowledge } from "@/lib/brief";
import type { Brief } from "@/lib/brief/schema";
import { normalizeReportInputPayload } from "@/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "@/lib/writer/book";
import { parseChapters } from "@/lib/writer/format";
import { buildWriterPrompt } from "@/lib/writer/prompt";
import { lintContext } from "@/lib/writer/publish";
import type { FinalChapter } from "@/lib/writer/safety";
import { HARD_RULES, lintBook } from "@/lib/writer/safety/p6c";
import { P6B_CASES } from "../p6b/cases";
import { P6D_CASES } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
function measure(dir: string, cases: readonly { id: string; label: string; payload: unknown }[]) {
  const k = loadKnowledge();
  return cases.map(c => {
    const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-04T05:00:00Z") });
    if (!n.ok) return { case: c.id, error: n.error };
    const brief: Brief = buildBrief(payloadToBriefInput(n.value as never, "2026-11-04") as never, k);
    const plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
    const text = readFileSync(join(ROOT, dir, `${c.id}.final.md`), "utf8").replace(/⟪|⟫/g, "");
    const chapters: FinalChapter[] = parseChapters(text).map(ch => { const p = plan.find(x => x.n === ch.n); return { n: ch.n, id: p?.id ?? `c${ch.n}`, title: ch.title, sections: ch.sections, source: "writer" as const, chars: 0, ...(p?.keys ? { keys: p.keys } : {}) }; });
    const flags = lintBook(chapters, lintContext(brief, k, plan, []));
    const by = (hard: boolean) => flags.filter(f => HARD_RULES.has(f.rule) === hard).reduce<Record<string, number>>((o, f) => ({ ...o, [f.rule]: (o[f.rule] ?? 0) + 1 }), {});
    const chars = chapters.reduce((a, ch) => a + ch.sections.reduce((b, s) => b + s.paragraphs.join("").length, 0), 0);
    return { case: c.id, label: c.label, chars, hard: by(true), soft: by(false), hardSamples: flags.filter(f => HARD_RULES.has(f.rule)).slice(0, 12).map(f => `${f.rule}: ${f.sentence.slice(0, 90)}`) };
  });
}
test("P6d 지표", () => {
  const before = measure("docs/v5/trial/p6c/final", P6B_CASES), after = measure("docs/v5/trial/p6d/final", P6D_CASES);
  writeFileSync(join(ROOT, "docs/v5/trial/p6d/measure.json"), JSON.stringify({ note: "P6d 검사로 다시 센 수(사실·금지 hard / 문체 soft). 전 = P6c 최종 7권, 후 = P6d 최종 4권(서로 다른 책)", before, after }, null, 1) + "\n");
}, 0);
