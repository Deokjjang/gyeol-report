/**
 * 정답지 대조 검사(최종판3 3, 결정론·호출 0). 문장에서 명리 용어·자리 말·세기 말·간지·연도·대운수를 뽑아 정답지와 견준다.
 * 명확한 불일치만 막는다. 자리나 주인이 애매한 문장(자리 말이 여럿, 용어가 여럿, 가정·부정 문장)은 통과시킨다.
 * detail에는 맞는 사실을 적는다(수리 지시에 그대로 간다).
 */
import type { Knowledge } from "@/lib/brief/knowledge";
import type { FactSheet, PersonFacts, RelationFact, Slot } from "./build";
import { BRANCH_REL, branchChars, ELEMENT_OF, POSITION_WORDS, REL_KIND, shinsalAliases, STAGE_HAN, STAGE_ONE, STAGE_TWO, STEM_REL, stemChars, stemHan, type ShinsalAlias } from "./aliases";

export type FactRule = "fact_term" | "fact_relation" | "fact_strength" | "fact_ganji" | "fact_meaning" | "fact_mix" | "fact_dayun" | "common_split" | "render_dup" | "label_leak" | "time_fixed" | "input_outside";
export type FactHit = { readonly rule: FactRule; readonly detail: string };
export type FactCtx = {
  readonly sheet: FactSheet; readonly aliases: readonly ShinsalAlias[];
  readonly people: readonly { readonly facts: PersonFacts; readonly names: RegExp | null }[];
  readonly comprehensive: boolean; readonly thisYear: number; readonly product: string;
  /** 입력 직업 글(입력에 없는 직업 상황 판정). */
  readonly jobText: string;
  /** 최종판3 2c·2f: 입력 직업의 소품·업무 낱말(종합 1장 직업 장면 판정), 관계 상태(연애 중·기혼의 첫 만남 검증 판정). */
  readonly jobWords: readonly string[]; readonly relationship: string;
};

const NEG = /없(어|어요|습니다|는|고|다|지만|으니|으면)|아니|않(아|고|는|습니다|지만)|빠져 있|비어 있/;
const HYPO = /라면|다면|이라면|일 때는|경우에는|흔히|보통은|일반적으로|이란|이라는 것은|뜻해요|뜻합니다|을 뜻|를 뜻/;
const TEMPORAL = /올해|내년|그해|이해|대운|세운|월운|\d{4}년|이달|이번 달|달에는|해에는|들어오|들어와|찾아오|만나는 해/;
const SLOT_KO: Readonly<Record<Slot, string>> = { yearStem: "연간", yearBranch: "연지", monthStem: "월간", monthBranch: "월지", dayStem: "일간", dayBranch: "일지", hourStem: "시간", hourBranch: "시지" };
const slotsKo = (s: readonly Slot[]) => s.map(x => SLOT_KO[x]).join("·");

