/**
 * 작가 프롬프트 조립(P3 B). 접두부(시스템 지침 + 문체 예시)는 고객과 무관해 캐시 대상이고, 브리프는 사용자 메시지로 보낸다.
 * 작가에게는 내부 값(seed·budget·score·family·featureId·간지 색)을 빼고, 대운 연도·세운 월처럼 반복 장은 한 장으로 묶어 keys를 준다.
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief, ChapterBrief, Material } from "@/lib/brief/schema";
import { STYLE_EXAMPLES } from "./examples";
import { materialTable, swapDeep } from "./materials";
import { WRITER_PROMPT_VERSION, WRITER_SYSTEM } from "./system";
import { matchJob } from "@/lib/brief/props";

/** 작가 입력 옵션(P6c A1): 지식 DB가 있으면 원문 문장을 재료(씨앗·방향·핵심 뜻)로 바꿔 보낸다. 없으면(단위 시험) 브리프 그대로. */
export type WriterInputOptions = { readonly knowledge?: Knowledge };

export { WRITER_PROMPT_VERSION } from "./system";

/** 작가가 쓰는 장 하나. 반복 장은 keys(타임라인 키)와 키별 재료를 가진다. */
export type WriterChapter = {
  readonly n: number; readonly id: string; readonly title: string; readonly question: string; readonly role: string;
  readonly targetChars: readonly [number, number]; readonly subheadings: readonly [number, number]; readonly useName: boolean;
  readonly materials: readonly Material[];
  /** 절 계획(P3.8 1): 절 하나 = 소제목 하나. 있으면 작가에게는 materials 대신 이것만 간다. */
  readonly sections?: readonly { readonly q: string; readonly domain: string; readonly materials: readonly Material[] }[];
  readonly keys?: readonly string[];
  readonly perKey?: Readonly<Record<string, readonly Material[]>>;
  readonly note?: string;
  readonly sceneHint?: readonly string[];
};

export function writerChapters(brief: Pick<Brief, "chapters">): WriterChapter[] {
  const out: WriterChapter[] = [];
  const byBase = new Map<string, ChapterBrief[]>();
  for (const c of brief.chapters) {
    const base = c.id.split(":")[0];
    if (!c.id.includes(":")) { out.push({ n: out.length + 1, id: c.id, title: c.title, question: c.question, role: c.role, targetChars: c.targetChars, subheadings: c.subheadings, useName: c.useName, materials: c.materials, ...(c.sections ? { sections: c.sections } : {}), ...(c.sceneHint ? { sceneHint: c.sceneHint } : {}) }); continue; }
    if (!byBase.has(base)) {
      byBase.set(base, []);
      out.push({ n: out.length + 1, id: base, title: c.title, question: c.question, role: c.role, targetChars: c.targetChars, subheadings: c.subheadings, useName: c.useName, materials: [], keys: [], perKey: {} });
    }
    byBase.get(base)!.push(c);
  }
  return out.map(ch => {
    const group = byBase.get(ch.id);
    if (!group) return ch;
    const keys = group.map(c => c.id.slice(ch.id.length + 1));
    return { ...ch, keys, perKey: Object.fromEntries(group.map((c, i) => [keys[i], c.materials.filter(m => m.kind !== "timeline")])), note: "keys마다 ### {key} 하나, 그 아래 문단 3개와 카드 줄 3개([그림]·[해 볼 것] 또는 [돌아보기]·[살필 점]). targetChars는 key 하나의 분량(장 전체가 아니다). 간지·관계 표시·세기 숫자는 카드가 보여 주니 본문은 해석만." };
  });
}

/** 객체에서 몇 필드를 뺀 얕은 사본. */
function omit<T extends object, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> {
  const copy = { ...o };
  for (const k of keys) delete copy[k];
  return copy;
}

