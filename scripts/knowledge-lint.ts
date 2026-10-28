/**
 * knowledge-v5 v2 데이터 품질 게이트(결정론).
 * 실행: pnpm exec tsx scripts/knowledge-lint.ts [--only <file.json>] [--strict] [--coverage]
 *   --only     파일 하나만(스키마·문장·파일 내 중복). 서브에이전트 배치 검사용.
 *   --strict   커버리지 미달(기대 id 누락, MBTI 16 미만, Fusion 300 미만)도 실패로 친다. 완료 게이트.
 *   --coverage 가족별 커버리지 표를 docs/v5/p1-coverage.md 에 쓴다.
 *
 * 검사: zod 스키마 → id 무결성(중복·fusion myeongriId·차원 id·id-map) → 영역별 scene ≥ 2(스키마) → 이미지 필수(스키마)
 *      → 중복 문장 0(가족 간 포함) → 이미지 중복 0(전체) → 금지 표현(정보량 0·확정 예언·비하·흐린 말투) → 한자 금지(이름·출처 제외)
 *      → 문장 길이(≤90) · 한자어 연속 상한 → 용어 누출(장면 문장에 MBTI 코드·명리 일반 용어 금지) → mbtiLinks ≥ 2(스키마) → 위치 가족 positionNuance 필수.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { z } from "zod";
import {
  ActionTemplateFileSchema, BadgeFileSchema, BehaviorOntologySchema, FlowRuleSchema, FusionFileSchema, GanjiEnergyFileSchema, GanjiEnergySchema, IdMapSchema,
  MbtiFileSchema, MyeongriFileSchema, ProductNarrativesSchema, TenGodPeriodFileSchema,
  DOMAINS, FEATURE_FAMILIES, MBTI_TYPES, POSITIONAL_FAMILIES, STEMS, BRANCHES, TEN_GODS, ELEMENTS,
  type FusionRule, type MbtiProfile, type MyeongriFeature,
} from "../src/data/knowledge-v5/schema";

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src", "data", "knowledge-v5");
const args = process.argv.slice(2);
const only = args.includes("--only") ? resolve(args[args.indexOf("--only") + 1]) : null;
const strict = args.includes("--strict");
const wantCoverage = args.includes("--coverage");

type Issue = { file: string; where: string; rule: string; text?: string };
const issues: Issue[] = [];
const fail = (file: string, where: string, rule: string, text?: string) => issues.push({ file, where, rule, text });
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const listJson = (dir: string) => existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")).sort().map(f => join(dir, f)) : [];
const zodMsg = (e: z.ZodError) => e.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ");

// ---------- 규칙 상수 ----------
const FORBIDDEN: readonly [string, RegExp][] = [
  ["정보량 0", /남다른 잠재력|무한한 가능성|특별한 존재|소중한 사람|빛나는 (존재|사람)|자신만의 길|큰 복|많은 복|복이 많|좋은 일이 (생깁니다|있을)|성공할 (것|수 있)|행복해질|긍정적인 (에너지|마음)|타고난 복|귀인이 나타|대박|운명적|잠재력이 (있|큽|많)/],
  ["확정 예언", /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|임신|출산)(을|이|가)? ?(하게 됩니다|합니다\.|납니다|됩니다\.|생깁니다|있습니다\.|옵니다)|(올해|내년|\d+년 (안|내|뒤)|\d+살)에? (결혼|이별|이혼|승진|합격|임신)|반드시|틀림없이|무조건|\b100%/],
  ["흐린 말투", /일 수도 있습니다|가능성이 있습니다|일지도 모릅니다|참고하세요|미입력|입력되지 않았/],
  ["비하", /문제가 있습니다|불행|저주|한심|쓸모없|멍청|게으른 사람|못난|열등/],
  ["라벨 서술어", /(리더십|추진력|카리스마|잠재력|재능|복)이 (있|강|많)습니다\.$|성향입니다\.$|기운입니다\.$/],
];
const HAN = /[一-鿿]/;
const MBTI_CODE = /\b[EI][NS][TF][JP]\b|MBTI/;
// 장면 문장에 들어오면 안 되는 체계 용어. 일상어와 겹치는 낱말(사주다·일주일·지지 않다)은 조사까지 붙여 잡는다.
const JARGON = /(^|\s)사주(가|를|에|의|는|로|와|도|상|팔자)|명리|(^|\s)일간(이|을|의|에|과|은)|(^|\s)일주(가|를|의|에|는|라)|(^|\s)월지|(^|\s)일지(가|를|의|에)|(^|\s)시지(가|를|에)|(^|\s)년지|천간|(^|\s)지지(가|를|의|에|는|로)|오행|십성|신살|귀인|대운(이|을|의|에|은|도|과|에서)|세운(이|을|의|에|은|도|과|에서)|원국|용신|격국|지장간|십이운성|삼합|육합|방합|형살|인지기능|주기능|열등기능/;

// ---------- 문장 규칙 ----------
const sentenceStore = new Map<string, string>();
const imageStore = new Map<string, string>();
const norm = (t: string) => t.replace(/[\s\p{P}\p{S}]/gu, "");
let sentenceCount = 0, sentenceChars = 0;
type ProseOpts = { scene?: boolean; allowHan?: boolean; dedupe?: boolean; maxSentence?: number };
function checkProse(file: string, where: string, text: string, opts: ProseOpts = {}) {
  const maxSentence = opts.maxSentence ?? 90;
  for (const [name, re] of FORBIDDEN) if (re.test(text)) fail(file, where, `금지 표현(${name})`, text);
  if (!opts.allowHan && HAN.test(text)) fail(file, where, "한자", text);
  if (/\{[a-z]+\}/i.test(text) && !/\{name\}/.test(text)) fail(file, where, "알 수 없는 치환자", text);
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  for (const s of sentences) {
    sentenceCount++; sentenceChars += s.length;
    if (s.length > maxSentence) fail(file, where, `문장 길이 > ${maxSentence}`, s);
    const tokens = s.split(/\s+/);
    if (tokens.some(t => /^[가-힣]{9,}$/.test(t))) fail(file, where, "한자어 연속(9음절 이상 붙은 낱말)", s);
    let run = 0; for (const t of tokens) { run = /(적|성|화|력|률)(으로|이|을|가|의|에)?$/.test(t) && t.length >= 3 ? run + 1 : 0; if (run >= 3) { fail(file, where, "한자어 연속(접미사 3연속)", s); break; } }
    if (opts.scene) {
      if (MBTI_CODE.test(s)) fail(file, where, "용어 누출(장면에 MBTI 코드)", s);
      const j = s.match(JARGON); if (j) fail(file, where, "용어 누출(장면에 명리 용어)", `${j[0]} ← ${s}`);
    }
    if (opts.dedupe !== false) {
      const key = norm(s); if (key.length < 12) continue;
      const prev = sentenceStore.get(key);
      if (prev && prev !== where) fail(file, where, "중복 문장", `${s} (먼저: ${prev})`); else sentenceStore.set(key, where);
    }
  }
}
function checkImage(file: string, where: string, image: { metaphor: string; visual: string }) {
  checkProse(file, `${where}.metaphor`, image.metaphor); checkProse(file, `${where}.visual`, image.visual);
  for (const k of ["metaphor", "visual"] as const) {
    const key = norm(image[k]); const prev = imageStore.get(key);
    if (prev && prev !== where) fail(file, `${where}.${k}`, "이미지 중복", `${image[k]} (먼저: ${prev})`); else imageStore.set(key, where);
  }
}

// ---------- 기대 id(엔진 정합 커버리지) ----------
const SHINSAL_ENGINE = ["HYEONCHIMSAL", "HONGYEOMSAL", "BAEKHODAESAL", "MANGSINSAL", "YEOKMASAL", "DOHWASAL", "HWAGAE", "GOSINSAL", "GWASUKSAL", "TWELVE_GEOPSAL", "TWELVE_JAESAL", "TWELVE_CHEONSAL", "TWELVE_JISAL", "TWELVE_NYEONSAL", "TWELVE_WOLSAL", "TWELVE_MANGSINSAL", "TWELVE_JANGSEONGSAL", "TWELVE_BANANSAL", "TWELVE_YEOKMASAL", "TWELVE_YUKHAESAL", "TWELVE_HWAGAE"];
const GWIIN_ENGINE = ["CHEON_EUL_GWIIN", "TAEGEUK_GWIIN", "MUN_CHANG_GWIIN", "HAK_DANG_GWIIN", "WOL_DEOK_GWIIN", "CHEON_DEOK_GWIIN"];
const TWELVE_STAGES = ["長生", "沐浴", "冠帶", "建祿", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"];
const RELATIONS = ["STEM_HAP", "YUKHAP", "SAMHAP", "BANGHAP", "CHUNG", "HYEONG", "PA", "HAE"];
const STRUCTURES = ["WEAK_DAYMASTER_WITH_STRONG_WEALTH", "WEAK_DAYMASTER_WITH_STRONG_OUTPUT", "WEAK_DAYMASTER_WITH_STRONG_OFFICER", "RESOURCE_HEAVY", "PEER_HEAVY", "OUTPUT_HEAVY", "WEALTH_HEAVY", "OFFICER_HEAVY", "MIXED_OFFICER_KILLING", "RESOURCE_SUPPORTS_DAYMASTER", "OUTPUT_GENERATES_WEALTH", "WEALTH_GENERATES_OFFICER", "FIRE_METAL_TENSION", "WATER_WEAK_RECOVERY_NEEDED"];
const SEASONS = ["spring", "summer", "autumn", "winter"];
const sexagenary = () => Array.from({ length: 60 }, (_, i) => `${STEMS[i % 10]}${BRANCHES[i % 12]}`);
export const EXPECTED_IDS: Record<string, string[]> = {
  stem: STEMS.map(s => `stem:${s}`),
  branch: BRANCHES.map(b => `branch:${b}`),
  dayPillar: sexagenary().map(g => `dayPillar:${g}`),
  dayMaster: STEMS.map(s => `dayMaster:${s}`),
  tenGod: TEN_GODS.map(t => `tenGod:${t}`),
  tenGodBalance: ["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"].flatMap(f => [`tenGodBalance:${f}:STRONG`, `tenGodBalance:${f}:WEAK`]),
  shinsal: SHINSAL_ENGINE.map(c => `shinsal:${c}`),
  gwiin: GWIIN_ENGINE.map(c => `gwiin:${c}`),
  twelveStage: TWELVE_STAGES.map(s => `twelveStage:${s}`),
  relation: RELATIONS.map(r => `relation:${r}`),
  element: ELEMENTS.flatMap(e => ["STRONG", "WEAK", "MISSING", "BALANCED"].map(s => `element:${e}:${s}`)),
  yinYang: ["YANG_HEAVY", "YANG_HEAVY:MALE", "YANG_HEAVY:FEMALE", "YIN_HEAVY", "YIN_HEAVY:MALE", "YIN_HEAVY:FEMALE", "BALANCED"].map(k => `yinYang:${k}`),
  climate: STEMS.flatMap(s => SEASONS.map(se => `climate:${s}:${se}`)),
  structure: STRUCTURES.map(s => `structure:${s}`),
};

// ---------- 파일별 ----------
const stats: Record<string, any> = {};
const dimensionIds = new Set<string>();
const featureIds = new Set<string>();
const featuresByFamily: Record<string, MyeongriFeature[]> = {};
const mbtiTypesSeen = new Set<string>();
const fusionRules: FusionRule[] = [];

function lintOntology(path: string) {
  const file = basename(path);
  const r = BehaviorOntologySchema.safeParse(readJson(path));
  if (!r.success) { fail(file, "schema", "zod", zodMsg(r.error)); return; }
  for (const d of r.data.dimensions) {
    if (dimensionIds.has(d.id)) fail(file, d.id, "id 중복"); dimensionIds.add(d.id);
    checkProse(file, `${d.id}.definition`, d.definition);
    checkProse(file, `${d.id}.plus`, d.poles.plus.description, { scene: true });
    checkProse(file, `${d.id}.minus`, d.poles.minus.description, { scene: true });
    d.sceneTemplates.forEach((t, i) => checkProse(file, `${d.id}.scene[${i}]`, t.text, { scene: true }));
  }
  stats.dimensions = r.data.dimensions.length;
}

function lintFeatureFile(path: string) {
  const file = `myeongri/${basename(path)}`;
  const r = MyeongriFileSchema.safeParse(readJson(path));
  if (!r.success) { fail(file, "schema", "zod", zodMsg(r.error)); return; }
  for (const f of r.data.features) {
    const w = f.id;
    if (f.family !== r.data.family) fail(file, w, "파일 family와 다름", f.family);
    if (featureIds.has(f.id)) fail(file, w, "feature id 중복"); featureIds.add(f.id);
    (featuresByFamily[f.family] ??= []).push(f);
    checkProse(file, `${w}.name`, f.name, { allowHan: true, dedupe: false });
    checkProse(file, `${w}.oneLiner`, f.oneLiner);
    checkImage(file, `${w}.image`, f.image);
    for (const d of DOMAINS) f.scenes[d].forEach((s, i) => checkProse(file, `${w}.scenes.${d}[${i}]`, s, { scene: true }));
    f.strengths.forEach((s, i) => checkProse(file, `${w}.strengths[${i}]`, s));
    f.overuse.forEach((s, i) => checkProse(file, `${w}.overuse[${i}]`, s));
    if (POSITIONAL_FAMILIES.includes(f.family) && !f.positionNuance) fail(file, w, "위치 가족인데 positionNuance 없음");
    if (f.positionNuance) for (const [k, v] of Object.entries(f.positionNuance)) checkProse(file, `${w}.positionNuance.${k}`, v);
    for (const k of ["strong", "weak", "duplicate", "clash"] as const) { const t = f.strengthRules[k]; if (t) checkProse(file, `${w}.strengthRules.${k}`, t); }
    for (const d of Object.keys(f.dimensionTags)) if (dimensionIds.size && !dimensionIds.has(d)) fail(file, `${w}.dimensionTags`, "차원 id 미해결", d);
    f.mbtiLinks.forEach((l, i) => checkProse(file, `${w}.mbtiLinks[${i}].why`, l.why));
    f.variants?.forEach((v, i) => { checkProse(file, `${w}.variants[${i}].oneLiner`, v.oneLiner); checkImage(file, `${w}.variants[${i}].image`, v.image); if (v.nuance) checkProse(file, `${w}.variants[${i}].nuance`, v.nuance); });
    if (f.remedy) { f.remedy.actions.forEach((s, i) => checkProse(file, `${w}.remedy.actions[${i}]`, s, { scene: true })); f.remedy.partner.forEach((s, i) => checkProse(file, `${w}.remedy.partner[${i}]`, s, { scene: true })); f.remedy.places.forEach((s, i) => checkProse(file, `${w}.remedy.places[${i}]`, s, { dedupe: false })); }
    if (f.family === "element" && /:(WEAK|MISSING)$/.test(f.id) && !f.remedy) fail(file, w, "오행 부족·미흡인데 remedy 없음");
    if (f.family === "relation" && !(f.variants?.length)) fail(file, w, "합충형해인데 variants(짝) 없음");
    if (f.engineSupport && !f.engineKey && !/:BALANCED$/.test(f.id)) fail(file, w, "engineSupport인데 engineKey 없음");
  }
}

function lintMbtiFile(path: string) {
  const file = `mbti/${basename(path)}`;
  const r = MbtiFileSchema.safeParse(readJson(path));
  if (!r.success) { fail(file, "schema", "zod", zodMsg(r.error)); return; }
  for (const p of r.data.profiles) lintProfile(file, p);
}
function lintProfile(file: string, p: MbtiProfile) {
  const w = p.type;
  if (mbtiTypesSeen.has(p.type)) fail(file, w, "MBTI 유형 중복"); mbtiTypesSeen.add(p.type);
  checkProse(file, `${w}.oneLiner`, p.oneLiner);
  checkImage(file, `${w}.image`, p.image);
  p.cognitiveFunctions.forEach((c, i) => checkProse(file, `${w}.fn[${i}]`, c.easy));
  for (const d of DOMAINS) p.signals[d].forEach((s, i) => checkProse(file, `${w}.signals.${d}[${i}]`, s, { scene: true }));
  p.shadows.forEach((s, i) => checkProse(file, `${w}.shadows[${i}]`, s));
  const compatTypes = new Set(p.conventionalCompat.map(c => c.type));
  if (compatTypes.has(p.type)) fail(file, `${w}.conventionalCompat`, "자기 유형이 궁합표에 있음");
  for (const t of MBTI_TYPES) if (t !== p.type && !compatTypes.has(t)) fail(file, `${w}.conventionalCompat`, "상대 유형 누락", t);
  p.conventionalCompat.forEach((c, i) => checkProse(file, `${w}.conventionalCompat[${i}].why`, c.why));
  compatTable.set(p.type, new Map(p.conventionalCompat.map(c => [c.type, c.fit])));
  for (const d of Object.keys(p.dimensionTags)) if (dimensionIds.size && !dimensionIds.has(d)) fail(file, `${w}.dimensionTags`, "차원 id 미해결", d);
}

/** 통념 궁합표 대칭: A가 B를 좋음이라 하면 B도 A를 좋음이라 해야 한다(둘 다 있을 때만). */
const compatTable = new Map<string, Map<string, string>>();
function lintCompatSymmetry() {
  for (const [a, row] of compatTable) for (const [b, fit] of row) { const back = compatTable.get(b)?.get(a); if (back && back !== fit) fail("mbti", `${a}↔${b}`, "통념 궁합표 비대칭", `${a}→${b} ${fit} / ${b}→${a} ${back}`); }
}
function lintFusionFile(path: string) {
  const file = `fusion/${basename(path)}`;
  const r = FusionFileSchema.safeParse(readJson(path));
  if (!r.success) { fail(file, "schema", "zod", zodMsg(r.error)); return; }
  const ids = new Set<string>();
  for (const x of r.data.rules) {
    if (ids.has(x.id)) fail(file, x.id, "fusion id 중복"); ids.add(x.id);
    if (featureIds.size && !featureIds.has(x.myeongriId)) fail(file, x.id, "myeongriId 미해결", x.myeongriId);
    if (x.dimension && dimensionIds.size && !dimensionIds.has(x.dimension)) fail(file, x.id, "차원 id 미해결", x.dimension);
    checkProse(file, `${x.id}.why`, x.why);
    if (x.scene) checkProse(file, `${x.id}.scene`, x.scene, { scene: true });
    fusionRules.push(x);
  }
}

