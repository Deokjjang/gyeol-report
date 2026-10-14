# Comprehensive Specialist Engine 인수 계약

상태는 OFFLINE_IMPLEMENTED다. 이 문서는 후속 작업의 입력 계약이며 Planner 구현 또는 실행이 아니다.

## 현재 호출 경계

1. 검증된 KnowledgeBinderCatalog와 ProductSpecialistFoundation을 원래 source/hash 계약으로 준비한다.
2. ComprehensiveSpecialistEngine(foundation)의 index에서 원래 질문 및 Material을 조회한다.
3. diagnose(request, optionalPreparedFoundationResult)는 종합 상품/null relationship만 받는다. 원래 GraphInput을 변경하지 않는다.
4. 실제 result는 diagnostics/receipt/meaningRelations/conflicts/duplicateFactGroups/coverage를 제공한다. 고객 ranking null, customerSelectionRun false, eligible/claim/Book 변경 0이다.
5. 합성 테스트는 createSyntheticSelectionSession이 자신의 등록 자료·Graph·승인 계약과 기존 12 Gates를 검증한 session만 사용한다. 실제 result는 selectSynthetic에 전달할 수 없다.

## 안정적으로 넘기는 정보

- candidateIndex의 exact originalResearchId, CatalogKey, source locator/hash, 원본 Material 전체.
- 원래 260 Question ID/address, link kind, 13/52/208 role 및 요구조건.
- Binder의 원래 12 gate receipt, 모든 독립 차단 사유, selected node, canonical root, ancestry, owner, producer, sourceCoverage, Fusion 원래 rule/split.
- meaning identity 검토 상태와 independentInformation tri-state. 같은 root를 의미 검증으로 해석하지 않는다.
- 후보 간 conflict의 VERIFIED/REVIEW_REQUIRED 및 이유. actual edge는 고객 선택 허용 판정이 아니다.
- root/facet 예산의 원래 단위 및 bridge 미검증 상태.
- recall은 실제 표시된 동일 owner/type/root/meaning/claim/context의 ledger가 있어야 한다. 계획을 이력으로 쓰지 않는다.
- unentered facts는 명시적인 unknown이다. 조건부 장면은 실제 경험으로 바꾸지 않는다.

## 후속 작업 전에 해결할 항목

1. 원본 의미·조건·반례·domain·source ancestry를 운영자가 검토하고 승인 계약을 마련해야 한다. 현재 실제 승인 0.
2. 원래 요구조건을 약화하지 않은 typed condition/group/producer 계약이 필요하다. 미노출 producer나 Fusion rule을 창작하지 않는다.
3. Reader CH와 기존 scheduler C 사이의 실제 의미 대응 검증이 필요하다. 번호 치환 금지.
4. Canonical Fact Root와 Release atom, 연구 subfacet과 기존 Release facet 사이의 identity/budget bridge가 필요하다. 새로운 subfacet별 독립 예산 금지.
5. 고객 display ledger는 실제 렌더링/발행 provenance가 필요하며 이 엔진은 발급하지 않는다.
6. 모든 승인이 충족된 뒤 별도 지시가 있어야 실제 52문단 allocation/Writer 연결을 검토할 수 있다.

합성에서 root budget과 전역 예약이 동작했다는 사실은 실제 연구의 승인·의미 검토·문단 완성 증거가 아니다. 현재 Book·Runtime·기존 계산·연구 원문과 기존 17 Book/102 digest는 불변이다.
