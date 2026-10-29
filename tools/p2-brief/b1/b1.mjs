// P2 B1 장면 태그 검수 도구(토큰 절약형). 에이전트는 압축 입력을 읽고 패치만 쓴다. 실제 파일 반영은 메인이 apply로 한다.
//   node tools/p2-brief/b1/b1.mjs prep             → tools/p2-brief/b1/in/<group>.json
//   node tools/p2-brief/b1/b1.mjs check <group>    → 패치를 메모리에 적용해 lint와 같은 장면 규칙을 검사(파일은 안 바꿈)
//   node tools/p2-brief/b1/b1.mjs apply            → out/*.json 패치를 파일에 반영(장면 배열 줄만 다시 씀)
// 패치 형식(out/<group>.json): { "retag": [[id, domain, index, "rel/children/job"]], "replace": [[id, domain, index, text, "rel/children/job"]], "add": [[id, domain, text, "rel/children/job"]] }
// index는 입력 파일에 적힌 원래 번호. MBTI 파일의 id는 유형 코드(ENFJ 등).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const K = path.join(ROOT, "src/data/knowledge-v5");
const DIR = import.meta.dirname;
const DOMAINS = ["work", "money", "study", "love", "marriage", "relationships", "alone"];
const REL = ["any", "single", "dating", "married", "unmarried"], CHI = ["any", "has", "none"], JOB = ["any", "employed", "business", "student"];
export const GROUPS = {
  g01: ["myeongri/day-pillar-01.json", "myeongri/day-pillar-02.json", "myeongri/day-pillar-03.json"],
  g02: ["myeongri/day-pillar-04.json", "myeongri/day-pillar-05.json", "myeongri/day-pillar-06.json"],
  g03: ["myeongri/day-pillar-07.json", "myeongri/climate-01.json", "myeongri/climate-02.json"],
  g04: ["myeongri/climate-03.json", "myeongri/climate-04.json", "myeongri/stem-01.json"],
  g05: ["myeongri/branch-01.json", "myeongri/day-master-01.json", "myeongri/day-master-02.json", "myeongri/yin-yang-01.json", "myeongri/yin-yang-02.json"],
  g06: ["myeongri/element-01.json", "myeongri/element-02.json", "myeongri/element-03.json", "myeongri/ten-god-balance-01.json"],
  g07: ["myeongri/ten-god-01.json", "myeongri/ten-god-02.json", "myeongri/shinsal-01.json", "myeongri/shinsal-02.json"],
  g08: ["myeongri/shinsal-03.json", "myeongri/gwiin-01.json", "myeongri/gwiin-02.json", "myeongri/relation-01.json", "myeongri/relation-02.json"],
  g09: ["myeongri/structure-01.json", "myeongri/twelve-stage-01.json", "myeongri/twelve-stage-02.json"],
  g10: fs.readdirSync(path.join(K, "mbti")).sort().map(f => `mbti/${f}`),
};
// lint와 같은 규칙(scripts/knowledge-lint.ts에서 옮김)
const FORBIDDEN = [
  /남다른 잠재력|무한한 가능성|특별한 존재|소중한 사람|빛나는 (존재|사람)|자신만의 길|큰 복|많은 복|복이 많|좋은 일이 (생깁니다|있을)|성공할 (것|수 있)|행복해질|긍정적인 (에너지|마음)|타고난 복|귀인이 나타|대박|운명적|잠재력이 (있|큽|많)/,
  /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|임신|출산)(을|이|가)? ?(하게 됩니다|합니다\.|납니다|됩니다\.|생깁니다|있습니다\.|옵니다)|(올해|내년|\d+년 (안|내|뒤)|\d+살)에? (결혼|이별|이혼|승진|합격|임신)|반드시|틀림없이|무조건|\b100%/,
  /일 수도 있습니다|가능성이 있습니다|일지도 모릅니다|참고하세요|미입력|입력되지 않았/,
  /문제가 있습니다|불행|저주|한심|쓸모없|멍청|게으른 사람|못난|열등/,
];
const HAN = /[一-鿿]/;
const MBTI_CODE = /\b[EI][NS][TF][JP]\b|MBTI/;
const JARGON = /(^|\s)사주(가|를|에|의|는|로|와|도|상|팔자)|명리|(^|\s)일간(이|을|의|에|과|은)|(^|\s)일주(가|를|의|에|는|라)|(^|\s)월지|(^|\s)일지(가|를|의|에)|(^|\s)시지(가|를|에)|(^|\s)년지|천간|(^|\s)지지(가|를|의|에|는|로)|오행|십성|신살|귀인|대운(이|을|의|에|은|도|과|에서)|세운(이|을|의|에|은|도|과|에서)|원국|용신|격국|지장간|십이운성|삼합|육합|방합|형살|인지기능|주기능|열등기능/;
const CHILD = /(^|\s)(아이|자녀|아들|딸|애들)(가|를|의|이|와|도|랑|한테|에게|\s(준비물|일정|생일|교육|학교|숙제|계획|생일상|방))/;
const SUSPECT = /회사|팀장|상사|사장|직원|손님|가게|매장|출근|퇴근|회의|보고서|결재|월급|연봉|부서|학교|수업|시험|과제|교수|선생님|학원|학기|애인|연인|남자친구|여자친구|데이트|썸|소개팅|배우자|남편|아내|부부|결혼|신혼|시댁|처가|아이|자녀|아들|딸|육아|함께 살|같이 살|살림/;
const norm = t => t.replace(/[\s\p{P}\p{S}]/gu, "");
const sentences = t => t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
const tagStr = r => `${r.relationship}/${r.children}/${r.job}`;
const parseTag = s => { const [relationship, children, job] = s.split("/"); return { relationship, children, job }; };

