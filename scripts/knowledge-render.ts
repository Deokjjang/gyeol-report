/**
 * knowledge-v5 항목을 사람이 읽기 좋은 Markdown으로 렌더링한다.
 * 실행: pnpm exec tsx scripts/knowledge-render.ts [--ids id1,id2,...] [--family stem] [--mbti ENTJ,INFP] [--fusion id1,id2] [--out docs/v5/p1-gold-samples.md] [--title "제목"]
 * 인자 없이 실행하면 전체를 표준 출력으로 낸다. 검수 패킷·기준 항목 문서 생성용.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { DOMAINS, type FusionRule, type MbtiProfile, type MyeongriFeature } from "../src/data/knowledge-v5/schema";

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src", "data", "knowledge-v5");
const args = process.argv.slice(2);
const opt = (k: string) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
const idFilter = opt("--ids")?.split(",").map(s => s.trim()).filter(Boolean);
const familyFilter = opt("--family");
const mbtiFilter = opt("--mbti")?.split(",");
const fusionFilter = opt("--fusion")?.split(",");
const out = opt("--out");
const title = opt("--title") ?? "knowledge-v5 항목";
/** --sample 0.2 [--seed 7]: 선택된 집합에서 결정론 무작위 20%를 뽑는다(검수 패킷). */
const sampleFrac = opt("--sample") ? Number(opt("--sample")) : null;
const seed = Number(opt("--seed") ?? 20261028);
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function sample<T>(arr: T[]): T[] { if (sampleFrac === null) return arr; const rnd = mulberry32(seed); const n = Math.max(1, Math.round(arr.length * sampleFrac)); return [...arr].map(v => [rnd(), v] as const).sort((a, b) => a[0] - b[0]).slice(0, n).map(([, v]) => v); }
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const listJson = (dir: string) => (existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")).sort().map(f => join(dir, f)) : []);

const DOMAIN_KO: Record<string, string> = { work: "일", money: "돈", study: "공부", love: "연애", marriage: "결혼", relationships: "사람", alone: "혼자" };
const KIND_KO: Record<string, string> = { resonance: "공명", tension: "긴장", conditional: "조건부" };

function renderFeature(f: MyeongriFeature): string[] {
  const L: string[] = [];
  L.push(`## ${f.name} · ${f.easyName}  \`${f.id}\``, "", `**한 줄** ${f.oneLiner}`, "", `**비유** ${f.image.metaphor}  `, `**형상** ${f.image.visual}`, "");
  L.push("**장면**", "");
  for (const d of DOMAINS) for (const s of f.scenes[d]) L.push(`- [${DOMAIN_KO[d]}] ${s}`);
  L.push("", "**좋은 면**", "", ...f.strengths.map(s => `- ${s}`), "", "**과사용·팩폭**", "", ...f.overuse.map(s => `- ${s}`), "");
  if (f.positionNuance) L.push("**위치별**", "", `- 년: ${f.positionNuance.year}`, `- 월: ${f.positionNuance.month}`, `- 일: ${f.positionNuance.day}`, `- 시: ${f.positionNuance.hour}`, "");
  L.push("**강약**", "", `- 강: ${f.strengthRules.strong}`, `- 약: ${f.strengthRules.weak}`);
  if (f.strengthRules.duplicate) L.push(`- 중복: ${f.strengthRules.duplicate}`);
  if (f.strengthRules.clash) L.push(`- 충·상쇄: ${f.strengthRules.clash}`);
  L.push("", `**MBTI 연결** ${f.mbtiLinks.map(l => `${l.target}(${KIND_KO[l.kind]}: ${l.why})`).join(" / ")}`, "");
  if (f.variants?.length) { L.push("**변형**", ""); for (const v of f.variants) L.push(`- ${v.name}: ${v.oneLiner} — 비유 ${v.image.metaphor} / 형상 ${v.image.visual}${v.nuance ? ` / ${v.nuance}` : ""}`); L.push(""); }
  if (f.remedy) L.push("**보완**", "", ...f.remedy.actions.map(s => `- 행동: ${s}`), ...f.remedy.partner.map(s => `- 상대: ${s}`), `- 장소: ${f.remedy.places.join(", ")}`, "");
  L.push(`<sub>차원 ${Object.entries(f.dimensionTags).map(([k, v]) => `${k} ${v}`).join(", ")} · 엔진 ${f.engineSupport ? f.engineKey : "없음"} · 확신 ${f.confidence}</sub>`, "");
  return L;
}
function renderProfile(p: MbtiProfile): string[] {
  const L: string[] = [];
  L.push(`## ${p.type} · ${p.easyName}`, "", `**한 줄** ${p.oneLiner}`, "", `**비유** ${p.image.metaphor}  `, `**형상** ${p.image.visual}`, "");
  L.push("**인지기능**", "", ...p.cognitiveFunctions.map(c => `- ${c.role} ${c.code}: ${c.easy}`), "", "**행동 신호**", "");
  for (const d of DOMAINS) for (const s of p.signals[d]) L.push(`- [${DOMAIN_KO[d]}] ${s}`);
  L.push("", "**그림자**", "", ...p.shadows.map(s => `- ${s}`), "", `**직업군** ${p.jobs.join(", ")}`, "", "**통념 궁합(통념이며 근거 아님)**", "", ...p.conventionalCompat.map(c => `- ${c.type} ${c.fit}: ${c.why}`), "");
  L.push(`<sub>차원 ${Object.entries(p.dimensionTags).map(([k, v]) => `${k} ${v}`).join(", ")}</sub>`, "");
  return L;
}
function renderFusion(r: FusionRule): string[] {
  return [`## Fusion ${r.myeongriId} × ${r.mbtiTarget} (${KIND_KO[r.kind]}${r.dimension ? ` · ${r.dimension}` : ""})  \`${r.id}\``, "", `**왜** ${r.why}`, "", r.scene ? `**장면** ${r.scene}` : "", `<sub>전제 ${r.factBoundary.requires.join(",") || "-"} · 금지 ${r.factBoundary.forbids.join(",") || "-"}</sub>`, ""];
}

const lines: string[] = [`# ${title}`, "", `생성: \`pnpm exec tsx scripts/knowledge-render.ts${args.length ? " " + args.join(" ") : ""}\``, ""];
const features: MyeongriFeature[] = listJson(join(DATA, "myeongri")).flatMap(p => readJson(p).features as MyeongriFeature[]);
const profiles: MbtiProfile[] = listJson(join(DATA, "mbti")).flatMap(p => readJson(p).profiles as MbtiProfile[]);
const fusion: FusionRule[] = listJson(join(DATA, "fusion")).flatMap(p => readJson(p).rules as FusionRule[]);
const pickF = features.filter(f => (idFilter ? idFilter.includes(f.id) : true) && (familyFilter ? f.family === familyFilter : true));
const ordered = sample(idFilter ? idFilter.map(id => pickF.find(f => f.id === id)).filter((f): f is MyeongriFeature => !!f) : pickF);
if (ordered.length) lines.push("# 명리 요소", "", ...ordered.flatMap(renderFeature));
const pickP = sample(profiles.filter(p => (mbtiFilter ? mbtiFilter.includes(p.type) : !idFilter && !familyFilter)));
if (pickP.length) lines.push("# MBTI", "", ...pickP.flatMap(renderProfile));
const pickX = sample(fusion.filter(r => (fusionFilter ? fusionFilter.includes(r.id) : !idFilter && !familyFilter && !mbtiFilter)));
if (pickX.length) lines.push("# Fusion", "", ...pickX.flatMap(renderFusion));
const text = lines.join("\n") + "\n";
if (out) { writeFileSync(join(ROOT, out), text); console.log(`wrote ${out} (${text.length} chars, features ${ordered.length}, mbti ${pickP.length}, fusion ${pickX.length})`); } else process.stdout.write(text);
