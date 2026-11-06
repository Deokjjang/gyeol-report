/**
 * 최종판2 저장본 검사(역행 금지 2, 호출 0): 저장본 13권(P6d 4·P6e 5·최종 4)에 새 정리·검사를 돌려
 *  ① 새로 잡힌 문장 전부(기준 트리 = 시작 커밋 270a3676의 같은 검사와 차이) ② 이번 판독 인용 결함을 무엇이 잡는지 ③ 표지·1장 첫 이미지 ④ 정리 꼴.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/stored-check.ts <스냅샷 폴더> <기준 깃발.json> [--md docs/v5/final2/stored-check.md]
 * 기준 깃발은 기준 트리에서 tools/final2/stored-flags.ts(같은 파일)로 만든다.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { coverIssue, lintContext, writerKnowledge } from "../../src/lib/writer/publish";
import { buildWriterPrompt, renderWriterBrief } from "../../src/lib/writer/prompt";
import { tidyBook } from "../../src/lib/writer/safety/p6c";
import { ROOT } from "../llm/env";
import { briefOfSnap, lintStored } from "../final/replay";

type Flag = { book: string; rule: string; detail: string; at: string; sentence: string };
const [dir, baseFile] = process.argv.slice(2);
const base = JSON.parse(readFileSync(baseFile, "utf8")) as Flag[];
const { k } = writerKnowledge();

/** 이번 판독 인용(명령 1번) — 잡는 곳: lint 규칙 / 정리 / 표지 / 브리프 재료. */
const QUOTES: readonly { item: string; book: string; quote: RegExp; how: "lint" | "cover" | "tidy" | "brief"; label: string }[] = [
  { item: "1-1", book: "final-deokmin-career", quote: /한여름 도시 아스팔트 위에 선 큰 나무/, how: "lint", label: "커리어 1장 「한여름 도시 아스팔트 위에 선 큰 나무」" },
  { item: "1-1", book: "final-deokmin-love", quote: /한여름 도시 아스팔트 위에 선 큰 나무/, how: "cover", label: "연애 표지 「한여름 도시 아스팔트 위에 선 큰 나무」" },
  { item: "1-1", book: "final-deokmin-jiwoo", quote: /도시 아스팔트 위에서도 쭉 뻗어 오르는 큰 나무/, how: "lint", label: "궁합 「도시 아스팔트 위에서도 쭉 뻗어 오르는 큰 나무」" },
  { item: "1-1", book: "final-sodam-full-dating", quote: /빗속에서도 꺼지지 않는 캠핑 랜턴/, how: "lint", label: "종합 1장 「빗속에서도 꺼지지 않는 캠핑 랜턴」(하람과 같음)" },
  { item: "1-1", book: "final-sodam-full-dating", quote: /카페 사장의 불/, how: "cover", label: "종합 표지 「빗속에서도 꺼지지 않는 카페 사장의 불」(이전 책 그림과 겹침)" },
  { item: "1-1", book: "final-sodam-full-dating", quote: /퇴근 시간에 맞춰 따뜻한 국물을 데워 두는/, how: "lint", label: "「상대의 퇴근 시간에 맞춰 따뜻한 국물을 데워 두는」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /가운데에 서고 발표를 자원하는 쪽은 최지우님/, how: "lint", label: "역할 뒤바뀜 「사진을 찍을 때 가운데에 서고 발표를 자원하는 쪽은 최지우님」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /최지우님은 거슬리는 말에 그 자리에서 바로 받아치는/, how: "lint", label: "최지우 8장 「거슬리는 말에 그 자리에서 바로 받아치는」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /거슬리는 말에 그 자리에서 받아치는 쪽은 최지우님/, how: "lint", label: "최지우 7장 「거슬리는 말에 그 자리에서 받아치는 쪽은」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /장덕민님은 다툰 직후에 곧바로 맞서기보다 한 박자 두고/, how: "lint", label: "장덕민 7장 「한 박자 두고」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /곱씹는 시간이 필요한 장덕민님/, how: "lint", label: "장덕민 9장 「곱씹는 시간이 필요한 장덕민님」" },
  { item: "1-3", book: "final-deokmin-jiwoo", quote: /두 사람은 하고 싶은 일이 떠오르면 바로 말로 풀어내는/, how: "lint", label: "두 사람 묶음 「두 사람은 하고 싶은 일이 떠오르면 바로 말로 풀어내는 편」" },
  { item: "1-4", book: "final-deokmin-jiwoo", quote: /갑·신·묘·오 글자/, how: "lint", label: "「현침살이 있어서 갑·신·묘·오 글자가 겹친 만큼」(午 없음)" },
  { item: "1-5", book: "final-deokmin-career", quote: /만들고 넓히는 힘이 큰 확장형/, how: "lint", label: "「당신의 사업은 만들고 넓히는 힘이 큰 확장형」(식상 약)" },
  { item: "1-6", book: "final-deokmin-love", quote: /자녀의 성별이나 수를 말하는 것이 아니라/, how: "lint", label: "「자녀의 성별이나 수를 말하는 것이 아니라」" },
  { item: "1-6", book: "final-deokmin-love", quote: /결혼 여부를 정해 주는 것은 아닙니다/, how: "lint", label: "「결혼 여부를 정해 주는 것은 아닙니다」" },
  { item: "1-6", book: "final-sodam-full-dating", quote: /구체적인 일을 말하는 건 아닙니다/, how: "lint", label: "「구체적인 일을 말하는 건 아닙니다」" },
  { item: "1-6", book: "final-deokmin-career", quote: /지어낸 연차 없이/, how: "lint", label: "「지어낸 연차 없이」" },
  { item: "1-6", book: "final-deokmin-career", quote: /상태가 대표라면/, how: "lint", label: "「상태가 대표라면」" },
  { item: "1-6", book: "final-deokmin-love", quote: /토 과다/, how: "tidy", label: "「토 과다」 → 흙 기운이 많아서" },
  { item: "1-6", book: "final-deokmin-love", quote: /이번 가을 남은 두 달/, how: "tidy", label: "11월 「이번 가을 남은 두 달」 → 2026년 남은 두 달" },
  { item: "1-8", book: "final-deokmin-career", quote: /태어난 날 땅 글자의 갑신/, how: "lint", label: "「태어난 날 땅 글자의 갑신」(갑신은 일주)" },
  { item: "1-8", book: "final-sodam-full-dating", quote: /가장 먼저 다가가 분위기를 풀어 주는/, how: "lint", label: "종합 1장 「가장 먼저 다가가 분위기를 풀어 주는」(INTP)" },
];

const files = readdirSync(dir).filter(x => x.endsWith(".snapshot.json")).sort();
const flagsNew: Flag[] = [], covers: string[] = ["| 책 | 표지 | 판정 |", "|---|---|---|"];
const tidyHits = new Map<string, string>();
for (const f of files) {
  const book = f.replace(/\.snapshot\.json$/, ""), snap = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const { flags, brief } = lintStored(snap);
  for (const x of flags) flagsNew.push({ book, rule: x.rule, detail: x.detail ?? "", at: `${x.chapter}.${x.section}.${x.paragraph}`, sentence: x.sentence });
  const cover = (snap.draft.coverLine ?? snap.draft.coreImage?.line ?? snap.draft.pairImage?.line ?? "") as string;
  const issue = coverIssue(cover, brief, brief.chart.avoidImages ?? []);
  covers.push(`| ${book} | ${cover} | ${issue ? `${issue.level}: ${issue.reason}` : "통과"} |`);
  // 정리 꼴(토 과다·이번 가을 남은 두 달): 저장 본문에 정리만 돌려 바뀐 문장.
  const plan = buildWriterPrompt(brief, { knowledge: k }).chapters, ctx = lintContext(brief, k, plan, []);
  const fin = snap.draft.chapters.map((c: { n: number; id: string; title: string; sections: { heading: string; paragraphs: string[] }[] }) => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(s => ({ heading: s.heading, paragraphs: [...s.paragraphs] })) }));
  const after = tidyBook(fin, ctx).chapters;
  fin.forEach((c: { sections: { paragraphs: string[] }[] }, ci: number) => c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { const q = after[ci].sections[si].paragraphs[pi]; if (/토 과다|[목화금수] 과다|이번 가을 남은/.test(p) && q !== p) tidyHits.set(`${book}|${p.match(/[^.?!]*(과다|이번 가을 남은)[^.?!]*[.?!]?/)?.[0] ?? p.slice(0, 60)}`, q.match(/[^.?!]*(기운이 많|년 남은)[^.?!]*[.?!]?/)?.[0] ?? q.slice(0, 60)); })));
}
const key = (x: Flag) => `${x.book}|${x.sentence}`;
const baseKeys = new Set(base.map(key)), newKeys = new Set(flagsNew.map(key));
const added = flagsNew.filter(x => !baseKeys.has(key(x))), removed = base.filter(x => !newKeys.has(key(x)));
const quoted = (x: Flag) => QUOTES.find(q => q.book === x.book && q.quote.test(x.sentence));
const WHY: Readonly<Record<string, string>> = {
  avoid_image: "다른 책(같은 일주 다른 고객·같은 고객 다른 상품)이 이미 쓴 이미지 줄", ilju_phrase: "같은 일주 이전 책과 공백 뺀 12자 이상 같은 구절", pair_profile: "성격표 칸과 반대",
  scene_owner: "성격표로 맞춘 장면 주인 값과 반대(기존 scene_owner 검사)", prop_repeat: "기존 규칙(같은 소품 책당 1회) — 4.1.0이 새로 잡혀 앞 문장 소품 세기 순서가 바뀜",
};
const addedRows = added.map(x => { const q = quoted(x); return `| ${x.book} | ${x.at} | ${x.rule}${x.detail ? ` (${x.detail.slice(0, 40)})` : ""} | ${x.sentence} | ${q ? `결함 — 판독 인용(${q.item})` : `결함 — ${WHY[x.rule] ?? "새 검사 꼴"}`} |`; });
const qRows = QUOTES.map(q => {
  const snap = JSON.parse(readFileSync(join(dir, `${q.book}.snapshot.json`), "utf8"));
  const text = JSON.stringify(snap.draft);
  if (!q.quote.test(text)) return { ok: false, row: `| ${q.item} | ${q.label} | ${q.how} | FAIL — 저장본에 그 꼴 없음 |` };
  let ok = false, where = "";
  if (q.how === "lint") { const f = flagsNew.find(x => x.book === q.book && q.quote.test(x.sentence)); ok = Boolean(f); where = f ? `${f.rule}${f.detail ? `(${f.detail.slice(0, 30)})` : ""} @${f.at}` : "안 잡힘"; }
  else if (q.how === "cover") { const row = covers.find(r => r.startsWith(`| ${q.book} |`)) ?? ""; ok = /avoid|hard/.test(row); where = row.split("|")[3]?.trim() ?? ""; }
  else if (q.how === "tidy") { const hit = [...tidyHits].find(([kk]) => kk.startsWith(`${q.book}|`) && q.quote.test(kk)); ok = Boolean(hit); where = hit ? `「${hit[0].split("|")[1].trim()}」 → 「${hit[1].trim()}」` : "안 바뀜"; }
  return { ok, row: `| ${q.item} | ${q.label} | ${q.how} | ${ok ? "PASS" : "FAIL"} — ${where} |` };
});
// 브리프 재료(1-1 뜻·1-2 장면·1-3 성격표·1-7 관계·1-8 장부·글자 수와 힘): 저장본 브리프(지금 코드)에서 확인.
const briefRows: string[] = [];
{
  const s = (f: string) => JSON.parse(readFileSync(join(dir, `${f}.snapshot.json`), "utf8"));
  const jw = briefOfSnap(s("final-deokmin-jiwoo")), car = briefOfSnap(s("final-deokmin-career")), sd = briefOfSnap(s("final-sodam-full-dating"));
  const wb = (b: ReturnType<typeof briefOfSnap>) => JSON.stringify(renderWriterBrief(b, { knowledge: k }));
  // 엔진 그림 줄은 피할 이미지(chart.avoidImages)에만 있어야 한다.
  const noAvoid = (b: ReturnType<typeof briefOfSnap>) => { const w = renderWriterBrief(b, { knowledge: k }) as { chart: Record<string, unknown> }; const { avoidImages: _a, ...chart } = w.chart; void _a; return JSON.stringify({ ...w, chart }); };
  briefRows.push(`| 1-1 | 작가 브리프 chart.coreImage = 뜻(그림 없음), 엔진 그림 줄은 피할 이미지에만 | ${sd.chart.coreImage.meaning} | ${/캠핑 랜턴/.test(noAvoid(sd)) || /아스팔트/.test(noAvoid(car)) || /아스팔트/.test(noAvoid(jw)) ? "FAIL" : "PASS"} |`);
  briefRows.push(`| 1-3 | 궁합 성격표(브리프 맨 앞) | ${(jw.compatibility?.profiles ?? []).map(p => p.line).join(" / ")} | ${jw.compatibility?.profiles?.length === 2 ? "PASS" : "FAIL"} |`);
  briefRows.push(`| 1-7 | 첫 쪽 관계 목록 | ${jw.compatibility?.relationsPlain.length}줄(이전 4줄) | ${(jw.compatibility?.relationsPlain.length ?? 0) > 4 ? "PASS" : "FAIL"} |`);
  briefRows.push(`| 1-8 | IT 서비스 창업 커리어 재료에 「매출·재고 장부」 | ${/매출·재고 장부|매출과 재고/.test(wb(car)) ? "남음" : "없음"} | ${/매출·재고 장부|매출과 재고/.test(wb(car)) ? "FAIL" : "PASS"} |`);
  briefRows.push(`| 1-8 | 글자 수와 힘 한 줄(chart.elements.countVsStrength) | ${sd.chart.elements.countVsStrength ?? "없음"} | ${sd.chart.elements.countVsStrength ? "PASS" : "FAIL"} |`);
}

