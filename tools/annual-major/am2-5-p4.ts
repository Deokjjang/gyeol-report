/**
 * AM2-5 5부 P4 replay(호출 0): P4 저장 원고를 새 구조(문단 교체 · 지우기는 차단에만 · 같은 주장 설계 · 카드 고객 말)에 다시 넣는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-5-p4.ts annual-1|major-1
 * - 첫 호출: 그 묶음의 P4 첫 원고(snapshot meta.raw kind=first)를 그대로 돌려준다(작가가 같은 첫 원고를 썼다고 본다).
 * - 문단 교체 호출: 고칠 자리마다 P4 다시 쓰기 원고(kind=rewrite)의 같은 장·소제목·문단을 돌려준다(작가가 그 자리를 같은 글로 고쳤다고 본다).
 *   P4 다시 쓰기에 없던 자리는 비워 둔다(교체 없음 = 첫 원고 그대로).
 * 그러면 「걸리지 않은 문단은 바뀔 길이 없다」와 「교체가 새 차단을 만들면 그 문단만 되돌린다」를 저장 원고로 본다. P4 세운 차단 4문장이 결과 원고에 다시 생기는지 대조한다.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { memorySink } from "../../src/lib/ops/generation/sinks";
import { buildV5Snapshot } from "../../src/lib/writer/publish";
import type { V5BookDraft, V5Evidence } from "../../src/lib/writer/book";
import { parseChapters } from "../../src/lib/writer/format";
import type { StreamCompletionInput, StreamCompletionResult } from "../../src/lib/llm";
import { cases } from "./final";

const OUT2 = join(homedir(), "Desktop", "gyeol-review", "annual-major-02");
type Raw = { kind: string; text: string };
const norm = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");

export function replayStream(raws: readonly Raw[]) {
  const firsts = raws.filter(r => r.kind === "first"), rewrites = raws.filter(r => r.kind === "rewrite");
  // 원고의 장·소제목 머리글 서명(장 번호 + key 이름).
  const sig = (t: string) => parseChapters(t).map(c => `${c.n}:${c.sections.map(s => s.heading.trim()).filter(h => /월 · |년 [가-힣]{2}년/.test(h)).join(",")}`).join("|");
  const sections = (t: string) => parseChapters(t).flatMap(c => c.sections.map(s => ({ n: c.n, heading: s.heading.trim(), paragraphs: s.paragraphs })));
  const used: string[] = [];
  const stream = async (input: StreamCompletionInput): Promise<StreamCompletionResult> => {
    const usage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0 };
    const out = (text: string): StreamCompletionResult => { input.onText?.(text); return { text, finishReason: "complete", usage: { ...usage, outputTokens: Math.ceil(text.length / 1.5) }, costUsd: 0, requestId: "replay" }; };
    if (input.user.includes("\n고칠 자리:\n")) {
      const [, rest = ""] = input.user.split("\n고칠 자리:\n"); const [list = "", draft = ""] = rest.split("\n앞 원고:\n");
      const ids = [...list.matchAll(/^- \[¶([0-9.*]+)\]/gm)].map(m => m[1]);
      // 번호 → (장, 소제목 이름, 문단 번호 · 그 문단 글).
      let n = 0, heading = ""; const where = new Map<string, { n: number; heading: string; pi: string; text: string }>();
      for (const line of draft.split("\n")) { const ch = /^## (\d+)\./.exec(line); if (ch) { n = Number(ch[1]); continue; } const h = /^### (.+)$/.exec(line); if (h) { heading = h[1].trim(); continue; } const p = /^\[¶(\d+\.\d+\.(\d+|\*))\] (.*)$/.exec(line); if (p) where.set(p[1], { n, heading, pi: p[2], text: p[3] }); }
      const parts: string[] = [];
      for (const id of ids) {
        const w = where.get(id); if (!w) continue;
        for (const rw of rewrites) {
          const sec = sections(rw.text).find(s => s.n === w.n && s.heading === w.heading); if (!sec) continue;
          if (w.pi === "*") { if (sec.paragraphs.length) { parts.push(`[¶${id}]\n${sec.paragraphs.join("\n\n")}`); used.push(`${id}←rewrite`); } break; }
          // 같은 문단: 같은 번호의 문단(첫 원고와 첫 두 어절이 같은 것 먼저).
          const i = Number(w.pi), cand = sec.paragraphs.find(p => norm(p).slice(0, 10) === norm(w.text).slice(0, 10)) ?? sec.paragraphs[i];
          if (cand && norm(cand) !== norm(w.text)) { parts.push(`[¶${id}]\n${cand}`); used.push(`${id}←rewrite`); }
          break;
        }
      }
      return out(parts.join("\n"));
    }
    const want = input.user.split("이번 묶음의 장 머리글은 아래 그대로입니다.")[1] ?? "";
    const heads = [...want.matchAll(/^## (\d+)\. .*?(?: \(### (.+)\))?$/gm)].map(m => `${m[1]}:${(m[2] ?? "").split(" / ### ").join(",")}`).join("|");
    const hit = firsts.find(r => sig(r.text) === heads) ?? firsts.find(r => sig(r.text).split("|")[0].split(":")[0] === heads.split("|")[0].split(":")[0]);
    return out(hit?.text ?? "");
  };
  return { stream, used };
}

async function main() {
  const id = process.argv[2] ?? "annual-1", at = "2026-12-02T03:00:00.000Z";
  const c = cases().find(x => x.id === id)!;
  const snap = JSON.parse(readFileSync(join(OUT2, `P4-${id}`, "snapshot.json"), "utf8")) as { evidencePacket: V5Evidence };
  const { stream, used } = replayStream(snap.evidencePacket.meta.raw as unknown as Raw[]);
  const built = await buildV5Snapshot({ payload: c.payload as never, reportId: `report_replay${id.replace(/[^a-z0-9]/g, "")}0000`, policyAt: at, sink: memorySink() as never, deps: { provider: "anthropic", model: "claude-sonnet-5-5", fallback: null, stream: stream as never, people: async () => [] } });
  const d = built.snapshot.draft as unknown as V5BookDraft, r = (built.snapshot.evidencePacket as unknown as V5Evidence).meta.review as Record<string, unknown>;
  const text = d.chapters.flatMap(ch => ch.sections.flatMap(s => s.paragraphs)).join("\n");
  console.log(`${id} replay: 다시 쓰기 ${JSON.stringify(r.rounds)} · 교체에 쓴 P4 다시 쓰기 문단 ${used.length} · 되돌림 ${JSON.stringify(r.reverted)} · 지움 ${(r.deleted as unknown[]).length}(${JSON.stringify((r.deleted as { rule: string }[]).map(x => x.rule))}) · 남은 차단 ${JSON.stringify((r.remainingHard as { rule: string; at: string }[]).map(x => `${x.at}:${x.rule}`))} · 처리 ${JSON.stringify((r.disposition as { counts: unknown }).counts)}`);
  if (id === "annual-1") {
    const ch = (n: number) => d.chapters.find(x => x.n === n)!;
    const key = (k: string) => ch(7).sections.find(s => s.heading === k)?.paragraphs.join(" ") ?? "";
    const checks: [string, boolean, string][] = [
      ["#1 2.1 ¶1 「축오해가 아닌」(다시 쓰기 회귀)", !text.includes("축오해가 아닌"), (ch(2).sections[0]?.paragraphs[0] ?? "").slice(0, 120)],
      ["#2 2.2 ¶1 「임인월에서 … 신해월 사이에」(다시 쓰기 회귀)", !/임인\S*월에서 11월 · 신해\S*월 사이에/.test(text), (ch(2).sections[1]?.paragraphs[0] ?? "").slice(0, 160)],
      ["#3 2028년 1월 「겹친 정인」 고아(핵심 문장 지움)", /대운도 정인/.test(key("2027-M12")), key("2027-M12").slice(0, 160)],
      ["#4 9.2 「이 세 달」 고아(앞 문장 지움)", !/^움직일 때는 이 세 달에 맞춰 두세요/.test(ch(9).sections[1]?.paragraphs[0] ?? ""), (ch(9).sections[1]?.paragraphs[0] ?? "").slice(0, 160)],
    ];
    for (const [what, ok, ctx] of checks) console.log(`${ok ? "생기지 않음" : "다시 생김"} · ${what}\n   ${ctx}`);
  }
}
if (process.argv[1]?.endsWith("am2-5-p4.ts")) void main().catch(e => { console.error(e); process.exit(1); });