function lintGanjiEntries(file: string, entries: z.infer<typeof GanjiEnergySchema>[]) {
  const seen = new Set<string>();
  for (const e of entries) {
    if (seen.has(e.ganji)) fail(file, e.ganji, "간지 중복"); seen.add(e.ganji);
    checkImage(file, `${e.ganji}.image`, e.image);
    for (const k of ["year", "month"] as const) { checkProse(file, `${e.ganji}.${k}.mood`, e[k].mood); checkProse(file, `${e.ganji}.${k}.action`, e[k].action); }
  }
}
function lintTimeline() {
  const dir = join(DATA, "timeline");
  const one = (name: string, schema: z.ZodTypeAny, cb: (d: any) => void) => {
    const p = join(dir, name); if (!existsSync(p)) return;
    const r = schema.safeParse(readJson(p)); if (!r.success) { fail(`timeline/${name}`, "schema", "zod", zodMsg(r.error)); return; }
    cb(r.data);
  };
  one("ganji.json", GanjiEnergyFileSchema, d => { lintGanjiEntries("timeline/ganji.json", d.entries); stats.ganji = d.entries.length; });
  one("ten-god-period.json", TenGodPeriodFileSchema, d => {
    for (const e of d.entries) for (const k of ["year", "month"] as const) {
      checkProse("timeline/ten-god-period.json", `${e.tenGod}.${k}.meaning`, e[k].meaning);
      e[k].scenes.forEach((s: string, i: number) => checkProse("timeline/ten-god-period.json", `${e.tenGod}.${k}.scenes[${i}]`, s, { scene: true }));
      checkProse("timeline/ten-god-period.json", `${e.tenGod}.${k}.action`, e[k].action);
      if (k === "year") checkProse("timeline/ten-god-period.json", `${e.tenGod}.year.caution`, e.year.caution);
    }
    stats.tenGodPeriod = d.entries.length;
  });
  one("badges.json", BadgeFileSchema, d => { d.badges.forEach((b: any, i: number) => checkProse("timeline/badges.json", `badge[${i}]`, b.line)); stats.badges = d.badges.length; });
  one("flow-rule.json", FlowRuleSchema, d => { stats.flowWeights = d.weights.length; });
  one("action-templates.json", ActionTemplateFileSchema, d => { d.templates.forEach((t: any) => t.text.forEach((s: string, i: number) => checkProse("timeline/action-templates.json", `${t.id}[${i}]`, s))); stats.actionTemplates = d.templates.length; });
}

