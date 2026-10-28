/**
 * knowledge-v5 데이터 품질 게이트(결정론). 실행: pnpm exec tsx scripts/knowledge-lint.ts [--only <file.json>] [--sample]
 *
 * 검사: zod 스키마 → id 참조 무결성(차원·feature·MBTI·출처) → 중복 문장 0 → 금지 표현 0 → 용어 누출 0(신호 문장)
 *      → dimensionTags ≥ 2(스키마) → 영역 태그(스키마) → 가독성(문장 길이·한자·한자어 연속) → 어미 규칙.
 * --sample: docs/q1-review-sample.md 에 feature 30·교차 발견 20·유형 3을 seed 고정 무작위 추출.
 * 규칙 문서: docs/design/knowledge-v5-style.md
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  BehaviorOntologySchema, CrossFindingSchema, CrossFindingsSchema, MbtiProfilesSchema, MbtiProfileSchema, MyeongriFeaturesSchema, ProductNarrativesSchema, MyeongriFeatureSchema, FeatureAliasSchema,
  type MyeongriFeature, type Signal,
} from "../src/data/knowledge-v5/schema";
import { z } from "zod";

const ROOT = resolve(import.meta.dirname, "..");
const DATA = join(ROOT, "src", "data", "knowledge-v5");
const args = process.argv.slice(2);
const only = args.includes("--only") ? resolve(args[args.indexOf("--only") + 1]) : null;
const wantSample = args.includes("--sample");

type Issue = { file: string; where: string; rule: string; text?: string };
const issues: Issue[] = [];
const fail = (file: string, where: string, rule: string, text?: string) => issues.push({ file, where, rule, text });
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const exists = (name: string) => existsSync(join(DATA, name));

// ---------- 규칙 상수 ----------
const FORBIDDEN: readonly [string, RegExp][] = [
  ["흐린 말투", /일 수 있습니다|수도 있습니다|가능성이 있습니다|일지도 모릅니다|신호가 있어요|참고하세요|미입력이라서|입력되지 않았으므로/],
  ["확정·과장", /반드시|틀림없이|무조건|절대(?!로 아니)|운명|팔자|타고난 복|대박|남다른 잠재력|귀인이 나타|틀림없|확실히 .*(됩니다|합니다)/],
  ["사건 단정", /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|수익)(을|이|가)? ?(하게 됩니다|합니다\.|납니다|됩니다\.|생깁니다|있습니다\.)|(올해|내년|\d+년 (안|내|뒤)|\d+살)에? (결혼|이별|이혼|승진|합격)/],
  ["라벨 서술어", /(리더십|추진력|카리스마|잠재력|재능|복)이 (있|강|많)습니다|성향입니다\.$|기운입니다\.$|편이 강합니다\.$/],
  ["비난", /문제가 있습니다|불행|저주|한심|쓸모없/],
];
const ENDING_OK = /(합니다|습니다|않습니다|편입니다|쪽입니다|큽니다|쉽습니다|많습니다)\.$/;
const HAN = /[一-鿿]/;
const COMMON_LABELS = new Set(["사", "묘", "양", "절", "병", "쇠", "태", "관", "재", "인", "합", "충", "형", "파", "해", "목", "화", "토", "금", "수", "자", "축", "오", "미", "신", "유", "술", "해", "장생", "목욕", "건록", "제왕", "역마", "도화"]);
const MBTI_CODE = /\b[EI][NS][TF][JP]\b|MBTI|사주|명리|일간|일주|월지|지지|천간|오행|십성|신살|귀인|대운|세운|원국/;

// ---------- 소스 인덱스(출처 무결성) ----------
const sourceIndex = exists("source-index.json") ? readJson(join(DATA, "source-index.json")) : null;
const sourceIds = { foundation: new Set<string>(), classic: new Set<string>(), material: new Set<string>(), depth: new Map<string, Set<string>>(), taxonomy: new Set<string>(), kb: new Set<string>(), mbti: new Map<string, Set<string>>() };
const jargon = new Set<string>();
if (sourceIndex) {
  // 일주 이름(정해·경오…)과 천간·지지 한 글자는 일상어와 겹치므로 용어 누출 검사에서 제외
  for (const e of sourceIndex.foundation) { sourceIds.foundation.add(e.id); if (["day_pillar", "heavenly_stem", "earthly_branch"].includes(e.category)) continue; for (const l of [e.labelKo, ...(e.aliases ?? [])]) if (l.length >= 2 && !HAN.test(l) && !COMMON_LABELS.has(l)) jargon.add(l); }
  for (const s of sourceIndex.classicSources) sourceIds.classic.add(s.id);
  for (const m of sourceIndex.materials) sourceIds.material.add(m.feature);
  for (const d of sourceIndex.depth) sourceIds.depth.set(d.feature, new Set(d.roles));
  for (const t of sourceIndex.taxonomy) { sourceIds.taxonomy.add(t.id); if (t.labelKo?.length >= 2 && !COMMON_LABELS.has(t.labelKo) && !t.id.startsWith("day_pillar_")) jargon.add(t.labelKo); }
  for (const k of sourceIndex.knowledgeBase) { sourceIds.kb.add(k.id); if (k.labelKo?.length >= 2 && !COMMON_LABELS.has(k.labelKo) && !k.id.startsWith("day_pillar_")) jargon.add(k.labelKo); }
  for (const [type, v] of Object.entries<any>(sourceIndex.mbti)) sourceIds.mbti.set(type, new Set(v.traitIds));
}
// 용어 누출 검사에서 흔한 일반어는 제외
for (const w of ["여름", "겨울", "봄", "가을", "바다", "나무", "불", "흙", "쇠", "물", "꽃", "산", "강", "호수", "바위", "태양", "달", "별", "비", "안개", "창고", "지갑", "문", "길", "말", "소", "개", "닭", "양", "원숭이", "뱀", "용", "토끼", "호랑이", "쥐", "돼지", "친구", "부모", "자녀", "형제", "자매", "배우자", "연인", "동료", "상사", "직장", "성격", "성향", "강점", "약점", "결정", "표현", "감정", "관계", "현실", "책임", "자유", "독립", "안정", "변화", "학습", "돈", "일", "사랑", "결혼", "건강", "가족", "공부"]) jargon.delete(w);

function checkRef(file: string, where: string, ref: string) {
  const [prefix, ...rest] = ref.split(":"); const body = rest.join(":");
  const ok = (() => {
    if (!sourceIndex) return true;
    switch (prefix) {
      case "foundation": return sourceIds.foundation.has(`foundation:${body.split("#")[0]}`);
      case "classic": return sourceIds.classic.has(body.split(":")[0]);
      case "v4": { const [kind, ...r] = body.split(":"); if (kind === "material") return sourceIds.material.has(r.join(":")); if (kind === "depth") { const role = r.at(-1)!; const feature = r.slice(0, -1).join(":"); const roles = sourceIds.depth.get(feature); return !!roles && (roles.has(role) || role === "*"); } return false; }
      case "taxonomy": return sourceIds.taxonomy.has(body);
      case "kb": return sourceIds.kb.has(body);
      case "mbti": { const [type, ...r] = body.split(":"); const ids = sourceIds.mbti.get(type); if (!ids) return false; const id = r.join(":"); return ids.has(id) || ["summary", "functionStack", "preferenceAxes", "relationshipHints", "myeongliBridgeHints", "closeKeywords", "farKeywords", "recommendedJobs", "avoidJobsOrEnvironments", "oneLine", "archetype"].some(f => id === f || id.startsWith(`${f}.`)); }
      case "calc": return body.length > 0;
      default: return false;
    }
  })();
  if (!ok) fail(file, where, "sourceRef 미해결", ref);
}

// ---------- 문장 규칙 ----------
const sentenceStore = new Map<string, string>(); // key → where
const norm = (t: string) => t.replace(/[\s\p{P}\p{S}]/gu, "");
let sentenceCount = 0, sentenceChars = 0;
function checkProse(file: string, where: string, text: string, opts: { signal?: boolean; allowHan?: boolean; dedupe?: boolean; maxLen?: number }) {
  const maxLen = opts.maxLen ?? 60;
  for (const [name, re] of FORBIDDEN) if (re.test(text)) fail(file, where, `금지 표현(${name})`, text);
  if (!opts.allowHan && HAN.test(text)) fail(file, where, "한자", text);
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) ?? [];
  for (const s of sentences) {
    sentenceCount++; sentenceChars += s.length;
    if (s.length > maxLen) fail(file, where, `문장 길이 > ${maxLen}`, s);
    const tokens = s.split(/\s+/);
    if (tokens.some(t => /^[가-힣]{8,}$/.test(t))) fail(file, where, "한자어 연속(8음절 이상 붙은 낱말)", s);
    let run = 0; for (const t of tokens) { run = /(적|성|화|력|도|률)$/.test(t) ? run + 1 : 0; if (run >= 3) { fail(file, where, "한자어 연속(접미사 3연속)", s); break; } }
    if (opts.signal) {
      if (!ENDING_OK.test(s)) fail(file, where, "어미 규칙(합니다체 조건부)", s);
      if (MBTI_CODE.test(s)) fail(file, where, "용어 누출(MBTI/명리 일반 용어)", s);
      for (const j of jargon) if (s.includes(j) && !(j === "상관" && /상관 ?없/.test(s)) && !(j === "정관" && /정관리/.test(s))) { fail(file, where, "용어 누출(명리 용어)", `${j} ← ${s}`); break; }
    }
    if (opts.dedupe !== false) {
      const key = norm(s); if (key.length < 10) continue;
      const prev = sentenceStore.get(key);
      if (prev && prev !== where) fail(file, where, "중복 문장", `${s} (먼저: ${prev})`); else sentenceStore.set(key, where);
    }
  }
}
function checkSignals(file: string, where: string, signals: readonly Signal[]) {
  signals.forEach((sg, i) => { checkProse(file, `${where}[${i}]`, sg.text, { signal: true }); sg.sourceRefs.forEach(r => checkRef(file, `${where}[${i}]`, r)); });
}

// ---------- 파일별 ----------
const stats: Record<string, unknown> = {};
const dimensionIds = new Set<string>();
function lintOntology(path: string) {
  const file = "behavior-ontology.json";
  const parsed = BehaviorOntologySchema.safeParse(readJson(path));
  if (!parsed.success) { fail(file, "schema", "zod", parsed.error.issues.slice(0, 5).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  for (const d of parsed.data.dimensions) {
    if (dimensionIds.has(d.id)) fail(file, d.id, "id 중복"); dimensionIds.add(d.id);
    checkProse(file, `${d.id}.definition`, d.definition, {});
    checkProse(file, `${d.id}.plus`, d.poles.plus.description, { signal: true });
    checkProse(file, `${d.id}.minus`, d.poles.minus.description, { signal: true });
    d.sceneTemplates.forEach((t, i) => checkProse(file, `${d.id}.scene[${i}]`, t.text.replace(/\{name\}은?/g, "").trim(), { signal: true, maxLen: 70 }));
  }
  stats.dimensions = parsed.data.dimensions.length;
}
function loadFeatures(): { features: MyeongriFeature[]; aliases: { id: string; aliasOf: string }[]; files: string[] } | null {
  const merged = join(DATA, "myeongri-features.json"), partsDir = join(DATA, "features");
  if (only) {
    const p = readJson(only);
    if (p && typeof p === "object" && "profiles" in p) { lintMbtiPart(only, p); return null; }
    if (p && typeof p === "object" && "findings" in p) { lintCrossPart(only, p); return null; }
    const r = z.object({ features: z.array(MyeongriFeatureSchema), aliases: z.array(FeatureAliasSchema).default([]) }).safeParse(p);
    if (!r.success) { fail(only, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return null; }
    return { ...r.data, files: [only] };
  }
  if (existsSync(merged)) {
    const r = MyeongriFeaturesSchema.safeParse(readJson(merged));
    if (!r.success) { fail("myeongri-features.json", "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return null; }
    return { features: [...r.data.features], aliases: [...r.data.aliases], files: [merged] };
  }
  if (!existsSync(partsDir)) return null;
  const out = { features: [] as MyeongriFeature[], aliases: [] as { id: string; aliasOf: string }[], files: [] as string[] };
  for (const f of readdirSync(partsDir).filter(f => f.endsWith(".json")).sort()) {
    const r = z.object({ features: z.array(MyeongriFeatureSchema), aliases: z.array(FeatureAliasSchema).default([]) }).safeParse(readJson(join(partsDir, f)));
    if (!r.success) { fail(`features/${f}`, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); continue; }
    out.features.push(...r.data.features); out.aliases.push(...r.data.aliases); out.files.push(f);
  }
  return out;
}
const featureIds = new Set<string>();
function lintFeatures() {
  const loaded = loadFeatures(); if (!loaded) return;
  const file = only ? only.split("/").at(-1)! : "myeongri-features";
  for (const f of loaded.features) {
    if (featureIds.has(f.id)) fail(file, f.id, "feature id 중복"); featureIds.add(f.id);
    checkProse(file, `${f.id}.definition`, f.definition, { allowHan: true, maxLen: 140 });
    checkSignals(file, `${f.id}.behaviorSignals`, f.behaviorSignals);
    checkSignals(file, `${f.id}.shadowSignals`, f.shadowSignals);
    for (const d of Object.keys(f.dimensionTags)) if (dimensionIds.size && !dimensionIds.has(d)) fail(file, `${f.id}.dimensionTags`, "차원 id 미해결", d);
    f.positionNuance?.forEach((p, i) => { checkProse(file, `${f.id}.positionNuance[${i}]`, p.text, { maxLen: 140, dedupe: false }); p.sourceRefs.forEach(r => checkRef(file, `${f.id}.positionNuance[${i}]`, r)); });
    for (const k of ["strong", "weak", "duplicate", "clash"] as const) { const t = f.strengthRule[k]; if (t) checkProse(file, `${f.id}.strengthRule.${k}`, t, { maxLen: 140, dedupe: false }); }
    f.strengthRule.sourceRefs.forEach(r => checkRef(file, `${f.id}.strengthRule`, r));
    f.sourceRefs.forEach(r => checkRef(file, `${f.id}.sourceRefs`, r));
  }
  for (const a of loaded.aliases) { if (featureIds.has(a.id)) fail(file, a.id, "alias id가 feature id와 겹침"); if (!featureIds.has(a.aliasOf)) fail(file, a.id, "aliasOf 미해결", a.aliasOf); }
  // Q0 241개 전수 커버
  if (sourceIndex && !only) {
    const all = new Set([...featureIds, ...loaded.aliases.map(a => a.id)]);
    const missing = sourceIndex.q0Features.filter((q: any) => !all.has(q.id)).map((q: any) => q.id);
    if (missing.length) fail(file, "coverage", `Q0 feature 누락 ${missing.length}개`, missing.slice(0, 20).join(", "));
    stats.q0Coverage = `${sourceIndex.q0Features.length - missing.length}/${sourceIndex.q0Features.length}`;
  }
  stats.features = loaded.features.length; stats.aliases = loaded.aliases.length; stats.featureFiles = loaded.files.length;
  stats.behaviorSignals = loaded.features.reduce((n, f) => n + f.behaviorSignals.length, 0);
  stats.featuresWithPosition = loaded.features.filter(f => f.positionNuance?.length).length;
}
function lintMbtiPart(path: string, raw: unknown) {
  const file = path.split("/").at(-1)!;
  const r = z.object({ profiles: z.array(MbtiProfileSchema).min(1) }).safeParse(raw);
  if (!r.success) { fail(file, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  lintProfiles(file, r.data.profiles);
}
function lintMbti() {
  const file = "mbti-profiles.json";
  if (!exists(file)) {
    const partsDir = join(DATA, "mbti"); if (!existsSync(partsDir)) return;
    for (const f of readdirSync(partsDir).filter(f => f.endsWith(".json")).sort()) lintMbtiPart(join(partsDir, f), readJson(join(partsDir, f)));
    return;
  }
  const r = MbtiProfilesSchema.safeParse(readJson(join(DATA, file)));
  if (!r.success) { fail(file, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  lintProfiles(file, r.data.profiles);
}
function lintProfiles(file: string, profiles: z.infer<typeof MbtiProfileSchema>[]) {
  for (const p of profiles) {
    checkProse(file, `${p.type}.oneLine`, p.oneLine, {});
    p.cognitiveFunctions.forEach((c, i) => { checkProse(file, `${p.type}.fn[${i}]`, c.easy, { maxLen: 90 }); c.sourceRefs.forEach(ref => checkRef(file, `${p.type}.fn[${i}]`, ref)); });
    for (const [domain, list] of Object.entries(p.signals)) checkSignals(file, `${p.type}.signals.${domain}`, list);
    checkSignals(file, `${p.type}.shadows`, p.shadows);
    for (const d of Object.keys(p.dimensionTags)) if (dimensionIds.size && !dimensionIds.has(d)) fail(file, `${p.type}.dimensionTags`, "차원 id 미해결", d);
    p.sourceRefs.forEach(ref => checkRef(file, `${p.type}.sourceRefs`, ref));
  }
  stats.mbtiProfiles = Number(stats.mbtiProfiles ?? 0) + profiles.length;
}
function lintCrossPart(path: string, raw: unknown) {
  const file = path.split("/").at(-1)!;
  const r = z.object({ findings: z.array(CrossFindingSchema).min(1) }).safeParse(raw);
  if (!r.success) { fail(file, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  // 부분 파일 검사 때는 feature id 참조를 cross-candidates.json 으로 확인한다
  if (!featureIds.size && exists("cross-candidates.json")) for (const c of readJson(join(DATA, "cross-candidates.json")).candidates) featureIds.add(c.featureId);
  lintFindings(file, r.data.findings);
}
function lintCross() {
  const file = "cross-findings.json";
  if (!exists(file)) {
    const partsDir = join(DATA, "cross"); if (!existsSync(partsDir)) return;
    for (const f of readdirSync(partsDir).filter(f => f.endsWith(".json")).sort()) lintCrossPart(join(partsDir, f), readJson(join(partsDir, f)));
    return;
  }
  const r = CrossFindingsSchema.safeParse(readJson(join(DATA, file)));
  if (!r.success) { fail(file, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  lintFindings(file, r.data.findings);
}
function lintFindings(file: string, findings: z.infer<typeof CrossFindingSchema>[]) {
  const ids = new Set<string>();
  for (const c of findings) {
    if (ids.has(c.id)) fail(file, c.id, "id 중복"); ids.add(c.id);
    if (featureIds.size && !featureIds.has(c.featureId)) fail(file, c.id, "featureId 미해결", c.featureId);
    if (dimensionIds.size && !dimensionIds.has(c.dimension)) fail(file, c.id, "차원 id 미해결", c.dimension);
    checkProse(file, `${c.id}.insight`, c.insight, { signal: false, maxLen: 70 });
    if ((c.insight.match(/[.!?]/g) ?? []).length !== 2) fail(file, `${c.id}.insight`, "insight는 정확히 2문장", c.insight);
    if (MBTI_CODE.test(c.insight.replace(/\b[EI][NS][TF][JP]\b/g, ""))) fail(file, `${c.id}.insight`, "용어 누출(명리 일반 용어)", c.insight);
    checkProse(file, `${c.id}.scene`, c.scene, { signal: true, maxLen: 70 });
    c.sourceRefs.forEach(ref => checkRef(file, c.id, ref));
  }
  const kinds: Record<string, number> = {}; for (const c of findings) kinds[c.kind] = (kinds[c.kind] ?? 0) + 1;
  stats.crossFindings = Number(stats.crossFindings ?? 0) + findings.length; stats.crossKinds = kinds;
}
function lintNarratives() {
  const file = "product-narratives.json"; if (!exists(file)) return;
  const r = ProductNarrativesSchema.safeParse(readJson(join(DATA, file)));
  if (!r.success) { fail(file, "schema", "zod", r.error.issues.slice(0, 8).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); return; }
  for (const p of r.data.products) {
    const chapterIds = new Set<string>();
    for (const c of p.chapters) {
      if (chapterIds.has(c.id)) fail(file, `${p.productKey}.${c.id}`, "chapter id 중복"); chapterIds.add(c.id);
      checkProse(file, `${p.productKey}.${c.id}.question`, c.question, { maxLen: 80, dedupe: true });
      c.dimensionFocus?.forEach(d => { if (dimensionIds.size && !dimensionIds.has(d)) fail(file, `${p.productKey}.${c.id}`, "차원 id 미해결", d); });
    }
    const roles = new Set(p.chapters.map(c => c.role));
    for (const need of ["HOOK", "PAYOFF"]) if (!roles.has(need as never)) fail(file, p.productKey, `장 역할 ${need} 없음`);
  }
  stats.products = r.data.products.length;
}

// ---------- 검토 패킷 ----------
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function writeSample() {
  const rnd = mulberry32(20261027), pick = <T,>(arr: T[], n: number) => [...arr].sort(() => rnd() - 0.5).slice(0, n);
  const loaded = loadFeatures(); const out: string[] = ["# Q1 검토 패킷 (seed 20261027)", "", "판정: 각 항목에 PASS / 수정 / 삭제 를 적는다. 기준: docs/design/knowledge-v5-style.md", ""];
  if (loaded) {
    out.push(`## feature 30개 (전체 ${loaded.features.length})`, "");
    for (const f of pick(loaded.features, 30)) {
      out.push(`### ${f.id} — ${f.traditionalName} / ${f.easyName}`, `- 정의: ${f.definition}`, `- 차원: ${Object.entries(f.dimensionTags).map(([k, v]) => `${k} ${v}`).join(", ")}`,
        ...f.behaviorSignals.map(s => `- [행동 ${s.domains.join("/")}] ${s.text}  ⟵ ${s.sourceRefs.join(", ")}`), ...f.shadowSignals.map(s => `- [그림자 ${s.domains.join("/")}] ${s.text}  ⟵ ${s.sourceRefs.join(", ")}`),
        `- 강약: 강 ${f.strengthRule.strong} / 약 ${f.strengthRule.weak}`, ...(f.positionNuance ?? []).map(p => `- 위치 ${p.position}: ${p.text}`), "- 판정: ", "");
    }
  }
  if (exists("cross-findings.json")) {
    const c = CrossFindingsSchema.parse(readJson(join(DATA, "cross-findings.json")));
    out.push(`## 교차 발견 20개 (전체 ${c.findings.length})`, "");
    for (const x of pick(c.findings, 20)) out.push(`### ${x.id} — ${x.featureId} × ${x.mbti} · ${x.dimension} · ${x.kind} (${x.score})`, `- ${x.insight}`, `- 장면: ${x.scene}`, `- 전제: ${x.factBoundary.requires.join(",") || "-"} / 금지: ${x.factBoundary.forbids.join(",") || "-"}`, `- 출처: ${x.sourceRefs.join(", ")}`, "- 판정: ", "");
  }
  if (exists("mbti-profiles.json")) {
    const m = MbtiProfilesSchema.parse(readJson(join(DATA, "mbti-profiles.json")));
    out.push("## MBTI 유형 3개", "");
    for (const p of pick(m.profiles, 3)) {
      out.push(`### ${p.type} — ${p.easyName}: ${p.oneLine}`, ...p.cognitiveFunctions.map(f => `- ${f.role} ${f.code}: ${f.easy}`));
      for (const [d, list] of Object.entries(p.signals)) out.push(...list.map(s => `- [${d}] ${s.text}  ⟵ ${s.sourceRefs.join(", ")}`));
      out.push(...p.shadows.map(s => `- [그림자] ${s.text}`), "- 판정: ", "");
    }
  }
  writeFileSync(join(ROOT, "docs", "q1-review-sample.md"), out.join("\n"));
}

// ---------- 실행 ----------
if (exists("behavior-ontology.json")) lintOntology(join(DATA, "behavior-ontology.json"));
lintFeatures();
if (!only) { lintMbti(); lintCross(); lintNarratives(); }
if (wantSample && !only) writeSample();
stats.sentences = sentenceCount; stats.avgSentenceChars = sentenceCount ? Math.round((sentenceChars / sentenceCount) * 10) / 10 : 0;
if (sentenceCount && sentenceChars / sentenceCount > 40) fail("*", "readability", "평균 문장 길이 > 40자", String(stats.avgSentenceChars));
const byRule: Record<string, number> = {}; for (const i of issues) byRule[i.rule] = (byRule[i.rule] ?? 0) + 1;
console.log(JSON.stringify({ stats, issueCount: issues.length, byRule }, null, 1));
for (const i of issues.slice(0, Number(process.env.LINT_MAX ?? 80))) console.log(`${i.file} :: ${i.where} :: ${i.rule}${i.text ? ` :: ${i.text}` : ""}`);
if (issues.length > Number(process.env.LINT_MAX ?? 80)) console.log(`... ${issues.length - Number(process.env.LINT_MAX ?? 80)} more`);
process.exit(issues.length ? 1 : 0);
