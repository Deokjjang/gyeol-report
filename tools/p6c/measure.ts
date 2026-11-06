/**
 * P6c 지표(0 기준선과 K 전후 비교에 같은 정의). 원고(final.md) + 사례 사실(같은 입력으로 만든 브리프) → 권별 지표.
 *  ① DB 원문(forYou·shadow·life·MBTI 장면)과 정규화 20자 이상 이어서 겹치는 고객 문장 수. wide = 지식 DB의 다른 장면·문장까지.
 *  ② 같은 고객의 다른 상품과 겹치는 문장 수(정규화 글자 5-gram 자카드 0.5 이상, 뒤 책 문장 기준).
 *  ③ 용어 뜻 공식("X(漢字)은 ~을 뜻해요") 수, 그 뒤 "그래서 당신에게는"까지 붙은 수.
 *  ④ "명리학에서/명리학적으로/명리에서는" 수, "앞에서 본" 수.
 *  ⑤ 그림 별명 수, 학교 장면 수, 입력 없는 과거·관계 단정 수.
 *  (덧) 농사 비유·MBTI 약어 괄호 밖·음양 비율 어긋남·오행 "없다" 단정·대운 위치 어긋남·배우자/자녀 별 어긋남·1장 두 번째 그림.
 * 검사 정의는 src/lib/writer/safety/lint.ts(안전망과 같은 함수).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildBrief, loadKnowledge, type Knowledge } from "../../src/lib/brief";
import type { Brief } from "../../src/lib/brief/schema";
import { normalizeReportInputPayload } from "../../src/lib/report-generation/reportInputAdapter";
import { payloadToBriefInput } from "../../src/lib/writer/book";
import { parseChapters, type BookChapter } from "../../src/lib/writer/format";
import { isPastAssertion, splitSentences } from "../../src/lib/writer/safety/patterns";
import * as L from "../../src/lib/writer/safety/lint";

export const ROOT = resolve(import.meta.dirname, "../..");
const KNOW = join(ROOT, "src/data/knowledge-v5");
const json = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const files = (dir: string, re = /\.json$/) => readdirSync(join(KNOW, dir)).filter(f => re.test(f)).map(f => join(KNOW, dir, f));

type Feature = { easyName: string; forYou: Record<string, string>; shadow: string; life: string; scenes: Record<string, { text: string }[]>; strengths: string[]; overuse: string[] };
/** 지표 ①의 말뭉치: base = forYou·shadow·life·MBTI 장면, wide = base + 다른 DB 장면·문장(명리 장면·강점·과사용·Fusion·궁합·연애 신호·MBTI 기능 설명). */
export function dbCorpora() {
  const features = files("myeongri").flatMap(f => json(f).features as Feature[]);
  const mbti = files("mbti").flatMap(f => json(f).profiles as { signals: Record<string, { text: string }[]>; cognitiveFunctions: { easy: string }[]; shadows: string[]; oneLiner: string; conventionalCompat: { why: string }[] }[]);
  const fusion = files("fusion", /^[A-Z]{4}\.json$/).flatMap(f => json(f).rules as { why: string; scene: { text: string } }[]);
  const compat = json(join(KNOW, "compat/scenes.json")).types.flatMap((t: { topics: { scenes: { text: string }[] }[] }) => t.topics.flatMap(x => x.scenes.map(s => s.text)));
  const love = json(join(KNOW, "love/signals.json")).entries.flatMap((e: Record<string, { line: string; scenes: { text: string }[] }>) => ["crush", "contact", "pushPull"].flatMap(a => e[a] ? [e[a].line, ...e[a].scenes.map(s => s.text)] : []));
  const base = [...features.flatMap(f => [...Object.values(f.forYou), f.shadow, f.life]), ...mbti.flatMap(p => Object.values(p.signals).flat().map(s => s.text))];
  const wide = [...base, ...features.flatMap(f => [...Object.values(f.scenes).flat().map(s => s.text), ...f.strengths, ...f.overuse]), ...fusion.flatMap(r => [r.why, r.scene.text]), ...compat, ...love,
    ...mbti.flatMap(p => [...p.cognitiveFunctions.map(c => c.easy), ...p.shadows, p.oneLiner, ...p.conventionalCompat.map(c => c.why)])];
  return { base: L.copyWindows(base.filter(Boolean)), wide: L.copyWindows(wide.filter(Boolean)), nicknames: [...features.map(f => f.easyName), ...L.NICKNAME_KEYS] };
}

export type CaseDef = { readonly id: string; readonly label: string; readonly payload: unknown; readonly people: readonly string[] };
/** 시험 사례의 사람(이름 기준): 같은 사람이 든 책끼리 ②를 잰다. */
export const PEOPLE_OF: Readonly<Record<string, readonly string[]>> = { "c1-full": ["하람"], "c1-career": ["하람"], "pair-love": ["하람", "서윤"], "c2-annual": ["서윤"], "y-love": ["도현"], "x-major": ["수진"], "me-full": ["장덕민"] };

export function caseBrief(c: { payload: unknown }, k: Knowledge, baseDate = "2026-11-03"): Brief {
  const n = normalizeReportInputPayload(c.payload as never, { now: () => new Date(`${baseDate}T03:00:00Z`) });
  if (!n.ok) throw new Error(`입력 오류 ${n.error}`);
  return buildBrief(payloadToBriefInput(n.value as never, baseDate) as never, k);
}

