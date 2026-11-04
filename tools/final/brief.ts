/**
 * pnpm book:brief <사례|all> [--jobs] [--show]   (최종판 0-4, 호출 0)
 * 작가에게 갈 재료(렌더 브리프 = 작가 사용자 메시지의 JSON)를 .cache/brief/<사례>/<시각>.json에 남기고, 바로 앞 판과의 차이(바뀐 경로·값)를 보여 준다.
 * 재료·선택 로직 수정은 이 도구로만 확인한다(작가 호출 없이). --jobs: 직업 입력 10개의 직군 1~4순위 표. --show: 렌더 브리프 요약(장·절·재료 종류).
 * 사례: tools/final/cases.ts (P6d 4명 + 생성 4권).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildBrief, type Knowledge } from "../../src/lib/brief";
import type { Brief } from "../../src/lib/brief/schema";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt, renderWriterBrief } from "../../src/lib/writer/prompt";
import { kstDate, writerKnowledge } from "../../src/lib/writer/publish";
import { ROOT } from "../llm/env";
import { FINAL_CASES, JOB_INPUTS, jobCase, type FinalCase } from "./cases";

export const BASE_AT = "2026-11-04T05:00:00.000Z";
export function briefOf(c: FinalCase, k: Knowledge = writerKnowledge().k, at = BASE_AT): Brief {
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date(at) });
  if (!n.ok) throw new Error(`${c.id}: ${String(n.error)}`);
  return buildBrief(payloadToBriefInput(n.value as never, kstDate(at)) as never, k);
}

/** 두 JSON의 바뀐 경로(값 앞 80자). */
function diff(a: unknown, b: unknown, path = "", out: string[] = []): string[] {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a as object), ...Object.keys(b as object)])) diff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}${Array.isArray(a) ? `[${k}]` : `.${k}`}`, out);
    return out;
  }
  const v = (x: unknown) => (x === undefined ? "(없음)" : JSON.stringify(x).slice(0, 80));
  out.push(`${path}: ${v(a)} → ${v(b)}`);
  return out;
}

/** 직군 1~4순위(jobGroups·jobGroupsFar 근거에서). */
export function jobRanks(b: Brief): string[] {
  const ev = b.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]).filter(m => m.kind === "evidence" && (m.key === "jobGroups" || m.key === "jobGroupsFar")) as { facts: readonly string[] }[];
  return [...new Set(ev.flatMap(e => e.facts).filter(f => /직군: /.test(f)))].map(f => { const head = f.replace(/ — .*$/, ""); const name = head.match(/([^\s]+) 직군(\(지금 목표·직업 분야\))?$/); return name ? `${name[1]}${name[2] ? "(목표·지금 분야)" : ""}` : head; });
}

function main() {
  const args = process.argv.slice(2), { k } = writerKnowledge();
  if (args.includes("--jobs")) {
    console.log("| 직업 입력 | 상태 | 1순위 | 2순위 | 3순위 | 4순위 |\n|---|---|---|---|---|---|");
    for (const [job, status] of JOB_INPUTS) { const r = jobRanks(briefOf(jobCase(job, status), k)); console.log(`| ${job} | ${status} | ${[0, 1, 2, 3].map(i => r[i] ?? "—").join(" | ")} |`); }
    return;
  }
  const which = args.find(a => !a.startsWith("--")) ?? "all";
  const cases = which === "all" ? FINAL_CASES : FINAL_CASES.filter(c => c.id === which);
  if (!cases.length) { console.error(`사례 없음: ${which} (있는 것: ${FINAL_CASES.map(c => c.id).join(", ")})`); process.exit(2); }
  for (const c of cases) {
    const b = briefOf(c, k), wb = renderWriterBrief(b, { knowledge: k });
    const dir = join(ROOT, ".cache/brief", c.id); mkdirSync(dir, { recursive: true });
    const prev = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")).sort().at(-1) : undefined;
    const now = { at: new Date().toISOString(), writerBrief: wb, user: buildWriterPrompt(b, { knowledge: k }).user.length };
    const changes = prev ? diff(JSON.parse(readFileSync(join(dir, prev), "utf8")).writerBrief, wb) : [];
    if (!prev || changes.length) writeFileSync(join(dir, `${now.at.replace(/[:.]/g, "-")}.json`), JSON.stringify(now, null, 1));
    console.log(`\n## ${c.id} — ${c.label}\n작가 사용자 메시지 ${now.user}자 · 이전 판 ${prev ?? "없음"} · 바뀐 경로 ${changes.length}`);
    for (const x of changes.slice(0, 40)) console.log(`  ${x}`);
    if (changes.length > 40) console.log(`  … 외 ${changes.length - 40}`);
    if (args.includes("--show")) {
      const chart = wb.chart as Record<string, unknown>;
      console.log(`  핵심 이미지 뜻: ${String(chart.coreImage)} · 피할 이미지: ${JSON.stringify(chart.avoidImages ?? [])}`);
      for (const ch of wb.chapters as { n: number; title: string; sections?: { q: string; materials: { kind: string; key?: string; who?: string[] }[] }[] }[])
        console.log(`  ${ch.n}. ${ch.title}: ${(ch.sections ?? []).map(s => `${s.q} [${s.materials.map(m => m.kind === "evidence" ? `ev:${m.key}` : m.kind === "rel" && m.who ? `rel(${m.who.join(" / ")})` : m.kind).join(",")}]`).join(" | ")}`);
      if (b.product === "career_money_study") console.log(`  직군: ${jobRanks(b).join(" → ")}`);
    }
  }
}
if (process.argv[1]?.endsWith("brief.ts")) main();
