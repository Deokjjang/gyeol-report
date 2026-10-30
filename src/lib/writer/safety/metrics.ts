/**
 * 안전망 메타 지표(P3.5 A1·A2, 기록만 하고 지우지 않는다).
 * - briefCopy: 출력 문장 중 브리프 문장과 공백·문장부호를 뺀 20자 이상이 연속으로 같은 문장의 비율(목표 10% 미만). 작가가 쓴 장만 따로도 낸다.
 * - connectors: 같은 연결 어구("이 기운 때문에", "그래서" 등)가 책 전체에서 3회 이상 나온 것.
 */
import type { Brief } from "@/lib/brief/schema";
import type { BookSection, ChapterSource } from "../format";
import { splitSentences } from "./patterns";
import { norm } from "./sentences";

export const BRIEF_COPY_WINDOW = 20;
export const CONNECTOR_LIMIT = 3;

type Chapter = { readonly sections: readonly BookSection[]; readonly source: ChapterSource };
export type BriefCopyMetric = { readonly sentences: number; readonly matched: number; readonly ratio: number; readonly writerSentences: number; readonly writerMatched: number; readonly writerRatio: number };
export type ConnectorRepeat = { readonly phrase: string; readonly count: number };

function briefWindows(brief: Brief): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown, key = "") => {
    if (typeof v === "string") { if (/^(id|featureId|traitId|ref|key|entryKey|seed|version|hex)$/.test(key)) return; const n = norm(v); for (let i = 0; i + BRIEF_COPY_WINDOW <= n.length; i++) out.add(n.slice(i, i + BRIEF_COPY_WINDOW)); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
  };
  walk(brief);
  return out;
}
export const copiesBrief = (sentence: string, windows: ReadonlySet<string>) => { const n = norm(sentence); for (let i = 0; i + BRIEF_COPY_WINDOW <= n.length; i++) if (windows.has(n.slice(i, i + BRIEF_COPY_WINDOW))) return true; return false; };

const sentencesOf = (sections: readonly BookSection[]) => sections.flatMap(s => s.paragraphs.flatMap(p => splitSentences(p)));
const ratio = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 1000 : 0);

export function briefCopyMetric(brief: Brief, chapters: readonly Chapter[]): BriefCopyMetric {
  const w = briefWindows(brief);
  let sentences = 0, matched = 0, writerSentences = 0, writerMatched = 0;
  for (const c of chapters) for (const s of sentencesOf(c.sections)) {
    const hit = copiesBrief(s, w);
    sentences++; if (hit) matched++;
    if (c.source !== "deterministic") { writerSentences++; if (hit) writerMatched++; }
  }
  return { sentences, matched, ratio: ratio(matched, sentences), writerSentences, writerMatched, writerRatio: ratio(writerMatched, writerSentences) };
}

/** 이유를 잇는 어구(~ 때문에·덕분에·탓에·이유로)와 문장 첫머리 접속어. */
const CAUSE = /(?<![가-힣])((?:이|그|이런|그런|바로 이|바로 그|이 두|앞의) ?(?:[가-힣]{1,6} ){0,2}[가-힣]{0,6} ?(?:때문에|덕분에|탓에|이유로|까닭에))/g;
const LEAD = /^(그래서|그러니|그러니까|그런데|반대로|그 결과|여기에|게다가|하지만|그래도|결국|덕분에)(?=[\s,])/;
export function connectorRepeats(chapters: readonly Chapter[], limit = CONNECTOR_LIMIT): ConnectorRepeat[] {
  const count = new Map<string, number>();
  const add = (p: string) => count.set(p, (count.get(p) ?? 0) + 1);
  for (const c of chapters) for (const s of sentencesOf(c.sections)) {
    for (const m of s.matchAll(CAUSE)) add(m[1].replace(/\s+/g, " ").trim());
    const lead = s.match(LEAD); if (lead) add(lead[1]);
  }
  return [...count].filter(([, n]) => n >= limit).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([phrase, n]) => ({ phrase, count: n }));
}

