/**
 * 최종 A-6: 무작위 출생 표본에서 작가 브리프에 「신약」 라벨과 「비겁·인성 강」 라벨이 함께 들어가는 사람 수(호출 0).
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/final4/strength-scan.ts [--sample 3000] [--out docs/v5/final4/strength-scan.md]
 * 표본은 최종판3 factsheets.ts와 같은 씨앗·분포(1950~2009, 시각 있음). 상품은 출시 4종을 돌아가며(궁합은 같은 표본의 다음 사람과 짝).
 * 충돌 = 일간 강약이 신약·매우 신약이고, 브리프(작가가 보는 JSON 전체)에 「신약」이 있고 「비겁·인성(쉬운 이름 포함) 강」 라벨도 있는 경우.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildBrief, loadKnowledge } from "../../src/lib/brief";
import { renderWriterBrief } from "../../src/lib/writer/prompt";
import type { BriefPersonInput } from "../../src/lib/brief/buildBrief";

const arg = (name: string, d: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : d; };
const n = Number(arg("--sample", "3000")), out = arg("--out", "");
const k = loadKnowledge(join(process.cwd(), "src/data/knowledge-v5"));
let seed = 20261105; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const MBTI = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
const people: BriefPersonInput[] = Array.from({ length: n + 1 }, (_, i) => {
  const y = 1950 + Math.floor(rnd() * 60), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 24), mi = Math.floor(rnd() * 60);
  return { name: `표본${i}`, gender: rnd() < 0.5 ? "MALE" : "FEMALE", birthDate: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, birthTime: `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`,
    birthTimeUnknown: false, mbtiType: MBTI[Math.floor(rnd() * 16)] as never, context: { relationshipStatus: "single", jobStatus: "employee", detailJob: "" } };
});
const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
const WEAK = /신약/;
const STRONG = /(?:비겁|인성|내 방식의 힘|배우는 힘)\)?(?:\s*묶음)?(?:\s*세기)?\s*[:：]?\s*"?강(?![가-힣])|"(?:비겁|인성)":"강"/;
let weakPeople = 0, conflictPeople = 0, both = 0, errors = 0;
const examples: string[] = [];
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  const product = PRODUCTS[i % 4], p = people[i];
  try {
    const brief = buildBrief({ product, baseDate: "2026-11-05", person: p, ...(product === "saju_mbti_compatibility" ? { partner: people[i + 1], relationshipType: "love" as const } : {}) }, k);
    const rendered = renderWriterBrief(brief, { knowledge: k }) as Record<string, unknown>;
    // 사람별로 센다: 궁합은 상대 칸(partner)을 뺀 나머지 = 본인, partner = 상대.
    const sides = [{ chart: brief.chart, text: JSON.stringify({ ...rendered, partner: undefined }), who: p },
      ...(brief.partner ? [{ chart: brief.partner.chart, text: JSON.stringify(rendered.partner), who: people[i + 1] }] : [])];
    for (const side of sides) {
      const lv = side.chart.strength.level, g = side.chart.groups?.levels;
      if (lv !== "WEAK" && lv !== "VERY_WEAK") continue;
      weakPeople++;
      if (g && (g.비겁 === "강" || g.인성 === "강" || (g as Record<string, string>).비겁 === "있음" || (g as Record<string, string>).인성 === "있음")) conflictPeople++;
      if (WEAK.test(side.text) && STRONG.test(side.text)) { both++; if (examples.length < 8) examples.push(`${side.who.birthDate} ${side.who.birthTime} ${side.who.gender} ${product}: 「${side.text.match(WEAK)![0]}」+「${side.text.match(STRONG)![0]}」`); }
    }
  } catch (e) { errors++; if (errors < 3) console.error(e); }
}
const lines = ["# 신약 × 비겁·인성 강 — 작가 브리프 동시 등장(최종 A-6, 호출 0)", "", `명령: \`NODE_PATH=tools/llm/shim pnpm exec tsx tools/final4/strength-scan.ts --sample ${n}\``, "",
  `| 표본(책) | 신약·매우 신약(사람, 궁합은 두 사람) | 그중 비겁 또는 인성 묶음이 강(계산값) | 브리프에 두 라벨이 함께 | 오류 |`, "|---|---|---|---|---|", `| ${n} | ${weakPeople} | ${conflictPeople} | **${both}** | ${errors} |`, "",
  ...(examples.length ? ["예:", ...examples.map(x => `- ${x}`)] : []), `(${Math.round((Date.now() - t0) / 1000)}초)`];
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, lines.join("\n") + "\n"); }
console.log(lines.join("\n"));
