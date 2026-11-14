/**
 * W3 P3 7절 — 정보량 지표(결정론·호출 0, 기록만 하고 본문을 바꾸지 않는다). 절(소제목)마다·책마다 센다.
 *  - evidenceUsed: 그 절 card.evidence가 본문에 나온 수. 근거 하나 = 이름(한자·괄호 라벨을 뗀 꼴)·이름의 핵심 낱말(「원진살 묘신 원진」→ 원진·묘신, 「장성살」→ 장성)·자리 이름(「원국 전체」「두 사람」 같은 넓은 자리는 빼고)
 *    가운데 하나, 상품 근거(facts)는 사실 줄의 핵심 낱말(십성·신살·관계·간지·MBTI·오행 기운·짧은 값)도, 맥락 근거(context — 「관계 상태」 같은 자리표 이름)는 사실 줄 낱말만 본다.
 *    카드 없는 책은 trait 이름 사전 + 자리 이름 사전에서 그 절에 나온 서로 다른 낱말 수.
 *  - restatements: 「당신은/○○님은 … 사람·타입·편·스타일·유형이에요」 재진술 문장 수(rw2 R5 꼬리 틀). lessons: 장 끝 두 문장의 「A는 B가 아니라 C예요」 교훈문(rw2 R4).
 *  - sameSentence: 책 안 같은·거의 같은 문장 쌍(정규화 같음 또는 두 글자 묶음 자카드 ≥ 0.8, 14자 이상 — repair3.sameSentence, rw2 R1). 뒤 문장의 절에 센다.
 *  - rehash: 다른 장에서 같은 주장 재탕(이름을 지운 세 글자 묶음 자카드 ≥ 0.45 또는 14자 연속, 처방·같은 문장 제외 — metrics.infoRepeats claim을 장 사이로, rw2 R2).
 *  - phraseRepeat: 다른 장에서 같은 구절(세 어절, 내용 낱말 둘 이상 — 고객 이름·MBTI 유형을 지우고 본다)을 다시 쓴 문장 수(KNOWN3 R 「시동이 걸리면 ×2」 꼴). 잡음이 있는 추세 지표(관문 아님).
 *  - rxRepeat: 같은 처방 계열(권유 문장의 prescriptions RX 14종 + 문체 「한 줄 말하기」 계열)의 책 안 3번째부터. rxFamilies3: 3개 장 이상에 나온 계열 수(rw2 R2b).
 *  - overusedTails: 같은 꼬리 틀(끝 두 어절, 앞 어절은 끝 글자)이 책에서 6번 이상인 틀 수(rw2 R5).
 *  - sceneUnbacked: 구체 장면 단정(concreteScene — 장소·기기·앱·물건·사건을 사람의 버릇·겪음으로 말한 문장, 권유·가정·비유·물음 제외) 가운데
 *    근거와 겹치지 않는 것(rw2 R9·F1). 카드가 있으면 그 절 카드 글(장면·소품·근거 사실·뜻·연결 이유·근거 trait 글) + 입력의 직업 장면(dict.props)에 장면 낱말이 모두 있거나
 *    카드 장면과 겹치면 근거 있음, 카드 없는 책은 씨앗·DB 장면(scenes)과 겹치거나 dict.props에 낱말이 모두 있으면. 겹침 = 장면 낱말 하나 + 다른 내용 낱말 하나 이상 공유.
 *    sceneFirst: 그 가운데 소제목 첫 문장(F1). sceneMbti: 그 가운데 MBTI 유형·기능을 붙인 문장(소품에 MBTI를 붙인 꼴, rw2 L5).
 *    sceneAsk: 같은 낱말 기준의 근거 없는 장면 물음(「택배 알림이 오면 …지 않나요?」). W4(info-v4)부터 sceneUnbacked에도 들어가고 lint scene_unbacked도 잡는다.
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
export type InfoEvidence = { readonly name: string; readonly where?: readonly string[]; readonly facts?: readonly string[]; readonly context?: boolean };
/**
 * text: 그 절 카드 글 전부(장면 근거 대조용 — 질문·근거 뜻·사실·장면·소품·팩폭·연결 이유·근거 trait 글).
 * scene.ask: 지식 DB·관계 장면(입력으로 거른 씨앗이 아님) — 성향 물음 재료라 단정 문장의 근거가 되지 않는다.
 */
