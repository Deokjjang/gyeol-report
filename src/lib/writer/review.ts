/**
 * 의미 검수(최종판3 4): 작가 원고 + 결정론 검사 뒤에 한 번만 부른다(반복 없음). 출력은 7범주 고정 JSON.
 * 안전장치(검수가 고장 나도 지금보다 나빠지지 않게):
 *  - 인용이 그 문장에 글자 그대로 없으면 버린다 · 범주가 스키마 밖이면 버린다 · F(근거 id)·C(두 문장)·I(입력 칸)·R(두 문장) 필수 근거가 없으면 버린다.
 *  - A의 수정 문장은 원문에 없던 명리 용어·숫자를 넣지 않았을 때만 그대로 바꾼다(호출 없음). 나머지는 수리(작가 모델 1회)로 보낸다.
 *  - 호출 실패·형식 오류·예산 초과면 검수만 건너뛴다(발행은 막지 않는다).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { Brief } from "@/lib/brief/schema";
import type { FactSheet, PersonFacts } from "@/lib/factsheet/build";
import { shinsalAliases } from "@/lib/factsheet/aliases";
import { fixedTimeOf, hasYearName } from "@/lib/factsheet/check";
import { yinYangLean } from "./safety/lint";
import type { FinalChapter } from "./safety";
import { splitSentences } from "./safety/patterns";

/** review-v2: Haiku 생각 끔(v1은 생각이 출력 상한을 다 써 글자 0). 판 번호는 입력 머리에 들어가 원문 키가 바뀐다. */
/** review-v4 지침(측정 채택본, Haiku 5.5). v5(모순 유형 예시 추가)는 Haiku 재현율이 낮아(77.1%) 되돌렸다. */
export const REVIEW_VERSION = "review-v4" as const;
export const REVIEW_CATS = ["F", "C", "I", "R", "L", "T", "A"] as const;
export type ReviewCat = (typeof REVIEW_CATS)[number];
/** 검수 모델 출력 상한(토큰, 고정). 지적 40개 × 약 90토큰 + 생각 몫. */
export const REVIEW_MAX_TOKENS = 6000;
/**
 * 모델별 출력 상한. Haiku 5.5는 생각이 adaptive 전용이라 예산(budget_tokens)을 고정할 수 없다(400). effort low로 생각을 줄이고,
 * 상한은 "생각 최대 실측 × 2 + 지적 JSON 최대"로 둔다: 실측(최종판3 측정 35회) 출력 최대 11,173토큰 · 생각만 약 8.3천 · 지적 1개 약 145토큰
 * → 9.5천 × 2 + 40개 × 145 × 1.5(상한 넘겨 쓰는 경우) ≈ 2.8만 → 32,000. 쓰지 않은 상한은 과금되지 않는다(최악 비용 +$0.008).
 */
export const HAIKU_REVIEW_MAX_TOKENS = 32_000;
export const reviewMaxTokens = (model: string) => (model === "claude-haiku-5-5" ? HAIKU_REVIEW_MAX_TOKENS : REVIEW_MAX_TOKENS);
/** 지적 상한(수리 비용 상한을 구조로 묶는다). */
export const REVIEW_MAX_ISSUES = 40;
/** 검수 입력 상한(글자). 넘으면 검수를 건너뛴다(책 본문은 자르지 않는다). */
export const REVIEW_MAX_INPUT_CHARS = 60_000;

/** 문장 번호(0 = 표지, 9001~ = 이전 책 요약 줄). paragraph -1 = 소제목. */
export type Numbered = { readonly n: number; readonly chapter: number; readonly section: number; readonly paragraph: number; readonly text: string };
export type ReviewIssue = { readonly cat: ReviewCat; readonly s: number; readonly quote: string; readonly why: string; readonly ref: string; readonly s2: number; readonly field: string; readonly fix: string };
export type GuardedReview = { readonly kept: readonly ReviewIssue[]; readonly direct: readonly ReviewIssue[]; readonly dropped: readonly { readonly issue: unknown; readonly reason: string }[] };

