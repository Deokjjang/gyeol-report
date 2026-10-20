# 고정 역할과 legacy 경로

|경로|확인한 계약|위험 및 인수 요구|
|---|---|---|
|reportInputTypes.ts:122–126|compatibility-fixed-ab-v1, parentChild A=부모/B=자녀|고정 슬롯의 선언이며 실제 친자·보호자·법적 권한 검증 아님|
|reportInputAdapter.ts:239–260|버전 없음은 legacy 정규화 허용, 잘못된 버전은 INVALID_COMPATIBILITY_ROLE_VERSION|정규화 성공을 V4 적용 승인으로 읽지 않음|
|compatibilityEvidence.ts:16–17,49–50|정확한 고정 버전 필수; roles는 compatibilityRoleLabels 사용|역할 없는 과거 입력에 부모/자녀를 생성하지 않음|
|compatibilityDirectionEvidence.ts:84–88,104|categoryRole.assignments A/B=null, 입력 순서로 부모 지정 안 한다는 이전 안내|V4는 실제 방향 값을 재사용하지만 legacy의 역할 미지정·문장을 그대로 복사하지 않음|
|compatibilityEvidence.ts:36–39|subject/target person ID·수신 십성·관계 ID·Pair만 direction projection|고정 role metadata와 identity attribution을 구분|
|runtimeShadow.ts|role-less V4 생성은 V4_COMPATIBILITY_GENERATION_FAILED|내부 evidence 에러 V4_COMPATIBILITY_FIXED_ROLE_INPUT_REQUIRED와 바깥 에러를 구분|

고정 역할은 나이·성별·이름에서 추론하지 않는다. person ID는 입력 정보의 attribution key이며 역할이나 실제 관계를 증명하지 않는다. 이름만 변경하면 ID가 바뀌어도 개인 해석 digest·십성은 동일하다. A/B 전체 교환은 실제 인물의 슬롯과 부모/자녀 선언까지 바꾼다. 현재 엔진은 재선언된 A를 부모로 처리하며 이것이 원래 가족과 같은 올바른 역할이라는 검증은 아니다. S는 새 연구 적용을 보류하도록 별도 표시했다. 자동 재정렬·역할 정상화는 구현하지 않았다.

Q는 legacy 정규화 성공/V4 거절, R은 정규화 단계 거절을 실제로 확인했다. 기존 Book이나 과거 입력은 새 고정 역할로 변환하지 않았다.
