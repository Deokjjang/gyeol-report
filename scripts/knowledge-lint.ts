/**
 * knowledge-v5 v2 데이터 품질 게이트(결정론).
 * 실행: pnpm exec tsx scripts/knowledge-lint.ts [--only <file.json>] [--strict] [--coverage]
 *   --only     파일 하나만(스키마·문장·파일 내 중복). 서브에이전트 배치 검사용.
 *   --strict   커버리지 미달(기대 id 누락, MBTI 16 미만, Fusion 300 미만)도 실패로 친다. 완료 게이트.
 *   --coverage 가족별 커버리지 표를 docs/v5/p1-coverage.md 에 쓴다.
 *
 * 검사: zod 스키마 → id 무결성(중복·fusion myeongriId·차원 id·id-map) → 영역별 scene ≥ 2(스키마) → 이미지 필수(스키마)
 *      → 중복 문장 0(가족 간 포함) → 이미지 중복 0(전체) → 금지 표현(정보량 0·확정 예언·비하·흐린 말투) → 한자 금지(이름·출처 제외)
 *      → 문장 길이(≤90) · 한자어 연속 상한 → 용어 누출(장면 문장에 MBTI 코드·명리 일반 용어 금지) → mbtiLinks ≥ 2(스키마) → 위치 가족 positionNuance 필수
 *      → Fusion 같은 유형 안 반복 구절(12자 창)·MBTI 원문 복사(14자 창)·고정 공식 유형당 1회.
 *      → (P2) 장면 사실 조건: requires 필수(스키마), 고객 프로필(미혼·연애 중·기혼 × 직업 정보 없음)마다 영역별 장면 ≥ 1,
 *        결혼 영역은 기혼 전용과 언젠가형(unmarried)을 둘 다, 자녀 있음 전용 장면은 같은 영역에 언젠가형(none)도.
 *      → (P2, 경고) 이미지 유사: 문자 3-gram Dice ≥ 0.6. --strict에서는 실패로 친다.
 *      → (P3) 옛 부정 낱말(흉·액·불길·재앙 등, 부정문 포함)·과거 경험 단정 금지(src/lib/writer/safety/patterns.ts).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { z } from "zod";
import {
  ActionTemplateFileSchema, BadgeFileSchema, BehaviorOntologySchema, FlowRuleSchema, FusionFileSchema, GanjiEnergyFileSchema, GanjiEnergySchema, IdMapSchema,
  MbtiFileSchema, MyeongriFileSchema, ProductNarrativesSchema, TenGodPeriodFileSchema, LoveSignalFileSchema, CareerFileSchema, LOVE_SIGNAL_KEY,
  CompatSceneFileSchema, CareerCatalogSchema, CAREER_CLUSTERS, COMPATIBILITY_CATEGORIES,
  DOMAINS, FEATURE_FAMILIES, MBTI_TYPES, TIMELINE_ACTION_DOMAINS, POSITIONAL_FAMILIES, STEMS, BRANCHES, TEN_GODS, ELEMENTS,
  type FusionRule, type MbtiProfile, type MyeongriFeature, type SceneItem,
} from "../src/data/knowledge-v5/schema";
import { LOVE_TIMING, OLD_NEGATIVE, SICK_DEATH_IMAGE, isPastAssertion } from "../src/lib/writer/safety/patterns";
import FEATURE_FREQUENCY from "../src/lib/brief/data/feature-frequency.json";

/** 감지 빈도 상위 30%(P3.5 A1): 이미지 변형 3개·영역 장면 3개 이상. tools/p35/enrich.mjs topFeatureIds와 같은 규칙. */
const TOP_FEATURES = new Set(Object.entries(FEATURE_FREQUENCY as Record<string, number>).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, Math.ceil(Object.keys(FEATURE_FREQUENCY).length * 0.3)).map(([id]) => id));

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src", "data", "knowledge-v5");
const args = process.argv.slice(2);
const only = args.includes("--only") ? resolve(args[args.indexOf("--only") + 1]) : null;
const strict = args.includes("--strict");
const wantCoverage = args.includes("--coverage");