export const REVIEW_SCHEMA = {
  type: "object", additionalProperties: false, required: ["issues"],
  properties: { issues: { type: "array", items: { type: "object", additionalProperties: false, required: ["cat", "s", "quote", "why", "ref", "s2", "field", "fix"],
    properties: { cat: { type: "string", enum: [...REVIEW_CATS] }, s: { type: "integer" }, quote: { type: "string" }, why: { type: "string" }, ref: { type: "string" }, s2: { type: "integer" }, field: { type: "string" }, fix: { type: "string" } } } } },
} as const;

export const REVIEW_SYSTEM = `너는 결리포트(사주×MBTI 리포트) 원고의 검수자다. 번호 붙은 책을 읽고 아래 7범주의 문제만 찾아 JSON으로 답한다. 문체 취향·더 좋은 표현 제안은 하지 않는다.

범주(이 밖은 쓰지 않는다):
- F 사실·뜻 불일치: 정답지(fs:…)나 DB 뜻풀이(db:…)와 어긋나는 명리·MBTI 주장. 신살·귀인의 자리·주인, 강약, 오행 개수와 세기, 관계(합·충·형), 간지·연도, 오행 뜻을 이 사람 일간 기준과 다른 십성으로 푼 것, 다른 MBTI 유형의 특성을 이 유형 것처럼 쓴 것, 정답지·DB 어디에도 근거가 없는 명리 단정. ref에 근거 항목 id(아래 목록의 fs:… 또는 db:…) 필수.
- C 같은 사람 모순: 같은 사람에 대해 둘 다 참일 수 없는 두 문장(이 책 안, 또는 이전 책 요약 줄 p번호). s = 이 책의 뒤쪽 문장, s2 = 다른 문장 번호 필수.
- I 입력 밖 상황 단정: 입력에 없는 직업 상황·사람(직원·투자자·팀원)·돈 사정·연애 사정·가족 구성원·과거 사건을 사실처럼 단정. 가정형("~라면")·질문형은 제외. field에 넘어선 입력 칸(input.job·input.relationship·input.children·input.relationType·input.money·input.family) 필수.
- R 다른 장의 같은 뜻 반복: 다른 장에서 같은 장면·같은 처방·같은 비유·같은 성향 설명을 되풀이. s = 뒤쪽 문장, s2 = 앞쪽 문장 필수. 같은 소제목 안 흐름은 반복이 아니다.
- L 내부 라벨·면책·생성 규칙 노출: 분류 라벨(「·십이신살」), "시기는 말하지 않아요" 같은 면책, "가정 아래에서만"·"~가 계시다면" 같은 작성 규칙이 독자에게 보임.
- T 시점 표현 위반: 종합 책 본문의 달·연도 숫자만 고정(행동 제안은 "앞으로 한 달"). 운 설명의 해 이름 "2026년 병오년"·"2027년 정미년"(연도 + 간지)은 맞는 꼴이라 T가 아니다. 기준일과 맞지 않는 시점 말.
- A 명백한 비문·조사·단어 오용(예: 뜻을 잘못 쓴 낱말, 받침과 안 맞는 조사). fix에 고친 문장 전체 필수(원문에 없던 명리 용어·숫자를 넣지 않는다).

규칙:
- quote는 그 번호 문장에서 글자 그대로 옮긴 짧은 부분(10~40자). 바꾸거나 요약하지 않는다.
- 기계 검사가 이미 잡은 문장 번호(machineFlagged)는 보고하지 않는다.
- 확실한 것만. 애매하면 보고하지 않는다. 같은 문장은 한 번만. 최대 ${REVIEW_MAX_ISSUES}개.
- 정답지와 맞는 문장, 문제가 아닌 문장은 절대 출력하지 않는다. why에 "맞다·문제 아님·보류·해당 없음"을 쓸 문장이면 그 항목을 빼라.
- 놓치기 쉬운 것: 입력에 없는 돈 사정("잔고가 빠듯한")·지인 방문·상대를 통제하는 행동 묘사(I), 다른 장의 같은 처방·같은 장면(R), 뜻을 잘못 쓴 낱말("짠하다"를 '짜다'로)(A), 이전 책 요약 줄과 반대되는 성향(C).
- 정답지와 맞는 문장은 문제 삼지 않는다. 장점·재미를 위한 과장 없는 해석은 문제가 아니다.
- 쓰지 않는 칸은 빈 문자열(ref·field·fix), s2는 0.
- 출력: {"issues":[{"cat","s","quote","why","ref","s2","field","fix"}]}만.`;