/** 작가 입력용 브리프: 내부 값을 빼고 장을 묶는다. */
/** 작가가 읽을 trait·팩폭: 장에 배정된 것(또는 대표 그림으로 가리켜지는 것)만(P3.8: 안 쓰는 재료는 토큰만 쓰고 반복을 부른다). */
export function writerFacing(brief: Pick<Brief, "traits" | "shadows" | "chapters">) {
  const refs = new Set(brief.chapters.flatMap(c => c.materials.flatMap(m => m.kind === "ref" ? [m.ref] : [])));
  const traits = brief.traits.filter(t => t.chapters.length || brief.traits.some(x => x.sameImageAs === t.id && x.chapters.length));
  const shadows = brief.shadows.filter(s => refs.has(`shadows.${s.id}`));
  return { traits, shadows };
}

/** 원국 요약: 일간 그림 별명·비유는 빼고 핵심 이미지는 그림 없는 뜻만(P6b B-2·B-4, 최종판2 1-1: 엔진 그림 줄을 본문에 그대로 옮겨 같은 일주 책마다 같은 그림이 나왔다). */
/** 최종 A-4: 지금 대운은 연도 구간(years: 엔진 endYear) 대신 교운 연·월 기간(period)만 준다 — 「2028년까지」처럼 연도로 끊지 않게. */
const writerDayun = (d: Brief["chart"]["currentDayun"]) => d && (d.period ? omit(d, "years") : d);
const writerChart = (c: Brief["chart"]) => ({ ...omit(c, "dayMaster", "coreImage", "currentDayun"), currentDayun: writerDayun(c.currentDayun), dayMaster: omit(c.dayMaster, "easyName", "metaphor"), coreImage: c.coreImage.meaning ?? c.coreImage.line });
/** 궁합(최종판2 1-1·1-3): 관계 이미지·인물 줄은 그림 없는 뜻으로, 성격표는 브리프 맨 앞(profiles)에 따로. */
/** 최종판3 2b: 공통 특징 규칙(두 사람 모두 가진 것은 「공통」으로만, 차이의 근거·한 사람만의 특징으로 쓰지 않는다). */
export const COMMON_RULE = "commonTraits는 두 사람이 모두 가진 것이다. '두 사람 모두'로만 쓰고, 차이의 근거나 한 사람만의 특징('○○님의 반안살')으로 쓰지 않는다";
const writerCompat = (c: NonNullable<Brief["compatibility"]>) => ({ ...omit(c, "profiles", "pairImage", "commonIds", "commonNames"), pairImage: c.pairImage.meaning ?? c.pairImage.line });
const PROFILE_RULE = "두 사람의 바뀌지 않는 성향(에너지·앞에 나서는지·다툼 때 반응·표현 방식·결정 속도)이다. 모든 장의 장면과 설명은 이 줄을 따른다. 두 사람을 묶어 말할 때(두 사람은·둘 다)는 두 사람 칸이 같을 때만 묶는다";

/**
 * 앞 장 주장(P6e 10, 최종판 1-16): 장마다 앞 장들이 소개한 특성의 "이 사람 몫"(forYou 첫 마디)과 MBTI 주기능·열등 기능을 짧은 주장으로 다음 장에 before로 넘긴다(최근 4개).
 * tension: 뒤 장 재료가 앞 장 주장과 반대로 들리는 짝 — ① 같은 행동 차원의 반대 끝, ② MBTI 열등 기능의 영역(늦게 오는 힘)을 특성이 "강하다"고 하는 경우
 * (장소담 1장 INTP 열등 "주변 마음 살피기는 가장 늦게 옴" ↔ 2장 물 많음 "불편한 사람을 가장 먼저 눈치챔").
 */
