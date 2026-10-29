/**
 * P2 시험 브리프 생성: docs/eval/inputs.json의 c1(하람·정시·ENTJ), c2(서윤·시간 미상·INFP).
 * 실행: pnpm exec tsx tools/p2-brief/briefs.ts  → docs/v5/briefs/<case>-<product>.{json,md} + 상품별 토큰 추정 표(stdout)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type Brief, type BriefInput, type BriefPersonInput } from "../../src/lib/brief";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(ROOT, "docs/v5/briefs");
const evalIn = JSON.parse(readFileSync(join(ROOT, "docs/eval/inputs.json"), "utf8"));
const baseDate = String(evalIn.evaluatedAt).slice(0, 10);
const k = loadKnowledge(join(ROOT, "src/data/knowledge-v5"));

function person(key: string, ctxKey?: string): BriefPersonInput {
  const p = evalIn.persons[key]; const c = ctxKey ? evalIn.contexts[ctxKey] : undefined;
  return { name: p.name, gender: p.gender, birthDate: p.birthDate, birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, approximateBirthTimeSlot: p.approximateBirthTimeSlot, mbtiType: p.mbtiType,
    ...(c ? { context: { relationshipStatus: c.relationshipStatus, jobStatus: c.jobStatus, detailJob: c.detailJob } } : {}) };
}

export function renderMd(b: Brief): string {
  const L: string[] = [];
  const p = b.person;
  L.push(`# 브리프 요약 — ${p.callName} · ${b.productTitle} (${b.product})`, "");
  L.push(`- 기준일 ${b.baseDate} · ${p.ageBand}(${p.age}) · ${p.gender ?? "성별 없음"} · MBTI ${p.facts.mbti ?? "없음"} · 출생시간 ${p.facts.birthTimeKnown ? "앎" : "모름"}`);
  L.push(`- 관계 ${p.facts.relationship} · 자녀 ${p.facts.children} · 직업 ${p.facts.job.class}(${p.facts.job.detail || "-"})`);
  L.push(`- 금지 사실: ${p.forbiddenFacts.join(" / ")}`);
  L.push(`- 토큰 추정 ${b.budget.estimatedTokens} (${Object.entries(b.budget.bySection).map(([k, v]) => `${k} ${v}`).join(", ")})`, "");
  const c = b.chart;
  L.push("## 원국", `- ${c.pillars.year.hanja} ${c.pillars.month.hanja} ${c.pillars.day.hanja} ${c.pillars.hour?.hanja ?? "(시주 없음)"} · 일간 ${c.dayMaster.name} "${c.dayMaster.easyName}" · ${c.strength.label}`);
  L.push(`- 오행 가장 강함 ${c.elements.strongest.name} ${c.elements.strongest.level} — ${c.elements.strongest.reason} / 가장 약함 ${c.elements.weakest.name} ${c.elements.weakest.level} — ${c.elements.weakest.reason}`);
  L.push(`- 음양 ${c.yinYang.label}: ${c.yinYang.reading}`, `- 조후(${c.climate.season}, ${c.climate.level}): ${c.climate.needs.join(", ")} — ${c.climate.reading}`);
  L.push(`- 현재 대운: ${c.currentDayun ? `${c.currentDayun.ganji.hanja} ${c.currentDayun.years} ${c.currentDayun.tenGod}` : "없음"}`, `- 올해: ${c.thisYear.effect} (${c.thisYear.tenGod})`, "");
  if (b.mbti) L.push("## MBTI", `- ${b.mbti.type} ${b.mbti.easyName}: ${b.mbti.oneLiner}`, "");
  L.push("## traits", "| id | 요소 | 자리 | 강도 | 점수 | 이미지 | Fusion | 장 |", "|---|---|---|---|---|---|---|---|");
  for (const t of b.traits) L.push(`| ${t.id} | ${t.name} "${t.easyName}" | ${t.positions.join(",") || "전체"} | ${t.strength} | ${t.score} | ${t.image.metaphor} | ${t.fusion ? `${t.fusion.target} ${t.fusion.kind}${t.fusion.scene ? "+장면" : ""}` : "-"} | ${t.chapters.join(", ")} |`);
  L.push("", "## 좋은 기운", ...b.fortunes.map(f => `- ${f.name}: ${f.direct}`), "", "## 팩폭", ...b.shadows.map(s => `- ${s.id}(${s.traitId}) ${s.text} — 근거: ${s.basis}`), "", "## 아직 쓰지 못한 기운", ...(b.unused.length ? b.unused.map(u => `- ${u.name}: ${u.oneLiner}`) : ["- 없음"]), "");
  L.push("## 장");
  for (const ch of b.chapters) {
    L.push(`### ${ch.index}. ${ch.title} (${ch.role}, ${ch.targetChars.join("~")}자${ch.useName ? ", 이름" : ""})`);
    for (const m of ch.materials) L.push(`- ${m.kind === "trait" ? `trait ${m.traitId} [${m.domain}/${m.angle}] ${m.scene}` : m.kind === "mbti" ? `MBTI [${m.domain}] ${m.scene}` : m.kind === "ref" ? `ref ${m.ref}${m.note ? ` (${m.note})` : ""}` : m.kind === "evidence" ? `근거 ${m.key}: ${m.facts.join(" / ")}` : `타임라인 ${m.entryKey}`}`);
  }
  if (b.timeline) { L.push("", "## 타임라인"); for (const e of b.timeline.entries) L.push(`- ${e.label} ${e.tenGod.stem} 흐름 ${e.flow.score}(${e.flow.label}) 배지 ${e.badges.map(x => x.label).join(",") || "-"} · ${e.keywords.join("/")} · 행동 ${e.action.text}`); }
  if (b.compatibility) { const x = b.compatibility; L.push("", "## 궁합", `- 관점 ${x.lens.focus} · 점수 ${x.score.value ?? "-"} (${x.score.status})`, `- A→B ${x.tenGodAB.tenGod}, B→A ${x.tenGodBA.tenGod}, 일주 관계 ${x.dayRelations.join(" / ") || "-"}`, `- 보완 ${x.complement.join(" / ") || "-"}`, `- 차이 ${x.differences.map(d => `${d.dimension}: ${d.a} vs ${d.b}`).join(" / ")}`); }
  return L.join("\n") + "\n";
}

const cases: { name: string; input: BriefInput; save: boolean }[] = [];
const c1 = person("haram", "c1"), c2 = person("seoyun", "c2");
for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child", "major_fortune", "annual_fortune"] as const) {
  cases.push({ name: `c1-${product}`, input: { product, person: c1, baseDate, ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, save: product === "saju_mbti_full" || product === "love_marriage_child" });
  cases.push({ name: `c2-${product}`, input: { product, person: c2, baseDate, ...(product === "annual_fortune" ? { selectedYear: 2026 } : {}) }, save: product === "saju_mbti_full" || product === "love_marriage_child" });
}
for (const cc of evalIn.compatibilityCases) cases.push({ name: `pair-${cc.id}`, input: { product: "saju_mbti_compatibility", person: person(cc.personA), partner: person(cc.personB), relationshipType: cc.relationshipType, baseDate }, save: false });

mkdirSync(OUT, { recursive: true });
const rows: string[] = ["| 사례 | 상품 | 토큰 추정 | traits | 장 | 장면 |", "|---|---|---|---|---|---|"];
for (const c of cases) {
  const b = buildBrief(c.input, k);
  const scenes = b.chapters.flatMap(ch => ch.materials).filter(m => m.kind === "trait" || m.kind === "mbti").length + b.traits.filter(t => t.fusion?.scene).length;
  rows.push(`| ${c.name} | ${b.product} | ${b.budget.estimatedTokens} | ${b.traits.length} | ${b.chapters.length} | ${scenes} |`);
  if (c.save) { writeFileSync(join(OUT, `${c.name}.json`), JSON.stringify(b, null, 1) + "\n"); writeFileSync(join(OUT, `${c.name}.md`), renderMd(b)); }
}
console.log(rows.join("\n"));
