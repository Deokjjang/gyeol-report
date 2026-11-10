/**
 * P6c 책 단위 검사(결정론·호출 0). 안전망(문장 삭제 규칙) 뒤에 돈다.
 *  - tidyBook: 뜻을 바꾸지 않는 결정론 정리 — "명리학에서" 떼기(A4), 괄호 밖 MBTI 약어 → "쉬운 이름(Te)"·쉬운 이름(C5),
 *    세운 달 본문 "이번 달" → "이 달"(E5), 소제목마다 핵심 문장 기호 ⟪ ⟫ 하나만(H).
 *  - lintBook: 수리 패스(A5)로 보낼 문장·소제목·카드 줄 목록. 결정론 장은 수리하지 않고 지운다(DB 원문·이전 책 겹침은 보지 않는다).
 *  - enforce: 수리 뒤에도 걸리는 문장을 지운다(문단이 한 문장 아래로 줄면 문단을 뺀다). 빈자리를 DB 원문·안전망 문장으로 채우지 않는다.
 */
import { removeSentenceAt, stripConnective } from "./orphan";
import type { BookSection, SectionCard } from "../format";
import type { FinalChapter } from "./index";
import * as L from "./lint";
import { isPastAssertion, splitSentences } from "./patterns";
import { sentenceViolation, type SafetyFacts, type SentenceRule } from "./sentences";
import * as D from "./p6d";
import * as E from "./p6e";
import * as F from "./final2";
import { cueMisfits, POLE_CUES, poleFits } from "@/lib/brief/mbtiFn";
import { collapseRenderDup, factCheck, fixParenParticles, tidyFixedTime, type FactCtx, type FactRule } from "@/lib/factsheet/check";
import { fnRoleMismatch, STYLE_HINT, styleFlags, type StyleRule } from "./style";

export type P6cRule = "db_copy" | "prior_overlap" | "formula_excess" | "backref_excess" | "meaning_repeat" | "scene_repeat" | "nickname" | "farming" | "second_image"
  | "school_scene" | "presumed_partner" | "past_assertion" | "job_prop" | "yinyang_claim" | "element_claim" | "dayun_claim" | "star_claim" | "ten_god_direction"
  | "marriage_talk" | "card_missing" | "card_form" | "card_overlap" | "card_length" | "card_rule"
  // P6d: 안전망 문장 규칙(삭제하지 않고 수리로) · 묶음 세기 · 조각 문장 · 사실·위치 · 시점 · 부정 단정 · 소품 · 투자
  | "safety" | "group_claim" | "fragment" | "empty_preview" | "count_mismatch" | "dayun_year" | "pair_both" | "self_correction" | "chapter_ref"
  | "time_deictic" | "calendar_month" | "closing_repeat" | "negative_claim" | "prop_repeat" | "invest_directive" | "intensity_claim" | "evidence_missing"
  // P6e: 지침 노출 · 고아 문장 · 신살 주인 · MBTI 오귀속 · 기둥 자리 · 안내 중복 · 씨앗 원문 · 기능 이어 쓰기 · 비문 꼴
  | "element_count" | "scene_owner" | "group_name" | "guide_copy" | "guide_echo" | "orphan_start" | "feature_owner" | "mbti_misattr" | "pillar_claim" | "notice_repeat" | "seed_copy" | "fn_join" | "awkward"
  // 최종판2: 궁합 성격표 · 명식 글자 나열 · 같은 일주 구절 · 다른 책 이미지
  | "pair_profile" | "glyph_list" | "ilju_phrase" | "avoid_image"
  // 최종판3 3: 정답지 대조(사실·뜻·관계·강약·간지·개수와 세기·공통 특징) · 렌더(중복 치환·내부 라벨) · 종합 시점 · 입력 밖 직업 상황
  | FactRule | "phrase_repeat"
  // AM 1-1 ②·1-4: 장 안 같은 구절 · 같은 문장 시작 3연속 · 같은 연결어 과다(문체 규칙, style.ts)
  | StyleRule | "fn_role";
export type CardField = "image" | "todo" | "review" | "caution" | "good";
/** paragraph: -1 = 소제목, card가 있으면 카드 줄. */
export type LintFlag = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly card?: CardField; readonly rule: P6cRule; readonly sentence: string; readonly hint: string; readonly detail?: string };
/**
 * 수리 뒤에도 걸리면 문단째 빼는 규칙(사용자 결정 2026-11-04: 사실·금지 규칙만 문단째, 문체·반복은 그대로 두고 기록).
 * 문장만 지우면 조각 문장이 남는다(P6c "하는 물음이 자주 올라와요").
 */
export const HARD_RULES: ReadonlySet<P6cRule> = new Set<P6cRule>(["safety", "school_scene", "presumed_partner", "past_assertion", "yinyang_claim", "element_claim", "dayun_claim", "star_claim", "ten_god_direction", "marriage_talk",
  "group_claim", "fragment", "empty_preview", "count_mismatch", "dayun_year", "pair_both", "self_correction", "chapter_ref", "time_deictic", "calendar_month", "negative_claim", "invest_directive", "intensity_claim",
  "guide_copy", "orphan_start", "feature_owner", "mbti_misattr", "pillar_claim", "element_count", "scene_owner", "pair_profile", "glyph_list", "ilju_phrase", "avoid_image",
  "fact_term", "fact_relation", "fact_strength", "fact_ganji", "fact_meaning", "fact_mix", "fact_dayun", "common_split", "render_dup", "label_leak", "time_fixed", "input_outside", "fn_role"]);
