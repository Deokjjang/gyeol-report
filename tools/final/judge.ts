/**
 * 최종판 5 판정(호출 0): 결제 경로로 발행된 4권(docs/v5/final/paid-state.json)을 로컬 DB 발행본 그대로 읽어
 *   - 원고: docs/v5/final/books/<사례>.md (표지·판 표시·본문·책 끝 고지, 발행본 그대로)
 *   - 판정표: docs/v5/final/judge.md (생성 기록·남은 깃발 문장·객관 결함 패턴·장별 분량)
 *   - 나란히: docs/v5/final/sodam-side-by-side.md (장소담 P6d 발행본 ↔ 최종판, 연애 장 제외)
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/judge.ts      (CASESET=final2: 최종판2 4권, docs/v5/final2/)
 * replay(--flags)와 달리 소제목 빼기·고지 문장 빼기를 거친 발행본을 본다. 책 끝 고정 고지(finalLine)는 고지 반복으로 세지 않는다.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { V5BookDraft } from "../../src/lib/writer/book";
import { ROOT } from "../llm/env";
import { FINAL_CASES as F1 } from "./cases";
import { FINAL2_CASES } from "../final2/cases";
import { lintStored, loadSnap, manuscript } from "./replay";
import { coverIssue } from "../../src/lib/writer/publish";

const P6D_SODAM = "report_45b64494ee9542cea0b97db5971a8e22";
const SET2 = process.env.CASESET === "final2";
const FINAL_CASES = SET2 ? FINAL2_CASES : F1;
const OUT = join(ROOT, SET2 ? "docs/v5/final2" : "docs/v5/final");
const SOFT = new Set(["db_copy", "seed_copy", "job_prop", "prop_repeat"]);

/** 객관 결함 패턴(발행 본문 기준). 걸리면 문장을 판정표에 싣는다. */
const PATTERNS: readonly (readonly [string, RegExp])[] = [
  ["내부 용어", /브리프|재료|프롬프트|지침|지식 ?DB|\bDB\b|\brule\b|\bnote\b|씨앗|chart\.|traits?\.|seed/],
  ["날짜 머리 문장", /기준으로 썼어요|이 책은 \d{4}년 \d+월 \d+일/],
  ["장 번호 참조", /\d+장에서|\d+장의|앞 장에서|다음 장에서/],
  ["명리학에서", /명리학에서/],
  ["한자 겹침", /\(([一-龥]+)\)\(\1\)|([一-龥]{2,})\(\2\)/],
  ["괄호 밖 한자", /(?<![(一-龥])[一-龥]+(?![一-龥]*\))/],
  ["MBTI 기호 겹침", /\((Ni|Ne|Ti|Te|Fi|Fe|Si|Se)\)\s*\(\1\)/],
  ["숫자·기호 찌꺼기", /\[[A-Za-z0-9가-힣:._-]+\]|⟪|⟫|\{\{|\}\}/],
  // 최종판2: 판독에서 인용된 꼴(같은 꼴이 다시 나오면 객관 결함).
  ["판독 인용 꼴", /한여름 도시 아스팔트|캠핑 랜턴|퇴근 시간에 맞춰 따뜻한 국물|가운데에 서고 발표를 자원|갑·신·묘·오|만들고 넓히는 힘이 큰|성별이나 수를 말하는|여부를 정해 주는 것은|구체적인 일을 말하는 건|지어낸 연차|상태가 [가-힣]+라면|(?<![가-힣])[목화토금수] 과다|이번 가을 남은|매출과 재고 장부|땅 글자의 [갑을병정무기경신임계][자축인묘진사오미신유술해](?=[이가은는의])/],
];

type Snap = Awaited<ReturnType<typeof loadSnap>>["snap"];
const sentencesOf = (t: string) => t.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 1);
const plain = (d: V5BookDraft) => d.chapters.flatMap(c => c.sections.flatMap(s => s.paragraphs));

function bookMd(snap: Snap): string {
  const d = snap.draft as V5BookDraft & { edition?: { label?: string } | string; finalLine?: string };
  const edition = typeof d.edition === "string" ? d.edition : d.edition?.label ?? "";
  return `${manuscript(d)}\n---\n판 표시: ${edition || "(없음)"}\n`;
}

