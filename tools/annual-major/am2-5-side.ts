/**
 * AM2-5 6부 덕짱님 읽기용 side-by-side(호출 0): 같은 사람의 달·해 장(세운 7장 · 대운 5장)을 P4와 P5로 key마다 나란히.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-5-side.ts <out.md> [--a P5 --b P6] [--ids annual-p6b,major-p6a]   (AM2-6 9부: 두 판을 골라 — 기본 P4 · P5 · AM2-7 8부: 사람을 골라)
 * 각 key: 화면이 보여 주는 것(핵심 한 줄 · 관계 배지) → P4 본문 → P5 본문(머리 문장 포함 — 고객이 읽는 그대로, 한자 주석 그대로).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { coreLine, coreOf } from "../../src/lib/brief/core";
import { yearDayunTg } from "../../src/lib/writer/bookAm";
import type { V5BookDraft } from "../../src/lib/writer/book";

const R = join(homedir(), "Desktop", "gyeol-review", "annual-major-02");
const load = (dir: string) => JSON.parse(readFileSync(join(R, dir, "snapshot.json"), "utf8")) as { draft: V5BookDraft };
const arg = (k: string, d: string) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d), A = arg("--a", "P4"), B = arg("--b", "P5");
const out: string[] = [`# ${A} ↔ ${B} 같은 사람 달·해 장 나란히 읽기`, "", A === "P4" ? "AM2-5 6부, 덕짱님 판단용(출시 관문 ④). 같은 입력, 같은 엔진 값이다." : B === "P7" ? `AM2-7 8부, 덕짱님 판단용(관문 ④). 같은 입력, 같은 엔진 값이다(${B}는 AM2-7 코드).` : `AM2-6 9부, 덕짱님 판단용. 같은 입력, 같은 엔진 값이다(${B}는 AM2-6 코드).`, "", "- 「화면」 줄은 카드가 결정론으로 보여 주는 것이다(본문 판정 밖). 각 판 본문 첫 문장은 시스템 머리 문장이다.", "- 세운은 한서윤(annual-1, 7장 13달), 대운은 윤태민(major-1, 5장 10해)이다.", ""];
const IDS = arg("--ids", "annual-1,major-1").split(",").filter(Boolean);
for (const id of IDS) {
  const p4 = load(`${A}-${id}`), p5 = load(`${B}-${id}`);
  const ch4 = p4.draft.chapters.find(c => c.keys)!, ch5 = p5.draft.chapters.find(c => c.keys)!;
  const cards = new Map((p5.draft.timeline?.cards ?? []).map(c => [c.key, c] as const));
  const year = p5.draft.annual?.year;
  const dt = id.startsWith("annual") && year ? yearDayunTg(p5.draft, year) : undefined;
  out.push(`## ${id === "annual-1" ? "세운 · 한서윤 · 7장 「1월 다리와 달마다 펼쳐 보기」" : id === "major-1" ? "대운 · 윤태민 · 5장 「앞으로 10년, 해마다」" : `${id.startsWith("annual") ? "세운" : "대운"} · ${id} · ${ch5.n}장 「${ch5.title}」`}`, "");
  for (const key of ch5.keys ?? []) {
    const card = cards.get(key); if (!card) continue;
    const name = card.kind === "month" ? card.label.split(" (")[0] : `${card.key}년 ${card.ganji.hangul}년`;
    const body = (ch: typeof ch5) => (ch.sections.find(s => s.heading === key)?.paragraphs ?? []).join("\n\n") || "(없음)";
    out.push(`### ${name}`, "", `- 화면: ${coreLine(coreOf(card, dt ? { dayunTenGod: dt } : {}))} · 배지 ${card.badges.map(b => b.label.replace(/\(반쯤\)$/, " 반합")).join(" · ")}`, "", `**${A}**`, "", body(ch4), "", `**${B}**`, "", body(ch5), "", "---", "");
  }
}
const dest = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : join(R, "side-by-side.md");
writeFileSync(dest, out.join("\n"));
console.log(`썼다: ${dest}`);