export function factCtxOf(sheet: FactSheet, k: Pick<Knowledge, "features">, callNames: readonly string[][], opts: { jobWords?: readonly string[] } = {}): FactCtx {
  const people = sheet.people.map((facts, i) => ({ facts, names: callNames[i]?.length ? new RegExp(callNames[i].map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")) : null }));
  const job = sheet.people[0]?.input?.job;
  const detail = job?.detail ?? "", jobWords = [...new Set([...(opts.jobWords ?? []), ...detail.split(/[^가-힣A-Za-z]+/).filter(w => w.length >= 2)])];
  return { sheet, aliases: shinsalAliases(k), people, product: sheet.product, jobWords, relationship: sheet.people[0]?.input?.relationship ?? "unknown", comprehensive: sheet.product === "saju_mbti_full", thisYear: Number(sheet.baseDate.slice(0, 4)), jobText: `${job?.detail ?? ""} ${job?.status ?? ""}` };
}

/** 문장이 가리키는 사람(이름이 하나만 나오면 그 사람, 아니면 모두). */
function ownersOf(sen: string, ctx: FactCtx): PersonFacts[] {
  if (ctx.people.length < 2) return ctx.people.map(p => p.facts);
  const hit = ctx.people.filter(p => p.names?.test(sen));
  return (hit.length === 1 ? hit : ctx.people).map(p => p.facts);
}

/** 신살 이름 + 자리 말이 붙어 있는 꼴(자리 하나·용어 하나일 때만). */
function termPosition(sen: string, ctx: FactCtx, owners: readonly PersonFacts[]): FactHit | null {
  const terms = ctx.aliases.filter(a => a.re.test(sen));
  const poss = POSITION_WORDS.filter(p => p.re.test(sen));
  if (terms.length !== 1 || poss.length !== 1) return null;
  const t = terms[0], p = poss[0];
  const tm = sen.match(t.re)!, pm = sen.match(p.re)!;
  const ti = tm.index!, pi = pm.index!;
  const between = ti < pi ? sen.slice(ti + tm[0].length, pi) : sen.slice(pi + pm[0].length, ti);
  // 바짝 붙은 꼴만: 「천덕귀인이 일지에」「일지의 천덕귀인」「일지에 있는 천덕귀인」.
  const tight = ti < pi ? /^(\([^)]*\))?(이|가|은|는|)\s?$/.test(between) && /^(에|에서|의 자리에|자리에)\s?(있|놓|자리|앉|들어|붙|깔)/.test(sen.slice(pi + pm[0].length))
    : /^(의|에|에서)?\s?((있는|놓인|자리한|앉은|들어 있는|붙은|깔린)\s)?$/.test(between) && /^(\([^)]*\))?(이|가|은|는|을|를|의|도|과|와|으로|로)?(\s|$|,)/.test(sen.slice(ti + tm[0].length));
  if (!tight) return null;
  const facts = owners.flatMap(o => o.shinsal.filter(s => s.name === t.name));
  if (!facts.length) return null;
  if (facts.some(s => s.slots.some(x => p.slots.includes(x)))) return null;
  return { rule: "fact_term", detail: `${t.name}은 ${slotsKo([...new Set(facts.flatMap(s => s.slots))])}에 있다(${p.label} 아님)` };
}

/** 정답지에 없는 신살·귀인·십이운성을 그 사람 것으로 말함(부정·가정·유입 문맥 제외). */
function termAbsent(sen: string, ctx: FactCtx, owners: readonly PersonFacts[]): FactHit | null {
  if (NEG.test(sen) || HYPO.test(sen) || TEMPORAL.test(sen)) return null;
  for (const a of ctx.aliases) {
    if (!a.re.test(sen)) continue;
    if (owners.some(o => o.shinsal.some(s => s.name === a.name))) continue;
    // 궁합: 이름이 없는 문장은 두 사람 중 누구에게든 있으면 통과(ownersOf가 모두를 준다).
    return { rule: "fact_term", detail: `${a.name}은 ${owners.map(o => o.name).join("·")}의 원국에 없다` };
  }
  return null;
}

/** 십이운성: 「일지 묘」처럼 자리와 붙은 꼴, 또는 한자 꼴로 이름이 나왔는데 원국에 없음. */
function stageClaim(sen: string, owners: readonly PersonFacts[]): FactHit | null {
  const m = sen.match(new RegExp(`(일지|월지|연지|년지|시지|태어난 (날|달|해|시각?)의? 땅 글자)(의|는|은|가|이)?\\s?(${STAGE_TWO.join("|")}|(?:${Object.keys(STAGE_ONE).join("|")})(?=\\([一-鿿]\\)| 자리|\\(|[이가]? ?(단계|운성)))(\\(|\\s|[이가은는의을를]|$)`));
  if (!m) return null;
  const pos = /일지|날/.test(m[1]) ? "day" : /월지|달/.test(m[1]) ? "month" : /연지|년지|해/.test(m[1]) ? "year" : "hour";
  const stage = m[4];
  if (TEMPORAL.test(sen) || NEG.test(sen)) return null;
  const ok = owners.some(o => o.twelveStages.some(t => t.position === pos && t.ko === stage));
  if (ok) return null;
  const real = owners.map(o => `${o.name} ${o.twelveStages.find(t => t.position === pos)?.ko ?? "없음"}`).join("·");
  return { rule: "fact_term", detail: `${m[1]} 십이운성은 ${real}(${stage} 아님)` };
}
void STAGE_HAN;

function relPool(ctx: FactCtx, owners: readonly PersonFacts[], temporal: boolean): RelationFact[] {
  const pool: RelationFact[] = owners.flatMap(o => [...o.relations, ...o.stemClashes]);
  if (ctx.sheet.pair) pool.push(...ctx.sheet.pair.relations, ...ctx.sheet.pair.stemClashes);
  if (temporal) for (const o of owners) pool.push(...o.annual.flatMap(a => [...a.relations, ...a.stemClashes]), ...o.dayun.cycles.flatMap(c => [...c.relations, ...c.stemClashes]), ...o.monthly.flatMap(m => m.relations));
  return pool;
}
const sameSet = (a: readonly string[], b: readonly string[]) => { const x = new Set(a), y = new Set(b); return x.size === y.size && [...x].every(c => y.has(c)); };

/** 관계: 글자 묶음이 정답지에 없음(축술미형인데 戌 없음) · 글자 수(두 글자인데 세 땅) · 완성도(반합인데 완성). */
function relationClaim(sen: string, ctx: FactCtx, owners: readonly PersonFacts[]): FactHit | null {
  if (HYPO.test(sen) && !/있어|있고|있습니다|있으니/.test(sen)) return null;
  const temporal = TEMPORAL.test(sen);
  const pool = relPool(ctx, owners, temporal);
  const mentioned: { chars: string[]; kinds: readonly string[]; text: string; stem: boolean }[] = [];
  for (const m of sen.matchAll(BRANCH_REL)) mentioned.push({ chars: branchChars(m[1]), kinds: REL_KIND[m[2]] ?? [], text: m[0], stem: false });
  for (const m of sen.matchAll(STEM_REL)) mentioned.push({ chars: stemChars(m[1]), kinds: REL_KIND[m[2]] ?? [], text: m[0], stem: true });
  for (const x of mentioned) {
    if (x.stem && x.chars.some(c => !/[甲乙丙丁戊己庚辛壬癸]/.test(c))) continue;
    if (!x.stem && x.chars.some(c => !/[子丑寅卯辰巳午未申酉戌亥]/.test(c))) continue;
    const found = pool.filter(r => x.kinds.includes(r.kind) && sameSet(r.members.map(m => m.char), x.chars));
    if (found.length) continue;
    // 세 글자 이름(축술미 삼형)인데 두 글자만 있으면 partial 형으로 있을 수 있다 — 세 글자가 다 있어야 「축술미 삼형」.
    const partial = x.chars.length === 3 ? pool.filter(r => x.kinds.includes(r.kind) && r.members.every(m => x.chars.includes(m.char))) : [];
    const have = new Set(owners.flatMap(o => Object.values(o.pillars).flatMap(p => (p ? [p.stem, p.branch] : []))));
    const missing = x.chars.filter(c => !have.has(c as never) && !ctx.sheet.pair);
    if (negOrHypo(sen)) continue;
    return { rule: "fact_relation", detail: partial.length ? `「${x.text}」: 세 글자가 다 있지 않다(${partial.map(r => `${[...new Set(r.members.map(m => m.char))].join("")} 두 글자 형`).join("·")}만 있다)` : missing.length ? `「${x.text}」: ${missing.join("·")} 글자가 원국에 없다` : `「${x.text}」 관계는 정답지에 없다` };
  }
  // 글자 수·완성도: 관계 말이 하나일 때.
  const one = mentioned.length === 1 ? pool.filter(r => mentioned[0].kinds.includes(r.kind) && r.members.every(m => mentioned[0].chars.includes(m.char))) : [];
  const generic = /반합|삼합/.test(sen) ? pool.filter(r => r.kind === "SAMHAP") : [];
  const target = one.length === 1 ? one[0] : generic.length === 1 && !mentioned.length ? generic[0] : null;
  if (target) {
    const cnt = sen.match(/(두|세|네|2|3|4) ?(땅|글자|자리|기둥|개의 땅|개의 글자)/);
    const n = cnt ? ({ 두: 2, 세: 3, 네: 4, 2: 2, 3: 3, 4: 4 } as Record<string, number>)[cnt[1]] : 0;
    if (n && n !== target.glyphCount) return { rule: "fact_relation", detail: `${target.key}는 ${target.glyphCount}글자다(${cnt![0]} 아님)` };
    if (target.completeness !== "full" && /완성|다 모(여|인|였|이)|온전히 묶|완전히 (묶|하나)|세 글자가 (모두|다)/.test(sen)) return { rule: "fact_relation", detail: `${target.key}는 ${target.kind === "SAMHAP" ? "반합(두 글자만 모여 반쯤 묶임)" : "두 글자 형(세 글자 다 모이지 않음)"}이다(완성 아님)` };
  }
  return null;
}
const negOrHypo = (s: string) => /없(어|는|고|다|습니다)|아니|않|라면|다면/.test(s);

/** 세운이 원국과 관계가 있는데 「건드리지 않는 해」. */
function annualNoTouch(sen: string, ctx: FactCtx, owners: readonly PersonFacts[], paragraph = sen): FactHit | null {
  if (!/(건드리지|부딪치지|엮이지|맞물리지) ?(는 )?않|관계가 없|영향이 없|직접 닿지 않/.test(sen)) return null;
  const y = sen.match(/(20\d\d)년/)?.[1] ?? paragraph.match(/(20\d\d)년/)?.[1]; const year = y ? Number(y) : /올해|이번 해/.test(paragraph) ? ctx.thisYear : null;
  if (!year) return null;
  for (const o of owners) {
    const a = o.annual.find(x => x.year === year);
    if (a && (a.relations.length || a.stemClashes.length)) return { rule: "fact_relation", detail: `${year}년(${a.ganjiKo})은 원국과 ${[...a.relations, ...a.stemClashes].map(r => `${r.key} ${({ STEM_HAP: "천간합", STEM_CHUNG: "천간충", YUKHAP: "육합", SAMHAP: r.completeness === "half" ? "반합" : "삼합", BANGHAP: "방합", CHUNG: "충", HYEONG: "형", PA: "파", HAE: "해", WONJIN: "원진" } as Record<string, string>)[r.kind] ?? r.kind}`).join("·")}로 엮인다` };
  }
  return null;
}

/** 신강약 말 · 같은 문단의 신약 + 비겁·인성 강. */
const STRENGTH_KO: Readonly<Record<string, string>> = { VERY_WEAK: "매우 신약", WEAK: "신약", BALANCED: "중화", STRONG: "신강", VERY_STRONG: "매우 신강" };
function strengthClaim(sen: string, owners: readonly PersonFacts[], paragraph: string): FactHit | null {
  if (owners.length !== 1) return null;
  const o = owners[0], real = STRENGTH_KO[o.strength.level];
  const m = sen.match(/(매우 |아주 )?(신강|신약)(?![가-힣]*(인지|인가|이라면|하다면))/);
  if (m) {
    const said = `${m[1] ? "매우 " : ""}${m[2]}`;
    const weakSaid = m[2] === "신약", weakReal = /WEAK/.test(o.strength.level);
    if (o.strength.level === "BALANCED" || weakSaid !== weakReal || (m[1] && !/VERY/.test(o.strength.level))) return { rule: "fact_strength", detail: `일간 강약은 ${real}(${said} 아님)` };
  }
  // 같은 문단에 「신약」과 「비겁/인성 강」: 두 값은 다른 저울이라 한 숨에 쓰면 모순으로 읽힌다(정답지 자기검증 group_vs_strength).
  if (/WEAK/.test(o.strength.level) && /신약|힘이 (여린|약한)/.test(paragraph) && /(비겁|비견|겁재|인성|정인|편인|내 방식의 힘|배우는 힘)[^.]{0,12}(강해|강한|강합|많아|많은|넘치|세요|센 )/.test(sen)) {
    const g = /(인성|정인|편인|배우는 힘)/.test(sen) ? o.groups.RESOURCE : o.groups.PEER;
    return { rule: "fact_strength", detail: `${g.name} ${g.level}과 일간 ${real}을 한 문단에서 같이 말함(다른 저울 — 한쪽만 쓴다)` };
  }
  return null;
}

/** 간지·연도·대운수. */
const GANJI = "([갑을병정무기경신임계][자축인묘진사오미신유술해])";
/** 육십갑자 짝(천간·지지 음양이 같다): 「정인」(丁寅)·「정관」 같은 십성 이름을 간지로 읽지 않는다. */
const STEMS_KO = "갑을병정무기경신임계", BRANCHES_KO = "자축인묘진사오미신유술해";
export const isGanjiKo = (g: string) => g.length === 2 && STEMS_KO.indexOf(g[0]) >= 0 && BRANCHES_KO.indexOf(g[1]) >= 0 && STEMS_KO.indexOf(g[0]) % 2 === BRANCHES_KO.indexOf(g[1]) % 2;
function ganjiClaim(sen: string, owners: readonly PersonFacts[]): FactHit | null {
  if (owners.length !== 1) return null;
  const o = owners[0];
  for (const m of sen.matchAll(new RegExp(`(20\\d\\d|19\\d\\d)년(의)? ?${GANJI}(?![가-힣]{0,1}대운)`, "g"))) {
    if (!isGanjiKo(m[3])) continue;
    const y = Number(m[1]), a = o.annual.find(x => x.year === y);
    if (a && a.ganjiKo !== m[3]) return { rule: "fact_ganji", detail: `${y}년은 ${a.ganjiKo}년이다(${m[3]} 아님)` };
  }
  for (const m of sen.matchAll(new RegExp(`${GANJI} ?대운`, "g"))) {
    if (!isGanjiKo(m[1])) continue;
    if (!o.dayun.cycles.some(c => c.ganjiKo === m[1])) return { rule: "fact_ganji", detail: `${m[1]} 대운은 없다(대운: ${o.dayun.cycles.slice(0, 6).map(c => `${c.ganjiKo} ${c.startYear}`).join("·")})` };
    const y = sen.slice(0, m.index).match(/(20\d\d)년[^.]{0,14}$/);
    const c = o.dayun.cycles.find(x => x.ganjiKo === m[1])!;
    if (y && /(부터|시작|들어서|바뀌)/.test(sen) && Number(y[1]) !== c.startYear && !(Number(y[1]) >= c.startYear && Number(y[1]) <= c.endYear && !/시작/.test(sen))) return { rule: "fact_ganji", detail: `${m[1]} 대운은 ${c.startYear}년 ${c.startSolarKst ? Number(c.startSolarKst.slice(5, 7)) + "월 무렵" : ""}부터다` };
  }
  // 운영 Q 8-1: 대운수는 한 사람에 한 숫자(정답지 dayun.number = 첫 대운이 시작될 때의 만 나이, 모든 대운 줄과 같은 값). 수리 힌트 이름도 그 뜻대로.
  for (const n of sen.matchAll(/대운수 ?(는 |가 )?(\d+)/g)) {
    if (o.dayun.number !== null && Number(n[2]) !== o.dayun.number) return { rule: "fact_ganji", detail: `대운수는 ${o.dayun.number}(첫 대운이 시작될 때의 만 나이)` };
  }
  const d = sen.match(new RegExp(`${GANJI} ?일주`));
  if (d && isGanjiKo(d[1]) && o.pillars.day && d[1] !== o.pillars.day.ganjiKo && !/같은 일주|다른 일주/.test(sen)) return { rule: "fact_ganji", detail: `일주는 ${o.pillars.day.ganjiKo}(${d[1]} 아님)` };
  return null;
}

/** 오행 개수와 세기를 한 마디에 섞음(「물이 2로 가장 힘이 센」). */
function countStrengthMix(sen: string, owners: readonly PersonFacts[]): FactHit | null {
  const m = sen.match(/(나무|불|흙|쇠|물|목|화|토|금|수)(\([^)]*\))?(이|가|은|는)? ?(\d|두|세|네|다섯|여섯) ?(개|글자)?(로|으로|라서|이라|나 있어)[^.]{0,12}(가장|제일)? ?(힘이 |기운이 )?(센|세고|세요|강한|강하|셉니다)/);
  if (!m || owners.length !== 1) return null;
  const o = owners[0], el = ELEMENT_OF[m[1]];
  return { rule: "fact_mix", detail: `오행 개수(겉 글자 ${o.elements.count[el]}개)와 세기(${o.elements.strongest === el ? "가장 셈" : o.elements.status[el]})는 다른 값 — 개수를 세기의 이유로 쓰지 않는다` };
}

/** 뜻 오귀속: 오행 하나를 주어로 다른 십성 묶음의 뜻(표현·규칙·돈·배움·자존심)을 붙임. 예: 갑목에게 쇠(금)는 관성인데 「쇠가 묻혀 표현이 늦다」(토다금매 오적용). */
const DOMAIN: Readonly<Record<"PEER" | "OUTPUT" | "WEALTH" | "OFFICER" | "RESOURCE", RegExp>> = {
  OUTPUT: /표현|말솜씨|말로 꺼내|재주|창작|아이디어를 (내|꺼내)|끼|솜씨/, OFFICER: /규칙|책임감|체면|명예|규율|조직|직함/, WEALTH: /돈|재물|수입|벌이|살림|씀씀이/,
  RESOURCE: /배움|공부|학습|자격증|문서 운/, PEER: /자존심|고집|경쟁심|독립심/,
};
/** 오행 성정(십성과 무관한 일반 뜻): 불=표현·열정, 물=생각·지혜, 쇠=결단·기준, 나무=성장·배려, 흙=신뢰·안정. 이 뜻은 일간과 상관없이 쓸 수 있다. */
const NATURE: Readonly<Record<string, RegExp>> = { FIRE: /표현|열정|드러|말솜씨/, WATER: /생각|지혜|감정|속/, METAL: /결단|의리|기준|정리|규칙/, WOOD: /성장|배려|시작/, EARTH: /신뢰|안정|버팀|중심|살림/ };
const GROUP_KO = { PEER: "비겁", OUTPUT: "식상", WEALTH: "재성", OFFICER: "관성", RESOURCE: "인성" } as const;
const GROUP_NAMES = /비겁|비견|겁재|식상|식신|상관|재성|정재|편재|관성|정관|편관|인성|정인|편인|내 방식의 힘|만드는 힘|값을 받는 힘|규칙의 힘|배우는 힘/;
function meaningMisattr(sen: string, owners: readonly PersonFacts[]): FactHit | null {
  if (owners.length !== 1 || GROUP_NAMES.test(sen)) return null;
  const o = owners[0];
  // 막히거나 묻히는 쪽 오행(「흙이 많고 쇠가 그 속에 묻히면」의 쇠)을 주어로 본다.
  const re = /(나무|불|흙|쇠|물|목|화|토|금|수)(\([^)]*\))?(이|가|은|는) ((?:(?!나무|불|흙|쇠|물)[^.]){0,16}?)(묻히|막히|눌리|가려|갇히|부족하|모자라|약하)/g;
  for (const subj of sen.matchAll(re)) {
    const el = ELEMENT_OF[subj[1]];
    const group = (Object.keys(o.groups) as (keyof typeof GROUP_KO)[]).find(g => o.groups[g].element === el)!;
    const rest = sen.slice(subj.index! + subj[0].length);
    const said = (Object.keys(DOMAIN) as (keyof typeof GROUP_KO)[]).filter(g => DOMAIN[g].test(rest));
    if (said.length !== 1 || said[0] === group) continue;
    const word = rest.match(DOMAIN[said[0]])![0];
    if (NATURE[el]?.test(word)) continue;
    return { rule: "fact_meaning", detail: `${o.dayMaster.ko}${({ WOOD: "목", FIRE: "화", EARTH: "토", METAL: "금", WATER: "수" } as Record<string, string>)[o.dayMaster.element]} 일간에게 ${subj[1]} 기운은 ${GROUP_KO[group]}이다(${GROUP_KO[said[0]]}의 뜻인 「${word}」로 풀지 않는다)` };
  }
  return null;
}

