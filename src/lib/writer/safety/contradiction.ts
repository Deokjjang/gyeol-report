/**
 * W6 A4 같은 사람 안의 모순(출시 차단, 결정론·호출 0) + S1-5 잘못된 연결(합·충 × MBTI 성격, 열등 기능을 강점으로).
 *  - 성격 요약표(브리프 단일 출처): 사람마다 차원 값을 하나로(궁합 성격표 profileCodes를 한 사람 책까지). 한 사람 책은 요약표 값을 「앞에서 이미 말한 끝」으로 삼는다.
 *  - 감지: 같은 사람·같은 행동 차원의 반대 끝 단서(POLE_CUES)가 책 안에서 둘 다 단정으로 나오면, 뒤 문장에 self_contradiction(HARD — 수리 → 남으면 뗀다).
 *    단정이 아닌 것은 뺀다: 물음, 조언(~세요), 가정·통념(라면·흔히·보통은), 바로 뒤 부정(~지 않고·~기보다), 한 문장에 두 끝이 같이 나온 대비(겉은 ~ 속은 ~).
 *    주인: 궁합은 단서 앞 가장 가까운 이름(없으면 뒤 이름), 한 사람 책은 「당신」·이름 또는 다른 사람 말(상대·연인·동료 …)이 없는 문장만.
 */
import { POLE_CUES } from "@/lib/brief/mbtiFn";
import { PROFILE_CUES, type ProfileCodes } from "@/lib/brief/pairProfile";
import { fnStack } from "./style";

export type ContradictionPerson = { readonly names: readonly string[]; readonly label: string; readonly codes?: ProfileCodes | null };
export type ContradictionCtx = { readonly people: readonly ContradictionPerson[]; readonly compat: boolean };
export type SentenceAt = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly sentence: string };
export type ContradictionHit = SentenceAt & { readonly detail: string };

/** 요약표 칸 → 그 값이 가리키는 차원 끝(pairProfile.applyProfile과 같은 대응). */
export function profilePoles(c: ProfileCodes | null | undefined): Map<string, 1 | -1> {
  const out = new Map<string, 1 | -1>(); if (!c) return out;
  const set = (d: string, s: 1 | -1) => out.set(d, s);
  if (c.energy) set("socialEnergy", c.energy === "E" ? 1 : -1);
  if (c.lead) set("attentionSeeking", c.lead === "front" ? 1 : -1);
  if (c.conflict) { set("reactivity", c.conflict === "now" ? 1 : -1); set("conflictApproach", c.conflict === "now" ? 1 : -1); }
  if (c.express === "행동") { set("verbalOutput", -1); set("emotionalExpression", -1); }
  if (c.express === "말") set("verbalOutput", 1);
  if (c.express === "말·표정") { set("verbalOutput", 1); set("emotionalExpression", 1); }
  if (c.decide === "fast") set("decisionSpeed", 1);
  if (c.decide === "slow") set("decisionSpeed", -1);
  // 새 제안 반응(J·P)은 「새것 찾기·위험 감수」와 같은 축이 아니라 씨앗으로 두지 않는다(59권 첫판 오탐 4건: ENTJ의 「안 가 본 동네」 등).
  if (c.money === "plan") set("spendingControl", 1);
  if (c.money === "now") set("spendingControl", -1);
  return out;
}