/** 책을 문장 단위로 번호 매긴다(표지 0, 소제목·문단 문장 1부터). */
export function numberBook(chapters: readonly FinalChapter[], cover: string): Numbered[] {
  const out: Numbered[] = [];
  if (cover) out.push({ n: 0, chapter: 0, section: 0, paragraph: -1, text: cover });
  let n = 1;
  for (const c of chapters) {
    if (c.source === "deterministic") continue;
    c.sections.forEach((s, si) => {
      if (s.heading && !/^\d{4}(-M\d{2})?$/.test(s.heading)) out.push({ n: n++, chapter: c.n, section: si, paragraph: -1, text: s.heading });
      s.paragraphs.forEach((p, pi) => { for (const sen of splitSentences(p.replace(/[⟪⟫]/g, ""))) out.push({ n: n++, chapter: c.n, section: si, paragraph: pi, text: sen }); });
    });
  }
  return out;
}

const firstSentences = (t: string, n = 2, max = 220) => splitSentences(t).slice(0, n).join(" ").slice(0, max);
/** 정답지에서 이 책에 나온 용어만 추린 것 + 늘 필요한 닻(기둥·강약·묶음·오행·올해·대운). */
function sheetSubset(sheet: FactSheet, text: string, k: Pick<Knowledge, "features">): Record<string, unknown> {
  const aliases = shinsalAliases(k);
  const used = new Set(aliases.filter(a => a.re.test(text)).map(a => a.name));
  const year = Number(sheet.baseDate.slice(0, 4));
  const person = (p: PersonFacts) => ({
    name: p.name, pillars: Object.fromEntries(Object.entries(p.pillars).map(([pos, v]) => [pos, v ? `${v.stem}${v.branch}(${v.ganjiKo})` : "시간 미상"])),
    dayMaster: `${p.dayMaster.stem}(${p.dayMaster.ko})`, tenGods: p.tenGods, strength: p.strength.labelKo,
    groups: Object.fromEntries(Object.values(p.groups).map(g => [g.name, `${g.level}(${g.element})`])),
    elements: Object.fromEntries(Object.keys(p.elements.count).map(e => [e, `겉 글자 ${p.elements.count[e as never]}개·세기 ${p.elements.status[e as never]}${p.elements.strongest === e ? "(가장 셈)" : ""}`])),
    // AM 판독(대운): 「2:4」를 거꾸로 읽고, 대운수(시작 나이 수)를 대운 개수로 읽고, 공망을 늘 戌·亥로 짚었다 → 이름을 붙여 준다.
    yinYang: `음 ${p.yinYang.yin} · 양 ${p.yinYang.yang}`,
    gongmang: p.gongmang.map(g => `${g.basis} 기준 ${g.branches.join("·")}`), gongmangYears: p.annual.filter(a => a.gongmang).map(a => `${a.year} ${a.ganjiKo}`),
    shinsal: p.shinsal.filter(s => used.has(s.name)).map(s => `${s.name}: ${s.slots.join("·")} (${s.glyphs.join("·")})`),
    twelveStages: p.twelveStages.map(t => `${t.position} ${t.branch} ${t.ko}`),
    relations: p.relations.map(r => `${r.key} ${r.kind}${r.completeness !== "full" ? `(${r.completeness})` : ""} ${r.members.map(m => m.where).join("-")}`),
    thisYear: p.annual.filter(a => a.year === year).map(a => `${a.year} ${a.ganjiKo}: 천간 ${a.stemTenGod}·지지 ${a.branchTenGod}, 원국과 ${a.relations.map(r => `${r.key} ${r.kind}`).join("·") || "관계 없음"}`)[0],
    dayun: p.dayun.cycles.filter(c => c.endYear >= year - 10 && c.startYear <= year + 20).map(c => `${c.ganjiKo} ${c.startYear}~${c.endYear}(만 ${c.manStartAge}세~, ${c.stemTenGod})`), dayunStartNumber: p.dayun.number === null ? null : `대운수 ${p.dayun.number}(첫 대운이 시작하는 나이 수 — 개수가 아니다)`, dayunCount: `평생 대운 ${p.dayun.cycles.length}개`,
    mbti: p.mbti, input: p.input,
  });
  return { "fs:standards": sheet.standards, "fs:people": sheet.people.map(person), ...(sheet.pair ? { "fs:pair.common": sheet.pair.common, "fs:pair.relations": sheet.pair.relations.map(r => `${r.key} ${r.kind} ${r.members.map(m => m.where).join("-")}`), "fs:pair.score": sheet.pair.score } : {}) };
}

