# 후속 Evidence binding 인수 — 구현 없음

bindingProposalTypes.ts는 타입 요구뿐이다. age calculator, resolver, selector, ledger, 원고·점수 연결은 없다.

1. productKey=saju_mbti_compatibility, relationshipType=parentChild, 정확한 compatibility-fixed-ab-v1을 확인한다. A=부모/B=자녀. 역할 없는 과거 입력·다른 버전은 보류한다. 전체 슬롯 교환은 새 역할 선언이므로 실제 적합성을 별도 확인한다.
2. A/B의 실제 person ID,각 natal Evidence,입력 MBTI node,개인 Fusion source assignment, signed axis와 실제 소유자를 확인한다. parent parenting은 A,child는 B. 서로의 원천으로 빈칸을 메우지 않는다.
3. ResearchId와 기존 producer의 CalculatedEvidenceId를 분리한다. 정의·출처 hash·sourceCoverage는 실제 계산 ID나 검출된 심리 사실이 아니다.
4. 각 후보 enteredTypePredicates와 sourceUse를 확인한다. 자기 유형의 실제 원천이 없으면 보류한다. 일반 외부 안내는 개인 성격의 root가 아니다. MBTI-free27후보도 비개인화된 조건부 질문이며 unknown 개인을 새로 해석한 것이 아니다.
5. 실제 canonical relation ID·종류·양쪽 참여자·기둥·formation/exclusions·지원 상태를 확인한다. 미지원·미상 시주·원국 내부·기간 근거를 교차 검출로 대체하지 않는다.
6. 실제 direction ID와 sender/recipient 확인. AB viewer B,target A; BA viewer A,target B. 같은 십성 결과는 보존한다. 자녀의 기여는 부모에게 줄 정보이지 성인 책임을 넘기는 뜻이 아니다.
7. Pair 원천에는 parentChild pattern이 없다. generic sharedGround/friction/positiveInfluence/repairStrategy도 대칭적 의무·연애 표현·계보 미검증을 확인해야 한다. love/marriagePattern·reportLine은 부모·자녀 의미로 전용하지 않는다.
8. Fusion은 같은 사람의 실제 두 root·rule·contexts/domain이 필요하다. selected C095도 현 맥락 적용이 승인됐다는 뜻이 아니다. PARENTS/CHILDREN은 현재 비연애 scoring projection에 없으므로 별도 domain·적용 검토 전 자동 포함하지 않는다.
9. 나이·현재 상황은 검증된 출처·기준일·입력 확인이 필요하다. birthDate 자체는 발달/능력 검사가 아니다. 새 독립 나이 계산은 없다. 단계별 실제 지원·안전 조건 미확인이면 구체 적용 보류한다.
10. 미성년 보호·어른 감정 조절은 성인에게 남기고 자녀의 의견·도움 통로는 선택으로 남긴다. 성인 자녀는 독립 결정과 현재 동의·실제 지원 필요를 별도로 확인한다. 전문 판단을 일반 DB로 대체하지 않는다.
11. 같은 root를 개인/Pair/Fusion/공통축/역할 링크의 독립 근거로 중복 집계하지 않는다. knowledge의 재사용과 실제 의미의 새 도입을 구분한다.
12. CH08은 같은 역할·맥락으로 도입된 부담에서 부모가 바꿀 행동·안전·자녀 선택·재확인 기준을 잇는다. 회복을 순종·성과·즉시 용서로 측정하지 않는다.
13. CH09.P1/P2는 실제 긍정 원천과 활용 조건이 필요하다. 본 DB에서는 선행 긍정의 원천을 그대로 계승한 회수 후보로 작성했다. P3/P4는 앞서 실제 표시된 호환 의미만 사용한다. ledger에 material/personA/personB/roleVersion/sourceIds/direction/context/actuallyDisplayed가 있어야 한다. 후보 존재는 도입 이력이 아니다.
14. 위 조건·미상 원천·context 승인·안전·표시 이력 부족은 withhold_not_fill. 현재입력에 없는 경험·학교·진단·성적·가족 사실을 만들지 않는다.

타입과 인수 자료가 있다는 것은 연결 구현·고객 승인·판매 승인이 아니다. 다음 카테고리나 근거 엔진 작업은 시작하지 않는다.
