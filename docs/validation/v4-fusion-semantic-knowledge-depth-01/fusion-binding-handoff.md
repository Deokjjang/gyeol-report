# Fusion 후속 연결 요구 — 이번에는 미구현

기존 [Evidence 연결 초안](../v4-semantic-axis-knowledge-expansion-01/evidence-binding-blueprint.md)을 보존하고 Fusion 자료에 필요한 조건을 구체화했다. `fusionBindingProposalTypes.ts`는 제안 타입이며 실행 함수·producer·API·새 가중치를 제공하지 않는다. 신규 후보는 현재 엔진이 허용하는 규칙이 아니다.

## 출처에서 문장까지의 계약

| 단계 | 요구 입력과 출력 | 허용 조건 | 실패·중복·금지 |
|---|---|---|---|
| 원천 | 실제 원문·file/pointer/locator·버전·hash → 출처 참조 | 실제 기록과 검토 상태 보존 | direct/inferred를 실증·개인 적합으로 승격하지 않음 |
| 기존 계산 | 실제 개인 입력·기존 producer/version → 기존 명리 결과 | 지원되는 scope·성립·불확실성 확인 | 연구 정의·MBTI 이름으로 명리 사실 생성 금지 |
| Evidence | 기존 계산 → 기존 Evidence ID·owner·lineage·canonicalFactKey | 실제 producer만 발급; `fkr:`/`sar:`와 별도 타입 | 연구 ID 변환·alias 중복·한 사실 여러 facet 독립 집계 금지 |
| MBTI 원천 | 실제 유형 입력·primary trait node·pointer/hash → 본인 소유 원천 참조 | 원천·본인 적합성·맥락 별도 확인 | pair/bridge hint/reference-only/prior만으로 구체 행동 확정 금지 |
| 의미 조건 | 두 원천+실제 과제·적용 조건 → 검토/보류 | 같은 대상·유효 방향·반례·scope 확인 | facet의 세부 행동을 축 점수만으로 확정 금지 |
| Fusion 검토 | 개인별 명리와 MBTI 후보 → 별도 조건부 비교 | 일치/긴장/보완의 실제 계약, 양쪽 역할·독립성·원천 유지 | legacy 이름을 semantic 종류로 자동 동치화 금지; 현재 미등록 후보를 등록 규칙으로 사용 금지 |
| 상품·관계 | 적용 조건 → 분야·역할 질문의 검토안 | 상품과 관계별 서로 다른 질문·추가 입력 확인 | work/money를 love로 이동 금지; 상대 마음·동의 추정 금지 |
| 기간 | 실제 기간 Evidence·[start,end)·참여 origin → 기간 참고안 | 원국·대운·세운·월운·전환 전후·교집합 보존 | MBTI로 기간 계산·사건 예측 금지; natal을 기간 변화로 재명명 금지 |
| 배정·표현 | 승인된 검토안 → 후속 문단·한국어 표현 검토 | 같은 사실·의미·조건의 사용 장부와 사실 대조 | Fusion을 추가된 제3의 독립 사실로 세지 않음; 가상 장면을 과거 사실로 바꾸지 않음 |

## 각 자료가 요구하는 실제 입력

44규칙은 원래 feature 대안·trait·tag·Domain·selection contract를 보존한다. 해당 규칙이 실제 선택됐다는 사실만으로 새 facet 행동까지 관찰된 것이 아니다. `source-ref-catalog.json`의 명리 연구 참조는 정의·조건의 출처이며 고객의 계산 Evidence가 아니다.

96규칙은 축A/축B·요구 방향·Context와 두 가지 source assignment를 보존한다. 현재 연구의 축A 역할을 항상 명리로, 축B를 항상 MBTI로 강제하지 않는다. 반대 배정도 실제 명리 근거와 primary MBTI node를 각각 확인해야 한다. 아직 구체 원천이 바인딩되지 않은 기록은 정상적인 연구 상태다.

신규24후보는 실제 trait ID·원문 pointer·sourceCoverage·원천 파일 hash와 명리 연구 참조가 있다. 이것은 입력 개인에게 성립한 계산·행동이 아니다. 성립·원천 적합·과제·본인 진술이 부족하면 보류한다. 18개 facet 기여와 6개 기존 의미의 과제 조건 확장을 구분하며 새 심리 사실 수로 집계하지 않는다.

