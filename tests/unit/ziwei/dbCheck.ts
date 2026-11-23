/**
 * ZW-1 자미두수 DB 결정론 검사기(시험 전용, 호출 0). src/data/knowledge-v5/ziwei/*.json 전부를 읽어 어긋남 목록을 돌려준다.
 * 검사: 스키마 · 길이 · id/엔진 짝 · 금지 꼴 · 등급 낱말 · 메모 · 내부 말 · 「살」 공포 꼴 · 화기 겁주기 · 건강 단정 · 한자 · MBTI 말 ·
 *       장면 소품 조건 · 꼬리표 범위 · 영역 매핑 · 입력 거름 · confidence · 사화 연간 표 = 엔진 표 · 같은 문장 · 이미지 중복.
 * 작성 서브에이전트도 이것을 돌린다: pnpm exec vitest run tests/unit/ziwei/db.test.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { z } from "zod";
import {
  BehaviorOntologySchema, ZiweiDeepSchema, ZiweiEmptySchema, ZiweiFileSchema, ZiweiFiveClassSchema, ZiweiMbtiRuleSchema, ZiweiMutagenSchema,
  ZiweiPairSchema, ZiweiPalaceSchema, ZiweiStageMapRowSchema, ZiweiStarSchema,
} from "@/data/knowledge-v5/schema";
import { FAMILY_MEMBER, GENDER_WORD, LOVE_TIMING, OLD_NEGATIVE, PAST_ASSERT, SICK_DEATH_IMAGE, splitSentences } from "@/lib/writer/safety/patterns";
import { BRIGHTNESS_TABLE, brightnessBasisOf, MUTAGEN_SCHOOL_VARIANTS, MUTAGEN_TABLE } from "@/lib/ziwei/basis";
import { BRANCHES, BRIGHTNESS3_OF, FIVE_CLASSES, FIVE_CLASS_INFO, MAJOR_STARS, MUTAGEN_NAMES, MUTAGENS, PALACE_NAMES, PALACES, STAR_NAMES, STAR_PAIRS, STEMS, BODY_PALACE_NAME, type MajorStarId, type StarId } from "@/lib/ziwei/ids";

export const ROOT = resolve(__dirname, "../../..");
export const ZIWEI_DB_DIR = resolve(ROOT, "src/data/knowledge-v5/ziwei");
export type Issue = { file: string; id: string; rule: string; text?: string };

const ontology = BehaviorOntologySchema.parse(JSON.parse(readFileSync(resolve(ROOT, "src/data/knowledge-v5/behavior-ontology.json"), "utf8")));
export const DIMENSIONS = new Map(ontology.dimensions.map(d => [d.id, d]));

// ---------- 금지 꼴 ----------
export const BANNED: readonly [string, RegExp][] = [
  ["흉한 옛말", /(?<![가-힣])(극처|극부|형극|상처|상부|단명|요절|이별수|과부|홀아비|파재|패가)|이혼|재혼|망신|횡사|팔자/],
  ["고독 확정", /고독(한|할)? ?(팔자|운명|별|확정)|평생 ?(혼자|외롭|외로)|외로울 (운명|팔자)|혼자 살 (운|팔자)/],
  ["병명 · 수술 · 사고 단정", /질병|질환|병명|암(에|이) ?(걸|생기)|당뇨|고혈압|우울증|공황|불면증|심장병|위염|위궤양|디스크|관절염|치매|뇌졸중|수술|입원|교통사고|사고(가|를)? ?(나|당하|날|난|칩)|부상|다치(게 됩|는 운|기 쉽)/],
  ["형벌 · 감옥", /감옥|교도소|구속|형벌|처벌|징역|전과|범죄/],
  ["등급 낱말", /대길|대흉|길흉|흉(?!내|터|보|금)|길(하다|한 |합니다|해요|성|운|일|조)(?![가-힣])|좋은 별|나쁜 별|좋은 궁|나쁜 궁|길성|흉성/],
  ["확정 예언", /(결혼|이별|이혼|사고|질병|죽음|사망|파산|합격|승진|임신|출산|성공|실패|부자)(을|이|가)? ?(하게 됩니다|하게 돼요|합니다\.|납니다|됩니다\.|생깁니다|옵니다|할 거예요|할 것입니다|하게 될 거예요)|(올해|내년|\d+년 ?(안|내|뒤|후)|\d+(살|세)) ?(에|쯤|무렵)? ?(결혼|이별|이혼|승진|합격|임신|부자|성공)|반드시|틀림없이|무조건|100%|운명적/],
  ["메모 · 내부 말", /(?<![가-힣])(카드|브리프|입력|미입력|핵심어|화면|작가|데이터|프롬프트|엔진|라이브러리|필드|항목|스키마)(?=$|[^가-힣]|(이|가|은|는|을|를|에|의|로|으로|와|과|도|만|에서|처럼|이나|란|이란)(?![가-힣]))|iztro|\bDB\b|zw:|TODO|※|주의:|참고:|메모/],
  ["「살」 공포 꼴", /(?<![칠지])살(이|을|에)? ?(끼|맞|풀|막|받|붙)|살풀이|살기(?! ?(좋|편|어))|흉살|액살|살성(이|은|의)? ?(무섭|위험|나쁘|해롭)|칼에 (베|찔)/],
  ["화기 겁주기", /화기(가|는|를|의|로)?[^.!?]{0,14}(나쁘|무섭|위험|불행|망하|재앙|실패|손해|조심해야|피해야)/],
  ["건강 단정", /건강(이|을|에)? ?(나쁘|약하|해치|무너|위험|안 좋)|아프(게 됩|기 쉽|기 쉬운|다는)|병(이|에|을) ?(들|걸|생기)|몸이 약(하|한)/],
  ["정보량 0 · 진부", /남다른 잠재력|무한한 가능성|특별한 존재|소중한 사람|빛나는 (존재|사람)|자신만의 길|큰 복|많은 복|복이 많|좋은 일이 (생깁니다|있을)|타고난 복|귀인이 나타|대박|잠재력이 (있|큽|많)|행복해질|긍정적인 (에너지|마음)/],
  ["흐린 말투", /일 수도 있습니다|가능성이 있습니다|일지도 모릅니다|참고하세요|일 수 있을지도/],
  ["비하", /문제가 있습니다|불행|저주|한심|쓸모없|멍청|게으른 사람|못난|열등/],
  ["옛 부정 낱말", OLD_NEGATIVE],
  ["질병 · 죽음 이미지", SICK_DEATH_IMAGE],
  ["인연 시기", LOVE_TIMING],
  ["과거 단정", PAST_ASSERT],
  ["성별 고정관념", GENDER_WORD],
];
const HAN = /[一-鿿]/;
/** 이름 뒤 조사(받침 있는 이름 + 가 · 는 · 를 · 와, 받침 없는 이름 + 이 · 은 · 을 · 과). 예: 「천기이」「자미은」「좌보은」은 틀림. */
const hasBatchim = (w: string) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 !== 0; };
const NAME_WORDS: readonly string[] = [...new Set([...Object.values(STAR_NAMES).map(n => n.ko), ...Object.values(PALACE_NAMES).map(n => n.ko), "신궁", ...Object.values(MUTAGEN_NAMES).map(n => n.ko)])];
export function particleErrors(text: string): string[] {
  const out: string[] = [];
  for (const w of NAME_WORDS) {
    const bad = hasBatchim(w) ? ["가", "는", "를", "와"] : ["이", "은", "을", "과"];
    const re = new RegExp(`(?<![가-힣])${w}(${bad.join("|")})(?![가-힣])`, "g");
    for (const m of text.matchAll(re)) out.push(m[0]);
  }
  return out;
}
const MBTI_WORD = /\b[EI][NS][TF][JP]\b|MBTI/;
/** 장면에는 자미두수 용어를 쓰지 않는다(상황만). */
export const SCENE_JARGON = /명궁|형제궁|부처궁|자녀궁|재백궁|질액궁|천이궁|노복궁|관록궁|전택궁|복덕궁|부모궁|신궁|사화|화록|화권|화과|화기|명반|(?<!에 )(?<![가-힣])대한|주성|보좌성|살성|자미|칠살|천동|오행국/;
export const JOB_PROP = /회사|사무실|팀장|부장|과장|상사(?!병)|동료|출근|퇴근|회의(?!적)|거래처|손님|가게|매장|사장님|직원|수업|학교|교실|(?<![가-힣])시험(?! ?삼|해)|과제|교수|선생님|고객사/;
export const SPOUSE_PROP = /(?<![가-힣])(남편|아내|배우자|연인|애인|남자친구|여자친구|남친|여친|신혼)|결혼한/;
export const KID_PROP = /(?<![가-힣])(아이|아들|딸)(?!디어|콘|돌|기|템)(?=$|[^가-힣]|(가|는|를|이|의|에게|와|과|도|들|랑|한테|은|을|이랑))|자녀|육아|유치원|어린이집/;

