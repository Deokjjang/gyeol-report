/**
 * 저장본 검사(최종판 3, 호출 0): P6d 4권(docs/v5/baseline/p6d)과 P6e 5권(docs/v5/baseline/p6e)의 저장된 본문에 새 정리·검사를 돌려
 * 명령 1번에 인용된 결함 문장이 모두 수리 대상(검사 규칙)으로 잡히거나 정리·렌더 단계에서 고쳐지는지 본다. 수리는 실행하지 않는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/stored-check.ts [--md docs/v5/final/stored-check.md]
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildWriterPrompt, renderWriterBrief } from "../../src/lib/writer/prompt";
import { coverProblem, insertFixedLines, lintContext, renderTerms, writerKnowledge } from "../../src/lib/writer/publish";
import type { FinalChapter } from "../../src/lib/writer/safety";
import { tidyBook } from "../../src/lib/writer/safety/p6c";
import { ROOT } from "../llm/env";
import { briefOfSnap, lintStored } from "./replay";

type Q = { readonly item: string; readonly book: string; readonly quote: RegExp; readonly how: "lint" | "tidy" | "render" | "fixed"; readonly rule?: RegExp; readonly label: string };
/** 명령 1번 인용 문장(전부). book = baseline 폴더/사례. */
const QUOTES: readonly Q[] = [
  { item: "1-1", book: "p6d/taeo-career", quote: /입력하지 않은 경력과 연차는 쓰지 마세요/, how: "lint", rule: /guide_copy/, label: "입력하지 않은 경력과 연차는 쓰지 마세요." },
  { item: "1-2", book: "p6e/taeo-career", quote: /조건형/, how: "lint", rule: /safety:internal_term/, label: "조건형" },
  { item: "1-2", book: "p6e/chaerin-love", quote: /상황 씨앗/, how: "lint", rule: /safety:internal_term/, label: "상황 씨앗" },
  { item: "1-2", book: "p6e/seoha-love-single", quote: /입력에 없/, how: "lint", rule: /safety:internal_term/, label: "입력에 없…" },
  { item: "1-3", book: "p6d/taeo-career", quote: /성격도 같은 쪽을 가리킵니다/, how: "lint", rule: /orphan_start/, label: "성격도 같은 쪽을 가리킵니다." },
  { item: "1-3", book: "p6d/chaerin-love", quote: /여기에 식신.{0,8}의 다정함이 더해집니다/, how: "lint", rule: /orphan_start/, label: "여기에 식신(食神)의 다정함이 더해집니다." },
  { item: "1-4", book: "p6d/taeo-career", quote: /구체 사실을 하나씩 확인하는/, how: "lint", rule: /mbti_misattr/, label: "구체 사실을 하나씩 확인하는" },
  { item: "1-4", book: "p6d/taeo-career", quote: /말하지 않아도 필요한 것을 미리 챙겨 두는/, how: "lint", rule: /mbti_misattr/, label: "말하지 않아도 필요한 것을 미리 챙겨 두는" },
  { item: "1-4", book: "p6d/taeo-career", quote: /모임이 끝나면 오히려 기운이 나는/, how: "lint", rule: /mbti_misattr/, label: "모임이 끝나면 오히려 기운이 나는" },
  { item: "1-5", book: "p6d/taeo-career", quote: /월지의 비견은/, how: "lint", rule: /pillar_claim/, label: "월지의 비견은…" },
  { item: "1-5", book: "p6d/pair-business", quote: /백은솔님에게는 겁살.{0,6}에 해당하는 경계심이 일지에/, how: "lint", rule: /feature_owner/, label: "백은솔님에게는 겁살에 해당하는 경계심이 일지에" },
  { item: "1-5", book: "p6e/taeo-career", quote: /정인.{0,6}이 강해/, how: "lint", rule: /group_claim/, label: "정인이 강해(인성 보통)" },
  { item: "1-5", book: "p6e/pair-business", quote: /백은솔님에게 없는 쇠/, how: "lint", rule: /element_count/, label: "백은솔님에게 없는 쇠(庚 1개)" },
  { item: "1-6", book: "p6d/sodam-full", quote: /편인\(偏人\)/, how: "render", label: "편인(偏人) → 렌더 사전 표기" },
  { item: "1-10", book: "p6e/taeo-career", quote: /배움과 보호의 힘/, how: "lint", rule: /group_name/, label: "배움과 보호의 힘" },
  { item: "1-10", book: "p6e/taeo-career", quote: /돈을 쫓는 힘/, how: "lint", rule: /group_name/, label: "돈을 쫓는 힘" },
  { item: "1-12", book: "p6d/taeo-career", quote: /실제 누군가를 지목하는 말은 아니에요/, how: "lint", rule: /notice_repeat/, label: "실제 누군가를 지목하는 말은 아니에요" },
  { item: "1-12", book: "p6d/taeo-career", quote: /이 장은 투자 권유가 아니라/, how: "lint", rule: /notice_repeat/, label: "이 장은 투자 권유가 아니라 …" },
  { item: "1-12", book: "p6d/taeo-career", quote: /이 장은 권유가 아니라 성향 이야기예요/, how: "lint", rule: /notice_repeat/, label: "이 장은 권유가 아니라 성향 이야기예요" },
  { item: "1-12", book: "p6e/chaerin-love", quote: /결혼의 시기나 여부는 여기서 말하지 않아요/, how: "lint", rule: /notice_repeat/, label: "결혼의 시기나 여부는 여기서 말하지 않아요" },
  { item: "1-13", book: "p6d/sodam-full", quote: /이 책은 2026년 11월 4일 기준으로 썼어요/, how: "tidy", label: "이 책은 2026년 11월 4일 기준으로 썼어요" },
  { item: "1-14", book: "p6d/sodam-full", quote: /지난 경험을 기준점으로 삼는 지난 경험 기억/, how: "tidy", label: "지난 경험을 기준점으로 삼는 지난 경험 기억(Si) — 저장본은 이미 바뀐 꼴이라 작가 원문 'Si'로 다시 봄" },
    { item: "1-14", book: "p6e/sodam-full", quote: /충 축미충/, how: "tidy", label: "충 축미충(P6e)" },
  { item: "1-14", book: "p6e/seoha-love-single", quote: /되려 낯설게/, how: "tidy", label: "되려 → 되레" },
  { item: "1-14", book: "p6d/pair-business", quote: /매우 신약/, how: "tidy", label: "매우 신약 → 혼자 버티는 힘이 아주 여린" },
  { item: "1-14", book: "p6d/taeo-career", quote: /어차피 비겁이 강한 당신은/, how: "lint", rule: /awkward/, label: "어차피 비겁이 강한 당신은" },
];
/** 정리 단계 꼴(저장본에 없는 꼴은 한 문장으로 확인). */
const TIDY_SAMPLES: readonly [string, RegExp, string][] = [
  ["남은 해는 1해예요.", /한 해/, "1해 → 한 해"],
  ["가치 기준(Fi)-지금 이 순간 감각(Se) 감각이 겹쳐요.", /가치 기준\(Fi\)과 지금 이 순간 감각\(Se\)이 겹쳐요/, "기능 하이픈 → '~과 ~', 겹친 '감각' 하나로"],
  ["지난 경험을 기준점으로 삼는 Si의 결과 같은 방향입니다.", /삼는 성향\(Si\)의/, "지난 경험을 기준점으로 삼는 Si → 성향(Si)(이름 되풀이 없음)"],
  ["창업, 이사가 동시에 몰려 올 때 챙기세요.", /몰려올/, "몰려 올 → 몰려올"],
  ["빨리 정해야 할 때 일수록 멈추세요.", /때일수록/, "때 일수록 → 때일수록"],
  ["내 힘의 세기는 중화라서 세지도 여리지도 않은 가운데예요.", /^내 힘은 세지도 약하지도 않은 가운데예요/, "중화 → 세지도 약하지도 않은 가운데(되풀이 하나로)"],
  ["어차피 비겁이 강한 당신은 손해를 봐요.", /어차피/, "(비문은 검사 awkward → 수리)"],
];