/** 궁합: 두 사람 모두 가진 것(공통)을 한 사람만의 특징·차이의 근거로 씀. */
function commonSplit(sen: string, ctx: FactCtx): FactHit | null {
  const pair = ctx.sheet.pair; if (!pair || ctx.people.length !== 2) return null;
  const named = ctx.people.filter(p => p.names?.test(sen));
  const common = [...pair.common.shinsal, ...(pair.common.dayStage ? [pair.common.dayStage] : [])];
  for (const name of pair.common.shinsal) {
    const a = ctx.aliases.find(x => x.name === name); if (!a?.re.test(sen)) continue;
    if (named.length === 1 && !/두 사람|둘 다|모두|공통|함께 가진|같이 가진/.test(sen)) return { rule: "common_split", detail: `${name}은 두 사람 모두에게 있다(공통) — 한 사람만의 특징으로 쓰지 않는다` };
    if (named.length === 2 && /반면|와 달리|과 달리|다르게|차이/.test(sen)) return { rule: "common_split", detail: `${name}은 두 사람 공통 — 차이의 근거로 쓰지 않는다` };
  }
  if (pair.common.dayStage && named.length === 1 && new RegExp(`일지[^.]{0,6}${pair.common.dayStage}|${pair.common.dayStage}\\(墓\\)|${pair.common.dayStage} 자리`).test(sen) && /만(이|은|의| )|혼자|뿐/.test(sen)) return { rule: "common_split", detail: `일지 ${pair.common.dayStage}은 두 사람 공통` };
  void common;
  return null;
}

