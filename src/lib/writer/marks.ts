/**
 * W5 R1 사실 표시(「사실은 시스템이 쓰고, 작가는 해석만 쓴다」). 틀리기 쉬운 사실(두 사람 사이 관계·관계 개수·사주 안 관계·신살 주인·특성 자리·대운)은
 * 작가가 문장으로 다시 쓰지 않고 ⟦종류:번호⟧ 표시를 넣는다. 발행 때(render) 정답지(엔진 출력)로 만든 한국어 구절로 바꾸고, 바로 뒤 조사는 받침에 맞춘다.
 * - 표시 문법: ⟦rel:3⟧(두 사람 사이 관계) · ⟦cnt:all|hap|clash⟧(사이 관계 개수) · ⟦in:a2⟧·⟦in:2⟧(한 사람 사주 안 관계) · ⟦star:4⟧(궁합 신살·귀인 주인)
 *   · ⟦at:<특성 id>⟧(특성 자리) · ⟦un:now|next⟧(지금·다음 대운). 본문 글자와 헷갈리지 않게 ⟦ ⟧(U+27E6·U+27E7)만 쓴다(핵심 문장 표시는 ⟪ ⟫).
 * - 모르는 표시·남은 표시·깨진 표시는 검사(p6c fact_mark, HARD)가 잡는다 — renderMarks는 모르는 표시를 그대로 둔다.
 * 세운·대운(장 묶음 작가)은 쓰지 않는다(지침·예시 그대로).
 */
import type { Brief } from "@/lib/brief/schema";
import type { FactSheet, PersonFacts, RelationFact } from "@/lib/factsheet/build";
import { HALF_HAP_PLAIN, REL_PLAIN, SAMHYEONG_PLAIN } from "@/lib/brief/labels";
import { isHapKind, relationName } from "@/lib/compat/relations";

export type MarkKind = "rel" | "cnt" | "in" | "star" | "at" | "un" | "ju" | "tg";
/** short: 가까이(같은 문단·바로 앞 문단 끝 문장) 다시 나올 때의 짧은 꼴(W6 A1). codes: 자리 칸 이름(「일지」) — 바로 앞에 같은 자리 말이 있으면 겹치지 않게. list: 자리가 셋 이상일 때 책에서 한 번만 펼치는 목록. */
export type Mark = { readonly key: string; readonly kind: MarkKind; readonly text: string; readonly flow?: string; readonly bare?: string; readonly owner?: string; readonly short?: string; readonly codes?: readonly string[]; readonly list?: string; readonly later?: string;
  /** W6: 관계 구절의 글자만 꼴(「신과 해 사이의 해(…)」) — 문장이 이미 자리를 말했을 때. */
  readonly glyph?: string;
  /** W6 S4(발행 렌더 표만): 자리 표시(at)의 특성 이름 — 자리 표시를 주어·목적어로 쓰면(「도윤님의 세 자리(…)가 이때 작동해서」) 「자리의 편관이」로 이름을 붙인다. */
  readonly name?: string };
/** 자리 표시 뒤 말이 이미 간지·십성·신살 이름이면(「(일주)이 갑인이에요」) 특성 이름을 붙이지 않는다. */
const NAMEY = /^(?:[갑을병정무기경신임계][자축인묘진사오미신유술해]|[갑을병정무기경신임계](?:목|화|토|금|수)|비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|[가-힣]{1,4}살(?![가-힣])|[가-힣]{1,3}귀인)/;
export type MarkTable = ReadonlyMap<string, Mark>;

const HANGUL: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
const PLACE: Readonly<Record<string, string>> = { 연: "해", 월: "달", 일: "날", 시: "시각" };
const SKY = new Set(["STEM_HAP", "STEM_CHUNG"]);

/** 받침(마지막 한글 글자 기준, 끝 괄호는 건너뜀): none · rieul(ㄹ) · other. */
export function finalSound(phrase: string): "none" | "rieul" | "other" {
  const t = phrase.replace(/\s*\([^()]*\)\s*$/, "").replace(/[^가-힣]+$/, "");
  const ch = t.slice(-1), code = ch.charCodeAt(0) - 0xac00;
  if (!ch || code < 0 || code > 11171) return "none";
  const jong = code % 28;
  return jong === 0 ? "none" : jong === 8 ? "rieul" : "other";
}
/** 받침에 맞는 조사(둘 중 하나로 쓴 것을 고친다). */
// W6 S4(1차 궁합 「합이 다섯 가지가고」): 서술격 「이고·이며·이지만·이나·이든·이자」도 받침으로 고른다(없으면 「이」만 「가」로 바뀌어 깨졌다).
const PARTICLES: readonly (readonly [string, string])[] = [["이에요", "예요"], ["이었", "였"], ["이라서", "라서"], ["이라는", "라는"], ["이라고", "라고"], ["이지만", "지만"], ["이라", "라"], ["이고", "고"], ["이며", "며"], ["이나", "나"], ["이든", "든"], ["이자", "자"], ["으로", "로"], ["은", "는"], ["이", "가"], ["을", "를"], ["과", "와"]];
export function fixParticle(phrase: string, p: string): string {
  const s = finalSound(phrase), pair = PARTICLES.find(x => x.includes(p));
  if (!pair) return p;
  if (pair[0] === "으로") return s === "other" ? "으로" : "로";
  return s === "none" ? pair[1] : pair[0];
}

