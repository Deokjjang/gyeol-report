/**
 * 최종판3 12 판정(호출 0): 결제 경로로 발행된 무작위 4권(docs/v5/final3/paid-state.json)을 로컬 DB 발행본 그대로 읽어
 * 차단 6기준을 센다 — ① 사실 오류 ② 같은 사람 모순 ③ 입력 밖 단정 ④ 내부 라벨·면책·생성 규칙 노출 ⑤ 점수 불일치 ⑥ 결제·발행 실패.
 * ①③④는 결정론 검사(정답지 대조 포함, 발행본 다시 검사) + 객관 패턴, ②③은 검수(Haiku) 지적과 그 처리, ⑤는 정답지 점수 합·본문 점수, ⑥은 DB 상태.
 * 의미 판정(②③)은 기계 결과만으로 끝내지 않는다 — 원고(docs/v5/final3/books/<사례>.md)를 사람이 읽고 판정표에 적는다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/judge.ts
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { V5BookDraft } from "../../src/lib/writer/book";
import { ROOT } from "../llm/env";
import { FINAL3_CASES } from "./cases";
import { factSheetOfSnap, lintStored, loadSnap, manuscript } from "../final/replay";
import { coverIssue } from "../../src/lib/writer/publish";
import { HARD_RULES } from "../../src/lib/writer/safety/p6c";

const OUT = join(ROOT, "docs/v5/final3");
const CAT: Record<string, "사실" | "입력 밖" | "노출" | "기타"> = {};
for (const r of ["fact_term", "fact_relation", "fact_strength", "fact_ganji", "fact_meaning", "fact_mix", "common_split", "element_claim", "dayun_claim", "star_claim", "yinyang_claim", "ten_god_direction", "group_claim",
  "count_mismatch", "dayun_year", "pillar_claim", "element_count", "glyph_list", "ilju_phrase", "feature_owner", "mbti_misattr", "scene_owner", "pair_profile", "pair_both", "negative_claim", "intensity_claim", "fact_dayun"]) CAT[r] = "사실";
for (const r of ["input_outside", "presumed_partner", "past_assertion", "school_scene", "marriage_talk"]) CAT[r] = "입력 밖";
for (const r of ["label_leak", "render_dup", "guide_copy", "empty_preview", "chapter_ref", "self_correction", "fragment", "orphan_start"]) CAT[r] = "노출";
/** 객관 노출 패턴(발행 본문). 최종판 judge.ts와 같은 꼴 + 최종판3 면책·생성 규칙 꼴. */
const PATTERNS: readonly (readonly [string, RegExp])[] = [
  ["내부 용어", /브리프|재료 ?(목록|씨앗)|재료(에|에는|로는) (있|없|나온|적힌)|프롬프트|지침(에 따라|대로|에 있|을 따라)|지식 ?DB|\bDB\b|\brule\b|\bnote\b|씨앗|chart\.|traits?\.|seed|정답지|검수|처방 종류/],
  ["면책·가정 꼴", /가정 아래에서만|부모님이 계시다면|형제가 있다면|시기는 말하지 않|성별이나 수를 말하|상태가 [가-힣]+라면|입력하지 않으셔서|정보가 없어서/],
  ["라벨 꼴", /(살|귀인|성)(\([一-鿿]+\))?·(십이신살|신살|귀인)|십이신살|12신살/],
  ["날짜 머리 문장", /기준으로 썼어요|이 책은 \d{4}년 \d+월 \d+일/],
  ["장 번호 참조", /\d+장에서|\d+장의|앞 장에서|다음 장에서/],
  ["명리학에서", /명리학에서/],
  ["한자 겹침", /\(([一-龥]+)\)\(\1\)|([一-龥]{2,})\(\2\)/],
  ["괄호 밖 한자", /(?<![(一-龥])[一-龥]+(?![一-龥]*\))/],
  ["숫자·기호 찌꺼기", /\[[A-Za-z0-9가-힣:._-]+\]|⟪|⟫|\{\{|\}\}|\(삭제\)/],
];
const sentencesOf = (t: string) => t.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 1);
const psql = (q: string) => execFileSync("docker", ["exec", "supabase_db_gyeol-report", "psql", "-U", "postgres", "-At", "-F", "|", "-c", q], { encoding: "utf8" }).trim();

type Repair = { items?: number; calls?: number; applied?: { s?: number; at?: string; before?: string; after?: string; original?: string; fixed?: string }[]; skipped?: string | null };
type Review = { version?: string; model?: string | null; calls?: number; kept?: { cat: string; s: number; quote: string; why: string }[]; direct?: unknown[]; dropped?: unknown[]; skipped?: string | null;
  repair?: Repair; deleted?: { sentence?: string; at?: string }[]; keptWithRecord?: unknown[]; remainingHard?: { at: string; rule: string; sentence: string }[]; cover?: { source?: string; firstProblem?: string | null } };