/** 렌더 검사: 쉬운 이름 중복 치환(「X, 곧 X」) · 내부 분류 라벨(「·십이신살」). */
/**
 * 최종판3 12: 브리프의 처방 종류 이름만 말하는 문장 — 「처방은 지출 한도입니다.」(커리어 9번)·「이 장의 한 가지 행동은 고마움 말하기예요.」(연애 9번).
 * 내부 라벨이라 지운다(바로 뒤 문장이 실제 행동을 말한다).
 */
export const PRESCRIPTION_LABEL = /^(처방은|이 장의 (한 가지 )?(행동|처방)은|오늘의 (행동|처방)은) [가-힣 ]{2,12}(이에요|예요|입니다)[.!]?$/;
/** 최종판3 12: 쉬운 이름 치환이 앞의 풀이와 겹친 꼴(「배우는 힘인 배우는 힘은」)을 하나로 줄인다(호출 0). */
const RENDER_DUP = /((?:[가-힣]+ ){0,2}[가-힣]+)인 \1(?=[은는이가을를의도과와로에 ,.]|$)/g;
export const collapseRenderDup = (t: string): string => t.replace(RENDER_DUP, "$1");
function renderCheck(sen: string): FactHit | null {
  const dup = sen.match(/([가-힣][가-힣 ]{1,14}?)(\([^)]*\))?, 곧 \1/) ?? sen.match(new RegExp(RENDER_DUP.source));
  if (dup) return { rule: "render_dup", detail: `「${dup[0]}」 같은 말을 두 번(쉬운 이름 치환 겹침)` };
  if (PRESCRIPTION_LABEL.test(sen.trim())) return { rule: "label_leak", detail: "처방 종류 이름만 말하는 문장(내부 라벨)" };
  const lab = sen.match(/[·(](십이신살|십이운성|신살·귀인|귀인·신살)(?=[\s,.)」이가은는을를의도과와에]|$)|(살|귀인|성)(\([一-鿿]+\))?·(십이신살|신살|귀인)(?=[\s,.)」이가은는을를의도과와에]|$)/);
  if (lab) return { rule: "label_leak", detail: `내부 분류 라벨 「${lab[0]}」` };
  return null;
}

