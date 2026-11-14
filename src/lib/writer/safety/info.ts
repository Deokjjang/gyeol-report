/**
 * W3 P3 7절 — 정보량 지표(결정론·호출 0, 기록만 하고 본문을 바꾸지 않는다). 절(소제목)마다·책마다 센다.
 *  - evidenceUsed: 그 절 card.evidence 이름·자리 이름이 본문에 나온 수. 카드 없는 책은 trait 이름 사전 + 자리 이름 사전에서 그 절에 나온 서로 다른 낱말 수.
 *  - restatements: 「당신은/○○님은 … 사람·타입·편·스타일·유형이에요」 재진술 문장 수(rw2 R5 꼬리 틀). lessons: 장 끝 두 문장의 「A는 B가 아니라 C예요」 교훈문(rw2 R4).
 *  - sameSentence: 책 안 같은·거의 같은 문장 쌍(정규화 같음 또는 두 글자 묶음 자카드 ≥ 0.8, 14자 이상 — repair3.sameSentence, rw2 R1). 뒤 문장의 절에 센다.
 *  - rehash: 다른 장에서 같은 주장 재탕(이름을 지운 세 글자 묶음 자카드 ≥ 0.45 또는 14자 연속, 처방·같은 문장 제외 — metrics.infoRepeats claim을 장 사이로, rw2 R2).
 *  - phraseRepeat: 다른 장에서 같은 구절(세 어절, 내용 낱말 둘 이상 — 고객 이름·MBTI 유형을 지우고 본다)을 다시 쓴 문장 수(KNOWN3 R 「시동이 걸리면 ×2」 꼴). 잡음이 있는 추세 지표(관문 아님).
 *  - rxRepeat: 같은 처방 계열(권유 문장의 prescriptions RX 14종 + 문체 「한 줄 말하기」 계열)의 책 안 3번째부터. rxFamilies3: 3개 장 이상에 나온 계열 수(rw2 R2b).
 *  - overusedTails: 같은 꼬리 틀(끝 두 어절, 앞 어절은 끝 글자)이 책에서 6번 이상인 틀 수(rw2 R5).
 *  - sceneUnbacked: 생활 장면 문장 = 장면 낱말(때·장소·물건) + 독자 경험 단정·수사 물음(가정·권유 문장 제외) 가운데
 *    card.scene(카드가 있으면 그 절 장면만) 또는 씨앗·DB 장면(scenes)과 겹치지 않는 것(rw2 R9·F1). 겹침 = 장면 낱말 하나 + 다른 내용 낱말 하나 이상 공유.
 *    sceneFirst: 그 가운데 소제목 첫 문장(F1). sceneMbti: 그 가운데 MBTI 유형·기능을 붙인 문장(소품에 MBTI를 붙인 꼴, rw2 L5).
 *  - exposure: 4절 노출 금지 낱말 수(exposure.ts, grade·rule).
 * 카드가 없는 옛 책(운영 저장본)은 dict(trait·자리 이름, 씨앗 장면)로 센다. 카드가 있으면 cards(절 id → evidence·scene)를 쓴다.
 */
import { ADVICE_FORM, rxKindsOf } from "@/lib/brief/prescriptions";
import type { Brief } from "@/lib/brief/schema";
import { exposureHits } from "./exposure";
import { INFO_JACCARD, INFO_RUN } from "./metrics";
import { splitSentences } from "./patterns";
import { adviceFamilyOf } from "./style";

