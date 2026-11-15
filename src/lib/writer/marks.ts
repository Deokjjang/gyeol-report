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
export type Mark = { readonly key: string; readonly kind: MarkKind; readonly text: string; readonly flow?: string; readonly bare?: string; readonly owner?: string; readonly short?: string; readonly codes?: readonly string[]; readonly list?: string; readonly later?: string };
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
const PARTICLES: readonly (readonly [string, string])[] = [["이에요", "예요"], ["이었", "였"], ["이라서", "라서"], ["이라는", "라는"], ["이라고", "라고"], ["이라", "라"], ["으로", "로"], ["은", "는"], ["이", "가"], ["을", "를"], ["과", "와"]];
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
  const src = text.replace(new RegExp(`([가-힣]{1,8})( 대운)?\\((${MARK_RE.source})\\)`, "g"), (all: string, w: string, dae: string | undefined, mk: string, kind: string, id: string) => {
    const m = table.get(`${kind}:${id}`); if (!m) return all;
    count.paren++;
    return m.text.includes(w) || (m.bare ?? "").includes(w) ? mk : `${w}${dae ?? ""}`;
  });
  const ends: number[] = []; for (const x of src.matchAll(/[.?!]+["'”’)⟫]*(?=\s|$)/g)) ends.push(x.index! + x[0].length);
  const sentenceOf = (at: number) => ends.filter(e => e <= at).length;
  const sentenceStart = (si: number) => (si === 0 ? 0 : ends[si - 1]);
  const inPara = new Set<string>(), used: [string, number][] = [];
  const out = src.replace(new RegExp(`${MARK_RE.source}(?:(${PARTICLE_ALT})|(의 ))?`, "g"), (...g: unknown[]) => {
    const [all, kind, id, p, gen] = g as [string, string, string, string | undefined, string | undefined], at = g[g.length - 2] as number, whole = g[g.length - 1] as string;
    const key = `${kind}:${id}`, m = table.get(key);
    if (!m) return all;
    const si = sentenceOf(at), before = whole.slice(sentenceStart(si), at).replace(MARK_RE, "");
    const near = inPara.has(key) || prevTail.has(key);
    let t = m.list ? (state?.seen.has(key) ? m.later ?? m.text : m.list) : m.text;
    // ② 바로 앞에 같은 자리 말.
    const tail30 = before.slice(-30);
    if (m.codes?.some(c => tail30.includes(c)) || (m.kind === "at" && tail30.includes(placeCore(m.text)))) {
      count.dropped++; used.push([key, si]); inPara.add(key);
      if (gen) return "";
      t = m.short ?? t;
    } else if (near && m.short) { t = m.short; count.short++; }
    else if (m.bare) {
      // R4 판독 책(1차 궁합): 신살 주인을 문장이 이미 말했으면(같은 문장에 「두 사람 모두·둘 다」, 바로 앞에 주인 이름) 이름만 넣는다.
      const endRel = whole.slice(at).search(/[.?!]/);
      const sentence = (before + whole.slice(at + all.length, endRel < 0 ? undefined : at + endRel)).replace(MARK_RE, "");
      if (/두 사람 모두|두 분 모두|둘 다|두 사람에게|두 사람의 사주/.test(sentence) || (m.owner && whole.slice(Math.max(0, at - 12), at).includes(m.owner))) t = m.bare;
    }
    inPara.add(key); used.push([key, si]); state?.seen.add(key);
    return t + (p ? fixParticle(t, p) : gen ? "의 " : "");
  });
  if (state) { const last = ends.length && ends[ends.length - 1] >= src.trimEnd().length ? ends.length - 1 : ends.length; state.tail = new Set(used.filter(([, si]) => si === last).map(([k]) => k)); }
  return out;
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
  const add = (kind: MarkKind, id: string, text: string, flow?: string, extra: Partial<Pick<Mark, "bare" | "owner" | "short" | "codes" | "list" | "later">> = {}) => out.set(`${kind}:${id}`, { key: `${kind}:${id}`, kind, text, ...(flow ? { flow } : {}), ...extra });
  const compat = Boolean(sheet.pair && brief.compatibility && sheet.people.length === 2);
  const calls = compat ? [brief.compatibility!.a.callName, brief.compatibility!.b.callName] : [brief.person.callName];
  const people = sheet.people.map((p, i) => ({ name: p.name, call: calls[i] ?? `${p.name}님` }));
  if (compat) {
    const rows = pairRows(sheet, brief);
    rows.forEach((x, i) => add("rel", String(i + 1), pairText(x.r, people), x.flow, { short: "이 관계" }));
    const hap = rows.filter(x => isHapKind(x.r.kind)).length;
    add("cnt", "all", `${rows.length}가지`); add("cnt", "hap", `${hap}가지`); add("cnt", "clash", `${rows.length - hap}가지`);
  }
  sheet.people.forEach((p: PersonFacts, i) => {
    [...p.relations, ...p.stemClashes].forEach((r, j) => add("in", compat ? `${"ab"[i]}${j + 1}` : String(j + 1), compat ? `${people[i].call} 사주 안의 ${insideText(r)}` : insideText(r), undefined, { short: "이 관계" }));
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
    add("at", id, `${who}${f.text}`, undefined, { short: f.short, codes: f.codes, ...(f.list ? { list: `${who}${f.list}`, later: `${who}${f.later}` } : {}) });
  }
  const cd = compat ? null : brief.chart.currentDayun;
  if (cd) {
    add("un", "now", `${cd.ganji.hangul} 대운(${cd.tenGod}의 10년)`, undefined, { short: "이 대운", codes: [`${cd.ganji.hangul} 대운`] });
    if (cd.next) add("un", "next", `${cd.next.ganji.hangul} 대운(${cd.next.tenGod}의 10년)`, undefined, { short: "다음 대운", codes: [`${cd.next.ganji.hangul} 대운`] });
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