109facet 모두를 비교에 사용한다. 104개는 선택된 Fusion 쌍에서, 나머지5개는 검토 창·방법 재량·유지 가치·도움 요청·유지 노동의 별도 조건 연구로 다룬다. 해당5자료는 신규 runtime Fusion 규칙이 아니다. 36축과109facet은 기존 ID·의미·조건을 유지한다.

## 독립성

- 명리 사실 하나의 설명·태그·축·facet·파생 구조 문장을 여러 번 쓰더라도 원천이 독립적으로 증가하지 않는다.
- 하나의 MBTI trait plainKo·positiveUse·risk·요약·신규512연구에서의 재인용은 같은 원천의 여러 사용이다.
- 유형 prior는 별도 보조 장부이며 실제 개인 행동을 만들 수 없다.
- 명리 사실+MBTI trait+Fusion wrapper를 독립3근거로 계산하지 않는다. 서로 다른 체계의 일치도 경험적 타당성을 자동 높이지 않는다.
- 관계의 양측 근거와 개인 한 명의 Fusion을 섞지 않는다. 관계 producer의 실제 참여자·방향·역할 조건이 추가로 필요하다.

## A/B와 시점

개인 A Fusion은 A의 명리와 A의 MBTI만, B는 B의 자료만 사용한다. 비교 단계에는 A→B/B→A와 실제 canonical 관계 enum이 필요하다. 부모·자녀와 상사·팀원은 역할·권력·발달 단계가 비대칭이므로 이름 반전으로 반대 방향을 만들지 않는다.

기존 `interpretFusion`의 subject 검사는 명리 observation의 소유자를 확인한다. MBTI 입력은 유형 문자열이므로 그 함수 단독으로 문자열의 소유자까지 검증하지 않는다. 기존 궁합 호출자가 각 slot의 입력을 전달하는 계약을 유지해야 한다. 이번에는 이 API나 인증·입력 계약을 변경하지 않았다. 후속 연결 시스템은 owner envelope를 별도로 검증해야 한다.

대운·세운·월운의 실제 계산은 그대로 둔다. 전환 전·후 구간의 source와 참여 기둥을 구분하고 교집합 밖으로 근거를 확장하지 않는다. 상세 구간을 지원하지 않는 자료는 연도 전체 의미로 재작성하지 말고 보류한다. 짧은/긴 행동 선호는 대운/세운 계산이 아니다.

## Context·관계·상품

`fusionApplicabilityResearch.ts`는 각 Fusion 고유 질문과 기존 축별6상품·7관계 질문의 교집합을 가리킨다. 이는 2,132개 새 전문 해석이 아니다. 실제 업무·돈 원천만 있는 자료의 연애 이전은 `not_transferable`, 기간 상품은 `temporal_evidence_required`로 둔다.

`parent_child/coworkers/manager_team/business/friends`와 실제 `parentChild/coworker/managerReport/businessPartner/friendship`은 이름 대응만으로 실제 역할이 검증되지 않는다. 후속 adapter와 역할 검증이 필요하다. 현재 enum·lookup·생성기는 바꾸지 않는다.

## 검증 전 사용 중단 조건

SOURCE_UNVERIFIED, MISSING_PREREQUISITE, COUNTEREXAMPLE, UNSUPPORTED_PRODUCER, OWNER_MISMATCH, DIRECTION_SWAP, TIME_SCOPE_MISMATCH, OUTSIDE_INTERVAL, REFERENCE_OR_PRIOR_ONLY, DUPLICATE_UNDERLYING_FACT, UNAPPROVED_RESEARCH, BOOK_VERSION_MISMATCH를 별도 거절 사유로 유지한다. 이 목록은 이번에 실행되는 validator가 아니다.

기존 Book은 기존 snapshot과 버전으로 열람한다. 연구 추가로 재생성·수정·업데이트하지 않는다. 신규 발행 연결에는 별도 승인과 계산·원고·Book digest 비교, 실제 독해 검수가 필요하다.