export type InfoSection = { readonly heading: string; readonly paragraphs: readonly string[] };
export type InfoChapter = { readonly n: number; readonly sections: readonly InfoSection[]; readonly source?: string; readonly keys?: readonly string[] };
/** 카드 쪽(brief.design)이 줄 절 카드의 최소 꼴. chapter = 장 번호, section = 장 안 절 순서(0부터). */
export type InfoCard = { readonly chapter: number; readonly section: number; readonly evidence: readonly { readonly name: string; readonly where?: readonly string[] }[]; readonly scene?: { readonly text: string } | null };
/** 카드 없는 책의 사전: trait·용어 이름(쉬운 이름 포함), 지우고 비교할 이름(고객 이름·MBTI 유형), 근거 있는 장면 글(씨앗·DB 장면). */
export type InfoDict = { readonly traits?: readonly string[]; readonly names?: readonly string[]; readonly scenes?: readonly string[] };
export type InfoSectionMetric = { readonly at: string; readonly evidenceUsed: number; readonly restatements: number; readonly lessons: number; readonly sameSentence: number; readonly rehash: number; readonly phraseRepeat: number; readonly rxRepeat: number; readonly sceneUnbacked: number; readonly sceneFirst: number; readonly sceneMbti: number; readonly exposure: number };
export type InfoMetric = {
  readonly version: typeof INFO_VERSION; readonly cards: boolean; readonly sentences: number; readonly sections: number;
  readonly totals: Omit<InfoSectionMetric, "at"> & { readonly scenes: number; readonly exposureGrade: number; readonly exposureRule: number; readonly rxFamilies3: number; readonly overusedTails: number; readonly evidenceZero: number };
  readonly rxFamilies: Readonly<Record<string, number>>;
  /** 0이 아닌 절만(자리 「장.절」, 절은 1부터). */
  readonly bySection: readonly InfoSectionMetric[];
  /** 진단용 자리 목록(문장은 넣지 않는다 — 운영 책 평가 도구가 고객 글을 옮기지 않게). */
  readonly at: { readonly sameSentence: readonly (readonly [string, string])[]; readonly rehash: readonly (readonly [string, string])[]; readonly sceneUnbacked: readonly string[]; readonly exposure: readonly string[] };
  /** opts.detail일 때만(평가 도구용, Book 메타에는 넣지 않는다): 문장마다 걸린 지표(장 번호·장 안 절 0부터·절 안 문장 0부터). */
  readonly hits?: readonly { readonly c: number; readonly s: number; readonly i: number; readonly kinds: readonly InfoKind[] }[];
};
export type InfoKind = "restatement" | "lesson" | "sameSentence" | "rehash" | "phraseRepeat" | "rxRepeat" | "sceneUnbacked" | "sceneFirst" | "sceneMbti" | "exposureGrade" | "exposureRule";
export const INFO_VERSION = "info-v1" as const;

/** 같은 문장 기준(수리 재검 repair3·지표 sameSentence 공용): 한글·숫자만 남겨 같거나, 두 글자 묶음 자카드 ≥ 0.8, 둘 다 14자 이상. */
export const SAME_JACCARD = 0.8, SAME_MIN = 14;
const normSame = (s: string) => s.replace(/[^가-힣0-9]/g, "");
const bigrams = (t: string) => { const out = new Set<string>(); for (let i = 0; i + 1 < t.length; i++) out.add(t.slice(i, i + 2)); return out; };
const jaccard = (p: ReadonlySet<string>, q: ReadonlySet<string>) => { if (Math.min(p.size, q.size) / Math.max(p.size, q.size, 1) < SAME_JACCARD) return 0; let inter = 0; for (const g of p) if (q.has(g)) inter++; return inter / (p.size + q.size - inter); };
export function sameSentence(a: string, b: string, min = SAME_MIN, jac = SAME_JACCARD): boolean {
  const x = normSame(a), y = normSame(b);
  if (x.length < min || y.length < min) return false;
  return x === y || jaccard(bigrams(x), bigrams(y)) >= jac;
}

