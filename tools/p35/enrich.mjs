// P3.5 A1 지식 DB 보강 도구(토큰 절약형, tools/p2-brief/b1/b1.mjs 방식). 대상: 감지 빈도 상위 30% 요소.
//   node tools/p35/enrich.mjs prep            → tools/p35/enrich/in/<group>.json (요소 요약 + 영역별 부족 수)
//   node tools/p35/enrich.mjs check <group>   → out/<group>.json 패치를 메모리에 적용해 규칙 검사(파일은 안 바꿈)
//   node tools/p35/enrich.mjs apply           → out/*.json 패치를 파일에 반영
// 패치 형식(out/<group>.json): { "images": [[id, metaphor, visual]], "add": [[id, domain, text, "rel/children/job"]] }
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const K = path.join(ROOT, "src/data/knowledge-v5");
const DIR = path.join(import.meta.dirname, "enrich");
const DOMAINS = ["work", "money", "study", "love", "marriage", "relationships", "alone"];
const REL = ["any", "single", "dating", "married", "unmarried"], CHI = ["any", "has", "none"], JOB = ["any", "employed", "business", "student"];
export const MIN_SCENES = 3, MIN_IMAGES = 3, TOP_RATIO = 0.3;

export function topFeatureIds() {
  const freq = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/brief/data/feature-frequency.json"), "utf8"));
  const e = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return e.slice(0, Math.ceil(e.length * TOP_RATIO)).map(x => x[0]);
}

// lint와 같은 문장 규칙(scripts/knowledge-lint.ts, tools/p2-brief/b1/b1.mjs에서 옮김)
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
const JOBWORD = /회사|팀장|상사|사장님|직원|손님|가게|매장|출근|퇴근|결재|월급|연봉|부서|수업|교수|선생님|학원|학기/;
const PARTNER = /애인|연인|남자친구|여자친구|데이트|배우자|남편|아내|부부|신혼|시댁|처가/;
// A5 경험 단정(patterns.ts EXPERIENCE_ASSERT와 같은 규칙)
const EXPERIENCE = /(해|겪어|받아|느껴|당해|가|와|써|만나|들어|잃어|견뎌|버텨|살아) ?본 (사람|분|당신|감각|만큼|경험)|겪어 ?(본|봤|왔)|[가-힣]했던 (사람|분|당신)|본 적이 (있|많)(습니다|어요|죠|을 거예요|을 겁니다)|적이 (있는|많은) (사람|분|당신)/;
const norm = t => t.replace(/[\s\p{P}\p{S}]/gu, "");
const sentences = t => t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
const tagStr = r => `${r.relationship}/${r.children}/${r.job}`;
const parseTag = s => { const [relationship, children, job] = s.split("/"); return { relationship, children, job }; };

function loadAll() {
  const byId = new Map();
  for (const f of fs.readdirSync(path.join(K, "myeongri")).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(K, "myeongri", f), "utf8"));
    for (const x of j.features) byId.set(x.id, { rel: `myeongri/${f}`, f: x });
  }
  return byId;
}
export function groups() {
  const byId = loadAll();
  const ids = topFeatureIds().sort((a, b) => byId.get(a).rel.localeCompare(byId.get(b).rel) || a.localeCompare(b));
  const out = {}; const n = 6;
  ids.forEach((id, i) => { const g = `e${String(Math.floor(i * n / ids.length) + 1).padStart(2, "0")}`; (out[g] ??= []).push(id); });
  return out;
}

const fits = (s, rel) => (s.requires.relationship === "any" || s.requires.relationship === rel || (s.requires.relationship === "unmarried" && rel !== "married")) && s.requires.children !== "has" && s.requires.job === "any";
function domainIssues(list, d) {
  const out = [];
  if (list.length < MIN_SCENES || list.length > 6) out.push(`장면 수 ${list.length} (허용 ${MIN_SCENES}~6)`);
  for (const [name, rel] of [["미혼", "single"], ["연애 중", "dating"], ["기혼", "married"]]) if (!list.some(s => fits(s, rel))) out.push(`${name}·직업 정보 없음 고객이 쓸 장면 없음`);
  if (d === "marriage") {
    if (!list.some(s => s.requires.relationship === "married")) out.push("married 장면 필요");
    if (!list.some(s => s.requires.relationship === "unmarried")) out.push("unmarried(언젠가형) 장면 필요");
  }
  if (list.some(s => s.requires.children === "has") && !list.some(s => s.requires.children === "none")) out.push("children:has 장면에 none(언젠가형) 짝 필요");
  return out;
}
function proseIssues(t, min, max) {
  const out = [];
  if (t.length < min || t.length > max) out.push(`길이 ${t.length}(${min}~${max})`);
  for (const s of sentences(t)) if (s.length > 90) out.push(`문장 > 90자: ${s}`);
  for (const re of FORBIDDEN) if (re.test(t)) out.push(`금지 표현: ${t.match(re)[0]}`);
  if (HAN.test(t)) out.push("한자");
  if (MBTI_CODE.test(t)) out.push("MBTI 코드");
  const j = t.match(JARGON); if (j) out.push(`명리 용어: ${j[0]}`);
  const x = t.match(EXPERIENCE); if (x && !/\?\s*$/.test(t)) out.push(`경험 단정: ${x[0]}`);
  return out;
}
function sceneIssues(t, req) {
  const out = proseIssues(t, 20, 140);
  if (req.children === "any" && CHILD.test(t)) out.push("자녀 언급인데 children 태그 any");
  if (req.job === "any" && JOBWORD.test(t)) out.push(`직업 전제 낱말인데 job 태그 any: ${t.match(JOBWORD)[0]}`);
  if (req.relationship === "any" && PARTNER.test(t)) out.push(`연인·배우자 전제 낱말인데 relationship 태그 any: ${t.match(PARTNER)[0]}`);
  return out;
}

