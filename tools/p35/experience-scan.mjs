// A5 경험 단정 표현 찾기: node tools/p35/experience-scan.mjs → [파일, 경로, 문장]
import fs from "node:fs"; import path from "node:path";
const K = path.resolve(import.meta.dirname, "../../src/data/knowledge-v5");
export const EXPERIENCE = /(해|겪어|받아|느껴|당해|가|와|써|만나|들어|잃어|견뎌|버텨|살아) ?본 (사람|분|당신|감각|만큼|경험)|겪어 ?(본|봤|왔)|[가-힣]했던 (사람|분|당신)|본 적이 (있|많)(습니다|어요|죠|을 거예요|을 겁니다)/;
const sentences = t => t.match(/[^.!?]+[.!?]+["'”’)]*|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
const out = [];
const walk = (v, file, p) => { if (typeof v === "string") { for (const s of sentences(v)) if (EXPERIENCE.test(s) && !/\?["'”’)]*$/.test(s)) out.push([file, p, s]); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, file, `${p}[${i}]`)); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "sources") walk(x, file, p ? `${p}.${k}` : k); };
for (const dir of ["myeongri", "mbti", "fusion", "timeline"]) for (const f of fs.readdirSync(path.join(K, dir))) walk(JSON.parse(fs.readFileSync(path.join(K, dir, f), "utf8")), `${dir}/${f}`, "");
for (const f of ["behavior-ontology.json", "product-narratives.json"]) walk(JSON.parse(fs.readFileSync(path.join(K, f), "utf8")), f, "");
if (process.argv[2] !== "--quiet") out.forEach(r => console.log(r.join(" | ")));
console.log("count", out.length);
