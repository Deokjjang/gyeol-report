/**
 * 최종 A 15: 예시 리포트 데이터 만들기(호출 0). 지어낸 인물 서하은의 v5 종합 책(로컬 DB 저장본)을
 * 기존 v5 투영(projectV5Book)으로 책 쪽(BookData)으로 만든 뒤, 앞쪽(표지·주인공·만세력·MBTI) + 1·2장 + 끝 쪽만 남겨 저장한다.
 * 저장본 원문 그대로이고, 작가 원문(meta.raw)·브리프·이전 책·주문·계정 정보는 BookData에 들어가지 않는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final4/export-example.ts [reportId]
 * 결과: src/data/example/seohaeun-full.json  (+ 실제 인물 정보 검사 결과 출력)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { projectV5Book } from "../../src/lib/writer/book";
import { composeBookNavigation } from "../../src/app/dev/book-preview/bookNavigation";
import { v5EditionLabel } from "../../src/lib/writer/book";
import type { BookData, BookPage } from "../../src/app/dev/book-preview/bookTypes";
import type { ProductPreviewSnapshot } from "../../src/lib/report-generation/productPreviewSnapshot";
import { exampleLeaks } from "../../src/lib/book/exampleGuard";

const ROOT = resolve(import.meta.dirname, "../..");
const REPORT = process.argv[2] ?? "report_b743ac3a17da4f308867071b97a1e93b";
if (!/^report_[a-f0-9]{32}$/.test(REPORT)) throw new Error("reportId 형식");
const raw = execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c",
  `select snapshot_json from paid_report_snapshots where report_id='${REPORT}' and status='COMPLETED'`], { encoding: "utf8", maxBuffer: 64 << 20 }).trim();
const snap = JSON.parse(raw) as ProductPreviewSnapshot & { draft: { chapters: { n: number; id: string; title: string }[]; baseDate?: string } };
if (snap.productVersion !== "v5" || snap.productType !== "saju_mbti_full") throw new Error("v5 종합 책이 아님");
const today = snap.draft.baseDate ?? snap.createdAtIso.slice(0, 10);
const full = projectV5Book(snap, today);
if (!full) throw new Error("v5 투영 실패");
const keep = new Set(["core", ...snap.draft.chapters.filter(c => c.n === 2).map(c => `chapter-${c.id}`)]);
const body = full.pages.filter(p => p.kind !== "contents");
const front = body.filter(p => ["cover", "input", "manse", "mbti"].includes(p.kind));
const chapters = body.filter(p => p.kind === "narrative" && (keep.has(p.id ?? "") || (p.anchors ?? []).some(a => keep.has(a))));
const back = body.find(p => p.kind === "back")!;
if (chapters.length < 1 || !chapters.some(p => p.id === "core")) throw new Error("1장을 찾지 못함");
// 2장까지만 남겼으니 목차·다시 펼쳐보기 쪽을 새로 만든다(남긴 쪽만 가리킨다).
const pages: BookPage[] = composeBookNavigation([...front, ...chapters, back].map(p => ({ ...p })) as BookPage[]);
const data: BookData = { ...full, pages, glossary: full.glossary };
const out = { source: { productType: snap.productType, chapters: chapters.length, of: snap.draft.chapters.length, note: "가상의 인물 서하은 종합 책(v5 저장본) 앞 2장. 문장은 저장본 그대로." },
  today, edition: v5EditionLabel(snap.draft), data };
const leaks = exampleLeaks(JSON.stringify(out));
if (leaks.length) { console.error("실제 인물·식별 정보가 들어 있음:", leaks); process.exit(1); }
const dir = join(ROOT, "src/data/example");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "seohaeun-full.json"), JSON.stringify(out, null, 1) + "\n");
console.log(`예시 저장: 쪽 ${pages.length}(장 ${chapters.length}/${snap.draft.chapters.length}), 글자 ${JSON.stringify(out).length}, 실제 인물 정보 0`);