const INFERIOR_DIMS: Readonly<Record<string, readonly [string, number][]>> = {
  Fe: [["empathyResponse", 1], ["caretaking", 1], ["directness", -1]], Fi: [["introspection", 1], ["emotionalExpression", -1]], Te: [["planning", 1], ["decisionSpeed", 1], ["controlNeed", 1]], Ti: [["inquiry", 1], ["perfectionism", 1]],
  Se: [["riskTaking", 1], ["mobility", 1]], Si: [["detailFocus", 1], ["ruleAdherence", 1]], Ne: [["noveltySeeking", 1], ["learningDrive", 1]], Ni: [["detailFocus", -1], ["persistence", 1]],
};
export function chapterClaims(brief: Brief, k: Knowledge): Map<number, { before: string[]; tension: string[] }> {
  const chapters = writerChapters(brief);
  const say = (d: string, v: number) => { const o = k.ontology.dimensions.find(x => x.id === d); return o ? (v > 0 ? o.poles.plus : o.poles.minus).description.replace(/\s*편입니다\.?$/, " 편").replace(/입니다\.?$/, "") : d; };
  const prof = brief.mbti ? k.mbti.get(brief.mbti.type) : undefined;
  const inferior = prof?.cognitiveFunctions.find(f => f.role.includes("열등"));
  const infText = inferior ? (inferior.easy.split(/(?<=[.!?])\s/)[0] ?? inferior.easy).replace(/[.!?]$/, "") : "";
  type Claim = { n: number; text: string; dims: [string, number][]; inferior?: boolean };
  const seen: Claim[] = [];
  const res = new Map<number, { before: string[]; tension: string[] }>();
  for (const c of chapters) {
    const mats = [...c.materials, ...(c.sections ?? []).flatMap(x => x.materials)];
    const mine: Claim[] = [];
    for (const m of mats) {
      if (m.kind === "trait" && m.angle === "first") {
        const t = brief.traits.find(x => x.id === m.traitId), f = t ? k.features.get(t.featureId) : undefined;
        if (t && f) { const top = Object.entries(f.dimensionTags).filter(([, v]) => Math.abs(v) >= 0.6).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 2) as [string, number][];
          mine.push({ n: c.n, text: `${t.name.replace(/\(.*?\)/g, "").trim()}${top[0] ? `(${say(top[0][0], top[0][1])})` : ""}`, dims: top }); }
      }
      if ((m.kind === "mbti" || (m.kind === "ref" && m.ref.startsWith("mbti"))) && prof && inferior && !seen.concat(mine).some(x => x.inferior))
        mine.push({ n: c.n, text: `${prof.type} 열등 기능(${infText})`, dims: (INFERIOR_DIMS[inferior.code] ?? []).map(([d, sgn]) => [d, -sgn * 0.8] as [string, number]), inferior: true });
    }
    const before = [...new Set(seen.slice(-4).map(x => `${x.n}장 ${x.text}`))];
    const tension: string[] = [];
    for (const m of mine) for (const x of seen) {
      // 열등 기능 영역과 특성이 부딪치거나(① ↔ 특성), 강한 행동 차원(0.7 이상)이 서로 반대 끝일 때만.
      const hit = m.dims.find(([d, v]) => x.dims.some(([d2, v2]) => d2 === d && Math.sign(v2) !== Math.sign(v) && (x.inferior || m.inferior || (Math.abs(v) >= 0.7 && Math.abs(v2) >= 0.7))));
      if (hit && tension.length < 2) tension.push(`${x.n}장 "${x.text}" ↔ 이 장 "${m.text}" — 반대로 들리니 조건(겉과 속·상황·상대)을 밝혀 잇는다`);
    }
    if (before.length || tension.length) res.set(c.n, { before, ...{ tension: [...new Set(tension)] } });
    for (const m of mine) if (!seen.some(x => x.text === m.text)) seen.push(m);
  }
  return res;
}

/** 한자 읽기(괄호 밖 천간·지지·오행 한자를 한글로). */
const READING: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해", 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };
const noHanja = (t: string) => t.replace(/\s?\(([^()]*[一-鿿][^()]*)\)/g, (_a, inner: string) => { const kept = inner.replace(/[一-鿿]+\s?/g, "").replace(/^[\s·,]+|[\s·,]+$/g, ""); return kept ? `(${kept})` : ""; })
  .replace(/[一-鿿]+/g, m => [...m].map(ch => READING[ch] ?? "").join("")).replace(/ {2,}/g, " ");
