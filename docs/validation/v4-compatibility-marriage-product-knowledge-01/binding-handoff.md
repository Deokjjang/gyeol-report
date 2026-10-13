# 후속 근거 연결 인수 — 구현 없음

신규 bindingProposalTypes.ts는 정형 요구만 정의한다. resolver, selector, allocation, ledger, root 계산, 점수, 출력 연결은 없다. 기존 runtime import·barrel·lookup에 등록하지 않았다.

- productKey=saju_mbti_compatibility 및 relationshipType=marriage를 확인한다. internal married 값을 사실로 승격하지 않는다.
- A/B 각각의 실제 person ID, natal evidence ID, 입력 MBTI node, signed axis root, 개인 Fusion rule/source assignment를 확인한다. A 자료를 B에게 넘기지 않는다.
- research source ID/hash는 지식 출처다. CalculatedEvidenceId는 기존 producer 발급 ID이고 ResearchId와 타입을 분리한다. 연구 ID나 raw 정의를 실제 관계 ID로 대체하지 않는다.
- ownedSources/sourceUse와 enteredTypePredicates는 모두 필요한 조건이다. 같은 owner/type의 여러 trait도 sourceKey별로 유지한다. 외부 문맥 안내는 개인 특성을 증명하는 root가 아니다.
- recipient 방향을 확인한다. A→B viewer B / target A, B→A viewer A / target B. 실제 방향 ID·참여자·십성 확인 없이 정의를 적용하지 않는다. 동일한 십성을 임의 차별화하지 않는다.
- canonical relation은 지원 kind·실제 refs·기둥·조건·producer ID를 대조한다. 원국 내부·기간 관계와 양쪽 교차 관계를 섞지 않는다. 미지원 표는 보류한다.
- Pair는 실제 forward/reverse pointer·hash·sourceCoverage와 marriagePattern을 확인한다. 기존 원천의 direct는 저장소 상태이며 결혼 예측의 실증 증거가 아니다. 원천의 미확인 혼인 서술도 그대로 고객에게 전용하지 않는다.
- Fusion은 같은 사람의 명리+MBTI 두 root, 기존 rule, contexts, domain, source assignment를 만족해야 한다. money trait나 STRUCTURE_STYLE/RESOURCE_SENSE 같은 자료가 있다고 현재 relationship projection에 자동 투입하지 않는다. 새 자료가 기존 엔진을 넓히지 않는다.
- 실제 혼인·동거·경제·가사·친족 상황은 UNKNOWN이다. 모든 장면은 hypothetical_only. 실제값을 입력받을 수 없는 현재 schema에 강제로 필드를 넣지 않는다.
- 같은 root를 개인·Pair·Fusion·공통 축의 독립 사실로 재집계하지 않는다. source reuse와 의미 reuse도 구분한다.
- CH08은 같은 사람·타입 조건의 선행 부담을 바꿀 행동과 권한으로 연결한다. 준비·확인·예외·다음 기억까지 포함하고 실제 시간·권한은 두 사람이 정한다.
- CH09는 모두 회수 후보다. 실제 표시 ledger에 material/personA/personB/sourceIds/direction/premise가 있어야 하며 모든 precedingMeaningRefs의 호환성을 확인한다. 자료가 존재한다는 사실만으로 도입됐다고 간주하지 않는다.
- 미상 MBTI, 시주, domain/context 미승인, 원천 미검증, ledger 부족, 실제 동의 부족은 withhold_not_fill로 남긴다.

인수 준비 완료는 연결 구현·고객 사용 승인·판매 품질 승인을 뜻하지 않는다. 사용자 지시 없이 다음 관계 카테고리나 근거 엔진 작업을 시작하지 않는다.
