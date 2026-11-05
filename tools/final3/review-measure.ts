/**
 * 저장본 17권 검수 측정(최종판3 5). 결정론 검사(호출 0) + 검수 1회(모델 하나). 수리는 하지 않는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/review-measure.ts --model claude-haiku-5-5 --budget 0.15 [--dry] [--only 이름,이름]
 * 결과: .cache/final3/review-<모델>.json (책마다 번호 문장·기계 깃발·검수 지적·버린 지적·비용·지연)
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { streamCompletion } from "../../src/lib/llm";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import { guardReview, priorSummaryOf, REVIEW_MAX_INPUT_CHARS, REVIEW_SCHEMA, reviewMaxTokens, reviewPrompt } from "../../src/lib/writer/review";
import { rawKey } from "../../src/lib/writer/runner";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { lintBook, tidyBook } from "../../src/lib/writer/safety/p6c";
import { budgetArg, budgetGate, ensureScope } from "../llm/budget";
import { loadDevEnv } from "../llm/env";
import { briefOfSnap, factSheetOfSnap, type Snap } from "../final/replay";

const argv = process.argv.slice(2), arg = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const model = arg("--model") ?? "claude-haiku-5-5", dry = argv.includes("--dry"), only = arg("--only")?.split(",");
const DIR = ".cache/final3/stored";
const { k } = writerKnowledge();
const snaps = readdirSync(DIR).filter(f => f.endsWith(".snapshot.json")).map(f => ({ name: f.replace(/\.snapshot\.json$/, ""), snap: JSON.parse(readFileSync(join(DIR, f), "utf8")) as Snap }));
const peopleKey = (s: Snap) => { const i = s.evidencePacket.input as unknown as Record<string, { name: string; birthDate: string }>; return [i.person, i.personA, i.personB].filter(Boolean).map(p => `${p.name}|${p.birthDate}`); };
const sentencesOf = (s: Snap) => s.draft.chapters.flatMap(c => c.sections.flatMap(x => x.paragraphs.flatMap(p => splitSentences(p.replace(/[⟪⟫]/g, "")))));

void (async () => {
  loadDevEnv();
  const gate = dry ? null : (ensureScope("final3", 4.0, "최종판3(출시 전 마지막): 검수 측정·결제 경로 4권 생성, 덕짱님 지시 상한 $4.00"), budgetGate({ scope: "final3", run: `review-measure-${model}${arg("--run") ? `-${arg("--run")}` : ""}`, runBudget: budgetArg(argv), stage: "검수 측정" }));
  const out: unknown[] = [];
  for (const { name, snap } of snaps) {
    if (only && !only.includes(name)) continue;
    const brief = briefOfSnap(snap), sheet = factSheetOfSnap(snap, brief), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
    const finals: FinalChapter[] = snap.draft.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(x => ({ heading: x.heading, paragraphs: [...x.paragraphs] })), ...(c.keys ? { keys: c.keys } : {}) }));
    const ctx = lintContext(brief, k, plan, [], undefined, sheet);
    const chapters = tidyBook(finals, ctx).chapters, flags = lintBook(chapters, ctx);
    // 같은 사람 이전 책(이 책보다 먼저 만든 저장본).
    const mine = new Set(peopleKey(snap)), at = Date.parse(snap.evidencePacket.generatedAt);
    const priors = snaps.filter(x => x.name !== name && Date.parse(x.snap.evidencePacket.generatedAt) < at && peopleKey(x.snap).some(p => mine.has(p)));
    const prior = priorSummaryOf(priors.flatMap(x => sentencesOf(x.snap)), priors.map(x => `(이전 ${x.snap.draft.productType} 표지) ${x.snap.draft.coverLine ?? ""}`));
    const cover = snap.draft.coverLine ?? "";
    const base = reviewPrompt({ brief, sheet, k, chapters, cover, prior });
    const flaggedText = flags.map(f => f.sentence).filter(Boolean);
    const machineFlagged = base.numbered.filter(x => flaggedText.some(t => t.includes(x.text) || x.text.includes(t))).map(x => x.n);
    const p = reviewPrompt({ brief, sheet, k, chapters, cover, prior, machineFlagged });
    const row: Record<string, unknown> = { book: name, sentences: p.numbered.length, inputChars: p.chars, systemChars: p.system.length, flags: flags.map(f => ({ at: `${f.chapter}.${f.section}.${f.paragraph}`, rule: f.rule, detail: f.detail ?? "", sentence: f.sentence })), machineFlagged, priorBooks: priors.map(x => x.name), numbered: p.numbered };
    if (dry || p.chars > REVIEW_MAX_INPUT_CHARS) { out.push({ ...row, skipped: dry ? "dry" : "input_cap" }); console.log(`${name}: 문장 ${p.numbered.length} · 입력 ${p.chars}자 · 기계 깃발 ${flags.length} · 이전 책 ${priors.length}`); continue; }
    const key = rawKey(model, p.system, p.user), t0 = Date.now();
    let text = "", cost = 0, usage: unknown = null, finish = "cache";
    const hit = await gate!.cache.get(key);
    if (hit) text = hit.text;
    else {
      const r = await gate!.stream({ provider: "anthropic", model, system: p.system, user: p.user, maxOutputTokens: reviewMaxTokens(model), timeoutMs: 300_000, jsonSchema: REVIEW_SCHEMA as never });
      text = r.text; cost = r.costUsd ?? 0; usage = r.usage; finish = r.error ? `${r.finishReason}:${r.error.code}` : r.finishReason;
      if (r.text) await gate!.cache.put({ key, kind: "repair", provider: "anthropic", model, finish: r.finishReason, text: r.text, costUsd: cost }, { system: p.system, user: p.user });
    }
    const g = guardReview(text, p.numbered, p.ids, prior.lines.length, brief.product);
    out.push({ ...row, model, cost, usage, finish, ms: Date.now() - t0, kept: g?.kept ?? null, direct: g?.direct ?? null, dropped: g?.dropped ?? null, formatError: g === null });
    console.log(`${name}: ${finish} · $${cost.toFixed(5)} · ${Date.now() - t0}ms · 남김 ${g?.kept.length ?? "형식오류"} · 바로 고침 ${g?.direct.length ?? 0} · 버림 ${g?.dropped.length ?? 0}`);
    writeFileSync(`.cache/final3/review-${model}.json`, JSON.stringify(out, null, 1));
  }
  writeFileSync(`.cache/final3/review-${model}${dry ? "-dry" : ""}.json`, JSON.stringify(out, null, 1));
  void streamCompletion;
})();
