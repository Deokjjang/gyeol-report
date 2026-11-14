/**
 * AM2-8 3부 · 6부 관문 ③ 도구 셈(정본, 호출 0): 판독이 key마다 인용한 「이 사람만의 문장」에 같은 틀 도구(template.ts)를 대어 센다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-third.ts <cites.json> <판 접두(P7)> [책 …]
 * cites.json: { "<책>": { written, strict, keys: [{ label, verdict, templateExcluded, cites: [] }] } } — 판독(서브에이전트 rubric)이 낸 것.
 * 도구 셈 = 인용이 있는 key(있음 · 약함, 판독의 틀 셈으로만 빠진 key 포함) 가운데, 인용 문장이 장 안 같은 틀 셋째 아래인 key 수.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { personalCount } from "../../src/lib/writer/chunked/template";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";

type Cite = { label: string; verdict: string; templateExcluded?: boolean; cites: string[] };
export function toolThird(dir: string, id: string, keys: readonly Cite[]) {
  const snap = JSON.parse(readFileSync(join(dir, "snapshot.json"), "utf8"));
  const { brief, intake } = intakeOf(payloadFor(id));
  const keyCh = intake.chapters.find(c => c.keys)!, labelOf = new Map(keyCh.keys!.map(k => [k.key, k.label] as const));
  const norm = (l: string) => l.replace(/\s/g, "").replace(/년$/, "");
  const keyOfLabel = (l: string) => { const y = /^(\d{4})(?!년 \d)/.exec(l.trim()); if (y && !/월/.test(l)) return keyCh.keys!.find(k => k.key === y[1])?.key;
    return keyCh.keys!.find(k => norm(k.label) === norm(l) || norm(k.label).startsWith(norm(l)) || k.key === l)?.key; };
  const chs: FinalChapter[] = snap.draft.chapters.map((c: { n: number; title: string; sections: { heading: string; paragraphs: string[] }[] }) => ({ n: c.n, id: "", title: c.title, source: "writer", chars: 0, ...(c.n === keyCh.n ? { keys: keyCh.keys!.map(k => k.key) } : {}), sections: c.sections }));
  const cites = new Map<string, string[]>();
  for (const k of keys) { const key = keyOfLabel(k.label); if (!key) continue; if (/있음|약함/.test(k.verdict) || k.templateExcluded) cites.set(key, k.cites.filter(Boolean)); }
  const r = personalCount(chs, cites, { names: [brief.person.callName, brief.person.name].filter(n => n.length >= 2) }, new Set(), { skipKeyHead: true });
  return { ...r, dropped: r.dropped.map(d => `${labelOf.get(d.key) ?? d.key}(${d.nth}번째)`) };
}
if (process.argv[1]?.endsWith("am2-8-third.ts")) {
  const [file, prefix, ...ids] = process.argv.slice(2);
  const all = JSON.parse(readFileSync(file, "utf8")) as Record<string, { written: string; strict: string | null; keys: Cite[] }>;
  console.log("| 권 | 사람 판독(쓴 셈) | 엄한 셈 | 도구 셈 | 도구가 틀로 뺀 key | 판독이 틀로만 뺀 key |\n|---|---|---|---|---|---|");
  for (const id of ids.length ? ids : Object.keys(all).filter(x => !x.startsWith("_"))) { const b = all[id]; const r = toolThird(join(OUT2, `${prefix}-${id}`), id, b.keys);
    console.log(`| ${id} | ${b.written} | ${b.strict ?? "—"} | **${r.have}/${r.total}** | ${r.dropped.join(", ") || "없음"} | ${b.keys.filter(k => k.templateExcluded).map(k => k.label).join(", ") || "없음"} |`); }
}