/** 안전망 문장 규칙 가운데 문체(삭제·문단 빼기 대상이 아닌 것). */
const SOFT_SAFETY: ReadonlySet<SentenceRule> = new Set<SentenceRule>(["example_copy", "duplicate_sentence", "nickname", "rural_prop"]);
export type LintCtx = {
  readonly facts: SafetyFacts; readonly jobDetail: string; readonly schoolStage: L.SchoolStage | "student";
  readonly yinYang?: { readonly yin: number; readonly yang: number }; readonly presence?: L.ElementPresence; readonly dayunPhase?: L.DayunPhase;
  readonly stars?: { readonly spouse?: L.StarWhere; readonly child?: L.StarWhere };
  readonly coreImage: string; readonly nicknames: readonly string[]; readonly corpus: ReadonlySet<string>; readonly prior: readonly string[];
  readonly jobProps: readonly string[]; readonly noJobChapters: ReadonlySet<number>; readonly parentingChapters: ReadonlySet<number>; readonly monthChapters: ReadonlySet<number>;
  readonly compat: boolean; readonly mbtiPlain: Readonly<Record<string, string>>;
  /** 카드 기간 상태(key → past·current·future). */
  readonly periods?: Readonly<Record<string, "past" | "current" | "future">>;
  /** P6d A: 묶음 세기 단계(만세력 가중값). 궁합은 사람마다(이름이 나온 문장만 본다). */
  readonly groupLevels?: L.GroupLevels; readonly groupLevelsBy?: readonly { readonly name: string; readonly levels: L.GroupLevels }[];
  /** P6d C: 궁합 두 사람의 엔진 값("둘 다" 검사). */
  readonly pair?: D.PairFacts;
  /** P6d C: 대운 연도 key → 대운 안 몇 번째 해(1~10). */
  readonly yearIndex?: Readonly<Record<string, { readonly index: number; readonly total: number }>>;
  /** P6d E: 달력이 있는 책(대운·세운)은 "지금" 전부 금지. calendarChapters: 달력월 이름 금지 장(세운 전체). */
  readonly strictTime?: boolean; readonly calendarChapters?: ReadonlySet<number>;
  /** AM 2부: 세운 신년판 달 카드에 「좋은 것」 칸이 있다. */
  readonly goodCards?: boolean;
  /** P6d F: key → 엔진 관계 표시 수(0이면 "건드리지 않는다" 허용). 궁합은 두 사람 날 관계 수. */
  readonly relationCount?: Readonly<Record<string, number>>; readonly pairRelations?: number;
  /** P6d F: 책당 1회만 쓰는 소품 명사. G: 투자 장. 안전망 규칙 문맥(예시 창·조건형 장). */
  readonly props?: readonly string[]; readonly investChapters?: ReadonlySet<number>; readonly allowed?: ReadonlySet<string>; readonly conditionalChapters?: ReadonlySet<number>;
  /** P6e: 부모 역할 장(자녀 입력이 '있음'이 아닐 때 장 전체가 가정형). 자녀 문장은 이미 있다고 단정할 때만 잡는다. */
  readonly childChapters?: ReadonlySet<number>;
  /** 세기 주장(P6b E-11): key → 흐름 점수와 같은 종류(연·월) 안의 최고·최저. */
  readonly flow?: Readonly<Record<string, { readonly score: number; readonly max: number; readonly min: number }>>;
  /** 카드 key → 천간 십성(같은 십성 key끼리 카드 줄을 더 엄격히 견준다, P6d D). */
  readonly cardTenGod?: Readonly<Record<string, string>>;
  /** 장마다 반드시 써야 하는 근거 낱말(P6d G 커리어·연애): 장 번호 → 낱말 꼴들(하나라도 없으면 evidence_missing). */
  readonly requiredTerms?: ReadonlyMap<number, readonly RegExp[]>;
  /** P6e 1: 작가 지침·브리프 규칙(note)의 정규화 8자 창(사실·재료 글과 겹치는 창은 뺀 것). */
  readonly guide?: ReadonlySet<string>;
  /** P6e 3: 궁합 두 사람의 이름 꼴과 신살·귀인·십이운성 이름(사람별). */
  readonly owners?: E.OwnerFacts;
  /** 최종판 1-5: 궁합 두 사람의 오행 겉 글자 수(사람별, 이름이 하나만 나온 문장만 견준다). */
  /** 최종판 1-10: 커리어 책(다섯 힘 쉬운 이름 정리·다른 이름 검사). */
  readonly careerGroups?: boolean;
  /** 최종판 1-5: 궁합 장면 씨앗의 차원 끝 주인(브리프 rel.who에서). */
  readonly sceneOwners?: readonly E.SceneOwner[];
  /** 최종판2 1-3·1-4·1-1: 궁합 사람별 성격표, 사람별 명식 글자(한 사람 책은 하나), 같은 일주 이전 책 구절, 피할 이미지 줄. */
  /** 최종판2 1-6: 책 기준일(KST YYYY-MM-DD, 날짜 맞춤 정리). */
  readonly baseDate?: string;
  readonly profilePeople?: readonly F.ProfilePerson[]; readonly glyphPeople?: readonly F.GlyphPerson[]; readonly iljuPhrases?: readonly string[]; readonly avoidLines?: readonly string[];
  readonly presenceBy?: readonly { readonly name: string; readonly presence: L.ElementPresence }[];
  /** P6e 4: 이 책 사람들의 MBTI(유형·그 유형을 말한 문장 단서). */
  readonly mbtiPeople?: readonly E.MbtiPerson[];
  /** P6e 5: 자리별 십성(천간 = 그 글자, 지지 = 지장간 십성 전부). 궁합은 사람마다(이름이 나온 문장만). */
  readonly positions?: E.PositionTenGods; readonly positionsBy?: readonly { readonly name: string; readonly positions: E.PositionTenGods }[];
  /** P6e 10: 재료의 꼬리표·압축 구(×·→ 꼴 마디). */
  readonly seedLabels?: ReadonlySet<string>;
  /** P6e 7: 용어 이름(한자 없이 쓰는 "식신은 ~을 뜻해요" 꼴을 뜻 공식으로 센다). */
  readonly termNames?: RegExp;
  /** 최종판3 3: 정답지 대조 문맥(엔진 사실·별칭·사람 이름). 없으면 대조하지 않는다. */
  readonly fact?: FactCtx;
};
const PEAK = /가장 (거센|센|강한|뜨거운|크게 움직이는|큰|좋은|활발한|바쁜)( [가-힣]+)? ?(달|해|때|시기)/;
const LOW = /가장 (조용한|약한|잔잔한|느린|차분한|한가한)( [가-힣]+)? ?(달|해|때|시기)/;