type Issue = { file: string; where: string; rule: string; text?: string };
const issues: Issue[] = [];
const fail = (file: string, where: string, rule: string, text?: string) => issues.push({ file, where, rule, text });
const warnings: Issue[] = [];
const warn = (file: string, where: string, rule: string, text?: string) => warnings.push({ file, where, rule, text });
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
  // (P3 A-3) 옛 해석의 부정 낱말은 부정하는 문장 안에서도 쓰지 않는다.
  ["옛 부정 낱말", OLD_NEGATIVE],
  // (P3.6 A5) 실제 질병·죽음을 떠올리게 하는 이미지. 무덤덤·상여금은 일상어라 제외, 김장독 같은 비유는 허용.
  ["질병·죽음 이미지", SICK_DEATH_IMAGE],
  // (P3.7 1-5) 인연·결혼에 시기 형용사(늦게·일찍·몇 살쯤)는 쓰지 않는다. 경향형으로만.
  ["인연 시기", LOVE_TIMING],
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
/** childTagged: 장면 requires.children이 has·none이면 자녀 언급이 조건으로 묶여 있으므로 자녀 단정 검사를 건너뛴다(P2). */
type ProseOpts = { scene?: boolean; childTagged?: boolean; allowHan?: boolean; dedupe?: boolean; maxSentence?: number };
function checkProse(file: string, where: string, text: string, opts: ProseOpts = {}) {
  const maxSentence = opts.maxSentence ?? 90;
  for (const [name, re] of FORBIDDEN) if (re.test(text)) fail(file, where, `금지 표현(${name})`, text);
  if (!opts.allowHan && HAN.test(text)) fail(file, where, "한자", text);
  if (/\{[a-z]+\}/i.test(text) && !/\{name\}/.test(text)) fail(file, where, "알 수 없는 치환자", text);
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  for (const s of sentences) {
    sentenceCount++; sentenceChars += s.length;
    if (s.length > maxSentence) fail(file, where, `문장 길이 > ${maxSentence}`, s);
    if (isPastAssertion(s)) fail(file, where, "과거 경험 단정(질문형·경향형으로)", s);
    const tokens = s.split(/\s+/);
    if (tokens.some(t => /^[가-힣]{9,}$/.test(t))) fail(file, where, "한자어 연속(9음절 이상 붙은 낱말)", s);
    let run = 0; for (const t of tokens) { run = /(적|성|화|력|률)(으로|이|을|가|의|에)?$/.test(t) && t.length >= 3 ? run + 1 : 0; if (run >= 3) { fail(file, where, "한자어 연속(접미사 3연속)", s); break; } }
    if (opts.scene) {
      if (!opts.childTagged && /(^|\s)(아이|자녀|아들|딸|애들)(가|를|의|이|와|도|랑|한테|에게|\s(준비물|일정|생일|교육|학교|숙제|계획|생일상|방))/.test(s)) fail(file, where, "입력에 없는 사실 단정(자녀)", s);
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
    imageList.push({ file, where: `${where}.${k}`, text: image[k], grams: trigrams(image[k]) });
  }
}

// ---------- (P2) 이미지 유사(문자 3-gram Dice) ----------
const IMAGE_SIMILARITY = 0.6;
const imageList: { file: string; where: string; text: string; grams: Set<string> }[] = [];
function trigrams(s: string) {
  const n = s.replace(/[\s.,'"!?·…~\-()]/g, ""); const g = new Set<string>();
  for (let i = 0; i + 3 <= n.length; i++) g.add(n.slice(i, i + 3)); return g;
}
function lintImageSimilarity() {
  for (let i = 0; i < imageList.length; i++) for (let j = i + 1; j < imageList.length; j++) {
    const a = imageList[i], b = imageList[j]; let inter = 0;
    for (const g of a.grams) if (b.grams.has(g)) inter++;
    const dice = inter ? (2 * inter) / (a.grams.size + b.grams.size) : 0;
    if (dice >= IMAGE_SIMILARITY) warn(b.file, b.where, "이미지 유사(3-gram ≥ 0.6)", `${dice.toFixed(2)} ${b.text} ≈ ${a.where} ${a.text}`);
  }
}

// ---------- (P2) 장면 사실 조건 ----------
/** 브리프 선택 규칙과 같은 판정(src/lib/brief/facts.ts sceneFits와 맞춘다). 자녀·직업 정보가 없는 고객 기준. */
const FACT_PROFILES = [
  { name: "미혼", relationship: "single" },
  { name: "연애 중", relationship: "dating" },
  { name: "기혼", relationship: "married" },
] as const;
const fitsProfile = (s: SceneItem, relationship: string) =>
  (s.requires.relationship === "any" || s.requires.relationship === relationship || (s.requires.relationship === "unmarried" && relationship !== "married"))
  && s.requires.children !== "has" && s.requires.job === "any";
function checkSceneFacts(file: string, where: string, scenes: Partial<Record<string, SceneItem[]>>) {
  for (const [d, list] of Object.entries(scenes)) {
    if (!list) continue;
    for (const pr of FACT_PROFILES) if (!list.some(s => fitsProfile(s, pr.relationship))) fail(file, `${where}.${d}`, "프로필 장면 없음", `${pr.name}·직업 정보 없음 고객이 쓸 장면이 없다`);
    if (d === "marriage") {
      if (!list.some(s => s.requires.relationship === "married")) fail(file, `${where}.${d}`, "결혼 장면 짝 없음", "기혼 전용(married) 장면 필요");
      if (!list.some(s => s.requires.relationship === "unmarried")) fail(file, `${where}.${d}`, "결혼 장면 짝 없음", "언젠가형(unmarried) 장면 필요");
    }
    if (list.some(s => s.requires.children === "has") && !list.some(s => s.requires.children === "none")) fail(file, `${where}.${d}`, "자녀 장면 짝 없음", "자녀 있음 전용 장면에 언젠가형(none) 장면 필요");
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
    f.imageVariants?.forEach((im, i) => checkImage(file, `${w}.imageVariants[${i}]`, im));
    if (TOP_FEATURES.has(f.id)) {
      if ((f.imageVariants?.length ?? 0) < 3) fail(file, w, "감지 빈도 상위 30%인데 이미지 변형 3개 미만(P3.5 A1)", String(f.imageVariants?.length ?? 0));
      for (const d of DOMAINS) if (f.scenes[d].length < 3) fail(file, `${w}.scenes.${d}`, "감지 빈도 상위 30%인데 영역 장면 3개 미만(P3.5 A1)", String(f.scenes[d].length));
    }
    for (const d of DOMAINS) f.scenes[d].forEach((s, i) => checkProse(file, `${w}.scenes.${d}[${i}]`, s.text, { scene: true, childTagged: s.requires.children !== "any" }));
    checkSceneFacts(file, `${w}.scenes`, f.scenes);
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
  if (mbtiTypesSeen.has(p.type)) fail(file, w, "MBTI 유형 중복"); mbtiTypesSeen.add(p.type); profilesByType.set(p.type, p);
  checkProse(file, `${w}.oneLiner`, p.oneLiner);
  checkImage(file, `${w}.image`, p.image);
  p.cognitiveFunctions.forEach((c, i) => checkProse(file, `${w}.fn[${i}]`, c.easy));
  for (const d of DOMAINS) p.signals[d].forEach((s, i) => checkProse(file, `${w}.signals.${d}[${i}]`, s.text, { scene: true, childTagged: s.requires.children !== "any" }));
  checkSceneFacts(file, `${w}.signals`, p.signals);
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
    if (x.scene) checkProse(file, `${x.id}.scene`, x.scene.text, { scene: true, childTagged: x.scene.requires.children !== "any" });
    fusionRules.push(x); fusionFileOf.set(x.id, file);
  }
}

/**
 * 한 고객 리포트에는 같은 MBTI 대상의 Fusion 여러 개가 함께 나온다 → 같은 유형 안에서 구절 반복·MBTI 원문 복사·고정 공식을 막는다.
 * 창 비교(공백 정규화, MBTI 코드·인지기능 코드가 걸친 창은 문장 틀이라 제외, 한글 3자 이상 포함 창만). gold.json 이 먼저 기준이 된다.
 */
const fusionFileOf = new Map<string, string>();
const profilesByType = new Map<string, MbtiProfile>();
const REPEAT_WINDOW = 12, PROFILE_WINDOW = 14;
const FORMULA = /둘이 (겹치면|만나면)/;
function windows(s: string, w: number) {
  const n = s.replace(/\s+/g, " ").replace(/\b[EI][NS][TF][JP]\b/g, "#").replace(/\b[NSTF][ei]\b/g, "@");
  const out = new Set<string>(); for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (/[가-힣]{3}/.test(x) && !/[#@]/.test(x)) out.add(x); } return out;
}
function lintFusionRepetition() {
  const isGold = (r: FusionRule) => Number(fusionFileOf.get(r.id) === "fusion/gold.json");
  const byType = new Map<string, FusionRule[]>();
  for (const r of [...fusionRules].sort((a, b) => isGold(b) - isGold(a))) byType.set(r.mbtiTarget, [...(byType.get(r.mbtiTarget) ?? []), r]);
  for (const [type, rules] of byType) {
    const seen = new Map<string, string>(); let formula = 0;
    const p = profilesByType.get(type);
    const profileWins = new Set(p ? [p.oneLiner, ...p.cognitiveFunctions.map(c => c.easy), ...DOMAINS.flatMap(d => p.signals[d].map(s => s.text)), ...p.shadows].flatMap(s => [...windows(s, PROFILE_WINDOW)]) : []);
    for (const r of rules) {
      const file = fusionFileOf.get(r.id) ?? "fusion";
      for (const [k, text] of [["why", r.why], ["scene", r.scene?.text ?? ""]] as const) {
        const ws = windows(text, REPEAT_WINDOW);
        const hit = [...ws].find(w => seen.has(w) && seen.get(w) !== r.id);
        if (hit) fail(file, `${r.id}.${k}`, "유형 내 반복 구절", `「${hit}」 ← ${seen.get(hit)}`);
        for (const w of ws) if (!seen.has(w)) seen.set(w, r.id);
        const copied = [...windows(text, PROFILE_WINDOW)].find(w => profileWins.has(w));
        if (copied) fail(file, `${r.id}.${k}`, "MBTI 원문 복사", `「${copied}」`);
      }
      if (FORMULA.test(r.why) && ++formula > 1) fail(file, `${r.id}.why`, "고정 공식 반복(유형당 1회)", r.why.match(FORMULA)?.[0]);
    }
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
      e[k].scenes.forEach((s: SceneItem, i: number) => checkProse("timeline/ten-god-period.json", `${e.tenGod}.${k}.scenes[${i}]`, s.text, { scene: true, childTagged: s.requires.children !== "any" }));
      checkSceneFacts("timeline/ten-god-period.json", `${e.tenGod}.${k}`, { scenes: e[k].scenes });
      checkProse("timeline/ten-god-period.json", `${e.tenGod}.${k}.action`, e[k].action);
      if (k === "year") checkProse("timeline/ten-god-period.json", `${e.tenGod}.year.caution`, e.year.caution);
    }
    stats.tenGodPeriod = d.entries.length;
  });
  one("badges.json", BadgeFileSchema, d => { d.badges.forEach((b: any, i: number) => checkProse("timeline/badges.json", `badge[${i}]`, b.line)); stats.badges = d.badges.length; });
  one("flow-rule.json", FlowRuleSchema, d => { stats.flowWeights = d.weights.length; });
  one("action-templates.json", ActionTemplateFileSchema, d => {
    d.templates.forEach((t: any) => t.text.forEach((s: string, i: number) => checkProse("timeline/action-templates.json", `${t.id}[${i}]`, s)));
    stats.actionTemplates = d.templates.length;
    // (P2) 십성 × 영역 × 세기 구간 조합 완비 → 세운 12개월에서 템플릿 반복 0
    const ids = new Set<string>(); for (const t of d.templates) { if (ids.has(t.id)) fail("timeline/action-templates.json", t.id, "템플릿 id 중복"); ids.add(t.id); }
    const band = (f?: number[]) => (f?.length ? (Math.min(...f) >= 4 ? "high" : Math.max(...f) <= 3 ? "low" : "mixed") : "any");
    const combos = new Set(d.templates.filter((t: any) => t.when.tenGod && t.when.domain).map((t: any) => `${t.when.tenGod}|${t.when.domain}|${band(t.when.flow)}`));
    stats.actionCombos = combos.size;
    if (strict) for (const tg of TEN_GODS) for (const dom of TIMELINE_ACTION_DOMAINS) for (const b of ["low", "high"]) if (!combos.has(`${tg}|${dom}|${b}`)) fail("timeline/action-templates.json", `${tg}|${dom}|${b}`, "행동 템플릿 조합 없음");
  });
}

function lintNarratives() {
  const p = join(DATA, "product-narratives.json"); if (!existsSync(p)) return;
  const r = ProductNarrativesSchema.safeParse(readJson(p));
  if (!r.success) { fail("product-narratives.json", "schema", "zod", zodMsg(r.error)); return; }
  for (const prod of r.data.products) {
    const ids = new Set<string>();
    for (const c of prod.chapters) { if (ids.has(c.id)) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "chapter id 중복"); ids.add(c.id); c.dimensionFocus?.forEach(d => { if (dimensionIds.size && !dimensionIds.has(d)) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "차원 id 미해결", d); }); }
    // (P3.8 1) 비반복 장은 절 계획 필수, 절 질문은 상품 안에서 겹치지 않는다. recap은 앞 장만 가리킨다.
    const qs = new Set<string>();
    prod.chapters.forEach((c, i) => {
      if (!c.repeat && !c.sections?.length) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "절 계획 없음");
      for (const s of c.sections ?? []) {
        if (qs.has(s.q) && !s.q.includes("{topic}")) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "절 질문 중복", s.q); qs.add(s.q);
        s.dims?.forEach(d => { if (dimensionIds.size && !dimensionIds.has(d)) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "차원 id 미해결", d); });
        for (const u of s.use) if (u.startsWith("recap:") && !prod.chapters.slice(0, i).some(x => x.id === u.slice(6))) fail("product-narratives.json", `${prod.productKey}.${c.id}`, "recap이 앞 장이 아님", u);
      }
    });
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