/** 종합 본문: 연·월 숫자 고정 금지(운 설명은 「올해(병오)」, 행동은 「앞으로 한 달」). 대운 표기 꼴(「무진 대운: 2027년 5월 무렵부터」)은 허용. */
function timeFixed(sen: string, ctx: FactCtx): FactHit | null {
  if (!ctx.comprehensive || /대운/.test(sen)) return null;
  const s = sen.replace(/[가-힣]{2} 대운: 20\d\d년 \d{1,2}월 무렵부터( \(대운수 \d+\))?/g, "").replace(/(20\d\d)년[^.]{0,6}무렵부터[^.]{0,4}대운/g, "");
  const m = s.match(/20\d\d년 ?\d{1,2}월|(?<![\d.])\d{1,2}월 (한 달|동안|안에|중)|이번 달|이달(에|은|의)?|20\d\d년/);
  return m ? { rule: "time_fixed", detail: `종합 본문 시점 「${m[0]}」 — 운 설명은 「올해(병오)」 한 번, 행동은 「앞으로 한 달」로` } : null;
}

/** 입력에 없는 직업 상황(종합·커리어·연애): 투자자·투자 유치·직원·팀원·평가 시즌 등. 가정형(~게 되면·~한다면)은 통과. */
const OUTSIDE_ALL = /투자자|투자 유치|평가 시즌|실적표|인사 평가|사업자 통장에 처음|처음 찍히는 (입금|매출)/;
/** 종합·연애: 직업 장면 자체가 입력 밖(직원·팀원·면접). 커리어·궁합(사업·동료 관계)은 직무 이야기라 뺀다. */
const OUTSIDE_PERSONAL = /직원(을|이|들|에게|과|의|이랑| 면접)|팀원(을|이|들|에게|과|의)|면접관|부하 직원/;
const HYPO_OK = /게 되면|한다면|하게 되면|생기면|생긴다면|할 때가 오면|라면|다면|떠올려 보세요|상상해 보세요/;
/**
 * 최종판3 12: 조직이 없는 입력(자영업·프리랜서·전업주부)에 조직 장면(회의·상사·팀장)을 붙인 꼴(판독: 동네 꽃집 운영 종합 「회의 뒤 동료에게」·「회의록」).
 * 「동료」는 뺐다 — 자영업 저장본 2권에서 「손님이나 동료」「같은 업종 사람이나 동료」(같은 업종 사람)를 잘못 잡았다.
 */
