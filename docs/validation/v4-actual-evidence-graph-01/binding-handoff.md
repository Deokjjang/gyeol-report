# Actual Evidence Graph → Knowledge Binder 인수 조건

현재 Graph는 오프라인 synthetic 검증 전용이다. 고객 해석 후보·claim·문단을 만들지 않는다. `customerApproval=0`, `researchRuntimeConnection=0`, `specialistClaimsEmitted=0`, `bookChanges=0`을 유지한다.

## 입력과 정체성

후속 소비자는 실제 producer 결과, 명시적 평가 시각, 신뢰할 수 있는 owner namespace, 정확한 선행 검증 version을 제공해야 한다. 공개 산출물의 ordinal alias를 고객 원래 personId 또는 인증 토큰으로 사용하지 않는다. 원래 producer ID는 메모리 안의 Graph에 보존된다. 개인정보가 포함된 ID는 정적 fixture 산출물에서 별칭이며, 새 실제 Evidence ID를 발급한 것이 아니다.

`Graph.validation.ok`는 데이터 정합성 검사다. 전체 또는 특정 의미의 고객 사용 승인이 아니다. INVALID Graph는 소비하지 않는다. PARTIAL Graph에서는 각 노드와 모든 필수 부모의 상태를 따로 검사한다.

## 필수 Gate

1. 원래 producer의 존재·지원 범위·version·실제 ID 또는 검증 가능한 observation pointer를 확인한다. 연구 ID·정의·문헌·Source hash를 계산 사실로 바꾸지 않는다.
2. owner와 실제 참가자의 자리·문자를 검증한다. A의 원천을 B에게 옮기거나 두 실제 사람을 하나의 owner namespace로 합치지 않는다.
3. 방향별 subject/recipient/relationId와 수신자 일간 기준 십성을 보존한다. 역할 표시와 실제 권한을 구분하고, 부모/자녀·상사/팀원의 실제 입력 조건을 별도로 확인한다.
4. 모든 필수 ancestry와 source locator/hash/receipt를 확인한다. RELATED_TO, 미래 요구, 문헌 참조, static 연구 관련성은 실제 계산 부모가 아니다. 빠진 부모를 생성하지 않는다.
5. 실제 모든 조상의 domain에 기존 정책을 적용한다. 허용된 부모 일부가 금지된 부모를 대신하지 않는다. Graph의 `HAS_BLOCKING_POLICY`와 `DISALLOWED_ANCESTOR_DOMAIN`을 우회하지 않는다.
6. SOURCE_ATTRIBUTION은 원천 귀속, SELF_REPORTED_INPUT은 입력 사실, PRODUCER_OBSERVATION은 계산 생산자 관찰이다. MBTI direct/inferred, 차원 prior, 원천 설명을 실제 행동 관찰로 승격하지 않는다.
7. Axis/annotation/contribution/Fusion은 원래 근거의 파생이다. 별도의 독립 root로 다시 더하지 않는다. Root 합계와 Graph Node 수를 혼동하지 않는다.
8. Fusion은 필요한 명리/MBTI 원천, 같은 owner, 원래 context·축·방향·rule을 모두 확인한다. 한쪽 누락·foreign owner·source-only reference는 보류한다. 별도 ruleId가 없는 일반 Fusion은 UNKNOWN 표기를 유지하고, 기존 producer/type/axis에 대응하는 검증된 알고리즘 규칙 주소나 명시적 rule ID를 추가 확인한다. 다른 Fusion 체계를 하나로 합치지 않는다.
9. 실제 기간과 확정성을 보존한다. 종료 경계는 exclusive다. 원국·대운·세운·월운의 명목 slot을 실효 기간으로 승격하지 않는다. exact/range, 첫 대운 이전, 불확실 교운 후보를 구분한다.
10. 함께 사용하는 기간은 실제 지원 producer 조합 안에서 교집합을 확인한다. NO_TIME_INTERSECTION·UNKNOWN_INTERVAL·UNSUPPORTED_COMPOSITE를 무시하지 않는다. 여러 pair 관계를 독립 3/4층 성립 근거로 더하지 않는다.
11. sourceGroups는 원래 AND 및 조건부 대체 그룹을 보존한다. 모든 필수 source와 owner/type predicates, 실제 표시된 호환 그룹을 확인한다. 그룹 간 임의 합집합을 만들지 않는다.
12. 원래 의미·반례·상품 전문 질문·관계별 정책, 실제 입력 맥락, 인간 운영자 및 고객 사용 승인을 별도로 확인한다. Graph의 기술적 PASS가 이 Gate들을 대신하지 않는다.

## 보류와 보호

불완전한 ID·owner·참가자·방향·원천·기간·producer는 정확한 사유로 보류한다. 유효한 다른 계산 결과를 삭제하지 않는다. 새 계약/지분/매출/부채/대표권, 실제 친밀도/갈등/연락 이력, 경험이나 사건을 만들지 않는다.

현재 개인 Facet 관찰과 완전한 Personal Resonance 출력, 일부 대운 endpoint 및 legacy/편집 proof 계보는 노출되지 않거나 충분히 연결되지 않는다. 별도의 producer 출력 개선이 필요할 수 있지만 이번 작업에서는 해당 계산기·원고·발행 경로를 수정하지 않았다.

이 문서는 Binding 구현을 시작했다는 뜻이 아니다. 신규 Knowledge Binder·EligibleInterpretationCandidate·전문 문단 배정·표현 DB 연결·런타임 연결은 다음 별도 승인 범위다.
