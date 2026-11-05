/**
 * 주문당 최악 비용(최종판3 6, 호출 0): 작가 1(입력 그대로 + max_tokens 공식) · 검수 1(입력 상한 + 출력 상한) · 수리 1(항목 상한 × 항목 최대 글자 + 출력 상한).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/worst-cost.ts
 */
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { buildBrief } from "../../src/lib/brief";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { buildWriterPrompt } from "../../src/lib/writer/prompt";
import { worstUsd, writerKnowledge, DEFAULT_REVIEW_MODEL } from "../../src/lib/writer/publish";
import { maxTokensFor } from "../../src/lib/writer/runner";
import { REVIEW_MAX_INPUT_CHARS, reviewMaxTokens } from "../../src/lib/writer/review";
import { REPAIR3_MAX_ITEMS, REPAIR3_SYSTEM, repair3MaxTokens } from "../../src/lib/writer/repair3";
import { FINAL2_CASES } from "../final2/cases";

const { k } = writerKnowledge();
/** 수리 항목 하나의 최대 글자(문장 원문 200 + 문제 설명 300 + 문맥 300). */
const ITEM_CHARS = 800, ITEM_ORIGINAL = 200, FACTS_CHARS = 4_000;
const rows: string[] = ["| 상품 | 작가 입력(자) | 작가 max_tokens | 작가 최악 | 검수 최악(" + DEFAULT_REVIEW_MODEL + ") | 수리 최악 | 합 |", "|---|---|---|---|---|---|---|"];
let maxSum = 0;
for (const c of FINAL2_CASES) {
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date("2026-11-05T03:00:00Z") }); if (!n.ok) throw new Error(c.id);
  const brief = buildBrief(payloadToBriefInput(n.value as never, "2026-11-05") as never, k);
  const p = buildWriterPrompt(brief, { knowledge: k });
  const wIn = p.system.length + p.user.length, wMax = maxTokensFor(p.chapters, "claude-sonnet-5-5");
  const w = worstUsd("claude-sonnet-5-5", wIn, wMax);
  const r = worstUsd(DEFAULT_REVIEW_MODEL, REVIEW_MAX_INPUT_CHARS, reviewMaxTokens(DEFAULT_REVIEW_MODEL));
  const repIn = REPAIR3_SYSTEM.length + FACTS_CHARS + REPAIR3_MAX_ITEMS * ITEM_CHARS, repMax = repair3MaxTokens(REPAIR3_MAX_ITEMS * ITEM_ORIGINAL, REPAIR3_MAX_ITEMS, "claude-sonnet-5-5");
  const rp = worstUsd("claude-sonnet-5-5", repIn, repMax);
  const sum = w + r + rp; maxSum = Math.max(maxSum, sum);
  rows.push(`| ${c.label} | ${wIn} | ${wMax} | $${w.toFixed(4)} | $${r.toFixed(4)} | $${rp.toFixed(4)}(입력 ${repIn}자·출력 ${repMax}) | **$${sum.toFixed(4)}** |`);
}
console.log(rows.join("\n")); console.log(`최악 합 최대 $${maxSum.toFixed(4)}`);