const OUTSIDE_NO_ORG = /팀장|상사(가|를|에게|의|와)|회의(에서|가|를| 중| 뒤| 때|록)/;
/** 최종판3 12: 재취업 준비 입력에 과거 근속·무사고를 단정한 꼴(판독: 「오래 맡아도 사고 없던 안정성」). 입력에는 경력 햇수·근속이 없다. */
const OUTSIDE_TENURE = /오래 (맡아|맡은|다닌|다녀|일해|일한|근무)[^.]{0,20}(온|왔|던|없이)|사고 없(이|던)|근속/;
function inputOutside(sen: string, ctx: FactCtx): FactHit | null {
  const personal = ctx.product === "saju_mbti_full" || ctx.product === "love_marriage_child";
  const status = ctx.sheet.people[0]?.input?.job.status ?? "";
  const m = sen.match(OUTSIDE_ALL) ?? (personal ? sen.match(OUTSIDE_PERSONAL) : null)
    ?? (ctx.people.length < 2 && /^(self_employed|freelancer|homemaker)$/.test(status) ? sen.match(OUTSIDE_NO_ORG) : null)
    ?? (ctx.people.length < 2 && status === "job_seeker" ? sen.match(OUTSIDE_TENURE) : null);
  if (!m) return null;
  if (HYPO_OK.test(sen)) return null;
  const word = m[0].replace(/(을|이|들|에게|과|의|이랑| 면접)$/, "");
  if (ctx.jobText.includes(word)) return null;
  return { rule: "input_outside", detail: `입력에 없는 직업 상황 「${m[0]}」(입력: ${ctx.jobText.trim() || "직업 미입력"})` };
}