export type InfoCard = { readonly chapter: number; readonly section: number; readonly evidence: readonly InfoEvidence[]; readonly scene?: { readonly text: string; readonly ask?: boolean; readonly props?: readonly string[] } | null; readonly text?: readonly string[] };
/** 카드 없는 책의 사전: trait·용어 이름(쉬운 이름 포함), 지우고 비교할 이름(고객 이름·MBTI 유형), 근거 있는 장면 글(씨앗·DB 장면). */
export type InfoDict = { readonly traits?: readonly string[]; readonly names?: readonly string[]; readonly scenes?: readonly string[]; readonly props?: readonly string[] };
export type InfoSectionMetric = { readonly at: string; readonly evidenceUsed: number; readonly restatements: number; readonly lessons: number; readonly sameSentence: number; readonly rehash: number; readonly phraseRepeat: number; readonly rxRepeat: number; readonly sceneUnbacked: number; readonly sceneFirst: number; readonly sceneMbti: number; readonly sceneAsk: number; readonly exposure: number };
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
export type InfoKind = "restatement" | "lesson" | "sameSentence" | "rehash" | "phraseRepeat" | "rxRepeat" | "sceneUnbacked" | "sceneFirst" | "sceneMbti" | "sceneAsk" | "exposureGrade" | "exposureRule";
/** info-v2(W3 P3 보강): 구체 장면 탐지(concreteScene)·장면 물음(sceneAsk)·근거 이름 정리와 핵심 낱말·사실 낱말 대조. */
/** info-v3(W3 P3 보강 2): 지식 DB·관계 장면(scene.ask)은 단정의 근거가 아니다(물음 재료). */
/** info-v4(W4 Q2): 근거 없는 장면이 물음 꼴도 센다. */
export const INFO_VERSION = "info-v4" as const;

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
/**
 * 구체 장면 낱말(장소·기기·앱·물건·사건, W3 P3 보강). strong = 그 낱말 하나로 지어낸 장면 소품이 되는 것(단톡방·이어폰·동네 가게·택배·회의실·퇴근길),
 * weak = 흔한 생활 배경(회의·주말·전화·선물·데이트). 짧은 낱말(차·방·폰·앱·밥·책)과 비유로 흔한 낱말(엔진·열쇠·지갑·가게「가게 만드는」)은 뒷말로 좁힌다.
 * 명리 비유 낱말(나무·불·물·흙·땅·삽·쇠)·관용구로 흔한 말(시동이 걸리다·마감)은 넣지 않는다(운영 23권 오탐 판독).
 */