const HINT: Readonly<Record<P6cRule, string>> = {
  ...STYLE_HINT,
  fn_role: "MBTI 기능 순서(주기능·부기능)를 틀렸다 → detail의 맞는 기능으로 고치거나 순서 말을 뺀다",
  phrase_repeat: "다른 장에서 쓴 구절을 되풀이했다 → 이 장의 새 정보·새 장면으로 바꿔 쓴다(같은 처방·같은 장면 금지)",
  fact_term: "정답지와 다른 신살·귀인·운성(이름·자리·주인) → detail의 맞는 사실로 고치거나 그 주장을 뺀다",
  fact_relation: "정답지와 다른 관계(없는 글자·글자 수·완성도·건드리지 않는 해) → detail의 맞는 관계로 고친다",
  fact_strength: "강약·묶음 세기가 정답지와 다르거나 다른 저울을 한 숨에 섞었다 → detail대로 한쪽만 맞게 쓴다",
  fact_ganji: "간지·연도·대운·대운수가 정답지와 다르다 → detail의 값으로 고친다",
  fact_meaning: "오행의 뜻을 이 사람 일간 기준 십성과 다르게 풀었다 → detail의 십성 뜻으로 고치거나 뺀다",
  fact_mix: "오행 개수와 세기를 한 마디에 섞었다 → 개수면 개수만, 힘이면 힘만",
  fact_dayun: "대운 기간을 정답지와 다르게 말했다(예: 「올해까지」) → 정답지의 시작·끝 해대로, 모르면 기간을 빼고 흐름만",
  common_split: "두 사람 모두 가진 특징을 한 사람만의 것·차이의 근거로 썼다 → '두 사람 모두'로 쓰거나 다른 근거로",
  render_dup: "같은 말을 두 번 이었다(「X, 곧 X」) → 한 번만",
  label_leak: "내부 분류 라벨·생성 규칙·면책 문구가 본문에 나왔다 → 그 말을 빼고 내용만",
  time_fixed: "종합 본문에 연·월 숫자를 고정했다 → 운 설명은 '올해(병오)', 행동 제안은 '앞으로 한 달'로",
  input_outside: "입력에 없는 직업 상황을 사실처럼 썼다 → 입력에 있는 사실만, 아니면 직업과 무관한 보편 장면으로",
  db_copy: "브리프 글을 20자 넘게 그대로 옮겼다 → 같은 뜻을 이 고객의 말로 새로 쓴다",
  prior_overlap: "이 고객의 다른 책과 같은 문장이다 → 다른 장면·다른 말로 쓴다",
  formula_excess: "'이름(한자)은 ~을 뜻해요' 꼴이 책에서 4번을 넘었다 → 장면→용어, 질문→답, 대비(겉은 ~ 속은 ~) 가운데 하나로 연다",
  backref_excess: "'앞에서 본'이 책에서 2번을 넘었다 → 되짚지 말고 이 자리의 새 정보로 쓴다",
  meaning_repeat: "이 특성의 뜻은 책에서 이미 풀었다 → 뜻을 다시 풀지 말고 이 영역의 새 쓰임만",
  scene_repeat: "책 안 다른 곳과 같은 장면·문장이다 → 다른 장면으로 바꾼다",
  nickname: "그림 별명(별칭)을 썼다 → 용어 이름과 뜻으로만",
  farming: "농사·시골 비유를 썼다 → 현대 생활 비유로 바꾸거나 뺀다",
  second_image: "1장에 핵심 이미지 말고 다른 그림을 세웠다 → 핵심 이미지 하나만",
  school_scene: "학교 장면은 이 고객의 생활 단계와 맞지 않는다 → 이 고객의 일·생활 장면으로",
  presumed_partner: "입력에 없는 연인·배우자를 전제했다 → 조건형('생기면·된다면')이나 일반 장면으로",
  past_assertion: "입력에 없는 과거 사건·지인을 사실로 썼다 → 질문형·가정형으로",
  job_prop: "직업 소품이 이 장에 두 번 넘게(연애·가족 장은 0번) 나왔다 → 하나만 남기고 생활 장면으로",
  yinyang_claim: "음양 비율과 다른 말이다 → 브리프 chart.yinYang 비율대로(같으면 균형, 다르면 치우침)",
  element_claim: "겉 글자 0·땅속에 있는 오행을 '없다'고 단정했다 → '겉에는 없고 땅속에 조금'",
  dayun_claim: "대운 안의 위치가 엔진 연차와 다르다 → chart.currentDayun.phase 그대로",
  star_claim: "배우자 별·자녀 별의 자리와 다른 말이다 → chart.stars 그대로",
  ten_god_direction: "십성 누름 방향이 거꾸로다 → 인성→식상, 식상→관성, 재성→인성, 관성→비겁, 비겁→재성",
  marriage_talk: "자녀 장에 결혼·양가 이야기가 나왔다 → 아이를 키울 때의 모습만",
  card_missing: "카드 줄이 없다 → 그 key의 십성·관계에서 한 줄",
  card_form: "카드 꼴이 틀렸다 → 지난 기간은 [돌아보기] 질문형, 지금·앞으로는 [해 볼 것] 명령형",
  card_overlap: "다른 key의 카드와 같은 문장·꼴이다 → 이 시기의 십성·관계에서 나온 다른 한 줄",
  card_length: "카드 줄 길이가 맞지 않는다 → 그림 14~30자, 나머지 10~50자 한 줄",
  card_rule: "카드 줄이 금지 규칙에 걸렸다 → 같은 뜻을 규칙 안에서",
  safety: "금지 규칙(입력에 없는 사실·시주·내부 용어·확정 예언 등)에 걸렸다 → 그 사실 없이 같은 흐름으로 다시 쓴다",
  group_claim: "십성 묶음 세기가 엔진 값과 다르다 → chart.groups 단계(강·보통·약) 그대로",
  fragment: "앞 구절이 빠진 조각 문장이다 → 주어·앞말을 갖춘 온전한 문장으로",
  empty_preview: "예고만 하고 받는 내용이 없다('이런 변화가 있을 거예요') → 무엇이 바뀌는지 바로 쓴다",
  count_mismatch: "'이 세 가지'처럼 가리키는 개수가 앞의 항목 수와 다르다 → 개수를 맞추거나 항목을 직접 부른다",
  dayun_year: "대운 안의 위치(앞쪽·중간·마지막 해·남은 해)가 엔진의 '대운 안 몇 번째 해'와 다르다 → 그 값 그대로",
  pair_both: "'둘 다 ~'가 한 사람에게만 맞는다 → 두 사람 각각의 엔진 값대로 나눠 쓴다",
  self_correction: "괄호 안에 자기 정정('~이 아니라')이 드러났다 → 맞는 이름 하나만",
  chapter_ref: "장 번호로 앞 장을 가리켰다('7장에서') → 번호 없이 그 내용을 짧게 다시 부른다",
  time_deictic: "읽는 때를 못 박는 말('지금·이번 달·올해 남은')이다 → 기준일(이 책의 기준 날짜)·그 해·그 달 이름으로",
  calendar_month: "세운 본문에 달력월 이름('1월·2월')을 썼다 → 간지월 이름(경인월 등)으로",
  closing_repeat: "여러 달이 같은 마무리 문형으로 끝난다 → 이 달만의 끝맺음으로",
  negative_claim: "엔진이 관계(합·충·형·해 등)를 짚었는데 '건드리지 않는다'고 했다 → 관계 표시(marks) 그대로",
  prop_repeat: "같은 소품이 책에서 두 번째로 나왔다 → 다른 생활 장면으로",
  invest_directive: "특정 종목·상품·매수 시점을 말했다 → 성향과 원칙만",
  intensity_claim: "'가장 ~한 달·해'가 엔진 흐름 점수와 다르다 → 그 시기의 기운만",
  evidence_missing: "이 장이 반드시 써야 하는 근거가 본문에 없다 → 그 절 materials의 근거를 한 문장 더해 잇는다",
  group_name: "다섯 힘을 정한 쉬운 이름 말고 다른 이름으로 불렀다 → 내 방식의 힘·만드는 힘·값을 받는 힘·규칙의 힘·배우는 힘 가운데 그 이름 하나로",
  element_count: "오행 개수와 다른 말(없다·가장 많다·가장 적다) → facts의 오행 개수(elementCounts) 그대로, 그 사람 것만",
  scene_owner: "궁합 장면의 주인(그 성향을 가진 사람)을 바꿔 썼다 → 장면 씨앗의 who(그 사람 이름) 그대로",
  pair_profile: "그 사람의 고정 성향(profiles 줄: 에너지·앞에 나서는지·다툼 때 반응·표현 방식·결정 속도)과 반대로 썼다 → 그 사람 줄대로 고쳐 쓴다. 두 사람을 묶은 문장은 두 사람 칸이 같을 때만 묶는다",
  glyph_list: "그 사람 명식에 없는 글자를 나열했다 → 그 사람 명식에 있는 글자만 쓰거나 글자 나열을 뺀다",
  ilju_phrase: "같은 일주의 다른 책에 이미 나온 구절이다 → 같은 뜻을 다른 장면·다른 말로 새로 쓴다",
  avoid_image: "다른 책이 이미 쓴 그림(chart.avoidImages)이다 → 이 책 표지 그림으로 바꾸거나 그림 없이 쓴다",
  guide_copy: "작가에게 준 지침·규칙 문장을 독자에게 옮겼다('~쓰지 마세요' 등) → 그 문장을 빼고 이 사람 이야기만 쓴다",
  guide_echo: "작가 지침 문장과 같은 말을 옮겼다 → 이 사람 이야기로 새로 쓴다",
  orphan_start: "앞 문단이 없는 자리인데 '도·또한·여기에·이처럼·그래서·반대로'로 열었다 → 이 소제목만 읽어도 뜻이 서는 첫 문장으로",
  feature_owner: "신살·귀인을 다른 사람의 것으로 썼다 → 그 기운을 가진 사람 이름으로(facts.pair의 사람별 목록 그대로)",
  mbti_misattr: "이 유형의 기능·태도에 없는 성향을 그 유형의 특성으로 썼다 → 그 유형의 네 기능(mbti.functions)과 E/I·J/P에 맞는 성향으로",
  pillar_claim: "기둥 자리(연·월·일·시의 하늘/땅 글자)와 십성이 엔진 값과 다르다 → facts.positions 그대로",
  notice_repeat: "안내·면책 문장('단정하는 말은 아니에요', '권유가 아니라')은 책에 한 번 시스템이 넣는다 → 이 문장을 빼고 내용만",
  seed_copy: "재료의 꼬리표·압축 구를 그대로 옮겼다 → 그 뜻을 이 사람의 장면 문장으로 새로 쓴다",
  fn_join: "MBTI 기능 둘을 하이픈으로 이었다 → '~와 ~'처럼 풀어 쓰고 같은 낱말을 되풀이하지 않는다",
  awkward: "말이 어색한 꼴('어차피 ~한 당신은', '~를 챙기는 점심 같은') → 자연스러운 문장으로",
};

/** B3: 십성 누름 방향(키가 값을 누른다). 문장에 두 십성(묶음)이 능동·수동으로 나오면 방향을 본다. */
const TG_GROUP: Readonly<Record<string, string>> = { 비견: "P", 겁재: "P", 비겁: "P", 식신: "O", 상관: "O", 식상: "O", 편재: "W", 정재: "W", 재성: "W", 편관: "G", 정관: "G", 칠살: "G", 관성: "G", 관살: "G", 편인: "R", 정인: "R", 인성: "R" };
const CTRL: Readonly<Record<string, string>> = { P: "W", O: "G", W: "R", G: "P", R: "O" };
const TG_ALT = Object.keys(TG_GROUP).join("|");
const ACTIVE = new RegExp(`(${TG_ALT})(이|가|은|는)\\s[^.?!]{0,25}?(${TG_ALT})(을|를)\\s?[^.?!]{0,6}?(누르|눌러|막|극하|극해|제어|빼앗|꺾|억누르|짓누르)`);
const PASSIVE = new RegExp(`(${TG_ALT})(이|가|은|는)?\\s?[^.?!]{0,25}?(${TG_ALT})(에|에게)\\s?(눌리|눌려|막히|막혀|꺾이)`);
const REVERSED_CAUSE = /식신이 (있어|있으면)[^.?!]{0,20}생각이[^.?!]{0,10}(실행|행동)을? 막/;
export function tenGodDirection(s: string): boolean {
  const a = s.match(ACTIVE); if (a && TG_GROUP[a[1]] !== TG_GROUP[a[3]] && CTRL[TG_GROUP[a[1]]] !== TG_GROUP[a[3]]) return true;
  const p = s.match(PASSIVE); if (p && TG_GROUP[p[1]] !== TG_GROUP[p[3]] && CTRL[TG_GROUP[p[3]]] !== TG_GROUP[p[1]]) return true;
  return REVERSED_CAUSE.test(s);
}

