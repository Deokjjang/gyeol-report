/** Static offline friendship research. No runtime registration or customer approval. */
import type { RepairStudy } from "./researchTypes";
export const FRIENDSHIP_REPAIR_STUDIES: readonly RepairStudy[] = [
  {
    "id": "frpr:repair:contact-delay",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "contact-delay",
    "frictionAddress": "CH07.P1",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "급한 연락인지 확인하지 않은 긴 메시지에 짧은 응답만 온 경우",
    "competingInterpretations": [
      "관심의 확인",
      "대화 종료의 뜻"
    ],
    "missingFact": "무슨 반응이 어느 시점까지 필요했는지",
    "firstQuestion": "지금도 답이 필요한 내용과 평소 근황을 나눠 말할 수 있을까?",
    "personAAction": "필요한 반응과 기한을 한 건으로 특정한다.",
    "personBAction": "현재 가능한 응답 시간과 급할 때의 연결 방식을 알린다.",
    "agreement": "급한 요청과 평소 근황의 채널을 나눠 시도한다.",
    "recheck": "다음 연락에서 필요한 정보가 전달됐는지 확인한다.",
    "counterexample": "기한 없는 대화에 매번 응답 계약을 요구할 필요는 없다.",
    "stopCondition": "응답을 강제하거나 감시하는 요구가 생기면 조정을 멈춘다.",
    "sourceRefs": [
      "frpr:source:hall",
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:plan-change",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "plan-change",
    "frictionAddress": "CH07.P1",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P2",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "약속한 만남을 바꿔야 하는 가상 상황",
    "competingInterpretations": [
      "불가피한 일정 변경",
      "상대를 가볍게 여김"
    ],
    "missingFact": "원래 합의·알린 시점·다시 가능한 날짜",
    "firstQuestion": "약속을 바꿔야 하는 이유와 상대에게 남은 부담을 각각 확인했는가?",
    "personAAction": "본인이 바꾼 약속과 알릴 수 있었던 시점을 확인한다.",
    "personBAction": "변경으로 생긴 실제 부담과 재약속 가능 범위를 말한다.",
    "agreement": "바뀔 가능성이 생길 때 알릴 방법과 재검토 시점을 정한다.",
    "recheck": "같은 무통보 변경이 반복되는지 실제 행동으로 확인한다.",
    "counterexample": "불가피한 변경 한 번을 인격이나 충성심 평가로 확대하지 않는다.",
    "stopCondition": "반복되는 일방 변경을 무조건 이해하도록 요구하지 않는다.",
    "sourceRefs": [
      "frpr:source:deci",
      "frpr:source:khullar"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:group-invite",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "group-invite",
    "frictionAddress": "CH07.P4",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P3"
    ],
    "hypotheticalTrigger": "제한된 모임에서 빠진 소식을 사진으로 본 가상 상황",
    "competingInterpretations": [
      "인원·활동 조건",
      "의도적 배제의 지각"
    ],
    "missingFact": "초대 조건과 실제로 합의한 약속 여부",
    "firstQuestion": "사진에서 확인한 사실과 추측한 뜻을 나눌 수 있을까?",
    "personAAction": "빠진 사실과 느낀 서운함을 구분한다.",
    "personBAction": "설명 가능한 조건과 둘만의 약속을 나눠 답한다.",
    "agreement": "모든 모임에 참여할 의무 없이 둘의 만남을 따로 고른다.",
    "recheck": "원했던 연결이 실제로 생겼는지 묻는다.",
    "counterexample": "반복된 모욕·차별이 확인됐다면 단순 오해로 축소할 수 없다.",
    "stopCondition": "친구의 다른 관계를 제한하거나 편들기를 강요하면 멈춘다.",
    "sourceRefs": [
      "frpr:source:krems",
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:secret-forwarding",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "secret-forwarding",
    "frictionAddress": "CH07.P4",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P2",
      "CH08.P3"
    ],
    "hypotheticalTrigger": "허락 범위 밖에 사적 이야기가 전달됐을 수 있는 상황",
    "competingInterpretations": [
      "친밀함을 보여 주려는 의도",
      "정보 통제권 침해"
    ],
    "missingFact": "무엇이 누구에게 실제 전달됐는지와 동의 범위",
    "firstQuestion": "당사자가 허락한 공개 범위와 실제 전달된 정보가 같은가?",
    "personAAction": "자신이 실제 전한 정보와 추가 정정이 필요한 범위를 확인한다.",
    "personBAction": "다시 공개할지와 앞으로 공유할 범위를 직접 정한다.",
    "agreement": "공유 전 재확인과 가능한 정정에만 동의하며 용서는 강요하지 않는다.",
    "recheck": "새 정보의 사용 범위가 실제 지켜졌는지 확인한다.",
    "counterexample": "긴급한 위해와 관련된 상황은 일반 비밀 유지 조율로만 처리하지 않는다.",
    "stopCondition": "정보 유출이 반복되거나 위해가 있으면 추가 공개·대면 회복을 권하지 않는다.",
    "sourceRefs": [
      "frpr:source:laurenceau",
      "frpr:source:lewicki",
      "frpr:source:khullar"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:public-joke",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "public-joke",
    "frictionAddress": "CH07.P4",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P2",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "단체 자리에서 개인 이야기를 농담 소재로 쓴 상황",
    "competingInterpretations": [
      "분위기를 풀려 함",
      "공개 평가나 모욕으로 받음"
    ],
    "missingFact": "실제 발언·공개 동의·중단 요청 여부",
    "firstQuestion": "웃은 반응이 동의였는지 불편함을 숨긴 것인지 물을 수 있을까?",
    "personAAction": "농담의 의도와 별개로 실제 발언과 중단 요청을 확인한다.",
    "personBAction": "원치 않는 소재와 이후 원하는 대응을 알린다.",
    "agreement": "당사자가 원치 않는 개인 소재를 빼고 멈추라는 요청을 존중한다.",
    "recheck": "다음 자리에서 소재와 중단 요청이 지켜지는지 확인한다.",
    "counterexample": "당사자가 즐겼다고 직접 확인한 농담을 자동으로 피해로 규정하지 않는다.",
    "stopCondition": "모욕·위협·강압을 성격이나 유머 차이로 정상화하지 않는다.",
    "sourceRefs": [
      "frpr:source:deci",
      "frpr:source:lewicki"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:advice-mode",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "advice-mode",
    "frictionAddress": "CH07.P3",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P2"
    ],
    "hypotheticalTrigger": "고민을 듣던 친구가 요청 전에 해결을 대신하려는 상황",
    "competingInterpretations": [
      "도움을 주려는 마음",
      "내 결정을 빼앗김"
    ],
    "missingFact": "듣기·대안·실무 도움 중 실제 요청",
    "firstQuestion": "지금은 듣는 것과 함께 해결하는 것 중 무엇을 원하는가?",
    "personAAction": "동의 없이 한 개입과 이후 멈출 범위를 확인한다.",
    "personBAction": "원하는 도움과 원치 않는 개입을 나눈다.",
    "agreement": "개입 전에 도움의 종류와 실행 동의를 묻는다.",
    "recheck": "다음 대화에서 요청한 종류의 도움을 받았는지 확인한다.",
    "counterexample": "해결책을 요청했다면 경청만 하는 것도 맞지 않을 수 있다.",
    "stopCondition": "거절을 무시하거나 사적 정보로 압박하면 일반 조율을 중단한다.",
    "sourceRefs": [
      "frpr:source:feeney",
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:favour-load",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "favour-load",
    "frictionAddress": "CH07.P3",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P3",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "모임 준비나 정서적 경청을 한 사람이 자주 맡는 가상 상황",
    "competingInterpretations": [
      "자발적 배려",
      "기대된 역할"
    ],
    "missingFact": "누가 요청·수락·약속했는지와 현재 가용 시간",
    "firstQuestion": "도움의 양과 상관없이 다음에도 그 몫을 맡기로 동의했는가?",
    "personAAction": "본인이 맡은 몫 중 다음에는 어려운 것을 알린다.",
    "personBAction": "상대의 거절을 듣고 자신이 할 수 있는 몫을 제안한다.",
    "agreement": "필요한 일만 줄이거나 다시 동의한 범위로 나눈다.",
    "recheck": "실제 부담이 줄고 거절이 가능한지 확인한다.",
    "counterexample": "시기별 가용 자원이 달라 같은 양의 보답이 공정함의 유일한 기준은 아니다.",
    "stopCondition": "한쪽만 계속 양보하거나 돌봄을 강요하면 유지 목표를 우선하지 않는다.",
    "sourceRefs": [
      "frpr:source:deci",
      "frpr:source:feeney"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:shared-cost",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "shared-cost",
    "frictionAddress": "CH07.P3",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "친구와 함께 쓰는 비용의 정산 기대가 다른 가상 상황",
    "competingInterpretations": [
      "먼저 낸 호의",
      "합의한 공동 비용"
    ],
    "missingFact": "거래 자체는 UNKNOWN이며 실제 동의·금액·기한 자료 필요",
    "firstQuestion": "선물인지 공동 비용인지 각자가 같은 조건에 동의했는가?",
    "personAAction": "본인이 이해한 비용의 성격과 합의 자료를 확인한다.",
    "personBAction": "본인이 수락한 범위와 현재 확인할 사항을 말한다.",
    "agreement": "궁합으로 채무나 정산 금액을 판정하지 않고 다음 공동 지출의 동의를 먼저 확인한다.",
    "recheck": "다음 지출에서 비용의 성격과 분담을 미리 알았는지 확인한다.",
    "counterexample": "경제적 부담이 다르면 같은 지출을 줄이거나 하지 않을 수 있다.",
    "stopCondition": "강요·착취·사기 의심은 성향 차이로 정상화하지 않으며 별도 적절한 지원이 필요하다.",
    "sourceRefs": [
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:achievement-comparison",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "achievement-comparison",
    "frictionAddress": "CH07.P3",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P2"
    ],
    "hypotheticalTrigger": "다른 친구의 성취를 기준으로 현재 선택을 평가하는 가상 상황",
    "competingInterpretations": [
      "자극을 주려 함",
      "부족하다는 평가로 받음"
    ],
    "missingFact": "비교 분석을 요청했는지와 당사자의 현재 목표",
    "firstQuestion": "그 비교를 누가 어떤 목적에서 원했는가?",
    "personAAction": "상대가 요청하지 않은 평가를 멈추고 원하는 반응을 묻는다.",
    "personBAction": "축하할 일과 원하지 않는 비교를 구분한다.",
    "agreement": "비교 자료는 요청한 맥락에 한정하고 목표는 각자 정한다.",
    "recheck": "이후 대화에서 타인의 기준 대신 당사자의 질문을 다루는지 확인한다.",
    "counterexample": "먼저 비교 정보를 요청한 경우까지 모두 평가라고 볼 수는 없다.",
    "stopCondition": "반복되는 비하를 응원 방식 차이로 설명하지 않는다.",
    "sourceRefs": [
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:cooling-interval",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "cooling-interval",
    "frictionAddress": "CH07.P1",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P3"
    ],
    "hypotheticalTrigger": "불편한 대화 뒤 답을 정리할 시간이 필요한 가상 상황",
    "competingInterpretations": [
      "정리할 시간이 필요함",
      "관계를 끊으려 함"
    ],
    "missingFact": "대화 재개 의사와 안전하게 연락 가능한지",
    "firstQuestion": "시간이 필요하다는 뜻과 다시 대화할 의사가 있는지는 각각 확인됐는가?",
    "personAAction": "반복 연락으로 답을 강제하지 않고 필요한 질문을 한 번 정리한다.",
    "personBAction": "답할 의사가 있다면 가능한 시점이나 범위를 알린다.",
    "agreement": "대화 재개에 양쪽 동의가 있을 때만 시간을 정한다.",
    "recheck": "재개 뒤 같은 질문에 답할 준비가 됐는지 확인한다.",
    "counterexample": "관계 종료 의사가 있다면 휴식 뒤 반드시 재개하는 단계로 만들지 않는다.",
    "stopCondition": "위험하거나 재접촉을 원하지 않는 경우 직접 화해를 권하지 않는다.",
    "sourceRefs": [
      "frpr:source:khullar",
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:life-change",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "life-change",
    "frictionAddress": "CH07.P1",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "가상의 이사·새 일정으로 예전 만남 빈도가 어려워진 상황",
    "competingInterpretations": [
      "가용 시간 감소",
      "관심 감소로 받음"
    ],
    "missingFact": "생활 변화와 실제 원하는 연락 방식",
    "firstQuestion": "예전 빈도를 지키기 어려운 이유와 지금 가능한 범위를 나눴는가?",
    "personAAction": "예전 기준 대신 현재 원하는 연결을 제안한다.",
    "personBAction": "현재 가능한 시간·채널·활동을 답한다.",
    "agreement": "관계 형태를 당사자 의사에 맞춰 줄이거나 바꾼다.",
    "recheck": "새 방식이 실제 가능한지 다시 묻는다.",
    "counterexample": "현재 관계 유지 의사가 없으면 새 만남을 반드시 찾을 의무는 없다.",
    "stopCondition": "일방적 희생을 반복해야만 유지된다면 거리를 둘 선택을 남긴다.",
    "sourceRefs": [
      "frpr:source:khullar",
      "frpr:source:hall"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:repeated-harm",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "repeated-harm",
    "frictionAddress": "CH07.P4",
    "repairAddresses": [
      "CH08.P3",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "명확한 거절 뒤에도 모욕·통제·정보 유출이 반복되는 가상 상황",
    "competingInterpretations": [
      "다툼을 풀고 싶음",
      "접촉이 더 위험함"
    ],
    "missingFact": "안전·의사·확인된 반복 행동",
    "firstQuestion": "현재 관계 조율보다 안전과 거리를 확보할 필요가 있는가?",
    "personAAction": "직접 만남이나 용서를 요구하지 않는다.",
    "personBAction": "접촉·공개·만남 범위를 본인 안전과 의사로 정한다.",
    "agreement": "공동 유지 약속을 필수 목표로 삼지 않는다.",
    "recheck": "친밀감보다 안전과 원치 않는 접촉 감소를 확인한다.",
    "counterexample": "단순 선호 차이만으로 위해나 병리로 진단하지 않는다.",
    "stopCondition": "위험·강압이 의심되면 일반 궁합 해석의 한계를 밝히고 적절한 별도 지원을 확인한다.",
    "sourceRefs": [
      "frpr:source:khullar",
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  },
  {
    "id": "frpr:repair:relation-symbol",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "key": "relation-symbol",
    "frictionAddress": "CH07.P2",
    "repairAddresses": [
      "CH08.P1",
      "CH08.P4"
    ],
    "hypotheticalTrigger": "검출된 충·해 또는 미검출을 친구 사이의 잘못으로 설명하려는 가상 상황",
    "competingInterpretations": [
      "기호의 전통 해석",
      "실제 확인된 행동의 문제"
    ],
    "missingFact": "지원 kind·양쪽 refs·원천 검토 상태와 별도의 실제 불편",
    "firstQuestion": "실제 문제로 확인한 행동이 있는가, 아니면 기호에서 사건을 추정했는가?",
    "personAAction": "계산 설명과 상대의 실제 행동에 대한 주장을 분리한다.",
    "personBAction": "본인이 직접 겪었다고 확인한 범위와 추측을 나눈다.",
    "agreement": "실제 문제가 확인된 경우에만 그 행동의 조정 기준을 정하며 기호를 바꾸지 않는다.",
    "recheck": "달라진 행동을 확인하며 충이나 합이 사라졌다는 새 계산을 만들지 않는다.",
    "counterexample": "실제 불편이 없으면 사과나 화해 절차를 새로 만들지 않는다.",
    "stopCondition": "기호로 상대를 낙인찍거나 위험한 행동을 정당화하면 일반 조율을 멈춘다.",
    "sourceRefs": [
      "frpr:source:deci"
    ],
    "assumesActualConflict": false,
    "requiresForgiveness": false
  }
];