function lintNarratives() {
  const p = join(DATA, "product-narratives.json"); if (!existsSync(p)) return;
  const r = ProductNarrativesSchema.safeParse(readJson(p));
  if (!r.success) { fail("product-narratives.json", "schema", "zod", zodMsg(r.error)); return; }
  for (const prod of r.data.products) {
    const ids = new Set<string>();
    for (const c of prod.chapters) { if (ids.has(c.id)) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "chapter id 중복"); ids.add(c.id); c.dimensionFocus?.forEach(d => { if (dimensionIds.size && !dimensionIds.has(d)) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "차원 id 미해결", d); }); }
    const roles = new Set(prod.chapters.map(c => c.role));
    for (const need of ["HOOK", "PAYOFF"]) if (!roles.has(need as never)) fail("product-narratives.json", prod.productKey, `장 역할 ${need} 없음`);
  }
  stats.products = r.data.products.length;
}

function lintIdMap() {
  const p = join(DATA, "id-map.json"); if (!existsSync(p)) return;
  const r = IdMapSchema.safeParse(readJson(p));
  if (!r.success) { fail("id-map.json", "schema", "zod", zodMsg(r.error)); return; }
  let unresolved = 0;
  for (const e of r.data.entries) if (featureIds.size && !featureIds.has(e.newId) && !MBTI_TYPES.includes(e.newId as never)) { unresolved++; if (unresolved <= 20) fail("id-map.json", e.oldId, "newId 미해결", e.newId); }
  stats.idMap = r.data.entries.length;
}