/** 이 책에 나온 용어의 DB 뜻풀이(db:<id>) + 사람마다 MBTI DB(db:mbti:<유형>). */
function dbSubset(text: string, k: Knowledge, mbtiTypes: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of k.features.values()) {
    if (!/^(shinsal|gwiin|twelveStage|tenGod|relation|stem|dayMaster|element|tenGodBalance|structure)$/.test(f.family)) continue;
    const ko = f.name.replace(/\(.*$/, "");
    if (ko.length < 2 || !text.includes(ko)) continue;
    out[`db:${f.id}`] = `${f.name}: ${firstSentences(f.meaning ?? "")}`;
    if (Object.keys(out).length >= 40) break;
  }
  for (const t of mbtiTypes) {
    const m = k.mbti.get(t as never); if (!m) continue;
    const sig = Object.entries(m.signals as Record<string, unknown>).map(([d, v]) => `${d}: ${(Array.isArray(v) ? v : []).map(x => typeof x === "string" ? x : (x as { text?: string; scene?: string }).text ?? (x as { scene?: string }).scene ?? "").filter(Boolean).slice(0, 2).join(" / ")}`).join(" | ");
    out[`db:mbti:${t}`] = `${t} ${m.easyName}. 기능: ${m.cognitiveFunctions.map(f => `${f.role} ${f.code}(${firstSentences(f.easy, 1, 60)})`).join(", ")}. 행동: ${sig.slice(0, 900)}`;
  }
  return out;
}

