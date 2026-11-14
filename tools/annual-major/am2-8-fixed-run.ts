/**
 * AM2-8 1부 고정 시험 묶음 돌리기(호출 0): tests/unit/writer/am28-fixed.json 사례마다 지금 검사가 어떻게 나오는지.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-fixed-run.ts [--md]
 * 시험(tests/unit/writer/am28.test.ts)과 표(am2-8-roots.md 1부)가 같은 함수를 쓴다.
 * - 보통 사례: 그 장(앞 소제목 자리는 빈 칸)을 검사 한 벌(makeInspector)에 대어, 사례의 검사 id가 그 문장에 서는지 본다.
 * - cut 사례: 그 문장을 지우면 같은 문단 뒤 문장이 지운 말에 기대는지(leanOnCut) · 새 지시어 고아가 생기는지(antecedentIssues).
 * - detfix 사례: 검사가 서고, 결정론 고침(detFix)을 차례로 대면 그 검사가 모두 사라지는지(지우지 않고 고침).
 */
import { readFileSync } from "node:fs";
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { kstDate, writerKnowledge } from "../../src/lib/writer/publish";
import { buildIntake } from "../../src/lib/writer/chunked/intake";
import { makeInspector } from "../../src/lib/writer/chunked/publish";
import { antecedentIssues, detFix, leanOnCut } from "../../src/lib/writer/chunked/accept";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { payloadFor } from "./am2-6-books";

export type Fixture = { id: string; book: string; expect: "catch" | "pass"; rules: string[]; note: string; chapter: number; section: number; heading: string; keyed: boolean; paragraphs: string[]; sentence: string; cut?: string; detfix?: boolean };
export const FIXTURES = (): Fixture[] => JSON.parse(readFileSync("tests/unit/writer/am28-fixed.json", "utf8"));
const AT = "2026-12-02T03:00:00.000Z";
const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
const same = (a: string, b: string) => { const x = norm(a), y = norm(b); return x.length > 0 && y.length > 0 && (x.includes(y.slice(0, 20)) || y.includes(x.slice(0, 20))); };
const cache = new Map<string, ReturnType<typeof setup>>();
function setup(book: string) {
  const payload = payloadFor(book) as never, { k } = writerKnowledge();
  const brief = buildBrief(payloadToBriefInput(payload, kstDate(AT)), k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
  const intake = buildIntake(brief, k, plan);
  return { brief, plan, intake, ins: makeInspector({ payload, policyAt: AT, brief, k, plan, intake }) };
}
const ctx = (book: string) => { if (!cache.has(book)) cache.set(book, setup(book)); return cache.get(book)!; };
export type FixedRow = { id: string; expect: "catch" | "pass"; got: string[]; ok: boolean; note: string };
export function runFixture(f: Fixture): FixedRow {
  const c = ctx(f.book);
  if (f.cut) {
    const p = f.paragraphs.find(x => x.includes(f.cut!)) ?? "", pi = f.paragraphs.indexOf(p), prev = pi > 0 ? f.paragraphs[pi - 1] : f.heading;
    const cutS = splitSentences(p).find(s => s.includes(f.cut!)) ?? f.cut, rest = splitSentences(p).filter(s => s !== cutS).join(" ");
    const lean = leanOnCut(p, cutS, prev), before = new Set(antecedentIssues(p, prev)), fresh = antecedentIssues(rest, prev).filter(x => !before.has(x));
    const got = [...(lean.length ? ["lean_on_cut"] : []), ...(fresh.length ? ["antecedent"] : [])];
    return { id: f.id, expect: f.expect, got, ok: f.expect === "catch" ? got.length > 0 : got.length === 0, note: f.note };
  }
  const plan = c.intake.chapters.find(p => p.n === f.chapter)!;
  const sections = [...Array.from({ length: f.keyed ? 0 : f.section }, (_x, i) => ({ heading: plan.sections?.[i]?.q ?? "", paragraphs: [] as string[] })), { heading: f.heading, paragraphs: f.paragraphs }];
  const ch: FinalChapter = { n: f.chapter, id: plan.id, title: plan.title, sections, source: "writer", chars: f.paragraphs.join("").length, ...(plan.keys ? { keys: plan.keys.map(k => k.key) } : {}) };
  const s0 = c.ins.inspect([ch]), all = [...s0.block, ...s0.minor, ...s0.fix];
  const got = [...new Set(all.filter(x => f.rules.includes(x.rule) && same(x.sentence, f.sentence)).map(x => x.rule))];
  if (f.detfix) {
    let sen = splitSentences(f.paragraphs.join(" ")).find(s => same(s, f.sentence)) ?? f.sentence;
    for (const r of got) sen = detFix(sen, r, { callName: c.brief.person.callName, name: c.brief.person.name, ...(c.intake.inputs ? { inputs: c.intake.inputs } : {}), ...(c.ins.lctx.monthNames ? { months: c.ins.lctx.monthNames } : {}), ...(c.ins.lctx.bookYear ? { year: c.ins.lctx.bookYear } : {}) }) ?? sen;
    const ch2: FinalChapter = { ...ch, sections: ch.sections.map((s, i) => (i === sections.length - 1 ? { ...s, paragraphs: s.paragraphs.map(p => splitSentences(p).map(x => (same(x, f.sentence) ? sen : x)).join(" ")) } : s)) };
    const s1 = c.ins.inspect([ch2]), left = [...s1.block, ...s1.minor, ...s1.fix].filter(x => f.rules.includes(x.rule) && same(x.sentence, sen)).map(x => x.rule);
    const ok = f.rules.every(r => got.includes(r)) && left.length === 0;
    return { id: f.id, expect: f.expect, got: [...got, ...(left.length ? [`고친 뒤 남음:${left.join(",")}`] : [`고침: ${sen.slice(0, 60)}`])], ok, note: f.note };
  }
  return { id: f.id, expect: f.expect, got, ok: f.expect === "catch" ? got.length > 0 : got.length === 0, note: f.note };
}
export const runAll = () => FIXTURES().map(runFixture);

if (process.argv[1]?.endsWith("am2-8-fixed-run.ts")) {
  const rows = runAll();
  console.log("| # | 기대 | 지금 검사 | 결과 | 사례 |\n|---|---|---|---|---|");
  for (const r of rows) console.log(`| ${r.id} | ${r.expect === "catch" ? "걸려야 함" : "통과해야 함"} | ${r.got.join(" · ") || "깃발 없음"} | ${r.ok ? "○" : "×"} | ${r.note} |`);
  console.log(`\n기대대로 ${rows.filter(r => r.ok).length}/${rows.length}`);
}