function coverage() {
  const rows: string[] = ["# P1 커버리지", "", `생성: ${new Date().toISOString().slice(0, 10)} · \`pnpm exec tsx scripts/knowledge-lint.ts --coverage\``, "", "| 가족 | 기대 | 작성 | 장면 수 | 미작성 |", "|---|---|---|---|---|"];
  const missingAll: Record<string, string[]> = {};
  for (const fam of FEATURE_FAMILIES) {
    const have = featuresByFamily[fam] ?? [];
    const expected = EXPECTED_IDS[fam] ?? [];
    const missing = expected.filter(id => !featureIds.has(id)); missingAll[fam] = missing;
    const scenes = have.reduce((n, f) => n + DOMAINS.reduce((m, d) => m + f.scenes[d].length, 0), 0);
    rows.push(`| ${fam} | ${expected.length} | ${have.length} | ${scenes} | ${missing.length ? missing.slice(0, 12).join(", ") + (missing.length > 12 ? ` 외 ${missing.length - 12}` : "") : "-"} |`);
  }
  const missingMbti = MBTI_TYPES.filter(t => !mbtiTypesSeen.has(t));
  rows.push(`| MBTI | 16 | ${mbtiTypesSeen.size} | ${mbtiTypesSeen.size * 21} | ${missingMbti.join(", ") || "-"} |`);
  const withScene = fusionRules.filter(r => r.scene).length;
  rows.push(`| Fusion | ≥300 (장면 ≥60) | ${fusionRules.length} | ${withScene} | ${fusionRules.length >= 300 && withScene >= 60 ? "-" : "미달"} |`);
  rows.push(`| Timeline 간지 | 60 | ${stats.ganji ?? 0} | - | ${(stats.ganji ?? 0) === 60 ? "-" : "미달"} |`);
  rows.push(`| Timeline 십성 | 10 | ${stats.tenGodPeriod ?? 0} | - | ${(stats.tenGodPeriod ?? 0) === 10 ? "-" : "미달"} |`);
  rows.push(`| 배지 / 흐름 규칙 / 행동 템플릿 | ≥8 / 1 / ≥20 | ${stats.badges ?? 0} / ${stats.flowWeights ? 1 : 0} / ${stats.actionTemplates ?? 0} | - | - |`);
  const famOf = new Map<string, string>(); for (const [fam, fs] of Object.entries(featuresByFamily)) for (const f of fs) famOf.set(f.id, fam);
  const fusionByFamily: Record<string, number> = {}; for (const r of fusionRules) { const fam = famOf.get(r.myeongriId) ?? "?"; fusionByFamily[fam] = (fusionByFamily[fam] ?? 0) + 1; }
  rows.push("", "## Fusion 가족별", "", "| 가족 | 규칙 수 |", "|---|---|", ...Object.entries(fusionByFamily).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`));
  const fusionByType: Record<string, number> = {}; for (const r of fusionRules) fusionByType[r.mbtiTarget] = (fusionByType[r.mbtiTarget] ?? 0) + 1;
  rows.push("", "## Fusion 대상별", "", "| 대상 | 규칙 수 |", "|---|---|", ...Object.entries(fusionByType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`));
  if (strict) {
    for (const [fam, missing] of Object.entries(missingAll)) if (missing.length) fail("coverage", fam, `기대 id 누락 ${missing.length}개`, missing.slice(0, 10).join(", "));
    if (missingMbti.length) fail("coverage", "mbti", "MBTI 유형 누락", missingMbti.join(", "));
    if (fusionRules.length < 300) fail("coverage", "fusion", "Fusion 300 미만", String(fusionRules.length));
    if (withScene < 60) fail("coverage", "fusion", "장면 있는 Fusion 60 미만", String(withScene));
    if ((stats.ganji ?? 0) !== 60) fail("coverage", "timeline", "간지 60 미만", String(stats.ganji ?? 0));
    if ((stats.tenGodPeriod ?? 0) !== 10) fail("coverage", "timeline", "십성 연월 10 미만", String(stats.tenGodPeriod ?? 0));
  }
  if (wantCoverage) writeFileSync(join(ROOT, "docs", "v5", "p1-coverage.md"), rows.join("\n") + "\n");
  stats.coverageMissing = Object.values(missingAll).reduce((n, m) => n + m.length, 0);
}