const STRONG_NOUN = [
  // 장소
  "동네", "단골", "가게(?! (?:만들|만드|해|하|돼|되|둬|두))", "카페", "맛집", "식당", "편의점", "마트", "백화점", "미용실", "헬스장", "체육관", "도서관", "서점", "놀이터", "공원", "산책로", "골목", "정류장", "지하철", "버스(?!킹)", "택시", "주차장", "공항", "호텔", "숙소",
  "회의실", "사무실", "탕비실", "휴게실", "엘리베이터", "현관", "거실", "주방", "부엌", "화장실", "베란다", "옥상", "영화관", "극장", "노래방", "술집", "포장마차", "캠핑장", "바닷가", "해변", "수영장", "운동장", "강의실", "교실", "학원", "병원", "약국",
  "출근길", "퇴근길", "등굣길", "하굣길", "집 앞", "집 근처", "방 한 칸", "방(?=에서| 안에|에 틀어|에 들어)",
  // 기기·앱
  "휴대폰", "핸드폰", "스마트폰", "폰(?=을|이 |은|에 |부터|만 | 화면| 알림)", "노트북", "컴퓨터", "모니터", "키보드", "태블릿", "이어폰", "헤드폰", "충전기", "리모컨", "카카오톡", "카톡", "단톡방", "단톡", "메신저", "인스타", "SNS", "유튜브", "넷플릭스", "엑셀", "플레이리스트", "메일함", "알림창", "통화 버튼", "영상통화", "앱(?=을|이 |에서|부터)",
  // 물건·동물
  "택배", "상자", "영수증", "장바구니", "공용 지갑", "지갑(?=을 (?:꺼내|열어|챙기|두고|잃)|에서)", "우산", "텀블러", "포스트잇", "메모지", "수첩", "다이어리", "볼펜", "냉장고", "세탁기", "청소기", "자동차", "자전거", "엔진 소리", "열쇠(?=를 (?:찾|잃|챙|두|꺼내))", "열쇠 꾸러미", "꽃다발", "케이크", "떡볶이", "치킨", "도시락", "배달 음식", "이불", "베개", "소파", "침대", "서랍", "옷장", "책장", "화분", "앨범", "티켓", "쿠폰", "고지서", "이삿짐", "고양이", "강아지", "반려동물", "차(?=에서|에 타| 시동| 안에|를 (?:몰|타|세우))",
  // 사건
  "이사(?=를|하|가 |갈|간|온|올|한|할| 가| 온)", "회식", "소개팅", "동창회", "집들이", "결혼식", "장례식", "명절", "축제", "캠핑", "등산", "술자리", "생일 파티", "단체 여행",
] as const;
const WEAK_NOUN = [
  "회의(?!적)", "발표", "보고서", "기획서", "서류", "계약서", "면접", "출장", "야근", "출근", "퇴근", "점심", "저녁", "아침", "새벽", "밤(?=에|새|마다|늦게| 늦게| 열)", "주말", "휴일", "월요일", "금요일", "휴가", "여행", "모임", "데이트", "선물", "생일", "전화", "통화", "문자(?=를|가 |로|에 )", "메시지", "메일", "이메일", "알림", "알람",
  "사진", "영상", "게임", "드라마", "영화", "노래", "커피", "간식", "메뉴", "밥(?=을|이 |은|보다|부터| 먹| 한 끼)", "쇼핑", "배달", "장보기", "청소", "빨래", "설거지", "운동", "헬스", "산책", "강의", "가방", "옷(?=을|이 |차림| 한 벌)", "신발", "책상", "책(?=을 |이 | 한 권| 한 장)", "메모", "달력", "캘린더", "통장", "월급날", "월급", "카드값", "정산", "견적", "은행",
] as const;
const nounRe = (xs: readonly string[]) => new RegExp(`(?<![가-힣A-Za-z])(${[...xs].sort((a, b) => b.length - a.length).join("|")})`, "g");
const STRONG_RE = nounRe(STRONG_NOUN), WEAK_RE = nounRe(WEAK_NOUN);
/** 버릇·겪음·진행 꼴(「…곤 해요」「어느새·이미·항상·매번」「…적 있」「…고 있어요」「…하다가」). */
const SCENE_HABIT = /곤 (?:해요|하죠|합니다|했)|기도 (?:해요|합니다)|적이? 있|어느새|이미 |벌써 |항상 |매번 |습관처럼|[고어아] 있어요|[고어아] 있습니다|(?:되어|돼) 있(?:어요|습니다|죠)|(?:하|보내|보|가|오|쓰|읽|듣|먹|걷|일하|있|지내|자)다가 /;
/** strong 낱말과 함께일 때만 장면 꼴로 보는 것: 성향 꼴(「…하는 편이에요·쪽이」), 지난 모습(「…하던」), 조건(「…있어야」), 「늘」. 「데이트를 주도하는 쪽」「마감이라는 불이 있어야」는 장면이 아니다. */
const SCENE_TEND = /는 (?:편|쪽)(?:이에요|입니다|이죠|이라|이)|[가-힣]던 |[어아]야 |(?<![가-힣])늘 /;
/** 조건·때 꼴(「…하면」「…할 때·…는 날·…때마다」). */
const SCENE_WHEN = /[가-힣](?<!반|측|정|표|이)(?:으면|면)[ ,]|[을ㄹ] 때|할 때|는 날|날에는|날엔|때마다/;
/** 사람 주어(독자·궁합 두 사람): 그 사람의 버릇으로 말한 문장. */
const SCENE_WHO = /(?<![가-힣])(?:당신(?:은|는|이|가|도)|[가-힣]{1,4}님(?:은|는|이|가|도)|두 (?:분|사람)(?:은|이|도))(?![가-힣])/;
/** 권유·처방(「…해 보세요」「…하면 돼요」「…는 게 좋아요」「…해도 괜찮아요」「…적어 두면」, 따옴표 말을 「…라고 말하면」)은 장면 단정이 아니다. */
const SCENE_ADVICE = /(세요|십시오|해 보기|(?:면|으면|는 게|는 것이|는 것도|는 편이) (?:좋아요|좋습니다|돼요|됩니다|충분해요|충분합니다|좋겠어요)|[어아]도 (?:좋아요|좋습니다|돼요|됩니다)|괜찮(?:아요|습니다)|(?:보는|두는) 거예요|방법이에요|방법입니다|해 봐요|볼까요|처럼요)[.!]?["'”’)]*$|["”'’]\s?(?:라고|하고|이라고)\s[^.?!]{0,24}?(?:으면|면|어도|아도)[ ,]|[가-힣] (?:두|주)면[ ,]|두는 게 /;
/** 드러낸 가정(「…라면」「…된다면」「생기면」 — 지침의 조건형)·예로 세운 장면(「예를 들어」「…라고 해 볼게요」)·상상 권유는 장면 단정이 아니다. */
const SCENE_HYPO = /라면|다면|이라면|생기면|하게 되면|만약|혹시|떠올려|그려 보|상상|예를 들(?:어|면)|해 볼게요|볼게요[.!]?$/;
/** 비유(「마치」「…로 치면」「랜턴 같은 사람이에요」「…같아요」「…셈이에요」)는 장면이 아니다. 「…듯·…처럼」 앞 마디(비유)는 버리고 뒤 마디만 본다. */
const SCENE_FIGURE = /마치|비유하(?:면|자면)|(?:로|으로) 치면|[가-힣] 같은 (?:사람|존재|순간|장면|구조|모습)(?:이에요|입니다|예요|이죠|이|가)|(?:같아요|같습니다|셈이에요|셈입니다|격이에요|격입니다)[.!]?$/;
/** 가능성(「…할 수 있어요」)은 weak 낱말뿐이면 단정이 아니다. */
const SCENE_MAYBE = /수(?:도)? 있(?:어요|습니다|죠)[.!]?$/;
export type SceneHit = { readonly nouns: readonly string[]; readonly strong: boolean; readonly ask: boolean };
/**
 * 구체 장면 문장(W3 P3 보강, info 지표 sceneUnbacked·lint scene_unbacked 공용): 입력에 없는 장소·기기·앱·물건·사건을 사람의 버릇·겪음으로 말한 문장.
 * 잡지 않는 것: 권유·처방, 드러낸 가정(「…라면」「예를 들어」), 비유, 구체 낱말 없는 성향 문장, 꼴 없는 일반 문장(「책상 위에서만 도는 일은 …」).
 * 물음(「…편이죠?」「…않나요?」)은 ask로 따로 돌려준다(단정이 아니다 — 지표만 센다, strong 낱말이면 꼴을 따지지 않는다).
 *  - strong 낱말: 버릇·조건·성향(지난 모습·「…있어야」 포함) 꼴이나 사람 주어가 있으면.
 *  - weak 낱말: 버릇 꼴, 또는 조건·때 꼴 + 사람 주어, 또는 weak 둘 이상 + (조건·때 꼴이나 사람 주어). 가능성(「…수 있어요」)은 빼고.
 */
export function concreteScene(sentence: string): SceneHit | null {
  const s0 = bare(sentence).trim();
  if (!s0 || SCENE_ADVICE.test(s0) || SCENE_HYPO.test(s0) || SCENE_FIGURE.test(s0)) return null;
  const s = s0.split(/(?:듯이?|처럼)[,\s]+/).at(-1) ?? s0;
  const strong = [...new Set([...s.matchAll(STRONG_RE)].map(m => m[1]))], weak = [...new Set([...s.matchAll(WEAK_RE)].map(m => m[1]))].filter(w => !strong.some(x => x.includes(w)));
  if (!strong.length && !weak.length) return null;
  const ask = /[?？][.!]?["'”’)]*$/.test(s0), habit = SCENE_HABIT.test(s), when = SCENE_WHEN.test(s), who = SCENE_WHO.test(s);
  if (strong.length) return ask || habit || when || who || SCENE_TEND.test(s) ? { nouns: [...strong, ...weak], strong: true, ask } : null;
  if (!ask && SCENE_MAYBE.test(s0)) return null;
  return habit || (when && who) || (weak.length >= 2 && (when || who)) ? { nouns: weak, strong: false, ask } : null;
}

const GANJI_HAN: Readonly<Record<string, string>> = { 甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무", 己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계", 子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사", 午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해" };
/**
 * 근거 이름 정리(카드 이름·지표 공용): 한자만 든 괄호(「장성살(將星殺)」)를 떼고, 괄호 밖 간지 한자는 한글로(「卯申원진」→「묘신 원진」),
 * 나머지 괄호 마디(「(만세력 가중값)」「(태어난 해과)」 같은 내부 라벨)·짝 없는 괄호 뒤(「편관(관성의 해」)·남은 한자를 뗀다.
 */
export function plainName(s: string): string {
  return s.replace(/\s?\([一-鿿·\s]+\)/g, "").replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{2,3}(?=[가-힣])/g, m => `${[...m].map(c => GANJI_HAN[c]).join("")} `)
    .replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, c => GANJI_HAN[c]).replace(/\s?\([^()]*\)/g, "").replace(/\([^)]*$/, "").replace(/[一-鿿]+/g, "").replace(/\s{2,}/g, " ").trim();
}
/** 이름 핵심 낱말로 치지 않는 말(자리·정도·자리표 말). */
const NAME_GENERIC = new Set(["태어난", "해", "달", "날", "시각", "하늘", "땅", "글자", "자리", "쪽", "강한", "약한", "많음", "적음", "기운", "힘", "사람", "바탕", "두", "공통", "세기", "분포", "비율", "점수", "궁합", "올해", "지금", "좋은", "덜", "쓴", "운", "관계", "신호", "상태", "종합", "앞", "장", "이번", "그늘", "지나칠", "때", "내", "원국", "전체", "보통", "있음", "없음", "상황", "씨앗", "점검", "판정", "표현", "장면", "맞는", "잘", "조합", "통념상", "위험할", "새", "곳", "직군", "순위", "넓혀", "갈", "길게", "볼", "기능", "연애", "이름", "보이는", "넉넉한", "적은", "만큼", "쓰는", "고른", "자녀", "배우자", "부모", "입력", "직업"]);
const ELEMENT_NATIVE: Readonly<Record<string, string>> = { 목: "나무", 화: "불", 토: "흙", 금: "쇠", 수: "물", 나무: "나무", 불: "불", 흙: "흙", 쇠: "쇠", 물: "물" };
const ELEMENT_KO: Readonly<Record<string, string>> = { 나무: "목", 불: "화", 흙: "토", 쇠: "금", 물: "수" };
/** 이름의 핵심 낱말: 정리한 이름의 두 글자 이상 낱말(조사 뗌, 자리표 말 뺌, 궁합 「○○님의」 뺌), 「…살」은 「…」도, MBTI 유형, 오행 한 글자 이름은 「흙 기운·토 기운」 꼴. */
export function nameTokens(name: string): string[] {
  const t = plainName(name).replace(/^[가-힣]{1,5}님의\s/, ""), out = new Set<string>();
  for (const w0 of t.split(/[\s·,/]+/)) {
    const w = w0.replace(/(?:으로|에서|의|이|가|은|는|을|를|과|와|도|로|에)$/, "");
    if (/^[EI][NS][TF][JP]$/.test(w)) { out.add(w); continue; }
    if (w.length >= 2 && !NAME_GENERIC.has(w) && /^[가-힣]+$/.test(w)) { out.add(w); if (/살$/.test(w) && w.length >= 3) out.add(w.slice(0, -1)); }
  }
  const el = t.match(/^(나무|목|화|토|금|수|불|흙|쇠|물)(?=\s|이|가|의|$)/)?.[1];
  if (el && ELEMENT_NATIVE[el]) { const nat = ELEMENT_NATIVE[el], ko = ELEMENT_KO[nat] ?? el; for (const x of [`${nat} 기운`, `${nat}의 기운`, `${nat} 글자`, `${ko} 기운`, `${ko}(${nat})`, `${nat}(${ko})`]) out.add(x); }
  return [...out];
}
const FACT_TERM = /(?<![가-힣])(비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인|비겁|식상|재성|관성|인성)(?![가-힣])|(?<![가-힣])([가-힣]{1,4}(?:살|귀인))(?=[\s:(·,)]|$)|([자축인묘진사오미신유술해]{2,3}) ?(충|합|형|파|해|원진)(?![가-힣])|\b([EI][NS][TF][JP])\b|(20\d\d)년 ([갑을병정무기경신임계][자축인묘진사오미신유술해])/g;
/** 사실 줄 정리(낱말 찾기용): 한자만 든 괄호를 떼고 간지 한자는 한글로, 한글 괄호(「기운(편재·정재)」)는 괄호만 풀어 낱말을 남긴다. */
const plainFact = (s: string) => s.replace(/\s?\([一-鿿·\s]+\)/g, "").replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]{2,3}(?=[가-힣])/g, m => `${[...m].map(c => GANJI_HAN[c]).join("")} `)
  .replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, c => GANJI_HAN[c]).replace(/[一-鿿]+/g, "").replace(/[()]/g, " ").replace(/\s{2,}/g, " ").trim();
