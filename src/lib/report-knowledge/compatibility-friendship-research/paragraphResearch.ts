/** Static offline friendship research. No runtime registration or customer approval. */
import type { Material } from "./researchTypes";
export const FRIENDSHIP_MATERIALS: readonly Material[] = [
  {
    "id": "frpr:material:CH01.P1:chosen-time",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "두 사람은 어떤 순간에 다시 만나고 싶어질까?",
    "coreMeaning": "만날 기회와 다시 시간을 내고 싶은 선택은 다르다.",
    "additionalMeaning": "친구가 되는 속도보다 함께 보낸 시간을 각자 어떻게 받아들이는지 묻는다.",
    "conceptIds": [
      "frpr:concept:1",
      "frpr:concept:2",
      "frpr:concept:3"
    ],
    "positive": "함께 즐긴 활동을 다시 제안할 작은 접점이 생길 수 있다.",
    "risk": "같은 모임에 있다는 이유로 사적인 친밀감을 이미 합의했다고 여긴다.",
    "bluntWeakness": "자주 마주쳤다는 사실만으로 서로를 잘 아는 것은 아니다.",
    "twist": "짧은 만남도 서로 다시 고른 시간이라면 긴 의무적 동석보다 의미 있을 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "모임 뒤 한 사람이 산책을 제안하고 다른 사람이 가능한 날을 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "함께 좋았던 활동 하나와 다시 하고 싶은 이유를 제안한다.",
      "B": "호감의 크기를 맞추려 하기보다 실제로 가능한 만남을 답한다."
    },
    "counterexample": "학교나 직장에서 오래 마주쳤어도 따로 만날 의사가 없을 수 있다.",
    "distinction": "관계의 시작을 다루며 CH04.P3의 이미 함께하는 활동 조율과 구별한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:shared-participation",
      "sar:facet:AUTONOMY:choice-ownership"
    ],
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "선택해서 함께 보내는 시간이 관계의 특징을 볼 질문이다.",
        "independentFact": false
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "초대하는 성향과 참여를 고르는 성향은 각자 근거로 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "짧은 산책 제안에 서로 가능한 시간을 보태는 가상 장면이다.",
        "independentFact": false
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "우정의 상징은 정해진 운명이 아니라 다시 선택할 수 있는 자리다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH01.P2:symbol-not-trust",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "명리의 합과 충은 실제 친구 사이의 무엇을 설명할 수 있을까?",
    "coreMeaning": "검출된 관계의 구성 사실과 실제 신뢰의 수준을 분리한다.",
    "additionalMeaning": "같은 기호라도 참여한 기둥과 양쪽 소유자, 지원 범위가 다르면 적용을 보류한다.",
    "conceptIds": [
      "frpr:concept:8",
      "frpr:concept:26"
    ],
    "positive": "서로 편해지거나 조정이 필요한 조건을 질문하는 참고가 될 수 있다.",
    "risk": "합을 절친의 증명으로, 충을 절교의 이유로 바꾼다.",
    "bluntWeakness": "생년월일 사이의 관계는 비밀을 지켜 준 기록이 아니다.",
    "twist": "충이 있어도 다른 의견을 말할 여지가 있다면 조정의 출발점이 될 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "취향이 다른 두 친구가 만날 장소를 나눠 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인이 편한 조건과 불편한 조건을 구체적으로 구분한다.",
      "B": "기호에 맞춰 행동을 설명하지 말고 실제 선호를 확인한다."
    },
    "counterexample": "관계 미검출은 갈등도 유대도 없다는 뜻이 아니다.",
    "distinction": "CH07.P2는 검출된 긴장에 대한 적용 한계이며 여기서는 관계 사실의 범위가 핵심이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:inventory:canonical-pair",
        "requirement": "양쪽 실제 소유자·기둥 refs·지원 kind·성립 조건·전통 검토 상태를 모두 확인. 미지원 관계 보류.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:privacy",
      "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check"
    ],
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "양쪽 실제 refs가 있는 지원 관계만 설명 대상으로 삼는다.",
        "independentFact": false
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "합은 잘 맞음의 보장이 아니고 충은 실패의 예언이 아니다.",
        "independentFact": false
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "서로에게 남는 영향은 양쪽 실제 반응을 확인해야 한다.",
        "independentFact": false
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "관계 상징의 강점과 주의는 동의와 맥락이 있을 때만 질문한다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": true,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH01.P3:reference-not-person",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "MBTI가 같거나 다르면 친구로서도 같은 기대를 가질까?",
    "coreMeaning": "일반 Pair 참고와 각자의 실제 성향 근거를 구별한다.",
    "additionalMeaning": "같은 유형이어도 연락 방식과 함께 즐기는 활동은 같다고 가정하지 않는다.",
    "conceptIds": [
      "frpr:concept:4",
      "frpr:concept:25",
      "frpr:concept:26"
    ],
    "positive": "선호 차이를 평가 대신 확인할 질문으로 바꿀 수 있다.",
    "risk": "Pair 설명 하나로 한쪽 성격과 다른 쪽의 반응을 동시에 확정한다.",
    "bluntWeakness": "유형이 같다는 말은 같은 취향이나 같은 우정을 보증하지 않는다.",
    "twist": "서로 다르다는 사실보다 그 차이를 확인할 수 있는지가 유용한 정보다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "같은 MBTI인 두 친구가 한쪽은 단체 모임, 다른 쪽은 둘만의 산책을 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인 입력 유형에 해당하는 원천과 실제 선호를 따로 확인한다.",
      "B": "상대 설명을 본인 근거로 받아들이지 않고 자신이 원하는 방식을 말한다."
    },
    "counterexample": "MBTI가 미상이면 상대 유형에서 본인 유형을 추정할 수 없다.",
    "distinction": "CH04.P1의 실제 공통 관심사와 달리 원천의 증명 범위를 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_AB",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 방향의 원본 direct/inferred 상태 유지. 일반 참고이며 개인 성격·우정의 깊이·지속의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_BA",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 방향의 원본 direct/inferred 상태 유지. 일반 참고이며 개인 성격·우정의 깊이·지속의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:COMMUNICATION_STYLE:intent-check",
      "sar:facet:AUTONOMY:choice-ownership"
    ],
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A의 입력 유형과 A의 개인 source가 먼저 필요하다.",
        "independentFact": false
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B의 입력 유형과 B의 독립 source가 따로 필요하다.",
        "independentFact": false
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "방향별 Pair의 공통점·차이는 조건부 참고이며 개인 사실이 아니다.",
        "independentFact": false
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "자료가 없으면 해당 상호작용을 비워 두며 다른 유형으로 채우지 않는다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH01.P4:no-exclusive-contract",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "우리의 우정에서 합의해야 할 최소 기대는 무엇일까?",
    "coreMeaning": "친구라는 이름보다 각자 감당할 수 있는 관계의 범위를 먼저 확인한다.",
    "additionalMeaning": "친밀감은 모든 시간과 비밀을 우선 배정하겠다는 약속이 아니다.",
    "conceptIds": [
      "frpr:concept:6",
      "frpr:concept:7",
      "frpr:concept:11",
      "frpr:concept:21"
    ],
    "positive": "부탁과 거절을 함께 말할 수 있어 연결을 부담 없이 선택할 수 있다.",
    "risk": "친구라면 당연히 해 줘야 한다는 말로 미합의 의무를 만든다.",
    "bluntWeakness": "관계 이름이 상대의 시간을 예약해 주지는 않는다.",
    "twist": "모든 것을 공유하지 않는 선이 오히려 지킬 수 있는 우정을 만들 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "한 친구가 주말마다 만나길 원하고 다른 친구가 월 1회가 가능하다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "바라는 것과 꼭 필요한 것을 구분해 제안한다.",
      "B": "가능한 범위와 어려운 범위를 동시에 답한다."
    },
    "counterexample": "생활상 제약 때문에 요청을 거절해도 호감이 줄었다고 단정할 수 없다.",
    "distinction": "관계 전체의 합의 문턱이며 CH07.P1은 구체적인 연락 기대 불일치다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:refusal",
      "sar:facet:RELATION_STYLE:contact-range"
    ],
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "좋은 점은 서로 가능한 범위를 선택할 수 있다는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "조심할 차이는 기대를 말하지 않고 당연한 의무로 바꾸는 데 있다.",
        "independentFact": false
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "우정에는 동거·독점·업무 권한을 자동 부여하는 조건이 없다.",
        "independentFact": false
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "다음 질문은 자주 만날지보다 무엇을 서로 기대해도 되는지다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH02.P1:a-invitation",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A는 친구에게 다가갈 때 어떤 참여 방식을 제안할까?",
    "coreMeaning": "먼저 초대하는 행동과 상대의 참여 의사를 분리한다.",
    "additionalMeaning": "제안이 많더라도 그 모든 활동을 상대가 함께 원한다고 볼 수 없다.",
    "conceptIds": [
      "frpr:concept:1",
      "frpr:concept:2",
      "frpr:concept:11"
    ],
    "positive": "A의 관심이 상대가 새로운 활동에 접근할 입구가 될 수 있다.",
    "risk": "대답이 없는데도 초대를 반복해 참여 압박을 만든다.",
    "bluntWeakness": "친절한 초대도 거절할 출구가 없으면 숙제다.",
    "twist": "짧은 선택지와 불참 가능성을 함께 주면 제안의 부담이 줄 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 전시 관람과 짧은 차 한 잔 중 가능한 쪽을 B에게 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "초대의 목적과 소요 시간을 밝히고 거절을 허용한다.",
      "B": "이번 활동의 참여 의사와 가능한 시간을 직접 고른다."
    },
    "counterexample": "먼저 연락하지 않는 사람도 초대를 반갑게 받아들일 수 있다.",
    "distinction": "A의 시작 행동이며 B가 참여 강도를 선택하는 CH03.P1과는 질문이 다르다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:shared-participation",
      "sar:facet:AUTONOMY:choice-ownership"
    ],
    "roleContributions": [
      {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "대표 행동은 초대의 횟수가 아니라 선택지를 만드는 방식으로 검토한다.",
        "independentFact": false
      },
      {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "그 행동을 설명할 원국 근거는 A에게 실제로 성립해야 한다.",
        "independentFact": false
      },
      {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "MBTI 선호도 A의 입력 유형과 허용 개인 원천으로만 참고한다.",
        "independentFact": false
      },
      {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "B의 반응을 확인해야 초대가 관계에 주는 의미를 말할 수 있다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH02.P2:a-disclosure-control",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 마음을 열기 위해 필요한 사적 경계는 무엇일까?",
    "coreMeaning": "자기 이야기를 꺼내는 속도와 공개할 범위를 본인이 정할 수 있어야 한다.",
    "additionalMeaning": "친한 친구에게 말한 정보도 다른 모임으로 전달해도 된다는 허락은 아니다.",
    "conceptIds": [
      "frpr:concept:8",
      "frpr:concept:9",
      "frpr:concept:7"
    ],
    "positive": "선택한 만큼 이야기하고 비밀의 범위를 확인하는 신뢰가 생길 수 있다.",
    "risk": "솔직함을 요구하며 준비되지 않은 이야기를 캐묻는다.",
    "bluntWeakness": "말하지 않은 부분까지 알아야 친한 친구인 것은 아니다.",
    "twist": "적게 말해도 그 정보가 안전하게 남는 경험이 다음 대화의 조건이 될 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 개인 고민의 자세한 내용은 말하지 않고 듣기만 부탁하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "말하고 싶은 범위와 다른 사람에게 전해도 되는 범위를 구분한다.",
      "B": "모르는 부분을 추궁하지 않고 들은 정보의 사용 범위를 확인한다."
    },
    "counterexample": "지금 이야기하지 않는 이유가 불신이 아니라 피로일 수 있다.",
    "distinction": "A의 공개 조건이며 CH03.P2는 B가 의지할 상대와 지원 범위를 정하는 질문이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:laurenceau",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:privacy",
      "sar:facet:EXPRESSION:visibility-control"
    ],
    "roleContributions": [
      {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "관계 조건은 이야기의 양보다 공개할 권한을 본인이 유지하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "실제 이유는 A의 직접 확인과 자기 원천 없이 단정하지 않는다.",
        "independentFact": false
      },
      {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "B가 듣는 장면에서도 공개 동의의 범위는 따로 남는다.",
        "independentFact": false
      },
      {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "경계가 지켜질 때 추가 이야기를 선택할 여지가 생긴다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH02.P3:a-curiosity-gift",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A의 호기심은 친구의 취향을 어떻게 넓힐 수 있을까?",
    "coreMeaning": "새로운 취향을 소개하는 장점은 따라오라고 요구하지 않을 때 도움이 된다.",
    "additionalMeaning": "친구의 낯섦을 무지로 평가하지 않고 해 보는 강도를 낮출 수 있다.",
    "conceptIds": [
      "frpr:concept:5",
      "frpr:concept:3",
      "frpr:concept:11"
    ],
    "positive": "서로 혼자였다면 만나지 못할 관심사를 시험해 볼 기회가 생긴다.",
    "risk": "자기 취향의 설명이 상대를 가르치거나 평가하는 말로 바뀐다.",
    "bluntWeakness": "친구의 취향을 업그레이드할 권한은 없다.",
    "twist": "함께 좋아하지 않아도 소개를 받은 뒤 각자 고르는 과정은 즐거울 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 낯선 음악을 한 곡 들려주고 B가 선호하지 않는다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "추천 이유와 가벼운 체험 방법만 제안한다.",
      "B": "마음에 든 부분과 그렇지 않은 부분을 구체적으로 답한다."
    },
    "counterexample": "활동이 새롭다는 이유만으로 B에게 즐거운 것은 아니다.",
    "distinction": "개인 A의 강점 사용 조건이며 CH04.P2는 두 기여를 함께 배치하는 방식이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:shared-participation",
      "sar:facet:AUTONOMY:chosen-support"
    ],
    "roleContributions": [
      {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "특징적 강점은 낯선 관심사로 들어갈 작은 입구를 만드는 데 있다.",
        "independentFact": false
      },
      {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "강점의 실제 원천은 A에게 적용되는 명리·MBTI 자료로 제한한다.",
        "independentFact": false
      },
      {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "B에게 좋은 상황은 B가 탐색을 원하고 거절할 수 있을 때다.",
        "independentFact": false
      },
      {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "유지 조건은 추천을 평가나 의무로 바꾸지 않는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH02.P4:a-unsolicited-help",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A의 호의가 언제 친구의 선택을 지울 수 있을까?",
    "coreMeaning": "돕고 싶은 마음과 상대가 요청한 도움은 다르다.",
    "additionalMeaning": "도움을 많이 준 기록은 상대의 사적인 결정을 대신할 권리가 아니다.",
    "conceptIds": [
      "frpr:concept:10",
      "frpr:concept:11",
      "frpr:concept:13"
    ],
    "positive": "요청을 먼저 묻고 감당할 부분만 보태면 구체적인 부담을 줄일 수 있다.",
    "risk": "A가 해결을 대신한 뒤 감사나 같은 수준의 보답을 기대한다.",
    "bluntWeakness": "요청하지 않은 도움의 값을 상대에게 청구할 수는 없다.",
    "twist": "아무것도 대신 하지 않고 듣는 선택이 더 알맞은 도움일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 B의 고민을 듣고 지인에게 먼저 해결을 부탁하려는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "연결·조언·경청 중 무엇을 원하는지 묻기 전에는 대신 행동하지 않는다.",
      "B": "원하는 지원과 원하지 않는 개입을 나누어 말한다."
    },
    "counterexample": "긴급한 안전 문제가 있는 상황은 일반 호의의 조율만으로 다루지 않는다.",
    "distinction": "A의 과용 위험이며 CH05.P3은 그 행동이 B에게 남기는 부담을 독립 검토한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:feeney",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:CARE:need-check",
      "sar:facet:AUTONOMY:chosen-support"
    ],
    "roleContributions": [
      {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "과사용 위험은 상대의 요청보다 내 해결 의지가 앞서는 데 있다.",
        "independentFact": false
      },
      {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "원인은 A의 실제 성향과 맥락이 확인되기 전에는 가설이다.",
        "independentFact": false
      },
      {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "B에게는 배려보다 자신의 선택을 빼앗긴 뜻으로 전달될 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "조절 행동은 실행 전에 도움의 종류와 동의를 묻는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH03.P1:b-participation-range",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B는 친구 모임에서 어느 정도로 참여하고 싶을까?",
    "coreMeaning": "초대에 응하는 의사와 모임 전체를 함께할 의사는 구별한다.",
    "additionalMeaning": "짧게 머무르거나 일대일을 선호해도 모임 사람을 싫어한다고 볼 수 없다.",
    "conceptIds": [
      "frpr:concept:3",
      "frpr:concept:7",
      "frpr:concept:15"
    ],
    "positive": "참여 강도를 정하면 만남을 지속 가능한 선택으로 만들 수 있다.",
    "risk": "같은 자리에 끝까지 남아야 친밀함을 증명한다고 여긴다.",
    "bluntWeakness": "참석을 골랐다고 모든 일정에 동의한 것은 아니다.",
    "twist": "일찍 귀가할 수 있다는 조건이 오히려 만남에 참여할 여지를 만들 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 모임 전반부만 참석하고 A가 이후 일정을 다른 친구들과 이어가는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "B의 참여 시간을 전체 모임에 대한 평가로 해석하지 않는다.",
      "B": "참석·귀가·개별 만남 중 실제 가능한 범위를 알린다."
    },
    "counterexample": "원격 만남을 선호하는 시기에는 대면 시간만으로 관심을 평가할 수 없다.",
    "distinction": "B의 참여 선택을 다루며 CH02.P1의 초대 방법과 구별한다.",
    "ownedSources": [
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:contact-range",
      "sar:facet:RECOVERY_NEED:rest-access"
    ],
    "roleContributions": [
      {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "독립적 행동은 B가 정한 참여 범위다.",
        "independentFact": false
      },
      {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "B의 원국 근거는 A와 섞지 않고 실제 성립 여부를 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "MBTI 참고도 B의 입력 유형과 개인 원천에 한정한다.",
        "independentFact": false
      },
      {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "A와의 관계에서는 모임의 길이와 친밀함의 평가를 나눈다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH03.P2:b-support-network",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 친구에게 의지하고 싶을 때 필요한 조건은 무엇일까?",
    "coreMeaning": "정서적 지지와 모든 문제를 한 친구에게 맡기는 것은 다르다.",
    "additionalMeaning": "대화·실무 도움·다른 지원을 나누면 친구 한 사람에게 전부 의존하지 않을 수 있다.",
    "conceptIds": [
      "frpr:concept:10",
      "frpr:concept:13",
      "frpr:concept:16"
    ],
    "positive": "필요한 도움을 명시하고 상대의 가능한 몫을 확인할 수 있다.",
    "risk": "A의 응답 지연을 모든 지원이 사라진 신호로 해석한다.",
    "bluntWeakness": "친구 한 명을 내 삶의 유일한 응답 창구로 만들면 둘 다 숨 쉴 자리가 줄어든다.",
    "twist": "도움을 받을 경로가 여럿이면 한 친구와의 대화도 더 자유롭게 선택할 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 힘든 날 A에게 잠깐 통화가 가능한지 묻고 다른 지원도 확인하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "가능한 시간과 할 수 있는 도움의 한계를 답한다.",
      "B": "지금 필요한 지원의 종류와 긴급성을 구분해 요청한다."
    },
    "counterexample": "A가 응답할 수 없어도 B의 고민이 덜 중요하다는 뜻은 아니다.",
    "distinction": "B의 의지 조건이며 CH02.P2는 공개할 정보의 통제권이다.",
    "ownedSources": [
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:feeney",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:CARE:sustainable-care",
      "sar:facet:COMMUNICATION_STYLE:direct-request"
    ],
    "roleContributions": [
      {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "관계 조건은 필요와 상대의 가용 범위를 함께 말하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "B가 왜 도움을 원하는지는 직접 확인한 범위에 한정한다.",
        "independentFact": false
      },
      {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "A와의 장면에서는 감정 지지와 문제 해결을 구분한다.",
        "independentFact": false
      },
      {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "필요가 충족돼도 한 사람에게 모든 지원을 요구하지 않는 선을 유지한다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH03.P3:b-detail-memory",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B가 기억하는 작은 관심은 어떤 경우 좋은 힘이 될까?",
    "coreMeaning": "기억한 정보의 정확성과 지금도 그 관심이 유효한지는 다르다.",
    "additionalMeaning": "과거 취향을 기억하더라도 현재 선택을 새로 물을 수 있다.",
    "conceptIds": [
      "frpr:concept:4",
      "frpr:concept:17",
      "frpr:concept:18"
    ],
    "positive": "사소한 선호를 알아봐 주면서도 바뀔 자유를 줄 수 있다.",
    "risk": "예전 취향으로 현재의 선택을 제한한다.",
    "bluntWeakness": "잘 안다는 자신감이 오늘의 친구에게 질문할 기회를 지울 수 있다.",
    "twist": "기억이 좋은 친구일수록 새로 모르는 부분을 물으면 관심이 더 구체적이 될 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 A가 예전에 좋아한 음식을 기억하고 지금도 괜찮은지 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "바뀐 취향이나 상황을 미안해하지 않고 알린다.",
      "B": "과거 기억을 확인 질문으로 사용하고 결정으로 사용하지 않는다."
    },
    "counterexample": "현재의 선택이 다르더라도 과거의 좋은 기억이 거짓이 되는 것은 아니다.",
    "distinction": "B의 기억 활용이며 CH06.P2는 그 관심을 받는 A의 반응과 범위를 다룬다.",
    "ownedSources": [
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
      "sar:facet:BOUNDARY:renegotiation"
    ],
    "roleContributions": [
      {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "특징적 강점은 기억을 현재의 관심 질문으로 이어가는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "실제 근거는 B의 기억·관찰 성향을 지원하는 자기 원천이어야 한다.",
        "independentFact": false
      },
      {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "A에게 좋은 상황은 취향의 변화를 다시 물어볼 때다.",
        "independentFact": false
      },
      {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "유지 조건은 기억을 상대의 고정된 정체성으로 만들지 않는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH03.P4:b-unspoken-cost",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B가 서운함을 말하지 않을 때 무엇을 놓칠 수 있을까?",
    "coreMeaning": "갈등 표현의 부재와 불편의 부재는 다르다.",
    "additionalMeaning": "관계를 지키려는 침묵도 요청되지 않은 부담을 누적시킬 수 있다.",
    "conceptIds": [
      "frpr:concept:9",
      "frpr:concept:13",
      "frpr:concept:19"
    ],
    "positive": "작은 불편을 행동 단위로 알려 조정할 여지가 생긴다.",
    "risk": "B가 괜찮다고 답한 뒤 A가 알아서 눈치채길 기대한다.",
    "bluntWeakness": "말하지 않은 조건을 상대가 어겼다고 확정할 수는 없다.",
    "twist": "짧은 거절이나 수정 요청이 우정을 덜 소중히 여기는 신호는 아닐 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 여러 번 늦은 모임 시간을 받아들이다 다음에는 일찍 만나고 싶다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "B가 새로 말한 조건을 뒤늦은 공격으로만 받아들이지 않는다.",
      "B": "불편한 행동 하나와 바라는 변경 하나를 말한다."
    },
    "counterexample": "명시적으로 말하기 어려운 안전 상황에서는 직접 대화를 강요하지 않는다.",
    "distinction": "B의 표현 과소사용이며 CH07.P3은 반복적인 호의 비용의 상호 해석이다.",
    "ownedSources": [
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:EXPRESSION:receipt-check",
      "sar:facet:BOUNDARY:refusal"
    ],
    "roleContributions": [
      {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "과사용 위험은 배려를 이유로 자신의 한계를 숨기는 데 있다.",
        "independentFact": false
      },
      {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "원인을 B의 MBTI나 명리만으로 확정하지 않는다.",
        "independentFact": false
      },
      {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "A는 실제 불편을 모른 채 동의가 계속된다고 이해할 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "조절 행동은 불편한 사건과 다음 요청을 구분해 알리는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH04.P1:shared-interest-specific",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH04.P1",
    "mode": "JOINT",
    "readerQuestion": "공통 취향 중 무엇을 함께 즐길 수 있을까?",
    "coreMeaning": "취향 이름의 일치보다 구체적으로 함께 즐길 방식이 맞는지 확인한다.",
    "additionalMeaning": "같은 여행·게임·독서 취향도 비용·시간·강도의 기대는 다를 수 있다.",
    "conceptIds": [
      "frpr:concept:3",
      "frpr:concept:4",
      "frpr:concept:14"
    ],
    "positive": "부담 없이 반복할 활동을 찾아 대화의 접점을 만들 수 있다.",
    "risk": "같은 취향이라는 이유로 예산과 일정까지 맞는다고 여긴다.",
    "bluntWeakness": "같은 취향은 같은 사용 설명서가 아니다.",
    "twist": "완전히 같은 활동보다 서로 좋아한 한 부분을 나누는 방식이 더 맞을 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "두 친구가 모두 여행을 좋아하지만 긴 일정과 당일 산책을 다르게 원하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "공통 관심사에서 본인이 원하는 시간과 비용을 말한다.",
      "B": "활동 이름에 동의하기 전에 참여 방식도 확인한다."
    },
    "counterexample": "같은 취향이 없어도 대화와 지지가 편한 친구일 수 있다.",
    "distinction": "공통 취향의 실행 조건이며 CH01.P3의 유형 일치와 구별한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:shared-participation",
      "sar:facet:BOUNDARY:renegotiation"
    ],
    "roleContributions": [
      {
        "address": "CH04.P1.S1",
        "originalRole": "검증된 공통점 또는 다른 기여",
        "knowledge": "공통점은 실제로 확인한 관심사 또는 각자의 다른 기여다.",
        "independentFact": false
      },
      {
        "address": "CH04.P1.S2",
        "originalRole": "각자 근거",
        "knowledge": "양쪽의 실제 근거 없이 취향의 일치를 만들어내지 않는다.",
        "independentFact": false
      },
      {
        "address": "CH04.P1.S3",
        "originalRole": "함께하는 행동",
        "knowledge": "함께하는 행동은 시간·비용·강도의 합의로 구체화한다.",
        "independentFact": false
      },
      {
        "address": "CH04.P1.S4",
        "originalRole": "강점의 조건",
        "knowledge": "강점의 조건은 활동 중 거절하거나 방식을 바꿀 수 있는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH04.P2:difference-with-choice",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH04.P2",
    "mode": "JOINT",
    "readerQuestion": "다른 취향이 어떻게 서로의 세계를 넓힐 수 있을까?",
    "coreMeaning": "차이는 상대의 취향을 바꾸는 과제가 아니라 선택 가능한 경험의 확대다.",
    "additionalMeaning": "서로의 추천을 번갈아 시도해도 만족의 정도까지 같을 필요는 없다.",
    "conceptIds": [
      "frpr:concept:5",
      "frpr:concept:11"
    ],
    "positive": "각자 혼자 고르지 않을 활동을 낮은 부담으로 경험할 수 있다.",
    "risk": "다름을 보완이라는 이름으로 한쪽의 취향을 교정한다.",
    "bluntWeakness": "다른 장점이 있다는 말만으로 함께해야 할 의무가 생기지 않는다.",
    "twist": "한 번 경험하고 다음에는 따로 즐기는 선택도 좋은 차이의 활용일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "한 친구가 공연을, 다른 친구가 등산을 추천하고 각자 한 번씩 짧게 시도하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "추천을 받을 의사와 중단할 조건을 묻는다.",
      "B": "체험 뒤 계속 함께할지 독립적으로 고른다."
    },
    "counterexample": "상대가 원하지 않는 활동에서는 좋은 소개도 도움으로 성립하지 않는다.",
    "distinction": "CH02.P3의 개인 호기심과 달리 두 사람의 참여·거절 조건을 함께 배치한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:AUTONOMY:choice-ownership",
      "sar:facet:RELATION_STYLE:shared-participation"
    ],
    "roleContributions": [
      {
        "address": "CH04.P2.S1",
        "originalRole": "검증된 보완 또는 다른 장점",
        "knowledge": "보완은 실제로 다른 기여가 같은 장면에 필요할 때만 말한다.",
        "independentFact": false
      },
      {
        "address": "CH04.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "그 차이는 양쪽 원천과 실제 선호를 따로 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH04.P2.S3",
        "originalRole": "도움의 장면",
        "knowledge": "도움의 장면은 각자가 새 경험의 강도를 선택하는 가정이다.",
        "independentFact": false
      },
      {
        "address": "CH04.P2.S4",
        "originalRole": "좋은 차이의 경계",
        "knowledge": "좋은 차이의 경계는 거절해도 친구의 가치가 깎이지 않는 데 있다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH04.P3:low-performance-company",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH04.P3",
    "mode": "JOINT",
    "readerQuestion": "함께 있을 때 꼭 특별한 일을 해야 즐거울까?",
    "coreMeaning": "함께 있는 즐거움과 상대를 계속 즐겁게 해 줘야 한다는 부담을 구별한다.",
    "additionalMeaning": "조용한 동행·짧은 근황·농담도 서로 원하면 만남의 내용이 될 수 있다.",
    "conceptIds": [
      "frpr:concept:3",
      "frpr:concept:7",
      "frpr:concept:10"
    ],
    "positive": "매번 큰 계획을 만들지 않아도 각자 편한 참여를 고를 수 있다.",
    "risk": "조용한 시간을 지루함이나 관계의 실패로 해석한다.",
    "bluntWeakness": "친구와의 시간을 계속 공연처럼 만들 필요는 없다.",
    "twist": "별일 없는 만남이 편하다는 것은 무관심과 다른 정보일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "두 친구가 산책하면서 말하다가 각자 조용히 걷기도 하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "지금 원하는 활동 강도와 말할 여유를 묻는다.",
      "B": "편한 침묵인지 대화를 원하지만 망설이는지 직접 알린다."
    },
    "counterexample": "침묵이 편하다는 합의가 없다면 소외감을 느낄 수 있다.",
    "distinction": "시작의 호감 CH01.P1과 달리 실제 만남 중 상호 참여를 조절하는 질문이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RECOVERY_NEED:load-recognition",
      "sar:facet:RELATION_STYLE:shared-participation"
    ],
    "roleContributions": [
      {
        "address": "CH04.P3.S1",
        "originalRole": "관계별 상황",
        "knowledge": "관계별 상황은 부담 없는 함께 있기다.",
        "independentFact": false
      },
      {
        "address": "CH04.P3.S2",
        "originalRole": "A의 기여",
        "knowledge": "A의 기여는 재미를 강요하지 않고 참여를 열어 두는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH04.P3.S3",
        "originalRole": "B의 기여",
        "knowledge": "B의 기여는 편한 방식과 불편한 침묵을 구분해 알리는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH04.P3.S4",
        "originalRole": "함께 얻는 결과",
        "knowledge": "함께 얻는 결과는 공연의 성과가 아니라 선택한 만남의 편안함이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH04.P4:trust-not-access",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH04.P4",
    "mode": "JOINT",
    "readerQuestion": "비밀을 많이 알수록 더 깊은 친구일까?",
    "coreMeaning": "친밀감은 정보에 접근하는 양과 그 정보를 안전하게 다루는 방식이 다르다.",
    "additionalMeaning": "공개하지 않겠다는 약속과 공유해도 되는 범위는 구체적으로 확인한다.",
    "conceptIds": [
      "frpr:concept:8",
      "frpr:concept:15",
      "frpr:concept:21"
    ],
    "positive": "말한 사람이 공개 범위를 유지할 수 있는 대화가 가능해진다.",
    "risk": "단체 대화에서 친구의 사적 이야기를 친함의 증거로 꺼낸다.",
    "bluntWeakness": "비밀을 안다는 사실은 그 비밀을 사용할 권리가 아니다.",
    "twist": "새 비밀을 더 듣는 것보다 이미 들은 정보의 범위를 지키는 일이 신뢰의 조건일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "모임에서 친구의 개인 고민이 화제가 되자 당사자의 허락을 먼저 확인하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인의 이야기 중 공개 가능한 범위를 말한다.",
      "B": "다른 사람에게 전하기 전에 당사자에게 다시 묻는다."
    },
    "counterexample": "비밀을 공유한 적이 없어도 취향을 함께 즐기는 우정은 가능하다.",
    "distinction": "개인 공개 조건 CH02.P2와 달리 공동 자리에서 정보의 사용 권한을 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:laurenceau",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:privacy",
      "sar:facet:EXPRESSION:visibility-control"
    ],
    "roleContributions": [
      {
        "address": "CH04.P4.S1",
        "originalRole": "가치 있는 특징",
        "knowledge": "가치 있는 특징은 공개 범위를 서로 지키려는 선택이다.",
        "independentFact": false
      },
      {
        "address": "CH04.P4.S2",
        "originalRole": "좋은 관계의 조건",
        "knowledge": "좋은 관계의 조건은 정보량이 아니라 동의한 사용 범위다.",
        "independentFact": false
      },
      {
        "address": "CH04.P4.S3",
        "originalRole": "과사용 위험",
        "knowledge": "과사용 위험은 친밀함을 이유로 다른 사람에게 대신 말하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH04.P4.S4",
        "originalRole": "활용 방향",
        "knowledge": "활용 방향은 공유 전에 당사자의 현재 동의를 확인하는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH05.P1:ab-invitation-received",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "A의 새로운 제안은 B에게 어떤 자극으로 받아들여질까?",
    "coreMeaning": "A의 초대가 B에게 기회가 되는지 의무가 되는지는 수신 조건에 달려 있다.",
    "additionalMeaning": "수신자 B 기준 십성은 기존 계산이 제공한 방향에서만 검토한다.",
    "conceptIds": [
      "frpr:concept:24",
      "frpr:concept:1",
      "frpr:concept:5"
    ],
    "positive": "B가 원하던 경험을 작은 선택지로 접할 수 있다.",
    "risk": "A가 B의 참여를 확정해 놓고 뒤늦게 알린다.",
    "bluntWeakness": "신나는 제안도 B가 고를 자리가 없으면 부담이다.",
    "twist": "B가 일부만 참여하는 방식이 A의 제안을 살릴 수도 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 새 모임을 소개하고 B가 첫 30분만 참여하기로 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "B의 가용 시간과 참가 의사를 확인한 뒤 제안한다.",
      "B": "원하는 자극의 크기와 참여 범위를 답한다."
    },
    "counterexample": "B가 이미 과부하 상태라면 새로운 기회도 지금은 도움이 아닐 수 있다.",
    "distinction": "A의 시작 행동 CH02.P1과 달리 수신자 B에게 남는 영향을 검토한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_AB",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_AB",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:AUTONOMY:choice-ownership",
      "sar:facet:RELATION_STYLE:contact-range"
    ],
    "roleContributions": [
      {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A→B의 영향은 B가 선택할 수 있는 새 접점이라는 가설이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "십성은 B 일간이 A 일간을 보는 실제 방향 값만 참고한다.",
        "independentFact": false
      },
      {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "행동은 초대 전에 가용 범위를 묻는 조건부 장면이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B에게 남는 의미는 참여 의사 확인 전에는 UNKNOWN이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "A_TO_B",
      "tenGodViewer": "B.dayMaster",
      "tenGodTarget": "A.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH05.P2:ab-options-not-orders",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 해결 아이디어는 언제 B에게 도움이 될까?",
    "coreMeaning": "대안을 제안하는 강점과 그 대안을 채택할 권한을 분리한다.",
    "additionalMeaning": "A가 정확한 정보를 주어도 B가 지금 원하는 것은 공감일 수 있다.",
    "conceptIds": [
      "frpr:concept:24",
      "frpr:concept:10",
      "frpr:concept:11"
    ],
    "positive": "B가 문제를 보는 선택지를 넓히면서도 자신의 결정을 유지할 수 있다.",
    "risk": "A가 해법에 동의하지 않는 B를 비합리적이라고 평가한다.",
    "bluntWeakness": "조언의 정확함은 듣고 싶다는 동의를 대신하지 못한다.",
    "twist": "해법을 잠시 보류하고 듣는 일이 다음 질문을 더 정확하게 만들 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 고민을 말하고 A가 듣기와 아이디어 중 필요한 쪽을 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "도움의 종류를 확인하고 대안은 선택지로 말한다.",
      "B": "지금 필요한 반응과 원하지 않는 개입을 알린다."
    },
    "counterexample": "B가 구체적인 해결책을 요청했다면 경청만 반복하는 것도 요구와 다르다.",
    "distinction": "CH02.P4의 과사용과 달리 실제 요청과 해법의 맞물림을 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_AB",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_AB",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:feeney",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:CARE:need-check",
      "sar:facet:AUTONOMY:chosen-support"
    ],
    "roleContributions": [
      {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "도움 되는 강점은 대안을 늘리는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "A의 실제 근거와 B의 요청이 모두 있어야 좋은 영향으로 연결한다.",
        "independentFact": false
      },
      {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "친구의 고민을 듣는 가상 장면에서 도움의 종류를 먼저 묻는다.",
        "independentFact": false
      },
      {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "발휘 조건은 B의 선택권과 A의 감당할 범위를 보존하는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "A_TO_B",
      "tenGodViewer": "B.dayMaster",
      "tenGodTarget": "A.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH05.P3:ab-favour-debt",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 호의가 B에게 갚아야 할 빚처럼 느껴질 때는 언제일까?",
    "coreMeaning": "준 사람의 선의와 받은 사람이 감당할 보답의 기대는 다르다.",
    "additionalMeaning": "선물·소개·시간 제공마다 수락과 반환 기대를 따로 확인한다.",
    "conceptIds": [
      "frpr:concept:24",
      "frpr:concept:13",
      "frpr:concept:14"
    ],
    "positive": "작은 호의를 거절하거나 규모를 줄일 수 있다면 부담을 조절할 수 있다.",
    "risk": "A가 먼저 크게 베푼 뒤 B에게 같은 비용이나 시간을 요구한다.",
    "bluntWeakness": "친절을 먼저 건넸다고 상대의 다음 선택을 살 수는 없다.",
    "twist": "호의의 크기를 줄이는 것이 친구의 참여를 더 자유롭게 만들 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 비싼 여행 비용을 대신 내겠다고 제안하고 B가 다음 보답을 걱정하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "보답 기대가 있는지 밝히고 거절을 불이익으로 다루지 않는다.",
      "B": "수락 가능한 규모와 부담되는 조건을 구분한다."
    },
    "counterexample": "이미 합의한 공동 비용의 정산은 일방적으로 베푼 호의와 다르다.",
    "distinction": "B가 침묵하는 CH03.P4와 달리 A의 제공이 B의 선택에 남기는 경제·정서 비용이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_AB",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_AB",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:CARE:sustainable-care",
      "sar:facet:BOUNDARY:refusal"
    ],
    "roleContributions": [
      {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "부담 행동은 수락되지 않은 호의를 미래 의무로 바꾸는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "차이는 양쪽 실제 기대와 근거가 확인돼야 한다.",
        "independentFact": false
      },
      {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "A의 의도는 배려여도 B의 경험은 보답 압박일 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "악화 조건은 거절을 우정의 부족으로 해석하는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "A_TO_B",
      "tenGodViewer": "B.dayMaster",
      "tenGodTarget": "A.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH05.P4:ab-other-friends",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 B의 다른 친구 관계를 존중하는 방법은 무엇일까?",
    "coreMeaning": "우선순위를 확인하는 요청과 다른 관계를 통제하는 요구를 구별한다.",
    "additionalMeaning": "다른 친구와의 만남은 자동으로 A를 대체한다는 증거가 아니다.",
    "conceptIds": [
      "frpr:concept:24",
      "frpr:concept:11",
      "frpr:concept:15"
    ],
    "positive": "둘만의 약속을 구체적으로 조율하면서 B의 별도 관계를 존중할 수 있다.",
    "risk": "A가 친밀함을 증명하라며 B의 모임·연락·편들기를 요구한다.",
    "bluntWeakness": "좋은 친구라는 이유로 B의 다른 친구를 심사할 권한은 없다.",
    "twist": "우정을 단독 순위로 관리하지 않으면 함께하는 약속을 더 선명하게 고를 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 다른 모임에 참여하는 주말에 A가 별도의 가능한 날짜를 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "관계를 제한하는 대신 실제 만나고 싶은 시간과 이유를 말한다.",
      "B": "다른 관계를 설명할 의무와 둘의 기존 약속을 지킬 책임을 구분한다."
    },
    "counterexample": "이미 합의한 약속을 말없이 취소한 문제는 다른 친구를 만나는 자유와 별도로 확인한다.",
    "distinction": "B→A의 관찰이 평가가 되는 CH06.P3과 달리 A의 독점 요구를 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_AB",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_AB",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:krems",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:AUTONOMY:choice-ownership",
      "sar:facet:BOUNDARY:privacy"
    ],
    "roleContributions": [
      {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "조정할 행동은 다른 친구를 제한하려는 요구를 구체적인 만남 요청으로 바꾸는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 필요는 B의 실제 응답과 자기 원천에서 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "실천은 둘의 약속과 B의 별도 모임을 구분하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "A→B 가능성은 자유와 약속이 함께 남을 때만 설명한다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "A_TO_B",
      "tenGodViewer": "B.dayMaster",
      "tenGodTarget": "A.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH06.P1:ba-response-meaning",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "B의 차분한 반응은 A에게 어떤 의미로 전달될까?",
    "coreMeaning": "응답의 속도·길이와 A가 이해한 관심의 크기를 분리한다.",
    "additionalMeaning": "B→A의 수신 십성은 A 일간 기준으로 따로 확인한다.",
    "conceptIds": [
      "frpr:concept:25",
      "frpr:concept:6",
      "frpr:concept:9"
    ],
    "positive": "B가 정리한 대답이 A에게 기다릴 수 있는 기준을 줄 수 있다.",
    "risk": "B가 혼자 괜찮다고 여기는 간격을 A에게 설명 없이 적용한다.",
    "bluntWeakness": "본인이 편한 침묵이 상대에게도 편하다는 보장은 없다.",
    "twist": "짧은 수신 확인이 긴 즉답보다 지금의 여유를 정확히 알려 줄 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 긴 답은 저녁에 하겠다고 짧게 알리고 A가 급한 일인지 답하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "응답이 필요한 시점과 급한 이유를 명시한다.",
      "B": "정리할 시간이 필요하면 짧은 확인과 다시 답할 시점을 남긴다."
    },
    "counterexample": "즉답이 필요하지 않은 대화라면 모든 메시지에 응답 기한을 둘 필요는 없다.",
    "distinction": "A→B의 새 제안과 독립적으로 B의 응답이 A에게 남기는 뜻을 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_BA",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_BA",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:EXPRESSION:receipt-check",
      "sar:facet:RECOVERY_NEED:return-agreement"
    ],
    "roleContributions": [
      {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B→A의 영향은 반응을 정리할 간격이 A에게 주는 정보라는 가설이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "십성은 A 일간이 B 일간을 보는 기존 방향 값이어야 한다.",
        "independentFact": false
      },
      {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "다른 방향 행동은 수신 확인과 자세한 대답을 나누는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A에게 남는 의미는 A의 실제 이해를 확인하기 전에는 확정하지 않는다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "B_TO_A",
      "tenGodViewer": "A.dayMaster",
      "tenGodTarget": "B.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH06.P2:ba-recognition-not-rating",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 세심한 관심은 A에게 어떤 지지가 될 수 있을까?",
    "coreMeaning": "친구를 알아봐 주는 관심과 행동을 계속 평가하는 관찰을 구별한다.",
    "additionalMeaning": "기억한 취향과 달라진 삶을 함께 확인해야 관심이 현재에 닿는다.",
    "conceptIds": [
      "frpr:concept:25",
      "frpr:concept:17",
      "frpr:concept:18"
    ],
    "positive": "A가 변한 선택을 설명할 수 있고 B가 새로운 모습을 알아갈 수 있다.",
    "risk": "B가 예전 모습과 비교하며 A가 변했다고 비난한다.",
    "bluntWeakness": "오래 알았다는 이유로 오늘의 친구를 대신 정의할 수는 없다.",
    "twist": "기억과 다른 선택을 듣는 순간이 오히려 친구를 새로 이해할 기회일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 A의 새 취미를 듣고 예전 취향과 다르다고 평가하기보다 이유를 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "현재의 선택과 공유하고 싶은 범위를 말한다.",
      "B": "과거 기억을 기준표가 아니라 새 질문의 시작으로 쓴다."
    },
    "counterexample": "A가 이야기하고 싶지 않은 변화는 친하다는 이유로 설명을 요구할 수 없다.",
    "distinction": "B의 개인 기억 강점 CH03.P3과 달리 그 관심을 받는 A의 현재 선택권이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_BA",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_BA",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:laurenceau",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
      "sar:facet:BOUNDARY:privacy"
    ],
    "roleContributions": [
      {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "도움 되는 강점은 현재의 변화를 알아보는 관심이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "실제 근거는 B의 독립 원천과 A가 허용한 대화 범위다.",
        "independentFact": false
      },
      {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 장면은 새로운 취미의 이유를 묻는 대화다.",
        "independentFact": false
      },
      {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "발휘 조건은 예전 모습을 기준으로 현재를 평가하지 않는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "B_TO_A",
      "tenGodViewer": "A.dayMaster",
      "tenGodTarget": "B.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH06.P3:ba-comparison-pressure",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 조언이나 비교는 언제 A에게 부담이 될까?",
    "coreMeaning": "성장을 바라는 말과 친구의 성과로 자기 가치를 평가하는 말을 구별한다.",
    "additionalMeaning": "질투·경쟁·열등감은 실제 확인 전에는 어느 쪽에도 부여하지 않는다.",
    "conceptIds": [
      "frpr:concept:25",
      "frpr:concept:12",
      "frpr:concept:17"
    ],
    "positive": "각자가 원하는 성장 목표를 말하고 필요한 지원만 고를 수 있다.",
    "risk": "B가 다른 친구의 성취와 A를 비교하며 동기를 준다고 여긴다.",
    "bluntWeakness": "친구의 속도를 내 기준으로 채점하는 말은 응원과 다르다.",
    "twist": "상대의 성취를 축하하면서 비교 이야기는 멈추는 두 선택이 함께 가능하다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 다른 사람의 근황을 A의 진로 선택과 비교하려는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "축하할 일과 불편한 비교를 나누어 말한다.",
      "B": "비교 대신 A가 원하는 목표와 도움이 필요한지 묻는다."
    },
    "counterexample": "A가 먼저 비교 자료를 요청했다면 동의한 분석과 원치 않는 평가는 다르다.",
    "distinction": "CH05.P4의 다른 친구 통제와 달리 B의 비교가 A의 자기 판단에 남기는 영향이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_BA",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_BA",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:krems",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:AUTONOMY:choice-ownership",
      "sar:facet:COMMUNICATION_STYLE:contextual-delivery"
    ],
    "roleContributions": [
      {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "부담 행동은 다른 사람의 성과를 A에게 요구할 기준으로 쓰는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "검증된 차이 없이 경쟁이나 질투를 성향으로 붙이지 않는다.",
        "independentFact": false
      },
      {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "B의 의도가 자극이어도 A는 평가로 받을 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "악화 조건은 A의 거절을 의욕 부족으로 해석하는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "B_TO_A",
      "tenGodViewer": "A.dayMaster",
      "tenGodTarget": "B.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH06.P4:ba-availability-boundary",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 자신의 한계를 알리는 것이 A에게 어떤 도움이 될까?",
    "coreMeaning": "도움을 못 주는 한계와 친구를 거절하는 뜻을 분리한다.",
    "additionalMeaning": "가능한 작은 지원과 지금은 할 수 없는 지원을 함께 말할 수 있다.",
    "conceptIds": [
      "frpr:concept:25",
      "frpr:concept:13",
      "frpr:concept:14"
    ],
    "positive": "A가 다른 도움을 찾거나 요청의 범위를 조절할 정보를 얻는다.",
    "risk": "B가 불가능한 부탁을 받아들인 뒤 잠적하거나 원망한다.",
    "bluntWeakness": "해 줄 수 없는 약속은 좋은 마음만으로 지켜지지 않는다.",
    "twist": "일찍 말한 한계가 늦게 무너진 약속보다 친구에게 유용한 정보일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 이번 이사는 도울 수 없지만 짧게 물품 목록은 볼 수 있다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "B의 불가능한 몫을 관계 평가와 분리하고 다른 방안을 찾는다.",
      "B": "가능한 도움의 종류·시간과 불가능한 범위를 명확히 말한다."
    },
    "counterexample": "작은 대안도 감당할 수 없다면 대신할 일을 반드시 제시할 의무는 없다.",
    "distinction": "B의 지지 요청 CH03.P2와 달리 B가 제공 가능한 범위를 A에게 알리는 반대 역할이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "DIRECTION_BA",
        "sourceRef": "frpr:inventory:recipient-ten-god",
        "requirement": "기존 producer의 방향 ID와 수신자 일간 기준 십성만 사용. 연구 정의에서 실제 효과를 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "PAIR_BA",
        "sourceRef": "frpr:inventory:mbti-pair",
        "requirement": "해당 입력 유형 두 사람의 원본 방향 참고만 검토. 일반 Pair로 실제 수신 경험이나 개인 성향을 확정하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:feeney",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:CARE:sustainable-care",
      "sar:facet:DUTY:promise-update"
    ],
    "roleContributions": [
      {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "조정할 행동은 할 수 없는 약속을 미리 알리는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A의 필요는 요청된 종류와 긴급성을 직접 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "실천은 가능한 도움의 범위를 작게 정하거나 이번에는 거절하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "B→A의 가능성은 A가 그 정보를 바탕으로 선택을 수정할 때 생긴다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": "B_TO_A",
      "tenGodViewer": "A.dayMaster",
      "tenGodTarget": "B.dayMaster",
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH07.P1:contact-interpretation-gap",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "연락 간격이 다를 때 무엇 때문에 서운해질까?",
    "coreMeaning": "연락의 차이와 상대가 나를 소중히 여기지 않는다는 해석을 분리한다.",
    "additionalMeaning": "빈도·채널·급한 연락·평소 근황은 서로 다른 기대다.",
    "conceptIds": [
      "frpr:concept:6",
      "frpr:concept:19"
    ],
    "positive": "불일치의 대상을 특정하면 우정의 전부를 평가하지 않고 조정할 수 있다.",
    "risk": "답장이 늦은 사실에서 무시·소외·일방성을 곧바로 확정한다.",
    "bluntWeakness": "읽은 시간은 친구의 마음을 측정하는 계기판이 아니다.",
    "twist": "연락을 줄이는 합의와 급할 때 연결할 방법을 정하는 일이 함께 가능하다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 긴 메시지를 보내고 B가 바쁜 주에 짧게만 답한 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "필요했던 반응과 시점을 구체적으로 말한다.",
      "B": "답할 수 있었던 범위와 간격의 이유를 필요한 만큼 설명한다."
    },
    "counterexample": "반복적으로 명시한 긴급 요청을 무시한 문제는 평소의 느린 연락과 다르다.",
    "distinction": "CH01.P4의 전체 기대와 달리 특정 연락에서의 사실·해석·필요를 나눈다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:EXPRESSION:receipt-check",
      "sar:facet:RELATION_STYLE:contact-range"
    ],
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "중요한 차이는 연락 간격 자체보다 그 간격에 붙인 의미일 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "각자의 성향은 각자 source와 실제 가용 시간을 함께 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "같은 짧은 답도 관심 확인과 대화 종료로 다르게 이해할 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "답답함의 이유는 명시되지 않은 필요가 상대에게 전달되지 않은 데 있을 수 있다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH07.P2:clash-not-failed-friendship",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "검출된 충돌과 실제 다툼을 어떻게 구별할까?",
    "coreMeaning": "교차 충·해 등의 계산과 실제 갈등 사건은 다른 층위다.",
    "additionalMeaning": "미지원 형·파·원진을 지원 관계로 대체하거나 지지 일부로 관계를 완성하지 않는다.",
    "conceptIds": [
      "frpr:concept:19",
      "frpr:concept:26"
    ],
    "positive": "서로 다르게 반응할 수 있는 지점을 질문하고 실제 장면에서 확인할 수 있다.",
    "risk": "충이 있으니 오래 못 간다거나 합이 없으니 맞지 않는다고 단정한다.",
    "bluntWeakness": "사주에서 검출된 기호는 친구가 잘못했다는 증거가 아니다.",
    "twist": "관계가 미검출이어도 조정 질문은 실제 필요에서 찾을 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "의견이 다른 두 친구가 먼저 각자의 이유를 설명해 보는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "계산 기호를 상대의 잘못으로 제시하지 않는다.",
      "B": "실제 불편한 행동과 요청할 변경을 따로 말한다."
    },
    "counterexample": "계산상 충이 있어도 현재 다툼이 전혀 없을 수 있다.",
    "distinction": "CH01.P2는 관계 구성의 범위, 여기서는 갈등 추론의 금지선이 핵심이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:inventory:canonical-pair",
        "requirement": "양쪽 실제 소유자·기둥 refs·지원 kind·성립 조건·전통 검토 상태를 모두 확인. 미지원 관계 보류.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:COMMUNICATION_STYLE:intent-check",
      "sar:facet:BOUNDARY:role-border"
    ],
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "실제 교차 관계가 있거나 없다는 계산 사실만 보존한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "충돌의 쉬운 의미도 전통 해석의 검증 상태와 조건을 유지한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "반응의 차이는 실제 양쪽 source와 장면 없이 창작하지 않는다.",
        "independentFact": false
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "긍정적 여지는 기호 하나로 관계 전체를 판정하지 않는 데 있다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": true,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH07.P3:unrequested-ledger",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "호의를 주고받는데 왜 억울함이 생길 수 있을까?",
    "coreMeaning": "요청·수락·부담·보답 기대가 다른데 하나의 호의 장부로 합칠 때 마찰이 생길 수 있다.",
    "additionalMeaning": "시간·돈·소개·감정 노동은 같은 단위로 상쇄되는 의무가 아니다.",
    "conceptIds": [
      "frpr:concept:13",
      "frpr:concept:14",
      "frpr:concept:19"
    ],
    "positive": "각자가 수락한 몫과 무리한 몫을 구분해 다음 부탁을 조절할 수 있다.",
    "risk": "한쪽은 자발적 제공이라 생각하고 다른 쪽은 미리 약속한 보답이라 여긴다.",
    "bluntWeakness": "말하지 않은 호의 장부의 잔액을 상대에게 갚으라고 할 수는 없다.",
    "twist": "서로 덜 돕기로 하는 합의가 우정을 덜 소중히 여긴다는 뜻은 아닐 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "모임 예약을 맡은 친구가 다음 만남에는 다른 사람이 정하길 바라는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인이 먼저 맡은 일과 실제 요청받은 일을 구분한다.",
      "B": "수락한 부탁의 범위와 다음에 감당할 몫을 말한다."
    },
    "counterexample": "서로 명확히 합의한 공동 비용과 역할은 단순 호의로 지워지지 않는다.",
    "distinction": "CH05.P3의 A→B 부담에서 확장하되 반복 비용의 실제 합의 여부가 새 정보다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:refusal",
      "sar:facet:CARE:sustainable-care"
    ],
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "반복 문제는 주고받은 양보다 기대의 미합의일 수 있다.",
        "independentFact": false
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "방향별 원인은 누가 요청·수락·약속했는지 따로 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "악화 장면은 예전 도움을 현재의 동의처럼 사용하는 가정이다.",
        "independentFact": false
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "직설적 결론은 호의로 상대의 거절권을 살 수 없다는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH07.P4:third-party-context",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "모임의 다른 친구 때문에 서운할 때 무엇을 확인해야 할까?",
    "coreMeaning": "초대에서 빠진 사실·자원 제한·당사자의 해석·의도적 배제는 구별한다.",
    "additionalMeaning": "제3자의 이야기를 전달하는 행위와 당사자에게 직접 확인하는 행위는 다르다.",
    "conceptIds": [
      "frpr:concept:12",
      "frpr:concept:15",
      "frpr:concept:19"
    ],
    "positive": "서로의 다른 관계와 둘만의 필요를 동시에 말할 수 있다.",
    "risk": "친구가 다른 사람과 만났다는 사실을 배신이나 질투의 확정 근거로 삼는다.",
    "bluntWeakness": "친구의 다른 관계가 내 자리를 빼앗았다는 결론부터 내릴 수는 없다.",
    "twist": "모든 모임에 함께하지 않아도 둘 사이의 약속을 따로 만들 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "인원 제한이 있는 모임 사진을 보고 한 친구가 서운함을 느낀다는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "사진에서 확인한 사실과 본인이 느낀 뜻을 구분해 묻는다.",
      "B": "설명 가능한 초대 조건과 둘의 실제 약속을 분리해 답한다."
    },
    "counterexample": "의도적인 반복 배제나 모욕이 확인된 경우 단순 오해로 축소하지 않는다.",
    "distinction": "CH05.P4의 통제 행동과 달리 제3자 맥락에서 사실과 해석이 갈리는 지점이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:krems",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
      "sar:facet:BOUNDARY:privacy"
    ],
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "주의 상황은 제3자를 통해 소식이 전해지는 경우다.",
        "independentFact": false
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A의 기대는 함께 초대받는 것인지 별도 만남인지 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "B의 기대는 다른 모임의 자유인지 기존 약속의 유지인지 확인한다.",
        "independentFact": false
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "전달되는 뜻은 확인 전에는 어느 쪽에도 실제 의도로 붙이지 않는다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": []
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH08.P1:facts-before-repair",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH08.P1",
    "mode": "REPAIR",
    "readerQuestion": "앞선 서운함을 풀려면 무엇부터 같이 확인해야 할까?",
    "coreMeaning": "사실·해석·요청을 분리한 뒤 같은 문제에 대한 조정을 고른다.",
    "additionalMeaning": "갈등 후보가 있다는 이유만으로 실제 다툼과 화해 의무를 만들지 않는다.",
    "conceptIds": [
      "frpr:concept:19",
      "frpr:concept:20"
    ],
    "positive": "누가 옳은지의 판정보다 바꿀 행동을 찾을 정보가 생긴다.",
    "risk": "당사자 설명 전에 성향 차이라는 말로 실제 피해를 덮는다.",
    "bluntWeakness": "말을 부드럽게 바꿔도 무엇이 잘못 전달됐는지 모르면 같은 일이 반복될 수 있다.",
    "twist": "오해가 아니라 실제 약속 위반이었다고 확인하는 것이 회복의 시작일 수도 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "서운했던 연락 한 건을 놓고 보낸 내용·가능했던 응답·바라는 변경을 나누는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "자신이 확인한 사실과 해석을 따로 말한다.",
      "B": "자신이 의도한 뜻과 실제 할 수 있는 변경을 나눈다."
    },
    "counterexample": "당사자가 대화를 원하지 않거나 안전하지 않으면 직접 확인을 강요하지 않는다.",
    "distinction": "CH07은 마찰의 발생 조건, 이 문단은 같은 문제의 사실 확인 절차다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:lewicki",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:COMMUNICATION_STYLE:intent-check",
      "sar:facet:BOUNDARY:renegotiation"
    ],
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞선 갈등 질문은 실제 표시된 CH07의 호환 후보에서만 회수한다.",
        "independentFact": false
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "실제 원인은 성향 단정이 아니라 양쪽 확인 가능한 사실로 검토한다.",
        "independentFact": false
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "각자 필요한 반응과 바꿀 수 있는 행동을 구분한다.",
        "independentFact": false
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "조정 기준은 상대의 동의와 안전, 실제 이행 가능성이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH07.P1:contact-interpretation-gap"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P3:unrequested-ledger"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P4:third-party-context"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH08.P2:a-apology-scope",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH08.P2",
    "mode": "REPAIR",
    "readerQuestion": "A가 사과하거나 행동을 바꿀 때 무엇을 분명히 해야 할까?",
    "coreMeaning": "사과의 표현·자신이 한 행동의 책임·다음 변경을 구분한다.",
    "additionalMeaning": "사과를 했다고 B의 용서나 재공개 의무가 생기지 않는다.",
    "conceptIds": [
      "frpr:concept:8",
      "frpr:concept:20"
    ],
    "positive": "A가 바꿀 수 있는 행동을 구체화하고 B가 지켜볼 범위를 고를 수 있다.",
    "risk": "A가 의도는 좋았다는 설명만으로 B의 경험을 지운다.",
    "bluntWeakness": "미안하다는 말을 했다고 신뢰가 자동 복구되지는 않는다.",
    "twist": "작은 약속을 실제로 지키는 시간이 긴 해명보다 확인할 정보를 줄 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "A가 허락 없이 전한 이야기를 인정하고 이후 공유 전에 묻겠다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인이 한 행동과 다시 하지 않을 행동, 필요한 정정의 범위를 말한다.",
      "B": "사과를 들을지와 이후 정보 공유 범위를 본인이 고른다."
    },
    "counterexample": "오해였다고 확인되면 하지 않은 행동의 책임까지 떠안을 필요는 없다.",
    "distinction": "회복 절차 중 A의 변경이며 B가 한계를 말하는 CH08.P3과 독립적이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:lewicki",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:DUTY:promise-update",
      "sar:facet:BOUNDARY:privacy"
    ],
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A의 전략은 의도 설명과 행동 책임을 분리하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "이유는 사과 수락이 B의 선택이기 때문이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "실천은 확인된 행동 하나와 재발을 막을 변경 하나를 말하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B에게 남는 변화는 B가 실제로 확인한 뒤에만 평가한다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH07.P3:unrequested-ledger"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P4:third-party-context"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH08.P3:b-repair-boundary",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH08.P3",
    "mode": "REPAIR",
    "readerQuestion": "B가 관계를 회복할 때 어떤 범위를 다시 정할 수 있을까?",
    "coreMeaning": "용서·다시 연락하기·예전만큼 가까워지기는 서로 다른 선택이다.",
    "additionalMeaning": "함께할 활동과 이야기할 주제를 좁혀도 관계를 전부 끝냈다고 단정하지 않는다.",
    "conceptIds": [
      "frpr:concept:20",
      "frpr:concept:22",
      "frpr:concept:23"
    ],
    "positive": "B가 안전하고 가능한 범위부터 새로 선택할 수 있다.",
    "risk": "B가 괜찮다고 말하면 예전의 모든 접근권이 돌아온다고 여긴다.",
    "bluntWeakness": "사과를 받아 주는 것과 예전처럼 지내는 것은 같은 약속이 아니다.",
    "twist": "당장 친밀함을 회복하지 않는 선택이 가능한 관계 범위를 더 정확히 알려 줄 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "B가 모임에서는 만나되 당분간 개인 고민은 나누지 않겠다고 말하는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "B가 새로 정한 범위를 벌이나 시험으로만 해석하지 않는다.",
      "B": "어떤 활동과 정보부터 다시 나눌지 직접 선택한다."
    },
    "counterexample": "관계 유지 의사가 없거나 위해가 반복되면 단계적 회복을 권하지 않는다.",
    "distinction": "CH08.P2의 사과 내용과 달리 수신자가 회복의 범위와 속도를 정하는 질문이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:renegotiation",
      "sar:facet:AUTONOMY:choice-ownership"
    ],
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B의 전략은 예전 관계를 한 번에 복원하지 않고 범위를 고르는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "이유는 용서와 친밀감의 회복이 별도 선택이기 때문이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "다른 실천 방법은 연락·활동·공개의 범위를 각각 정하는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A에게 남는 변화는 새 조건을 지킬 수 있는지 확인할 기회다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH07.P1:contact-interpretation-gap"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P4:third-party-context"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH08.P4:repair-recheck",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH08.P4",
    "mode": "REPAIR",
    "readerQuestion": "둘이 합의한 조정이 실제로 도움이 됐는지 어떻게 알까?",
    "coreMeaning": "좋은 다짐과 이행 가능한 작은 합의를 구별한다.",
    "additionalMeaning": "연락·비밀·돈·모임은 문제에 맞는 확인 기준을 각각 정해야 한다.",
    "conceptIds": [
      "frpr:concept:20",
      "frpr:concept:21",
      "frpr:concept:22"
    ],
    "positive": "해 본 뒤 부담과 오해가 줄었는지 같이 확인할 수 있다.",
    "risk": "서로 배려하자는 말만 남기고 같은 요청과 비용을 반복한다.",
    "bluntWeakness": "행동이 하나도 달라지지 않는 합의는 아직 다음 만남의 정보가 아니다.",
    "twist": "합의를 수정하거나 중단하는 것이 실패가 아니라 현실 확인일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "두 친구가 한 달 동안 급한 연락은 전화로, 근황은 여유 있을 때 답하기로 해 보는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인이 바꿀 행동과 감당할 수 있는 기간을 밝힌다.",
      "B": "본인의 변경과 확인하고 싶은 결과를 따로 말한다."
    },
    "counterexample": "계속 조정해도 한쪽에게 위험·강요·손실이 남으면 관계 유지 목표를 우선하지 않는다.",
    "distinction": "CH08.P1의 사실 확인 다음 단계로 이행·재검토의 기준을 다룬다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:renegotiation",
      "sar:facet:DUTY:promise-update"
    ],
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "공동 목표는 실제 표시된 갈등의 부담을 줄일 작은 변경이다.",
        "independentFact": false
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A의 역할은 본인이 동의한 행동에 한정한다.",
        "independentFact": false
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B의 역할도 별도로 동의한 행동이며 같은 양보가 필수는 아니다.",
        "independentFact": false
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "관계별 원칙은 재검토와 거절, 안전한 중단의 여지를 남기는 것이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH07.P1:contact-interpretation-gap"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P3:unrequested-ledger"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH07.P4:third-party-context"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH09.P1:recall-chosen-enjoyment",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH09.P1",
    "mode": "RECALL",
    "readerQuestion": "앞에서 확인한 좋은 힘 중 실제로 이어갈 수 있는 것은 무엇일까?",
    "coreMeaning": "좋았던 조건을 선택한 활동과 각자의 가능한 범위로 회수한다.",
    "additionalMeaning": "후보에 있던 장점을 실제로 소개한 내용처럼 요약하지 않는다.",
    "conceptIds": [
      "frpr:concept:21",
      "frpr:concept:3"
    ],
    "positive": "앞서 확인한 참여 방식이 다음 만남의 선택 기준이 될 수 있다.",
    "risk": "이전 근거와 무관한 평생 우정의 결론을 덧붙인다.",
    "bluntWeakness": "좋은 말로 마무리한다고 앞에서 없던 강점이 생기지는 않는다.",
    "twist": "함께하는 활동을 작게 정하는 것이 오래 이어갈 가능한 조건일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "앞에서 소개된 공동 활동을 다음에 짧게 다시 해 볼지 묻는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "앞서 표시된 본인의 기여 중 다음에도 가능한 것을 고른다.",
      "B": "앞서 표시된 본인의 조건과 지금의 가능 범위를 확인한다."
    },
    "counterexample": "이전 후보가 표시되지 않았거나 현재 상황이 바뀌면 회수하지 않는다.",
    "distinction": "CH04의 새로운 설명이 아니라 실제 표시된 긍정 조건만 추적하는 회수다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:hall",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:RELATION_STYLE:shared-participation",
      "sar:facet:AUTONOMY:choice-ownership"
    ],
    "roleContributions": [
      {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "긍정적 특징은 실제 표시된 CH04의 호환 의미에서만 가져온다.",
        "independentFact": false
      },
      {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "명리·MBTI는 앞서 확인된 양쪽 실제 root를 그대로 추적한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "함께하는 장점도 같은 사람과 같은 활동 맥락에서만 회수한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "지속 조건은 미래 보장이 아니라 다시 선택할 수 있는 범위다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH04.P1:shared-interest-specific"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH04.P2:difference-with-choice"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH04.P3:low-performance-company"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH09.P2:recall-symbol-limits",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH09.P2",
    "mode": "RECALL",
    "readerQuestion": "명리에서 설명한 좋은 가능성을 생활에서 어디까지 활용할까?",
    "coreMeaning": "좋은 기운은 실제 검출·해석 조건·앞선 표시 이력이 함께 있을 때만 회수한다.",
    "additionalMeaning": "근거가 부족하면 일반적인 행운으로 채우지 않는다.",
    "conceptIds": [
      "frpr:concept:21",
      "frpr:concept:26"
    ],
    "positive": "관계의 상징을 실제 선택을 점검하는 제한된 참고로 사용할 수 있다.",
    "risk": "합이나 귀인 표현으로 우정의 깊이·지속·성공을 보장한다.",
    "bluntWeakness": "좋은 기운이라는 말은 상대를 믿어도 된다는 보증서가 아니다.",
    "twist": "설명할 근거가 없다고 멈추는 것이 친구에 대한 잘못된 확신을 줄일 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "앞에서 확인한 관계 설명을 참고하되 다음 약속은 실제 시간과 동의로 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "명리 설명을 실제 약속이나 비밀 공개의 근거로 대체하지 않는다.",
      "B": "앞서 제시된 해석의 조건과 미검출 범위를 함께 확인한다."
    },
    "counterexample": "현재 원고에 해당 근거가 제시되지 않았으면 새로운 상징을 추가하지 않는다.",
    "distinction": "CH01.P2의 새로운 관계 설명과 달리 같은 계산·소유·조건·표시를 회수한다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:inventory:canonical-pair",
        "requirement": "양쪽 실제 소유자·기둥 refs·지원 kind·성립 조건·전통 검토 상태를 모두 확인. 미지원 관계 보류.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:privacy",
      "sar:facet:MEANING:purpose-check"
    ],
    "roleContributions": [
      {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "검증된 좋은 기운이 실제로 표시된 경우에만 해당 의미를 회수한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "근거의 전통 검토 상태와 실제 refs를 끝까지 보존한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "가능성은 관계 전체의 미래가 아니라 앞서 제시한 조건에 한정한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "현실적 활용은 시간·동의·경계의 직접 확인이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": true,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH01.P2:symbol-not-trust"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH09.P3:recall-changed-lives",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH09.P3",
    "mode": "RECALL",
    "readerQuestion": "각자의 생활이 달라져도 어떤 선택을 다시 할 수 있을까?",
    "coreMeaning": "생활 변화에 맞게 관계의 형태를 바꾸는 것과 우정의 가치를 지우는 것을 구별한다.",
    "additionalMeaning": "연락의 재개·활동의 축소·거리 두기·종료는 당사자의 별도 선택이다.",
    "conceptIds": [
      "frpr:concept:16",
      "frpr:concept:17",
      "frpr:concept:18",
      "frpr:concept:21",
      "frpr:concept:22",
      "frpr:concept:23"
    ],
    "positive": "앞에서 합의한 조정 원칙을 현재의 가용 시간과 필요에 맞게 재검토할 수 있다.",
    "risk": "예전 방식만 진짜 우정이라며 현재의 삶을 무시한다.",
    "bluntWeakness": "오래 알고 지냈다는 이유로 지금의 삶을 예전 자리에 묶어 둘 수는 없다.",
    "twist": "덜 자주 만나도 서로 선택한 범위가 분명하면 다른 형태의 관계가 가능할 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "가상의 이사 이후 두 친구가 예전 주간 만남 대신 가능한 연락 방식을 다시 묻는 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "현재 가능한 시간과 유지하고 싶은 활동을 말한다.",
      "B": "예전 빈도와 비교해 평가하기보다 지금의 범위에 동의할지 고른다."
    },
    "counterexample": "한쪽만 계속 조정을 감당하거나 위해가 반복되면 유지가 최선이라고 결론내리지 않는다.",
    "distinction": "CH08의 즉시 조정을 새 생활 맥락에 회수하며 실제 이사나 오래된 우정을 가정하지 않는다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:BOUNDARY:renegotiation",
      "sar:facet:STABILITY:protective-change"
    ],
    "roleContributions": [
      {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "조율 원칙은 앞서 실제 표시된 회복·경계 후보에서만 회수한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "개인별 이유는 각자의 현재 맥락과 자기 근거를 유지한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "실천은 연락·활동·공개 범위를 지금 가능한 조건으로 다시 묻는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "지속 조건은 같은 방식의 고수가 아니라 상호 선택과 안전이다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH08.P3:b-repair-boundary"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH08.P4:repair-recheck"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  },
  {
    "id": "frpr:material:CH09.P4:recall-without-prophecy",
    "relationshipType": "friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "address": "CH09.P4",
    "mode": "RECALL",
    "readerQuestion": "우리라는 관계를 어떤 기준으로 기억하면 좋을까?",
    "coreMeaning": "앞서 확인된 상호작용만 묶어 서로의 삶을 존중할 선택 기준으로 남긴다.",
    "additionalMeaning": "평생·운명·절교 예언이나 새 실제 경험을 마지막 문장에 만들지 않는다.",
    "conceptIds": [
      "frpr:concept:21",
      "frpr:concept:22",
      "frpr:concept:23",
      "frpr:concept:26"
    ],
    "positive": "각자의 가능 범위와 우정의 좋은 순간을 함께 기억할 수 있다.",
    "risk": "모든 차이를 극복하고 계속 가까워야 한다는 의무로 마무리한다.",
    "bluntWeakness": "좋은 친구의 결론은 상대의 남은 삶에 대한 소유권이 아니다.",
    "twist": "관계가 변하더라도 앞서 확인한 좋은 의미와 현재의 거절권은 함께 남을 수 있다.",
    "scene": {
      "status": "hypothetical_only",
      "text": "앞서 표시된 좋은 활동과 조정 원칙을 다음 만남의 짧은 기준으로 고르는 가상 장면.",
      "isCustomerHistory": false
    },
    "actions": {
      "A": "본인의 선택과 상대의 별도 삶을 함께 인정한다.",
      "B": "지금 동의할 수 있는 관계의 범위만 답한다."
    },
    "counterexample": "표시된 선행 의미가 없거나 서로 다른 사람·상황의 후보뿐이면 연결하지 않는다.",
    "distinction": "CH09.P1의 활동 회수와 달리 독점·미래 보장 없이 마지막 기준을 묶는 역할이다.",
    "ownedSources": [
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "A",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:personal-natal",
        "requirement": "실제 해당 개인의 natal evidence와 source 의미·성립 조건의 연결을 별도로 검토. 정의의 존재만으로 성향을 승인하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-mbti",
        "requirement": "본인의 입력 유형·허용 domain·원천 상태·실제 root. Pair 참고나 상대 trait로 개인을 대체하지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "B",
        "sourceRef": "frpr:inventory:individual-fusion",
        "requirement": "같은 개인의 실제 명리 root와 실제 MBTI root 및 같은 Context가 함께 필요. Pair Fusion을 새로 만들지 않음.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:deci",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      },
      {
        "owner": "GUIDANCE",
        "sourceRef": "frpr:source:khullar",
        "requirement": "문헌의 범위·한계와 편집 적용 분리. 실제 고객 관찰·타입 효과의 증명 아님.",
        "notPersonObservation": true
      }
    ],
    "facetRefs": [
      "sar:facet:AUTONOMY:choice-ownership",
      "sar:facet:BOUNDARY:renegotiation"
    ],
    "roleContributions": [
      {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "특징적인 상호작용은 실제 표시 이력과 같은 양쪽 근거에서만 회수한다.",
        "independentFact": false
      },
      {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "함께 만드는 가치는 활동·지원·경계 중 이미 소개된 호환 의미다.",
        "independentFact": false
      },
      {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "기억할 기준은 상대를 대신 판단하지 않고 가능한 선택을 묻는 것이다.",
        "independentFact": false
      },
      {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "우정의 결론은 관계 지속을 보장하지 않으며 변화와 거리 둘 선택을 남긴다.",
        "independentFact": false
      }
    ],
    "actualRelationshipFacts": {
      "oldFriends": "UNKNOWN",
      "childhoodFriends": "UNKNOWN",
      "sameSchool": "UNKNOWN",
      "sameWorkplace": "UNKNOWN",
      "regularMeetings": "UNKNOWN",
      "pastConflict": "UNKNOWN",
      "moneyTransactions": "UNKNOWN",
      "sharedSecrets": "UNKNOWN",
      "jealousy": "UNKNOWN",
      "oneSidedRelationship": "UNKNOWN",
      "currentlyEstranged": "UNKNOWN",
      "closeness": "UNKNOWN",
      "friendshipDuration": "UNKNOWN",
      "currentContactFrequency": "UNKNOWN"
    },
    "binding": {
      "ownerRoots": [
        "A",
        "B"
      ],
      "direction": null,
      "tenGodViewer": null,
      "tenGodTarget": null,
      "actualCanonicalMembershipRequired": false,
      "actualContextRequired": [
        "actual_request_and_consent",
        "current_available_time",
        "observed_behavior_not_inferred_history",
        "safe_voluntary_interaction"
      ],
      "pairIsIndividualFact": false,
      "allAncestorOwnerDomainContextReviewRequired": true,
      "samePersonFusionRootsRequired": true,
      "insufficientEvidence": "withhold_not_invent",
      "sourceUsePolicy": "only_systems_actually_supporting_claim",
      "missingMbti": "withhold_own_mbti_pair_and_fusion_claims",
      "validNatalNotDiscarded": true,
      "introducedGroups": [
        {
          "materialIds": [
            "frpr:material:CH04.P2:difference-with-choice"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH05.P4:ab-other-friends"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH06.P4:ba-availability-boundary"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        },
        {
          "materialIds": [
            "frpr:material:CH08.P3:b-repair-boundary"
          ],
          "allActuallyDisplayed": true,
          "samePeopleContextRootsAndDirection": true,
          "compatibleDisplayedSubsetOnly": true
        }
      ]
    },
    "origin": "authored_conditional_editorial_research",
    "empiricalFriendshipPrediction": false,
    "newCalculatedFacts": 0
  }
];
