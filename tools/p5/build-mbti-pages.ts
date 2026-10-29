/**
 * 책 MBTI 쪽 표시용 이름·요약·키워드(P5). 지식 DB(knowledge-v5/mbti)는 읽기만 한다.
 *   pnpm exec tsx tools/p5/build-mbti-pages.ts → src/data/book-pages/mbti.json
 * 이름은 지식 DB easyName 그대로(16Personalities 유형명 미사용), 요약 4줄은 인지 기능 쉬운 설명(존댓말),
 * 키워드 5개는 dimensionTags 절댓값 상위 5개를 부드러운 낱말로(음수면 반대쪽 낱말).
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = join(ROOT, "src/data/knowledge-v5/mbti");
/** [높을 때, 낮을 때]. 비하·단정 낱말 없이 둘 다 장점으로 읽히게. */
const POLES: Record<string, readonly [string, string]> = {
  planning: ["계획", "즉흥"], socialEnergy: ["어울림", "혼자 충전"], empathyResponse: ["공감", "담담함"], emotionalExpression: ["풍부한 표현", "차분함"],
  noveltySeeking: ["새로움", "익숙함의 힘"], ruleAdherence: ["원칙", "융통성"], verbalOutput: ["말솜씨", "신중한 말"], directness: ["솔직함", "배려하는 말"],
  independence: ["독립", "함께하기"], conflictApproach: ["정면 돌파", "부드러운 조율"], caretaking: ["돌봄", "각자 존중"], dutifulness: ["책임감", "자유로움"],
  spendingControl: ["알뜰함", "넉넉한 씀씀이"], detailFocus: ["꼼꼼함", "큰 그림"], boundarySetting: ["분명한 선", "너그러움"], riskTaking: ["도전", "안정"],
  decisionSpeed: ["빠른 결정", "숙고"], inquiry: ["탐구", "실용"], introspection: ["성찰", "행동"], controlNeed: ["주도", "맡기기"],
  intimacyPace: ["빠른 친밀감", "천천히 가까워짐"], persistence: ["끈기", "유연한 전환"], competitiveness: ["승부욕", "협력"], statusDrive: ["성취", "소박함"],
  trustThreshold: ["신중한 신뢰", "열린 마음"], attentionSeeking: ["존재감", "조용한 존재감"], mobility: ["기동력", "한자리의 깊이"], learningDrive: ["배움", "경험"],
  possessiveness: ["깊은 애착", "적당한 거리"], reactivity: ["섬세함", "침착함"], perfectionism: ["완성도", "적당함"],
};
const ROLE_LABEL: Record<string, string> = { 주기능: "가장 먼저 보는 것", 부기능: "함께 쓰는 힘", "3차기능": "가끔 꺼내는 힘", 열등기능: "가장 늦게 오는 것" };

type Profile = { type: string; easyName: string; oneLiner: string; cognitiveFunctions: { code: string; role: string; easy: string }[]; dimensionTags: Record<string, number> };
const out: Record<string, { name: string; oneLiner: string; summary: { label: string; text: string }[]; keywords: string[] }> = {};
for (const file of readdirSync(SRC).filter(f => f.endsWith(".json")).sort()) {
  const p = (JSON.parse(readFileSync(join(SRC, file), "utf8")) as { profiles: Profile[] }).profiles[0];
  const tags = Object.entries(p.dimensionTags).filter(([k]) => POLES[k]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]) || a[0].localeCompare(b[0]));
  const keywords = [...new Set(tags.map(([k, v]) => POLES[k][v >= 0 ? 0 : 1]))].slice(0, 5);
  if (keywords.length < 5) throw new Error(`${p.type}: 키워드 5개 미만`);
  out[p.type] = { name: p.easyName, oneLiner: p.oneLiner, summary: p.cognitiveFunctions.map(c => ({ label: ROLE_LABEL[c.role] ?? c.role, text: c.easy })), keywords };
}
if (Object.keys(out).length !== 16) throw new Error("16유형이 아님");
mkdirSync(join(ROOT, "src/data/book-pages"), { recursive: true });
writeFileSync(join(ROOT, "src/data/book-pages/mbti.json"), JSON.stringify({ version: "book-mbti-1", source: "knowledge-v5/mbti easyName·oneLiner·cognitiveFunctions·dimensionTags", types: out }, null, 1) + "\n");
console.log(Object.entries(out).map(([t, v]) => `${t} ${v.name} · ${v.keywords.join("·")}`).join("\n"));
