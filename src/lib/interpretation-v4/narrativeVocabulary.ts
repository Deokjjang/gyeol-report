import type { InterpretationContext, SemanticAxis } from "./semanticCore";

/** Suggestions for an adapter, NOT a global replace dictionary. Inflection stays in source phrases. */
export const EASY_KOREAN_DICTIONARY: Readonly<Record<string, readonly string[]>> = {
  발현: ["나타남", "드러남"], 양상: ["모습"], 상호작용: ["서로 만나면", "같이 있을 때"], "경향성이 있습니다": ["한 편입니다"],
  "사회적 지위": ["높은 직책", "인정"], "재정적 성취": ["돈", "재물", "실제 수입"], "내적 성찰": ["혼자 깊게 생각함"],
  대인관계: ["사람 관계"], 의사결정: ["결정"], "현실적 성과": ["실제 결과"], 자원: ["돈", "시간", "사람"],
  자기효능감: ["나도 할 수 있다는 자신감"], "장기적 관점": ["멀리 보고 생각함"], "정서적 교감": ["마음을 나누는 것"],
  유의미한: ["중요한", "실제 의미 있는"], 극대화: ["더 크게 쓰다", "높이다"], 최적화: ["더 잘 맞게 고치다"],
  지속가능: ["오래 유지할 수 있는"], 맥락: ["상황"], 인지: ["알아차림", "생각"], 추론: ["이유를 따져봄"],
  내재화: ["자기 것으로 만듦"], 외현화: ["밖으로 꺼냄", "보여줌"], 구체화: ["실제로 만들기", "자세히 정하기"],
  조율: ["맞추기"], 완충: ["부드럽게 풀기"], 해소: ["풀기"], 표출: ["드러냄", "표현"], 축적: ["쌓음"],
  가시성: ["눈에 보이는 정도", "사람 눈에 띄는 정도"], 리스크: ["위험", "조심할 점"], 보상: ["돈", "대가", "결과"],
  전략적: ["계획을 세워", "다음을 생각해"], 다각도: ["여러 방향에서"], 복합적: ["여러 특징이 함께 있는"],
  효율: ["들인 시간에 비해 얻는 결과"], 효용: ["실제로 쓸모 있는 정도"], 생산성: ["같은 시간에 해내는 일"],
  역량: ["실력"], 전문역량: ["그 일을 잘하는 실력"], 성취: ["해낸 것"], 성과: ["해낸 결과"],
  동기: ["하고 싶은 이유"], 내적동기: ["스스로 하고 싶은 마음"], 외적동기: ["칭찬이나 보상을 바라는 마음"],
  지향: ["바라는 쪽"], 추구: ["얻고 싶어 함"], 지각: ["알아차림"], 통찰: ["중요한 것을 알아보는 눈"],
  분석: ["나누어 살펴보기"], 종합: ["함께 놓고 보기"], 분별: ["다른 점을 가려냄"], 판단기준: ["결정할 때 보는 것"],
  우선순위: ["먼저 할 일"], 체계: ["정해 둔 순서와 방법"], 체계화: ["순서와 방법을 정리함"],
  경직성: ["쉽게 바꾸지 못함"], 유연성: ["상황에 맞게 바꿈"], 적응력: ["달라진 상황에 맞추는 능력"],
  자율성: ["스스로 정할 수 있음"], 독립성: ["남에게 기대지 않고 직접 정함"], 주도성: ["먼저 나서서 시작함"],
  주체성: ["내 생각으로 고름"], 책임소재: ["누가 맡는 일인지"], 권한: ["직접 결정할 수 있는 범위"],
  위임: ["다른 사람에게 맡김"], 통제: ["내가 정한 대로 움직이게 함"], 관리: ["빠진 것이 없게 챙김"],
  합리적: ["이유를 따져서"], 직관적: ["바로 느낌이 오는"], 객관적: ["내 기분과 나누어 보는"],
  주관적: ["내 생각으로 보는"], 정서: ["마음", "감정"], 감수성: ["작은 느낌을 알아차리는 성향"],
  공감: ["상대의 마음을 알아줌"], 친밀감: ["가깝고 편한 느낌"], 유대감: ["서로 이어져 있다는 느낌"],
  신뢰: ["믿음"], 상호존중: ["서로의 생각을 소중하게 여김"], 상호보완: ["서로 부족한 부분을 채움"],
  갈등: ["생각이 달라 부딪침"], 마찰: ["작게 부딪치는 일"], 회피: ["피함"], 수용: ["받아들임"],
  회복탄력성: ["어려운 일을 겪은 뒤 다시 일어나는 능력"], 소진: ["기운을 다 씀"], 과부하: ["감당할 일이 너무 많음"],
  몰입: ["다른 생각을 잊고 깊게 빠짐"], 집중력: ["한 가지에 마음을 모으는 능력"], 탐구: ["궁금한 것을 깊게 알아봄"],
  검증: ["맞는지 확인함"], 검토: ["다시 살펴봄"], 수정: ["고침"], 개선: ["더 낫게 고침"],
  피드백: ["해본 뒤 들은 의견"], 소통: ["서로 말하고 들음"], 협업: ["같이 일함"], 협상: ["조건을 맞춰 이야기함"],
  관계망: ["알고 지내는 사람들"], 네트워크: ["연결된 사람들"], 평판: ["사람들이 나를 보는 말"],
  존재감: ["함께 있을 때 눈에 들어오는 정도"], 권위: ["사람들이 판단을 믿고 따르는 것"],
  안정성: ["크게 흔들리지 않음"], 일관성: ["기준이 쉽게 바뀌지 않음"], 지속성: ["오래 이어감"],
  잠재력: ["앞으로 더 잘할 수 있는 능력"], 성장성: ["더 커질 여지"], 확장성: ["더 넓힐 수 있는 정도"],
  실행력: ["생각을 실제 행동으로 옮기는 능력"], 추진력: ["시작한 일을 밀고 나가는 능력"],
  결단력: ["필요할 때 결정을 내리는 능력"], 경쟁력: ["남들과 겨뤄도 잘하는 부분"],
  차별성: ["다른 사람과 다른 점"], 특수성: ["이 경우에만 있는 점"], 보편성: ["여러 사람에게 공통된 점"],
  실용성: ["실제로 쓸 수 있음"], 현실감각: ["지금 가능한 일을 알아보는 눈"], 경제성: ["쓴 것에 비해 남는 정도"],
  수익성: ["돈이 얼마나 남는지"], 기회비용: ["하나를 고르며 포기하는 것"], 불확실성: ["아직 알 수 없는 부분"],
  예측가능성: ["다음 일을 미리 가늠할 수 있는 정도"], 충동성: ["생각보다 행동이 먼저 나감"],
  자제력: ["하고 싶은 것을 잠시 멈추는 능력"], 완벽주의: ["충분히 잘해도 고칠 곳부터 봄"],
  자기검열: ["말하거나 행동하기 전에 스스로 너무 많이 따짐"], 성찰: ["내가 한 일을 돌아봄"],
};
export const FORBIDDEN_ABSTRACT_PHRASES = ["발현됩니다", "발현될 수 있습니다", "양상을 보입니다", "상호작용을 통해", "복합적으로 작용하여", "적인 측면에서", "에 있어", "로 해석될 수 있습니다", "로 해석될 여지가 있습니다", "가능성이 존재합니다", "경향성이 관찰됩니다", "사회적 지위", "역할과 이름", "재정적 성취", "내적 성찰", "자신의 결을 잘 활용", "좋은 흐름", "사회적 자리"] as const;
export const TRACKED_NARRATIVE_WORDS = ["힘", "결", "흐름", "자리", "판", "몫", "방향", "가능성"] as const;
type VocabularyTheme = SemanticAxis | "HELPER_LUCK" | "EXPERTISE";
type VocabularyContext = InterpretationContext | "fortune" | "public";
export const CUSTOMER_VOCABULARY: Partial<Record<VocabularyTheme, Partial<Record<VocabularyContext, readonly string[]>>>> = {
  STATUS_DRIVE: { identity: ["인정받는 것"], work: ["높은 직책", "승진", "리더 자리"], fortune: ["명예"] },
  RESOURCE_SENSE: { identity: ["돈과 시간이 얼마나 남는지"], money: ["돈", "수입", "재물"], work: ["시간에 비해 실제로 남는 결과"] },
  LEADERSHIP: { identity: ["리더십", "앞에서 이끄는 성향"], work: ["방향을 정하는 것", "결정을 맡는 것"] },
  CHARISMA: { social: ["존재감"], love: ["매력"], public: ["사람 눈에 띄는 정도"] },
  HELPER_LUCK: { identity: ["사람복"], social: ["도와주는 사람", "좋은 인연"] },
  PRECISION: { identity: ["작은 오류를 보는 눈", "고칠 부분을 먼저 보는 성향"], work: ["정확성"] },
  DEPTH: { identity: ["깊게 생각함", "이유를 끝까지 확인함"] },
  AUTONOMY: { identity: ["직접 고르고 싶은 마음", "자기 기준", "독립적인 판단"] },
  PRACTICALITY: { identity: ["실제로 되는지", "결과가 남는지"] },
  MEANING: { identity: ["왜 하는지가 중요함", "의미가 있어야 오래 감"] },
  EXPERTISE: { work: ["전문성", "오래 배워 쌓은 실력"] },
};
export function customerVocabulary(theme: VocabularyTheme, context: VocabularyContext): readonly string[] {
  return CUSTOMER_VOCABULARY[theme]?.[context] ?? CUSTOMER_VOCABULARY[theme]?.identity ?? [];
}
export function easyKoreanSuggestions(text: string) {
  return Object.entries(EASY_KOREAN_DICTIONARY).filter(([word]) => text.includes(word)).map(([word, suggestions]) => ({ word, suggestions }));
}