/** ⟦종류:번호⟧ — 번호는 영문 소문자·숫자 1~12자. */
export const MARK_RE = /⟦(rel|cnt|in|star|at|un|ju|tg):([0-9a-z]{1,12})⟧/g;
/** 바꾼 뒤에도 남은 표시 흔적(모르는 표시·깨진 표시·꺾쇠만 남은 것·대괄호로 바꿔 쓴 것). */
export const MARK_LEFT = /⟦|⟧|\[\[?(?:rel|cnt|in|star|at|un|ju|tg):[0-9a-z]{1,12}\]?\]|(?<![A-Za-z])(?:rel|cnt|star|un|ju|tg):[0-9a-z]{1,8}(?![A-Za-z0-9])/;

/** W6 A1: 책 단위 렌더 상태(tidyBook이 장·절·문단 순서로 넘긴다). seen = 책에서 이미 렌더한 표시(자리 목록을 한 번만 펼침), tail = 같은 절 바로 앞 문단 끝 문장의 표시. */
export type MarkState = { seen: Set<string>; tail: Set<string>; scope: string; readonly count: { short: number; dropped: number; paren: number } };
export const newMarkState = (): MarkState => ({ seen: new Set(), tail: new Set(), scope: "", count: { short: 0, dropped: 0, paren: 0 } });
const PARTICLE_ALT = PARTICLES.flat().sort((a, b) => b.length - a.length).join("|");
const placeCore = (t: string) => t.replace(/^[^ ]+님의 /, "").replace(/\([^()]*\)/g, "").trim();

/**
 * 표시를 구절로 바꾼다. 바로 뒤 조사(은/는·이/가·을/를·와/과·으로/로·이에요/예요 등)는 받침에 맞춘다. 모르는 표시는 그대로 둔다(검사가 잡는다).
 * W6 A1(W5 1차 종합 「태어난 날 땅 글자(일지)에 태어난 날 땅 글자(일지)의 절」·「기사(기사 대운(정재의 10년))」·대운 구절 두 문장 연속):
 *  ① 괄호 안 표시(「기사(⟦un:now⟧)」)는 괄호를 풀어 표시 구절 하나로(괄호 앞 말이 구절에 없으면 괄호째 뗀다)
 *  ② 같은 문장 바로 앞(30자)에 같은 자리 말이 있으면 겹치지 않게 — 「…에 ⟦at⟧의 X」는 「…에 X」, 그 밖은 짧은 꼴
 *  ③ 같은 문단 또는 바로 앞 문단 끝 문장에 같은 표시가 있었으면 짧은 꼴(「이 대운」「이 자리」)
 *  ④ 자리가 셋 이상이면 책에서 처음 한 번만 목록(「세 자리(태어난 해 땅 글자·…)」), 그 뒤는 칸 이름(「세 자리(연지·일지·시지)」).
 */