const MARRIAGE_TALK = /결혼|시댁|처가|양가|시부모|시어머니|시아버지|장인|장모|상견례|신혼|혼수|예식/;
const FARM_JOB = /농|어업|어민|양식|축산|과수|원예/;

/** 문장 하나의 사실·개인화 규칙(소제목·카드에도 같은 규칙). */
function sentenceRules(s: string, n: number, ctx: LintCtx, heading = false): P6cRule | null {
  if (L.nicknameHits(s, ctx.nicknames, [ctx.coreImage]).length) return "nickname";
  if (L.FARMING.test(s) && !FARM_JOB.test(ctx.jobDetail)) return "farming";
  if (n === 1 && !heading && L.secondImage(s, ctx.coreImage)) return "second_image";
  if (n === 1 && heading && L.secondImage(s, ctx.coreImage)) return "second_image";
  if (!ctx.compat && L.schoolHit(s, ctx.schoolStage, ctx.jobDetail)) return "school_scene";
  if (ctx.compat && L.schoolHit(s, "none")) return "school_scene";
  if (!ctx.compat && L.presumedPartner(s, ctx.facts.relationship)) return "presumed_partner";
  if (!heading && L.pastAssertion(s)) return "past_assertion";
  if (ctx.yinYang && L.yinYangClaim(s, ctx.yinYang.yin, ctx.yinYang.yang)) return "yinyang_claim";
  if (ctx.presence && L.elementAbsenceClaims(s, ctx.presence).length) return "element_claim";
  // 최종판 1-5: 오행 개수(없다·가장 많다·가장 적다). 궁합은 한 사람 이름만 나온 문장을 그 사람 값과 견준다.
  if (ctx.presence && L.elementCountClaims(s, ctx.presence)) return "element_count";
  if (ctx.presenceBy && L.elementOwnedClaims(s, ctx.presenceBy)) return "element_count";
  if (ctx.presenceBy) for (const p of ctx.presenceBy) if (s.includes(p.name) && !ctx.presenceBy.some(o => o !== p && s.includes(o.name)) && (L.elementAbsenceClaims(s, p.presence).length || L.elementCountClaims(s, p.presence))) return "element_count";
  if (ctx.dayunPhase && L.dayunPhaseClaim(s, ctx.dayunPhase)) return "dayun_claim";
  if (ctx.stars?.spouse && L.starClaim(s, "배우자", ctx.stars.spouse)) return "star_claim";
  if (ctx.stars?.child && L.starClaim(s, "자녀", ctx.stars.child)) return "star_claim";
  if (tenGodDirection(s)) return "ten_god_direction";
  if (ctx.parentingChapters.has(n) && MARRIAGE_TALK.test(s)) return "marriage_talk";
  if (ctx.groupLevels && L.groupClaimMismatch(s, ctx.groupLevels)) return "group_claim";
  if (ctx.groupLevelsBy) for (const p of ctx.groupLevelsBy) if (s.includes(p.name) && !ctx.groupLevelsBy.some(o => o !== p && s.includes(o.name)) && L.groupClaimMismatch(s, p.levels)) return "group_claim";
  if (ctx.pair && D.pairBothClaims(s, ctx.pair).length) return "pair_both";
  if (D.selfCorrection(s)) return "self_correction";
  if (D.CHAPTER_REF.test(s)) return "chapter_ref";
  if (D.timeDeictic(s, Boolean(ctx.strictTime))) return "time_deictic";
  if (ctx.calendarChapters?.has(n) && D.calendarMonth(s)) return "calendar_month";
  if (ctx.investChapters?.has(n) && D.INVEST_DIRECTIVE.test(s)) return "invest_directive";
  // P6e 1: 독자에게 쓰는 법을 시키는 꼴("~쓰지 마세요")만 사실·금지(guide_copy). 지침 글과 겹치는 창은 문체(guide_echo, 수리만, 빼지 않는다).
  if (E.metaInstruction(s) && !E.isNoticeSentence(s)) return "guide_copy";
  if (ctx.owners && E.featureOwnerMismatch(s, ctx.owners)) return "feature_owner";
  if (ctx.positions && E.pillarClaims(s, ctx.positions)) return "pillar_claim";
  if (ctx.positionsBy) for (const p of ctx.positionsBy) if (s.includes(p.name) && !ctx.positionsBy.some(o => o !== p && s.includes(o.name)) && E.pillarClaims(s, p.positions)) return "pillar_claim";
  if (ctx.mbtiPeople && mbtiMisattr(s, ctx.mbtiPeople)) return "mbti_misattr";
  if (ctx.sceneOwners?.length && ctx.owners && E.sceneOwnerMismatch(s, ctx.sceneOwners, ctx.owners.names, POLE_CUES)) return "scene_owner";
  if (ctx.profilePeople && F.pairProfileMismatch(s, ctx.profilePeople)) return "pair_profile";
  if (ctx.glyphPeople && F.glyphListMismatch(s, ctx.glyphPeople)) return "glyph_list";
  return null;
}

/** P6e 4: 그 사람의 MBTI(유형 이름·기능 쉬운 이름)를 말한 문장의 성향 단서가 그 유형의 기능·태도와 맞지 않는다. 궁합은 한 사람만 말한 문장만. */
export function mbtiMisattr(s: string, people: readonly E.MbtiPerson[]): string | null {
  // 한 사람 책은 성향을 말한 문장(유형·기능 이름·"성향·당신")이면 그 사람 이야기다. 궁합은 한 사람만 말한 문장만.
  // 최종판2 1-8: 독자에게 묻는 꼴("~일이 잦지 않나요?", "~쪽이지 않나요?")도 한 사람 책에서는 그 사람 이야기다.
  const single = people.length === 1 && /성향|당신|타고난|[EI][NS][TF][JP]|(잦지|쪽이지|편이지|사람이지) 않나요/.test(s);
  const who = people.filter(p => p.anchors.test(s) || (p.name ? s.includes(p.name) && /성격|성향|MBTI/.test(s) : false));
  const t = who.length === 1 ? who[0].type : single ? people[0].type : null;
  if (!t) return null;
  // 바로 뒤에서 부정하면("~하는 편은 아니에요", "~하지 않는") 그 사람 특성이 아니다.
  const negated = (end: number) => /^[^,.?!]{0,8}(아니|지 않|진 않|지는 않)/.test(s.slice(end));
  for (const [pole, re] of Object.entries(POLE_CUES)) {
    const m = s.match(re); if (!m || poleFits(t, pole.slice(0, -1), pole.endsWith("+") ? 1 : -1)) continue;
    if (negated((m.index ?? 0) + m[0].length)) continue;
    return `${t}:${pole}`;
  }
  for (const c of cueMisfits(t, s)) { const m = s.match(c.re); if (m && negated((m.index ?? 0) + m[0].length)) continue; return `${t}:${c.why}`; }
  return null;
}

/** 소제목 안 핵심 문장 기호: 첫 쌍만 남기고 나머지·짝 없는 기호는 지운다. */
function oneKeySpan(paragraphs: readonly string[]): string[] {
  let found = false;
  return paragraphs.map(p => {
    const m = found ? null : p.match(/⟪([^⟪⟫]+)⟫/);
    if (m) { found = true; const i = p.indexOf(m[0]); return p.slice(0, i).replace(L.KEY_MARK, "") + m[0] + p.slice(i + m[0].length).replace(L.KEY_MARK, ""); }
    return p.replace(L.KEY_MARK, "");
  });
}

