/**
 * AM2-7 1부(덕짱님 지시 2026-11-13) — 고치기 층: 문단 단위 · 섞지 않기(결정론, 호출 0).
 * 다시 쓴 문단(또는 결정론 고침 · 지우기 뒤 문단)은 문단째 받거나 문단째 버린다. 첫 원고 문장과 다시 쓴 문장을 섞지 않는다(옛 lock.ts 문장 잠금은 쓰지 않는다 —
 * P6 판독: 잠금이 만든 결함 네 꼴 · 차단 2, RULE_FACT 면제로 사실을 잃은 교체가 차단 4).
 * 받는 조건(부르는 쪽이 책 전체 다시 검사로 「새 차단 0 · 차단+경계 수 줄어듦」을 본다):
 *  ① 사실 낱말 보존 — 관계 이름 · 간지(해 · 달) · 대운 이름과 시작 연월 · 달 이름 · 십성 · 숫자가 빠지지 않고, 카드에 없는 것이 생기지 않는다.
 *  ② 대운 순서 말(「끝난 뒤 · 다음 줄기 · 이어지는」)이 대운 시작 해와 맞는다.
 *  ③ 지시어 앞말(「그/이 + 명사 · 이 달들 · 두 달 · 같은 + 명사 · 이번엔 · 하나를 · …니까요」)이 문단 안이나 바로 앞 문단에 있다.
 *  ④ 소제목 핵심 주장 · 반드시 쓸 것 · 둘째 핵심이 남는다. ⑤ 분량이 설계 하한 밑으로 떨어지지 않는다.
 */
import { splitSentences } from "../safety/patterns";
import { premiseHits, soften, type Inputs } from "@/lib/brief/premise";