/**
 * 작가에게 보이는 글(P6e 1·7, 최종판 1-1·1-6): 한자는 빼고(렌더 단계가 붙인다), 재료의 note는 "rule"(작가에게 주는 쓰기 규칙)로 이름을 바꾼다.
 * note라는 이름이 독자에게 하는 안내처럼 읽혀 "입력하지 않은 경력과 연차는 쓰지 마세요"로 본문에 옮겨졌다.
 */
/** 최종판3 3: 지식 DB 이름에 붙은 분류 라벨(「망신살(亡身殺)·십이신살」)은 작가에게 보내지 않는다(본문 「망신살·십이신살」 노출 원인). */
const noLabel = (t: string) => t.replace(/·십이신살/g, "");
function writerFacingText(x: unknown): unknown {
  if (typeof x === "string") return noLabel(noHanja(x));
  if (Array.isArray(x)) return x.map(writerFacingText);
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).filter(([k]) => k !== "hanja").map(([k, v]) => [k === "note" ? "rule" : k, writerFacingText(v)]));
  return x;
}

export function renderWriterBrief(brief: Brief, opts: WriterInputOptions = {}): Record<string, unknown> {
  return writerFacingText(renderWriterBriefRaw(brief, opts)) as Record<string, unknown>;
}
function renderWriterBriefRaw(brief: Brief, opts: WriterInputOptions = {}): Record<string, unknown> {
  const out = renderRaw(brief);
  if (!opts.knowledge) return out;
  // 최종판 1-16: 장마다 앞 장 주장·반대로 들리는 짝(P6e chapterClaims).
  const claims = chapterClaims(brief, opts.knowledge);
  out.chapters = (out.chapters as { n: number }[]).map(c => { const x = claims.get(c.n); return x ? { ...c, ...(x.before.length ? { before: x.before } : {}), ...(x.tension.length ? { tension: x.tension } : {}) } : c; });
  // 지식 DB 원문을 재료로(P6c A1). MBTI 기능은 쉬운 이름을 먼저(P6c C5): "일 되게 하는 판단(Te) · 주기능: 방향".
  const table = materialTable(opts.knowledge);
  const swapped = swapDeep(out, table);
  const fn = (b: Brief["mbti"]) => { const p = b && opts.knowledge!.mbti.get(b.type); return p && p.cognitiveFunctions.every(c => table.plain.has(c.easy)) ? p.cognitiveFunctions.map(c => `${table.plain.get(c.easy)}(${c.code}) · ${c.role}: ${table.exact.get(c.easy)}`) : null; };
  const withFn = (m: unknown, b: Brief["mbti"]) => { const f = fn(b); return m && f ? { ...(m as object), functions: f } : m; };
  assignActions(swapped, brief);
  return ownGlyphsOnly({ ...swapped, mbti: withFn(swapped.mbti, brief.mbti), ...(brief.partner && swapped.partner ? { partner: { ...(swapped.partner as object), mbti: withFn((swapped.partner as { mbti: unknown }).mbti, brief.partner.mbti) } } : {}) }, brief);
}

/**
 * 최종판2 1-4: 재료 글(지식 DB 원문·압축 재료)이 나열한 글자("갑·신·묘·오 글자 셋 이상 겹침")는 그 사람 명식에 있는 글자만 남긴다(장덕민 명식에 午 없음).
 * 궁합은 특성 주인(owner)·팩폭의 특성으로 사람을 정하고, 정할 수 없으면 두 사람 글자 모두.
 */
