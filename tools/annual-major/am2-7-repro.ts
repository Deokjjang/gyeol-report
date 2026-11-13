/**
 * AM2-7 7부 P6 재현(호출 0): P6 여덟 권의 첫 원고(meta.raw kind=first)와 기록된 다시 쓰기 출력(kind=rewrite, [¶번호])에 1 · 5부 새 규칙을 대어 책을 다시 만든다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-7-repro.ts [annual-1 …] [--out R7] [--quiet]
 * - 첫 호출: 그 묶음의 P6 첫 원고를 그대로. 문단 교체 호출: 고칠 자리마다 같은 번호의 P6 교체 글(없으면 빈 교체 = 첫 원고 그대로).
 * - 결과: ~/Desktop/gyeol-review/annual-major-02/<out>-<id>/{snapshot.json, book.md, check.md, card.txt}(판독용). 기록이 없어 판정할 수 없는 자리는 check.md에 따로 적는다.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { judgeBuild } from "../../src/lib/ops/generation/policy";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { replayP5 } from "./am2-6-p5";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";
import { renderCard } from "../../src/lib/writer/chunked/prompt";

type Raw = { kind: string; text: string };
/** 판독용 원고(장 · 소제목 · 문단). */
const manuscript = (d: V5BookDraft) => [`# ${d.title}`, ...((d as { coverLine?: string }).coverLine ? [`[표지] ${(d as { coverLine?: string }).coverLine}`] : []), ...d.chapters.flatMap(ch => [`\n## ${ch.n}. ${ch.title}`, ...ch.sections.flatMap(s => [`\n### ${s.heading}`, ...s.paragraphs.map(p => `\n${p}`)])])].join("\n");
export const BOOKS = ["annual-1", "annual-p5", "annual-p6a", "annual-p6b", "major-1", "major-p5", "major-p6a", "major-p6b"];
export async function replayBook(id: string, out = "R7") {
  const snap = JSON.parse(readFileSync(join(OUT2, `P6-${id}`, "snapshot.json"), "utf8")) as { evidencePacket: V5Evidence };
  const { stream, used, missed } = replayP5(snap.evidencePacket.meta.raw as unknown as Raw[]);
  const at = "2026-12-02T03:00:00.000Z";
  const built = await buildV5Snapshot({ payload: payloadFor(id) as never, reportId: `report_replay7${id.replace(/[^a-z0-9]/g, "")}000`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, people: async () => [] } });
  const d = built.snapshot.draft as unknown as V5BookDraft, r = (built.snapshot.evidencePacket as unknown as V5Evidence).meta.review as Record<string, unknown>;
  const verdict = judgeBuild({ meta: built.meta, run: built.run });
  const dir = join(OUT2, `${out}-${id}`); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "snapshot.json"), JSON.stringify(built.snapshot));
  writeFileSync(join(dir, "book.md"), manuscript(d));
  writeFileSync(join(dir, "card.txt"), renderCard(intakeOf(payloadFor(id)).intake));
  const L = <T,>(k: string) => (r[k] ?? []) as T[];
  const lines = [`# ${out}-${id} 재현 점검표(호출 0)`, "",
    `- 판정(judgeBuild): ${verdict.kind}${verdict.kind === "incomplete" ? ` · ${verdict.reason}` : ""}`,
    `- 다시 쓰기: ${JSON.stringify(r.rounds)} · P6 기록을 쓴 자리 ${used.length} · 기록 없는 자리 ${missed.length}(첫 원고 그대로 — 새 호출이 필요해 재현으로 판정할 수 없다: ${[...new Set(missed)].join(", ") || "없음"})`,
    `- 받기/버리기: 받음 ${L<{ target: unknown }>("applied").length || "(기록 없음)"} · 버림 ${L<{ kind: string }>("locks").filter(x => x.kind === "rejected").length}`,
    `- 결정론 고침: ${L<{ ok: boolean }>("det").filter(x => x.ok).length} 받음 / ${L<{ ok: boolean }>("det").length}`,
    `- 지움 ${L("deleted").length} · 되돌림 ${L("reverted").length} · 남은 차단(보류) ${L("hold").length}`, "",
    "## 버린 다시 쓰기(까닭)", ...L<{ at: string; detail: string; round: number }>("locks").filter(x => (x as { kind?: string }).kind === "rejected").map(x => `- ${x.at} #${x.round}: ${x.detail}`),
    "", "## 결정론 고침", ...L<{ at: string; rule: string; from: string; to: string; ok: boolean; why?: string }>("det").map(x => `- ${x.ok ? "받음" : "버림"} ${x.at} ${x.rule}: «${x.from}» → «${x.to}»${x.why ? ` (${x.why})` : ""}`),
    "", "## 지운 문장", ...L<{ at: string; rule: string; sentence: string; why: string }>("deleted").map(x => `- ${x.at} ${x.rule} (${x.why}): ${x.sentence}`),
    "", "## 남은 차단(발행 보류)", ...L<{ at: string; rule: string; sentence: string }>("hold").map(x => `- ${x.at} ${x.rule}: ${x.sentence}`),
    "", "## 남은 기록만 깃발(다시 쓰기 · 지우기 안 함)", ...L<{ at: string; rule: string; sentence: string }>("remainingFix").slice(0, 60).map(x => `- ${x.at} ${x.rule}: ${x.sentence.slice(0, 120)}`), ""];
  writeFileSync(join(dir, "check.md"), lines.join("\n"));
  return { id, verdict, used: used.length, missed: [...new Set(missed)], r, lines };
}

if (process.argv[1]?.endsWith("am2-7-repro.ts")) {
  const argv = process.argv.slice(2), out = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : "R7";
  const ids = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--out");
  void (async () => { for (const id of ids.length ? ids : BOOKS) { const x = await replayBook(id, out); console.log(argv.includes("--quiet") ? x.lines.slice(0, 7).join("\n") : x.lines.join("\n")); } })().catch(e => { console.error(e); process.exit(1); });
}