const clean = (t: string) => t.replace(/[⟪⟫〈〉]/g, "").replace(/«[^»]*»|["“][^"”]*["”]/g, " ");
const GJ = "[갑을병정무기경신임계][자축인묘진사오미신유술해]";
const TG = /비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/g;
export type FactKind = "rel" | "month" | "ganji" | "dayun" | "tg" | "num";
export function factTokens(t0: string, rels: readonly string[]): Record<FactKind, Set<string>> {
  const t = clean(t0);
  const all = (re: RegExp, f: (m: RegExpMatchArray) => string = m => m[0]) => new Set([...t.matchAll(re)].map(f));
  return {
    rel: new Set(rels.filter(r => r.length >= 2 && t.includes(r))),
    month: all(new RegExp(`(?:2028년 )?(?:1[0-2]|[1-9])월(?= · ${GJ}월| |,|$)|${GJ}월`, "g"), m => m[0].replace(/^2028년 /, "")),
    ganji: all(new RegExp(`${GJ}(?=년|해(?! ?(가|를|는|도|와|로|에)))`, "g")),
    dayun: all(new RegExp(`(${GJ}) 대운|20\\d\\d년 (?:1[0-2]|[1-9])월 무렵`, "g")),
    tg: all(TG),
    num: all(/20\d\d년|\d+번째|만 \d+세|\d+세|\d+개월|\d+개|\d+가지|\d+명|약 \d+년/g),
  };
}
/** 깃발 규칙 → 바뀌어도 되는 사실 종류(그 깃발이 바로 그 사실을 고치라는 것일 때만). 말 꼴 · 되풀이 깃발은 사실을 바꿀 수 없다(옛 RULE_FACT의 num · month 면제를 없앴다). */
const RULE_FACT: Readonly<Record<string, readonly FactKind[]>> = {
  relation_scope: ["rel"], rel_verb: ["rel"], rel_mix: ["rel"], seat_badge: ["rel"], fact_relation: ["rel"], key_value: ["rel", "month", "tg", "num"], relation_frame: ["rel"],
  month_list: ["month"], month_range: ["month"], month_line: ["month"], calendar_month: ["month"], orphan_deictic: ["month"], future_past: ["month", "num"], time_extra: ["month", "num"],
  key_tengod: ["tg"], sky_ground: ["tg"], tg_join: ["tg"], pair_scope: ["tg"], pair_link: ["tg"], evidence_owner: ["tg"], fact_term: ["tg"], ten_god_direction: ["tg"],
  count_claim: ["num"], dayun_position: ["num", "month"], date_deadline: ["num"], degree: ["num"], dayun_claim: ["dayun", "num", "ganji"], fact_dayun: ["dayun", "num", "ganji"], fact_ganji: ["ganji", "dayun", "num", "month"], dayun_year: ["dayun", "num", "ganji"], dayun_order: ["dayun"],
};
export const exemptOf = (rules: readonly string[]) => new Set(rules.flatMap(r => RULE_FACT[r] ?? []));
/** ① 사실 낱말: 잃은 것(깃발이 그 사실을 가리킬 때만 예외) · 카드에 없는데 새로 생긴 것. */
export function factIssues(before: string, after: string, rels: readonly string[], card: string, exempt: ReadonlySet<FactKind> = new Set()): string[] {
  const a = factTokens(before, rels), b = factTokens(after, rels), cardT = clean(card), out: string[] = [];
  for (const k of Object.keys(a) as FactKind[]) {
    if (!exempt.has(k)) for (const v of a[k]) if (!b[k].has(v)) out.push(`잃음 ${k}:${v}`);
    for (const v of b[k]) if (!a[k].has(v) && !cardT.includes(v.replace(/ 무렵$/, ""))) out.push(`카드 밖 ${k}:${v}`);
  }
  return out;
}

/** ② 대운 순서 말: 「X 대운은 이 10년이 끝난 뒤 · 다음 줄기 · 뒤를 이어」 — X가 그 10년보다 먼저(또는 같이) 시작하면 틀린 순서. */
export type Cycle = { readonly ganji: string; readonly startYear: number; readonly endYear: number };
export function dayunOrderIssues(text: string, life: readonly Cycle[], ref: { readonly start: number; readonly end: number } | null): string[] {
  const out: string[] = [];
  for (const sen of splitSentences(clean(text))) {
    if (!/끝난 뒤|끝나고|다음 줄기|뒤를 (이어|잇)|뒤에 (이어|오)|이어지는 다음|다음 대운/.test(sen)) continue;
    const named = [...sen.matchAll(new RegExp(`(${GJ}) 대운`, "g"))].map(m => m[1]);
    for (const g of named) {
      const cyc = life.find(c => c.ganji.includes(g)); if (!cyc || !ref) continue;
      if (/이 (10년|대운)|그 10년/.test(sen) && cyc.startYear < ref.end && cyc.endYear >= ref.start) out.push(`「${g} 대운」은 이 10년(${ref.start}~${ref.end}) 안 — 「끝난 뒤 · 다음 줄기」가 아니다`);
    }
  }
  return out;
}

/** ③ 지시어 앞말. prev = 같은 소제목 바로 앞 문단(없으면 소제목 · 머리 문장). */
/** 앞말 없이도 서는 「그 · 이 + 말」(때 · 자리 · 앞 문장 전체를 받는 말). 조사를 뗀 바탕 말로 본다. */
const SAFE_NOUN = new Set(["해", "달", "때", "무렵", "시기", "대운", "10년", "기간", "책", "사람", "쪽", "날", "시간", "순간", "자리", "흐름", "기운", "뒤", "앞", "안", "중", "덕", "덕분", "정도", "만큼", "점", "일", "말", "가운데", "이후", "이전", "후", "전", "사이", "모든", "외", "밖", "위", "아래", "옆", "증거", "결과", "이유", "까닭", "때문", "뜻", "차이", "대신", "다음", "반대", "덕택", "바람에", "자체", "과정", "와중", "시작", "끝", "흐름대로", "해에", "달에", "날에"]);
const stem2 = (w: string) => w.replace(/(에서는|에서도|에서|에게는|에게|으로는|으로|로는|로|에는|에도|에|의|을|를|이|가|은|는|도|만|과|와|처럼|까지|부터|이라|라)+$/, "").slice(0, 2);
export function antecedentIssues(para: string, prev: string): string[] {
  const out: string[] = [], ss = splitSentences(clean(para));
  ss.forEach((sen, i) => {
    const before = `${clean(prev)} ${ss.slice(0, i).join(" ")}`;
    const at = (re: RegExp) => { const m = re.exec(sen); return m ? { m, pre: `${before} ${sen.slice(0, m.index)}` } : null; };
    const months = (t: string) => [...t.matchAll(new RegExp(`(?:1[0-2]|[1-9])월|${GJ}월|20\\d\\d년`, "g"))].length;
    const list = at(/(?<![가-힣])(이|그) 달들|(?<![가-힣])(이|그) (두|세|네|다섯) (달|해)|(?<![가-힣])(두|세) 달(?!씩| 동안| 뒤| 전| 넘)/);
    if (list) { const need = /두/.test(list.m[0]) ? 2 : /세/.test(list.m[0]) ? 3 : /네/.test(list.m[0]) ? 4 : /다섯/.test(list.m[0]) ? 5 : 2; if (months(list.pre) < need) out.push(`「${list.m[0]}」이 가리키는 달 · 해 이름이 앞에 없다`); }
    for (const m of sen.matchAll(/(?<![가-힣])(그|이) ([가-힣]{1,6})/g)) {
      const noun = m[2], base = noun.replace(/(에서는|에서도|에서|에게는|에게|으로는|으로|로는|로|에는|에도|에|의|을|를|이|가|은|는|도|만|과|와|처럼|까지|부터|이라|라|입니다|이에요|예요)+$/, "");
      if (SAFE_NOUN.has(base) || SAFE_NOUN.has(noun) || /^(런|렇|러|래|리|중|외|날|번|달|해|때|곳|것|거|게|쪽|분|건|걸|뒤|앞)/.test(noun) || base.length < 2) continue;
      const pre = `${before} ${sen.slice(0, m.index)}`, st = stem2(noun);
      // 동사에서 온 이름꼴(눌림 · 쌓임 · 기울기 …)은 앞의 동사 꼴(눌릴 · 쌓이)도 앞말로 본다(첫 글자).
      const nominal = /[림음임함김짐기]$/.test(base) && pre.includes(base.slice(0, 1));
      if (st.length >= 2 && !pre.includes(st) && !nominal) out.push(`「${m[0]}」이 가리키는 말이 앞에 없다`);
    }
    const same = at(/(?<![가-힣])같은 ([가-힣]{2,})/);
    if (same && !/(과|와|처럼) 같은/.test(sen.slice(Math.max(0, same.m.index - 3), same.m.index + 3)) && !/(과|와) 같은/.test(sen) && !same.pre.includes(stem2(same.m[1]))) out.push(`「${same.m[0]}」이 받는 말이 앞에 없다`);
    if (/이번엔|이번에는/.test(sen) && !/(과|와) 같은|지만|와 달리|과 달리/.test(sen) && months(before) === 0 && !/앞|지난|처음|전에/.test(before)) out.push("「이번엔」이 견줄 앞 때가 앞에 없다");
    if (/(?<![가-힣])하나를/.test(sen) && !/둘|두 |세 |여러|가지|중|가운데|목록|들/.test(`${before} ${sen.slice(0, sen.indexOf("하나를"))}`)) out.push("「하나를」이 고를 목록이 앞에 없다");
    if (/니까요[.!]?$/.test(sen) && i === 0 && !prev.trim()) out.push("「…니까요」가 받을 앞 문장이 없다");
  });
  return out;
}

/** ④ 핵심 주장 · 반드시 쓸 것 · 둘째 핵심이 남는가(소제목 글 전 · 뒤). names = 이름(반드시 쓸 것 · 둘째 핵심), claims = 핵심 주장 글. */
const grams = (t: string) => { const n = t.replace(/[^가-힣A-Za-z0-9]/g, ""), s = new Set<string>(); for (let i = 0; i + 4 <= n.length; i++) s.add(n.slice(i, i + 4)); return s; };
const overlap4 = (a: string, b: string) => { const A = grams(a), B = grams(b); let n = 0; for (const w of A) if (B.has(w)) n++; return n; };
export function claimIssues(before: string, after: string, names: readonly string[], claims: readonly string[]): string[] {
  const out: string[] = [];
  for (const n of names) if (n && before.includes(n) && !after.includes(n)) out.push(`핵심 잃음 「${n}」`);
  // 핵심 주장 글은 카드 값(「이 해의 연애 신호: 오름」 같은 칸 꼴)일 수 있어 겹침이 흔들린다 — 뚜렷이 있던 것(6창 이상)이 거의 사라질 때(2창 미만)만.
  for (const c of claims) if (c && overlap4(before, c) >= 6 && overlap4(after, c) < 2) out.push(`핵심 주장 잃음 「${c.slice(0, 30)}」`);
  return out;
}
/** ⑤ 분량: 설계 하한 밑으로 떨어지지 않는다(이미 밑이면 더 줄지 않는다). */
export const lengthIssue = (before: string, after: string, min: number): string | null => { const a = before.replace(/\s/g, "").length, b = after.replace(/\s/g, "").length;
  // 하한을 넘던 글이 밑으로 떨어지거나, 이미 밑인 글이 15% 넘게 줄면 버린다(결정론 고침 · 한 문장 다시 쓰기의 몇 글자 줄어듦은 받는다).
  return (a >= min && b < min) || (a < min && b < a * 0.85) ? `분량 ${a} → ${b}자(하한 ${Math.round(min)})` : null; };

/**
 * AM2-7 1부 5: 결정론으로 고칠 수 있는 것(다시 쓰기에 보내지 않는다) — 이름 부르기 · 정도말 · 꺾쇠 · 칸 이름 머리말.
 * 부름말 「X님, 」은 쉼표까지 지운다. 같은 문장에 「당신」이 이미 있으면 이름 쪽을 지운다. 나머지 이름은 「당신」(조사 맞춤).
 */
export function detFix(sentence: string, rule: string, a: { readonly callName?: string; readonly name?: string; readonly small?: readonly string[]; readonly inputs?: Inputs }): string | null {
  let s = sentence;
  // AM2-7 2부 + 1부 5: 중립 꼴이 정해진 전제 말(월급날 → 수입 · 돈이 들어오는 날, 일터 → 사회생활, 동료 → 주변 사람 …)은 결정론으로 바꾼다. 중립 꼴이 없는 말이 남으면 다시 쓰기로.
  if (rule === "input_premise") { if (!a.inputs) return null; const t = soften(s, a.inputs); return t !== s && !premiseHits(t, a.inputs).length ? t : null; }
  if (rule === "name_call") {
    const names = [...new Set([a.callName, a.callName?.replace(/(님|씨)$/, ""), a.name, a.name && a.name.length >= 3 ? a.name.slice(1) : undefined].filter((x): x is string => Boolean(x && x.length >= 2)))].sort((x, y) => y.length - x.length);
    const alt = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"); if (!alt) return null;
    s = s.replace(new RegExp(`(?:${alt})\\s?(?:님|씨)?\\s?,\\s*`, "g"), "");
    const J: Readonly<Record<string, string>> = { 은: "은", 는: "은", 이: "이", 가: "이", 을: "을", 를: "을", 과: "과", 와: "과", 의: "의", 에게: "에게", 도: "도", 만: "만", 처럼: "처럼" };
    const re = new RegExp(`(?:${alt})\\s?(?:님|씨)?(은|는|이|가|을|를|과|와|의|에게|도|만|처럼)?(?![가-힣])\\s?`, "g");
    s = /당신/.test(s.replace(re, "")) ? s.replace(re, "") : s.replace(re, (_m, j?: string) => `당신${j ? J[j] ?? j : ""} `);
    s = s.replace(/\s{2,}/g, " ").replace(/^\s+/, "").trim();
  } else if (rule === "degree" || rule === "intensity_claim") {
    s = s.replace(/(?<![가-힣])(가장|한층|훨씬|더욱|크게) (?=[가-힣])/g, "");
    for (const w of a.small ?? []) s = s.replace(new RegExp(`큰 ${w}`, "g"), `작은 ${w}`);
  } else if (rule === "angle_name") {
    s = s.replace(/(?<=^|[,.] |의 |반면 |한편 )(일|돈|연애) 쪽(에서는|에서) /g, (_m, d: string) => `${d}에서는 `).replace(/(?<=^|[,.] |의 |반면 |한편 )성격 쪽(에서는|에서) /g, "성격으로는 ");
  } else if (rule === "bracket") s = s.replace(/[〈〉]/g, "");
  else return null;
  return s && s !== sentence ? s : null;
}
/** 결정론 고침이 맡는 규칙(다시 쓰기에 보내지 않는다). */
export const DET_RULES: ReadonlySet<string> = new Set(["name_call", "degree", "intensity_claim", "angle_name"]);
/**
 * 1부 4: 다시 쓰기를 부르는 깃발 = 차단 전부(결정론 고침 몫 빼고) + 경계 일부(must_bare · input_premise · past_assert · fact 계열).
 * 기록만 하는 깃발(다시 쓰기 · 지우기 안 함): 되풀이 · 화면 되풀이 · 배지 줄 옮김 · 머리 끝 · 틀 · 방향 · 처방 수 · 끝말 상한 · 결 상한 · 이웃 되풀이(+ 짝 끝 문장 · 짝 첫머리 · 문단 수 · 핵심 달 목록 · 같은 소제목 처방).
 */
export const RECORD_ONLY: ReadonlySet<string> = new Set(["chapter_repeat", "screen_repeat", "rel_echo", "head_echo", "link_template", "tone_mismatch", "rx_extra", "ending_cap", "gyeol_cap", "rep_adjacent",
  "pair_last", "pair_opener", "pair_causal", "key_paras", "claim_months", "advice_repeat_sec", "rx_repeat_sec", "head_repeat", "pointer_expand", "promise_tail", "domain_opener", "angle_leak", "advice_repeat", "rx_repeat", "phrase_repeat", "scene_repeat", "meaning_repeat", "prior_overlap", "closing_repeat"]);
export const REWRITE_BOUNDARY: ReadonlySet<string> = new Set(["must_bare"]);