const books = ["p6d/sodam-full", "p6d/taeo-career", "p6d/chaerin-love", "p6d/pair-business", "p6e/sodam-full", "p6e/taeo-career", "p6e/chaerin-love", "p6e/pair-business", "p6e/seoha-love-single"];
function main() {
  const { k } = writerKnowledge();
  const rows: string[] = ["| 항목 | 책 | 인용 | 잡는 곳 | 결과 |", "|---|---|---|---|---|"];
  let miss = 0;
  const summary: string[] = ["| 책 | 수리 대상 수 | 규칙별 |", "|---|---|---|"];
  for (const id of books) {
    const snap = JSON.parse(readFileSync(join(ROOT, "docs/v5/baseline", `${id}.snapshot.json`), "utf8"));
    const { flags, brief } = lintStored(snap);
    const by: Record<string, number> = {}; for (const f of flags) { const r = f.rule === "safety" ? `safety:${f.detail}` : f.rule; by[r] = (by[r] ?? 0) + 1; }
    summary.push(`| ${id} | ${flags.length} | ${Object.entries(by).map(([r, n]) => `${r} ${n}`).join(" · ")} |`);
    const plan = buildWriterPrompt(brief, { knowledge: k }).chapters, ctx = lintContext(brief, k, plan, []);
    const finals: FinalChapter[] = snap.draft.chapters.map((c: { n: number; id: string; title: string; sections: { heading: string; paragraphs: string[] }[]; keys?: string[] }) => ({ n: c.n, id: c.id, title: c.title, source: "writer", chars: 0, sections: c.sections.map(x => ({ heading: x.heading, paragraphs: [...x.paragraphs] })), ...(c.keys ? { keys: c.keys } : {}) }));
    const tidied = renderTerms(insertFixedLines(tidyBook(finals, ctx).chapters, brief), brief, k).chapters;
    const before = JSON.stringify(finals), after = JSON.stringify(tidied);
    for (const q of QUOTES.filter(x => x.book === id)) {
      let ok = false, detail = "";
      if (!q.quote.test(before) && q.how !== "tidy") { detail = "저장본에 그 꼴 없음"; }
      else if (q.how === "lint") { const f = flags.find(x => q.quote.test(x.sentence) && q.rule!.test(x.rule === "safety" ? `safety:${x.detail}` : x.rule)); ok = Boolean(f); detail = f ? `${f.rule}${f.detail ? `(${f.detail})` : ""} @${f.chapter}.${f.section}.${f.paragraph}` : `잡히지 않음(같은 문장 깃발: ${flags.filter(x => q.quote.test(x.sentence)).map(x => x.rule).join(",") || "없음"})`; }
      else if (q.how === "render") { ok = !q.quote.test(after); detail = ok ? `정리(한자 지움) → 렌더 ${(after.match(/편인\(偏印\)/g) ?? []).length}곳 "편인(偏印)"` : "남음"; }
      else { ok = !q.quote.test(after); detail = ok ? (q.quote.test(before) ? "정리 단계에서 바뀜" : "저장본에 없음(이미 바뀐 꼴)") : "남음"; if (!q.quote.test(before)) ok = true; }
      if (!ok) miss++;
      rows.push(`| ${q.item} | ${id} | ${q.label} | ${q.how} | ${ok ? "PASS" : "FAIL"} — ${detail} |`);
    }
    // 1-7 표지: P6d 장소담 표지·1장 이미지가 지금 피할 이미지에 걸리는지.
    if (id === "p6d/sodam-full") {
      const cover = snap.draft.coverLine as string, ch1 = snap.draft.chapters[0].sections[0].heading as string;
      for (const [label, line] of [["표지", cover], ["1장 첫 소제목", ch1]] as const) { const p = coverProblem(line, brief, brief.chart.avoidImages ?? []); rows.push(`| 1-7 | ${id} | ${label} 「${line}」 | 피할 이미지 | ${p ? "PASS" : "FAIL"} — ${p ?? "걸리지 않음"} |`); if (!p) miss++; }
    }
    if (id === "p6d/chaerin-love") {
      const wb = JSON.stringify(renderWriterBrief(brief, { knowledge: k }));
      const bad = /프로필 한 줄|첫 만남 30분/.test(wb);
      rows.push(`| 1-8 | ${id} | 연애 중 브리프에 「프로필 한 줄은 이렇게」·「첫 만남 30분에는」 | 브리프 | ${bad ? "FAIL" : "PASS"} — 2장·4장 절 질문: ${brief.chapters.filter(c => /charm|contact/.test(c.id)).flatMap(c => (c.sections ?? []).map(s => s.q)).join(" / ")} |`); if (bad) miss++;
    }
  }
  for (const [text, want, label] of TIDY_SAMPLES) {
    const b = briefOfSnap(JSON.parse(readFileSync(join(ROOT, "docs/v5/baseline/p6d/sodam-full.snapshot.json"), "utf8")));
    const ctx = lintContext(b, k, buildWriterPrompt(b, { knowledge: k }).chapters, []);
    const out = tidyBook([{ n: 2, id: "x", title: "x", source: "writer", chars: 0, sections: [{ heading: "h", paragraphs: [text] }] }], { ...ctx, mbtiPlain: { ...ctx.mbtiPlain, Fi: "가치 기준", Se: "지금 이 순간 감각", Si: "지난 경험 기억" } }).chapters[0].sections[0].paragraphs[0];
    const ok = want.test(out); if (!ok) miss++;
    rows.push(`| 1-14 | 정리 시험 문장 | ${label} | tidy | ${ok ? "PASS" : "FAIL"} — 「${text}」 → 「${out}」 |`);
  }
  const md = `# 저장본 검사(최종판 3, 호출 0)\n\n명령: \`NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/stored-check.ts --md docs/v5/final/stored-check.md\`\n\n## 인용 문장\n\n${rows.join("\n")}\n\n잡히지 않은 인용: **${miss}**\n\n## 책별 수리 대상(새 검사)\n\n${summary.join("\n")}\n`;
  const i = process.argv.indexOf("--md");
  if (i > 0) { const p = join(ROOT, process.argv[i + 1]); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, md); }
  console.log(md);
  if (miss) process.exitCode = 1;
}
main();
