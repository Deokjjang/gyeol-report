/**
 * P6e 원고 검사(결정론·호출 0). p6c.ts lintBook이 부른다.
 *  1 지침 노출: 작가 지침·브리프 규칙(note)과 정규화 8자 이상 이어서 같은 글(사실·재료 글과 겹치는 창은 뺀다).
 *  2 고아 문장: 앞 문단이 없는데(소제목 첫 문단) "도·또한·여기에·이처럼·그래서·반대로"로 여는 첫 문장.
 *  3 신살 주인: "○○님 … [신살·귀인·십이운성]"이 그 사람의 엔진 값에 없다(다른 사람 것).
 *  4 MBTI 오귀속: 그 사람의 MBTI를 말한 문장에 그 유형의 기능·태도와 맞지 않는 성향 단서.
 *  5 기둥 자리: "연·월·일·시 + 하늘/땅 글자(천간·지지) + 십성"이 엔진과 다르다.
 *  6·15 안내·면책: 책에 한 번(시스템이 넣는 한 줄)만. 작가가 쓴 안내·면책 문장은 위반.
 *  10 씨앗 원문: 브리프 재료의 꼬리표·압축 구(×·→ 꼴)가 그대로 나왔다.
 *  17 MBTI 기능 이어 쓰기("Fi-Se", "가치 기준(Fi)-지금 이 순간 감각(Se)").
 *  21 비문 꼴("어차피 ~한 당신은").
 */
import { norm } from "./sentences";

// ---------- 6·15 안내·면책 ----------
/** 안내·면책 문장(경향·단정·지목·권유·약속 부정). 작가가 쓰면 위반이고, 시스템이 책마다 한 줄만 넣는다. */
const NOTICE = [
  /(단정|지목|약속|보장|예언|확정)하는 (말|뜻|이야기|것)(은|는|이|도)? 아(니|닙|닌)/,
  /(권유|추천)(가|는)? 아니라/,
  /투자 권유가 아(니|닙|닌)/,
  /경향(이고|일 뿐|이지|으로만)[^.?!]{0,24}(단정|약속|아니|아닙|예언)/,
  /실제 (누군가|어떤 사람|사람)를 (지목|가리키)/,
  /(사건|결과|합격|승진|시기)(을|를)? (단정|약속)(하지 않|하는 건 아니|할 수는 없)/,
  /(흐름|성향)의 경향일 뿐/,
  /(시기|결과|사건)를 말하는 (건|것은|게) 아(니|닙|닌)/,
  /정도로 (가볍게 )?읽어 주세요|가볍게 읽어 주세요/,
  // P6e r4: 작가 규칙 note("지금 바꾸라는 말이 아니라 선택지를 넓히는 이야기로")를 옮긴 단서.
  /(바꾸라는|그만두라는|옮기라는|하라는|권하거나 말리는|권하는|말리는) (말|이야기|뜻)(은|는|이|가|도)? 아(니|닙|닌)/,
  /(선택지를 넓혀 두는|가능성을 보여 주는|순서를 보여 주는) 이야기(예요|입니다|일 뿐)/,
  // P6e 판독(r4·r1): "이 장은 투자를 권하는 글이 아니라 …", "이건 사건이 아니라 분위기를 말하는 이야기예요".
  /(권하는|권유하는|추천하는|말리는) (글|말|이야기|장)(이|은|는)? 아(니|닙|닌)/,
  /(사건|결과|시기)(이|가)? 아니라 (분위기|경향|흐름|성향)(을|를) (말하는|읽는|보는) (이야기|글)/,
  // 연애 r2 판독: "결혼의 시기나 여부는 여기서 말하지 않아요", "…단정해서 말하지는 않아요", "시기나 여부를 정하는 이야기가 아닙니다".
  /여기서 (말하지|다루지|정하지) 않/,
  /단정(해서|하여)? 말하지(는|도)? 않/,
  /(시기|여부)(를|나 여부를)? 정하는 (이야기|말)(가|는|은)? 아(니|닙|닌)/,
  // 최종판2 1-6: 「자녀의 성별이나 수를 말하는 것이 아니라」·「결혼 여부를 정해 주는 것은 아닙니다」·「구체적인 일을 말하는 건 아닙니다」.
  /(성별|수|일|시기|결과|사건|여부)(이나 [가-힣]+|나 [가-힣]+)?(을|를) (말하|정하|정해 주|알려 주)는 (건|것은|것이|게|이야기|말)(가|는|은)? ?아(니|닙|닌)/,
  // AM 1부 판독(45·49 9장): 「경향만 읽는 이야기이니 어느 해든 결과를 단정하진 마세요」·「흐름은 약속이 아니라 날씨예요」(책 끝 시스템 안내와 2중).
  /(결과|어느 해든|어떤 해든|시기|앞날)[^.?!]{0,20}단정하(진|지는|지|지도) 마세요/,
  /경향만 (읽는|보는|말하는|담은) (이야기|글|책)/,
  /약속이 아니라 (날씨|경향|흐름|방향)/,
  // AM 7부 판독(대운 11건 — 브리프 note 「사건은 단정하지 않는다」「경향으로」를 옮긴 꼴, 세운 2.1.0·a5).
  /못 박(지는|지|진|을 수는|을 수도) (않|없)/,
  /(사건|결과|시기|여부|일)(을|를)? (말할|확정할|단정할|정할) 수(는|도)? 없/,
  /단정할 수(는|도)? 없/,
  /(사건|일)을 정해 두고 (읽|볼)/,
  /(일어난다고|온다고|생긴다고) (정해 두는|못 박는|단정하는) (것은|건|게) 아/,
  /반드시 (그렇게|이렇게) 된다는 (뜻|말|이야기)/,
  /경향으로만 (볼게요|봅니다|읽어요|읽을게요|보세요|볼까요)/,
  /(진단|예언|확정)이 아니라 (경향|가능성|흐름)/,
  /다고만 읽어 주세요/,
  /까지만 말할 수 있/,
  // AM 재생성 2 판독: sodam 8장 「단정할 일이 아니라 살피며 지나갈 흐름이에요」, major-1 7장 「이 순서는 경향이라서 모두가 같은 나이에 같은 곳에 서 있지는 않아요」(growthCurve note),
  // major-1 2장 「흐릿했다면 그 시기가 다른 이야기였을 수도 있어요」·「맞았는지보다」(지난 대운 맞힘 단서).
  /단정할 (일|것|건)(이|은)? 아(니|닙|닌)/,
  /경향이라서[^.?!]{0,30}(않아요|않습니다|아니에요|아닙니다)/,
  /다른 이야기였을 수도 있|맞았는지(보다|는 중요하지)/,
];
export const isNoticeSentence = (s: string) => NOTICE.some(re => re.test(s)) || noticeMeaning(s);
/**
 * AM2-3 4부·6-2 면책을 뜻으로(꼴 목록을 늘리지 않는다): 「단정·약속·확정·보장·예언·장담하다」「뜻하지 않」「꼭·반드시 그렇다는」「정해져 있다는」 류 말과 부정(않·아니·없·못·마세요)이 한 문장에 함께 있으면 면책이다.
 * 명사 「약속(시간·이 틀어지다)」 「단정한 옷차림」은 면책이 아니다(동사 꼴만 본다).
 */