/** 상품 근거 사실 줄의 핵심 낱말: 머리 마디(「이름: 뜻」)의 핵심 낱말 + 십성·신살·귀인·관계(간지 짝·관계 이름)·MBTI·해 간지 + 짧은 값(「관계 상태: 솔로」→ 솔로). */
export function factTokens(facts: readonly string[]): string[] {
  const out = new Set<string>();
  for (const f0 of facts) {
    const f = plainFact(f0), head = plainName(f0).match(/^([^:—]{2,24})(?::| —) (.*)$/);
    if (head) { for (const x of nameTokens(head[1])) out.add(x); const v = head[2].trim(); if (v.length <= 8) for (const x of v.split(/\s*[·,]\s*/)) if (/^[가-힣]{2,6}$/.test(x) && !NAME_GENERIC.has(x)) out.add(x); }
    for (const m of f.matchAll(FACT_TERM)) for (const x of [m[1], m[2], m[3], m[4] && m[3] ? `${m[3]} ${m[4]}` : undefined, m[5], m[7]]) if (x && x.length >= 2) { out.add(x); if (/살$/.test(x) && x.length >= 3) out.add(x.slice(0, -1)); }
  }
  return [...out];
}
/** 지표가 자리 이름으로 치지 않는 넓은 자리(어디에나 나오는 말). */
const WIDE_WHERE = /^(원국 전체|두 사람|MBTI|그 해|대운|[가-힣]{1,5}님)$/;
/** 근거 하나가 본문에 나왔나: 정리한 이름 · 이름 핵심 낱말 · 자리 이름(넓은 자리 빼고) · 사실 낱말. 맥락 근거는 사실 낱말만. */
export function evidenceUsed(text: string, e: InfoEvidence): boolean {
  const keys = e.context ? factTokens(e.facts ?? []) : [plainName(e.name), ...nameTokens(e.name), ...(e.facts ? factTokens(e.facts) : []), ...(e.where ?? []).filter(w => w.length >= 2 && !WIDE_WHERE.test(w))];
  return keys.some(k => k.length >= 2 && text.includes(k));
}
/**
 * lint scene_unbacked(W3 P3 보강, W4 Q2-4): 4종 책에서 그 절 근거가 없는 구체 장면의 낱말 — 단정이든 물음이든(「헬스장에서 무게를 올리며 …죠?」도 지어낸 장면이다).
 * 근거에 묶인 성향 물음(구체 장소·물건·앱·사건 낱말 없음)은 concreteScene이 잡지 않는다.
 */