/** 자리 이름(한자 용어 + 쉬운 꼴). 「시간」은 일상어(때)라 뺀다. */
const POSITION = /(?<![가-힣])(연간|연지|년간|년지|월간|월지|일간|일지|시지|연주|월주|일주|시주)(?=[은는이가을를의에과와도로만(,.\s]|$)|태어난 (?:해|달|날|시각|시간)의? ?(?:하늘|땅) ?글자/g;
/** 재진술: 독자(당신·○○님)를 주어로 「… 사람·타입·편·스타일·유형」으로 맺는 문장. */
const RESTATE = /^(?:결국 |그래서 |즉 |한마디로 |다시 말해 )?(?:당신|[가-힣]{1,4}님)(?:은|는) [^.?!]{2,60}(?:사람|타입|편|스타일|유형|쪽)(?:이에요|입니다|이죠|예요)[.!]?$/;
/** 교훈문: 「A는 B가 아니라 C예요」(장 끝 두 문장에서만, 평서문으로 맺는 대비). */
const LESSON = /아니라 [^.?!]{1,60}(?:이에요|예요|입니다|이죠|거예요|것입니다|해요|돼요|됩니다)[.!]?$/;
/** 꼬리 틀(rw2 R5): 끝 두 어절, 앞 어절은 끝 글자만(「…하는 사람이에요」→「는 사람이에요」, 「…일이 돼요」→「이 돼요」). 권유 끝(처방)은 rxRepeat가 센다. */
const tailFrame = (t: string): string | null => {
  const w = t.replace(/[⟪⟫"'“”‘’]/g, "").trim().replace(/[.!?…]+$/, "").split(/\s+/); if (w.length < 2) return null;
  const a = w[w.length - 2], b = w[w.length - 1]; if (!/[가-힣]$/.test(a) || /(세요|보세요|두세요|주세요)$/.test(b)) return null;
  return `${a.slice(-1)} ${b}`;
};
/** 과용 꼬리 틀 기준(rw2 R5: 책에서 6번 이상). */
export const TAIL_OVERUSE = 6;
/** 장면 낱말: 때·장소·물건(생활 장면의 소품). */
const SCENE_WORD = /(?<![가-힣])(아침|저녁|밤|새벽|주말|휴일|월요일|금요일|퇴근|출근|점심|야근|마감|회의|카페|마트|편의점|지하철|버스|택시|택배|알림|메시지|문자|단톡|카톡|휴대폰|핸드폰|스마트폰|장바구니|통장|영수증|노트북|책상|냉장고|주방|거실|침대|소파|우산|달력|캘린더|메모|포스트잇|이메일|메일|전화|약속|모임|여행|짐|가방|지갑|커피|식당|메뉴|배달|쇼핑|선물|생일|간식|산책|헬스|운동|강의|발표|면접|견적|월급|정산|청소|빨래|설거지|장보기|화분|반려|고양이|강아지|사진|영상|유튜브|게임|드라마|노래|책장|서랍|옷장|옷|신발)/g;
/** 독자 경험 단정·수사 물음(「…하죠」「…않나요?」「…곤 해요」「…적 있죠」「…는 편이에요」). */
const EXPERIENCE = /(죠|지요|나요\?|않나요|잖아요|곤 해요|곤 하죠|곤 합니다|적이 있|적 있|본 적|해 봤|했을 거예요|있었을 거예요|하셨|보셨|있었죠|하게 돼요|하게 됩니다|편이에요|편이죠|편입니다|일이 잦|일이 많|기 쉬워요|기 쉽습니다|기도 해요|기도 하죠)[.!?]?$/;
/** 가정·권유(처방)·상상 권유는 장면 단정이 아니다. */
const NOT_ASSERT = /라면|다면|된다면|생기면|생긴다면|하게 되면|할 때는|경우에는|(보세요|하세요|두세요|주세요|마세요|해 보기)[.!?]?$|떠올려|그려 보/;
const MBTI_MARK = /\b[EI][NS][TF][JP]\b|\b(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\b|MBTI/;
const STOP = new Set(["당신", "사람", "마음", "생각", "그때", "이때", "지금", "오늘", "하루", "조금", "먼저", "정말", "자주", "가장", "이런", "그런", "있어", "있는", "하는", "합니다", "해요", "있어요", "때문", "정도", "부분", "자신", "서로", "모두"]);
const ADVICE_END = /(보세요|하세요|두세요|주세요|마세요|해요\?|봐요|좋아요|좋습니다|됩니다|충분합니다)[.!?]?["'”’)]*$/;
/** 구절 반복에서 내용 낱말로 치지 않는 말(이음·끝맺음·흔한 말). */
const PHRASE_STOP = /^(수|것|거|때|더|잘|좀|또|그|이|저|한|두|세|및|등|중|안|못|다|있어요|있습니다|있는|있고|돼요|됩니다|해요|합니다|하는|하고|하면|해서|보세요|하세요|입니다|이에요|예요|같은|그런|이런|당신|당신은|당신의|당신이|당신에게|사람|사람이|사람은|마음|마음이|먼저|조금|정말|가장|자주|그래서|하지만|그리고|오늘|하루|이번|지금|그때|이때|편이에요|쪽이에요)$/;

const bare = (s: string) => s.replace(/[⟪⟫]/g, "").trim();
const stemOf = (w: string) => w.replace(/(에서는|에서도|에서|에게는|에게|으로는|으로|로는|에는|에도|까지|부터|처럼|마다|이랑|랑|하고|이나|나|의|을|를|이|가|은|는|도|만|과|와|로|에)$/, "");
const contentWords = (s: string) => new Set((s.match(/[가-힣]{2,}/g) ?? []).map(stemOf).filter(w => w.length >= 2 && !STOP.has(w)));
const grams3 = (t: string) => { const g = new Set<string>(); for (let i = 0; i + 3 <= t.length; i++) g.add(t.slice(i, i + 3)); return g; };
function longestRun(a: string, b: string): number {
  let best = 0; const prev = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) { let diag = 0; for (let j = 1; j <= b.length; j++) { const tmp = prev[j]; prev[j] = a[i - 1] === b[j - 1] ? diag + 1 : 0; if (prev[j] > best) best = prev[j]; diag = tmp; } }
  return best;
}
const escape = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 생활 장면 문장인가(장면 낱말 + 경험 단정·수사 물음, 가정·권유 제외). 장면 낱말 목록을 돌려준다(없으면 null). */
export function lifeScene(sentence: string): string[] | null {
  const s = bare(sentence);
  if (NOT_ASSERT.test(s) || !EXPERIENCE.test(s)) return null;
  const words = [...new Set([...s.matchAll(SCENE_WORD)].map(m => m[1]))];
  return words.length ? words : null;
}
/** 장면 문장이 근거 장면 글(씨앗·DB 장면·카드 장면)과 겹치는가: 장면 낱말 하나 + 다른 내용 낱말 하나 이상. */
export function sceneBacked(sentence: string, words: readonly string[], backing: readonly string[]): boolean {
  const mine = contentWords(bare(sentence));
  return backing.some(b => { if (!words.some(w => b.includes(w))) return false; const theirs = contentWords(b); let shared = 0; for (const w of mine) if (theirs.has(w) && !words.includes(w)) shared++; return shared >= 1; });
}

export function infoMetrics(chapters: readonly InfoChapter[], opts: { readonly dict?: InfoDict; readonly cards?: readonly InfoCard[]; readonly detail?: boolean } = {}): InfoMetric {
  const dict = opts.dict ?? {}, cards = opts.cards?.length ? opts.cards : null;
  const traitRe = (dict.traits ?? []).filter(t => t.length >= 2).sort((a, b) => b.length - a.length).map(t => ({ t, re: new RegExp(`(?<![가-힣])${escape(t)}`) }));
  const strip = [...new Set([...(dict.names ?? []), ...(dict.traits ?? [])].filter(x => x.length >= 2))].sort((a, b) => b.length - a.length);
  const keyOf = (sen: string) => strip.reduce((t, n) => t.split(n).join(" "), sen).replace(/앞에서 본|앞서 본|앞에서 말한/g, " ").replace(/[^가-힣0-9]/g, "");
  type Sen = { c: number; s: number; i: number; first: boolean; text: string; key: string; n: string; bi: ReadonlySet<string> };
  const sens: Sen[] = [];
  const sectionsOf = chapters.filter(c => c.source !== "deterministic");
  for (const c of sectionsOf) c.sections.forEach((sec, si) => { let i = 0; sec.paragraphs.forEach((p, pi) => splitSentences(p).forEach((t, ti) => { const text = bare(t), n = normSame(text); sens.push({ c: c.n, s: si, i: i++, first: pi === 0 && ti === 0, text, key: keyOf(text), n, bi: bigrams(n) }); })); });
  const at = (x: { c: number; s: number }) => `${x.c}.${x.s + 1}`;
  const hitOf = new Map<Sen, Set<InfoKind>>();
  const mark = (x: Sen, k: InfoKind) => { if (!opts.detail) return; const m = hitOf.get(x) ?? new Set<InfoKind>(); m.add(k); hitOf.set(x, m); };
  const per = new Map<string, { evidenceUsed: number; restatements: number; lessons: number; sameSentence: number; rehash: number; phraseRepeat: number; rxRepeat: number; sceneUnbacked: number; sceneFirst: number; sceneMbti: number; exposure: number }>();
  const row = (k: string) => { let r = per.get(k); if (!r) { r = { evidenceUsed: 0, restatements: 0, lessons: 0, sameSentence: 0, rehash: 0, phraseRepeat: 0, rxRepeat: 0, sceneUnbacked: 0, sceneFirst: 0, sceneMbti: 0, exposure: 0 }; per.set(k, r); } return r; };
  // 근거 사용(절마다).
  let evidenceZero = 0;
  for (const c of sectionsOf) c.sections.forEach((sec, si) => {
    const text = [sec.heading, ...sec.paragraphs].join(" ").replace(/[⟪⟫]/g, "");
    let n = 0;
    const card = cards?.find(x => x.chapter === c.n && x.section === si);
    if (cards) { for (const e of card?.evidence ?? []) if (text.includes(e.name) || (e.where ?? []).some(w => w.length >= 2 && text.includes(w))) n++; }
    else { const hit = new Set<string>(); for (const { t, re } of traitRe) if (re.test(text) && ![...hit].some(h => h.includes(t))) hit.add(t); for (const m of text.matchAll(POSITION)) hit.add(m[0]); n = hit.size; }
    row(at({ c: c.n, s: si })).evidenceUsed = n; if (!n) evidenceZero++;
  });
  // 재진술·교훈문·노출·장면.
  let scenes = 0, exposureGrade = 0, exposureRule = 0;
  const exposureAt: string[] = [], sceneAt: string[] = [];
  const lastTwo = new Set<Sen>();
  for (const c of sectionsOf) { const mine = sens.filter(x => x.c === c.n); for (const x of mine.slice(-2)) lastTwo.add(x); }
  for (const x of sens) {
    const r = row(at(x));
    if (RESTATE.test(x.text)) { r.restatements++; mark(x, "restatement"); }
    if (lastTwo.has(x) && LESSON.test(x.text)) { r.lessons++; mark(x, "lesson"); }
    const ex = exposureHits(x.text); if (ex.length) { r.exposure += ex.length; exposureGrade += ex.filter(e => e.kind === "grade").length; exposureRule += ex.filter(e => e.kind === "rule").length; exposureAt.push(at(x)); for (const e of ex) mark(x, e.kind === "grade" ? "exposureGrade" : "exposureRule"); }
    const words = lifeScene(x.text); if (!words) continue;
    scenes++;
    const card = cards?.find(k => k.chapter === x.c && k.section === x.s);
    const backing = cards ? (card?.scene?.text ? [card.scene.text] : []) : dict.scenes ?? [];
    if (sceneBacked(x.text, words, backing)) continue;
    r.sceneUnbacked++; sceneAt.push(at(x)); mark(x, "sceneUnbacked"); if (x.first) { r.sceneFirst++; mark(x, "sceneFirst"); } if (MBTI_MARK.test(x.text)) { r.sceneMbti++; mark(x, "sceneMbti"); }
  }
  // 같은 문장·장 사이 재탕(뒤 문장의 절에 센다).
  const same: [string, string][] = [], rehash: [string, string][] = [];
  const items = sens.map(x => ({ x, g: grams3(x.key) }));
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i].x, B = items[j].x;
    if (A.n.length >= SAME_MIN && B.n.length >= SAME_MIN && (A.n === B.n || jaccard(A.bi, B.bi) >= SAME_JACCARD)) { same.push([at(A), at(B)]); row(at(B)).sameSentence++; mark(A, "sameSentence"); mark(B, "sameSentence"); continue; }
    if (A.c === B.c || A.key.length < 15 || B.key.length < 15) continue;
    if (ADVICE_END.test(A.text) && ADVICE_END.test(B.text)) continue;
    const ga = items[i].g, gb = items[j].g; let inter = 0; for (const g of ga) if (gb.has(g)) inter++;
    const jac = inter / (ga.size + gb.size - inter);
    if (jac < INFO_JACCARD && (inter < INFO_RUN - 2 || longestRun(A.key, B.key) < INFO_RUN)) continue;
    rehash.push([at(A), at(B)]); row(at(B)).rehash++; mark(A, "rehash"); mark(B, "rehash");
  }
  // 장 사이 같은 구절(세 어절, 내용 낱말 둘 이상). 고객 이름·MBTI 유형이 든 구절은 보지 않는다.
  { const people = (dict.names ?? []).filter(x => x.length >= 2).sort((a, b) => b.length - a.length), firstAt = new Map<string, number>();
    for (const x of sens) {
      const w = people.reduce((t, n) => t.split(n).join(" ∅ "), x.text).replace(/[⟪⟫"“”'‘’?!.,·()…:]/g, " ").split(/\s+/).filter(Boolean), here = new Set<string>(); let hit = false;
      for (let i = 0; i + 3 <= w.length; i++) {
        const g3 = w.slice(i, i + 3); if (g3.some(t => t.includes("∅")) || g3.filter(t => t.length >= 2 && !PHRASE_STOP.test(t)).length < 2) continue;
        const g = g3.join(" "); if (here.has(g)) continue; here.add(g);
        const was = firstAt.get(g); if (was === undefined) firstAt.set(g, x.c); else if (was !== x.c) hit = true;
      }
      if (hit) { row(at(x)).phraseRepeat++; mark(x, "phraseRepeat"); }
    } }
  // 처방 계열.
  const fam = new Map<string, number>(), famCh = new Map<string, Set<number>>();
  for (const x of sens) {
    // 권유로 맺는 문장(ADVICE_FORM)의 처방 종류 전부(rw2 R2b 「적어 두세요·목록」 갈래와 같은 크기 — 끝 마디만 보는 rxOfSentence는 절반만 센다) + 문체 「한 줄 말하기」 계열.
    const rx = ADVICE_FORM.test(x.text) && !/(떠올려|그려) 보세요[.!]?$/.test(x.text) ? rxKindsOf(x.text) : [];
    const kinds = [...new Set<string>([...rx, ...(() => { const f = adviceFamilyOf(x.text); return f ? [f] : []; })()])];
    for (const k of kinds) { const n = (fam.get(k) ?? 0) + 1; fam.set(k, n); famCh.set(k, new Set([...(famCh.get(k) ?? []), x.c])); if (n > 2) { row(at(x)).rxRepeat++; mark(x, "rxRepeat"); } }
  }
  // 꼬리 틀 과용(rw2 R5: 같은 끝 두 어절이 책에서 6번 이상인 틀의 수).
  const tails = new Map<string, number>();
  for (const x of sens) { const f = tailFrame(x.text); if (f) tails.set(f, (tails.get(f) ?? 0) + 1); }
  const bySection = [...per].map(([k, v]) => ({ at: k, ...v })).filter(v => Object.entries(v).some(([key, n]) => key !== "at" && key !== "evidenceUsed" && (n as number) > 0) || v.evidenceUsed > 0);
  const sum = (k: keyof Omit<InfoSectionMetric, "at">) => [...per.values()].reduce((a, v) => a + v[k], 0);
  return {
    version: INFO_VERSION, cards: Boolean(cards), sentences: sens.length, sections: sectionsOf.reduce((a, c) => a + c.sections.length, 0),
    totals: { evidenceUsed: sum("evidenceUsed"), restatements: sum("restatements"), lessons: sum("lessons"), sameSentence: same.length, rehash: rehash.length, phraseRepeat: sum("phraseRepeat"), rxRepeat: sum("rxRepeat"), sceneUnbacked: sum("sceneUnbacked"), sceneFirst: sum("sceneFirst"), sceneMbti: sum("sceneMbti"), exposure: sum("exposure"),
      scenes, exposureGrade, exposureRule, rxFamilies3: [...famCh.values()].filter(s => s.size >= 3).length, overusedTails: [...tails.values()].filter(n => n >= TAIL_OVERUSE).length, evidenceZero },
    rxFamilies: Object.fromEntries([...fam].sort((a, b) => b[1] - a[1])),
    bySection, at: { sameSentence: same.slice(0, 40), rehash: rehash.slice(0, 40), sceneUnbacked: sceneAt.slice(0, 60), exposure: exposureAt.slice(0, 40) },
    ...(opts.detail ? { hits: [...hitOf].map(([x, k]) => ({ c: x.c, s: x.s, i: x.i, kinds: [...k] })) } : {}),
  };
}

/** 브리프에서 카드 없는 사전(발행 경로): trait 이름·쉬운 이름, 지울 이름(고객·MBTI), 근거 장면(씨앗·DB 장면 — 소품을 씨앗처럼 넣은 mbti prop은 뺀다, 15자 미만 소품 꼴도 뺀다). */
export function infoDictOf(brief: Brief): InfoDict {
  const noHan = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/[一-鿿]+/g, "").trim();
  const mats = brief.chapters.flatMap(c => [...c.materials, ...(c.sections ?? []).flatMap(s => s.materials)]);
  const scenes = [...mats.flatMap(m => ("scene" in m && typeof m.scene === "string" && !(m.kind === "mbti" && m.seedId === "prop") ? [m.scene] : [])),
    ...brief.traits.flatMap(t => (t.fusion?.scene ? [t.fusion.scene] : [])), ...(brief.timeline?.entries ?? []).flatMap(e => (e.material.scene ? [e.material.scene] : []))];
  return {
    traits: [...new Set(brief.traits.flatMap(t => [noHan(t.name), t.easyName]).filter(x => x.length >= 2))],
    names: [brief.person.name, brief.person.callName, brief.partner?.person.name, brief.partner?.person.callName, brief.mbti?.type, brief.partner?.mbti?.type].filter((x): x is string => typeof x === "string" && x.length >= 2),
    scenes: [...new Set(scenes)].filter(x => x.length >= 15),
  };
}