const miss = qRows.filter(r => !r.ok).length + briefRows.filter(r => /FAIL \|$/.test(r)).length;
const md = `# 최종판2 저장본 검사(역행 금지 2, 호출 0)

명령: \`NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/stored-check.ts <저장본 13권 폴더> <기준 깃발.json> --md docs/v5/final2/stored-check.md\`
저장본 13권: P6d 4권(docs/v5/baseline/p6d) · P6e 5권(docs/v5/baseline/p6e) · 최종 4권(로컬 DB 발행본). 기준 = 시작 커밋 270a3676의 같은 검사.
이미지 대장은 그 책 자신·그 뒤에 만든 책·같은 사람 같은 상품을 다시 만든 판을 빼고 본다.

## 1. 새로 잡힌 문장 전부(${added.length}문장)

| 책 | 자리 | 규칙 | 문장 | 판정 |
|---|---|---|---|---|
${addedRows.join("\n")}

오탐: **${added.filter(x => !quoted(x) && !WHY[x.rule]).length}** (판정 열이 "결함"이 아닌 줄 수)

기준에서 잡혔는데 지금 안 잡히는 문장(${removed.length}): ${removed.map(x => `${x.book} ${x.at} ${x.rule} 「${x.sentence.slice(0, 40)}」`).join(" · ") || "없음"}
${removed.length ? "— 같은 문단 앞 문장(4.1.0 「지어낸 연차 없이」)이 새로 잡혀 그 장 소품 세기 순서가 바뀐 것. 앞 문장이 수리되면 다시 센다." : ""}

## 2. 이번 판독 인용 결함

| 항목 | 인용 | 잡는 곳 | 결과 |
|---|---|---|---|
${qRows.map(r => r.row).join("\n")}

## 3. 표지(공백 뺀 길이·피할 이미지)

${covers.join("\n")}

## 4. 브리프 재료(지금 코드로 저장본 입력을 다시 만든 브리프)

| 항목 | 확인 | 값 | 결과 |
|---|---|---|---|
${briefRows.join("\n")}

놓친 것: **${miss}**
`;
const i = process.argv.indexOf("--md");
if (i > 0) { const p = join(ROOT, process.argv[i + 1]); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, md); }
console.log(md.split("\n").slice(0, 4).join("\n"), `\n새 문장 ${added.length} · 인용 놓친 것 ${qRows.filter(r => !r.ok).length} · 놓친 것 합 ${miss}`);
if (miss) process.exitCode = 1;