// ---------- 실행 ----------
if (existsSync(join(DATA, "behavior-ontology.json"))) lintOntology(join(DATA, "behavior-ontology.json"));
if (only) {
  const raw = readJson(only);
  if (raw && typeof raw === "object" && "features" in raw) lintFeatureFile(only);
  else if (raw && "profiles" in raw) lintMbtiFile(only);
  else if (raw && "rules" in raw) { for (const p of listJson(join(DATA, "myeongri"))) { const r = MyeongriFileSchema.safeParse(readJson(p)); if (r.success) for (const f of r.data.features) featureIds.add(f.id); } lintFusionFile(only); }
  else if (raw && Array.isArray(raw.entries) && raw.entries[0]?.ganji) { const r = z.array(GanjiEnergySchema).safeParse(raw.entries); if (!r.success) fail(basename(only), "schema", "zod", zodMsg(r.error)); else lintGanjiEntries(basename(only), r.data); }
  else fail(basename(only), "file", "알 수 없는 파일 형식(features/profiles/rules/entries 없음)");
} else {
  for (const p of listJson(join(DATA, "myeongri"))) lintFeatureFile(p);
  for (const p of listJson(join(DATA, "mbti"))) lintMbtiFile(p);
  for (const p of listJson(join(DATA, "fusion"))) lintFusionFile(p);
  lintCompatSymmetry(); lintTimeline(); lintNarratives(); lintIdMap();
  stats.features = featureIds.size; stats.byFamily = Object.fromEntries(Object.entries(featuresByFamily).map(([k, v]) => [k, v.length]));
  stats.scenes = Object.values(featuresByFamily).flat().reduce((n, f) => n + DOMAINS.reduce((m, d) => m + f.scenes[d].length, 0), 0);
  stats.mbtiProfiles = mbtiTypesSeen.size; stats.fusionRules = fusionRules.length; stats.fusionWithScene = fusionRules.filter(r => r.scene).length;
  coverage();
}
stats.sentences = sentenceCount; stats.avgSentenceChars = sentenceCount ? Math.round((sentenceChars / sentenceCount) * 10) / 10 : 0;
const byRule: Record<string, number> = {}; for (const i of issues) byRule[i.rule] = (byRule[i.rule] ?? 0) + 1;
console.log(JSON.stringify({ stats, issueCount: issues.length, byRule }, null, 1));
const max = Number(process.env.LINT_MAX ?? 80);
for (const i of issues.slice(0, max)) console.log(`${i.file} :: ${i.where} :: ${i.rule}${i.text ? ` :: ${i.text}` : ""}`);
if (issues.length > max) console.log(`... ${issues.length - max} more`);
process.exit(issues.length ? 1 : 0);