function loadFile(rel) {
  const j = JSON.parse(fs.readFileSync(path.join(K, rel), "utf8"));
  const isMbti = rel.startsWith("mbti/");
  const items = isMbti ? j.profiles.map(p => ({ id: p.type, key: "type", easyName: p.easyName, oneLiner: p.oneLiner, metaphor: p.image.metaphor, scenes: p.signals }))
    : j.features.map(f => ({ id: f.id, key: "id", easyName: f.easyName, oneLiner: f.oneLiner, metaphor: f.image.metaphor, scenes: f.scenes }));
  return { rel, isMbti, items };
}
const fits = (s, rel) => (s.requires.relationship === "any" || s.requires.relationship === rel || (s.requires.relationship === "unmarried" && rel !== "married")) && s.requires.children !== "has" && s.requires.job === "any";
function domainIssues(list, d, isMbti) {
  const out = [];
  const [lo, hi] = isMbti ? [3, 5] : [2, 6];
  if (list.length < lo || list.length > hi) out.push(`장면 수 ${list.length} (허용 ${lo}~${hi})`);
  for (const [name, rel] of [["미혼", "single"], ["연애 중", "dating"], ["기혼", "married"]]) if (!list.some(s => fits(s, rel))) out.push(`${name}·직업 정보 없음 고객이 쓸 장면 없음`);
  if (d === "marriage") {
    if (!list.some(s => s.requires.relationship === "married")) out.push("married 장면 필요");
    if (!list.some(s => s.requires.relationship === "unmarried")) out.push("unmarried(언젠가형) 장면 필요");
  }
  if (list.some(s => s.requires.children === "has") && !list.some(s => s.requires.children === "none")) out.push("children:has 장면에 none(언젠가형) 짝 필요");
  return out;
}
function textIssues(t, req) {
  const out = [];
  if (t.length < 20 || t.length > 140) out.push(`길이 ${t.length}(20~140)`);
  for (const s of sentences(t)) if (s.length > 90) out.push(`문장 > 90자: ${s}`);
  for (const re of FORBIDDEN) if (re.test(t)) out.push(`금지 표현: ${t.match(re)[0]}`);
  if (HAN.test(t)) out.push("한자");
  if (MBTI_CODE.test(t)) out.push("MBTI 코드");
  const j = t.match(JARGON); if (j) out.push(`명리 용어: ${j[0]}`);
  if (req.children === "any" && CHILD.test(t)) out.push("자녀 언급인데 children 태그 any");
  return out;
}