const NOTICE_HEAD = /(단정|약속|확정|보장|예언|장담)(하지|하진|할 수|할 순|해서|해 드리|해 주는 (건|것|게)|하는 (건|것|게|말|뜻)|한다는|짓지|은 아니|이 아니)|뜻하지(는|도)? 않|뜻하는 (건|것은|게) 아|(꼭|반드시|무조건) 그렇(다는|게 된다는|지는)|정해져 있다는|(일어난다|온다|생긴다|된다)고 (정해|못 박)|단정(은|할 일은)/;
const NOTICE_NEG = /않|아니|아닙|없|못|마세요|말아/;
/** 시스템이 책마다 한 번 넣는 끝 안내(bookNotice)는 면책 검사 대상이 아니다. */
const SYSTEM_NOTICE = new Set(["career_money_study", "saju_mbti_compatibility", "love_marriage_child", "annual_fortune", "major_fortune", "saju_mbti_full"].map(p => bookNotice(p).replace(/[^가-힣]/g, "")));
export function noticeMeaning(s: string): boolean {
  if (SYSTEM_NOTICE.has(s.replace(/[^가-힣]/g, ""))) return false;
  const m = NOTICE_HEAD.exec(s); if (!m) return false;
  return NOTICE_NEG.test(s.slice(m.index));
}
/** 면책이 앞 마디로 붙은 문장(「사건을 확정할 수는 없지만, 흐름은 …」·「사건이 일어난다고 정해 두는 것은 아니고, …」) → 면책 마디만 뗀다. 뒤가 짧으면 그대로(문장째 면책은 notice_repeat가 처리). */
// AM 재생성 판독(annual-1 8.2.1 「효과를 약속하는 건 아니지만」, sodam 8장 「좋고 나쁨을 단정하기보다」, 「~할 수는 없어도,」).
const NOTICE_LEAD = /^[^,.?!]{2,40}?(?:할 수는 없지만|할 수 없지만|할 수는 없어도|할 수 없어도|하지는 않지만|(?:하는|두는|된다는) (?:건|것은|게|뜻은) 아니(?:고|지만)|(?:진단|예언|확정|단정)이 아니라 (?:경향|가능성|흐름)이니|단정하기보다(?:는)?),?\s+/;
export function stripNoticeLead(s: string): string {
  const m = s.match(NOTICE_LEAD); if (!m) return s;
  if (!/(사건|결과|시기|여부|확정|단정|약속|진단|예언|정해 두|못 박)/.test(m[0])) return s;
  const rest = s.slice(m[0].length);
  return rest.replace(/[^가-힣]/g, "").length >= 8 ? rest : s;
}
/** 책 한 줄 안내(상품별, 마지막 장 끝에 시스템이 넣는다). */
export function bookNotice(product: string): string {
  if (product === "career_money_study") return "이 책은 타고난 성향을 풀이한 것이라 일과 돈의 결과를 단정하지 않고, 돈과 투자 이야기도 권유가 아니라 성향 이야기예요.";
  if (product === "saju_mbti_compatibility") return "이 책은 두 사람의 타고난 결을 풀이한 것이라 관계의 결과를 단정하지 않아요.";
  if (product === "love_marriage_child") return "이 책은 타고난 성향을 풀이한 것이라 만남·결혼·자녀의 시기와 결과를 단정하지 않아요.";
  // AM2(덕짱님 결정 2026-11-11 「둘 다 고침」): 세운·대운은 타고난 성향이 아니라 시기의 흐름을 푼 책이다.
  if (product === "annual_fortune") return "이 책은 한 해의 흐름을 풀이한 것이라 달마다 일어날 일을 단정하지 않아요.";
  if (product === "major_fortune") return "이 책은 10년의 흐름을 풀이한 것이라 해마다 일어날 일을 단정하지 않아요.";
  return "이 책은 타고난 성향을 풀이한 것이라 앞으로의 일을 단정하지 않아요.";
}