export function unbackedScene(sentence: string, card: InfoCard | undefined, props: readonly string[] = []): readonly string[] | null {
  const h = concreteScene(sentence);
  return h && !sceneBackedBy(sentence, h.nouns, cardBacking(card), props) ? h.nouns : null;
}
/** 장면 낱말이 모두 근거 글(카드 장면·소품·근거 사실·뜻, 입력의 직업 장면)에 있는가. */
export const nounsBacked = (nouns: readonly string[], backing: readonly string[]) => nouns.length > 0 && nouns.every(n => backing.some(b => b.includes(n)));
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

/** 생활 장면 단정 문장인가(concreteScene에서 물음 뺀 것). 장면 낱말 목록을 돌려준다(없으면 null). */
export function lifeScene(sentence: string): string[] | null {
  const h = concreteScene(sentence);
  return h && !h.ask ? [...h.nouns] : null;
}
/** 장면 문장이 근거 장면 글(씨앗·DB 장면·카드 장면)과 겹치는가: 장면 낱말 하나 + 다른 내용 낱말 하나 이상. */
export function sceneBacked(sentence: string, words: readonly string[], backing: readonly string[]): boolean {
  const mine = contentWords(bare(sentence));
  return backing.some(b => { if (!words.some(w => b.includes(w))) return false; const theirs = contentWords(b); let shared = 0; for (const w of mine) if (theirs.has(w) && !words.includes(w)) shared++; return shared >= 1; });
}
/**
 * 장면 근거: scenes(씨앗·카드 장면)와 겹치거나, near(그 절 카드 장면)에 장면 낱말이 절반 이상 있거나(카드 장면을 이 고객 말로 고쳐 쓴 꼴 — 「단골 미용실」→「단골 가게」),
 * 장면 낱말이 모두 all(카드 글) 또는 props(입력의 직업 장면·궁합 두 사람 차이 줄)에 있다.
 */