function prep() {
  fs.mkdirSync(path.join(DIR, "in"), { recursive: true });
  const byId = loadAll();
  for (const [g, ids] of Object.entries(groups())) {
    const features = ids.map(id => {
      const { rel, f } = byId.get(id);
      const need = Object.fromEntries(DOMAINS.map(d => [d, Math.max(0, MIN_SCENES - f.scenes[d].length)]).filter(([, n]) => n > 0));
      return {
        file: rel, id, name: f.name, easyName: f.easyName, oneLiner: f.oneLiner, image: f.image,
        imagesNeeded: Math.max(0, MIN_IMAGES - (f.imageVariants?.length ?? 0)), scenesNeeded: need,
        strengths: f.strengths.slice(0, 2),
        scenes: Object.fromEntries(DOMAINS.map(d => [d, f.scenes[d].map(s => [s.text, tagStr(s.requires)])])),
      };
    });
    fs.writeFileSync(path.join(DIR, "in", `${g}.json`), JSON.stringify({ group: g, note: "imagesNeeded=새 이미지 변형 수, scenesNeeded[domain]=그 영역에 더할 장면 수. scenes[domain]=[text, rel/children/job] 기존 장면(겹치지 말 것).", features }, null, 1));
    console.log(g, features.length, "features", features.reduce((n, f) => n + f.imagesNeeded, 0), "images", features.reduce((n, f) => n + Object.values(f.scenesNeeded).reduce((a, b) => a + b, 0), 0), "scenes");
  }
}

function allKeys() {
  const keys = new Map(), metaphors = new Map();
  const walk = (v, where) => { if (typeof v === "string") { for (const s of sentences(v)) { const k = norm(s); if (k.length >= 12) keys.set(k, where); } } else if (Array.isArray(v)) v.forEach(x => walk(x, where)); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "sources" && k !== "id") walk(x, where); };
  for (const dir of ["myeongri", "mbti", "fusion", "timeline"]) for (const f of fs.readdirSync(path.join(K, dir))) {
    const j = JSON.parse(fs.readFileSync(path.join(K, dir, f), "utf8"));
    walk(j, `${dir}/${f}`);
    for (const x of j.features ?? []) for (const im of [x.image, ...(x.imageVariants ?? [])]) metaphors.set(norm(im.metaphor), x.id);
  }
  return { keys, metaphors };
}

