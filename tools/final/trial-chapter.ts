/**
 * 시험 1장(최종판 4): 사례의 한 장만 작가 지침·같은 브리프(이어쓰기 프롬프트 = 남은 장 하나)로 만들어 빈 장·형식 오류를 본다. 예산 관문을 지난다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/trial-chapter.ts <사례> <장 번호> --budget <USD>
 * 결과: docs/v5/final/trial-chapter-<사례>-<장>.md(원고 + 검사 결과). 같은 입력이면 저장 원문을 쓴다(호출 0).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { completedChapters, renderChapter } from "../../src/lib/writer/format";
import { buildContinuationPrompt, buildWriterPrompt } from "../../src/lib/writer/prompt";
import { lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import { maxTokensFor, rawKey } from "../../src/lib/writer/runner";
import { applySafetyNet } from "../../src/lib/writer/safety";
import { lintBook, tidyBook } from "../../src/lib/writer/safety/p6c";
import { budgetArg, budgetGate, ensureScope, startGate } from "../llm/budget";
import { loadDevEnv, ROOT } from "../llm/env";
import { briefOf } from "./brief";
import { FINAL_CASES } from "./cases";

async function main() {
  const argv = process.argv.slice(2), bi = argv.indexOf("--budget");
  const [id, nArg] = argv.filter((a, i) => !a.startsWith("--") && i !== bi + 1);
  const budget = budgetArg(process.argv), n = Number(nArg ?? 1);
  const c = FINAL_CASES.find(x => x.id === id); if (!c) { console.error(`사례 없음: ${id}`); process.exit(2); }
  loadDevEnv();
  if (!process.env.ANTHROPIC_API_KEY) { console.error("ANTHROPIC_API_KEY 없음 — 멈춤"); process.exit(2); }
  ensureScope("final", 1.5, "최종판 명령 전체 합계 상한(덕짱님 지시 2026-11-04)");
  if (!startGate({ scope: "final", runBudget: budget, chapters: 1 }).ok) { console.error("거절: 예상 비용이 남은 예산보다 크다"); process.exit(3); }
  const { k } = writerKnowledge(), brief = briefOf(c, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const ch = plan.find(x => x.n === n)!;
  const p = buildContinuationPrompt(brief, [], [ch], { knowledge: k });
  const model = "claude-sonnet-5-5";
  const gate = budgetGate({ scope: "final", run: `trial-${id}-${n}`, runBudget: budget, stage: `최종판 시험 1장 · ${c.label} ${n}장` });
  const key = rawKey(model, p.system, p.user), hit = await gate.cache.get(key);
  let text = hit?.text ?? "";
  if (!hit) {
    let got = "";
    const r = await gate.stream({ provider: "anthropic", model, system: p.system, user: p.user, maxOutputTokens: maxTokensFor([ch], model), timeoutMs: 600_000, onText: d => { got += d; } });
    if (r.error) { console.error(`호출 실패: ${r.error.code} ${r.error.message}`); process.exit(4); }
    text = r.text || got;
    await gate.cache.put({ key, kind: "continuation", provider: "anthropic", model, chapters: [n], finish: r.finishReason, text, costUsd: r.costUsd ?? 0 }, { system: p.system, user: p.user });
  }
  const parsed = completedChapters(text, true).find(x => x.n === n);
  const net = applySafetyNet(brief, plan, new Map(parsed ? [[n, { chapter: parsed, source: "writer" as const }]] : []));
  const fin = net.chapters.find(x => x.n === n)!;
  const ctx = lintContext(brief, k, plan, []), flags = lintBook(tidyBook([fin], ctx).chapters, ctx);
  const problems = [!parsed ? "장 머리글을 찾지 못함" : "", fin.source !== "writer" ? `결정론 장(${fin.reason})` : "", !fin.sections.length ? "빈 장" : "", fin.sections.length !== (ch.sections?.length ?? fin.sections.length) ? `소제목 ${fin.sections.length}/${ch.sections?.length}` : ""].filter(Boolean);
  const out = join(ROOT, "docs/v5/final", `trial-chapter-${id}-${n}.md`); mkdirSync(join(ROOT, "docs/v5/final"), { recursive: true });
  writeFileSync(out, `# 시험 1장 — ${c.label} ${n}장\n\n- 원문 저장본: ${hit ? "있음(호출 0)" : "새 호출"} · 입력 해시 ${key} · 이번 실행 비용 $${gate.runSpent().toFixed(4)}\n- 형식: ${problems.length ? problems.join(", ") : "정상(작가 장·소제목 수 일치)"} · 글자 ${fin.chars} (목표 ${ch.targetChars.join("~")})\n- 검사 깃발 ${flags.length}: ${flags.map(f => `${f.rule}${f.detail ? `(${f.detail})` : ""}`).join(", ") || "없음"}\n\n${renderChapter({ n, title: fin.title, sections: fin.sections })}\n`);
  console.log(`${out}\n형식 ${problems.length ? problems.join(", ") : "정상"} · ${fin.chars}자 · 깃발 ${flags.length} · 비용 $${gate.runSpent().toFixed(4)}`);
  if (problems.length) process.exitCode = 1;
}
void main();