export function renderMarks(text: string, table: MarkTable | null | undefined, state?: MarkState, scope = ""): string {
  if (state && state.scope !== scope) { state.scope = scope; state.tail = new Set(); }
  const prevTail = state?.tail ?? new Set<string>();
  if (!table?.size || !text.includes("⟦")) { if (state) state.tail = new Set(); return text; }
  const count = state?.count ?? { short: 0, dropped: 0, paren: 0 };
  // ⓪ 브리프 칸 「⟦at:t1⟧ = 태어난 날 기둥(일주)」를 그대로 옮긴 꼴은 표시만 남긴다(W5 1차 종합 「태어난 날 기둥(일주) = 태어난 날 기둥(일주)이」).
  const src0 = (() => {
    const re = new RegExp(`(${MARK_RE.source})\\s*=\\s*`, "g"); let out = "", i = 0, x: RegExpExecArray | null;
    while ((x = re.exec(text))) {
      const m = table.get(`${x[2]}:${x[3]}`), rest = text.slice(x.index + x[0].length);
      const hit = m && [m.list ?? "", m.text, placeCore(m.text)].find(t => t && rest.startsWith(t));
      if (hit) { out += text.slice(i, x.index) + x[1]; i = x.index + x[0].length + hit.length; re.lastIndex = i; count.dropped++; }
    }
    return out + text.slice(i);
  })();
  // ⓪' 「…에 백호대살이 있는데, 이 자리는 ⟦at⟧입니다」처럼 문장 앞쪽이 이미 그 자리를 말했으면 뒤 마디(「이 자리는 ⟦at⟧입니다」)는 군말이다 — 마디를 떼고 앞 동사로 맺는다(W6 S4 1차 종합 「이 자리는 이 자리입니다」).
  const src00 = src0.replace(new RegExp(`(있|앉아 있|자리하고 있|자리 잡고 있|들어 있)(?:고|는데|으며|으니),\\s*(?:이|그) 자리(?:는|가) (${MARK_RE.source})(?:이에요|예요|입니다)\\.`, "g"), (all: string, verb: string, _mk: string, kind: string, id: string, offset: number, whole: string) => {
    const m = table.get(`${kind}:${id}`); if (!m) return all;
    const start = Math.max(whole.lastIndexOf(".", offset), whole.lastIndexOf("?", offset), whole.lastIndexOf("!", offset)) + 1, before = whole.slice(start, offset).replace(MARK_RE, "");
    if (!(m.codes?.some(c => before.includes(c)) || before.includes(placeCore(m.text)))) return all;
    count.dropped++; return `${verb}어요.`;
  });
  // ⓪'' 작가가 자리를 글로 쓴 바로 뒤에 표시를 붙인 꼴(「태어난 해 하늘 글자와 달 땅 글자 ⟦at:t3⟧에 편관이」「태어난 달 땅 글자의 ⟦at:t5⟧에는」) — 표시를 떼고 작가 말에 조사를 맞춘다.
  const src01 = src00.replace(new RegExp(`((?:태어난 )?(?:해|달|날|시각)[^.?!⟦]{0,30}?(?:(?:하늘|땅) 글자|기둥)(?:\\([^()]*\\))?)(의)?\\s+⟦at:([0-9a-z]{1,12})⟧(${PARTICLE_ALT})?`, "g"), (all: string, words: string, ui: string | undefined, id: string, p: string | undefined, offset: number, whole: string) => {
    if (!table.get(`at:${id}`)) return all;
    // 「…글자의 ⟦at⟧에는」처럼 표시 바로 뒤에 조사가 붙으면 「의」는 버린다(뒤가 띄어 쓴 이름이면 「의」를 둔다).
    count.dropped++; return words + (p ? fixParticle(words, p) : ui && !/^[가-힣]/.test(whole.slice(offset + all.length)) ? ui : "");
  });
  // ⓪‴ W6 S4(2차 궁합 6장): 작가가 두 사람 자리를 글로 쓰고 관계 표시를 붙인 꼴(「도윤님의 해와 하린님의 자 사이에는 ⟦rel:7⟧도」) — 작가 자리 말(틀릴 수 있음)을 표시의 자리 구절로 바꾸고 관계 이름만 남긴다.
  const src02 = src01.replace(new RegExp(`([가-힣]{1,6}님의 [^.?!,⟦]{1,24}(?:와|과) [가-힣]{1,6}님의 [^.?!,⟦]{1,24} 사이에(는)? )⟦rel:([0-9a-z]{1,12})⟧(${PARTICLE_ALT})?`, "g"), (all: string, _w: string, neun: string | undefined, id: string, p?: string) => {
    // 자르기는 끝 풀이 괄호 밖의 마지막 「 사이의 」에서(S4 2판: 풀이 「(가까운 사이의 작은 서운함)」 안에서 잘라 「사이에는 작은 서운함)이」가 됐다).
    const t = table.get(`rel:${id}`)?.text ?? "", gl = t.match(/\([^()]*\)$/)?.[0] ?? "", base = t.slice(0, t.length - gl.length), k = base.lastIndexOf(" 사이의 "); if (k < 0) return all;
    const loc = base.slice(0, k), name = base.slice(k + 5) + gl;
    count.dropped++; return `${loc} 사이에${neun ?? ""} ${name}${p ? fixParticle(name, p) : ""}`;
  });
  const src = src02.replace(new RegExp(`([가-힣]{1,8})( 대운)?\\((${MARK_RE.source})\\)`, "g"), (all: string, w: string, dae: string | undefined, mk: string, kind: string, id: string) => {
    const m = table.get(`${kind}:${id}`); if (!m) return all;
    count.paren++;
    return m.text.includes(w) || (m.bare ?? "").includes(w) ? mk : `${w}${dae ?? ""}`;
  });
  const ends: number[] = []; for (const x of src.matchAll(/[.?!]+["'”’)⟫]*(?=\s|$)/g)) ends.push(x.index! + x[0].length);
  const sentenceOf = (at: number) => ends.filter(e => e <= at).length;
  const sentenceStart = (si: number) => (si === 0 ? 0 : ends[si - 1]);
  const inPara = new Set<string>(), used: [string, number][] = [], rendered: { si: number; text: string; short: string }[] = [];
  const out = src.replace(new RegExp(`${MARK_RE.source}(?:(${PARTICLE_ALT})|(의 ))?`, "g"), (...g: unknown[]) => {
    const [all, kind, id, p, gen] = g as [string, string, string, string | undefined, string | undefined], at = g[g.length - 2] as number, whole = g[g.length - 1] as string;
    const key = `${kind}:${id}`, m = table.get(key);
    if (!m) return all;
    const si = sentenceOf(at), before = whole.slice(sentenceStart(si), at).replace(MARK_RE, "");
    const near = inPara.has(key) || prevTail.has(key);
    let t = m.list ? (state?.seen.has(key) ? m.later ?? m.text : m.list) : m.text;
    const endRel0 = whole.slice(at + all.length).search(/[.?!]/), after = whole.slice(at + all.length, endRel0 < 0 ? undefined : at + all.length + endRel0).replace(MARK_RE, "");
    // ⑤ 관계 구절 앞에서 문장이 이미 자리를 말했으면(「두 사람의 태어난 날 땅 글자 사이에는 ⟦rel⟧」「묘와 진 사이에 ⟦in⟧」) 글자만 꼴로.
    if (m.glyph && /(?:하늘|땅) 글자|태어난 (?:해|달|날|시각)|[연월일시](?:간|지)|[가-힣]와 [가-힣] 사이|[가-힣]과 [가-힣] 사이/.test(before.slice(-30))) t = m.glyph;
    // ⑥ 구절 끝 괄호 뜻(「(정재의 10년)」「(가까운 사이의 작은 서운함)」)을 문장 뒤에서 또 말하면 괄호를 뗀다.
    { const pm = t.match(/\(([^()]+)\)$/); if (pm && pm[1].length >= 4 && after.replace(/\s/g, "").includes(pm[1].replace(/\s/g, ""))) { t = t.slice(0, -pm[0].length); count.dropped++; } }
    // ② 바로 앞에 같은 자리 말.
    const prev0 = si > 0 ? whole.slice(sentenceStart(si - 1), sentenceStart(si)) : "";
    // 앞 문장의 다른 표시가 같은 구절로 바뀌는 경우(자리가 같은 두 특성)도 「같은 구절을 썼다」로 본다.
    const prevSentence = prev0.replace(new RegExp(MARK_RE.source, "g"), (x: string, k2: string, i2: string) => table.get(`${k2}:${i2}`)?.text ?? "");
    const tail30 = before.slice(-30);
    // ⑪ W6 S4(2차 궁합·커리어): 자리 표시를 주어·목적어로 쓰면(「⟦at⟧가 이때 작동해서」「⟦at⟧를 떠올려 보세요」) 자리만 남아 무엇이 작동하는지 빠진다 → 「자리의 특성 이름」.
    const named = (x: string) => (m.kind === "at" && m.name && p && /^(?:이|가|을|를)$/.test(p) && !before.slice(-24).includes(m.name) && !after.slice(0, 24).includes(m.name) && !NAMEY.test(after.trimStart()) ? `${x}의 ${m.name}` : x);
    // ④' 바로 앞 문장이 같은 구절을 글로 이미 썼으면(「지금은 을축 대운(정재의 10년)이 …. ⟦un:now⟧은 …」) 짧은 꼴.
    if (m.short && m.kind !== "cnt" && !before.slice(-10).includes(m.short) && (prevSentence.includes(m.text) || m.codes?.some(c => prevSentence.includes(c)))) { t = named(m.short); count.short++; inPara.add(key); used.push([key, si]); state?.seen.add(key); return t + (p ? fixParticle(t, p) : gen ? "의 " : ""); }
    if (m.codes?.some(c => tail30.includes(c)) || (m.kind === "at" && tail30.includes(placeCore(m.text)))) {
      count.dropped++; used.push([key, si]); inPara.add(key);
      if (gen) return "";
      // 짧은 꼴이 바로 앞 말과 같으면(「이 자리는 이 자리입니다」) 구절 그대로 둔다(깨진 문장 검사가 겹침을 본다).
      if (m.short && !before.slice(-10).includes(m.short)) t = m.short;
    } else if (near && m.short && !before.slice(-10).includes(m.short)) { t = m.short; count.short++; }
    else if (m.bare) {
      // R4 판독 책(1차 궁합): 신살 주인을 문장이 이미 말했으면(같은 문장에 「두 사람 모두·둘 다」, 바로 앞에 주인 이름) 이름만 넣는다.
      const endRel = whole.slice(at).search(/[.?!]/);
      const sentence = (before + whole.slice(at + all.length, endRel < 0 ? undefined : at + endRel)).replace(MARK_RE, "");
      if (/두 사람 모두|두 분 모두|둘 다|두 사람에게|두 사람의 사주/.test(sentence) || (m.owner && whole.slice(Math.max(0, at - 12), at).includes(m.owner))) t = m.bare;
    }
    // ⑦ W6 S4(1차 궁합): 주인 이름을 문장이 이미 불렀으면 구절 앞 「○○님의 」를 뗀다(「장덕민님의 바탕은 장덕민님의 태어난 날 기둥…」).
    if (m.owner && t.startsWith(`${m.owner}의 `) && before.includes(m.owner)) t = t.slice(m.owner.length + 2);
    // ⑦' W6 S4(2차 궁합 6장): 「도윤님의 사주에는 ⟦rel⟧」 — 구절 앞 「도윤님 사주 안의 」가 앞말과 겹친다.
    { const o = t.match(/^([가-힣]{1,6}님) 사주 안의 /); if (o && before.slice(-16).includes(o[1]) && /사주(?:에는|에|엔|의) ?$/.test(before)) t = t.slice(o[0].length); }
    // ⑧ 일주 표시 바로 뒤에 작가가 간지를 또 썼으면(「⟦ju:a⟧ 갑신이에요」) 표시를 떼고 작가 말을 둔다.
    if (m.kind === "ju") { const g = (m.bare ?? "").split(" ")[0]; if (g && whole.slice(at + all.length).trimStart().startsWith(g) && !p && !gen) { inPara.add(key); used.push([key, si]); state?.seen.add(key); return ""; } }
    // ⑨ 서로 보는 십성: 앞에 「A님에게」가 있으면 받는 사람 이름만, 뒤에서 십성 이름을 또 말하면 「A님에게 B님」만(「장덕민님에게 정재인 최지우님은 정재의 자리예요」).
    if (m.kind === "tg") { const x = t.match(/^(.+?)에게 (.+?)인 (.+)$/); if (x) { if (before.slice(-14).includes(`${x[1]}에게`)) t = x[3]; else if (after.includes(x[2])) t = `${x[1]}에게 ${x[3]}`; } }
    inPara.add(key); used.push([key, si]); state?.seen.add(key);
    if (m.short && t.length >= 8) rendered.push({ si, text: t, short: m.short });
    t = named(t);
    return t + (p ? fixParticle(t, p) : gen ? "의 " : "");
  }).replace(/ {2,}/g, " ");
  // ⑩ 앞 문장에서 렌더한 구절을 작가가 다음 문장에서 글로 또 쓰면(1차 커리어 「…(연간)와 …(월지)에 걸친 정재는」) 뒤의 것을 짧은 꼴로.
  const fixed = rendered.length ? (() => {
    const sens = out.match(/[^.!?]+[.!?]+["'”’)⟫]*\s*|[^.!?]+$/g) ?? [out];
    for (const r of rendered) { const j = r.si + 1; if (j >= sens.length) continue; const i = sens[j].indexOf(r.text); if (i < 0) continue;
      const pm = sens[j].slice(i + r.text.length).match(new RegExp(`^(${PARTICLE_ALT})`)); const p2 = pm?.[1];
      sens[j] = sens[j].slice(0, i) + r.short + (p2 ? fixParticle(r.short, p2) : "") + sens[j].slice(i + r.text.length + (p2?.length ?? 0)); count.short++; }
    return sens.join("");
  })() : out;
  if (state) { const last = ends.length && ends[ends.length - 1] >= src.trimEnd().length ? ends.length - 1 : ends.length; state.tail = new Set(used.filter(([, si]) => si === last).map(([k]) => k)); }
  return fixed;
}

const relPlain = (r: Pick<RelationFact, "kind" | "completeness" | "subtype">) =>
  r.kind === "HYEONG" && r.subtype === "삼형" && r.completeness === "full" ? SAMHYEONG_PLAIN
    : r.kind === "SAMHAP" && r.completeness === "half" ? HALF_HAP_PLAIN
      : REL_PLAIN[r.kind] ?? relationName(r.kind as never, r.completeness as never, r.subtype);
const wa = (w: string) => `${w}${finalSound(w) === "none" ? "와" : "과"}`;
const iga = (w: string) => `${w}${finalSound(w) === "none" ? "가" : "이"}`;
/** 한 사람의 자리·글자: 「태어난 해·달 땅 글자 묘·미」. */
function sideText(members: readonly RelationFact["members"][number][], sky: boolean): string {
  const places = [...new Set(members.map(m => PLACE[m.where.split(" ").pop() ?? ""] ?? m.where))];
  const glyphs = [...new Set(members.map(m => HANGUL[m.char] ?? m.char))];
  return `태어난 ${places.join("·")} ${sky ? "하늘" : "땅"} 글자 ${glyphs.join("·")}`;
}
/** 한 사람 사주 안 관계 구절. 두 자리면 「A와 B 사이의 X」, 셋 이상이면 「태어난 해·달·날 땅 글자 인·오·술이 모인 X」. */
function insideText(r: RelationFact): string {
  const sky = SKY.has(r.kind), plain = relPlain(r);
  const byPlace = new Map<string, RelationFact["members"][number][]>();
  for (const m of r.members) { const k = m.where.split(" ").pop() ?? m.where; byPlace.set(k, [...(byPlace.get(k) ?? []), m]); }
  if (byPlace.size === 2 && r.members.length === 2) {
    const [x, y] = r.members;
    return `${wa(sideText([x], sky))} ${sideText([y], sky)} 사이의 ${plain}`;
  }
  return `${iga(sideText(r.members, sky))} 모인 ${plain}`;
}
/** W6: 관계의 글자만 꼴(「신과 해 사이의 해(가까운 사이의 작은 서운함)」, 셋 이상은 「인·오·술이 모인 삼합(…)」) — 문장이 자리를 이미 말했을 때 렌더가 쓴다. */
function glyphText(r: RelationFact): string {
  const gs = [...new Set(r.members.map(m => HANGUL[m.char] ?? m.char))];
  return gs.length === 2 ? `${wa(gs[0])} ${gs[1]} 사이의 ${relPlain(r)}` : `${iga(gs.join("·"))} 모인 ${relPlain(r)}`;
}
/** 두 사람 사이 관계 구절: 「장덕민님의 태어난 날 땅 글자 신과 최지우님의 태어난 날 땅 글자 해 사이의 해(가까운 사이의 작은 서운함)」. */
function pairText(r: RelationFact, people: readonly { name: string; call: string }[]): string {
  const sky = SKY.has(r.kind);
  const of = (p: { name: string }) => r.members.filter(m => m.where.startsWith(`${p.name} `));
  const [a, b] = people, ma = of(a), mb = of(b);
  if (!ma.length || !mb.length) return relPlain(r);
  return `${a.call}의 ${wa(sideText(ma, sky))} ${b.call}의 ${sideText(mb, sky)} 사이의 ${relPlain(r)}`;
}

/** 두 사람 사이 관계 줄(브리프 relationsPlain과 같은 순서 = 엔진 영향 큰 순). 정답지는 천간충을 따로 두므로 요약 이름 순서로 다시 섞는다. */
function pairRows(sheet: FactSheet, brief: Brief): { r: RelationFact; flow?: string }[] {
  const p = sheet.pair; if (!p) return [];
  const names = brief.compatibility?.relationsSummary?.names ?? [], lines = brief.compatibility?.relationsPlain ?? [];
  const rel = [...p.relations], sc = [...p.stemClashes], out: { r: RelationFact; flow?: string }[] = [];
  if (names.length === rel.length + sc.length) {
    names.forEach((n, i) => { const r = n === "천간충" ? sc.shift() : rel.shift(); if (r) out.push({ r, flow: lines[i]?.split(/관계예요\.\s*/)[1]?.replace(/이에요\.$/, "") }); });
    return out;
  }
  return [...p.relations, ...p.stemClashes].map(r => ({ r }));
}

/** 특성 자리(브리프 traits[].at과 같은 값, prompt/index.ts traitAtMap)는 placeForms로 줄인다(「A · B」는 「A와 B」). */
const COUNT_KO = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟"];
/**
 * W6 A1: 자리 목록 줄이기 — 같은 기둥의 하늘·땅 글자가 다 있으면 「태어난 달 기둥(월주)」 하나로, 칸 이름(월간·일지)은 겹침 판정용으로 따로.
 * 셋 이상이면 목록 꼴(처음 한 번)·칸 이름 꼴(그 뒤)·짧은 꼴(「이 세 자리」).
 */
export function placeForms(at: string): { text: string; codes: string[]; short: string; list?: string; later?: string } {
  const xs = at.split(" · ").filter(Boolean);
  const parsed = xs.map(x => { const m = x.match(/^(태어난 (?:해|달|날|시각)) (하늘|땅) 글자\(([연월일시])(간|지)\)$/); return m ? { x, pillar: m[1], sky: m[2] === "하늘", head: m[3] } : { x, pillar: "", sky: false, head: "" }; });
  const out: { text: string; code: string }[] = [];
  for (const p of parsed) {
    if (!p.pillar) { out.push({ text: p.x, code: p.x.match(/\(([^()]+)\)$/)?.[1] ?? "" }); continue; }
    const pair = parsed.find(q => q !== p && q.pillar === p.pillar && q.sky !== p.sky);
    if (pair) { if (!p.sky) continue; out.push({ text: `${p.pillar} 기둥(${p.head}주)`, code: `${p.head}주` }); continue; }
    out.push({ text: p.x, code: `${p.head}${p.sky ? "간" : "지"}` });
  }
  const codes = out.map(o => o.code).filter(Boolean), n = out.length;
  const short = n <= 1 ? "이 자리" : `이 ${COUNT_KO[n] ?? n} 자리`;
  if (n >= 3) return { text: out.map(o => o.text).join(", "), codes, short, list: `${COUNT_KO[n] ?? n} 자리(${out.map(o => o.text.replace(/\([^()]*\)$/, "")).join("·")})`, later: `${COUNT_KO[n] ?? n} 자리(${codes.join("·")})` };
  return { text: n === 2 ? `${wa(out[0].text)} ${out[1].text}` : out.map(o => o.text).join(""), codes, short };
}

/** 정답지 + 브리프 → 표시 표(작가 브리프와 발행 렌더가 같은 표를 쓴다). 4종(brief.design)만. */
export function buildMarks(sheet: FactSheet | null | undefined, brief: Brief, traitAt: ReadonlyMap<string, string>): MarkTable {
  const out = new Map<string, Mark>();
  if (!sheet || !brief.design) return out;
  const add = (kind: MarkKind, id: string, text: string, flow?: string, extra: Partial<Pick<Mark, "bare" | "owner" | "short" | "codes" | "list" | "later" | "glyph">> = {}) => out.set(`${kind}:${id}`, { key: `${kind}:${id}`, kind, text, ...(flow ? { flow } : {}), ...extra });
  const compat = Boolean(sheet.pair && brief.compatibility && sheet.people.length === 2);
  const calls = compat ? [brief.compatibility!.a.callName, brief.compatibility!.b.callName] : [brief.person.callName];
  const people = sheet.people.map((p, i) => ({ name: p.name, call: calls[i] ?? `${p.name}님` }));
  if (compat) {
    const rows = pairRows(sheet, brief);
    rows.forEach((x, i) => add("rel", String(i + 1), pairText(x.r, people), x.flow, { short: "이 관계", glyph: glyphText(x.r) }));
    const hap = rows.filter(x => isHapKind(x.r.kind)).length;
    add("cnt", "all", `${rows.length}가지`); add("cnt", "hap", `${hap}가지`); add("cnt", "clash", `${rows.length - hap}가지`);
  }
  sheet.people.forEach((p: PersonFacts, i) => {
    [...p.relations, ...p.stemClashes].forEach((r, j) => add("in", compat ? `${"ab"[i]}${j + 1}` : String(j + 1), compat ? `${people[i].call} 사주 안의 ${insideText(r)}` : insideText(r), undefined, { short: "이 관계", glyph: glyphText(r) }));
  });
  if (compat) {
    const [a, b] = sheet.people, names = [...new Set([...a.shinsal, ...b.shinsal].map(s => s.name))];
    names.forEach((n, i) => {
      const ha = a.shinsal.some(s => s.name === n), hb = b.shinsal.some(s => s.name === n);
      add("star", String(i + 1), ha && hb ? `두 사람 모두에게 있는 ${n}` : `${people[ha ? 0 : 1].call}의 ${n}`, undefined, { bare: n, short: n, ...(ha && hb ? {} : { owner: people[ha ? 0 : 1].call }) });
    });
    // W6 A3: 일주 이름(「장덕민님의 일지 갑신」 — 땅 글자 자리를 기둥 이름으로)과 서로 보는 십성(「정관의 눈으로」 — 보는 방향)도 표시로.
    sheet.people.forEach((p, i) => { const g = p.pillars.day?.ganjiKo; if (g) add("ju", "ab"[i], `${people[i].call}의 태어난 날 기둥(일주) ${g}`, undefined, { bare: `${g} 일주`, short: `${g} 일주`, owner: people[i].call }); });
    const c = brief.compatibility!, tgKo = (x: string) => x.replace(/\s?\([^)]*\)/g, "");
    if (c.tenGodAB?.tenGod) add("tg", "ab", `${people[0].call}에게 ${tgKo(c.tenGodAB.tenGod)}인 ${people[1].call}`, undefined, { short: people[1].call });
    if (c.tenGodBA?.tenGod) add("tg", "ba", `${people[1].call}에게 ${tgKo(c.tenGodBA.tenGod)}인 ${people[0].call}`, undefined, { short: people[0].call });
  }
  // R4(1차 종합): 자리가 없는 특성(빈 at)은 표에 넣지 않는다 — 작가가 지어 쓴 ⟦at:t12⟧가 빈칸으로 바뀌어 「의 지키는 힘이…」 조각이 됐다. 없는 번호는 fact_mark로 떼어진다.
  for (const [id, at] of traitAt) if (at.trim()) {
    const f = placeForms(at), who = compat && /^[ab]/.test(id) ? `${people[id.startsWith("a") ? 0 : 1].call}의 ` : "";
    add("at", id, `${who}${f.text}`, undefined, { short: f.short, codes: f.codes, ...(who ? { owner: who.replace(/의 $/, "") } : {}), ...(f.list ? { list: `${who}${f.list}`, later: `${who}${f.later}` } : {}) });
  }
  const cd = compat ? null : brief.chart.currentDayun;
  if (cd) {
    // W6: 십성 이름의 한자 괄호는 뗀다(「(정재(正財)의 10년)」 겹괄호면 뜻 괄호 떼기 ⑥이 못 본다 — 한자는 렌더 단계가 붙인다).
    const han = (x: string) => x.replace(/\s?\([一-鿿]+\)/g, "");
    add("un", "now", `${cd.ganji.hangul} 대운(${han(cd.tenGod)}의 10년)`, undefined, { short: "이 대운", codes: [`${cd.ganji.hangul} 대운`] });
    if (cd.next) add("un", "next", `${cd.next.ganji.hangul} 대운(${han(cd.next.tenGod)}의 10년)`, undefined, { short: "다음 대운", codes: [`${cd.next.ganji.hangul} 대운`] });
  }
  return out;
}

/** 작가 브리프 칸(marks): 표시 → 구절 목록. 자리(at)는 traits[].at 칸에 표시와 함께 준다(여기 목록에는 없음). */
export const MARK_RULE = "⟦…⟧는 시스템이 오른쪽 구절로 바꿔 넣는 사실 표시다. 표시는 완성된 명사구라 문장 속에 그대로 넣고, 괄호 안에 넣거나 앞뒤에 같은 자리·이름을 다시 쓰지 않는다. 근거 이름(신살·십성·관계)은 그대로 쓰되, 그 자리·주인·개수·두 사람 사이 관계를 말할 때는 구절을 옮기거나 바꿔 쓰지 말고 표시를 쓴다(뒤 조사는 아무거나 — 시스템이 맞춘다). 목록에 없는 관계·주인·자리·대운은 쓰지 않고, 표에 없는 번호를 만들지 않는다(traits[].at에 표시가 없는 특성은 이름으로만). inside는 한 사람 사주 안의 일이라 두 사람 사이 일로 쓰지 않는다";
export function writerMarks(t: MarkTable): Record<string, unknown> | null {
  if (!t.size) return null;
  const list = (kind: MarkKind) => [...t.values()].filter(m => m.kind === kind).map(m => `⟦${m.key}⟧ = ${m.text}${m.flow ? ` — ${m.flow}` : ""}`);
  const rel = list("rel"), cnt = list("cnt"), inside = list("in"), star = list("star"), un = list("un"), ju = list("ju"), tg = list("tg");
  return { rule: MARK_RULE, ...(rel.length ? { between: rel } : {}), ...(cnt.length ? { counts: cnt.map(s => s.replace(/^(⟦cnt:all⟧ = [^—]+)$/, "$1(두 사람 사이 관계 모두)").replace(/^(⟦cnt:hap⟧ = .+)$/, "$1(그중 합)").replace(/^(⟦cnt:clash⟧ = .+)$/, "$1(그중 형·충·파·해)")) } : {}),
    ...(inside.length ? { inside } : {}), ...(star.length ? { owners: star } : {}), ...(un.length ? { dayun: un } : {}), ...(ju.length ? { dayPillars: ju } : {}), ...(tg.length ? { views: tg } : {}) };
}
