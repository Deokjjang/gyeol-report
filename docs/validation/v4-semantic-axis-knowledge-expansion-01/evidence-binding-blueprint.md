# 후속 Evidence 연결 계약 초안 — 미구현

이 문서는 승인된 연결 엔진이 아니다. `evidenceBindingResearchTypes.ts`는 제안 타입만 제공한다. 실제 계산·점수·원고 선택·Book API에서 import하거나 실행하지 않는다.

출처와 적용의 각 단계를 분리한다. [SKOS의 mapping 구분](https://www.w3.org/TR/skos-reference/#mapping)은 관련됨과 높은 동등성을 구별하는 참고이며, 이 프로젝트를 RDF로 바꾸는 제안이 아니다. [PROV-O의 derivation](https://www.w3.org/TR/prov-o/#wasDerivedFrom)은 자료와 파생 활동을 구별하는 참고다. 출처 추적은 진실성이나 예측 효력의 증명이 아니다.

## 공통 envelope

모든 단계에 다음 정보가 필요하다.

- 원본 ID와 원천 버전·digest, 기존 producer와 버전. `sar:*` 연구 ID와 실제 계산 Evidence ID는 서로 다른 타입이다. 이름을 바꾸어 변환하지 않는다.
- 출처 수록 여부(`directSourceCoverage`)와 실증 검증 여부(`empiricalValidation`)를 별도로 보존한다. 기존 source direct는 로컬 원문 존재를 뜻하며 실증 검증이 아니다.
- 소유자 person/personA/personB, 상대, A→B/B→A, 실제 관계 enum. 개인과 페어 조건은 서로 다른 scope다.
- 참여 천간·지지·기둥·소유자·원국/대운/세운/월운 출처. 명칭이 같아도 참여 요소를 합치지 않는다.
- 원국은 출생 기록 digest, 기간은 `[startInclusiveIso,endExclusiveIso)`·Asia/Seoul·기존 계산 버전·전환 Evidence 참조. 원국 자료에 기간을 새로 만들어 붙이지 않는다.
- 전제 조건별 satisfied/missing/contradictory, 검토 상태, 실패 사유. missing은 false도 true도 아니다.
- canonicalFactKey와 독립 사실 목록. 같은 사실의 문장 변형·facet 분해·여러 연구 재인용은 독립 근거 수를 늘리지 않는다.

## 단계별 계약

| 단계 | 입력 → 출력 | ID·버전 | 허용 조건 | 실패·금지 조건 | 중복 방지 |
|---|---|---|---|---|---|
| 1. 원천 | 원문/전통 자료/원천 JSON → 원문 참조 | file+pointer/locator, source ID, 버전, digest | 실제 확인된 원문과 정확한 주장 범위; 전통·현대 응용 분리 | UNVERIFIED_SOURCE; 출처 이름만 있고 위치 없음; 권위로 현대 능력 확정 | 원문 동일 위치·버전 묶음 |
| 2. 계산 | 기존 입력+기존 계산 → 기존 결과 | 계산 버전, 입력 digest, producer ID | 지원되는 기존 producer; 시주·유형 미상 그대로 | UNSUPPORTED_PRODUCER; 연구에서 계산 생성; 미상 보충 | 입력+계산 버전+정규 사실 |
| 3. Evidence | 기존 결과 → 기존 Evidence envelope | 실제 Evidence ID, 원천 ID, producer 버전 | 참여자·owner·기간·성립 상태·기존 근거 추적 가능 | MISSING_OWNER/DIRECTION_MISMATCH/TIME_SCOPE_MISMATCH; 연구 ID를 Evidence ID로 변환 | canonicalFactKey+owner+scope+방향+기간 |
| 4. 조건 | Evidence+실제 맥락 → 전제 판정 목록 | condition ID, 검토 버전, Evidence refs | 필수 조건 모두 확인; 반례·불확실성 확인 | MISSING_CONDITION/COUNTEREXAMPLE; 합→합화, 출현→강함 자동 승인 | 같은 전제의 여러 표현은 한 판정 |
| 5. 의미 후보 | 확인 조건+연구 참조 → 보류/조건부 후보 | sar axis/facet ID, 연구 버전, 실제 Evidence refs | 기존 축 정의·방향·신호 상태 보존; facet 의미가 실제 근거보다 구체적이지 않음 | UNAPPROVED_RESEARCH/ABSENCE_IS_NOT_OPPOSITE/REFERENCE_ONLY; 낮은 CARE→무배려 | 하나의 근거를 여러 facet로 나눠도 독립 사실은 하나 |
| 6. Fusion 검토 | 명리/MBTI 각각의 후보 → 별도 Fusion 검토안 | 기존 Fusion 버전, 양측 원천·Evidence refs | 양쪽 독립 출처, 같은 owner·맥락·기간, 승인된 기존 규칙과 조건 | 미상 MBTI 추정, reference-only 개인 점수화, 의미 비슷함만으로 reinforce 생성 | 원천 사실 쌍+scope+direction; 원천과 Fusion을 독립 3근거로 세지 않음 |
| 7. 상품 활용 | 조건부 후보+실제 입력 → 상품 적용 검토 | product/version/domain, applicability ID | 6상품 각각 gate 확인; 궁합은 7유형·양방향·역할 확인 | 일반 social을 결혼·양육·사업 권한으로 자동 이전; 운세 기간을 성격으로 이전 | 동일 사실의 상품 내 역할 목록 보존 |
| 8. 문단 배정 | 적용 후보 → 챕터·블록 배정안 | section/block ID, 버전, 원천 refs | 새로운 대상·조건·정보가 있어야 재사용; 기존 편집 계약 보존 | DUPLICATE_FACT; 같은 조언을 문장만 바꾸어 새 정보로 처리 | 사실+의미+조건+owner+구간별 배정 장부 |
| 9. 한국어 표현 | 검증 배정 → 별도 언어 검토안 | 표현 버전, 근거·조건 refs, 문장 digest | 조사·이름·단정·시점 검토; 가상 예시는 가능성/조건형 | 고객이 겪었다고 꾸민 사건, 건강·성공·재물·혼인 확정, 원문 사실 손실 | 표현 변형은 새 근거가 아님; 문장과 근거 대조 |

## 기간과 방향의 검증 예

1. 원국 일지와 세운 지지의 충을 대운·세운 충으로 재명명하면 TIME_SCOPE_MISMATCH다. 참여자의 origin과 pillar를 비교해야 한다.
2. 전환 연도에는 기존 계산의 전환 전·후 구간을 각각 보존한다. 한쪽 구간의 관계를 연도 전체에 확대하지 않는다. 상세 분할 미지원이면 적용을 보류한다.
3. A의 CARE 관련 개인 후보는 B의 의도나 A→B 상호작용을 입증하지 않는다. 양측의 실제 조건과 방향을 따로 확인해야 한다.
4. 실제 연구의 pair category 이름과 canonical enum은 별도 대응 검토가 필요하다. `parent_child→parentChild`, `coworkers→coworker`, `manager_team→managerReport`, `business→businessPartner`, `friends→friendship`은 문자열 대응 후보이며 역할의 일치까지 입증하지 않는다.
5. 현침의 전통 자형 설명과 PRECISION 응용의 관련성은 계산 Evidence가 아니라 연구 질문이다. 원문 존재만으로 현대 능력을 승인하지 않는다.
6. CARE 약신호·빈 annotation·상쇄된 0은 실제 반대 행동과 다르다. 반대 행동은 독립 관찰 근거가 필요하다.
7. 합과 충이 공존하면 어느 참여자·어느 구간의 관계인지 모두 남긴다. 하나를 없애거나 상쇄 계산을 새로 만들지 않는다.

## Book·버전 보호

기존 저장 Book은 기존 snapshot과 digest로 열람한다. 신규 연구 버전은 과거 Book의 재생성·업데이트 원인이 될 수 없다. 신규 발행에 연결하려면 별도 승인과 원고·근거·구조 digest 비교가 필요하다. owner/shared reader는 검증 완료된 기존 저장 경로를 유지한다. BOOK_VERSION_MISMATCH이면 신규 자료를 기존 Book에 적용하지 않는다.

## 후속 승인 전 필수 검증

- 연구 자체의 출처 상태, 의미적 관련성과 실제 개인 적용의 차이 검토.
- nominal Evidence ID를 실제 기존 producer에서만 발급하는 경계. 제안 타입을 형 변환으로 우회하지 않도록 별도 설계.
- 미지원 producer·미상 입력·전제 누락·반례·교차 소유자·반대 방향·구간 불일치 거절 사례.
- 같은 사실의 축·facet·Fusion·문장 표현을 독립 근거로 과대 계산하지 않는 사례.
- 기존 6상품 구조·계산·Evidence·원고·Book·snapshot digest와 재열람 회귀.
- 실제 독해 검수와 별도 연결 승인. 이번 작업은 어느 항목도 자동 승인하지 않는다.