const GLYPH_LIST = /([갑을병정무기경신임계자축인묘진사오미유술해](?:·[갑을병정무기경신임계자축인묘진사오미유술해]){1,7})(?= ?(글자|자리))/g;
function ownGlyphsOnly(out: Record<string, unknown>, brief: Brief): Record<string, unknown> {
  const set = (ch: Brief["chart"] | undefined) => new Set(ch ? Object.values(ch.pillars).flatMap(p => (p ? [...p.hangul] : [])) : []);
  const ga = set(brief.chart), gb = set(brief.partner?.chart), both = new Set([...ga, ...gb]);
  const c = brief.compatibility;
  const fix = (x: unknown, g: ReadonlySet<string>): unknown => typeof x === "string" ? x.replace(GLYPH_LIST, m => { const kept = [...new Set(m.split("·").filter(y => g.has(y)))]; return kept.length ? kept.join("·") : m; })
    : Array.isArray(x) ? x.map(y => fix(y, g)) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k2, v]) => [k2, fix(v, g)])) : x;
  const ofTrait = (id: string | undefined) => !c ? ga : id?.startsWith("a") ? ga : id?.startsWith("b") ? gb : both;
  const res: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(out)) {
    if (key === "traits" && Array.isArray(v)) res[key] = v.map(t => fix(t, ofTrait((t as { id?: string }).id)));
    else if (key === "shadows" && Array.isArray(v)) res[key] = v.map(s => fix(s, ofTrait((s as { traitId?: string }).traitId)));
    else res[key] = fix(v, c ? both : ga);
  }
  return res;
}

/**
 * 최종판3 2a: 처방 슬롯. 절마다 행동 조언 하나(act)를 그 절 재료의 「… → 행동」 줄에서 고른다. 같은 처방 계열(하루 두기·한 줄 적기·월 한도 등)은 책에 한 번,
 * 이전 책(원장 avoidActions) 계열도 쓰지 않는다. 이미 배정된 계열의 행동 꼬리는 다른 절 재료에서 뗀다(덜 만들기).
 * 실제 결함(최종판2): 「서운함은 그날 한 줄」 4권 모두, 「하루 두고 답하기」 커리어 4번.
 */
export const ACTION_FAMILIES: readonly [RegExp, string][] = [
  [/하루(만)? (두|묵|시간|미루|기다|지나)|하룻밤|24시간/, "하루 두기"], [/한 ?줄(로|만|씩)? ?(말|적|쓰|전|남기|정리)|한 문장으로/, "한 줄 말하기"], [/한도|상한/, "지출 한도"], [/견적|비교해 보|두 곳 이상/, "견적 비교"],
  [/물어보|묻(는|기)|질문(을|하나)/, "먼저 묻기"], [/적어 두|기록|메모|노트|일기/, "적어 두기"], [/산책|걷기|걸어/, "걷기"], [/알람|타이머|마감 시각/, "시간 정하기"], [/통장|자동이체|적금/, "통장 나누기"],
  [/쉬는 날|휴식|비워 두|충전/, "쉬는 시간"], [/거절|안 된다고/, "거절 연습"], [/고맙|감사/, "고마움 말하기"], [/목록|리스트|체크/, "목록 만들기"],
];
export const actionFamily = (s: string): string => ACTION_FAMILIES.find(([re]) => re.test(s))?.[1] ?? s.replace(/[^가-힣]/g, "").slice(0, 8);
/** 영역별 처방 종류(절 영역에 맞는 것부터). 같은 종류는 책에 한 번, 같은 사람 이전 책이 쓴 종류도 뺀다. */
const ACTIONS_BY_DOMAIN: Readonly<Record<string, readonly string[]>> = {
  work: ["시간 정하기", "목록 만들기", "적어 두기", "먼저 묻기", "하루 두기", "쉬는 시간"], money: ["지출 한도", "통장 나누기", "견적 비교", "목록 만들기", "하루 두기"],
  study: ["시간 정하기", "적어 두기", "목록 만들기", "먼저 묻기"], love: ["고마움 말하기", "먼저 묻기", "한 줄 말하기", "쉬는 시간", "걷기"],
  marriage: ["목록 만들기", "고마움 말하기", "먼저 묻기", "지출 한도", "시간 정하기"], relationships: ["먼저 묻기", "고마움 말하기", "거절 연습", "한 줄 말하기", "시간 정하기"],
  alone: ["쉬는 시간", "걷기", "적어 두기", "시간 정하기"],
};
function assignActions(out: Record<string, unknown>, brief: Brief): void {
  const used = new Set<string>((brief.ledgerNotes?.avoidActions ?? []).map(actionFamily));
  const plan = writerChapters(brief);
  const chapters = out.chapters as { sections?: { q: string; materials: unknown[]; act?: string }[] }[] | undefined;
  // 장마다 하나: 그 장의 마지막 절에 이 책·이전 책에서 안 쓴 종류를 준다(장 영역에 맞는 것부터).
  (chapters ?? []).forEach((c, ci) => {
    const ss = c.sections ?? []; if (!ss.length) return;
    const si = ss.length - 1, domain = plan[ci]?.sections?.[si]?.domain ?? "alone";
    const pick = (ACTIONS_BY_DOMAIN[domain] ?? ACTIONS_BY_DOMAIN.alone).find(f => !used.has(f)) ?? Object.values(ACTIONS_BY_DOMAIN).flat().find(f => !used.has(f));
    // 최종판3 12: 종류 이름을 그대로 쓴 「처방은 지출 한도입니다.」가 나왔다(판독) — 이름은 작가용 표시일 뿐 글에 쓰지 않는다고 함께 적는다.
    if (pick) { ss[si].act = `행동 조언 하나(${pick} 쪽) — 이 장의 행동 조언은 이 절에만. 「${pick}」·「처방」 같은 종류 이름은 글에 쓰지 않고 행동 자체를 쓴다`; used.add(pick); }
  });
}

