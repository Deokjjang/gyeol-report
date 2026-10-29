/**
 * P3 A1 Fusion 320: 일간 10 × 16유형, 십성 10 × 16유형 중 빠진 쌍을 채운다(토큰 절약형, P2 b2 방식).
 *   pnpm exec tsx tools/p3-writer/f320.ts prep           → tools/p3-writer/f320/in/<TYPE>.json (프로필 요약·기존 규칙·대상 쌍 요약·계산 점수)
 *   pnpm exec tsx tools/p3-writer/f320.ts check <TYPE>   → out/<TYPE>.json 패치를 메모리에서 검사(지식 lint Fusion 규칙 + A-3 금지)
 *   pnpm exec tsx tools/p3-writer/f320.ts apply          → out/*.json 반영(규칙 배열 끝에 추가)
 * 패치 형식(out/<TYPE>.json): { "add": [FusionRule...] }
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";
import { scorePair } from "../../src/data/knowledge-v5/cross-score";
import { MBTI_TYPES } from "../../src/data/knowledge-v5/schema";
import { OLD_NEGATIVE, isPastAssertion } from "../../src/lib/writer/safety/patterns";

const ROOT = path.resolve(import.meta.dirname, "../..");
const K = path.join(ROOT, "src/data/knowledge-v5");
const DIR = path.join(import.meta.dirname, "f320");
const read = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));
const REL = ["any", "single", "dating", "married", "unmarried"], CHI = ["any", "has", "none"], JOB = ["any", "employed", "business", "student"];
const FORBIDDEN = [
  /남다른 잠재력|무한한 가능성|특별한 존재|소중한 사람|빛나는 (존재|사람)|자신만의 길|큰 복|많은 복|복이 많|좋은 일이 (생깁니다|있을)|성공할 (것|수 있)|행복해질|긍정적인 (에너지|마음)|타고난 복|귀인이 나타|대박|운명적|잠재력이 (있|큽|많)/,
  /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|임신|출산)(을|이|가)? ?(하게 됩니다|합니다\.|납니다|됩니다\.|생깁니다|있습니다\.|옵니다)|(올해|내년|\d+년 (안|내|뒤)|\d+살)에? (결혼|이별|이혼|승진|합격|임신)|반드시|틀림없이|무조건|\b100%/,
  /일 수도 있습니다|가능성이 있습니다|일지도 모릅니다|참고하세요|미입력|입력되지 않았/,
  /문제가 있습니다|불행|저주|한심|쓸모없|멍청|게으른 사람|못난|열등/,
  /(리더십|추진력|카리스마|잠재력|재능|복)이 (있|강|많)습니다\.$|성향입니다\.$|기운입니다\.$/,
  OLD_NEGATIVE,
];
const HAN = /[一-鿿]/;
const MBTI_CODE = /\b[EI][NS][TF][JP]\b|MBTI/;
const JARGON = /(^|\s)사주(가|를|에|의|는|로|와|도|상|팔자)|명리|(^|\s)일간(이|을|의|에|과|은)|(^|\s)일주(가|를|의|에|는|라)|(^|\s)월지|(^|\s)일지(가|를|의|에)|(^|\s)시지(가|를|에)|(^|\s)년지|천간|(^|\s)지지(가|를|의|에|는|로)|오행|십성|신살|귀인|대운(이|을|의|에|은|도|과|에서)|세운(이|을|의|에|은|도|과|에서)|원국|용신|격국|지장간|십이운성|삼합|육합|방합|형살|인지기능|주기능|열등기능/;
const CHILD = /(^|\s)(아이|자녀|아들|딸|애들)(가|를|의|이|와|도|랑|한테|에게|\s(준비물|일정|생일|교육|학교|숙제|계획|생일상|방))/;
const FORMULA = /둘이 (겹치면|만나면)/;
const norm = (t: string) => t.replace(/[\s\p{P}\p{S}]/gu, "");
const sentences = (t: string) => t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
function windows(s: string, w: number) {
  const n = s.replace(/\s+/g, " ").replace(/\b[EI][NS][TF][JP]\b/g, "#").replace(/\b[NSTF][ei]\b/g, "@");
  const out = new Set<string>(); for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (/[가-힣]{3}/.test(x) && !/[#@]/.test(x)) out.add(x); } return out;
}
const features = new Map<string, any>(fs.readdirSync(path.join(K, "myeongri")).flatMap(f => read(path.join(K, "myeongri", f)).features).map((f: any) => [f.id, f]));
const dims = new Map<string, any>(read(path.join(K, "behavior-ontology.json")).dimensions.map((d: any) => [d.id, d]));
const profile = (t: string) => read(path.join(K, "mbti", `${t}.json`)).profiles[0];
const fusionFile = (t: string) => path.join(K, "fusion", `${t}.json`);
const TARGET_IDS = [...features.values()].filter(f => f.family === "dayMaster" || f.family === "tenGod").map(f => f.id as string).sort();

function missingPairs(type: string): string[] {
  const have = new Set(read(fusionFile(type)).rules.filter((r: any) => r.mbtiTarget === type).map((r: any) => r.myeongriId));
  return TARGET_IDS.filter(id => !have.has(id));
}

function prep() {
  fs.mkdirSync(path.join(DIR, "in"), { recursive: true });
  const gold = read(path.join(K, "fusion", "gold.json")).rules.map((r: any) => ({ id: r.id, kind: r.kind, why: r.why, scene: r.scene?.text }));
  let total = 0;
  for (const type of MBTI_TYPES) {
    const p = profile(type); const rules = read(fusionFile(type)).rules;
    const targets = missingPairs(type).map(id => {
      const f = features.get(id); const s = scorePair(id, f.dimensionTags, type, p.dimensionTags);
      return {
        myeongriId: id, id: `fusion:${id}:${type}`,
        item: { name: f.name, easyName: f.easyName, oneLiner: f.oneLiner, image: f.image, strengths: f.strengths.slice(0, 2), overuse: f.overuse.slice(0, 1) },
        computed: s ? { kind: s.kind, dimension: s.dimension, score: s.strength, top: s.contributions.slice(0, 3).map(c => `${c.dimension}(${dims.get(c.dimension)?.name}) 요소 ${c.feature} × 유형 ${c.mbti}`) } : { kind: "conditional", dimension: Object.keys(f.dimensionTags)[0], score: 0.3, top: [] },
      };
    });
    total += targets.length;
    const out = {
      type,
      note: "targets 쌍마다 규칙 하나. 기존 규칙(existingRules)·서로 간 12자 이상 같은 구절 금지, 프로필 문장 14자 복사 금지. 일간(dayMaster) = 태어난 날의 기운(나 자신), 십성(tenGod) = 원국에서 그 십성이 두드러짐.",
      profile: { easyName: p.easyName, oneLiner: p.oneLiner, functions: p.cognitiveFunctions.map((c: any) => `${c.code}(${c.role}): ${c.easy}`), shadows: p.shadows },
      dimensions: Object.fromEntries([...dims.values()].map(d => [d.id, `${d.name}: + ${d.poles.plus.label} / - ${d.poles.minus.label}`])),
      gold,
      existingRules: rules.map((r: any) => ({ id: r.id, kind: r.kind, why: r.why, scene: r.scene?.text ?? null })),
      targets,
    };
    fs.writeFileSync(path.join(DIR, "in", `${type}.json`), JSON.stringify(out, null, 1));
  }
  console.log("prep", MBTI_TYPES.length, "types,", total, "pairs");
}

function check(type: string) {
  const patch = read(path.join(DIR, "out", `${type}.json`));
  const file = read(fusionFile(type)); const errors: string[] = [];
  const allIds = new Set(fs.readdirSync(path.join(K, "fusion")).flatMap(f => read(path.join(K, "fusion", f)).rules.map((r: any) => r.id)));
  const want = new Set(missingPairs(type));
  const p = profile(type);
  const profileWins = new Set([p.oneLiner, ...p.cognitiveFunctions.map((c: any) => c.easy), ...Object.values(p.signals).flat().map((s: any) => s.text), ...p.shadows].flatMap((s: string) => [...windows(s, 14)]));
  const prose = (where: string, t: string, scene: boolean, childTagged = false) => {
    for (const re of FORBIDDEN) if (re.test(t)) errors.push(`${where}: 금지 표현 ${t.match(re)![0]}`);
    if (HAN.test(t)) errors.push(`${where}: 한자`);
    for (const s of sentences(t)) { if (s.length > 90) errors.push(`${where}: 문장 > 90자: ${s}`); if (isPastAssertion(s)) errors.push(`${where}: 과거 경험 단정(질문형·경향형으로): ${s}`); }
    if (scene) { if (MBTI_CODE.test(t)) errors.push(`${where}: 장면에 MBTI 코드`); const j = t.match(JARGON); if (j) errors.push(`${where}: 장면에 명리 용어 ${j[0]}`); if (!childTagged && CHILD.test(t)) errors.push(`${where}: 자녀 언급인데 children any`); }
  };
  const tagOk = (q: any, where: string) => { if (!REL.includes(q?.relationship) || !CHI.includes(q?.children) || !JOB.includes(q?.job)) errors.push(`${where}: 태그 오류 ${JSON.stringify(q)}`); };
  const add: any[] = patch.add ?? [];
  const covered = new Set<string>();
  for (const r of add) {
    const w = r.id ?? "(id 없음)";
    if (r.id !== `fusion:${r.myeongriId}:${type}`) errors.push(`${w}: id는 fusion:<myeongriId>:${type}`);
    if (allIds.has(r.id)) errors.push(`${w}: 이미 있는 id`);
    if (!want.has(r.myeongriId)) errors.push(`${w}: 대상 쌍이 아님`);
    if (covered.has(r.myeongriId)) errors.push(`${w}: 같은 쌍 두 번`); covered.add(r.myeongriId);
    if (r.mbtiTarget !== type || !["resonance", "tension", "conditional"].includes(r.kind)) errors.push(`${w}: mbtiTarget=${type}, kind=resonance|tension|conditional`);
    if (typeof r.dimension !== "string" || !dims.has(r.dimension) || typeof r.score !== "number") errors.push(`${w}: dimension(온톨로지 id)·score 필요`);
    if (typeof r.why !== "string" || r.why.length < 10 || r.why.length > 220) errors.push(`${w}: why 길이 ${r.why?.length}(10~220)`); else prose(`${w}.why`, r.why, false);
    if (!r.scene || typeof r.scene.text !== "string" || r.scene.text.length < 20 || r.scene.text.length > 140) errors.push(`${w}: scene.text 20~140 필요`);
    else { const q = r.scene.requires ?? {}; tagOk(q, `${w}.scene`); if (Object.keys(r.scene).length !== 2 || Object.keys(q).length !== 3) errors.push(`${w}: scene은 {text, requires{relationship,children,job}}만`); prose(`${w}.scene`, r.scene.text, true, q.children !== "any"); }
    if (!r.factBoundary || !Array.isArray(r.factBoundary.requires) || !r.factBoundary.requires.includes("mbtiKnown") || !Array.isArray(r.factBoundary.forbids)) errors.push(`${w}: factBoundary {requires:["mbtiKnown"], forbids:[...]}`);
    if (!Array.isArray(r.sources) || !r.sources.length) errors.push(`${w}: sources 필요`);
  }
  for (const id of want) if (!covered.has(id)) errors.push(`누락 쌍: ${id}`);
  const seen = new Map<string, string>(); let formula = 0;
  const all = [...file.rules.map((r: any) => ({ r, isNew: false })), ...add.map(r => ({ r, isNew: true }))];
  for (const { r, isNew } of all) {
    for (const [k, text] of [["why", r.why ?? ""], ["scene", r.scene?.text ?? ""]] as const) {
      const ws = windows(text, 12);
      if (isNew) {
        const hit = [...ws].find(x => seen.has(x) && seen.get(x) !== r.id); if (hit) errors.push(`${r.id}.${k}: 유형 내 반복 구절 「${hit}」 ← ${seen.get(hit)}`);
        const copied = [...windows(text, 14)].find(x => profileWins.has(x)); if (copied) errors.push(`${r.id}.${k}: 프로필 원문 복사 「${copied}」`);
      }
      for (const x of ws) if (!seen.has(x)) seen.set(x, r.id);
    }
    if (FORMULA.test(r.why ?? "") && ++formula > 1 && isNew) errors.push(`${r.id}.why: "둘이 겹치면/만나면"은 유형당 1회`);
  }
  const keys = new Map<string, string>();
  const walk = (v: any, where: string) => { if (typeof v === "string") { for (const s of sentences(v)) { const k = norm(s); if (k.length >= 12) keys.set(k, where); } } else if (Array.isArray(v)) v.forEach(x => walk(x, where)); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "sources" && k !== "id") walk(x, where); };
  for (const dir of ["myeongri", "mbti", "fusion", "timeline"]) for (const f of fs.readdirSync(path.join(K, dir))) walk(read(path.join(K, dir, f)), `${dir}/${f}`);
  const seenNew = new Set<string>();
  for (const r of add) for (const t of [r.why ?? "", r.scene?.text ?? ""]) for (const s of sentences(t)) { const k = norm(s); if (k.length < 12) continue; if (keys.has(k) || seenNew.has(k)) errors.push(`${r.id}: 중복 문장 "${s}"`); seenNew.add(k); }
  return { errors, add: add.length, want: want.size };
}

function apply() {
  for (const f of fs.existsSync(path.join(DIR, "out")) ? fs.readdirSync(path.join(DIR, "out")) : []) {
    const type = f.replace(/\.json$/, ""); const r = check(type);
    if (r.errors.length) throw new Error(`${type}: 오류 ${r.errors.length}건\n${r.errors.slice(0, 10).join("\n")}`);
    const patch = read(path.join(DIR, "out", f)); const p = fusionFile(type);
    let text = fs.readFileSync(p, "utf8");
    if (patch.add?.length) {
      const fmt = (rule: any) => JSON.stringify(rule, null, 2).split("\n").map(l => "    " + l).join("\n")
        .replace(/"scene": \{\n\s*"text": ("(?:[^"\\]|\\.)*"),\n\s*"requires": \{\n\s*"relationship": ("\w+"),\n\s*"children": ("\w+"),\n\s*"job": ("\w+")\n\s*\}\n\s*\}/, (_m, t, a, b, c) => `"scene": { "text": ${t}, "requires": { "relationship": ${a}, "children": ${b}, "job": ${c} } }`);
      const end = text.lastIndexOf("\n  ]");
      text = text.slice(0, end) + ",\n" + patch.add.map(fmt).join(",\n") + text.slice(end);
    }
    JSON.parse(text); fs.writeFileSync(p, text);
    console.log(type, "add", patch.add?.length ?? 0);
  }
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "prep") prep();
else if (cmd === "check") { const r = check(arg); console.log(JSON.stringify({ errors: r.errors.length, add: r.add, want: r.want })); r.errors.slice(0, 60).forEach(e => console.log(e)); }
else if (cmd === "apply") apply();
else console.log("usage: prep | check <TYPE> | apply");