/** Reviewed noun slots only. Unlike dictionary-wide replace, context and trailing
 * particle must match; verb endings, compound words and advice stay untouched. */
const EASY_NOUN_SLOTS: readonly { from: string; to: string; contexts: readonly InterpretationContext[] }[] = [
  { from: "의사결정", to: "결정", contexts: ["identity", "work", "money", "social", "love", "stress", "learning", "recovery"] },
  { from: "대인관계", to: "사람 관계", contexts: ["identity", "work", "social", "love"] },
  { from: "재정적 성취", to: "돈", contexts: ["money"] },
  { from: "사회적 지위", to: "높은 직책", contexts: ["work"] },
];
export function realizeEasyNounSlots(text: string, context: InterpretationContext): string {
  let result = text;
  for (const slot of EASY_NOUN_SLOTS.filter(s => s.contexts.includes(context))) {
    const pattern = new RegExp(`(^|\\s)${slot.from}(은|는|이|가|을|를|에서|도|만|와|과)(?=\\s|[.,?]|$)`, "g");
    result = result.replace(pattern, (_, leading: string, particle: string) => {
      const code = slot.to.charCodeAt(slot.to.length - 1);
      const final = (code - 0xac00) % 28 !== 0;
      const pair = [["은", "는"], ["이", "가"], ["을", "를"], ["과", "와"]].find(p => p.includes(particle));
      return leading + slot.to + (pair ? pair[final ? 0 : 1] : particle);
    });
  }
  return result;
}
