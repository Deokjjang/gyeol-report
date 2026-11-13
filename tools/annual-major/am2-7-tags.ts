/**
 * AM2-7 2부(호출 0): 정적 항목 「필요한 입력」 꼬리표 표를 한 번에 전부 매긴다 → src/data/knowledge-v5/input-needs.json + docs/v5/annual-major/input-needs.md.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-7-tags.ts [--check]
 * 출처: MBTI 씨앗(seed) · 화면 할 일 문형(todo) · 십성 시기 장면(tgp). 꼬리표 = 낱말표(premise.ts) + DB에 이미 있는 조건(rel · job · ctx · requires).
 * 표에 없는 항목은 쓰지 않는다(needsFor → null, 기본 거절). --check: 표가 지금 DB · 낱말표와 같은지만 본다(시험 am27이 같은 것을 본다).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { needsKey, needsOf, NEEDS, PREMISE, PREMISE_VERSION, type Need } from "../../src/lib/brief/premise";

const ROOT = join(process.cwd(), "src/data/knowledge-v5");
type Item = { source: string; id: string; text: string; needs: Need[] };
export function collectNeeds(): Item[] {
  const out: Item[] = [];
  const put = (source: string, id: string, text: string, extra: readonly Need[]) => { const needs = [...new Set([...needsOf(text).map(h => h.need), ...extra])].sort() as Need[]; out.push({ source, id, text, needs }); };
  for (const f of readdirSync(join(ROOT, "mbti-seeds")).filter(x => x.endsWith(".json")).sort()) {
    const d = JSON.parse(readFileSync(join(ROOT, "mbti-seeds", f), "utf8")) as { seeds: Record<string, { id: string; text: string; rel: string; job: string; ctx: string[] }[]> };
    for (const [dom, arr] of Object.entries(d.seeds)) for (const s of arr) {
      const ex: Need[] = [];
      if (s.rel === "partner") ex.push("rel:partner");
      if (s.job === "employed") ex.push("job:employee"); else if (s.job === "business") ex.push("job:business"); else if (s.job === "student") ex.push("job:student");
      for (const c of s.ctx) ex.push(c === "office" ? "job:employee" : c === "team" || c === "freelance" || c === "code" ? "job:work" : c === "shop" ? "job:shop" : "other");
      // 연애 영역 씨앗의 「상대 · 연락 · 답장 · 다툰 · 서운」은 관심 상대나 연인을 전제한다(조사 A-3) — 연애 중 · 기혼만(솔로 전제 꼬리표가 이미 있으면 그대로).
      if (dom === "love" && /상대|연락|답장|다툰|서운|만나는 날|만남/.test(s.text) && !needsOf(s.text).some(h => h.need === "rel:single")) ex.push("rel:partner");
      put("seed", s.id, s.text, ex);
    }
  }
  const acts = JSON.parse(readFileSync(join(ROOT, "timeline", "action-templates.json"), "utf8")) as { templates: { id: string; text: string[] }[] };
  for (const a of acts.templates) a.text.forEach((t, i) => put("todo", `${a.id}#${i}`, t, []));
  const tgp = JSON.parse(readFileSync(join(ROOT, "timeline", "ten-god-period.json"), "utf8")) as { entries: { tenGod: string; year: { scenes: { text: string; requires: { relationship: string; children: string; job: string } }[] }; month: { scenes: { text: string; requires: { relationship: string; children: string; job: string } }[] } }[] };
  for (const e of tgp.entries) for (const unit of ["year", "month"] as const) e[unit].scenes.forEach((s, i) => {
    const ex: Need[] = []; const q = s.requires;
    if (q.relationship === "single") ex.push("rel:single"); else if (q.relationship === "dating") ex.push("rel:dating"); else if (q.relationship === "married") ex.push("rel:married"); else if (q.relationship === "partner") ex.push("rel:partner");
    if (q.children === "has") ex.push("children");
    if (q.job === "employed") ex.push("job:employee"); else if (q.job === "business") ex.push("job:business"); else if (q.job === "student") ex.push("job:student");
    put("tgp", `${e.tenGod}:${unit}#${i}`, s.text, ex);
  });
  return out;
}
export function needsTable(items: readonly Item[]) {
  const map: Record<string, Need[]> = {};
  for (const it of items) { const k = needsKey(it.source, it.text); map[k] = [...new Set([...(map[k] ?? []), ...it.needs])].sort() as Need[]; }
  return { version: "input-needs-am2-7", premise: PREMISE_VERSION, items: map };
}

if (process.argv[1]?.endsWith("am2-7-tags.ts")) {
  const items = collectNeeds(), table = needsTable(items), path = join(ROOT, "input-needs.json");
  if (process.argv.includes("--check")) {
    const cur = JSON.parse(readFileSync(path, "utf8")) as typeof table;
    const same = cur.premise === table.premise && JSON.stringify(cur.items) === JSON.stringify(table.items);
    console.log(same ? `표 같음(${Object.keys(table.items).length}개)` : "표가 DB · 낱말표와 다르다 — 이 도구로 다시 매긴다"); process.exit(same ? 0 : 1);
  }
  writeFileSync(path, `${JSON.stringify(table, null, 0)}\n`);
  const by = (src: string) => items.filter(i => i.source === src);
  const count = (src: string) => Object.fromEntries(NEEDS.map(n => [n, by(src).filter(i => i.needs.includes(n)).length]).filter(([, v]) => Number(v) > 0));
  const none = (src: string) => by(src).filter(i => !i.needs.length).length;
  const md = [
    "# 입력 조건 꼬리표 표(AM2-7 2부)", "",
    `- 만든 날: 2026-11-13 · 도구 \`tools/annual-major/am2-7-tags.ts\` · 낱말표 \`src/lib/brief/premise.ts\` (${PREMISE_VERSION}) · 표 \`src/data/knowledge-v5/input-needs.json\`(${Object.keys(table.items).length}개).`,
    "- 까닭: P6 판독 차단 17 가운데 6이 거르지 못한 씨앗 · 처방 종류였다(호감 ×2 · 자취방 · 월급날 · 킥오프 · 영업 전화). 금지어 목록은 빠진 낱말이 그대로 지나간다 — 항목마다 「필요한 입력」을 달고, 꼬리표가 없는 항목은 쓰지 않는다(기본 거절).",
    "- 모르는 입력은 「없음」으로 본다. 사는 곳 · 차 · 반려동물은 입력 칸이 없어 늘 없음이다.", "",
    "## 출처별 꼬리표 수", "", "| 출처 | 항목 | 필요 입력 없음 | 필요 입력별 |", "|---|---|---|---|",
    ...["seed", "todo", "tgp"].map(s => `| ${({ seed: "MBTI 씨앗(mbti-seeds)", todo: "화면 할 일 문형(action-templates)", tgp: "십성 시기 장면(ten-god-period)" } as Record<string, string>)[s]} | ${by(s).length} | ${none(s)} | ${Object.entries(count(s)).map(([k, v]) => `${k} ${v}`).join(" · ")} |`),
    "", "- 조립 문장(카드 영역 줄 · 화면 살필 점 · 좋은 것 · 그림 · 십성 뜻 · 처방 종류 이름 · 짝 이유)은 내보낼 때 같은 낱말표로 맞춘다(`neutralize` · `fitSegments`): 맞지 않는 말은 중립 꼴로, 중립 꼴이 없으면 그 마디를 뺀다.", "",
    "## 낱말표", "", "| 말 | 필요 입력 | 중립 꼴(돈 버는 일 있음 / 그 밖 · 연애 중 / 기혼) |", "|---|---|---|",
    ...PREMISE.map(rw => `| ${rw.word} | ${rw.need} | ${rw.neutral ? Object.entries(rw.neutral).map(([k, v]) => `${k}: ${v ?? "뺌"}`).join(" · ") : "뺌"} |`),
    "", "## 필요 입력 뜻", "", "- job:employee 직장인 · job:work 돈 버는 일(직장인 · 자영업 · 프리랜서) · job:business 자영업 · 사업 · job:shop 가게를 하는 자영업(일 상세에 가게 · 매장 …) · job:student 학생 · job:study 학생 · 취업 준비",
    "- rel:single 솔로 · rel:dating 연애 중 · rel:married 기혼 · rel:partner 연애 중 · 기혼 · children 자녀 있음 · residence 사는 곳(입력 없음) · other 입력 칸 없는 사실(차 · 반려동물)", "",
  ].join("\n");
  writeFileSync(join(process.cwd(), "docs/v5/annual-major/input-needs.md"), md);
  console.log(`표 ${Object.keys(table.items).length}개 · seed ${by("seed").length}(없음 ${none("seed")}) · todo ${by("todo").length}(없음 ${none("todo")}) · tgp ${by("tgp").length}(없음 ${none("tgp")})`);
  for (const s of ["seed", "todo", "tgp"]) console.log(s, JSON.stringify(count(s)));
}
