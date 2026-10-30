/** P6 배관 확인: 두 작가 후보에 짧은 스트리밍 호출 1회씩(모델 옵션 between_tools·effort none이 받아지는지). 비용은 api-cost-log에 한 줄씩. */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { streamCompletion } from "../../src/lib/llm";
import { P6_MODELS } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
const LOG = join(ROOT, "docs/v5/api-cost-log.md");
const key = (f: string, n: string) => (readFileSync(f, "utf8").split("\n").find(l => l.startsWith(`${n}=`))?.slice(n.length + 1).trim().replace(/^["']|["']$/g, "")) ?? "";
const kst = () => new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");
async function main() { for (const [w, m] of Object.entries(P6_MODELS)) {
  const r = await streamCompletion({ provider: m.provider, model: m.model, system: "한국어로 한 문장만 쓴다.", user: "가을 저녁을 한 문장으로.", maxOutputTokens: 60, timeoutMs: 60_000, apiKey: key(m.keyFile, m.keyName) });
  console.log(w, m.model, r.finishReason, r.error?.code ?? "", JSON.stringify(r.usage), r.costUsd, r.text.slice(0, 60));
  let t = readFileSync(LOG, "utf8"); const end = t.indexOf("\n\n누적 합계"); const cum = Number(t.match(/누적 합계: \*\*\$([\d.]+)\*\*/)?.[1] ?? 0) + (r.costUsd ?? 0);
  t = t.slice(0, end) + `\n| ${kst()} | P6 배관 확인 (${w}) | ${m.provider}/${m.model} | ${r.usage.inputTokens} | ${r.usage.cachedInputTokens} | ${r.usage.outputTokens} | ${(r.costUsd ?? 0).toFixed(8)} | ${r.finishReason}${r.error ? ` (${r.error.code})` : ""} | ${r.requestId ?? "-"} | ${cum.toFixed(8)} |` + t.slice(end);
  writeFileSync(LOG, t.replace(/누적 합계: \*\*\$[\d.]+\*\*/, `누적 합계: **$${cum.toFixed(8)}**`));
} }
void main();