export type TidyCount = { readonly prefix: number; readonly mbtiCode: number; readonly monthNow: number; readonly keyMarks: number; readonly hanja?: number; readonly numbers?: number; readonly fnJoin?: number; readonly words?: number; readonly groupNames?: number };
/**
 * 뜻을 바꾸지 않는 결정론 정리(A4·C5·E5·H, 최종판 1-6·1-13·1-14).
 * 최종판 1-6: 작가 출력의 한자는 지운다(렌더 단계가 용어 사전으로 장마다 첫 등장에만 붙인다, 지운 수는 센다).
 * MBTI 약어는 P6d 그대로: 괄호 밖 약어는 책에서 처음 한 번 "쉬운 이름(Te)", 그 뒤로는 쉬운 이름(작가가 쓴 "쉬운 이름(Te)"은 그대로 둔다).
 * 최종판 1-14: 기능 둘을 하이픈으로 이은 꼴("가치 기준(Fi)-지금 이 순간 감각(Se)")은 "~와 ~"로, 바로 앞에 쉬운 이름의 말이 이미 있으면("지난 경험을 기준점으로 삼는 Si") 이름을 되풀이하지 않고 "성향(Si)"으로,
 * 한 자리 수 + 고유어 단위는 고유어 수("1해" → "한 해"). 본문 기준일 줄은 뗀다(1-13).
 */
export function tidyBook(chapters: readonly FinalChapter[], ctx: Pick<LintCtx, "mbtiPlain" | "monthChapters"> & Partial<Pick<LintCtx, "careerGroups" | "baseDate" | "strictTime" | "fact">>): { chapters: FinalChapter[]; count: TidyCount } {
  let prefix = 0, mbtiCode = 0, monthNow = 0, keyMarks = 0, hanja = 0, numbers = 0, fnJoin = 0, words = 0, groupNames = 0;
  const definedGroups = new Set<string>();
  const introduced = new Set<string>();
  // 조사는 바뀐 낱말의 받침으로 다시 고른다(P6d: "속마음의 가치 기준는"), "Te(일 되게 하는 판단)"은 "일 되게 하는 판단(Te)" 하나로(겹쳐 쓰기 방지).
  const PARTICLE: Readonly<Record<string, string>> = { 은: "은는", 는: "은는", 이: "이가", 가: "이가", 을: "을를", 를: "을를", 과: "과와", 와: "과와" };
  const hasBatchim = (w: string) => { const ch = w.replace(/\([^)]*\)$/, "").slice(-1), code = ch.charCodeAt(0) - 0xac00; return code >= 0 && code <= 11171 && code % 28 !== 0; };
  const withJosa = (word: string, particle: string) => { const pair = PARTICLE[particle]; return pair ? word + (hasBatchim(word) ? pair[0] : pair[1]) : word + particle; };
  const CODE = "(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)";
  const plains = Object.values(ctx.mbtiPlain).filter(Boolean).sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const PLAIN = plains.length ? `(?:(?:${plains.join("|")})\\()?` : "";
  // "가치 기준(Fi)-지금 이 순간 감각(Se) 감각", "Fi-Se 감각": 기능 둘을 "A와 B"로 풀고, 바꾼 뒤 겹친 낱말("감각 감각")은 하나로.
  const fixJoins = (p: string) => p.replace(new RegExp(`${PLAIN}${CODE}\\)?\\s?[-–]\\s?${PLAIN}${CODE}\\)?`, "g"), (all, a: string, b: string) => {
    const pa = ctx.mbtiPlain[a], pb = ctx.mbtiPlain[b]; if (!pa || !pb) return all;
    fnJoin++; introduced.add(a); introduced.add(b);
    return `${pa}(${a})${hasBatchim(`${pa}(${a})`) ? "과" : "와"} ${pb}(${b})`;
  }).replace(/([가-힣]{2,4})(\((?:Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\))? \1(?=[과와은는이가을를의에도]|\s|$|[,.])/g, "$1$2");
  // 작가가 쓴 "쉬운 이름(약어)"도 바로 앞(24자)에 그 이름의 말이 있으면 "성향(약어)"로("지난 경험을 기준점으로 삼는 지난 경험 기억(Si)", 최종판 1-14).
  const fixEcho = (p: string) => p.replace(new RegExp(`(${plains.length ? plains.join("|") : "(?!)"})\\((Ni|Ne|Si|Se|Ti|Te|Fi|Fe)\\)`, "g"), (all, plain: string, code: string, offset: number, whole: string) => {
    const before = whole.slice(Math.max(0, offset - 24), offset);
    if (!plain.split(/\s+/).some(w => w.length >= 2 && before.includes(w))) return all;
    mbtiCode++; introduced.add(code); return `성향(${code})`;
  });
  const fixCodes = (p: string) => p.replace(/(?<![A-Za-z(])(Ni|Ne|Si|Se|Ti|Te|Fi|Fe)(?![A-Za-z)])(\(([^()]{2,24})\))?(은|는|이|가|을|를|과|와)?/g, (all, code: string, _g: string, inner: string | undefined, particle: string | undefined, offset: number, whole: string) => {
    // 괄호 안이면 그대로(쉬운말(Te)).
    const open = whole.lastIndexOf("(", offset), close = whole.lastIndexOf(")", offset);
    if (open > close) return all;
    const plain = ctx.mbtiPlain[code] ?? inner; if (!plain) return all;
    mbtiCode++;
    // 바로 앞(24자)에 쉬운 이름의 말(두 글자 이상)이 이미 있으면 이름을 되풀이하지 않는다("지난 경험을 기준점으로 삼는 지난 경험 기억(Si)").
    const before = whole.slice(Math.max(0, offset - 24), offset);
    const echoed = plain.split(/\s+/).some(w => w.length >= 2 && before.includes(w));
    const name = echoed ? "성향" : plain;
    const word = introduced.has(code) && !echoed ? name : `${name}(${code})`;
    introduced.add(code);
    return particle ? withJosa(word, particle) : word;
  });
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => {
    let ps = s.paragraphs.map(p => {
      let q = p;
      if (L.MYEONGRI_PREFIX.test(q)) { const r = L.dropMyeongriPrefix(q); if (r !== q) prefix++; q = r; }
      // 장 번호 참조("7장에서 본 것처럼,")는 뜻을 바꾸지 않고 뗄 수 있는 꼴만 뗀다(P6d C). 나머지는 검사가 수리로 보낸다.
      if (D.CHAPTER_REF.test(q)) { const r = D.dropChapterRef(q); if (r !== q) prefix++; q = r; }
      q = fixEcho(fixCodes(fixJoins(q)));
      const h = E.stripHanja(q); hanja += h.count; q = h.text;
      const nn = E.nativeNumbers(q); numbers += nn.count; q = nn.text;
      const pw = E.plainWords(q); words += pw.count; q = pw.text;
      // 최종판3 3: 괄호 약어 뒤 조사(「눈(Ni)는」→「눈(Ni)은」), 종합 「2026년 11월 한 달」→「앞으로 한 달」.
      { const pp = fixParenParticles(q); words += pp.count; q = pp.text; }
      if (ctx.fact?.comprehensive) { const tf = tidyFixedTime(q); words += tf.count; q = tf.text; }
      if (ctx.careerGroups) { const g = E.careerGroupNames(q, definedGroups); groupNames += g.count; q = g.text; }
      // 최종판3 12: 쉬운 이름 치환 겹침(「배우는 힘인 배우는 힘은」→「배우는 힘은」).
      { const c = collapseRenderDup(q); if (c !== q) { words++; q = c; } }
      // AM 1부 판독(45 2·8장, 48 8장): 같은 문장이 연달아 두 번(수리 흔적) → 하나로.
      { const ss = splitSentences(q), keep = ss.filter((x, i) => i === 0 || x.replace(/[^가-힣A-Za-z0-9]/g, "") !== ss[i - 1].replace(/[^가-힣A-Za-z0-9]/g, "")); if (keep.length < ss.length) { words += ss.length - keep.length; q = keep.join(" "); } }
      // P6e 12: 본문 기준일 줄은 쓰지 않는다(판 표기에만). 작가가 옛 꼴을 따라 쓰면 그 문장만 뗀다(홀로 선 안내 문장).
      q = q.replace(/(^|\s)이 책은 \d{4}년 \d{1,2}월 \d{1,2}일 기준으로 썼어요\.\s?/g, "$1").trim();
      // 최종판2 1-6: 11·12월 기준 책의 「이번 가을 남은 두 달」은 계절이 틀린다 → 「2026년 남은 두 달」(「올해 남은」은 시점 말 규칙 time_deictic이라 연도로).
      if (ctx.baseDate && Number(ctx.baseDate.slice(5, 7)) >= 11) { const r = q.replace(/이번 (가을|겨울)(에)? 남은 (두|한) ?달/g, `${ctx.baseDate.slice(0, 4)}년 남은 $3 달`); if (r !== q) { words++; q = r; } }
      // 최종판2 4: 대운·세운이 아닌 책의 「이번 달·이번 한 달」(시점 말 time_deictic)은 읽는 때 기준 「앞으로 한 달」로(따옴표 안 대사는 그대로).
      // 장덕민 종합 13장 재작성본 「앞에서 본 관계의 결을 이번 달 행동 하나로 옮겨 볼게요」가 남아 그 소제목이 빠졌다.
      if (ctx.monthChapters !== undefined && !ctx.strictTime && !ctx.monthChapters.size) { const r = nowMonth(q); if (r !== q) { words++; q = r; } }
      if (ctx.monthChapters.has(c.n) && /이번 달|이번 한 달|지금 이 달/.test(q)) { monthNow++; q = q.replace(/이번 한 달/g, "이 한 달").replace(/이번 달|지금 이 달/g, "이 달"); }
      return q;
    });
    const marks = ps.join("").match(L.KEY_MARK)?.length ?? 0;
    ps = oneKeySpan(ps);
    keyMarks += marks - (ps.join("").match(L.KEY_MARK)?.length ?? 0);
    let heading = E.plainWords(E.stripHanja(L.dropMyeongriPrefix(s.heading).replace(L.KEY_MARK, "")).text).text;
    if (ctx.careerGroups) heading = E.careerGroupNames(heading, new Set(Object.keys(E.GROUP_EASY_NAME)), true).text;
    return { ...s, heading, paragraphs: ps };
  }) }));
  return { chapters: out, count: { prefix, mbtiCode, monthNow, keyMarks, hanja, numbers, fnJoin, words, groupNames } };
}