export type PriorSummary = { readonly lines: readonly string[] };
export function reviewPrompt(a: { brief: Brief; sheet: FactSheet; k: Knowledge; chapters: readonly FinalChapter[]; cover: string; prior?: PriorSummary | null; machineFlagged?: readonly number[] }): { system: string; user: string; numbered: Numbered[]; ids: Set<string>; chars: number } {
  const numbered = numberBook(a.chapters, a.cover);
  const text = numbered.map(x => x.text).join(" ");
  const fs = sheetSubset(a.sheet, text, a.k);
  const db = dbSubset(text, a.k, a.sheet.people.flatMap(p => (p.mbti ? [p.mbti.type] : [])));
  const prior = (a.prior?.lines ?? []).slice(0, 40).map((l, i) => `[p${9001 + i}] ${l}`);
  const profiles = a.brief.compatibility?.profiles?.map(p => p.line) ?? [];
  const input = { product: a.brief.product, people: a.sheet.people.map(p => ({ name: p.name, gender: p.gender, age: a.brief.person.age, birthTimeKnown: p.timeKnown, mbti: p.mbti?.type ?? null, ...p.input })), relationType: a.brief.compatibility?.relationshipType ?? null, baseDate: a.brief.baseDate };
  let chapterTitle = 0;
  const book = numbered.map(x => {
    const head = x.chapter !== chapterTitle && x.chapter > 0 ? `\n## ${x.chapter}장 ${a.chapters.find(c => c.n === x.chapter)?.title ?? ""}\n` : "";
    chapterTitle = x.chapter;
    return `${head}${x.paragraph < 0 ? (x.n === 0 ? "[0] (표지) " : `[${x.n}] ### `) : `[${x.n}] `}${x.n === 0 ? x.text : x.paragraph < 0 ? x.text : x.text}`;
  }).join("\n");
  const user = [
    `검수 판: ${REVIEW_VERSION}`,
    `입력(input):\n${JSON.stringify(input)}`,
    profiles.length ? `성격표(profile):\n${profiles.join("\n")}` : "",
    `정답지(쓰인 용어만):\n${JSON.stringify(fs)}`,
    `DB 뜻풀이:\n${JSON.stringify(db)}`,
    prior.length ? `같은 사람 이전 책 요약:\n${prior.join("\n")}` : "",
    `machineFlagged: ${JSON.stringify(a.machineFlagged ?? [])}`,
    `책:\n${book}`,
  ].filter(Boolean).join("\n\n");
  const ids = new Set([...Object.keys(fs), ...Object.keys(db), "fs:people", "fs:standards"]);
  return { system: REVIEW_SYSTEM, user, numbered, ids, chars: user.length };
}

const TERM = /비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성|[가-힣]{1,4}살|귀인|일간|일지|월지|월간|연지|시지|대운|세운|[갑을병정무기경신임계][자축인묘진사오미신유술해] ?(일주|대운|년)|[一-鿿]/g;
/** A 수정 문장이 원문에 없던 명리 용어·숫자를 넣었는가. */
export function addsFacts(original: string, fix: string): boolean {
  const terms = (s: string) => new Set(s.match(TERM) ?? []), digits = (s: string) => new Set(s.match(/\d+/g) ?? []);
  const ot = terms(original), od = digits(original);
  return [...terms(fix)].some(t => !ot.has(t)) || [...digits(fix)].some(d => !od.has(d));
}
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const INPUT_FIELDS = /^input\.(job|relationship|children|relationType|money|family|mbti|gender|age|birthTime)$/;

/** 검수 응답(JSON 글) → 남길 지적·바로 바꿀 A·버린 지적과 이유. */
const KO_NUM: Readonly<Record<string, number>> = { 한: 1, 하나: 1, 두: 2, 둘: 2, 세: 3, 셋: 3, 네: 4, 넷: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9, 열: 10, 열한: 11, 열하나: 11, 열두: 12, 열둘: 12, 열세: 13, 열셋: 13 };
const countOf = (s: string) => { const m = s.match(/대운(?:이|은|는)?[^.?!]{0,12}?(\d{1,2}|열두|열둘|열한|열하나|열세|열셋|열|아홉|여덟|일곱|여섯|다섯|넷|네|셋|세|둘|두|하나|한) ?개/); return m ? (/^\d+$/.test(m[1]) ? Number(m[1]) : KO_NUM[m[1]]) : null; };
const BR_HAN = "子丑寅卯辰巳午未申酉戌亥", BR_KO = "자축인묘진사오미신유술해";
const toHan = (b: string) => (BR_KO.includes(b) ? BR_HAN[BR_KO.indexOf(b)] : b);
/**
 * AM 판독(대운 11건): 검수(Haiku)가 엔진 값과 반대로 지적 → 수리가 맞는 문장을 틀리게 고쳤다(공망을 늘 戌·亥로, 대운수 8을 대운 개수로, 음양 2:4를 거꾸로).
 * 문장이 그 값에서 엔진과 맞는데 지적이 그 값을 문제 삼으면(또는 공망 글자를 엔진과 다르게만 대면) 그 지적을 버린다(호출 0). 한 사람 책만.
 */
