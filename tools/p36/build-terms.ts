// 명리 용어 사전 생성(P3.6 A3): pnpm exec tsx tools/p36/build-terms.ts
// 지식 DB(신살·귀인·십성·십이운성·관계·구조·십성 균형)의 이름 → easyName + 손으로 쓴 체계 용어 + 지지 짝 관계 이름.
// 일상어와 겹치는 낱말(목욕·관대·제왕·상관·인성·망신·장성·연주·지지)과 한 글자 이름(충·형·병·사…)은 넣지 않는다(오탐).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "../../src/data/knowledge-v5/myeongri");
const FAMILIES = new Set(["shinsal", "gwiin", "tenGod", "twelveStage", "relation", "structure", "tenGodBalance"]);
const COMMON = new Set(["목욕", "관대", "제왕", "상관", "인성", "망신", "장성", "비겁"]);
// 여러 낱말 이름("인성 강한 구조", "수 보완 필요")에서 떨어져 나오는 일반 낱말과 어색한 잘림(백호대·귀문관).
const STOP = new Set(["강한", "구조", "과다", "부족", "긴장", "보완", "필요", "화금", "백호대", "귀문관"]);
const out = new Map<string, string>();
const add = (term: string, easy: string) => { if (term.length >= 2 && !COMMON.has(term) && !STOP.has(term) && !out.has(term)) out.set(term, easy); };

for (const f of readdirSync(DIR).filter(f => f.endsWith(".json")).sort()) {
  const file = JSON.parse(readFileSync(join(DIR, f), "utf8")) as { features: { family: string; name: string; easyName: string }[] };
  for (const x of file.features) {
    if (!FAMILIES.has(x.family)) continue;
    const name = x.name.replace(/\(.*?\)/g, "").replace(/·십이신살/, "").trim();
    for (const part of name.split(/\s+/)) if (/^[가-힣]+$/.test(part)) add(part, x.easyName);
    if (/살$/.test(name) && name.length >= 3) add(name.slice(0, -1), x.easyName); // 도화살 → 도화
  }
}
const CURATED: [string, string][] = [
  ["일간", "태어난 날의 나 자신 글자"], ["일주", "태어난 날 기둥"], ["일지", "태어난 날 자리의 아래 글자"], ["월지", "태어난 달 자리"], ["월주", "태어난 달 기둥"],
  ["년주", "태어난 해 기둥"], ["시주", "태어난 시각 기둥"], ["시지", "태어난 시각 자리"], ["원국", "타고난 사주 판"],
  ["천간", "위 글자"], ["십성", "열 가지 관계 기운"], ["십신", "열 가지 관계 기운"], ["신강", "기운이 센 사주"], ["신약", "기운이 여린 사주"],
  ["용신", "꼭 필요한 보충 기운"], ["희신", "돕는 기운"], ["기신", "덜어야 할 기운"], ["격국", "사주의 큰 틀"], ["오행", "다섯 기운"], ["지장간", "땅속에 숨은 글자"],
  ["배우자궁", "배우자 자리"], ["자녀궁", "자녀 자리"], ["배우자성", "배우자 별"], ["자녀성", "자녀 별"], ["십이운성", "기운의 열두 단계"], ["신살", "특별한 별 기운"],
  ["백호", "흰 호랑이"], ["귀문", "먼저 우는 풍경"], ["식상", "표현하는 기운"], ["재성", "돈과 결과 기운"], ["관성", "책임과 규칙 기운"], ["반합", "반쯤 맺힌 짝"], ["삼형", "세 글자가 조이는 마찰"], ["합충", "붙고 부딪치는 관계"],
];
for (const [t, e] of CURATED) out.set(t, e);
// 지지 짝 관계 이름(축미충 등). 쉬운 말은 관계 종류로.
const PAIRS: Record<string, [string[], string]> = {
  충: [["자오", "축미", "인신", "묘유", "진술", "사해"], "서로 부딪치는 기운"],
  합: [["자축", "인해", "묘술", "진유", "사신", "오미"], "짝꿍처럼 붙는 기운"],
  형: [["인사", "사신", "축술", "술미", "축미", "자묘"], "서로 조이는 마찰"],
  해: [["자미", "축오", "인사", "묘진", "신해", "유술"], "말 없는 서운함"],
  파: [["자유", "축진", "인해", "묘오", "사신", "술미"], "맞춘 판의 금"],
};
for (const [kind, [pairs, easy]] of Object.entries(PAIRS)) for (const p of pairs) { add(`${p}${kind}`, easy); add(`${[...p].reverse().join("")}${kind}`, easy); }
for (const p of ["자미", "축오", "인유", "묘신", "진해", "사술"]) add(`${p}원진`, "신발 속 모래알 같은 마찰");

const terms = [...out].map(([term, easy]) => ({ term, easy })).sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term));
writeFileSync(join(import.meta.dirname, "../../src/lib/brief/data/terms.json"), JSON.stringify({ version: "terms-v5-1", terms }, null, 1) + "\n");
console.log(JSON.stringify({ terms: terms.length }));
