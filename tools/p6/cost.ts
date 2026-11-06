/**
 * P6 원가 표: 모델별·상품별 권당 원가(실측), 1,490원 대비 마진·원가율, 업그레이드 이용권(운영 36계정) OpenAI 잔액 감당 권수.
 *   pnpm exec tsx tools/p6/cost.ts [--balance 12.9]   → 표준 출력(마크다운, p6a-report에 붙인다)
 * 가정: 결제 수수료 3.5%(PG 계약 수치가 저장소에 없어 국내 카드 일반 수준으로 둔다), 원/달러 KRW_PER_USD.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { REPORT_PRICE_KRW } from "../../src/lib/payment/reportProductCatalog";
import { P6_CASES, P6_MODELS } from "./cases";
import { KRW_PER_USD } from "./metrics";

const ROOT = resolve(import.meta.dirname, "../..");
const FEE = 0.035, ACCOUNTS = 36;
const balance = process.argv.includes("--balance") ? Number(process.argv[process.argv.indexOf("--balance") + 1]) : 12.9;
type M = { case: string; which: "A" | "B"; costUsd: number; tokens: { input: number; cachedInput: number; output: number }; chars: number };
const read = (w: "A" | "B"): M[] => { const d = join(ROOT, "docs/v5/trial/p6", w); return existsSync(d) ? readdirSync(d).filter(f => f.endsWith(".metrics.json")).map(f => JSON.parse(readFileSync(join(d, f), "utf8"))).filter((m: M) => m.costUsd > 0) : []; };
const books = { A: read("A"), B: read("B") };
const krw = (usd: number) => usd * KRW_PER_USD;
const fee = REPORT_PRICE_KRW * FEE;
const fmt = (n: number, d = 0) => n.toLocaleString("ko-KR", { maximumFractionDigits: d, minimumFractionDigits: d });

const out: string[] = [];
out.push(`가정: 판매가 ${fmt(REPORT_PRICE_KRW)}원(부가세 포함), 결제 수수료 ${fmt(FEE * 100, 1)}% = ${fmt(fee, 1)}원, 원/달러 ${fmt(KRW_PER_USD)}원(±50원이면 원가 ±3.4%). 원가 = 작가 API 비용만(서버·DB 제외).`, "");
out.push("| 상품 | A 원가 | A 원가율 | A 마진 | B 원가 | B 원가율 | B 마진 |", "|---|---|---|---|---|---|---|");
for (const c of P6_CASES) {
  const cell = (w: "A" | "B") => { const m = books[w].find(x => x.case === c.id); if (!m) return ["-", "-", "-"]; const k = krw(m.costUsd); return [`${fmt(k, 1)}원 ($${m.costUsd.toFixed(4)})`, `${fmt((k / REPORT_PRICE_KRW) * 100, 1)}%`, `${fmt(REPORT_PRICE_KRW - fee - k, 0)}원`]; };
  out.push(`| ${c.label.split(" · ")[0]} | ${cell("A").join(" | ")} | ${cell("B").join(" | ")} |`);
}
const avg = (w: "A" | "B") => books[w].length ? books[w].reduce((a, m) => a + m.costUsd, 0) / books[w].length : NaN;
const max = (w: "A" | "B") => Math.max(...books[w].map(m => m.costUsd));
for (const w of ["A", "B"] as const) if (books[w].length) out.push(`| 평균(${w}, ${books[w].length}권) | ${w === "A" ? `${fmt(krw(avg(w)), 1)}원 | ${fmt(krw(avg(w)) / REPORT_PRICE_KRW * 100, 1)}% | ${fmt(REPORT_PRICE_KRW - fee - krw(avg(w)))}원 | | | ` : ` | | | ${fmt(krw(avg(w)), 1)}원 | ${fmt(krw(avg(w)) / REPORT_PRICE_KRW * 100, 1)}% | ${fmt(REPORT_PRICE_KRW - fee - krw(avg(w)))}원 `}|`);
out.push("");
if (books.B.length) {
  // 잔액에서 뺄 돈은 이번 작업의 OpenAI 호출 전부(배관 확인 포함, api-cost-log의 P6 줄).
  const spentB = readFileSync(join(ROOT, "docs/v5/api-cost-log.md"), "utf8").split("\n").filter(l => l.includes("| P6 ") && l.includes("| openai/")).reduce((a, l) => a + Number(l.split("|")[7]), 0);
  const left = balance - spentB;
  out.push(`업그레이드 이용권(운영 ${ACCOUNTS}계정, 모델 B ${P6_MODELS.B.model} 단가): OpenAI 잔액 $${balance} − 이번 P6 OpenAI 호출 $${spentB.toFixed(4)} = $${left.toFixed(2)}.`, "");
  out.push("| 기준 | 권당 | 감당 권수 | 계정당 |", "|---|---|---|---|");
  for (const [name, per] of [["6상품 평균", avg("B")], ["가장 비싼 상품", max("B")]] as const) out.push(`| ${name} | $${per.toFixed(4)} (${fmt(krw(per), 1)}원) | ${fmt(Math.floor(left / per))}권 | ${fmt(left / per / ACCOUNTS, 1)}권 |`);
  for (const c of P6_CASES) { const m = books.B.find(x => x.case === c.id); if (m) out.push(`| ${c.label.split(" · ")[0]}만 | $${m.costUsd.toFixed(4)} | ${fmt(Math.floor(left / m.costUsd))}권 | ${fmt(left / m.costUsd / ACCOUNTS, 1)}권 |`); }
}
console.log(out.join("\n"));
