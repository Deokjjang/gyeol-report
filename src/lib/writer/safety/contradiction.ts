/**
 * W6 A4 같은 사람 안의 모순(출시 차단, 결정론·호출 0) + S1-5 잘못된 연결(합·충 × MBTI 성격, 열등 기능을 강점으로).
 *  - 성격 요약표(브리프 단일 출처): 사람마다 차원 값을 하나로(궁합 성격표 profileCodes를 한 사람 책까지). 한 사람 책은 요약표 값을 「앞에서 이미 말한 끝」으로 삼는다.
 *  - 감지: 같은 사람·같은 행동 차원의 반대 끝 단서(POLE_CUES)가 책 안에서 둘 다 단정으로 나오면, 뒤 문장에 self_contradiction(HARD — 수리 → 남으면 뗀다).
 *    단정이 아닌 것은 뺀다: 물음, 조언(~세요), 가정·통념(라면·흔히·보통은), 바로 뒤 부정(~지 않고·~기보다), 한 문장에 두 끝이 같이 나온 대비(겉은 ~ 속은 ~).
 *    주인: 궁합은 단서 앞 가장 가까운 이름(없으면 뒤 이름), 한 사람 책은 「당신」·이름 또는 다른 사람 말(상대·연인·동료 …)이 없는 문장만.
 */
import { POLE_CUES } from "@/lib/brief/mbtiFn";
import type { PersonaSheet } from "@/lib/brief/persona";
import { PROFILE_CUES, type ProfileCodes } from "@/lib/brief/pairProfile";
import { fnStack } from "./style";

export type ContradictionPerson = { readonly names: readonly string[]; readonly label: string; readonly codes?: ProfileCodes | null };
/** W7-4: sheets = 사람별 성격 정답지(있으면 차원마다 「먼저 말한 끝」이 정답지 값), dimMap = 옛 차원 → 사전 차원(뒤집음 포함). */
export type ContradictionCtx = { readonly people: readonly ContradictionPerson[]; readonly compat: boolean; readonly sheets?: readonly PersonaSheet[]; readonly dimMap?: ReadonlyMap<string, readonly [string, 1 | -1]>; /** 사전 차원 → 이름·끝 글(수리에 정답지 한 줄로 준다). */ readonly dimText?: ReadonlyMap<string, { readonly name: string; readonly plus: string; readonly minus: string }> };
/** 문장이 단정한 끝을 사전 차원으로(옛 차원 이름·EXTRA 차원은 dimMap으로 옮기고, 사전에 없으면 그대로). */
export function assertedPersona(s: string, ctx: ContradictionCtx): { who: number; dim: string; pole: 1 | -1; cue: string }[] {
  return assertedPoles(s, ctx).map(a => { const m = ctx.dimMap?.get(a.dim); return m ? { ...a, dim: m[0], pole: (a.pole * m[1]) as 1 | -1 } : a; });
}
/** W7-4: 정답지와 반대 끝 단정(긴장 아닌 차원). 긴장 차원은 tension으로 따로(기록만). */
export function sheetOpposes(s: string, ctx: ContradictionCtx): { hard: { who: number; dim: string; cue: string }[]; tension: { who: number; dim: string; cue: string }[] } {
  const hard: { who: number; dim: string; cue: string }[] = [], tension: { who: number; dim: string; cue: string }[] = [];
  if (!ctx.sheets?.length) return { hard, tension };
  for (const a of assertedPersona(s, ctx)) {
    const d = ctx.sheets[a.who]?.dims.find(x => x.id === a.dim); if (!d || d.v === 0 || d.v === a.pole) continue;
    (d.tension ? tension : hard).push({ who: a.who, dim: a.dim, cue: a.cue });
  }
  return { hard, tension };
}
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
/** 같은 절 안 대비 표지(「그런데·하지만·다만·반면·~지만」). */
const CONTRAST = /^(?:그런데|하지만|다만|반면|그래도|한편)|지만[, ]/;
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
  ["conflictApproach-", /말을 고르는 데 시간이 (?:걸리|걸려|오래)/],
  // W6 S4 2판(2차 종합 3장 「뒤끝 없이 감정을 금방 털고, 부딪쳐도 회복이 빠릅니다」 ↔ 4장 「물이 부족하면 완충이 얇아서 부딪친 일이 마음에 오래 머물기 쉽습니다」 — 수 부족 재료 줄과 수 부족×INFJ 긴장 재료 줄).
  //  조건 「부족하면」을 단서 안에 넣어 조건문 제외에 걸리지 않게 한다. 곱씹기 일반(자기 실수·말 순서)은 넣지 않는다(위 주석 오탐 9건).
  // W6.1 P5(2차 궁합 2장 「하린님은 괜찮다는 말보다 괜찮지 않은 표정을 먼저 믿는 사람」 ↔ 같은 장 「하린님은 말을 그대로 받아들이는 편」): 상대 말을 읽는 길.
  ["cueReading+", /(?:말보다|말은 [^.?!]{0,8}보다) [^.?!]{0,16}표정을 (?:먼저 )?믿|말하지 않은 [^.?!]{0,12}기분(?:도|까지) 알아채/], ["cueReading-", /말을 (?:들은 )?그대로 받아들이|말한 그대로 (?:믿|받아들)/],
  // W6.1 P5(2차 궁합 1장 「둘 다 … 말보다 속으로 깊이 생각하는 힘」 ↔ 6장 「하린님은 말로 풀어야 생각이 정리되는 사람」): 생각을 푸는 길.
  ["verbalOutput+", /말로 풀어야 생각이 정리|말하면서 생각이 정리|말로 꺼내야 (?:생각|마음)이 정리/], ["verbalOutput-", /말보다 속으로 (?:깊이 )?생각|속으로 깊이 생각하는/],
  ["emotionalRecovery+", /뒤끝(?:이)? 없|감정을 (?:금방|빨리) 털|부딪쳐도 (?:금방|빨리) 회복|부딪쳐도 회복이 빠르/],
  ["emotionalRecovery-", /(?:(?:수|물)(?:가|이)? 부족하면 )?완충이 얇[^.?!]{0,30}(?:오래 머물|오래 남|그대로 (?:몸|마음)에 남)|부딪친 일이 [^.?!]{0,12}오래 머물/]];
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
  let t = s.replace(/[⟪⟫]/g, "").trim();
  // W6 S4 2판(2차 커리어 8장 「…확인하고 정하는 절차형이라, 큰 결정 앞에서는 … 쓰세요」): 조언 문장도 앞의 까닭 마디(「~형이라·~편이라,」)는 성향을 단정한다 → 그 마디만 본다.
  if (ADVICE.test(t)) { const r = t.match(/^(.{4,}?(?:형|편|쪽|사람|유형)이라)[, ]/); if (!r) return []; t = r[1]; }
  if (QUESTION.test(t) || HYPO.test(t)) return [];
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