// ---------- 2 고아 문장 ----------
/** "도"로 끝나는 첫 어절 가운데 명사 자체가 "도"로 끝나는 낱말(정도·속도…)은 연결이 아니다. */
const NOUN_DO = /^(정도|속도|태도|온도|각도|강도|빈도|의도|제도|용도|한도|농도|밀도|진도|지도|시도|태도|포도|보도|인도|기도|노도|난도|척도|고도|순도|적도|채도|명도|경도|위도|궤도|열도|반도|섬도)$/;
const ORPHAN_ADVERB = /^(또한|여기에|여기에다|이처럼|이렇게|그래서|그러니|반대로|그런데|하지만|그리고|게다가|더구나|마찬가지로|이와 함께|그 위에|그러면서|그다음은|그다음엔|그 뒤로는)(\s|,)/;
/** AM2-3 6-2(AM-01 4종 판독 커리어 6장 「이 조합은 정해진 틀 안에서…」 — 앞 문장이 수리로 사라짐): 지시어 + 앞말을 묶는 명사로 여는 첫 문장. */
const ORPHAN_REF = /^(이|그|저) (조합|두 (가지|힘|기운|글자|흐름)|셋|흐름|차이|결|구조|방식|습관|점|평가표)(은|는|이|가|을|를|도)\s/;
/** 앞 문단이 없는 자리(소제목 첫 문단)의 첫 문장이 앞말에 기대어 여는가. */
export function orphanStart(first: string): string | null {
  const s = first.replace(/[⟪⟫"'“”‘’]/g, "").trim();
  const m = s.match(ORPHAN_ADVERB); if (m) return m[1];
  { const r = s.match(ORPHAN_REF); if (r) return r[0].trim(); }
  const w = s.split(/\s+/)[0] ?? "";
  // "성격도 같은 쪽을 가리킵니다": 첫 어절이 "~도"(명사 + 보조사)면 앞말을 전제한다.
  if (/^[가-힣]{1,8}도$/.test(w) && !NOUN_DO.test(w) && !/^(어디|아무|누구|무엇|언제|조금|하나|한 번|두 번)도$/.test(w)) return w;
  // "이 힘도", "그 마음도": 지시어 + 명사 + 도.
  if (/^(이|그|저) [가-힣]{1,6}도$/.test(s.split(/\s+/).slice(0, 2).join(" "))) return s.split(/\s+/).slice(0, 2).join(" ");
  return null;
}

// ---------- 1 지침 노출 ----------
export const GUIDE_WINDOW = 12;
/** 지침 글의 정규화 8자 창. allow(사실·재료 글)에 있는 창은 뺀다(사실은 써도 된다). */
/** 지침 글 가운데 "쓰는 법"을 시키는 마디만 창으로 만든다(사실을 적은 마디 "태어난 달은 사회에서 일하는 자리"는 써도 된다). */
const INSTRUCTION = /않는다|않게|금지|쓴다|쓰지|말고|하지 말|바꾸지|옮기지|지어내지|넣지|만 쓴다|그대로|단정|전제하지|덧붙이지|되풀이하지|하나만|한 번만|조건형|질문형|명령형|으로만|로만/;
export function guideWindows(guides: Iterable<string>, allow: Iterable<string>, w = GUIDE_WINDOW): Set<string> {
  const allowed = new Set<string>();
  for (const t of allow) { const n = norm(t); for (let i = 0; i + w <= n.length; i++) allowed.add(n.slice(i, i + w)); }
  const out = new Set<string>();
  for (const t of guides) for (const clause of t.split(/[.;:()\n]|, |\/|·| — | - /)) {
    if (!INSTRUCTION.test(clause)) continue;
    const n = norm(clause); for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (!allowed.has(x) && !COMMON_WINDOW.test(x)) out.add(x); }
  }
  return out;
}
/** 어디서나 쓰는 꼴(지침과 우연히 겹친다): 존댓말 끝맺음·흔한 이음. */
const COMMON_WINDOW = /^[가-힣]{0,4}(입니다|이에요|예요|해요|합니다|습니다|세요)[가-힣]{0,4}$|하는편이|있는사람|한사람이|이사람의|이고객의|당신에게|당신의|두사람의|두사람이/;
export function guideCopy(sentence: string, windows: ReadonlySet<string>, w = GUIDE_WINDOW): string | null {
  const n = norm(sentence);
  for (let i = 0; i + w <= n.length; i++) { const x = n.slice(i, i + w); if (windows.has(x)) return x; }
  return null;
}
/** 독자에게 하는 금지 말투로 옮긴 작가 규칙("입력하지 않은 경력과 연차는 쓰지 마세요"): 책·글·문장을 쓰는 법을 독자에게 시킨다. */
// 최종판2 1-6: 「지어낸 연차 없이」(작가 규칙 "지어낸 연차·경력 금지"를 독자 안내로 옮김).
const META_INSTRUCTION = /(입력(하지 않은|에 없는|되지 않은)|브리프|재료|근거 없는)[^.?!]{0,30}(쓰지 마세요|적지 마세요|넣지 마세요|말하지 마세요)|(경력|연차)(과|와|는|을|를)? [^.?!]{0,12}(쓰지|적지) 마세요|지어낸 [가-힣]{1,6} 없이|(연차|경력)(을|를)? 지어내|(연차|경력|근속 ?연수|나이)(을|를|은|는)? ?(구체적으로|숫자로|정확히|일일이) ?(적기|쓰기|밝히기|말하기)(보다|보단|대신)/;
/** AM 1부 판독: 분기 조건·금액 금지·연차 금지·장면 슬롯이 문장으로(「상태가 직장인이니」「상황이 정해지지 않았으니」「숫자 없이 감각으로만 적어」「오래 다닌 햇수 대신」「경력은 실제로 해 온 만큼만」「…장면이 맞아요」). */
const META_TRACE = /상태가 [가-힣·]{1,10}(이)?니(까)?(?![가-힣])|상황이 (정해지지|입력되지) 않았으니|숫자 ?없이[^.?!]{0,16}(적어|적으|쓰세요|정해|두세요|감각으로)|(오래 다닌|다닌|근무한) (햇수|기간|연수) 대신|경력은 (실제로 )?(해 온|한) 만큼만|장면이 (맞아요|맞습니다|어울려요|어울립니다)(?![가-힣])/;
// AM 1-1 ②: 「연차를 구체적으로 적기보다, …」(작가 규칙 "입력에 없는 연차는 쓰지 않는다"를 독자 조언 꼴로 옮김, 운영 판독 11/5).
/** AM2-3 6-2(AM-01 4종 판독 커리어 9장 「이 로드맵에는 새로운 특성이 없습니다.」): 작성 지시·브리프 note를 옮긴 메모 꼴. */
const META_NOTE = /새로운 특성(이|은) 없|새 특성(은|이)? 없|새 특성 없이|이 (로드맵|장|절|부분)에(는|선) [^.?!]{0,24}(없습니다|없어요|담지 않|넣지 않|다루지 않)/;
export const metaInstruction = (s: string) => META_INSTRUCTION.test(s) || META_TRACE.test(s) || META_NOTE.test(s);
/**
 * AM2-3 4부·6-2 같은 문장·같은 뜻 연속(세운·대운 adjacentRepeats와 4종 tidy가 같이 쓴다): 정확히 같음 · 4자 창 자카드 0.6 이상 · 앞 세 어절이 같고 어절 80% 이상 겹침.
 * AM-01 4종 판독 커리어 9장 「이번에는 일 사이사이에 하루에 한 번은 아무것도 안 하는 시간을 두세요. 이번에는 일 사이사이에 하루 한 번은 아무것도 하지 않는 시간을 두세요.」(수리 흔적).
 */
export function nearDuplicate(a: string, b: string): boolean {
  const n = (t: string) => t.replace(/[^가-힣A-Za-z0-9]/g, "");
  if (n(a) === n(b)) return true;
  // 한 문장이 다른 문장 안에 통째로(AM-01 궁합 3장 「…기운이 둘 다에게 있어서, 둘 다 체면과 격식을 아는 사람이라 …」 뒤에 같은 꼬리만 다시).
  { const x = n(a), y = n(b); if (Math.min(x.length, y.length) >= 20 && (x.includes(y) || y.includes(x))) return true; }
  const win = (t: string) => { const x = n(t), o = new Set<string>(); for (let i = 0; i + 4 <= x.length; i++) o.add(x.slice(i, i + 4)); return o; };
  const A = win(a), B = win(b); let k = 0; for (const w of A) if (B.has(w)) k++;
  if (A.size && B.size && k / (A.size + B.size - k) >= 0.6) return true;
  const wa = a.split(/\s+/), wb = b.split(/\s+/);
  if (wa.length >= 4 && wb.length >= 4 && wa.slice(0, 3).join(" ") === wb.slice(0, 3).join(" ")) { const shared = wb.filter(w => wa.includes(w)).length; return shared / Math.max(wa.length, wb.length) >= 0.7; }
  return false;
}

// ---------- 10 씨앗 원문(꼬리표·압축 구) ----------
/** 재료 글 가운데 ×·→ 꼴(꼬리표 × 성향 → 결과)의 마디: 정규화 7자 이상이면 문장 안에 그대로 나오면 위반. */
export function seedLabels(materials: Iterable<string>, min = 7): Set<string> {
  const out = new Set<string>();
  for (const t of materials) {
    if (!/[×→]/.test(t)) continue;
    for (const part of t.split(/[×→\/]| · |, /)) {
      // 다섯 힘 세기("규칙의 힘(관성) 약")는 사실이라 그대로 써도 된다(최종판: P6d 커리어 1장 오탐).
      if (/(내 방식의 힘|만드는 힘|값을 받는 힘|규칙의 힘|배우는 힘|비겁|식상|재성|관성|인성)[^가-힣]*\(?[가-힣]*\)?\s*(강|보통|약)\s*$/.test(part.trim())) continue;
      const n = norm(part.replace(/^[^:：]{1,14}[:：]\s*/, "")); if (n.length >= min && n.length <= 24) out.add(n);
    }
  }
  return out;
}
export function seedCopy(sentence: string, labels: ReadonlySet<string>): string | null {
  const n = norm(sentence);
  for (const l of labels) if (n.includes(l)) return l;
  return null;
}

// ---------- 3 신살 주인 ----------
export type OwnerFacts = { readonly names: readonly (readonly string[])[]; readonly features: readonly ReadonlySet<string>[] };
/** 이름 하나만 나온 문장에서 그 사람에게 없는 신살·귀인·십이운성(다른 사람 것)을 짚었다. */
export function featureOwnerMismatch(sentence: string, f: OwnerFacts): string | null {
  const who = f.names.map((ns, i) => (ns.some(n => n && sentence.includes(n)) ? i : -1)).filter(i => i >= 0);
  if (who.length !== 1) return null;
  const me = who[0], other = 1 - me;
  for (const name of f.features[other] ?? []) {
    if (name.length < 2 || f.features[me]?.has(name)) continue;
    // 이름 + 조사·괄호(한자)로 이어진 꼴만 본다("겁살(劫煞)에", "겁살이").
    if (new RegExp(`(?<![가-힣])${name}(\\(|이|가|은|는|의|에|을|를|도|로|과|와|\\s)`).test(sentence)) return `${f.names[me][0]}:${name}`;
  }
  return null;
}

// ---------- 5 기둥 자리 ----------
export type PositionTenGods = Readonly<Partial<Record<"yearStem" | "monthStem" | "hourStem" | "yearBranch" | "monthBranch" | "dayBranch" | "hourBranch", readonly string[]>>>;
const TEN_GODS = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];
const POSITION_RE: readonly [keyof PositionTenGods, RegExp][] = [
  ["yearStem", /연간|년간|태어난 해(의)? 하늘 글자|해 기둥의 하늘 글자/], ["yearBranch", /연지|년지|태어난 해(의)? 땅 글자|해 기둥의 땅 글자/],
  ["monthStem", /월간|태어난 달(의)? 하늘 글자|달 기둥의 하늘 글자/], ["monthBranch", /월지|태어난 달(의)? 땅 글자|달 기둥의 땅 글자/],
  ["dayBranch", /일지|태어난 날(의)? 땅 글자|날 기둥의 땅 글자/],
  ["hourStem", /시간\(時干\)|태어난 시각(의)? 하늘 글자|시 기둥의 하늘 글자/], ["hourBranch", /시지|태어난 시각(의)? 땅 글자|시 기둥의 땅 글자/],
];
/** "월지의 비견", "태어난 달 땅 글자에 정인"처럼 자리 바로 뒤(같은 마디 18자 안)의 십성이 엔진 값과 다르다. 지지는 지장간 십성 모두 허용. */
export function pillarClaims(sentence: string, facts: PositionTenGods): string | null {
  for (const [pos, re] of POSITION_RE) {
    const allowed = facts[pos]; if (!allowed?.length) continue;
    for (const m of sentence.matchAll(new RegExp(re.source, "g"))) {
      const tail = sentence.slice((m.index ?? 0) + m[0].length).split(/[,.?!]|그리고|하고 /)[0].slice(0, 18);
      const tg = TEN_GODS.find(t => new RegExp(`^[^가-힣]{0,3}(의|에|에는|엔|은|는|이|가|에 있는|에 앉은|에 놓인|에 자리한)?\\s?(\\([^)]*\\)\\s?)?${t}`).test(tail.trim()));
      if (tg && !allowed.includes(tg)) return `${pos}:${tg}`;
      // 최종판2 1-8: 한 자리에는 글자 하나다. "태어난 날 땅 글자의 갑신"처럼 자리 뒤에 간지 두 글자(기둥 전체)를 붙였다.
      // 육십갑자에 있는 짝만(천간·지지 음양이 같음): "정인(正印)"을 丁寅으로 읽지 않는다.
      const gj = sentence.slice((m.index ?? 0) + m[0].length).match(/^(의|은|는|이|가|에|인)?\s?([갑을병정무기경신임계])([자축인묘진사오미신유술해])(?=[이가은는을를의도과와]|\s|$|[,.(])/);
      if (gj && "갑을병정무기경신임계".indexOf(gj[2]) % 2 === "자축인묘진사오미신유술해".indexOf(gj[3]) % 2) return `${pos}:ganji`;
      // 최종판 5: 거꾸로 된 어순 "정재가 월간에 앉은"(장덕민 커리어 5장, 월간은 정관). 자리 앞 십성 + 이/가/은/는, 자리 뒤 "에 앉/있/자리/놓/들".
      const head = sentence.slice(Math.max(0, (m.index ?? 0) - 10), m.index ?? 0);
      const before = TEN_GODS.find(t => new RegExp(`${t}(\\([^)]*\\))?(이|가|은|는) ?$`).test(head));
      if (before && /^(의 자리)?에 ?(앉|있|자리|놓|들)/.test(sentence.slice((m.index ?? 0) + m[0].length)) && !allowed.includes(before)) return `${pos}:${before}`;
    }
  }
  return null;
}

// ---------- 4 MBTI 오귀속 ----------
export type MbtiPerson = { readonly type: string; readonly anchors: RegExp; readonly name?: string };

// ---------- 17 기능 이어 쓰기 ----------
/** "Fi-Se", "가치 기준(Fi)-지금 이 순간 감각(Se)": 기능 둘을 하이픈으로 잇지 않는다. */
export const FN_JOIN = /(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\)?\s?[-–]\s?[가-힣 ]{0,14}\(?(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z])/;

// ---------- 21 비문 꼴 ----------
export const AWKWARD = /어차피 [^.?!]{0,20}(당신|그대)은|[가-힣]+를 챙기는 (점심|저녁|아침) 같은/;

// ---------- 19 숫자 표기(정리 단계) ----------
const NATIVE: Readonly<Record<string, string>> = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉" };
/**
 * 한 자리 수 + 고유어 단위(해·달·번·명·가지·사람·군데·마디·걸음)는 고유어 수로 쓴다("1해" → "한 해", "3번" → "세 번").
 * 한자어 단위(년·개월·회·일·시·분·%·원·위·차)와 날짜("11월 4일")는 숫자 그대로.
 */
export function nativeNumbers(text: string): { text: string; count: number } {
  let count = 0;
  // AM2 P2 판독(annual-1 을사월): 「흐름 세기는 1/5 잔잔함」 → 「1/다섯 잔잔함」(분수 뒤 숫자를 「5 잔」으로 읽었다) → 「/」 뒤 숫자는 그대로.
  const out = text.replace(/(?<![0-9.,/])([1-9])\s?(해|달|번|명|가지|사람|군데|마디|걸음|잔|권)(?![가-힣]*(일|월째))/g, (_all, d: string, unit: string) => { count++; return `${NATIVE[d]} ${unit}`; });
  return { text: out, count };
}

// ---------- 7 한자 ----------
/** 작가 출력의 한자(괄호 속 포함)를 지운다. 렌더 단계가 용어 사전·엔진 간지로 장마다 첫 등장에만 붙인다. */
const READING: Readonly<Record<string, string>> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
  木: "목", 火: "화", 土: "토", 金: "금", 水: "수",
};
/** 괄호 속 한자("식신(食神)")는 지우고, 괄호 밖 한자는 천간·지지·오행이면 한글 읽기로(그 밖은 지운다). 지운·바꾼 수를 센다. */
export function stripHanja(text: string): { text: string; count: number } {
  let count = 0;
  const out = text
    .replace(/\s?\(([^()]*[一-鿿][^()]*)\)/g, (all, inner: string) => { if (/^[一-鿿\s·,]+$/.test(inner)) { count++; return ""; } const kept = inner.replace(/[一-鿿]+\s?/g, "").trim(); count++; return kept ? `(${kept})` : ""; })
    .replace(/[一-鿿]+/g, m => { count++; return [...m].every(ch => READING[ch]) ? [...m].map(ch => READING[ch]).join("") : ""; })
    .replace(/\(\s*\)/g, "").replace(/ {2,}/g, " ");
  return { text: out, count };
}

