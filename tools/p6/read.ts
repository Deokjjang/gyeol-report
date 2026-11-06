/**
 * P6 블라인드 읽기 목록: docs/v5/trial/p6/{A,B}/*.metrics.json → docs/v5/p6-read.md(X1~X12 링크만) + docs/v5/p6-key.md(정답표·권별 지표).
 * 이름 배정은 처음 한 번 무작위(crypto)로 정하고 p6-key.md에 고정한다(다시 돌려도 바뀌지 않는다).
 *   pnpm exec tsx tools/p6/read.ts [--base http://localhost:3100]
 */
import { randomInt } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { P6_CASES, P6_MODELS } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
const BASE = process.argv.includes("--base") ? process.argv[process.argv.indexOf("--base") + 1] : "http://localhost:3100";
type M = { case: string; label: string; which: "A" | "B"; model: string; reportId: string; chars: number; chapters: number; deterministicChapters: string[]; partialKeys: string[]; deletions: number; replacements: number; forbiddenResidual: number; awkward: number; dbLeak: number; gender: number; infoRepeats: number | null; infoByKind: Record<string, number> | null; durationMs: number; wallMs: number; tokens: { input: number; cachedInput: number; output: number }; costUsd: number; costKrw: number; calls: { finish: string }[] };
const books: M[] = (["A", "B"] as const).flatMap(w => {
  const dir = join(ROOT, "docs/v5/trial/p6", w);
  return existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".metrics.json")).map(f => JSON.parse(readFileSync(join(dir, f), "utf8")) as M).filter(m => m.reportId && m.chars) : [];
});
const keyPath = join(ROOT, "docs/v5/p6-key.md");
const prev = existsSync(keyPath) ? new Map([...readFileSync(keyPath, "utf8").matchAll(/^\| (X\d+) \| [^|]+ \| ([AB]) \| [^|]+ \| `(report_[0-9a-f]+)`/gm)].map(m => [m[3], m[1]])) : new Map<string, string>();
// 새 책에는 아직 안 쓴 이름을 무작위로 준다.
const free = Array.from({ length: 12 }, (_, i) => `X${i + 1}`).filter(x => ![...prev.values()].includes(x));
for (let i = free.length - 1; i > 0; i--) { const j = randomInt(i + 1); [free[i], free[j]] = [free[j], free[i]]; }
const name = new Map<string, string>(prev);
for (const b of books) if (!name.has(b.reportId)) name.set(b.reportId, free.shift()!);
const order = (b: M) => Number(name.get(b.reportId)!.slice(1));
const link = (id: string) => `${BASE}/dev/v5-login?next=/reports/${id}`;
const caseLabel = (id: string) => P6_CASES.find(c => c.id === id)!.label.split(" · ")[0];

const read = [
  "# P6 블라인드 읽기 목록",
  "",
  "로컬 서버를 띄운 뒤(`pnpm dev:v5`, 포트 3100) 링크를 엽니다. 링크는 개발 전용 로그인으로 테스트 계정 쿠키를 심고 책으로 갑니다.",
  "같은 상품은 두 권(같은 브리프, 작가 모델만 다름)입니다. 어느 모델인지는 `p6-key.md`에 따로 있으니 다 읽은 뒤에 여세요.",
  "",
  "| 이름 | 상품 | 링크 |",
  "|---|---|---|",
  ...[...books].sort((a, b) => order(a) - order(b)).map(b => `| ${name.get(b.reportId)} | ${caseLabel(b.case)} | ${link(b.reportId)} |`),
  "",
  "읽으면서 적을 것(권마다 1~5): 재미(내 얘기 느낌) · 쉬운 말 · 같은 말 반복 · 어색한 문장 · 믿음(근거) · 다시 읽고 싶은지. 상품별로 둘 중 어느 쪽을 팔고 싶은지도.",
  "",
].join("\n");
writeFileSync(join(ROOT, "docs/v5/p6-read.md"), read);

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;
const key = [
  "# P6 블라인드 정답표 (읽은 뒤에 열기)",
  "",
  `모델 A = ${P6_MODELS.A.provider}/${P6_MODELS.A.model}, 모델 B = ${P6_MODELS.B.provider}/${P6_MODELS.B.model}. 같은 브리프·같은 안전망·같은 발행 경로(운영 코드).`,
  "",
  "| 이름 | 상품 | 모델 | 사례 | reportId | 분량(자) | 삭제/교체 | 결정론 장 | 금지 잔여 | 비문 경고 | DB 문구 | 같은 정보 반복 | 소요(초) | 입력/캐시/출력 토큰 | 비용 |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
  ...[...books].sort((a, b) => order(a) - order(b)).map(b => `| ${name.get(b.reportId)} | ${caseLabel(b.case)} | ${b.which} | ${b.case} | \`${b.reportId}\` | ${b.chars.toLocaleString("ko-KR")} | ${b.deletions}/${b.replacements} | ${b.deterministicChapters.length}${b.partialKeys.length ? `(+키 보충 ${b.partialKeys.length})` : ""} | ${b.forbiddenResidual} | ${b.awkward} | ${b.dbLeak} | ${b.infoRepeats ?? "-"} | ${Math.round(b.durationMs / 1000)} | ${b.tokens.input}/${b.tokens.cachedInput}/${b.tokens.output} | $${b.costUsd.toFixed(4)} (${won(b.costKrw)}) |`),
  "",
].join("\n");
writeFileSync(keyPath, key);
console.log(`읽기 ${books.length}권 → docs/v5/p6-read.md, 정답표 → docs/v5/p6-key.md`);
