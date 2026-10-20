# Coworker 실행 경로 감사

기준 d25c058a65dad3cd121ac477e194e64ee75374f2. 필수 소스 파일과 선행 inventory를 source-module-audit.json의 실제 hash로 재확인했다. runtime 코드 변경은 없다.

오프라인 실제 유료 편집 경로는 generateV4ShadowReport → 기존 normalizeReportInputPayload → 명리 계산·MBTI source → buildV4CompatibilityProduct → compatibilityNarrativeEvidence/composeCompatibilityNarrative + 각 사람의 buildRelationshipProfiles → projectRelationshipView(false) → projectCompatibilityPairView → renderCompatibilityRelease → validateCompatibilityRelease → publication projection → projectBook이다. 새 DB는 어느 경로에도 import·lookup·barrel 등록하지 않았다. 외부 writer/API 호출은 실제 생성의 externalCalls=[]로 확인한다.

## 계약과 맥락

9장·36문단·144역할의 purpose/key/titleTemplate/role 원문을 매트릭스로 추출했다. 내부 P1–P8 배정은 독자 CH 번호와 일대일이 아니다.17 signed facet,7 context,13 repair axis,7×11 scene 역할의 원문 hash를 보존했다. coworker focus는 '서로의 판단을 결과물로 이어주는 협업', occasion은 '초안을 주고받으며 마감 전 수정 범위를 정하는 회의'다. 실제 회사·직무·권한·경험을 확인하는 입력 필드가 아니다.

reportInputTypes의 compatibilityRoleLabels(coworker)는 A/B. legacy direction의 categoryRole.kind는 symmetric, assignments는 null. V4는 고정 역할 버전을 요구하되 coworker A/B는 상하관계를 생성하지 않는다. person ID는 이름·생일·출생시간 정확도·역법·시간대·성별의 attribution key이며 MBTI·slot·category를 제외한다. 전체 교환은 개인 root를 유지하며 AB/BA가 뒤집힌다. 이름만 교환하면 ID가 바뀌지만 계산된 십성은 같다. 같은 십성은 인위적으로 다르게 쓰지 않는다.

실제 cross producer는 육합·삼합·반합·충·해5종.64연구 조합 중34membership 대응/30미지원이며 실제 refs·양쪽 person ID·기둥·formation이 필요하다. 천간합·형·파·원진을 자동 검출로 사용하지 않는다. 미상 시주는 보충하지 않고 원국 내부·기간 관계를 교차 관계로 전용하지 않는다. AB viewer=B/target=A, BA viewer=A/target=B다. 십성은 조직 직급·능력·실적의 증거가 아니다.

## 업무 원천과 V4 projection

sourceRuntimeAdapter.ts:44–50의 legacy compatibilityReport는 communication/relationships/thinkingStyle/love/marriage/workplace/money/growth를 읽는다. career는 이 legacy 목록에도 없다. 원천에는 career106/workplace98/thinkingStyle84가16유형 모두 존재한다.

mbtiSemanticCore.ts:8–20는 CAREER/WORK/THINKING의 실제 domain/context를 정의한다.16유형의 실제 semantic profile을 실행해 plainKo의 현재 classification과 annotation 수를 기록했다. career93/workplace95/thinkingStyle83개 plainKo는 SCORING_SEMANTIC이지만 관계 projection node로 허용되는 수는 모두0이다. 나머지는 reference 상태다. communication56/relationships60/strengths59/risks57/growth11개는 현재 허용 domain의 scoring plainKo이지만 실제 후보 자격·개인 명리 root·sign·context·선택 조건은 별개다.

relationshipProductView.ts:41–55는 비연애에서 LOVE/MARRIAGE를 제외하고 CAREER/WORK/THINKING도 목록에 두지 않는다. 후보는 primaryEligible,invalidReasons 없음,CORE_GYEOL 제외,context social/recovery,관계 축 또는 지정 fortune을 요구한다. MBTI root 중 허용 node가 하나라도 있으면 후보 조건을 통과할 수 있으므로 전체 ancestry가 허용되었다는 뜻은 아니다. side도 exactEvidenceIds.some(...)로 허용 node 존재를 확인한다. work/scoring source가 있다는 사실은 현재 coworker 고객용 사용 승인이 아니다.

pairReleaseSources는 non-GUIDANCE/non-fortune/non-internalComplexity, 실제 meaningful non-AMPLIFIER 명리 root와 sign을 요구하고 SIGNATURE·priorityScore·weight·ID 순으로 비교한다. renderer used(sentenceKey)는 같은 문장 재사용을 방지하며 committed 수는 기록이지 하드 재사용 상한이 아니다. 부족하면 shortage가 남는다. node 선택은 허용 view.nodes를 쓰지만 Pair 축의 전체 근거 경로는 별도로 감사해야 한다.

## 재현된 기존 provenance 경계

W 입력(INTP A/ESFJ B)의 기준 archive와 변경 후에서 CHILDREN node `mbti:INTP:traits:child:socially_detached_child:plainKo`가 CH07.P1.S1–S4 provenance에 포함됨을 확인했다. 현재 raw child 문장을 직접 출력한 것은 아니다. 표시된 S2는 '현우님 쪽에서는 가까운 사이라도 혼자 결정하고 지킬 영역이 필요합니다.'다.

relationshipProductView.ts의 side 필터는 허용 exact ID가 하나라도 있으면 side 전체를 남긴다. compatibilityProductView.ts:17–20는 matched side의 모든 exactEvidenceIds를 합친다. compatibilityReleaseRenderer.ts의 comparison()과 CH07.P1(258–262)은 그 전체 목록을 slot 없는 combined comparison source로 등록한다. compatibilityReleaseValidator.ts:12는 전체 scoring sourceNodes를 allNodes로 두고 slot이 없는 비교 source에는 slot별 view.nodes 검사를 적용하지 않는다. 따라서 projection.nodes에서 CHILDREN을 뺐다는 사실만으로 comparison provenance까지 배제됐다고 주장할 수 없다.

baseline-domain-observation.json과 actual-domain-observation.json은 이 한계를 동일하게 재현한다. 새 자료 연결과 무관한 기존 경로이며 수정하지 않았다. 후속 binding에서 source별 domain·소유권·사용 맥락을 전체 ancestry에 확인해야 한다. 고객용 전문 자료 적용 승인 전 검토할 독립 이슈다.

## 점수·발행·저장

Pair view의 SHARED/FRICTION/CONTEXTUAL은 실제 signed band 비교이며 개인 raw 점수를 더하지 않는다. Pair reference와 개인 축은 분리된다. 별도의 기존 compatibilityIndex는 notablePairs 일반 항목과 기존 category weights를 사용한다. 새 existingScoreContribution:false는 신규 연구 DB가 점수에 기여하지 않는다는 뜻이다.

reader hardErrors 없음·editorial이 Minor 이내·opening/sections 존재가 release 선택 조건이다. BODY_LENGTH만으로 새 Worker 실패를 만들지 않는다. AG 등 기존 fallback은 REPEATED_LONG_PHRASE Major가 원인이며 bodyLength는 별도 진단이다. reader draft와 실제 선택된 narrative/Book을 구분했다. 고객 저장본을 재생성·덮어쓰지 않았다.
