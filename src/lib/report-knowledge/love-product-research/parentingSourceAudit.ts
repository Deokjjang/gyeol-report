/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { ParentingAudit } from "./researchTypes";

export const LOVE_PARENTING_SOURCE_AUDIT: readonly ParentingAudit[] = [
  {
    "id": "lkr:parenting:INTJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "INTJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "c1ddca9869a8a6420e26aa89f61943faaddc8da54e66d9b5ccc1dd925424a334",
    "originalRiskHash": "70788628b8e1f6df089d63a42a09079dffec7f02345ba685bfd8d8df8bed771b",
    "strengthSources": [
      {
        "traitId": "teach_how_to_think",
        "sourceKey": "825fd4e9a742a121464b",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 선택한다면, 답을 알려주는 것보다 스스로 생각할 방법을 함께 찾는 데 마음을 쓸 수 있습니다.",
          "바로 정답을 고쳐주기보다 어떤 방법을 써봤는지 듣고 다음에 확인할 질문 하나를 남기면, 독립적인 판단을 연습할 자리가 생깁니다."
        ]
      },
      {
        "traitId": "independence_with_responsibility",
        "sourceKey": "1e8d35a08d19b366bdd8",
        "field": "positiveUse",
        "originalApplication": [
          "자립을 중요하게 여기는 태도는 해야 할 일을 작게 나누고 스스로 마무리하도록 돕는 데 쓰기 좋습니다.",
          "처음부터 전부 맡기기보다 해낼 수 있는 범위를 정하고 끝난 뒤 함께 돌아보면, 자유를 주는 일과 책임을 배우는 일이 이어집니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "teach_how_to_think",
      "sourceKey": "825fd4e9a742a121464b",
      "field": "risk",
      "originalApplication": [
        "스스로 생각하게 돕는 마음이 강해질수록, 아이가 아직 설명할 수 없는 감정까지 논리로 정리해야 한다고 기대할 수 있습니다.",
        "실수한 이유를 묻는 자리에서 답을 못한다는 사실을 노력 부족으로 보면, 생각하는 방법을 가르치려던 대화가 평가처럼 느껴질 수 있습니다.",
        "먼저 속상했던 마음을 받아주고 생각할 질문은 하나씩 나누면, 독립적인 판단을 돕는 힘에 아이가 따라올 시간이 생깁니다."
      ]
    },
    "allParentingTraits": [
      "teach_how_to_think",
      "independence_with_responsibility",
      "emotional_child_challenge",
      "knowledge_centered_support"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-intj-reasoning",
      "lkr:material:CH08.P4:parent-age-aware-question"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:INTP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "INTP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "1e9d0b4bd48b508dc51181864019df8c96ce18e39fba1e806d9fb41f0089b44b",
    "originalRiskHash": "9ee527f66777c9544147186cd77022d957ef8abae392b62c8351c6781cdeafe3",
    "strengthSources": [
      {
        "traitId": "open_patient_parent",
        "sourceKey": "96124cd17e5740ab238f",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 낯선 질문을 막기보다 스스로 탐색하도록 기다려주는 어른이 되고 싶을 수 있습니다.",
          "당장 쓸모를 설명하지 못하는 관심도 안전한 범위에서 해보게 두면, 어른의 답을 맞히는 일과 직접 알아가는 일이 구분됩니다."
        ]
      },
      {
        "traitId": "answering_child_questions",
        "sourceKey": "43161eed254c850e342b",
        "field": "positiveUse",
        "originalApplication": [
          "궁금한 것을 같이 살펴보는 태도는 모르는 일을 부끄러워하지 않고 물어볼 분위기를 만드는 장점이 됩니다.",
          "모르는 답은 함께 찾아보고 알아낸 것을 다시 설명해보게 하면, 질문이 끝없는 설명을 듣는 시간으로만 남지 않습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "open_patient_parent",
      "sourceKey": "96124cd17e5740ab238f",
      "field": "risk",
      "originalApplication": [
        "질문과 탐색을 자유롭게 두려는 마음이 크면, 반복되는 생활의 약속은 덜 중요한 일로 뒤로 갈 수 있습니다.",
        "그날의 관심만 따라 하루가 달라지면 쉬는 때와 해야 할 일을 아이가 예측하기 어려워, 자유롭게 시도할 기반도 흔들릴 수 있습니다.",
        "꼭 반복할 생활의 순서는 간단히 남기고 그 안의 탐색은 열어두면, 호기심과 예측 가능한 돌봄을 함께 마련하기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "open_patient_parent",
      "answering_child_questions",
      "parent_needs_alone_time"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-intp-patience",
      "lkr:material:CH08.P4:parent-care-sustainable"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ENTJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ENTJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "4a342e59ba72216011e5697f0a23b4f5dca7e5b4a8238430735a71b69aa92e10",
    "originalRiskHash": "5aec4cb788d10598bebcb1c0ab9cd24e5b35eb93e772dc6efdaa4c96a87127de",
    "strengthSources": [
      {
        "traitId": "serious_responsible_parent",
        "sourceKey": "41f807794a6c25d13e93",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 맡는다면, 필요한 준비와 생활의 기준을 진지하게 세우는 쪽에 힘을 쓸 수 있습니다.",
          "규칙을 알려줄 때 지켜야 할 이유와 어른도 지킬 몫을 함께 말하면, 분명한 기준이 일방적인 명령으로만 남지 않습니다."
        ]
      },
      {
        "traitId": "child_success_projection",
        "sourceKey": "46eb373ed8de497e1ba3",
        "field": "positiveUse",
        "originalApplication": [
          "성장 가능성을 높게 보고 도전할 기회를 마련하는 태도는 양육에서 활용할 수 있는 강점입니다.",
          "결과를 대신 정하기보다 해보고 싶은 목표를 먼저 듣고 필요한 연습을 함께 고르면, 높은 기대가 아이 자신의 도전을 돕는 방향으로 쓰입니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "serious_responsible_parent",
      "sourceKey": "41f807794a6c25d13e93",
      "field": "risk",
      "originalApplication": [
        "책임 있게 키우려는 의지가 강할수록, 아이가 아직 해내기 어려운 일을 기준에 못 미친 결과로 먼저 볼 수 있습니다.",
        "마음이 힘들어 멈춘 순간에도 노력이나 능력부터 따지면, 아이는 도움을 청하는 일이 다시 시험받는 일처럼 느껴질 수 있습니다.",
        "지금 가능한 단계와 감정을 먼저 듣고 다음 도전을 함께 고르면, 높은 기대를 포기하지 않고도 아이의 성장 속도에 맞출 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "serious_responsible_parent",
      "child_success_projection",
      "emotion_gap_parenting",
      "independence_test_parent"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-entj-responsibility",
      "lkr:material:CH08.P3:parent-high-expectation"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ENTP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ENTP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "53fb613bd033102c8dccd19cdc457150cc9407ec1f619a105b79f495430c559a",
    "originalRiskHash": "ba6c1f2f68e3481029815e3f96b372cfc382c4bc219577074f93c7312c77a262",
    "strengthSources": [
      {
        "traitId": "free_range_parenting",
        "sourceKey": "1ff3e720872ec12c58db",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 직접 해보고 배울 기회를 열어주려는 태도가 나타날 수 있습니다.",
          "위험을 미리 막을 부분과 직접 시도할 부분을 나누면, 모든 시행착오를 대신 없애지 않고도 탐색을 도울 수 있습니다."
        ]
      },
      {
        "traitId": "intellectual_parent",
        "sourceKey": "9e14ddceb99de8f8c245",
        "field": "positiveUse",
        "originalApplication": [
          "서로 다른 답을 이야기하는 즐거움은 질문하고 자기 생각을 말할 자리를 만드는 데 쓰기 좋습니다.",
          "어른이 논쟁에서 이기는 것보다 왜 그런 답을 골랐는지 듣는 데 시간을 쓰면, 대화가 사고를 연습하는 자리가 됩니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "free_range_parenting",
      "sourceKey": "1ff3e720872ec12c58db",
      "field": "risk",
      "originalApplication": [
        "직접 해보며 배울 기회를 주고 싶을수록, 일정하게 반복해야 할 규칙은 답답한 제한처럼 느껴질 수 있습니다.",
        "새로운 놀이와 질문은 많은데 정리와 쉬는 순서가 매번 달라지면, 아이가 자유를 쓰는 데 필요한 자기관리의 기반이 약해질 수 있습니다.",
        "안전과 생활의 기본 약속은 반복하고 방법은 고르게 두면, 경험을 넓히는 힘이 일관된 돌봄 안에서 살아나기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "free_range_parenting",
      "intellectual_parent",
      "traveling_parent",
      "debating_with_child"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-entp-experiment",
      "lkr:material:CH08.P3:parent-debate-as-listen"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:INFJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "INFJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "d57cada8a62b1519e3a5fa4277a81433b51a2540075e549022184a1598c91376",
    "originalRiskHash": "d73f02b625b11e6b01264e61a1c608a2f1f3a9e759a5a7f97616ad21e9e58706",
    "strengthSources": [
      {
        "traitId": "free_thinking_home",
        "sourceKey": "89f7385eacb614219d5c",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 선택한다면, 정해진 답을 따르기보다 스스로 궁금해하고 의견을 갖도록 돕고 싶을 수 있습니다.",
          "다른 생각에도 이유를 물으며 들어주면, 어른과 의견이 달라도 이야기할 수 있는 기반이 생깁니다."
        ]
      },
      {
        "traitId": "values_and_manners_parent",
        "sourceKey": "d617367bfe748e497cb9",
        "field": "positiveUse",
        "originalApplication": [
          "행동의 의미와 다른 사람에게 미치는 영향을 함께 살피는 태도는 예의와 가치 판단을 가르치는 데 쓰기 좋습니다.",
          "왜 그렇게 해야 하는지 작은 생활 장면으로 설명하면, 좋은 사람이어야 한다는 큰 요구보다 실제로 해볼 행동이 남습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "free_thinking_home",
      "sourceKey": "89f7385eacb614219d5c",
      "field": "risk",
      "originalApplication": [
        "생각을 넓혀주고 싶은 마음이 커지면, 아이가 자기 경험으로 받아들이기 전에 어른의 큰 의미를 먼저 설명할 수 있습니다.",
        "단순한 질문에 긴 가치관의 답이 돌아오면, 아이는 자기 궁금증보다 부모가 원하는 생각을 알아맞히는 데 힘을 쓸 수 있습니다.",
        "아이의 질문에 지금 필요한 만큼 답하고 직접 떠올린 이유를 들어보면, 통찰을 전하는 일과 아이의 생각이 자라는 일을 나누기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "free_thinking_home",
      "values_and_manners_parent",
      "expert_parent_model"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-infj-opinion"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:INFP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "INFP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "101bb671439c63a253c970df04aa612e066d2de2c02c585eca4b721a4220edba",
    "originalRiskHash": "12c73cd79645dfc06caa0aee683e7c1a20ad08523e5b09f28d578385bbde6a88",
    "strengthSources": [
      {
        "traitId": "autonomy_parent",
        "sourceKey": "10d4177606458102491b",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 남과 똑같이 해내는 것보다 자기 취향과 의견을 가질 권리를 지켜주고 싶을 수 있습니다.",
          "옷이나 놀이처럼 골라도 되는 일을 두 가지 정도로 열어두면, 존중한다는 마음이 직접 선택해보는 경험으로 옮겨갑니다."
        ]
      },
      {
        "traitId": "moral_parent",
        "sourceKey": "8340bca1aae1ff5a8c69",
        "field": "positiveUse",
        "originalApplication": [
          "공감과 정직을 중요하게 여기는 마음은 양육에서 다른 사람의 처지를 생각해볼 기회를 만드는 강점이 됩니다.",
          "누군가에게 피해를 준 상황이라면 나쁜 아이라고 규정하기보다 어떤 행동이 누구를 힘들게 했고 무엇을 되돌릴지 함께 짚는 편이 좋습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "autonomy_parent",
      "sourceKey": "10d4177606458102491b",
      "field": "risk",
      "originalApplication": [
        "개성을 지켜주려는 마음이 크면, 싫어하는 일을 반복하게 하는 규칙을 사랑과 반대되는 것으로 느끼기 쉽습니다.",
        "해야 할 일이 날마다 협상의 대상이 되면 아이도 무엇을 지켜야 하는지 알기 어려워, 자율적인 선택이 가능한 범위가 흐려질 수 있습니다.",
        "선택할 수 있는 부분과 함께 지킬 기본 약속을 나누면, 자기표현을 존중하면서도 일상의 책임을 배울 자리를 남길 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "autonomy_parent",
      "moral_parent",
      "soft_discipline_parent"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-infp-choice",
      "lkr:material:CH08.P4:parent-consent-respect"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ENFJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ENFJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "82f910c064e1d51619944eff96b47ac97ebf140d7afc7558c31df56ea06038de",
    "originalRiskHash": "fb9d096b7e88eb86ad91ecfbd647d0d60c5ff97ccaf79360850ae7524ef5cbfe",
    "strengthSources": [
      {
        "traitId": "free_but_guiding_parent",
        "sourceKey": "f35dd297210677e9198d",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 맡는다면, 자기 생각을 표현하도록 격려하면서 사람들과 지낼 기준도 알려주고 싶을 수 있습니다.",
          "모임에 참여할 방법을 함께 고르되 낯선 취향까지 틀렸다고 고치지 않으면, 자기표현과 배려를 함께 연습할 수 있습니다."
        ]
      },
      {
        "traitId": "emotional_anchor_parent",
        "sourceKey": "cb9ee7415c4e3089e7f9",
        "field": "positiveUse",
        "originalApplication": [
          "고민을 말할 때 곁에서 반응해주는 태도는 감정을 숨기지 않아도 되는 분위기를 만드는 데 쓰기 좋습니다.",
          "조언부터 길게 주기보다 지금은 들어주길 원하는지 물으면, 도움을 청할 때마다 해결 과제를 받아야 한다는 부담을 덜 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "free_but_guiding_parent",
      "sourceKey": "f35dd297210677e9198d",
      "field": "risk",
      "originalApplication": [
        "다른 사람을 잘 대하는 아이로 키우려는 마음이 강하면, 낯선 취향이나 조용한 반응까지 고쳐야 할 문제로 볼 수 있습니다.",
        "인사나 참여를 가르치는 자리에서도 아이가 불편한 이유를 듣지 않으면, 좋은 태도를 배우는 일이 자기 모습을 숨기는 연습이 될 수 있습니다.",
        "남에게 해를 주는 행동과 단지 다른 취향을 구분해 들으면, 예의를 알려주는 힘이 아이의 독특함도 지켜줄 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "free_but_guiding_parent",
      "emotional_anchor_parent",
      "travel_and_dialogue_parent"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-enfj-emotional-base"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ENFP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ENFP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "4ec3845b9f72255e310f94d18e9f68277e77de8ca9b65b9fb2800b7a8be1d019",
    "originalRiskHash": "9dd2d8e2a2b8173dda1e429834389bad89563fc6ee2650390173202b9579c53c",
    "strengthSources": [
      {
        "traitId": "understanding_parent",
        "sourceKey": "ea9519a12540624c4823",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 말과 표정에서 기분을 살피며 자기 생각을 편하게 꺼내도록 돕는 데 관심을 둘 수 있습니다.",
          "즐거웠던 일뿐 아니라 하기 싫었던 일도 들을 자리를 남기면, 밝은 반응만 보여야 사랑받는다는 부담을 줄이기 좋습니다."
        ]
      },
      {
        "traitId": "affectionate_support_parent",
        "sourceKey": "caa9d371cf4fbf58585d",
        "field": "positiveUse",
        "originalApplication": [
          "애정을 알아듣게 표현하고 시도를 응원하는 태도는 양육에서 활용할 수 있는 힘입니다.",
          "잘된 결과만 크게 반기기보다 용기 내어 시작한 부분도 구체적으로 알아주면, 다시 해보고 싶을 이유를 남길 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "understanding_parent",
      "sourceKey": "ea9519a12540624c4823",
      "field": "risk",
      "originalApplication": [
        "즐겁고 편하게 자라길 바라는 마음이 크면, 당장 지루해하는 반복을 중단시키는 쪽으로 도움을 줄 수 있습니다.",
        "하기 싫다는 표정만으로 기본 약속이 매번 바뀌면, 흥미가 없는 날에도 이어갈 작은 습관을 아이가 배울 기회가 줄어들 수 있습니다.",
        "감정은 받아주되 끝낼 작은 분량과 쉬는 때를 같이 정하면, 이해해주는 태도가 책임을 배우는 일과도 함께 갈 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "understanding_parent",
      "affectionate_support_parent",
      "travel_parent"
    ],
    "materialRefs": [
      "lkr:material:CH08.P1:parent-enfp-encouragement",
      "lkr:material:CH08.P3:parent-emotion-reading"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ISTJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ISTJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "af78fd1c96dae4e17f5142eb2617601af5a6dda89c41e2e03cd146bdda67ab26",
    "originalRiskHash": "a33dceaf96b1e758344702fada1fa8a3afe91a4d5b34530adea9e49098102f0a",
    "strengthSources": [
      {
        "traitId": "diligent_responsible_parent",
        "sourceKey": "63aa4d746575e86c7743",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 선택한다면, 필요한 준비를 꾸준히 하고 예측 가능한 생활을 마련하는 데 힘을 쓸 수 있습니다.",
          "매일 해야 할 순서를 간단히 보이게 두면, 어른이 그때마다 재촉하지 않아도 무엇부터 할지 알아갈 기반이 됩니다."
        ]
      },
      {
        "traitId": "practical_success_parenting",
        "sourceKey": "d34d165d4966692ca6cb",
        "field": "positiveUse",
        "originalApplication": [
          "현실적으로 필요한 준비를 차근히 돕는 태도는 먼 목표를 작은 연습으로 나누는 장점이 됩니다.",
          "진로의 답을 먼저 정하기보다 관심 있는 일을 해볼 준비와 비용을 함께 살피면, 책임감이 선택의 범위를 넓히는 데 쓰입니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "diligent_responsible_parent",
      "sourceKey": "63aa4d746575e86c7743",
      "field": "risk",
      "originalApplication": [
        "안정적인 미래를 마련해주고 싶은 마음이 크면, 당장 평가할 수 있는 공부와 준비가 다른 경험보다 앞설 수 있습니다.",
        "잘 놀았던 이야기나 친구 관계를 성적과 진로에 도움이 되는지로만 듣는다면, 아이의 하루 중 많은 부분이 중요하지 않은 이야기로 밀릴 수 있습니다.",
        "해야 할 준비와 별개로 아이가 즐긴 일도 진지하게 들어주면, 책임감 있는 돌봄이 마음을 나눌 자리까지 지킬 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "diligent_responsible_parent",
      "practical_success_parenting",
      "independent_child_conflict"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-istj-predictability",
      "lkr:material:CH08.P3:parent-results-only"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ISFJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ISFJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "1e79744e480a44423d52bea8efa79ea8d13e1168b2a2b692a5dd1083e2954995",
    "originalRiskHash": "883a18a821fe09f362eeeccfe0a65a040aad9d9cfc175db458c699fca20320cd",
    "strengthSources": [
      {
        "traitId": "structured_home_parent",
        "sourceKey": "f9709a2aaf92c814cb26",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 생활의 순서와 돌봄을 일정하게 이어가며 안심할 기반을 만들고 싶을 수 있습니다.",
          "쉬는 때와 해야 할 일을 짧게 알려두면, 어른의 기분에 따라 달라지는 지시보다 예측하기 쉬운 기준이 남습니다."
        ]
      },
      {
        "traitId": "protective_overinvolvement",
        "sourceKey": "3888aa2e5b9fb179e218",
        "field": "positiveUse",
        "originalApplication": [
          "위험을 미리 살피고 생활에 필요한 것을 준비하는 태도는 양육에서 활용할 수 있는 강점입니다.",
          "대신 결정할 위험한 일과 곁에서 지켜볼 작은 시도를 나누면, 보호하는 능력이 스스로 해볼 기회도 지켜줄 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "structured_home_parent",
      "sourceKey": "f9709a2aaf92c814cb26",
      "field": "risk",
      "originalApplication": [
        "예측 가능한 생활을 만들어주려는 마음이 강할수록, 계획에 없던 관심이나 다른 방법을 불안정한 신호로 볼 수 있습니다.",
        "스스로 해보겠다는 말을 평소 순서를 흐트러뜨리는 행동으로 먼저 받으면, 아이에게는 안전한 일상도 자기 선택이 어려운 틀로 느껴질 수 있습니다.",
        "안전을 지킬 범위는 남기되 작은 순서와 취향은 골라보게 하면, 안정감 안에서 아이의 개성을 알아갈 여유가 생깁니다."
      ]
    },
    "allParentingTraits": [
      "structured_home_parent",
      "protective_overinvolvement",
      "surface_empathy_parenting",
      "self_sacrificing_parent"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-isfj-security",
      "lkr:material:CH08.P3:parent-overprotection",
      "lkr:material:CH08.P3:parent-monopoly-fatigue"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ESTJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ESTJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "36cd78e43634cef267cbaf8f993c4bf451084006beaf6e95535cbe97e568216f",
    "originalRiskHash": "7e7e2eaace03c2bea06c6f381670dd00d63aad0a870d7bdbecc0037a094f1dab",
    "strengthSources": [
      {
        "traitId": "traditional_parenting",
        "sourceKey": "f5fb513fa5e97583225b",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 맡는다면, 예절과 책임을 생활 속에서 분명히 알려주려는 태도가 나타날 수 있습니다.",
          "함께 쓴 것을 정리하는 일처럼 책임을 행동으로 설명하면, 말을 잘 듣는지만 평가하지 않고 공동생활의 이유를 가르칠 수 있습니다."
        ]
      },
      {
        "traitId": "clear_rules_parent",
        "sourceKey": "d2987b5b1ad27d7ff7dc",
        "field": "positiveUse",
        "originalApplication": [
          "지킬 규칙을 명확하게 전하는 힘은 무엇을 기대하는지 알아보기 쉬운 환경을 만드는 장점입니다.",
          "규칙을 바꿀 때에도 이유를 미리 알리고 어른에게 적용할 약속을 남기면, 기준의 분명함이 공정함과 이어집니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "traditional_parenting",
      "sourceKey": "f5fb513fa5e97583225b",
      "field": "risk",
      "originalApplication": [
        "책임과 예절을 알려주려는 마음이 강하면, 오래 지켜온 방법이라는 이유로 지금도 같은 기준을 요구할 수 있습니다.",
        "달라진 환경에서 다른 방식을 시도하는 일을 버릇없음으로만 보면, 생활을 가르치려던 말이 아이의 설명을 막는 권위로 남을 수 있습니다.",
        "지켜야 할 책임과 시대에 따라 달라질 방법을 나누어 이야기하면, 분명한 기준을 유지하면서도 새로운 사정을 들을 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "traditional_parenting",
      "clear_rules_parent",
      "realistic_adult_expectation",
      "adolescent_flexibility_need"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-estj-rules-explained",
      "lkr:material:CH08.P4:parent-model-commitment"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ESFJ",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ESFJ",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "db00ff29a075613963ceef72469b1112d445ce28c2618996013beb4bec65b90c",
    "originalRiskHash": "303a6f5fa45b894fa49a122496063355c31d4e56966697474a9cf029a72d0418",
    "strengthSources": [
      {
        "traitId": "protective_parenting",
        "sourceKey": "59af620140e08fabfd3e",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 꾸준한 돌봄과 함께하는 일정을 통해 가족 안에서 편히 기대도록 돕고 싶을 수 있습니다.",
          "공동으로 할 일과 각자 고를 일을 구분하면, 소속감을 주는 생활 안에서도 자기 취향을 가질 자리가 남습니다."
        ]
      },
      {
        "traitId": "authority_obedience_pressure",
        "sourceKey": "175e245779bd56301359",
        "field": "positiveUse",
        "originalApplication": [
          "예절과 공동의 책임을 알려주려는 마음은 함께 지내는 사람을 배려하는 행동을 가르치는 데 쓰기 좋습니다.",
          "인사를 하지 않은 이유를 듣고 가능한 표현을 함께 고르면, 무조건 따르라는 요구보다 실제로 해볼 방법이 생깁니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "protective_parenting",
      "sourceKey": "59af620140e08fabfd3e",
      "field": "risk",
      "originalApplication": [
        "안전하게 지켜주려는 마음이 크면, 미리 알아보고 정해주는 일이 아이가 직접 고를 기회를 앞설 수 있습니다.",
        "친구나 활동의 작은 선택까지 걱정 때문에 대신하면, 보호받고 있어도 자기 판단을 믿어볼 경험은 줄어들 수 있습니다.",
        "실제 위험과 부모가 낯설게 느낀 부분을 나누고 안전한 선택부터 맡겨보면, 돌봄과 자립을 함께 지키기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "protective_parenting",
      "authority_obedience_pressure",
      "covering_child_mistakes",
      "harmony_home_pressure"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-esfj-belonging"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ISTP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ISTP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "59eea0b2be056c6d7801ef08c4a12bc2fd36baca467cbd3ba875c70813fc67dd",
    "originalRiskHash": "2b6e08bdb95545b8403ba65554247a73bf6dbb0c92b1c5c627b7deaf46c22888",
    "strengthSources": [
      {
        "traitId": "open_non_controlling_parent",
        "sourceKey": "63356dc69674fed27d17",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 선택한다면, 사소한 일까지 통제하기보다 직접 경험하고 판단할 자리를 주고 싶을 수 있습니다.",
          "안전하게 해볼 수 있는 범위와 도움을 청할 방법을 남기면, 간섭을 줄이는 일이 혼자 감당하라는 뜻으로 전해지지 않습니다."
        ]
      },
      {
        "traitId": "privacy_respecting_parent",
        "sourceKey": "5d03c8ad1c25fc371767",
        "field": "positiveUse",
        "originalApplication": [
          "개인의 취향과 사생활을 존중하는 태도는 스스로 고를 몫을 마련하는 데 쓰기 좋습니다.",
          "모든 이야기를 보고하게 하기보다 필요한 도움을 요청할 때 진지하게 응답하면, 독립성과 어른을 찾을 신뢰를 함께 지킬 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "open_non_controlling_parent",
      "sourceKey": "63356dc69674fed27d17",
      "field": "risk",
      "originalApplication": [
        "직접 경험하게 두려는 태도가 강하면, 눈에 보이는 문제는 없어도 필요한 감정적 도움을 늦게 알아차릴 수 있습니다.",
        "아이가 혼자 할 수 있다는 이유로 물어보는 시간을 줄이면, 해결할 방법보다 마음을 기대고 싶었던 순간이 지나갈 수 있습니다.",
        "간섭하지 않는 것과 안부를 묻지 않는 것을 나누면, 자기 선택을 존중하면서도 필요할 때 찾을 수 있는 어른으로 곁에 있기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "open_non_controlling_parent",
      "privacy_respecting_parent",
      "emotion_blind_parenting"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-istp-help-access",
      "lkr:material:CH08.P4:parent-support-channel"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ISFP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ISFP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "72b16b4ea26ff6c5e51293451077d7b767c8ceb7e473ff0133d21486b44ae51d",
    "originalRiskHash": "4428159dcc687a9d485ea45d7749a8610f155f01ea7bd498ed81e819d23294b1",
    "strengthSources": [
      {
        "traitId": "free_respecting_parent",
        "sourceKey": "966217efb16b624b6ba4",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 남과 다른 취향도 있는 그대로 받아주며 직접 느껴볼 기회를 주고 싶을 수 있습니다.",
          "재미있었던 감각이나 고른 이유를 물으면, 어른의 취향을 따르는 일과 자기 관심을 알아가는 일이 구분됩니다."
        ]
      },
      {
        "traitId": "friend_like_parent",
        "sourceKey": "ed69b25578fd3caf28c9",
        "field": "positiveUse",
        "originalApplication": [
          "편안하게 함께하며 정서적인 거리를 좁히는 태도는 어려운 일도 이야기할 분위기를 만드는 장점입니다.",
          "같이 즐기는 시간과 어른이 한계를 알려야 할 순간을 나누면, 가까운 관계를 유지하면서 필요한 책임도 가르칠 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "free_respecting_parent",
      "sourceKey": "966217efb16b624b6ba4",
      "field": "risk",
      "originalApplication": [
        "있는 그대로 받아주고 싶은 마음이 크면, 싫어할 말을 해야 하는 순간까지 부드럽게 넘기려 할 수 있습니다.",
        "잘못된 행동을 멈춰야 할 때도 분위기부터 지키면, 아이는 어떤 한계가 실제로 유지되는지 알아보기 어려워질 수 있습니다.",
        "감정은 허락하되 멈춰야 할 행동은 짧게 알려주면, 편안한 관계를 해치지 않고도 필요한 기준을 전할 수 있습니다."
      ]
    },
    "allParentingTraits": [
      "free_respecting_parent",
      "friend_like_parent",
      "experience_based_parenting"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-isfp-warm-limit"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ESTP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ESTP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "7e4a5b98ab2070a0fe6ccb9f8f0713a05d1caa51a4f90cfd5a7e44087d179783",
    "originalRiskHash": "1136397c804645251fc256fb45b780400ba856f8a141f7fadcb5ebea02799ae5",
    "strengthSources": [
      {
        "traitId": "free_parenting",
        "sourceKey": "d3c9927f687f4f03b5fe",
        "field": "plainKo",
        "originalApplication": [
          "부모 역할을 맡는다면, 직접 움직이고 해보면서 생활을 배우도록 돕는 데 관심을 둘 수 있습니다.",
          "작은 심부름처럼 선택과 결과가 이어지는 일을 안전하게 맡기면, 자유를 주는 일이 생활의 자신감을 연습하는 자리가 됩니다."
        ]
      },
      {
        "traitId": "adventure_parent",
        "sourceKey": "15008cf38f6d07145c5e",
        "field": "positiveUse",
        "originalApplication": [
          "새로운 활동에 함께 참여하는 힘은 익숙한 곳 밖에서 시도할 기회를 마련하는 장점이 됩니다.",
          "활동의 수준과 멈출 때를 함께 정하면, 어른이 즐긴 경험을 강요하지 않고 해볼 용기를 도울 수 있습니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "free_parenting",
      "sourceKey": "d3c9927f687f4f03b5fe",
      "field": "risk",
      "originalApplication": [
        "직접 경험하며 배우게 두는 힘이 클수록, 재미가 적어도 반복해야 할 생활의 일은 뒤로 갈 수 있습니다.",
        "그날의 활동에 따라 기본 약속이 자주 바뀌면, 아이에게 많은 기회가 있어도 스스로 하루를 이어갈 습관이 남기 어려울 수 있습니다.",
        "작은 반복을 끝낸 뒤 새 경험을 고르게 하면, 활동을 지원하는 장점이 자기관리의 기반과 함께 자라기 좋습니다."
      ]
    },
    "allParentingTraits": [
      "free_parenting",
      "adventure_parent",
      "self_development_support"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-estp-activity-choice"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  },
  {
    "id": "lkr:parenting:ESFP",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "mbtiType": "ESFP",
    "sourceOwner": "adult_own_parenting_only",
    "originalStrengthsHash": "40997c726985e95e7d22e891618749b71b510ce0ea7180a972f9a6013e9a917d",
    "originalRiskHash": "014329f37eb917bcb4fd028f7699bc59852dff9b85755a8d82503ec7eaa0277e",
    "strengthSources": [
      {
        "traitId": "open_parenting",
        "sourceKey": "521df13816e5f763badb",
        "field": "plainKo",
        "originalApplication": [
          "양육을 선택한다면, 즐겁고 열린 경험을 나누며 사람들과 편하게 어울릴 기회를 주고 싶을 수 있습니다.",
          "즐거움의 크기보다 스스로 참여할 방법을 고르게 하면, 밝게 반응하지 않는 날도 자기 모습으로 함께할 자리가 남습니다."
        ]
      },
      {
        "traitId": "travel_parenting",
        "sourceKey": "1efb6b1d8473aa2560f6",
        "field": "positiveUse",
        "originalApplication": [
          "함께 새로운 장소와 활동을 경험하는 태도는 관심의 폭을 넓힐 기회를 마련하는 데 쓰기 좋습니다.",
          "일정을 다 채우기보다 기억에 남은 것과 다시 해보고 싶은 것을 물으면, 많은 경험을 주는 일과 자기 관심을 찾는 일이 이어집니다."
        ]
      }
    ],
    "riskSource": {
      "traitId": "open_parenting",
      "sourceKey": "521df13816e5f763badb",
      "field": "risk",
      "originalApplication": [
        "즐겁고 자유로운 경험을 주고 싶은 마음이 크면, 하고 싶지 않은 일도 책임져야 하는 순간을 미룰 수 있습니다.",
        "반가운 반응이 나오는 활동만 남기면, 지루해도 끝낼 일과 다른 사람에게 지킬 약속을 배울 시간이 줄어들 수 있습니다.",
        "놀이의 선택은 열어두되 끝낸 뒤 맡을 일도 함께 정하면, 밝은 돌봄과 책임을 가르치는 일이 서로 반대가 되지 않습니다."
      ]
    },
    "allParentingTraits": [
      "open_parenting",
      "travel_parenting",
      "fun_support_parent",
      "social_child_growth"
    ],
    "materialRefs": [
      "lkr:material:CH08.P2:parent-esfp-shared-interest"
    ],
    "childFactsProvided": false,
    "childDomainTransferAllowed": false,
    "empiricalValidation": "not_established",
    "missingAgePolicy": "연령·발달·안전은 별도 실제 정보. 미입력 시 특정 연령의 능력·성과 요구 보류.",
    "missingSourcePolicy": "본인의 parenting trait가 없으면 유형·아이 성격을 만들지 않고 원국 근거가 실제 지원하는 조건부 부모 행동만 별도 검토."
  }
];
