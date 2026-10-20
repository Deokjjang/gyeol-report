import type { ClaimStudy } from "./researchTypes";

/** Offline source-catalog references only. No runtime import, resolver or binding. */
export const KOREAN_CLAIM_RESEARCH: readonly ClaimStudy[] = [
  {
    "id": "ker:claim:comprehensive",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:comprehensive",
    "meaningIdentity": "ker:meaning:comprehensive",
    "productKey": "saju_mbti_full",
    "category": null,
    "originalCoreMeaning": "먼저 이해해야 움직일 수 있는 설명 탐색형 인물상 후보",
    "fixtureClaim": "이해할 이유를 먼저 찾는 면이 실제로 확인된다면, 설명을 살핀 뒤 판단하려는 인물상 후보로 읽을 수 있습니다.",
    "semanticUnits": [
      "이유 탐색의 확인",
      "조건부 인물상"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:209f2dd332aa98742549",
      "originalId": "cpr:material:CH01.P1:understand-before-answer",
      "recordSha256": "d5c8c83b8a93f53cdfbca3486e37add6093d216dbc463108043f5f23ddd06687",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "empiricalVerification": "not_established",
      "review": "conditional_editorial_research"
    },
    "owner": "person",
    "direction": "none",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:career",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:career",
    "meaningIdentity": "ker:meaning:career",
    "productKey": "career_money_study",
    "category": null,
    "originalCoreMeaning": "요청의 목적·완료 조건을 구분하는 착수 기능",
    "fixtureClaim": "업무를 시작할 때는 요청의 목적과 완료 조건을 나누어 확인하는 질문을 적용할 수 있습니다.",
    "semanticUnits": [
      "요청 목적",
      "완료 조건"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:36e7031d6b957b8e8af9",
      "originalId": "ckr:material:CH01.P1:request-framing",
      "recordSha256": "7898afcabf1677c724795136ca4a05ab1e719153b62162578a5c8fc904db4ec7",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "empiricalVerification": "not_established",
      "review": "conditional_editorial_research"
    },
    "owner": "person",
    "direction": "none",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:love",
    "meaningIdentity": "ker:meaning:love",
    "productKey": "love_marriage_child",
    "category": null,
    "originalCoreMeaning": "필요를 알아보는 관심과 동의한 도움을 건네는 행동을 나눠 사랑의 방식을 연구한다.",
    "fixtureClaim": "누군가를 돕고 싶은 상황이라면, 필요한 것을 알아보는 관심과 상대가 동의한 도움을 건네는 행동을 나누어 볼 수 있습니다.",
    "semanticUnits": [
      "필요 확인",
      "동의한 도움"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:2577a774ae93b5a02bc3",
      "originalId": "lkr:material:CH01.P1:care-asked",
      "recordSha256": "1d2755961f4decb208074932f613298d8a34b535bef5668e2800a842d5f2782c",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "empiricalVerification": "not_established",
      "review": "conditional_editorial_research"
    },
    "owner": "person",
    "direction": "none",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-love",
    "meaningIdentity": "ker:meaning:pair-love",
    "productKey": "saju_mbti_compatibility",
    "category": "love",
    "originalCoreMeaning": "반응으로 관심을 확인하는 필요와 생각할 시간을 지키는 필요의 접점을 연구한다.",
    "fixtureClaim": "두 사람의 실제 필요가 확인된다면, 반응으로 관심을 확인하려는 필요와 생각할 시간을 지키려는 필요가 만날 조건을 살펴볼 수 있습니다.",
    "semanticUnits": [
      "반응의 필요",
      "생각할 시간",
      "양쪽 실제 확인"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:f608d6b3a7a9320d4a58",
      "originalId": "clr:material:CH01.P1:response-and-thought",
      "recordSha256": "fdd4e5d8ecf6e2a194a461ff1f1fe67a15f3805eee4af78ddb80663ff56d1fe0",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-marriage",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-marriage",
    "meaningIdentity": "ker:meaning:pair-marriage",
    "productKey": "saju_mbti_compatibility",
    "category": "marriage",
    "originalCoreMeaning": "공동생활을 선택한다면 유지할 기본 약속과 바꿀 수 있는 방식을 먼저 구분하는 조합을 연구한다.",
    "fixtureClaim": "공동생활을 선택한다면, 유지할 기본 약속과 상황에 따라 바꿀 방법을 먼저 구분해볼 수 있습니다.",
    "semanticUnits": [
      "공동생활 조건",
      "약속과 방법 구분"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:8b8b78c40298c00c5487",
      "originalId": "cmpr:material:CH01.P1:predictability-and-revision",
      "recordSha256": "eb22baf63923614535ae1046c2e156e532a178cd9bc6d0d26ec9f320b093a388",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-parent-child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-parent-child",
    "meaningIdentity": "ker:meaning:pair-parent-child",
    "productKey": "saju_mbti_compatibility",
    "category": "parentChild",
    "originalCoreMeaning": "부모가 바라는 꾸준함과 자녀의 관심 탐색을 서로 다른 책임의 질문으로 연구한다.",
    "fixtureClaim": "부모의 꾸준함에 대한 기대와 자녀의 관심 탐색이 확인된다면, 두 필요를 서로 다른 책임의 질문으로 살펴볼 수 있습니다.",
    "semanticUnits": [
      "부모 기대 확인",
      "자녀 탐색 확인",
      "책임의 구분"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:d87197b16b1907002952",
      "originalId": "pcpr:material:CH01.P1:predictability-with-room-to-try",
      "recordSha256": "05f677cb1841841f2a93dbf57a4c4e7a756523b74d93cb8294a7db7bef75c557",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-coworker",
    "meaningIdentity": "ker:meaning:pair-coworker",
    "productKey": "saju_mbti_compatibility",
    "category": "coworker",
    "originalCoreMeaning": "A의 사전 사고 시간과 B의 현장 대응 선호를 착수 전 정보의 질문으로 구분한다.",
    "fixtureClaim": "A의 사전 사고 시간과 B의 현장 대응 선호가 실제로 확인된다면, 착수 전에 어떤 정보가 필요한지 서로 나누어 물어볼 수 있습니다.",
    "semanticUnits": [
      "A 사전 사고",
      "B 현장 대응",
      "착수 전 정보",
      "양쪽 조건 확인"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:baa6c8d1d7187eece097",
      "originalId": "cwpr:material:CH01.P1:question-before-start",
      "recordSha256": "ae6dd80d9ce2077aa9148386625ef8f42f7577f42a4e3b0d066b57ca6455cd40",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-manager-report",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-manager-report",
    "meaningIdentity": "ker:meaning:pair-manager-report",
    "productKey": "saju_mbti_compatibility",
    "category": "managerReport",
    "originalCoreMeaning": "목표를 정리하는 상사와 실행 경로를 확인하는 팀원의 접점",
    "fixtureClaim": "목표를 정리하는 상사와 실행 경로를 확인하는 팀원의 조건이 확인된다면, 정할 목표와 확인할 방법의 접점을 살펴볼 수 있습니다.",
    "semanticUnits": [
      "상사 목표",
      "팀원 경로",
      "역할 조건"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:3a24f834e990095106e1",
      "originalId": "mrpr:material:CH01.P1:goal-method-interface",
      "recordSha256": "dc410d3619f06d8f22dc06680a87017211f82ea6dd606344b2314c5037e2a8ac",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-business-partner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-business-partner",
    "meaningIdentity": "ker:meaning:pair-business-partner",
    "productKey": "saju_mbti_compatibility",
    "category": "businessPartner",
    "originalCoreMeaning": "가능성과 실제 필요를 다른 질문으로 보기",
    "fixtureClaim": "함께 사업을 검토한다면, 제안의 가능성과 실제 필요를 서로 다른 질문으로 살펴볼 수 있습니다.",
    "semanticUnits": [
      "사업 검토 조건",
      "가능성",
      "실제 필요"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:967881edd5da393d6674",
      "originalId": "bppr:material:CH01.P1:idea-demand-interface",
      "recordSha256": "9fe7f3009fb7adf5f1758c7de277d0904650943f459d82bac60490253a256399",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "review": "conditional_editorial_research"
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:pair-friendship",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:pair-friendship",
    "meaningIdentity": "ker:meaning:pair-friendship",
    "productKey": "saju_mbti_compatibility",
    "category": "friendship",
    "originalCoreMeaning": "만날 기회와 다시 시간을 내고 싶은 선택은 다르다.",
    "fixtureClaim": "친구를 만날 기회가 있다는 것과 다시 시간을 내고 싶은 선택은 구분해서 볼 수 있습니다.",
    "semanticUnits": [
      "기회",
      "시간을 내는 선택",
      "동일시 금지"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:2375c74243bbfbee1d39",
      "originalId": "frpr:material:CH01.P1:chosen-time",
      "recordSha256": "528fa9a2cddba2da7f2123fbb593dccf5520617a4b3a812a02973b32a5f5843c",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false
    },
    "owner": "pair",
    "direction": "separately_required",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:major",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:major",
    "meaningIdentity": "ker:meaning:major",
    "productKey": "major_fortune",
    "category": null,
    "originalCoreMeaning": "천간은 대운 간지의 드러난 층위를 구별하는 표지다.",
    "fixtureClaim": "대운 천간은 그 간지의 드러난 층위를 구별하는 표지로 읽으며, 천간 하나로 외부 성취를 확정하지 않습니다.",
    "semanticUnits": [
      "대운 천간 역할",
      "성취 확정 금지"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:7fc382c0b4166d31afef",
      "originalId": "mfpr:cycle:stem",
      "recordSha256": "9fc16f0c38382bee97b92646235ccb787dc46b4ed8ef0139ca2497409b004b64",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "verification": "conditional_editorial"
    },
    "owner": "person",
    "direction": "none",
    "certainty": "conditional",
    "notNewInterpretation": true
  },
  {
    "id": "ker:claim:annual",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "existingScoreContribution": false,
    "review": "editorial_research_not_customer_approved",
    "claimIdentity": "ker:claim:annual",
    "meaningIdentity": "ker:meaning:annual",
    "productKey": "annual_fortune",
    "category": null,
    "originalCoreMeaning": "선택 연도 천간의 관계 범주와 실제 실효 연주를 구분한다.",
    "fixtureClaim": "선택 연도의 천간 관계 범주와 구간에 실제 적용되는 연주는 구분해야 하며, 입춘 전후를 같은 대상으로 합치지 않습니다.",
    "semanticUnits": [
      "선택 연도 표지",
      "실효 연주",
      "입춘 대상 보존"
    ],
    "requiredContext": [
      "future approved interpretation matching this exact source meaning",
      "verified person owner and relevant context",
      "source review/conditions retained; source existence is not customer approval"
    ],
    "prohibitedInference": [
      "new personality/event/result claim",
      "stronger certainty or changed negation",
      "wrong owner/direction/time",
      "hypothetical scene as customer history"
    ],
    "source": {
      "catalog": "docs/validation/v4-korean-editorial-knowledge-01/specialized-source-catalog.json",
      "catalogKey": "source:35be5c640d2334857c0b",
      "originalId": "afpr:core:stem",
      "recordSha256": "c5da79b9a643cdec379a812d95195b7d96ef86a5c06f4931ec4e0f2d63794990",
      "sourceVersion": "39a08dcc43c467f0dba71da820d0e879dff91ec1"
    },
    "sourceState": {
      "connectedToRuntime": false,
      "approvedForCustomer": false,
      "existingScoreContribution": false,
      "verification": "conditional_editorial_not_calculated_fact"
    },
    "owner": "person",
    "direction": "none",
    "certainty": "conditional",
    "notNewInterpretation": true
  }
];