export type SceneBacking = { readonly scenes: readonly string[]; readonly all: readonly string[]; readonly near?: readonly string[] };
export const sceneBackedBy = (sentence: string, nouns: readonly string[], b: SceneBacking, props: readonly string[] = []) =>
  sceneBacked(sentence, nouns, b.scenes) || (b.near ?? []).some(t => nouns.filter(n => t.includes(n)).length * 2 >= nouns.length) || nounsBacked(nouns, [...b.all, ...props]);
/** 카드 하나의 장면 근거(카드가 없으면 없음). 물음 재료 장면(ask)은 단정의 근거가 아니다 — 그 장면을 단정하면 근거 없음(수리가 성향 물음으로). */
export const cardBacking = (card: InfoCard | undefined): SceneBacking => {
  const sc = card?.scene && !card.scene.ask ? card.scene : null;
  return { scenes: sc ? [sc.text] : [], near: sc ? [sc.text] : [], all: [...(card?.text ?? []), ...(sc ? [sc.text, ...(sc.props ?? [])] : [])] };
};

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
  const per = new Map<string, { evidenceUsed: number; restatements: number; lessons: number; sameSentence: number; rehash: number; phraseRepeat: number; rxRepeat: number; sceneUnbacked: number; sceneFirst: number; sceneMbti: number; sceneAsk: number; exposure: number }>();
  const row = (k: string) => { let r = per.get(k); if (!r) { r = { evidenceUsed: 0, restatements: 0, lessons: 0, sameSentence: 0, rehash: 0, phraseRepeat: 0, rxRepeat: 0, sceneUnbacked: 0, sceneFirst: 0, sceneMbti: 0, sceneAsk: 0, exposure: 0 }; per.set(k, r); } return r; };
  // 근거 사용(절마다).
  let evidenceZero = 0;
  for (const c of sectionsOf) c.sections.forEach((sec, si) => {
    const text = [sec.heading, ...sec.paragraphs].join(" ").replace(/[⟪⟫]/g, "");
    let n = 0;
    const card = cards?.find(x => x.chapter === c.n && x.section === si);
    if (cards) { for (const e of card?.evidence ?? []) if (evidenceUsed(text, e)) n++; }
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
    const hit = concreteScene(x.text); if (!hit) continue;
    const card = cards?.find(k => k.chapter === x.c && k.section === x.s);
    const backed = sceneBackedBy(x.text, hit.nouns, cards ? cardBacking(card) : { scenes: dict.scenes ?? [], all: [] }, dict.props ?? []);
    // W4 Q2-4(info-v4): 근거 없는 장면 물음도 「근거 없는 장면」으로 센다(W3 P4 — 물음 꼴 장면을 판독자는 지어낸 장면으로 셌다). sceneAsk는 그 가운데 물음 수.
    if (hit.ask) { scenes++; if (!backed) { r.sceneAsk++; mark(x, "sceneAsk"); r.sceneUnbacked++; sceneAt.push(at(x)); mark(x, "sceneUnbacked"); } continue; }
    scenes++; if (backed) continue;
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
    totals: { evidenceUsed: sum("evidenceUsed"), restatements: sum("restatements"), lessons: sum("lessons"), sameSentence: same.length, rehash: rehash.length, phraseRepeat: sum("phraseRepeat"), rxRepeat: sum("rxRepeat"), sceneUnbacked: sum("sceneUnbacked"), sceneFirst: sum("sceneFirst"), sceneMbti: sum("sceneMbti"), sceneAsk: sum("sceneAsk"), exposure: sum("exposure"),
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
    // 입력의 직업 장면(고객이 적은 직업·그 직업의 일 단계 장면)·궁합 두 사람 차이 줄(성향 끝 설명)은 지어낸 장면이 아니다.
    // W4 Q2-2: 장 소품 힌트(sceneHint — 입력 관계·직업·생활 단계에서 나온 소품)도 근거다.
    props: [...brief.chapters.flatMap(c => c.sceneHint ?? []), brief.person.facts.job.detail, ...Object.values(brief.person.workScenes ?? {}).flat(), ...(brief.compatibility?.differences ?? []).flatMap(d => [d.a, d.b]), ...(brief.compatibility?.profiles ?? []).map(p => p.line)].filter(x => typeof x === "string" && x.length >= 2),
  };
}