/**
 * W6.1(2차 궁합 8장 「같은 글자가 겹쳐 서로를 몰아붙이는 흐름이에요」 ↔ 9장 「앞서 본 부딪힘은 서로를 몰아붙이는 마찰이 아니라 …」): 앞에서 단정한 말을 「앞서 본 X는 Y가 아니라」로 뒤집음.
 * Y의 앞머리(끝 이름 낱말을 뺀 5자 이상, 한글만)가 앞 장·절 문장에 부정 없이 있으면 모순.
 */
const REVERSAL = /(?:앞서|앞에서) (?:본|말한|살펴본) [^.?!]{0,24}?(?:은|는) ([^.?!]{4,30}?)(?:이|가) 아니라/;
export function reversalFlags(sentences: readonly SentenceAt[]): ContradictionHit[] {
  const out: ContradictionHit[] = [], hk = (x: string) => x.replace(/[^가-힣]/g, "");
  sentences.forEach((x, i) => {
    const m = x.sentence.match(REVERSAL); if (!m) return;
    const words = m[1].trim().split(/\s+/), core = hk(words.length > 1 ? words.slice(0, -1).join(" ") : words[0]); if (core.length < 5) return;
    const was = sentences.slice(0, i).find(y => `${y.chapter}.${y.section}` !== `${x.chapter}.${x.section}` && hk(y.sentence).includes(core) && !/아니|않|없/.test(y.sentence));
    if (was) out.push({ ...x, detail: `${was.chapter}장에서 「${m[1].trim()}」 쪽으로 말해 놓고 「…아니라」로 뒤집음` });
  });
  return out;
}
/** 책 순서로 문장을 받아 같은 사람·같은 차원 반대 끝 단정을 찾는다(뒤 문장에 단다). 한 사람 책은 요약표 값을 먼저 둔다. */
/** W6.1 P5: 궁합에서 이름 없는 문장이 같은 문단 바로 앞 「둘 다·두 사람 모두」 문장을 잇는 꼴(「둘 다 식상이 적고 …. 말보다 속으로 깊이 생각하는 힘이 있고, … 결이 같아요」). */
const BOTH_LEAD = /^(?:둘 다|두 사람 모두|두 사람은 (?:둘 다|모두)) /;
const SPLIT_SUBJECT = /한쪽|다른 쪽|한 사람은|다른 사람은|반면/;
export function contradictionFlags(sentences: readonly SentenceAt[], ctx: ContradictionCtx): ContradictionHit[] {
  const first = new Map<string, { pole: 1 | -1; where: string; at: string; cue: string }>();
  ctx.people.forEach((p, i) => { for (const [d, s] of profilePoles(p.codes)) first.set(`${i}|${d}`, { pole: s, where: "성격 요약표", at: "profile", cue: `${p.label} ${d}${s > 0 ? "+" : "−"}` }); });
  // W7-4: 정답지가 있으면 긴장 아닌 차원마다 정답지 값이 「먼저 말한 끝」(긴장 차원은 두 끝 모두 허용 — 기록만은 sheetOpposes).
  const tensionDims = new Set<string>();
  ctx.sheets?.forEach((sh, i) => { for (const d of sh.dims) { if (d.tension) { tensionDims.add(`${i}|${d.id}`); continue; } if (d.v !== 0) { const t = ctx.dimText?.get(d.id); first.set(`${i}|${d.id}`, { pole: d.v, where: "성격 정답지", at: "persona", cue: t ? `${ctx.people[i]?.label ?? ""} ${t.name}: ${d.v > 0 ? t.plus : t.minus}` : `${ctx.people[i]?.label ?? ""} ${d.id}${d.v > 0 ? "+" : "−"}` }); } } });
  const out: ContradictionHit[] = [];
  for (const [xi, x] of sentences.entries()) {
    const pv = sentences[xi - 1], carried = ctx.compat && pv && pv.chapter === x.chapter && pv.section === x.section && pv.paragraph === x.paragraph && BOTH_LEAD.test(pv.sentence.replace(/[⟪⟫]/g, "").trim()) && !SPLIT_SUBJECT.test(x.sentence) && !ctx.people.some(p => p.names.some(n => x.sentence.includes(n) || pv.sentence.includes(n)));
    for (const a of carried ? assertedPersona(`둘 다 ${x.sentence.replace(/[⟪⟫]/g, "").trim()}`, ctx) : assertedPersona(x.sentence, ctx)) {
      const k = `${a.who}|${a.dim}`; if (tensionDims.has(k)) continue;
      const was = first.get(k);
      if (!was) { first.set(k, { pole: a.pole, where: `${x.chapter}장`, at: `${x.chapter}.${x.section}`, cue: a.cue }); continue; }
      // 같은 절 안에서 바로 대비해 풀어 쓴 것(「그런데 ESTP의 결은 …」)은 모순이 아니라 설명된 긴장이다 — 장·절이 다를 때만.
      if (was.pole !== a.pole && (was.at !== `${x.chapter}.${x.section}` || (a.dim === "cueReading" && !CONTRAST.test(x.sentence)))) { out.push({ ...x, detail: `${ctx.people[a.who]?.label ?? ""} ${a.dim}: ${was.where}에서 「${was.cue}」 쪽인데 「${a.cue}」(반대 끝)` }); break; }
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
const COMBINE = /만나(?:서|면|니)|겹쳐|겹치|합쳐|합치|더해져|맞물려|같은 (?:방향|쪽)을 (?:가리|향)|닮아 있|닮았|방식이 비슷|결이 같|[과와]도 (?:잘 )?맞(?:아|습|는)|(?:이|그) 힘을 (?:더 )?(?:키우|키웁|키워)|(?:이|그) (?:[가-힣]{1,6} )?(?:결|성향|기질|흐름|기운)을 (?:더 )?(?:키우|키웁|키워|살려|살립|굳혀|굳힙)/; // W6.1 다시 발행(2차 궁합 2장 「ENTP의 끝없는 가능성(Ne)이 이 자유로운 결을 더 키웁니다」)
/**
 * W6 S4 3판(1차 종합 1장): MBTI 문단 바로 뒤 「사주 쪽도 같은 방향을 가리킵니다.」 — 틀 문장이 다음 문장의 관계(삼합)를 MBTI 성향과 같은 방향으로 묶는다(잇는 말이 관계 문장 앞에 온 꼴).
 */
// W6.1 다시 발행(1차 종합 1장): 수리가 「사주의 구조도 한곳으로 모이는 쪽을 가리킵니다」로 다시 씀 — 「사주(의 X)도 … 쪽·방향을 가리킨다」도 같은 틀.
const FRAME = /(?:사주|명리)[^.?!]{0,10}(?:같은 (?:방향|쪽)을 (?:가리|향)|같은 그림을|닮은 그림을|같은 말을 (?:해|합))|(?:사주|명리)(?:의 [가-힣]{1,6}| 쪽)?도 [^.?!]{0,20}(?:쪽|방향)을 (?:가리|향)|(?:사주|명리)[^.?!]{0,16}(?:에서도|도) (?:비슷하게|똑같이|그대로) (?:읽|보이|드러)/; // 4판: 수리가 「…점은 사주의 일간과 십성에서도 비슷하게 읽힙니다」로 다시 씀
export function relationLinkFrame(sen: string, next: string | undefined, prev: string | undefined, mbtiAnchor: RegExp | null): string | null {
  if (!mbtiAnchor || !next || !prev || !FRAME.test(sen) || RELATION_TERM.test(sen) || !mbtiAnchor.test(prev)) return null;
  const rel = next.match(RELATION_TERM); return rel ? `틀 문장이 다음 문장의 「${rel[1]}」를 앞의 MBTI 성향과 같은 방향으로 이음` : null;
}
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