// ---------- (P3.7 1-4) 연애 신호 · 직업명 ----------
function lintLoveSignals() {
  const path = join(DATA, "love", "signals.json"); if (!existsSync(path)) return fail("love/signals.json", "file", "파일 없음");
  const r = LoveSignalFileSchema.safeParse(readJson(path)); if (!r.success) return fail("love/signals.json", "schema", "zod", zodMsg(r.error));
  const want = [...TEN_GODS.map(t => `tenGod:${t}`), "shinsal:DOHWASAL", "shinsal:HONGYEOMSAL", ...MBTI_TYPES.map(t => `mbti:${t}`)].filter(k => LOVE_SIGNAL_KEY.test(k));
  const keys = r.data.entries.map(e => e.key);
  for (const k of want) if (!keys.includes(k)) fail("love/signals.json", k, "key 누락");
  for (const k of new Set(keys)) if (keys.filter(x => x === k).length > 1) fail("love/signals.json", k, "key 중복");
  for (const e of r.data.entries) for (const a of ["crush", "contact", "pushPull"] as const) {
    checkProse("love/signals.json", `${e.key}.${a}.line`, e[a].line);
    e[a].scenes.forEach((x, i) => checkProse("love/signals.json", `${e.key}.${a}.scenes[${i}]`, x.text, { scene: true, childTagged: x.requires.children !== "any", maxSentence: 100 }));
  }
}
function lintCareer() {
  const path = join(DATA, "career", "jobs.json"); if (!existsSync(path)) return fail("career/jobs.json", "file", "파일 없음");
  const r = CareerFileSchema.safeParse(readJson(path)); if (!r.success) return fail("career/jobs.json", "schema", "zod", zodMsg(r.error));
  const keys = r.data.titles.map(t => t.key);
  for (const k of [...["PEER", "OUTPUT", "WEALTH", "OFFICER", "RESOURCE"].map(g => `group:${g}`), ...TEN_GODS.map(t => `tenGod:${t}`)]) if (!keys.includes(k)) fail("career/jobs.json", k, "key 누락");
  for (const k of keys) if (/^(shinsal|gwiin):/.test(k) && featureIds.size && !featureIds.has(k)) fail("career/jobs.json", k, "없는 신살·귀인 id");
  const titles = new Map<string, string>();
  for (const t of r.data.titles) for (const j of t.jobs) {
    checkProse("career/jobs.json", `${t.key}.${j.title}.why`, j.why);
    const prev = titles.get(j.title); if (prev && prev !== t.key) warn("career/jobs.json", `${t.key}.${j.title}`, "직무명 중복", prev); titles.set(j.title, t.key);
  }
  const jobIds = (JSON.parse(readFileSync(join(ROOT, "src", "lib", "brief", "data", "props.json"), "utf8")) as { jobs: { id: string }[] }).jobs.map(j => j.id);
  const fitIds = r.data.fits.map(f => f.jobId);
  for (const id of jobIds) if (!fitIds.includes(id)) fail("career/jobs.json", id, "지금 직업 적합도 누락");
  for (const id of fitIds) if (!jobIds.includes(id)) fail("career/jobs.json", id, "없는 직업군 id");
  for (const f of r.data.fits) for (const [g, line] of Object.entries(f.grow)) checkProse("career/jobs.json", `${f.jobId}.grow.${g}`, line, { dedupe: false });
}