/** 최종판3 2: 상품·입력별 책 규칙(작가에게 보이는 규칙 줄). 문체 지침은 그대로 두고 사실·구조 규칙만 더한다. */
export function bookRules(brief: Brief): string[] {
  const p = brief.product, rel = brief.person.facts.relationship, year = brief.chart.thisYear;
  const rules = ["처방(행동 조언)은 장마다 하나, act가 있는 절에 그 종류로만 쓴다(장마다 종류가 다르다). act가 없는 절은 새 처방을 만들지 않고 장면·이해로 마무리한다. avoidActions(같은 사람 이전 책 처방)와 같은 행동은 되풀이하지 않는다"];
  if (p === "saju_mbti_full") rules.push(
    "[표지]와 1장에는 직업 장면·직업 말(직함·업무·회사·가게)을 쓰지 않는다. 성향 장은 장마다 직업 장면 1개 이하, 일·돈 장만 예외",
    "입력에 없는 직업 상황(투자자·투자 유치·직원·팀원·면접·평가 시즌·실적표·'처음 만든 ~')은 쓰지 않는다",
    `본문에 연·월 숫자를 쓰지 않는다. 운 설명은 '올해(${year.ganji.hangul})'를 한 번만, 행동 제안은 '앞으로 한 달'로`,
    "[표지]에는 직업·나이를 쓰지 않는다");
  if (p === "love_marriage_child") rules.push("[표지]에 직업 장소(가게·카페·사무실·작업실 등)를 쓰지 않는다");
  if (p === "love_marriage_child" || p === "saju_mbti_compatibility") {
    if (rel === "dating" || rel === "married") rules.push("지금 만나는 사이다. 처음 만남을 검증하는 질문·'초반부터' 위험 신호 장면은 쓰지 않고, 지금 관계를 점검하는 말로 쓴다");
    if (rel === "single") rules.push("솔로다. 지금 만나는 상대가 있다고 가정하지 않는다");
  }
  if (brief.ledgerNotes?.avoidCoverMotifs?.length) rules.push(`[표지]에 avoidCoverMotifs(같은 사람 이전 책 표지 모티프: ${brief.ledgerNotes.avoidCoverMotifs.join("·")})를 쓰지 않는다`);
  return rules;
}

/** 최종판3 2c: 입력에 없는 직업 상황을 전제하는 소품·업무 씨앗(투자자·투자 유치·팀원·직원·채용·실적·평가). 입력 직업 글에 그 낱말이 있을 때만 쓴다. */
export const JOB_ASSUME = /투자|팀원|팀 (회의|미팅)|주간 팀|직원|채용|면담|평가 시즌|실적|사업자 통장/;
function jobFilter(brief: Brief): { hint: (h: string, chapterId: string) => boolean; scene: (s: string) => boolean } {
  const detail = brief.person.facts.job.detail, job = matchJob(detail);
  const jobWords = new Set([...(job?.props ?? []), ...Object.values(job?.stages ?? {}).flat()]);
  const assumed = (s: string) => { const m = s.match(JOB_ASSUME); return Boolean(m) && !detail.includes(m![0]); };
  const full = brief.product === "saju_mbti_full";
  return { scene: s => !assumed(s), hint: (h, id) => !assumed(h) && !(full && !/^(work|money)$/.test(id) && jobWords.has(h)) };
}