type Unit = { readonly chapter: number; readonly kind: "heading" | "body"; readonly text: string };
export function unitsOf(chapters: readonly BookChapter[]): Unit[] {
  return chapters.flatMap(c => c.sections.flatMap(s => [
    ...(s.heading && !/^\d{4}(-M\d{2})?$/.test(s.heading) ? [{ chapter: c.n, kind: "heading" as const, text: s.heading }] : []),
    ...s.paragraphs.flatMap(p => splitSentences(p).map(text => ({ chapter: c.n, kind: "body" as const, text }))),
  ]));
}
const schoolStageOf = (b: Brief): L.SchoolStage | "student" => b.person.facts.job.class !== "student" ? "none" : b.person.age < 19 ? "student" : "college";

export type BookMeasure = ReturnType<typeof measureBook>;
export function measureBook(id: string, chapters: readonly BookChapter[], brief: Brief, corp: ReturnType<typeof dbCorpora>) {
  const units = unitsOf(chapters), body = units.filter(u => u.kind === "body");
  const facts = brief.person.facts, compat = Boolean(brief.compatibility);
  const core = brief.compatibility?.pairImage.line ?? brief.chart.coreImage.line;
  const sample = (xs: Unit[], n = 6) => xs.slice(0, n).map(u => `${u.chapter}: ${u.text.slice(0, 90)}`);
  const hit = (pred: (u: Unit, i: number) => unknown, from: readonly Unit[] = units) => from.filter((u, i) => Boolean(pred(u, i)));
  const dbBase = hit(u => L.copiedWindow(u.text, corp.base), body), dbWide = hit(u => L.copiedWindow(u.text, corp.wide), body);
  const formula = hit(u => L.MEANING_FORMULA.test(u.text));
  const fullFormula = body.filter((u, i) => L.MEANING_FORMULA.test(u.text) && L.FORMULA_FOLLOW.test(body[i + 1]?.text ?? ""));
  const prefix = hit(u => L.MYEONGRI_PREFIX.test(u.text)), backref = hit(u => L.BACKREF_WORD.test(u.text));
  const nickname = hit(u => L.nicknameHits(u.text, corp.nicknames, [core]).length), farming = hit(u => L.FARMING.test(u.text));
  const stage = schoolStageOf(brief);
  const school = compat ? hit(u => L.schoolHit(u.text, "none")) : hit(u => L.schoolHit(u.text, stage, facts.job.detail));
  const presume = compat ? [] : hit(u => L.presumedPartner(u.text, facts.relationship), body);
  const past = hit(u => L.pastAssertion(u.text) || isPastAssertion(u.text), body);
  const bareFn = hit(u => L.bareFunctionCodes(u.text).length);
  const yy = brief.chart.yinYang, presence = brief.chart.elements.presence;
  const yinYang = compat ? [] : hit(u => L.yinYangClaim(u.text, yy.yin, yy.yang));
  const element = compat || !presence ? [] : hit(u => L.elementAbsenceClaims(u.text, presence as L.ElementPresence).length);
  const cd = brief.chart.currentDayun;
  const phase = cd ? L.dayunPhase(brief.chart.thisYear.year - Number(cd.years.slice(0, 4))) : null;
  const dayun = compat || !phase ? [] : hit(u => L.dayunPhaseClaim(u.text, phase));
  const ch1 = chapters.find(c => c.n === 1);
  const second = ch1 ? unitsOf([ch1]).filter(u => L.secondImage(u.text, core)) : [];
  const chars = chapters.reduce((a, c) => a + c.sections.reduce((x, s) => x + s.heading.length + s.paragraphs.join("").length, 0), 0);
  return {
    id, chars, units: units.length, sentences: body.length,
    dbCopy: dbBase.length, dbCopyWide: dbWide.length, formula: formula.length, fullFormula: fullFormula.length, myeongriPrefix: prefix.length, backref: backref.length,
    nickname: nickname.length, school: school.length, pastOrPresume: new Set([...past, ...presume]).size,
    extra: { farming: farming.length, bareMbtiCode: bareFn.length, yinYang: yinYang.length, elementAbsent: element.length, dayunPhase: dayun.length, secondImage: second.length, presume: presume.length, past: past.length },
    samples: { dbCopy: sample(dbBase), formula: sample(formula, 3), prefix: sample(prefix, 3), backref: sample(backref, 3), nickname: sample(nickname), school: sample(school), past: sample(past), presume: sample(presume), bareFn: sample(bareFn, 3), yinYang: sample(yinYang), element: sample(element), dayun: sample(dayun), second: sample(second), farming: sample(farming) },
  };
}

/** ②: 같은 사람이 든 책 쌍(앞 책 → 뒤 책, 순서는 order)마다 뒤 책 문장 중 앞 책과 겹치는 수. */
export function crossOverlap(order: readonly string[], books: ReadonlyMap<string, readonly BookChapter[]>, people: Readonly<Record<string, readonly string[]>> = PEOPLE_OF) {
  const body = (id: string) => unitsOf(books.get(id)!).filter(u => u.kind === "body").map(u => u.text);
  const out: { a: string; b: string; overlap: number; of: number; samples: string[] }[] = [];
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) {
    const a = order[i], b = order[j];
    if (!books.has(a) || !books.has(b) || !people[a]?.some(p => people[b]?.includes(p))) continue;
    const r = L.overlapping(body(a), body(b));
    out.push({ a, b, overlap: r.length, of: body(b).length, samples: r.slice(0, 4).map(x => `${x.j}: ${x.b.slice(0, 70)} ⇐ ${x.a.slice(0, 70)}`) });
  }
  return out;
}

export function readBook(path: string): BookChapter[] { return parseChapters(readFileSync(path, "utf8")); }
export { loadKnowledge };