const stripMarks = (s: string) => s.replace(L.KEY_MARK, "");
/** 글에 든 쉬운 이름·십성 이름이 가리키는 묶음 이름을 덧붙인다(필수 근거 검사용). */
export function groupAliases(text: string): string {
  const add: string[] = [];
  if (/만드는(?: [가-힣]{1,6}는)? 힘|만들(?:고 [가-힣]{1,6}는|어 내는) 힘|식신|상관/.test(text)) add.push("식상");
  if (/값을 받(?:는|아 내는) 힘|편재|정재/.test(text)) add.push("재성");
  if (/배우(?:는|고 [가-힣]{1,6}는) 힘|편인|정인/.test(text)) add.push("인성");
  if (/규칙(?:의|을 [가-힣]{1,6}는) 힘|편관|정관/.test(text)) add.push("관성");
  if (/내 방식(?:의|대로 [가-힣]{1,6}는) 힘|비견|겁재/.test(text)) add.push("비겁");
  return add.length ? `${text} ${add.join(" ")}` : text;
}

/** 「이번 (한) 달」 → 「앞으로 한 달」(조사 맞춤). 따옴표 안(대사)은 그대로. */
export function nowMonth(text: string): string {
  return text.replace(/이번 (한 )?달(에는|에|은|는|의)?(?=[\s,.])/g, (m, _one: string | undefined, p: string | undefined, at: number) => {
    const before = text.slice(0, at), open = (before.match(/[“"「‘']/g) ?? []).length - (before.match(/[”」’]/g) ?? []).length;
    if (open > 0 || (before.match(/"/g) ?? []).length % 2 === 1) return m;
    return `앞으로 한 달${p === "에는" || p === "은" || p === "는" ? "은" : p === "에" ? " 안에" : p === "의" ? "의" : ""}`;
  });
}

/** 수리 패스로 보낼 목록(책 순서). */
export function lintBook(chapters: readonly FinalChapter[], ctx: LintCtx): LintFlag[] {
  const out: LintFlag[] = [];
  const flag = (f: Omit<LintFlag, "hint">) => out.push({ ...f, hint: HINT[f.rule] });
  let formulas = 0, backrefs = 0;
  const propSeen = new Set<string>();
  const explained = new Set<string>();
  // 책 안 반복(A2): 소제목마다 색인 하나, 다른 소제목 색인과 견준다(같은 소제목 안 비슷한 문장은 문단 흐름이라 보지 않는다).
  const bySection: { at: string; idx: ReturnType<typeof L.overlapIndex> }[] = [];
  for (const c of chapters) {
    const writer = c.source !== "deterministic";
    let jobUses = 0;
    c.sections.forEach((s, si) => {
      if (s.heading && !/^\d{4}(-M\d{2})?$/.test(s.heading)) { const fx = ctx.fact ? factCheck(s.heading, ctx.fact, s.heading, c.n) : null; const r = fx ? null : sentenceRules(s.heading, c.n, ctx, true); if (fx) flag({ chapter: c.n, section: si, paragraph: -1, rule: fx.rule, sentence: s.heading, detail: fx.detail }); else if (r) flag({ chapter: c.n, section: si, paragraph: -1, rule: r, sentence: s.heading }); }
      const key = s.heading, keyed = Boolean(c.keys?.includes(key));
      const yi = keyed ? ctx.yearIndex?.[key] : undefined, rel = keyed ? ctx.relationCount?.[key] : ctx.pairRelations, fl = keyed ? ctx.flow?.[key] : undefined;
      // B3 개수 지시: 소제목 글 전체에서 찾고 그 구절이 든 문단에 단다.
      const secText = s.paragraphs.map(stripMarks).join(" ");
      for (const ref of D.countMismatch(secText)) { const pi = s.paragraphs.findIndex(p => stripMarks(p).includes(ref)); if (pi >= 0) flag({ chapter: c.n, section: si, paragraph: pi, rule: "count_mismatch", sentence: ref }); }
      s.paragraphs.forEach((p, pi) => {
        const sens = splitSentences(p);
        for (const [i, raw] of sens.entries()) {
          const sen = stripMarks(raw);
          const at = { chapter: c.n, section: si, paragraph: pi, sentence: sen };
          // 대운 연도의 위치 말은 가장 구체적인 사실이라 먼저 본다(수리 지시에 그 해의 위치를 준다).
          if (yi && D.dayunYearClaim(sen, yi.index, yi.total)) { flag({ ...at, rule: "dayun_year", detail: D.dayunYearClaim(sen, yi.index, yi.total)! }); continue; }
          // 최종판3 3: 정답지 대조(명확한 불일치만). 맞는 사실을 detail로 수리에 준다.
          { const fx = ctx.fact ? factCheck(sen, ctx.fact, stripMarks(p), c.n) : null; if (fx) { flag({ ...at, rule: fx.rule, detail: fx.detail }); continue; } }
          const r = sentenceRules(sen, c.n, ctx); if (r) { flag({ ...at, rule: r, ...(r === "pair_profile" ? { detail: F.pairProfileMismatch(sen, ctx.profilePeople!)! } : r === "glyph_list" ? { detail: F.glyphListMismatch(sen, ctx.glyphPeople!)! } : {}) }); continue; }
          // 최종 A-8: 「X도 같은 편」이 앞 문장 성향을 성격표와 다른 사람에게 옮긴 꼴.
          if (ctx.profilePeople && i > 0) { const d = F.pairProfileSameSide(sen, stripMarks(sens[i - 1]), ctx.profilePeople); if (d) { flag({ ...at, rule: "pair_profile", detail: d }); continue; } }
          // AM 1부 판독: 주기능·부기능 오기(「ISFJ는 마음 살피기가 주기능이라」).
          { const fr = ctx.compat ? null : fnRoleMismatch(sen, ctx.facts.mbti, ctx.mbtiPlain); if (fr) { flag({ ...at, rule: "fn_role", detail: fr }); continue; } }
          // P6e 2: 앞 문단이 없는 자리(소제목 첫 문단의 첫 문장)가 앞말에 기대어 연다.
          if (pi === 0 && i === 0 && !keyed && E.orphanStart(sen)) { flag({ ...at, rule: "orphan_start", detail: E.orphanStart(sen)! }); continue; }
          // 안전망 문장 규칙(P6d B): 예전에는 지웠다. 이제 수리로 보내고, 수리 뒤에도 걸리면 문단째 뺀다(문체 규칙은 그대로 둔다).
          const sv = sentenceViolation(sen, ctx.facts, ctx.allowed, Boolean(ctx.conditionalChapters?.has(c.n)), Boolean(ctx.childChapters?.has(c.n)));
          if (sv && !SOFT_SAFETY.has(sv)) { flag({ ...at, rule: "safety", detail: sv }); continue; }
          if (L.pastAssertion(sen) === null && isPastAssertion(sen)) { flag({ ...at, rule: "past_assertion", detail: "experience_assert" }); continue; }
          if (D.fragmentSentence(raw, i === sens.length - 1)) { flag({ ...at, rule: "fragment" }); continue; }
          if (D.emptyPreview(sen, sens[i + 1])) { flag({ ...at, rule: "empty_preview" }); continue; }
          if (rel !== undefined && rel > 0 && D.NEGATIVE_RELATION.test(sen)) { flag({ ...at, rule: "negative_claim" }); continue; }
          if (fl && ((PEAK.test(sen) && fl.score < fl.max) || (LOW.test(sen) && fl.score > fl.min))) { flag({ ...at, rule: "intensity_claim" }); continue; }
          // P6e 6·15: 안내·면책은 책에 한 번(시스템이 넣는 줄). 작가가 쓴 안내 문장은 빼게 한다.
          if (writer && E.isNoticeSentence(sen)) { flag({ ...at, rule: "notice_repeat" }); continue; }
          if (writer && ctx.guide && E.guideCopy(sen, ctx.guide)) { flag({ ...at, rule: "guide_echo", detail: E.guideCopy(sen, ctx.guide)! }); continue; }
          if (writer && ctx.seedLabels && E.seedCopy(sen, ctx.seedLabels)) { flag({ ...at, rule: "seed_copy", detail: E.seedCopy(sen, ctx.seedLabels)! }); continue; }
          if (E.FN_JOIN.test(raw)) { flag({ ...at, rule: "fn_join" }); continue; }
          if (E.AWKWARD.test(sen)) { flag({ ...at, rule: "awkward" }); continue; }
          if (ctx.careerGroups && E.groupNameVariant(sen)) { flag({ ...at, rule: "group_name", detail: E.groupNameVariant(sen)! }); continue; }
          if (writer && L.copiedWindow(sen, ctx.corpus)) { flag({ ...at, rule: "db_copy" }); continue; }
          // 최종판2 1-1: 다른 책이 쓴 이미지 줄 · 같은 일주 이전 책과 공백 뺀 12자 이상 같은 구절.
          { const img = writer && ctx.avoidLines?.length ? F.avoidImageHit(sen, ctx.avoidLines, c.n) : null; if (img) { flag({ ...at, rule: "avoid_image", detail: img }); continue; } }
          { const ph = writer && ctx.iljuPhrases?.length ? F.iljuPhrase(sen, ctx.iljuPhrases) : null; if (ph) { flag({ ...at, rule: "ilju_phrase", detail: ph }); continue; } }
          if (writer && ctx.prior.length && L.overlapping(ctx.prior, [sen]).length) { flag({ ...at, rule: "prior_overlap" }); continue; }
          const plainFormula = ctx.termNames ? sen.match(ctx.termNames) : null;
          if (L.MEANING_FORMULA.test(sen) || plainFormula) {
            const term = sen.match(/([가-힣]{1,10}) ?\([一-鿿]{1,6}\)/)?.[1] ?? sen.match(/([가-힣]{1,10})(은|는) 명리/)?.[1] ?? plainFormula?.[1] ?? "";
            if (term && explained.has(term)) { flag({ ...at, rule: "meaning_repeat" }); continue; }
            if (term) explained.add(term);
            if (++formulas > L.MAX_FORMULA) { flag({ ...at, rule: "formula_excess" }); continue; }
          }
          if (L.BACKREF_WORD.test(sen) && ++backrefs > L.MAX_BACKREF) { flag({ ...at, rule: "backref_excess" }); continue; }
          if (ctx.jobProps.some(x => sen.includes(x)) && (ctx.noJobChapters.has(c.n) || ++jobUses > 1)) { flag({ ...at, rule: "job_prop" }); continue; }
          // F 소품 원장: 같은 소품 명사는 책당 1회(두 번째부터).
          const prop = ctx.props?.find(x => sen.includes(x));
          if (prop) { if (propSeen.has(prop)) { flag({ ...at, rule: "prop_repeat", detail: prop }); continue; } propSeen.add(prop); }
          // 책 안 같은 장면·문장(A2): 다른 소제목의 문장과 5-gram 자카드 0.5 이상.
          const at2 = `${c.n}.${si}`;
          if (bySection.some(x => x.at !== at2 && x.idx.has(sen))) { flag({ ...at, rule: "scene_repeat" }); continue; }
          let mine = bySection.find(x => x.at === at2); if (!mine) { mine = { at: at2, idx: L.overlapIndex() }; bySection.push(mine); }
          mine.idx.add(sen);
        }
      });
    });
  }
  // G 장마다 써야 하는 근거(문체 규칙: 문단은 빼지 않고 수리로 근거 한 문장을 더하게 한다).
  for (const c of chapters) { const terms = ctx.requiredTerms?.get(c.n); if (!terms || c.source === "deterministic") continue;
    // 최종판2 4: 쉬운 이름("만드는 힘")·십성 이름("식신·상관")도 그 묶음 근거로 읽는다(장소담 커리어 2·4장이 쉬운 이름으로 썼는데 남았다).
    const text = groupAliases(c.sections.flatMap(s => s.paragraphs).join(" "));
    for (const re of terms) if (!re.test(text)) { const si = Math.max(0, c.sections.findIndex(s => s.paragraphs.length)); if (c.sections[si]?.paragraphs.length) flag({ chapter: c.n, section: si, paragraph: 0, rule: "evidence_missing", sentence: "", detail: re.source }); }
  }
  // E 마무리 문형: 달 장(세운 월)의 key마다 마지막 문장 끝 두 어절, 같은 꼴은 12달 가운데 3번까지.
  for (const c of chapters) if (c.keys && ctx.calendarChapters?.has(c.n)) {
    const seenFrame = new Map<string, number>();
    c.sections.forEach((s, si) => {
      const pi = s.paragraphs.length - 1; if (pi < 0) return;
      const last = splitSentences(s.paragraphs[pi]).at(-1) ?? ""; const f = D.closingFrame(last); if (!f) return;
      const n = (seenFrame.get(f) ?? 0) + 1; seenFrame.set(f, n);
      if (n > D.MAX_CLOSING_REPEAT) flag({ chapter: c.n, section: si, paragraph: pi, rule: "closing_repeat", sentence: stripMarks(last), detail: f });
    });
  }
  // 최종판3 3: 다른 장에서 같은 구절(공백·문장부호 뺀 14자 이상)을 되풀이 → 뒤 문장을 수리로(문체 규칙, 문단은 빼지 않는다).
  { const seen = new Map<string, number>(), flagged = new Set(out.map(f => `${f.chapter}.${f.section}.${f.paragraph}:${f.sentence}`));
    for (const c of chapters) { if (c.source === "deterministic" || c.keys?.length) continue;
      c.sections.forEach((s, si) => s.paragraphs.forEach((p, pi) => { for (const raw of splitSentences(p)) {
        const sen = stripMarks(raw), norm = sen.replace(/[^가-힣]/g, ""); let hit = "";
        for (let i = 0; i + PHRASE_WINDOW <= norm.length; i++) { const w = norm.slice(i, i + PHRASE_WINDOW), was = seen.get(w); if (was !== undefined && was !== c.n) { hit = w; break; } }
        if (hit && !flagged.has(`${c.n}.${si}.${pi}:${sen}`)) out.push({ chapter: c.n, section: si, paragraph: pi, rule: "phrase_repeat", sentence: sen, hint: HINT.phrase_repeat, detail: hit });
        for (let i = 0; i + PHRASE_WINDOW <= norm.length; i++) { const w = norm.slice(i, i + PHRASE_WINDOW); if (!seen.has(w)) seen.set(w, c.n); }
      } }));
    } }
  // AM 1-1 ②·1-4: 문체 검사(수리로만 보낸다). 이미 깃발이 있는 문장은 다시 걸지 않는다.
  { const flagged = new Set(out.map(f => `${f.chapter}.${f.section}.${f.paragraph}:${f.sentence}`));
    for (const f of styleFlags(chapters)) if (!flagged.has(`${f.chapter}.${f.section}.${f.paragraph}:${f.sentence}`)) { flagged.add(`${f.chapter}.${f.section}.${f.paragraph}:${f.sentence}`); out.push({ ...f, hint: STYLE_HINT[f.rule] }); } }
  out.push(...lintCards(chapters, ctx));
  return out;
}
/** 같은 구절 창(공백·문장부호 뺀 한글 글자 수). */
export const PHRASE_WINDOW = 14;

/** 카드 줄(F1·F2, P6d D): 빠짐(살필 점 포함)·꼴·길이·같은 필드끼리 겹침(같은 천간 십성 key끼리는 더 엄격히)·문장 규칙. */
export const SAME_TEN_GOD_JACCARD = 0.3;
export function lintCards(chapters: readonly FinalChapter[], ctx: LintCtx): LintFlag[] {
  const out: LintFlag[] = [];
  const seen: Record<CardField, { v: string; tg?: string }[]> = { image: [], todo: [], review: [], caution: [], good: [] };
  for (const c of chapters) if (c.keys) c.sections.forEach((s, si) => {
    const period = ctx.periods?.[s.heading] ?? "current";
    const card: SectionCard = s.card ?? {};
    const tg = ctx.cardTenGod?.[s.heading];
    // 살필 점도 작가가 그 시기의 실제 십성·관계 조합으로 쓴다(P6d D): "없음"은 받지 않는다.
    // AM 2부 세운 신년판 달 카드: 「좋은 것」도 필수(한 줄·좋은 것·주의할 것·이달의 한 가지).
    const want: CardField[] = ["image", ...(ctx.goodCards ? ["good" as const] : []), period === "past" ? "review" : "todo", "caution"];
    const f = (field: CardField, rule: P6cRule, sentence: string) => out.push({ chapter: c.n, section: si, paragraph: -1, card: field, rule, sentence, hint: HINT[rule] });
    for (const field of want) if (!card[field]) f(field, "card_missing", "");
    if (period === "past" && card.todo && !card.review) f("review", "card_form", card.todo);
    for (const field of ["image", "good", "todo", "review", "caution"] as CardField[]) {
      const v = card[field]; if (!v) continue;
      if (field === "todo" && period === "past") continue;
      const len = v.length;
      if (field === "image" ? len < 10 || len > 34 : len < 8 || len > 60) { f(field, "card_length", v); continue; }
      if (field === "review" && !/\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (field === "todo" && /\?$/.test(v.trim())) { f(field, "card_form", v); continue; }
      if (sentenceRules(v, c.n, ctx, true) || sentenceViolation(v, ctx.facts)) { f(field, "card_rule", v); continue; }
      if (L.overlapping(seen[field].map(x => x.v), [v]).length || (tg && L.overlapping(seen[field].filter(x => x.tg === tg).map(x => x.v), [v], SAME_TEN_GOD_JACCARD).length)) { f(field, "card_overlap", v); continue; }
      seen[field].push({ v, ...(tg ? { tg } : {}) });
    }
  });
  return out;
}

/**
 * 수리 뒤에도 걸리는 문단(P6d B, 사용자 결정): 사실·금지 규칙(HARD_RULES)에 걸린 문단은 문단째 뺀다. 문장 하나만 지우면 조각 문장이 남는다.
 * 문체·반복 규칙(db_copy·scene_repeat 등)은 문단을 그대로 두고 기록만 한다. 문단이 다 빠진 소제목은 뺀다(반복 장 key는 비워 두고 부르는 쪽이 채운다).
 */
export function enforce(chapters: readonly FinalChapter[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; removed: number; droppedParagraphs: number; emptyKeys: readonly { chapter: number; key: string }[] } {
  let droppedParagraphs = 0;
  const bad = new Set(flags.filter(f => f.paragraph >= 0 && !f.card && HARD_RULES.has(f.rule)).map(f => `${f.chapter}.${f.section}.${f.paragraph}`));
  const emptyKeys: { chapter: number; key: string }[] = [];
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => {
    const ps = s.paragraphs.filter((_, pi) => !bad.has(`${c.n}.${si}.${pi}`));
    droppedParagraphs += s.paragraphs.length - ps.length;
    if (!ps.length && c.keys?.includes(s.heading)) emptyKeys.push({ chapter: c.n, key: s.heading });
    return { ...s, paragraphs: ps };
  }).filter(s => s.paragraphs.length || c.keys?.includes(s.heading)) }));
  return { chapters: out.map(c => ({ ...c, chars: c.sections.reduce((a, s) => a + s.paragraphs.join("").length, 0) })), removed: 0, droppedParagraphs, emptyKeys };
}

/**
 * P6e 6·15: 수리 뒤에도 남은 작가 안내·면책 문장(notice_repeat)은 책 한 줄 안내와 겹친다. 홀로 선 안내 문장만 뗀다
 * (문단에 다른 문장이 둘 이상 남고, 다음 문장이 앞말에 기대지 않을 때). 그렇지 않으면 그대로 두고 센다.
 */
export function dropNoticeSentences(chapters: readonly FinalChapter[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; removed: string[]; kept: string[] } {
  const removed: string[] = [], kept: string[] = [];
  const targets = new Set(flags.filter(f => f.rule === "notice_repeat").map(f => `${f.chapter}.${f.section}.${f.paragraph}|${f.sentence}`));
  const out = chapters.map(c => ({ ...c, sections: c.sections.map((s, si) => ({ ...s, paragraphs: s.paragraphs.map((p, pi) => {
    const sens = splitSentences(p);
    let keep = [...sens];
    for (const x of sens) {
      if (!targets.has(`${c.n}.${si}.${pi}|${stripMarks(x)}`)) continue;
      const i = keep.indexOf(x), next = keep[i + 1];
      // 최종 A-9: 다음 문장이 접속어로 시작하면 접속어만 떼고 지운다. 지시어(앞 내용을 가리킴)로 시작하면 그대로 둔다.
      if (keep.length - 1 >= 2 && !(next && E.orphanStart(next) && !stripConnective(next)) && !/[⟪⟫]/.test(x)) { removed.push(stripMarks(x)); keep = removeSentenceAt(keep, i).sentences; continue; }
      kept.push(stripMarks(x));
    }
    return keep.length === sens.length ? p : keep.join(" ");
  }) })) }));
  return { chapters: out, removed, kept };
}

/** 같은 소제목 수(이전·이후)를 맞춰 볼 때 쓰는 키. */
export const flagKey = (f: Pick<LintFlag, "chapter" | "section" | "paragraph" | "card">) => `${f.chapter}.${f.section}.${f.card ? `c:${f.card}` : f.paragraph}`;
export type { BookSection };