const QUESTION = /[?？]["'”’)]*$/;
const ADVICE = /(세요|십시오|보세요|해 두세요)[.!]?["'”’)]*$/;
const HYPO = /라면|다면|이라면|흔히|보통은|일반적으로|처럼 보여도|처럼 보이지만|겉으로는|겉은|어떤 사람은|사람마다|라고 (?:하|해|말)|기도 (?:해|하|합)|한 사람 안|(?:는|은) (?:사람|쪽)이 (?:이겨|성과|유리|낫)|(?:쪽|편|게|것)이 (?:좋|낫|안전|편해)|(?:는데|지만|반면),? (?:[EI][NS][TF][JP]|MBTI)(?:는|은|의)/;
/** 조건문(「~하면」): 단서 자체에 든 「면」(「약속이 이어지면 지쳐」)은 빼고 본다. */
const COND = /(?<=[가-힣])(?<!이)면[\s,]/;
const NEG_AFTER = /^[가-힣]{0,3}(지 않|진 않|지 못|기보다|기 전에|는 대신|기는커녕|지는 않)/;
const OTHERS = /상대|연인|배우자|남편|아내|애인|동료|친구|아이|자녀|부모|엄마|아빠|팀원|상사|주변 사람|사람들|그 사람|다른 사람/;
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 차원 끝 단서: POLE_CUES + 궁합 성격표 단서(PROFILE_CUES — 에너지·나섬·다툼·표정·결정, pair_profile에서 다듬은 꼴). */
// 다툼 때 반응 단서(곱씹·나중에 말하·그 자리에서 짚)는 자기 반성·말 순서·직설에도 쓰여 59권에서 오탐만 9건 — 넣지 않는다.
const EXTRA: readonly [string, RegExp][] = [["socialEnergy+", PROFILE_CUES.E], ["socialEnergy-", PROFILE_CUES.I], ["attentionSeeking+", PROFILE_CUES.front], ["attentionSeeking-", PROFILE_CUES.back],
  // W6 S4(1차 궁합 4장 「장덕민님은 새롭고 처음 접하는 것에 끌리는 편」 ↔ 8장 「늘 하던 방식을 바꾸지 않는 편은 두 사람 모두에게」).
  ["noveltySeeking+", /새롭고 처음 접하는 것에|처음 접하는 것에 끌리|새로운 것에 (?:먼저 )?끌리/],
  ["emotionalExpression+", new RegExp(`${PROFILE_CUES.face.source}|기분이 (?:표정에|얼굴에) (?:바로 |곧바로 )?(?:묻어|드러)`)], ["decisionSpeed+", PROFILE_CUES.fast], ["decisionSpeed-", PROFILE_CUES.slow],
  // W6 S4(2차 커리어 1장): 커리어 증거 「의사결정: 규정과 선례를 먼저 확인하고 정하는 절차형」이 성격표 「결정이 빠른 편」과 반대.
  ["decisionSpeed-", /(?:의사결정|결정)(?:은|이)? [^.?!]{0,10}(?:규정과 선례를|선례를) 먼저 확인하고 정하|확인하고 정하는 절차형/],
  // W6 S4(2차 궁합 2장): 「둘 다 … 서운해도 말을 고르는 데 시간이 걸려요」 ↔ 성격표 「그 자리에서 말하는 편」.
  ["conflictApproach-", /말을 고르는 데 시간이 (?:걸리|걸려|오래)/]];
const CUES = [...Object.entries(POLE_CUES), ...EXTRA].map(([key, re]) => ({ dim: key.slice(0, -1), pole: (key.endsWith("+") ? 1 : -1) as 1 | -1, re: new RegExp(re.source, "g") }));

function ownerOf(s: string, start: number, ctx: ContradictionCtx, end = start): number {
  if (!ctx.compat) {
    const self = ctx.people[0]; if (!self) return -1;
    const named = /당신/.test(s) || self.names.some(n => s.includes(n));
    return named || !OTHERS.test(s) ? 0 : -1;
  }
  let best = -1, at = -1, nextBest = -1, nextAt = Infinity;
  ctx.people.forEach((p, i) => { for (const n of p.names) { const re = new RegExp(esc(n), "g"); let m: RegExpExecArray | null; while ((m = re.exec(s))) { if (m.index < start && m.index >= at) { at = m.index; best = i; } if (m.index >= start && m.index < nextAt) { nextAt = m.index; nextBest = i; } } } });
  if (/두 사람(은|이|도|모두)|둘 다/.test(s.slice(Math.max(0, at), start))) return -1;
  // 「~하는 [이름]」(꾸밈)은 뒤 이름이 주인(pair_profile ownersAt과 같은 꼴).
  if (nextBest >= 0) { const gap = s.slice(end, nextAt); if (gap.length <= 16 && !/[,.!?]/.test(gap) && /(는|은|한|던|인|운|된)\s*(쪽은|사람은|편은|쪽이|사람이)?\s*$/.test(gap)) return nextBest; }
  return best >= 0 ? best : nextBest;
}

/** 문장 속 단정된 차원 끝(주인별). 대비 문장(한 사람에게 두 끝)은 뺀다. */
export function assertedPoles(s: string, ctx: ContradictionCtx): { who: number; dim: string; pole: 1 | -1; cue: string }[] {
  const t = s.replace(/[⟪⟫]/g, "").trim();
  if (QUESTION.test(t) || ADVICE.test(t) || HYPO.test(t)) return [];
  const spans: [number, number][] = []; for (const c of CUES) for (const m of t.matchAll(new RegExp(c.re.source, "g"))) spans.push([m.index!, m.index! + m[0].length]);
  for (const m of t.matchAll(new RegExp(COND.source, "g"))) if (!spans.some(([a, b]) => m.index! >= a && m.index! < b)) return [];
  const out: { who: number; dim: string; pole: 1 | -1; cue: string }[] = [];
  for (const c of CUES) {
    c.re.lastIndex = 0; let m: RegExpExecArray | null;
    while ((m = c.re.exec(t))) {
      if (NEG_AFTER.test(t.slice(m.index + m[0].length))) continue;
      // 궁합: 「두 사람 모두에게·둘 다」가 단서를 받으면 두 사람 모두의 단정이다.
      const mm = m;
      if (ctx.compat && (/두 사람 모두|둘 다|두 사람 다/.test(t.slice(mm.index + mm[0].length, mm.index + mm[0].length + 24) + t.slice(Math.max(0, mm.index - 16), mm.index)) || (/^(?:두 사람(?:은|이|도| 모두)|둘 다) /.test(t) && !ctx.people.some(p => p.names.some(n => t.includes(n)))))) { ctx.people.forEach((_, i) => out.push({ who: i, dim: c.dim, pole: c.pole, cue: mm[0] })); continue; }
      const who = ownerOf(t, m.index, ctx, m.index + m[0].length); if (who < 0) continue;
      out.push({ who, dim: c.dim, pole: c.pole, cue: m[0] });
    }
  }
  return out.filter(x => !out.some(y => y.who === x.who && y.dim === x.dim && y.pole !== x.pole));
}

/** 책 순서로 문장을 받아 같은 사람·같은 차원 반대 끝 단정을 찾는다(뒤 문장에 단다). 한 사람 책은 요약표 값을 먼저 둔다. */
export function contradictionFlags(sentences: readonly SentenceAt[], ctx: ContradictionCtx): ContradictionHit[] {
  const first = new Map<string, { pole: 1 | -1; where: string; at: string; cue: string }>();
  ctx.people.forEach((p, i) => { for (const [d, s] of profilePoles(p.codes)) first.set(`${i}|${d}`, { pole: s, where: "성격 요약표", at: "profile", cue: `${p.label} ${d}${s > 0 ? "+" : "−"}` }); });
  const out: ContradictionHit[] = [];
  for (const x of sentences) {
    for (const a of assertedPoles(x.sentence, ctx)) {
      const k = `${a.who}|${a.dim}`, was = first.get(k);
      if (!was) { first.set(k, { pole: a.pole, where: `${x.chapter}장`, at: `${x.chapter}.${x.section}`, cue: a.cue }); continue; }
      // 같은 절 안에서 바로 대비해 풀어 쓴 것(「그런데 ESTP의 결은 …」)은 모순이 아니라 설명된 긴장이다 — 장·절이 다를 때만.
      if (was.pole !== a.pole && was.at !== `${x.chapter}.${x.section}`) { out.push({ ...x, detail: `${ctx.people[a.who]?.label ?? ""} ${a.dim}: ${was.where}에서 「${was.cue}」 쪽인데 「${a.cue}」(반대 끝)` }); break; }
    }
  }
  return out;
}

/** S1-5: 관계(합·충·형·해·파·원진)를 MBTI 성격과 잇는 문장(한 사람 책). 같은 문장, 또는 「이 성향이 …」로 앞 문장의 MBTI 성향을 받는 문장. */
// 「해진 형식」(정해진 형식) 오탐: 글자 짝 관계 말은 앞뒤가 낱말 경계일 때만.
const RELATION_TERM = /(삼합|반합|육합|방합|천간합|천간충|원진|삼형|(?<![가-힣])[자축인묘진사오미신유술해]{2} ?(?:충|형|파|합)(?=[이가은는을를의과와도에]?(?:[\s,.(]|$))|(?:^|[.!?] )(?:파|충|형)(?=[은는이가] ))/;
const LEANS_TRAIT = /^(이 성향|이런 성향|그 성향|이 기질|이 유형의|이 힘이|이 판단)/;
export function relationLink(sen: string, prev: string | undefined, mbtiAnchor: RegExp | null): string | null {
  if (!mbtiAnchor) return null;
  const rel = sen.match(RELATION_TERM); if (!rel) return null;
  if (mbtiAnchor.test(sen)) return `「${rel[1]}」와 MBTI 성향을 한 문장에서 이음`;
  if (prev && LEANS_TRAIT.test(sen.trim()) && mbtiAnchor.test(prev)) return `「${rel[1]}」를 앞 문장의 MBTI 성향과 이음`;
  return null;
}
/** W6 S4(1차 종합 1장): 관계 문장 바로 뒤(2문장 안)에서 MBTI 성향과 「만나서·겹쳐·합쳐」 잇는 꼴 — 「현장에서 바로 시험하는 ISTP의 손과 한곳으로 몰리는 힘이 만나서」. */
const COMBINE = /만나(?:서|면|니)|겹쳐|겹치|합쳐|합치|더해져|맞물려|같은 (?:방향|쪽)을 (?:가리|향)|닮아 있|닮았|방식이 비슷|결이 같|[과와]도 (?:잘 )?맞(?:아|습|는)|(?:이|그) 힘을 (?:더 )?(?:키우|키웁|키워)/;
export function relationLinkAfter(sen: string, prev: string | undefined, mbtiAnchor: RegExp | null): string | null {
  if (!mbtiAnchor || !prev || !mbtiAnchor.test(sen) || !COMBINE.test(sen) || RELATION_TERM.test(sen)) return null;
  const rel = prev.match(RELATION_TERM); return rel ? `앞 문장의 「${rel[1]}」를 MBTI 성향과 이음` : null;
}
/** S1-5: MBTI 열등 기능을 강점으로(「주변 마음 살피기(Fe)가 강점」). */
export function inferiorAsStrength(sen: string, type: string | null | undefined, plain: Readonly<Record<string, string>>): string | null {
  const st = type ? fnStack(type) : null; if (!st) return null;
  const inf = st[3], name = plain[inf];
  const at = sen.search(new RegExp(`\\(${inf}\\)|(?<![A-Za-z])${inf}(?![A-Za-z])${name ? `|${esc(name)}` : ""}`)); if (at < 0) return null;
  const rest = sen.slice(at, at + 40);
  if (/늦|서툴|약하|약한|어렵|부족|덜|막히|자라는|키우는|연습|익히/.test(sen)) return null;
  return /강점|타고난|뛰어나|잘하는|힘이 세|가장 센|주무기/.test(rest) ? `${type} 열등 기능 ${inf}를 강점으로` : null;
}