export function contradictsEngine(issue: { readonly why: string; readonly fix: string }, sentence: string, sheet: FactSheet): string | null {
  if (sheet.people.length !== 1) return null;
  const p = sheet.people[0], said = `${issue.why} ${issue.fix}`;
  if (/공망/.test(said)) {
    const real = new Set(p.gongmang.flatMap(g => g.branches.map(toHan)));
    const near = [...said.matchAll(/공망[^.?!]{0,14}/g)].map(m => m[0]).join(" ");
    const named = [...[...near.matchAll(/[子丑寅卯辰巳午未申酉戌亥]/g)].map(m => m[0]), ...[...near.matchAll(/(?<![가-힣])([자축인묘진사오미신유술해])·([자축인묘진사오미신유술해])/g)].flatMap(m => [toHan(m[1]), toHan(m[2])])];
    if (real.size && named.length && !named.some(b => real.has(b))) return "F_gongmang_engine";
  }
  const total = p.dayun.cycles.length;
  if (total && countOf(sentence) === total && /대운수|개수|(\d{1,2}|열두|열|아홉|여덟|일곱|여섯|다섯) ?개/.test(said)) return "F_dayun_count_engine";
  const lean = yinYangLean(sentence), { yin, yang } = p.yinYang;
  if (lean && /음양|음 ?\d|양 ?\d|음의|양의|음이|양이|음 기운|양 기운/.test(said) && ((lean === "yang" && yang > yin) || (lean === "yin" && yin > yang))) return "F_yinyang_engine";
  return null;
}

