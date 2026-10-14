import type { GrammarStudy } from "./researchTypes";

/** Offline research only; not imported by runtime or existing barrels. */
export const KOREAN_GRAMMAR_RESEARCH: readonly GrammarStudy[] = [
  {
    "id": "ker:grammar:subject",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "subject",
    "rule": "받침이 확인된 명사구에는 이, 받침 없는 명사구에는 가를 검토한다",
    "contextRequired": "명사구의 실제 읽기와 끝소리",
    "correct": "예린이 질문합니다.",
    "incorrect": "예린가 질문합니다.",
    "exception": "이름 뒤 님을 붙였다면 님의 받침이 기준",
    "slotRequirement": "noun_phrase + known phonology",
    "sourceRefs": [
      "ker:source:particles"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:topic",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "topic",
    "rule": "받침이 있으면 은, 없으면 는을 검토한다",
    "contextRequired": "현재 화제와 대조 대상",
    "correct": "지우는 기준을 묻습니다.",
    "incorrect": "지우은 기준을 묻습니다.",
    "exception": "은/는이 주격 이/가와 항상 같은 뜻은 아님",
    "slotRequirement": "topic role, not subject slot only",
    "sourceRefs": [
      "ker:source:particles"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:object",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "object",
    "rule": "목적어 역할인 명사구의 끝소리에 맞춰 을/를을 고른다",
    "contextRequired": "행동의 목적어와 명사구 경계",
    "correct": "목소리를 내 것으로 만듭니다.",
    "incorrect": "목소리을 내 것으로 만듭니다.",
    "exception": "긴 명사구 내부 마지막 글자 아닌 실제 head 읽기 확인",
    "slotRequirement": "object noun slot",
    "sourceRefs": [
      "ker:source:particles"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:with",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "with",
    "rule": "받침 있는 명사에는 과, 없는 명사에는 와를 검토한다",
    "contextRequired": "병렬/동반/비교의 의미 구분",
    "correct": "기준과 이유를 살펴봅니다.",
    "incorrect": "기준와 이유를 살펴봅니다.",
    "exception": "과/와는 양쪽이 같은 자격인지 의미도 확인",
    "slotRequirement": "coordination/with slot",
    "sourceRefs": [
      "ker:source:with"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:to-rieul",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "to-rieul",
    "rule": "으로/로는 받침이 없거나 ㄹ이면 로, 그 밖의 받침이면 으로를 검토한다",
    "contextRequired": "방향/수단/변화 의미와 실제 발음",
    "correct": "새 길로 갑니다. 제안으로 이어집니다.",
    "incorrect": "길으로 갑니다. 제안로 이어집니다.",
    "exception": "ㄹ 받침 예외; 임의의 이중 조사 문자열 결합 금지",
    "slotRequirement": "direction/instrument slot + rieul state",
    "sourceRefs": [
      "ker:source:euro"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:name",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "name",
    "rule": "인물명은 하나의 literal 슬롯으로 보존한다",
    "contextRequired": "검증된 표시 이름과 소유자",
    "correct": "MBTI가 보여주는 우리 / 예린이 중요하게 여기는 것",
    "incorrect": "M예린TI가 보여주는 우리",
    "exception": "이름 안 토큰·$&·영문 A/B를 재치환하지 않음",
    "slotRequirement": "literal person slot, no global role substitution",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:honorific-nim",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "honorific-nim",
    "rule": "님을 호칭으로 붙이면 뒤 조사는 님의 읽기를 기준으로 한다",
    "contextRequired": "대상 이름과 호칭 정책",
    "correct": "Alex님이 의견을 말합니다.",
    "incorrect": "Alex님가 의견을 말합니다.",
    "exception": "문장 전체 높임 수준은 님 하나로 결정되지 않음",
    "slotRequirement": "honorific name slot",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:foreign",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "foreign",
    "rule": "영문·약어의 발음이 확인되지 않으면 받침을 추정하지 않는다",
    "contextRequired": "확인된 발음 또는 안전한 구조",
    "correct": "API 설명: 필요한 입력을 확인합니다.",
    "incorrect": "API은 반드시 이렇게 읽습니다.",
    "exception": "국가·사용자별 다른 읽기를 한 가지로 고정하지 않음",
    "slotRequirement": "unknown pronunciation → particle_free/honorific_nim",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:mbti",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "mbti",
    "rule": "MBTI/유형 문자열은 변경 불가 label이다",
    "contextRequired": "실제 입력 유형·원천 및 미상 상태",
    "correct": "INTJ 유형의 선호를 설명합니다.",
    "incorrect": "MBTI의 B를 인물 B 이름으로 바꿉니다.",
    "exception": "유형 라벨의 존재가 개인 행동 확정 근거는 아님",
    "slotRequirement": "literal technical label + source guard",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:hanja",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "hanja",
    "rule": "한자 용어는 확인된 읽기·뜻과 표기를 분리한다",
    "contextRequired": "원천에서 확인한 한국어 읽기",
    "correct": "일간 표기 ‘庚’: 타고난 기준을 설명할 때 사용하는 표지입니다.",
    "incorrect": "庚가 언제나 성공을 보장합니다.",
    "exception": "읽기 미확인 한자를 코드포인트로 조사 추정 금지",
    "slotRequirement": "term label + verified reading or colon form",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:number",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "number",
    "rule": "숫자의 조사에는 수 읽기·단위·번호 여부가 필요하다",
    "contextRequired": "삼/세/셋, 기수/서수, 단위",
    "correct": "3개를 고릅니다. / 항목 수: 3",
    "incorrect": "모든 3 뒤에는 무조건 이가 붙습니다.",
    "exception": "끝자리 한자수 표는 고유어·단위 생략 맥락까지 해결하지 않음",
    "slotRequirement": "number + readingMode + unit",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:unit",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "unit",
    "rule": "숫자 뒤 단위가 있으면 단위 명사구의 읽기와 수량 뜻을 보존한다",
    "contextRequired": "개/명/년/월/시와 실제 기간",
    "correct": "12개월의 전체 구간을 봅니다.",
    "incorrect": "12개월은 항상 12개 월주와 같습니다.",
    "exception": "문법이 맞아도 계산 기간 뜻은 다를 수 있음",
    "slotRequirement": "quantity/unit separated from period evidence",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:quotes",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "quotes",
    "rule": "인용부호를 발음의 받침으로 보지 않는다",
    "contextRequired": "인용 범위·명사구의 끝소리",
    "correct": "‘대화’가 새 질문입니다.",
    "incorrect": "‘대화’이 새 질문입니다.",
    "exception": "직접 대화와 강조 인용의 부호 용도 구분; 마침표를 무조건 삭제하지 않음",
    "slotRequirement": "quoted noun phrase has explicit phonology",
    "sourceRefs": [
      "ker:source:quotes"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:parentheses",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "parentheses",
    "rule": "괄호 설명과 실제 읽을 명사구의 head를 구분한다",
    "contextRequired": "괄호 내용을 읽는지·주된 명사구",
    "correct": "검토 기준(예시): 두 항목을 확인합니다.",
    "incorrect": "기준(예시)은/는을 마지막 시 글자만 보고 확정합니다.",
    "exception": "외곽 기호를 벗기는 것만으로 head 판별 불가",
    "slotRequirement": "parenthetical literal + explicit head",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:agreement",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "agreement",
    "rule": "명사구가 어떤 행동·상태의 주체인지 보존한다",
    "contextRequired": "주어·서술어의 의미 호응",
    "correct": "A가 기준을 설명하면 B는 범위를 확인할 수 있습니다.",
    "incorrect": "A의 기준이 B가 설명합니다.",
    "exception": "생략된 주어가 바뀌는 접속은 별도 검토",
    "slotRequirement": "subject owner + predicate subjectOwner",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:direction",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "direction",
    "rule": "A→B의 행동 주체와 수신자는 B→A에서 다시 정의한다",
    "contextRequired": "actual directionId and recipient",
    "correct": "A의 제안이 B에게 닿는 조건을 봅니다.",
    "incorrect": "A의 행동이므로 B도 같은 의도입니다.",
    "exception": "받는 사람의 경험은 방향 fact만으로 확정하지 않음",
    "slotRequirement": "explicit subject/target pair",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:tense",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "tense",
    "rule": "과거·현재·미래의 실제 시각과 경험의 확인 상태를 나눈다",
    "contextRequired": "reading instant·actual period·event confirmation",
    "correct": "그 시기에 그런 일이 있었다면 돌아볼 수 있습니다.",
    "incorrect": "그해 당신은 이미 큰 계약을 맺었습니다.",
    "exception": "과거 시기 근거가 과거 사건을 증명하지 않음",
    "slotRequirement": "past_conditional / future_conditional",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:condition",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "condition",
    "rule": "조건절의 자격이 결과절까지 유지되어야 한다",
    "contextRequired": "if/when 조건·조건 범위",
    "correct": "그 활동을 한다면, 맡을 범위를 먼저 확인할 수 있습니다.",
    "incorrect": "그 활동을 한다면 좋습니다. 당신은 이미 그 일을 합니다.",
    "exception": "문단이 나뉘어도 필요한 조건을 날리지 않음",
    "slotRequirement": "condition scope spans all licensed predicates",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:negation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "negation",
    "rule": "아니다·않다·못하다의 부정 대상과 범위를 보존한다",
    "contextRequired": "금지/불가능/단순 부정의 차이",
    "correct": "연락이 적다고 관심이 없다는 뜻은 아닙니다.",
    "incorrect": "연락이 적으니 관심이 없습니다.",
    "exception": "반전이라고 부정을 반대 사실로 바꾸지 않음",
    "slotRequirement": "predicate polarity + negationScope",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:respect",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "respect",
    "rule": "높임의 대상과 행동 주체를 분리한다",
    "contextRequired": "독자/제삼자/상대·화자 높임 정책",
    "correct": "예린님이 고른 기준을 살펴봅니다.",
    "incorrect": "예린님의 기준이 말씀하십니다.",
    "exception": "사물에 무조건 시·말씀을 붙이지 않음",
    "slotRequirement": "honorificTarget separate from literal noun",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:copula",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "copula",
    "rule": "이에요/예요와 위치 조사 에+요는 문맥이 다르다",
    "contextRequired": "이다 서술/위치 대답/발음",
    "correct": "기준이에요. 기회예요. 여기에요(여기에 두라는 뜻).",
    "incorrect": "기준예요. 기회이에요.",
    "exception": "여기에요를 문맥 없이 모두 오류로 치지 않음",
    "slotRequirement": "copula predicate versus place phrase",
    "sourceRefs": [
      "ker:source:copula"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:endings",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "endings",
    "rule": "종결 어미의 화법 변화는 시제·부정·확정성을 바꾸지 않는다",
    "contextRequired": "검토된 용언 활용과 문체",
    "correct": "살펴봅니다. / 살펴봐요.",
    "incorrect": "살펴볼 수 있습니다. / 확실히 그렇습니다.",
    "exception": "해요체 전환을 모든 문자열 접미사에 적용 금지",
    "slotRequirement": "reviewed lemma-to-surface entry",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:connecting",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "connecting",
    "rule": "그래서·하지만·한편은 다른 논리 관계를 표시한다",
    "contextRequired": "인과/대조/병렬 관계의 실제 근거",
    "correct": "개인 성향을 봤다면, 이번에는 해당 구간의 조건을 살펴봅니다.",
    "incorrect": "조용한 사람이므로 다음 달 재물이 늘어납니다.",
    "exception": "접속어가 계산에 없는 인과를 만들 수 있음",
    "slotRequirement": "typed logical relation",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:irregular",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "irregular",
    "rule": "불규칙 활용은 어간 글자 치환이 아니라 검토된 어휘별 자료가 필요하다",
    "contextRequired": "lemma·품사·문맥·활용표",
    "correct": "듣다→들어요, 걷다→걸어요, 벗다→벗어요",
    "incorrect": "듣어요, 걷어요, 버어요",
    "exception": "ㄷ/ㅅ 어간을 모두 같은 규칙으로 처리하지 않음; 예시는 후속 사전 교감 필요",
    "slotRequirement": "reviewed inflection lexicon, unresolved→retain",
    "sourceRefs": [
      "ker:source:editorial"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:modifier",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "modifier",
    "rule": "명사구에 든 수식과 문장 틀의 수식을 구분한다",
    "contextRequired": "head noun·기존 수식의 기능",
    "correct": "오래 남길 내 몫을 살펴봅니다.",
    "incorrect": "반복해서 남길 오래 남길 내 몫",
    "exception": "동일 기능의 관형어를 사후 문자열 삭제로만 고치지 않음",
    "slotRequirement": "noun phrase with modifier functions",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:punctuation",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "punctuation",
    "rule": "문장 부호와 수·URL·버전의 기호를 구분한다",
    "contextRequired": "token kind and quoted-sentence boundary",
    "correct": "버전 3.14를 확인합니다.",
    "incorrect": "버전 3. 14를 확인합니다.",
    "exception": "소수점·약어·URL에 문장 공백 규칙 자동 적용 금지",
    "slotRequirement": "protected literal span + sentence boundary",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:unknown",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "unknown",
    "rule": "미상 입력은 문법적으로 그럴듯한 구체 정보로 채우지 않는다",
    "contextRequired": "unknown birthTime/MBTI/job/relation",
    "correct": "유형이 알려지지 않았다면, 직접 편한 방식을 물어볼 수 있습니다.",
    "incorrect": "유형 미상이므로 외향형입니다.",
    "exception": "모른다는 사실을 반대 성향/기본 enum으로 바꾸지 않음",
    "slotRequirement": "unknown tagged slot; no fabricated person fact",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  },
  {
    "id": "ker:grammar:time-boundary",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "topic": "time-boundary",
    "rule": "절입·교운 설명은 [start,end)와 확정/범위를 보존한다",
    "contextRequired": "canonical instant·range·effective pillar",
    "correct": "전환 정각부터 새 구간이며, 그 전까지는 이전 조건입니다.",
    "incorrect": "그 달 전체가 새 대운입니다.",
    "exception": "교운 범위는 확정 시각으로 번역하지 않음",
    "slotRequirement": "period window + certainty + original IDs",
    "sourceRefs": [
      "ker:source:runtime"
    ],
    "automationStatus": "contract_only",
    "linguisticCompleteness": "bounded_examples_not_complete_grammar"
  }
];