async function main() {
  const state = JSON.parse(readFileSync(join(OUT, "paid-state.json"), "utf8")) as { orders: Record<string, { reportId: string; orderCode: string }> };
  mkdirSync(join(OUT, "books"), { recursive: true });
  const rows: string[] = [], detail: string[] = [];
  for (const c of FINAL_CASES.filter(x => x.generate)) {
    const o = state.orders[c.id]; if (!o?.reportId) { rows.push(`| ${c.label} | (주문 없음) |`); continue; }
    const { snap } = await loadSnap(o.reportId);
    const d = snap.draft as V5BookDraft & { finalLine?: string; edition?: unknown };
    writeFileSync(join(OUT, "books", `${c.id}.md`), `# ${c.label}\n\n- 주문 ${o.orderCode} · ${o.reportId}\n\n${bookMd(snap)}`);
    const meta = snap.evidencePacket.meta!, p6c = meta.safety.metrics?.p6c as Record<string, unknown> | undefined;
    const calls = meta.calls.map(x => `${x.kind} $${(x.costUsd ?? 0).toFixed(4)}`).join(" + ");
    // 주문 비용은 생성 기록(book_generation_runs) 합계: 고침 실행(fix-sections)은 저장본을 다시 써서 발행본 meta에는 $0으로 남는다.
    const runs = execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-c", `select coalesce(string_agg(lane||' $'||round(cost_usd::numeric,4),' + ' order by created_at),'') ||' = $'||round(coalesce(sum(cost_usd),0)::numeric,4) from public.book_generation_runs where report_id='${o.reportId}' and cost_usd>0`], { encoding: "utf8" }).trim();
    const stored = lintStored(snap), flags = stored.flags.filter(f => f.sentence !== d.finalLine);
    // 최종판2 1-1: 표지가 같은 일주 이전 책·같은 고객 다른 책 이미지와 겹치는지(대장은 이 책 자신·뒤 책을 뺀다).
    const coverCheck = coverIssue(d.coverLine ?? d.coreImage?.line ?? d.pairImage?.line ?? "", stored.brief, stored.brief.chart.avoidImages ?? []);
    const hard = flags.filter(f => !SOFT.has(f.rule)), soft = flags.filter(f => SOFT.has(f.rule));
    const text = plain(d), hits: string[] = [];
    for (const [name, re] of PATTERNS) for (const p of text) for (const s of sentencesOf(p)) if (re.test(s)) hits.push(`${name}: ${s.slice(0, 140)}`);
    const sources = meta.chapters.map(x => x.source);
    rows.push(`| ${c.label} | ${o.orderCode} | ${meta.chapters.length}장 · 작가 ${sources.filter(s => s === "writer").length} · 결정론 ${sources.filter(s => s !== "writer").length} | ${meta.chapters.reduce((a, x) => a + x.chars, 0).toLocaleString("ko-KR")}자 | ${calls} · 주문 기록 ${runs} | ${String(p6c?.cover ?? "-")} | 소제목 뺌 ${(p6c?.droppedSections as unknown[] | undefined)?.length ?? 0} · 문단 뺌 ${String(p6c?.droppedParagraphs ?? 0)} · 고지 문장 뺌 ${(p6c?.noticesRemoved as unknown[] | undefined)?.length ?? 0} | ${hard.length} | ${soft.length} | ${hits.length} |`);
    detail.push(`## ${c.label}\n\n- 표지: ${d.coverLine ?? d.coreImage?.line ?? "-"} — 피할 이미지 대조: ${coverCheck ? `${coverCheck.level}: ${coverCheck.reason}` : "통과"}\n- 장별 글자: ${meta.chapters.map(x => `${x.n}장 ${x.chars}`).join(" · ")}\n- 수리 ${String(p6c?.repaired ?? 0)}문장 · 소제목 재작성 ${String(p6c?.rewritten ?? 0)} · 수리 전 깃발 ${JSON.stringify(p6c?.flags ?? {})}\n`
      + `\n### 남은 깃발(가벼운 것 제외) ${hard.length}\n${hard.map(f => `- ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 160)}`).join("\n") || "- 없음"}\n`
      + `\n### 가벼운 깃발 ${soft.length}(DB·씨앗 문구 겹침·직업 소품 반복: 참고)\n${Object.entries(soft.reduce<Record<string, number>>((a, f) => ({ ...a, [f.rule]: (a[f.rule] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(" · ") || "없음"}\n`
      + `\n### 객관 결함 패턴 ${hits.length}\n${hits.map(h => `- ${h}`).join("\n") || "- 없음"}\n`);
  }
  // 장소담 P6d ↔ 최종판(연애 장 제외)
  const side: string[] = [];
  const now = SET2 ? undefined : state.orders["sodam-full-dating"]?.reportId;
  if (now) {
    const [{ snap: a }, { snap: b }] = await Promise.all([loadSnap(P6D_SODAM), loadSnap(now)]);
    const da = a.draft as V5BookDraft, db = b.draft as V5BookDraft;
    const stat = (ch: V5BookDraft["chapters"][number]) => { const t = ch.sections.flatMap(s => s.paragraphs), ss = t.flatMap(sentencesOf); return { chars: t.join("").length, paras: t.length, sens: ss.length, avg: ss.length ? Math.round(t.join("").length / ss.length) : 0 }; };
    side.push(`# 장소담 종합 — P6d 발행본 ↔ 최종판(연애 10장 제외)\n\nP6d: ${P6D_SODAM}(관계 미입력) · 최종판: ${now}(연애 중). 판정 기준은 객관 결함 0 + 덕짱님 판독이다. 아래 수치는 참고용이다(장마다 자동 '나빠짐' 판정 없음).\n`);
    side.push(`| 장 | 제목 | P6d 글자·문단·문장(평균) | 최종판 글자·문단·문장(평균) |\n|---|---|---|---|`);
    for (const ca of da.chapters) {
      if (ca.id === "love") continue;
      const cb = db.chapters.find(x => x.id === ca.id); if (!cb) continue;
      const x = stat(ca), y = stat(cb);
      side.push(`| ${ca.n} | ${ca.title} | ${x.chars} · ${x.paras} · ${x.sens}(${x.avg}) | ${y.chars} · ${y.paras} · ${y.sens}(${y.avg}) |`);
    }
    side.push(`\n표지: P6d 「${da.coverLine ?? da.coreImage?.line ?? "-"}」 ↔ 최종판 「${db.coverLine ?? db.coreImage?.line ?? "-"}」\n`);
    for (const ca of da.chapters) {
      if (ca.id === "love") continue;
      const cb = db.chapters.find(x => x.id === ca.id); if (!cb) continue;
      const render = (ch: V5BookDraft["chapters"][number]) => ch.sections.map(s => `**${s.heading}**\n\n${s.paragraphs.join("\n\n")}`).join("\n\n");
      side.push(`\n## ${ca.n}. ${ca.title}\n\n### P6d\n\n${render(ca)}\n\n### 최종판\n\n${render(cb)}\n`);
    }
    writeFileSync(join(OUT, "sodam-side-by-side.md"), side.join("\n"));
  }
  writeFileSync(join(OUT, "judge.md"), `# ${SET2 ? "최종판2" : "최종판 5"} — 4권 판정표(발행본 기준, 호출 0)\n\n만든 도구: \`${SET2 ? "CASESET=final2 " : ""}NODE_PATH=tools/llm/shim pnpm exec tsx tools/final/judge.ts\` · 원고: ${SET2 ? "docs/v5/final2" : "docs/v5/final"}/books/<사례>.md${SET2 ? "" : " · 나란히: sodam-side-by-side.md"}\n\n`
    + `| 책 | 주문 | 장 | 글자 | 마지막 발행 호출 · 주문 비용 | 표지 | 뺀 것 | 남은 깃발 | 가벼운 깃발 | 객관 패턴 |\n|---|---|---|---|---|---|---|---|---|---|\n${rows.join("\n")}\n\n${detail.join("\n")}`);
  console.log(rows.join("\n"));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.message : e)); process.exit(1); });