function prep() {
  fs.mkdirSync(path.join(DIR, "in"), { recursive: true });
  for (const [g, files] of Object.entries(GROUPS)) {
    const features = [];
    for (const rel of files) {
      const { isMbti, items } = loadFile(rel);
      for (const it of items) {
        const scenes = {}; const issues = [];
        for (const d of DOMAINS) {
          const list = it.scenes[d]; const di = domainIssues(list, d, isMbti);
          di.forEach(x => issues.push(`${d}: ${x}`));
          const full = d === "marriage" || d === "love" || di.length > 0;
          const rows = list.map((s, i) => [i, s.text, tagStr(s.requires)]).filter(([, t, tag]) => full || tag !== "any/any/any" || SUSPECT.test(t));
          if (rows.length) scenes[d] = full ? rows : { partial: true, rows };
        }
        features.push({ file: rel, id: it.id, easyName: it.easyName, oneLiner: it.oneLiner, metaphor: it.metaphor, issues, scenes });
      }
    }
    fs.writeFileSync(path.join(DIR, "in", `${g}.json`), JSON.stringify({ group: g, files, note: "scenes[domain]: [index, text, rel/children/job]. partial=true면 그 영역은 의심 장면만 보여 준 것(나머지는 any/any/any로 이미 안전). issues=지금 상태의 규칙 위반.", features }, null, 1));
    console.log(g, features.length, "features", features.reduce((n, f) => n + f.issues.length, 0), "issues");
  }
}

function allSentenceKeys(exclude) {
  const keys = new Map();
  const walk = (v, where) => { if (typeof v === "string") { for (const s of sentences(v)) { const k = norm(s); if (k.length >= 12 && !exclude.has(v)) keys.set(k, where); } } else if (Array.isArray(v)) v.forEach(x => walk(x, where)); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "sources" && k !== "id") walk(x, where); };
  for (const dir of ["myeongri", "mbti", "fusion", "timeline"]) for (const f of fs.readdirSync(path.join(K, dir))) walk(JSON.parse(fs.readFileSync(path.join(K, dir, f), "utf8")), `${dir}/${f}`);
  return keys;
}