export function guardReview(text: string, numbered: readonly Numbered[], ids: ReadonlySet<string>, priorCount = 0, product = "", sheet?: FactSheet): GuardedReview | null {
  let parsed: unknown;
  try { const m = text.match(/\{[\s\S]*\}/); parsed = m ? JSON.parse(m[0]) : null; } catch { return null; }
  const list = parsed && typeof parsed === "object" && Array.isArray((parsed as { issues?: unknown }).issues) ? (parsed as { issues: unknown[] }).issues : null;
  if (!list) return null;
  const byN = new Map(numbered.map(x => [x.n, x]));
  const kept: ReviewIssue[] = [], direct: ReviewIssue[] = [], dropped: { issue: unknown; reason: string }[] = [];
  const seen = new Set<number>();
  for (const raw of list.slice(0, REVIEW_MAX_ISSUES * 2)) {
    const x = raw as Partial<ReviewIssue>;
    const drop = (reason: string) => dropped.push({ issue: raw, reason });
    if (!x || typeof x !== "object" || !REVIEW_CATS.includes(x.cat as ReviewCat)) { drop("category"); continue; }
    let s = Number(x.s), s2 = Number(x.s2 ?? 0);
    // 짝 번호를 이유 칸에만 적은 경우(「p9012」「s70」「46행」「12번」) 그 번호를 짝으로 읽는다.
    if ((x.cat === "C" || x.cat === "R") && !(s2 >= 1)) { const m = String(x.why ?? "").match(/p(9\d{3})|s(\d+)|(\d+)\s?(행|번)/); if (m) s2 = Number(m[1] ?? m[2] ?? m[3]); }
    const quote = String(x.quote ?? "").trim(), ref = String(x.ref ?? "").trim(), field = String(x.field ?? "").trim(), fix = String(x.fix ?? "").trim();
    const isPrior = (n: number) => n >= 9001 && n < 9001 + priorCount;
    if (!byN.has(s)) { drop("sentence_number"); continue; }
    if (!quote || !norm(byN.get(s)!.text).includes(norm(quote))) {
      // R·C는 s2 쪽 인용일 수 있다 → 번호를 바꿔 다시 본다(뒤쪽 문장만 고친다).
      if ((x.cat === "R" || x.cat === "C") && byN.has(s2) && quote && norm(byN.get(s2)!.text).includes(norm(quote))) [s, s2] = [s2, s];
      else { drop("quote_not_verbatim"); continue; }
    }
    if (x.cat === "F" && !(ref && [...ids].some(id => ref === id || ref.startsWith(`${id}`) || ref.startsWith("fs:people") || ref.startsWith("db:")) && (ref.startsWith("fs:") || ref.startsWith("db:")))) { drop("F_without_ref"); continue; }
    if ((x.cat === "C" || x.cat === "R") && !(s2 >= 1 && s2 !== s && (byN.has(s2) || (x.cat === "C" && isPrior(s2))))) { drop(`${x.cat}_without_pair`); continue; }
    // 이유가 스스로 "문제 아님"이라고 말하면 버린다(검수 모델이 보고하지 않을 것을 칸에 넣었다).
    if (/해당 없|위반 아님|문제 ?아님|보류|철회|제외 대상|보고 제외|— 제외|확실치 않|확실하지 않|소지 있으나|약간 부정확|문제(가|는)? 없|보고하지 않|허용 범위|명확하지 않|아닙니다\.?$|맞다\.|맞다$|맞음|[과와로] 일치(?!하지)/.test(String(x.why ?? ""))) { drop("why_says_no_issue"); continue; }
    if (x.cat === "I" && !INPUT_FIELDS.test(field)) { drop("I_without_field"); continue; }
    // R: 뒤쪽 문장만 고친다.
    if (x.cat === "R" && byN.has(s2) && s2 > s) [s, s2] = [s2, s];
    if (x.cat === "A" && !fix) { drop("A_without_fix"); continue; }
    // T(연·월 고정)는 종합 책 규칙이다. 커리어·연애의 3년 로드맵 날짜는 유지한다(최종판3 2e).
    if (x.cat === "T" && product !== "saju_mbti_full") { drop("T_not_comprehensive"); continue; }
    // AM 판독(종합 8장): 허용된 해 이름 꼴(「2027년 정미년」)을 T로 지적 → 수리가 「올해 병오년」으로 바꿔 2027 관계가 2026 문장에 붙었다. 해 이름만 있고 달·연도 고정·「올해」가 없는 문장의 T는 버린다.
    if (x.cat === "T" && hasYearName(byN.get(s)!.text) && !fixedTimeOf(byN.get(s)!.text) && !/올해|이번 달|이달/.test(byN.get(s)!.text)) { drop("T_year_name_allowed"); continue; }
    if (sheet) { const why = contradictsEngine({ why: String(x.why ?? ""), fix }, byN.get(s)!.text, sheet); if (why) { drop(why); continue; } }
    if (seen.has(s)) { drop("duplicate_sentence"); continue; }
    seen.add(s);
    const issue: ReviewIssue = { cat: x.cat as ReviewCat, s, quote, why: String(x.why ?? "").slice(0, 300), ref, s2, field, fix };
    if (issue.cat === "A" && byN.get(s)!.paragraph >= 0 && !addsFacts(byN.get(s)!.text, fix)) direct.push(issue); else kept.push(issue);
    if (kept.length + direct.length >= REVIEW_MAX_ISSUES) break;
  }
  return { kept, direct, dropped };
}

/** 이전 책 요약 줄(원장): 같은 사람 이전 책의 성향 단정 문장·표지·처방. 길이 상한. */
export function priorSummaryOf(sentences: readonly string[], extra: readonly string[] = []): PriorSummary {
  const trait = sentences.filter(s => /(편이에요|편입니다|편이죠|쪽이에요|쪽입니다|사람이에요|사람입니다|습관이 있|버릇이)/.test(s) && s.length <= 140);
  const lines = [...extra, ...trait].slice(0, 40);
  let total = 0;
  return { lines: lines.filter(l => (total += l.length) <= 3500) };
}