function renderRaw(brief: Brief): Record<string, unknown> {
  const { style, timeline, fortunes } = brief;
  const jf = jobFilter(brief);
  const { traits, shadows } = writerFacing(brief);
  return {
    // 최종판2 1-3: 궁합은 사람별 고정 성격표를 브리프 맨 앞에 한 줄씩.
    ...(brief.compatibility?.profiles?.length ? { profiles: { rule: PROFILE_RULE, people: brief.compatibility.profiles.map(p => p.line) } } : {}),
    ...omit(brief, "version", "seed", "budget", "chapters", "style", "traits", "shadows", "timeline", "fortunes", "usedProps", "plan", "chart", "mbti", "unused", "partner", "appendix", "glossary", "ledgerView", "ledgerNotes"),
    ...(brief.compatibility ? { compatibility: writerCompat(brief.compatibility) } : {}),
    ...(brief.compatibility?.commonIds?.length ? { commonTraits: { rule: COMMON_RULE, items: brief.compatibility.commonNames ?? [] } } : {}),
    chart: writerChart(brief.chart),
    mbti: brief.mbti ? omit(brief.mbti, "image") : null,
    // 그림 별명·이미지·한 줄은 내부 별칭(P6b B-2): 작가는 이름(한자)·뜻(meaning)·나에게(forYou)만 받는다.
    unused: brief.unused.map(u => omit(u, "easyName", "oneLiner")),
    ...(brief.partner ? { partner: { ...brief.partner, chart: writerChart(brief.partner.chart), mbti: brief.partner.mbti ? omit(brief.partner.mbti, "image") : null } } : {}),
    // 좋은 기운이 trait와 같으면 뜻·나에게는 trait 쪽에만 둔다.
    fortunes: fortunes.map(f => f.traitId ? omit(f, "featureId", "easyName", "image", "oneLiner", "meaning", "forYou") : omit(f, "featureId", "easyName", "image", "oneLiner")),
    // 최종판 1-5(P6e 3): 궁합은 특성마다 주인(그 기운을 가진 사람 이름)을 붙인다.
    traits: traits.map(t => ({ ...omit(t, "score", "family", "featureId", "chapters", "image", "easyName", "oneLiner", "sameImageAs"), ...(brief.compatibility && /^[ab]/.test(t.id) ? { owner: brief.compatibility.commonIds?.includes(t.featureId) ? "두 사람 모두(공통)" : t.id.startsWith("a") ? brief.compatibility.a.callName : brief.compatibility.b.callName } : {}) })),
    shadows,
    // 카드 전용 필드(그림 줄·기간·할 일·돌아보기)는 material·when·action과 같은 값이라 보내지 않는다.
    // "badges"라는 키 이름이 본문 낱말 "배지"로 새어 나갔다(P6b E-6): 작가에게는 marks로 준다.
    ...(timeline ? { timeline: { ...timeline, entries: timeline.entries.map(e => ({ ...omit(e, "colors", "ganji", "imageLine", "period", "todo", "review", "badges", "head", "caution"), marks: e.badges })) } } : {}),
    // style.rules는 시스템 지침과 같은 내용이라 보내지 않는다(P3.8 토큰).
    style: { register: style.register, readingLevel: style.readingLevel, totalChars: style.totalChars, forbidden: style.forbidden },
    bookRules: bookRules(brief),
    ...(brief.ledgerNotes?.avoidActions?.length ? { avoidActions: brief.ledgerNotes.avoidActions } : {}),
    // 절이 있는 장은 절(질문·재료)만 보낸다(장 재료 전체는 절 재료의 사본이라 두 번 보내면 같은 재료를 두 번 쓴다).
    chapters: writerChapters(brief).map(c => ({ ...(c.sections ? { ...omit(c, "materials", "sections"), sections: c.sections.map(x => ({ q: x.q, materials: x.materials })) } : c), targetChars: shownTarget(c.targetChars),
      ...(c.sceneHint ? { sceneHint: c.sceneHint.filter(h => jf.hint(h, c.id)) } : {}) })),
    // 최종판3 2c: 종합은 업무 씨앗을 주지 않는다(직업 장면은 일·돈 장의 장면 힌트로만). 다른 상품은 입력 밖 가정 씨앗만 뺀다.
    person: brief.product === "saju_mbti_full" ? omit(brief.person, "workScenes") : brief.person.workScenes ? { ...brief.person, workScenes: Object.fromEntries(Object.entries(brief.person.workScenes).map(([k2, v]) => [k2, v.filter(jf.scene)])) } : brief.person,
  };
}