/** 생성 규칙·면책 노출: 「'이렇게 되면'이라는 가정 아래에서만」「부모님이 계시다면」「시기는 말하지 않아요」「자녀의 성별이나 수, 시기는 말하지 않습니다」. */
const LEAK = /가정 아래에서만|가정하고 (말|이야기)해|(부모님|형제|자매|형제자매)(이|가)? (계시|있으시|있)다면|(시기|성별|성별이나 수|여부|시점)(는|은|를|을|나|,)? ?(따로 )?(말하지 않|말씀드리지 않|정하지 않|단정하지 않|짚지 않|다루지 않)/;
function leakCheck(sen: string): FactHit | null {
  const m = sen.match(LEAK); return m ? { rule: "label_leak", detail: `생성 규칙·면책 노출 「${m[0]}」` } : null;
}

/** 연애 중·기혼에게 처음 만남을 검증하는 질문·「초반부터」 위험 신호(최종판3 2f). */
const FIRST_MEET = /초반부터|처음 만난 (자리|날)|첫 만남(에서|부터)|소개팅|만나자마자|캐묻나요|알게 된 지 얼마/;
function statusCheck(sen: string, ctx: FactCtx): FactHit | null {
  if (!(ctx.relationship === "dating" || ctx.relationship === "married") || !/love_marriage_child|saju_mbti_compatibility/.test(ctx.product)) return null;
  const m = sen.match(FIRST_MEET); return m ? { rule: "input_outside", detail: `지금 만나는 사이인데 처음 만남 검증 「${m[0]}」 → 지금 관계 점검으로` } : null;
}
/** 종합 표지·1장: 직업 장면 0(입력 직업의 소품·업무 낱말). chapter 0 = 표지. */
function jobScene(sen: string, ctx: FactCtx, chapter?: number): FactHit | null {
  if (!ctx.comprehensive || (chapter !== 0 && chapter !== 1)) return null;
  const w = ctx.jobWords.find(x => sen.includes(x)); return w ? { rule: "input_outside", detail: `종합 ${chapter ? "1장" : "표지"}에 직업 장면 「${w}」 → 직업과 무관한 보편 장면으로` } : null;
}

/**
 * 최종판3 12: 음양 방향을 정답지와 반대로 말한 꼴(판독: 오지안 음 2·양 6인데 「오지안님은 반대로 음 글자가 많아서」 — 검수가 2:6을 거꾸로 읽어 수리가 틀리게 고침).
 * 문장 주인(이름) 모두가 반대일 때만 잡는다.
 */
const YY_SIDE = /(?<![가-힣])(음|양)(?: 글자| 기운)?(?:이|가)? ?(?:더 )?(?:많|기울|센 편|강하)|(?<![가-힣])(음|양)(?: 글자| 기운)?(?:으로|로) 기울/;
function yinYangSide(sen: string, owners: readonly PersonFacts[]): FactHit | null {
  const m = sen.match(YY_SIDE); if (!m || !owners.length) return null;
  const side = (m[1] ?? m[2]) as "음" | "양";
  const bad = owners.filter(p => (side === "음" ? p.yinYang.yin < p.yinYang.yang : p.yinYang.yang < p.yinYang.yin));
  if (bad.length < owners.length) return null;
  return { rule: "fact_term", detail: `음양 방향: ${bad.map(p => `${p.name} 음 ${p.yinYang.yin}·양 ${p.yinYang.yang}`).join(", ")} — 「${side}」이 많다고 쓸 수 없다` };
}
/** 최종판3 12: 지금 대운의 끝을 정답지와 다르게 말한 꼴(판독: 신유 대운(2019~2028)을 「올해까지 이어지는 이 10년」 — 수리가 연도를 지우며 지어냄). */
/** 최종 A-4·5: 대운의 끝은 다음 대운의 교운 연·월(「2029년 11월 무렵까지」)이고, 지금 대운은 교운 시각 기준(정답지 dayun.current).
 * 「올해까지」 또는 「YYYY년(M월)까지」가 그 끝 해와 다르면 잡는다(엔진 endYear로 끊은 「2028년까지」 꼴). */
