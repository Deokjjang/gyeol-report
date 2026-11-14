/** AM2-7 7부(호출 0): 4종 회귀 — 개발 세트의 4종 사례(종합 · 커리어 · 연애 · 궁합)에서 브리프 해시와 작가 지시 글(시스템 · 장 목록)을 해시로. 옛 코드 worktree에서도 같은 파일로 돌려 맞댄다. */
import { createHash } from "node:crypto";
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { briefHash, kstDate, writerKnowledge } from "../../src/lib/writer/publish";
import { cases } from "./final";
const AT = "2026-12-02T03:00:00.000Z", h = (t: string) => createHash("sha256").update(t).digest("hex").slice(0, 12);
const { k } = writerKnowledge();
for (const c of cases().filter(x => x.product === "launch")) {
  const brief = buildBrief(payloadToBriefInput(c.payload as never, kstDate(AT), AT) as never, k);
  const p = buildWriterPrompt(brief, { knowledge: k });
  console.log(`${c.id} ${c.product} brief ${briefHash(brief).slice(0, 12)} · json ${h(JSON.stringify(brief))} · prompt ${h(JSON.stringify(p))}`);
}
// 공유 검사(factsheet · lint) 변경이 4종 원고의 깃발을 바꾸는지: p6d 기준 원고 발행본에 같은 lint를 대어 규칙별 수.
import { readdirSync, readFileSync } from "node:fs";
import { factSheetFor, lintContext } from "../../src/lib/writer/publish";
import { lintBook } from "../../src/lib/writer/safety/p6c";
for (const f of readdirSync("docs/v5/baseline/p6d").filter(x => x.endsWith(".snapshot.json"))) {
  const snap = JSON.parse(readFileSync(`docs/v5/baseline/p6d/${f}`, "utf8")) as { draft: { chapters: { n: number; id: string; title: string; sections: { heading: string; paragraphs: string[] }[] }[] }; evidencePacket: { input: unknown } };
  try {
    const brief = buildBrief(payloadToBriefInput(snap.evidencePacket.input as never, kstDate(AT), AT) as never, k), plan = buildWriterPrompt(brief, { knowledge: k }).chapters;
    const sheet = factSheetFor(snap.evidencePacket.input as never, AT, brief, k);
    const chs = snap.draft.chapters.map(c => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(x => ({ heading: x.heading, paragraphs: x.paragraphs })) })) as never;
    const t: Record<string, number> = {}; for (const fl of lintBook(chs, lintContext(brief, k, plan, [], undefined, sheet))) t[fl.rule] = (t[fl.rule] ?? 0) + 1;
    console.log(`${f}: ${Object.entries(t).sort().map(([r, n]) => `${r} ${n}`).join(" · ")}`);
  } catch (e) { console.log(`${f}: 건너뜀 ${String(e).slice(0, 80)}`); }
}