async function main() {
  const state = JSON.parse(readFileSync(join(OUT, "paid-state.json"), "utf8")) as { orders: Record<string, { reportId: string; orderCode: string; providerOrderId: string }> };
  mkdirSync(join(OUT, "books"), { recursive: true });
  const rows: string[] = [], detail: string[] = [], totals = { 사실: 0, 입력밖: 0, 노출: 0, 점수: 0, 발행: 0 };
  for (const c of FINAL3_CASES) {
    const o = state.orders?.[c.id]; if (!o?.reportId) { rows.push(`| ${c.label} | (주문 없음) |||||||||`); totals.발행++; continue; }
    const pay = psql(`select o.status||'|'||coalesce(s.status,'-')||'|'||coalesce(to_char(s.published_at,'YYYY-MM-DD HH24:MI'),'-') from payment_orders o left join paid_report_snapshots s on s.report_id=o.report_id where o.provider_order_id='${o.providerOrderId}'`).split("|");
    const published = pay[0] === "paid" && pay[1] === "COMPLETED";
    if (!published) { rows.push(`| ${c.label} | ${o.orderCode} | 결제 ${pay[0]} · Book ${pay[1]} ||||||||`); totals.발행++; continue; }
    const { snap } = await loadSnap(o.reportId);
    const d = snap.draft as V5BookDraft & { finalLine?: string; edition?: unknown };
    writeFileSync(join(OUT, "books", `${c.id}.md`), `# ${c.label}\n\n- 주문 ${o.orderCode} · ${o.reportId}\n\n${manuscript(d)}\n---\n책 끝: ${d.finalLine ?? "(없음)"}\n`);
    const meta = snap.evidencePacket.meta! as typeof snap.evidencePacket.meta & { review?: Review; test?: boolean };
    const runs = psql(`select coalesce(round(sum(cost_usd)::numeric,4),0)||'|'||count(*) from book_generation_runs where report_id='${o.reportId}'`).split("|");
    const calls = meta!.calls.map(x => `${x.kind}${x.model ? `(${x.model.replace("claude-", "")})` : ""} ${x.finish} $${(x.costUsd ?? 0).toFixed(4)}`).join(" + ");
    const stored = lintStored(snap), flags = stored.flags.filter(f => f.sentence !== d.finalLine);
    // 발행과 같은 기준: 사실·금지(HARD_RULES)만 차단 후보, 나머지(문체·반복·근거 누락 등)는 가벼운 깃발.
    const hard = flags.filter(f => HARD_RULES.has(f.rule)), soft = flags.filter(f => !HARD_RULES.has(f.rule));
    const by = (k: string) => hard.filter(f => (CAT[f.rule] ?? "기타") === k);
    const text = d.chapters.flatMap(ch => ch.sections.flatMap(s => [s.heading, ...s.paragraphs])), hits: string[] = [];
    for (const [name, re] of PATTERNS) for (const p of [d.coverLine ?? "", ...text, d.finalLine ?? ""]) for (const s of sentencesOf(p)) if (re.test(s)) hits.push(`${name}: ${s.slice(0, 160)}`);
    const cover = d.coverLine ?? d.coreImage?.line ?? d.pairImage?.line ?? "";
    const coverCheck = coverIssue(cover, stored.brief, stored.brief.chart.avoidImages ?? []);
    // ⑤ 점수: 정답지(엔진 점수)의 기본 + 항목 = 합, 본문에 보이는 합 점수가 정답지 합과 같은지.
    let score = "-";
    const sheet = factSheetOfSnap(snap, stored.brief);
    const pair = (sheet as { pair?: { score?: { value: number; base: number; components: { points: number }[] } } }).pair;
    if (pair?.score) {
      const sum = pair.score.base + pair.score.components.reduce((a, x) => a + x.points, 0);
      const shown = [...new Set(text.join(" ").match(/(\d{2,3})점/g) ?? [])];
      const ok = sum === pair.score.value && shown.every(x => Number(x.replace("점", "")) === pair.score!.value || pair.score!.components.some(cmp => Math.abs(cmp.points) === Number(x.replace("점", ""))) || Number(x.replace("점", "")) === pair.score!.base);
      score = `${ok ? "일치" : "**불일치**"}(기본 ${pair.score.base} + 항목 ${pair.score.components.length}개 = ${sum} / 총점 ${pair.score.value}; 본문 ${shown.join("·") || "점수 표기 없음"})`;
      if (!ok) totals.점수++;
    }
    const rv = meta!.review ?? {}, rp = rv.repair ?? {};
    totals.사실 += by("사실").length; totals.입력밖 += by("입력 밖").length; totals.노출 += by("노출").length + hits.length;
    rows.push(`| ${c.label} | ${o.orderCode} | ${meta!.chapters.length}장 ${meta!.chapters.reduce((a, x) => a + x.chars, 0).toLocaleString("ko-KR")}자 | $${runs[0]} (${runs[1]}회) | 검수 ${rv.model ?? "-"} 남김 ${rv.kept?.length ?? 0}·바로 ${rv.direct?.length ?? 0}·버림 ${rv.dropped?.length ?? 0}${rv.skipped ? `·건너뜀 ${rv.skipped}` : ""} | 수리 ${rp.items ?? 0}항목→${rp.applied?.length ?? 0}${rp.skipped ? `·${rp.skipped}` : ""} | ${by("사실").length} | ${by("입력 밖").length} | ${by("노출").length + hits.length} | ${score} | ${meta!.test ? "시험" : "**고객**"} |`);
    detail.push(`## ${c.label}\n\n- 주문 ${o.orderCode} · ${o.reportId} · 결제 ${pay[0]} · Book ${pay[1]} · 발행 ${pay[2]}\n- 호출: ${calls}\n- 표지: ${cover} — 피할 이미지·규칙 대조: ${coverCheck ? `${coverCheck.level}: ${coverCheck.reason}` : "통과"}\n- 장별 글자: ${meta!.chapters.map(x => `${x.n}장 ${x.chars}`).join(" · ")}\n`
      + `\n### 검수가 남긴 지적(수리 대상) ${rv.kept?.length ?? 0}\n${(rv.kept ?? []).map(k => `- [${k.cat}] s${k.s} 「${k.quote}」 — ${k.why}`).join("\n") || "- 없음"}\n`
      + `\n### 수리 적용 ${rp.applied?.length ?? 0}\n${(rp.applied ?? []).slice(0, 60).map(a => `- ${a.at ?? `s${a.s ?? "?"}`}: 「${(a.before ?? a.original ?? "").slice(0, 120)}」 → 「${(a.after ?? a.fixed ?? "").slice(0, 120)}」`).join("\n") || "- 없음"}\n`
      + `\n### 수리 뒤에도 남아 지운 문장 ${rv.deleted?.length ?? 0} · 발행 때 남은 사실·금지 깃발 ${rv.remainingHard?.length ?? 0} · 표지 ${rv.cover?.source ?? "-"}${rv.cover?.firstProblem ? `(첫 표지 문제: ${rv.cover.firstProblem})` : ""}\n${(rv.deleted ?? []).map(x => `- 지움 ${x.at ?? ""}: ${(x.sentence ?? "").slice(0, 160)}`).join("\n")}\n`
      + `\n### 발행본 다시 검사 — 남은 깃발(가벼운 것 제외) ${hard.length}\n${hard.map(f => `- [${CAT[f.rule] ?? "기타"}] ${f.chapter}.${f.section}.${f.paragraph} ${f.rule}${f.detail ? `(${f.detail})` : ""}: ${f.sentence.slice(0, 180)}`).join("\n") || "- 없음"}\n`
      + `\n### 가벼운 깃발 ${soft.length}\n${Object.entries(soft.reduce<Record<string, number>>((a, f) => ({ ...a, [f.rule]: (a[f.rule] ?? 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(" · ") || "없음"}\n`
      + `\n### 객관 노출 패턴 ${hits.length}\n${hits.map(h => `- ${h}`).join("\n") || "- 없음"}\n`);
  }
  writeFileSync(join(OUT, "judge.md"), `# 최종판3 12 — 무작위 4권 판정표(발행본 기준, 호출 0)\n\n만든 도구: \`NODE_PATH=tools/llm/shim pnpm exec tsx tools/final3/judge.ts\` · 원고: docs/v5/final3/books/<사례>.md\n\n`
    + `기계 합계: 사실 ${totals.사실} · 입력 밖 ${totals.입력밖} · 노출 ${totals.노출} · 점수 불일치 ${totals.점수} · 결제·발행 실패 ${totals.발행}. 같은 사람 모순·입력 밖 단정의 의미 판정은 아래 "사람 판독" 절.\n\n`
    + `| 책 | 주문 | 장·글자 | 주문 비용(생성 기록) | 검수 | 수리 | ①사실 | ③입력 밖 | ④노출 | ⑤점수 | 표시 |\n|---|---|---|---|---|---|---|---|---|---|---|\n${rows.join("\n")}\n\n${detail.join("\n")}`);
  console.log(rows.join("\n")); console.log(JSON.stringify(totals));
}
void main().catch(e => { console.error(String(e instanceof Error ? e.stack ?? e.message : e)); process.exit(1); });
