/** AM2-6(호출 0): 저장 원고 읽기 — 판독 묶음의 snapshot을 검사용 장 원고(FinalChapter)로. 한자 주석 · 시스템 머리 문장은 뗀다(am2-5-fp와 같은 손질). */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { stripHanja } from "../../src/lib/writer/safety/p6e";
import { cases } from "./final";
import { FRESH } from "./am2-5-fresh";
import { FRESH6 } from "./am2-6-fresh";
import { intakeOf } from "./am2-brief";

export const REVIEW = join(homedir(), "Desktop", "gyeol-review");
export const OUT2 = join(REVIEW, "annual-major-02");
export const payloadFor = (id: string): unknown => cases().find(x => x.id === id)?.payload ?? [...FRESH, ...FRESH6].find(x => x.id === id)?.payload();
/** 판독에 쓴 저장 원고: AM-01 세운 6 · 대운 4 · P~P4 두 권씩(18권, AM2-5 오탐 검토와 같은 묶음) + P5 네 권. */
export const SAVED: readonly { name: string; path: string; id: string }[] = [
  ...cases().filter(c => c.product !== "launch").map(c => ({ name: `AM-${c.id}`, path: join(REVIEW, "annual-major", c.id, "snapshot.json"), id: c.id })),
  ...["P", "P2", "P3", "P4"].flatMap(st => ["annual-1", "major-1"].map(id => ({ name: `${st}-${id}`, path: join(OUT2, `${st}-${id}`, "snapshot.json"), id }))),
  ...["annual-1", "annual-p5", "major-1", "major-p5"].map(id => ({ name: `P5-${id}`, path: join(OUT2, `P5-${id}`, "snapshot.json"), id })),
];
export function loadSaved(path: string, id: string) {
  if (!existsSync(path)) return null;
  const snap = JSON.parse(readFileSync(path, "utf8"));
  const { brief, intake, plan } = intakeOf(payloadFor(id));
  const heads = new Set(intake.chapters.flatMap(ch => (ch.keys ?? []).map(kp => kp.head.replace(/[^가-힣]/g, ""))));
  const chs: FinalChapter[] = snap.draft.chapters.map((ch: { n: number; id: string; title: string; sections: { heading: string; paragraphs: string[] }[]; keys?: string[] }) => ({ n: ch.n, id: ch.id, title: ch.title, source: "writer", chars: 0, ...(ch.keys ? { keys: ch.keys } : {}),
    sections: ch.sections.map(s => ({ heading: s.heading, paragraphs: s.paragraphs.map(p0 => stripHanja(p0).text).map((p, i) => (i === 0 && ch.keys ? p.split(/(?<=[.!?])\s+/).filter(x => !heads.has(x.replace(/\([^)]*\)/g, "").replace(/[^가-힣]/g, ""))).join(" ") : p)).filter(Boolean) })) }));
  return { snap, brief, intake, plan, chs };
}