function applyPatch(g, write) {
  const patch = JSON.parse(fs.readFileSync(path.join(DIR, "out", `${g}.json`), "utf8"));
  const loaded = GROUPS[g].map(loadFile);
  const byId = new Map(); for (const L of loaded) for (const it of L.items) byId.set(it.id, { L, it });
  const errors = []; const touched = new Map();
  const touch = (id, d) => { const k = `${id}|${d}`; if (!touched.has(k)) touched.set(k, { id, d }); };
  const clone = new Map();
  const listOf = (id, d) => { const k = `${id}|${d}`; if (!clone.has(k)) clone.set(k, byId.get(id).it.scenes[d].map(s => ({ ...s, requires: { ...s.requires } }))); return clone.get(k); };
  const checkTag = (tag, where) => { const r = parseTag(tag); if (!REL.includes(r.relationship) || !CHI.includes(r.children) || !JOB.includes(r.job)) { errors.push(`${where}: 태그 형식 오류 ${tag}`); return null; } return r; };
  const replacedTexts = new Set();
  for (const [id, d, i, tag] of patch.retag ?? []) { if (!byId.has(id) || !DOMAINS.includes(d)) { errors.push(`retag: 없는 id/영역 ${id} ${d}`); continue; } const r = checkTag(tag, `retag ${id}.${d}[${i}]`); const l = listOf(id, d); if (!l[i]) { errors.push(`retag: 없는 index ${id}.${d}[${i}]`); continue; } if (r) { l[i].requires = r; touch(id, d); } }
  for (const [id, d, i, text, tag] of patch.replace ?? []) { if (!byId.has(id) || !DOMAINS.includes(d)) { errors.push(`replace: 없는 id/영역 ${id} ${d}`); continue; } const r = checkTag(tag, `replace ${id}.${d}[${i}]`); const l = listOf(id, d); if (!l[i]) { errors.push(`replace: 없는 index ${id}.${d}[${i}]`); continue; } replacedTexts.add(l[i].text); if (r) { l[i] = { text, requires: r, isNew: true }; touch(id, d); } }
  for (const [id, d, text, tag] of patch.add ?? []) { if (!byId.has(id) || !DOMAINS.includes(d)) { errors.push(`add: 없는 id/영역 ${id} ${d}`); continue; } const r = checkTag(tag, `add ${id}.${d}`); if (r) { listOf(id, d).push({ text, requires: r, isNew: true }); touch(id, d); } }
  // 검사: 새 문장 / 영역 규칙(모든 항목·영역) / 중복
  const keys = allSentenceKeys(replacedTexts); const seenNew = new Map();
  for (const L of loaded) for (const it of L.items) for (const d of DOMAINS) {
    const list = clone.get(`${it.id}|${d}`) ?? it.scenes[d];
    domainIssues(list, d, L.isMbti).forEach(x => errors.push(`${it.id}.${d}: ${x}`));
    list.forEach((s, i) => { if (!s.isNew) return; textIssues(s.text, s.requires).forEach(x => errors.push(`${it.id}.${d}[${i}]: ${x}`));
      for (const sen of sentences(s.text)) { const k = norm(sen); if (k.length < 12) continue; if (keys.has(k) || seenNew.has(k)) errors.push(`${it.id}.${d}[${i}]: 중복 문장 "${sen}" (${keys.get(k) ?? seenNew.get(k)})`); seenNew.set(k, `${it.id}.${d}`); } });
  }
  if (!write) return { errors, touched: touched.size, counts: { retag: patch.retag?.length ?? 0, replace: patch.replace?.length ?? 0, add: patch.add?.length ?? 0 } };
  if (errors.length) throw new Error(`${g}: 오류 ${errors.length}건, apply 중단\n` + errors.slice(0, 20).join("\n"));
  // 파일 반영: 해당 항목·영역의 배열 줄만 교체
  const fmt = s => `{ "text": ${JSON.stringify(s.text)}, "requires": { "relationship": "${s.requires.relationship}", "children": "${s.requires.children}", "job": "${s.requires.job}" } }`;
  for (const L of loaded) {
    const p = path.join(K, L.rel); let lines = fs.readFileSync(p, "utf8").split("\n");
    for (const { id, d } of touched.values()) {
      if (byId.get(id).L !== L) continue;
      const keyName = L.isMbti ? "type" : "id";
      const start = lines.findIndex(l => l.trim() === `"${keyName}": ${JSON.stringify(id)},`);
      if (start < 0) throw new Error(`항목 줄 못 찾음 ${id}`);
      const open = lines.findIndex((l, i) => i > start && l.trim() === `"${d}": [`);
      const indent = lines[open].match(/^\s*/)[0];
      const close = lines.findIndex((l, i) => i > open && (l === `${indent}]` || l === `${indent}],`));
      const items = clone.get(`${id}|${d}`).map((s, i, a) => `${indent}  ${fmt(s)}${i < a.length - 1 ? "," : ""}`);
      lines = [...lines.slice(0, open + 1), ...items, ...lines.slice(close)];
    }
    const text = lines.join("\n"); JSON.parse(text); fs.writeFileSync(p, text);
  }
  return { errors: [], touched: touched.size };
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "prep") prep();
else if (cmd === "check") { const r = applyPatch(arg, false); console.log(JSON.stringify({ errors: r.errors.length, touched: r.touched, counts: r.counts })); r.errors.slice(0, 60).forEach(e => console.log(e)); if (r.errors.length > 60) console.log(`... ${r.errors.length - 60} more`); }
else if (cmd === "apply") { for (const g of Object.keys(GROUPS)) { if (!fs.existsSync(path.join(DIR, "out", `${g}.json`))) { console.log(g, "패치 없음"); continue; } const r = applyPatch(g, true); console.log(g, "반영", r.touched, "영역"); } }
else console.log("usage: prep | check <group> | apply");