/**
 * 작가에게 보이는 분량 보정(P6b C-4): Sonnet 5.5·terra 모두 브리프 targetChars의 70~82%만 쓴다(P6a 12권, P6b 1회차 실측).
 * 작가가 보는 목표만 1.25배로 보여 결과가 상품 목표(종합 13~16천 등)에 닿게 한다. 교체 판정(60%)·지표는 원래 목표를 쓴다.
 */
export const WRITER_TARGET_FACTOR = 1.25;
const shownTarget = (t: readonly [number, number]) => [Math.round(t[0] * WRITER_TARGET_FACTOR), Math.round(t[1] * WRITER_TARGET_FACTOR)] as const;

/** 캐시 접두부: 시스템 지침 + 문체 예시. 고객 정보가 없어 모든 호출이 공유한다. */
export const WRITER_PREFIX = `${WRITER_SYSTEM}\n\n# 문체 예시 (사실·문장을 가져오지 말 것)\n${STYLE_EXAMPLES.map(e => `## ${e.label}\n\`\`\`markdown\n${e.text}\n\`\`\``).join("\n\n")}`;

export type WriterPrompt = { readonly system: string; readonly user: string; readonly version: string; readonly chapters: readonly WriterChapter[] };

export function buildWriterPrompt(brief: Brief, opts: WriterInputOptions = {}): WriterPrompt {
  const chapters = writerChapters(brief);
  const list = chapters.map(c => `## ${c.n}. ${c.title}${c.keys ? ` (### ${c.keys.join(" / ### ")})` : ""}`).join("\n");
  const user = `브리프:\n\`\`\`json\n${JSON.stringify(renderWriterBrief(brief, opts))}\n\`\`\`\n\n위 브리프로 책 「${brief.productTitle}」 전체 ${chapters.length}장을 처음부터 끝까지 한 번에 쓰세요. 맨 앞에 [표지] 한 줄, 이어서 장 머리글은 아래 그대로입니다.\n${list}`;
  return { system: WRITER_PREFIX, user, version: WRITER_PROMPT_VERSION, chapters };
}

/** 이어쓰기(SPEC §4-2): 브리프 + 이미 쓴 장의 요약 + 남은 장 목록. 총 생성량은 책 1권 이내. */
export function buildContinuationPrompt(brief: Brief, written: readonly { n: number; title: string; summary: string }[], remaining: readonly WriterChapter[], opts: WriterInputOptions = {}): WriterPrompt {
  const base = buildWriterPrompt(brief, opts);
  const done = written.map(w => `- ${w.n}. ${w.title}: ${w.summary}`).join("\n");
  const list = remaining.map(c => `## ${c.n}. ${c.title}${c.keys ? ` (### ${c.keys.join(" / ### ")})` : ""}`).join("\n");
  const user = `${base.user.split("\n\n위 브리프로")[0]}\n\n이미 쓴 장(다시 쓰지 말 것, 같은 비유·장면·MBTI 연결을 되풀이하지 말 것):\n${done || "- 없음"}\n\n남은 장만 이어서 쓰세요. 장 머리글은 아래 그대로입니다.\n${list}`;
  return { ...base, user, chapters: remaining };
}