function dayunSpan(sen: string, ctx: FactCtx, owners: readonly PersonFacts[]): FactHit | null {
  if (!/대운|10년 흐름|이 10년/.test(sen)) return null;
  const thisYearEnd = /올해까지|올해로 (끝|마무리)|올해 (끝나|마무리)/.test(sen), until = sen.match(/((?:19|20)\d{2})년(?: \d{1,2}(?:~\d{1,2})?월)?(?: 무렵)?까지/);
  if (!thisYearEnd && !until) return null;
  for (const p of owners) {
    const named = p.dayun.cycles.filter(c => sen.includes(`${c.ganjiKo} 대운`) || sen.includes(`${c.ganji} 대운`) || sen.includes(`${c.ganji}(${c.ganjiKo})`) || sen.includes(`${c.ganjiKo}(${c.ganji})`));
    const cur = named.length === 1 ? named[0] : p.dayun.current != null ? p.dayun.cycles.find(c => c.index === p.dayun.current) : [...p.dayun.cycles].reverse().find(c => c.startYear <= ctx.thisYear);
    if (!cur) continue;
    const next = p.dayun.cycles.find(c => c.index === cur.index + 1), endYear = next ? Number((next.startSolarKst ?? String(next.startYear)).slice(0, 4)) : cur.endYear + 1;
    const said = thisYearEnd ? ctx.thisYear : Number(until![1]);
    if (said !== endYear) return { rule: "fact_dayun", detail: `${cur.ganjiKo} 대운은 ${endYear}년 교운 무렵까지 — 「${thisYearEnd ? "올해" : `${said}년`}까지」가 아니다` };
  }
  return null;
}
/** 한 문장 검사. paragraph = 그 문장이 든 문단(같은 문단 대조용), chapter = 장 번호(0 = 표지). */
export function factCheck(sen: string, ctx: FactCtx, paragraph = sen, chapter?: number): FactHit | null {
  const owners = ownersOf(sen, ctx);
  return renderCheck(sen) ?? dayunSpan(sen, ctx, owners) ?? yinYangSide(sen, owners) ?? leakCheck(sen) ?? statusCheck(sen, ctx) ?? jobScene(sen, ctx, chapter) ?? timeFixed(sen, ctx) ?? termPosition(sen, ctx, owners) ?? stageClaim(sen, owners) ?? relationClaim(sen, ctx, owners) ?? annualNoTouch(sen, ctx, owners, paragraph)
    ?? strengthClaim(sen, owners, paragraph) ?? ganjiClaim(sen, owners) ?? countStrengthMix(sen, owners) ?? meaningMisattr(sen, owners) ?? commonSplit(sen, ctx) ?? termAbsent(sen, ctx, owners) ?? inputOutside(sen, ctx);
}

/** 괄호 약어·한자 뒤 조사를 앞 한글 받침에 맞춘다(「눈(Ni)는」→「눈(Ni)은」). 결정론 정리(호출 0). */
export function fixParenParticles(text: string): { text: string; count: number } {
  let count = 0;
  const out = text.replace(/([가-힣])\(([A-Za-z]{1,5}|[一-鿿]{1,6})\)(은|는|이|가|을|를|과|와|으로|로)(?=[\s,.!?]|$)/g, (all, ch: string, inner: string, p: string) => {
    const code = ch.charCodeAt(0) - 0xac00; if (code < 0 || code > 11171) return all;
    const jong = code % 28, has = jong !== 0, rieul = jong === 8;
    const want = ({ 은: has ? "은" : "는", 는: has ? "은" : "는", 이: has ? "이" : "가", 가: has ? "이" : "가", 을: has ? "을" : "를", 를: has ? "을" : "를", 과: has ? "과" : "와", 와: has ? "과" : "와", 으로: has && !rieul ? "으로" : "로", 로: has && !rieul ? "으로" : "로" } as Record<string, string>)[p];
    if (want === p) return all;
    count++; return `${ch}(${inner})${want}`;
  });
  return { text: out, count };
}

/** 종합 본문 연·월 고정 정리: 「2026년 11월 한 달 동안」→「앞으로 한 달 동안」(호출 0). 나머지는 time_fixed로 수리. */
export function tidyFixedTime(text: string): { text: string; count: number } {
  let count = 0;
  const out = text.replace(/20\d\d년 ?\d{1,2}월(부터)? 한 달/g, () => { count++; return "앞으로 한 달"; }).replace(/(이번 달|이달) 한 달/g, () => { count++; return "앞으로 한 달"; });
  return { text: out, count };
}
export { stemHan };
