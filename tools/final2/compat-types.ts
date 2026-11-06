/**
 * 궁합 7유형 브리프 표(최종판2 2, 호출 0): 한 쌍(장소담 × 전성민)으로 7유형 브리프를 만들어 장 질문·장면 어휘·점수 항목 가중치를 표로 낸다.
 * 연애 외 유형의 애정·스킨십·데이트 어휘 0, 부모·자녀(나이 방향이 맞지 않음)는 구조만 확인. 사람별 성격표와 명식도 낸다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final2/compat-types.ts [--md docs/v5/final2/compat-types.md]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildBrief } from "../../src/lib/brief";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { renderWriterBrief } from "../../src/lib/writer/prompt";
import { writerKnowledge } from "../../src/lib/writer/publish";
import { ROOT } from "../llm/env";
import { SODAM, SEONGMIN } from "./cases";

const TYPES = ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"] as const;
const ROMANCE = /애정|스킨십|데이트|연애|연인|설렘|설레|키스|포옹|손을 잡/g;
const { k } = writerKnowledge();
const briefOf = (type: string) => {
  const payload = { productKey: "saju_mbti_compatibility", productSlug: "compatibility", relationshipType: type, compatibilityRoleVersion: "compatibility-fixed-ab-v1", personA: SODAM, personB: SEONGMIN };
  const n = normalizeReportInputPayload(payload as never, { now: () => new Date("2026-11-05T03:00:00Z") });
  if (!n.ok) throw new Error(`${type}: ${String(n.error)}`);
  return buildBrief(payloadToBriefInput(n.value as never, "2026-11-05") as never, k);
};
const out: string[] = ["# 궁합 7유형 브리프(최종판2 2, 호출 0) — 장소담(INTP) × 전성민(ISTJ)", ""];
const love = briefOf("love");
const p = (b: ReturnType<typeof briefOf>, who: "a" | "b") => { const ch = who === "a" ? b.chart : b.partner!.chart; return ["year", "month", "day", "hour"].map(x => (ch.pillars as Record<string, { hanja: string } | undefined>)[x]?.hanja ?? "-").join("·"); };
out.push("## 명식·성격표", "", `- 장소담 명식(해·달·날·시): ${p(love, "a")}`, `- 전성민 명식(해·달·날·시): ${p(love, "b")} (예상 壬申·辛亥·己丑·甲戌 — 일주 ${love.partner!.chart.pillars.day.hanja})`, "");
for (const x of love.compatibility!.profiles ?? []) out.push(`- ${x.line}`);
out.push("", "## 유형별 장 질문·장면 어휘·점수 가중치", "", "| 유형 | 장(제목: 절 질문) | 장면 어휘(장면 씨앗 주제) | 점수 항목(만점) | 애정·스킨십·데이트 어휘 |", "|---|---|---|---|---|");
for (const t of TYPES) {
  const b = briefOf(t), c = b.compatibility!;
  const chapters = b.chapters.map(ch => `${ch.index}. ${ch.title}${ch.sections?.length ? `: ${ch.sections.map(s => s.q).join(" / ")}` : ""}`).join("<br>");
  const topics = [...new Set(b.chapters.flatMap(ch => [...ch.materials, ...(ch.sections ?? []).flatMap(s => s.materials)]).flatMap(m => m.kind === "rel" ? [m.topic] : []))].join(" · ");
  const weights = c.score.components.map(x => `${x.name} ${x.max}`).join(" · ");
  // 금지 규칙(forbiddenFacts·forbidden: "연인형 애정 표현", "연애·결혼이 아닌 관계에 애정 표현 쓰기")은 빼고 재료만 센다.
  const strip = (x: unknown): unknown => Array.isArray(x) ? x.map(strip) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).filter(([kk]) => !/^forbidden/.test(kk)).map(([kk, v]) => [kk, strip(v)])) : x;
  const text = JSON.stringify(strip(renderWriterBrief(b, { knowledge: k })));
  const hits = t === "love" ? "(연애 유형)" : [...new Set(text.match(ROMANCE) ?? [])].join("·") || "0(금지 규칙 안에만 있음)";
  out.push(`| ${t}${t === "parentChild" ? "(구조만: A 장소담 1996 = 부모 자리, B 전성민 1992)" : ""} | ${chapters} | ${topics || "-"} | ${weights} | ${hits} |`);
}
const md = out.join("\n") + "\n";
const i = process.argv.indexOf("--md");
if (i > 0) { const f = join(ROOT, process.argv[i + 1]); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, md); }
console.log(md);
