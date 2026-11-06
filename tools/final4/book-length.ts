/**
 * 최종 A 15: 상품 카드 분량(「약 N천 자」) 계산(호출 0). 로컬 DB의 v5 저장본(COMPLETED) 본문 글자 수 평균을 상품별로 낸다.
 * 본문 = draft.chapters[].sections[].paragraphs[] 글자 수 합(소제목·표지·부록 제외, 고객이 읽는 장 본문).
 * 기준 판: 제6판(최종판 계열 — 이번 배포의 작가 경로로 발행된 책). 전체 v5 평균도 같이 적는다(참고).
 *   pnpm exec tsx tools/final4/book-length.ts   → src/data/example/book-lengths.json
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const EDITION = "제6판";
const rows = execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-F", "|", "-c", `
  select s.snapshot_json->>'productType', coalesce(s.snapshot_json->'draft'->'edition'->>'label',''),
    (select coalesce(sum(length(p)),0) from jsonb_array_elements(s.snapshot_json->'draft'->'chapters') c, jsonb_array_elements(c->'sections') sec, jsonb_array_elements_text(sec->'paragraphs') p)
  from paid_report_snapshots s where s.status='COMPLETED' and s.snapshot_json->>'productVersion'='v5'`], { encoding: "utf8" }).trim().split("\n").map(l => l.split("|"));
const LAUNCH = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
const avg = (xs: number[]) => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0;
const products = Object.fromEntries(LAUNCH.map(p => {
  const all = rows.filter(r => r[0] === p).map(r => Number(r[2])), cur = rows.filter(r => r[0] === p && r[1] === EDITION).map(r => Number(r[2]));
  return [p, { books: cur.length, avgChars: avg(cur), thousands: Math.floor(avg(cur) / 1000), allV5: { books: all.length, avgChars: avg(all), thousands: Math.floor(avg(all) / 1000) } }];
}));
const out = { computedAt: new Date().toISOString().slice(0, 10), edition: EDITION, method: "v5 저장본(COMPLETED) 제6판 장 본문 글자 수 평균, 천 단위 내림", products };
writeFileSync(join(ROOT, "src/data/example/book-lengths.json"), JSON.stringify(out, null, 1) + "\n");
console.log(JSON.stringify(out, null, 1));