/** 책 단위 trait 언급 상한(P3.8 1): 소개 1 + 적용 2 = 소제목 3개, 한 장에 1개. 같은 축도 같은 상한. 브리프 배정(plan)과 같다. */
export const TRAIT_SECTION_LIMIT = 3;
export type TraitUse = { readonly id: string; readonly name: string; readonly sections: number; readonly chapters: number; readonly maxInChapter: number; readonly planned: number };
export type TraitUseMetric = { readonly traits: readonly TraitUse[]; readonly axes: Readonly<Record<string, number>>; readonly mbti?: Readonly<Record<string, number>>; readonly advice?: number; readonly warnings: readonly string[] };
const ADVICE = /(한 ?줄|한마디|한 문장|짧은 (말|대꾸|답|문자))(?=[^.?!]{0,40}(붙이|덧붙|보내|말해|건네|적어|물어|곁들|옮겨|남겨|바꿔))/;
/** MBTI 근거로 자주 쓰는 성향 이름(행동 차원 이름)·기능 코드: MBTI 유형이 나온 문장에서 센다. */
const MBTI_BASIS = /\b(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\b|직설성|결정 속도|위험 감수|감정 표현|통제 욕구|끈기|사교 에너지|규칙 준수|완벽주의|독립성|공감 반응|새로움 추구|계획성|승부욕|경계심|말수|세부 초점|챙김|돈 조절|지위 욕구|반응 속도|자기 성찰|따져 묻기|의무감|갈등 대응|배움 욕구/g;
const noHan = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();
/**
 * 원고에서 trait 이름(쉬운 이름·용어)이 나온 소제목을 센다. 같은 소제목 안 여러 번은 1로 센다.
 * 경고: 소제목 3개 초과, 한 장 2개 이상, 같은 축(plan.axes) 소제목 3개 초과·한 장 2개 이상.
 */
export function traitMentions(brief: Brief, chapters: readonly { readonly n: number; readonly sections: readonly BookSection[] }[]): TraitUseMetric {
  const tokens = new Map(brief.traits.map(t => [t.id, [...new Set([t.easyName, noHan(t.name), noHan(t.name).replace(/살$/, "")].filter(x => x.length >= 2))]]));
  const hits = new Map<string, { n: number; s: number }[]>();
  chapters.forEach(c => c.sections.forEach((s, si) => {
    const text = [s.heading, ...s.paragraphs].join(" ");
    for (const [id, ts] of tokens) if (ts.some(x => text.includes(x))) hits.set(id, [...(hits.get(id) ?? []), { n: c.n, s: si }]);
  }));
  const warnings: string[] = [];
  const perChapterMax = (list: readonly { n: number; s: number }[]) => Math.max(0, ...[...new Set(list.map(x => x.n))].map(n => new Set(list.filter(x => x.n === n).map(x => x.s)).size));
  const traits = brief.traits.flatMap(t => {
    const list = hits.get(t.id) ?? [], p = brief.plan?.traits[t.id];
    if (!list.length && !p) return [];
    const use = { id: t.id, name: t.easyName, sections: list.length, chapters: new Set(list.map(x => x.n)).size, maxInChapter: perChapterMax(list), planned: p ? 1 + p.applies.length : 0 };
    if (use.sections > TRAIT_SECTION_LIMIT) warnings.push(`${t.id} ${t.easyName} 소제목 ${use.sections}개`);
    if (use.maxInChapter > 1) warnings.push(`${t.id} ${t.easyName} 한 장 ${use.maxInChapter}개`);
    return [use];
  });
  const axes: Record<string, number> = {};
  const axisHits = new Map<string, { n: number; s: number }[]>();
  for (const [id, p] of Object.entries(brief.plan?.traits ?? {})) for (const a of p.axes) axisHits.set(a, [...(axisHits.get(a) ?? []), ...(hits.get(id) ?? [])]);
  for (const [a, list] of axisHits) {
    const uniq = [...new Map(list.map(x => [`${x.n}:${x.s}`, x])).values()];
    axes[a] = uniq.length;
    if (uniq.length > TRAIT_SECTION_LIMIT) warnings.push(`축 ${a} 소제목 ${uniq.length}개`);
    if (perChapterMax(uniq) > 1) warnings.push(`축 ${a} 한 장 ${perChapterMax(uniq)}개`);
  }
  // MBTI 근거 반복(P3.8 r1: 'ENTJ의 계획성'이 한 장에 다섯 번): 같은 기능·성향 이름이 MBTI 문장에 세 번 이상이면 경고.
  const mbti: Record<string, number> = {};
  const type = brief.mbti?.type, types = [type, brief.partner?.mbti?.type].filter((x): x is NonNullable<typeof x> => Boolean(x));
  if (types.length) for (const c of chapters) for (const s of c.sections) for (const p of s.paragraphs) for (const sen of splitSentences(p)) {
    if (!types.some(t => sen.includes(t))) continue;
    for (const m of new Set(sen.match(MBTI_BASIS) ?? [])) mbti[m] = (mbti[m] ?? 0) + 1;
  }
  for (const [m, n] of Object.entries(mbti)) if (n > 2) warnings.push(`MBTI 근거 ${m} ${n}회`);
  // 같은 꼴의 처방(P3.8 r1: "한 줄 먼저 말하기"가 한 책에 7~8번): 짧은 말·글을 먼저 건네라는 행동 조언 문장 수.
  let advice = 0;
  for (const c of chapters) for (const s of c.sections) for (const p of s.paragraphs) for (const sen of splitSentences(p)) if (ADVICE.test(sen)) advice++;
  if (advice > 2) warnings.push(`'한 줄·한마디' 처방 ${advice}회`);
  return { traits, axes, mbti, advice, warnings };
}

/**
 * 같은 정보 반복(P6 새 정의). 반복 = 다른 소제목에 같은 주장·같은 장면·같은 처방이 다시 나온 것.
 * 같은 성향(trait·축)이 다른 영역에서 새 정보와 함께 나오는 것은 세지 않는다: 문장 내용이 겹칠 때만 센다.
 * 판정: 이름(trait 쉬운 이름·용어, MBTI 유형, 고객 이름, 직업)과 되짚기 말("앞에서 본")을 지운 두 문장이
 * 공백·문장부호를 뺀 글자 3개 묶음 자카드 ≥ INFO_JACCARD, 또는 같은 글자 INFO_RUN자 이상이 이어지면 같은 정보.
 * 종류: 처방(권유 끝맺음) · 장면(따옴표 대사 또는 브리프 장면 소품) · 주장(그 밖).
 */
export const INFO_JACCARD = 0.45;
export const INFO_RUN = 14;
export type InfoRepeat = { readonly kind: "claim" | "scene" | "advice"; readonly at: readonly [string, string]; readonly a: string; readonly b: string };
export type InfoRepeatMetric = { readonly count: number; readonly byKind: Readonly<Record<InfoRepeat["kind"], number>>; readonly pairs: readonly InfoRepeat[] };
const ADVICE_END = /(보세요|하세요|두세요|주세요|마세요|해요\?|봐요|좋아요|좋습니다|됩니다|충분합니다)[.!?]?["'”’)]*$/;
const grams = (t: string) => { const g = new Set<string>(); for (let i = 0; i + 3 <= t.length; i++) g.add(t.slice(i, i + 3)); return g; };
function longestRun(a: string, b: string): number {
  // 짧은 문장끼리라 O(n·m) DP로 충분하다(문장 80자 안팎).
  let best = 0; const prev = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) { let diag = 0; for (let j = 1; j <= b.length; j++) { const tmp = prev[j]; prev[j] = a[i - 1] === b[j - 1] ? diag + 1 : 0; if (prev[j] > best) best = prev[j]; diag = tmp; } }
  return best;
}
export function infoRepeats(brief: Brief, chapters: readonly { readonly n: number; readonly sections: readonly BookSection[] }[]): InfoRepeatMetric {
  const names = [...new Set([
    ...brief.traits.flatMap(t => [t.easyName, noHan(t.name)]),
    brief.mbti?.type, brief.partner?.mbti?.type, brief.person.name, brief.person.callName, brief.partner?.person.name, brief.partner?.person.callName, brief.person.facts.job.detail,
  ].filter((x): x is string => typeof x === "string" && x.length >= 2))].sort((a, b) => b.length - a.length);
  const props = [...new Set([...Object.keys(brief.usedProps ?? {}), ...brief.chapters.flatMap(c => c.sceneHint ?? [])])].filter(x => x.length >= 2);
  const strip = (sen: string) => norm(names.reduce((t, n) => t.split(n).join(" "), sen).replace(/앞에서 본|앞서 본|앞에서 말한/g, " "));
  const items = chapters.flatMap(c => c.sections.flatMap((s, si) => s.paragraphs.flatMap(p => splitSentences(p)).map(sen => ({ at: `${c.n}.${si + 1}`, sen, key: strip(sen) }))))
    .filter(x => x.key.length >= 15).map(x => ({ ...x, g: grams(x.key) }));
  const pairs: InfoRepeat[] = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j];
    if (A.at === B.at) continue;
    let inter = 0; for (const g of A.g) if (B.g.has(g)) inter++;
    const jac = inter / (A.g.size + B.g.size - inter);
    if (jac < INFO_JACCARD && (inter < INFO_RUN - 2 || longestRun(A.key, B.key) < INFO_RUN)) continue;
    const kind = ADVICE_END.test(A.sen) && ADVICE_END.test(B.sen) ? "advice" : /["“'‘]/.test(A.sen + B.sen) || props.some(p => A.sen.includes(p) && B.sen.includes(p)) ? "scene" : "claim";
    pairs.push({ kind, at: [A.at, B.at], a: A.sen.slice(0, 80), b: B.sen.slice(0, 80) });
  }
  const byKind = { claim: 0, scene: 0, advice: 0 };
  for (const p of pairs) byKind[p.kind]++;
  return { count: pairs.length, byKind, pairs };
}
