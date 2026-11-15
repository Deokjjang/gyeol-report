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

export type MarkKind = "rel" | "cnt" | "in" | "star" | "at" | "un";
export type Mark = { readonly key: string; readonly kind: MarkKind; readonly text: string; readonly flow?: string };
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
const PARTICLE_RE = new RegExp(`^(${PARTICLES.flat().sort((a, b) => b.length - a.length).join("|")})`);
export function fixParticle(phrase: string, p: string): string {
  const s = finalSound(phrase), pair = PARTICLES.find(x => x.includes(p));
  if (!pair) return p;
  if (pair[0] === "으로") return s === "other" ? "으로" : "로";
  return s === "none" ? pair[1] : pair[0];
}

/** ⟦종류:번호⟧ — 번호는 영문 소문자·숫자 1~12자. */
export const MARK_RE = /⟦(rel|cnt|in|star|at|un):([0-9a-z]{1,12})⟧/g;
/** 바꾼 뒤에도 남은 표시 흔적(모르는 표시·깨진 표시·꺾쇠만 남은 것·대괄호로 바꿔 쓴 것). */
export const MARK_LEFT = /⟦|⟧|\[\[?(?:rel|cnt|in|star|at|un):[0-9a-z]{1,12}\]?\]|(?<![A-Za-z])(?:rel|cnt|star|un):[0-9a-z]{1,8}(?![A-Za-z0-9])/;

/** 표시를 구절로 바꾼다. 바로 뒤 조사(은/는·이/가·을/를·와/과·으로/로·이에요/예요 등)는 받침에 맞춘다. 모르는 표시는 그대로 둔다(검사가 잡는다). */
export function renderMarks(text: string, table: MarkTable | null | undefined): string {
  if (!table?.size || !text.includes("⟦")) return text;
  return text.replace(new RegExp(`${MARK_RE.source}(${PARTICLE_RE.source.slice(1)})?`, "g"), (all, kind: string, id: string, p?: string) => {
    const m = table.get(`${kind}:${id}`);
    if (!m) return all;
    return m.text + (p ? fixParticle(m.text, p) : "");
  });
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

/** 특성 자리(브리프 traits[].at과 같은 값, prompt/index.ts traitAtMap). 「A · B」는 「A와 B」로. */
const naturalAt = (at: string) => { const xs = at.split(" · ").filter(Boolean); return xs.length === 2 ? `${wa(xs[0])} ${xs[1]}` : xs.join(", "); };

/** 정답지 + 브리프 → 표시 표(작가 브리프와 발행 렌더가 같은 표를 쓴다). 4종(brief.design)만. */
export function buildMarks(sheet: FactSheet | null | undefined, brief: Brief, traitAt: ReadonlyMap<string, string>): MarkTable {
  const out = new Map<string, Mark>();
  if (!sheet || !brief.design) return out;
  const add = (kind: MarkKind, id: string, text: string, flow?: string) => out.set(`${kind}:${id}`, { key: `${kind}:${id}`, kind, text, ...(flow ? { flow } : {}) });
  const compat = Boolean(sheet.pair && brief.compatibility && sheet.people.length === 2);
  const calls = compat ? [brief.compatibility!.a.callName, brief.compatibility!.b.callName] : [brief.person.callName];
  const people = sheet.people.map((p, i) => ({ name: p.name, call: calls[i] ?? `${p.name}님` }));
  if (compat) {
    const rows = pairRows(sheet, brief);
    rows.forEach((x, i) => add("rel", String(i + 1), pairText(x.r, people), x.flow));
    const hap = rows.filter(x => isHapKind(x.r.kind)).length;
    add("cnt", "all", `${rows.length}가지`); add("cnt", "hap", `${hap}가지`); add("cnt", "clash", `${rows.length - hap}가지`);
  }
  sheet.people.forEach((p: PersonFacts, i) => {
    [...p.relations, ...p.stemClashes].forEach((r, j) => add("in", compat ? `${"ab"[i]}${j + 1}` : String(j + 1), compat ? `${people[i].call} 사주 안의 ${insideText(r)}` : insideText(r)));
  });
  if (compat) {
    const [a, b] = sheet.people, names = [...new Set([...a.shinsal, ...b.shinsal].map(s => s.name))];
    names.forEach((n, i) => {
      const ha = a.shinsal.some(s => s.name === n), hb = b.shinsal.some(s => s.name === n);
      add("star", String(i + 1), ha && hb ? `두 사람 모두에게 있는 ${n}` : `${people[ha ? 0 : 1].call}의 ${n}`);
    });
  }
  for (const [id, at] of traitAt) add("at", id, compat && /^[ab]/.test(id) ? `${people[id.startsWith("a") ? 0 : 1].call}의 ${naturalAt(at)}` : naturalAt(at));
  const cd = compat ? null : brief.chart.currentDayun;
  if (cd) {
    add("un", "now", `${cd.ganji.hangul} 대운(${cd.tenGod}의 10년)`);
    if (cd.next) add("un", "next", `${cd.next.ganji.hangul} 대운(${cd.next.tenGod}의 10년)`);
  }
  return out;
}

/** 작가 브리프 칸(marks): 표시 → 구절 목록. 자리(at)는 traits[].at 칸에 표시와 함께 준다(여기 목록에는 없음). */
export const MARK_RULE = "⟦…⟧는 시스템이 오른쪽 구절로 바꿔 넣는 사실 표시다. 이 사실을 말할 때는 구절을 옮기거나 바꿔 쓰지 말고 표시를 그대로 쓴다(뒤 조사는 아무거나 — 시스템이 맞춘다). 목록에 없는 관계·주인·자리·대운은 쓰지 않는다. inside는 한 사람 사주 안의 일이라 두 사람 사이 일로 쓰지 않는다";
export function writerMarks(t: MarkTable): Record<string, unknown> | null {
  if (!t.size) return null;
  const list = (kind: MarkKind) => [...t.values()].filter(m => m.kind === kind).map(m => `⟦${m.key}⟧ = ${m.text}${m.flow ? ` — ${m.flow}` : ""}`);
  const rel = list("rel"), cnt = list("cnt"), inside = list("in"), star = list("star"), un = list("un");
  return { rule: MARK_RULE, ...(rel.length ? { between: rel } : {}), ...(cnt.length ? { counts: cnt.map(s => s.replace(/^(⟦cnt:all⟧ = [^—]+)$/, "$1(두 사람 사이 관계 모두)").replace(/^(⟦cnt:hap⟧ = .+)$/, "$1(그중 합)").replace(/^(⟦cnt:clash⟧ = .+)$/, "$1(그중 형·충·파·해)")) } : {}),
    ...(inside.length ? { inside } : {}), ...(star.length ? { owners: star } : {}), ...(un.length ? { dayun: un } : {}) };
}
