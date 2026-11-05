/**
 * 이미지 대장 만들기(최종판 1-7 ②, 호출 0): 지금까지 만든 책의 핵심 이미지(표지 줄·핵심 이미지·종합 1장 첫 소제목)를 일주별로 모아
 * tools/final/data/image-ledger.json에 쓴다(최종 A-2: 시험·도구 전용, 운영 번들 밖). 출처: 로컬 DB의 v5 Book 전부 + 저장소의 시험본 스냅샷(docs/v5/**\/*.snapshot.json — P6c·P6d·P6e 포함).
 * 최종판2 1-1: 실제 작가 원고 책만(작가 비용 > 0 — 목업·결정론 책은 고객 책이 아니다). 책 id·만든 시각을 함께 적고(저장본 검사가 그 책 자신과 뒤 책을 뺀다),
 * 본문이 그 책의 장면 재료(meta.scenes)·이미지 줄과 공백 뺀 12자 이상 같게 쓴 구절(phrasesByDayPillar)도 모은다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/image-ledger.ts [--no-db]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { echoRuns, imageNoun } from "../../src/lib/brief/imageLedger";
import { splitSentences } from "../../src/lib/writer/safety/patterns";
import { peopleOf } from "../../src/lib/writer/prior";
import { calculateCompatibilitySaju } from "../../src/lib/report-generation/compatibilityGenerationHandler";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { loadDevEnv, ROOT } from "../llm/env";

type Snap = { reportId?: string; productVersion?: string; draft?: { coverLine?: string; coreImage?: { line?: string }; pairImage?: { line?: string }; productType?: string; chapters?: { sections?: { heading?: string; paragraphs?: string[] }[] }[] };
  evidencePacket?: { input?: unknown; generatedAt?: string; meta?: { costUsd?: number; scenes?: string[] } } };

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith(".snapshot.json")) out.push(p); }
  return out;
}

/** 스냅샷 → (일주들, 이미지 줄들). */
function entries(s: Snap): { pillars: string[]; lines: string[]; phrases: string[]; book: string; at: string; people: string[]; product: string } | null {
  if (s.productVersion !== "v5" || !s.draft || !s.evidencePacket?.input) return null;
  if (!((s.evidencePacket.meta?.costUsd ?? 0) > 0)) return null;
  const n = normalizeReportInputPayload(s.evidencePacket.input as never, { now: () => new Date(s.evidencePacket?.generatedAt ?? "2026-11-04T00:00:00Z") });
  if (!n.ok) return null;
  const v = n.value as { kind?: string; person?: unknown; personA?: unknown; personB?: unknown };
  const people = v.kind === "compatibility" ? [v.personA, v.personB] : [v.person];
  const pillars = people.flatMap(p => { try { const c = calculateCompatibilitySaju(p as never) as { pillars?: { day?: { stem: string; branch: string } } }; const d = c.pillars?.day; return d ? [`${d.stem}${d.branch}`] : []; } catch { return []; } });
  const d = s.draft;
  const lines = [d.coverLine, d.coreImage?.line, d.pairImage?.line, d.productType === "saju_mbti_full" ? d.chapters?.[0]?.sections?.[0]?.heading : undefined].filter((x): x is string => Boolean(x && x.trim()));
  const body = (d.chapters ?? []).flatMap(c => (c.sections ?? []).flatMap(x => (x.paragraphs ?? []).flatMap(p => splitSentences(p))));
  const phrases = echoRuns(body, [...(s.evidencePacket.meta?.scenes ?? []), ...lines]);
  return { pillars, lines: [...new Set(lines)], phrases, book: s.reportId ?? "", at: s.evidencePacket.generatedAt ?? "", people: peopleOf(s.evidencePacket.input), product: d.productType ?? "" };
}

async function main() {
  const byDayPillar: Record<string, { line: string; noun: string; source: string; book: string; at: string; people: string[]; product: string }[]> = {};
  const phrasesByDayPillar: Record<string, { run: string; book: string; at: string; people: string[]; product: string }[]> = {};
  const seen = new Set<string>();
  const add = (s: Snap, source: string) => {
    const e = entries(s); if (!e) return 0;
    // 같은 책(같은 report id)이 시험본 파일과 로컬 DB에 함께 있으면 한 번만(먼저 본 쪽).
    if (e.book && seen.has(e.book)) return 0; if (e.book) seen.add(e.book);
    for (const p of e.pillars) {
      for (const line of e.lines) { const list = (byDayPillar[p] ??= []); if (!list.some(x => x.line === line && x.book === e.book)) list.push({ line, noun: imageNoun(line), source, book: e.book, at: e.at, people: e.people, product: e.product }); }
      for (const run of e.phrases) { const list = (phrasesByDayPillar[p] ??= []); if (!list.some(x => x.run === run && x.book === e.book)) list.push({ run, book: e.book, at: e.at, people: e.people, product: e.product }); }
    }
    return 1;
  };
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
  const phr = Object.fromEntries(Object.entries(phrasesByDayPillar).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(ROOT, "tools/final/data/image-ledger.json"), JSON.stringify({ version: "image-ledger-2", built: new Date().toISOString().slice(0, 10), byDayPillar: sorted, phrasesByDayPillar: phr }, null, 1) + "\n");
  console.log(`이미지 대장: 시험본 ${files}권 · 로컬 DB ${db}권(작가 원고 책만) · 일주 ${Object.keys(sorted).length}개 · 줄 ${Object.values(sorted).reduce((a, l) => a + l.length, 0)}개 · 구절 ${Object.values(phr).reduce((a, l) => a + l.length, 0)}개`);
}
void main();
