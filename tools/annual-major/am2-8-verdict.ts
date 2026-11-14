/**
 * AM2-8 6부 판정 파일 만들기(호출 0): ~/Desktop/gyeol-review/annual-major-02/<판>/verdict.md · read-this.md. 그 밖은 <판>/_raw/.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-verdict.ts --dir P8 --books annual-p6b,annual-1 --product 세운 --question "…" --sha <SHA> --cum 12.34 [--stopped "…"] [--after "…"] [--decide "가||나||다"]
 * 입력(책마다 <판>/_raw/<책>/): snapshot.json(am2-run --dir <판>/_raw) · judge.json(서브에이전트 판독 — 아래 꼴).
 *   judge.json = { blocks: [{ at, code, root, origin, paragraph, problem, fix }], bounds: [{ at, code, notice: "예"|"아마"|"아니오", root, origin, paragraph, sentence, problem, fix }],
 *                  third: { keys: [{ label, verdict, cites: [] }] }, prior: [{ line, status: "해결"|"남음"|"새로" }], decisions?: [] }
 * ③은 같은 틀 도구 셈(am2-8-third.ts toolThird)이 정본이다. 경미는 기계 셈 숫자만(rubric 8-1).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { judgeBuild } from "../../src/lib/ops/generation/policy";
import { FLOW_WORD } from "../../src/lib/brief/labels";
import type { V5BookDraft } from "../../src/lib/writer/book";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";
import { toolThird } from "./am2-8-third";

type Judge = { blocks: { at: string; code: string; root: number | string; origin: string; paragraph: string; problem: string; fix: string }[]; bounds: { at: string; code: string; notice: string; root: number | string; origin: string; paragraph: string; sentence: string; problem: string; fix: string }[];
  third: { keys: { label: string; verdict: string; cites: string[] }[] }; prior?: { line: string; status: string }[]; decisions?: string[] };
const arg = (k: string, d = "") => { const a = process.argv.slice(2), i = a.indexOf(k); return i >= 0 ? a[i + 1] ?? d : d; };
const dirName = arg("--dir", "P8"), base = join(OUT2, dirName), raw = join(base, "_raw");
const books = arg("--books").split(",").filter(Boolean), product = arg("--product", "세운");
const MACHINE = ["template_third", "cross_copy8", "screen_copy6", "advice_cliche", "chapter_repeat", "rel_echo", "head_echo", "link_template"];
type Row = { id: string; input: string; blocks: number; yes: number; maybe: number; third: string; thirdN: number; total: number; hold: string; held: boolean; cost: number; judge: Judge; draft: V5BookDraft; machine: Record<string, number> };
const rows: Row[] = books.map(id => {
  const snap = JSON.parse(readFileSync(join(raw, id, "snapshot.json"), "utf8")), judge = JSON.parse(readFileSync(join(raw, id, "judge.json"), "utf8")) as Judge;
  const meta = snap.evidencePacket.meta, v = judgeBuild({ meta, run: null });
  const { brief } = intakeOf(payloadFor(id)), f = brief.person.facts;
  const t = toolThird(join(raw, id), id, judge.third.keys.map(k => ({ ...k, templateExcluded: false })));
  const review = meta.review as { remainingFix?: { rule: string }[]; remainingRepeat?: { rule: string }[]; holdRetry?: { kept: boolean } };
  const machine: Record<string, number> = {}; for (const x of [...(review.remainingFix ?? []), ...(review.remainingRepeat ?? [])]) if (MACHINE.includes(x.rule)) machine[x.rule] = (machine[x.rule] ?? 0) + 1;
  const JOB: Record<string, string> = { employee: "직장인", self_employed: "자영업", freelancer: "프리랜서", student: "학생", job_seeker: "취준", unemployed: "쉬는 중", "": "일 미입력" };
  const REL: Record<string, string> = { single: "솔로", dating: "연애 중", married: "기혼", unknown: "미입력" };
  return { id, input: `만 ${brief.person.age} · ${JOB[f.job.status] ?? f.job.status} · ${REL[f.relationship] ?? f.relationship} · ${f.mbti ?? "MBTI 없음"}`, blocks: judge.blocks.length, yes: judge.bounds.filter(b => b.notice === "예").length, maybe: judge.bounds.filter(b => b.notice === "아마").length,
    third: `${t.have}/${t.total}`, thirdN: t.have, total: t.total, held: v.kind === "incomplete", hold: v.kind === "incomplete" ? `예(${v.reason.replace(/^partial:/, "")}${review.holdRetry ? ` · 다시 부름 ${review.holdRetry.kept ? "받음" : "버림"}` : ""})` : "아님", cost: meta.costUsd as number, judge, draft: snap.draft as V5BookDraft, machine };
});
const pass = (r: Row) => r.blocks === 0 && r.yes === 0 && r.thirdN >= Math.ceil(r.total * 2 / 3);
const weakest = [...rows].sort((a, b) => b.blocks - a.blocks || b.yes - a.yes || a.thirdN - b.thirdN)[0];
const spent = rows.reduce((a, r) => a + r.cost, 0);
const allPass = rows.length > 0 && rows.every(pass);
const minThird = rows.length ? rows.map(r => `${r.thirdN}`).sort((a, b) => Number(a) - Number(b))[0] : "—";
const why = weakest ? `${weakest.blocks ? `차단 ${weakest.blocks}` : weakest.yes ? `경계 예 ${weakest.yes}` : `③ ${weakest.third}`}로 가장 약함` : "";
const clip = (t: string, n: number) => (t.length > n ? `${t.slice(0, n)}…` : t);
const date = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
const L: string[] = [
  `# ${dirName} 판정 — ${product} (${date})`,
  `- 이번 판의 질문: ${arg("--question")}`,
  `- 코드 ${arg("--sha")} · 원고 새로 생성 · 쓴 돈 $${spent.toFixed(4)} (P 누적 $${arg("--cum")} / $15.0)`,
  `- 결론: ${allPass ? "PASS" : "FAIL"} — ① 차단 ${rows.reduce((a, r) => a + r.blocks, 0)} · ② 경계 예 ${rows.reduce((a, r) => a + r.yes, 0)} · ③ ${minThird}/13(권별 최저) · 보류 ${rows.filter(r => r.held).length}/${rows.length}${arg("--stopped") ? ` · ${arg("--stopped")}` : ""}`,
  `- 덕짱이 읽을 권: ${weakest?.id ?? "—"} — ${why}`,
  "## 권별", "| 권 | 입력 요약 | 차단 | 경계 예 | 경계 아마 | ③(도구) | 보류 | 비용 |", "|---|---|---|---|---|---|---|---|",
  ...rows.map(r => `| ${r.id} | ${r.input} | ${r.blocks} | ${r.yes} | ${r.maybe} | ${r.third} | ${r.hold} | $${r.cost.toFixed(4)} |`),
  "## 차단 · 경계 「예」 (전부)",
  ...rows.flatMap(r => [...r.judge.blocks.map(b => ({ ...b, kind: "차단" })), ...r.judge.bounds.filter(b => b.notice === "예").map(b => ({ ...b, kind: "경계 예" }))].map(b => [`### ${r.id} · ${b.at} · ${b.code} · 뿌리 ${b.root} · ${b.origin}`, `> ${clip(b.paragraph, 260)}`, `- 문제: ${clip(b.problem, 170)} · 고칠 방향: ${clip(b.fix, 90)}`].join("\n"))),
  ...(rows.every(r => !r.blocks && !r.yes) ? ["- 없음"] : []),
  "## 경계 「아마」 (위치 + 한 문장)",
  ...rows.flatMap(r => r.judge.bounds.filter(b => b.notice === "아마").map(b => `- ${r.id} · ${b.at} · ${b.code}: 「${clip(b.sentence || b.paragraph, 60)}」 — ${clip(b.problem, 70)}`)),
  ...(rows.every(r => !r.maybe) ? ["- 없음"] : []),
  `- 기계 셈(경미, 판독 안 함): ${rows.map(r => `${r.id} ${Object.entries(r.machine).map(([k, n]) => `${k} ${n}`).join(" · ") || "0"}`).join(" / ")}`,
  "## 지난 판 줄 상태", "| 권 | 해결 | 남음 | 새로 | 남은 줄 |", "|---|---|---|---|---|",
  ...rows.map(r => { const pr = r.judge.prior ?? [], n = (st: string) => pr.filter(p => p.status === st).length;
    return `| ${r.id} | ${n("해결")} | ${n("남음")} | ${n("새로")} | ${pr.filter(p => p.status === "남음").map(p => clip(p.line.replace(/\s*—.*$/, "").replace(/^\[[^\]]*\]\s*/, "").replace(/[\s·①]+$/, ""), 28)).join(" · ") || "—"} |`; }),
  ...(arg("--after") ? ["", `P8 뒤 고침(재현만 확인): ${arg("--after")}`] : []),
  "## 뿌리 표", "| 뿌리 | 이번 판 결함 | 상태 |", "|---|---|---|",
  ...["1 재료 범위", "2 문장 꼴 배정", "3 이 사람 재료", "4 재료 사전 품질", "5 다시 쓰기 받기 기준", "6 검사 오탐·미탐", "7 화면 입력 거름", "8 장 사이 되풀이"].map(nm => { const n = nm.split(" ")[0];
    const hits = rows.flatMap(r => [...r.judge.blocks, ...r.judge.bounds.filter(b => b.notice !== "아니오")].filter(b => String(b.root).startsWith(n)).map(b => `${r.id} ${b.at}`));
    return `| ${nm} | ${hits.length ? hits.join(" · ") : "0"} | ${hits.length ? "남음" : "이번 판 0"} |`; }),
  // --decide "가||나||다": 판독 decisions를 모아 사람이 고른 3개 이내(없으면 판독 decisions 앞 3개).
  "## 정할 것 (3개 이내)", ...(arg("--decide") ? arg("--decide").split("||") : [...new Set(rows.flatMap(r => r.judge.decisions ?? []))]).slice(0, 3).map((d, i) => `${i + 1}. ${d}`),
];
let text = L.join("\n");
if (text.length > 5000) text = `${text.slice(0, 4900)}\n…(넘친 부분은 _raw/<책>/judge.json)`;
writeFileSync(join(base, "verdict.md"), `${text}\n`);

// read-this.md: 가장 약한 1권을 고객 화면 순서 그대로(머리 문장 · 화면 카드 요약 포함, 검사 표시 없음). 맨 끝에만 「판독이 잡은 줄」.
if (weakest) {
  const d = weakest.draft as V5BookDraft & { headline?: string; coverLine?: string; finalLine?: string; timeline?: { cards?: { key: string; label: string; flow: { score: number }; badges: { label: string; with?: string }[]; todo?: string; imageLine?: string; caution?: string; good?: string }[] } };
  const cards = new Map((d.timeline?.cards ?? []).map(c => [c.key, c] as const));
  const R: string[] = [`# ${d.title}`, "", ...(d.coverLine ? [`**${d.coverLine}**`, ""] : []), ...(d.headline ? [d.headline, ""] : [])];
  for (const ch of d.chapters) {
    R.push(`## ${ch.n}. ${ch.title}`, "");
    for (const s of ch.sections) {
      const c = cards.get(s.heading);
      R.push(`### ${c ? c.label.split(" (")[0] : s.heading}`, "");
      if (c) R.push(`> 흐름 ${FLOW_WORD[c.flow.score] ?? ""}${c.badges.length ? ` · ${c.badges.map(b => `${b.label.replace(/\(반쯤\)$/, " 반합")}${b.with ? `(${b.with})` : ""}`).join(" · ")}` : ""}${c.imageLine ? ` · ${c.imageLine}` : ""}${c.todo ? ` · 할 일: ${c.todo}` : ""}`, "");
      for (const p of s.paragraphs) R.push(p.replace(/[⟪⟫]/g, ""), "");
    }
  }
  if (d.finalLine) R.push(`*${d.finalLine}*`, "");
  R.push("---", "## 판독이 잡은 줄", ...[...weakest.judge.blocks.map(b => `- ${b.at} — 차단 ${b.code}: ${b.problem}`), ...weakest.judge.bounds.filter(b => b.notice !== "아니오").map(b => `- ${b.at} — 경계 ${b.notice} ${b.code}: ${b.problem}`)]);
  writeFileSync(join(base, "read-this.md"), `${R.join("\n")}\n`);
}
console.log(`${join(base, "verdict.md")} (${text.length}자) · read-this: ${weakest?.id ?? "—"} · ${existsSync(join(base, "read-this.md")) ? "있음" : "없음"}`);