// ---------- (P3.8) 궁합 관계 장면 · 직무 카탈로그 ----------
/** 관계 유형마다 그 관계 밖 장면 낱말이 들어오면 안 된다(부모·자녀 책에 친구 보온병·동창 회비·단풍 단톡방). */
const COMPAT_ROLE_WORDS: Record<string, RegExp> = {
  parentChild: /부모|자녀|엄마|아빠|어머니|아버지|아들|딸/, managerReport: /상사|팀장|팀원|부하|부장|과장/, coworker: /동료|두 사람|옆자리|같은 팀/,
  businessPartner: /동업|공동 대표|두 대표|두 사람|파트너/, friendship: /친구|두 사람/, love: /연인|두 사람|애인/, marriage: /부부|배우자|두 사람|남편|아내/,
};
const COMPAT_FOREIGN: Record<string, RegExp> = {
  parentChild: /동창|단톡방|회비|동기|회식|연인|데이트|애인/, managerReport: /데이트|연인|애인|명절|용돈|동창/, coworker: /데이트|연인|애인|용돈|명절/,
  businessPartner: /데이트|연인|애인|용돈|명절/, friendship: /데이트|연인|애인|용돈|상사|결재/, love: /용돈|상사|결재|회식|지분/, marriage: /용돈|상사|결재|지분|데이트 신청/,
};
function lintCompatScenes() {
  const path = join(DATA, "compat", "scenes.json"); if (!existsSync(path)) return fail("compat/scenes.json", "file", "파일 없음");
  const r = CompatSceneFileSchema.safeParse(readJson(path)); if (!r.success) return fail("compat/scenes.json", "schema", "zod", zodMsg(r.error));
  const types = r.data.types.map(t => t.type);
  for (const t of COMPATIBILITY_CATEGORIES) if (!types.includes(t)) fail("compat/scenes.json", t, "관계 유형 누락");
  for (const t of r.data.types) {
    const keys = t.topics.map(x => x.key);
    for (const k of new Set(keys)) if (keys.filter(x => x === k).length > 1) fail("compat/scenes.json", `${t.type}.${k}`, "주제 key 중복");
    if (t.type === "parentChild") for (const age of ["minor", "adult"]) if (t.topics.flatMap(x => x.scenes).filter(s => (s.ages ?? "any") === age || (s.ages ?? "any") === "any").length < 24) fail("compat/scenes.json", `${t.type}.${age}`, "자녀 나이대 장면 24개 미만");
    for (const topic of t.topics) topic.scenes.forEach((sc, i) => {
      const where = `${t.type}.${topic.key}[${i}]`;
      checkProse("compat/scenes.json", where, sc.text, { scene: true, childTagged: t.type === "parentChild", maxSentence: 100 });
      if (!COMPAT_ROLE_WORDS[t.type].test(sc.text)) fail("compat/scenes.json", where, "역할 낱말 없음(두 역할이 함께 나와야 함)", sc.text);
      const foreign = sc.text.match(COMPAT_FOREIGN[t.type]); if (foreign) fail("compat/scenes.json", where, "다른 관계 유형 장면 낱말", `${foreign[0]} ← ${sc.text}`);
      for (const d of Object.keys(sc.dims)) if (dimensionIds.size && !dimensionIds.has(d)) fail("compat/scenes.json", where, "차원 id 미해결", d);
      if (t.type !== "parentChild" && sc.ages) fail("compat/scenes.json", where, "ages는 부모·자녀 전용");
    });
  }
  stats.compatScenes = r.data.types.reduce((n, t) => n + t.topics.reduce((m, x) => m + x.scenes.length, 0), 0);
}
function lintCareerCatalog() {
  const path = join(DATA, "career", "catalog.json"); if (!existsSync(path)) return fail("career/catalog.json", "file", "파일 없음");
  const r = CareerCatalogSchema.safeParse(readJson(path)); if (!r.success) return fail("career/catalog.json", "schema", "zod", zodMsg(r.error));
  const ids = r.data.clusters.map(c => c.id);
  for (const c of CAREER_CLUSTERS) if (!ids.includes(c)) fail("career/catalog.json", c, "묶음 누락");
  for (const c of r.data.clusters) for (const n of c.near) { if (n === c.id) fail("career/catalog.json", c.id, "near에 자기 자신"); const back = r.data.clusters.find(x => x.id === n); if (back && !back.near.includes(c.id)) warn("career/catalog.json", `${c.id}→${n}`, "near 비대칭"); }
  const jobIds = (JSON.parse(readFileSync(join(ROOT, "src", "lib", "brief", "data", "props.json"), "utf8")) as { jobs: { id: string }[] }).jobs.map(j => j.id);
  for (const id of jobIds) if (!r.data.jobClusters[id]) fail("career/catalog.json", id, "지금 직업 묶음 누락");
  for (const id of Object.keys(r.data.jobClusters)) if (!jobIds.includes(id)) fail("career/catalog.json", id, "없는 직업군 id");
  const titles = new Set<string>();
  for (const j of r.data.jobs) {
    if (titles.has(j.title)) fail("career/catalog.json", j.title, "직무명 중복"); titles.add(j.title);
    checkProse("career/catalog.json", `${j.title}.why`, j.why);
    for (const d of Object.keys(j.dims)) if (dimensionIds.size && !dimensionIds.has(d)) fail("career/catalog.json", j.title, "차원 id 미해결", d);
    for (const key of j.keys ?? []) if (featureIds.size && !featureIds.has(key) && !/^tenGod:/.test(key)) fail("career/catalog.json", j.title, "없는 feature id", key);
  }
  for (const c of CAREER_CLUSTERS) { const n = r.data.jobs.filter(j => j.cluster === c).length; if (n < 6) fail("career/catalog.json", c, "묶음 직무 6개 미만", String(n)); }
  stats.careerJobs = r.data.jobs.length;
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
  lintCompatSymmetry(); lintFusionRepetition(); lintTimeline(); lintNarratives(); lintIdMap(); lintImageSimilarity(); lintLoveSignals(); lintCareer(); lintCompatScenes(); lintCareerCatalog();
  stats.features = featureIds.size; stats.byFamily = Object.fromEntries(Object.entries(featuresByFamily).map(([k, v]) => [k, v.length]));
  stats.scenes = Object.values(featuresByFamily).flat().reduce((n, f) => n + DOMAINS.reduce((m, d) => m + f.scenes[d].length, 0), 0);
  stats.mbtiProfiles = mbtiTypesSeen.size; stats.fusionRules = fusionRules.length; stats.fusionWithScene = fusionRules.filter(r => r.scene).length;
  coverage();
}
stats.sentences = sentenceCount; stats.avgSentenceChars = sentenceCount ? Math.round((sentenceChars / sentenceCount) * 10) / 10 : 0;
if (strict) issues.push(...warnings);
const byRule: Record<string, number> = {}; for (const i of issues) byRule[i.rule] = (byRule[i.rule] ?? 0) + 1;
console.log(JSON.stringify({ stats, issueCount: issues.length, warningCount: warnings.length, byRule }, null, 1));
if (!strict) for (const i of warnings) console.log(`WARN ${i.file} :: ${i.where} :: ${i.rule} :: ${i.text}`);
const max = Number(process.env.LINT_MAX ?? 80);
for (const i of issues.slice(0, max)) console.log(`${i.file} :: ${i.where} :: ${i.rule}${i.text ? ` :: ${i.text}` : ""}`);
if (issues.length > max) console.log(`... ${issues.length - max} more`);
process.exit(issues.length ? 1 : 0);