// ---------- 최종판 1-14 표기 정리(결정론) ----------
/** 맞춤법·이중 표기·전문어(신약·중화)를 쉬운 말로. 뜻은 바꾸지 않는다. */
export function plainWords(text: string): { text: string; count: number } {
  let count = 0;
  const sub = (t: string, re: RegExp, to: string | ((...a: string[]) => string)) => t.replace(re, (...a) => { count++; return typeof to === "string" ? to.replace(/\$(\d)/g, (_m, i) => a[Number(i)] ?? "") : to(...(a as string[])); });
  let t = text;
  t = sub(t, /(?<![가-힣])되려(?=\s)/g, "되레");
  t = sub(t, /몰려 (올|온|오는|와)(?![가-힣])/g, "몰려$1");
  t = sub(t, /때 일수록/g, "때일수록");
  // 최종판 4: 궁합 7장 질문 「{topic} 때」에 「다툰 뒤」가 들어가 「다툰 뒤 때」(때때로·뒤 때문에는 그대로).
  t = sub(t, /(?<=[가-힣] )(뒤|후) 때(?=[ ,.?!])/g, "$1에");
  // 이중 표기: "충 축미충" → "축미충"(관계 이름 앞에 같은 관계 글자를 한 번 더 썼다).
  t = sub(t, /(?<![가-힣])(충|합|형|파|해) ([가-힣]{2}\1)(?=[은는이가을를의에도과와로]|\s|$|[,.])/g, "$2");
  // 전문어(1-14): "내 힘의 세기는 매우 신약" → "혼자 버티는 힘이 아주 여린 편", 중화 → "세지도 약하지도 않은 가운데".
  t = sub(t, /(매우 |아주 |조금 )?신약한 사주/g, (_a, deg: string | undefined) => `혼자 버티는 힘이 ${deg ? "아주 " : ""}여린 사주`);
  t = sub(t, /(?:내 힘의 세기는|일간의 힘이|일간의 힘은|내 힘은) (매우 |아주 |조금 )?신약(?=이|으로|인|,|\.)/g, (_a, deg: string | undefined) => `혼자 버티는 힘이 ${deg ? "아주 " : ""}여린 편`);
  t = sub(t, /(내 힘의 세기는|일간의 힘이|일간의 힘은|내 힘은) 중화(?=라서|라|예요|입니다|이고|,)/g, (_a, head: string) => `${head.startsWith("내 힘의 세기") ? "내 힘은" : head} 세지도 약하지도 않은 가운데`);
  t = t.replace(/가운데(,|라서) 세지도 여리지도 않은 가운데/g, "가운데");
  // AM 재생성 2 판독(sodam 1장, 세 판째): 「내 힘의 세기는 중화예요.」를 바꾸면 바로 뒤 작가 문장 「세지도 여리지도 않아서 …」와 같은 말이 된다 → 두 문장을 하나로.
  t = t.replace(/(내 힘은|일간의 힘이|일간의 힘은) 세지도 약하지도 않은 가운데(?:예요|입니다)\. (?=세지도 (?:약하지도|여리지도) 않)/g, "$1 ");
  // 최종판2 1-6: 오행 과다(내부 용어) → 쉬운 말("토 과다" → "흙 기운이 많아서"). 장덕민 연애 「여기에 토 과다가 겹칩니다」.
  const EL: Readonly<Record<string, string>> = { 목: "나무", 화: "불", 토: "흙", 금: "쇠", 수: "물" };
  t = sub(t, /(?<![가-힣])([목화토금수]) 과다(라서|여서|이라서|로|가|는|예요|입니다|이고|인)?(?![가-힣])/g, (_a, e: string, p: string | undefined) => {
    const head = `${EL[e]} 기운이`;
    return !p || p === "라서" || p === "여서" || p === "이라서" || p === "로" ? `${head} 많아서` : p === "가" ? `${head} 많은 점이` : p === "는" ? `${head} 많은 것은` : p === "예요" ? `${head} 많아요` : p === "입니다" ? `${head} 많습니다` : p === "이고" ? `${head} 많고` : `${head} 많은`;
  });
  return { text: t, count };
}

