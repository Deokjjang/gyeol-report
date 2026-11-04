/**
 * P6e 읽기 목록 줄: 최종 원고 metrics.json의 reportId로 읽기 서버 링크를 만든다(호출 0).
 *   pnpm exec tsx tools/p6e/read-links.ts [--dir docs/v5/trial/p6e/final] [--port 3100]
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { P6E_CASES } from "./cases";

const ROOT = resolve(import.meta.dirname, "../..");
const arg = (n: string, d: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const dir = arg("dir", "docs/v5/trial/p6e/final"), port = arg("port", "3100");
for (const c of P6E_CASES) {
  const f = join(ROOT, dir, `${c.id}.metrics.json`); if (!existsSync(f)) continue;
  const m = JSON.parse(readFileSync(f, "utf8")) as { reportId: string; chars: number; coverLine: string | null };
  console.log(`| ${c.label} | ${m.chars.toLocaleString("en-US")}자 | ${m.coverLine ?? ""} | http://localhost:${port}/dev/v5-login?next=/reports/${m.reportId} |`);
}