// ---------- 읽기 ----------
type Loaded = { file: string; family: string; entries: unknown[]; yearTable?: unknown[] };
export function loadZiweiFiles(): Loaded[] {
  let names: string[] = [];
  try { names = readdirSync(ZIWEI_DB_DIR).filter(f => f.endsWith(".json")).sort(); } catch { return []; }
  return names.map(f => {
    const raw = JSON.parse(readFileSync(resolve(ZIWEI_DB_DIR, f), "utf8"));
    const p = ZiweiFileSchema.safeParse(raw);
    if (!p.success) return { file: f, family: "?", entries: [], parseError: p.error.issues.slice(0, 5).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ") } as Loaded & { parseError: string };
    return { file: f, family: p.data.family, entries: p.data.entries, yearTable: p.data.yearTable };
  });
}

const SCHEMA_OF: Record<string, z.ZodTypeAny> = {
  majorStar: ZiweiStarSchema, helperStar: ZiweiStarSchema, maleficStar: ZiweiStarSchema, loveStar: ZiweiStarSchema,
  palace: ZiweiPalaceSchema, starPair: ZiweiPairSchema, emptyPalace: ZiweiEmptySchema, mutagen: ZiweiMutagenSchema, fiveClass: ZiweiFiveClassSchema,
  deep: ZiweiDeepSchema, mbti: ZiweiMbtiRuleSchema, stageMap: ZiweiStageMapRowSchema,
};
/** 고객에게 갈 수 있는 글 필드만 모은다(id · 이름 · 출처 · 조건 제외). */
const NON_PROSE = new Set(["id", "family", "name", "easyName", "sources", "engineKey", "confidence", "stars", "bundle", "palace", "keys", "dimension", "dimensionTags", "domains", "mbtiTarget", "ziweiId", "kind", "score", "factBoundary", "requires", "number", "stem", "rok", "gwon", "gwa", "gi", "variants", "school", "mutagen", "star"]);
export function proseOf(entry: unknown, path = ""): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const walk = (v: unknown, p: string) => {
    if (typeof v === "string") { out.push({ path: p, text: v }); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`)); return; }
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!NON_PROSE.has(k)) walk(x, p ? `${p}.${k}` : k);
  };
  walk(entry, path);
  return out;
}
const idOf = (e: unknown) => (e && typeof e === "object" && "id" in e ? String((e as { id: unknown }).id) : (e as { palace?: string })?.palace ?? "?");

export type DbReport = { issues: Issue[]; ids: Set<string>; counts: Record<string, number>; sentences: number; images: number; myeongriImageNear: { a: string; b: string; sim: number }[] };

function trigrams(s: string) { const t = s.replace(/[\s\p{P}\p{S}]/gu, ""); const g = new Set<string>(); for (let i = 0; i + 3 <= t.length; i++) g.add(t.slice(i, i + 3)); return g; }
function sim(a: Set<string>, b: Set<string>) { if (!a.size || !b.size) return 0; let n = 0; for (const x of a) if (b.has(x)) n++; return n / Math.min(a.size, b.size); }

export function runZiweiDbCheck(): DbReport {
  const issues: Issue[] = [];
  const fail = (file: string, id: string, rule: string, text?: string) => issues.push({ file, id, rule, ...(text ? { text } : {}) });
  const ids = new Set<string>();
  const counts: Record<string, number> = {};
  const sentenceSeen = new Map<string, string>();
  const images: { id: string; text: string; g: Set<string> }[] = [];

  for (const f of loadZiweiFiles()) {
    if ((f as { parseError?: string }).parseError) { fail(f.file, "-", "파일 스키마", (f as { parseError?: string }).parseError); continue; }
    const schema = SCHEMA_OF[f.family];
    for (const raw of f.entries) {
      const id = idOf(raw);
      const parsed = schema.safeParse(raw);
      if (!parsed.success) { fail(f.file, id, "스키마 · 길이", parsed.error.issues.slice(0, 6).map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")); continue; }
      const e = parsed.data as Record<string, unknown>;
      const fam = (e.family as string | undefined) ?? f.family;
      counts[fam] = (counts[fam] ?? 0) + 1;
      const key = f.family === "stageMap" ? `stage:${e.palace}` : id;
      if (ids.has(key)) fail(f.file, id, "id 중복"); ids.add(key);
      checkIdentity(f.file, fam, e, fail);
      // 글 검사
      for (const { path, text } of proseOf(e)) {
        for (const [name, re] of BANNED) if (re.test(text)) fail(f.file, id, `금지 꼴(${name})`, `${path}: ${text}`);
        if (HAN.test(text)) fail(f.file, id, "한자(이름 밖)", `${path}: ${text}`);
        for (const pe of particleErrors(text)) fail(f.file, id, "이름 뒤 조사 틀림", `${path}: ${pe}`);
        if (f.family !== "mbti" && MBTI_WORD.test(text)) fail(f.file, id, "MBTI 말(짝 파일 밖)", `${path}: ${text}`);
        if (/(^|\.)scene(s\.[a-z]+\[\d+\])?\.(broad|text)$|scene\.(broad|text)$/.test(path) || /^scenes\./.test(path)) if (SCENE_JARGON.test(text)) fail(f.file, id, "장면 안 용어", `${path}: ${text}`);
        if (!/image|imageVariants/.test(path)) for (const s of splitSentences(text)) {
          const n = s.replace(/[\s\p{P}\p{S}]/gu, "");
          if (n.length < 12) continue;
          const prev = sentenceSeen.get(n);
          if (prev && prev !== `${id}`) fail(f.file, id, "같은 문장 되풀이", `${s} (먼저: ${prev})`);
          else if (prev === `${id}`) fail(f.file, id, "같은 문장 되풀이(한 항목 안)", s);
          else sentenceSeen.set(n, id);
        }
      }
      // 장면 소품 조건
      const scenes: { broad: string; text: string; requires: { relationship: string; children: string; job: string } }[] = [];
      if (e.scenes) for (const list of Object.values(e.scenes as Record<string, typeof scenes>)) scenes.push(...list);
      if (e.scene) scenes.push(e.scene as (typeof scenes)[number]);
      for (const s of scenes) {
        if (JOB_PROP.test(s.broad) || SPOUSE_PROP.test(s.broad) || KID_PROP.test(s.broad) || FAMILY_MEMBER.test(s.broad)) fail(f.file, id, "큰 틀 장면에 소품", s.broad);
        if (JOB_PROP.test(s.text) && s.requires.job === "any") fail(f.file, id, "직업 소품인데 requires.job any", s.text);
        if (SPOUSE_PROP.test(s.text) && s.requires.relationship === "any") fail(f.file, id, "연인 · 배우자 소품인데 requires.relationship any", s.text);
        if (KID_PROP.test(s.text) && s.requires.children === "any") fail(f.file, id, "자녀 소품인데 requires.children any", s.text);
        if (FAMILY_MEMBER.test(s.text) && s.requires.relationship === "any" && s.requires.children === "any") fail(f.file, id, "가족 소품인데 조건 없음", s.text);
      }
      // 꼬리표 · 영역
      const tags = (e.dimensionTags ?? {}) as Record<string, number>;
      for (const d of Object.keys(tags)) if (!DIMENSIONS.has(d)) fail(f.file, id, "꼬리표가 행동 차원 31 밖", d);
      if (f.family === "mbti" && !DIMENSIONS.has(e.dimension as string)) fail(f.file, id, "짝 차원이 31 밖", String(e.dimension));
      if (Array.isArray(e.domains) && fam !== "palace") {
        const supported = new Set(Object.entries(tags).filter(([, v]) => Math.abs(v) >= 0.3).flatMap(([d]) => DIMENSIONS.get(d)?.domains ?? []));
        for (const d of e.domains as string[]) if (!supported.has(d as never)) fail(f.file, id, "영역 매핑(꼬리표가 받치지 않는 영역)", d);
      }
      if (e.scenes && Array.isArray(e.domains)) for (const d of Object.keys(e.scenes as object)) if (!(e.domains as string[]).includes(d)) fail(f.file, id, "장면 영역이 domains 밖", d);
      // 이미지
      const imgs = [e.image, ...((e.imageVariants as unknown[]) ?? [])].filter(Boolean) as { metaphor: string; visual: string }[];
      for (const im of imgs) for (const t of [im.metaphor, im.visual]) images.push({ id, text: t, g: trigrams(t) });
    }
    if (f.yearTable) checkYearTable(f.file, f.yearTable as z.infer<typeof import("@/data/knowledge-v5/schema").ZiweiMutagenYearSchema>[], fail);
  }
  // 첫머리 겹침: 주성 palaceNuance는 같은 궁에서 별끼리 첫 6글자가 같으면 안 되고, MBTI 짝 why는 한 별 안에서 같은 첫 6글자가 4개를 넘으면 안 된다.
  const head = (t: string, n: number) => t.replace(/[\s\p{P}\p{S}]/gu, "").slice(0, n);
  const majors = loadZiweiFiles().filter(f => f.family === "majorStar").flatMap(f => f.entries as { id: string; palaceNuance?: Record<string, string> }[]);
  for (const pk of PALACES) {
    const seen = new Map<string, string>();
    for (const m of majors) { const t = m.palaceNuance?.[pk]; if (!t) continue; const h = head(t, 6); if (seen.has(h)) fail("stars-major.json", `${m.id} ↔ ${seen.get(h)}`, `palaceNuance 첫머리 겹침(${pk})`, h); else seen.set(h, m.id); }
  }
  const rules = loadZiweiFiles().filter(f => f.family === "mbti").flatMap(f => f.entries as { id: string; ziweiId: string; why: string }[]);
  const byStar = new Map<string, Map<string, number>>();
  for (const r of rules) { const m = byStar.get(r.ziweiId) ?? new Map<string, number>(); const h = head(r.why, 6); m.set(h, (m.get(h) ?? 0) + 1); byStar.set(r.ziweiId, m); }
  for (const [star, m] of byStar) for (const [h, n] of m) if (n > 4) fail("mbti.json", star, "짝 why 첫머리 겹침(같은 첫 6글자 5개 이상)", `${h} × ${n}`);
  // 이미지 중복(서로 다른 항목): 같은 글 또는 세 글자 묶음 60% 이상 겹침.
  for (let i = 0; i < images.length; i++) for (let j = i + 1; j < images.length; j++) {
    const a = images[i], b = images[j];
    if (a.id === b.id) continue;
    if (a.text === b.text || sim(a.g, b.g) >= 0.6) fail("-", `${a.id} ↔ ${b.id}`, "이미지 중복", `${a.text} / ${b.text}`);
  }
  // 핵심 사물 중복: 그림(metaphor)의 머리 낱말(마지막 낱말)이 다른 항목 · 명리 DB 그림의 머리 낱말과 같거나 포함 관계면(샘 ⊂ 옹달샘) 실패.
  const headOf = (t: string) => { const w = t.replace(/[\p{P}\p{S}]/gu, " ").trim().split(/\s+/).pop() ?? ""; return w.replace(/(이|가|을|를|은|는|의|처럼|같은|과|와)$/u, ""); };
  const GENERIC_HEAD = new Set(["사람", "손", "모습", "자리", "날", "때", "곳", "일", "마음", "길", "것", "쪽", "얼굴", "눈", "소리", "빛", "물", "불", "힘"]);
  const zwHeads: { id: string; head: string; text: string }[] = [];
  for (const f of loadZiweiFiles()) for (const raw of f.entries as { id?: string; image?: { metaphor: string } }[]) if (raw.image?.metaphor) { const h = headOf(raw.image.metaphor); if (h.length >= 1 && !GENERIC_HEAD.has(h)) zwHeads.push({ id: String(raw.id), head: h, text: raw.image.metaphor }); }
  // 같은 낱말이거나, 긴 쪽(4자 이하 합성어)이 짧은 쪽으로 끝나면 같은 사물(샘 ⊂ 옹달샘, 칼 ⊂ 부엌칼).
  const sameObj = (a: string, b: string) => a === b || (Math.max(a.length, b.length) <= 4 && (a.endsWith(b) || b.endsWith(a)));
  for (let i = 0; i < zwHeads.length; i++) for (let j = i + 1; j < zwHeads.length; j++) if (sameObj(zwHeads[i].head, zwHeads[j].head)) fail("-", `${zwHeads[i].id} ↔ ${zwHeads[j].id}`, "그림 핵심 사물 중복", `${zwHeads[i].text} / ${zwHeads[j].text}`);
  const mHeads: { id: string; head: string; text: string }[] = [];
  const mdir0 = resolve(ROOT, "src/data/knowledge-v5/myeongri");
  for (const fn of readdirSync(mdir0).filter(x => x.endsWith(".json"))) for (const ft of JSON.parse(readFileSync(resolve(mdir0, fn), "utf8")).features ?? []) if (typeof ft.image?.metaphor === "string") { const h = headOf(ft.image.metaphor); if (h.length >= 1 && !GENERIC_HEAD.has(h)) mHeads.push({ id: ft.id, head: h, text: ft.image.metaphor }); }
  // 지시서가 정한 예시 그림(칠살 = 장군의 칼)은 덕짱 판단 전까지 예외(ZW-1 2부 파일럿 질문). 바꾸기로 하면 이 줄을 지운다.
  const DIRECTED_IMAGES = new Set(["zw:star:chilsal"]);
  for (const a of zwHeads) for (const b of mHeads) if (sameObj(a.head, b.head) && !DIRECTED_IMAGES.has(a.id)) fail("-", `${a.id} ↔ 명리 ${b.id}`, "그림 핵심 사물이 명리 DB와 같음", `${a.text} / ${b.text}`);
  // 명리 DB 이미지와 가까운 것(경고, 실패 아님 — 3중 결합 대비 보고용).
  const myeongriImages: { id: string; text: string; g: Set<string> }[] = [];
  const mdir = resolve(ROOT, "src/data/knowledge-v5/myeongri");
  for (const fn of readdirSync(mdir).filter(x => x.endsWith(".json"))) for (const ft of JSON.parse(readFileSync(resolve(mdir, fn), "utf8")).features ?? []) for (const t of [ft.image?.metaphor, ft.image?.visual]) if (typeof t === "string") myeongriImages.push({ id: ft.id, text: t, g: trigrams(t) });
  const myeongriImageNear: DbReport["myeongriImageNear"] = [];
  for (const a of images) for (const b of myeongriImages) { const s = sim(a.g, b.g); if (s >= 0.6) myeongriImageNear.push({ a: `${a.id}: ${a.text}`, b: `${b.id}: ${b.text}`, sim: Math.round(s * 100) / 100 }); }
  return { issues, ids, counts, sentences: sentenceSeen.size, images: images.length, myeongriImageNear };
}

/** 그 주성의 밝기 근거 「통용」 칸에 실제로 나오는 3단(이 단의 글만 쓰인다). */
export function agreedLevels(star: MajorStarId): Set<"bright" | "normal" | "dark"> {
  const out = new Set<"bright" | "normal" | "dark">();
  for (const b of BRANCHES) {
    const raw = BRIGHTNESS_TABLE[star]?.["寅卯辰巳午未申酉戌亥子丑".indexOf(b)] ?? null;
    if (raw && brightnessBasisOf(star, b, raw) === "통용") out.add(BRIGHTNESS3_OF[raw]);
  }
  return out;
}

function checkIdentity(file: string, fam: string, e: Record<string, unknown>, fail: (file: string, id: string, rule: string, text?: string) => void) {
  const id = String(e.id ?? e.palace);
  const name = e.name as string | undefined;
  if (name !== undefined && !/^[가-힣 ]+\([一-鿿 ]+\)$/.test(name)) fail(file, id, "이름 꼴(한글(한자))", name);
  const kindOf: Record<string, string> = { majorStar: "major", helperStar: "helper", maleficStar: "malefic", loveStar: "love" };
  if (kindOf[fam]) {
    const k = e.engineKey as StarId;
    const n = STAR_NAMES[k];
    if (!n) return fail(file, id, "engineKey가 엔진 별 id가 아님", String(k));
    if (id !== `zw:star:${k}`) fail(file, id, "id ≠ zw:star:<engineKey>");
    if (n.kind !== kindOf[fam]) fail(file, id, "family ≠ 엔진 별 종류", `${fam} / ${n.kind}`);
    if (name !== `${n.ko}(${n.hanja})`) fail(file, id, "이름 ≠ 엔진 이름", `${name} / ${n.ko}(${n.hanja})`);
    if (e.easyName !== n.easy) fail(file, id, "쉬운 이름 ≠ 엔진 쉬운 이름(ids.ts)", `${e.easyName} / ${n.easy}`);
    if (fam === "majorStar") {
      // 자녀궁 줄은 자녀 유무를 전제하지 않는다: 「자녀」를 쓰면 「~든 ~든」처럼 열어 두거나 아랫사람 · 후배 · 기르는 일을 함께 쓴다.
      const jn = (e.palaceNuance as Record<string, string> | undefined)?.janyeo;
      if (jn && /자녀|아이/.test(jn) && !/(자녀|아이)(든|가 있(다면|으면)|가 생기면)/.test(jn)) fail(file, id, "자녀궁 줄이 자녀 있음을 전제(「자녀든 ~든」 · 「자녀가 있다면」 꼴로)", jn);
      const lv = agreedLevels(k as MajorStarId);
      const br = (e.brightness ?? {}) as Record<string, string | undefined>;
      const fy = e.forYou as Record<string, string | undefined>;
      for (const l of ["bright", "normal", "dark"] as const) if (lv.has(l) !== Boolean(br[l])) fail(file, id, lv.has(l) ? `밝기 ${l} 단이 나오는데 brightness.${l} 없음` : `밝기 ${l} 단은 이 별에 안 나옴 — brightness.${l} 빼기`);
      for (const l of ["bright", "dark"] as const) if (lv.has(l) !== Boolean(fy[l])) fail(file, id, lv.has(l) ? `밝기 ${l} 단이 나오는데 forYou.${l} 없음` : `밝기 ${l} 단은 이 별에 안 나옴 — forYou.${l} 빼기`);
    }
  } else if (fam === "palace") {
    const k = e.engineKey as string;
    const n = k === "sin" ? BODY_PALACE_NAME : PALACE_NAMES[k as keyof typeof PALACE_NAMES];
    if (!n) return fail(file, id, "engineKey가 궁 id가 아님", k);
    if (id !== `zw:palace:${k}`) fail(file, id, "id ≠ zw:palace:<engineKey>");
    if (name !== `${n.ko}(${n.hanja})`) fail(file, id, "이름 ≠ 엔진 이름", `${name} / ${n.ko}(${n.hanja})`);
    if (e.easyName !== n.easy) fail(file, id, "쉬운 이름 ≠ 엔진 쉬운 이름(ids.ts)", `${e.easyName} / ${n.easy}`);
    const lens = e.lens as { default: string; relationship?: Record<string, string>; children?: Record<string, string>; job?: Record<string, string> };
    if (k === "bucheo") for (const s of ["single", "some", "dating", "married"]) if (!lens.relationship?.[s]) fail(file, id, "입력 거름: 부처궁 연애 상태 렌즈 빠짐", s);
    if (k === "janyeo") { if (!lens.children?.has || !lens.children?.none) fail(file, id, "입력 거름: 자녀궁 자녀 렌즈 빠짐"); else if (!/아랫사람/.test(lens.children.none) || !/길러/.test(lens.children.none)) fail(file, id, "입력 거름: 자녀 미입력 렌즈는 「아랫사람 · 내가 길러 내는 것」", lens.children.none); }
    if (k === "gwanrok") for (const s of ["employed", "business", "student", "other"]) if (!lens.job?.[s]) fail(file, id, "입력 거름: 관록궁 일 상태 렌즈 빠짐", s);
    if (k === "jilaek" && !/컨디션|리듬/.test(JSON.stringify(lens) + String(e.stage))) fail(file, id, "질액궁은 컨디션 리듬으로만");
    if ((e.domains as string[]).length > 3) fail(file, id, "궁 영역 매핑은 1~3개");
  } else if (fam === "starPair") {
    const [a, b] = e.stars as [string, string];
    const pid = `${a}-${b}`;
    if (!STAR_PAIRS.includes(pid)) fail(file, id, "쌍성 24 밖", pid);
    if (id !== `zw:pair:${pid}` || e.engineKey !== pid) fail(file, id, "id · engineKey ≠ zw:pair:<앞별-뒷별>");
    if (name !== `${STAR_NAMES[a as StarId]?.ko}${STAR_NAMES[b as StarId]?.ko}(${STAR_NAMES[a as StarId]?.hanja}${STAR_NAMES[b as StarId]?.hanja})`) fail(file, id, "쌍성 이름 꼴(자미천부(紫微天府))", name);
  } else if (fam === "mutagen") {
    const k = e.engineKey as keyof typeof MUTAGEN_NAMES;
    const n = MUTAGEN_NAMES[k];
    if (!n || id !== `zw:mutagen:${k}`) fail(file, id, "사화 id · engineKey");
    else { if (name !== `${n.ko}(${n.hanja})`) fail(file, id, "이름 ≠ 엔진 이름", name); if (e.easyName !== n.easy) fail(file, id, "쉬운 이름 ≠ ids.ts", String(e.easyName)); }
  } else if (fam === "fiveClass") {
    const k = e.engineKey as (typeof FIVE_CLASSES)[number];
    const n = FIVE_CLASS_INFO[k];
    if (!n || id !== `zw:class:${k}` || e.number !== n.number) fail(file, id, "오행국 id · 수");
    else if (name !== `${n.ko}(${n.hanja})`) fail(file, id, "이름 ≠ 엔진 이름", name);
  } else if (fam === "emptyPalace") {
    if (id !== "zw:empty:rule") fail(file, id, "공궁 규칙 id는 zw:empty:rule");
  } else if (fam === "deep") {
    const b = e.bundle as string;
    // 공궁은 맞은편 칸의 주성을 빌린다. 칠살 · 천부 · 천상 · 파군은 빈칸의 맞은편에 올 수 없다(열두 배치 전수) — 공궁 원고가 예로 들면 사실 오류.
    // 쉬운 이름은 「밀고 가는 · 새로 짜는」처럼 남과 헷갈리지 않는 앞부분도 본다(「지키는 · 돕는」은 일상어라 이름만).
    const NO_BORROW: readonly [string, readonly string[]][] = [["chilsal", ["칠살", "밀고 가는"]], ["cheonbu", ["천부"]], ["cheonsang", ["천상"]], ["pagun", ["파군", "새로 짜는"]]];
    if (b === "empty") for (const [sid, words] of NO_BORROW) if (proseOf(e).some(x => words.some(w => x.text.includes(w)))) fail(file, id, "공궁 원고가 빌려 올 수 없는 별을 예로 듦", `${sid}: ${words.join(" · ")}`);
    if (!(MAJOR_STARS as readonly string[]).includes(b) && !STAR_PAIRS.includes(b) && b !== "empty") fail(file, id, "심화 묶음이 단독 14 · 쌍성 24 · 공궁 밖", b);
    if (id !== `zw:deep:${e.palace}:${b}`) fail(file, id, "심화 id ≠ zw:deep:<궁>:<묶음>");
  } else if (fam === "mbti") {
    const star = (e.ziweiId as string).slice("zw:star:".length);
    if (!(MAJOR_STARS as readonly string[]).includes(star)) fail(file, id, "짝은 주성 14만");
    if (id !== `zw-mbti:${star}:${e.mbtiTarget}`) fail(file, id, "짝 id ≠ zw-mbti:<주성>:<유형>");
    if (!(e.factBoundary as { requires: string[] }).requires.includes("mbtiKnown")) fail(file, id, "짝 factBoundary.requires에 mbtiKnown 없음");
  } else if (fam === "stageMap") {
    if (!(PALACES as readonly string[]).includes(e.palace as string)) fail(file, id, "같은 무대 궁 id");
  }
}

function checkYearTable(file: string, rows: { stem: string; rok: string; gwon: string; gwa: string; gi: string; confidence: string; variants: { school: string; mutagen: string; star: string }[]; note: string }[], fail: (file: string, id: string, rule: string, text?: string) => void) {
  if (rows.length !== 10 || rows.map(r => r.stem).join("") !== STEMS.join("")) fail(file, "yearTable", "연간 표는 甲~癸 10줄");
  for (const r of rows) {
    const want = MUTAGEN_TABLE[r.stem as keyof typeof MUTAGEN_TABLE];
    if ([r.rok, r.gwon, r.gwa, r.gi].join() !== want.join()) fail(file, `yearTable:${r.stem}`, "연간 표 ≠ 엔진 사화 표", `${[r.rok, r.gwon, r.gwa, r.gi].join()} / ${want.join()}`);
    const v = MUTAGEN_SCHOOL_VARIANTS[r.stem as keyof typeof MUTAGEN_SCHOOL_VARIANTS] ?? [];
    if (r.confidence !== (v.length ? "학파차이" : "통용")) fail(file, `yearTable:${r.stem}`, "연간 표 confidence(경 · 무 · 임 = 학파차이, 나머지 통용)", r.confidence);
    if (JSON.stringify(r.variants) !== JSON.stringify(v)) fail(file, `yearTable:${r.stem}`, "연간 표 학파 이설 ≠ 엔진 표", JSON.stringify(r.variants));
    for (const [name, re] of BANNED) if (re.test(r.note)) fail(file, `yearTable:${r.stem}`, `금지 꼴(${name})`, r.note);
    for (const pe of particleErrors(r.note)) fail(file, `yearTable:${r.stem}`, "이름 뒤 조사 틀림", pe);
    if (HAN.test(r.note)) fail(file, `yearTable:${r.stem}`, "한자(이름 밖)", r.note);
  }
}

/** 단계별 기대 id(2부 파일럿 · 3부 전체). */
export const PILOT_IDS: readonly string[] = [
  "zw:star:jami", "zw:star:chilsal", "zw:star:cheondong",
  "zw:palace:myeong", "zw:palace:bucheo", "zw:palace:jaebaek",
  "zw:pair:jami-chilsal", "zw:pair:cheondong-taeeum",
  ...MUTAGENS.map(m => `zw:mutagen:${m}`),
  "zw:star:jwabo", "zw:star:munchang", "zw:star:gyeongyang", "zw:star:jigong",
  "zw:deep:myeong:jami", "zw:deep:bucheo:chilsal", "zw:deep:jaebaek:jami-chilsal", "zw:deep:gwanrok:empty",
  ...["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"].map(t => `zw-mbti:jami:${t}`),
];