// ---------- 최종판 1-10 다섯 힘 쉬운 이름(커리어) ----------
export const GROUP_EASY_NAME: Readonly<Record<string, string>> = { 비겁: "내 방식의 힘", 식상: "만드는 힘", 재성: "값을 받는 힘", 관성: "규칙의 힘", 인성: "배우는 힘" };
const GROUP_CTX = /비겁|식상|재성|관성|인성|내 방식의 힘|만드는 힘|값을 받는 힘|규칙의 힘|배우는 힘|다섯 힘/g;
/**
 * 커리어 책: 다섯 힘은 첫 등장에 "쉬운 이름(묶음 이름)"으로 정의하고 그 뒤로는 쉬운 이름 하나로만.
 * 맨 묶음 이름("비겁이 강해")은 쉬운 이름으로 바꾸고(받침이 모두 있어 조사가 그대로 맞다), 첫 쉬운 이름에 괄호가 없으면 붙인다.
 * 일상어와 겹치는 꼴(비겁하다·인성 면접·인성이 좋다)은 같은 문장에 다른 힘 이름이 함께 나올 때만 묶음 이름으로 본다.
 */
export function careerGroupNames(text: string, defined: Set<string>, heading = false): { text: string; count: number } {
  let count = 0;
  const sentences = text.split(/(?<=[.!?])\s/);
  const out = sentences.map(sen => {
    const others = (sen.match(GROUP_CTX) ?? []).length;
    return sen.replace(/(내 방식의 힘|만드는 힘|값을 받는 힘|규칙의 힘|배우는 힘)(\((비겁|식상|재성|관성|인성)\))?|(?<![가-힣(·])(비겁|식상|재성|관성|인성)(?=[이가은는을를의도과와로만에]|\s|[,.·]|$)/g, (all, easy: string | undefined, paren: string | undefined, pg: string | undefined, bare: string | undefined, off: number) => {
      if (easy) {
        const g = Object.keys(GROUP_EASY_NAME).find(x => GROUP_EASY_NAME[x] === easy)!;
        if (paren || defined.has(g) || heading) { defined.add(g); return all; }
        defined.add(g); count++; return `${easy}(${g})`;
      }
      if (!bare) return all;
      // 괄호 안(쉬운 이름 뒤 정의)이면 그대로.
      if (sen.lastIndexOf("(", off) > sen.lastIndexOf(")", off)) return all;
      if (others < 2 && bare === "인성") return all;
      if (others < 2 && /^비겁/.test(bare)) return all;
      count++;
      const easyName = GROUP_EASY_NAME[bare];
      if (heading || defined.has(bare)) return easyName;
      defined.add(bare); return `${easyName}(${bare})`;
    });
  });
  void GROUP_CTX.lastIndex;
  return { text: out.join(" "), count };
}
/** 정한 쉬운 이름 말고 다른 이름으로 부른 다섯 힘("배움과 보호의 힘(인성)", "돈을 쫓는 힘"). */
const VARIANT = /배움과 보호의 힘|배움의 힘|보호의 힘|돈을 (쫓|좇)는 힘|돈을 버는 힘|재물의 힘|표현(하는|의) 힘|혼자 서는 힘|규율의 힘/;
export function groupNameVariant(sentence: string): string | null {
  const v = sentence.match(VARIANT)?.[0]; if (v) return v;
  // 앞 낱말까지 잡히므로("당신은 값을 받는 힘(재성)") 정한 이름으로 끝나면 맞는 이름이다(최종판 4: 장덕민 커리어 거짓 깃발 4건).
  for (const m of sentence.matchAll(/([가-힣]+(?: [가-힣]+){0,2}) 힘\((비겁|식상|재성|관성|인성)\)/g)) { const said = `${m[1]} 힘`, name = GROUP_EASY_NAME[m[2]]; if (!said.endsWith(name) && !name.endsWith(said)) return `${said}(${m[2]})`; }
  return null;
}

// ---------- 최종판 1-5 궁합 장면 주인 ----------
export type SceneOwner = { readonly name: string; readonly pole: string };
/** 한 사람만 나온 문장이 다른 사람 몫으로 정한 차원 끝(장면 씨앗의 who)의 단서를 그 사람 것으로 썼다. cues: mbtiFn.POLE_CUES. */
export function sceneOwnerMismatch(sentence: string, owners: readonly SceneOwner[], names: readonly (readonly string[])[], cues: Readonly<Record<string, RegExp>>): string | null {
  const who = names.map((ns, i) => (ns.some(n => n && sentence.includes(n)) ? i : -1)).filter(i => i >= 0);
  if (who.length !== 1) return null;
  const me = names[who[0]];
  for (const o of owners) {
    if (me.some(n => o.name.includes(n))) continue;
    if (owners.some(x => x.pole === o.pole && me.some(n => x.name.includes(n)))) continue;
    const re = cues[o.pole]; if (re && re.test(sentence)) return `${o.pole}=${o.name}`;
  }
  return null;
}
