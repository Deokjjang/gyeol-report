/**
 * AM2-8 2부 캐시 손실 어림(호출 0): MBTI 줄 · 짝을 공유 블록에서 묶음 지시로 옮긴 뒤 권당 입력 비용 변화.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-cachecost.ts
 * 셈: 글자 = 토큰 1.0(한글 위주 어림) · Sonnet 5.5 값(입력 $2 · 캐시 읽기 $0.2 · 캐시 쓰기 $2.5 /M). 첫 묶음 6회 + 문단 교체 회수(P7 실측).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";
import { chunkPlan, mbtiBlock, renderCard } from "../../src/lib/writer/chunked/prompt";
import { BOOKS } from "./am2-7-repro";

const P = { input: 2, read: 0.2, write: 2.5 }, TOK = 1.0;
const REWRITES: Record<string, number> = { "annual-1": 11, "annual-p5": 9, "annual-p6a": 11, "annual-p6b": 10, "major-1": 6, "major-p5": 7, "major-p6a": 8, "major-p6b": 10 };
const COST: Record<string, number> = { "annual-1": 0.4049, "annual-p5": 0.3670, "annual-p6a": 0.3088, "annual-p6b": 0.3437, "major-1": 0.2733, "major-p5": 0.2398, "major-p6a": 0.3099, "major-p6b": 0.2882 };
for (const id of BOOKS) {
  const old = readFileSync(join(OUT2, `P7-${id}`, "card.txt"), "utf8").length;
  const { intake } = intakeOf(payloadFor(id));
  const card = renderCard(intake).length, chunks = chunkPlan(intake), blocks = chunks.map(c => mbtiBlock(intake, c).length);
  const calls = 6 + REWRITES[id];
  // 공유 블록: 쓰기 1회 + 읽기(calls - 1)회. 묶음 블록: 그 묶음 호출(첫 1 + 교체 어림 REWRITES/6)마다 입력.
  const sharedOld = old * TOK * (P.write + P.read * (calls - 1)) / 1e6, sharedNew = card * TOK * (P.write + P.read * (calls - 1)) / 1e6;
  const blockCost = blocks.reduce((a, b) => a + b * TOK * P.input * (1 + REWRITES[id] / 6), 0) / 1e6;
  const delta = sharedNew + blockCost - sharedOld;
  console.log(`${id}: 공유 ${old} → ${card}자 · 묶음 블록 ${blocks.join("/")}자 · 권당 ${delta >= 0 ? "+" : ""}$${delta.toFixed(4)} (P7 $${COST[id]} 대비 ${(delta / COST[id] * 100).toFixed(1)}%)`);
}