function applyPatch(g, write) {
  const patch = JSON.parse(fs.readFileSync(path.join(DIR, "out", `${g}.json`), "utf8"));
  const ids = new Set(groups()[g]); const byId = loadAll();
  const errors = []; const images = new Map(); const scenes = new Map();
  const listOf = (id, d) => { const k = `${id}|${d}`; if (!scenes.has(k)) scenes.set(k, byId.get(id).f.scenes[d].map(s => ({ ...s }))); return scenes.get(k); };
  for (const [id, metaphor, visual] of patch.images ?? []) {
    if (!ids.has(id)) { errors.push(`images: 이 묶음에 없는 id ${id}`); continue; }
    (images.get(id) ?? images.set(id, [...(byId.get(id).f.imageVariants ?? [])]).get(id)).push({ metaphor, visual, isNew: true });
  }
  for (const [id, d, text, tag] of patch.add ?? []) {
    if (!ids.has(id) || !DOMAINS.includes(d)) { errors.push(`add: 없는 id/영역 ${id} ${d}`); continue; }
    const r = parseTag(tag ?? ""); if (!REL.includes(r.relationship) || !CHI.includes(r.children) || !JOB.includes(r.job)) { errors.push(`add ${id}.${d}: 태그 형식 오류 ${tag}`); continue; }
    listOf(id, d).push({ text, requires: r, isNew: true });
  }
  const { keys, metaphors } = allKeys(); const seenNew = new Map();
  const dup = (text, where) => { for (const sen of sentences(text)) { const k = norm(sen); if (k.length < 12) continue; if (keys.has(k) || seenNew.has(k)) errors.push(`${where}: 중복 문장 "${sen}" (${keys.get(k) ?? seenNew.get(k)})`); seenNew.set(k, where); } };
  for (const id of ids) {
    const f = byId.get(id).f;
    const im = images.get(id) ?? f.imageVariants ?? [];
    if (im.length < MIN_IMAGES) errors.push(`${id}: 이미지 변형 ${im.length}개(${MIN_IMAGES}개 이상)`);
    im.forEach((x, i) => {
      if (!x.isNew) return;
      proseIssues(x.metaphor, 6, 90).forEach(e => errors.push(`${id}.imageVariants[${i}].metaphor: ${e}`));
      proseIssues(x.visual, 6, 90).forEach(e => errors.push(`${id}.imageVariants[${i}].visual: ${e}`));
      const m = norm(x.metaphor); if (metaphors.has(m)) errors.push(`${id}.imageVariants[${i}]: 비유 중복(${metaphors.get(m)})`); metaphors.set(m, id);
      dup(x.visual, `${id}.imageVariants[${i}].visual`);
    });
    for (const d of DOMAINS) {
      const list = scenes.get(`${id}|${d}`) ?? f.scenes[d];
      domainIssues(list, d).forEach(e => errors.push(`${id}.${d}: ${e}`));
      list.forEach((s, i) => { if (!s.isNew) return; sceneIssues(s.text, s.requires).forEach(e => errors.push(`${id}.${d}[${i}]: ${e}`)); dup(s.text, `${id}.${d}[${i}]`); });
    }
  }
  const counts = { images: patch.images?.length ?? 0, add: patch.add?.length ?? 0 };
  if (!write) return { errors, counts };
  if (errors.length) throw new Error(`${g}: 오류 ${errors.length}건, apply 중단\n` + errors.slice(0, 20).join("\n"));
  const fmtScene = s => `{ "text": ${JSON.stringify(s.text)}, "requires": { "relationship": "${s.requires.relationship}", "children": "${s.requires.children}", "job": "${s.requires.job}" } }`;
  const files = new Map(); for (const id of ids) { const rel = byId.get(id).rel; (files.get(rel) ?? files.set(rel, []).get(rel)).push(id); }
  for (const [rel, fids] of files) {
    const p = path.join(K, rel); let lines = fs.readFileSync(p, "utf8").split("\n");
    for (const id of fids) {
      const start = lines.findIndex(l => l.trim() === `"id": ${JSON.stringify(id)},`);
      if (start < 0) throw new Error(`항목 줄 못 찾음 ${id}`);
      for (const d of DOMAINS) {
        if (!scenes.has(`${id}|${d}`)) continue;
        const open = lines.findIndex((l, i) => i > start && l.trim() === `"${d}": [`);
        const indent = lines[open].match(/^\s*/)[0];
        const close = lines.findIndex((l, i) => i > open && (l === `${indent}]` || l === `${indent}],`));
        const items = scenes.get(`${id}|${d}`).map((s, i, a) => `${indent}  ${fmtScene(s)}${i < a.length - 1 ? "," : ""}`);
        lines = [...lines.slice(0, open + 1), ...items, ...lines.slice(close)];
      }
      if (images.has(id)) {
        const imgOpen = lines.findIndex((l, i) => i > start && l.trim() === `"image": {`);
        const indent = lines[imgOpen].match(/^\s*/)[0];
        const imgClose = lines.findIndex((l, i) => i > imgOpen && l === `${indent}},`);
        const existing = lines.findIndex((l, i) => i > imgClose && i < imgClose + 3 && l.trim() === `"imageVariants": [`);
        let from = imgClose + 1, to = imgClose + 1;
        if (existing >= 0) { from = existing; to = lines.findIndex((l, i) => i > existing && l === `${indent}],`) + 1; }
        const v = images.get(id).map((x, i, a) => `${indent}  { "metaphor": ${JSON.stringify(x.metaphor)}, "visual": ${JSON.stringify(x.visual)} }${i < a.length - 1 ? "," : ""}`);
        lines = [...lines.slice(0, from), `${indent}"imageVariants": [`, ...v, `${indent}],`, ...lines.slice(to)];
      }
    }
    const text = lines.join("\n"); JSON.parse(text); fs.writeFileSync(p, text);
  }
  return { errors: [], counts };
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "prep") prep();
else if (cmd === "check") { const r = applyPatch(arg, false); console.log(JSON.stringify({ errors: r.errors.length, counts: r.counts })); r.errors.slice(0, 80).forEach(e => console.log(e)); if (r.errors.length > 80) console.log(`... ${r.errors.length - 80} more`); }
else if (cmd === "apply") { for (const g of Object.keys(groups())) { if (!fs.existsSync(path.join(DIR, "out", `${g}.json`))) { console.log(g, "패치 없음"); continue; } const r = applyPatch(g, true); console.log(g, "반영", JSON.stringify(r.counts)); } }
else if (cmd) console.log("usage: prep | check <group> | apply");
