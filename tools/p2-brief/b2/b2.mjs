// P2 B2 Fusion 긴장 규칙 추가 도구(토큰 절약형). 에이전트는 압축 입력을 읽고 패치만 쓴다. 반영은 메인이 apply로 한다.
//   node tools/p2-brief/b2/b2.mjs prep            → tools/p2-brief/b2/in/<TYPE>.json (프로필 요약·기존 규칙·후보 10개 요약)
//   node tools/p2-brief/b2/b2.mjs check <TYPE>    → 패치를 메모리에서 검사(lint의 Fusion 규칙과 같음)
//   node tools/p2-brief/b2/b2.mjs apply           → out/*.json 반영(규칙 배열 끝에 추가, 기존 장면 태그 교체)
// 패치 형식(out/<TYPE>.json): { "add": [FusionRule...], "retag": [[ruleId, "rel/children/job"]] }
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const K = path.join(ROOT, "src/data/knowledge-v5");
const DIR = import.meta.dirname;
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const REL = ["any", "single", "dating", "married", "unmarried"], CHI = ["any", "has", "none"], JOB = ["any", "employed", "business", "student"];
const FORBIDDEN = [
  /남다른 잠재력|무한한 가능성|특별한 존재|소중한 사람|빛나는 (존재|사람)|자신만의 길|큰 복|많은 복|복이 많|좋은 일이 (생깁니다|있을)|성공할 (것|수 있)|행복해질|긍정적인 (에너지|마음)|타고난 복|귀인이 나타|대박|운명적|잠재력이 (있|큽|많)/,
  /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|임신|출산)(을|이|가)? ?(하게 됩니다|합니다\.|납니다|됩니다\.|생깁니다|있습니다\.|옵니다)|(올해|내년|\d+년 (안|내|뒤)|\d+살)에? (결혼|이별|이혼|승진|합격|임신)|반드시|틀림없이|무조건|\b100%/,
  /일 수도 있습니다|가능성이 있습니다|일지도 모릅니다|참고하세요|미입력|입력되지 않았/,
  /문제가 있습니다|불행|저주|한심|쓸모없|멍청|게으른 사람|못난|열등/,
  /(리더십|추진력|카리스마|잠재력|재능|복)이 (있|강|많)습니다\.$|성향입니다\.$|기운입니다\.$/,
];
const HAN = /[一-鿿]/;
const MBTI_CODE = /\b[EI][NS][TF][JP]\b|MBTI/;
const JARGON = /(^|\s)사주(가|를|에|의|는|로|와|도|상|팔자)|명리|(^|\s)일간(이|을|의|에|과|은)|(^|\s)일주(가|를|의|에|는|라)|(^|\s)월지|(^|\s)일지(가|를|의|에)|(^|\s)시지(가|를|에)|(^|\s)년지|천간|(^|\s)지지(가|를|의|에|는|로)|오행|십성|신살|귀인|대운(이|을|의|에|은|도|과|에서)|세운(이|을|의|에|은|도|과|에서)|원국|용신|격국|지장간|십이운성|삼합|육합|방합|형살|인지기능|주기능|열등기능/;
const CHILD = /(^|\s)(아이|자녀|아들|딸|애들)(가|를|의|이|와|도|랑|한테|에게|\s(준비물|일정|생일|교육|학교|숙제|계획|생일상|방))/;
const FORMULA = /둘이 (겹치면|만나면)/;
const norm = t => t.replace(/[\s\p{P}\p{S}]/gu, "");
const sentences = t => t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
function windows(s, w) {
  const n = s.replace(/\s+/g, " ").replace(/\b[EI][NS][TF][JP]\b/g, "#").replace(/\b[NSTF][ei]\b/g, "@");
  const out = new Set(); for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (/[가-힣]{3}/.test(x) && !/[#@]/.test(x)) out.add(x); } return out;
}
const features = new Map(fs.readdirSync(path.join(K, "myeongri")).flatMap(f => read(path.join(K, "myeongri", f)).features).map(f => [f.id, f]));
const profile = t => read(path.join(K, "mbti", `${t}.json`)).profiles[0];
const fusionFile = t => path.join(K, "fusion", `${t}.json`);
const tagStr = r => `${r.relationship}/${r.children}/${r.job}`;

function prep() {
  const cands = read(path.join(ROOT, "docs/v5/p2-fusion-tension-candidates.json")).candidates;
  fs.mkdirSync(path.join(DIR, "in"), { recursive: true });
  for (const [type, list] of Object.entries(cands)) {
    const p = profile(type);
    const rules = read(fusionFile(type)).rules;
    const out = {
      type,
      note: "후보 10개 중 6개를 골라 kind=tension 규칙을 쓴다. 기존 규칙의 why·scene과 12자 이상 같은 구절 금지, 프로필 문장 14자 복사 금지.",
      profile: { easyName: p.easyName, oneLiner: p.oneLiner, functions: p.cognitiveFunctions.map(c => `${c.code}(${c.role}): ${c.easy}`), shadows: p.shadows, dimensionTags: p.dimensionTags },
      existingRules: rules.map(r => ({ id: r.id, kind: r.kind, why: r.why, scene: r.scene ? [r.scene.text, tagStr(r.scene.requires)] : null })),
      candidates: list.map(c => { const f = features.get(c.myeongriId); return { ...c, item: { name: f.name, easyName: f.easyName, oneLiner: f.oneLiner, image: f.image, strengths: f.strengths.slice(0, 2), overuse: f.overuse.slice(0, 1), dimensionTags: f.dimensionTags } }; }),
    };
    fs.writeFileSync(path.join(DIR, "in", `${type}.json`), JSON.stringify(out, null, 1));
  }
  console.log("prep", Object.keys(cands).length, "types");
}

function check(type) {
  const patch = read(path.join(DIR, "out", `${type}.json`));
  const file = read(fusionFile(type)); const errors = [];
  const allIds = new Set(fs.readdirSync(path.join(K, "fusion")).flatMap(f => read(path.join(K, "fusion", f)).rules.map(r => r.id)));
  const p = profile(type);
  const profileWins = new Set([p.oneLiner, ...p.cognitiveFunctions.map(c => c.easy), ...Object.values(p.signals).flat().map(s => s.text), ...p.shadows].flatMap(s => [...windows(s, 14)]));
  const prose = (where, t, scene, childTagged) => {
    for (const re of FORBIDDEN) if (re.test(t)) errors.push(`${where}: 금지 표현 ${t.match(re)[0]}`);
    if (HAN.test(t)) errors.push(`${where}: 한자`);
    for (const s of sentences(t)) if (s.length > 90) errors.push(`${where}: 문장 > 90자: ${s}`);
    if (scene) { if (MBTI_CODE.test(t)) errors.push(`${where}: 장면에 MBTI 코드`); const j = t.match(JARGON); if (j) errors.push(`${where}: 장면에 명리 용어 ${j[0]}`); if (!childTagged && CHILD.test(t)) errors.push(`${where}: 자녀 언급인데 children any`); }
  };
  const tagOk = (tag, where) => { const [r, c, j] = (tag ?? "").split("/"); if (!REL.includes(r) || !CHI.includes(c) || !JOB.includes(j)) errors.push(`${where}: 태그 오류 ${tag}`); };
  for (const [id, tag] of patch.retag ?? []) { if (!file.rules.some(r => r.id === id && r.scene)) errors.push(`retag: 장면 있는 규칙 없음 ${id}`); tagOk(tag, `retag ${id}`); }
  const add = patch.add ?? [];
  for (const r of add) {
    const w = r.id ?? "(id 없음)";
    if (r.id !== `fusion:${r.myeongriId}:${type}`) errors.push(`${w}: id는 fusion:<myeongriId>:${type}`);
    if (allIds.has(r.id)) errors.push(`${w}: 이미 있는 id`);
    if (!features.has(r.myeongriId)) errors.push(`${w}: myeongriId 없음`);
    if (r.mbtiTarget !== type || r.kind !== "tension") errors.push(`${w}: mbtiTarget=${type}, kind=tension 이어야 함`);
    if (typeof r.dimension !== "string" || typeof r.score !== "number") errors.push(`${w}: dimension·score 필요`);
    if (typeof r.why !== "string" || r.why.length < 10 || r.why.length > 220) errors.push(`${w}: why 길이 ${r.why?.length}(10~220)`); else prose(`${w}.why`, r.why, false);
    if (!r.scene || typeof r.scene.text !== "string" || r.scene.text.length < 20 || r.scene.text.length > 140) errors.push(`${w}: scene.text 20~140 필요`);
    else { const q = r.scene.requires ?? {}; tagOk(`${q.relationship}/${q.children}/${q.job}`, `${w}.scene`); if (Object.keys(r.scene).length !== 2 || Object.keys(q).length !== 3) errors.push(`${w}: scene은 {text, requires{relationship,children,job}}만`); prose(`${w}.scene`, r.scene.text, true, q.children !== "any"); }
    if (!r.factBoundary || !Array.isArray(r.factBoundary.requires) || !r.factBoundary.requires.includes("mbtiKnown") || !Array.isArray(r.factBoundary.forbids)) errors.push(`${w}: factBoundary {requires:["mbtiKnown"], forbids:[...]}`);
    if (!Array.isArray(r.sources) || !r.sources.length) errors.push(`${w}: sources 필요`);
  }
  // 유형 안 반복(12자 창)·프로필 복사(14자 창)·공식 1회 — 기존 규칙이 먼저 기준
  const seen = new Map(); let formula = 0;
  const all = [...file.rules.map(r => ({ r, isNew: false })), ...add.map(r => ({ r, isNew: true }))];
  for (const { r, isNew } of all) {
    for (const [k, text] of [["why", r.why ?? ""], ["scene", r.scene?.text ?? ""]]) {
      const ws = windows(text, 12);
      if (isNew) { const hit = [...ws].find(x => seen.has(x) && seen.get(x) !== r.id); if (hit) errors.push(`${r.id}.${k}: 유형 내 반복 구절 「${hit}」 ← ${seen.get(hit)}`);
        const copied = [...windows(text, 14)].find(x => profileWins.has(x)); if (copied) errors.push(`${r.id}.${k}: 프로필 원문 복사 「${copied}」`); }
      for (const x of ws) if (!seen.has(x)) seen.set(x, r.id);
    }
    if (FORMULA.test(r.why ?? "") && ++formula > 1 && isNew) errors.push(`${r.id}.why: "둘이 겹치면/만나면"은 유형당 1회`);
  }
  // DB 전체 중복 문장
  const keys = new Map();
  const walk = (v, where) => { if (typeof v === "string") { for (const s of sentences(v)) { const k = norm(s); if (k.length >= 12) keys.set(k, where); } } else if (Array.isArray(v)) v.forEach(x => walk(x, where)); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "sources" && k !== "id") walk(x, where); };
  for (const dir of ["myeongri", "mbti", "fusion", "timeline"]) for (const f of fs.readdirSync(path.join(K, dir))) walk(read(path.join(K, dir, f)), `${dir}/${f}`);
  const seenNew = new Set();
  for (const r of add) for (const t of [r.why ?? "", r.scene?.text ?? ""]) for (const s of sentences(t)) { const k = norm(s); if (k.length < 12) continue; if (keys.has(k) || seenNew.has(k)) errors.push(`${r.id}: 중복 문장 "${s}"`); seenNew.add(k); }
  return { errors, add: add.length, retag: patch.retag?.length ?? 0 };
}

function apply() {
  for (const f of fs.existsSync(path.join(DIR, "out")) ? fs.readdirSync(path.join(DIR, "out")) : []) {
    const type = f.replace(/\.json$/, ""); const r = check(type);
    if (r.errors.length) throw new Error(`${type}: 오류 ${r.errors.length}건\n${r.errors.slice(0, 10).join("\n")}`);
    const patch = read(path.join(DIR, "out", f)); const p = fusionFile(type);
    let text = fs.readFileSync(p, "utf8");
    for (const [id, tag] of patch.retag ?? []) {
      const [rel, ch, job] = tag.split("/");
      const lines = text.split("\n"); const at = lines.findIndex(l => l.trim() === `"id": ${JSON.stringify(id)},`);
      const sc = lines.findIndex((l, i) => i > at && /^\s*"scene": \{ "text": /.test(l));
      lines[sc] = lines[sc].replace(/"requires": \{[^}]*\}/, `"requires": { "relationship": "${rel}", "children": "${ch}", "job": "${job}" }`);
      text = lines.join("\n");
    }
    if (patch.add?.length) {
      const fmt = rule => JSON.stringify(rule, null, 2).split("\n").map(l => "    " + l).join("\n")
        .replace(/"scene": \{\n\s*"text": ("(?:[^"\\]|\\.)*"),\n\s*"requires": \{\n\s*"relationship": ("\w+"),\n\s*"children": ("\w+"),\n\s*"job": ("\w+")\n\s*\}\n\s*\}/, (_, t, a, b, c) => `"scene": { "text": ${t}, "requires": { "relationship": ${a}, "children": ${b}, "job": ${c} } }`);
      const end = text.lastIndexOf("\n  ]");
      text = text.slice(0, end) + ",\n" + patch.add.map(fmt).join(",\n") + text.slice(end);
    }
    JSON.parse(text); fs.writeFileSync(p, text);
    console.log(type, "add", patch.add?.length ?? 0, "retag", patch.retag?.length ?? 0);
  }
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "prep") prep();
else if (cmd === "check") { const r = check(arg); console.log(JSON.stringify({ errors: r.errors.length, add: r.add, retag: r.retag })); r.errors.slice(0, 60).forEach(e => console.log(e)); }
else if (cmd === "apply") apply();
else console.log("usage: prep | check <TYPE> | apply");
