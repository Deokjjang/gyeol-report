/**
 * 이미지 대장 만들기(최종판 1-7 ②, 호출 0): 지금까지 만든 책의 핵심 이미지(표지 줄·핵심 이미지·종합 1장 첫 소제목)를 일주별로 모아
 * src/lib/brief/data/image-ledger.json에 쓴다. 출처: 로컬 DB의 v5 Book 전부 + 저장소의 시험본 스냅샷(docs/v5/**\/*.snapshot.json — P6c·P6d·P6e 포함).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/image-ledger.ts [--no-db]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { imageNoun } from "../../src/lib/brief/imageLedger";
import { calculateCompatibilitySaju } from "../../src/lib/report-generation/compatibilityGenerationHandler";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { loadDevEnv, ROOT } from "../llm/env";

type Snap = { productVersion?: string; draft?: { coverLine?: string; coreImage?: { line?: string }; pairImage?: { line?: string }; productType?: string; chapters?: { sections?: { heading?: string }[] }[] }; evidencePacket?: { input?: unknown; generatedAt?: string } };

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith(".snapshot.json")) out.push(p); }
  return out;
}

/** 스냅샷 → (일주들, 이미지 줄들). */
function entries(s: Snap): { pillars: string[]; lines: string[] } | null {
  if (s.productVersion !== "v5" || !s.draft || !s.evidencePacket?.input) return null;
  const n = normalizeReportInputPayload(s.evidencePacket.input as never, { now: () => new Date(s.evidencePacket?.generatedAt ?? "2026-11-04T00:00:00Z") });
  if (!n.ok) return null;
  const v = n.value as { kind?: string; person?: unknown; personA?: unknown; personB?: unknown };
  const people = v.kind === "compatibility" ? [v.personA, v.personB] : [v.person];
  const pillars = people.flatMap(p => { try { const c = calculateCompatibilitySaju(p as never) as { pillars?: { day?: { stem: string; branch: string } } }; const d = c.pillars?.day; return d ? [`${d.stem}${d.branch}`] : []; } catch { return []; } });
  const d = s.draft;
  const lines = [d.coverLine, d.coreImage?.line, d.pairImage?.line, d.productType === "saju_mbti_full" ? d.chapters?.[0]?.sections?.[0]?.heading : undefined].filter((x): x is string => Boolean(x && x.trim()));
  return { pillars, lines: [...new Set(lines)] };
}

async function main() {
  const byDayPillar: Record<string, { line: string; noun: string; source: string }[]> = {};
  const add = (s: Snap, source: string) => { const e = entries(s); if (!e) return 0; for (const p of e.pillars) for (const line of e.lines) { const list = (byDayPillar[p] ??= []); if (!list.some(x => x.line === line)) list.push({ line, noun: imageNoun(line), source }); } return 1; };
  let files = 0, db = 0;
  for (const f of walk(join(ROOT, "docs/v5"))) files += add(JSON.parse(readFileSync(f, "utf8")) as Snap, relative(ROOT, f));
  if (!process.argv.includes("--no-db")) {
    loadDevEnv();
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key && /127\.0\.0\.1|localhost/.test(url)) {
      const c = createClient(url, key, { auth: { persistSession: false } });
      for (let from = 0; ; from += 500) {
        const r = await c.from("paid_report_snapshots").select("report_id,snapshot_json").range(from, from + 499);
        if (r.error || !r.data?.length) break;
        for (const row of r.data as { report_id: string; snapshot_json: Snap | null }[]) if (row.snapshot_json) db += add(row.snapshot_json, `local-db:${row.report_id}`);
        if (r.data.length < 500) break;
      }
    } else console.log("로컬 DB 없음(로컬 주소가 아니면 읽지 않는다)");
  }
  const sorted = Object.fromEntries(Object.entries(byDayPillar).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(ROOT, "src/lib/brief/data/image-ledger.json"), JSON.stringify({ version: "image-ledger-1", built: new Date().toISOString().slice(0, 10), byDayPillar: sorted }, null, 1) + "\n");
  console.log(`이미지 대장: 시험본 ${files}권 · 로컬 DB ${db}권 · 일주 ${Object.keys(sorted).length}개 · 줄 ${Object.values(sorted).reduce((a, l) => a + l.length, 0)}개`);
}
void main();
